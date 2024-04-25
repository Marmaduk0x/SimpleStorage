// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnhancedSimpleStorage {
    
    uint256 private _storedNumber;

    function storeNumber(uint256 number) public {
        _storedNumber = number;
    }

    function retrieveNumber() public view returns (uint256){
        return _storedNumber;
    }
}