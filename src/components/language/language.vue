<template>
    <el-select class="language-style" v-model="value" size="mini" @change="changeLang">
        <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.title"
                :value="item.label"
        ></el-option>
    </el-select>
</template>

<script>
    export default {
        name: "language",
        data() {
            return {
                value: 'zh-CN',
                options: [
                    {title: '中文', label: 'zh-CN'},
                    {title: 'English', label: 'en-US'},
                ]
            }
        },
        methods: {
            changeLang(val) {
                this.$i18n.locale = val;
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-select{
        width: 90px;
    }
</style>
