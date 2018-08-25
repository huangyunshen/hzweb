<template>
    <div class="app-list">
        <div class="btn-list">
            <el-button size="mini" class="mini" :class="{active:searchType === 0}" @click="filter(0)">{{$t('all')}}</el-button>
            <el-button size="mini" class="mini" :class="{active:searchType === 1}" @click="filter(1)">{{$t('chess')}}</el-button>
            <el-button size="mini" class="mini" :class="{active:searchType === 2}" @click="filter(2)">{{$t('guessingcompetition')}}</el-button>
            <el-button size="mini" class="mini" :class="{active:searchType === 3}" @click="filter(3)">{{$t('gambling')}}</el-button>
            <div class="search-app">
                <el-input :placeholder="$t('entraddress')" v-model="searchAddr" @keyup.enter.native="search">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
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
                                        <span class="label">{{$t('creationtime')}}</span>
                                        <span class="data">{{ item.creationTime }}</span>
                                    </li>
                                    <li>
                                        <span class="label">{{$t('createaddr')}}</span>
                                        <span class="data">{{ item.createAddr }}</span>
                                    </li>
                                    <li>
                                        <span class="label">{{$t('contractAddr')}}</span>
                                        <span class="data">{{ item.contractAddr }}</span>
                                    </li>
                                    <li class="current">
                                        <span class="label">{{$t('poolbalance01')}}</span>
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
                class="tc"
                background
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
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
                pageSize:10,
                totalNum: 0,
                currentPage:1,
                searchAddr:'',
                searchType:0,
            }
        },
        methods: {
            filter(type) {
                this.searchType = type
                this.getData()
            },
            search() {
                if(this.$web3.utils.isAddress(this.searchAddr)) {    
                    this.getData() 
                } else if(this.searchAddr.trim() === '') {
                    this.$message.error(this.$t('enteraddress01'))
                } else {                    
                    this.$message.error(this.$t('invalidaddress02'))
                }
            },
            /**
             * pageSize 改变时会触发
             */
            sizeChange(pageSize) {
                this.pageSize = pageSize
                this.getData()
            },
            /**
             * currentChange
             */
            currentChange(index) {
                this.currentPage = index
                this.getData()
            },
            getData() {
                this.$axios.post('/api/requestContract.php', {
                    "type": this.searchType,
                    "addr": this.searchAddr,
                    "pageSize": this.pageSize,
                    "pageNum": this.currentPage,
                }).then((res) => {            
                    if (res.data.code == 200) {                        
                        if (res.data.result.length) {
                            this.appList = []
                            this.appList = this.appList.concat(res.data.result)
                            for (let i = 0; i < this.appList.length; i++) {
                                this.$web3.eth.getBalance(this.appList[i].contractAddr).then((coin) => {
                                    this.appList[i].currentCoin = this.$web3.utils.fromWei(coin, 'ether')
                                })
                            }
                            this.totalNum = Number(res.data.dataCount)
                        } else {
                            this.$message.error(this.$t('theresultis0'))
                        }
                    }
                }).catch((error) => {
                    this.$message.error(String(error))
                })
            },
            getUrl(item) {
                switch (item.gameType) {
                    case "1":
                        return `/dtfight/?${item.contractAddr}`
                    case "2":
                        return `/quiz/?${item.contractAddr}`
                    case "3":
                        return `/baccarat/?${item.contractAddr}`
                    case "4":
                        return `/p11c5/?${item.contractAddr}`
                }
            }
        },
        mounted() {
            this.getData()
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
            .active {
                background:  #6A62A7;
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
