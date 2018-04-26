<template>
  <div>
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
              :placeholder="this.$msg.createPwd"
              auto-complete="off"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>

        <user-login ref="unlock" :formGroupToggle="formGroupToggle"></user-login>

        <el-form label-width="100px" @submit.native.prevent>
          <el-form-item>
            <el-button type="primary" @click="createOrLogin">{{mainBtnText}}</el-button>
            <el-button type="text" size="mini" @click="formGroupToggleFun">{{lastBtnText}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog
      title="创建成功"
      :visible.sync="createDialog"
      width="40%"
      center>

      <el-form :model="modalForm">
        <el-form-item label="公钥地址" :label-width="modalForm.labelWidth">
          <el-input id="publicKey" readonly v-model="modalForm.publicKey">
            <el-button slot="append" @click="copyPublicKey" icon="el-icon-document">复制</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="modalForm.labelWidth">
          <el-input :type="modalForm.showType" readonly v-model="modalForm.pwd">
            <el-button slot="append" @click="toggleShowType" icon="el-icon-view">查看</el-button>
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="unlockNewAccount">请保存好地址及密码，点击解锁</el-button>
      </div>
    </el-dialog>
  </div>
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
        formGroupToggle: true,    //创建或者解锁面板
        createDialog:false,  //创建成功后显示模态框
        mainBtnText: '创建钱包',
        lastBtnText: '转到解锁',
        formRulesCreate: {       //创建钱包的数据绑定对象
          pwd: ''
        },
        rulesCreate: {         //创建钱包的校验对象
          pwd: [
            {validator: this.$verify.validatePwd, trigger: 'blur'}
          ]
        },
        modalForm: {
          publicKey:'',
          pwd:'',
          showType:'password',
          labelWidth: '100px'
        },

      }
    },
    methods: {
      formGroupToggleFun() {     //切换创建和解锁
        if (this.formGroupToggle) {
          this.mainBtnText = '解锁钱包';
          this.lastBtnText = '转到创建';
        } else {
          this.mainBtnText = '创建钱包';
          this.lastBtnText = '转到解锁';
        }
        this.formGroupToggle = !this.formGroupToggle;
      },
      createOrLogin(e) {     //点击创建钱包或者解锁
        if (this.formGroupToggle === true) {
          if (this.formRulesCreate.pwd && this.$verify.validatePwd(null, this.formRulesCreate.pwd, (param) => {
              return param || 'true';
            }) === 'true') {
            let key = this.$web3.personal.newAccount(this.formRulesCreate.pwd)
            this.modalForm.publicKey = key
            this.modalForm.pwd = this.formRulesCreate.pwd
            this.createDialog = true
          } else {
            this.$message({
              type: 'error',
              showClose: true,
              message: this.$msg.createPwd
            })
          }
        } else {
          this.$refs.unlock.unlockAccount()
        }
      },
      copyPublicKey(){
        let elem = document.getElementById('publicKey')
        elem.select()
        document.execCommand('copy')
      },
      toggleShowType(){
        this.modalForm.showType=this.modalForm.showType==='password'?'text':'password'
      },
      unlockNewAccount(){
        sessionStorage.setItem('publicKey',this.modalForm.publicKey)
        this.$router.replace({path: '/listContent'})    //创建/解锁成功后跳转到功能列表
        this.$message({
          type: 'success',
          showClose: true,
          message: this.$msg.unlockSucc
        })
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
