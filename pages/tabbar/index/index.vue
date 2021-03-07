<template>
	<view class="home">
		<navbar></navbar>
		<tab :list="tabList" :tabIndex="tabIndex" @tab="tab"></tab>
		<view class="home-list">
			<list :tab="tabList" :activeIndex="activeIndex" @change="change"></list>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				title: 'Hello',
				tabList: [],
				tabIndex: 0,
				activeIndex: 0
			}
		},
		computed: {
			...mapState(['userinfo'])
		},
		watch:{
			userinfo(newVal, oldVal) {
				this.getLabel()
			}
		},
		onLoad() {
			// 自定义事件
			uni.$on('labelChange', (res) => {
				this.tabList = []
				this.tabIndex = 0
				this.activeIndex = 0
				this.getLabel()
			})
			
		},
		methods: {
			tab({
				data,
				index
			}) {
				this.activeIndex = index
			},
			change(current) {
				this.tabIndex = current
				this.activeIndex = current
			},
			getLabel() {
				this.$api.get_label().then((res) => {
					const {
						data
					} = res
					data.unshift({
						name: '全部'
					})
					console.log(data)
					this.tabList = data
				}).catch((err) => {
					console.log(err)
				})
			}

		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;

		.home-list {
			flex: 1;
			box-sizing: border-box;
		}
	}
</style>
