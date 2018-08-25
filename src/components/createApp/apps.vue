<template>
    <div class="apps no-select-text">
        <div class="icon" :class="{active:isSelected}">
            <img :src="item.gameType | getUrl">
            <i :class="{selected:isSelected}"></i>
        </div>
        <div class="title">
            <p>{{title}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "apps",
        props: ["item", "index"],
        data() {
            return {
                isSelected: false,
                title:'',
            };
        },
        methods: {
            selectApp(i) {
                if (i === this.index) {
                    this.isSelected = true;
                } else {
                    this.isSelected = false;
                }
            }
        },
        filters:{
            getUrl(type) {
                switch (type) {
                    case "0":
                        return require("../../assets/images/myApps/add.png");
                    case "1":
                        return require("../../assets/images/apps/longhudou.jpg");
                    case "2":
                        return require("../../assets/images/apps/ssjc.png");
                    case "3":
                        return require("../../assets/images/apps/baijiale.png");
                    case "4":
                        return require("../../assets/images/apps/game_icon8.png");
                }
            }
        },
        created() {
            if (this.item.contractName) {
                this.title = this.item.contractName;
            } else {
                switch (this.item.gameType) {
                    case "0":
                        this.title = this.$t("createapplications");
                        break;
                    case "1":
                        this.title = this.$t("dragonandtiger");
                        break;
                    case "2":
                        this.title = this.$t("competitionguessing");
                        break;
                    case "3":
                        this.title = this.$t("baccarat");
                        break;
                    case "4":
                        this.title = this.$t("p11c5");
                        break;
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .apps {
        margin: 20px 15px;
        text-align: center;
        .icon {
            position: relative;
            max-width: 160px;
            max-height: 160px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            margin: 0 auto;
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
        .icon:hover,
        .active {
            border-style: solid;
            border-width: 4px;
            border-image-source: linear-gradient(-16deg, #5696ff 0%, #eb60ff 100%);
            border-image-slice: 1;
        }
        .title {
            margin-top: 20px;
            font-size: 17px;
            color: #8490c5;
            p {
                white-space: nowrap;
            }
        }
    }
</style>
