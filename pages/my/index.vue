<template>
  <view class="content">
      <image src = '/static/k/my.jfif' mode="aspectFit"></image>
      <button  type="primary" class="primary" @click="bindLogin">加油！干饭人</button>
  </view>
</template>
<script>
export default {
  methods: {
    bindLogin() {
      uni.navigateTo({
        url: '/pages/vip/index',
      });
    },
  }
}
</script>
<style lang="scss">
.content {
  height: 100vh;
  width: 100vw;
  image{
    height: 100%;
    width: 100%;
  }
}

uni-button[type=primary] {
  margin: 0 5%;
  background-image: linear-gradient(to top, #66b7f9,#1c82d4);
}

</style>
