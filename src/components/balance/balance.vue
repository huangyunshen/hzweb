<template>
    <div>
        <el-form label-position="right" label-width="100px" >
            <el-form-item label="账户余额">
                <el-input v-model="balanceCom" readonly>
                    <i class="el-icon-question" slot="prefix"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="账户地址">
                <el-input v-model="address" readonly></el-input>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    export default {
        name: "balance",
        data(){
            return {
                balance:0,
                address:''
            }
        },
        computed:{
            balanceCom(){
                let b = this.$web3.fromWei(this.balance,'ether')
                return b + ' ' + 'ETH'
            }
        },
        beforeMount(){
            this.address = sessionStorage.getItem('publicKey')
            this.balance = this.$web3.eth.getBalance(this.address)
            console.log(this.balance);
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .el-form{
        width:60%;
        margin:2% auto;
        .el-input i{
        }
    }
</style>
