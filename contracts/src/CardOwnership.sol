pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Card.sol";
import "./Owner.sol";
import "./Main.sol";

contract CardOwnership is Card, ERC721 {
    mapping(uint => Card) private cards;
    mapping (uint => address) cardsApprovals;

    constructor() ERC721("Card", "CARD") {
    }
    // function createCard(uint id, string calldata imgLink) external {
    //     cards[id] = new Card(id, imgLink);
    // }
    function balanceOf(address owner) public view returns (uint) {
        return Main.userCollections[owner].cardCount;
    }

    function ownerOf(uint tokenId) public view returns (address) {
        return cards[tokenId].owner();
    }

    function safeTransferFrom(address from, address to, uint tokenId, bytes data){

    }

    function safeTransferFrom(address from, address to, uint tokenId){

    }

    function transferFrom(address from, address to, uint tokenId) public view {
        require(from == cards[tokenId].owner(), "CardOwnership: transfer of token that is not own");
        cards[tokenId].transferOwnership(to);
        collections[from.getCollectionId()].cardCount--;
        collections[to.getCollectionId()].cardCount++;
        Transfer(from, to, tokenId);
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

    }
}