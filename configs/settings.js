exports.config = {
    site : {
        SITE_NAME : 'Snippets',
        // SITE_STATIC_URL : CDN or ...,
        SITE_STATIC_URL : 'http://127.0.0.1:3000',
    },
    db : {
        DB_HOST : "mongodb://localhost/snippets",
        OPTIONS : {
            server: { poolSize: 10 },
            //replset: { rs_name: 'myReplicaSetName' },
            user: '',
            pass: ''
        }
    },
    SESSION_SECRET : 'XiaoL'
};