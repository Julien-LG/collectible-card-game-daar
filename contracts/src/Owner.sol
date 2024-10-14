pragma solidity ^0.8;

contract Owner {
    address private owner;
    int private collectionId;

    constructor() {
        owner = msg.sender;
    }

    function getCollectionId() public view returns (int) {
        return collectionId;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Owner: caller is not the owner");
        _;
    }
}