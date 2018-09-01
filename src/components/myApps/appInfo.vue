<template>
    <div class="app-info">
        <el-row>
            <el-col :span="4">
                <application :item="filterAppInfo"
                             :index="0"
                ></application>
            </el-col>
            <el-col :span="20" style="padding-top: 25px">
                <el-form label-width="100px" style="width: 90%">
                    <el-form-item :label="$t('applicationtype')">
                        <el-input v-model="filterAppInfo.typeZh" readonly></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('applicationaddress01')">
                        <el-input v-model="filterAppInfo.addr" readonly>
                            <el-button slot="append">{{$t('copy')}}</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="el-wallet-main-button" @click="goPlay" style="width: 100%;">{{$t('gamestart')}}</el-button>
                        <a id="linkToApp" :href="filterAppInfo.addr" target="_blank"></a>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <div class="tranc-header">
            <p :class="{'header-active':tabActive==='1'}" @click="tabActive='1'">{{$t('applicationofthepool')}}</p>
            <b></b>
            <p :class="{'header-active':tabActive==='2'}" @click="tabActive='2'">{{$t('incomeandexpenditurerecord')}}</p>
        </div>
        <transition name="fof-fade">
            <div v-show="tabActive==='1'" class="tab-content">
                <el-form ref="form" :model="form" label-position="left" label-width="150px">
                    <el-form-item class="mt-40" :label="$t('prizepoolbalance')">
                        <el-input
                                readonly
                                v-model="filterAppInfo.currentCoin"
                                placeholder=""
                        >
                            <el-button slot="append" @click="getContractBalance">FOF</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="mt-40" :label="$t('prizepoolrecharge')">
                        <el-input
                                v-model="form.rechargeVal"
                                :placeholder="$t('entertherechargeamount')"
                        >
                            <el-button slot="append" @click="recharge">{{$t('recharge')}}</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="mt-40" :label="$t('prizepoolwithdrawal')">
                        <el-input
                                v-model="form.drawingVal"
                                :placeholder="$t('entertheamountofcash')"
                        >
                            <el-button slot="append" @click="drawing">{{$t('withdraw')}}</el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </transition>
        <transition name="fof-fade">
            <div v-show="tabActive==='2'" class="tab-content tab-table">
                <div class="table-content">
                    <el-table
                            class="trade-record-table"
                            :data="tableData"
                            height="100%"
                            style="color:#8490c5;font-size: 16px;background:#191131;text-align:center;"
                            :header-cell-style="headerCellStyle"
                            :row-style="rowStyle"
                            :cell-style="{'border-bottom':'none'}"
                    >
                        <el-table-column :label="$t('typesof')" :formatter="tradeType" width="100px"></el-table-column>
                        <el-table-column :label="$t('time')" prop="time" sortable width="180px"></el-table-column>
                        <el-table-column :label="$t('otheraccounts')" :formatter="otherAccount" min-width="200px"></el-table-column>
                        <el-table-column :label="$t('transactionhash')" prop="txHash" min-width="200px"></el-table-column>
                        <!--<el-table-column label="应用" :formatter="appName"></el-table-column>-->
                        <el-table-column :label="$t('amount')">
                            <template slot-scope="scope">
                                <div class="amount-in" v-if="scope.row.txFrom.toLowerCase() != myAddr">{{"+ " + $web3.utils.fromWei(scope.row.txValue, 'ether') + " FOF"}}</div>
                                <div class="amount-out" v-if="scope.row.txFrom.toLowerCase() == myAddr">{{"- " + $web3.utils.fromWei(scope.row.txValue, 'ether') + " FOF"}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="record-page">
                    <el-pagination
                        class="tc"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :page-size="pageSize"
                        :current-page="currentPage"
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        :total="totalNum">
                    </el-pagination>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import application from '../createApp/apps'
    import playGameContract from '../../../contracts/instanceTemplate.json'

    export default {
        name: "app-info",
        data() {
            return {
                tabActive: '1',
                form: {},
                pageSize: 10,
                currentPage:1,
                totalNum: 0,
                tableData: [],
                appInfo: {},
                isDisabled: false,
                myAddr:''
            }
        },
        components: {
            application
        },
        computed: {
            filterAppInfo() {
                let result = ''
                let type = this.appInfo.gameType
                switch (type) {
                    case "1":
                        result = this.appInfo.contractName || this.$t('dragonandtigerfighting')
                        this.appInfo.addr = `/dtfight/?${this.appInfo.contractAddr}`
                        break
                    case "2":
                        result = this.appInfo.contractName ||this.$t('matchquiz')
                        this.appInfo.addr = `/quiz/?${this.appInfo.contractAddr}`
                        break
                    case "3":
                        result = this.appInfo.contractName ||this.$t('baccarat') 
                        this.appInfo.addr = `/baccarat/?${this.appInfo.contractAddr}`
                        break
                    case "4":
                        result = this.appInfo.contractName ||this.$t('p11c5')
                        this.appInfo.addr =  `/p11c5/?${this.appInfo.contractAddr}`
                        break
                    default:
                        result =this.$t('game')
                        break
                }
                this.appInfo.typeZh = result

                return this.appInfo
            }
        },
        methods: {
            /*
                表格数据处理
            */
            tradeType(row) {
                let fromAddr = row.txFrom.toLowerCase()
                if (row.txToType === '0') {
                    if (this.myAddr === fromAddr) {
                        return this.$t('transfertotransferout')
                    } else {
                        return this.$t('transfertotransfer')
                    }
                } else if (!row.txToType) {
                    return this.$t('create')
                } else {
                    return this.$t('bet')
                }
            },
            otherAccount(row) {
                let fromAddr = row.txFrom.toLowerCase()
                if (this.myAddr === fromAddr) {
                    return row.txTo || this.$t('createanapp')
                } else {
                    return row.txFrom
                }
            },
            // appName(row) {
            //     let type = row.txToType
            //     switch (type) {
            //         case "1":
            //             return "龙虎斗";
            //         case "2":
            //             return "赛事竞猜";
            //         case "3":
            //             return "百家乐";
            //         default:
            //             return "-"
            //     }
            // },
            /**
             * 连接合约
             */
            contactContract(addr) {
                return new Promise((resolve, rejecte) => {
                    this.myContractInstance = new this.$web3.eth.Contract(playGameContract.abi, addr)
                    resolve(this.myContractInstance)
                })
            },
            headerCellStyle({row, rowIndex}) {
                return 'background:#342C67;border-bottom:0;font-size: 20px;color: #d3ceff;height:40px;text-align:center;'
            },
            rowStyle({row, rowIndex}) {
                if (rowIndex & 1) {
                    return 'background:#342C67;'
                } else {
                    return 'background:#221d44;'
                }
            },
            /**
             * 充值
             */
            recharge() {
                if(this.isDisabled){
                    this.$message({
                        type: 'error',
                        message: this.$t('thecontractaddressisincorrectpleasecheckifthecontracaddressiscorrect'),
                    })
                    return
                }
                if (this.myContractInstance === null) {
                    this.$message.error(this.$t('pleaseselectanappfirst'))
                    return
                }
                if (this.form.rechargeVal === undefined || this.form.rechargeVal.trim() === '') {
                    this.$message.error(this.$t('pleaseentertherechargeamount'))
                    return
                }
                if (isNaN(Number(this.form.rechargeVal))) {
                    this.$message.error(this.$t('theamountofrechargemustbeapurenumber'))
                    return
                }
                this.$confirm(this.$t('confirmrecharge'), this.$t('prompt'), {
                    confirmButtonText: this.$t('determine'),
                    cancelButtonText: this.$t('cancel'),
                    type: 'warning'
                }).then(() => {
                    this.$store.commit('setCryptPercent', {percent: true,text: this.$t('recharging')})

                    this.rechargefun(this.$store.state.address)
                })
                //     .catch((error) => {
                //     if (error !== 'cancel') {
                //         this.$store.commit('setCryptPercent', {
                //                 percent: false,
                //                 text: ''
                //             }
                //         )
                //         this.$message.error(String(error))
                //     }
                // })
            },
            rechargefun(user) {
                this.myContractInstance.methods.deposit()
                    .send({
                        from: user,
                        value: this.$web3.utils.toWei(this.form.rechargeVal, 'ether'),
                        gas: 450000,
                        txType: 0
                    })
                    .on('error', (err) => {
                        this.$store.commit('setCryptPercent', {percent: false, text: ''})
                        this.$message.error(String(err))
                    })
                    .on('receipt', (receipt) => {
                        this.$store.commit('setCryptPercent', {percent: false, text: ''})

                        if (receipt.transactionHash) {
                            this.$alert(`${this.$t('tradinghashis')}${receipt.transactionHash}`, this.$t('rechargesuccessful'), {
                                confirmButtonText: this.$t('determine'),
                            })
                            this.getContractBalance()
                        }
                    })
            },
            /**
             * 提现
             */
            drawing() {
                if(this.isDisabled){
                    this.$message({
                        type: 'error',
                        message:this.$t('contractaddressinerrorpleasechecktheaddressiscorrectcontract') ,
                    })
                    return
                }
                if (this.myContractInstance === null) {
                    this.$message.error(this.$t('pleaseselectanapplicationfirst'))
                    return
                }

                if (this.appInfo.createAddr !== this.$store.state.address.toUpperCase()) {
                    this.$message.error(this.$t('notanappcreatorcantwithdrawcash'))
                    return
                }

                if (this.form.drawingVal === undefined || this.form.drawingVal === '') {
                    this.$message.error(this.$t('pleaseentertheamountofcash'))
                    return
                }
                if (isNaN(Number(this.form.drawingVal))) {
                    this.$message.error(this.$t('thecashamountmustbeapurenumber'))
                    return
                }
                this.$confirm(this.$t('confirmwithdrawal'),this.$t('prompt'), {
                    confirmButtonText:this.$t('determine'),
                    cancelButtonText: this.$t('cancel'),
                    type: 'warning'
                }).then(() => {
                    this.$store.commit('setCryptPercent', {percent: true, text: this.$t('extracting')})

                    this.drawingFun(this.$store.state.address)
                })
                //     .catch((error) => {
                //     if (error !== 'cancel') {
                //         this.$message.error(String(error))
                //     }
                // })
            },
            drawingFun(user) {
                this.myContractInstance.methods.drawings(this.$web3.utils.toWei(this.form.drawingVal))
                    .send({
                        from: user,
                        gas: 450000,
                        txType: 0,
                    })
                    .on('error', (err) => {
                        this.$store.commit('setCryptPercent', {percent: false, text: ''})
                        this.$message.error(String(err))
                    })
                    .on('receipt', (receipt) => {
                        this.$store.commit('setCryptPercent', {percent: false, text: ''})

                        this.$alert(`${this.$t('tradinghashis')}${receipt.transactionHash}`, this.$t('cashwithdrawalsuccess'), {
                            confirmButtonText: this.$t('determine'),
                        })
                        this.getContractBalance()
                    })
            },
            /**
             * pageSize 改变时会触发
             */
            sizeChange(pageSize) {
                this.pageSize = pageSize
                this.getData()
            },
            currentChange(index) {
                this.currentPage = index
                this.getData()
            },
            goPlay() {
                if(this.isDisabled){
                    this.$message({
                        type: 'error',
                        message: this.$t('thecontractaddressisincorrectpleasecheckifthecontractaddressiscorrect'),
                    })
                    return
                }
                let a = document.getElementById('linkToApp')
                let timer = setTimeout(() => {
                    clearTimeout(timer)
                    a.click()
                }, 1)
            },
            getContractBalance() {
                this.$funs.getBalanceByWei(this.appInfo.contractAddr, balance => {
                    this.filterAppInfo.currentCoin = this.$web3.utils.fromWei(balance, 'ether')
                })
            },
            getData() {
                let addr = this.appInfo.contractAddr
                if(addr) {
                    this.$axios.post('/api/requestTx.php', {
                        "addr": addr,
                        "pageSize": this.pageSize,
                        "pageNum": this.currentPage,
                    }).then((res) => {
                        if (res.data.code == 200) {
                            if (res.data.result.length) {
                                this.totalNum = Number(res.data.dataCount)
                                this.tableData = []
                                this.tableData = this.tableData.concat(res.data.result)
                            } else {
                                this.$message.error(this.$t('norelevantdata'))
                            }
                        }
                    }).catch((error) => {
                        this.$message.error(String(error))
                    })
                }
            },
        },
        mounted() {
            if (!this.$store.state.appInfo) {
                this.$router.replace({name: 'myApps'})
            } else {
                this.appInfo = this.$store.state.appInfo
                this.myAddr = this.appInfo.contractAddr
                this.contactContract(this.appInfo.contractAddr).then((instance) => {
                    this.myContractInstance.methods.gameType().call().then((data) => {
                        if (!data) {
                            this.$message({
                                type: 'error',
                                message: this.$t('thecontractaddressisincorrectpleasecheckifthecontractaddressiscorrect'),
                            })
                            this.isDisabled = true
                        } else {
                            this.getContractBalance()
                            this.getData()
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .el-table:before {
        height: 0;
    }

    .app-info {
        height: 100%;
        .tranc-header {
            display: flex;
            text-align: center;
            p {
                flex-grow: 1;
                line-height: 40px;
                background-color: #221D44;
                box-shadow: 1px 0 0 0 #272345;
                font-size: 20px;
                color: #d3ceff;
                cursor: pointer;
            }
            .header-active {
                line-height: 40px;
                border-bottom-style: solid;
                border-bottom-width: 2px;
                border-image-source: linear-gradient(105deg,
                        #3410f7 0%,
                        #711bdc 59%,
                        #ad25c0 100%);
                border-image-slice: 1;
                background-color: #3a346a;
            }
            b {
                display: inline-block;
                height: 40px;
                border-right: 2px solid #272345;
            }
        }
        .tab-content {
            height: calc(100% - 280px);
            overflow-y: auto;
            .el-form {
                width: 60%;
                margin: 0 auto;
            }
            .table-content {
                height: calc(100% - 60px);
            }
            .record-page {
                height: 32px;
                padding: 14px;
            }
        }
    }
</style>
