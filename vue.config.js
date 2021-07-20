module.exports = {
  devServer: {
    overlay: {
      warnings: false,
      errors: false,
    },
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/medium-editor-font-size-button/'
    : '/'  
};
