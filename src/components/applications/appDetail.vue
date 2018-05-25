<template>
    <div class="app-detail no-select-text">
        <i class="exit"></i>
        <div class="game-content">
            <div class="game-body">
                <div class="game-result">
                    <p>近 5 局出牌结果</p>
                    <div>
                        <span v-for="(item,index) in resultList" :key="index">{{item}}</span>
                    </div>
                </div>
                <div class="game-talbe">
                    <p class="time-remaining">剩余下注时间 <span>{{countDown}}</span> 秒</p>
                    <div class="selectable">
                        <div class="item-1">
                            <p>
                                <i>
                                    <img src="../../assets/images/longhudou/dragon.png">
                                </i>
                            </p>
                            <p>
                                <input v-model="betCoin[1]" readonly>
                            </p>
                            <p>
                                <span :class="{selected:choosed==='dragon'}" @click="callContract('dragon')"></span>
                            </p>
                        </div>
                        <div class="item-2">
                            <p>
                                <i>
                                    <img src="../../assets/images/longhudou/with.png">
                                </i>
                            </p>
                            <p>
                                <input v-model="betCoin[3]" readonly>
                            </p>
                            <p>
                                <span :class="{selected:choosed==='leopard'}" @click="callContract('leopard')"></span>
                            </p>
                        </div>
                        <div class="item-3">
                            <p>
                                <i>
                                    <img src="../../assets/images/longhudou/tiger.png">
                                </i>
                            </p>
                            <p>
                                <input v-model="betCoin[2]" readonly>
                            </p>
                            <p>
                                <span :class="{selected:choosed==='tiger'}" @click="callContract('tiger')"></span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="bet-amount">
                    <div class="choose-item" @click="selectAnItem(0)">
                        <i v-show="isSelected === 0"></i>
                        <div>
                            <span class="amount" v-for="(item,index) in amount1" :key="index"
                                  :class="'amount'+item"></span>
                        </div>
                    </div>
                    <div class="choose-item" @click="selectAnItem(1)">
                        <i v-show="isSelected === 1"></i>
                        <div>
                            <span class="amount" v-for="(item,index) in amount2" :key="index"
                                  :class="'amount'+item"></span>
                        </div>
                    </div>
                    <div class="choose-item" @click="selectAnItem(2)">
                        <i v-show="isSelected === 2"></i>
                        <div>
                            <span class="amount" v-for="(item,index) in amount3" :key="index"
                                  :class="'amount'+item"></span>
                        </div>
                    </div>
                    <div class="input-item">
                        <p>下注金额</p>
                        <p>
                            <input maxlength="15" v-model="moneyNum">
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!--<el-row>-->
        <!--<el-col :span="20">-->
        <!--<div class="table">-->
        <!--<el-row :gutter="20">-->
        <!--<el-col :span="8">-->
        <!--<div class="tc options dragon"-->
        <!--@click="bet('dragon')"-->
        <!--:class="{choosed: choosed === 'dragon'}">-->
        <!--龙-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
        <!--<div class="tc options leopard"-->
        <!--@click="bet('leopard')"-->
        <!--:class="{choosed: choosed === 'leopard'}">-->
        <!--合-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
        <!--<div class="tc options tiger"-->
        <!--@click="bet('tiger')"-->
        <!--:class="{choosed: choosed === 'tiger'}">-->
        <!--虎-->
        <!--</div>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--<el-row :gutter="20">-->
        <!--<el-col :span="6">-->
        <!--<div class="tc money"-->
        <!--@click="betMoney('1')"-->
        <!--:class="{choosed: betChoosed === '1'}">-->
        <!--1-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
        <!--<div class="tc money"-->
        <!--@click="betMoney('2')"-->
        <!--:class="{choosed: betChoosed === '2'}">-->
        <!--2-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
        <!--<div class="tc money"-->
        <!--@click="betMoney('5')"-->
        <!--:class="{choosed: betChoosed === '5'}">-->
        <!--5-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
        <!--<div class="tc money"-->
        <!--@click="betMoney('10')"-->
        <!--:class="{choosed: betChoosed === '10'}">-->
        <!--10-->
        <!--</div>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="4">-->
        <!--<ul class="menu">-->
        <!--<li class="tl back">-->
        <!--<router-link :to='{path: "/mainScreen/applications"}'>返回主页 >></router-link>-->
        <!--</li>-->
        <!--<li>本轮"龙"的下注币数为：{{ betCoin[1] }} wei</li>-->
        <!--<li>本轮"虎"的下注币数为：{{ betCoin[2] }} wei</li>-->
        <!--<li>本轮"合"的下注币数为：{{ betCoin[3] }} wei</li>-->
        <!--<li style="margin-bottom: 40px">-->
        <!--本轮倒计时：还剩-->
        <!--<span style="color: #f00">{{ countDown }}</span>-->
        <!--秒-->
        <!--</li>-->
        <!--<li v-if="betZh === ''">请先下注！</li>-->
        <!--<li v-else>你已选中： <span style="color: #f00">“{{ betZh }}”</span></li>-->
        <!--<li>下注金额为：<span style="color: #f00">“{{ moneyNum }}”</span> * 10 ^ 6 wei</li>-->
        <!--<li>上轮结果为：-->
        <!--<span style="color: #f00">“龙”：{{ dragonNum }} </span>-->
        <!--<span style="color: #f00">“虎”：{{ tigerNum }}</span>-->
        <!--</li>-->
        <!--<li>-->
        <!--<el-button type="primary" @click="callContract" :disabled="betAllowed">下注</el-button>-->
        <!--</li>-->
        <!--</ul>-->
        <!--</el-col>-->
        <!--</el-row>-->
    </div>
