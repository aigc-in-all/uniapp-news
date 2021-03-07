'use strict';

const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
	const {
		user_id,
		article_id
	} = event

	const userinfo = await db.collection('user')
		.doc(user_id)
		.get()
	const article_id_ids = userinfo.data[0].article_likes_ids
	let dbCmdFuns = null
	// 取消收藏
	if (article_id_ids.includes(article_id)) {
		dbCmdFuns = dbCmd.pull(article_id)
	} else {
		// 收藏
		dbCmdFuns = dbCmd.addToSet(article_id)
	}

	await db.collection('user').doc(user_id).update({
		article_likes_ids: dbCmdFuns
	})

	return {
		code: 200,
		msg: 'success',
		data: userinfo.data[0]
	}
};
