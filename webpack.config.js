const path = require( 'path' );
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const webpack = require('webpack');
const HtmlCriticalWebpackPlugin = require( 'html-critical-webpack-plugin' );
const modernizr = require( 'modernizr' );

const mode = process.env.NODE_ENV || 'development';
const isDev = mode === "development";

let config = {
    mode: 'development',
    entry: [
        './src/scripts/index.js',
        'webpack-hot-middleware/client'
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        host: '192.168.1.122'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new CleanWebpackPlugin( {
            cleanStaleWebpackAssets: false
        } ),
        new MiniCssExtractPlugin( {
            filename: 'styles.css',
            chunkFilename: '[id].css'
        } ),
        new HtmlWebpackPlugin( {
            template: './src/views/index.html',
            inject: true
        } ),
    ],
    output: {
        filename: '[name].js',
        path: path.resolve( __dirname, 'dist' ),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.(html)$/,
                use: [
                    'html-loader'
                ]
            },
            {
                test: /\.css$/,
                loader: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif|webp)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images',
                            name: '[name].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true,
                            disable: true
                        }
                    }
                ],
            }
        ]
    }
};

!isDev ? config.plugins.push(
    new HtmlCriticalWebpackPlugin( {
        base: path.join(path.resolve( __dirname), './dist'),
        src: 'index.html',
        dest: 'index.html',
        inline: true,
        minify: true,
        extract: true,
        width: 1920,
        height: 1080,
        penthouse: {
            blockJSRequests: false
        }
    } )
) : null;

module.exports = config;