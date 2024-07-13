// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CustomerWalletNotSponsored.sol";
import "./CompanyWalletNotSponsored.sol";

contract FactoryNotSponsored is Ownable {
    constructor(
    ) payable Ownable(_msgSender()) {}

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

    address public TRUSTED_FORWARDER;

    mapping(address => AccountType) public accounts;
    mapping(address => address) public contracts;
    mapping(address => bool) public whitelistedERC20tokens;

    event CustomerAccountCreated(address _contract);
    event CompanyAccountCreated(address _contract);

    fallback() external payable {}
    receive() external payable {}

    function deployCustomerAccount(
        UserAccountData memory _data
    ) public returns (address _contract) {
        address customerContract = address(
            new CustomerWalletNotSponsored(_msgSender(), _data.name, _data.email)
        );
        accounts[_msgSender()] = AccountType.CUSTOMER;
        contracts[_msgSender()] = customerContract;
        emit CustomerAccountCreated(customerContract);
        return customerContract;
    }

    function deployCompanyAccount(
        CompanyAccountData memory _data
    ) public returns (address _contract) {
        address companyContract = address(
            new CompanyWalletNotSponsored(_msgSender(), _data.name, _data.logoUrl)
        );
        accounts[_msgSender()] = AccountType.COMPANY;
        contracts[_msgSender()] = companyContract;
        emit CompanyAccountCreated(companyContract);
        return companyContract;
    }

    function whitelistERC20Token(address _token) public onlyOwner {
        whitelistedERC20tokens[_token] = true;
    }

    function isERC20TokenWhitelisted(
        address _token
    ) public view returns (bool) {
        return whitelistedERC20tokens[_token];
    }

    function delistERC20Token(address _token) public onlyOwner {
        whitelistedERC20tokens[_token] = false;
    }
}
