<template>
    <div class="app-detail no-select-text">
        <i class="exit" @click="exit"></i>
        <div class="game-content">
            <div class="game-body-background">
                <div class="game-body">
                    <div class="pool-balance">
                        奖池余额：96535 FOF
                    </div>
                    <div class="game-talbe">
                        <p class="time-remaining">剩余下注时间 <span>{{countDown}}</span> 秒</p>
                        <div class="selectable">
                            <div class="item-1">
                                <p>
                                    <i class="table-unit">
                                        <i>总1000</i>
                                        <img src="../../assets/images/longhudou/dragon.png">
                                        <div>2倍</div>
                                    </i>
                                </p>
                                <p>
                                    <b>{{betCoin[1]}}</b>
                                </p>
                                <p>
                                    <span :class="{selected:choosed==='dragon'}" @click="callContract('dragon')"></span>
                                </p>
                            </div>
                            <div class="item-2">
                                <p>
                                    <i class="table-unit">
                                        <i>总1000</i>
                                        <img src="../../assets/images/longhudou/with.png">
                                        <div>8倍</div>
                                    </i>
                                </p>
                                <p>
                                    <b>{{betCoin[3]}}</b>
                                </p>
                                <p>
                                    <span :class="{selected:choosed==='leopard'}"
                                          @click="callContract('leopard')"></span>
                                </p>
                            </div>
                            <div class="item-3">
                                <p>
                                    <i class="table-unit">
                                        <i>总1000</i>
                                        <img src="../../assets/images/longhudou/tiger.png">
                                        <div>2倍</div>
                                    </i>
                                </p>
                                <p>
                                    <b>{{betCoin[2]}}</b>
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
                    <div class="modal" v-show="showResult">
                        <div class="modal-content">
                            <div class="modal-result-text"></div>
                            <div class="modal-result-content">
                                <div class="modal-result-left">
                                    <p>
                                        <span class="modal-result-icon1"></span>
                                    </p>
                                    <p>
                                        <span class="modal-result-winicon"></span>
                                        <span class="modal-result-icon2"></span>
                                    </p>
                                    <p>
                                        <span class="modal-result-winicon"></span>
                                        <span class="modal-result-icon3"></span>
                                    </p>
                                    <p>
                                        <span class="modal-result-winicon"></span>
                                        <span class="modal-result-icon4"></span>
                                    </p>
                                </div>
                                <div class="modal-result-right">
                                    <p>+1000</p>
                                    <p class="modal-result-cardicon poker-2"></p>
                                    <p class="modal-result-cardicon poker-52"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="game-record">
                <div class="game-result-history">
                    <div class="game-history-title">历史出牌结果</div>
                    <p class="game-history-line"></p>
                    <div class="game-result-content">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="game-pour-history">
                    <div class="game-history-title">下注记录</div>
                    <p class="game-history-line"></p>
                    <div class="game-pour-content">
                        <el-row class="game-pour-title">
                            <el-col :span="8">下注对象</el-col>
                            <el-col :span="8">下注金额</el-col>
                            <el-col :span="8">输赢金额</el-col>
                        </el-row>
                        <div class="game-pour-body">
                            <el-row>
                                <el-col :span="8"><span class="game-pour-icon"></span></el-col>
                                <el-col :span="8"><span class="game-pour-num">500</span></el-col>
                                <el-col :span="8"><span class="game-pour-win">+100</span></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8"><span class="game-pour-icon"></span></el-col>
                                <el-col :span="8"><span class="game-pour-num">500</span></el-col>
                                <el-col :span="8"><span class="game-pour-win">+100</span></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8"><span class="game-pour-icon"></span></el-col>
                                <el-col :span="8"><span class="game-pour-num">500</span></el-col>
                                <el-col :span="8"><span class="game-pour-win">+100</span></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8"><span class="game-pour-icon"></span></el-col>
                                <el-col :span="8"><span class="game-pour-num">500</span></el-col>
                                <el-col :span="8"><span class="game-pour-win">+100</span></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8"><span class="game-pour-icon"></span></el-col>
                                <el-col :span="8"><span class="game-pour-num">500</span></el-col>
                                <el-col :span="8"><span class="game-pour-win">+100</span></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8"><span class="game-pour-icon"></span></el-col>
                                <el-col :span="8"><span class="game-pour-num">500</span></el-col>
                                <el-col :span="8"><span class="game-pour-win">+100</span></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8"><span class="game-pour-icon"></span></el-col>
                                <el-col :span="8"><span class="game-pour-num">500</span></el-col>
                                <el-col :span="8"><span class="game-pour-win">+100</span></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8"><span class="game-pour-icon"></span></el-col>
                                <el-col :span="8"><span class="game-pour-num">500</span></el-col>
                                <el-col :span="8"><span class="game-pour-win">+100</span></el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-button class="exit show-source" type="button" @click="showSource">智能合约源码</el-button>
        <el-dialog title="智能合约源码"
                   :modal="false"
                   class="create-wallet-dialog app-detail-font"
                   :visible.sync="showSourceVisible">
            <div style="height: 500px;overflow: auto">
                <pre>{{ contractSource }}</pre>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import playGameContract from '../../../contracts/playGame.json'
    import axios from 'axios'

    export default {
        name: "app-detail",
        data() {
            return {
                showResult:false,
                showSourceVisible: false,
                isSelected: null,
                amountArr: [1, 5, 10],
                resultList: ['3', '3', '3', '3', '3'],
                amount1: ['0'],
                amount2: ['0'],
                amount3: ['0'],
                betCoin: [0, 0, 0, 0],
                choosed: null, // 龙虎合选中的标识
                betZh: '',
                moneyNum: 0,
                countDown: -1,
                timer: null, // 页面倒计时定时器
                getCoinsTimer: null,
                dragonNum: '0',
                tigerNum: '0',
                myContractInstance: null,// 智能合约对象
                ContractAddr: '',
                contractSource: '',
                settleTime: '',
                getSettleResTimer: null, //获取下注结果的定时器
            }
        },
        filters: {
            getBetResHis: function (value) {
                let res = ""
                switch (value) {
                    case '0':
                        res = "龙"
                        break
                    case '1':
                        res = "虎"
                        break
                    case '2':
                        res = "和"
                        break
                    default:
                        res = "-"
                }
                return res
            }
        },
        methods: {
            // 显示合约源码
            showSource() {
                let url = window.location.href.split('?')[1]
                this.$axios.post('/api/requestContract.php', {
                    "createAddr": "",
                    "contractAddr": url
                }).then((res) => {
                    if (res.status === 200) {
                        this.showSourceVisible = true
                        this.contractSource = this.$web3.eth.getTransaction(res.data[0].txHash).datasourcecode
                    }
                }).catch((error) => {
                    this.$message.error(String(error))
                })
            },
            selectAnItem(i) {
                if (i === false) {
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
                this.resultList = this.myContractInstance.getResultHistory().map((item) => {
                    return item.toString(10)
                })
            },
            bet(sign) {
                // this.choosed = sign
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
            // 开启监控
            settlement() {
                if(this.countDown === 0){
                    this.showSourceVisible = false
                    this.$store.commit('setCryptPercent', {percent: true, text: '正在结算···'})
                }
                // let arr = this.myContractInstance.getBlockTime()
                // console.log(arr[0].toString(10)
                //     ,arr[1].toString(10),
                //     arr[2].toString(10)
                // ,arr[3].toString(10)
                //     ,arr[4][0].toString(10)
                //     ,arr[4][1].toString(10)
                //     ,arr[5].toString(10))
                let nowTime = this.myContractInstance.getBlockTime()[0].toString(10)
                if (this.settleTime !== nowTime) { // 说明结算了
                    //结算逻辑
                    this.settleTime = nowTime;
                    this.dragonNum = this.myContractInstance.getBlockTime()[4][0].toString(10)
                    this.tigerNum = this.myContractInstance.getBlockTime()[4][1].toString(10)
                    this.$message({
                        message: `结果为 龙：${this.dragonNum} 虎：${this.tigerNum}`,
                        type: 'success',
                    })
                    this.resultList = this.myContractInstance.getResultHistory().map((item) => {
                        return item.toString(10)
                    })
                    //结算完
                    this.$store.commit('setCryptPercent', {percent: false, text: ''})
                    this.getTimerTime()
                }

            },
            confirmBet(sign) {
                this.bet(sign)
                let users = this.$funs.getLocalAddress()
                let user = users.addresses[users.active]
                let params = {
                    addr: user,
                    cho: this.betZh,
                    ran: parseInt(Math.random() * (10 ** 12)),
                    coin: this.$web3.toWei(this.moneyNum, 'ether'),
                }
                if (this.$store.state.passwordOfPlay !== '') {
                    try {
                        this.$web3.personal.unlockAccount(user, this.$store.state.passwordOfPlay, 6000000)
                        this.betFun(user, params)
                    } catch (err) {
                        this.$message.error(String(err))

                    }
                } else {
                    this.$prompt(`请输入${user}的密码`, '提示', {
                        inputType: 'password',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({value}) => {
                        try {
                            this.$web3.personal.unlockAccount(user, value, 6000000)
                            this.$confirm('是否临时保存密码，页面在刷新或者关闭后自动清除', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.$store.commit("setPlayPassword", value)
                                this.betFun(user, params)
                            }).catch(() => {
                                this.betFun(user, params)
                            })
                        } catch (err) {
                            this.$message.error(String(err))
                            this.$store.commit('setCryptPercent', {percent: false, text: ''})
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            },
            /**
             * 下注
             */
            callContract(sign) {
                if (isNaN(this.moneyNum)) {
                    this.$message.error('下注金额不能为非数字！')
                    return false
                }
                if (Number(this.moneyNum) === 0) {
                    this.$message.error('请选择或输入下注金额！')
                    return false
                }
                if (!this.chargeLegality()) {
                    return false
                }
                this.$confirm('确认下注吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.confirmBet(sign)
                }).catch(() => {
                })
            },

            betFun(user, params) {
                this.$store.commit('setCryptPercent', {percent: true, text: '正在下注···'})
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
                    } else {
                        this.$message.error('下注失败！本局已封盘（奖池金额不够）')
                    }
                })
                let hash = this.myContractInstance.sendBetInfo(params.addr, params.cho, params.ran, params.coin, {
                    from: user,
                    gasPrice: 200000000000,
                    value: params.coin,
                    gas: this.$web3.eth.estimateGas({data: playGameContract.bytecode})
                })
                let txObj = this.$web3.eth.getTransaction(hash)
                this.$axios.post('/api/addTx.php', {
                    "type": "1",
                    "sendAddr": txObj.from,
                    "revAddr": txObj.to,
                    "txHash": txObj.hash,
                }).then((res) => {
                    if (res.status === 200) {
                        // console.log(res)
                    }
                }).catch((error) => {
                    this.$message.error(String(error))
                })
            },

            // 获取服务器定时器时间
            getTimerTime() {
                axios.get('http://39.104.81.103:8088')
                    .then((res) => {
                        this.countDown = res.data
                    })
                    .catch(() => {
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
                if (!this.$web3.isAddress(this.ContractAddr)) {
                    this.$message.error('无效地址，请先创建合约或输入有效地址！')
                    return false
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
            },
            exit() {
                this.$router.replace({name: 'applications'})
            }
        },
        mounted() {
            // if (this.getContractAddr()) {
            //     this.contactContract()
            //     if (!this.chargeLegality()) {
            //         return false
            //     }
            //
            //     //获取当前时间
            //     this.getTimerTime()
            //
            //     //定时器
            //     this.getCoinsTimer = setInterval(() => {
            //         // 实时获取下注币数
            //         this.betCoin.length = 0
            //         let arr = this.myContractInstance.getTotalCoins()
            //         if (arr) {
            //             this.betCoin = arr.map((item) => {
            //                 return this.$web3.fromWei(item.toString(10), 'ether')
            //             })
            //         }
            //         //倒计时
            //         if (this.countDown <= 5) {
            //             this.settlement()
            //         }
            //         if (this.countDown > 0) {
            //             this.countDown--
            //         }
            //
            //     }, 1000)
            //     this.settleTime = this.myContractInstance.getBlockTime()[0].toString(10)
            // }
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
    @import "../../assets/scss/appDetail";
</style>
