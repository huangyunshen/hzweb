<template>
    <div class="my-apps">
        <el-main class="app-info">
            <ul>
                <li class="app-item" @click="goCreate">
                    <application :item="{gameType: '0'}"
                                 :index="0"
                    ></application>
                </li>
                <li class="app-item" v-for="(item,index) in appList" :key="index" @click="goAppInfo(item)">
                    <application :item="item"
                                 :index="index"
                    ></application>
                </li>
            </ul>
        </el-main>
        <p class="tc">
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="pageSize"
                    @current-change="sendMsgToServer"
                    :total="totalNum">
            </el-pagination>
        </p>
    </div>
</template>

<script>
    import application from '../createApp/apps'

    export default {
        name: "my-apps",
        components: {
            application
        },
        data() {
            return {
                appList: [],
                pageSize: 24,
                totalNum: 1
            }
        },
        computed: {
            address() {
                return this.$store.state.address
            }
        },
        watch: {
            address() {
                this.getAppsList()
            }
        },
        methods: {
            getAppsList() {
                if (this.address) {
                    this.$axios.post('/api/requestContract.php', {
                        "addr": this.$store.state.address,
                        "pageSize": 1000,
                        "pageNum": 1
                    }).then((res) => {
                        if (res.status === 200) {
                            if (res.data) {
                                this.appList = res.data.result
                            }
                        }
                    }).catch((error) => {
                        this.$message.error(String(error))
                        let timer = setTimeout(() => {
                            clearTimeout(timer)
                            this.$message.error('无法获取应用列表')
                        }, 3000)
                    })
                }
            },
            sendMsgToServer(i) {
            },
            /*
             * 去创建应用
             */
            goCreate() {
                this.$router.replace({name: 'createApp'})
            },
            goAppInfo(data) {
                this.$store.commit('setAppInfo', data)
                this.$router.replace({name: 'appInfo'})
            },
        },
        mounted() {
            this.getAppsList()
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .my-apps {
        height: 100%;
        overflow-y: auto;
        .app-info {
            height: calc(100% - 60px);
            ul {
                width: 100%;
                li {
                    display: inline-block;
                    box-sizing: border-box;
                    cursor: pointer;
                    &.app-item {
                        width: 165px;
                    }
                }
            }
        }
        .tc {
            height: 32px;
            padding: 14px;
        }
    }
</style>