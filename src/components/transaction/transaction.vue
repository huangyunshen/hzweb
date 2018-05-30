<template>
    <div class="transaction">
        <div class="tranc-header no-select-text">
            <p :class="{'header-active':steps==='1'}">生成交易</p>
            <span></span>
            <p :class="{'header-active':steps==='2'}">解锁钱包</p>
            <span></span>
            <p :class="{'header-active':steps==='3'}">签名信息</p>
            <span></span>
            <p :class="{'header-active':steps==='4'}">确认交易</p>
            <span></span>
            <p :class="{'header-active':steps==='5'}">交易完成</p>
        </div>

        <div class="tranc-body">
            <!--step-1-->
            <transition name="fof-fade">
                <div class="step-1" v-show="steps==='1'">
                    <div class="step-1-head">
                        <div class="tranc-balance"><i></i>账户余额 : {{balance | amountUnit}}</div>
                        <div class="tranc-address"><i></i>账户地址 : {{address}}</div>
                    </div>
                    <div class="step-1-body">
                        <el-form ref="form" :model="form" label-position="left" label-width="150px">
                            <el-form-item class="mt-40" label="对方账户">
                                <el-input
                                        v-model="form.to"
                                ></el-input>
                            </el-form-item>
                            <el-form-item class="mt-40" label="转账数额">
                                <el-input
                                        placeholder="数额"
                                        v-model="form.value">
                                    <template slot="append">FOF</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item class="mt-40" label="Gas Limit">
                                <el-input
                                        v-model="form.gas"
                                        value="21000"
                                        placeholder="21000"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="step-1-footer">
                        <el-button class="el-wallet-main-button mt-50" @click="typePwd">生成交易</el-button>
                    </div>
                </div>
            </transition>
            <!--step-2-->
            <transition name="fof-fade">
                <div class="step-2" v-show="steps==='2'">
                    <unlock-account ref="unlock" isTranc="isTranc"></unlock-account>

                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-button class="el-wallet-main-button mt-50" @click="steps = '1'">上一步</el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-button class="el-wallet-main-button mt-50" @click="importAccount">解锁钱包</el-button>
                        </el-col>
                    </el-row>
                </div>
            </transition>
            <!--step3-->
            <transition name="fof-fade">
                <div class="step-3" v-show="steps==='3'">
                    <div class="step-3-content">
                        <el-form label-position="top" class="emitTransaction">
                            <el-form-item label="未生效交易" class="el-wallet-style">
                                <el-input
                                        type="textarea"
                                        resize="none"
                                        readonly
                                        :value="transactionData"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-form label-position="top" class="emitTransaction">
                            <el-form-item label="签名交易">
                                <el-input
                                        type="textarea"
                                        resize="none"
                                        readonly
                                        :value="transactionSign"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="step-3-footer">
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-button class="el-wallet-main-button mt-50"  @click="steps = '2'">上一步</el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button class="el-wallet-main-button mt-50" @click="emitTransaction">确认签名</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </transition>
            <!--step4-->
            <transition name="fof-fade">
                <div class="step-4" v-show="steps==='4'">
                    <ul class="transactionMsg">
                        <li>
                            <span>To Address:</span>
                            <b>{{ transactionMsg.to }}</b>
                        </li>
                        <li>
                            <span>From Address:</span>
                            <b>{{ transactionMsg.from }}</b>
                        </li>
                        <li>
                            <span>Amount to Send:</span>
                            <b>{{ transactionMsg.value }}</b>
                        </li>
                        <li>
                            <span>Account Balance:</span>
                            <b>{{ transactionMsg.balance }}</b>
                        </li>
                        <li>
                            <span>Coin:</span>
                            <b>{{ transactionMsg.coin }}</b>
                        </li>
                        <!--<li>-->
                        <!--<span>Network:</span>-->
                        <!--<b>{{ transactionMsg.network }}</b>-->
                        <!--</li>-->
                        <li>
                            <span>Gas Limit:</span>
                            <b>{{ transactionMsg.gasLimit }}</b>
                        </li>
                        <li>
                            <span>Gas Price:</span>
                            <b>{{ transactionMsg.gasPrice }}</b>
                        </li>
                        <li>
                            <span>Max TX Fee:</span>
                            <b>{{ transactionMsg.maxTXFee }}</b>
                        </li>
                        <li>
                            <span>Nonce:</span>
                            <b>{{ transactionMsg.nonce }}</b>
                        </li>
                        <li>
                            <span>Data:</span>
                            <b>{{ transactionMsg.data }}</b>
                        </li>
                    </ul>
                    <div class="tc">
                        你将发送
                        <span>{{ form.value | amountUnit}}</span>
                        到地址
                        <span>{{ form.to }}</span>
                        <span>，请确认</span>
                    </div>
                    <div class="step-4-footer">
                        <el-button class="abandon" @click="abandon">放弃</el-button>
                        <el-button class="submit el-wallet-main-button" @click="confirmTransaction">发送交易</el-button>
                    </div>
                </div>
            </transition>
            <!--step5-->
            <transition name="fof-fade">
                <div class="step-5" v-show="steps==='5'">
                    <div class="step-5-body">
                        <el-form label-position="top" class="emitTransaction">
                            <el-form-item label="交易Hash" class="el-wallet-style">
                                <el-input
                                        readonly
                                        :value="transactionHash"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="step-5-footer">
                        <el-button class="el-wallet-main-button mt-50" @click="finished">完成</el-button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import unlockAccount from '../wallet/unlockAccount'

    export default {
        name: "transaction",
        components: {
            unlockAccount
        },
        data() {
            return {
                steps: "1",
                form: {
                    to: '',
                    value: 1,
                    gas: 21000,
                },
                unit: 'FOF',
                address: '',
                privateKey: '',
                balance: 0,
                password: '',
                transactionHash: '', // 交易hash
                transactionData: '',
                transactionSign: '',
                transactionMsg: {}
            }
        },
        computed: {
            balanceToWei() {
                return this.$web3.toWei(this.balance)
            },
            valueToWei() {
                return this.$web3.toWei(this.form.value, 'ether')
            },
            totalPrice() {
                let total = ((this.$store.state.gasPrice * Math.pow(10, 9)) * this.form.gas) + Number(this.valueToWei)
                return total
            }
        },
        methods: {
            /**
             * 点击 生成交易
             */
            typePwd() {
                this.password = ''
                if (!this.$web3.isAddress(this.form.to)) {
                    this.$message({
                        message: this.$msg.invalidAddress,
                        type: 'error'
                    })
                    return
                }
                if (!this.$funs.validateFloatNum(this.form.value)) {
                    this.$message({
                        message: this.$msg.errorValue,
                        type: 'error'
                    })
                    return
                }
                if (this.balanceToWei < this.totalPrice) {
                    this.$message({
                        message: this.$msg.balanceNotEnough,
                        type: 'error'
                    })
                    return
                }
                if (!this.$funs.validateIntNum(this.form.gas)) {
                    this.$message({
                        message: this.$msg.invalidGas,
                        type: 'error'
                    })
                    return
                }

                this.steps = '2'
            },
            importAccount() {
                this.$refs.unlock.importAccount().then((wallet) => {
                    if (typeof wallet === 'object') {
                        let balance = this.$web3.eth.getBalance(wallet.address, 'latest')
                        if (balance.toJSON() < this.totalPrice) {
                            this.$message({
                                message: this.$msg.balanceNotEnough,
                                type: 'error'
                            })
                            return
                        }
                        if (wallet.address !== this.address) {
                            this.$confirm(this.$msg.diffrentAccount, '账户不一致', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.$funs.setLocalAddress(wallet)
                                this.address = wallet.address
                                this.balance = this.$web3.fromWei(this.$web3.toDecimal(balance), 'ether')
                                this.privateKey = wallet.privateKey.replace('0x', '')
                                this.getSignMsg().then(() => {
                                    this.steps = '3'
                                })
                            }).catch(() => {
                                this.privateKey = wallet.privateKey.replace('0x', '')
                                this.getSignMsg().then(() => {
                                    this.steps = '3'
                                })
                            })
                        } else {
                            this.privateKey = wallet.privateKey.replace('0x', '')
                            this.getSignMsg().then(() => {
                                this.steps = '3'
                            })
                        }

                    }
                }, (err) => {
                })
            },
            /**
             * 点击 发送交易
             */
            emitTransaction() {
                this.transactionMsg = {
                    from: this.address,
                    to: this.form.to,
                    value: this.form.value + ' FOF',
                    balance: this.balance,
                    coin: this.unit,
                    network: '',
                    gasLimit: this.form.gas,
                    gasPrice: this.$store.state.gasPrice + ' Gwei',
                    maxTXFee: this.form.gas * this.$store.state.gasPrice + ' Gwei',
                    nonce: this.$web3.eth.getTransactionCount(this.address),
                    data: '0x'
                }
                this.steps = '4'
            },
            abandon() {
                this.steps = '1'
            },
            /**
             * 点击 确认发送交易
             */
            confirmTransaction() {
                this.$web3.eth.sendRawTransaction(this.transactionSign, (err, hash) => {
                    if (err) {
                        this.$message({
                            message: String(err),
                            type: 'error',
                        })
                    } else {
                        this.$message({
                            message: this.$msg.transactionSucc,
                            type: 'success'
                        })
                        this.transactionHash = hash
                        this.steps = '5'
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
                    }
                })
            },
            finished() {
                this.steps = '1'
            },
            getSignMsg() {
                return new Promise((resolve, reject) => {
                    let Tx = require('ethereumjs-tx')
                    let privateKey = new Buffer(this.privateKey, 'hex')
                    let nonce = this.$web3.eth.getTransactionCount(this.address)
                    let rawTx = {
                        nonce: this.$web3.toHex(nonce),
                        gasPrice: this.$web3.toHex(this.$store.state.gasPrice * (Math.pow(10, 9))),
                        gasLimit: this.$web3.toHex(this.form.gas),
                        to: this.form.to,
                        value: this.$web3.toHex(this.$web3.toWei(this.form.value, 'ether')),
                        data: "",
                        datasourcecode:""
                    }
                    let tx = new Tx(rawTx)
                    tx.sign(privateKey)
                    let serializedTx = tx.serialize()
                    this.transactionSign = '0x' + serializedTx.toString('hex')
                    this.transactionData = JSON.stringify(rawTx)
                    resolve()
                })
            }
        },
        mounted() {
            let obj = this.$funs.getLocalAddress()
            this.address = obj.addresses[obj.active]

            if (this.address) {
                let balance = this.$web3.eth.getBalance(this.address)
                this.balance = this.$web3.fromWei(this.$web3.toDecimal(balance), 'ether')
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    $title_color: #cec8ff;
    $content_color: #8abdec;

    .transaction {
        .tranc-header {
            display: flex;
            text-align: center;
            p {
                flex-grow: 1;
                line-height: 70px;
                background-color: #221D44;
                box-shadow: 1px 0 0 0 #272345;
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

        .tranc-body {
            padding: 20px 90px;
            font-size: 20px;

            .step-1 {

                .step-1-head {
                    padding: 20px 0;
                    line-height: 60px;
                    color: #8490c5;
                    i {
                        display: inline-block;
                        height: 30px;
                        width: 30px;
                        margin-right: 10px;
                        margin-left: 50px;
                        vertical-align: text-top;
                    }
                    .tranc-balance {
                        display: inline-block;
                        i {
                            background: url("../../assets/images/transaction/icon_zz_zhye.png") no-repeat;
                        }
                    }
                    .tranc-address {
                        display: inline-block;
                        i {
                            background: url("../../assets/images/transaction/icon_zz_zhdz.png") no-repeat;
                        }
                    }
                }
                .step-1-body {
                    border-top: 1px solid #28234D;
                    border-bottom: 1px solid #28234D;
                    padding-bottom: 20px;
                    .el-form {

                        width: 850px;
                        margin: 0 auto;
                    }
                }
                .step-1-footer {
                    width: 850px;
                    margin: 0 auto;
                }
            }
            .step-2 {
                width: 850px;
                margin: 50px auto 0;
            }
        }

        /*.el-select .el-input {*/
        /*width: 130px;*/
        /*}*/
        .step-3 {
            .step-3-content {
                display: flex;
                padding: 30px 0 50px 0;
                border-bottom: 1px solid #28234D;
                justify-content: space-around;
                .emitTransaction {
                    width: 40%;
                }
            }
            .step-3-footer {
                width: 850px;
                margin: 0 auto;
            }
        }
        .step-4 {
            .transactionMsg {
                margin: 0 auto;
                li {
                    line-height: 40px;
                    span {
                        color: $title_color;
                        display: inline-block;
                        width: 300px;
                        text-align: right;
                    }
                    b {
                        color: $content_color;
                    }
                }
            }
            .tc {
                border-bottom: 1px solid #28234D;
                padding-top: 40px;
                padding-bottom: 30px;
                color: #f39eff;
            }
            .step-4-footer {
                width: 850px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                .abandon {
                    width: 300px;
                    height: 64px;
                    margin-top: 50px;
                    border: solid 1px #443e67;
                    font-size: 26px;
                    color: #7e78a5;
                    background: none;
                }
                .submit {
                    margin-top: 50px;
                    width: 500px !important;
                }
            }
        }
        .step-5 {
            .step-5-body {
                .el-form {
                    margin: 50px;
                    height: 300px;
                }
                border-bottom: 1px solid #28234D;
            }
            .step-5-footer {
                width: 850px;
                margin: 0 auto;
            }
        }
    }
</style>
