<template>
    <div class="app-list">
        <el-row>
            <el-col :span="4" v-for="(item,index) in appList" :key="index">
                <application :item="item"
                             :index="index"
                             ref="funcs"
                             @click.native="goPlay(item)"
                ></application>
            </el-col>
        </el-row>
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
                this.$axios.get('/url/api/requestContract.php')
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
        margin: 0 auto;
        overflow: hidden;
        li {
            height: 150px;
            width: 150px;
            margin: 10px;
            cursor: pointer;
            float: left;
            &:hover {
                .tc {
                    color: #f00;
                }
            }
            .app-icon {
                width: 100px;
                height: 100px;
                margin: 20px auto;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 10px;
                }
            }
        }
    }
</style>
