// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ATestERC20 is ERC20("Test", "TST") {
    constructor() {
        _mint(msg.sender, 1000000 * 1e18);
    }   

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract BTestERC20 is ERC20("Test", "TST") {
    constructor() {
        _mint(msg.sender, 1000000 * 1e18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}