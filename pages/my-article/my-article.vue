<template>
	<view>
		<uni-load-more v-if="articleList.length===0" status="loading" iconType="snow"></uni-load-more>
		<list-card v-for="item in articleList" :key="item.id" :item="item"></list-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articleList: []
			}
		},
		onLoad() {
			this.getMyArticle()
		},
		methods: {
			getMyArticle() {
				this.$api.get_my_article().then((res) => {
					const {
						data
					} = res
					this.articleList = data
				})
			}
		}
	}
</script>

<style>

</style>
