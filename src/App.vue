<template>
    <div id="app">
        <el-container>
            <el-header height="100px">
                <span class='header-title'>汇尊区块链</span>
                <el-select v-model="value">
                    <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item.title"
                            :value="item.label"
                    ></el-option>
                </el-select>
            </el-header>
            <el-main>
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
                ]
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import "assets/css/global";
</style>
