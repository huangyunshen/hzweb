<template>
    <div>
        <div class="create-app">
            <div class="create-header no-select-text">
                <p :class="{'header-active':steps===1}">用户协议</p>
                <span></span>
                <p :class="{'header-active':steps===2}">选择类型</p>
                <span></span>
                <p :class="{'header-active':steps===3}">配置应用</p>
                <span></span>
                <p :class="{'header-active':steps===4}">创建成功</p>
            </div>

            <div class="create-body">
                <!--step-1-->
                <transition name="fof-fade">
                    <div class="step-1" v-show="steps===1">
                        <div class="header">用户协议</div>
                        <div class="body">
                            <agreement></agreement>
                        </div>
                        <p class="tc" style="margin: 20px;">
                            <el-checkbox v-model="checked">同意以上协议</el-checkbox>
                        </p>
                    </div>
                </transition>
                <!--step-2-->
                <transition name="fof-fade">
                    <div class="step-2" v-show="steps===2">
                        <div class="header">选择你想要创建的游戏</div>
                        <div class="body">
                            <el-row>
                                <el-col :span="4" v-for="(item,index) in appList" :key="index">
                                    <application :item="item"
                                                 :index="index"
                                                 ref="funcs"
                                                 @click.native="selectAnApp(item.type,index)"
                                    ></application>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </transition>
                <!--step3-->
                <transition name="fof-fade">
                    <div class="step-3" v-show="steps===3">
                        <div class="header">请配置相关参数</div>
                        <div class="body">
                            <div class="content">
                                <el-form
                                        label-width="110px"
                                        label-position="left"
                                        @submit.native.prevent>

                                    <el-form-item class="el-wallet-style" label="充值金额">
                                        <el-input
                                                auto-complete="off"
                                                v-model="rechargeData.value"
                                        >
                                            <template slot="append">FOF</template>
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                                <el-form class="mt-50"
                                         label-width="110px"
                                         label-position="left"
                                         @submit.native.prevent>

                                    <el-form-item class="el-wallet-style" label="下注金额">
                                        <el-row>
                                            <el-col :span="7">
                                                <el-input
                                                        auto-complete="off"
                                                        v-model="rechargeData.price1"
                                                >
                                                    <template slot="append">FOF</template>
                                                </el-input>
                                            </el-col>
                                            <el-col :span="7" :offset="1">
                                                <el-input
                                                        auto-complete="off"
                                                        v-model="rechargeData.price2"
                                                >
                                                    <template slot="append">FOF</template>
                                                </el-input>
                                            </el-col>
                                            <el-col :span="7" :offset="1">
                                                <el-input
                                                        auto-complete="off"
                                                        v-model="rechargeData.price3"
                                                >
                                                    <template slot="append">FOF</template>
                                                </el-input>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="explain">
                                <longhudou-rule></longhudou-rule>
                            </div>
                        </div>
                    </div>
                </transition>
                <!--step4-->
                <transition name="fof-fade">
                    <div class="step-4" v-show="steps===4">
                        <div class="body">
                            <div class="finishe-icon">
                                <i></i>
                                <p>创建成功</p>
                            </div>
                            <div class="finishe-address">
                                <el-form
                                        label-width="110px"
                                        label-position="left"
                                        @submit.native.prevent>

                                    <el-form-item class="el-wallet-style" label="应用地址">
                                        <el-row>
                                            <el-col :span="20">
                                                <el-input id="appAddress"
                                                          auto-complete="off"
                                                          v-model="contractAddressUrl"
                                                          readonly
                                                ></el-input>
                                            </el-col>
                                            <el-col :span="4">
                                                <el-button @click="copyAddress">复制</el-button>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="create-footer">
                <el-button class="el-wallet-main-button" @click="preStep" v-show="steps===2 || steps===3">上一步
                </el-button>
                <el-button class="el-wallet-main-button" @click="nextStep" :disabled="!checked">{{btnVal}}</el-button>
                <a id="linkToApp" :href="contractAddressUrl" target="_blank"></a>
            </div>
        </div>
    </div>
</template>

