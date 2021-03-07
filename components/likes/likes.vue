<template>
	<view class="icons" @click.stop="likeTap">
		<uni-icons size="20" color="#f07373" :type="like? 'heart-filled':'heart'"></uni-icons>
	</view>
</template>

<script>
	export default {
		name: "likes",
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				like: false
			};
		},
		created() {
			this.like = this.item.is_like
		},
		watch: {
			item(newVal) {
				this.like = this.item.is_like
			}
		},
		methods: {
			likeTap() {
				this.like = !this.like
				this.setUpdateLikes()
			},
			setUpdateLikes() {
				uni.showLoading()
				this.$api.update_likes({
					article_id: this.item._id
				}).then((res) => {
					uni.hideLoading()
					uni.showToast({
						title: this.like ? '收藏成功' : '已取消收藏',
						icon: 'none'
					})
					console.log('收藏成功', res)
				}).catch((err) => {
					uni.hideLoading()
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.icons {
		position: absolute;
		right: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
	}
</style>
