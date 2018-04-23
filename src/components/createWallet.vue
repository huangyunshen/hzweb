<template>
  <el-row>
    <el-col :xs="24" :sm="{span:20,offset:2}" :md="{span:16,offset:4}" :lg="{span:12,offset:6}"
            :xl="{span:10,offset:7}">
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

      <user-login :formGroupToggle="formGroupToggle"></user-login>

      <el-form label-width="100px" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" @click="createOrLogin">{{mainBtnText}}</el-button>
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
    components: {
      userLogin
    },
    data() {
      return {
        formGroupToggle: true,    //创建或者登录面板
        mainBtnText: '创建钱包',
        lastBtnText: '转到登录',
        formRulesCreate: {       //创建钱包的数据绑定对象
          pwd: ''
        },
        rulesCreate: {         //创建钱包的校验对象
          pwd: [
            {validator: this.validatePwd, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      validatePwd(rule, value, callback) {     //验证创建钱包的密码强度
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)\w{8,}$/g;
        if (value) {
          if (!reg.test(value)) {
            return callback(new Error('密码应大于8位同时包含数字和字母'));
          } else {
            return callback();
          }
        }
      },
      formGroupToggleFun() {     //切换创建和登录
        if (this.formGroupToggle) {
          this.mainBtnText = '登录钱包';
          this.lastBtnText = '转到创建';
        } else {
          this.mainBtnText = '创建钱包';
          this.lastBtnText = '转到登录';
        }
        this.formGroupToggle = !this.formGroupToggle;
      },
      createOrLogin(e) {     //点击创建钱包或者登录
        if (this.formGroupToggle === true) {
          if (this.formRulesCreate.pwd && this.validatePwd(null, this.formRulesCreate.pwd, () => {
              return true;
            })) {
            let key = this.web3.personal.newAccount(this.formRulesCreate.pwd);
            console.log(key);
            this.$router.replace({path: '/listContent'});    //创建/登录成功后跳转到功能列表
          } else {
            this.$message({
              type: 'error',
              showClose: true,
              message: '密码应大于8位同时包含数字和字母'
            })
          }
        }


      }
    },
    beforeCreate() {

    },
    created() {

    },
    beforeMount() {

    },
    mounted() {

    }
  }
</script>

<style scoped>
  .el-row {
    margin-top: 100px;
  }

  .el-form-item:last-child {
    text-align: center;
  }
</style>
