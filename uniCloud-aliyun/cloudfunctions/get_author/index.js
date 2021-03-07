'use strict';

const db = uniCloud.database()
const $ = db.command.aggregate

exports.main = async (event, context) => {
	const {
		user_id
	} = event

	let userinfo = await db.collection('user').doc(user_id).get()
	userinfo = userinfo.data[0]

	let list = await db.collection('user')
		.aggregate()
		.addFields({
			is_like: $.in(['$id', userinfo.author_likes_ids])
		})
		.match({
			is_like: true
		})
		.end()

	return {
		code: 200,
		msg: 'success',
		data: list.data
	}
};
