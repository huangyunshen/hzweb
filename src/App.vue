<template>
    <div id="app"
         v-loading="$store.state.cryptPercent.percent"
         :element-loading-text="$store.state.cryptPercent.text"
         element-loading-custom-class="full-loading"
         @click.capture="isActive($event)"
    >

        <img src="./assets/images/logo.png" class="logoImg"></img>
        <transition name="fof-fade">
            <router-view name="default" @lockOut="lockOutApp"></router-view>
        </transition>

        <div class="create-wallet">
            <el-dialog class="create-wallet-dialog"
                       :title="$t('walletIsLocked')"
                       :visible.sync="lockModal"
                       :show-close="false"
                       :close-on-click-modal="false"
                       :close-on-press-escape="false"
                       width="400px"
                       top="30vh"
                       center>

                <el-input v-model="pwd" type="password"></el-input>
                <div class="mt-40 tc">
                    <el-button type="primary" @click="unlockWallet" v-show="unlocking">确定</el-button>
                    <span v-if="!unlocking" style="line-height: 40px; font-size: 20px; animation: toggleShowHide 2s linear infinite;">正在解锁 . . . </span>
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
                pwd: '111111111',
                unlocking: true,
            }
        },
        methods: {
            lockOutApp() {
                this.lockWallet()
            },
            isActive(e) {
                if (!this.lockModal) {
                    this.timeRemaining = this.duration
                }
            },
            unlockWallet() {
                this.unlocking = false;
                setTimeout(() => {
                    let promise = this.$funs.verifyWalletPwd(this.pwd);
                    promise.then((wallet) => {
                        this.$funs.loadActivWallet()
                        this.lockModal = false
                        this.countDown()
                        this.unlocking = true;
                        this.$web3.eth.accounts.wallet.myPwd = this.pwd;
                    }, (err) => {
                        this.$message({
                            message: this.$msg.unlockFailByPwd,
                            type: 'error'
                        });
                        this.unlocking = true;
                    })
                }, 50);
            },
            countDown() {
                clearInterval(this.timer)
                this.timeRemaining = this.duration

                this.timer = setInterval(() => {
                    this.timeRemaining -= 1
                    if (this.timeRemaining === 0) {
                        clearInterval(this.timer)
                        this.lockWallet()
                    }
                }, 1000)
            },
            lockWallet() {
                this.$web3.eth.accounts.wallet.clear().myPwd = null
                this.lockModal = true
                this.$store.commit('setLock', true)
                this.$store.commit('setBalance', 0)
                this.$store.commit('setAddress', '')
            }
        },
        mounted() {
            let wallet = this.$funs.ifWalletExist()
            if (!wallet) {
                this.lockModal = false
            } else {
                if (this.$route.name === 'createWallet' || this.$route.name === 'importWallet') {
                    this.$router.replace({name: 'assetManage'})
                }
            }
            if (wallet && !this.$store.state.isLock) {
                this.countDown()
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import "assets/scss/global";
</style>
