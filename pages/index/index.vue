<template>
  <view class="container">
    <v-tabs v-model="current" :tabs="tabs" class="tab" @change="changeTab"></v-tabs>
    <view class = 'coupon'>
    <view class="item" v-for="(v, i) in couponList" @click="toCoupon(v.type)" :key="i">
      <image v-if='v.coverImageUrl' :src="v.coverImageUrl" mode="aspectFit"></image>
      <view class='text'>{{ v.desc }}</view>
    </view>
    </view>
  </view>
</template>

<script>
import CouponList from './js'

export default {
  name: "index",
  data() {
    return {
      current: 0,
      tabs: [
        {
          text: '文章',
          tabId: 'Article',
        },
        // {
        //   text: '赏心悦目',
        //   tabId: 'Girl',
        // }
      ],
      couponList: [],
    }
  },
  onLoad(e) {
    this.changeTab(this.current)
  },
  methods: {
    toCoupon(type) {
      console.log(type)
      uni.navigateTo({
        url: `/pages/index/details?category=${this.tabs[this.current].tabId}&type=${type}`
      })
    },
    changeTab(index) {
      this.current = index
      this.couponList = CouponList[this.tabs[index].tabId]
    }
  }
}
</script>
<style lang="scss">
page {
  background-color: #f8f8f8;
}

.container {
  font-size: 14px;
  line-height: 24px;
  position: relative;

  .tab {
    position: fixed;
    top: var(--window-top);
    left: 0;
    z-index: 9999;
  }

  .coupon {
    padding: 225rpx 15rpx 0;
    .item {
      background-color: #ffffff;
      margin: 30rpx;
      border-radius: 10rpx;
      padding:30rpx;

      image {
        width: 100%;
      }

      .text {
        width: 100%;
        line-height: 1.5;
        word-wrap:break-word;
        font-size: 12px;
        background: linear-gradient(to right, #1ae8c8, #4a8aff);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
    }
  }
}
</style>
