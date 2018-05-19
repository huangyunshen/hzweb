<template>
    <div class="mainScreen">
        <nav>
            <ul class="no-select-text">
                <li @click="selectAnItem('1')" :class="{active:itemSelected==='1'}">
                    <i class="nav-icon1" :class="{'nav-icon1-active':itemSelected==='1'}"></i>
                    <span>账户信息</span>
                </li>
                <li @click="selectAnItem('2')" :class="{active:itemSelected==='2'}">
                    <i class="nav-icon2" :class="{'nav-icon2-active':itemSelected==='2'}"></i>
                    <span>交易记录</span>
                </li>
                <li @click="selectAnItem('3')" :class="{active:itemSelected==='3'}">
                    <i class="nav-icon3" :class="{'nav-icon3-active':itemSelected==='3'}"></i>
                    <span>对外转账</span>
                </li>
                <li @click="selectAnItem('4')" :class="{active:itemSelected==='4'}">
                    <i class="nav-icon4" :class="{'nav-icon4-active':itemSelected==='4'}"></i>
                    <span>应用市场</span>
                </li>
                <li @click="selectAnItem('5')" :class="{active:itemSelected==='5'}">
                    <i class="nav-icon5" :class="{'nav-icon5-active':itemSelected==='5'}"></i>
                    <span>创建应用</span>
                </li>
            </ul>
        </nav>

        <div class="container">
            <header class="header">
                <language class="language"></language>
            </header>

            <main class="content">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script>
    import language from '../language/language';

    export default {
        name: "main-screen",
        components: {
            language
        },
        data() {
            return {
                itemSelected: '1'
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
    $width: 100%;
    $height: 100%;

    .mainScreen {
        height: $width;
        height: $height;
        overflow: hidden;
        display: flex;

        /**  侧边栏   **/
        nav {
            width: 400px;
            height: $height;
            margin-top: 160px;
            padding: 30px;
            border-top-style: solid;
            border-top-width: 2px;
            border-image-source: linear-gradient(-85deg,
                #3410f7 0%,
                #711bdc 59%,
                #ad25c0 100%);
            border-image-slice: 1;
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
                    .nav-icon1 {
                        background: url("../../assets/images/mainScreen/icon_zhxx.png") no-repeat;
                    }
                    .nav-icon1-active {
                        width: 34px;
                        height: 35px;
                        background: url("../../assets/images/mainScreen/icon_zhxx_xz.png") no-repeat;
                    }
                    .nav-icon2 {
                        background: url("../../assets/images/mainScreen/icon_jyjl.png") no-repeat;
                    }
                    .nav-icon2-active {
                        width: 34px;
                        height: 35px;
                        background: url("../../assets/images/mainScreen/icon_zhxx_xz.png") no-repeat;
                    }
                    .nav-icon3 {
                        background: url("../../assets/images/mainScreen/icon_dwzz.png") no-repeat;
                    }
                    .nav-icon3-active {
                        width: 34px;
                        height: 35px;
                        background: url("../../assets/images/mainScreen/icon_zhxx_xz.png") no-repeat;
                    }
                    .nav-icon4 {
                        background: url("../../assets/images/mainScreen/icon_yysc.png") no-repeat;
                    }
                    .nav-icon4-active {
                        width: 34px;
                        height: 35px;
                        background: url("../../assets/images/mainScreen/icon_zhxx_xz.png") no-repeat;
                    }
                    .nav-icon5 {
                        background: url("../../assets/images/mainScreen/icon_cjyy.png") no-repeat;
                    }
                    .nav-icon5-active {
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

        /**    主体     **/
        .container {
            flex-grow: 1;
            height: $height;
            background-color: rgba(25, 21, 46, 0.7);
            border-left: solid 1px $border_color;
            display: flex;
            flex-direction: column;

            .header {
                width: 100%;
                height: 69px;
                border-bottom: 1px solid $border_color;
                position: relative;

                .language {
                    position: absolute;
                    top: 20px;
                    right: 30px;
                }
            }

            .content {
                flex-grow:1;
                border: solid 1px $border_color;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                margin: 30px;
                padding: 0 70px;
            }
        }
    }
</style>
