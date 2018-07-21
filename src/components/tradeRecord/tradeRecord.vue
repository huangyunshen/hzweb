<template>
    <div class="trade-record">
        <!--<el-input placeholder="Search by Address / Txhash" v-model="searchParams">-->
        <!--<el-button slot="append" icon="el-icon-search" @click="getTransaction(searchParams)"></el-button>-->
        <!--</el-input>-->
        <div v-show="showSwitch==='table'" class="table-list">
            <div class="table-content">
                <el-table class="trade-record-table"
                          :data="transactionsList"
                          height="100%"
                          style="color:#8490c5;font-size: 16px;background:#191131;text-align:center;"
                          :header-cell-style="headerCellStyle"
                          :row-style="rowStyle"
                          :cell-style="{'border-bottom':'none'}"
                >
                    <el-table-column
                            prop="txHash"
                            label="交易hash"
                    >
                        <template slot-scope="scope">
                            <a style="color:#8490c5;"
                               :title="scope.row.txHash"
                               :href="scope.row.txHash"
                               @click.prevent="getTransaction(scope.row.txHash)">{{ scope.row.txHash }}</a>
                        </template>
                    </el-table-column>

                    <!-- <el-table-column
                            prop="blockNum"
                            sortable
                            label="区块值">
                    </el-table-column> -->
                    <el-table-column
                            prop="txFrom"
                            label="转出方"
                            min-width="200px">
                    </el-table-column>
                    <el-table-column
                            prop="txTo"
                            label="转入方"
                            min-width="200px">
                    </el-table-column>
                    <el-table-column
                            prop="txValue"
                            label="金额"
                            :formatter="valueFilter">
                    </el-table-column>
                    <el-table-column
                            prop="time"
                            sortable
                            width="180px"
                            label="时间">
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="pageSize"
                    @current-change="currentPage"
                    :total="totalNum">
            </el-pagination>
        </div>

        <div v-show="showSwitch==='list'" class="tx-list">
            <div class="list-content">
                <p class="title">交易信息</p>
                <el-row v-for="(value,key) in transactionsData" :key="key">
                    <el-col :span="6">
                        <div>
                            {{ key + " :" }}
                        </div>
                    </el-col>
                    <el-col :span="17" :offset="1">
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
                // searchParams: '', // 搜索参数
                showSwitch: 'table',// 显示表格还是列表
                totalNum: 0,
                pageSize: 20
            }
        },
        computed: {
            address() {
                return this.$store.state.address
            }
        },
        watch: {
            address() {
                this.currentPage(1)
            }
        },
        methods: {
            /**
             * 获取交易信息
             * @param hash
             */
            getTransaction(hash) {
                if (hash) {
                    this.$web3.eth.getTransaction(hash)
                        .then((data) => {
                            delete data.datasourcecode
                            this.transactionsData = data
                            this.showSwitch = 'list'
                        })
                } else {
                    this.showSwitch = 'table'
                }
            },
            headerCellStyle({row, rowIndex}) {
                return 'background:#342C67;border-bottom:0;font-size: 20px;color: #d3ceff;height:70px;text-align:center;'
            },
            rowStyle({row, rowIndex}) {
                if (rowIndex & 1) {
                    return 'background:#342C67;'
                } else {
                    return 'background:#221d44;'
                }
            },
            currentPage(page) {
                if (this.address) {
                    let userAddr = this.$store.state.address
                    this.$axios.post('/api/requestTx.php', {
                        "addr": userAddr,
                        "pageSize": this.pageSize,
                        "pageNum": page,
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
            valueFilter(row) {
                return this.$web3.utils.fromWei(row.txValue, 'ether');
            }
        },
        mounted() {
            this.currentPage(1)
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
