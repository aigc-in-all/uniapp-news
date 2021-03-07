<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 模拟已经登录
			this.$api.get_user({
				user_id: '604255aeca5daf00015305ad'
			}).then((res) => {
				console.log(res)
				const {
					data
				} = res
				this.$store.dispatch('set_userinfo', data)
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import 'components/gaoyia-parse/parse.css';
</style>
