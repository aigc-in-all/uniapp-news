'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	const {
		user_id
	} = event

	if (!user_id) {
		return {
			code: 400,
			msg: '获取失败'
		}
	}

	let userinfo = await db.collection('user').doc(user_id).get()
	userinfo = userinfo.data[0]

	return {
		code: 200,
		msg: 'success',
		data: userinfo
	}
};
