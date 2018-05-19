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
                            <span>{{balanceCom}}</span>
                        </li>
                        <li>
                            <span>{{address}}</span>
                        </li>
                        <li>
                            <span v-show="mnemonic">{{mnemonic}}</span>
                            <span v-show="!mnemonic" class="text-disabled no-select-text">无相关信息</span>
                        </li>
                        <li>
                            <span v-show="privateKey">{{privateKey}}</span>
                            <span v-show="!privateKey" class="text-disabled no-select-text">无相关信息</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="qr-content">
                <div class="qr-item">
                    <p class="qr-title">账户地址</p>
                    <div class="qr-body">
                        <vue-qr :text="address" margin="8"></vue-qr>
                    </div>
                </div>
                <div class="qr-item">
                    <p class="qr-title">私钥（未加密）</p>
                    <div class="qr-body">
                        <vue-qr :text="privateKey" margin="8"></vue-qr>
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
                balance: 0,
                address: '0xbbac7526697a187a3ec4201727520fd95be910ea',
                mnemonic: 'brown injury pelican garbage kidney auction fresh any brain person dove trick',
                privateKey: 'a93332bb1aeb2cd8d4a5c6b7ce52045c81e63e07c8d4519bfec16931827cd988'
            }
        },
        computed: {
            balanceCom() {
                return this.$web3.fromWei(this.balance, 'ether')
            },
            // privateKeyCom(){
            //     if (this.privateType === 'text') {
            //         return this.privateKey
            //     } else {
            //         return '不可看'
            //     }
            // }
        },
        mounted() {
            this.address = this.$store.state.publicKey
            this.privateKey = this.$store.state.privateKey
            this.mnemonic = this.$store.state.mnemonic
            if (this.address !== '') {
                this.balance = this.$web3.eth.getBalance(this.address).toJSON()
            }
        },
        components: {
            VueQr
        }
    }
</script>

<style scoped lang="scss">

    $list_height: 100px;

    .container {
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
            margin-top: 20px;

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
