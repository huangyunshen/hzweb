<template>
    <div>
        <el-form
            label-width="120px"
            label-position="left"
            @submit.native.prevent>

            <el-form-item class="el-wallet-style" label="解锁方式">
                <div class="wallet-decrypt-type no-select-text">
                    <span class="wallet-decrypt-item" :class="{active:form.decryptType==='1'}"
                          @click="selectDecryptType('1')">
                        <i class="wallet-decrypt-type-icon icon1" :class="{'icon1-active':form.decryptType==='1'}"></i>
                        私钥
                    </span>
                    <span class="wallet-decrypt-item" :class="{active:form.decryptType==='2'}"
                          @click="selectDecryptType('2')">
                        <i class="wallet-decrypt-type-icon icon2" :class="{'icon2-active':form.decryptType==='2'}"></i>
                        钱包文件
                    </span>
                    <span class="wallet-decrypt-item" :class="{active:form.decryptType==='3'}"
                          @click="selectDecryptType('3')">
                        <i class="wallet-decrypt-type-icon icon3" :class="{'icon3-active':form.decryptType==='3'}"></i>
                        助记词
                    </span>
                    <span class="wallet-decrypt-item" :class="{active:form.decryptType==='4'}"
                          @click="selectDecryptType('4')" v-show="isTrancCom">
                        <i class="wallet-decrypt-type-icon icon3" :class="{'icon3-active':form.decryptType==='4'}"></i>
                        账户地址
                    </span>
                </div>
                <p>{{decryptInfo}}</p>
            </el-form-item>

            <div v-show="form.decryptType==='1'">
                <el-form-item class="el-wallet-style mt-40" label="私钥">
                    <el-input class="el-wallet-input"
                              v-model="form.privateKey"
                              placeholder="请输入私钥"
                              auto-complete="off"
                              clearable
                    ></el-input>
                </el-form-item>
            </div>

            <div v-show="form.decryptType==='2'">
                <el-form-item class="el-wallet-style mt-40" label="选择文件">
                    <input id="fileUpload" type="file" style="display:none" @change="uploadFile">
                    <el-button class="choose-file-btn" @click="selectFile">选择钱包文件...</el-button>
                </el-form-item>

                <el-form-item class="el-wallet-style mt-40" label="密码">
                    <el-input class="el-wallet-input"
                              v-model="form.pwd"
                              type="password"
                              placeholder="已验证钱包文件，请输入密码"
                              auto-complete="off"
                              clearable
                    ></el-input>
                </el-form-item>
            </div>

            <div v-show="form.decryptType==='3'">
                <el-form-item class="el-wallet-style mt-40" label="助记词">
                    <el-input class="el-wallet-input"
                              v-model="form.mnemonic"
                              type="textarea"
                              :autosize="{ minRows: 3, maxRows: 3 }"
                              resize="none"
                              placeholder="请输入助记词"
                    ></el-input>
                </el-form-item>
            </div>

            <div v-show="isTrancCom && form.decryptType==='4'">
                <el-form-item class="el-wallet-style mt-40" label="账户地址">
                    <el-input class="el-wallet-input"
                              v-model="form.address"
                              clearable
                    ></el-input>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: "unlockAccount",
        props:['isTranc'],
        data() {

            return {
                form: {
                    decryptType: '4',   //解锁方式,
                    privateKey: 'dc30fc72b8bc875b5ae4b6d717c900292beb2457f3cedca2106954626a02af8b',
                    mnemonic: '',
                    address:'',
                    pwd: '',
                    keystore: {},
                    // fileName: '请选择keystore钱包文件',
                    fileContent: ''
                }
            }
        },
        methods: {
            selectDecryptType(type) {
                this.form.decryptType = type;
            },
            importAccount() {
                return new Promise((resolve, reject) => {
                    if (this.form.decryptType === '1') {          //私钥
                        try {
                            let wallet = new this.$Wallet('0x' + this.form.privateKey)
                            resolve(wallet)
                            this.form.privateKey
                        } catch (err) {
                            this.$message({
                                message: this.$msg.invalidPrivateKey,
                                type: 'error'
                            })
                            reject(false)
                        }
                    } else if (this.form.decryptType === '2') {          //keystore文件+密码

                        if (!this.form.fileContent) {
                            this.$message({
                                message: this.$msg.selectAnFile,
                                type: 'error'
                            })
                            reject(false)
                            return
                        }
                        if (!this.form.pwd) {
                            this.$message({
                                message: this.$msg.enterPwd,
                                type: 'error'
                            })
                            reject(false)
                            return
                        }
                        try {
                            let promise = this.$Wallet.fromEncryptedWallet(this.form.fileContent, this.form.pwd)
                            this.$store.commit('setCryptPercent', {
                                    percent: true,
                                    text: '正在解锁账户，请稍等...'
                                }
                            )
                            promise.then((wallet) => {
                                this.$store.commit('setCryptPercent', {
                                        percent: false,
                                        text: ''
                                    }
                                )
                                resolve(wallet)
                            }, (err) => {
                                this.form.pwd = ''
                                this.$message({
                                    message: this.$msg.unlockFailByPwd,
                                    type: 'error'
                                });
                                this.$store.commit('setCryptPercent', {
                                        percent: false,
                                        text: ''
                                    }
                                )
                                reject(false)
                            })
                        } catch (err) {

                            this.form.fileContent = ''
                            this.form.pwd = ''

                            this.$message({
                                message: this.$msg.invalidMnemonic,
                                type: 'error'
                            })
                            reject(false)
                        }

                    } else if (this.form.decryptType === '3') {          //助记词
                        try {
                            let wallet = this.$Wallet.fromMnemonic(this.form.mnemonic)
                            resolve(wallet)
                        } catch (err) {
                            this.$message({
                                message: this.$msg.invalidMnemonic,
                                type: 'error'
                            });
                            reject(false)
                        }
                    } else if (this.form.decryptType === '4') {          //账户地址
                        if(this.$web3.isAddress(this.form.address)){
                            this.form.privateKey = ''
                            this.form.mnemonic = ''
                            resolve({address:this.form.address})
                        } else {
                            this.$message({
                                message: this.$msg.invalidAddress,
                                type: 'error'
                            })
                            reject(false)
                        }
                    }
                })
            },
            selectFile() {
                document.getElementById('fileUpload').click()
            },
            uploadFile() {
                let file = document.getElementById('fileUpload').files[0]
                let reader = new FileReader()
                this.form.fileContent = ''
                this.form.fileName = ''
                this.form.pwd = ''
                reader.readAsText(file)

                reader.onload = () => {
                    let keystore
                    try {
                        keystore = JSON.parse(reader.result)

                        if (keystore.Crypto != null || keystore.crypto != null || (keystore.hash != null && keystore.locked)) {
                            this.form.fileContent = reader.result
                            this.$message({
                                message: this.$msg.corretWalletFile,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: this.$msg.invalidWalletFile,
                                type: 'error'
                            });
                        }
                    } catch (err) {
                        this.$message({
                            message: this.$msg.invalidFile,
                            type: 'error'
                        });
                    }
                }

                reader.onerror = () => {
                    this.$message({
                        message: this.$msg.readFileErr,
                        type: 'error'
                    });
                }
            }
        },
        computed: {
            isTrancCom(){
                if(this.isTranc==='isTranc'){
                    return false;
                } else {
                    return true;
                };
            },
            decryptInfo(){
                switch (this.form.decryptType) {
                    case '1':
                        return '使用您的私钥访问您的帐户';
                    case '2':
                        return '使用您的密钥存储文件(UTC)访问您的帐户';
                    case '3':
                        return '使用助记符短语访问您的帐户';
                    case '4':
                        return '使用账户地址访问您的帐户';
                }
            }
        },
        beforeMount(){          //设置默认的方式
            if(this.isTranc==='isTranc'){
                this.form.decryptType='2'
            } else {
                this.form.decryptType='4'
            };
        }
    }
