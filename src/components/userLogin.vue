<template>
    <div v-show="!formGroupToggle">
        <el-form
                label-width="100px"
                status-icon
                @submit.native.prevent>

            <el-form-item label="解锁方式">
                <el-radio-group v-model="form.loginType">
                    <el-radio label="1" border>私钥</el-radio>
                    <el-radio label="2" border>钱包文件</el-radio>
                    <el-radio label="3" border>助记词</el-radio>
                </el-radio-group>
            </el-form-item>

            <div v-show="form.loginType==='1'">
                <el-form-item label="私钥">
                    <el-input
                            v-model="form.privateKey"
                            placeholder="请输入私钥"
                            auto-complete="off"
                            clearable
                    ></el-input>
                </el-form-item>
            </div>

            <div v-show="form.loginType==='2'">
                <el-form-item label="选择文件">
                    <input id="fileUpload" type="file" style="display:none" @change="uploadFile">
                    <el-button @click="selectFile" type="primary">选择钱包文件...</el-button>
                    <p class="fileUploadTip">{{form.fileName}}</p>
                </el-form-item>

                <el-form-item label="密码">
                    <el-input
                            v-model="form.pwd"
                            type="password"
                            placeholder="已验证钱包文件，请输入密码"
                            auto-complete="off"
                            clearable
                    ></el-input>
                </el-form-item>
            </div>

            <div v-show="form.loginType==='3'">
                <el-form-item label="助记词">
                    <el-input
                            v-model="form.mnemonic"
                            type="textarea"
                            :autosize="{minRows:5,maxRows:10}"
                            placeholder="请输入助记词"
                    ></el-input>
                </el-form-item>

                <!--<el-form-item label="密码(可选)">-->
                    <!--<el-input-->
                            <!--type="password"-->
                            <!--placeholder="已验证钱包文件，请输入密码"-->
                            <!--auto-complete="off"-->
                            <!--clearable-->
                    <!--&gt</el-input>-->
                <!--</el-form-item>-->
            </div>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "userLogin",
        props: ['formGroupToggle'],    //创建或者解锁面板
        data() {

            return {
                form: {
                    loginType: '1',   //解锁方式,
                    privateKey: '',
                    mnemonic: '',
                    pwd:'',
                    keystore: {},
                    fileName:'请选择keystore钱包文件',
                    fileContent: ''
                }
            }
        },
        methods: {
            unlockAccount() {
                if(this.form.loginType==='1'){          //私钥解锁
                    try{
                        let wallet = new this.$Wallet('0x' + this.form.privateKey)
                        this.unlockSucc(wallet)
                        return true
                    } catch (err){
                        console.log(err)
                        this.$message.error(this.$msg.invalidPrivateKey)
                    }
                } else if (this.form.loginType === '2'){          //keystore文件+密码解锁

                    if(!this.form.fileContent){
                        this.$message.error(this.$msg.selectAnFile)
                        return
                    }
                    if(!this.form.pwd){
                        this.$message.error(this.$msg.enterPwd)
                        return
                    }

                    let promise
                    try{
                        promise = this.$Wallet.fromEncryptedWallet(this.form.fileContent, this.form.pwd)
                    } catch(err) {

                        this.form.fileContent = ''
                        this.form.fileName = ''
                        this.form.pwd = ''

                        console.log(err)
                        this.$message.error(this.$msg.invalidMnemonic)
                    }

                    this.$store.commit('setCryptPercent', {
                            percent: true,
                            text: '正在解锁账户，请稍等...'
                        }
                    )

                    if(promise){
                        promise.then((wallet) => {
                            this.unlockSucc(wallet)
                            this.$store.commit('setCryptPercent', {
                                    percent: false,
                                    text: ''
                                }
                            )
                        }, (err) => {
                            this.form.pwd = ''
                            this.$message.error(this.$msg.unlockFailByPwd)
                            console.log(err)
                            this.$store.commit('setCryptPercent', {
                                    percent: false,
                                    text: ''
                                }
                            )
                        })
                    }

                } else if (this.form.loginType === '3'){          //助记词解锁
                    try{
                        let wallet = this.$Wallet.fromMnemonic(this.form.mnemonic)
                        this.unlockSucc(wallet)
                        return true
                    } catch(err) {
                        console.log(err)
                        this.$message.error(this.$msg.invalidMnemonic)
                    }
                }
            },
            unlockSucc(wallet){
                this.$store.commit('setPublicKey', wallet.address.toLowerCase())
                this.$store.commit('setMnemonic', wallet.mnemonic)
                this.$store.commit('setPrivateKey', wallet.privateKey.replace('0x',''))
                this.$router.replace({path: '/listContent'})
                this.$message.success(this.$msg.unlockSucc)
            },
            selectFile($event){
                document.getElementById('fileUpload').click()
            },
            uploadFile(){
                let file = document.getElementById('fileUpload').files[0]
                let reader = new FileReader()
                this.form.fileContent = ''
                this.form.fileName = ''
                this.form.pwd = ''

                reader.readAsText(file)
                this.form.fileName = file.name

                reader.onload = () => {
                    let keystore
                    try {
                        keystore = JSON.parse(reader.result)

                        if(keystore.Crypto != null || keystore.crypto != null || (keystore.hash != null && keystore.locked)){
                            this.form.fileContent = reader.result
                        } else {
                            this.$message.error(this.$msg.invalidWalletFile)
                        }
                    } catch (err){
                        this.$message.error(this.$msg.invalidFile)
                    }
                }

                reader.onerror = () => {
                    this.$message.error(this.$msg.readFileErr)
                }
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .fileUploadTip {
        color: #93D3C4
    }
</style>
