'use strict';

const db = uniCloud.database()
const $ = db.command.aggregate

exports.main = async (event, context) => {
	const {
		user_id,
		name,
		page = 1,
		pageSize = 10
	} = event

	let matchObj = {}
	if (name !== '全部') { // '全部'是本地添加的标签
		matchObj = {
			classify: name
		}
	}

	// 方式一：简单查找
	// const list = await db.collection('article')
	// 	.field({
	// 		// true表示只返回这个字段，false表示不返回
	// 		content: false
	// 	})
	// 	.get()
	
	const userinfo = await db.collection('user').doc(user_id).get()
	const article_likes_ids = userinfo.data[0].article_likes_ids

	// 方式二：聚合: 更精细化的处理数据,求和/分组/指定哪些字段	
	const list = await db.collection('article')
		.aggregate()
		// 追加字段
		.addFields({
			is_like: $.in(['$_id', article_likes_ids])
		})
		.match(matchObj)
		.project({
			// 0 或 false 都表示不传
			content: 0
		})
		.skip(pageSize * (page - 1))
		.limit(pageSize)
		.end()

	return {
		code: 200,
		msg: 'success',
		data: list.data
	}
};
