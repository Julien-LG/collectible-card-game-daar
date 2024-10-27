// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract Boosters is Ownable, ERC721 {

    struct Booster {
        uint id;
        string imgLink;
        uint price;
        uint collectionId;
        string[] cardsId;
    }

    mapping(uint => Booster) public boosters;
    uint public positionBoosterList; // la position la plus loin dans la liste de boosters
    uint public boosterFreeCount; // le total de boosters disponibles
    mapping(uint => address) public boostersOwners; // les propriétaires des boosters

    mapping(uint => uint) public vacantPositions; // les positions vacantes dans la liste de boosters
    uint public vacantPositionsCount; // le total de positions vacantes

    constructor(string memory _name) ERC721(_name, "BOOSTER") Ownable(msg.sender) {
        boosterFreeCount = 0;
        vacantPositionsCount = 0;
    }

    function mint(address to, uint collectionId, string[] memory cardsId) public {
        uint newTokenId;
        uint price = 200;
        if (vacantPositionsCount > 0) {
            newTokenId = vacantPositions[vacantPositionsCount];
            vacantPositionsCount--;
        }
        else {
            newTokenId = positionBoosterList;
            positionBoosterList++;
        }
        boostersOwners[newTokenId] = to;
        boosters[newTokenId] = Booster(newTokenId, "https://i.seadn.io/gae/qw_fizCKFFTBRQtCsWFcTbdE1-lKZ81z-tLfQ1BDCtmx0MYZ_by6JZFeQ3dt2wSrDupJ7iBgcJ7tW7VMuwYmzDgfkjeqpm6NeCGAZg?auto=format&dpr=1&w=3840", price, collectionId, cardsId);
        boosterFreeCount++;
    }

    function burn(uint tokenId) public {
        // _burn(tokenId);
        boostersOwners[tokenId] = address(0);
        boosters[tokenId] = Booster(0, "", 0, 0, new string[](0));
        vacantPositions[vacantPositionsCount] = tokenId;
        vacantPositionsCount++;
    }

    function burns() public {
        for (uint i = 0; i < positionBoosterList; i++) {
            if (boostersOwners[i] == address(0)) {
                burn(i);
            }
        }
    }

    function getUserBoosterCount(address user, uint collectionId) public view returns (uint32) {
        uint32 count = 0;
        for (uint i = 0; i < positionBoosterList; i++) {
            if (boostersOwners[i] == user && boosters[i].collectionId == collectionId) {
                count++;
            }
        }
        return count;
    }

    function getBooster(address user, uint collectionId) public view returns (uint tokenId) {
        require(getUserBoosterCount(user, collectionId) > 0, "Il n'y a pas de booster de disponible");

        for (uint i = 0; i < positionBoosterList; i++) {
            if (boostersOwners[i] == user && boosters[i].collectionId == collectionId) {
                return i;
            }
        }
        return 0; // TODO : a modifier quand on gerera plusieurs collections
    }

    function buyBooster(address payable admin, address to, uint collectionId) public  payable { // TODO : payable
        // require(msg.value == boosters[tokenId].price, "Le montant envoyé n'est pas suffisant");
        // payable(owner()).transfer(msg.value);
        // _transfer(owner(), to, tokenId);

        console.log("buyBooster with total booster :",boosterFreeCount);
        require(boosterFreeCount > 0, "Il n'y a pas de booster de disponible");
        uint idBooster = getBooster(admin, collectionId);
        
        console.log("idBooster : ", idBooster);
        // require(msg.value == boosters[idBooster].price, "Le montant envoye n'est pas suffisant");
        
        admin.transfer(msg.value ); // transfere l'argent au proprietaire du contrat //(msg.value * 10^18)
        boostersOwners[idBooster] = to;
        boosterFreeCount--;
    }

    function openBooster(address user, uint collectionId) external returns (string[] memory) {
        // uint[] memory table = new uint[](10);
        // for (uint i = 0; i < 10; i++) {
        //     table[i] = 1;
        // }
        
        // require(getUserBoosterCount(user, collectionId) > 0, "Vous n'avez pas de booster de cette collection");
        Booster memory b = boosters[getBooster(user, collectionId)];
        boostersOwners[b.id] = address(0);
        return b.cardsId;
    }
}