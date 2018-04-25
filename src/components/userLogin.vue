<template>
  <div v-show="!formGroupToggle">
      <el-form
        label-width="100px"
        status-icon
        @submit.native.prevent>

        <el-form-item label="解锁方式">
         <el-radio-group v-model="form.loginType">
           <el-radio label="1" border>私钥</el-radio>
           <el-radio label="2" border>钱包文件</el-radio>
           <el-radio label="3" border>助记词</el-radio>
           <el-radio label="4" border>公钥地址（临时）</el-radio>
         </el-radio-group>
        </el-form-item>

        <div v-show="form.loginType==='1'?true:false">
          <el-form-item label="私钥">
            <el-input
              type="password"
              placeholder="请输入私钥"
              auto-complete="off"
              clearable
            ></el-input>
          </el-form-item>
        </div>

        <div v-show="form.loginType==='2'?true:false">
          <el-form-item label="选择文件">
            <el-upload
              action="http://localhost"
              :limit="1"
              :file-list="fileList">
              <el-button :type="uploadFileBtnType">选择钱包文件...</el-button>
              <span slot="tip" class="fileUploadTip">请选择正确的钱包文件，且不超过2Mb</span>
            </el-upload>
          </el-form-item>

          <el-form-item label="密码">
            <el-input
              v-if="jsonFileChecked"
              type="password"
              placeholder="已验证钱包文件，请输入密码"
              auto-complete="off"
              clearable
            ></el-input>
          </el-form-item>
        </div>

        <div v-show="form.loginType==='3'?true:false">
          <el-form-item label="助记词">
            <el-input
              type="textarea"
              :autosize="{minRows:5,maxRows:10}"
              placeholder="请输入助记词"
            ></el-input>
          </el-form-item>

          <el-form-item label="密码(可选)">
            <el-input
              type="password"
              placeholder="已验证钱包文件，请输入密码"
              auto-complete="off"
              clearable
            ></el-input>
          </el-form-item>
        </div>

        <div v-show="form.loginType==='4'?true:false">
          <el-form-item label="公钥地址">
            <el-input
              v-model="form.publicKey.key"
              placeholder="请输入公钥地址"
            ></el-input>
          </el-form-item>

          <el-form-item label="密码">
            <el-input
              v-model="form.publicKey.pwd"
              type="password"
              placeholder="请输入密码"
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
    props:['formGroupToggle'],    //创建或者解锁面板
    data(){

      return {
        jsonFileChecked:true,   //JSON文件验证状态
        form:{
          loginType:'4',   //解锁方式,
          privateKey:{key:''},
          keystore:{},
          mnemonicWord:{},
          publicKey:{key:'',pwd:''},
        },
        uploadFileBtnType:'default',    //上传文件按钮颜色，上传后变为success
        fileList:[]   //上传文件列表
      }
    },
    methods:{
      unlockAccount(){
        try {
          let key = this.$web3.personal.unlockAccount(this.form.publicKey.key,this.form.publicKey.pwd)

          if(key===true){
            this.$message({
              type: 'success',
              showClose: true,
              message: this.$msg.unlockSucc
            })
            this.$router.replace({path: '/listContent'})
            sessionStorage.setItem('publicKey',this.form.publicKey.key)
          }

        } catch(e) {
          this.$message({
            type: 'error',
            showClose: true,
            message: this.$msg.unlockFail
          })
        }
      }
    },
    mounted(){

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
