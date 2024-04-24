pragma solidity ^0.8.0;

contract SimpleStorage {
    
    uint256 private storedData;

    function set(uint256 num) public {
        storedData = num;
    }

    function get() public view returns (uint256){
        return storedData;
    }
}