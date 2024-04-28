// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnhancedSimpleStorage {
    
    uint256 private _storedNumber;
    uint256 public constant MAX_NUMBER = 10**18; 

    event NumberStored(uint256 indexed newNumber);

    constructor() {
        _storedNumber = 0;
    }

    function storeNumber(uint256 number) public {
        require(number <= MAX_NUMBER, "Number is too large");
        _storedNumber = number;
        emit NumberStored(_storedNumber);
    }

    // New function for storing multiple numbers
    function storeMultipleNumbers(uint256[] memory numbers) public {
        for (uint i = 0; i < numbers.length; i++) {
            require(numbers[i] <= MAX_NUMBER, "One of the numbers is too large");
            // Note: This overwrites _storedNumber each time.
            _storedNumber = numbers[i];
            emit NumberStored(_storedNumber);
        }
    }

    function retrieveNumber() public view returns (uint256){
        return _storedNumber;
    }
}