const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/styles/styles.css', // Entry point for CSS
  output: {
    path: path.resolve(__dirname, '/public/css'), // Output CSS to 'public/css'
    filename: 'dummy.js', // Webpack requires a JS file; this can be ignored
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader', // Process TailwindCSS
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css', // Output CSS file in 'public/css'
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Serve from 'public' directory
    },
    proxy: {
      '/api': 'http://localhost:3000', // Proxy API calls to the backend running on port 3000
    },
    compress: true,
    port: 8080,
    hot: true,
    open: true,
  },
};




// Custom Logging
console.log('Webpack config loaded successfully!');
console.log('Current working directory:', process.cwd());
console.log('PostCSS config path:', path.resolve(__dirname, 'postcss.config.js'));

// Log output directory
console.log('Output will be written to:', path.resolve(__dirname, 'public/js'));

// Log CSS output location
console.log('CSS will be extracted to:', path.resolve(__dirname, 'public/css/styles.css'));
