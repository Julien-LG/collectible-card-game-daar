// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Card.sol";

contract GameCollection {
	string public name;
	uint public cardCount;
	mapping(uint => Card) public cards;

	constructor(string memory _name, uint _cardCount) {
		name = _name;
		cardCount = _cardCount;
	}

	// Donne le nombre de carte de la collection
	function getCardCount() public view returns (uint) {
		return cardCount;
	}

	// Donne le nom de la collection
	function getName() public view returns (string memory) {
		return name;
	}

	function isCardInCollection(uint tokenId) public view returns (bool) {
		for (uint i = 0; i < cardCount; i++) {
			if (cards[i].getId() == tokenId) {
				return true;
			}
		}
		return false;
	}

	
	function getCard(uint tokenId) public view returns (Card) { // On ne peux pas chercher une carte qui n'extiste pas
		for (uint i = 0; i < cardCount; i++) {
			if (cards[i].getId() == tokenId) {
				return cards[i];
			}
		}
	}

	function transferCard(uint tokenId, address newOwner) public {
		for (uint i = 0; i < cardCount; i++) {
			if (cards[i].getId() == tokenId) {
				Card card = cards[i];
				address from = card.owner();
				card.transferFrom(from, newOwner, tokenId);
				break;
			}
		}
	}

	// Donne le nombre de carte d'un utilisateur
	function balanceOf(address owner) public view returns (uint) {
		uint nb = 0;
		for (uint i = 0; i < cardCount; i++) {
			if (cards[i].owner() == owner) {
				nb++;
			}
		}
		return nb;
	}

	// Donne l'adresse du propriétaire d'une carte
	function ownerOf(uint tokenId) public view returns (address) {
		for (uint i = 0; i < cardCount; i++) {
			if (cards[i].getId() == tokenId) {
				return cards[i].getOwnerCARD();
				// return cards[i].owner();
			}
		}
	}

	// Ajoute une carte à la collection
	function addCard(uint id, string memory imgLink, address userAdr) public {
		Card c = new Card(id, imgLink, userAdr);
		cards[cardCount++] = c;
		c.mint(userAdr);
	}

	// Mint une carte de la collection
	function mint(address to) public {
		for (uint i = 0; i < cardCount; i++) {
			if (cards[i].owner() == address(0)) {
				cards[i].transferOwnership(to);
				break;
			}
		}
	}

	// Mint une carte précise de la collection
	function mint(address to, uint tokenId) public {
		for (uint i = 0; i < cardCount; i++) {
			if (cards[i].owner() == address(0) && cards[i].getId() == tokenId) {
				cards[i].transferOwnership(to);
				break;
			}
		}
	}

	// Donne un nombre de carte définit à un utilisateur
	function mintSomeCards(address to, uint quantity) public {
		for (uint i = 0; i < quantity; i++) { //TODO : ajouter des sécurités il ne faut pas ajouter une carte s'il n'y en a plus assez à mint
			mint(to);
		}
	}

	function totalBalance() public view returns (uint32) {
		uint32 nb = 0;
		for (uint i = 0; i < cardCount; i++) {
			nb++;
		}
		return nb;
	}
}
