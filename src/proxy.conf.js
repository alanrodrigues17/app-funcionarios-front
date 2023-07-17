const PROXY_CONFIG = [
    {
        context: [
            '/users',
        ],
        target: "http://localhost:4000/",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            "^/": ""
        }

    }
]

module.exports = PROXY_CONFIG;