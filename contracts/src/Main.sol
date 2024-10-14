// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./GameCollection.sol";
import "./UserCollection.sol";

contract Main {
  address private _owner; // l'administrateur

  int private _count; // la quantité de collections de cartes
  mapping(int => GameCollection) private gameCollections; // les différentes extensions de cartes
  mapping(address => UserCollection) public userCollections; // les collections des utilisateurs

  constructor() {
    _count = 0;
    _owner = msg.sender;
  }

  function createGameCollection(string calldata name, int cardCount) external {
    gameCollections[_count++] = new GameCollection(name, cardCount);
  }

  function createUserCollection(address owner) external {
    userCollections[owner] = new UserCollection();
  }

  // function getCollectionName(int id) public view returns (string) {
  //   return collections[id].getName();
  // }
}
