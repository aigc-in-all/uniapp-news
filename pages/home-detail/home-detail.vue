<template>
	<view class="detail">
		<view class="detail-title">
			{{formData.title}}
		</view>
		<view class="detail-header">
			<view class="detail-header__logo">
				<image :src="formData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header__content">
				<view class="detail-header__content-title">
					{{formData.author.author_name}}
				</view>
				<view class="detail-header__content-info">
					<text>{{formData.create_time}}</text>
					<text>{{formData.browse_count}} 浏览</text>
					<text>{{formData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button class="detail-header__button" type="default" @click="follow(formData.author.id)">
				{{formData.is_author_like?'取消关注':'关注'}}
			</button>
		</view>
		<view class="detail-content">
			<view class="detail-html">
				<u-parse :content="formData.content" :noData="noData"></u-parse>
			</view>
			<view class="detail-comment">
				<view class="comment-title">最新评论</view>
				<view class="comment-content" v-for="item in commentList" :key="item.comment_id">
					<comments-box :comment="item" @reply="reply"></comments-box>
				</view>
			</view>
		</view>
		<view class="detail-bottom">
			<view class="detail-bottom__input" @click="openComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom__icons">
				<view class="detail-bottom__icons-box" @click="open">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box">
					<uni-icons type="heart" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="thumbsup(formData._id)">
					<uni-icons :type="formData.is_thumbs_up?'hand-thumbsup-filled':'hand-thumbsup'" size="22"
						color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="popup-wrap">
				<view class="popup-header">
					<text class="popup-header__item" @click="closeComment">取消</text>
					<text class="popup-header__item" @click="submitComment">发布</text>
				</view>
				<view class="popup-content">
					<textarea class="popup-content__textarea" v-model="commentsValue" maxlength="200" fixed
						placeholder="请输入评论内容"></textarea>
					<view class="popup-content__count">{{commentsValue.length}}/200</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'

	export default {
		components: {
			uParse
		},
		data() {
			return {
				formData: {},
				noData: '<p style="text-align:center;color:#666">加载中</p>',
				commentsValue: '',
				commentList: [],
				replyFormData: {}
			}
		},
		onLoad(query) {
			// this.formData = JSON.parse(query.params)
			this.formData = JSON.parse(query.params)
			this.getDetail()
			this.getComments()
		},
		onReady() {

		},
		methods: {
			open() {
				uni.navigateTo({
					url: "/pages/detail-comments/detail-comments?id=" + this.formData._id
				})
			},
			thumbsup(article_id) {
				this.setUpdateThumbsup(article_id)
			},
			follow(author_id) {
				this.setUpdateAuthor(author_id)
			},
			getDetail() {
				this.$api.get_detail({
					article_id: this.formData._id
				}).then((res) => {
					const {
						data
					} = res
					this.formData = data
					console.log(data)
				})
			},
			getComments() {
				this.$api.get_comments({
					article_id: this.formData._id
				}).then((res) => {
					const {
						data
					} = res
					this.commentList = data

				})
			},
			openComment() {
				this.$refs.popup.open()
			},
			closeComment() {
				this.$refs.popup.close()
			},
			submitComment() {
				if (!this.commentsValue) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					})
					return
				}
				this.setUpdateComment({
					content: this.commentsValue,
					...this.replyFormData
				})
			},
			setUpdateComment(content) {
				const formData = {
					article_id: this.formData._id,
					...content
				}
				uni.showLoading()
				this.$api.update_comment(formData).then((res) => {
					uni.hideLoading()
					this.closeComment()
					uni.showToast({
						title: '评论发布成功'
					})
					this.commentsValue = ''
					this.replyFormData = {}
					this.getComments()
				}).catch((err) => {
					uni.hideLoading()
					uni.showToast({
						title: '评论失败，请重试',
						icon: 'none'
					})
				})
			},
			setUpdateAuthor(author_id) {
				uni.showLoading()
				this.$api.update_author({
					author_id: author_id
				}).then((res) => {
					uni.hideLoading()
					this.formData.is_author_like = !this.formData.is_author_like
					uni.showToast({
						title: this.formData.is_author_like ? '关注成功' : '取消关注成功',
						icon: 'none'
					})
					uni.$emit('update_author')
				}).catch((err) => {
					uni.hideLoading()
				})
			},
			setUpdateThumbsup(article_id) {
				uni.showLoading()
				this.$api.update_thumbsup({
					article_id: article_id
				}).then((res) => {
					uni.hideLoading()
					this.formData.is_thumbs_up = true
					this.formData.thumbs_up_count++
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}).catch((err) => {
					uni.hideLoading()
				})
			},
			reply(comment) {
				this.replyFormData = {
					"comment_id": comment.comment.comment_id,
					"is_reply": comment.is_reply
				}
				if (comment.comment.reply_id) {
					this.replyFormData.reply_id = comment.comment.reply_id
				}
				// console.log(this.replyFormData)
				this.openComment()
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		padding: 15px 0;
		padding-bottom: 54px;

		.detail-title {
			padding: 0 15px;
			font-size: 18px;
			font-weight: bold;
			color: #333;
		}

		.detail-header {
			display: flex;
			align-items: center;
			margin-top: 10px;
			padding: 0 15px;

			.detail-header__logo {
				flex-shrink: 0;
				width: 40px;
				height: 40px;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.detail-header__content {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				font-size: 12px;
				padding-left: 10px;

				.detail-header__content-title {
					font-size: 14px;
					color: #333;
				}

				.detail-header__content-info {
					color: #999;

					text {
						margin-right: 10px;
					}
				}
			}

			.detail-header__button {
				flex-shrink: 0;
				height: 30px;
				font-synthesis: 12px;
				background-color: $mk-base-color;
				color: #fff;
			}
		}

		.detail-content {
			margin-top: 20px;
			min-height: 500px;

			.detail-html {
				padding: 0 15px;
			}

			.detail-comment {
				margin-top: 30px;

				.comment-title {
					padding: 10px 15px;
					font-size: 14px;
					color: #666;
					border-bottom: 1px #f5f5f5 solid;
				}

				.comment-content {
					padding: 0 15px;
					border-top: 1px #eee solid;
				}
			}
		}

		.detail-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			align-items: center;
			width: 100%;
			height: 44px;
			bottom: 1px #f5f5f5 solid;
			background-color: #fff;
			box-sizing: border-box;

			.detail-bottom__input {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-left: 10px;
				padding: 0 10px;
				width: 100%;
				height: 30px;
				border: 1px #ddd solid;
				border-radius: 5px;

				text {
					font-size: 14px;
					color: #999;
				}
			}

			.detail-bottom__icons {
				display: flex;
				flex-shrink: 0;
				padding: 0 12px;

				.detail-bottom__icons-box {
					position: relative;
					display: flex;
					align-items: center;
					width: 44px;
				}
			}
		}

		.popup-wrap {
			background-color: #fff;

			.popup-header {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5f5 solid;

				.popup-header__item {
					height: 50px;
					line-height: 50px;
					padding: 0 15px;
				}
			}

			.popup-content {
				width: 100%;
				padding: 15px;
				box-sizing: border-box;

				.popup-content__textarea {
					width: 100%;
					height: 200px;
				}

				.popup-content__count {
					display: flex;
					justify-content: flex-end;
					font-size: 12px;
					color: #999;
				}
			}
		}
	}
</style>
