<template>
    <div class="game-config">
        <el-row>
            <el-col :offset="2" :span="20">
                <el-form
                    label-width="150px"
                    label-position="left"
                    @submit.native.prevent>

                    <el-form-item class="el-wallet-style" :label="$t('settingthenameofthegame01')">
                        <el-row>
                            <el-col :span="6">
                                <el-input
                                    auto-complete="off"
                                    v-model="rechargeData.name"
                                    maxlength="15"
                                >
                                </el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
                <el-form class="mt-40"
                         label-width="150px"
                         label-position="left"
                         @submit.native.prevent>

                    <el-form-item class="el-wallet-style" :label="$t('rechargeofthepool01')">
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
                <el-form class="mt-40"
                         label-width="150px"
                         label-position="left"
                         @submit.native.prevent>

                    <el-form-item class="el-wallet-style" :label="$t('optionalamount01')">
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
                    name: "",
                    value: '100',
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
                        this.$store.commit('setCryptPercent', {percent: true, text: this.$t('creation')})
                        this.$funs.unlockAccount().then((res) => {
                            let args = [
                                Number(this.rechargeData.price1),
                                Number(this.rechargeData.price2),
                                Number(this.rechargeData.price3),
                                Number(this.rechargeData.price4),
                                String(this.rechargeData.name) || this.$t('dragonandtigercombat'),
                            ];
                            this.$funs.magrationContract(user, contract, sol, args)
                                .then((contractIns) => {
                                    this.$store.commit('setCryptPercent', {
                                        percent: true,
                                        text: this.$t('createsuccessrecharge')
                                    })
                                    this.$funs.rechargeToContract(contractIns, user, this.rechargeData.value)
                                        .then((data) => {
                                            contractIns.contractAddressUrl = `/dtfight/?${contractIns._address}`
                                            resolve(contractIns)
                                        })
                                })
                        }).catch((reason) => {
                            reject(reason)
                        })
                    } catch (err) {
                        reject(err)
                    }
                })
            },
            verifyData() {
                let balance = Number(this.$store.state.balance)
                if (isNaN(this.rechargeData.value) || this.rechargeData.value === '' || Number(this.rechargeData.value) === 0) {
                    return new Error(this.$t('enterthecorrectamountofrecharge'));
                }
                let reg = /^\d*.\d{0,9}$/g
                if (!reg.test(this.rechargeData.value)) {
                    return new Error(this.$t('theamountoftherechargecannotexceed9bitsafteradecimalpoint'));
                }
                if (balance < (Number(this.rechargeData.value) + 1)) {
                    return new Error(this.$t('balanceisnotenoughtopay'));
                }
                // if (isNaN(this.rechargeData.gasPrice)) {
                //     return new Error('请输入正确的gasPrice！');
                // }
                // if (this.rechargeData.gasPrice === '' || Number(this.rechargeData.gasPrice) === 0) {
                //     return new Error('gasPrice不能为空和不能为0！');
                // }
                if (isNaN(this.rechargeData.price1)
                    || isNaN(this.rechargeData.price2)
                    || isNaN(this.rechargeData.price3)
                    || isNaN(this.rechargeData.price4)) {
                    return new Error(this.$t('setthecorrectamountofthebet01'));
                }
                if (this.rechargeData.price1.trim() === ''
                    || this.rechargeData.price2.trim() === ''
                    || this.rechargeData.price3.trim() === ''
                    || this.rechargeData.price4.trim() === ''
                    || Number(this.rechargeData.price1) === 0
                    || Number(this.rechargeData.price2) === 0
                    || Number(this.rechargeData.price3) === 0
                    || Number(this.rechargeData.price4) === 0) {
                    return new Error(this.$t('theamountofthebetcannotbeemptyandcannotbe0'));
                }
                if (this.rechargeData.price1.length > 2
                    || this.rechargeData.price2.length > 2
                    || this.rechargeData.price3.length > 2
                    || this.rechargeData.price4.length > 2) {
                    return new Error(this.$t('eachbetcannotbemorethan99'));
                }
                return true
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/gameConfig";
</style>
