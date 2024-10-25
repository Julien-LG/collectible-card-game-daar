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

	function mint(address to, uint collectionNumber) public {
		collections[collectionNumber].mint(NFTcount);
		owners[NFTcount] = to;
		NFTcount++;
		console.log("Minting for ", to);
		console.log("in collection ", collectionNumber);
		console.log("with tokenId ", NFTcount);
	}

	function getCard(uint tokenId) public view returns (Card memory) {
		for (uint i = 0; i < collectionCount; i++) {
			if (collections[i].isCardInCollection(tokenId)) {
				return collections[i].getCard(tokenId);
			}
		}
	}

	function getCardImage(uint tokenId) public view returns (string memory) {
		for (uint i = 0; i < collectionCount; i++) {
			if (collections[i].isCardInCollection(tokenId)) {
				return collections[i].getLink(tokenId);
			}
		}
	}

	//TODO : RENAME BALANCEOF
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
	
	// TODO : DELETE THIS 
	function addACard(address userAdr) external {
		// console.log("lets mint for ", userAdr);
		mint(userAdr, 0);
		NFTcount++;
	}

	function getAllUserCards(address owner) public view returns (Card[] memory) {
		uint nb = balanceOf(owner);
		Card[] memory cards = new Card[](nb);
		uint indexNewTable = 0;

		for (uint i = 0; i < NFTcount; i++) {
			if (owners[i] == owner) {
				cards[indexNewTable] = getCard(i);
				indexNewTable++;
			}
		}
		return cards;
	}

	function getAllUserCardsLinks(address owner) public view returns (string[] memory) {
		uint nb = balanceOf(owner);
		string[] memory links = new string[](nb);
		uint indexNewTable = 0;

		for (uint i = 0; i < NFTcount; i++) {
			if (owners[i] == owner) {
				links[indexNewTable] = getCardImage(i);
				indexNewTable++;
			}
		}
		return links;
	}

	function getNbCardsCollection(uint collectionNumber) public view returns (uint) {
		return collections[collectionNumber].getNbCards();
	}

	/*function buyABooster(address userAdr) public {
		boosters.mint(userAdr);
	}

	/*function openABooster(address userAdr) public {
		// boosters.mint(userAdr);
		boosters
	}*/

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
