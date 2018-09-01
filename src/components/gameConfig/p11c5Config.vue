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

                            <el-form-item class="el-wallet-style" :label="$t('gamename')">
                                <el-input
                                    auto-complete="off"
                                    v-model="name"
                                    maxlength="15"
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

                            <el-form-item class="el-wallet-style" :label="$t('poolamount')">
                                <el-input
                                    auto-complete="off"
                                    v-model="value"
                                    maxlength="15"
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

                            <el-form-item class="el-wallet-style" :label="$t('limit')">
                                <el-input
                                    auto-complete="off"
                                    v-model="limit"
                                    maxlength="15"
                                >
                                </el-input>
                            </el-form-item>

                        </el-form>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="2" :span="20">
                <div class="explain">
                    <p11c5-rule></p11c5-rule>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import p11c5Rule from "./p11c5Rule"
    import contract from '../../../contracts/p11c5/P11C5.json'
    // import sol from '../../../contracts/p11c5/P11C5.sol'
    let sol = ''

    export default {
        name: "longhudouConfig",
        components: {
            p11c5Rule,
        },
        data() {
            return {
                name:"" ,
                value:"" ,
                limit:"2" ,
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
                        this.$store.commit('setCryptPercent', {percent: true, text:this.$t('creation')})
                        // this.$funs.unlockAccount().then((res) => {
                            let args = [
                                Number(this.limit),
                                String(this.name) || this.$t('p11c5'),
                            ];
                            this.$web3.eth.estimateGas({data: contract.bytecode}).then((gas) => {
                                gas = gas + 100000
                                this.$funs.magrationContract(user, contract, sol, args, gas)
                                    .then((contractIns) => {
                                        this.$store.commit('setCryptPercent', {percent: true, text: this.$t('createsuccessrecharge')})
                                        this.$funs.rechargeToContract(contractIns, user, this.value)
                                            .then((data) => {
                                                contractIns.contractAddressUrl = `/p11c5/?${contractIns._address}`
                                                resolve(contractIns)
                                            })
                                    })
                            })
                        // }).catch((reason) => {
                        //     reject(reason)
                        // })
                    } catch (err) {
                        reject(err)
                    }
                })
            },
            verifyData() {
                let balance = Number(this.$store.state.balance)
                if (isNaN(this.value) || this.value === '' || Number(this.value) === 0) {
                    return new Error(this.$t('pleaseenterthecorrectamountofrecharge'));
                }
                let reg = /^\d*.\d{0,9}$/g
                if (!reg.test(this.value)) {
                    return new Error(this.$t('theamountoftherechargecannotexceed9bits'));
                }
                if (balance < (Number(this.value) + 1)) {
                    return new Error(this.$t('creditisrunninglow'));
                }
                if (isNaN(this.limit) || this.limit === '' || Number(this.limit) === 0) {
                    return new Error(this.$t('theamountofthebetcannotbeemptyandcannotbe0'));
                }
                reg = /\./g
                if (reg.test(this.limit)) {
                    return new Error(this.$t('limitCantHaveDecimals'));
                }
                return true
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/gameConfig";
</style>
