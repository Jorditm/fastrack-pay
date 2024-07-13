// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CustomerWallet.sol";  
import "./CompanyWallet.sol";

contract Factory is Ownable {

    enum AccountType {
        NOT_REGISTERED,
        CUSTOMER,
        COMPANY
    }

    struct UserAccountData {
        string name;
        string email;
    }

    struct CompanyAccountData {
        string name;
        string logoUrl;   
    }

    mapping(address => AccountType) public accounts;
    mapping(address => address) public contracts;
    mapping(address => bool) public whitelistedERC20tokens;

    constructor() payable Ownable(msg.sender) {}

    event CustomerAccountCreated(address _contract);
    event CompanyAccountCreated(address _contract);

    fallback() external payable {}
    receive() external payable {}

    function deployCustomerAccount(UserAccountData memory _data) public returns (address _contract) {
        address customerContract = address(new CustomerWallet(msg.sender, _data.name, _data.email));
        accounts[msg.sender] = AccountType.CUSTOMER;
        contracts[msg.sender] = customerContract;
        emit CustomerAccountCreated(customerContract);
        return customerContract;
    }

    function deployCompanyAccount(CompanyAccountData memory _data) public returns (address _contract) {
        address companyContract = address(new CompanyWallet(msg.sender, _data.name, _data.logoUrl));
        accounts[msg.sender] = AccountType.COMPANY;
        contracts[msg.sender] = companyContract;
        emit CompanyAccountCreated(companyContract);
        return companyContract;
    }

    function whitelistERC20Token(address _token) public onlyOwner {
        whitelistedERC20tokens[_token] = true;
    }

    function isERC20TokenWhitelisted(address _token) public view returns (bool) {
        return whitelistedERC20tokens[_token];
    }

    function delistERC20Token(address _token) public onlyOwner {
        whitelistedERC20tokens[_token] = false;
    }
}
