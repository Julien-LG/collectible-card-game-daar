// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Card.sol";

contract UserCollection {
  mapping(int => Card) private cards;
  int private cardCount;

  constructor() {
    cardCount = 0;
  }
  
  function addCard(Card newCard) public {
    cards[cardCount] = newCard;
    cardCount++;
  }

  function getCard(int id) public view returns (Card) {
    return cards[id];
  }

  function getCardCount() public view returns (int) {
    return cardCount;
  }
}
