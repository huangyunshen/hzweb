<template>
    <div class="trade-record">
        <div v-show="showSwitch==='table'" class="table-list">
            <div class="table-content">
                <el-table
                    :data="transactionsList"
                    height="100%"
                    style="color:#8490c5;font-size: 16px;background:#191131;text-align:center;"
                    :header-cell-style="headerCellStyle"
                    :row-style="rowStyle"
                    :cell-style="{'border-bottom':'none'}"
                    @row-click="showDetail"
                >
                    <!--<el-table-column-->
                    <!--prop="txHash"-->
                    <!--label="交易hash"-->
                    <!--&gt;-->
                    <!--<template slot-scope="scope">-->
                    <!--<a style="color:#8490c5;"-->
                    <!--:title="scope.row.txHash"-->
                    <!--:href="scope.row.txHash"-->
                    <!--@click.prevent="getTransaction(scope.row.txHash)">{{ scope.row.txHash }}</a>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column label="类型" :formatter="tradeType" width="200px"></el-table-column>
                    <el-table-column label="时间" prop="time" sortable width="200px"></el-table-column>
                    <el-table-column label="对方账号" :formatter="otherAccount" min-width="200px"></el-table-column>
                    <el-table-column label="应用" :formatter="appName"></el-table-column>
                    <el-table-column label="金额">
                        <template slot-scope="scope">
                            <div class="amount-in" v-if="scope.row.txFrom.toLowerCase() != myAddr">{{"+ " + $web3.utils.fromWei(scope.row.txValue, 'ether') + " FOF"}}</div>
                            <div class="amount-out" v-if="scope.row.txFrom.toLowerCase() == myAddr">{{"- " + $web3.utils.fromWei(scope.row.txValue, 'ether') + " FOF"}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

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

        <div v-show="showSwitch==='list'" class="tx-list">
            <div class="list-content">
                <p class="title">交易信息</p>
                <el-row v-for="(value,key) in transactionsData" :key="key">
                    <el-col :span="4">
                        <div>
                            {{ key + " :" }}
                        </div>
                    </el-col>
                    <el-col :span="18" :offset="1" style="word-break:break-all; word-wrap:break-word;">
                        <div>
                            {{ value }}
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div v-show="showSwitch==='list'" class="return-back">
                <el-button @click="showSwitch='table'">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "trade-record",
        data() {
            return {
                transactionsList: [],
                transactionsData: null,
                showSwitch: 'table',// 显示表格还是列表
                totalNum: 0,
                pageSize: 10,
                currentPage: 1,
                myAddr: ''
            }
        },
        computed: {
            address() {
                let addr = this.$store.state.address
                this.myAddr = addr.toLowerCase()
                return addr
            },
            amount(row) {
                return row.txValue
            }
        },
        watch: {
            address() {
                this.currentPage = 1
                this.getData()
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
            appName(row) {
                let type = row.txToType
                switch (type) {
                    case "1":
                        return "龙虎斗";
                    case "2":
                        return "赛事竞猜";
                    case "3":
                        return "百家乐";
                    default:
                        return "-"
                }
            },
            /**
             * 获取交易信息
             * @param hash
             */
            showDetail(row) {
                this.$web3.eth.getTransaction(row.txHash)
                    .then((data) => {
                        delete data.datasourcecode
                        this.transactionsData = data
                        this.showSwitch = 'list'
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
            getData() {
                if (this.address) {
                    let userAddr = this.$store.state.address
                    this.$axios.post('/api/requestTx.php', {
                        "addr": userAddr,
                        "pageSize": this.pageSize,
                        "pageNum": this.currentPage,
                    }).then((res) => {
                        console.log(res)
                        if (res.data.code == 200) {
                            if (res.data.result.length) {
                                this.transactionsList = []
                                this.transactionsList = res.data.result
                                this.totalNum = Number(res.data.dataCount)
                            }
                            // else {
                            //     this.$message.error("未查询到相关信息")
                            // }
                        }
                    }).catch((error) => {
                        this.$message.error(String(error))
                    })
                }
            },
        },
        mounted() {
            if (this.address) {
                this.getData()
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .trade-record {
        height: 100%;
        overflow-y: auto;
        .el-table::before {
            height: 0; //勿删
        }
        .table-list {
            height: 100%;
            text-align: center;
            .table-content {
                height: calc(100% - 70px);
                position: relative;
                .el-pagination {
                    text-align: center;
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
            .el-pagination {
                margin-top: 20px;
            }
        }
        .tx-list {
            color: #8490c5;
            font-size: 16px;
            height: 100%;
            .list-content {
                height: calc(100% - 60px);
                overflow-y: auto;
                .title {
                    height: 50px;
                    line-height: 50px;
                    background: #342C67;
                    font-size: 20px;
                    text-align: center;
                }
                .el-row {
                    line-height: 35px;

                    .el-col:first-child {
                        text-align: right;
                    }
                }
            }
            .return-back {
                text-align: center;
                margin-top: 10px;
                .el-button {
                    background: #5837FF;
                    color: #fff;
                    font-size: 16px;
                    border: none;
                    &:hover {
                        background: #6262FF;
                        color: #fff;
                    }
                }
            }
        }
    }
</style>
