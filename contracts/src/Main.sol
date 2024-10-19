// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./GameCollection.sol";
import "./CardOwnership.sol";

contract Main is CardOwnership {
	address internal administrateur;

	/*int private _count; // la quantité de collections de cartes
	mapping(int => GameCollection) private gameCollections; // les différentes extensions de cartes */
	constructor() {
		administrateur = msg.sender;
	}

	function getAdmin() public view returns (address) {
		return administrateur;
		// return address(0);
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
}
