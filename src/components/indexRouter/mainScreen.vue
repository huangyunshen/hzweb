<template>
    <div class="mainScreen">
        <div class="left-nav">
            <nav>
                <ul class="no-select-text">
                    <router-link tag="li" :to="{name:'assetManage'}" @click.native="selectAnItem('1')"
                                 class="pass-enter1" :class="{active:itemSelected==='1'}">
                        <i class="nav-icon1" :class="{'nav-icon1-active':itemSelected==='1'}"></i>
                        <span>{{$t('assetmanagement')}}</span>
                    </router-link>
                    <router-link tag="li" :to="{name:'myApps'}" @click.native="selectAnItem('2')"
                                 class="pass-enter2" :class="{active:itemSelected==='2'}">
                        <i class="nav-icon2" :class="{'nav-icon2-active':itemSelected==='2'}"></i>
                        <span>{{$t('myapplication')}}</span>
                    </router-link>
                    <router-link tag="li" :to="{name:'applications'}" @click.native="selectAnItem('3')"
                                 class="pass-enter3" :class="{active:itemSelected==='3'}">
                        <i class="nav-icon3" :class="{'nav-icon3-active':itemSelected==='3'}"></i>
                        <span>{{$t('applicationcenter')}}</span>
                    </router-link>
                    <router-link tag="li" :to="{name:'voteMain'}" @click.native="selectAnItem('5')"
                                 class="pass-enter4" :class="{active:itemSelected==='5'}">
                        <i class="nav-icon4" :class="{'nav-icon3-active':itemSelected==='5'}"></i>
                        <span>DPOS{{$t('vote')}}</span>
                    </router-link>
                    <li @click="openUrl('/blockquery/#/blocksList')" class="pass-enter5">
                        <i class="nav-icon5"></i>
                        <span>{{$t('blockquery')}}</span>
                    </li>
                </ul>
            </nav>
        </div>

        <div class="container">
            <header class="header">
                <network></network>
                <language></language>
                <el-button size="mini" @click="exitWallet">{{$t('dropout')}}</el-button>
                <el-button size="mini" @click="dialog = true">{{$t('importaccount')}}</el-button>
                <el-button size="mini" @click="lockOut">{{$t('locking')}}</el-button>
            </header>
            <div class="account-nav">
                <div class="tranc-balance">
                    <!--<i></i>-->
                    {{$t('accountbalance')}}{{$store.state.balance | amountUnit}}
                    <b class="el-icon-refresh" :title="$t('refresh')" @click="$funs.getBalance()"></b>
                    &nbsp;
                    &nbsp;
                    <span v-if="showVoteBalance">
                          {{$t('totalvote')}}{{ $store.state.voteFof | amountUnit}}
                    </span>
                </div>
                <div class="tranc-address">

                    <div class="account-style">
                        {{$t('accountaddress001')}}
                        <el-select v-model="activeAccount" @change="changeAccount">
                            <el-option
                                    v-for="(item,index) in accounts"
                                    :key="index"
                                    :label="item"
                                    :value="item"
                            >
                                <span class="fl">{{ item }}</span>
                                <el-button type="primary" class="deleteMe fr" size="mini"
                                           @click.stop="showRemoveAcc(item)" v-if="accounts.length > 1">{{$t('remove')}}
                                </el-button>
                                <!--<el-button type="primary" class="selectMe fr">选择</el-button>-->
                            </el-option>
                        </el-select>
                    </div>
                    <el-button size="mini" @click="getMore">{{$t('more')}}</el-button>
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
                       :title="$t('importaccount')"
                       :visible.sync="dialog"
                       center
                       width="1000px">
                <div class="body" style="padding: 20px;height: 240px;">
                    <unlock-account ref="importAcc" hasWallet="hasWallet"></unlock-account>
                </div>
                <div class="footer">
                    <el-button @click="importAcc" v-show="importing">{{$t('importtowallet')}}</el-button>
                    <a @click="createNewAcc" v-show="importing">{{$t('createnew')}}</a>
                    <span v-if="!importing"
                          style="line-height: 40px; font-size: 20px; animation: toggleShowHide 2s linear infinite;">{{runingText}} . . . </span>
                </div>
            </el-dialog>
            <el-dialog class="wallet-agreement personal-info"
                       :title="$t('personalinformation')"
                       :visible.sync="personalDialog"
                       center
                       width="1200px">
                <div class="body" style="padding: 10px;height: 510px;">
                    <account-info ref="changeAcc"></account-info>
                </div>
            </el-dialog>

            <el-dialog class="create-wallet-dialog"
                       :title="$t('caveat')"
                       :visible.sync="deleteModal"
                       width="600px"
                       top="20vh"
                       center>

                <div class="del-warning">
                    {{$t('deleting')}}
                    <p>{{accTODelete}}</p>
                    {{$t('balance001')}}
                    <p>{{delAccBalance | amountUnit}}</p>
                    {{$t('verifypassword')}}
                </div>
                <el-input v-model="pwd" type="password" :placeholder="$t('Password0001')"></el-input>
                <div class="mt-40 tc">
                    <el-button type="primary" @click="removeAcc" v-show="deleting">{{$t('ensure001')}}</el-button>
                    <span v-if="!deleting"
                          style="line-height: 40px; font-size: 20px; animation: toggleShowHide 2s linear infinite;">{{$t('deleting001')}} </span>
                </div>
            </el-dialog>

            <el-dialog class="create-wallet-dialog exit-wallet"
                       :title="$t('walletbackup')"
                       :visible.sync="exitDialog"
                       width="800px"
                       top="30vh"
                       center>
                <h2>{{$t('saveandexiting')}}<span class="important-content">{{$t('backupandpassword')}}</span>{{$t('reimport')}}</h2>

                <div class="wallet-dialog-body">
                    <a class="el-button" :href="walletInfo.blobEnc" :download="walletInfo.fileName"
                       @click="walletInfo.fileDownloaded=false" style="width: 280px;">{{$t('downloadbackup')}}</a>

                    <el-button type="danger" @click.native="reloadView" :disabled="walletInfo.fileDownloaded"
                               style="width: 280px;">
                        {{$t('clicktoexit')}}
                    </el-button>
                </div>
                <div class="wallet-dialog-footer">
                    <p>{{$t('dontlose')}}</p>
                    <p>{{$t('neverupload ')}}</p>
                    <p>{{$t('makebackup')}}</p>
                </div>

            </el-dialog>
        </div>
    </div>
