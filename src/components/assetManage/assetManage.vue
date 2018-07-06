<template>
    <div class="asset-manage">
        <div class="tranc-header no-select-text">
            <p :class="{'header-active':choose==='1'}" @click="choose='1'"><span>交易记录</span></p>
            <b></b>
            <p :class="{'header-active':choose==='2'}" @click="choose='2'"><span>对外转账</span></p>
        </div>
        <transition name="fof-fade">
            <div v-show="choose==='1'" class="asset-content">
                <trade-record></trade-record>
            </div>
        </transition>
        <transition name="fof-fade">
            <div v-show="choose==='2'" class="asset-content">
                <transaction></transaction>
            </div>
        </transition>
    </div>
</template>

<script>
    import tradeRecord from "../tradeRecord/tradeRecord"
    import transaction from "../transaction/transaction"

    export default {
        name: "asset-manage",
        data() {
            return {
                choose: '1'
            }
        },
        components: {
            tradeRecord,
            transaction
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .asset-manage {
        height: 80%;
    }

    .tranc-header {
        display: flex;
        text-align: center;
        /*width: 50%;*/
        p {
            flex-grow: 1;
            line-height: 70px;
            background-color: #221D44;
            box-shadow: 1px 0 0 0 #272345;
            font-size: 20px;
            color: #d3ceff;
            cursor: pointer;
        }
        .header-active {
            line-height: 68px;
            border-bottom-style: solid;
            border-bottom-width: 2px;
            border-image-source: linear-gradient(105deg,
                    #3410f7 0%,
                    #711bdc 59%,
                    #ad25c0 100%);
            border-image-slice: 1;
            background-color: #3a346a;
        }
        b {
            display: inline-block;
            height: 70px;
            border-right: 2px solid #272345;
        }
    }

    .asset-content {
        border: 1px solid #322D5D;
        height: 100%;
    }
</style>
