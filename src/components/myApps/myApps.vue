<template>
    <div class="my-apps">
        <el-header class="app-list" height="250px">
            <ul>
                <li class="app-item fl" v-for="(item,index) in appList" :key="index">
                    <application :item="item"
                                 :index="index"
                                 ref="funcs"
                                 @click.native="showDetail(item,index)"
                    ></application>
                </li>
            </ul>
        </el-header>
        <el-main class="app-info">
            <el-form ref="form" :model="form" label-position="left" label-width="150px">
                <el-form-item class="mt-40" label="应用地址">
                    <el-input
                            v-model="form.contractAddr"
                            placeholder="请选中一个应用"
                            readonly
                    ></el-input>
                </el-form-item>
                <el-form-item class="mt-40" label="奖池余额">
                    <el-input
                            readonly
                            v-model="form.currentCoin"
                            placeholder="请选中一个应用"
                    ></el-input>
                </el-form-item>
                <el-form-item class="mt-40" label="奖池充值">
                    <el-input
                            v-model="form.rechargeVal"
                            placeholder="请输入充值金额"
                    >
                        <el-button slot="append" @click="recharge">充值</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item class="mt-40" label="奖池提现">
                    <el-input
                            v-model="form.drawingVal"
                            placeholder="请输入提现金额"
                    >
                        <el-button slot="append" @click="drawing">提现</el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </el-main>
    </div>
</template>

<script>
    import application from '../createApp/apps'
    import playGameContract from '../../../contracts/playGame.json'

    export default {
        name: "my-apps",
        components: {
            application
        },
        data() {
            return {
                form: {},
                appList: [],
                myContractInstance: null,
                user: '',
                password: ''
            }
        },
        methods: {
            /**
             * 连接合约
             */
            contactContract(addr) {
                let MyContract = this.$web3.eth.contract(
                    playGameContract.abi
                )
                this.myContractInstance = MyContract.at(addr)
            },
            /**
             * 充值
             */
            recharge() {
                if (this.myContractInstance === null) {
                    this.$message.error('请先选泽一个应用！')
                    return
                }
                if (this.form.rechargeVal === undefined || this.form.rechargeVal.trim() === '') {
                    this.$message.error('请输入充值金额！')
                    return
                }
                if (isNaN(Number(this.form.rechargeVal))) {
                    this.$message.error('充值金额须为纯数字！')
                    return
                }
                this.$prompt(`请输入${this.user}的密码`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    // this.$store.commit("setPassword", value)
                    this.rechargefun(this.user, value)
                }).catch((error) => {
                    if(error !== 'cancel'){
                        this.$message.error(String(error))
                    }
                })
            },
            rechargefun(user,value) {
                this.$web3.personal.unlockAccount(user, value)
                let hash = this.myContractInstance.deposit({
                    from: user,
                    value: this.$web3.toWei(this.form.rechargeVal, 'ether'),
                    gasPrice: this.$store.state.gasPrice * Math.pow(10, 9),
                    gas: this.$web3.eth.estimateGas({data: playGameContract.bytecode})
                })
                if(hash){
                    this.$alert(`交易hash为：${hash}`, '充值成功', {
                        confirmButtonText: '确定',
                    });
                }
            },
            /**
             * 提现
             */
            drawing() {
                if (this.myContractInstance === null) {
                    this.$message.error('请先选泽一个应用！')
                    return
                }
                if (this.form.drawingVal === undefined || this.form.drawingVal === '') {
                    this.$message.error('请输入提现金额！')
                    return
                }
                if (isNaN(Number(this.form.drawingVal))) {
                    this.$message.error('提现金额须为纯数字！')
                    return
                }
                this.$prompt(`请输入${this.user}的密码`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    this.drawingFun(this.user, value)
                }).catch((error) => {
                    if(error !== 'cancel'){
                        this.$message.error(String(error))
                    }
                })
            },
            drawingFun(user, value){
                this.$web3.personal.unlockAccount(user, value)
                let hash = this.myContractInstance.drawings(this.$web3.toWei(this.form.drawingVal),{
                    from: user,
                    gasPrice: this.$store.state.gasPrice * Math.pow(10, 9),
                    gas: this.$web3.eth.estimateGas({data: playGameContract.bytecode})
                })
                if(hash){
                    this.$alert(`交易hash为：${hash}`, '提现成功', {
                        confirmButtonText: '确定',
                    });
                }
            },
            /**
             * 点击应用得到详细信息
             */
            showDetail(item, i) {
                this.form = item
                for (let c = 0; c < this.appList.length; c++) {
                    this.$refs.funcs[c].selectApp(i)
                }
                this.contactContract(this.form.contractAddr)
                this.form.currentCoin = this.$web3.fromWei(this.myContractInstance.getCurrentBalance().toString(10),'ether')
            }
        },
        mounted() {
            let users = this.$funs.getLocalAddress()
            this.user = users.addresses[users.active]
            this.$axios.post('/url/api/requestContract.php', {
                "createAddr": this.user
            }).then((res) => {
                if (res.status === 200) {
                    this.appList = res.data
                }
            }).catch((error) => {
                this.$message.error(String(error))
                let timer = setTimeout(() => {
                    clearTimeout(timer)
                    this.$message.error('无法获取应用列表')
                }, 3000)
            })
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .my-apps {
        height: 100%;
        .app-list {
            .app-item {
                box-sizing: border-box;
                width: 220px;
            }
        }
        .app-info {
            .el-form {
                width: 60%;
                margin: 0 auto;
            }
        }
    }
</style>