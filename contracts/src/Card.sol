pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Card is Ownable {
    // string public name;
    uint private id;
    string private imgLink;

    constructor(uint _id, string memory _imgLink) Ownable(msg.sender) {
        id = _id;
        imgLink = _imgLink;
    }
}