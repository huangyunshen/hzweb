<template>
    <div class="mainScreen">
        <div class="left-nav">
            <nav>
                <ul class="no-select-text">
                    <router-link tag="li" :to="{name:'assetManage'}" @click.native="selectAnItem('1')"
                                 class="pass-enter1" :class="{active:itemSelected==='1'}">
                        <i class="nav-icon1" :class="{'nav-icon1-active':itemSelected==='1'}"></i>
                        <span>资产管理</span>
                    </router-link>
                    <router-link tag="li" :to="{name:'myApps'}" @click.native="selectAnItem('2')"
                                 class="pass-enter2" :class="{active:itemSelected==='2'}">
                        <i class="nav-icon2" :class="{'nav-icon2-active':itemSelected==='2'}"></i>
                        <span>我的应用</span>
                    </router-link>
                    <router-link tag="li" :to="{name:'applications'}" @click.native="selectAnItem('3')"
                                 class="pass-enter3" :class="{active:itemSelected==='3'}">
                        <i class="nav-icon3" :class="{'nav-icon3-active':itemSelected==='3'}"></i>
                        <span>应用中心</span>
                    </router-link>
                    <li @click="openUrl('http://39.104.81.103:8890')" class="pass-enter4">
                        <i class="nav-icon4"></i>
                        <span>区块查询</span>
                    </li>
                    <li @click="openUrl('http://39.104.81.103:8890')" class="pass-enter5">
                        <i class="nav-icon5"></i>
                        <span>交易查询</span>
                    </li>
                </ul>
            </nav>
        </div>

        <div class="container">
            <header class="header">
                <el-button size="mini" @click="dialog = true">导入账户</el-button>
                <language class="language"></language>
                <el-button size="mini" @click="exit">锁定</el-button>
            </header>
            <div class="account-nav">
                <div class="tranc-balance">
                    <!--<i></i>-->
                    账户余额 : {{$store.state.balance | amountUnit}}
                    <b class="el-icon-refresh" title="点击刷新余额" @click="$funs.getBalance()"></b>
                </div>
                <div class="tranc-address">

                    <div class="account-style">
                        账户地址 :
                        <el-select v-model="activeAccount" @change="changeAccount">
                            <el-option
                                v-for="(item,index) in accounts"
                                :key="index"
                                :label="item"
                                :value="item"
                            >
                                <span class="fl">{{ item }}</span>
                                <el-button type="primary" class="deleteMe fr" size="mini"
                                           @click.stop="showRemoveAcc(item)" v-if="accounts.length > 1">移除
                                </el-button>
                                <!--<el-button type="primary" class="selectMe fr">选择</el-button>-->
                            </el-option>
                        </el-select>
                    </div>
                    <el-button size="mini" @click="getMore">更多</el-button>
                </div>
            </div>
            <main class="content" :class="{border : isBorder}">
                <transition name="fof-fade">
                    <router-view></router-view>
                </transition>
            </main>
        </div>

        <div class="create-wallet">
            <el-dialog class="wallet-agreement"
                       title="导入账户"
                       :visible.sync="dialog"
                       center
                       width="1000px">
                <div class="body" style="padding: 20px;height: 240px;">
                    <unlock-account ref="importAcc" hasWallet="hasWallet"></unlock-account>
                </div>
                <div class="footer">
                    <el-button @click="importAcc" v-show="importing">导入到钱包</el-button>
                    <span v-if="!importing"
                          style="line-height: 40px; font-size: 20px; animation: toggleShowHide 2s linear infinite;">正在导入 . . . </span>
                </div>
            </el-dialog>
            <el-dialog class="wallet-agreement personal-info"
                       title="个人信息"
                       :visible.sync="personalDialog"
                       center
                       width="1200px">
                <div class="body" style="padding: 10px;height: 510px;">
                    <account-info ref="changeAcc"></account-info>
                </div>
            </el-dialog>
        </div>

        <div class="create-wallet">
            <el-dialog class="create-wallet-dialog"
                       title="警告！"
                       :visible.sync="deleteModal"
                       width="600px"
                       top="20vh"
                       center>

                <div class="del-warning">
                    您正在删除:
                    <p>{{accTODelete}}</p>
                    账户余额：
                    <p>{{delAccBalance | amountUnit}}</p>
                    确认删除请验证钱包密码：
                </div>
                <el-input v-model="pwd" type="password" placeholder="请输入钱包密码"></el-input>
                <div class="mt-40 tc">
                    <el-button type="primary" @click="removeAcc" v-show="deleting">确定</el-button>
                    <span v-if="!deleting"
                          style="line-height: 40px; font-size: 20px; animation: toggleShowHide 2s linear infinite;">正在移除 . . . </span>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import language from '../language/language'
    import unlockAccount from '../wallet/unlockAccount'
    import accountInfo from '../accountInfo/accountInfo'

    export default {
        name: "main-screen",
        components: {
            language,
            unlockAccount,
            accountInfo
        },
        data() {
            return {
                itemSelected: '1',
                accounts: ['切换账户'],
                activeAccount: '切换账户',
                dialog: false,
                personalDialog: false,
                isBorder: true,
                deleteModal: false,
                accTODelete: '',
                pwd: '',
                delAccBalance: 0,
                importing: true,
                deleting: true,
            }
        },
        computed: {
            lockFlag() {
                return this.$store.state.isLock
            },
        },
        watch: {
            lockFlag() {
                if (!this.lockFlag) {
                    this.loadAccounts()
                    this.activeAccount = localStorage.getItem('active_account')
                }
            },
            $route(to, from) {
                this.isBorder = to.path !== '/mainScreen/assetManage'
            }
        },
        methods: {
            importAcc() {
                this.$refs.importAcc.importWallet().then((privkey) => {
                    let wallet = this.$web3.eth.accounts.wallet
                    for (let i = 0; i < wallet.length; i++) {
                        if (wallet[i].privateKey === privkey) {
                            this.$message({
                                message: this.$msg.accountExist,
                                type: 'error'
                            })
                            return
                        }
                    }
                    let newAcc = this.$web3.eth.accounts.privateKeyToAccount(privkey);
                    wallet.add(newAcc);
                    this.loadAccounts()
                    this.activeAccount = newAcc.address;
                    this.changeAccount();

                    this.importing = false;
                    setTimeout(() => {
                        wallet.save(wallet.myPwd);
                        this.dialog = false
                        this.$message({
                            message: this.$msg.importSucc,
                            type: 'success'
                        });
                        this.importing = true;
                    }, 50)
                })
            },
            selectAnItem(index) {
                this.itemSelected = index
                this.$funs.getBalance()
            },
            openUrl(url) {
                window.open(url);
            },
            exit() {
                this.$emit('lockOut')
            },
            changeAccount() {
                this.$funs.setActiveAccount(this.activeAccount)
                this.$funs.getBalance()
                this.$store.commit('setAddress', this.activeAccount)
            },
            loadAccounts() {
                let wallet = this.$web3.eth.accounts.wallet
                this.accounts = []
                let i = 0
                for (let key in wallet) { //此处谨慎修改
                    if (wallet[i]) {
                        this.accounts.push(wallet[i].address)
                    }
                    i++;
                }
            },
            getMore() {
                this.personalDialog = true;
                setTimeout(() => {
                    this.$refs.changeAcc.getWallet();
                }, 0)
            },
            showRemoveAcc(acc) {
                this.$funs.getBalanceByWei(acc, (balance) => {
                    if (typeof balance === 'string') {
                        this.delAccBalance = this.$web3.utils.fromWei(balance, 'ether');
                    } else {
                        this.delAccBalance = 0;
                    }
                    this.accTODelete = acc;
                    this.deleteModal = true;
                    this.pwd = "";
                })
            },
            removeAcc() {
                let wallet = this.$web3.eth.accounts.wallet
                if (this.pwd === wallet.myPwd) {
                    wallet.remove(this.accTODelete);
                    this.loadAccounts();
                    if (this.accTODelete === this.activeAccount) {
                        this.activeAccount = this.accounts[0];
                    }
                    this.changeAccount();

                    this.deleting = false;
                    setTimeout(() => {
                        wallet.save(wallet.myPwd);
                        this.deleteModal = false
                        this.$message({
                            message: this.$msg.deleteSucc,
                            type: 'success'
                        });
                        this.deleting = true;
                    }, 50)
                } else {
                    this.$message({
                        message: this.$msg.unlockFailByPwd,
                        type: 'error'
                    });
                }
            }
        },
        mounted() {
            switch (this.$route.name) {
                case 'accountInfo':
                    this.itemSelected = '1'
                    break
                case 'myApps':
                    this.itemSelected = '2'
                    break
                case 'applications':
                    this.itemSelected = '3'
                    break
                // case 'tradeRecord':
                //     this.itemSelected = '2'
                //     break
                // case 'transaction':
                //     this.itemSelected = '3'
                //     break
                // case 'createApp':
                //     this.itemSelected = '5'
                //     break
                default:
                    break
            }

            if (this.$route.params.loadAcc) {
                this.loadAccounts()
                this.activeAccount = localStorage.getItem('active_account')
            }
        }
    }
