<template>
    <div class="mainScreen">
        <aside class="aside">
            <ul>
                <li @click="selectAnItem('1')" :class="{active:itemSelected==='1'}">
                    <i class="aside-icon1" :class="{'aside-icon1-active':itemSelected==='1'}"></i>
                    <span>账户信息</span>
                </li>
                <li @click="selectAnItem('2')" :class="{active:itemSelected==='2'}">
                    <i class="aside-icon2" :class="{'aside-icon2-active':itemSelected==='2'}"></i>
                    <span>交易记录</span>
                </li>
                <li @click="selectAnItem('3')" :class="{active:itemSelected==='3'}">
                    <i class="aside-icon3" :class="{'aside-icon3-active':itemSelected==='3'}"></i>
                    <span>对外转账</span>
                </li>
                <li @click="selectAnItem('4')" :class="{active:itemSelected==='4'}">
                    <i class="aside-icon4" :class="{'aside-icon4-active':itemSelected==='4'}"></i>
                    <span>应用市场</span>
                </li>
                <li @click="selectAnItem('5')" :class="{active:itemSelected==='5'}">
                    <i class="aside-icon5" :class="{'aside-icon5-active':itemSelected==='5'}"></i>
                    <span>创建应用</span>
                </li>
            </ul>
        </aside>
    </div>
</template>

<script>
    export default {
        name: "main-screen",
        data() {
            return {
                itemSelected: '2'
            }
        },
        methods: {
            selectAnItem(index) {
                this.itemSelected = index;
            }
        }
    }
</script>

<style scoped lang="scss" type="text/scss">

    .mainScreen {
        height: 100%;
        overflow: hidden;

        .aside {
            width: 400px;
            height: 100%;
            margin-top: 160px;
            padding: 30px;
            border-top-style: solid;
            border-top-width: 2px;
            border-image-source: linear-gradient(-85deg,
                            #3410f7 0%,
                            #711bdc 59%,
                            #ad25c0 100%);
            border-image-slice:1;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            background-color: rgba(10, 7, 85, 0.8);

            ul {
                li {
                    height: 90px;
                    background: url("../../assets/images/mainScreen/btn.png") no-repeat;
                    margin-top: 30px;
                    text-align: center;
                    line-height: 90px;
                    font-size: 24px;
                    color: #8abdec;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;

                    span {
                        cursor: default;
                    }
                    i {
                        display: inline-block;
                        width: 30px;
                        height: 30px;
                        margin-right: 5px;
                        vertical-align: text-top;
                    }
                    .aside-icon1 {
                        background: url("../../assets/images/mainScreen/icon_zhxx.png") no-repeat;
                    }
                    .aside-icon1-active {
                        width: 34px;
                        height: 35px;
                        background: url("../../assets/images/mainScreen/icon_zhxx_xz.png") no-repeat;
                    }
                    .aside-icon2 {
                        background: url("../../assets/images/mainScreen/icon_jyjl.png") no-repeat;
                    }
                    .aside-icon2-active {
                        width: 34px;
                        height: 35px;
                        background: url("../../assets/images/mainScreen/icon_zhxx_xz.png") no-repeat;
                    }
                    .aside-icon3 {
                        background: url("../../assets/images/mainScreen/icon_dwzz.png") no-repeat;
                    }
                    .aside-icon3-active {
                        width: 34px;
                        height: 35px;
                        background: url("../../assets/images/mainScreen/icon_zhxx_xz.png") no-repeat;
                    }
                    .aside-icon4 {
                        background: url("../../assets/images/mainScreen/icon_yysc.png") no-repeat;
                    }
                    .aside-icon4-active {
                        width: 34px;
                        height: 35px;
                        background: url("../../assets/images/mainScreen/icon_zhxx_xz.png") no-repeat;
                    }
                    .aside-icon5 {
                        background: url("../../assets/images/mainScreen/icon_cjyy.png") no-repeat;
                    }
                    .aside-icon5-active {
                        width: 34px;
                        height: 35px;
                        background: url("../../assets/images/mainScreen/icon_zhxx_xz.png") no-repeat;
                    }
                }
                .active {
                    background: url("../../assets/images/mainScreen/btn_xz.png") no-repeat;
                    font-size: 26px;
                    color: #e9f4ff;
                }
            }
        }
    }
</style>