<template>
  <div v-show="!toggle">
      <el-form
        label-width="100px"
        status-icon
        @submit.native.prevent>

        <el-form-item label="登录方式">
         <el-radio-group v-model="form.checkType">
           <el-radio label="1" border>私钥</el-radio>
           <el-radio label="2" border>Keystore / JSON File</el-radio>
           <el-radio label="3" border>Mnemonic Phrase</el-radio>
         </el-radio-group>
        </el-form-item>

        <div v-show="form.checkType==='1'?true:false">
          <el-form-item label="私钥">
            <el-input
              type="password"
              placeholder="请输入私钥"
              auto-complete="off"
              clearable
            ></el-input>
          </el-form-item>
        </div>

        <div v-show="form.checkType==='2'?true:false">
          <el-form-item>
            <el-upload
              action="http://localhost"
              :limit="1"
              :file-list="fileList">
              <el-button :type="uploadFileBtnType">选择钱包文件</el-button>
              <span slot="tip" class="fileUploadTip">请选择正确的钱包文件，且不超过2Mb</span>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-input
              v-if="jsonFileChecked"
              type="password"
              placeholder="已验证钱包文件，请输入密码"
              auto-complete="off"
              clearable
            ></el-input>
          </el-form-item>
        </div>

        <div v-show="form.checkType==='3'?true:false">
          <el-form-item label="助记词">
            <el-input
              type="textarea"
              :autosize="{minRows:5,maxRows:10}"
              placeholder="请输入助记词"
            ></el-input>
          </el-form-item>

          <el-form-item label="密码（可选）">
            <el-input
              v-if="jsonFileChecked"
              type="password"
              placeholder="已验证钱包文件，请输入密码"
              auto-complete="off"
              clearable
            ></el-input>
          </el-form-item>
        </div>

        <el-form-item>

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
        jsonFileChecked:true,
        form:{
          checkType:'2'
        },
        uploadFileBtnType:'default',
        fileList:[]
      }
    },
    methods:{

    }
  }
</script>

<style scoped>
  .fileUploadTip{
    display: inline-block;
    margin-left:30px;
    color: #93D3C4;
  }
</style>
