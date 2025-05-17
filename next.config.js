// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.worker\.ts$/,
            use: { loader: "worker-loader" },
        });

        config.module.rules.push({
            test: /\.node$/,
            use: [{ loader: "node-loader" }],
        });

        config.resolve.alias = {
            ...config.resolve.alias,
            "onnxruntime-web": isServer
                ? "onnxruntime-node"
                : "onnxruntime-web",
        };

        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
            perf_hooks: false,
            crypto: false,
        };

        config.performance = {
            ...config.performance,
            maxAssetSize: 8000000,
            maxEntrypointSize: 8000000,
        };

        return config;
    },

    output: "standalone",
};

module.exports = nextConfig;
