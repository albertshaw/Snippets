exports.config = {
	site : {
		SITE_NAME : "XL's Life Snippets",
		// SITE_STATIC_URL : CDN or ...,
		SITE_STATIC_URL : 'http://127.0.0.1:3000',
		SITE_DESC : 'XL的个人博客，有关技术，有关生活',
		SITE_KEYS : '个人博客, 生活, 技术, 宅, 开发, blog, markdown, mongodb, node, express, nodejs, js, javascript, css, html',
		SITE_AUTHOR : 'AlbertShaw',
		SITE_AUTHOR_EMAIL : 'albertshaw@outlook.com'
	},
	db : {
		DB_HOST : "mongodb://localhost/snippets",
		OPTIONS : {
			server : {
				poolSize : 10
			},
			// replset: { rs_name: 'myReplicaSetName' },
			user : '',
			pass : ''
		}
	},
	SESSION_SECRET : 'XiaoL_'
};