</script>

<style scoped lang="scss" type="text/scss">
    $height: 100%;

    .mainScreen {
        height: $height;
        min-width: 1300px;
        overflow: hidden;

        /**  侧边栏   **/
        .left-nav {
            width: 380px;
            float: left;
            padding-top: 160px;
            height: $height;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            nav {
                height: $height;
                padding: 26px;
                overflow-y: auto;
                border-top-style: solid;
                border-top-width: 2px;
                border-image-source: linear-gradient(-85deg,
                    #3410f7 0%,
                    #711bdc 59%,
                    #ad25c0 100%);
                border-image-slice: 1;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                background-color: rgba(10, 7, 85, 0.8);

                ul {
                    li {
                        height: 70px;
                        background: url("../../assets/images/mainScreen/btn.png") no-repeat;
                        margin-top: 25px;
                        text-align: center;
                        line-height: 70px;
                        font-size: 22px;
                        color: #8abdec;
                        cursor: pointer;
                        position: relative;
                        left: -110%;
                        animation-name: passInto;
                        animation-timing-function: ease-in-out;
                        animation-fill-mode: forwards;
                        &.pass-enter1 {
                            animation-duration: 0.5s;
                        }
                        &.pass-enter2 {
                            animation-duration: 0.6s;
                        }
                        &.pass-enter3 {
                            animation-duration: 0.7s;
                        }
                        &.pass-enter4 {
                            animation-duration: 0.8s;
                        }
                        &.pass-enter5 {
                            animation-duration: 0.9s;
                        }
                        &.pass-enter6 {
                            animation-duration: 1s;
                        }
                        &:hover {
                            background: url("../../assets/images/mainScreen/btn_hover.png") no-repeat;
                            color: #8abdec;
                        }
                        span {
                            cursor: default;
                            cursor: pointer;
                        }
                        i {
                            display: inline-block;
                            width: 28px;
                            height: 28px;
                            margin-right: 5px;
                            margin-top: 1px;
                            vertical-align: text-top;
                            cursor: pointer;
                        }
                        .nav-icon1 {
                            background: url("../../assets/images/mainScreen/icon_zhxx.png") no-repeat;
                        }
                        .nav-icon1-active {
                            background: url("../../assets/images/mainScreen/icon_zhxx_xz.png") no-repeat;
                        }
                        .nav-icon2 {
                            background: url("../../assets/images/mainScreen/icon_wdyy.png") no-repeat;
                        }
                        .nav-icon2-active {
                            background: url("../../assets/images/mainScreen/icon_wdyy_xz.png") no-repeat;
                        }
                        .nav-icon3 {
                            background: url("../../assets/images/mainScreen/icon_yysc.png") no-repeat;
                        }
                        .nav-icon3-active {
                            background: url("../../assets/images/mainScreen/icon_yysc_xz.png") no-repeat;
                        }
                        .nav-icon4 {
                            background: url("../../assets/images/mainScreen/icon_cjyy.png") no-repeat;
                        }
                        .nav-icon4-active {
                            background: url("../../assets/images/mainScreen/icon_cjyy_xz.png") no-repeat;
                        }
                        .nav-icon5 {
                            background: url("../../assets/images/mainScreen/icon_cjyy.png") no-repeat;
                        }
                        .nav-icon5-active {
                            background: url("../../assets/images/mainScreen/icon_cjyy_xz.png") no-repeat;
                        }
                    }
                    .active {
                        background: url("../../assets/images/mainScreen/btn_xz.png") no-repeat;
                        color: #e9f4ff;
                        &:hover {
                            background: url("../../assets/images/mainScreen/btn_xz.png") no-repeat;
                            color: #e9f4ff;
                        }
                    }
                }
            }
        }

        /**    主体     **/
        .container {
            width: calc(100% - 380px);
            height: $height;
            float: left;
            background-color: rgba(25, 21, 46, 0.7);
            border-left: solid 1px $border_color;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            flex-direction: column;

            .header {
                width: 100%;
                height: 69px;
                border-bottom: 1px solid $border_color;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .el-select {
                    margin-right: 30px;
                }
                .el-button {
                    height: 28px;
                    margin-right: 30px;
                    background: #403A6D;
                    color: #CEC8FF;
                    font-size: 12px;
                    border: none;
                    border: solid 1px #433e71;
                    background: rgba(0, 0, 0, 0);
                    &:hover {
                        border-color: #726bab;
                    }
                }
                .language {
                    margin-right: 30px;
                }
            }
            .account-nav {
                border-bottom: 1px solid #322D5D;
                height: 92px;
                line-height: 32px;
                color: #8490c5;
                box-sizing: border-box;
                font-size: 20px;
                padding-top: 8px;
                /*i {
                    display: inline-block;
                    height: 30px;
                    width: 30px;
                    margin-right: 10px;
                    margin-left: 30px;
                    vertical-align: text-top;
                }*/
                .tranc-balance {
                    margin-left: 70px;
                    /*margin-top:10px;*/
                    .el-icon-refresh {
                        margin-left: 20px;
                        cursor: pointer;
                        &:hover {
                            color: #A0CBF5;
                        }
                    }
                    /*i {*/
                    /*background: url("../../assets/images/transaction/icon_zz_zhye.png") no-repeat;*/
                    /*}*/
                }
                .tranc-address {
                    margin-left: 70px;
                    margin-top: 5px;
                    /*i {*/
                    /*background: url("../../assets/images/transaction/icon_zz_zhdz.png") no-repeat;*/
                    /*}*/
                }
                .el-button {
                    height: 28px;
                    margin-left: 30px;
                    background: #403A6D;
                    color: #CEC8FF;
                    font-size: 12px;
                    border: solid 1px #433e71;
                    background: rgba(0, 0, 0, 0);
                    &:hover {
                        border-color: #726bab;
                    }
                }
            }
            .content {
                height: calc(100% - 125px);
                min-height: 700px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                margin: 30px;
                &.border {
                    border: solid 1px $border_color;
                }
            }
        }
        .del-warning {
            font-size: 17px;
            line-height: 25px;
            padding-bottom: 10px;
            p {
                color: #F600AA;
                padding-left: 30px;
                padding-bottom: 15px;
            }
        }
    }

    @keyframes passInto {
        from {
            left: -110%;
        }
        to {
            left: 0;
        }
    }
</style>
