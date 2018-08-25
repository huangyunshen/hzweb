<template>
    <div class="create-wallet">
        <el-form
                label-width="140px"
                label-position="left"
                @submit.native.prevent>

            <el-form-item class="el-wallet-style" prop="pwd" :label="$t('enterpassword')">
                <el-input class="el-wallet-input"
                          type="password"
                          v-model="formRulesCreate.pwd"
                          auto-complete="off"
                          clearable
                ></el-input>
            </el-form-item>
        </el-form>
        <el-form class="mt-50"
                 label-width="140px"
                 label-position="left"
                 @submit.native.prevent>

            <el-form-item class="el-wallet-style"  prop="pwd" :label="$t('confirmpassword')">
                <el-input class="el-wallet-input"
                          type="password"
                          v-model="formRulesCreate.confirmPwd"
                          auto-complete="off"
                          clearable
                ></el-input>
            </el-form-item>
        </el-form>
        <p class="agreed">
            <el-checkbox v-model="agreed">{{$t('ihavereadandagreed')}}</el-checkbox>
            <span class="deal" @click="agreedDialog = true">{{$t('serviceandprivacyagreement')}}</span>
        </p>

        <el-button class="el-wallet-main-button" @click="createWallet()">{{$t('createawallet')}}</el-button>
        <p class="tr import-wallet"><router-link tag="a" @click.native="importWallet" :to="{name:'importWallet'}">{{$t('importWallet')}}</router-link></p>
        <div class="wallet-info">
            {{$t('thispasswordwillencryptyourprivatekeybutwillnotgenerateaseedofthekeyyouwillneedtousethispasswordplusaprivatekeytounlockyourwallet')}}
        </div>

        <!--<div class="wallet-help">
            如何创建电子钱包 | 入门
        </div>-->

        <el-dialog class="wallet-agreement"
                   :title="$t('useragreement')"
                   :visible.sync="agreedDialog"
                   :show-close="false"
                   center
                   width="1200px"
        >
            <div class="body" style="height: 50vh;">
                <agreement></agreement>
            </div>
            <div class="footer">
                <el-button @click="agreedDialog = false">{{$t('determine')}}</el-button>
            </div>
        </el-dialog>

        <el-dialog class="create-wallet-dialog"
                   :title="$t('createdsuccessfully')"
                   :visible.sync="createDialog"
                   :show-close="false"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   width="800px"
                   top="30vh"
                   center>
            <h2>{{$t('saveyourwalletbackupfileDontforgetyourpassword')}}</h2>

            <div class="wallet-dialog-body">
                <a class="el-button" :href="walletInfo.blobEnc" :download="walletInfo.fileName"
                   @click="walletInfo.fileDownloaded=false" style="width: 280px;">{{$t('downloadwalletbackupfile')}}</a>

                <el-button type="danger" @click="unlockNewAccount" :disabled="walletInfo.fileDownloaded"
                           style="width: 280px;">
                    {{$t('clickmetologin')}}
                </el-button>
            </div>
            <div class="wallet-dialog-footer">
                <p>{{$t('dontloseitbecauseitisunrecoverable')}}</p>
                <p>{{$t('neveruploadtoothersifyouusethisfileonamaliciousorphishingwebsite,yourfundswillbestolen')}}</p>
                <p>{{$t('pleasemakeabackupandrememberitspasswordmakesureitsassafeasmillionsofdollarsworth')}}</p>
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
                if (this.formRulesCreate.pwd.trim().length < 9) {
                    this.$message({
                        message: this.$msg.createPwd,
                        type: 'error'
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
                            text: this.$t('creatingandencryptingwalletpleasewait')
                        }
                    )
                    setTimeout(() => {
                        let wallet = this.$web3.eth.accounts.wallet.create(1)
                        let encryptedJSON = this.$web3.eth.accounts.wallet.encrypt(this.formRulesCreate.pwd)
                        wallet.myPwd = this.formRulesCreate.pwd

                        let address = wallet[0].address
                        // this.walletInfo.fileName = this.$funs.getV3Filename(address)
                        this.walletInfo.fileName = this.$funs.getV3Filename()

                        this.walletInfo.blobEnc = this.$funs.getBlob("text/json;charset=UTF-8", encryptedJSON)
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
                this.$router.replace({name: 'assetManage',params:{loadAcc:true}})
                this.$funs.loadActivWallet()
            },
            importWallet(){
                this.$emit('getTitle');
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
        left: 0px;
        font-size: 24px;
        a{
            color: white;
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
                line-height: 40px;
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
