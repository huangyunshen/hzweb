//此文件定义全局变量和全局方法；

import Web3 from 'web3';

export default {
  install(Vue, options){
    //web3
    Vue.prototype.web3 = new Web3(new Web3.providers.HttpProvider('http://39.104.81.103:19101'));
    // Vue.prototype.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }
}
