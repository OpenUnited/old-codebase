const withImages = require('next-images');
const withLess = require('@zeit/next-less');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css')
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const withPlugins = require('next-compose-plugins');



module.exports = withPlugins([
    [
        withCSS, {
            cssLoaderOptions: {
                url: false
            },
            ...withSass({
            cssModules: true,
            ...withLess({
                lessLoaderOptions: {
                javascriptEnabled: true,
                importLoaders: 0
                },
                cssLoaderOptions: {
                importLoaders: 3,
                localIdentName: '[local]___[hash:base64:5]'
                },
                webpack: (config, { isServer }) => {
                //Make Ant styles work with less
                if (isServer) {
                    const antStyles = /antd\/.*?\/style.*?/;
                    const origExternals = [...config.externals];
                    config.externals = [
                    (context, request, callback) => {
                        if (request.match(antStyles)) return callback();
                        if (typeof origExternals[0] === 'function') {
                        origExternals[0](context, request, callback);
                        } else {
                        callback();
                        }
                    },
                    ...(typeof origExternals[0] === 'function' ? [] : origExternals)
                    ];
        
                    config.module.rules.unshift({
                    test: antStyles,
                    use: 'null-loader'
                    });
                }
                return config;
                }
            })
        })
        }
    ],
    // [
    //     withCSS,
    // ]
    [
        withImages
    ],
    {
      env: {
        APPLICATION_MODE: process.env.APPLICATION_MODE,
        TEST_USER: process.env.TEST_USER,
      },
    }
])