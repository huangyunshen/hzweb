<template>
    <div id="app">
        <el-container>
            <el-header height="100px">
                <span class='header-title'>汇尊区块链</span>
                <el-row :gutter="20" class="fr" style="width: 500px">
                    <el-col :span="8" style="padding-top: 41px;color: white">
                        Gas 价格： {{ gasPrice }} Gwei
                    </el-col>
                    <el-col :span="8" style="padding-top: 30px">
                        <el-slider v-model="gasPrice" :min="1" :max="99" @change="gasPriceChange"></el-slider>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="value">
                            <el-option
                                    v-for="(item,index) in options"
                                    :key="index"
                                    :label="item.title"
                                    :value="item.label"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-header>
            <el-main v-loading="cryptPercent.percent" :element-loading-text="cryptPercent.text" element-loading-spinner="el-icon-loading">
                <router-view name="default"></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                value: 'ch',
                options: [
                    {title: '中文', label: 'ch'},
                    {title: 'English', label: 'en'}
                ],
                gasPrice: 41,
                s:true,
                cryptPercent:null
            }
        },
        methods: {
            gasPriceChange(val) {
                this.$store.commit('setGasPrice', val)
            },
        },
        beforeMount() {
            if (this.$store.state.publicKey === '' || this.$store.state.privateKey === '') {
                this.$router.replace('/')
            }
            this.cryptPercent = this.$store.state.cryptPercent
        },
        mounted(){

        }
    }
</script>

<style lang="scss" type="text/scss">
    @import "assets/css/global";
</style>
