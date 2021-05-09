<template>
  <view class="container">
    <view class="item" v-for="(v, i) in details" :key="i" @click="toDetails(v)">
      <view class='title text'>{{ v.title }}</view>
      <view class='desc text'>{{ v.desc }}</view>
      <image v-if="v.images && v.images[0]" :src='v.images[0]'></image>
      <view class='text author'>{{ v.author }}</view>
      <view class='text createdAt'>{{ v.createdAt }}</view>
    </view>
  </view>
</template>

<script>

export default {
  name: "index",
  data() {
    return {
      details:[]
    }
  },
  methods: {
    toDetails(v) {

    }
  },
  onload(e) {
    let type = e.type
    let category = e.category
    // https://gank.io/api/v2/data/category/GanHuo/type/Android/page/1/count/10
    uni.request({
      url: this.$api + `categories/${category}/type/${type}/page/1/count/50`,
      header: {
        'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
      },
      success: (res) => {
        console.log(res)
        this.details = res.data.data || []
      }
    });
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

  .item {
    background-color: #ffffff;
    margin: 30 rpx;
    border-radius: 10 rpx;
    padding: 30 rpx;

    image {
      width: 100%;
    }

    .text {
      width: 100%;
      line-height: 1.5;
      word-wrap: break-word;
      font-size: 12px;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .title {
      background: linear-gradient(to right, #bdc3c7, #2c3e50);
    }

    .desc {
      background: linear-gradient(to right,
          #2980b9,
          #6dd5fa
      );
    }

    .author {
      background: linear-gradient(to right,
          #c9ffbf,
          #ffafbd
      );
    }

    .createdAt {
      background: linear-gradient(to right,
          #525252,
          #3d72b4
      );
    }
  }
}
</style>
