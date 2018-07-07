<template>
    <div class="create-wallet">
        <el-form
                label-width="150px"
                label-position="left"
                @submit.native.prevent>

            <el-form-item class="el-wallet-style" prop="pwd">
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

            <el-form-item class="el-wallet-style"  prop="pwd">
                <el-input class="el-wallet-input"
                          type="password"
                          v-model="formRulesCreate.confirmPwd"
                          auto-complete="off"
                          clearable
                ></el-input>
            </el-form-item>
        </el-form>
        <p class="agreed">
            <el-checkbox v-model="agreed">我已仔细阅读并同意</el-checkbox>
            <span class="deal" @click="agreedDialog = true">《服务及隐私协议》</span>
        </p>

        <el-button class="el-wallet-main-button" @click="createWallet()">创建钱包</el-button>
        <p class="tr import-wallet"><router-link tag="a" @click.native="importWallet" :to="{name:'importWallet'}">导入钱包</router-link></p>
        <div class="wallet-info">
            该密码将会加密您的私钥，但不会生成密钥的种子。您需要用此密码加私钥才能解锁您的钱包。
        </div>

        <!--<div class="wallet-help">
            如何创建电子钱包 | 入门
        </div>-->

        <el-dialog class="wallet-agreement"
                   title="用户协议"
                   :visible.sync="agreedDialog"
                   :show-close="false"
                   center
                   width="1200px"
        >
            <div class="body" style="height: 50vh;">
                <agreement></agreement>
            </div>
            <div class="footer">
                <el-button @click="agreedDialog = false">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog class="create-wallet-dialog"
                   title="创建成功"
                   :visible.sync="createDialog"
                   :show-close="false"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   width="800px"
                   top="30vh"
                   center>
            <h2>保存你的钱包备份文件！不要忘记你的密码！</h2>

            <div class="wallet-dialog-body">
                <a class="el-button" :href="walletInfo.blobEnc" :download="walletInfo.fileName"
                   @click="walletInfo.fileDownloaded=false" style="width: 280px;">下载钱包备份文件</a>

                <el-button type="danger" @click="unlockNewAccount" :disabled="walletInfo.fileDownloaded"
                           style="width: 280px;">
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
    import agreement from '../wallet/walletAgreement'

    export default {
        name: "createWallet",
        components: {
            userLogin,
            agreement
        },
        data() {
            return {
                createDialog: false,  //创建成功后显示模态框
                formRulesCreate: {       //创建钱包的数据绑定对象
                    pwd: '111111111',
                    confirmPwd: '111111111'
                },
                walletInfo: {
                    fileName: '',
                    blobEnc: '',
                    fileDownloaded: true
                },
                agreed: false,
                agreedDialog: false
            }
        },
        methods: {
            createWallet() {
                this.createDialog = false
                this.walletInfo.fileDownloaded = true
                if(localStorage.getItem('web3js_wallet')) {
                    this.$message({
                        message: this.$msg.walletIsExist,
                        type: 'warning'
                    })
                    return
                }
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
                if (!this.agreed) {
                    this.$message({
                        message: this.$msg.notAgreed,
                        type: 'error'
                    })
                    return
                }
                if (this.$funs.validatePwd(null, this.formRulesCreate.pwd, (param) => {
                        return param || 'true'
                    }) === 'true') {
                    this.$store.commit('setCryptPercent', {
                            percent: true,
                            text: '正在创建并加密钱包，请稍等...'
                        }
                    )
                    setTimeout(() => {
                        let wallet = this.$web3.eth.accounts.wallet.create(1)
                        let encryptedJSON = this.$web3.eth.accounts.wallet.encrypt(this.formRulesCreate.pwd)

                        let address = wallet[0].address
                        this.walletInfo.fileName = this.getV3Filename(address)

                        this.walletInfo.blobEnc = this.getBlob("text/json;charset=UTF-8", encryptedJSON)
                        this.$store.commit('setCryptPercent', {
                                percent: false,
                                text: ''
                            }
                        )
                        this.createDialog = true
                        this.$web3.eth.accounts.wallet.save(this.formRulesCreate.pwd)
                        this.$funs.setActiveAccount(address)
                    },500)
                } else {
                    this.$message({
                        message: this.$msg.createPwd,
                        type: 'error'
                    })
                }
            },
            unlockNewAccount() {
                this.$router.replace({name: 'accountInfo',params:{loadAcc:true}})
                this.$funs.loadActivWallet()
            },
            getBlob(mime, str) {
                str = (typeof str === 'object') ? JSON.stringify(str) : str
                if (str == null) return ''
                let blob = new Blob([str], {
                    type: mime
                })
                return window.URL.createObjectURL(blob)
            },
            getV3Filename(address) {
                let ts = new Date()
                // return ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', address.toString('hex')].join('')
                return ['FOF-Wallet-', ts.toJSON().slice(0,11), ts.toTimeString().slice(0,8).replace(/:/g,"-")].join('')
            },
            importWallet(){
                this.$emit('getTitle', "导入钱包");
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .import-wallet {
        padding: 15px 0;
        padding-right: 0px;
        position: relative;
        bottom: -35px;
        left: -255px;
        font-size: 24px;
        a{
            color: greenyellow;
            text-decoration: underline;
            &:hover{
                color: #2A9CE7;
            }
        }
    }
    .el-form-item {
        margin-bottom: 0;
    }

    .wallet-info {
        font-size: 16px;
        color: #8a9df0;
        text-align: center;
        line-height: 26px;
        position: absolute;
        bottom: 20px;
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
