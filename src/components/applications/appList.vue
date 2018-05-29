<template>
    <div class="app-list">
        <el-row class="row-content">
            <el-col style="padding: 0 15px;"
                    :span="12"
                    v-for="(item,index) in appList"
                    :key="index">
                <div class="panel">
                    <el-row>
                        <el-col :span="5">
                            <application :item="item"
                                         :index="index"
                                         @click.native="goPlay(item)"
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
                                    <span class="data">{{ item.currentCoin }}</span>
                                </li>
                            </ul>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <div class="pagination">
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
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
            }
        },
        methods: {
            goPlay(item) {
                this.$router.replace({
                    path: '/appDetail?' + item.contractAddr
                })
            },
            /**
             * 获取所有应用
             */
            sendMsgToServer() {
                this.$axios.get('/api/requestContract.php')
                    .then((res) => {
                        if (res.status === 200) {
                            this.appList = res.data
                        }
                    })
                    .catch((error) => {
                        this.$message.error(String(error))
                        let timer = setTimeout(() => {
                            clearTimeout(timer)
                            this.$message.error('无法获取应用列表')
                        }, 3000)
                    })
            },
        },
        mounted() {
            this.sendMsgToServer()
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .app-list {
        height: 100%;
        padding: 2%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        .row-content {
            max-height: calc(100% - 100px);
            overflow-y: auto;
            .el-col {
                padding: 0 5px;
                .panel {
                    background-color: rgba(50, 44, 92, 0.26);
                    border: solid 1px rgba(208, 202, 253, 0.15);
                    margin-bottom: 20px;
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
        .pagination{
            margin: 0 15px;
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #28234D;
            .el-pagination{
                text-align: center;
            }
        }
    }
</style>
