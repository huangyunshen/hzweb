<template>
    <div class="transaction">
        <el-form ref="form" :model="form" label-position="right" label-width="150px">
            <el-form-item label="本账户地址">
                <el-input :value="address" readonly></el-input>
            </el-form-item>
            <el-form-item label="账户余额">
                <el-input :value="balance + ' ETH'" readonly></el-input>
            </el-form-item>
            <el-form-item label="发送至地址">
                <el-input v-model="form.to" placeholder="0x27d024958a6105a5c8cbd95a8ecb1ff35ad91016"></el-input>
            </el-form-item>
            <el-form-item label="转账数额">
                <el-input placeholder="数额" v-model="form.value" class="input-with-select">
                    <el-select v-model="unit" slot="append" style="width: 100px">
                        <el-option label="ETH" value="ETH"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="Gas Limit">
                <el-input v-model="form.gas" value="21000" placeholder="21000"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="typePwd" style="width:100%;">生成交易</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
                title="请输入密码"
                center
                :visible.sync="dialogVisible"
                width="30%">
            <el-form label-width="80px">
                <el-form-item label="账户地址">
                    <el-input :value="address" readonly></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" placeholder="请输入密码" v-model="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="交易信息"
                center
                min-width="40%"
                :visible.sync="signVisible">
            <el-form label-width="100px" :inline="true" class="emitTransaction">
                <el-form-item label="未生效交易">
                    <el-input type="textarea" readonly :value="transactionData"></el-input>
                </el-form-item>
                <el-form-item label="签名交易">
                    <el-input type="textarea" readonly :value="transactionSign"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" style='width: 80%' @click="emitTransaction">发送交易</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="确认信息"
                center
                :visible.sync="confirmVisible">
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
                    <b>{{ transactionMsg.to }}</b>
                </li>
                <li>
                    <span> Nonce:</span>
                    <b>{{ transactionMsg.nonce }}</b>
                </li>
                <li>
                    <span>Data:</span>
                    <b>{{ transactionMsg.data }}</b>
                </li>
            </ul>
            <div class="tc" style="font-size: 20px;line-height: 30px">
                你将发送
                <span style="font-weight: bold">{{ form.value }} ETH</span>
                到地址
                <span style="font-weight: bold">{{ form.to }}</span>
                <br>
                <span style="color: #f00">你确定这样做吗？</span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="confirmVisible = false">不，离开这里</el-button>
                <el-button type="primary" @click="confirmTransaction">是的，发送交易</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="交易结果"
                center
                :visible.sync="showHashVisible">
            <el-form label-width="100px">
                <el-form-item label="交易hash地址">
                    <el-input :value="transactionHash" readonly></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "transaction",
        data() {
            return {
                form: {
                    to: '',
                    value: '',
                    gas: '21000',
                },
                unit: 'ETH',
                address: '',
                balance: 0,
                dialogVisible: false,
                signVisible: false,
                confirmVisible: false,
                showHashVisible: false,
                password: '',
                transactionHash: '', // 交易hash
                transactionData: '',
                transactionSign: '',
                transactionMsg: {}
            }
        },
        methods: {
            /**
             * 点击 生成交易
             */
            typePwd() {
                this.password = ''
                if (this.form.to.trim() === '') {
                    this.$message.error(this.$msg.emptyAddress)
                    return
                }
                if (this.form.value.trim() === '') {
                    this.$message.error(this.$msg.emptyValue)
                    return
                }
                let reg = /^[0-9]*$/
                if (this.form.gas.trim() === '' || !reg.test(this.form.gas) || this.form.gas.trim() === '0') {
                    this.$message.error(this.$msg.invalidGas)
                    return
                }
                this.dialogVisible = true
            },
            unlock() {
                if (this.$unlock.publicKeyUnlock(this.address, this.password)) {
                    this.$message.success(this.$msg.unlockSucc)
                    return true
                } else {
                    this.$message.error(this.$msg.unlockFailByPwd)
                    return false
                }
            },
            /**
             * 点击 输入密码弹窗
             */
            onSubmit() {
                if (!this.unlock()) {
                    return
                }
                this.dialogVisible = false
                let timer = setTimeout(() => {
                    clearTimeout(timer)
                    this.getSignMsg()
                    this.signVisible = true
                }, 1000)
            },
            /**
             * 点击 发送交易
             */
            emitTransaction() {
                this.signVisible = false
                let timer = setTimeout(() => {
                    clearTimeout(timer)
                    this.confirmVisible = true
                    this.transactionMsg = {
                        from: this.address,
                        to: this.form.to,
                        value: this.form.value + ' ETH',
                        balance: this.balance,
                        coin: this.unit,
                        network: '',
                        gasLimit: this.form.gas,
                        gasPrice: this.$store.state.gasPrice,
                        caxTXFee: this.gasLimit * this.gasPrice + ' Gwei',
                        nonce: '0',
                        data: ''
                    }
                }, 1000)
            },
            /**
             * 点击 确认发送交易
             */
            confirmTransaction() {
                this.form.gas = this.form.gas === '' ? 21000 : this.form.gas
                let param = {
                    method: 'eth_sendTransaction',
                    params: [{
                        "from": this.address,
                        "to": this.form.to,
                        "gas": this.$web3.toHex(this.form.gas),
                        "value": this.$web3.toHex(this.$web3.toWei(this.form.value, 'ether')),
                    }],
                    id: '1'
                }
                console.log(this.transactionSign)
                this.$web3.eth.sendRawTransaction(this.transactionSign,(err,hash)=>{
                    console.log('err: ' + err)
                    console.log('hash: ' + hash)
                })
                // this.$axios(param)
                //     .then((res) => {
                //         if (res.data.result) {
                //             this.$message.success(this.$msg.transactionSucc)
                //             this.transactionHash = res.data.result
                //             this.confirmVisible = false
                //             let timer = setTimeout(() => {
                //                 clearTimeout(timer)
                //                 this.showHashVisible = true
                //             }, 1000)
                //         } else {
                //             this.$message.error(this.$msg.transactionFail + res.data.error.message)
                //             let timer = setTimeout(() => {
                //                 clearTimeout(timer)
                //                 this.confirmVisible = false
                //             }, 1000)
                //         }
                //     })
                //     .catch((err) => {
                //         this.$message.error(err)
                //     })
            },
            getSignMsg() {
                let data = {
                    "nonce": "0x00",
                    "gasPrice": this.$web3.toHex(this.$store.state.gasPrice * (Math.pow(10, 9))),
                    "gasLimit": this.$web3.toHex(this.form.gas),
                    "to": this.form.to,
                    "value": this.$web3.toHex(this.$web3.toWei(this.form.value, 'ether')),
                    "data": "0x",
                    "chainId": 1
                }
                this.transactionData = JSON.stringify(data)
                this.transactionSign = this.$web3.eth.sign(this.address, this.$web3.sha3(JSON.stringify(data)))
            }
        },
        mounted() {
            this.address = sessionStorage.getItem('publicKey')
            if (this.address) {
                let params = {
                    method: 'eth_getBalance',
                    params: [this.address, "latest"],
                    id: '1'
                }
                this.$axios(params)
                    .then((response) => {
                        if (response.data.result) {
                            this.balance = this.$web3.fromWei(this.$web3.toDecimal(response.data.result), 'ether')
                        } else {
                            this.$message.error(this.$msg.emptyResult)
                        }
                    })
                    .catch((error) => {
                        this.$message.error(error)
                    })
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .transaction {
        width: 60%;
        margin: 2% auto;
        .el-select .el-input {
            width: 130px;
        }
        .emitTransaction {
            .el-form-item {
                width: 50%;
            }
        }
        .transactionMsg {
            margin: 20px auto;
            width: 80%;
            li {
                white-space: nowrap;
                height: 30px;
                line-height: 30px;
                font-size: 18px;
                span {
                    display: inline-block;
                    width: 150px;
                    text-align: right;
                }
            }
        }
    }
</style>