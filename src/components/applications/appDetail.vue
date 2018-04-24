<template>
  <div class="app-detail">
    <el-row>
      <!--<el-col :span="1">-->
      <!--<div>&nbsp;</div>-->
      <!--</el-col>-->
      <el-col :span="20">
        <div class="table">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="tc options dragon"
                   @click="bet('dragon')"
                   :class="{choosed: choosed === 'dragon'}">
                龙
              </div>
            </el-col>
            <el-col :span="8">
              <div class="tc options leopard"
                   @click="bet('leopard')"
                   :class="{choosed: choosed === 'leopard'}">
                合
              </div>
            </el-col>
            <el-col :span="8">
              <div class="tc options tiger"
                   @click="bet('tiger')"
                   :class="{choosed: choosed === 'tiger'}">
                虎
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="tc money"
                   @click="betMoney('1')"
                   :class="{choosed: betChoosed === '1'}">
                1
              </div>
            </el-col>
            <el-col :span="6">
              <div class="tc money"
                   @click="betMoney('2')"
                   :class="{choosed: betChoosed === '2'}">
                2
              </div>
            </el-col>
            <el-col :span="6">
              <div class="tc money"
                   @click="betMoney('5')"
                   :class="{choosed: betChoosed === '5'}">
                5
              </div>
            </el-col>
            <el-col :span="6">
              <div class="tc money"
                   @click="betMoney('10')"
                   :class="{choosed: betChoosed === '10'}">
                10
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="4">
        <ul class="menu">
          <li class="tl back">
            <router-link :to='{path: "/listContent"}'>返回主页 >></router-link>
          </li>
          <li>本轮"龙"的下注人数为：23 人</li>
          <li>本轮"虎"的下注人数为：27 人</li>
          <li>本轮"合"的下注人数为：6 人</li>
          <li style="margin-bottom: 40px">
            本轮倒计时：还剩
            <span style="color: #f00">{{ countDown }}</span>
            秒
          </li>
          <li v-if="betZh === ''">请先下注！</li>
          <li v-else>你已选中： <span style="color: #f00">“{{ betZh }}”</span></li>
          <li>下注金额为：<span style="color: #f00">“{{ moneyNum }}”</span> 币</li>
          <li>
            <el-button type="primary">下注</el-button>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "app-detail",
    data() {
      return {
        choosed: '', // 龙虎合选中的标识
        betChoosed: '', // 金额选中的标识
        betZh: '',
        moneyNum: 0,
        countDown: 3
      }
    },
    methods: {
      bet(sign) {
        this.choosed = sign
        switch (sign) {
          case 'dragon':
            this.betZh = '龙'
            break
          case 'leopard':
            this.betZh = '合'
            break
          case 'tiger':
            this.betZh = '虎'
            break
          default:
            return false
        }
      },
      betMoney(num) {
        this.betChoosed = num
        this.moneyNum = num
      }
    },
    mounted() {
      let timer = setInterval(() => {
        if (this.countDown === 1) {
          this.countDown = 4
        }
        this.countDown--
      }, 1000)
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .table {
    width: 90%;
    margin: 0 auto;
    .el-row {
      margin: 80px 0;
      &:last-child {
        margin-bottom: 0;
      }
      .el-col {
        border-radius: 4px;
        .options {
          border-radius: 4px;
          cursor: pointer;
          height: 400px;
          line-height: 400px;
          font-size: 200px;
          background: #d3dce6;
          &.choosed {
            color: #034D3B;
            background: #4DAD95;
          }
        }
        .money {
          height: 100px;
          line-height: 100px;
          font-size: 50px;
          width: 60%;
          cursor: pointer;
          margin: 0 auto;
          border-radius: 50px;
          background: #D3DCE6;
          &.choosed {
            color: #034D3B;
            background: #4DAD95;
          }
        }
      }
    }
  }

  .menu {
    margin: 80px 0;
    li {
      margin: 20px 0;
      &.back {
        margin-bottom: 40px;
        a {
          color: #f00;
        }
      }
    }
  }
</style>
