pragma solidity ^0.8.0;

contract EnhancedSimpleStorage {
    
    uint256 private _storedNumber;

    constructor() {
        _storedNumber = 0;
    }

    uint256 public constant MAX_NUMBER = 10**18; 

    function storeNumber(uint256 number) public {
        require(number <= MAX_NUMBER, "Number is too large");
        _storedNumber = number;
        emit NumberStored(_storedNumber);
    }

    function retrieveNumber() public view returns (uint256){
        return _storedNumber;
    }

    event NumberStored(uint256 indexed newNumber);
}