module.exports = themeOptions => ({
  plugins: [
    {
      resolve: '@arrempee/gatsby-theme-mdx-pages',
      options: {
        ...themeOptions,
        createPages: false
      }
    },
  ],
});
