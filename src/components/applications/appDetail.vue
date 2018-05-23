<template>
    <div class="app-detail">
        <el-row>
            <el-col :span="20">
                <div class="table">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="tc options dragon"
                                 @click="bet('dragon')"
                                 :class="{choosed: choosed === 'dragon'}">
                                龙
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="tc options leopard"
                                 @click="bet('leopard')"
                                 :class="{choosed: choosed === 'leopard'}">
                                合
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="tc options tiger"
                                 @click="bet('tiger')"
                                 :class="{choosed: choosed === 'tiger'}">
                                虎
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <div class="tc money"
                                 @click="betMoney('1')"
                                 :class="{choosed: betChoosed === '1'}">
                                1
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="tc money"
                                 @click="betMoney('2')"
                                 :class="{choosed: betChoosed === '2'}">
                                2
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="tc money"
                                 @click="betMoney('5')"
                                 :class="{choosed: betChoosed === '5'}">
                                5
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="tc money"
                                 @click="betMoney('10')"
                                 :class="{choosed: betChoosed === '10'}">
                                10
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="4">
                <ul class="menu">
                    <li class="tl back">
                        <router-link :to='{path: "/mainScreen/applications"}'>返回主页 >></router-link>
                    </li>
                    <li>本轮"龙"的下注币数为：{{ betCoin[1] }} wei</li>
                    <li>本轮"虎"的下注币数为：{{ betCoin[2] }} wei</li>
                    <li>本轮"合"的下注币数为：{{ betCoin[3] }} wei</li>
                    <li style="margin-bottom: 40px">
                        本轮倒计时：还剩
                        <span style="color: #f00">{{ countDown }}</span>
                        秒
                    </li>
                    <li v-if="betZh === ''">请先下注！</li>
                    <li v-else>你已选中： <span style="color: #f00">“{{ betZh }}”</span></li>
                    <li>下注金额为：<span style="color: #f00">“{{ moneyNum }}”</span> * 10 ^ 6 wei</li>
                    <li>上轮结果为：
                        <span style="color: #f00">“龙”：{{ dragonNum }} </span>
                        <span style="color: #f00">“虎”：{{ tigerNum }}</span>
                    </li>
                    <li>
                        <el-button type="primary" @click="callContract" :disabled="betAllowed">下注</el-button>
                    </li>
                </ul>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import playGameContract from '../../../contracts/playGame.json'
    import axios from 'axios'

    export default {
        name: "app-detail",
        data() {
            return {
                betCoin: [0, 0, 0, 0],
                choosed: '', // 龙虎合选中的标识
                betChoosed: '', // 金额选中的标识
                betZh: '',
                moneyNum: 0,
                countDown: 120,
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
                    case 'leopard':
                        this.betZh = '2'
                        break
                    case 'tiger':
                        this.betZh = '1'
                        break
                    default:
                        return false
                }
            },
            betMoney(num) {
                this.betChoosed = num
                this.moneyNum = num
            },
            // 开启监控
            settlement() {
                this.$store.commit('setCryptPercent',{percent: true,text: '正在结算···'})
                let event = this.myContractInstance.returnBetPoints()
                event.watch((err, result) => {
                    event.stopWatching()
                    this.$store.commit('setCryptPercent',{percent: false,text: '正在结算···'})
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
            callContract() {
                if(!this.chargeLegality()){
                    return false
                }
                console.log(this.myContractInstance.getCurrentBalance().toString(10))
                let params = {
                    addr: this.$store.state.publicKey,
                    cho: this.betZh,
                    ran: parseInt(Math.random() * (10 ** 12)),
                    // coin: this.$web3.toWei(this.moneyNum, 'ether'),
                    coin: this.moneyNum * Math.pow(10, 6),
                }
                if (params.cho === '') {
                    this.$message.error('请先选择一方下注！')
                    return
                }
                if (params.coin === 0) {
                    this.$message.error('请先选择或输入下注金额！')
                    return
                }
                this.$store.commit('setCryptPercent',{percent: true,text: '正在下注···'})
                this.$web3.personal.unlockAccount("0x27d024958a6105a5c8cbd95a8ecb1ff35ad91016", 'jacky')
                // 监听是否下注失败
                let betResult = this.myContractInstance.returnBetResult()
                betResult.watch((err, result) => {
                    betResult.stopWatching()
                    this.$store.commit('setCryptPercent',{percent: false,text: '正在下注···'})
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
            chargeLegality(){
                let arr =[]
                try {
                    arr = this.myContractInstance.getPrice()
                    if(arr.length === 0){
                        this.$message({
                            type: 'error',
                            message: "合约地址有误，请检查合约地址是否正确",
                        })
                        return false
                    }
                    return true
                } catch (err){
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
        beforeDestroy(){
            clearInterval(this.getCoinsTimer)
            clearInterval(this.timer)
        },
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .table {
        width: 90%;
        margin: 0 auto;
        .el-row {
            margin: 80px 0;
            &:last-child {
                margin-bottom: 0;
            }
            .el-col {
                border-radius: 4px;
                .options {
                    border-radius: 4px;
                    cursor: pointer;
                    height: 400px;
                    line-height: 400px;
                    font-size: 200px;
                    background: #d3dce6;
                    &.choosed {
                        color: #034D3B;
                        background: #4DAD95;
                    }
                }
                .money {
                    height: 100px;
                    line-height: 100px;
                    font-size: 50px;
                    width: 60%;
                    cursor: pointer;
                    margin: 0 auto;
                    border-radius: 50px;
                    background: #D3DCE6;
                    &.choosed {
                        color: #034D3B;
                        background: #4DAD95;
                    }
                }
            }
        }
    }

    .menu {
        margin: 80px 0;
        li {
            margin: 20px 0;
            &.back {
                margin-bottom: 40px;
                a {
                    color: #f00;
                }
            }
        }
    }
</style>
