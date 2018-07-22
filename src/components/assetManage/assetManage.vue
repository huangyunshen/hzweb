<template>
    <div class="asset-manage">
        <div class="tranc-header no-select-text">
            <p :class="{'header-active':choose==='1'}" @click="choose='1'"><span>交易记录</span></p>
            <b></b>
            <p :class="{'header-active':choose==='2'}" @click="choose='2'"><span>对外转账</span></p>
        </div>
        <transition name="fof-fade">
            <div v-show="choose==='1'" class="asset-content" style="padding: 20px; box-sizing: border-box;">
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
        height: 100%;
    }

    .tranc-header {
        p {
            text-align: center;
            display: inline-block;
            width: 200px;
            line-height: 56px;
            background-color: #221D44;
            font-size: 20px;
            color: #d3ceff;
            cursor: pointer;
            box-sizing: border-box;
            position: relative;
            bottom: -2px;
            z-index: 100;
        }
        .header-active {
            border: 2px solid #322D5D;
            border-bottom-color: #19133C;
            background-color: #19133C;
        }
    }

    .asset-content {
        border: 2px solid #322D5D;
        height: calc(100% - 70px);
    }
</style>
