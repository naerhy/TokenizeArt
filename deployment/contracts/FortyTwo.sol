// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC721, ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract FortyTwo is ERC721URIStorage, Ownable {
  uint8 private constant MAX_SUPPLY = 1;
  uint8 private current_supply = 0;
  mapping(address => bool) public isAuthorized;

  constructor() ERC721("FortyTwo", "FT42") Ownable(_msgSender()) {}

  function setAuthorizationStatus(address addr, bool status) public onlyOwner {
    isAuthorized[addr] = status;
  }

  function mintNFT(string memory tokenURI) public returns (uint256) {
    require(current_supply < MAX_SUPPLY, "Maximum number of NFT already minted");
    require(isAuthorized[_msgSender()], "Not authorized to mint a NFT");
    uint8 index = current_supply++;
    _mint(_msgSender(), index);
    _setTokenURI(index, tokenURI);
    return index;
  }
}
