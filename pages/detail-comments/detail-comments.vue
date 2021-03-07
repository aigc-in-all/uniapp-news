<template>
	<view>
		<view class="comment-content" v-for="item in commentList" :key="item.comment_id">
			<comments-box :comment="item"></comments-box>
		</view>
		<uni-load-more v-if="commentList.length === 0 || commentList.length > 5" iconType="snow" status="loading">
		</uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				article_id: '',
				commentList: [],
				page: 1,
				pageSize: 5,
				loading: 'loading'
			}
		},
		onLoad(query) {
			this.article_id = query.id
			this.getComments()
		},
		onReachBottom() {
			if (this.loading === 'noMore') return
			this.page++
			this.getComments()
		},
		methods: {
			getComments() {
				this.$api.get_comments({
					article_id: this.article_id,
					page: this.page,
					pageSize: this.pageSize
				}).then((res) => {
					const {
						data
					} = res
					if (data.length === 0) {
						this.loading = 'noMore'
						return
					}
					// 对象复制
					let oldForData = JSON.parse(JSON.stringify(this.commentList))
					oldForData.push(...data)
					this.commentList = oldForData
				})
			}
		}
	}
</script>

<style lang="scss">
	.comment-content {
		padding: 0 15px;
	}
</style>
