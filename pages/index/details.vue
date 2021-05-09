<template>
  <view class="container">
    <view class="item" v-for="(v, i) in details" :key="i" @click="toDetails(v)">
      <view class='text title '>{{ v.title }}</view>
      <view class='text desc '>{{ v.desc }}</view>
      <image v-if="v.images && v.images[0]" :src='`https://images.weserv.nl/?url=${v.images[0]}`'></image>
      <view class='text author'>{{ v.author }}</view>
      <view class='text createdAt'>{{ v.createdAt }}</view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'details',
  data() {
    return {
      details: []
    }
  },
  onLoad(e) {
    let type = e.type
    let category = e.category
    // https://gank.io/api/v2/data/category/GanHuo/type/Android/page/1/count/10
    uni.request({
      url: this.$api + `data/category/${category}/type/${type}/page/1/count/50`,
      header: {
        'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
      },
      success: (res) => {
        console.log(res.data.data)
        this.details = res.data.data
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
    margin: 30rpx;
    border-radius: 10rpx;
    padding: 30rpx;

    image {
      width: 100%;
    }


    .title {
      width: 100%;
      line-height: 1.5;
      word-wrap: break-word;
      font-size: 12px;
      background: linear-gradient(to right, #000000
      ,
      #434343);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .desc {

      width: 100%;
      line-height: 1.5;
      word-wrap: break-word;
      font-size: 12px;
      background: linear-gradient(to right,
          #2980b9,
          #6dd5fa
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .author {

      width: 100%;
      line-height: 1.5;
      word-wrap: break-word;
      font-size: 12px;
      background: linear-gradient(to right,
          #59c173
          ,
          #a17fe0
          ,
          #5d26c1
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .createdAt {

      width: 100%;
      line-height: 1.5;
      word-wrap: break-word;
      font-size: 12px;
      background: linear-gradient(to right,
          #525252,
          #3d72b4
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }


  }
}
</style>
