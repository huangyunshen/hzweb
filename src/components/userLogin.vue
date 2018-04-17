<template>
  <div v-show="!toggle">
      <el-form
        label-width="100px"
        status-icon
        @submit.native.prevent>

        <el-form-item label="登录方式">
         <el-radio-group v-model="form.checkType">
           <el-radio label="1">私钥</el-radio>
           <el-radio label="2">Keystore / JSON File</el-radio>
           <el-radio label="3">Mnemonic Phrase</el-radio>
         </el-radio-group>
        </el-form-item>
        <el-form-item label="私钥">
          <el-input
            type="password"
            placeholder="请输入私钥"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
  export default {
    name: "userLogin",
    props:['toggle'],
    data(){

      return {
        form:{
          checkType:'1'
        }
      }
    },
    methods:{

    }
  }
</script>

<style scoped>

</style>
