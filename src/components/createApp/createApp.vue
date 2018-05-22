<template>
    <!--<div class="apps" v-loading="loading">-->
    <!--<el-dialog-->
    <!--center-->
    <!--title="部署成功"-->
    <!--:visible.sync="dialogVisible"-->
    <!--:close-on-click-modal="false"-->
    <!--:close-on-press-escape="false"-->
    <!--width="30%">-->
    <!--<el-form>-->
    <!--<el-form-item label="合约地址为" label-width="100px">-->
    <!--<el-input v-model="contractAddress" auto-complete="off" readonly="true"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="showTransfer">确 定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
    <!--<el-dialog-->
    <!--center-->
    <!--title="向奖金池充值"-->
    <!--:visible.sync="rechargeVisible"-->
    <!--:close-on-click-modal="false"-->
    <!--:close-on-press-escape="false"-->
    <!--width="30%">-->
    <!--<el-form :model="rechargeData">-->
    <!--<el-form-item label="充值金额为" label-width="100px">-->
    <!--<el-input v-model="rechargeData.value" auto-complete="off">-->
    <!--<template slot="append">ETH</template>-->
    <!--</el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="gasPrice" label-width="100px">-->
    <!--<el-input v-model="rechargeData.gasPrice" auto-complete="off">-->
    <!--<template slot="append">Gwei</template>-->
    <!--</el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="recharge">确 定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
    <!--<el-dialog-->
    <!--center-->
    <!--title="转帐提示"-->
    <!--:visible.sync="transferVisible"-->
    <!--width="30%">-->
    <!--<el-form>-->
    <!--<el-form-item label="转账hash为：" label-width="100px">-->
    <!--<el-input v-model="transferHash" auto-complete="off">-->
    <!--</el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="transferVisible = false">确 定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
    <!--</div>-->

    <div>
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
                <div class="step-1" v-show="steps===1">
                    <div class="header">用户协议</div>
                    <div class="body">
                        <agreement></agreement>
                    </div>
                </div>
                <!--step-2-->
                <div class="step-2" v-show="steps===2">
                    <div class="header">选择你想要创建的游戏</div>
                    <div class="body">
                        <el-row>
                            <el-col :span="4" v-for="(item,index) in appList" :key="index">
                                <application :item="item"
                                             :index="index"
                                             ref="funcs"
                                             @click.native="selectAnApp(index)"
                                ></application>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <!--step3-->
                <div class="step-3" v-show="steps===3">
                    <div class="header">请配置相关参数</div>
                    <div class="body">
                        <div class="content">
                            <el-form
                                    label-width="110px"
                                    label-position="left"
                                    @submit.native.prevent>

                                <el-form-item class="el-wallet-style" label="充值金额">
                                    <el-input class="el-wallet-input"
                                              auto-complete="off"
                                              v-model="rechargeData.value"
                                    ></el-input>
                                </el-form-item>
                            </el-form>
                            <el-form class="mt-50"
                                    label-width="110px"
                                    label-position="left"
                                    @submit.native.prevent>

                                <el-form-item class="el-wallet-style" label="下注金额">
                                    <el-row>
                                        <el-col :span="7">
                                            <el-input class="el-wallet-input"
                                                      auto-complete="off"
                                                      v-model="rechargeData.price1"
                                            ></el-input>
                                        </el-col>
                                        <el-col :span="7" :offset="1">
                                            <el-input class="el-wallet-input"
                                                      auto-complete="off"
                                                      v-model="rechargeData.price2"
                                            ></el-input>
                                        </el-col>
                                        <el-col :span="7" :offset="1">
                                            <el-input class="el-wallet-input"
                                                      auto-complete="off"
                                                      v-model="rechargeData.price3"
                                            ></el-input>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <!--step4-->
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
                                            <el-input class="el-wallet-input"
                                                      auto-complete="off"
                                                      v-model="contractAddress"
                                                      readonly
                                            ></el-input>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-button>复制</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="create-footer">
                <el-button class="el-wallet-main-button" @click="preStep" v-show="steps===2 || steps===3">上一步
                </el-button>
                <el-button class="el-wallet-main-button" @click="nextStep">{{btnVal}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import agreement from './agreement'
    import application from './apps'
    // 先部署定时器合约 得到其地址
    import intervalContract from '../../../contracts/interval.json'
    import playGameContract from '../../../contracts/playGame.json'

    export default {
        name: "create-app",
        components: {
            agreement,
            application
        },
        data() {
            return {
                steps: 1,
                selected:null,
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
                btnVal: "下一步",
                setCoin: null,
                loading: false,
                dialogVisible: false, // 部署成功显示合约地址
                rechargeVisible: false,// 充值弹窗
                transferVisible: false,// 转账成功弹窗
                transferHash: '',
                contractAddress: '',
                rechargeValue: '',
                rechargeData: {
                    value: '100',
                    gasPrice: '41',
                    gas: '21000',
                    price1: '1',
                    price2: '5',
                    price3: '10'
                }
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
                    if(this.steps===2&& (typeof this.selected !== 'number')){
                        this.$message({
                            message:this.$msg.mustSelectAnApp,
                            type:'error'
                        })
                        return
                    }
                    if(this.steps===3){
                        this.$confirm('确认部署合约吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let users = this.$funs.getLocalAddress()
                            let user = users.addresses[users.active]
                            if (this.$store.state.userPassword === "") {
                                this.$prompt(`请输入${user}的密码`, '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                }).then(({value}) => {
                                    this.$confirm('是否保存密码?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        this.$store.commit("setPassword", "value")
                                        this.migration(user, value)
                                    }).catch(() => {
                                        this.migration(user, value)
                                    })
                                }).catch((error) => {
                                })
                            } else {
                                this.migration(user, this.$store.state.userPassword)
                            }
                        }).catch((err) => {
                            if (err !== 'cancel') {
                                this.$message.error('无效地址或者密码错误！')
                            }
                        })
                    }
                    this.steps++
                }
            },
            selectAnApp(index) {
                this.selected = index
                for (let c = 0; c < this.appList.length; c++) {
                    this.$refs.funcs[c].selectApp(index)
                }
            },
            // showTransfer() {
            //     this.dialogVisible = false
            //     let timer = setTimeout(() => {
            //         clearTimeout(timer)
            //         this.rechargeVisible = true
            //     }, 500)
            // },
            /**
             * 充值
             */
            recharge() {
                if (isNaN(this.rechargeData.value)) {
                    this.$message.error('请输入正确的充值数量！')
                    return false
                }
                if (this.rechargeData.value === '' || Number(this.rechargeData.value) === 0) {
                    this.$message.error('充值数量不能为空和不能为0！')
                    return false
                }
                if (isNaN(this.rechargeData.gasPrice)) {
                    this.$message.error('请输入正确的gasPrice！')
                    return false
                }
                if (this.rechargeData.gasPrice === '' || Number(this.rechargeData.gasPrice) === 0) {
                    this.$message.error('gasPrice不能为空和不能为0！')
                    return false
                }
                // todo
                this.$web3.personal.unlockAccount(this.$store.state.publicKey, 'jacky')
                let MyContract = this.$web3.eth.contract(
                    playGameContract.abi
                )
                let myContractInstance = MyContract.at(this.contractAddress)
                // let myContractInstance = MyContract.at('0x1eae033ce4e56e62c3bc26ce7750c1cd9621fac2')
                // 转账 到合约账户，返回交易hash
                let hash = myContractInstance.deposit({
                    from: this.$store.state.publicKey,
                    value: this.$web3.toWei(this.rechargeData.value, 'ether'),
                    gasPrice: this.rechargeData.gasPrice * Math.pow(10, 9),
                    gas: this.$web3.eth.estimateGas({data: playGameContract.bytecode})
                })
                if (hash) {
                    // this.rechargeVisible = false
                    // let timer = setTimeout(() => {
                    //     clearTimeout(timer)
                        this.transferHash = hash
                    //     this.transferVisible = true
                    // }, 500)
                }
            },
            // next() {
            //     if (this.active++ > 1) {
            //         this.btnVal = '完成'
            //     }
            //     if (this.active > 3) {
            //         this.active--
            //         this.$confirm('确认部署合约吗?', '提示', {
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             type: 'warning'
            //         }).then(() => {
            //             let users = this.$funs.getLocalAddress()
            //             let user = users.addresses[users.active]
            //             if (this.$store.state.userPassword === "") {
            //                 this.$prompt(`请输入${user}的密码`, '提示', {
            //                     confirmButtonText: '确定',
            //                     cancelButtonText: '取消',
            //                 }).then(({value}) => {
            //                     this.$confirm('是否保存密码?', '提示', {
            //                         confirmButtonText: '确定',
            //                         cancelButtonText: '取消',
            //                         type: 'warning'
            //                     }).then(() => {
            //                         this.$store.commit("setPassword", "value")
            //                         this.migration(user, value)
            //                     }).catch(() => {
            //                         this.migration(user, value)
            //                     })
            //                 }).catch((error) => {
            //                 })
            //             } else {
            //                 this.migration(user, this.$store.state.userPassword)
            //             }
            //         }).catch((err) => {
            //             if (err !== 'cancel') {
            //                 this.$message.error('无效地址或者密码错误！')
            //             }
            //         })
            //     }
            // },
            migration(user, value) {
                let url = "http://localhost:8080/appDetail"
                this.$msgbox({
                    title: '消息',
                    message: `${url}?0x6ef1a17b452ab6b7b5aca4c7c2204040b8141643`,
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            setTimeout(() => {
                                done();
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 300);
                            }, 3000);
                        } else {
                            done();
                        }
                    }
                }).then(action => {
                    this.$message({
                        type: 'info',
                        message: 'action: ' + action
                    });
                });
                this.$web3.personal.unlockAccount(user, value)
                return
                this.loading = true
                let MyContract = this.$web3.eth.contract(
                    playGameContract.abi
                )
                MyContract.new({
                    data: playGameContract.bytecode,
                    from: user,
                    gasPrice: '20000000000',
                    gas: this.$web3.eth.estimateGas({data: playGameContract.bytecode})
                }, (err, myContract) => {
                    if (err) {
                        this.loading = false
                        this.$message.error('部署失败！')
                    } else {
                        if (myContract.address) {
                            this.loading = false
                            console.log(myContract.address)
                            this.contractAddress = myContract.address
                            this.dialogVisible = true
                            localStorage.setItem('contractAddress', myContract.address)
                            this.$store.commit('setContractAddress', myContract.address)

                            // 每次部署完合约，需要向定时器合约中注册当前合约地址
                            let myIntContractInstance = MyContract.at(myContract.address)
                            myIntContractInstance.registerInterval('0x4e9f0c8d3378042c418c42a8a5f48783731d65d2', {
                                from: user,
                                gasPrice: 20000000000,
                                gas: this.$web3.eth.estimateGas({data: playGameContract.bytecode})
                            })

                            //部署成功！你的合约地址为
                            let url = "http://localhost:8080/appDetail"
                            this.$msgbox({
                                title: '消息',
                                message: `${url}?0x6ef1a17b452ab6b7b5aca4c7c2204040b8141643`,
                                showCancelButton: true,
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                beforeClose: (action, instance, done) => {
                                    if (action === 'confirm') {
                                        instance.confirmButtonLoading = true;
                                        instance.confirmButtonText = '执行中...';
                                        setTimeout(() => {
                                            done();
                                            setTimeout(() => {
                                                instance.confirmButtonLoading = false;
                                            }, 300);
                                        }, 3000);
                                    } else {
                                        done();
                                    }
                                }
                            }).then(action => {
                                this.$message({
                                    type: 'info',
                                    message: 'action: ' + action
                                });
                            });
                            // 0xf7b2d96eb1c84f846c226da6e265b27225243b71
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    $title_color: #cec8ff;
    $content_color: #8abdec;

    .create-app {
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
            padding: 20px 70px;
            font-size: 16px;
            color: #cec8ff;

            .header {
                line-height: 40px;
                font-size: 20px;
                text-align: center;
            }
            .body {
                height: 500px;
                overflow-y: auto;
                padding: 10px;
                border: solid 1px rgba(208, 202, 253, 0.15);
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
            }
            .step-3 {
                .content{
                    width: 800px;
                    padding: 30px;
                }
            }
            .step-4{
                .body{
                    border-left: none;
                    border-top: none;
                    border-right: none;
                    margin-bottom: 30px;
                    .finishe-icon{
                        text-align: center;
                        padding: 100px 0;
                        i{
                            display: inline-block;
                            width: 120px;
                            height: 120px;
                            background: url("../../assets/images/apps/icon_cjcg.png");
                        }
                        p{
                            margin-top: 25px;
                            font-size: 24px;
                            color: #8490c5;
                        }
                    }
                    .finishe-address{
                        .el-button{
                            width: 80%;
                            height: 70px;
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
            position: relative;
            width: 800px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            .el-button:last-child {
                margin-left: 50px;
            }
        }
    }
</style>