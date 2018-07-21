<template>
    <div class="vote-main">
        <el-row :gutter="20" class="header">
            <el-col :span="4">
                <el-button size="mini" class="fade-btn" @click="showVoteList('all')">排行榜</el-button>
            </el-col>
            <el-col :span="3">
                <el-button size="mini" class="fade-btn" @click="showVoteList('my')">我的投票</el-button>
            </el-col>
            <el-col :span="8" class="tr">
                <el-button @click="voterChange" class="vote-btn">{{voterBtnTxt}}</el-button>
            </el-col>
            <el-col :span="7" class="tr">
                <el-input placeholder="输入候选人账户查找" v-model="searchAddr" class="input-with-select">
                    <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <div class="content">
            <ul>
                <li class="voter-list" v-for="(item,key) in voterList" :key="key">
                    <el-row :gutter="20">
                        <el-col :span="2" class="circle">
                            <div> {{item.index}}</div>
                        </el-col>
                        <el-col :span="16">
                            <div class="voter-list-row">
                                <span>账户地址：</span>
                                <span>{{ item.delegate }}</span>
                            </div>
                            <div class="voter-list-row">
                                <span>得票总额：</span>{{ item.value }}
                                &nbsp;
                                &nbsp;
                                <span v-if="item.myVote">我的投票：</span>{{ item.myVote }}
                            </div>
                        </el-col>
                        <el-col :span="6" class="tr">
                            <el-button v-if="item.myVote" class="vote-btn" @click="voteToSomeone('cancel',item)">取消投票
                            </el-button>
                            <el-button class="vote-btn" @click="voteToSomeone('vote',item)">投票</el-button>
                        </el-col>
                    </el-row>
                </li>
            </ul>
        </div>
        <div class="create-wallet">
            <el-dialog class="create-wallet-dialog"
                       :title="myBalance"
                       :visible.sync="voteFofShow"
                       width="400px"
                       top="30vh">
                <h2 class="tc" style="margin-bottom: 20px">请输入投票额度</h2>
                <p class="tc">
                    <el-input-number style="width:300px" v-model="voteFof" size="large" :min="1"
                                     label="投票"></el-input-number>
                </p>
                <p class="tc" style="margin: 20px 0">投票额度不能超过FOF总额度</p>
                <div class="tc">
                    <el-button type="primary" @click="confirmVote">确定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    // Binary TxType = iota  0// 之前的转账或者合约调用的交易 iota = 0
    // LoginCandidate        1// 成为候选人
    // LogoutCandidate       2// 退出候选人
    // Delegate              3// 投票（授权）
    // UnDelegate            4// 取消投票（授权）
    export default {
        name: "voteMain",
        data() {
            return {
                voterBtnTxt: '申请成为候选人',
                searchAddr: "",
                voterList: [],
                allList: [],
                voteFofShow: false,
                voteFof: '',
                isCandidate: false,
                voteTo: ''
            }
        },
        computed: {
            myBalance() {
                return "FOF总额：" + Number(this.$store.state.balance).toFixed(2)
            },
            address() {
                return this.$store.state.address
            }
        },
        watch: {
            address() {
                this.getList()
            }
        },
        methods: {
            search() {
                if (this.searchAddr.trim() === "") {
                    this.$message({
                        type: 'error',
                        message: '查询参数不能为空!'
                    })
                    return
                }
                if (!this.$web3.utils.isAddress(this.searchAddr)) {
                    this.$message({
                        type: 'error',
                        message: '请输入正确的地址!'
                    })
                    return
                }
                this.$axios.post('/api/requestDeleGate.php', {
                    addr: this.searchAddr
                }).then((res) => {
                    let data = res.data
                    if (data.code === "200") {
                        if (data.result) {
                            if (data.result.length === 0) {
                                this.$message({
                                    type: 'info',
                                    message: '查询结果为空!'
                                })
                            } else {
                                this.voterList = data.result
                            }
                        } else {
                            this.$message({
                                type: 'info',
                                message: '查询结果为空!'
                            })
                        }
                    }
                }).catch(() => {
                    this.$message.error('投票排行榜获取失败！')
                })
            },
            /**
             * 排行榜
             */
            showVoteList(sign) {
                this.searchAddr = ""
                if (sign === "all") {
                    this.voterList = this.allList
                } else {
                    let arr = []
                    for (let i = 0; i < this.voterList.length; i++) {
                        if (this.voterList[i].myVote) {
                            arr.push(this.voterList[i])
                        }
                    }
                    this.voterList = arr
                }
            },
            /**
             * 候选人按钮
             **/
            voterChange() {
                if (!this.isCandidate) {
                    this.$confirm('是否申请成为DPOS候选人?', '', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        center: true,
                        type: 'warning'
                    }).then(() => {
                        // LoginCandidate        1// 成为候选人
                        this.transaction(this.address, 0 + '', 1)
                    }).catch(() => {

                    })
                } else {
                    this.$confirm('是否退出DPOS候选人?', '', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        center: true,
                        type: 'warning'
                    }).then(() => {
                        // LogoutCandidate       2// 退出候选人
                        this.transaction(this.address, 0 + '', 2)
                        this.voterBtnTxt = '申请成为候选人'
                        this.isCandidate = false
                    }).catch(() => {

                    })
                }
            },
            /**
             * 取消投票
             * @param sign
             */
            voteToSomeone(sign, item) {
                if (sign === "cancel") {
                    this.$confirm('<span style="font-size: 20px">是否取消对该候选人的投票额度?</span><br>(取消后额度将返还为FOF总额)', '', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        center: true,
                        type: 'warning',
                        dangerouslyUseHTMLString: true
                    }).then(() => {
                        // UnDelegate            4// 取消投票（授权）
                        console.log(item.delegate)
                        this.transaction(item.delegate, item.myVote, 4)
                    }).catch(() => {

                    })
                } else {
                    this.voteFofShow = true
                    this.voteTo = item.delegate
                }
            },
            /**
             * 确定投票
             */
            confirmVote() {
                // Delegate              3// 投票（授权）todo : transaction value should be 0
                this.transaction(this.voteTo, this.voteFof + '', 3)
                // this.transaction(this.voteTo, 0 + '', 3)
                this.voteFofShow = false
            },
            transaction(to, value, type) {
                this.$web3.eth.getTransactionCount(this.address).then((nonce) => {
                    let rawTx = {
                        nonce: this.$web3.utils.toHex(nonce),
                        gas: 4500000,
                        to: to,
                        value: value,
                        txType: type
                    }
                    console.log(rawTx)
                    this.$web3.eth.accounts.signTransaction(rawTx, this.$funs.getActiveAccount().privateKey, (err, data) => {
                        if (err) {
                            this.$message.error(String(err))
                        } else {
                            if (data) {
                                this.$web3.eth.sendSignedTransaction(data.rawTransaction)
                                    .on('error', (err) => {
                                        console.log("-------------",err)
                                        this.$message({
                                            message: String(err),
                                            type: 'error',
                                        })
                                    })
                                    .then((receipt) => {
                                        this.$funs.getVoteFof()
                                        setTimeout(this.getList,3100)
                                        this.$message({
                                            message: '操作成功',
                                            type: 'success',
                                        })
                                        console.log("++++++++++++",receipt)
                                    })
                            }
                        }
                    })
                })
            },
            getList() {
                this.isCandidate = false
                this.voterBtnTxt = '申请成为候选人'
                this.$axios.post('/api/requestDeleGate.php', {
                    addr: ''
                }).then((res) => {
                    let data = res.data
                    if (data.code === "200") {
                        if (data.result) {
                            this.$axios.post('/api/getVote.php', {
                                addr: this.address
                            }).then((res) => {
                                let vote = res.data
                                if (vote.code === "200") {
                                   if (vote.result) {
                                        for(let k in vote.result){
                                            for (let j = 0; j < data.result.length; j++) {
                                                if (data.result[j].delegate === k) {
                                                    data.result[j].myVote = vote.result[k]
                                                }
                                            }
                                        }
                                        let myObj = {}
                                        for (let k = 0; k < data.result.length; k++) {
                                            if (data.result[k].delegate.toUpperCase() === this.address.toUpperCase()) {
                                                myObj = data.result.splice(k, 1)[0]
                                                myObj.index = "我"
                                                this.isCandidate = true
                                                this.voterBtnTxt = '取消成为候选人'
                                            }
                                        }
                                        if (myObj.delegate) {
                                            data.result.unshift(myObj)
                                        }
                                        this.voterList = data.result
                                        this.allList = JSON.parse(JSON.stringify(this.voterList))
                                    }

                                } else {
                                    this.$message.error(vote.msg)
                                }
                            }).catch((e) => {
                                console.log(e)
                                this.$message.error('我的投票信息获取失败！')
                            })
                        }
                    } else {
                        this.$message.error(data.msg)
                    }
                }).catch(() => {
                    this.$message.error('投票排行榜获取失败！')
                })
            }
        },
        mounted() {
            this.getList()
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .vote-main {
        height: 100%;
        .el-button.fade-btn {
            float: right;
            height: 28px;
            margin-top: 20px;
            margin-right: 30px;
            margin-left: 0;
            background: #403A6D;
            color: #CEC8FF;
            font-size: 12px;
            border: solid 1px #433e71;
            background: rgba(0, 0, 0, 0);
            &:hover {
                border-color: #726bab;
            }
        }
        .el-button.vote-btn {
            background-color: #5837ff;
            border: none;
            &:hover {
                background-color: #6262FF;
                color: #ffffff;
            }
            &:disabled {
                background: #9386CE;
            }
            &:active {
                color: #ffffff;
            }
            &:focus {
                color: #ffffff;
            }
        }
        .header {
            height: 90px;
            border-bottom: 1px solid #322D5D;
            .el-col {
                height: 90px;
                line-height: 64px;
            }
        }
        .content {
            height: calc(100% - 90px);
            overflow: auto;
            padding: 10px;
            box-sizing: border-box;
            .voter-list {
                border: 1px solid #322D5D;
                padding: 10px 20px;
                margin: 10px 0;
                height: 100px;
                line-height: 100px;
                .circle {
                    height: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    line-height: 50px;
                    div {
                        border: 1px solid #726bab;
                        height: 50px;
                        text-align: center;
                        width: 50px;
                        border-radius: 25px;
                        margin: 0 auto;
                        font-weight: 900;
                        color: #CEC8FF;
                    }
                }
                .voter-list-row {
                    line-height: 50px;
                    color: #CEC8FF;
                }
            }
        }
    }
</style>