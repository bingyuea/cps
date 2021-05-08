<template>
	<view class="container">
		<v-tabs v-model="current" :tabs="tabs" @change="changeTab" class="tab" v-show='false'></v-tabs>
		<view class="coupon" ref="coupon">
			<view class="item" v-for="(v, i) in couponList" @click="toCoupon(i)" :key="i">
				<view class="top">
					<view class="left">
						<view class="content">
							<image :src="v.icon" class="icon" mode="widthFix" />
							<view class="name">{{ v.name }}</view>
						</view>
						<view class="text">天天可领</view>
						<!-- <view class="text" v-else-if="v.type == 2">限时秒杀</view> -->
					</view>
					<view class="right" v-if="v.type == 1">马上领取</view>
				</view>
				<view class="bottom">
					<image :src="v.bannerPic" mode="widthFix" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				tabs: [{
						icon: '/static/all.png',
						text: '全部',
						tabId: 0,
					},
					{
						icon: '/static/ele.png',
						text: '饿了么',
						tabId: 1,
					}
				],
				couponList: [],
				coupons: [{
						name: '饿了么红包',
						icon: '/static/coupon/ele.png',
						bannerPic: '/static/coupon/ele_banner.png',
						url: 'https://s.click.ele.me/QXmgNou',
						type: 1,
						tabId: 1,
						minapp: {
							appid: 'wxece3a9a4c82f58c9',
							path: 'ele-recommend-price/pages/guest/index?inviterId=cce7965&chInfo=ch_wechat_chsub_CopyLink&_ltracker_f=tjyj1_wx_banner3'

						}
					}, {
						name: '瑞幸咖啡',
						icon: '/static/coupon/ruixing.png',
						bannerPic: '/static/coupon/ruixing_banner.png',
						type: 1,
						tabId: 1,
						minapp: {
							appid: 'wx21c7506e98a2fe75',
							path: 'pages/share/inviterReg/inviterReg?locationType=1&channelInviteCode=undefined&inviteCode=syjPabCg4cLAUzH6-kbmvQ&target=EwJlBjfvSXuZxvs4s9fSgA&activityNo=NR201810220001'
						}
					},
					{
						name: '优惠券',
						icon: '/static/quan.png',
						bannerPic: '/static/coupon/11.jpg',
						url: 'https://qm.qq.com/cgi-bin/qm/qr?k=3INdUgev7ldsYycZ2K4kwdDXZb48Tcma&jump_from=webapi',
						type: 1,
						tabId: 1,
						qun: true
					}, {
						name: '羊毛群',
						icon: '/static/yangmao.jpg',
						bannerPic: '/static/coupon/yangmaos.jpg',
						url: 'http://note.youdao.com/noteshare?id=c8cdf4bf2521219ad56f70dbc42eaae2',
						type: 1,
						tabId: 1,
						qun: true
					},
				]
			};
		},
		onLoad(e) {
			//#ifdef H5
			let tabId = this.$route.query.tabId ? parseInt(this.$route.query.tabId) : 0
			//#endif
			//#ifdef MP-WEIXIN
			let tabId = e.tabId ? parseInt(e.tabId) : 0
			//#endif
			for (let i in this.tabs) {
				if (tabId == this.tabs[i].tabId) {
					this.current = parseInt(i)
				}
			}
			this.changeTab(this.current)
		},
		onShareAppMessage(res) {
			var messages = [{
				title: '美团饿了么大额红包，每日可领！',
				path: '/pages/index/index'
			}, {
				title: '吃了这么多年外卖，你知道这个秘密吗？',
				path: '/pages/index/index'
			}];
			return messages[Math.floor(Math.random() * messages.length)];
		},
		methods: {
			changeTab(index) {
				console.log('当前选中的项：' + index);
				this.couponList = []
				uni.showLoading({
					title: '获取优惠中'
				});
				if (index == 0) {
					this.couponList = this.coupons
				} else {
					for (let i in this.coupons) {
						if (this.coupons[i].tabId == this.tabs[index].tabId) {
							this.couponList.push(this.coupons[i])
						}
					}
				}
				//#ifdef H5
				this.$nextTick(() => {
					this.$refs.coupon.scrollTop = 0;
				})
				//#endif
				setTimeout(() => {
					uni.hideLoading()
				}, 500)
			},
			toCoupon(i) {
				console.log(this.couponList[i])
				if (this.couponList[i].qun) {
					wx.setClipboardData({
						data: this.couponList[i].url,
						success: function(res) {
							wx.showModal({
								title: '邀请码已复制，粘贴到浏览器并打开',
							})
						}
					});
				}
				//h5
				//#ifdef H5
				window.location.href = this.couponList[i].url
				//#endif
				//微信小程序
				//#ifdef MP-WEIXIN
				if (this.couponList[i].minapp) {
					wx.navigateToMiniProgram({
						appId: this.couponList[i].minapp.appid,
						path: this.couponList[i].minapp.path,
						success(res) {
							// 打开成功
						}
					})
				}
				//#endif
			}
		}
	};
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
			.item {
				background-color: #ffffff;
				margin: 30rpx;
				border-radius: 10rpx;
				padding: 0 30rpx 30rpx 30rpx;

				.top {
					height: 116rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left {
						height: 116rpx;
						width: 400rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.content {
							width: 100%;
						}

						.icon {
							display: inline-block;
							vertical-align: bottom;
							width: 52rpx;
							height: auto;
						}

						.name {
							text-align: left;
							display: inline-block;
							vertical-align: bottom;
							font-size: 34rpx;
							color: #000;
							line-height: 50rpx;
							font-weight: bold;
							margin-left: 15rpx;
						}

						.text {
							width: 150rpx;
							height: 38rpx;
							line-height: 38rpx;
							text-align: center;
							font-size: 24rpx;
							color: #61300e;
							background: linear-gradient(90deg, #f9db8d, #f8d98a);
							border-radius: 6rpx;
						}
					}

					.right {
						width: 170rpx;
						height: 60rpx;
						border-radius: 30rpx;
						background: linear-gradient(90deg, #ec6f43, #ea4a36);
						color: #fff;
						font-size: 28rpx;
						line-height: 60rpx;
						text-align: center;
					}
				}

				.bottom {
					height: auto;
					width: 100%;

					image {
						display: block;
						width: 100%;
						height: auto;
					}
				}
			}
		}
	}
</style>
