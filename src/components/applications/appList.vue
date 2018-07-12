<template>
    <div class="app-list">
        <div class="btn-list">
            <el-button size="mini" class="mini">全部</el-button>
            <el-button size="mini" class="mini">赛事</el-button>
            <el-button size="mini" class="mini">棋牌</el-button>
            <el-button size="mini" class="mini">博彩</el-button>
            <div class="search-app">
                <el-input placeholder="输入应用地址或者创建人地址查找">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
        </div>
        <el-row class="row-content">
            <el-col style="padding: 0 15px;"
                    :span="12"
                    v-for="(item,index) in appList"
                    :key="index">
                <a :href="getUrl(item)" target="_blank">
                    <div class="panel">
                        <el-row>
                            <el-col :span="5">
                                <application :item="item"
                                             :index="index"
                                ></application>
                            </el-col>
                            <el-col :span="19">
                                <ul class="info-list">
                                    <li>
                                        <span class="label">创建时间：</span>
                                        <span class="data">{{ item.time }}</span>
                                    </li>
                                    <li>
                                        <span class="label">创建人地址：</span>
                                        <span class="data">{{ item.createAddr }}</span>
                                    </li>
                                    <li>
                                        <span class="label">应用地址：</span>
                                        <span class="data">{{ item.contractAddr }}</span>
                                    </li>
                                    <li class="current">
                                        <span class="label">奖金池余额：</span>
                                        <span class="data">{{ item.currentCoin | amountUnit}}</span>
                                    </li>
                                </ul>
                            </el-col>
                        </el-row>
                    </div>
                </a>
            </el-col>
        </el-row>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                @current-change="sendMsgToServer"
                :total="totalNum">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import application from '../createApp/apps'

    export default {
        name: "app-list",
        components: {
            application
        },
        data() {
            return {
                appList: [],
                blankHref: '',
                pageSize: 6,
                totalNum: 0,
            }
        },
        methods: {
            /**
             * 获取所有应用
             */
            sendMsgToServer(page) {
                this.$axios.post('/api/requestContract.php', {
                    "pageSize": this.pageSize,
                    "pageNum": page,
                }).then((res) => {
                    if (res.status === 200) {
                        this.appList = res.data
                        for (let i = 0; i < this.appList.length; i++) {
                            this.$web3.eth.getBalance(this.appList[i].contractAddr).then((coin) => {
                                this.appList[i].currentCoin = this.$web3.utils.fromWei(coin, 'ether')
                            })
                        }
                        if (res.data.length > 0) {
                            this.totalNum = Number(res.data[0].dataCount)
                        } else {
                            this.$message.error('查询结果为0')
                        }
                    }
                }).catch((error) => {
                    this.$message.error(String(error))
                    let timer = setTimeout(() => {
                        clearTimeout(timer)
                        this.$message.error('无法获取应用列表')
                    }, 3000)
                })
            },
            getUrl(item) {
                switch (item.type) {
                    case "1":
                        return 'http://39.104.81.103:8891?' + item.contractAddr;
                    case "2":
                        return 'http://39.104.81.103:8892?' + item.contractAddr
                }
            }
        },
        mounted() {
            this.sendMsgToServer(1)
        }
    }
</script>


<style lang="scss" type="text/scss" scoped>
    .app-list {
        height: 100%;
        /*padding: 1%;*/
        /*-webkit-box-sizing: border-box;*/
        /*-moz-box-sizing: border-box;*/
        /*box-sizing: border-box;*/
        .btn-list {
            height: 44px;
            text-align: center;
            margin: 0 16px;
            padding-bottom: 15px;
            border-bottom: 1px solid #28234D;
            .mini {
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
            .search-app {
                display: inline-block;
                width: 50%;
            }
        }
        .row-content {
            max-height: calc(100% - 100px);
            overflow-y: auto;
            padding-top: 20px;
            .el-col {
                padding: 0 5px;
                .panel {
                    background-color: rgba(50, 44, 92, 0.26);
                    border: solid 1px rgba(208, 202, 253, 0.15);
                    margin-bottom: 20px;
                    &:hover {
                        background: rgba(50, 44, 92, 1);
                        border: solid 1px rgba(208, 202, 253, 0.5);
                        box-shadow: 0 0 5px #817BAD;
                    }
                    .info-list {
                        padding: 10px 0;
                        font-size: 14px;
                        li {
                            height: 35px;
                            line-height: 45px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            .label {
                                display: inline-block;
                                width: 90px;
                                color: #cec8ff;
                            }
                            .data {
                                color: #8abdec;
                            }
                        }
                    }
                }
            }
        }
        .pagination {
            height: 32px;
            margin: 0 16px;
            padding-top: 14px;
            border-top: 1px solid #28234D;
            .el-pagination {
                text-align: center;
            }
        }
    }
</style>
