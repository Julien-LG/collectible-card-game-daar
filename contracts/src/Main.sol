// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./GameCollection.sol";

import "hardhat/console.sol";

contract Main is Ownable {
	address internal administrateur;

	mapping(uint => GameCollection) public collections;
    uint public collectionCount;
	uint NFTnumber = 0;

	mapping(uint => address) public owners; // les propriétaires des cartes
	// numNFT => adress proprio

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

	function getAdmin() public view returns (address) {
		return administrateur;
	}

	function transferCard(uint tokenId, address newOwner) public {
		owners[tokenId] = newOwner;
	}

	function mint(address to, uint collectionNumber) public {
		collections[collectionNumber].mint(NFTnumber);
		owners[NFTnumber] = to;
		NFTnumber++;
		console.log("Minting for ", to);
		console.log("in collection ", collectionNumber);
		console.log("with tokenId ", NFTnumber);
	}

	/*function getCard(uint tokenId) public view returns (Card) {
		for (uint i = 0; i < collectionCount; i++) {
			if (collections[i].isCardInCollection(tokenId)) {
				return collections[i].getCard(tokenId);
			}
		}
	}*/

	function getCardImage(uint tokenId) public view returns (string memory) {
		for (uint i = 0; i < collectionCount; i++) {
			if (collections[i].isCardInCollection(tokenId)) {
				return collections[i].getLink(tokenId);
			}
		}
	}

	//TODO : RENAME BALANCEOF
	function ownerNbCard(address owner) public view returns (uint32) {
		uint32 nb = 0;
		for (uint i = 0; i < NFTnumber; i++) {
			if (owners[i] == owner) {
				console.log("On a trouve 1 owner");
				nb++;
			}
		}
		console.log("ownerNbCard : ", nb);
		return nb;
	}

	function totalBalance() public view returns (uint32) {
		return uint32(NFTnumber);
	}

	function ownerOf(uint tokenId) public view returns (address) {
		return owners[tokenId];
	}
	
	// TODO : DELETE THIS 
	function addACard(address userAdr) external {
		// console.log("lets mint for ", userAdr);
		mint(userAdr, 0);
		NFTnumber++;
	}

	// TODO : passer en EXTERNAL apres les tests
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
