// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./GameCollection.sol";
import "./CardOwnership.sol";

contract Main is CardOwnership {
	address private administrateur;

	/*int private _count; // la quantité de collections de cartes
	mapping(int => GameCollection) private gameCollections; // les différentes extensions de cartes */
	constructor() {
		administrateur = msg.sender;
	}

	function createGameCollection(string calldata name, int cardCount) external {
		GameCollection gameCollections = new GameCollection(name, 0);
		cardCollections[collectionCount] = gameCollections;
		collectionCount++;
	}

	function createGameCollection2() internal {
		GameCollection gameCollections = new GameCollection("Wizard", 0);
		cardCollections[collectionCount] = gameCollections;
		collectionCount++;
	}

	/*function addACard(uint cardNumber) external {
		// GameCollection gameCollection = cardCollections[collectionNumber];

		createGameCollection2();
		// Card card = new Card(cardNumber, "https://images.pokemontcg.io/xy1/1.png");
		cardCollections[0].addCard(cardNumber, "https://images.pokemontcg.io/xy1/1.png");
		// cardCollections[0].cards[0] = card;
		// cardCollections[0].cardCount++;
		// gameCollection.cardCount++;
	}*/
}
