'use strict';

const db = uniCloud.database()
const $ = db.command.aggregate
const dbCmd = db.command

exports.main = async (event, context) => {
	const {
		user_id,
		article_id,
		comment_id, // 评论ID
		content,
		reply_id = "", // 子回复ID
		is_reply = false, // 是否子回复
	} = event

	let user = await db.collection('user').doc(user_id).get()
	user = user.data[0]

	const article = await db.collection('article').doc(article_id).get()
	const comments = article.data[0].comments

	let commentObj = {
		comment_id: getId(5),
		content: content,
		create_time: new Date().getTime(),
		is_reply: is_reply,
		author: {
			author_id: user_id,
			author_name: user.author_name,
			avatar: user.avatar,
			professional: user.professional
		},
		replys: []
	}

	console.log(comment_id)
	// 评论文章
	if (!comment_id) {
		commentObj.replys = []
		commentObj = dbCmd.unshift(commentObj)
	} else { // 回复评论
		let commentIndex = comments.findIndex((item => item.comment_id === comment_id))
		
		let commentAuthor = ''
		if (is_reply) {
			// 子回复
			commentAuthor = comments[commentIndex].replys.find(item=>item.comment_id === reply_id)
		} else {
			commentAuthor = comments.find(item => item.comment_id === comment_id)
		}
		commentAuthor = commentAuthor.author.author_name
		commentObj.to = commentAuthor

		// 更新回复信息
		commentObj = {
			[commentIndex]: {
				replys: dbCmd.unshift(commentObj)
			}
		}
	}

	await db.collection('article').doc(article_id).update({
		comments: commentObj
	})

	return {
		code: 200,
		msg: 'success'
	}
};

function getId(length) {
	return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}
