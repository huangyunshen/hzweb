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
                    <el-form-item label="应用类型">
                        <el-input v-model="filterAppInfo.typeZh" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="应用地址">
                        <el-input v-model="filterAppInfo.addr" readonly>
                            <el-button slot="append">复制</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="el-wallet-main-button" @click="goPlay" style="width: 100%;">进入游戏</el-button>
                        <a id="linkToApp" :href="filterAppInfo.addr" target="_blank"></a>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <div class="tranc-header">
            <p :class="{'header-active':tabActive==='1'}" @click="tabActive='1'">应用奖池</p>
            <b></b>
            <p :class="{'header-active':tabActive==='2'}" @click="tabActive='2'">收支记录</p>
        </div>
        <transition name="fof-fade">
            <div v-show="tabActive==='1'" class="tab-content">
                <el-form ref="form" :model="form" label-position="left" label-width="150px">
                    <el-form-item class="mt-40" label="奖池余额">
                        <el-input
                                readonly
                                v-model="filterAppInfo.currentCoin"
                                placeholder=""
                        >
                            <el-button slot="append" @click="getContractBalance">FOF</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="mt-40" label="奖池充值">
                        <el-input
                                v-model="form.rechargeVal"
                                placeholder="请输入充值金额"
                        >
                            <el-button slot="append" @click="recharge">充值</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="mt-40" label="奖池提现">
                        <el-input
                                v-model="form.drawingVal"
                                placeholder="请输入提现金额"
                        >
                            <el-button slot="append" @click="drawing">提现</el-button>
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
                        <el-table-column label="类型" :formatter="tradeType" width="100px"></el-table-column>
                        <el-table-column label="时间" prop="time" sortable width="180px"></el-table-column>
                        <el-table-column label="对方账号" :formatter="otherAccount" min-width="200px"></el-table-column>
                        <el-table-column label="交易hash" prop="txHash" min-width="200px"></el-table-column>
                        <!--<el-table-column label="应用" :formatter="appName"></el-table-column>-->
                        <el-table-column label="金额">
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
                        result = this.appInfo.contractName || "龙虎斗"
                        this.appInfo.addr = `/DragonTigerFight/?${this.appInfo.contractAddr}`
                        break
                    case "2":
                        result = this.appInfo.contractName || "赛事竞猜"
                        this.appInfo.addr = `/quiz/?${this.appInfo.contractAddr}`
                        break
                    case "3":
                        result = this.appInfo.contractName || "百家乐"
                        this.appInfo.addr = `/baccarat/?${this.appInfo.contractAddr}`
                        break
                    default:
                        result = '游戏'
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
                console.log(row)
                let fromAddr = row.txFrom.toLowerCase()
                if (row.txToType === '0') {
                    if (this.myAddr === fromAddr) {
                        return "转账-转出"
                    } else {
                        return "转账-转入"
                    }
                } else if (!row.txToType) {
                    return "创建"
                } else {
                    return "下注"
                }
            },
            otherAccount(row) {
                let fromAddr = row.txFrom.toLowerCase()
                if (this.myAddr === fromAddr) {
                    return row.txTo || "创建应用"
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
                        message: "合约地址有误，请检查合约地址是否正确",
                    })
                    return
                }
                if (this.myContractInstance === null) {
                    this.$message.error('请先选泽一个应用！')
                    return
                }
                if (this.form.rechargeVal === undefined || this.form.rechargeVal.trim() === '') {
                    this.$message.error('请输入充值金额！')
                    return
                }
                if (isNaN(Number(this.form.rechargeVal))) {
                    this.$message.error('充值金额须为纯数字！')
                    return
                }
                this.$confirm('确认充值吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.commit('setCryptPercent', {
                            percent: true,
                            text: '正在充值...'
                        }
                    )
                    this.$funs.unlockAccount().then((res) => {
                        this.rechargefun(this.$store.state.address)
                    }).catch((reason) => {
                        console.log(reason);
                        this.$store.commit('setCryptPercent', {
                                percent: false,
                                text: ''
                            }
                        )
                    })
                }).catch((error) => {
                    if (error !== 'cancel') {
                        this.$store.commit('setCryptPercent', {
                                percent: false,
                                text: ''
                            }
                        )
                        this.$message.error(String(error))
                    }
                })
            },
            rechargefun(user) {
                this.myContractInstance.methods.deposit()
                    .send({
                        from: user,
                        value: this.$web3.utils.toWei(this.form.rechargeVal, 'ether'),
                        gasPrice: this.$store.state.gasPrice * Math.pow(10, 9),
                        gas: 100000,
                        txType: 0
                    })
                    .on('error', (err) => {
                        this.$store.commit('setCryptPercent', {
                                percent: false,
                                text: ''
                            }
                        )
                        this.$message.error(String(err))
                    })
                    .on('receipt', (receipt) => {
                        this.$store.commit('setCryptPercent', {
                                percent: false,
                                text: ''
                            }
                        )
                        if (receipt.transactionHash) {
                            this.$alert(`交易hash为：${receipt.transactionHash}`, '充值成功', {
                                confirmButtonText: '确定',
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
                        message: "合约地址有误，请检查合约地址是否正确",
                    })
                    return
                }
                if (this.myContractInstance === null) {
                    this.$message.error('请先选泽一个应用！')
                    return
                }

                if (this.appInfo.createAddr !== this.$store.state.address) {
                    this.$message.error('不是应用创建者，不能提现！')
                    return
                }

                if (this.form.drawingVal === undefined || this.form.drawingVal === '') {
                    this.$message.error('请输入提现金额！')
                    return
                }
                if (isNaN(Number(this.form.drawingVal))) {
                    this.$message.error('提现金额须为纯数字！')
                    return
                }
                this.$confirm('确认提现吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.commit('setCryptPercent', {
                            percent: true,
                            text: '正在提现...'
                        }
                    )
                    this.$funs.unlockAccount().then((res) => {
                        this.drawingFun(this.$store.state.address)
                    }).catch((reason) => {
                        console.log(reason)
                    })
                }).catch((error) => {
                    if (error !== 'cancel') {
                        this.$message.error(String(error))
                    }
                })
            },
            drawingFun(user) {
                this.myContractInstance.methods.drawings(this.$web3.utils.toWei(this.form.drawingVal))
                    .send({
                        from: user,
                        gas: 100000,
                        txType: 0,
                    })
                    .on('error', (err) => {
                        this.$store.commit('setCryptPercent', {
                                percent: false,
                                text: ''
                            }
                        )
                        this.$message.error(String(err))
                    })
                    .on('receipt', (receipt) => {
                        this.$store.commit('setCryptPercent', {
                                percent: false,
                                text: ''
                            }
                        )
                        this.$alert(`交易hash为：${receipt.transactionHash}`, '提现成功', {
                            confirmButtonText: '确定',
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
                        message: "合约地址有误，请检查合约地址是否正确",
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
                                this.$message.error("没有相关数据")
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
                                message: "合约地址有误，请检查合约地址是否正确",
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