</template>

<script>
    import network from '../Network/Network'
    import language from '../language/language'
    import unlockAccount from '../wallet/unlockAccount'
    import accountInfo from '../accountInfo/accountInfo'

    export default {
        name: "main-screen",
        components: {
            language,
            unlockAccount,
            accountInfo,
            network
        },
        data() {
            return {
                itemSelected: '1',
                accounts: [],
                activeAccount: '',
                dialog: false,
                personalDialog: false,
                isBorder: true,
                deleteModal: false,
                accTODelete: '',
                pwd: '',
                delAccBalance: 0,
                importing: true,
                deleting: true,
                runingText: '',
                exitDialog: false,
                walletInfo: {
                    fileName: '',
                    blobEnc: '',
                    fileDownloaded: true
                },
                voteFof: 0,
                showVoteBalance: false
            }
        },
        computed: {
            lockFlag() {
                return this.$store.state.isLock
            },
            address() {
                return this.$store.state.address
            }
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
                this.showVoteBalance = this.$route.name === "voteMain"
                if (this.$route.name === "voteMain") {
                    this.$funs.getVoteFof()
                }
            },
            address() {
                this.$funs.getVoteFof()
            }
        },
        methods: {
            importAcc() {
                this.$refs.importAcc.importWallet().then((privkey) => {
                    let wallet = this.$web3.eth.accounts.wallet
                    for (let key in wallet) {
                        if (wallet[key].privateKey === privkey) {
                            this.$message({
                                message: this.$msg.accountExist,
                                type: 'error'
                            })
                            return
                        }
                    }
                    let newAcc = this.$web3.eth.accounts.privateKeyToAccount(privkey)
                    wallet.add(newAcc)
                    this.loadAccounts()
                    this.activeAccount = newAcc.address
                    this.changeAccount()

                    this.runingText =this.$t('importing')
                    this.importing = false
                    setTimeout(() => {
                        wallet.save(wallet.myPwd)
                        this.dialog = false
                        this.$message({
                            message: this.$msg.importSucc,
                            type: 'success'
                        })
                        this.importing = true
                    }, 50)
                })
            },
            createNewAcc() {
                let wallet = this.$web3.eth.accounts.wallet
                let newAcc = this.$web3.eth.accounts.create()
                wallet.add(newAcc)

                this.loadAccounts()
                this.activeAccount = newAcc.address
                this.changeAccount()

                this.runingText = this.$t('creating')
                this.importing = false
                setTimeout(() => {
                    wallet.save(wallet.myPwd)
                    this.dialog = false
                    this.$message({
                        message: this.$msg.createSucc,
                        type: 'success'
                    })
                    this.importing = true
                }, 50)
            },
            selectAnItem(index) {
                this.itemSelected = index
                this.$funs.getBalance()
            },
            openUrl(url) {
                window.open(url)
            },
            lockOut() {
                this.$emit('lockOut')
            },
            exitWallet() {
                this.walletInfo.fileDownloaded = this.exitDialog = true
                let encryptedJSON = this.$funs.ifWalletExist()
                this.walletInfo.fileName = this.$funs.getV3Filename()
                this.walletInfo.blobEnc = this.$funs.getBlob("text/json;charset=UTF-8", encryptedJSON)
            },
            reloadView() {
                localStorage.removeItem('web3js_wallet')
                localStorage.removeItem('active_account')
                window.location.reload()
            },
            changeAccount() {
                this.$funs.setActiveAccount(this.activeAccount)
                this.$funs.getBalance()
                this.$store.commit('setAddress', this.activeAccount)
            },
            loadAccounts() {
                let wallet = this.$web3.eth.accounts.wallet
                this.accounts = []
                for (let key in wallet) {
                    if (wallet[key].address && this.accounts.indexOf(wallet[key].address) === -1) {
                        this.accounts.push(wallet[key].address)
                    }
                }
            },
            getMore() {
                this.personalDialog = true
                setTimeout(() => {
                    this.$refs.changeAcc.getWallet()
                }, 0)
            },
            showRemoveAcc(acc) {
                this.$funs.getBalanceByWei(acc, (balance) => {
                    if (typeof balance === 'string') {
                        this.delAccBalance = this.$web3.utils.fromWei(balance, 'ether')
                    } else {
                        this.delAccBalance = 0
                    }
                    this.accTODelete = acc
                    this.deleteModal = true
                    this.pwd = ""
                })
            },
            removeAcc() {
                let wallet = this.$web3.eth.accounts.wallet
                if (this.pwd === wallet.myPwd) {
                    wallet.remove(this.accTODelete)

                    this.deleting = false
                    setTimeout(() => {
                        wallet.save(wallet.myPwd)
                        // let pwd = wallet.myPwd;
                        // wallet = this.$funs.loadWallet(pwd);
                        // wallet.myPwd = pwd;
                        this.loadAccounts()
                        if (this.accTODelete === this.activeAccount) {
                            this.activeAccount = this.accounts[0]
                        }
                        this.changeAccount()
                        this.deleteModal = false
                        this.$message({
                            message: this.$msg.deleteSucc,
                            type: 'success'
                        })
                        this.deleting = true
                    }, 50)
                } else {
                    this.$message({
                        message: this.$msg.unlockFailByPwd,
                        type: 'error'
                    })
                }
            }
        },
        mounted() {
	    this.runingText = this.$t('importing')
            switch (this.$route.name) {
                case 'accountInfo':
                    this.itemSelected = '1'
                    break
                case 'myApps':
                    this.itemSelected = '2'
                    break
                case 'createApp':
                    this.itemSelected = '2'
                    break
                case 'applications':
                    this.itemSelected = '3'
                    break
                case 'voteMain':
                    this.itemSelected = '5'
                    break
                default:
                    break
            }

            if (this.$route.params.loadAcc) {
                this.loadAccounts()
                this.activeAccount = localStorage.getItem('active_account')
            }
        },
    }
