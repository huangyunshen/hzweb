pragma solidity ^0.4.0;

contract playGame {
    uint xor = 0; // 保存异或的值
    uint [] randomNum; // 保存传入的随机数
    address [] dragon;  // 保存选龙的地址
    mapping(address => uint) dragonMap; // 选龙用户的下注金额
    address [] tiger;   // 保存选虎的地址
    mapping(address => uint) tigerMap; // 选虎用户的下注金额
    address [] draw;    // 保存选合的地址
    mapping(address => uint) drawMap; // 选合用户的下注金额
    uint time = 0; // 保存上一次结算时出块时间戳
    uint totalCoins = 0; // 下注总币
    uint dragonCoins = 0; // 下注龙总币
    uint tigerCoins = 0; // 下注虎总币
    uint drawCoins = 0; // 下注合总币
    uint [] resultHistory; // 保存历史结果
    // 在全局获取的msg.sender为创建者的地址
    // 在函数中获取的msg.sender为当前调用者的地址
    // 函数中返回的this指当前合约地址
    address creator = msg.sender;

    // 返回是否下注成功
    event returnBetResult(bool _bool);
    // 返回最终结果
    event returnBetPoints(uint dragonNum, uint tigerNum);

    function deposit() payable {

    }

    function getBlockTime() constant returns (uint, uint,uint){
        return (time, block.timestamp, xor);
    }

    // 下注传入信息
    // 如果下注金额大于当前奖池金额，返回false，下注失败
    function sendBetInfo(address addr, uint cho, uint ran, uint coin) payable {
        totalCoins += coin;
        deposit();
        if (getCurrentBalance() / 10 < totalCoins) {
            returnBetResult(false);
        } else {
            if (cho == 0) {
                dragon.push(addr);
                dragonMap[addr] = coin;
                dragonCoins += coin;
                resultHistory.push(0);
            } else if (cho == 1) {
                tiger.push(addr);
                tigerMap[addr] = coin;
                tigerCoins += coin;
                resultHistory.push(1);
            } else if (cho == 2) {
                draw.push(addr);
                drawMap[addr] = coin;
                drawCoins += coin;
                resultHistory.push(2);
            }
            randomNum.push(ran);
            returnBetResult(true);
        }
    }

    // 异或函数,得到结果随机数
    function xorFun() public {
        for (uint i = 0; i < randomNum.length; i++) {
            xor = xor ^ randomNum[i];
        }
    }

    // 获取当前出块时间戳 (单位是秒)
    function getTimestamp() constant returns (uint) {
        return block.timestamp;
    }

    // 处理这个随机数,得到2个值
    function getXorPerson(uint number, uint start, uint long) private returns (uint) {
        uint num = (number % (10 ** (13 - start))) / (10 ** (13 - start - long));
        return num;
    }

    // num1 => 龙
    // num2 => 虎
    function processXor() payable {
        uint num1 = getXorPerson(xor, 2, 4) % 52;
        uint num2 = getXorPerson(xor, 8, 4) % 52;
        uint dNum = num1 % 13;
        uint tNum = num2 % 13;
        if (dNum > tNum) {
            for (uint i = 0; i < dragon.length; i++) {
                transferCoin(dragon[i], dragonMap[dragon[i]] * 2);
            }
        } else if (dNum < tNum) {
            for (uint j = 0; j < tiger.length; j++) {
                transferCoin(tiger[j], tigerMap[tiger[j]] * 2);
            }
        } else {
            for (uint k = 0; k < draw.length; k++) {
                transferCoin(draw[k], drawMap[draw[k]] * 8);
            }
        }
        returnBetPoints(num1, num2);
    }

    // 转账函数
    function transferCoin(address _to, uint _coins) {
        _to.transfer(_coins);
    }

    // 结算函数
    function getResult() {
        //异或后得到了12位的随机数
        xorFun();
        processXor();
        reset();
    }
    // 重置函数
    function reset (){
        xor = 0;
        time = getTimestamp();
        randomNum.length = 0;
        dragon.length = 0;
        tiger.length = 0;
        draw.length = 0;
        totalCoins = 0;
        dragonCoins = 0;
        tigerCoins = 0;
        drawCoins = 0;
    }
    // 返回当前合约账户的余额
    function getCurrentBalance() constant returns (uint256) {
        return this.balance;
    }

    // 返回下注金额
    function getTotalCoins() constant returns (uint, uint, uint, uint) {
        return (totalCoins, dragonCoins, tigerCoins, drawCoins);
    }

    function getMsgValue() constant returns (uint) {
        return msg.value;
    }

    function registerInterval(address contractAddr){
        interval(contractAddr).getAddress(this);
    }
}

contract interval {
    address [] addr;

    function getAddress(address _addr) {
        addr.push(_addr);
    }
    //
    function trigger(){
        for (uint i = 0; i < addr.length; i++) {
            callFeed(addr[i]);
        }
    }
    // 传入合约地址
    function callFeed(address addr) {
        playGame(addr).getResult();
    }
}