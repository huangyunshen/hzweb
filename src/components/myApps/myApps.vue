<template>
    <div class="my-apps">
        <el-header class="app-list" height="250px">
            <p class="tc title">我的应用</p>
            <p class="prev tc btn">
                <i @click="goPage('prev')" :class="{hover: !prevIsHover,disabled: prevIsDisabled,}"></i>
            </p>
            <div class="list-box">
                <ul :style="{left: left + 'px'}" style="transition: left 1s;">
                    <li class="app-item" ref="item" v-for="(item,index) in appList" :key="index">
                        <application :item="item"
                                     :index="index"
                                     ref="funcs"
                                     @click.native="showDetail(item,index)"
                        ></application>
                    </li>
                </ul>
            </div>
            <p class="next tc btn">
                <i @click="goPage('next')" :class="{hover: nextIsHover,disabled: !nextIsDisabled,}"></i>
            </p>
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
                <el-form-item style="margin-top: 50px">
                    <el-button class="el-wallet-main-button" @click="goPlay">Go to play</el-button>
                    <a id="linkToApp" :href="contractAddressUrl" target="_blank"></a>
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
                password: '',
                left: 0, // itemBox的left
                prevIsHover: true,
                prevIsDisabled: true,
                nextIsHover: true,
                nextIsDisabled: true,
                contractAddressUrl: ''
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
                    if (error !== 'cancel') {
                        this.$message.error(String(error))
                    }
                })
            },
            rechargefun(user, value) {
                this.$web3.personal.unlockAccount(user, value)
                let hash = this.myContractInstance.deposit({
                    from: user,
                    value: this.$web3.toWei(this.form.rechargeVal, 'ether'),
                    gasPrice: this.$store.state.gasPrice * Math.pow(10, 9),
                    gas: this.$web3.eth.estimateGas({data: playGameContract.bytecode})
                })
                if (hash) {
                    this.$alert(`交易hash为：${hash}`, '充值成功', {
                        confirmButtonText: '确定',
                    })
                    let txObj = this.$web3.eth.getTransaction(hash)
                    this.$axios.post('/api/addTx.php', {
                        "type": "1",
                        "sendAddr": txObj.from,
                        "revAddr": txObj.to,
                        "txHash": txObj.hash,
                    }).then((res) => {
                        if (res.status === 200) {
                            // console.log(res)
                        }
                    }).catch((error) => {
                        this.$message.error(String(error))
                    })
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
                    if (error !== 'cancel') {
                        this.$message.error(String(error))
                    }
                })
            },
            drawingFun(user, value) {
                this.$web3.personal.unlockAccount(user, value)
                let hash = this.myContractInstance.drawings(this.$web3.toWei(this.form.drawingVal), {
                    from: user,
                    gasPrice: this.$store.state.gasPrice * Math.pow(10, 9),
                    gas: this.$web3.eth.estimateGas({data: playGameContract.bytecode})
                })
                if (hash) {
                    this.$alert(`交易hash为：${hash}`, '提现成功', {
                        confirmButtonText: '确定',
                    })
                    let txObj = this.$web3.eth.getTransaction(hash)
                    this.$axios.post('/api/addTx.php', {
                        "type": "1",
                        "sendAddr": txObj.from,
                        "revAddr": txObj.to,
                        "txHash": txObj.hash,
                    }).then((res) => {
                        if (res.status === 200) {
                            // console.log(res)
                        }
                    }).catch((error) => {
                        this.$message.error(String(error))
                    })
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
                this.form.currentCoin = this.$web3.fromWei(this.myContractInstance.getCurrentBalance().toString(10), 'ether')
            },
            goPage(sign) {
                if (this.appList.length === 0) {
                    return
                }
                let itemW = this.$refs.item[0].getBoundingClientRect().width
                if (sign === 'prev') {
                    if (this.left === 0) {
                        return
                    }
                    this.left += itemW * 8
                    this.nextIsHover = true
                    this.nextIsDisabled = true
                    if (this.left === 0) {
                        this.prevIsHover = true
                        this.prevIsDisabled = true
                    }
                } else {
                    if (this.appList.length % 8 === 0) {
                        if ((-this.left) < (Math.floor(this.appList.length / 8) - 1) * itemW * 8) {
                            this.left -= itemW * 8
                            this.prevIsHover = false
                            this.prevIsDisabled = false
                            if ((-this.left) >= (Math.floor(this.appList.length / 8) - 1) * itemW * 8) {
                                this.nextIsHover = false
                                this.nextIsDisabled = false
                            }
                        }
                    } else {
                        if ((-this.left) < (Math.floor(this.appList.length / 8)) * itemW * 8) {
                            this.left -= itemW * 8
                            this.prevIsHover = false
                            this.prevIsDisabled = false
                            if ((-this.left) >= (Math.floor(this.appList.length / 8)) * itemW * 8) {
                                this.nextIsHover = false
                                this.nextIsDisabled = false
                            }
                        }
                    }
                }
            },
            /**
             * go play
             */
            goPlay() {
                if (this.form.contractAddr === undefined) {
                    this.$message.error('请先选泽一个应用！')
                    return
                }
                let host = window.location.host
                this.contractAddressUrl = `http://${host}/appDetail?${ this.form.contractAddr }`
                let a = document.getElementById('linkToApp')
                let timer = setTimeout(() => {
                    clearTimeout(timer)
                    a.click()
                }, 1)
            }
        },
        mounted() {
            let users = this.$funs.getLocalAddress()
            this.user = users.addresses[users.active]
            this.$axios.post('/api/requestContract.php', {
                "createAddr": this.user,
                "contractAddr": ""
            }).then((res) => {
                if (res.status === 200) {
                    this.appList = res.data
                    if (this.appList !== undefined && this.appList.length !== 0) {
                        let timer = setTimeout(() => {
                            clearTimeout(timer)
                            this.showDetail(this.appList[0], 0)
                        }, 1)
                        if (this.appList.length <= 8) {
                            this.nextIsHover = false
                            this.nextIsDisabled = false
                        }
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
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .my-apps {
        height: 100%;
        .app-list {
            position: relative;
            background-color: #221D44;
            .title {
                padding-top: 18px;
                font-size: 20px;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0;
                color: #cec8ff;
            }
            .btn {
                width: 50px;
                line-height: 260px;
                height: 250px;
                position: absolute;
                top: 0;
                i {
                    display: inline-block;
                    width: 28px;
                    height: 28px;
                    background: url("../../assets/images/myApps/icon_left.png") no-repeat;
                    cursor: pointer;
                    &.hover:hover {
                        background: url("../../assets/images/myApps/icon_left_hover.png") no-repeat;
                    }
                    &:active {
                        background: url("../../assets/images/myApps/icon_left_ht.png") no-repeat;
                    }
                    &.disabled {
                        background: url("../../assets/images/myApps/icon_left_ht.png") no-repeat;
                    }
                }
                &.next {
                    right: 20px;
                    i {
                        background: url("../../assets/images/myApps/icon_right.png") no-repeat;
                        &.hover:hover {
                            background: url("../../assets/images/myApps/icon_right_hover.png") no-repeat;
                        }
                        &:active {
                            background: url("../../assets/images/myApps/icon_right_ht.png") no-repeat;
                        }
                        &.disabled {
                            background: url("../../assets/images/myApps/icon_right_ht.png") no-repeat;
                        }
                    }
                }
            }
            .list-box {
                width: 93%;
                margin: 0 auto;
                overflow: hidden;
                height: 200px;
                position: relative;
                ul {
                    height: 200px;
                    white-space: nowrap;
                    position: absolute;
                    li {
                        display: inline-block;
                        box-sizing: border-box;
                        &.app-item {
                            width: 165px;
                        }
                    }
                }
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