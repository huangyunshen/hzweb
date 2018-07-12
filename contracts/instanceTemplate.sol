pragma solidity ^0.4.0;

contract instanceTemplate {
    uint public gameType;
    address public creator = msg.sender;
    uint public creationTime;
    uint public historyTotalCoins = 0; // 历史下注总额

    function deposit() public payable { }

    function drawings(uint _coin) payable {
//        if (msg.sender == creator) {
//            uint _balance = getCurrentBalance();
//            if ((_balance - _coin) / 10 > totalCoins) {
//                transferCoin(creator, _coin);
//            }
//        }
    }
}
