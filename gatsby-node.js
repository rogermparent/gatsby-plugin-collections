const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const { withDefaults } = require("./utils/default-options");
const {
  buildCollectionId,
  createCollectionNode,
  getOrCreateCollectionNode,
  createCollectionEntryNode
} = require("./utils/node-builders.js");

exports.createSchemaCustomization = ({ actions, schema }, pluginOptions) => {
  const { createTypes, createFieldExtension } = actions;

  createTypes([
    schema.buildObjectType({
      name: `Collection`,
      fields: {
        id: { type: `ID!` },
        key: { type: `String!` },
        indexSlug: { type: `String!` },
        label: { type: `String` }
      },
      interfaces: [`Node`]
    }),
    schema.buildObjectType({
      name: `CollectionEntry`,
      fields: {
        id: { type: `ID!` },
        collection: {
          type: `Collection`,
          extensions: {
            link: {}
          }
        }
      },
      interfaces: [`Node`]
    })
  ]);
};

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, getNodesByType },
  pluginOptions
) => {
  const { collections } = withDefaults(pluginOptions);
  const { createNode, touchNode } = actions;

  const collectionNodes = getNodesByType(`Collection`);
  if (collectionNodes) {
    for (const collection of collectionNodes) {
      touchNode({ nodeId: collection.id });
    }
  }

  for (const collectionKey in collections) {
    const collectionOptions = collections[collectionKey];
    const collectionId = createNodeId(buildCollectionId(collectionKey));
    await createCollectionNode({
      createNode,
      createContentDigest,
      id: collectionId,
      collectionKey,
      collectionOptions
    });
  }
};

exports.onCreateNode = async (
  { node, actions, getNode, createNodeId, createContentDigest },
  pluginOptions
) => {
  const options = withDefaults(pluginOptions);
  const { createNode, createParentChildLink } = actions;
  const { collections, resolvers } = options;

  const resolver = resolvers[node.internal.type];
  if (!resolver) return;

  const collection = resolver({ node, getNode, options });
  if (!collection) return;

  const collectionNode = await getOrCreateCollectionNode({
    getNode,
    createNode,
    createContentDigest,
    id: createNodeId(buildCollectionId(collection)),
    collectionKey: collection,
    collectionOptions: options.collections[collection]
  });

  await createCollectionEntryNode({
    createNode,
    createContentDigest,
    createParentChildLink,
    id: createNodeId(`CollectionEntry >>> ${collection} >>> ${node.id}`),
    collectionNode,
    entryNode: node
  });
};

exports.createPages = async ({ actions, graphql, store }, pluginOptions) => {
  if (pluginOptions.createPages === false) return;

  const { indexTemplate } = withDefaults(pluginOptions);
  const programDirectory = store.getState().program.directory;

  const query = await graphql(`
    query CollectionIndexesQuery {
      allCollection {
        nodes {
          indexSlug
          id
        }
      }
    }
  `);

  for (const collection of query.data.allCollection.nodes) {
    actions.createPage({
      component: require.resolve(path.join(programDirectory, indexTemplate)),
      path: collection.indexSlug,
      context: { id: collection.id }
    });
  }
};
