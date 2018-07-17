<template>
    <div class="create-app">
        <div class="create-header no-select-text">
            <p :class="{'header-active':steps===1}">用户协议</p>
            <span></span>
            <p :class="{'header-active':steps===2}">选择类型</p>
            <span></span>
            <p :class="{'header-active':steps===3}">配置应用</p>
            <span></span>
            <p :class="{'header-active':steps===4}">创建成功</p>
        </div>

        <div class="create-body">
            <!--step-1-->
            <transition name="fof-fade">
                <div class="step-1" v-show="steps===1">
                    <div class="header">用户协议</div>
                    <div class="body">
                        <agreement></agreement>
                        <p class="tc" style="margin: 20px;">
                            <el-checkbox v-model="checked">同意以上协议</el-checkbox>
                        </p>
                    </div>
                </div>
            </transition>
            <!--step-2-->
            <transition name="fof-fade">
                <div class="step-2" v-show="steps===2">
                    <div class="header">选择你想要创建的游戏</div>
                    <div class="body">
                        <el-row>
                            <el-col :span="4" v-for="(item,index) in appList" :key="index">
                                <application :item="item"
                                             :index="index"
                                             ref="funcs"
                                             @click.native="selectAnApp(item.gameType,index)"
                                ></application>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </transition>
            <!--step3-->
            <transition name="fof-fade">
                <div class="step-3" v-show="steps===3">
                    <div class="header">请配置相关参数</div>
                    <div class="body">
                        <longhudou-config ref="contractConfig" v-if="selected === '1'"></longhudou-config>
                        <shijiebei-config ref="contractConfig" v-if="selected === '2'"></shijiebei-config>
                        <baccarat-config ref="contractConfig" v-if="selected === '3'"></baccarat-config>
                    </div>
                </div>
            </transition>
            <!--step4-->
            <transition name="fof-fade">
                <div class="step-4" v-show="steps===4">
                    <div class="body">
                        <div class="finishe-icon">
                            <i></i>
                            <p>创建成功</p>
                        </div>
                        <div class="finishe-address">
                            <el-form
                                label-width="110px"
                                label-position="left"
                                @submit.native.prevent>

                                <el-form-item class="el-wallet-style" label="应用地址">
                                    <el-row>
                                        <el-col :span="20">
                                            <el-input id="appAddress"
                                                      auto-complete="off"
                                                      v-model="contractAddressUrl"
                                                      readonly
                                            ></el-input>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-button @click="copyAddress">复制</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <div class="create-footer">
            <el-button @click="preStep" v-show="steps===2 || steps===3">上一步
            </el-button>
            <el-button @click="nextStep" :disabled="!checked">{{btnVal}}</el-button>
            <a id="linkToApp" :href="contractAddressUrl" target="_blank"></a>
        </div>
    </div>
</template>

