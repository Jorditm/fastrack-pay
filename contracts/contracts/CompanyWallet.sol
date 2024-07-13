// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
import "@openzeppelin/contracts/access/Ownable.sol";

interface ICustomerWallet {
    function payForSubscription(bytes32 _productId) external returns (bool); 
}

/**
 * @dev For some reason if the name is the same as in the CustomerWallet.sol it does not work
 */
interface IERC20Context {
    function isERC20TokenWhitelisted(address _token) external view returns (bool);
}

contract CompanyWallet is Ownable {

    event Deposit(uint256 amount);
    event Withdrawal(uint256 amount);
    event ProductAdded(ProductInfo product);
    event ProductUpdated(bytes32 productId, ProductInfo product);
    event ProductDisabled(bytes32 productId);
    event ProductEnabled(bytes32 productId);
    event PaymentReceived(address customer, uint256 amount);
    event CustomerSubscribed(address customer, bytes32 productId);
    event CustomerUnsubscribed(address customer, bytes32 productId);
    event CustomerCharged(address customer, bytes32 productId);

    struct CompanyAccountData {
        string name;
        string logoUrl;   
    }

    struct ProductInfo {
        uint256 price;
        bool available;
        string title; 
        string description;
        string imageUrl;
        bool recurring;
        uint256 interval;
    }

    struct CustomerSubscriptionInfo {
        address customer;
        bytes32 productId;
        uint256 lastPayment;
        uint256 nextPayment;
        bool isActive;
    }

    struct CustomersCharged {
        address customer;
        bytes32 productId;
    }

    string public name;
    string public logoUrl;

    bytes32[] public productIds;
    address[] public clientsList;
    mapping(bytes32 => ProductInfo) public productsInfo;
    mapping(address => bytes32[]) public customerSubscriptions;
    mapping(address => mapping(bytes32 => CustomerSubscriptionInfo)) public CustomerSubscriptionsInfos;


    constructor(
        address _owner,
        string memory _name,
        string memory _logoUrl
    ) Ownable(_owner) {
        name = _name;
        logoUrl = _logoUrl;
    }

    function deposit() public payable onlyOwner {
        emit Deposit(msg.value);
    }

    function withdraw(uint256 _amount) public payable onlyOwner {
        require(address(this).balance >= _amount, "Insufficient balance");
        (bool sent, ) = owner().call{value: _amount}("");
        require(sent, "Failed to withdraw");
        emit Withdrawal(address(this).balance);    
    }

    function updateCompanyData(CompanyAccountData memory _data) public onlyOwner {
        if(bytes(_data.name).length > 0) {
            name = _data.name;
        }
        if(bytes(_data.logoUrl).length > 0) {
            logoUrl = _data.logoUrl;
        }
    }

    function createProduct(ProductInfo memory _product) public onlyOwner {
        require(_product.price > 0, "Price must be greater than 0");
        bytes32 productId = keccak256(abi.encodePacked(address(this), _product.title, _product.description, _product.imageUrl));
        productsInfo[productId] = _product;
        productIds.push(productId);
        emit ProductAdded(_product);
    }

    function updateProduct(bytes32 _productId, ProductInfo memory _product) public onlyOwner {
        productsInfo[_productId] = _product;
        emit ProductUpdated(_productId, _product);
    }

    function disableProduct(bytes32 _productId) public onlyOwner {
        productsInfo[_productId].available = false;
        emit ProductDisabled(_productId);
    }

    function enableProduct(bytes32 _productId) public onlyOwner {
        productsInfo[_productId].available = true;
        emit ProductEnabled(_productId);
    }

    function getProducts() public view returns (bytes32[] memory) {
        return productIds;
    }

    function getProductInfo(bytes32 _productId) public view returns (ProductInfo memory) {
        return productsInfo[_productId];
    }

    function getProductPrice(bytes32 _productId) public view returns (uint256) {
        return productsInfo[_productId].price;
    }

    function addPayment(bytes32 _productId) payable external {
        require(productsInfo[_productId].available, "Product is not available");
        require(msg.value == productsInfo[_productId].price, "Invalid payment amount");
        emit PaymentReceived(msg.sender, productsInfo[_productId].price);
    }

    function addSubscription(bytes32 _productId) payable external {
        require(productsInfo[_productId].available, "Product is not available");
        require(productsInfo[_productId].recurring, "Product is not recurring");
        require(msg.value == productsInfo[_productId].price, "Invalid payment amount");
        require(CustomerSubscriptionsInfos[msg.sender][_productId].isActive == false, "Subscription is already active");
        customerSubscriptions[msg.sender].push(_productId);
        CustomerSubscriptionInfo memory subscription = CustomerSubscriptionInfo({
            customer: msg.sender,
            productId: _productId,
            lastPayment: block.timestamp,
            nextPayment: block.timestamp + productsInfo[_productId].interval,
            isActive: true
        });
        CustomerSubscriptionsInfos[msg.sender][_productId] = subscription;
        emit CustomerSubscribed(msg.sender, _productId);
    }

    function cancelSubscription(bytes32 _productId) external {
        CustomerSubscriptionsInfos[msg.sender][_productId].isActive = false;
        emit CustomerUnsubscribed(msg.sender, _productId);
    }

    function reactivateSubscription(bytes32 _productId) external payable {
        require(productsInfo[_productId].available, "Product is not available");
        require(productsInfo[_productId].recurring, "Product is not recurring");
        require(!CustomerSubscriptionsInfos[msg.sender][_productId].isActive, "Subscription is already active");
        CustomerSubscriptionsInfos[msg.sender][_productId].isActive = true;
        CustomerSubscriptionsInfos[msg.sender][_productId].lastPayment = block.timestamp;
        CustomerSubscriptionsInfos[msg.sender][_productId].nextPayment = block.timestamp + productsInfo[_productId].interval;
        emit CustomerSubscribed(msg.sender, _productId);
    }

    function getCustomerSubscriptions(address _customer) internal view returns (bytes32[] memory) {
        bytes32[] memory subscriptions = new bytes32[](customerSubscriptions[_customer].length);
        for (uint i = 0; i < customerSubscriptions[_customer].length; i++) {
            subscriptions[i] = customerSubscriptions[_customer][i];
        }
        return subscriptions;
    }

    function getCustomerSubscriptionInfo(address _customer, bytes32 _productId) internal view returns (CustomerSubscriptionInfo memory) {
        return CustomerSubscriptionsInfos[_customer][_productId];
    }

    function getCustomerSubscriptionStatus(address _customer, bytes32 _productId) public view returns (bool) {
        return CustomerSubscriptionsInfos[_customer][_productId].isActive;
    }

    function getCustomerSubscriptionNextPayment(address _customer, bytes32 _productId) internal view returns (uint256) {
        return CustomerSubscriptionsInfos[_customer][_productId].nextPayment;
    }

    function retrievePayments() public onlyOwner {
        for (uint i = 0; i < clientsList.length; i++) {
            address customer = clientsList[i];
            bytes32[] memory subscriptions = getCustomerSubscriptions(customer);
            for (uint j = 0; j < subscriptions.length; j++) {
                bytes32 productId = subscriptions[j];
                uint256 nextPayment = getCustomerSubscriptionNextPayment(customer, productId);
                bool isActive = getCustomerSubscriptionStatus(customer, productId);
                if (nextPayment <= block.timestamp && isActive) {
                    bool success = ICustomerWallet(customer).payForSubscription(productId);
                    if (success) {
                        emit CustomerCharged(customer, productId);
                    }
                }
            }
        }
    }
}