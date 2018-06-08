<template>
    <div>
        <div class="container">
            <div class="list-content">
                <div class="list-header">
                    <ul class="list-padding">
                        <li>
                            <i class="list-icon1"></i>
                            <span>账户余额</span>
                        </li>
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
                            <span class="get-balance"
                                  title="点击刷新余额">{{$store.state.balance | amountUnit}}</span>
                            <i class="el-icon-refresh" @click="$funs.getBalance()"></i>
                        </li>
                        <li>
                            <span v-text="$store.state.address"></span>
                        </li>
                        <li style="padding-right: 25px">
                            <el-input v-show="mnemonic" v-model="mnemonic" :type="passwordOrTextMnemo" readonly>
                                <el-button slot="append" icon="el-icon-view" @click="showOrHideMnemo"></el-button>
                            </el-input>
                            <span v-show="!mnemonic" class="text-disabled no-select-text">{{warningInfo}}</span>
                        </li>
                        <li style="padding-right: 25px">
                            <el-input v-show="privateKey" v-model="privateKey" :type="passwordOrTextPriv" readonly>
                                <el-button slot="append" icon="el-icon-view" @click="showOrHidePriv"></el-button>
                            </el-input>
                            <span v-show="!privateKey" class="text-disabled no-select-text">{{warningInfo}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="qr-content">
                <div class="qr-item">
                    <p class="qr-title">账户地址</p>
                    <div class="qr-body">
                        <vue-qr :text="$store.state.address" :margin="8"></vue-qr>
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
                privateKey: '',
                warningInfo: '无相关信息',
                passwordOrTextPriv: 'password',
                passwordOrTextMnemo: 'password',
                privateKeyQr: '无相关信息',
            }
        },
        components: {
            VueQr
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
            }
        },
        mounted() {
            let wallet = this.$funs.getActiveAccount()
            if(wallet) {
                this.mnemonic = wallet.mnemonic ? wallet.mnemonic : ''
                this.privateKey = wallet.privateKey ? wallet.privateKey.replace('0x', '') : ''
                // this.$funs.getBalance()
            }
        },
        updated() {
            let wallet = this.$funs.getActiveAccount()
            if(wallet) {
                this.mnemonic = wallet.mnemonic ? wallet.mnemonic : ''
                this.privateKey = wallet.privateKey ? wallet.privateKey.replace('0x', '') : ''
                // this.$funs.getBalance()
            }
        }
    }
</script>

<style scoped lang="scss">

    $list_height: 100px;

    .container {
        padding: 0 70px;
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
                .list-icon1 {
                    background: url("../../assets/images/mainScreen/icon_circle_zhye.png");
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

                .el-icon-refresh {
                    margin-left: 20px;
                    cursor: pointer;
                    &:hover {
                        color: #A0CBF5;
                    }
                }
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
            height: 280px;
            margin-top: 50px;
            padding-left: 15px;

            .qr-item {
                width: 250px;
                margin-right: 200px;
                float: left;

                .qr-title {
                    font-size: 24px;
                    font-weight: 100;
                    color: #cec8ff;
                }
                .qr-body {
                    width: 250px;
                    height: 250px;
                    margin-top: 20px;
                }
            }
        }
    }
</style>
