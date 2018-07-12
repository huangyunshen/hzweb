<template>
    <div class="game-config">
        <el-row>
            <el-col :offset="2" :span="20">
                <el-row>
                    <el-col :span="8">
                        <el-form
                            label-width="150px"
                            label-position="right"
                            @submit.native.prevent>

                            <el-form-item class="el-wallet-style" label="游戏名称">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.name"
                                    maxlength="10"
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" label="赛事类型">
                                <el-select v-model="configData.type" placeholder="请选择" style="width: 100%;">
                                    <el-option
                                        v-for="item in types"
                                        :key="item.type"
                                        :label="item.name"
                                        :value="item.type">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" label="比赛场次">
                                <el-select v-model="configData.liveId" placeholder="请选择" style="width: 100%;">
                                    <el-option
                                        v-for="item in gameData"
                                        :key="item.liveId"
                                        :label="item.c4T1 + ' VS ' + item.c4T2"
                                        :value="item.liveId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" label="奖池金额">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.recharge"
                                >
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>

                    <el-col :span="8">
                        <el-form
                            label-width="150px"
                            label-position="right"
                            @submit.native.prevent>
                            <el-form-item class="el-wallet-style" label="主队让球">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.hConcedePoints"
                                    @input.native="inputValue1"
                                    maxlength="2"
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" label="客队让球">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.vConcedePoints"
                                    @input.native="inputValue2"
                                    maxlength="2"
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" label="单注下注金额">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.singleBetCoin"
                                    maxlength="5"
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item class="el-wallet-style" label="下注截止时间">
                                <el-date-picker
                                    style="width: 100%;"
                                    v-model="configData.deadline"
                                    type="datetime"
                                    placeholder="选择截止时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-col>

                    <el-col :span="8">
                        <el-form
                            label-width="150px"
                            label-position="right"
                            @submit.native.prevent>

                            <el-form-item class="el-wallet-style" label="主胜赔率">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.oddsH"
                                    maxlength="5"
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" label="平局赔率">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.oddsD"
                                    maxlength="5"
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" label="客胜赔率">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.oddsV"
                                    maxlength="5"
                                >
                                </el-input>
                            </el-form-item>

                            <!--<el-form-item class="el-wallet-style" label="自定义图标">-->
                            <!--<el-input-->
                            <!--auto-complete="off"-->
                            <!--v-model="configData.icon"-->
                            <!--&gt;-->
                            <!--</el-input>-->
                            <!--</el-form-item>-->
                        </el-form>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="2" :span="20">
                <div class="explain">
                    <shijiebei-rule></shijiebei-rule>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import shijiebeiRule from "./shijiebeiRule" // TODO  待更改世界杯游戏规则
    import gameData from "./data"

    import contract from '../../../contracts/shijiebei/playGame.json'
    // import contract from '../../../contracts/shijiebei/instanceTemplate.json'
    import sol from '../../../contracts/shijiebei/playGame.sol'

    export default {
        name: "shijiebeiConfig",
        components: {
            shijiebeiRule,
        },
        data() {
            return {
                configData: {
                    name: '',
                    type: '',
                    recharge: '',
                    deadline: '',
                    icon: '',
                    singleBetCoin: 1,
                    oddsH: '',
                    oddsD: '',
                    oddsV: '',
                    hConcedePoints: 0,
                    vConcedePoints: 0,
                    liveId: null,
                },
                types: [
                    {type: 2, name: '世界杯'}
                ],
                gameData: []
            }
        },
        methods: {
            // deploy() {  //test
            //     let c = new this.$web3.eth.Contract(contract.abi, "0xd417C764cC10816b041b32C0575F08b95866Cb35")
            //     c.methods.gameType().call().then(console.log)

                // let user = this.$store.state.address
                // this.$funs.magrationContract(0, user, contract, sol, [44])
                //     .then((contractIns) => {
                //         console.log(contractIns);
                //         0xd417C764cC10816b041b32C0575F08b95866Cb35
                //     })
            // },
            deploy() {
                let user = this.$store.state.address
                return new Promise((resolve, reject) => {
                    let result = this.verifyData()
                    if (result.message) {
                        reject(result)
                        return
                    }
                    let hTeam, vTeam;
                    for (let key in this.gameData) {
                        if (this.gameData[key].liveId == this.configData.liveId) {
                            hTeam = this.gameData[key].c4T1
                            vTeam = this.gameData[key].c4T2
                        }
                    }
                    try {
                        this.$store.commit('setCryptPercent', {percent: true, text: '创建中···'})
                        this.$funs.unlockAccount().then((res) => {
                            let args = [
                                Number(this.configData.type),
                                1,
                                hTeam,
                                vTeam,
                                Number(this.configData.oddsH) * 100,
                                Number(this.configData.oddsD) * 100,
                                Number(this.configData.oddsV) * 100,
                                Date.parse(new Date(this.configData.deadline)),
                                String(this.configData.singleBetCoin),
                                Number(this.configData.hConcedePoints),
                                Number(this.configData.vConcedePoints),
                                Number(this.configData.liveId),
                            ];
                            this.$funs.magrationContract(Number(this.configData.type), user, contract, sol, args)
                                .then((contractIns) => {
                                    this.$store.commit('setCryptPercent', {percent: true, text: '创建成功！正在充值···'})
                                    // 每次部署完合约，需要向定时器合约中注册当前合约地址
                                    // contractIns.methods.registerInterval('0xb8e1d5B380A87A9Ab8e305267C5eD808bBA4e795')
                                    //     .send({
                                    //         from: user,
                                    //         gas: 4712388,
                                    //         txType: 0,
                                    //     })
                                    //     .on('error', (err) => {
                                    //         this.$store.commit('setCryptPercent', {percent: false, text: ''})
                                    //         this.$message.error(err.message)
                                    //         reject(err)
                                    //     })
                                    //     .on('receipt', (receipt) => {
                                    //         this.$funs.uploadTxData("1", receipt);
                                            this.$funs.rechargeToContract(contractIns, user, this.configData.recharge)
                                                .then((data) => {
                                                    contractIns.contractAddressUrl = 'http://39.104.81.103:8892?' + contractIns._address
                                                    resolve(contractIns)
                                                }, (err) => {
                                                    console.log(err);
                                                })
                                        // })
                                }, (err) => {
                                    console.log(err);
                                })
                        }).catch((reason) => {
                            console.log(reason)
                        })
                    } catch (err) {
                        this.$message.error(err.message)
                    }
                })
            },
            verifyData() {
                let balance = Number(this.$store.state.balance)
                if (!this.configData.type) {
                    return new Error('请选择赛事类型！');
                }
                if (!this.configData.liveId) {
                    return new Error('请选择比赛场次！');
                }
                if (!this.$funs.validateFloatNum(this.configData.recharge)) {
                    return new Error('请输入正确的奖池金额！');
                }
                let reg = /^\d*.\d{0,9}$/g
                if (!reg.test(this.configData.recharge)) {
                    return new Error('奖池金额小数点后不能超过9位！');
                }
                if (balance < (Number(this.configData.recharge) + 1)) {
                    return new Error('余额不足以支付奖池充值金额！');
                }
                if (
                    (!this.$funs.validateIntNum(this.configData.hConcedePoints) && this.configData.hConcedePoints != 0)
                    || (!this.$funs.validateIntNum(this.configData.vConcedePoints) && this.configData.vConcedePoints != 0)
                ) {
                    return new Error('请输入正整数的让球数！');
                }
                if (!this.$funs.validateIntNum(this.configData.singleBetCoin)) {
                    return new Error('请输入正整数的单注下注金额！');
                }
                if (!this.configData.deadline) {
                    return new Error('请选择下注截止时间！');
                }
                if (!this.$funs.validateFloatNum(this.configData.oddsH) || !this.$funs.validateFloatNum(this.configData.oddsD) || !this.$funs.validateFloatNum(this.configData.oddsV)) {
                    return new Error('请输入正确的赔率！');
                }
                if (this.splitString(this.configData.oddsH, ".", 1).length > 2
                    || this.splitString(this.configData.oddsD, ".", 1).length > 2
                    || this.splitString(this.configData.oddsV, ".", 1).length > 2) {
                    return new Error('赔率小数点后不能超过2位！');
                }
                return true
            },
            inputValue1() {
                this.configData.vConcedePoints = 0
            },
            inputValue2() {
                this.configData.hConcedePoints = 0
            },
            splitString(str, point, n) {
                return String(str).split(point)[n] || ''
            }
        },
        mounted() {
            this.gameData = gameData.result.views.saicheng1
        }
    }
</script>

<style lang="scss" scoped>

    @import "../../assets/scss/gameConfig";

</style>
