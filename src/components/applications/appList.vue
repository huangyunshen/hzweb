<template>
    <div class="app-list">
        <el-row>
            <el-col :span="4" v-for="(item,index) in appList" :key="index">
                <application :item="item"
                             :index="index"
                             ref="funcs"
                             @click.native="goPlay(index)"
                ></application>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import application from '../createApp/apps'

    export default {
        name: "app-list",
        components:{
            application
        },
        data(){
            return {
                appList: [
                    {
                        imgUrl: require('../../assets/images/apps/game_icon1.png'),
                        title: '欢乐麻将'
                    },
                    {
                        imgUrl: require('../../assets/images/apps/game_icon2.png'),
                        title: '欢乐麻将'
                    },
                    {
                        imgUrl: require('../../assets/images/apps/game_icon3.png'),
                        title: '欢乐麻将'
                    },
                    {
                        imgUrl: require('../../assets/images/apps/game_icon4.png'),
                        title: '欢乐麻将'
                    },
                    {
                        imgUrl: require('../../assets/images/apps/game_icon5.png'),
                        title: '欢乐麻将'
                    },
                    {
                        imgUrl: require('../../assets/images/apps/game_icon6.png'),
                        title: '欢乐麻将'
                    },
                    {
                        imgUrl: require('../../assets/images/apps/game_icon7.png'),
                        title: '欢乐麻将'
                    },
                    {
                        imgUrl: require('../../assets/images/apps/game_icon8.png'),
                        title: '欢乐麻将'
                    }
                ],

            }
        },
        methods: {
            goPlay() {
                let con = sessionStorage.getItem('userContract')
                if (con === null || con === undefined) {
                    this.$message.warning('你还没有创建该应用！请先创建！')
                    let timer = setTimeout(()=>{
                        clearTimeout(timer)
                        this.$router.replace({
                            name: 'createApp'
                        })
                    },2000)
                } else {
                    this.$router.replace({
                        path: '/appDetail?' + sessionStorage.getItem('userContract')
                    })
                }
            }
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
