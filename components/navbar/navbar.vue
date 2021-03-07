<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 状态栏 -->
			<view :style="{height: statusBarHeight + 'px;'}"></view>
			<!-- 导航栏内容 -->
			<view class="navbar-content" :class="{search: isSearch}"
				:style="{height: navBarHeight + 'px;', width: windowWidth + 'px;'}" @click.stop="open">
				<view v-if="isSearch" class="navbar-content__search-icons" @click="back">
					<uni-icons type="back" size="22" color="#fff"></uni-icons>
				</view>
				<view v-if="!isSearch" class="navbar-search">
					<!-- 非搜索页显示 -->
					<view class="navbar-search-icon">
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-search-text">uni-app，vue</view>
				</view>
				<view v-else class="navbar-search">
					<!-- 搜索页显示 -->
					<input class="navbar-search-text" type="text" value="" v-model="val" placeholder="请输入内容"
						@input="inputChange" />
				</view>
			</view>
		</view>
		<view :style="{height: statusBarHeight+navBarHeight + 'px'}"></view>
	</view>
</template>

<script>
	export default {
		name: "navbar",
		props: {
			isSearch: {
				type: Boolean,
				default: false
			},
			value: {
				type: [String, Number],
				default: ''
			},
		},
		watch: {
			value(newVal) {
				this.val = newVal
			}
		},
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 45,
				windowWidth: 375,
				val: ''
			};
		},
		created() {
			// 获取手机系统信息
			const info = uni.getSystemInfoSync()
			// 设置状态栏高度
			this.statusBarHeight = info.statusBarHeight

			this.windowWidth = info.windowWidth

			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			// 获取胶囊的位置
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			// （胶囊底部高度 - 状态栏的高度）+（胶囊顶部高度 - 状态栏的高度）= 导航栏的高度
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) +
				(menuButtonInfo.top - info.statusBarHeight)

			this.windowWidth = menuButtonInfo.left
			// #endif
		},
		methods: {
			back() {
				// uni.navigateBack({})
				uni.switchTab({
					url:"/pages/tabbar/index/index"
				})
			},
			open() {
				if (this.isSearch) return
				uni.navigateTo({
					url: '/pages/home-search/home-search'
				})
			},
			inputChange(e) {
				const {
					value
				} = e.detail
				this.$emit('input', value)
			}
		}
	}
</script>

<style lang="scss">
	.navbar {
		.navbar-fixed {
			// 固定在顶部
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			background-color: $mk-base-color;

			.navbar-content {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 15px;
				height: 45px;
				box-sizing: border-box;

				.navbar-search {
					display: flex;
					align-items: center;
					padding: 0 10px;
					width: 100%;
					height: 30px;
					border-radius: 30px;
					background-color: #fff;

					.navbar-search-icon {
						// width: 10px;
						// height: 10px;
						// border: 1px red solid;
						margin-right: 10px;
					}

					.navbar-search-text {
						font-size: 14px;
						color: #999;
						width: 100%;
					}
				}

				&.search {
					padding-left: 0px;

					.navbar-content__search-icons {
						margin-left: 10px;
						margin-right: 10px;
					}

					.navbar-search {
						border-radius: 5px;
					}
				}
			}
		}

	}
</style>
