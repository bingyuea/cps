<template>
  <view class="content">
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
<style>
.content {
  background: url('/static/k/my.jfif')  no-repeat center ;
  background-size:cover ;
  height: 100%;
  width: 100%;
}

uni-button[type=primary] {
  margin: 0 4%;
  background-image: linear-gradient(to top, #66b7f9,#1c82d4);
}

</style>
