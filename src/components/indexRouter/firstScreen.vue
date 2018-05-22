<template>
    <div class="firstScreen">
        <language class="language"></language>
        <div class="wallet-container">
            <div class="wallet-content">
                <div class="wallet-header-line"></div>
                <div class="wallet-header-light" :class="[walletSelect]"></div>

                <div class="wallet-header">
                    <span @click="selectItem($event)" class="fl" :class="{'wallet-selected':isCreate}">
                        <router-link tag="i" :to="{name:'createWallet'}">创建钱包</router-link>
                    </span>
                    <span @click="selectItem($event)" class="fr" :class="{'wallet-selected':!isCreate}">
                        <router-link tag="i" :to="{name:'importWallet'}">导入钱包</router-link>
                    </span>
                </div>

                <div class="wallet-body">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <div class="wallet-footer">
            <div class="footer-left">
                <img class="logo-small" src="../../assets/images/firstScreen/logo_small.png">
                <span>免费的开源客户端界面，用于生成以太坊钱包等等。轻松安全地与以太坊区块链互动。解锁钱包之前请仔细检查网址 myetherwallet.com</span>
            </div>
            <div class="footer-right">
                <span>MyEtherWallet.com</span>
                <span>MyEtherWallet团队</span>
                <span>MyEtherWallet Chrome扩展程序</span>
                <span>电子邮件支持：support@myetherwallet.com</span>
                <span>©2018 MyEtherWallet，Inc</span>
            </div>
        </div>
    </div>
</template>

<script>
    import language from '../language/language';


    export default {
        name: "first-screen",
        components: {
            language
        },
        data() {
            return {
                isCreate: true,
                walletSelect: 'wallet-create'
            }
        },
        methods: {
            selectItem(e) {
                this.isCreate = !this.isCreate;
                this.walletSelect = this.isCreate ? 'wallet-create' : 'wallet-import';
            }
        },
        mounted(){
            switch (this.$route.name) {
                case 'createWallet':
                    this.isCreate = true
                    this.walletSelect = 'wallet-create'
                    break;
                case 'importWallet':
                    this.isCreate = false
                    this.walletSelect = 'wallet-import'
                    break;
            }
        }
    }
</script>

<style scoped lang="scss" type="text/scss">
    $main_width: 1000px;
    $main_height: 620px;
    $form_width: 600px; //表单宽度
    $head_height: 100px; //头部高度

    .firstScreen {
        height: 100%;
        overflow: hidden;
        .language {
            position: absolute;
            top: 60px;
            right: 5%;
        }

        .wallet-container {
            width: $main_width;
            height: 100%;
            margin: 0 auto;
            display: flex;
            align-items: center;
            .wallet-content {
                width: 100%;
                height: $main_height;
                margin-top: 20px;
                background: rgba(26, 1, 98, 0.38);
                border-width: 5px;
                border-style: solid;
                border-image-source: linear-gradient(151deg,
                        #45cae6 0%,
                        #3e99e2 10%,
                        #3668de 29%,
                        #3586e4 62%,
                        #34a3e9 74%,
                        #1a4fcd 100%
                );
                border-image-slice: 1;
                position: relative;

                .wallet-header-line {
                    width: 100%;
                    height: 7px;
                    background: url("../../assets/images/firstScreen/line.png") no-repeat;
                    -webkit-background-size: 100% 100%;
                    background-size: 100% 100%;
                    position: absolute;
                    top: $head_height;
                }
                .wallet-header-light {
                    width: 198px;
                    height: 193px;
                    background: url("../../assets/images/firstScreen/light.png") no-repeat;
                    position: absolute;
                    top: $head_height+(-128px);
                }
                .wallet-create {
                    animation: createWallet 0.5s linear;
                    animation-fill-mode: forwards;
                    left: 160px;
                }
                .wallet-import {
                    animation: importWallet 0.5s linear;
                    animation-fill-mode: forwards;
                    left: 632px;
                }
                .wallet-header {
                    width: $form_width;
                    height: $head_height;
                    margin: 0 auto;
                    span {
                        margin-top: $head_height+(-50px);
                        /*display: inline-block;*/
                        /*width: 50%;*/
                        /*float: left;*/
                        /*text-align: center;*/
                        font-size: 32px;
                        font-weight: 100;
                        //line-height: $head_height+20px; //100px
                        color: #706bb8;
                        cursor: default;
                    }
                    .wallet-selected {
                        color: #e0c1ff;
                    }
                }
                .wallet-body {
                    width: $form_width;
                    margin: 0 auto;
                    padding-top: 60px;
                    position: relative;
                    height: $main_height+(-$head_height)+(-60px); //减去header占据的高度
                }
                .wallet-body:before {
                    content: '';
                    display: block;
                }
            }
        }

        .wallet-footer {
            position: absolute;
            width: 100%;
            bottom: 23px;
            padding: 0 70px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;

            .footer-left {
                position: relative;
                width: 30%;
                img {
                    position: absolute;
                    top:8px;
                }
                span {
                    display: inline-block;
                    font-size: 14px;
                    line-height: 20px;
                    color: #666bb4;
                    margin-left: 90px;
                }
            }
            .footer-right {
                margin-top: 10px;
                span {
                    float: left;
                    font-size: 14px;
                    color: #666bb4;
                    margin-left: 15px;
                }
            }
        }
    }

    @keyframes createWallet {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.2;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes importWallet {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.2;
        }
        100% {
            opacity: 1;
        }
    }

</style>
