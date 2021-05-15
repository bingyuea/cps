<template>
  <view class="content">
    <web-view src = 'https://mp.weixin.qq.com/s?__biz=MjM5OTQ2NTA3MQ==&mid=2247483729&idx=3&sn=79eb20ff793e2b6c901fd0be8c5ecbac&chksm=a73a5851904dd147e49871bb339401f4430bd4f5d4077406823a2092c78f599ade4465972b0e&scene=126&sessionid=1621049976&key=e792d5b1c972f508a1cbbdfc28d930629cdcbc18263b2c0046b0fd5cd712a291fda8643cf3de5dfa0ab773726d89a064a1d0bf285c4c938c2095fbab9013093023c18efbfcd150cc0c939f8ee1326e74a9eea451aff3e7991671fca88d3db0dad4dcf1dc9cd78088ecc88b44ba2524387edd16776aa51824f2c298cd33e8defc&ascene=1&uin=ODQzNzczNjAx&devicetype=Windows+10+x64&version=63020197&lang=zh_CN&exportkey=AfYgfKHgydeJxj2iwStCuT8%3D&pass_ticket=X2U%2BdZYbNE7NFfyuVEwOAv8m2StCPMk5r03jHQ2XEels3jhDXDRDKoWOfTJOVvdy&wx_header=0'></web-view>
    <view class="content-box" @touchstart="touchstart" id="content-box" :class="{'content-showfn':showFunBtn}">
      <!-- 背景图- 定位方式 -->
      <!-- <image class="content-box-bg" :src="user_info.chatBgImg" :style="{ height: imgHeight }"></image> -->
      <view class="content-box-loading" v-if="!loading"><u-loading mode="flower"></u-loading></view>
      <view class="message" v-for="(item, index) in messageList" :key="index" :id="`msg-${item.hasBeenSentId}`">
        <view class="message-item " :class="item.isItMe ? 'right' : 'left'">
          <image class="img" :src="item.fromUserHeadImg" mode="" @click="linkToBusinessCard(item.fromUserId)"></image>
          <!-- contentType = 1 文本 -->
          <view class="content" v-if="item.contentType == 1">{{ item.content }}</view>
          <!-- contentType = 2 语音 -->
          <view class="content contentType2" :class="[{ 'content-type-right': item.isItMe }]" v-if="item.contentType == 2" @click="handleAudio(item)"
                hover-class="contentType2-hover-class" :style="{width:`${130+(item.contentDuration*2)}rpx`}" >
            <view class="voice_icon"
                  :class="[
                                { voice_icon_right: item.isItMe },
                                { voice_icon_left: !item.isItMe },
                                { voice_icon_right_an: item.anmitionPlay && item.isItMe },
                                { voice_icon_left_an: item.anmitionPlay && !item.isItMe } ]" ></view>
            <view class="">{{ item.contentDuration }}''</view>
          </view>
          <!-- contentType = 3 图片 -->
          <view  class="content contentType3" v-if="item.contentType == 3" @click="viewImg([item.content])" >
            <image :src="item.content" style="height: 60rpx;width: 60rpx" class="img" ></image>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部聊天输入框 -->
    <view class="input-box2" :class="popupLayerClass" >
      <view class="voice">
        <image src="/static/voice.png" @click="discard" style="width: 60rpx;height: 60rpx"></image>
      </view>
      <view class="textbox">
        <!-- <view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view> -->
        <view class="text-mode">
          <view class="box">
