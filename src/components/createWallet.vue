<template>
    <div>
        <el-row>
            <el-col :xs="24" :sm="{span:20,offset:2}" :md="{span:16,offset:4}" :lg="{span:12,offset:6}"
                    :xl="{span:10,offset:7}">
                <el-form
                        label-width="100px"
                        status-icon
                        :rules="rulesCreate"
                        :model="formRulesCreate"
                        ref="formRulesCreate"
                        v-show="formGroupToggle"
                        @submit.native.prevent>

                    <el-form-item label="创建钱包" prop="pwd">
                        <el-input
                                type="password"
                                v-model="formRulesCreate.pwd"
                                :placeholder="this.$msg.createPwd"
                                auto-complete="off"
                                clearable
                        ></el-input>
                    </el-form-item>
                </el-form>

                <user-login ref="unlock" :formGroupToggle="formGroupToggle"></user-login>

                <el-form label-width="100px" @submit.native.prevent>
                    <el-form-item>
                        <el-button type="primary" @click="createOrLogin">{{mainBtnText}}</el-button>
                        <el-button type="text" size="mini" @click="formGroupToggleFun">{{lastBtnText}}</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-dialog
                title="钱包创建成功"
                :visible.sync="createDialog"
                width="4 0%"
                center>
            <h1>保存你的Keystore或者私钥。不要忘记你的密码。</h1>

            <div>
                <a class="el-button" :href="blobEnc" :download="encFileName" @click="fileDownloaded=false">下载Keystore文件 （UTC / JSON）</a>
            </div>
            <div>
                <p><span>千万不要弄丢它！ 因为它是无法恢复的。</span></p>
                <p><span>千万不要上传给别人！ 如果你在一个恶意/钓鱼网站上使用这个文件，你的资金将被窃取。</span></p>
                <p><span>最好做一个备份！ 确保它像价值数百万的资金一样安全。</span></p>
            </div>


            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="unlockNewAccount" :disabled="fileDownloaded">我已保存好Keystore文件及密码，点击解锁</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import userLogin from './userLogin'

    export default {
        name: "createWallet",
        components: {
            userLogin
        },
        data() {
            return {
                formGroupToggle: true,    //创建或者解锁面板
                createDialog: false,  //创建成功后显示模态框
                mainBtnText: '创建钱包',
                lastBtnText: '转到解锁',
                message: this.$msg.createPwd,
                wallet: null,
                blob: null,
                blobEnc: null,
                encFileName: '',
                isDone: false,
                fileDownloaded: true,
                formRulesCreate: {       //创建钱包的数据绑定对象
                    pwd: ''
                },
                rulesCreate: {         //创建钱包的校验对象
                    pwd: [
                        {validator: this.$verify.validatePwd, trigger: 'blur'}
                    ]
                },
            }
        },
        methods: {
            formGroupToggleFun() {     //切换创建和解锁
                if (this.formGroupToggle) {
                    this.mainBtnText = '解锁钱包';
                    this.lastBtnText = '转到创建';
                } else {
                    this.mainBtnText = '创建钱包';
                    this.lastBtnText = '转到解锁';
                }
                this.formGroupToggle = !this.formGroupToggle;
            },
            createOrLogin(e) {     //点击创建钱包或者解锁
                if (this.formGroupToggle === true) {
                    if (this.formRulesCreate.pwd && this.$verify.validatePwd(null, this.formRulesCreate.pwd, (param) => {
                            return param || 'true';
                        }) === 'true') {

                        this.wallet = this.blob = this.blobEnc = null;
                        this.isDone = false;
                        this.wallet = this.$wallet.generate(false);
                        this.blob = this.$getBlob("text/json;charset=UTF-8", this.wallet.toJSON());
                        this.blobEnc = this.$getBlob("text/json;charset=UTF-8", this.wallet.toV3(this.formRulesCreate.pwd, {
                            kdf: this.$kdf,
                            n: this.$scrypt.n
                        }));
                        this.encFileName = this.wallet.getV3Filename();


                        // if (parent != null)
                        //     parent.postMessage(JSON.stringify({
                        //         address: this.wallet.getAddressString(),
                        //         checksumAddress: this.wallet.getChecksumAddressString()
                        //     }), "*");
                        this.isDone = true;
                        this.createDialog = true;
                    } else {
                        this.$message({
                            type: 'error',
                            showClose: true,
                            message: this.$msg.createPwd
                        })
                    }
                } else {
                    this.$refs.unlock.unlockAccount()
                }
            },
            unlockNewAccount() {
                sessionStorage.setItem('publicKey', this.wallet.toJSON().address)
                this.$router.replace({name: 'listContent',params: this.wallet})    //创建/解锁成功后跳转到功能列表
                this.$message({
                    type: 'success',
                    showClose: true,
                    message: this.$msg.unlockSucc
                })
            }
        },
        beforeCreate() {
        },
        created() {

        },
        beforeMount() {

        },
        mounted() {

        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .el-row {
        margin-top: 100px;
    }

    .el-form-item:last-child {
        text-align: center;
    }
    
    .el-dialog{
        h1,div{
            text-align: center;
            a{
                margin-top: 30px;
                color:#fff;
                background-color: #67c23a;
                border-color: #67c23a;
            }
            a:hover,a:focus{
                background: #85ce61;
                border-color: #85ce61;
            }
            p{
                font-size:16px;
                line-height: 40px;
                span{
                    color:#C12E2E;
                }
            }
        }
    }
</style>
