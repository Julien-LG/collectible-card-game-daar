// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract GameCollection {
  string public name;
  int public cardCount;

  constructor(string memory _name, int _cardCount) {
    name = _name;
    cardCount = _cardCount;
  }

  function getCardCount() public view returns (int) {
    return cardCount;
  }

  function getName() public view returns (string memory) {
    return name;
  }
}
