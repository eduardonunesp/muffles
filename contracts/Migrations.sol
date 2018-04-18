pragma solidity ^0.4.22;

contract Migrations {
  address public owner;
  uint public lastCompletedMigration;

  modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner is allowed to upgrade");
    _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function setCompleted(uint completed) public onlyOwner {
    lastCompletedMigration = completed;
  }

  function upgrade(address new_address) public onlyOwner {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(lastCompletedMigration);
  }
}
