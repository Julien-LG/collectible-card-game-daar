// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Card.sol";
import "./GameCollection.sol";

contract CardOwnership is Ownable {
    mapping(uint => GameCollection) public cardCollections;
    uint public collectionCount;
    // mapping (uint => address) cardsApprovals;

    uint cardNumberProvisoir = 0;

    constructor() Ownable(msg.sender) {
        GameCollection gameCollections = new GameCollection("Wizard", 0);
		cardCollections[collectionCount] = gameCollections;
        collectionCount++;
		cardCollections[0].addCard(cardNumberProvisoir++, "https://images.pokemontcg.io/xy1/1.png", msg.sender);
    }
    
    // Donne le nombre de cartes d'un utilisateur
    function balanceOf(address owner) public view returns (uint) {
        uint nb = 0;
        for (uint i = 0; i < collectionCount; i++) {
            nb += cardCollections[i].balanceOf(owner);
        }
        return nb;
    }

    // Donne le propriétaire d'une carte
    function ownerOf(uint tokenId) public view returns (address) {
        for (uint256 i = 0; i < collectionCount; i++) {
            address owner = cardCollections[i].ownerOf(tokenId);
            if (owner != address(0))
                return owner;
        }
        return address(0);
    }

    function getCollectionNbForCard(uint tokenId) public view returns (int) {
        for (int i = 0; i < int(collectionCount); i++) {
            if (cardCollections[uint(i)].isCardInCollection(tokenId)) {
                return i;
            }
        }
        return -1;
    }

    // Récupère des cartes
    function mintSomeCards(address to, uint quantity, uint collectionNumber) public {
        require(collectionNumber < collectionCount, "CardOwnership: collection does not exist");

        cardCollections[collectionNumber].mintSomeCards(to, quantity);
    }

    // Récupère une carte
    function mint(address to, uint tokenId, uint collectionNumber) public {
        require(collectionNumber < collectionCount, "CardOwnership: collection does not exist");

        cardCollections[collectionNumber].mint(to, tokenId);
    }

    function addACard(address userAdr) external {
		cardCollections[0].addCard(cardNumberProvisoir++, "https://images.pokemontcg.io/xy1/1.png", userAdr);
	}

    function getCardImage(uint idCard) external view returns (string memory) {
        // return "https://images.pokemontcg.io/xy1/1.png";
        return cardCollections[0].getCard(1).getImgLink();
    }

    function ownerNbCard() external view returns (uint16) {
        // cardCollections[0].addCard(126, "https://images.pokemontcg.io/xy1/1.png");
        // return uint16(cardCollections[0].getCardCount());
        return uint16(balanceOf(address(msg.sender))); // ça ça marche
    }

    function giveMeThisCard(address userAdr) external {
        // cardCollections[0].getCard(0).transferOwnership(userAdr);
        cardCollections[0].transferCard(0, userAdr);
    }

    function totalBalance() public view returns (uint32) {
        uint32 nb = 0;
        for (uint i = 0; i < collectionCount; i++) {
            nb += cardCollections[i].totalBalance();
        }
        return nb;
    }
}