<script>
    import agreement from './agreement'
    import application from './apps'
    import longhudouRule from '../ruleDescription/longhudouRule'
    // 先部署定时器合约 得到其地址
    import intervalContract from '../../../contracts/Interval.json'
    import playGameContract from '../../../contracts/playGame.json'
    import solSource from '../../../contracts/playGame.sol'


    export default {
        name: "create-app",
        components: {
            agreement,
            application,
            longhudouRule
        },
        data() {
            return {
                steps: 1,
                selected: '',
                appList: [{
                    contractAddr: "0xfe56582a999c5dae6ba4cc9ea84e9f1842e5fb39",
                    createAddr: "0x8ddb5f0b47a027cea553c58734389dd4ed7ff7f5",
                    currentCoin: "1000000000000.00000000",
                    historyCoin: null,
                    id: "93",
                    time: "2018-05-23 02:25:30",
                    type: "1"
                }],
                btnVal: "下一步",
                setCoin: null,
                contractAddress: '',
                contractAddressUrl: '',// 可以访问的地址
                rechargeValue: '',
                rechargeData: {
                    value: '10',
                    gasPrice: '41',
                    gas: '21000',
                    price1: '1',
                    price2: '5',
                    price3: '10',
                    price4: '20',
                },
                publicKey: '',
                password: '',
                checked: false,//同意协议
            }
        },
        methods: {
            preStep() {
                if (this.steps > 1) {
                    this.steps--
                }
            },
            nextStep() {
                if (this.steps < 4) {
                    let users = this.$store.state.address
                    let balance = Number(this.$store.state.balance)
                    if (this.steps === 1) {
                        if (balance < 1) {
                            this.$message({
                                message: this.$msg.balanceNotEnough,
                                type: 'error'
                            })
                            return
                        }
                    }
                    if (this.steps === 2 && (this.selected === '')) {
                        this.$message({
                            message: this.$msg.mustSelectAnApp,
                            type: 'error'
                        })
                        return
                    }
                    if (this.steps === 3) {
                        if (isNaN(this.rechargeData.value)) {
                            this.$message.error('请输入正确的充值数额！')
                            return
                        }
                        if (this.rechargeData.value === '' || Number(this.rechargeData.value) === 0) {
                            this.$message.error('充值数量不能为空和不能为0！')
                            return
                        }
                        let reg = /^\d*.\d{0,9}$/g
                        if (!reg.test(this.rechargeData.value)) {
                            this.$message.error('充值数额小数点后不能超过9位！')
                            return
                        }
                        if (balance < (Number(this.rechargeData.value) + 1)) {
                            this.$message.error('余额不足以支付充值金额！')
                            return
                        }
                        if (isNaN(this.rechargeData.gasPrice)) {
                            this.$message.error('请输入正确的gasPrice！')
                            return
                        }
                        if (this.rechargeData.gasPrice === '' || Number(this.rechargeData.gasPrice) === 0) {
                            this.$message.error('gasPrice不能为空和不能为0！')
                            return
                        }
                        if (isNaN(this.rechargeData.price1)
                            || isNaN(this.rechargeData.price2)
                            || isNaN(this.rechargeData.price3)) {
                            this.$message.error('请设置正确的下注金额！')
                            return
                        }
                        if (this.rechargeData.price1.trim() === ''
                            || this.rechargeData.price2.trim() === ''
                            || this.rechargeData.price3.trim() === ''
                            || Number(this.rechargeData.price1) === 0
                            || Number(this.rechargeData.price2) === 0
                            || Number(this.rechargeData.price3) === 0) {
                            this.$message.error('下注金额不能为空和不能为0！')
                            return
                        }
                        if (this.rechargeData.price1.length > 2
                            || this.rechargeData.price2.length > 2
                            || this.rechargeData.price3.length > 2) {
                            this.$message.error('每个下注金额不能大于99！')
                            return
                        }
                        this.steps--
                        this.$confirm('确认部署合约吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            try {
                                this.$store.commit('setCryptPercent', {percent: true, text: '创建中···'})
                                this.$funs.unlockAccount().then((res) => {
                                    this.migration(users)
                                }).catch((reason) => {
                                    console.log(reason)
                                })
                            } catch (err) {
                                this.$message.error(String(err))
                            }
                        }).catch((err) => {
                            if (err !== 'cancel') {
                                this.$message.error(String(err))
                            }
                        })
                    }
                    this.steps++
                } else {
                    let a = document.getElementById('linkToApp')
                    a.click()
                }
            },
            selectAnApp(type, index) {
                this.selected = type
                for (let c = 0; c < this.appList.length; c++) {
                    this.$refs.funcs[c].selectApp(index)
                }
            },
            /**
             * 充值
             */
            recharge(instance) {
                // this.$web3.personal.unlockAccount(user, value)
                // 转账 到合约账户，返回交易hash
                instance.methods.deposit()
                    .send({
                        from: this.$store.state.address,
                        value: this.$web3.utils.toWei(this.rechargeData.value, 'ether'),
                        gas: 100000,
                        txType: 0,
                    })
                    .on('error', (err) => {
                        this.$store.commit('setCryptPercent', {percent: false, text: ''})
                        this.$message.error(String(err))
                    })
                    .on('receipt', (receipt) => {
                        this.$axios.post('/api/addTx.php', {
                            "type": "1",
                            "sendAddr": receipt.from,
                            "revAddr": receipt.to,
                            "txHash": receipt.transactionHash,
                            "blockNum": receipt.blockNumber,
                            "amount": this.rechargeData.value
                        }).then((res) => {
                            if (res.status === 200) {
                                // console.log(res)
                            }
                        }).catch((error) => {
                            this.$message.error(String(error))
                        })
                        let timer = setTimeout(() => {
                            clearTimeout(timer)
                            this.$store.commit('setCryptPercent', {percent: false, text: '充值成功！'})
                            this.steps++
                            this.btnVal = '完成'
                        }, 500)
                    })
            },
            /**
             * 部署
             * @param user
             */
            migration(user) {
                this.$web3.eth.estimateGas({data: playGameContract.bytecode}).then((gas) => {
                    new this.$web3.eth.Contract(playGameContract.abi)
                        .deploy({
                            // 传入设置的下注金额和类型(1 代表是龙虎斗)
                            data: playGameContract.bytecode,
                            arguments: [Number(this.rechargeData.price1), Number(this.rechargeData.price2), Number(this.rechargeData.price3), Number(this.rechargeData.price4), Number(this.selected)]
                        })
                        .send({
                            from: user,
                            datasourcecode: this.$web3.utils.toHex(solSource), // 传入sol源码
                            gas: gas * 2,
                            txType: 0,
                        })
                        .on('error', (err) => {
                            this.$store.commit('setCryptPercent', {percent: false, text: ''})
                            this.$message.error(String(err))
                        })
                        .on('receipt', (receipt) => {
                            // return
                            this.$axios.post('/api/addContract.php', {
                                "type": this.selected,
                                "contractAddr": receipt.contractAddress,
                                "createAddr": user,
                                "createMoney": this.rechargeData.value,
                                "txHash": receipt.transactionHash
                            }).then((res) => {
                                if (res.status === 200) {
                                    // console.log(res)
                                }
                            }).catch((error) => {
                                this.$message.error(String(error))
                            })
                            this.$axios.post('/api/addTx.php', {
                                "type": "1",
                                "sendAddr": receipt.from,
                                "revAddr": receipt.to,
                                "txHash": receipt.transactionHash,
                                "blockNum": receipt.blockNumber,
                                "amount": "0"
                            }).then((res) => {
                                if (res.status === 200) {
                                    // console.log(res)
                                }
                            }).catch((error) => {
                                this.$message.error(String(error))
                            })
                            this.contractAddress = receipt.contractAddress
                            localStorage.setItem('contractAddress', receipt.contractAddress)
                        })
                        .then((newContractInstance) => {
                            console.log(newContractInstance.options.address)
                            // return
                            if (newContractInstance.options.address) {
                                this.$store.commit('setCryptPercent', {percent: true, text: '创建成功！正在充值···'})
                                // return
                                // 每次部署完合约，需要向定时器合约中注册当前合约地址
                                // this.$web3.eth.estimateGas({data: playGameContract.bytecode})
                                newContractInstance.methods.registerInterval('0xa73D0b05c0CF6e09607F0Cf9D96b64F124799bc7')
                                    .send({
                                        from: user,
                                        gas: 4712388,
                                        txType: 0,
                                    })
                                    .on('error', (err) => {
                                        this.$store.commit('setCryptPercent', {percent: false, text: ''})
                                        this.$message.error(err.message)
                                        console.log(err.message)
                                    })
                                    .on('receipt', (receipt) => {
                                        this.$axios.post('/api/addTx.php', {
                                            "type": "1",
                                            "sendAddr": receipt.from,
                                            "revAddr": receipt.to,
                                            "txHash": receipt.transactionHash,
                                            "blockNum": receipt.blockNumber,
                                            "amount": "0"
                                        }).then((res) => {
                                            if (res.status === 200) {
                                                // console.log(res)
                                            }
                                        }).catch((error) => {
                                            this.$message.error(String(error))
                                        })
                                        this.recharge(newContractInstance) // 充值
                                        //部署成功！你的合约地址为
                                        let host = window.location.host
                                        this.contractAddressUrl = `http://${host}/#/appDetail?${newContractInstance.options.address}`
                                    })
                            }
                        })
                })
            },
            sendMsgToServer() {
                this.$axios.get('/api/requestContract.php')
                    .then((res) => {
                        if (res.status === 200) {
                            let obj = {
                                contractAddr: "0xfe56582a999c5dae6ba4cc9ea84e9f1842e5fb39",
                                createAddr: "0x8ddb5f0b47a027cea553c58734389dd4ed7ff7f5",
                                currentCoin: "1000000000000.00000000",
                                historyCoin: null,
                                id: "93",
                                time: "2018-05-23 02:25:30",
                                type: "1"
                            }
                            this.appList = [obj]
                            // this.appList = res.data
                        }
                    })
                    .catch((error) => {
                        this.$message.error(String(error))
                        let timer = setTimeout(() => {
                            clearTimeout(timer)
                            this.$message.error('无法获取应用列表')
                        }, 3000)
                    })
            },
            copyAddress($event) {
                let input = document.getElementById('appAddress')
                input.select()
                document.execCommand('copy')
            }
        },
        mounted() {
            this.$funs.getBalance()
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    $title_color: #cec8ff;
    $content_color: #8abdec;

    .create-app {
        .create-header {
            display: flex;
            text-align: center;
            p {
                flex-grow: 1;
                line-height: 70px;
                background-color: #221D44;
                box-shadow: 1px 0px 0px 0px #272345;
                font-size: 20px;
                color: #d3ceff;

            }
            .header-active {
                line-height: 68px;
                border-bottom-style: solid;
                border-bottom-width: 2px;
                border-image-source: linear-gradient(105deg,
                        #3410f7 0%,
                        #711bdc 59%,
                        #ad25c0 100%);
                border-image-slice: 1;
                background-color: #3a346a;
            }
            span {
                display: inline-block;
                height: 70px;
                border-right: 2px solid #272345;
            }
        }

        .create-body {
            padding: 20px 70px;
            font-size: 16px;
            color: #cec8ff;

            .header {
                line-height: 40px;
                font-size: 20px;
                text-align: center;
            }
            .body {
                height: 500px;
                overflow-y: auto;
                padding: 10px;
                border: solid 1px rgba(208, 202, 253, 0.15);
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
            }
            .step-1 {
                .body {
                    height: 440px;
                }
            }
            .step-3 {
                .content {
                    width: 800px;
                    padding: 30px;
                }
                .explain {
                    border-top: solid 1px #28234D;
                    margin: 20px;
                }
            }
            .step-4 {
                .body {
                    border-left: none;
                    border-top: none;
                    border-right: none;
                    margin-bottom: 30px;
                    .finishe-icon {
                        text-align: center;
                        padding: 100px 0;
                        i {
                            display: inline-block;
                            width: 120px;
                            height: 120px;
                            background: url("../../assets/images/apps/icon_cjcg.png");
                        }
                        p {
                            margin-top: 25px;
                            font-size: 24px;
                            color: #8490c5;
                        }
                    }
                    .finishe-address {
                        .el-button {
                            width: 80%;
                            height: 70px;
                            margin-left: 10px;
                            background-image: linear-gradient(
                                            #443e67,
                                            #443e67),
                            linear-gradient(
                                            #443e67,
                                            #443e67);
                            background-blend-mode: normal, normal;
                            font-size: 26px;
                            color: #bbb3ef;
                            border: none;
                        }
                    }
                }
            }
        }
        .create-footer {
            position: relative;
            width: 800px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            .el-button:last-child {
                margin-left: 50px;
            }
        }
    }
</style>