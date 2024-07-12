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

    mapping(address => AccountType) public accounts;
    mapping(address => address) public contracts;

    constructor() payable Ownable(msg.sender) {}

    event CustomerAccountCreated(address _contract);
    event CompanyAccountCreated(address _contract);

    fallback() external payable {}
    receive() external payable {}

    function deployCustomerAccount(address _customer) public returns (address _contract) {
        address customerContract = address(new CustomerWallet(_customer));
        accounts[_customer] = AccountType.CUSTOMER;
        contracts[_customer] = customerContract;
        emit CustomerAccountCreated(customerContract);
        return customerContract;
    }

    function deployCompanyAccount(address _company) public returns (address _contract) {
        address companyContract = address(new CompanyWallet(_company));
        accounts[_company] = AccountType.COMPANY;
        contracts[_company] = companyContract;
        emit CompanyAccountCreated(companyContract);
        return companyContract;
    }
}
