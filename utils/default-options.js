const defaultOptions = {
  collections: {},
  resolvers: {},

  createPages: true,
  indexTemplate: "src/templates/collection"
};

const withDefaults = options => ({ ...defaultOptions, ...options });

module.exports = {
  defaultOptions,
  withDefaults
};
