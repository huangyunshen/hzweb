<template>
    <div class="app-detail no-select-text">
        <i class="exit" @click="exit"></i>
        <div class="game-content">
            <div class="game-body-background">
                <div class="game-body">
                    <span class="chips"
                          v-for="n in animateChips.number"
                          ref="chipsItem"
                          v-show="animateChips.isShow"
                          :style="{transition: '1s ease-in-out',transitionDelay: n*100 + 'ms'}"
                          data-bool="true"
                          :class="{bottom1: animateChips.isOne,
                          bottom2: animateChips.isTwo,bottom3: animateChips.isThree,
                          bottom4: animateChips.isFour,top: animateChips.isOther}"></span>
                    <transition name="fof-fade">
                        <div class="poker-box left" :class="{'get-poker-result': showPokerResult}"
                             :style="{display: pokerIsShow}">
                            <div class="poker-back poker-show" :class="`poker-${dragonNum+1}`"></div>
                            <div class="poker-back poker-back-show"></div>
                        </div>
                    </transition>
                    <transition name="fof-fade">
                        <div class="poker-box right" :class="{'get-poker-result': showPokerResult}"
                             :style="{display: pokerIsShow}">
                            <div class="poker-back poker-show" :class="`poker-${tigerNum+1}`"></div>
                            <div class="poker-back poker-back-show"></div>
                        </div>
                    </transition>
                    <div class="pool-balance">
                        奖池余额：{{ contractBalance }} FOF
                    </div>
                    <div class="pool-balance" style="left: 20px;right: auto">
                        我的余额：{{ myBalance.toFixed(4) }} FOF
                    </div>
                    <div class="game-talbe">
                        <p class="time-remaining" v-if="!showReadTime">剩余下注时间 <span>{{countDown}}</span> 秒</p>
                        <p class="time-remaining" v-if="showReadTime">准备时间 <span>{{readTimeNum}}</span> 秒</p>
                        <div class="selectable">
                            <div class="item-1">
                                <p>
                                    <i class="table-unit">
                                        <i>总{{betCoin[1]}}</i>
                                        <img src="../../assets/images/longhudou/dragon.png">
                                        <div>2倍</div>
                                    </i>
                                </p>
                                <p>
                                    <b>{{betArr.long}}</b>
                                </p>
                                <p>
                                    <span :class="{selected:choosed==='dragon'}" @click="callContract('dragon')"></span>
                                </p>
                            </div>
                            <div class="item-2">
                                <p>
                                    <i class="table-unit">
                                        <i>总{{betCoin[3]}}</i>
                                        <img src="../../assets/images/longhudou/with.png">
                                        <div>8倍</div>
                                    </i>
                                </p>
                                <p>
                                    <b>{{betArr.he}}</b>
                                </p>
                                <p>
                                    <span :class="{selected:choosed==='leopard'}"
                                          @click="callContract('leopard')"></span>
                                </p>
                            </div>
                            <div class="item-3">
                                <p>
                                    <i class="table-unit">
                                        <i>总{{betCoin[2]}}</i>
                                        <img src="../../assets/images/longhudou/tiger.png">
                                        <div>2倍</div>
                                    </i>
                                </p>
                                <p>
                                    <b>{{betArr.hu}}</b>
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
                        <div class="input-item" @click="selectAnItem(false)">
                            <p>下注金额</p>
                            <p>
                                <input maxlength="15" v-model="moneyNum" autocomplete="off">
                            </p>
                        </div>
                    </div>
                    <transition name="fof-fade">
                        <div class="modal" v-show="showResult">
                            <div class="modal-content">
                                <div class="modal-result-text"
                                     :class="{win: resultBalance>0,lost: resultBalance<0,draw: resultBalance===0}"></div>
                                <div class="modal-result-content">
                                    <div class="modal-result-left">
                                        <p>
                                            <span class="modal-result-icon1"></span>
                                        </p>
                                        <p>
                                            <span class="modal-result-winicon"
                                                  v-show="(dragonNum+1)%13>(tigerNum+1)%13"></span>
                                            <span class="modal-result-icon2"></span>
                                        </p>
                                        <p>
                                            <span class="modal-result-winicon" v-show="dragonNum===tigerNum"></span>
                                            <span class="modal-result-icon3"></span>
                                        </p>
                                        <p>
                                            <span class="modal-result-winicon"
                                                  v-show="(dragonNum+1)%13<(tigerNum+1)%13"></span>
                                            <span class="modal-result-icon4"></span>
                                        </p>
                                    </div>
                                    <div class="modal-result-right">
                                        <p>{{resultBalance}}</p>
                                        <p class="modal-result-cardicon" :class="'poker-'+(dragonNum+1)"></p>
                                        <p class="modal-result-cardicon" :class="'poker-'+(tigerNum+1)"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <div class="modal" v-show="loading.flag">
                        <span class="modal-loading-content">
                            <span class="modal-loading-icon"></span>
                        </span>
                        <p>
                            <span class="modal-loading-text">{{loading.text}}</span>
                        </p>
                    </div>
                    <transition name="fof-fade-2">
                        <div class="modal" v-show="confirm.flag">
                            <div class="modal-loading-confirm">
                                <p class="modal-confirm-text tc">确认下注 <span>{{ confirm.text }}</span> FOF</p>
                                <p class="modal-confirm-btn">
                                    <button type="button" class="btn cancel" @click="confirm.flag = false"></button>
                                    <button type="button" class="btn confirm" @click="confirmBet(betSign)"></button>
                                </p>
                            </div>
                        </div>
                    </transition>
                    <transition name="fof-fade-2">
                        <div class="modal" v-show="savePwdConfirm.flag">
                            <div class="modal-loading-confirm">
                                <p class="modal-confirm-text tc">{{ savePwdConfirm.text }}</p>
                                <p class="modal-confirm-btn">
                                    <button type="button" class="btn cancel"
                                            @click="savePwdConfirmFun('cancel')"></button>
                                    <button type="button" class="btn confirm"
                                            @click="savePwdConfirmFun('confirm')"></button>
                                </p>
                            </div>
                        </div>
                    </transition>
                    <transition name="fof-fade-2">
                        <div class="modal" v-show="prompt.flag">
                            <div class="modal-loading-confirm modal-prompt">
                                <p class="modal-prompt-text tc">
                                    请输入
                                    <span>{{ prompt.text }}</span>
                                    的密码
                                </p>
                                <p class="modal-prompt-input tc">
                                    <input type="password" autocomplete="off" v-model="promptPwd">
                                </p>
                                <p class="modal-confirm-btn">
                                    <button type="button" class="btn cancel" @click="prompt.flag = false"></button>
                                    <button type="button" class="btn confirm" @click="promptFun"></button>
                                </p>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <div class="game-record">
                <div class="game-result-history">
                    <div class="game-history-title">历史出牌结果</div>
                    <p class="game-history-line"></p>
                    <div class="game-result-content" ref="gameResult">
                        <span v-for="(item,index) in resultList"
                              :key="index"
                              :class="{'record-long': item === '0','record-hu': item === '1','record-he': item === '2'}">
                        </span>
                    </div>
                </div>
                <div class="game-pour-history">
                    <div class="game-history-title">下注记录</div>
                    <p class="game-history-line"></p>
                    <div class="game-pour-content">
                        <el-row class="game-pour-title">
                            <el-col :span="6">下注对象</el-col>
                            <el-col :span="6">下注金额</el-col>
                            <el-col :span="6">输赢金额</el-col>
                            <el-col :span="6">出牌结果</el-col>
                        </el-row>
                        <div class="game-pour-body">
                            <el-row v-for="(item,index) in betHistory"
                                    :key="index">
                                <el-col :span="6">
                                    <span class="game-pour-icon"
                                          :class="{'record-long': item.flag === '0','record-hu': item.flag === '1','record-he': item.flag === '2'}">
                                    </span>
                                </el-col>
                                <el-col :span="6"><span class="game-pour-num">{{ item.coin }}</span></el-col>
                                <el-col :span="6">
                                    <span :class="{'game-pour-win': item.win.indexOf('+') !== -1,'game-pour-lost': item.win.indexOf('-') !== -1}">
                                        &nbsp;{{ item.win }}&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="6">
                                    <span class="game-pour-icon"
                                          :class="{'record-long': item.result === '0','record-hu': item.result === '1','record-he': item.result === '2'}">
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-button class="exit show-source" type="button" @click="showSource">智能合约源码</el-button>
        <div class="create-wallet">
            <el-dialog title="智能合约源码"
                       :modal="false"
                       class="create-wallet-dialog app-detail-font"
                       :visible.sync="showSourceVisible">
                <div style="height: 500px;overflow: auto">
                    <pre>{{ contractSource }}</pre>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import playGameContract from '../../../contracts/playGame.json'
    import axios from 'axios'

    export default {
        name: "app-detail",
        data() {
            return {
                temporaryParams: {},
                promptPwd: '',
                myAddress: '',// 我的地址
                myBalance: 0, // 我的余额
                showResult: false,
                showSourceVisible: false,
                isSelected: null,
                amountArr: [1, 5, 10],
                resultList: [],
                amount1: ['0'],
                amount2: ['0'],
                amount3: ['0'],
                betCoin: [0, 0, 0, 0],
                choosed: null, // 龙虎合选中的标识
                betZh: '',
                moneyNum: 0,
                countDown: 0,
                getCoinsTimer: null,
                dragonNum: '0',
                tigerNum: '0',
                myContractInstance: null,// 智能合约对象
                ContractAddr: '',
                contractSource: '',
                settleTime: '',
                getSettleResTimer: null, //获取下注结果的定时器
                prevBet: [0], //保存上一局下注的操作
                betHistory: [], // 当前玩家这一局下注的历史记录
                betArr: {
                    long: 0,
                    hu: 0,
                    he: 0
                }, // 当前局下注金额对象
                contractBalance: '', // 合约余额
                resultBalance: 0, // 本局输赢金额
                loading: { // 模态框
                    flag: false,
                    text: ''
                },
                confirm: { // 确认框
                    flag: false,
                    text: '',
                },
                betSign: '', // 下注的对象
                prompt: { // 输入框
                    flag: false,
                    text: ''
                },
                savePwdConfirm: {
                    flag: false,
                    text: '',
                },
                // 下注钱币飞舞动画
                animateChips: {
                    number: [],
                    isShow: false,
                    isOne: false,
                    isTwo: false,
                    isThree: false,
                    isFour: false,
                    isOther: false,
                    isBet: false
                },
                showPokerResult: false,// 桌子上的牌翻转
                readTimeNum: 4,
                showReadTime: false,
                showReady: 1,
                pokerIsShow: 'block',
                timerOverTime: null
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
                    "contractAddr": url,
                    "pageSize": 200,
                    "pageNum": 1,
                }).then((res) => {
                    if (res.status === 200) {
                        this.showSourceVisible = true
                        if (res.data.length > 0) {
                            this.contractSource = this.$web3.eth.getTransaction(res.data[0].txHash).datasourcecode
                        } else {
                            this.$message.error('未查询到相关信息！')
                        }
                    }
                }).catch((error) => {
                    this.$message.error(String(error))
                })
            },
            selectAnItem(i) {
                if (i === false) {
                    this.isSelected = null
                    // this.moneyNum = 0
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
                if (this.countDown === 1) {
                    this.showSourceVisible = false
                    this.confirm.flag = false
                    this.prompt.flag = false
                    this.savePwdConfirm.flag = false
                    this.loading = {flag: true, text: '正在发牌···'}
                    this.showResult = false
                    this.countDown = 0
                    this.timerOverTime = setTimeout(() => {
                        clearTimeout(this.timerOverTime)
                        this.loading = {flag: false, text: ''}
                        this.$message({
                            duration: 0,
                            type: 'error',
                            message: '发牌超时！请联系管理员！'
                        })
                        clearInterval(this.getCoinsTimer)
                        let thisTimer = setTimeout(() => {
                            clearTimeout(thisTimer)
                            window.location.reload()
                        }, 3000)
                    }, 60000)
                }
                let nowTime = this.myContractInstance.getBlockTime()[0].toString(10)
                if (this.settleTime !== nowTime) { // 说明结算了
                    //结算逻辑
                    clearTimeout(this.timerOverTime)
                    this.settleTime = nowTime
                    this.resultBalance = 0
                    this.dragonNum = Number(this.myContractInstance.getBlockTime()[4][0].toString(10))
                    this.tigerNum = Number(this.myContractInstance.getBlockTime()[4][1].toString(10))
                    let result = ''
                    if ((this.dragonNum + 1) % 13 > (this.tigerNum + 1) % 13) {
                        result = '0'
                    } else if ((this.dragonNum % 13 + 1) < (this.tigerNum + 1) % 13) {
                        result = '1'
                    } else {
                        result = '2'
                    }
                    this.confirm.flag = false
                    this.prompt.flag = false
                    this.savePwdConfirm.flag = false
                    this.loading = {flag: false, text: ''}
                    this.showPokerResult = true
                    this.pokerIsShow = 'block'
                    let showResultTimer = setTimeout(() => {
                        clearTimeout(showResultTimer)
                        this.showPokerResult = false
                        this.pokerIsShow = 'none'
                        this.showResult = true // 显示结果弹窗
                    }, 2000)
                    if (this.prevBet.length > 1) {
                        if (this.betHistory.length === 0) {
                            return
                        }
                        for (let i = this.betHistory.length - 1; i >= this.betHistory.length - this.prevBet[0]; i--) {
                            if (this.betHistory[i].flag === result) {
                                this.betHistory[i].win = '+' + (result === '2' ? this.betHistory[i].coin * 8 : this.betHistory[i].coin)
                                this.resultBalance += (result === '2' ? Number(this.betHistory[i].coin) * 8 : Number(this.betHistory[i].coin))
                            } else {
                                this.betHistory[i].win = '-' + this.betHistory[i].coin
                                this.resultBalance -= Number(this.betHistory[i].coin)
                            }
                            this.betHistory[i].result = result
                        }

                        this.prevBet.length = 0
                        this.prevBet[0] = 0
                        this.betArr.long = 0
                        this.betArr.hu = 0
                        this.betArr.he = 0
                        this.animateChips.number.length = 0
                        this.animateChips.isShow = false
                        this.animateChips.isOne = false
                        this.animateChips.isTwo = false
                        this.animateChips.isThree = false
                        this.animateChips.isFour = false
                        this.animateChips.isOther = false
                    } else {
                        this.resultBalance = 0
                    }
                    this.resultList = this.myContractInstance.getResultHistory().map((item) => {
                        return item.toString(10)
                    })
                    //结算完
                    let timer = setTimeout(() => {
                        clearTimeout(timer)
                        this.contractBalance = this.$web3.fromWei(this.myContractInstance.getCurrentBalance().toString(10), 'ether')
                        this.myBalance = this.$funs.getBalance(this.myAddress)
                        this.showResult = false // 显示结果弹窗
                        this.showReady = 2
                    }, 6000)
                }
                if (this.showReady === 2) {
                    this.showReadTime = true
                    this.readTimeNum--
                    this.pokerIsShow = 'block'
                    let readTimer = setTimeout(() => {
                        clearTimeout(readTimer)
                        this.showReady = 1
                        this.getTimerTime()
                    }, 3000)
                }
            },
            confirmBet(sign) {
                this.confirm.flag = false
                this.bet(sign)
                let user = this.myAddress
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
                    this.prompt.flag = true
                    this.prompt.text = user
                    this.temporaryParams = params
                }
            },
            promptFun() {
                if (this.promptPwd.trim() === '') {
                    this.$message.error("密码不能为空！")
                    return
                }
                this.prompt.flag = false
                try {
                    this.$web3.personal.unlockAccount(this.myAddress, this.promptPwd, 6000000)
                    this.savePwdConfirm.flag = true
                    this.savePwdConfirm.text = "是否临时保存密码，页面在刷新或者关闭后自动清除"
                    this.temporaryParams.value = this.promptPwd
                } catch (err) {
                    this.$message.error(String(err))
                    this.loading = {flag: false, text: ''}
                }
            },
            // 是否保存密码confirm
            savePwdConfirmFun(sign) {
                if (sign === "confirm") {
                    this.$store.commit("setPlayPassword", this.temporaryParams.value)
                    this.betFun(this.myAddress, this.temporaryParams)
                    this.savePwdConfirm.flag = false
                } else {
                    this.savePwdConfirm.flag = false
                    this.betFun(this.myAddress, this.temporaryParams)
                }
            },
            /**
             * 下注动画
             * **** 左上
             * left: 260px;
             * top: 175px;
             * **** 右上
             * left: 335px;
             * top: 175px;
             * **** 左下
             * left: 260px;
             * top: 235px;
             * **** 右下
             * left: 335px;
             * top: 235px;
             * 矩形：75 * 60
             * 右移一次加： 450 - 260 = 190
             *
             * sign: 龙虎和
             * coin: 金额
             * isOther: 是不是其他人下注
             */
            betAnimate(sign, coin, isOther) {
                // left: 260px;
                // top: 175px;
                let money = Number(coin)
                this.amountArr = this.amountArr.sort((a, b) => {
                    return a - b
                })
                if (money < this.amountArr[1]) {
                    for (let i = 0; i < 3; i++) {
                        this.animateChips.number.push(i)
                    }
                    if (money === Number(this.amountArr[0])) {
                        this.animateChips.isOne = true
                    } else {
                        this.animateChips.isFour = true
                    }
                } else if (money >= this.amountArr[2]) {
                    for (let i = 0; i < 8; i++) {
                        this.animateChips.number.push(i)
                    }
                    if (money === Number(this.amountArr[2])) {
                        this.animateChips.isThree = true
                    } else {
                        this.animateChips.isFour = true
                    }
                } else {
                    for (let i = 0; i < 5; i++) {
                        this.animateChips.number.push(i)
                    }
                    if (money === Number(this.amountArr[1])) {
                        this.animateChips.isTwo = true
                    } else {
                        this.animateChips.isFour = true
                    }
                }
                if (isOther) {
                    this.animateChips.isOther = true
                    this.animateChips.isOne = false
                    this.animateChips.isTwo = false
                    this.animateChips.isThree = false
                    this.animateChips.isFour = false
                }
                this.animateChips.isShow = true
                let left = 0
                switch (sign) {
                    case 'dragon':
                        left = 260
                        break
                    case 'leopard':
                        left = 260 + 190
                        break
                    case 'tiger':
                        left = 260 + 190 * 2
                        break
                }
                let timer = setTimeout(() => {
                    clearTimeout(timer)
                    this.$nextTick(() => {
                        this.$refs.chipsItem.forEach((item) => {
                            if (item.getAttribute('data-bool') === "true") {
                                item.style.left = `${left + this.randomFun(75)}px`
                                item.style.top = `${175 + this.randomFun(60)}px`
                                item.setAttribute("data-bool", "false")
                            }
                        })
                    })
                }, 1)
                let timer2 = setTimeout(() => {
                    clearTimeout(timer2)
                    this.animateChips.isBet = false
                }, 1000)
            },
            randomFun(range) {
                return Number((Math.random() * range).toFixed(0))
            },
            /**
             * 下注
             */
            callContract(sign) {
                if (!this.chargeLegality()) {
                    return false
                }
                if (this.$funs.getBalance(this.myAddress) < 1) {
                    this.$message.error('余额不足，不能下注！')
                    return false
                }
                if (!this.$funs.validateFloatNum(this.moneyNum)) {
                    this.$message.error('下注金额只能为正数！')
                    return false
                }
                if (this.$funs.getBalance(this.myAddress) < Number(this.moneyNum)) {
                    this.$message.error('您的余额小于下注金额，下注失败！')
                    return false
                }
                this.betSign = sign
                this.confirm.flag = true
                this.confirm.text = this.moneyNum
            },
            betFun(user, params) {
                this.savePwdConfirm.flag = false
                if (this.countDown < 5) {
                    this.$message.error('下注失败！剩余时间小于5s不能下注！')
                    return
                }
                this.animateChips.isBet = true
                this.loading = {flag: true, text: '正在下注···'}
                // 监听是否下注失败
                let betResult = this.myContractInstance.returnBetResult()
                betResult.watch((err, result) => {
                    betResult.stopWatching()
                    this.loading = {flag: false, text: ''}
                    if (err) {
                        this.$message.error('下注失败！')
                        return
                    }
                    if (result.args._bool) {
                        switch (params.cho) {
                            case "0":
                                this.betArr.long += Number(this.$web3.fromWei(params.coin, 'ether'))
                                break
                            case "1":
                                this.betArr.hu += Number(this.$web3.fromWei(params.coin, 'ether'))
                                break
                            case "2":
                                this.betArr.he += Number(this.$web3.fromWei(params.coin, 'ether'))
                                break
                            default:
                                break
                        }
                        this.prevBet[0]++
                        this.prevBet[1] = params.cho
                        this.prevBet[2] = this.$web3.fromWei(params.coin, 'ether')
                        this.betHistory.push({
                            flag: this.prevBet[1],
                            coin: this.prevBet[2],
                            win: '',
                            result: ''
                        })
                        this.$message.success('下注成功！请等待出牌结果！')
                        this.betAnimate(this.betSign, this.moneyNum)
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
                        this.showReadTime = false
                        this.readTimeNum = 4
                    })
                    .catch(() => {
                        this.$message.error('节点异常，无法获取时间')
                        clearInterval(this.getCoinsTimer)
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
            },
            scrollToBottom() {
                this.$nextTick(() => {
                    let div = this.$refs.gameResult
                    div.scrollTop = div.scrollHeight
                })
            }
        },
        mounted() {
            if (this.getContractAddr()) {
                this.contactContract()
                if (!this.chargeLegality()) {
                    return false
                }

                //获取当前时间
                this.getTimerTime()

                //定时器
                this.getCoinsTimer = setInterval(() => {
                    // 实时获取下注币数
                    let arr = this.myContractInstance.getTotalCoins()
                    if (arr) {
                        let result = arr.map((item) => {
                            return this.$web3.fromWei(item.toString(10), 'ether')
                        })
                        if (!this.animateChips.isBet) {
                            if (result[1] !== '0' || result[2] !== '0' || result[3] !== '0') {
                                if (this.betCoin[0] === 0 && this.betCoin[1] === 0 && this.betCoin[2] === 0) {
                                    if (result[1] !== '0') {
                                        this.betAnimate('dragon', result[1] - this.betCoin[1], true)
                                    }
                                    if (result[2] !== '0') {
                                        this.betAnimate('tiger', result[2] - this.betCoin[2], true)
                                    }
                                    if (result[3] !== '0') {
                                        this.betAnimate('leopard', result[3] - this.betCoin[3], true)
                                    }
                                } else {
                                    if (JSON.stringify(result) !== JSON.stringify(this.betCoin)) {
                                        if (this.betCoin[1] !== result[1]) {
                                            this.betAnimate('dragon', result[1] - this.betCoin[1], true)
                                        }
                                        if (this.betCoin[2] !== result[2]) {
                                            this.betAnimate('tiger', result[2] - this.betCoin[2], true)
                                        }
                                        if (this.betCoin[3] !== result[3]) {
                                            this.betAnimate('leopard', result[3] - this.betCoin[3], true)
                                        }
                                    }
                                }
                            }
                        }
                        this.betCoin.length = 0
                        this.betCoin = result
                    }
                    //倒计时
                    if (this.countDown <= 5) {
                        this.settlement()
                    }
                    if (this.countDown > 1) {
                        this.countDown--
                    }
                }, 1000)
                this.settleTime = this.myContractInstance.getBlockTime()[0].toString(10)
                this.contractBalance = this.$web3.fromWei(this.myContractInstance.getCurrentBalance().toString(10), 'ether')
                let users = this.$funs.getLocalAddress()
                this.myAddress = users.addresses[users.active]
                this.myBalance = this.$funs.getBalance(this.myAddress)
            }
        },
        deactivated() {
            clearInterval(this.getCoinsTimer)
        },
        beforeDestroy() {
            clearInterval(this.getCoinsTimer)
        },
        watch: {
            'resultList': 'scrollToBottom',
        },
    }
</script>

<style lang="scss" type="text/scss" scoped>
    @import "../../assets/scss/appDetail";
</style>
