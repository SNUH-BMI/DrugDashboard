module.exports = {
    publicPath:'/engine/',
    runtimeCompiler: true,
    devServer: {
        proxy: {
            '/api': {
                target: "http://backendip:8080",
                changeOrigin: true,
            }
        }
    }
};
