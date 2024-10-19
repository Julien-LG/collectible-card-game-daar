// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Main.sol";

contract Card is Ownable {
    // string public name;
    uint private id;
    string private imgLink;

    // TODO : delete userAdr
    constructor(uint _id, string memory _imgLink, address userAdr) Ownable(msg.sender) {
        id = _id;
        imgLink = _imgLink;
    }

    function getOwnerCARD() public view returns (address) {
		return this.owner();
	}

    function getId() public view returns (uint) {
        return id;
    }

    function getImgLink() public view returns (string memory) {
        return imgLink;
    }

    function transferOwnership(address to) public override {
        transferOwnership(to); // TODO : vérifier si ça fonctionne
    }
}