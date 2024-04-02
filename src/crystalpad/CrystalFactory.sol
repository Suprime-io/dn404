// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./CrystalDN404.sol";

/**
 * @title CrystalFactory
 * @notice Super light-weight factory for 404s
 */
contract CrystalFactory {

    function create404(
        string memory name_,
        string memory symbol_,
        uint256 unit,
        uint96 initialNFTSupply
    ) public {
        //create 20s and mints to sender, but no 721s are minted yet
        CrystalDN404 new404 = new CrystalDN404(name_, symbol_, unit, initialNFTSupply, msg.sender);
        //send back all 20 and 721
        new404.transfer(msg.sender, new404.balanceOf(address(this)));
    }
}