<!--            <editor id="editor" class="ql-container" placeholder=" " :show-img-size="true" @ready="onEditorReady"></editor>-->
             <textarea auto-height="true" v-model="formData.content" @focus="textareaFocus"/>
          </view>
          <view class="em" @click="chooseEmoji">
            <image src="/static/biaoqing.png" style="width: 60rpx;height: 60rpx"></image>
          </view>
        </view>
      </view>
      <!-- 功能性按钮 -->
      <view class="flex u-p-l-20" @click="switchFun" class = 'send' style = 'display: flex;
    align-items: center;
    width: 100rpx;
    justify-content: center;'>
        <image src="/static/send.png" style="width: 60rpx;height: 60rpx" color="#ff6a00"></image>
      </view>
    </view>
    <!-- 抽屉栏 -->
    <view class="popup-layer" :class="popupLayerClass">
      <!-- 表情 -->
      <view class="emoji-swiper" :class="{hidden:hideEmoji}">
        <scroll-view scroll-y="true" style="height: 300rpx;">
          <view class="u-p u-flex u-flex-wrap">
            <view class="u-m-b-32 emoji-box flex" v-for="(page,pid) in emojiList" :key="pid" @click="clickEmoji(page)">
              <image  style="width: 60rpx;height: 60rpx;display: inline-block" :src="'/static/'+page.url"></image>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 更多功能 相册-拍照-红包 -->
      <view class="more-layer" :class="{hidden:hideMore}">
        <view class="list">
          <view class="box u-flex-col" v-for="(item, index) in funList" :key="index">
            <image :src="item.icon" :size="52"></image>
            <view class="grid-text">{{ item.title }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- //语音动画 -->
    <view class="voice_an"  v-if="recording">
      <view class="voice_an_icon">
        <view id="one" class="wave"></view>
        <view id="two" class="wave"></view>
        <view id="three" class="wave"></view>
        <view id="four" class="wave"></view>
        <view id="five" class="wave"></view>
        <view id="six" class="wave"></view>
        <view id="seven" class="wave"></view>
      </view>
      <view class="text">{{voiceIconText}}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      fromUserInfo: {},
      // 抽屉参数
      popupLayerClass:'',
      formData: {
        content: '',
        limit: 15,
        index: 1
      },
      user_info:{
        address: "河南郑州",
        headImg: "/static/wx.png",
        id: 1,
        phone: "13535351112",
        pictureBanner: "/static/wx.png",
        signature: "who do you want to meet.",
        userName: "DR",
        wechatNumber: "October"
      },
      messageList: [
        {
          anmitionPlay: false,
          content: "很高兴认识你，这是第1条消息。很高兴认识你，这是第1条消息。很高兴认识你，这是第1条消息。很高兴认识你，这是第1条消息。",
          contentType: 1,
          createTime: 1614069114032,
          fromUserHeadImg: "/static/wx.png",
          fromUserId: 1,
          hasBeenSentId: 1,
          isItMe: true
        },{
          anmitionPlay: false,
          content: "很高兴认识你，这是第2条消息。",
          contentType: 1,
          createTime: 1614069114032,
          fromUserHeadImg: "/static/head2.png",
          fromUserId: 1,
          hasBeenSentId: 2,
          isItMe: false
        },{
          anmitionPlay: false,
          content: "很高兴认识你，这是第3条消息。",
          contentType: 1,
          createTime: 1614069114032,
          fromUserHeadImg: "/static/wx.png",
          fromUserId: 1,
          hasBeenSentId: 3,
          isItMe: true
        },{
          anmitionPlay: false,
          content: "很高兴认识你，这是第4条消息。",
          contentType: 1,
          createTime: 1614069114032,
          fromUserHeadImg: "/static/head2.png",
          fromUserId: 1,
          hasBeenSentId: 4,
          isItMe: false
        },{
          anmitionPlay: false,
          content: "很高兴认识你，这是第5条消息。",
          contentType: 1,
          createTime: 1614069114032,
          fromUserHeadImg: "/static/wx.png",
          fromUserId: 1,
          hasBeenSentId: 5,
          isItMe: true
        },
      ],
      loading: true, //标识是否正在获取数据
      imgHeight: '1000px',
      mpInputMargin: false, //适配微信小程序 底部输入框高度被顶起的问题
      chatType:"voice",  // 图标类型 'voice'语音 'keyboard'键盘
      voiceTitle: '按住 说话',
      Recorder: uni.getRecorderManager(),
      Audio: uni.createInnerAudioContext(),
      recording: false, //标识是否正在录音
      isStopVoice: false, //加锁 防止点击过快引起的当录音正在准备(还没有开始录音)的时候,却调用了stop方法但并不能阻止录音的问题
      voiceInterval:null,
      voiceTime:0, //总共录音时长
      canSend:true, //是否可以发送
      PointY:0, //坐标位置
      voiceIconText:"正在录音...",
      showFunBtn:false, //是否展示功能型按钮
      AudioExam:null, //正在播放音频的实例
      funList: [
        { icon:"photo",title:"照片",uploadType:["album"] },
        { icon:"camera",title:"拍摄",uploadType:["camera"] },
      ],
      // input
      customStyle:{
        padding:'15rpx'
      },
      // more参数
      hideMore:true,
      //表情定义
      hideEmoji:true,
      emojiList:[
        {"url":"emoji-_1.png",alt:"[尴尬]"},
        {"url":"emoji-_2.png",alt:"[伤心]"},
        {"url":"emoji-_3.png",alt:"[闭眼]"},
        {"url":"emoji-_4.png",alt:"[发呆]"},
        {"url":"emoji-_5.png",alt:"[飞吻]"},
        {"url":"emoji-_6.png",alt:"[调皮]"},
        {"url":"emoji-_7.png",alt:"[震惊]"},
        {"url":"emoji-_8.png",alt:"[偷笑]"},
        {"url":"emoji-_9.png",alt:"[白眼]"},
      ],

    };
  },
  methods: {
    test(e){
      console.log(e);
    },
    onEditorReady() {
      uni.createSelectorQuery().select('#editor').context((res) => {
        this.editorCtx = res.context
      }).exec()
    },
    // 打开抽屉
    openDrawer(){
      this.popupLayerClass = 'showLayer';
    },
    // 隐藏抽屉
    hideDrawer(){
      this.popupLayerClass = '';
      setTimeout(()=>{
        this.hideMore = true;
        this.hideEmoji = true;
      },150);
    },
    discard(){
      console.log('点击')
      wx.showModal({
        title: '秘密',
        content: '大声点，我听不到！',
      })
    },
    //获取焦点，如果不是选表情ing,则关闭抽屉
    textareaFocus(){
      if(this.popupLayerClass=='showLayer' && this.hideMore == false){
        this.hideDrawer();
      }
    },
    //拼接消息 处理滚动
    async joinData() {
      if (!this.loading) {
        //如果没有获取数据 即loading为false时，return 避免用户重复上拉触发加载
        return;
      }
      this.loading = false;
      const data = await this.getMessageData();
      //获取节点信息
      const { index } = this.formData;
      const sel = `#msg-${index > 1 ? this.messageList[0].hasBeenSentId : data[data.length - 1].hasBeenSentId}`;
      this.messageList = [...data, ...this.messageList];
      //填充数据后，视图会自动滚动到最上面一层然后瞬间再跳回bindScroll的指定位置 ---体验不是很好，后期优化 ·
      this.$nextTick(() => {
        this.bindScroll(sel);
        //如果还有数据
        if (this.formData.limit >= data.length) {
          this.formData.index++;
          setTimeout(() => {
            this.loading = true;
          }, 200);
        }
      });
    },
    //处理滚动
    bindScroll(sel, duration = 0) {
      const query = uni.createSelectorQuery().in(this);
      query
          .select(sel)
          .boundingClientRect(data => {
            uni.pageScrollTo({
              scrollTop: data && data.top - 40,
              duration
            });
          })
          .exec();
    },
    //获取消息
    getMessageData() {
      let getData = () => {
        let arr = [];
        let startIndex = (this.formData.index - 1) * this.formData.limit;
        let endIndex = startIndex + this.formData.limit;
        for (let i = startIndex; i < endIndex; i++) {
          const isItMe = Math.random() > 0.5 ? true : false;
          arr.unshift({
            hasBeenSentId: i, //已发送过去消息的id
            content: `很高兴认识你，这是第${i + 1}条消息。`,
            fromUserHeadImg: isItMe ? this.user_info.headImg : this.fromUserInfo.fromUserHeadImg, //用户头像
            fromUserId: isItMe ? this.user_info.id : this.fromUserInfo.fromUserId,
            isItMe, //true此条信息是我发送的 false别人发送的
            createTime: Date.now(),
            contentType: 1, // 1文字文本 2语音
            anmitionPlay: false //标识音频是否在播放
          });
        }
        return arr;
      };
      return new Promise((resolve, reject) => {
        const data = getData();
        setTimeout(() => {
          resolve(data);
        }, 500);
      });
    },
    //切换语音或者键盘方式
    switchChatType(type) {
      this.chatType = type;
      this.showFunBtn =false;
    },
    //切换功能性按钮
    switchFun(){
      /* this.chatType = 'keyboard'
      this.showFunBtn = !this.showFunBtn;
      this.hideEmoji = false;
      uni.hideKeyboard()*/
      this.sendMsg()
    },
    // 点击选择表情
    chooseEmoji(){
      this.hideMore = true;
      // if(this.hideEmoji){
      //   this.hideEmoji = false;
      //   this.openDrawer();
      // }else{
      //   this.hideDrawer();
      // }
    },
    //发送消息
    sendMsg(data) {
      const params = {
        hasBeenSentId: Date.now(), //已发送过去消息的id
        content: this.formData.content,
        fromUserHeadImg: this.user_info.headImg, //用户头像
        fromUserId: this.user_info.id,
        isItMe: true, //true此条信息是我发送的  false别人发送的
        createTime: Date.now(),
        contentType: 1
      };

      if (data) {
        if(data.contentType == 2){
          //说明是发送语音
          params.content = data.content;
          params.contentType = data.contentType;
          params.contentDuration = data.contentDuration;
          params.anmitionPlay = false;
        }else if(data.contentType == 3){
          //发送图片
          params.content = data.content;
          params.contentType = data.contentType;
        }
      }
      if (!this.formData.content) return
      console.log(params)
      this.invokeService(this.formData.content)
      this.messageList.push(params);
      this.$nextTick(() => {
        this.formData.content = '';
        // #ifdef MP-WEIXIN
        if(params.contentType == 1){
          uni.pageScrollTo({
            scrollTop: 99999,
            duration: 0, //小程序如果有滚动效果 input的焦点也会随着页面滚动...
          });
        }else{
          setTimeout(()=>{
            uni.pageScrollTo({
              scrollTop: 99999,
              duration: 0, //小程序如果有滚动效果 input的焦点也会随着页面滚动...
            });
          },150)
        }
        // #endif

        // #ifndef MP-WEIXIN
        uni.pageScrollTo({
          scrollTop: 99999,
          duration: 100
        });
        // #endif

        if(this.showFunBtn){
          this.showFunBtn = false;
        }

        // #ifdef MP-WEIXIN
        if (params.contentType == 1) {
          this.mpInputMargin = true;
        }
        // #endif
        //h5浏览器并没有很好的办法控制键盘一直处于唤起状态 而且会有样式性的问题
        // #ifdef H5
        uni.hideKeyboard();
        // #endif
      });
    },
    invokeService(data){
      wx.serviceMarket.invokeService({
        service: 'wxcae50ba710ca29d3', // 'wx_mp_appid',
        api: 'thumbupbot',
        data: {
          "q": data, // 需要夸的内容
        },
      }).then(res => {
        console.log('invokeService success', res)
        this.sendMsg2(res.data.data_list[0].result || '你说的啥，我听不到！')
      }).catch(err => {
        console.error('invokeService fail', err)
        wx.showModal({
          title: 'fail',
          content: err + '',
        })
      })
    },
    sendMsg2(msg) {
      console.log(msg)
      const params = {
        hasBeenSentId: Date.now(), //已发送过去消息的id
        content: msg,
        fromUserHeadImg:  "/static/head2.png", //用户头像
        fromUserId: 1,
        isItMe: false, //true此条信息是我发送的  false别人发送的
        createTime: Date.now(),
        contentType: 1
      };

      if (!msg) return
      console.log(params)

      this.messageList.push(params);

      this.$nextTick(() => {
        this.formData.content = '';
        // #ifdef MP-WEIXIN
        if(params.contentType == 1){
          uni.pageScrollTo({
            scrollTop: 99999,
            duration: 0, //小程序如果有滚动效果 input的焦点也会随着页面滚动...
          });
        }else{
          setTimeout(()=>{
            uni.pageScrollTo({
              scrollTop: 99999,
              duration: 0, //小程序如果有滚动效果 input的焦点也会随着页面滚动...
            });
          },150)
        }
        // #endif

        // #ifndef MP-WEIXIN
        uni.pageScrollTo({
          scrollTop: 99999,
          duration: 100
        });
        // #endif

        if(this.showFunBtn){
          this.showFunBtn = false;
        }

        // #ifdef MP-WEIXIN
        if (params.contentType == 1) {
          this.mpInputMargin = true;
        }
        // #endif
        //h5浏览器并没有很好的办法控制键盘一直处于唤起状态 而且会有样式性的问题
        // #ifdef H5
        uni.hideKeyboard();
        // #endif
      });
    },
    //用户触摸屏幕的时候隐藏键盘、更多功能、表情
    touchstart() {
      uni.hideKeyboard();
      this.hideEmoji = false;
      this.showFunBtn = false;
      this.hideDrawer();  // 关闭抽屉
    },
    // userid 用户id
    linkToBusinessCard(userId) {
      this.$u.route({
        url: 'pages/businessCard/businessCard',
        params: {
          userId
        }
      });
    },
    //准备开始录音
    startVoice(e) {
      console.log('准备开始录音');
      if(!this.Audio.paused){
        //如果音频正在播放 先暂停。
        this.stopAudio(this.AudioExam)
      }
      this.recording = true;
      this.isStopVoice = false;
      this.canSend = true;
      this.voiceIconText = "正在录音..."
      this.PointY = e.touches[0].clientY;
      this.Recorder.start({
        format: 'mp3'
      });
    },
    //录音已经开始
    beginVoice(){
      console.log('录音已经开始');
      if (this.isStopVoice) {
        this.Recorder.stop();
        return;
      }
      this.voiceTitle = '松开 结束'
      this.voiceInterval =  setInterval(()=>{
        this.voiceTime ++;
      },1000)
    },
    //move 正在录音中
    moveVoice(e){
      console.log('正在录音中');
      const PointY = e.touches[0].clientY
      const slideY = this.PointY - PointY;
      if(slideY > uni.upx2px(120)){
        this.canSend = false;
        this.voiceIconText = '松开手指 取消发送 '
      }else if(slideY > uni.upx2px(60)){
        this.canSend = true;
        this.voiceIconText = '手指上滑 取消发送 '
      }else{
        this.voiceIconText = '正在录音... '
      }
    },
    //结束录音
    endVoice() {
      console.log('结束录音');
      this.isStopVoice = true; //加锁 确保已经结束录音并不会录制
      this.Recorder.stop();
      this.recording = false;
      this.voiceTitle = '按住 说话'
    },
    //录音被打断
    cancelVoice(e){
      console.log('录音被打断');
      this.voiceTime = 0;
      this.voiceTitle = '按住 说话';
      this.canSend = false;
      this.recording = false;
      this.Recorder.stop();
    },
    //处理录音文件
    handleRecorder({ tempFilePath,duration }) {
      let contentDuration;
      // #ifdef MP-WEIXIN
      this.voiceTime = 0;
      if (duration < 600) {
        this.voiceIconText="说话时间过短";
        setTimeout(()=>{
          this.recording = false;
        },200)
        return;
      }
      contentDuration = duration/1000;
      // #endif

      // #ifdef APP-PLUS
      contentDuration = this.voiceTime +1;
      this.voiceTime = 0;
      if(contentDuration <= 0) {
        this.voiceIconText="说话时间过短";
        setTimeout(()=>{
          this.recording = false;
        },200)
        return;
      };
      // #endif

      this.recording = false;
      const params = {
        contentType: 2,
        content: tempFilePath,
        contentDuration: Math.ceil(contentDuration)
      };
      this.canSend && this.sendMsg(params);
    },
    //控制播放还是暂停音频文件
    handleAudio(item) {
      this.AudioExam = item;
      this.Audio.paused ? this.playAudio(item) : this.stopAudio(item);
    },
    //播放音频
    playAudio(item) {
      this.Audio.src = item.content;
      this.Audio.hasBeenSentId = item.hasBeenSentId;
      this.Audio.play();
      item.anmitionPlay = true;
    },
    //停止音频
    stopAudio(item) {
      item.anmitionPlay = false;
      this.Audio.src = '';
      this.Audio.stop();
    },
    //关闭动画
    closeAnmition() {
      const hasBeenSentId = this.Audio.hasBeenSentId;
      const item = this.messageList.find(it => it.hasBeenSentId == hasBeenSentId);
      item.anmitionPlay = false;
    },
    //添加表情
    clickEmoji(page){
      // '/static/img/emoji/'+page.url
      // this.formData.content += page.alt;
      this.editorCtx.insertImage({
        src: '/static/'+ page.url,
        alt: page.alt,
        width:20,
        height:20,
        extClass:'emojiIamge',
        success: function() {
          console.log('insert image success')
        }
      })

    },
    //获取焦点，如果不是选表情ing,则关闭抽屉
    /*textareaFocus(){
        this.hideEmoji = false;
        this.showFunBtn = false;
    },*/
    //点击宫格时触发
    clickGrid(index){
      if(index == 0){
        this.chooseImage(['album'])
      }else if(index == 1){
        this.chooseImage(['camera'])
      }
    },
    //发送图片
    chooseImage(sourceType){
      uni.chooseImage({
        sourceType,
        sizeType:['compressed'],
        success:res=>{
          this.showFunBtn = false;
          for(let i = 0;i<res.tempFilePaths.length;i++){
            const params = {
              contentType: 3,
              content: res.tempFilePaths[i],
            };
            this.sendMsg(params)
          }
        }
      })
    },
    //查看大图
    viewImg(imgList){
      uni.previewImage({
        urls: imgList,
        // #ifndef MP-WEIXIN
        indicator: 'number'
        // #endif
      });
    },
  },
  onPageScroll(e) {

  },
  onNavigationBarButtonTap() {
    //返回按钮
    this.$u.route({
      type: 'switchTab',
      url: 'pages/vip/index'
    });
  },
  //返回按钮事件
  onBackPress(e) {
    //以下内容对h5不生效
    //--所以如果用浏览器自带的返回按钮进行返回的时候页面不会重定向 正在寻找合适的解决方案
    this.$u.route({
      type: 'switchTab',
      url: 'pages/vip/index'
    });
    return true;
  },
  onLoad(info) {

  },
  onReady() {
    //自定义返回按钮 因为原生的返回按钮不可阻止默认事件
    // #ifdef H5
    const icon = document.getElementsByClassName('uni-page-head-btn')[0];
    // console.log(icon);
    icon.style.display = 'none';
    // #endif
    // 动态设置当前页面的标题。
    uni.setNavigationBarTitle({
      title: '没人夸，就自己夸'
    });

  }
};
</script>

