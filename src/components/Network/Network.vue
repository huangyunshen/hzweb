<template>
    <el-select class="language-style" v-model="network" size="mini" @change="changeLang">
        <el-option
            v-for="(item,index) in netList"
            :key="index"
            :label="item.title"
            :value="item.url"
        ></el-option>
    </el-select>
</template>

<script>
    export default {
        name: "Network",
        data() {
            return {
                oldNet:'',
                network: '',
                netList: [
                    {title: 'A1', url: 'ws://39.108.159.230:8581'},
                    {title: 'A2', url: 'ws://39.108.159.230:8582'},
                    {title: 'B1', url: 'ws://120.79.182.14:8581'},
                    {title: 'B2', url: 'ws://120.79.182.14:8582'},
                    {title: 'C1', url: 'ws://39.108.231.134:8581'},
                    {title: 'C2', url: 'ws://39.108.231.134:8582'},
                    {title: 'D1', url: 'ws://112.74.175.96:8581'},
                    {title: 'D2', url: 'ws://112.74.175.96:8582'},
                    {title: 'E1', url: 'ws://39.108.93.202:8581'},
                    {title: 'E2', url: 'ws://39.108.93.202:8582'},
                    {title: 'F1', url: 'ws://47.106.160.141:8581'},
                    {title: 'F2', url: 'ws://47.106.160.141:8582'},
                    {title: 'G1', url: 'ws://120.78.157.63:8581'},
                    {title: 'G2', url: 'ws://120.78.157.63:8582'},
                ]
            }
        },
        methods: {
            changeLang(net) {

                if(this.oldNet !== this.network) {
                    this.$store.commit('setCryptPercent', {
                            percent: true,
                            text: this.$t('switchingNet')
                        }
                    )

                    this.$web3.setProvider(net)
                    setTimeout(() => {
                        this.$web3.eth.getBlock('latest', (err, data) => {

                            if (err) {  //在七次重连后如果仍旧连接不上，则切换回原网络
                                setTimeout(() => {
                                    this.$web3.eth.getBlock('latest', (err, data) => {
                                        if (err) {
                                            this.$store.commit('setCryptPercent', {percent: false, text: ''})
                                            this.$web3.setProvider(this.oldNet)
                                            this.network = this.oldNet
                                        }
                                        if (data) {
                                            this.oldNet = net
                                            this.$store.commit('setCryptPercent', {percent: false, text: ''})
                                            localStorage.setItem('network', net)
                                        }
                                    })
                                }, 7000)
                            }

                            if (data) {
                                this.oldNet = net
                                this.$store.commit('setCryptPercent', {percent: false, text: ''})
                                localStorage.setItem('network', net)
                            }
                        })
                    }, 500)
                }
            }

        },
        created() {
            this.network = this.oldNet =  localStorage.getItem('network') || this.netList[1].url
        }
    }
</script>

<style lang="scss" scoped>
    .el-select {
        width: 120px;
    }
</style>
