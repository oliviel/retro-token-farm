// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./DaiToken.sol";
import "./RetroToken.sol";

contract TokenFarm is Ownable {
    string public name = "Token Farm";
    RetroToken public retroToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RetroToken _retroToken, DaiToken _daiToken) {
        retroToken = _retroToken;
        daiToken = _daiToken;
    }

    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "amount cannot be 0");

        daiToken.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];

        require(balance > 0, "staking balance cannot be 0");

        daiToken.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;

        isStaking[msg.sender] = false;
    }

    function issueTokens() public onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                retroToken.transfer(recipient, balance);
            }
        }
    }
}
