// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Boosters is Ownable, ERC721 {

    struct Booster {
        uint id;
        string imgLink;
        uint price;
        uint collectionId;
        uint[] cardsId;
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

    function mint(address to, uint collectionId, uint[] memory cardsId) public {
        uint newTokenId;
        if (vacantPositionsCount > 0) {
            newTokenId = vacantPositions[vacantPositionsCount];
            vacantPositionsCount--;
        }
        else {
            newTokenId = positionBoosterList;
            positionBoosterList++;
        }
        boostersOwners[newTokenId] = to;
        boosters[newTokenId] = Booster(newTokenId, "https://i.seadn.io/gae/qw_fizCKFFTBRQtCsWFcTbdE1-lKZ81z-tLfQ1BDCtmx0MYZ_by6JZFeQ3dt2wSrDupJ7iBgcJ7tW7VMuwYmzDgfkjeqpm6NeCGAZg?auto=format&dpr=1&w=3840", 0, collectionId, cardsId);
        boosterFreeCount++;
    }

    function burn(uint tokenId) public {
        // _burn(tokenId);
        boostersOwners[tokenId] = address(0);
        boosters[tokenId] = Booster(0, "", 0, 0, new uint[](0));
        vacantPositions[vacantPositionsCount] = tokenId;
        vacantPositionsCount++;
    }

    function getBooster(uint collectionId) public view returns (uint tokenId) {
        require(boosterFreeCount > 0, "Il n'y a pas de booster de disponible");

        for (uint i = 0; i < positionBoosterList; i++) {
            if (boosters[i].id !=0 && boosters[i].collectionId == collectionId) {
                return i;
            }
        }
        return 0; // TODO : a modifier quand on gerera plusieurs collections
    }

    function buyBooster(address to, uint tokenId) public {
        // require(msg.value == boosters[tokenId].price, "Le montant envoyé n'est pas suffisant");
        // payable(owner()).transfer(msg.value);
        // _transfer(owner(), to, tokenId);
        boostersOwners[tokenId] = to;
        boosterFreeCount--;
    }

    function openBooster(address user, uint collectionId) external returns (uint[] memory) {
        // uint[] memory table = new uint[](10);
        // for (uint i = 0; i < 10; i++) {
        //     table[i] = 1;
        // }
        
    }
}