</script>

<style scoped lang="scss" type="text/scss">
    $height: 100%;

    .mainScreen {
        height: $height;
        min-width: 1300px;
        /*overflow: hidden;*/

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
                            background: url("../../assets/images/mainScreen/icon_tp.png") no-repeat;
                        }
                        .nav-icon4-active {
                            background: url("../../assets/images/mainScreen/icon_tp_xz.png") no-repeat;
                        }
                        .nav-icon5 {
                            background: url("../../assets/images/mainScreen/icon_qkcx.png") no-repeat;
                        }
                        .nav-icon5-active {
                            background: url("../../assets/images/mainScreen/icon_qkcx_xz.png") no-repeat;
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

            .header {
                width: 100%;
                height: 69px;
                border-bottom: 1px solid $border_color;

                .el-select {
                    margin-right: 30px;
                    padding-top: 20px;
                    float: right;
                }
                .el-button {
                    float: right;
                    height: 28px;
                    margin-top: 20px;
                    margin-right: 30px;
                    margin-left: 0;
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
            }
            .account-nav {
                border-bottom: 2px solid #322D5D;
                height: 82px;
                line-height: 32px;
                color: #8490c5;
                font-size: 20px;
                padding-top: 8px;
                .tranc-balance {
                    margin-left: 70px;
                    .el-icon-refresh {
                        margin-left: 20px;
                        cursor: pointer;
                        &:hover {
                            color: #A0CBF5;
                        }
                    }
                }
                .tranc-address {
                    margin-left: 70px;
                    margin-top: 5px;
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
                margin: 15px;
                height: calc(100% - 192px);
                /*&.border {
                    border: solid 1px $border_color;
                }*/
            }
        }
        .wallet-agreement {
            .footer {
                a {
                    margin-left: 20px;
                    font-size: 16px;
                    vertical-align: -webkit-baseline-middle;
                    color: #a2b4db;
                    &:hover {
                        color: #D1DEF5;
                    }
                }
            }
        }
        .exit-wallet {
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
            .important-content {
                color: #f39eff;
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
