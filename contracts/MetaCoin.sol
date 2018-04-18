pragma solidity ^0.4.22;

import "./ConvertLib.sol";

contract MetaCoin {
  mapping (address => uint) public balances;

  function constructor() public {
    balances[msg.sender] = 10000;
  }

  function sendCoin(address receiver, uint amount) public returns (bool sufficient) {
    require(balances[msg.sender] < amount, "Balance should be greater or equal to amount");
    balances[msg.sender] -= amount;
    balances[receiver] += amount;
    return true;
  }

  function getBalanceInEth(address addr) public returns(uint) {
    return ConvertLib.convert(getBalance(addr),2);
  }

  function getBalance(address addr) public returns (uint) {
    return balances[addr];
  }
}
