'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	const {
		user_id,
		label = []
	} = event

	await db.collection('user').doc(user_id).update({
		label_ids: label
	})

	return {
		code: 200,
		msg: 'success',
	}
};
