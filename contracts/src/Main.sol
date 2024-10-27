// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./GameCollection.sol";
import "./StructCard.sol";
import "./Boosters.sol";

contract Main is Ownable {
	address internal administrateur;

	mapping(uint => GameCollection) public collections;
    uint public collectionCount;
	uint NFTcount = 0;

	mapping(uint => address) public owners; // les propriétaires des cartes
	// NFTid => adress proprio

	Boosters public boosters = new Boosters("BOOSTER");

	event BoosterOpened(string[] cards);

	constructor() Ownable(msg.sender) {
		administrateur = msg.sender;
		console.log("Main contract deployed");
		console.log("Admin user : ", administrateur);
		createGameCollection2();
	}

	fallback() external payable {
		console.log("----- fallback:", msg.value);
	}

	receive() external payable {
		console.log("----- receive:", msg.value);
	}

	// TODO : utiliser les events pour mettre à jour la chaine ?

	function getAdmin() public view returns (address) {
		return administrateur;
	}

	function transferCard(uint tokenId, address newOwner) public {
		owners[tokenId] = newOwner;
	}

	function mint(address to, string memory cardId, uint collectionNumber) public {
		collections[collectionNumber].mint(NFTcount, cardId);
		owners[NFTcount] = to;
		NFTcount++;
		console.log("Minting for ", to);
		console.log("in collection ", collectionNumber);
		console.log("with tokenId ", NFTcount);
		console.log("cardID : ", cardId);
	}

	function getCard(uint tokenId) public view returns (Card memory) {
		for (uint i = 0; i < collectionCount; i++) {
			if (collections[i].isCardInCollection(tokenId)) {
				return collections[i].getCard(tokenId);
			}
		}
	}

	// function getCardImage(uint tokenId) public view returns (string memory) {
	// 	for (uint i = 0; i < collectionCount; i++) {
	// 		if (collections[i].isCardInCollection(tokenId)) {
	// 			return collections[i].getLink(tokenId);
	// 		}
	// 	}
	// }

	function balanceOf(address owner) public view returns (uint32) {
		uint32 nb = 0;
		for (uint i = 0; i < NFTcount; i++) {
			if (owners[i] == owner) {
				console.log("On a trouve 1 owner");
				nb++;
			}
		}
		console.log("ownerNbCard : ", nb);
		return nb;
	}

	function totalBalance() public view returns (uint32) {
		return uint32(NFTcount);
	}

	function ownerOf(uint tokenId) public view returns (address) {
		return owners[tokenId];
	}

	function getUserBoosterCount(address user) public view returns (uint32) {
		return boosters.getUserBoosterCount(user, 0);
	}

	function getAllUserCards(address owner) public view returns (string[] memory) {
		uint nb = balanceOf(owner);
		string[] memory cardsIds = new string[](nb);
		uint indexNewTable = 0;

		for (uint i = 0; i < NFTcount; i++) {
			if (owners[i] == owner) {
				cardsIds[indexNewTable] = getCard(i).id;
				indexNewTable++;
			}
		}
		return cardsIds;
	}

	function mintBooster(string[] memory newCardsIds) public {
		for (uint i = 0; i < 10; i++) {
			mint(administrateur, newCardsIds[i], 0);
		}

		boosters.mint(administrateur, 0, newCardsIds);
	}

	function getNbCardsCollection(uint collectionNumber) public view returns (uint) {
		return collections[collectionNumber].getNbCards();
	}

	function buyABooster(address userAdr) public {
		boosters.buyBooster(administrateur, userAdr, 0);
	}

	// Ouvre un booster et renvoie les ids des cartes obtenues
	function openABooster(address userAdr) public {
		string[] memory cards = boosters.openBooster(userAdr, 0);
		for (uint i = 0; i < cards.length; i++) {
			transferCard(i, userAdr);
		}
		console.log("LES CARTES ");
		for (uint i = 0; i < cards.length; i++) {
			console.log(cards[i]);
		}

		emit BoosterOpened(cards);
	}

	function createGameCollection(string calldata name, int cardCount) external {
		GameCollection gameCollections = new GameCollection(name, 0);
		collections[collectionCount] = gameCollections;
		collectionCount++;
	}

	function createGameCollection2() internal {
		GameCollection gameCollections = new GameCollection("Wizard", 0);
		collections[collectionCount] = gameCollections;
		collectionCount++;
	}
}
