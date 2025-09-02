// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC721, ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract FortyTwo is ERC721URIStorage, Ownable {
  uint8 private nextTokenIndex;
  mapping(address => bool) public isAuthorized;

  constructor() ERC721("FortyTwo", "FT42") Ownable(_msgSender()) {}

  function setAuthorizationStatus(address addr, bool status) public onlyOwner {
    isAuthorized[addr] = status;
  }

  function mintNFT(string memory tokenURI) public returns (uint256) {
    uint256 tokenIndex = nextTokenIndex++;
    require(isAuthorized[_msgSender()], "Not authorized to mint a NFT");
    _mint(_msgSender(), tokenIndex);
    _setTokenURI(tokenIndex, tokenURI);
    return tokenIndex;
  }
}
