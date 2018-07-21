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
                                    maxlength="15"
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" label="赛事类型">
                                <el-select v-model="configData.type" placeholder="请选择" style="width: 100%;" @change="setSession(configData.type)">
                                    <el-option
                                        v-for="item in types"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" label="比赛场次">
                                <el-select v-model="configData.id" placeholder="请选择" style="width: 100%;" @change="setDefaultDeadline" no-data-text="请选择赛事类型">
                                    <el-option
                                        v-for="(item, key) in gameData"
                                        :key="key"
                                        :label="item.zhuTeam + ' VS ' + item.keTeam"
                                        :value="key">
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
    import shijiebeiRule from "./shijiebeiRule" 
    import contract from '../../../contracts/saishijingcai/playGame.json'
    import sol from '../../../contracts/saishijingcai/playGame.sol'

    export default {
        name: "shijiebeiConfig",
        components: {
            shijiebeiRule,
        },
        data() {
            return {
                configData: {
                    name: '赛事竞猜',
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
                    id:""
                },
                types: {},
                gameData: {},
                totalData:{},
            }
        },
        methods: {
            setDefaultDeadline() {
                this.configData.deadline = new Date( this.gameData[this.configData.id].gameTime)                
            },
            setSession(type) {
                this.configData.id = this.configData.deadline = ''
                this.gameData = {}
                this.gameData = this.totalData[type]
            },
            deploy() {
                let user = this.$store.state.address
                return new Promise((resolve, reject) => {
                    let result = this.verifyData()
                    if (result.message) {
                        reject(result)
                        return
                    }
                    let hTeam, vTeam;
                    hTeam = this.gameData[this.configData.id].zhuTeam                    
                    vTeam = this.gameData[this.configData.id].keTeam                    
                    try {
                        this.$store.commit('setCryptPercent', {percent: true, text: '创建中···'})
                        this.$funs.unlockAccount().then((res) => {
                            let args = [
                                String(this.configData.name) || "赛事竞猜",
                                hTeam,
                                vTeam,
                                Number(this.configData.oddsH) * 100,
                                Number(this.configData.oddsD) * 100,
                                Number(this.configData.oddsV) * 100,
                                Date.parse(new Date(this.configData.deadline)),
                                Number(this.configData.singleBetCoin),
                                Number(this.configData.hConcedePoints),
                                Number(this.configData.vConcedePoints),
                                Number(this.configData.liveId),
                            ];
                            
                            this.$funs.magrationContract(user, contract, sol, args)
                                .then((contractIns) => {
                                    this.$store.commit('setCryptPercent', {percent: true, text: '创建成功！正在充值···'})
                                    this.$funs.rechargeToContract(contractIns, user, this.configData.recharge)
                                        .then((data) => {
                                            contractIns.contractAddressUrl = `/quiz/?${contractIns._address}`
                                            resolve(contractIns)
                                        }, (err) => {
                                            console.log(err);
                                        })
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
                if (!this.configData.name) {
                    return new Error('请输入游戏名称！');
                }
                if (!this.configData.type) {
                    return new Error('请选择赛事类型！');
                }
                if (!this.configData.id && this.configData.id != 0) {
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
                let now = new Date();
                if (this.configData.deadline < now) {   
                    return new Error('下注截止时间应在当前时间之后！');
                }
                if (this.configData.deadline > new Date( this.gameData[this.configData.id].gameTime)) {   
                    return new Error('下注截止时间应在比赛开始时间之前！');
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
        beforeMount() {
            this.$axios.post('/api/getResults.php')
            .then((res) => {
                if(res.data.code == 200) {
                    let result = res.data.result
                    let len = result.length
                    if(result.length) {
                        this.types = {}
                        this.totalData = {}
                        for (let i = 0; i < len; i++) {
                            if(result[i].type === "未开赛"){
                                let name = result[i].name
                                if(!this.types[name]) {
                                    this.types[name] = name
                                    this.totalData[name] = []
                                }
                                this.totalData[name].push(result[i])          
                            }                  
                        }
                    } else {
                        this.$message.error("目前没有进行中的比赛")
                    }
                }
                
            }).catch((error) => {
                this.$message.error(String(error))
            })
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>

    @import "../../assets/scss/gameConfig";

</style>
