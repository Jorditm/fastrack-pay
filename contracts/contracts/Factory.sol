// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
import "@openzeppelin/contracts/access/Ownable.sol";
import {ERC2771Context} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";
import "./CustomerWallet.sol";
import "./CompanyWallet.sol";

contract Factory is Ownable, ERC2771Context {
    constructor(
        address trustedForwarder
    ) payable ERC2771Context(trustedForwarder) Ownable(_msgSender()) {
        TRUSTED_FORWARDER = trustedForwarder;
    }

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

    function _msgSender()
        internal
        view
        override(Context, ERC2771Context)
        returns (address)
    {
        return ERC2771Context._msgSender();
    }

    function _msgData()
        internal
        view
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }

    function deployCustomerAccount(
        UserAccountData memory _data
    ) public returns (address _contract) {
        address customerContract = address(
            new CustomerWallet(_msgSender(), TRUSTED_FORWARDER, _data.name, _data.email)
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
            new CompanyWallet(_msgSender(), TRUSTED_FORWARDER, _data.name, _data.logoUrl)
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
