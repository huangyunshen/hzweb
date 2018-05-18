<template>
    <div>
        <!--<el-form-->
        <!--label-width="150px"-->
        <!--label-position="left"-->
        <!--:rules="rulesCreate"-->
        <!--:model="formRulesCreate"-->
        <!--ref="formRulesCreate"-->
        <!--@submit.native.prevent>-->

        <!--<el-form-item class="el-wallet-style" label="创建钱包" prop="pwd">-->
        <!--<el-input-->
        <!--type="password"-->
        <!--v-model="formRulesCreate.pwd"-->
        <!--:placeholder="this.$msg.createPwd"-->
        <!--auto-complete="off"-->
        <!--clearable-->
        <!--&gt;</el-input>-->
        <!--</el-form-item>-->
        <!--</el-form>-->
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

        <el-dialog
                title="创建成功"
                :visible.sync="createDialog"
                width="50%"
                center>
            <h2>保存你的Keystore文件和助记词！不要忘记你的密码！</h2>
            <el-form :model="modalForm">
                <el-form-item label="账户地址" :label-width="modalForm.labelWidth">
                    <el-input readonly v-model="wallet.address.toLowerCase() || ''">
                        <el-button slot="append" @click="copyPublicKey" icon="el-icon-document">复制</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="助记词" :label-width="modalForm.labelWidth">
                    <el-input readonly v-model="wallet.mnemonic || ''">
                        <el-button slot="append" @click="copyPublicKey" icon="el-icon-document">复制</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="私钥" :label-width="modalForm.labelWidth">
                    <el-input readonly v-model="wallet.privateKey.replace('0x','') || ''">
                        <el-button slot="append" @click="copyPublicKey" icon="el-icon-document">复制</el-button>
                    </el-input>
                </el-form-item>
            </el-form>

            <div>
                <a class="el-button" :href="walletInfo.blobEnc" :download="walletInfo.fileName"
                   @click="walletInfo.fileDownloaded=false">下载Keystore文件
                    （UTC / JSON）</a>
            </div>
            <div>
                <p><span>千万不要弄丢它！ 因为它是无法恢复的。</span></p>
                <p><span>千万不要上传给别人！ 如果你在一个恶意/钓鱼网站上使用这个文件，你的资金将被窃取。</span></p>
                <p><span>最好做一个备份！ 确保它像价值数百万的资金一样安全。</span></p>
            </div>


            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="unlockNewAccount" :disabled="walletInfo.fileDownloaded">
                    我已备份好账户信息，点击解锁
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import userLogin from './importWallet';

    export default {
        name: "createWallet",
        components: {
            userLogin
        },
        data() {
            return {
                // formGroupToggle: true,    //创建或者解锁面板
                createDialog: false,  //创建成功后显示模态框
                mainBtnText: '创建钱包',
                lastBtnText: '转到解锁',
                formRulesCreate: {       //创建钱包的数据绑定对象
                    pwd: '',
                    confirmPwd: ''
                },
                rulesCreate: {         //创建钱包的校验对象
                    pwd: [
                        {validator: this.$funs.validatePwd, trigger: 'blur'}
                    ]
                },
                modalForm: {
                    pwd: '',
                    showType: 'password',
                    labelWidth: '100px'
                },
                wallet: {
                    address: '',
                    mnemonic: '',
                    privateKey: ''
                },
                walletInfo: {
                    fileName: '',
                    blobEnc: '',
                    fileDownloaded: true
                }
            }
        },
        methods: {
            // formGroupToggleFun() {     //切换创建和解锁
            //     if (this.formGroupToggle) {
            //         this.mainBtnText = '解锁钱包';
            //         this.lastBtnText = '转到创建';
            //     } else {
            //         this.mainBtnText = '创建钱包';
            //         this.lastBtnText = '转到解锁';
            //     }
            //     this.formGroupToggle = !this.formGroupToggle;
            // },
            createOrLogin(e) {

                // if (this.formGroupToggle === true) {      //创建钱包
                if (!this.formRulesCreate.pwd || !this.formRulesCreate.confirmPwd) {
                    this.$message.error(this.$msg.pwdIsEmpty)
                    return
                }
                if (this.formRulesCreate.pwd !== this.formRulesCreate.confirmPwd) {
                    this.$message.error(this.$msg.pwdInconformity)
                    return
                }
                if (this.$funs.validatePwd(null, this.formRulesCreate.pwd, (param) => {
                        return param || 'true';
                    }) === 'true') {

                    this.wallet = this.$Wallet.createRandom()

                    let encryptPromise = this.wallet.encrypt(this.formRulesCreate.pwd);

                    this.$store.commit('setCryptPercent', {
                            percent: true,
                            text: '正在创建并加密账户，请稍等...'
                        }
                    )

                    let address = this.wallet.getAddress()
                    this.walletInfo.fileName = this.getV3Filename(address)

                    encryptPromise.then((json) => {

                        this.walletInfo.blobEnc = this.getBlob("text/json;charset=UTF-8", json)

                        this.$store.commit('setPublicKey', this.wallet.address.toLowerCase())
                        this.$store.commit('setMnemonic', this.wallet.mnemonic)
                        this.$store.commit('setPrivateKey', this.wallet.privateKey.replace('0x', ''))

                        this.$store.commit('setCryptPercent', {
                                percent: false,
                                text: ''
                            }
                        )
                        this.createDialog = true
                    });
                } else {
                    this.$message.error(this.$msg.createPwd)
                }
                // } else {        //解锁钱包
                //     this.$refs.unlock.unlockAccount()
                // }
            },
            copyPublicKey($event) {
                let input = $event.target.parentElement.previousElementSibling
                input.select()
                document.execCommand('copy')
            },
            unlockNewAccount() {
                this.$funs.linkToMainScreenRep()
                this.$message.success(this.$msg.unlockSucc)
            },
            getBlob(mime, str) {
                str = (typeof str === 'object') ? JSON.stringify(str) : str;
                if (str == null) return '';
                var blob = new Blob([str], {
                    type: mime
                });
                return window.URL.createObjectURL(blob);
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
            margin-bottom: 20px;
        }
        h2, div {
            text-align: center;
            a {
                color: #fff;
                background-color: #4DAD95;
                border-color: #4DAD95;
            }
            a:hover, a:focus {
                background: #5AC9AF;
                border-color: #5AC9AF;
            }
            p {
                font-size: 16px;
                line-height: 40px;
                span {
                    color: #C12E2E;
                }
            }
        }

    }
</style>
