// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnhancedSimpleStorage {
    
    uint256 private _storedNumber;
    uint256 public constant MAX_NUMBER = 10**18; 

    event NumberStored(uint256 indexed newNumber);

    error NumberTooLarge(uint256 providedNumber, uint256 maxAllowed);

    constructor() {
        _storedNumber = 0;
    }

    function storeNumber(uint256 number) public {
        if (number > MAX_NUMBER) {
            revert NumberTooLarge({providedNumber: number, maxAllowed: MAX_NUMBER});
        }
        _storedNumber = number;
        emit NumberStored(_storedNumber);
    }

    function storeMultipleNumbers(uint256[] memory numbers) public {
        for (uint i = 0; i < numbers.length; i++) {
            if (numbers[i] > MAX_NUMBER) {
                revert NumberTooLarge({providedNumber: numbers[i], maxAllowed: MAX_NUMBER});
            }
            _storedNumber = numbers[i];
            emit NumberStored(_storedNumber);
        }
    }

    function retrieveNumber() public view returns (uint256) {
        return _storedNumber;
    }
}