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
                    {title: 'Network1', url: 'ws://39.108.159.230:8561'},
                    {title: 'Network2', url: 'ws://120.79.182.14:8561'},
                    {title: 'Network3', url: 'ws://39.108.231.134:8561'},
                    {title: 'Network4', url: 'ws://112.74.175.96:8561'},
                    {title: 'Network5', url: 'ws://39.108.93.202:8561'},
                    {title: 'Network6', url: 'ws://47.106.160.141:8561'},
                    {title: 'Network7', url: 'ws://120.78.157.63:8561'},
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
                                            $uploadUrl = net.replace('ws', 'http').substring(0, net.length-2) + "8551"
                                        }
                                    })
                                }, 7000)
                            }

                            if (data) {
                                this.oldNet = net
                                this.$store.commit('setCryptPercent', {percent: false, text: ''})
                                localStorage.setItem('network', net)
                                $uploadUrl = net.replace('ws', 'http').substring(0, net.length-2) + "8551"
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
