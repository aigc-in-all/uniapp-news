'use strict';

const db = uniCloud.database()
const $ = db.command.aggregate

exports.main = async (event, context) => {

	const {
		user_id,
		article_id
	} = event

	let user = await db.collection('user').doc(user_id).get()
	user = user.data[0]
	let list = await db.collection('article')
		.aggregate()
		.addFields({
			// 是否关注作者
			is_author_like: $.in(['$author.id', user.author_likes_ids]),
			// 是否收藏文章
			is_author_like: $.in(['_id', user.article_likes_ids]),
			// 是否点赞
			is_thumbs_up: $.in(['$_id', user.thumbs_up_article_ids])
		})
		.match({
			_id: article_id
		})
		.project({
			comments: 0
		})
		.end()

	return {
		code: 200,
		msg: 'success',
		data: list.data[0]
	}
};
