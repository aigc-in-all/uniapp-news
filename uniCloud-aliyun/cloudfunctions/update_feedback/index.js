'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	const {
		user_id,
		images = [],
		content = ''
	} = event

	await db.collection('feedback').add({
		user_id: user_id,
		images:images,
		content: content
	})
	
	return {
		code: 200,
		msg: 'success'
	}
};
