'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	const {
		user_id,
		article_id
	} = event

	const list = await db.collection('article')
		.aggregate()
		.match({
			_id: article_id
		})
		.unwind('$comments') // 文档拆分
		.project({
			_id: 0,
			comments: 1 // 只返回comments
		})
		.replaceRoot({
			newRoot: '$comments'
		})
		.end()

	return {
		code: 200,
		msg: 'succes',
		data: list.data
	}
};
