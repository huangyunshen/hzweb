<template>
    <div>
        <unlock-account ref="unlock" isTranc="no"></unlock-account>

        <el-button class="el-wallet-main-button mt-50" @click="importWallet">导入钱包</el-button>
        <p class="tr create-wallet"><router-link tag="a" @click.native="createWallet" :to="{name:'createWallet'}">创建钱包</router-link></p>
        <p class="wallet-safety">fof.com不会保留您的私钥。我们无法访问帐户，恢复密钥，重置密码，也无法撤销交易。保护您的密钥并检查您的网址是否正确。</p>
    </div>
</template>

<script>
    import unlockAccount from './unlockAccount';

    export default {
        name: "importWallet",
        components: {
            unlockAccount
        },
        data() {
            return {
                address: '',
            }
        },
        methods: {
            importWallet() {
                this.$refs.unlock.importWallet().then(() => {
                    this.$message({
                        message: this.$msg.importSucc,
                        type: 'success'
                    })
                    this.$router.replace({name: 'accountInfo', params: {loadAcc: true}})
                    this.$funs.loadActivWallet()
                }, (err) => {
                });
            },
            createWallet(){
                this.$emit('getTitle', "创建钱包");
            }
        }
    }
</script>

<style scoped lang="scss" type="text/scss">

    .wallet-safety {
        font-size: 16px;
        line-height: 24px;
        text-align: center;
        color: #8a9df0;
        position: absolute;
        bottom: 20px;
    }
    .create-wallet {
        padding: 15px;
        padding-right: 0px;
        position: relative;
        bottom: -30px;
        left: -255px;
        font-size: 24px;
        a{
            color: greenyellow;
            text-decoration: underline;
            &:hover{
                color: #2A9CE7;
            }
        }
    }
</style>
