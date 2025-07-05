// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract GreenChain {

    struct Offset {
        string name;         // Name of user
        string activity;     // Description of carbon offset (e.g. "Planted 10 trees")
        uint256 timestamp;   // When it was submitted
        address from;        // Wallet address of user
    }

    Offset[] public offsets; // Array to store all offsets
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function submitOffset(string calldata name, string calldata activity) external payable {
        require(msg.value > 0, "Please contribute some ETH to offset");

        // Send ETH to owner (can be used to fund real-world green projects)
        owner.transfer(msg.value);

        // Store the carbon offset info
        offsets.push(Offset(name, activity, block.timestamp, msg.sender));
    }

    function getOffsets() public view returns (Offset[] memory) {
        return offsets;
    }
}
