// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "@openzeppelin/contracts/access/Ownable.sol";

interface ICompanyWallet {
    function addPayment(address _customer, bytes32 _productId) external payable;
    function getProductPrice(
        bytes32 _productId
    ) external view returns (uint256);
}

contract CustomerWallet is Ownable {
    event Deposit(uint256 amount);
    event Withdrawal(uint256 amount);
    event OneTimePayment(address indexed company, uint256 amount);

    constructor(address _owner) Ownable(_owner) {}

    function deposit() public payable onlyOwner {
        emit Deposit(msg.value);
    }

    function withdraw(uint256 _amount) public onlyOwner {
        require(address(this).balance >= _amount, "Insufficient balance");
        (bool sent, ) = owner().call{value: _amount}("");
        require(sent, "Failed to withdraw");
        emit Withdrawal(address(this).balance);
    }

    function makeOneTimePayment(
        address _companyContract,
        bytes32 _productId
    ) public onlyOwner {
        uint256 price = ICompanyWallet(_companyContract).getProductPrice(
            _productId
        );

        require(price > 0, "Failed to retrieve price");
        require(address(this).balance >= price, "Insufficient balance");

        try
            ICompanyWallet(_companyContract).addPayment{value: price}(
                address(this),
                _productId
            )
        {
            emit OneTimePayment(_companyContract, price);
        } catch {
            revert("Failed to make one time payment");
        }
    }
}
