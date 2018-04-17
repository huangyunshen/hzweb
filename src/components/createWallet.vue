<template>
  <el-row>
    <el-col :span="12" :offset="6">
      <el-form
        label-width="100px"
        status-icon
        :rules="rulesCreate"
        :model="formRulesCreate"
        ref="formRulesCreate"
        v-show="formGroupToggle"
        @submit.native.prevent>
        <el-form-item label="创建钱包" prop="pwd">
          <el-input
            type="password"
            v-model="formRulesCreate.pwd"
            placeholder="请输入大于8位同时包含数字和字母的密码"
            auto-complete="off"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>

      <user-login :toggle="formGroupToggle"></user-login>

      <el-form label-width="100px" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary">{{mainBtnText}}</el-button>
          <el-button type="text" size="mini" @click="formGroupToggleFun">{{lastBtnText}}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import userLogin from './userLogin';

  export default {
    name: "createWallet",
    components:{
      userLogin
    },
    data(){
      var validatePwd = (rule, value, callback) => {
        var reg=/^(?![0-9]+$)(?![a-zA-Z]+$)\w{8,}$/g;
        if(!value){
          return callback(new Error('请输入密码'));
        } else {
          if(!reg.test(value)){
            return callback(new Error('密码应大于8位同时包含数字和字母'));
          } else {
            return callback();
          }
        }
      };

      return {
        formGroupToggle:true,
        mainBtnText:'生成钱包',
        lastBtnText:'转到登录',
        formRulesCreate:{
          pwd:''
        },
        rulesCreate:{
          pwd:[
            {validator:validatePwd,trigger:'blur'}
          ]
        }
      }
    },
    methods:{
      formGroupToggleFun(){
        if(this.formGroupToggle){
          this.mainBtnText = '登录钱包';
          this.lastBtnText = '转到创建';
        } else {
          this.mainBtnText = '生成钱包';
          this.lastBtnText = '转到登录';
        }
        this.formGroupToggle = !this.formGroupToggle;
      }
    }
  }
</script>

<style scoped>
  .el-row{
    margin-top:100px;
  }
  .el-form-item:last-child{
    text-align: center;
  }
  /*.el-form-item .el-button{*/
    /*width: 20%;*/
  /*}*/
</style>