</template>

<script>
    import playGameContract from '../../../contracts/playGame.json'
    import axios from 'axios'

    export default {
        name: "app-detail",
        data() {
            return {
                isSelected: null,
                amountArr: [1,5,10],
                resultList: ['龙', '龙', '虎', '和', '龙'],
                amount1: ['0'],
                amount2: ['0'],
                amount3: ['0'],
                betCoin: [0, 0, 0, 0],
                choosed: null, // 龙虎合选中的标识
                // betChoosed: '', // 金额选中的标识
                betZh: '',
                moneyNum: 0,
                countDown: 60,
                betAllowed: false,
                timer: null, // 页面倒计时定时器
                getCoinsTimer: null,
                dragonNum: '0',
                tigerNum: '0',
                myContractInstance: null,// 智能合约对象
                ContractAddr: ''
            }
        },
        methods: {
            selectAnItem(i) {
                if(i === false) {
                    this.isSelected = null
                    this.moneyNum = 0
                } else {
                    this.isSelected = i
                    this.moneyNum = this.amountArr[i]
                }
            },
            /**
             * 连接合约下注
             */
            contactContract() {
                let MyContract = this.$web3.eth.contract(
                    playGameContract.abi
                )
                this.myContractInstance = MyContract.at(this.ContractAddr)
            },
            bet(sign) {
                this.choosed = sign
                switch (sign) {
                    case 'dragon':
                        this.betZh = '0'
                        break
                    case 'tiger':
                        this.betZh = '1'
                        break
                    case 'leopard':
                        this.betZh = '2'
                        break
                    default:
                        return false
                }
            },
            // betMoney(num) {
            //     this.betChoosed = num
            //     this.moneyNum = num
            // },
            // 开启监控
            settlement() {
                this.$store.commit('setCryptPercent', {percent: true, text: '正在结算···'})
                let event = this.myContractInstance.returnBetPoints()
                event.watch((err, result) => {
                    console.log(result);
                    event.stopWatching()
                    this.$store.commit('setCryptPercent', {percent: false, text: '正在结算···'})
                    if (err) {
                        this.$message.error('节点异常！')
                        return
                    }
                    if (result.args) {
                        this.dragonNum = result.args.dragonNum % 13
                        this.tigerNum = result.args.tigerNum % 13
                        console.log(this.dragonNum, this.tigerNum)
                        console.log(this.myContractInstance.getCurrentBalance().toString(10))
                        this.getTimerTime()
                        this.betAllowed = false
                    } else {
                        this.$message.error('节点异常！')
                    }
                })
            },
            /**
             * 下注
             */
            callContract(sign) {
                if (!this.chargeLegality()) {
                    return false
                }
                this.bet(sign)
                console.log(this.myContractInstance.getCurrentBalance().toString(10))
                let params = {
                    addr: this.$store.state.publicKey,
                    cho: this.betZh,
                    ran: parseInt(Math.random() * (10 ** 12)),
                    // coin: this.$web3.toWei(this.moneyNum, 'ether'),
                    coin: this.moneyNum * Math.pow(10, 6),
                }
                if (params.coin === 0) {
                    this.$message.error('请选择或输入下注金额！')
                    return false
                }
                this.$store.commit('setCryptPercent', {percent: true, text: '正在下注···'})
                // this.$web3.personal.unlockAccount("0x8ddb5f0b47a027cea553c58734389dd4ed7ff7f5", 'jacky0011')
                this.$web3.personal.unlockAccount("0x27d024958a6105a5c8cbd95a8ecb1ff35ad91016", 'jacky')
                // 监听是否下注失败
                let betResult = this.myContractInstance.returnBetResult()
                betResult.watch((err, result) => {
                    betResult.stopWatching()
                    this.$store.commit('setCryptPercent', {percent: false, text: ''})
                    if (err) {
                        this.$message.error('下注失败！')
                        return
                    }
                    if (result.args._bool) {
                        this.$message.success('下注成功！请等待下注结果！')
                        this.betAllowed = true
                    } else {
                        this.$message.error('下注失败！本局已封盘（奖池金额不够）')
                    }
                })
                this.myContractInstance.sendBetInfo(params.addr, params.cho, params.ran, params.coin, {
                    // from: "0x8ddb5f0b47a027cea553c58734389dd4ed7ff7f5",
                    from: "0x27d024958a6105a5c8cbd95a8ecb1ff35ad91016",
                    gasPrice: 200000000000,
                    value: params.coin,
                    gas: this.$web3.eth.estimateGas({data: playGameContract.bytecode})
                })
            },
            /**
             * 页面定时器
             */
            interval() {
                this.timer = setInterval(() => {
                    this.countDown--
                    if (this.countDown === 1) {
                        clearInterval(this.timer)
                        this.settlement()
                    }
                }, 1000)
            },
            // 获取服务器定时器时间
            getTimerTime() {
                axios.get('http://39.104.81.103:8088')
                // axios.get('http://192.168.1.124:8089')
                    .then((res) => {
                        this.countDown = res.data
                        this.interval()
                    })
                    .catch(function (error) {
                        this.$message.error('节点异常，无法获取时间')
                    })
            },
            /**
             * 获取路由地址，得到合约地址
             */
            getContractAddr() {
                let url = window.location.href.split('?')
                this.ContractAddr = url[1]
                if (this.ContractAddr === undefined
                    || this.ContractAddr === "null"
                    || this.ContractAddr === "") {
                    if (sessionStorage.getItem('userContract') === undefined) {
                        this.$message.error('无效地址，请先创建合约或输入有效地址！')
                        let timer = setTimeout(() => {
                            clearTimeout(timer)
                            this.$router.replace({name: 'accountInfo'})
                        }, 2000)
                        return false
                    }
                    this.ContractAddr = sessionStorage.getItem('userContract')
                    return true
                }
                return true
            },
            chargeLegality() {
                let arr = []
                try {
                    arr = this.myContractInstance.getPrice()
                    if (arr.length === 0) {
                        this.$message({
                            type: 'error',
                            message: "合约地址有误，请检查合约地址是否正确",
                        })
                        return false
                    }
                    this.amountArr = []
                    this.amountArr.push(arr[0].toJSON())
                    this.amountArr.push(arr[1].toJSON())
                    this.amountArr.push(arr[2].toJSON())

                    this.amount1 = arr[0].toString().split('')
                    this.amount2 = arr[1].toString().split('')
                    this.amount3 = arr[2].toString().split('')

                    return true
                } catch (err) {
                    this.$message({
                        type: 'error',
                        message: String(err),
                    })
                    return false
                }
            }
        },
        mounted() {
            if (this.getContractAddr()) {
                this.contactContract()
                if(!this.chargeLegality()){
                    return false
                }
                // 实时获取下注币数
                this.getCoinsTimer = setInterval(() => {
                    this.betCoin.length = 0
                    let arr = this.myContractInstance.getTotalCoins()
                    if (arr) {
                        this.betCoin = arr
                    }
                }, 1000)
                this.getTimerTime()
            }
        },
        deactivated() {
            clearInterval(this.getCoinsTimer)
            clearInterval(this.timer)
        },
        beforeDestroy() {
            clearInterval(this.getCoinsTimer)
            clearInterval(this.timer)
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .app-detail {
        width: 100%;
        height: 100%;
        background: url("../../assets/images/longhudou/lhd_bg.jpg") no-repeat;
        background-size: cover;
        position: relative;
        z-index: 999;

        .exit {
            display: inline-block;
            width: 40px;
            height: 40px;
            position: absolute;
            top: 40px;
            left: 40px;
            background: url("../../assets/images/longhudou/close.png") no-repeat;
            cursor: pointer;
            &:hover {
                background: url("../../assets/images/longhudou/close_hover.png") no-repeat;
            }
        }
        .game-content {
            width: 996px;
            height: 560px;
            padding: 10px;
            box-shadow: 0px 14px 40px 0px rgba(11, 6, 27, 0.5);
            border-radius: 5px;
            border: solid 2px rgba(198, 157, 226, 0.25);
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            text-align: center;
            input {
                background: none;
                border: none;
                text-align: center;
            }
            input:focus {
                outline: none;
            }

            .game-body {
                height: 100%;
                position: relative;
                background: url("../../assets/images/longhudou/table_bg.jpg") no-repeat;
                &:before {
                    content: '';
                    display: table;
                }

                .game-result {
                    width: 152px;
                    height: 62px;
                    background: url("../../assets/images/longhudou/results_bg.png") no-repeat;
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    font-size: 15px;

                    p {
                        color: #9f7382;
                        margin-top: 11px;
                    }
                    div {
                        line-height: 30px;
                        color: #be7953;
                        span {
                            padding: 0 5px;
                        }
                    }
                }
                .game-talbe {
                    height: 420px;
                    width: 800px;
                    background: url("../../assets/images/longhudou/table.png") no-repeat;
                    margin: 35px auto 0;

                    .time-remaining {
                        padding-top: 84px;
                        font-size: 16px;
                        color: rgba(255, 144, 89, 0.73);
                    }

                    .selectable {
                        div {
                            display: inline-block;
                            margin-top: 10px;
                            padding: 0 30px;
                            p {
                                i {
                                    display: inline-block;
                                    width: 120px;
                                    height: 130px;
                                    background: url("../../assets/images/longhudou/bet_bg.png") no-repeat;
                                    img {
                                        vertical-align: center;
                                        margin-top: 35px;
                                    }
                                }
                                input {
                                    background: url("../../assets/images/longhudou/bet_number_bg.png") no-repeat;
                                    margin-top: 5px;
                                    width: 122px;
                                    height: 26px;
                                    font-size: 14px;
                                    color: #cdc075;
                                }
                                span {
                                    display: inline-block;
                                    width: 99px;
                                    height: 44px;
                                    line-height: 36px;
                                    margin-top: 10px;
                                    background: url("../../assets/images/longhudou/btn_bet.png") no-repeat;
                                    /*font-size: 18px;
                                    color: #fff5e1;
                                    text-shadow: 2px 0 2px #704C2F, 0 2px 2px #704C2F, -2px 0 2px #704C2F, 0 -2px 2px #704C2F;
                                    -webkit-text-shadow: 2px 0 2px #704C2F, 0 2px 2px #704C2F, -2px 0 2px #704C2F, 0 -2px 2px #704C2F;
                                    -moz-text-shadow: 2px 0 2px #704C2F, 0 2px 2px #704C2F, -2px 0 2px #704C2F, 0 -2px 2px #704C2F;*/
                                    &:hover {
                                        background: url("../../assets/images/longhudou/btn_bet_hover.png") no-repeat;
                                    }
                                    &.selected {
                                        background: url("../../assets/images/longhudou/btn_bet_active.png") no-repeat;
                                    }
                                }
                            }
                        }
                    }
                }

                .bet-amount {
                    width: 650px;
                    margin: -40px auto 0;
                    height: 150px;
                    .choose-item {
                        float: left;
                        width: 150px;
                        height: 100%;
                        position: relative;
                        background: url("../../assets/images/longhudou/chips.png") no-repeat;
                        i {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 150px;
                            height: 150px;
                            background: url("../../assets/images/longhudou/chips_xz.png") no-repeat;
                        }
                        div {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            -webkit-transform: translate(-50%, -50%);
                            -moz-transform: translate(-50%, -50%);
                            -ms-transform: translate(-50%, -50%);
                            -o-transform: translate(-50%, -50%);
                            transform: translate(-50%, -50%);
                        }
                    }
                    .input-item {
                        float: left;
                        width: 177px;
                        height: 100%;
                        padding-top: 30px;
                        margin-left: 20px;
                        font-size: 17px;
                        color: #be7953;
                        line-height: 30px;
                        input {
                            height: 48px;
                            background: url("../../assets/images/longhudou/input.png") no-repeat;
                            color: #be7953;
                        }
                    }
                    .amount {
                        display: inline-block;
                        width: 24px;
                        height: 28px;
                    }
                    .amount0 {
                        background: url("../../assets/images/longhudou/number.png") -5px -5px no-repeat;
                    }
                    .amount1 {
                        background: url("../../assets/images/longhudou/number.png") -39px -5px no-repeat;
                    }
                    .amount2 {
                        background: url("../../assets/images/longhudou/number.png") -75px -5px no-repeat;
                    }
                    .amount3 {
                        background: url("../../assets/images/longhudou/number.png") -111px -5px no-repeat;
                    }
                    .amount4 {
                        background: url("../../assets/images/longhudou/number.png") -145px -5px no-repeat;
                    }
                    .amount5 {
                        background: url("../../assets/images/longhudou/number.png") -181px -5px no-repeat;
                    }
                    .amount6 {
                        background: url("../../assets/images/longhudou/number.png") -215px -5px no-repeat;
                    }
                    .amount7 {
                        background: url("../../assets/images/longhudou/number.png") -251px -5px no-repeat;
                    }
                    .amount8 {
                        background: url("../../assets/images/longhudou/number.png") -285px -5px no-repeat;
                    }
                    .amount9 {
                        background: url("../../assets/images/longhudou/number.png") -321px -5px no-repeat;
                    }
                }
            }
        }
    }

    /*.table {*/
    /*width: 90%;*/
    /*margin: 0 auto;*/
    /*.el-row {*/
    /*margin: 80px 0;*/
    /*&:last-child {*/
    /*margin-bottom: 0;*/
    /*}*/
    /*.el-col {*/
    /*border-radius: 4px;*/
    /*.options {*/
    /*border-radius: 4px;*/
    /*cursor: pointer;*/
    /*height: 400px;*/
    /*line-height: 400px;*/
    /*font-size: 200px;*/
    /*background: #d3dce6;*/
    /*&.choosed {*/
    /*color: #034D3B;*/
    /*background: #4DAD95;*/
    /*}*/
    /*}*/
    /*.money {*/
    /*height: 100px;*/
    /*line-height: 100px;*/
    /*font-size: 50px;*/
    /*width: 60%;*/
    /*cursor: pointer;*/
    /*margin: 0 auto;*/
    /*border-radius: 50px;*/
    /*background: #D3DCE6;*/
    /*&.choosed {*/
    /*color: #034D3B;*/
    /*background: #4DAD95;*/
    /*}*/
    /*}*/
    /*}*/
    /*}*/
    /*}*/

    /*.menu {*/
    /*margin: 80px 0;*/
    /*li {*/
    /*margin: 20px 0;*/
    /*&.back {*/
    /*margin-bottom: 40px;*/
    /*a {*/
    /*color: #f00;*/
    /*}*/
    /*}*/
    /*}*/
    /*}*/
</style>
