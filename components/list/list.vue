<template>
	<swiper class="home-swiper" :current="activeIndex" @change="change">
		<swiper-item v-for="(item, index) in tab" :key="index" class="swiper-item">
			<list-item :list="listCacheData[index]" :load="load[index]" @loadmore="loadmore"></list-item>
		</swiper-item>
	</swiper>
</template>

<script>
	import listItem from './list-item.vue'
	export default {
		name: "list",
		props: {
			tab: {
				type: Array,
				default () {
					return []
				}
			},
			activeIndex: {
				type: Number,
				default: 0
			}
		},
		components: {
			listItem
		},
		data() {
			return {
				list: [],
				// js的限制，listCacheData[index] = data不会触发刷新
				listCacheData: {},
				load: {},
				pageSize: 10
			};
		},
		watch: {
			tab(newVal, oldVal) {
				if (newVal.length === 0) return
				this.listCacheData = {}
				this.load = {}
				this.get_list(this.activeIndex)
			}
		},
		created() {
			uni.$on('update_article', (e) => {
				if (e === 'follow') {
					this.listCacheData = {}
					this.load = {}
					this.get_list(this.activeIndex)
				}
			})
		},
		methods: {
			loadmore() {
				if (this.load[this.activeIndex].loading === 'noMore') return
				this.load[this.activeIndex].page++
				this.get_list(this.activeIndex)
			},
			change(e) {
				const {
					current
				} = e.detail
				this.$emit('change', current)
				// 当数据不存在时才请求数据
				if (!this.listCacheData[current] || this.listCacheData[current].length === 0) {
					this.get_list(current)
				}

			},
			get_list(current) {
				if (!this.load[current]) {
					this.load[current] = {
						page: 1,
						loading: 'loading'
					}

				}
				this.$api.get_list({
					name: this.tab[current].name,
					page: this.load[current].page,
					pageSize: this.pageSize
				}).then((res) => {
					console.log('请求成功：', res)
					const {
						data
					} = res
					if (data.length === 0) {
						let oldLoad = {}
						oldLoad.loading = 'noMore'
						oldLoad.page = this.load[current].page
						this.$set(this.load, current, oldLoad)
						// 强制渲染界面
						this.$forceUpdate()
						return
					}
					var oldList = this.listCacheData[current] || []
					oldList.push(...data)

					// this.list = data

					// 这种方式不会触发页面刷新
					// this.listCacheData[current] = data
					this.$set(this.listCacheData, current, oldList)
				})
			}
		}
	}
</script>

<style lang="scss">
	.home-swiper {
		height: 100%;

		.swiper-item {
			height: 100%;
			overflow: hidden;
		}
	}
</style>
