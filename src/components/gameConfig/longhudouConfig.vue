<template>
    <div class="game-config">
        <el-row>
            <el-col :offset="2" :span="20">
                <el-form
                    label-width="150px"
                    label-position="left"
                    @submit.native.prevent>

                    <el-form-item class="el-wallet-style" label="奖池充值金额">
                        <el-row>
                            <el-col :span="6">
                                <el-input
                                    auto-complete="off"
                                    v-model="rechargeData.value"
                                >
                                    <template slot="append">FOF</template>
                                </el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
                <el-form class="mt-50"
                         label-width="150px"
                         label-position="left"
                         @submit.native.prevent>

                    <el-form-item class="el-wallet-style" label="可选下注金额">
                        <el-row>
                            <el-col :span="6">
                                <el-input
                                    auto-complete="off"
                                    v-model="rechargeData.price1"
                                >
                                    <template slot="append">FOF</template>
                                </el-input>
                            </el-col>
                            <el-col :span="5" :offset="1">
                                <el-input
                                    auto-complete="off"
                                    v-model="rechargeData.price2"
                                >
                                    <template slot="append">FOF</template>
                                </el-input>
                            </el-col>
                            <el-col :span="5" :offset="1">
                                <el-input
                                    auto-complete="off"
                                    v-model="rechargeData.price3"
                                >
                                    <template slot="append">FOF</template>
                                </el-input>
                            </el-col>
                            <el-col :span="5" :offset="1">
                                <el-input
                                    auto-complete="off"
                                    v-model="rechargeData.price4"
                                >
                                    <template slot="append">FOF</template>
                                </el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="2" :span="20">
                <div class="explain">
                    <longhudou-rule></longhudou-rule>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import longhudouRule from "./longhudouRule"

    import contract from '../../../contracts/longhudou/playGame.json'
    import sol from '../../../contracts/longhudou/playGame.sol'

    export default {
        name: "longhudouConfig",
        components: {
            longhudouRule,
        },
        data() {
            return {
                rechargeData: {
                    value: '10',
                    gasPrice: '41',
                    gas: '21000',
                    price1: '1',
                    price2: '5',
                    price3: '10',
                    price4: '20',
                },
            }
        },
        methods: {
            deploy() {
                let user = this.$store.state.address
                return new Promise((resolve, reject) => {
                    let result = this.verifyData()
                    if (result.message) {
                        reject(result)
                        return
                    }
                    try {
                        this.$store.commit('setCryptPercent', {percent: true, text: '创建中···'})
                        this.$funs.unlockAccount().then((res) => {
                            let type = "1" //龙虎斗
                            let args = [
                                Number(this.rechargeData.price1),
                                Number(this.rechargeData.price2),
                                Number(this.rechargeData.price3),
                                Number(this.rechargeData.price4),
                                Number(type),
                            ];
                            this.$funs.magrationContract(type, user, contract, sol, args)
                                .then((contractIns) => {
                                    this.$store.commit('setCryptPercent', {percent: true, text: '创建成功！正在充值···'})
                                    // 每次部署完合约，需要向定时器合约中注册当前合约地址
                                    contractIns.methods.registerInterval('0xaF48fe613515BEB3467C9E24F894C83439E26C51')
                                        .send({
                                            from: user,
                                            gas: 4712388,
                                            txType: 0,
                                        })
                                        .on('error', (err) => {
                                            this.$store.commit('setCryptPercent', {percent: false, text: ''})
                                            this.$message.error(err.message)
                                            reject(err)
                                        })
                                        .on('receipt', (receipt) => {
                                            this.$funs.uploadTxData("1", receipt);
                                            this.$funs.rechargeToContract(contractIns, user, this.rechargeData.value)
                                                .then((data) => {
                                                    contractIns.contractAddressUrl = `http://39.104.81.103:8891/?${contractIns._address}`
                                                    resolve(contractIns)
                                                })
                                        })
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
                if (isNaN(this.rechargeData.value) || this.rechargeData.value === '' || Number(this.rechargeData.value) === 0) {
                    return new Error('请输入正确的充值金额！');
                }
                let reg = /^\d*.\d{0,9}$/g
                if (!reg.test(this.rechargeData.value)) {
                    return new Error('充值数额小数点后不能超过9位！');
                }
                if (balance < (Number(this.rechargeData.value) + 1)) {
                    return new Error('余额不足以支付充值金额！');
                }
                // if (isNaN(this.rechargeData.gasPrice)) {
                //     return new Error('请输入正确的gasPrice！');
                // }
                // if (this.rechargeData.gasPrice === '' || Number(this.rechargeData.gasPrice) === 0) {
                //     return new Error('gasPrice不能为空和不能为0！');
                // }
                if (isNaN(this.rechargeData.price1)
                    || isNaN(this.rechargeData.price2)
                    || isNaN(this.rechargeData.price3)) {
                    return new Error('请设置正确的下注金额！');
                }
                if (this.rechargeData.price1.trim() === ''
                    || this.rechargeData.price2.trim() === ''
                    || this.rechargeData.price3.trim() === ''
                    || Number(this.rechargeData.price1) === 0
                    || Number(this.rechargeData.price2) === 0
                    || Number(this.rechargeData.price3) === 0) {
                    return new Error('下注金额不能为空和不能为0！');
                }
                if (this.rechargeData.price1.length > 2
                    || this.rechargeData.price2.length > 2
                    || this.rechargeData.price3.length > 2) {
                    return new Error('每个下注金额不能大于99！');
                }
                return true
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/gameConfig";
</style>
