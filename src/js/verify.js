import $G from '../global'

export default {
  validatePwd(rule, value, callback) {     //验证创建钱包的密码强度
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)\w{8,}$/g;
    if (value) {
      if (!reg.test(value)) {
        return callback(new Error($G.msg.createPwd));
      } else {
        return callback();
      }
    }
  }
}
