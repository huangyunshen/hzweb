<template>
    <div class="transaction">
        <div class="tranc-content">
            <el-steps :active="Number(steps)" align-center class="tranc-header">
                <el-step :title="$t('transactioncontent')"></el-step>
                <el-step :title="$t('signatureinformation')"></el-step>
                <el-step :title="$t('confirmtransaction')"></el-step>
                <el-step :title="$t('transactioncomplete')"></el-step>
            </el-steps>
            <div class="middle-line">
                <p></p>
            </div>
            <!--step-1-->
            <transition name="fof-fade">
                <div class="step-1" v-show="steps==='1'">
                    <div class="step-1-body">
                        <el-form ref="form" :model="form" label-position="left" label-width="150px">
                            <el-form-item class="mt-40" :label="$t('otheraccounts')">
                                <el-input
                                    v-model="form.to"
                                ></el-input>
                            </el-form-item>
                            <el-form-item class="mt-40" :label="$t('transferamount')">
                                <el-input
                                    :placeholder="$t('amount')"
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
                </div>
            </transition>
            <transition name="fof-fade">
                <div class="step-2" v-show="steps==='2'">
                    <div class="step-2-content">
                        <div class="sined-textarea">
                            <el-form label-position="top">
                                <el-form-item :label="$t('inactivetransaction')" class="el-wallet-style">
                                    <el-input
                                        type="textarea"
                                        resize="none"
                                        readonly
                                        :value="transactionData"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="sined-textarea">
                            <el-form label-position="top">
                                <el-form-item :label="$t('signaturetransaction')">
                                    <el-input
                                        type="textarea"
                                        resize="none"
                                        readonly
                                        :value="transactionSign"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </transition>
            <!--step4-->
            <transition name="fof-fade">
                <div class="step-3" v-show="steps==='3'">
                    <div class="transaction-msg">
                        <ul>
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
                                <b>{{ transactionMsg.value | amountUnit}}</b>
                            </li>
                            <li>
                                <span>Account Balance:</span>
                                <b>{{ transactionMsg.balance | amountUnit}}</b>
                            </li>
                            <li>
                                <span>Coin:</span>
                                <b>{{ transactionMsg.coin}}</b>
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
                            {{$t('youwillsend')}}
                            <span>{{ form.value | amountUnit}}</span>
                            {{$t('toaddress')}}
                            <span>{{ form.to }}</span>
                            <span>{{$t('pleaseconfirm')}}</span>
                        </div>
                    </div>
                </div>
            </transition>
            <!--step5-->
            <transition name="fof-fade">
                <div class="step-4" v-show="steps==='4'">
                    <div class="step-4-body">
                        <el-form label-position="top">
                            <el-form-item :label="$t('transactionhash')" class="el-wallet-style">
                                <el-input
                                    readonly
                                    :value="transactionHash"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </transition>
        </div>

        <div class="middle-line">
            <p></p>
        </div>
        <div class="trade-btn">
            <div class="step-btn" v-show="steps==='1'">
                <el-button @click="typePwd">{{$t('generatetransaction')}}</el-button>
            </div>
            <div class="step-btn" v-show="steps==='2'">
                <el-row :gutter="40">
                    <el-button class="abandon" @click="steps = '1'">{{$t('previous')}}</el-button>
                    <el-button @click="emitTransaction">{{$t('confirmsignature')}}</el-button>
                </el-row>
            </div>
            <div class="step-btn" v-show="steps==='3'">
                <el-button class="abandon" @click="abandon">{{$t('giveup')}}</el-button>
                <el-button @click="confirmTransaction">{{$t('sendtransaction')}}</el-button>
            </div>
            <div class="step-btn" v-show="steps==='4'">
                <el-button @click="finished">{{$t('carryout')}}</el-button>
            </div>
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
                    value: '',
                    gas: '210000',
                },
                unit: 'FOF',
                // address: '',
                privateKey: '',
                // balance: '0',
                // password: '',
                transactionHash: '', // 交易hash
                transactionData: '',
                transactionSign: '',
                transactionMsg: {}
            }
        },
        computed: {
            balanceToWei() {
                return Number(this.$web3.utils.toWei(this.$store.state.balance))
            },
            valueToWei() {
                return Number(this.$web3.utils.toWei(this.form.value, 'ether'))
            },
            totalPrice() {
                let total = ((this.$store.state.gasPrice * Math.pow(10, 9)) * this.form.gas) + this.valueToWei
                return total
            }
        },
        methods: {
            /**
             * 点击 生成交易
             */
            typePwd() {
                if (!this.$web3.utils.isAddress(this.form.to)) {
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
                this.getSignMsg().then(() => {
                    this.steps = '2'
                })
            },
            /**
             * 点击 发送交易
             */
            emitTransaction() {
                this.$web3.eth.getTransactionCount(this.$store.state.address).then((nonce) => {

                    this.transactionMsg = {
                        from: this.$store.state.address,
                        to: this.form.to,
                        value: this.form.value,
                        balance: this.$store.state.balance,
                        coin: this.unit,
                        network: '',
                        gasLimit: this.form.gas,
                        gasPrice: this.$store.state.gasPrice + ' Gwei',
                        maxTXFee: this.form.gas * this.$store.state.gasPrice + ' Gwei',
                        nonce: nonce,
                        data: ''
                    }
                    console.log(this.transactionMsg);
                    this.steps = '3'
                })
            },
            abandon() {
                this.steps = '1'
            },
            /**
             * 点击 确认发送交易
             */
            confirmTransaction() {
                this.$store.commit('setCryptPercent', {
                        percent: true,
                        text:this.$t('sendingatransactionpleasewait') 
                    }
                )
                this.$web3.eth.sendSignedTransaction(this.transactionSign)
                    .on('error', (err) => {
                        this.$store.commit('setCryptPercent', {
                                percent: false,
                                text: ''
                            }
                        )
                        this.$message({
                            message: String(err),
                            type: 'error',
                        })
                    })
                    .then((receipt) => {
                        this.transactionHash = receipt.transactionHash
                        this.steps = '4'
                        this.$store.commit('setCryptPercent', {
                                percent: false,
                                text: ''
                            }
                        )
                        this.$message({
                            message: this.$msg.transactionSucc,
                            type: 'success'
                        })
                    })

            },
            finished() {
                this.steps = '1'
                this.$funs.getBalance()
            },
            getSignMsg() {
                return new Promise((resolve, reject) => {
                    this.$web3.eth.getTransactionCount(this.$store.state.address).then((nonce) => {
                        let rawTx = {
                            nonce: this.$web3.utils.toHex(nonce),
                            gasPrice: this.$web3.utils.toHex(this.$store.state.gasPrice * (Math.pow(10, 9))),
                            gas: this.$web3.utils.toHex(this.form.gas),
                            to: this.form.to,
                            value: this.$web3.utils.toHex(this.$web3.utils.toWei(this.form.value, 'ether')),
                            data: "",
                            txType: 0,
                        }
                        this.transactionData = JSON.stringify(rawTx)
                        this.$web3.eth.accounts.signTransaction(rawTx, this.$funs.getActiveAccount().privateKey, (err, data) => {
                            if (err) {
                                this.$message.error(String(err))
                            } else {
                                if (data) {
                                    this.transactionSign = data.rawTransaction
                                }
                            }
                            resolve()
                        })
                    })
                })
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    $title_color: #cec8ff;
    $content_color: #8abdec;

    .transaction {
        height: 100%;

        .middle-line {
            padding: 0 5%;
            p {
                border-bottom: 1px solid #28234D;
            }
        }
        .tranc-content {
            font-size: 20px;
            height: calc(100% - 100px);
            overflow-y: auto;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .tranc-header {
                margin: 20px 0;
            }
            .step-1 {
                min-height: calc(100% - 100px);
                display: flex;
                justify-content: center;
                align-items: center;
                .step-1-body {
                    .el-form {
                        width: 850px;
                        margin: 0 auto;
                    }
                }
            }
            .step-2 {
                min-height: calc(100% - 100px);
                display: flex;
                justify-content: center;
                align-items: center;
                .step-2-content {
                    width: 100%;
                    .sined-textarea {
                        float: left;
                        width: 40%;
                        margin-left: 7%;
                    }
                }
            }
            .step-3 {
                min-height: calc(100% - 100px);
                display: flex;
                justify-content: center;
                align-items: center;
                .transaction-msg {
                    li {
                        line-height: 35px;
                        span {
                            color: $title_color;
                            display: inline-block;
                            width: 30%;
                            text-align: right;
                        }
                        b {
                            color: $content_color;
                        }
                    }
                }
                .tc {
                    padding: 20px 0;
                    color: #f39eff;
                }
            }
            .step-4 {
                min-height: calc(100% - 100px);
                display: flex;
                justify-content: center;
                align-items: center;
                .step-4-body {
                    width: 80%;
                    margin: 0 auto;
                    .el-form {
                        margin: 0 30px;
                    }
                }
            }
        }
        .trade-btn {
            height: 60px;
            padding: 20px 0;
            .step-btn {
                width: 850px;
                margin: 0 auto;
                text-align: center;
                .el-button {
                    width: 350px;
                    height: 60px;
                    background-color: #5837ff;
                    font-size: 26px;
                    font-weight: 500;
                    color: #ffffff;
                    border: none;
                    &:hover {
                        background-color: #6262FF;
                        color: #ffffff;
                    }
                    &:disabled {
                        background: #9386CE;
                    }
                }
                .abandon {
                    width: 250px;
                    border: solid 1px #443e67;
                    color: #7e78a5;
                    background: none;
                }
            }
        }
    }
</style>
