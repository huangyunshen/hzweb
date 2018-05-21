<template>
    <div>
        <unlock-account ref="unlock" isTranc="no"></unlock-account>

        <el-button class="el-wallet-main-button mt-50" @click="importAccount">导入钱包</el-button>

        <p class="wallet-safety">Fof.com不会保留您的私钥。我们无法访问帐户，恢复密钥，重置密码，也无法撤销交易。保护您的密钥并检查您的网址是否正确。</p>
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
            importAccount() {
                this.$refs.unlock.importAccount().then((wallet) => {
                    if (typeof wallet === 'object') {
                        let obj = this.$funs.getLocalAddress()
                        let addresses = obj ? obj.addresses : []
                        let index = addresses.indexOf(wallet.address)
                        if(index === -1){
                            index = obj ? addresses.length : 0
                            addresses.push(wallet.address)
                        }
                        obj={active:index,addresses:addresses}
                        this.$funs.setLocalAddress(obj)

                        this.$funs.linkToMainScreenRep({
                            privateKey: wallet.privateKey ? wallet.privateKey.replace('0x', '') : '',
                            mnemonic: wallet.mnemonic ? wallet.mnemonic : ''
                        })
                    }
                }, (err) => {  });
            }
        }
    }
</script>

<style scoped lang="scss" type="text/scss">

    .wallet-safety {
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        color: #8a9df0;
        position: absolute;
        bottom: 20px;
    }
</style>
