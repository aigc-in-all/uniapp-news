// 第一种：手动导出
// import {
// 	get_label,
// 	get_list
// } from './list.js'

// export default {
// 	get_label,
// 	get_list
// }

// 第二种：自动批量导出
const requireApi = require.context(
	// api目录的相对路径
	'.',
	// 是否查询子目录
	false,
	// 查询文件的后缀
	/.js$/
)

let module = {}

requireApi.keys().forEach((key, index) => {
	if (key === './index.js') return
	Object.assign(module, requireApi(key))
})

export default module
