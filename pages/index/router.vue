<template>
  <view>
    <button @click="copy"> 一键复制 </button>
  </view>
  <text :src = 'url'>{{url}}</text>
</template>

<script>
export default {
  name: "router",
  data(){
    return {
      url:''
    }
  },
  onLoad(e) {
    this.url = e.url || ''
  },
  methods:{

  }
}
</script>

<style scoped>

</style>