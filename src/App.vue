<template>
    <div id="app"
         v-loading="$store.state.cryptPercent.percent"
         :element-loading-text="$store.state.cryptPercent.text"
         element-loading-custom-class="full-loading"
         @click.capture="isActive($event)"
    >

        <img src="./assets/images/logo.png" class="logoImg"></img>
        <transition name="fof-fade">
            <router-view name="default"></router-view>
        </transition>

        <div class="create-wallet">
            <el-dialog class="create-wallet-dialog"
                       title="钱包已锁定！请输入密码！"
                       :visible.sync="lockModal"
                       :show-close="false"
                       :close-on-click-modal="false"
                       :close-on-press-escape="false"
                       width="400px"
                       top="30vh"
                       center>

                <el-input v-model="pwd" type="password"></el-input>
                <div class="mt-40 tc">
                    <el-button type="primary" @click="unlockWallet">确定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'App',
        data() {
            return {
                timer: null,    //定时器
                timeRemaining: 0,   //倒计时时间
                duration: 1800,       //多久后锁定（s）
                lockModal: true,
                pwd: '111111111'
            }
        },
        methods: {
            isActive(e) {
                if (!this.lockModal) {
                    this.timeRemaining = this.duration
                }
            },
            unlockWallet() {
                try {
                    this.$funs.loadWallet(this.pwd)
                    this.$funs.loadActivWallet()
                    this.lockModal = false
                    this.countDown()
                } catch (error) {
                    this.$message({
                        message: this.$msg.unlockFailByPwd,
                        type: 'error'
                    })
                }
            },
            countDown() {
                clearInterval(this.timer)
                this.timeRemaining = this.duration

                this.timer = setInterval(() => {
                    this.timeRemaining -= 1
                    if (this.timeRemaining === 0) {
                        this.$web3.eth.accounts.wallet.clear()
                        clearInterval(this.timer)
                        this.lockModal = true
                        this.$store.commit('setLock', true)
                    }
                }, 1000)
            }
        },
        mounted() {
            if (!this.$funs.ifWalletExist()) {
                this.lockModal = false
            } else {
                if(this.$route.name==='createWallet' || this.$route.name==='importWallet'){
                    this.$router.replace({name: 'accountInfo'})
                }
            }
            if (this.$funs.ifWalletExist() && !this.$store.state.isLock) {
                this.countDown()
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import "assets/scss/global";
</style>