</script>

<style scoped lang="scss" type="text/scss">

    .el-form-item {
        margin-bottom: 0;
    }

    .wallet-decrypt-type {
        .wallet-decrypt-item {
            cursor: default;
            font-size: 16px;
            color: #a2b4db;
            line-height: 22px;
            border-radius: 1px;
            border: solid 1px #465679;
            padding: 5px 15px;
            margin-right: 8px;

            .wallet-decrypt-type-icon {
                display: inline-block;
                width: 22px;
                height: 22px;
                position: relative;
                top: 5px;
            }
            .icon1 {
                background: url("../../assets/images/firstScreen/icon_keys.png");
            }
            .icon1-active {
                background: url("../../assets/images/firstScreen/icon_keys_xz.png");
            }
            .icon2 {
                background: url("../../assets/images/firstScreen/icon_file.png");
            }
            .icon2-active {
                background: url("../../assets/images/firstScreen/icon_file_xz.png");
            }
            .icon3 {
                background: url("../../assets/images/firstScreen/icon_words.png");
            }
            .icon3-active {
                background: url("../../assets/images/firstScreen/icon_words_xz.png");
            }
        }
        .active {
            color: #f39eff;
            border-style: solid;
            border-width: 1px;
            border-image-source: linear-gradient(-16deg,
                #3410f7 0%,
                #711bdc 59%,
                #ad25c0 100%);
            border-image-slice: 1;
        }
    }

    .el-wallet-style p {
        font-size: 16px;
        color: #9388d3;
        line-height: 20px;
        margin-top: 10px;
    }

    .choose-file-btn {
        width: 100%;
        height: 44px;
        background-color: #2a9ce7;
        border-color: #2a9ce7;
        border-radius: 2px;
        font-size: 18px;
        color: #ffffff;
    }

    .fileUploadTip {
        color: #93D3C4
    }
</style>
