<template>
    <div class="transaction">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-form ref="form" :model="form">
                    <el-form-item label="发送至以下地址：">
                        <el-input v-model="form.to"></el-input>
                    </el-form-item>
                    <el-form-item label="转账数额：">
                        <el-input placeholder="数额" v-model="form.value" class="input-with-select">
                            <el-select v-model="unit" slot="append" placeholder="请选择" style="width: 140px">
                                <el-option label="ETH" value="ETH"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Gas Limit：">
                        <el-input v-model="form.gas" value="21000" placeholder="21000"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">转账</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                <el-form>
                    <el-form-item label="账户地址：">
                        <el-input :value="address" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="账户余额：">
                        <el-input :value="balance + ' ETH'" readonly></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-dialog
                title="提示"
                center
                :visible.sync="dialogVisible"
                width="30%">
            <el-form label-width="80px">
                <el-form-item label="活动名称">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="活动名称">
                    <el-input></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "transaction",
        data() {
            return {
                form: {
                    to: '0x06a45bf0cec0f02e6cb8f0ac6d695a700744d2e4',
                    value: '',
                    gas: '',
                },
                unit: 'ETH',
                address: '',
                balance: 0,
                dialogVisible: false
            }
        },
        methods: {
            onSubmit() {
                if (this.form.to.trim() === '') {
                    this.$message.error(this.$msg.emptyAddress)
                    return
                }
                if (this.form.value.trim() === '') {
                    this.$message.error(this.$msg.emptyValue)
                    return
                }
                this.form.gas = this.form.gas === '' ? 21000 : this.form.gas
                let param = {
                    method: 'eth_sendTransaction',
                    params: [{
                        "from": this.address,
                        "to": this.form.to,
                        "gas": this.$web3.toHex(this.form.gas),
                        "value": this.$web3.toHex(this.form.value),
                    }],
                    id: '1'
                }
                this.dialogVisible = true
                return
                this.$axios(param)
                    .then(function (res) {
                        console.log(res)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        mounted() {
            sessionStorage.setItem('publicKey', '0x06a45bf0cec0f02e6cb8f0ac6d695a700744d2e4')
            this.address = sessionStorage.getItem('publicKey')
            if (this.address) {
                let params = {
                    method: 'eth_getBalance',
                    params: [this.address, "latest"],
                    id: '1'
                }
                this.$axios(params)
                    .then((response) => {
                        if (response.data.result) {
                            this.balance = this.$web3.toDecimal(response.data.result)
                        } else {
                            this.$message.error(this.$msg.emptyResult)
                        }
                    })
                    .catch((error) => {
                        this.$message.error(error)
                    })
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .transaction {
        width: 80%;
        margin: 0 auto;
        .el-select .el-input {
            width: 130px;
        }
    }
</style>