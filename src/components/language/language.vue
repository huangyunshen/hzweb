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
                value: 'zhcn',
                options: [
                    {title: '中文-简体', label: 'zhcn'},
                    {title: '中文-繁體', label: 'zhtw'},
                    {title: 'English', label: 'en'},
                ]
            }
        },
        methods: {
            changeLang(val) {
                this.$i18n.locale = val;
                localStorage.setItem('language', val)
            }
        },
        created() {
            this.value = localStorage.getItem('language') || 'zhcn'
        }
    }
</script>

<style scoped lang="scss">
    .el-select{
        width: 100px;
    }
</style>
