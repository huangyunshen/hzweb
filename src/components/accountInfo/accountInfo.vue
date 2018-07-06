<template>
    <div>
        <div class="container">
            <div class="list-content">
                <div class="list-header">
                    <ul class="list-padding">
                        <li>
                            <i class="list-icon2"></i>
                            <span>账户地址</span>
                        </li>
                        <li>
                            <i class="list-icon3"></i>
                            <span>助记词</span>
                        </li>
                        <li>
                            <i class="list-icon4"></i>
                            <span>私钥</span>
                        </li>
                    </ul>
                </div>
                <div class="list-body">
                    <ul>
                        <li>
                            <span v-text="$store.state.address"></span>
                        </li>
                        <li style="padding-right: 25px">
                            <el-input v-show="$store.state.mnemonic" v-model="$store.state.mnemonic"
                                      :type="passwordOrTextMnemo" readonly>
                                <el-button slot="append" icon="el-icon-view" @click="showOrHideMnemo"></el-button>
                            </el-input>
                            <span v-show="!$store.state.mnemonic"
                                  class="text-disabled no-select-text">{{warningInfo}}</span>
                        </li>
                        <li style="padding-right: 25px">
                            <el-input v-show="privateKey" v-model="privateKey"
                                      :type="passwordOrTextPriv" readonly>
                                <el-button slot="append" icon="el-icon-view" @click="showOrHidePriv"></el-button>
                            </el-input>
                            <span v-show="!privateKey"
                                  class="text-disabled no-select-text">{{warningInfo}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="qr-content">
                <div class="qr-item">
                    <p class="qr-title">账户地址</p>
                    <div class="qr-body">
                        <vue-qr :text="$store.state.address || 'no address'" :margin="8"></vue-qr>
                    </div>
                </div>
                <div class="qr-item">
                    <p class="qr-title">私钥</p>
                    <div class="qr-body">
                        <vue-qr :text="privateKeyQr" :margin="8"></vue-qr>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import VueQr from 'vue-qr'

    export default {
        name: "account-info",
        data() {
            return {
                mnemonic: '',
                warningInfo: '无相关信息',
                passwordOrTextPriv: 'password',
                passwordOrTextMnemo: 'password',
                privateKey: '',
                privateKeyQr: '无相关信息',
            }
        },
        components: {
            VueQr
        },
        watch: {
            privateKey() {
                if (this.passwordOrTextPriv === 'text')
                    this.privateKeyQr = this.privateKey
            }
        },
        methods: {
            showOrHideMnemo() {
                if (this.passwordOrTextMnemo === 'password') {
                    this.passwordOrTextMnemo = 'text'
                } else {
                    this.passwordOrTextMnemo = 'password'
                }
            },
            showOrHidePriv() {
                if (this.passwordOrTextPriv === 'password') {
                    this.passwordOrTextPriv = 'text'
                    this.privateKeyQr = this.privateKey
                } else {
                    this.passwordOrTextPriv = 'password'
                    this.privateKeyQr = this.warningInfo
                }
            },
            getWallet() {
                let wallet = this.$funs.getActiveAccount()
                if (wallet.privateKey) {
                    this.privateKey = wallet.privateKey.replace('0x', '')
                }
            }
        },
        mounted() {
            this.getWallet()
        }
    }
</script>

<style scoped lang="scss">

    $list_height: 70px;

    .container {
        padding: 0 10px;
        .list-content {
            display: flex;
            ul {
                li {
                    height: $list_height;
                    line-height: $list_height;
                    border-bottom: 1px solid $border_color;
                }
            }
            .list-padding li {
                padding-left: 15px;
                padding-right: 50px;
            }

            .list-header {
                min-width: 150px;
                font-size: 20px;
                color: #cec8ff;

                i {
                    display: inline-block;
                    width: 33px;
                    height: 33px;
                    margin-right: 5px;
                    vertical-align: text-top;
                }
                .list-icon2 {
                    background: url("../../assets/images/mainScreen/con_circle_zhdz.png");
                }
                .list-icon3 {
                    background: url("../../assets/images/mainScreen/con_circle_zjc.png");
                }
                .list-icon4 {
                    background: url("../../assets/images/mainScreen/con_circle_sy.png");
                }
            }
            .list-body {
                flex-grow: 1;
                font-size: 24px;
                color: #8abdec;
                .el-input {
                    font-size: 24px;
                }
                .text-disabled {
                    width: 260px;
                    padding: 10px 70px;
                    border-radius: 2px;
                    border: dashed 1px #302c4b;
                    font-size: 18px;
                    color: #504a74;
                }
            }
        }

        .qr-content {
            height: 260px;
            margin-top: 30px;
            padding-left: 15px;
            text-align: center;
            .qr-item {
                width: 250px;
                display: inline-block;
                margin: 0 50px;
                .qr-title {
                    font-size: 24px;
                    font-weight: 100;
                    color: #cec8ff;
                }
                .qr-body {
                    width: 250px;
                    height: 210px;
                    margin-top: 20px;
                }
            }
        }
    }
</style>
