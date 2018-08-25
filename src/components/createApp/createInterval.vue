<template>
    <div>
        <el-form label-position="top" label-width="80px">
            <el-form-item :label="$t('accountaddress01')">
                <el-input v-model="from" readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('timer')">
                <el-input v-model="intervalAddr"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="deploy">{{$t('timercontract')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import longhudou_interval from '../../../contracts/longhudou/Interval.json'

    export default {
        name: "create-interval",
        data(){
            return {
                intervalAddr: '',
                from: ''
            }
        },
        methods: {
            deploy() {
                this.$web3.eth.personal.unlockAccount('0xB98D0CDf093D52618d2DEA0FF564470A7b031B7A', 'hz123456', (error, res) => {
                    if(res){
                        this.$web3.eth.estimateGas({data: longhudou_interval.bytecode}).then((gas) => {
                            new this.$web3.eth.Contract(longhudou_interval.abi)
                                .deploy({
                                    // 传入设置的下注金额和类型(1 代表是龙虎斗)
                                    data: longhudou_interval.bytecode,
                                })
                                .send({
                                    from: this.from,
                                    gas: gas * 2,
                                    txType: 0,
                                })
                                .on('error', (err) => {
                                    this.$store.commit('setCryptPercent', {percent: false, text: ''})
                                    this.$message.error(String(err))
                                })
                                .on('receipt', (receipt) => {
                                })
                                .then((newContractInstance) => {
                                    this.$message.success(this.$t('createsuccess01'))
                                    console.log(newContractInstance.options.address)
                                    this.intervalAddr = newContractInstance.options.address
                                })
                        })
                    } else {
                        console.log(error)
                        this.$message.error(error.message)
                    }
                })
            },
            getAddress(){
                this.from = this.address
            }
        },
        computed: {
            address() {
                return this.$store.state.address
            }
        },
        mounted(){
            this.from = this.address
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>

</style>