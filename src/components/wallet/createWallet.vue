<template>
    <div>
        <el-form
                label-width="150px"
                label-position="left"
                @submit.native.prevent>

            <el-form-item class="el-wallet-style" label="密码" prop="pwd">
                <el-input class="el-wallet-input"
                          type="password"
                          v-model="formRulesCreate.pwd"
                          auto-complete="off"
                          clearable
                ></el-input>
            </el-form-item>
        </el-form>
        <el-form class="mt-50"
                 label-width="150px"
                 label-position="left"
                 @submit.native.prevent>

            <el-form-item class="el-wallet-style" label="确认密码" prop="pwd">
                <el-input class="el-wallet-input"
                          type="password"
                          v-model="formRulesCreate.confirmPwd"
                          auto-complete="off"
                          clearable
                ></el-input>
            </el-form-item>
        </el-form>

        <el-button class="el-wallet-main-button mt-60" @click="createOrLogin($event)">创建新的钱包</el-button>

        <div class="wallet-info">
            该密码将会加密您的私钥，但不会生成密钥的种子。您需要用此密码加私钥才能解锁您的钱包。
        </div>

        <div class="wallet-help">
            如何创建电子钱包 | 入门
        </div>

        <!--<user-login ref="unlock" :formGroupToggle="formGroupToggle"></user-login>-->

        <!--<el-form label-width="100px" @submit.native.prevent>-->
        <!--<el-form-item>-->
        <!--<el-button type="primary" @click="createOrLogin">{{mainBtnText}}</el-button>-->
        <!--<el-button type="text" size="mini" @click="formGroupToggleFun">{{lastBtnText}}</el-button>-->
        <!--</el-form-item>-->
        <!--</el-form>-->

        <el-dialog class="create-wallet-dialog"
                   title="创建成功"
                   :visible.sync="createDialog"
                   :show-close="false"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   width="800px"
                   center>
            <h2>保存你的Keystore文件！不要忘记你的密码！</h2>

            <div class="wallet-dialog-body">
                <a class="el-button" :href="walletInfo.blobEnc" :download="walletInfo.fileName"
                   @click="walletInfo.fileDownloaded=false">下载Keystore文件(UTC/JSON)</a>

                <el-button type="danger" @click="unlockNewAccount" :disabled="walletInfo.fileDownloaded" style="width: 280px;">
                    点我登陆
                </el-button>
            </div>
            <div class="wallet-dialog-footer">
                <p>千万不要弄丢它！因为它是无法恢复的</p>
                <p>千万不要上传给别人！如果你在一个恶意/钓鱼网站上使用这个文件，你的资金将被窃取</p>
                <p>最好做一个备份！确保它像价值数百万的资金一样安全</p>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import userLogin from './importWallet'

    export default {
        name: "createWallet",
        components: {
            userLogin
        },
        data() {
            return {
                createDialog: false,  //创建成功后显示模态框
                mainBtnText: '创建钱包',
                lastBtnText: '转到解锁',
                formRulesCreate: {       //创建钱包的数据绑定对象
                    pwd: '',
                    confirmPwd: ''
                },
                // rulesCreate: {         //创建钱包的校验对象
                //     pwd: [
                //         {validator: this.$funs.validatePwd, trigger: 'blur'}
                //     ]
                // },
                wallet: null,
                walletInfo: {
                    fileName: '',
                    blobEnc: '',
                    fileDownloaded: true
                }
            }
        },
        methods: {
            createOrLogin(e) {
                this.createDialog = false
                this.walletInfo.fileDownloaded = true
                if (!this.formRulesCreate.pwd || !this.formRulesCreate.confirmPwd) {
                    this.$message({
                        message: this.$msg.pwdIsEmpty,
                        type: 'error'
                    })
                    return
                }
                if (this.formRulesCreate.pwd !== this.formRulesCreate.confirmPwd) {
                    this.$message({
                        message: this.$msg.pwdInconformity,
                        type: 'error'
                    })
                    return
                }
                if (this.$funs.validatePwd(null, this.formRulesCreate.pwd, (param) => {
                        return param || 'true'
                    }) === 'true') {

                    this.wallet = this.$Wallet.createRandom()

                    let encryptPromise = this.wallet.encrypt(this.formRulesCreate.pwd)

                    this.$store.commit('setCryptPercent', {
                            percent: true,
                            text: '正在创建并加密账户，请稍等...'
                        }
                    )

                    let address = this.wallet.getAddress()
                    this.walletInfo.fileName = this.getV3Filename(address)

                    encryptPromise.then((json) => {
                        this.$axios.post('http://39.104.81.103:8101', {
                            "jsonrpc": "2.0",
                            "method": "eth_uploadkeyfile",
                            "params": [this.walletInfo.fileName, json],
                            "id": 1
                        }).then((res) => {

                        }).catch((error) => {
                            console.log(error)
                        })
                        this.walletInfo.blobEnc = this.getBlob("text/json;charset=UTF-8", json)
                        this.$store.commit('setCryptPercent', {
                                percent: false,
                                text: ''
                            }
                        )
                        this.createDialog = true
                    })
                } else {
                    this.$message({
                        message: this.$msg.createPwd,
                        type: 'error'
                    })
                }
            },
            unlockNewAccount() {
                this.$funs.setLocalAddress(this.wallet)
                this.$funs.linkToMainScreenRep(this.wallet)
                this.$message({
                    message: this.$msg.unlockSucc,
                    type: 'success'
                })
            },
            getBlob(mime, str) {
                str = (typeof str === 'object') ? JSON.stringify(str) : str
                if (str == null) return ''
                var blob = new Blob([str], {
                    type: mime
                })
                return window.URL.createObjectURL(blob)
            },
            getV3Filename(address) {
                var ts = new Date()
                return ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', address.toString('hex')].join('')
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .el-form-item {
        margin-bottom: 0;
    }

    .wallet-info {
        margin-top: 30px;
        font-size: 16px;
        color: #9388d3;
        text-align: center;
        line-height: 26px;
    }

    .wallet-help {
        margin-top: 60px;
        font-size: 20px;
        color: #8a9ef0;
        text-align: center;
        cursor: pointer;
    }

    .el-dialog {
        h2 {
            margin-top: 30px;
            font-size: 16px;
            color: #8490c5;
        }
        .wallet-dialog-body {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            a {
                height: 64px;
                line-height: 36px;
                background-color: #5837ff;
                -webkit-border-radius: 2px;
                -moz-border-radius: 2px;
                border-radius: 2px;
                font-size: 18px;
                font-weight: 100;
                border: none;
                color: #fff;
            }
            a:hover, a:focus {
                background-color: #6262FF;
                color: #ffffff;
            }
            .el-button {
                height: 64px;
                -webkit-border-radius: 2px;
                -moz-border-radius: 2px;
                border-radius: 2px;
                font-size: 18px;
            }
        }
        .wallet-dialog-footer {
            margin-top: 30px;
            padding: 10px;
            border: 1px dotted $inner_border_color;
            p {
                font-size: 16px;
                line-height: 30px;
                color: #f39eff;
            }
        }

    }
</style>
