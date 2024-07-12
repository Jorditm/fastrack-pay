// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "@openzeppelin/contracts/access/Ownable.sol";

contract CompanyWallet is Ownable {

    event Deposit(uint256 amount);
    event Withdrawal(uint256 amount);
    event ProductAdded(ProductInfo product);
    event ProductUpdated(bytes32 productId, ProductInfo product);
    event ProductDisabled(bytes32 productId);
    event ProductEnabled(bytes32 productId);
    event PaymentReceived(address customer, uint256 amount);

    struct ProductInfo {
        uint256 price;
        bool available;
        string title; 
        string description;
        string imageUrl;
    }

    bytes32[] public productIds;
    mapping(bytes32 => ProductInfo) public productsInfo;

    constructor(
        address _owner
    ) Ownable(_owner) {}

    function deposit() public payable onlyOwner {
        emit Deposit(msg.value);
    }

    function withdraw(uint256 _amount) public payable onlyOwner {
        require(address(this).balance >= _amount, "Insufficient balance");
        (bool sent, ) = owner().call{value: _amount}("");
        require(sent, "Failed to withdraw");
        emit Withdrawal(address(this).balance);    
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

    function addPayment(address _customer, bytes32 _productId) payable external {
        require(productsInfo[_productId].available, "Product is not available");
        require(msg.value == productsInfo[_productId].price, "Invalid payment amount");
        emit PaymentReceived(_customer, productsInfo[_productId].price);
    }

}