// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract DaiToken {
    using SafeMath for uint256;

    string public name = "MOCK Dai Token";
    string public symbol = "mDAI";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
    uint8 public decimals = 18;

    event Transfer(address indexed _from, address _to, uint256 _amount);

    event Approval(address indexed _owner, address _spender, uint256 _amount);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _amount)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _amount);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_amount);
        balanceOf[_to] = balanceOf[_to].add(_amount);
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function approve(address _spender, uint256 _amount)
        public
        returns (bool succcess)
    {
        allowance[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool success) {
        require(_amount <= balanceOf[_from]);
        require(_amount <= allowance[_from][msg.sender]);
        balanceOf[_from] = balanceOf[_from].sub(_amount);
        balanceOf[_to] = balanceOf[_to].add(_amount);
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(
            _amount
        );
        emit Transfer(_from, _to, _amount);
        return true;
    }
}
