// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "@openzeppelin/contracts/access/Ownable.sol";

interface ICompanyWallet {
    function addPayment(address _customer, bytes32 _productId) external payable;
    function getProductPrice(
        bytes32 _productId
    ) external view returns (uint256);
    function addSubscription(bytes32 _productId) external payable;
    function cancelSubscription(bytes32 _productId) external;
    function reactivateSubscription(bytes32 _productId) external payable;
    function getCustomerSubscriptionStatus(
        address _customer,
        bytes32 _productId
    ) external view returns (bool);
}

contract CustomerWallet is Ownable {
    event Deposit(uint256 amount);
    event Withdrawal(uint256 amount);
    event OneTimePayment(address indexed company, uint256 amount);
    event SubscriptionAdded(address indexed company, bytes32 productId);
    event SubscriptionCancelled(address indexed company, bytes32 productId);
    event SubscriptionReactivated(address indexed company, bytes32 productId);
    event SubscriptionPaid(address indexed company, uint256 amount);

    /** 
     * @dev This data MUST be encrypted on client side or otherwise it can be accessed by anyone
     */
    string public name;
    string public email;

    /**
     * @dev Mapping of company addresses to the corresponding array of subscripitions an user has with that company
     */
    mapping(address => bytes32[]) public subscriptions;

    constructor(address _owner, string memory _name, string memory _email) Ownable(_owner) {
        name = _name;
        email = _email;
    }

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

    function addSubscription(
        address _companyContract,
        bytes32 _productId
    ) public onlyOwner {
        uint256 price = ICompanyWallet(_companyContract).getProductPrice(
            _productId
        );

        require(price > 0, "Failed to retrieve price");
        require(address(this).balance >= price, "Insufficient balance");

        try
            ICompanyWallet(_companyContract).addSubscription{value: price}(
                _productId
            )
        {
            emit SubscriptionAdded(_companyContract, _productId);
        } catch {
            revert("Failed to add subscription");
        }
    }

    function cancelSubscription(
        address _companyContract,
        bytes32 _productId
    ) public onlyOwner {
        try ICompanyWallet(_companyContract).cancelSubscription(_productId) {
            emit SubscriptionCancelled(_companyContract, _productId);
        } catch {
            revert("Failed to cancel subscription");
        }
    }

    function reactivateSubscription(
        address _companyContract,
        bytes32 _productId
    ) public onlyOwner {
        uint256 price = ICompanyWallet(_companyContract).getProductPrice(
            _productId
        );

        require(price > 0, "Failed to retrieve price");
        require(address(this).balance >= price, "Insufficient balance");

        try
            ICompanyWallet(_companyContract).reactivateSubscription{
                value: price
            }(_productId)
        {
            emit SubscriptionReactivated(_companyContract, _productId);
        } catch {
            revert("Failed to reactivate subscription");
        }
    }

    function payForSubscription(bytes32 _productId) external returns (bool) {
        bool isActive = ICompanyWallet(msg.sender)
            .getCustomerSubscriptionStatus(address(this), _productId);
        uint256 price = ICompanyWallet(msg.sender).getProductPrice(_productId);
        require(isActive, "Subscription is not active");
        require(price > 0, "Failed to retrieve price");
        require(address(this).balance >= price, "Insufficient balance");
        try
            ICompanyWallet(msg.sender).addPayment{value: price}(
                address(this),
                _productId
            )
        {
            emit SubscriptionPaid(msg.sender, price);
            return true;
        } catch {
            revert("Failed to pay for subscription");
        }
    }
}
