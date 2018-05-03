<template>
    <div>
        <el-form label-position="right" label-width="150px">
            <el-form-item label="账户余额">
                <el-input v-model="balanceCom" readonly>
                    <template slot="append">ETH</template>
                </el-input>
            </el-form-item>
            <el-form-item label="账户地址">
                <el-input v-model="address" readonly></el-input>
            </el-form-item>
            <el-form-item label="私钥（未加密）">
                <el-input :type="privateType" v-model="privateKey" readonly>
                    <el-button slot="append" @click="privateTypeFun" icon="el-icon-view">查看</el-button>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">打印纸钱包</el-button>
            </el-form-item>
            <div class="qr-content">
                <p class="qr-title">账户地址</p>
                <div class="qr-body">
                    <vue-qr :text="address"></vue-qr>
                </div>
            </div>
            <div class="qr-content">
                <p class="qr-title">私钥（未加密）</p>
                <div class="qr-body">
                    <vue-qr :text="privateKey"></vue-qr>
                </div>
            </div>
        </el-form>

    </div>
</template>

<script>
    import VueQr from 'vue-qr'

    export default {
        name: "balance",
        data() {
            return {
                balance: 0,
                address: '',
                privateKey:'',
                privateType:'password'
            }
        },
        computed: {
            balanceCom() {
                return this.$web3.fromWei(this.balance, 'ether')
            }
        },
        methods:{
            privateTypeFun(){
                this.privateType = this.privateType==='password'?'text':'password'
            }
        },
        mounted() {
            this.address = this.$store.state.publicKey
            this.privateKey = this.$store.state.privateKey
            if(this.address !== ''){
                this.balance = this.$web3.eth.getBalance(this.address).toJSON()
            }
        },
        components:{
            VueQr
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .el-form {
        width: 60%;
        margin: 2% auto;
        .el-button{
            width:100%;
        }
        .qr-content{
            width:50%;
            min-width:200px;
            margin-top:30px;
            box-sizing: border-box;
            float:left;
            text-align: center;
        }
    }
</style>
