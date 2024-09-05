// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../DN404.sol";
import "../DN404Mirror.sol";
import {Ownable} from "solady/auth/Ownable.sol";
import {LibString} from "solady/utils/LibString.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";

/**
 * @title CustomDN404.sol
 * @notice Based on https://github.com/Vectorized/dn404
 * Highly configurable ERC404
 */
contract CustomDN404 is DN404, Ownable {
    string private _name;
    string private _symbol;
    string private _baseURI;
    uint256 private _tokensInNFT;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        uint256 unit,
        uint96 initialNFTSupply,
        bool instantMint
    ) {
        _initializeOwner(msg.sender);

        _name = name_;
        _symbol = symbol_;
        _baseURI = baseURI_;
        _tokensInNFT = unit;

        address mirror = address(new DN404Mirror(msg.sender));

         if (instantMint) {
            _initializeDN404(0, msg.sender, mirror);
            _setSkipNFT(msg.sender, false);
            //mint both parts
            _mint(msg.sender, unit * initialNFTSupply);
         } else {
             _initializeDN404(unit * initialNFTSupply, msg.sender, mirror);
         }
    }

    /*«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-*/
    /*               OVERRIDES                                    */
    /*-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»*/

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function _tokenURI(uint256 tokenId) internal view override returns (string memory result) {
        if (bytes(_baseURI).length != 0) {
            result = string(abi.encodePacked(_baseURI, LibString.toString(tokenId)));
        }
    }

    /// @dev Amount of token balance that is equal to one NFT.
    function _unit() internal view override returns (uint256) {
        return _tokensInNFT;
    }

    /// @dev Will mint/transfer NFTs for 'to', even if contract, or flag set to 'false'
    /// at extra gas costs
    function _transfer(address from, address to, uint256 amount) internal override{
        if (getSkipNFT(to)) _setSkipNFT(to, false);
        super._transfer(from, to, amount);
    }

    /*«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-*/

    function setBaseURI(string calldata baseURI_) public onlyOwner {
        _baseURI = baseURI_;
    }

    function withdraw() public onlyOwner {
        SafeTransferLib.safeTransferAllETH(msg.sender);
    }
}