<script>
    import agreement from './agreement'
    import application from './apps'
    import longhudouConfig from '../gameConfig/longhudouConfig'
    import shijiebeiConfig from '../gameConfig/shijiebeiConfig'
    import baccaratConfig from '../gameConfig/baccaratConfig'

    export default {
        name: "create-app",
        components: {
            agreement,
            application,
            longhudouConfig,
            shijiebeiConfig,
            baccaratConfig,
        },
        data() {
            return {
                steps: 1,
                selected: '',
                appList: [{
                    contractAddr: "0xfe56582a999c5dae6ba4cc9ea84e9f1842e5fb39",
                    createAddr: "0x8ddb5f0b47a027cea553c58734389dd4ed7ff7f5",
                    currentCoin: "1000000000000.00000000",
                    historyCoin: null,
                    id: "93",
                    time: "2018-05-23 02:25:30",
                    gameType: "1"
                }, {
                    contractAddr: "0xfe56582a999c5dae6ba4cc9ea84e9f1842e5fb39",
                    createAddr: "0x8ddb5f0b47a027cea553c58734389dd4ed7ff7f5",
                    currentCoin: "1000000000000.00000000",
                    historyCoin: null,
                    id: "93",
                    time: "2018-05-23 02:25:30",
                    gameType: "2"
                }, {
                    contractAddr: "0xfe56582a999c5dae6ba4cc9ea84e9f1842e5fb39",
                    createAddr: "0x8ddb5f0b47a027cea553c58734389dd4ed7ff7f5",
                    currentCoin: "1000000000000.00000000",
                    historyCoin: null,
                    id: "93",
                    time: "2018-05-23 02:25:30",
                    gameType: "3"
                }],
                btnVal: "下一步",
                contractAddress: '',
                contractAddressUrl: '',// 可以访问的地址
                checked: true,//同意协议
            }
        },
        methods: {
            preStep() {
                if (this.steps > 1) {
                    this.steps--
                }
            },
            nextStep() {
                if (this.steps < 4) {
                    let balance = Number(this.$store.state.balance)
                    if (this.steps === 1) {
                        if (balance < 1) {
                            this.$message({
                                message: this.$msg.balanceNotEnough,
                                type: 'error'
                            })
                            return
                        }
                        this.steps++
                        return
                    }

                    if (this.steps === 2) {
                        if(this.selected === ''){
                            this.$message({
                                message: this.$msg.mustSelectAnApp,
                                type: 'error'
                            })
                            return
                        }
                        this.steps++
                        return
                    }

                    if (this.steps === 3) {
                        this.$refs.contractConfig.deploy().then( contractIns => {
                            if(contractIns.contractAddressUrl) {
                                this.contractAddress = contractIns._address
                                this.contractAddressUrl = contractIns.contractAddressUrl
                                this.steps++
                                this.btnVal = '完成'
                            } else {
                                this.$message.error('请在配置组件配置跳转路径')
                            }
                        }, error => {
                            this.$message.error(error.message)
                        })
                    }
                } else {
                    let a = document.getElementById('linkToApp')
                    a.click()
                    this.steps = 1
                    this.btnVal = "下一步"
                    this.selectAnApp("", -1)
                }
            },
            selectAnApp(type, index) {
                this.selected = type
                for (let c = 0; c < this.appList.length; c++) {
                    this.$refs.funcs[c].selectApp(index)
                }
            },
            /**
             * 充值
             */
            // sendMsgToServer() {
            //     this.$axios.get('/api/requestContract.php')
            //         .then((res) => {
            //             if (res.status === 200) {
            //                 let obj = {
            //                     contractAddr: "0xfe56582a999c5dae6ba4cc9ea84e9f1842e5fb39",
            //                     createAddr: "0x8ddb5f0b47a027cea553c58734389dd4ed7ff7f5",
            //                     currentCoin: "1000000000000.00000000",
            //                     historyCoin: null,
            //                     id: "93",
            //                     time: "2018-05-23 02:25:30",
            //                     type: "1"
            //                 }
            //                 this.appList = [obj]
            //                 // this.appList = res.data
            //             }
            //         })
            //         .catch((error) => {
            //             this.$message.error(String(error))
            //             let timer = setTimeout(() => {
            //                 clearTimeout(timer)
            //                 this.$message.error('无法获取应用列表')
            //             }, 3000)
            //         })
            // },
            copyAddress() {
                let input = document.getElementById('appAddress')
                input.select()
                document.execCommand('copy')
            }
        },
        mounted() {
            this.$funs.getBalance()
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    $title_color: #cec8ff;
    $content_color: #8abdec;

    .create-app {
        height: 100%;
        .create-header {
            display: flex;
            text-align: center;
            p {
                flex-grow: 1;
                line-height: 70px;
                background-color: #221D44;
                box-shadow: 1px 0px 0px 0px #272345;
                font-size: 20px;
                color: #d3ceff;

            }
            .header-active {
                line-height: 68px;
                border-bottom-style: solid;
                border-bottom-width: 2px;
                border-image-source: linear-gradient(105deg,
                    #3410f7 0%,
                    #711bdc 59%,
                    #ad25c0 100%);
                border-image-slice: 1;
                background-color: #3a346a;
            }
            span {
                display: inline-block;
                height: 70px;
                border-right: 2px solid #272345;
            }
        }

        .create-body {
            height: calc(100% - 155px);
            overflow-y: hidden;
            font-size: 16px;
            color: #cec8ff;

            .header {
                line-height: 40px;
                font-size: 20px;
                text-align: center;
            }
            .body {
                height: calc(100% - 62px);
                overflow-y: auto;
                padding: 10px;
                border: solid 1px rgba(208, 202, 253, 0.15);
            }
            .step-1 {
                height: 100%;
            }
            .step-2 {
                height: 100%;
            }
            .step-3 {
                height: 100%;
            }
            .step-4 {
                height: 100%;
                .body {
                    border-left: none;
                    border-top: none;
                    border-right: none;
                    width: 90%;
                    margin: 0 auto;
                    .finishe-icon {
                        text-align: center;
                        padding: 50px 0;
                        i {
                            display: inline-block;
                            width: 120px;
                            height: 120px;
                            background: url("../../assets/images/apps/icon_cjcg.png");
                        }
                        p {
                            margin-top: 25px;
                            font-size: 24px;
                            color: #8490c5;
                        }
                    }
                    .finishe-address {
                        .el-input {
                            font-size: 18px !important;
                        }
                        .el-button {
                            width: 80%;
                            height: 60px;
                            margin-left: 10px;
                            background-image: linear-gradient(
                                    #443e67,
                                    #443e67),
                            linear-gradient(
                                    #443e67,
                                    #443e67);
                            background-blend-mode: normal, normal;
                            font-size: 26px;
                            color: #bbb3ef;
                            border: none;
                        }
                    }
                }
            }
        }
        .create-footer {
            width: 800px;
            height: 60px;
            margin: 0 auto;
            padding: 20px 0;
            text-align: center;
            .el-button {
                width: 40%;
                background-color: #5837ff;
                font-size: 26px;
                font-weight: 500;
                color: #ffffff;
                border: none;
                &:hover {
                    background-color: #6262FF;
                    color: #ffffff;
                }

                &:disabled {
                    background: #9386CE;
                }
                &:last-child {
                    margin-left: 50px;
                }
            }
        }
    }
</style>