<style lang="scss" scoped>
page {
  background-color: #f3f3f3;
}
.hidden{
  display: none !important;
}

.content {
  &-showfn{
    padding-bottom: 0rpx;
    padding-bottom: calc(420rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(420rpx + env(safe-area-inset-bottom) );
    /* #ifdef MP-WEIXIN */
    /* #endif */
  }
  &-box {
    width: 100%;
    height: auto;
    min-height: calc(100vh - env(safe-area-inset-top) - 200rpx);
    box-sizing: content-box;
    position: relative;
    padding-bottom: 120rpx;

    /* #ifdef APP-PLUS  */
    margin-bottom: 0rpx;
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
    /* #endif */
    /* #ifdef MP-WEIXIN */
    padding-bottom: 0rpx;
    padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom) );
    /* #endif */

    &-bg {
      width: 100%;
      position: fixed;
      /* #ifdef MP-WEIXIN */
      bottom: 0;
      bottom: constant(safe-area-inset-bottom);
      bottom: env(safe-area-inset-bottom);
      /* #endif */
      /* #ifndef MP-WEIXIN */
      top: 0;
      left: 0;
      /* #endif */
    }

    &-loading {
      text-align: center;
      padding: 20rpx 0;
    }

    .message {
      padding: 13rpx 20rpx;
    }

    .message-item {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      flex-wrap: nowrap;
      flex-direction: row;

      .img {
        width: 80rpx;
        height: 80rpx;
        border-radius: 40rpx;
      }

      .content {
        padding: 20rpx;
        max-width: 500rpx;
        border-radius: 10rpx;
        font-size: 28rpx;
      }

      // 语音
      .contentType2 {
        display: flex;
        flex-direction: row;
        align-items: center;
        .voice_icon {
          height: 34rpx;
          width: 34rpx;
          background-repeat: no-repeat;
          background-size: 100%;
        }
        .voice_icon_right {
          background-image: url(/static/voice.png);
          margin-left: 10rpx;
        }
        .voice_icon_left {
          background-image: url(/static/voice.png);
          margin-right: 10rpx;
        }
        .voice_icon_right_an {
          animation: voiceAn_right 1s linear alternate infinite;
        }
        .voice_icon_left_an {
          animation: voiceAn_left 1s linear alternate infinite;
        }
        @keyframes voiceAn_right {
          0% {
            background-image: url(/static/voice.png);
          }
          50% {
            background-image: url(/static/voice.png);
          }
          100% {
            background-image: url(/static/voice.png);
          }
        }
        @keyframes voiceAn_left {
          0% {
            background-image: url(/static/voice.png);
          }
          50% {
            background-image: url(/static/voice.png);
          }
          100% {
            background-image: url(/static/voice.png);
          }
        }
      }

      //图片
      .contentType3{
        padding: 0;
        border-radius: 2rpx;
        background-color: transparent !important;
        .img{
          width: 200rpx;
          height: auto;
          max-width: 300rpx;
          max-height: 400rpx;
        }
      }
      .contentType3::after{
        border: none !important;
        display: none !important;
      }
      .content-type-right {
        flex-direction: row-reverse;
      }

      &.right {
        flex-direction: row-reverse;

        .content {
          background-color: $uni-color-success;
          margin-right: 28rpx;
          word-break: break-all;
          line-height: 36rpx;
          position: relative;

          &::after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-top: 10rpx solid transparent;
            border-bottom: 10rpx solid transparent;
            border-left: 16rpx solid $uni-color-success;
            position: absolute;
            right: -16rpx;
            top: 30rpx;
          }
        }
      }

      &.left {
        .content {
          background-color: $uni-text-color-inverse;
          margin-left: 28rpx;
          word-break: break-all;
          line-height: 36rpx;
          position: relative;

          &::after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-top: 10rpx solid transparent;
            border-bottom: 10rpx solid transparent;
            border-right: 16rpx solid $uni-text-color-inverse;
            position: absolute;
            left: -16rpx;
            top: 30rpx;
          }
        }
      }
    }
  }

  .input-box2{
    width: 100%;
    min-height: 100rpx;
    padding: 0 1%;
    background-color: #fff;
    display: flex;
    position: fixed;
    z-index: 20;
    bottom:-2rpx;
    &.showLayer{transform: translate3d(0,-42vw,0);}
    transition: all .15s linear;
    border-bottom: solid 1upx #ddd;
    .voice,.more{
      flex-shrink: 0;
      width: 90upx;
      height: 100upx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .textbox{
      width: 100%;
      min-height: 64rpx;
      margin-top: 15rpx;
      padding-bottom: 15rpx;
      .voice-mode{
        width: calc(100% - 2upx);
        height: 64rpx;
        border-radius: 70rpx;
        border:solid 1rpx #cdcdcd;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28rpx;
        background-color: #fff;
        color: #555;
        &.recording{
          background-color: #e5e5e5;
        }
      }
      .text-mode{
        width: 100%;
        min-height: 64rpx;
        display: flex;
        background-color: #f7f7f7;
        box-shadow: 0 -1rpx 1rpx rgba($color: #000000, $alpha: 0.16);
        border-radius: 32rpx;
        .box{
          width: 100%;
          // padding-left: 30rpx;
          min-height: 64rpx;
          border-radius: 32rpx;
          // padding-bottom: 15rpx;
          display: flex;
          align-items: center;
          textarea{
            width: 100%;
          }
          .ql-container {
            box-sizing: border-box;
            padding: 15rpx;
            padding-right: 0;
            width: 100%;
            min-height: 30rpx;
            height: 100%;
            // margin-top: 20rpx;
            font-size: 28rpx;
            // line-height: 1.5;

          }
        }
        .em{
          flex-shrink: 0;
          width: 80upx;
          padding-left: 10upx;
          height: 70upx;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

  }
  .emojiIamge {
    margin: 10rpx;
  }
  .popup-layer{
    &.showLayer{transform: translate3d(0,-42vw,0);}
    transition: all .15s linear;
    width: 100%;
    height: 42vw;
    padding: 20rpx 2%;
    background-color: #fff;
    border-top: solid 1upx #ddd;
    position: fixed;
    z-index: 20;
    top: 100%;
    .emoji-swiper{
      height: 40vw;
      .emoji-box {
        width: 12.5%;
        height: 54rpx;
        image{
          width: 54rpx;
          height: 54rpx;
        }
      }
    }
    .more-layer{
      width: 100%;
      height: 42vw;
      .list{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .box{
          /* width: 18vw;
          height: 18vw; */
          background-color: #fff;
          margin: 0 3vw 2vw 3vw;
          .icon{
            font-size: 70upx;
          }
        }
      }
    }
  }
  .input-box-mpInputMargin {
    /* #ifdef MP-WEIXIN */
    padding-bottom: 0rpx;
    /* #endif */
  }
  .voice_an{
    width: 300rpx;
    height: 300rpx;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-55%);
    background-color: rgba(41,41,41,0.7);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border-radius: 10rpx;
    .text{
      padding-top: 30rpx;
    }
    @keyframes runVoice{
      0%{
        height: 10%;
      }
      20%{
        height: 50%;
      }
      50%{
        height: 100%;
      }
      80%{
        height: 50%;
      }
      100%{
        height: 0%;
      }
    }
    .wave{
      width:6rpx;
      height: 100%;
      margin-left: 10rpx;
      border-radius: 50rpx;
      background-color: #999;
      vertical-align: middle;
      display: inline-block;
    }
    .voice_an_icon{
      width: 200rpx;
      height: 100rpx;
      line-height: 50rpx;
      margin: 50rpx 0;
    }
    .voice_an_icon #one{
      animation:runVoice 0.6s infinite 0.1s;
    }
    .voice_an_icon #two{
      animation:runVoice 0.6s infinite 0.3s;
    }
    .voice_an_icon #three{
      animation:runVoice 0.6s infinite 0.6s;
    }
    .voice_an_icon #four{
      animation:runVoice 0.6s infinite 0.1s;
    }
    .voice_an_icon #five{
      animation:runVoice 0.6s infinite 0.3s;
    }
    .voice_an_icon #six{
      animation:runVoice 0.6s infinite 0.6s;
    }
    .voice_an_icon #seven{
      animation:runVoice 0.6s infinite 0.1s;
    }
  }
}
</style>
