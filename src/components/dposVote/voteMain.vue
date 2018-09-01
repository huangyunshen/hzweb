<template>
    <div class="vote-main">
        <el-row :gutter="20" class="header">
            <el-col :span="4">
                <el-button size="mini" class="fade-btn" @click="showVoteList('all')">{{$t('rankinglist')}}</el-button>
            </el-col>
            <el-col :span="3">
                <el-button size="mini" class="fade-btn" @click="showVoteList('my')">{{$t('myvote')}}</el-button>
            </el-col>
            <el-col :span="8" class="tr">
                <el-button @click="voterChange" class="vote-btn">{{ $t(voterBtnTxt) }}</el-button>
            </el-col>
            <el-col :span="7" class="tr">
                <el-input :placeholder="$t('entercandidate')" v-model="searchAddr" class="input-with-select">
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
                                <span>{{$t('accountaddress02')}}</span>
                                <span>{{ item.delegate }}</span>
                            </div>
                            <div class="voter-list-row">
                                <span>{{$t('totalamountoftickets')}}</span>{{ item.value }}
                                <span v-if="item.myVote">{{$t('myvote01')}}</span>{{ item.myVote }}
                            </div>
                        </el-col>
                        <el-col :span="6" class="tr">
                            <el-button v-if="item.myVote" class="vote-btn" @click="voteToSomeone('cancel',item)">
                                {{$t('cancelvote')}}
                            </el-button>
                            <el-button class="vote-btn" @click="voteToSomeone('vote',item)">{{$t('vote')}}</el-button>
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
                <h2 class="tc" style="margin-bottom: 20px">{{$t('enterlinevote')}}</h2>
                <p class="tc">
                    <el-input-number style="width:300px" v-model="voteFof" size="large" :min="1"
                                     :label="$t('vote')"></el-input-number>
                </p>
                <p class="tc" style="margin: 20px 0">{{$t('cannotexceed')}}</p>
                <div class="tc">
                    <el-button type="primary" @click="confirmVote">{{$t('sure')}}</el-button>
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
                voterBtnTxt: 'applyforacandidate',
                searchAddr: "",
                voterList: [],
                allList: [],
                voteFofShow: false,
                voteFof: "",
                isCandidate: false,
                voteTo: ""
            };
        },
        computed: {
            myBalance() {
                return this.$t("foftotal") + Number(this.$store.state.balance).toFixed(2);
            },
            address() {
                return this.$store.state.address;
            }
        },
        watch: {
            address() {
                this.getList();
            }
        },
        methods: {
            search() {
                if (this.searchAddr.trim() === "") {
                    this.$message({
                        type: "error",
                        message: this.$t("queryparameterscannottbeempty")
                    });
                    return;
                }
                if (!this.$web3.utils.isAddress(this.searchAddr)) {
                    this.$message({
                        type: "error",
                        message: this.$t("correctaddress")
                    });
                    return;
                }
                this.$axios
                    .post("/api/requestDeleGate.php", {
                        addr: this.searchAddr
                    })
                    .then(res => {
                        let data = res.data;
                        if (data.code === "200") {
                            if (data.result) {
                                if (data.result.length === 0) {
                                    this.$message({
                                        type: "info",
                                        message: this.$t("queryresultempty")
                                    });
                                } else {
                                    this.voterList = data.result;
                                }
                            } else {
                                this.$message({
                                    type: "info",
                                    message: this.$t("queryresultempty01")
                                });
                            }
                        }
                    })
                    .catch(() => {
                        this.$message.error(this.$t("votelistfailed"));
                    });
            },
            /**
             * 排行榜
             */
            showVoteList(sign) {
                this.searchAddr = "";
                if (sign === "all") {
                    this.voterList = this.allList;
                } else {
                    let arr = [];
                    for (let i = 0; i < this.voterList.length; i++) {
                        if (this.voterList[i].myVote) {
                            arr.push(this.voterList[i]);
                        }
                    }
                    this.voterList = arr;
                }
            },
            /**
             * 候选人按钮
             **/
            voterChange() {
                if (!this.isCandidate) {
                    this.$confirm(this.$t("Whetherapplycandidate1"), this.$t("Whetherapplycandidate"), {
                        confirmButtonText: this.$t("sure01"),
                        cancelButtonText: this.$t("cancel"),
                        center: true,
                    })
                        .then(() => {
                            // LoginCandidate        1// 成为候选人
                            this.transaction(this.address, 0 + "", 1);
                        })
                        .catch(() => {
                        });
                } else {
                    this.$confirm(this.$t("outofcandidate"), "", {
                        confirmButtonText: this.$t("sure02"),
                        cancelButtonText: this.$t("cancel01"),
                        center: true,
                        type: "warning"
                    })
                        .then(() => {
                            // LogoutCandidate       2// 退出候选人
                            this.transaction(this.address, 0 + "", 2);
                            this.voterBtnTxt = "applycandidate";
                            this.isCandidate = false;
                        })
                        .catch(() => {
                        });
                }
            },
            /**
             * 取消投票
             * @param sign
             */
            voteToSomeone(sign, item) {
                if (sign === "cancel") {
                    this.$confirm(
                        `<span style="font-size: 20px"> ${this.$t(
                            "whethercancel"
                        )}</span><br>( ${this.$t(
                            "theamountwilbereturnedtothetotalamountoffofaftercancellation"
                        )})`,
                        "",
                        {
                            confirmButtonText: this.$t('sure03'),
                            cancelButtonText: this.$t('cancel02'),
                            center: true,
                            type: "warning",
                            dangerouslyUseHTMLString: true
                        }
                    )
                        .then(() => {
                            // UnDelegate            4// 取消投票（授权）
                            console.log(item.delegate);
                            this.transaction(item.delegate, item.myVote, 4);
                        })
                        .catch(() => {
                        });
                } else {
                    this.voteFofShow = true;
                    this.voteTo = item.delegate;
                }
            },
            /**
             * 确定投票
             */
            confirmVote() {
                // Delegate              3// 投票（授权）todo : transaction value should be 0
                this.transaction(this.voteTo, this.voteFof + "", 3);
                // this.transaction(this.voteTo, 0 + '', 3)
                this.voteFofShow = false;
            },
            transaction(to, value, type) {
                console.log('to:', to);
                console.log('priv', this.$funs.getActiveAccount().privateKey);
                this.$web3.eth.getTransactionCount(this.address).then(nonce => {
                    let rawTx = {
                        nonce: this.$web3.utils.toHex(nonce),
                        gas: 4500000,
                        to: to,
                        value: value,
                        txType: type
                    };
                    this.$web3.eth.accounts.signTransaction(
                        rawTx,
                        this.$funs.getActiveAccount().privateKey,
                        (err, data) => {
                            if (err) {
                                this.$message.error(String(err));
                            } else {
                                this.$web3.eth.sendSignedTransaction(data.rawTransaction)
                                    .on("error", err => {
                                        console.log("-------------", err);
                                        this.$message({
                                            message: String(err),
                                            type: "error"
                                        });
                                    })
                                    .then(receipt => {
                                        this.$funs.getVoteFof();
                                        setTimeout(this.getList, 3100);
                                        this.$message({
                                            message: this.$t('successfuloperation'),
                                            type: "success"
                                        });
                                        console.log("++++++++++++", receipt);
                                    });
                            }
                        }
                    );
                });
            },
            getList() {
                this.isCandidate = false;
                this.voterBtnTxt = 'applyforacandidate';
                this.$axios
                    .post("/api/requestDeleGate.php", {
                        addr: ""
                    })
                    .then(res => {
                        let data = res.data;
                        if (data.code === "200") {
                            if (data.result) {
                                this.$axios
                                    .post("/api/getVote.php", {
                                        addr: this.address
                                    })
                                    .then(res => {
                                        let vote = res.data;
                                        if (vote.code === "200") {
                                            if (vote.result) {
                                                for (let k in vote.result) {
                                                    for (let j = 0; j < data.result.length; j++) {
                                                        if (data.result[j].delegate === k) {
                                                            data.result[j].myVote = vote.result[k];
                                                        }
                                                    }
                                                }
                                                let myObj = {};
                                                for (let k = 0; k < data.result.length; k++) {
                                                    if (
                                                        data.result[k].delegate.toUpperCase() ===
                                                        this.address.toUpperCase()
                                                    ) {
                                                        myObj = data.result.splice(k, 1)[0];
                                                        myObj.index = this.$t('me');
                                                        this.isCandidate = true;
                                                        this.voterBtnTxt = 'cancelittobeacandidate';
                                                    }
                                                }
                                                if (myObj.delegate) {
                                                    data.result.unshift(myObj);
                                                }
                                                this.voterList = data.result;
                                                this.allList = JSON.parse(JSON.stringify(this.voterList));
                                            }
                                        } else {
                                            this.$message.error(vote.msg);
                                        }
                                    })
                                    .catch(e => {
                                        console.log(e);
                                        this.$message.error(this.$t('myvotinginformationhasfailed'));
                                    });
                            }
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
                    .catch(() => {
                        this.$message.error(this.$t('defeatinthepollrankings'));
                    });
            }
        },
        mounted() {
            this.getList();
        }
    };
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
            background: #403a6d;
            color: #cec8ff;
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
                background-color: #6262ff;
                color: #ffffff;
            }
            &:disabled {
                background: #9386ce;
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
            border-bottom: 1px solid #322d5d;
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
                border: 1px solid #322d5d;
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
                        color: #cec8ff;
                    }
                }
                .voter-list-row {
                    line-height: 50px;
                    color: #cec8ff;
                }
            }
        }
    }
</style>
