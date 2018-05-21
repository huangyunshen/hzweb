<template>
    <div id="app"
         v-loading="cryptPercent.percent"
         :element-loading-text="cryptPercent.text"
         element-loading-spinner="el-icon-loading">

        <img src="./assets/images/logo.png" class="logoImg"></img>

        <router-view name="default"></router-view>

        <!--<el-col :span="8" style="padding-top: 41px;color: white">-->
            <!--Gas 价格： {{ gasPrice }} Gwei-->
        <!--</el-col>-->
        <!--<el-col :span="8" style="padding-top: 30px">-->
            <!--<el-slider v-model="gasPrice" :min="1" :max="99" @change="gasPriceChange"></el-slider>-->
        <!--</el-col>-->
    </div>
</template>

<script>

    export default {
        name: 'App',
        data() {
            return {
                // gasPrice: 41,
                cryptPercent:null
            }
        },
        methods: {
            // gasPriceChange(val) {
            //     this.$store.commit('setGasPrice', val)
            // },
        },
        beforeMount() {

            // this.$store.state.publicKey = '0x1d278e1419bd697cabf772f7ed05160731fdb26b'
            // this.$store.state.privateKey = '8888888888888888888888888888888888888888888888888888888888888888'
            // this.$router.replace('/mainScreen')

            // if (this.$store.state.publicKey === '' || this.$store.state.privateKey === '') {
            //     this.$router.replace('/')
            // }

            this.cryptPercent = this.$store.state.cryptPercent
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import "assets/scss/global";
</style>
