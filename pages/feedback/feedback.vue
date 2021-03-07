<template>
	<view>
		<view class="feedback-title">意见反馈</view>
		<view class="feedback-contnt">
			<textarea class="feedback-textarea" value="" v-model="content" placeholder="请输入您要反馈的内容"></textarea>
		</view>
		<view class="feedback-title">反馈图片</view>
		<view class="feedback-image-box">
			<view class="feedback-image-item" v-for="(item, index) in imageList" :key="index">
				<view class="close-icon" @click="del(index)">
					<uni-icons type="closeempty" size="18" color="#fff"></uni-icons>
				</view>
				<view class="image-box">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
			</view>
			<view v-if="imageList.length < 5" class="feedback-image-item" @click="addImage">
				<view class="image-box">
					<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
				</view>
			</view>
		</view>
		<button class="feedback-button" type="primary" @click="submit">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				imageList: []
			}
		},
		methods: {
			del(index) {
				this.imageList.splice(index, 1)
			},
			addImage() {
				const count = 5 - this.imageList.length
				uni.chooseImage({
					count: count,
					success: (res) => {
						const tempFilePaths = res.tempFilePaths
						tempFilePaths.forEach((item, index) => {
							// 处理H5多选的情况
							if (index < count) {
								this.imageList.push({
									url: item
								})
							}
						})
					}
				})
			},
			async submit() {
				uni.showLoading()
				let imagePath = []
				// 每次只能上传一张图片
				for (let i = 0; i < this.imageList.length; i++) {
					const filePath = this.imageList[i].url
					filePath = await this.uploadFiles(filePath)
					imagePath.push(filePath)
				}
				this.updateFeedback({
					content: this.content,
					images: imagePath
				})
			},
			async uploadFiles(filePath) {
				const result = await uniCloud.uploadFile({
					filePath: filePath,
					cloudPath: Date.now() + ".jpg"
				})
				return result.fileID
			},
			updateFeedback({
				content,
				images
			}) {
				console.log(content)
				console.log(images)
				this.$api.update_feedback({
					content,
					images
				}).then((res) => {
					uni.hideLoading()
					uni.showToast({
						title: '反馈成功',
						icon: 'none'
					})
					setTimeout(() => {
						uni.switchTab({
							url: "/pages/tabbar/my/my"
						})
					}, 1000)
				}).catch((err) => {
					uni.hideLoading()
					uni.showToast({
						title: '反馈失败，请重试',
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.feedback-title {
		font-size: 14px;
		margin: 15px;
		margin-bottom: 0;
		color: #666;
	}

	.feedback-contnt {
		margin: 15px;
		padding: 10px;
		box-sizing: border-box;
		border: 1px #eee solid;

		.feedback-textarea {
			font-size: 12px;
			width: 100%;
			height: 100px;
		}
	}

	.feedback-image-box {
		display: flex;
		flex-wrap: wrap;
		padding: 10px;

		.feedback-image-item {
			position: relative;
			width: 33.33%;
			height: 0;
			padding-top: 33.33%;
			box-sizing: border-box;

			.close-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				right: 0;
				top: 0;
				width: 22px;
				height: 22px;
				border-radius: 50%;
				background-color: #ff5a5f;
				z-index: 2;
			}

			.image-box {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				top: 5px;
				right: 5px;
				left: 5px;
				bottom: 5px;
				border: 1px #eee solid;
				border-radius: 5px;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.feedback-button {
		margin: 0 15px;
		background-color: $mk-base-color;
	}
</style>
