<template>
  <div class="business-panel">
    <div class="panel-header">
      <img :src="imgUrl" class="panel-img">
      <div class="panel-content-text">{{contentText}}</div>
    </div>
    <div class="panel-footer">{{footerText}}</div>
  </div>
</template>

<script>
  export default {
    name: "business-unit",
    props: ['imgUrl', 'contentText', 'footerText'],
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .business-panel {
    height: 150px;
    float: left;
    min-width: 200px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 0 20px 3px #999;
    cursor: pointer;
  }

  .business-panel:hover {
    animation: panelShadow .3s;
    animation-fill-mode: forwards;
  }

  @keyframes panelShadow {
    from {
      box-shadow: 0 0 20px 3px #999;
    }
    to {
      box-shadow: 0 0 3px 0 #666;
    }
  }

  .panel-header {
    height: 100px;
    overflow: hidden;
    position: relative;
  }

  .panel-img {
    width: 100%;
  }

  .panel-content-text {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(8, 129, 100, 0.6);
    text-align: center;
    height: 0;
    color: #fff;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    overflow: hidden;
  }

  .panel-footer {
    padding: 0 10px;
    color: #666;
    font-size: 18px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
  }

  .panel-header:hover .panel-content-text {
    animation: showContent .5s;
    animation-fill-mode: forwards;
  }

  @keyframes showContent {
    from {
      height: 0;
    }
    to {
      height: 100%;
    }
  }
</style>
