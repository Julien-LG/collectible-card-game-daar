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

	function getAdmin() public view returns (address) {
		return administrateur;
	}

	function totalNFT() public view returns (uint32) {
		return uint32(NFTcount);
	}

	function transferCard(uint tokenId, address newOwner) public {
		owners[tokenId] = newOwner;
	}

	function getCard(uint tokenId) public view returns (Card memory) {
		for (uint i = 0; i < collectionCount; i++) {
			if (collections[i].isCardInCollection(tokenId)) {
				return collections[i].getCard(tokenId);
			}
		}
	}

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

	function ownerOf(uint tokenId) public view returns (address) {
		return owners[tokenId];
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
	
	function getNbCardsCollection(uint collectionNumber) public view returns (uint) {
		return collections[collectionNumber].getNbCards();
	}

	// GESTION DES CARTES

	function mint(address to, string memory cardId, uint collectionNumber) public {
		collections[collectionNumber].mint(NFTcount, cardId);
		owners[NFTcount] = to;
		NFTcount++;
		console.log("Minting for ", to);
		console.log("in collection ", collectionNumber);
		console.log("with tokenId ", NFTcount);
		console.log("cardID : ", cardId);
	}

	function sellCard(string memory cardId, address owner, uint price) public {
		uint collectionNumber = 0;
		uint[] memory cards = collections[collectionNumber].getNFTidsForSale(cardId, false);

		for (uint i = 0; i < cards.length; i++) {
			if (owners[i] == owner) {
				collections[collectionNumber].sellCard(i, price);
				break;
			}
		}
	}

	function buyCard(string memory cardId) public payable {
		uint collectionNumber = 0;
		uint[] memory cards = collections[collectionNumber].getNFTidsForSale(cardId, true);
		
		for (uint i = 0; i < cards.length; i++) {
			if (owners[i] != msg.sender) {
				Card memory card = collections[collectionNumber].getCard(i);
				address seller = owners[i];
				if (msg.value == card.price) {
					require(seller != msg.sender, "Buyer cannot be the owner");
					require(msg.value >= card.price, "Not enough money");

					// Effectuer le paiement
        			(bool sent, ) = payable(seller).call{value: msg.value}("");
        			require(sent, "Payment to seller failed");

					// payable(owners[i]).transfer(msg.sender.balance);

					owners[i] = msg.sender;
					collections[collectionNumber].buyCard(i);
					break;
				}
			}
		}
	}

	// GESTION DES BOOSTERS

	function mintBooster(string[] memory newCardsIds) public {
		for (uint i = 0; i < 10; i++) {
			mint(administrateur, newCardsIds[i], 0);
		}

		boosters.mint(administrateur, 0, newCardsIds);
	}

	function buyABooster(address userAdr) public payable{
		boosters.buyBooster(payable(administrateur), userAdr, 0);
	}

	function getUserBoosterCount(address user) public view returns (uint32) {
		return boosters.getUserBoosterCount(user, 0);
	}

	// Ouvre un booster et renvoie les ids des cartes obtenues par un event
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

	// GESTION DES COLLECTIONS

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
