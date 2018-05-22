<template>
    <div class="apps no-select-text">
        <div class="icon" :class="{active:isSelected}">
            <img :src="item.imgUrl">
            <i :class="{selected:isSelected}"></i>
        </div>
        <div class="title">
            <p>{{item.title}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "apps",
        props: ['item', 'index'],
        data() {
            return {
                isSelected: false
            }
        },
        methods: {
            selectApp(i) {
                if (i === this.index) {
                    this.isSelected = true
                } else {
                    this.isSelected = false
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .apps {
        margin: 20px 30px;
        .icon {
            position: relative;
            box-shadow: 0 6px 24px 0 rgba(11, 6, 27, 0.45);
            img {
                width: 100%;
            }
            .selected {
                width: 50px;
                height: 48px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: url("../../assets/images/apps/icon_cjyy_xz.png") no-repeat;
            }
        }
        .icon:hover,.active {
            border-style: solid;
            border-width: 4px;
            border-image-source: linear-gradient(-16deg,
                    #5696ff 0%,
                    #eb60ff 100%);
            border-image-slice: 1;
        }
        .title {
            margin-top: 20px;
            font-size: 17px;
            color: #8490c5;
        }
    }

</style>