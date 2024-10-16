pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Card.sol";
import "./GameCollection.sol";

contract CardOwnership is Ownable, ERC721 {
    mapping(uint => GameCollection) public cardCollections;
    uint public collectionCount;
    // mapping (uint => address) cardsApprovals;

    constructor() Ownable(msg.sender) ERC721("Card", "CARD") {
    }

    // // Récupère une carte
    // function mint(address to, uint tokenId, uint collectionNumber) public {
    //     require(collectionNumber < collectionCount, "CardOwnership: collection does not exist");
    //     uint numberOfCards = cardCollections[collectionNumber].getCardCount();

    //     for (uint i = 0; i < numberOfCards; i++) {
    //         if (cardCollections[collectionNumber].cards[i].owner() == address(0)) {
    //             // _safeMint(to, tokenId);
    //             cardCollections[collectionNumber].cards[i].transferOwnership(to);
    //             break;
    //         }
    //     }
    // }
    
    // Donne le nombre de cartes d'un utilisateur
    function balanceOf(address owner) public view override returns (uint) {
        uint nb = 0;
        for (uint i = 0; i < collectionCount; i++) {
            nb += cardCollections[i].balanceOf(owner);
        }
        return nb;
    }

    // Donne le propriétaire d'une carte
    function ownerOf(uint tokenId) public view override returns (address) {
        for (uint256 i = 0; i < collectionCount; i++) {
            address owner = cardCollections[i].ownerOf(tokenId);
            if (owner != address(0))
                return owner;
        }
        return address(0);
    }

    function getCollectionNbForCard(uint tokenId) public view returns (int) {
        for (int i = 0; i < int(collectionCount); i++) {
            if (cardCollections[uint(i)].isCardInCollection(tokenId)) {
                return i;
            }
        }
        return -1;
    }

    // Transfère une carte d'un utilisateur à un autre
    function transferFrom(address from, address to, uint tokenId) public override {
        require(from == ownerOf(tokenId), "CardOwnership: transfer of token that is not own");
        require(to != address(0), "CardOwnership: transfer to the zero address");
        int collectionNumber = getCollectionNbForCard(tokenId);
        require(collectionNumber != -1, "CardOwnership: card does not exist");

        cardCollections[uint(collectionNumber)].getCard(tokenId).transferOwnership(to);
        emit Transfer(from, to, tokenId);
    }

    // Récupère des cartes
    function mintSomeCards(address to, uint quantity, uint collectionNumber) public {
        require(collectionNumber < collectionCount, "CardOwnership: collection does not exist");

        cardCollections[collectionNumber].mintSomeCards(to, quantity);
    }

    // Récupère une carte
    function mint(address to, uint tokenId, uint collectionNumber) public {
        require(collectionNumber < collectionCount, "CardOwnership: collection does not exist");

        cardCollections[collectionNumber].mint(to, tokenId);
    }

    /*function safeTransferFrom(address from, address to, uint tokenId, bytes data){

    }

    function safeTransferFrom(address from, address to, uint tokenId){

    }

    function approve(address to, uint tokenId) public view onlyOwner() {
        cardsApprovals[tokenId] = to;
        Approval(msg.sender, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public view {
        ApprovalForAll(msg.sender, operator, approved);
    }

    function getApproved(uint tokenId){

    }

    function isApprovedForAll(address owner, bool operator){

    }*/

    function addACard(uint cardNumber) external returns (address) {
        GameCollection gameCollections = new GameCollection("Wizard", 0);
		cardCollections[collectionCount] = gameCollections;
		collectionCount++;
		cardCollections[0].addCard(cardNumber, "https://images.pokemontcg.io/xy1/1.png");
        Card c = cardCollections[0].getCard(cardNumber);
        
        // return c.owner();
        return address(666);
	}
}