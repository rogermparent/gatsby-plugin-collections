const buildCollectionId = collection => `Collection >>> ${collection}`;

const createCollectionNode = async ({
  createNode,
  id,
  createContentDigest,
  collectionKey,
  collectionOptions = {}
}) => {
  const collectionFields = {
    ...collectionOptions,
    key: collectionKey,
    indexSlug: collectionOptions.indexSlug || collectionKey
  };

  const collectionNode = {
    ...collectionFields,
    // Required fields.
    id,
    children: [],
    internal: {
      type: `Collection`,
      contentDigest: createContentDigest(collectionFields),
      description: `A representation of a Collection`
    }
  };

  createNode(collectionNode);
  return collectionNode;
};

const getOrCreateCollectionNode = async args => {
  const { getNode, id } = args;

  const oldCollectionNode = getNode(id);
  if (oldCollectionNode) {
    return oldCollectionNode;
  } else {
    return await createCollectionNode(args);
  }
};

const createCollectionEntryNode = async ({
  createNode,
  createContentDigest,
  createParentChildLink,
  id,
  collectionNode,
  entryNode
}) => {
  const collectionEntryFields = {
    collection: collectionNode.id,
    parent: entryNode.id
  };

  const collectionEntryNode = {
    ...collectionEntryFields,
    // Required fields.
    id,
    children: [],
    internal: {
      type: `CollectionEntry`,
      contentDigest: createContentDigest(collectionEntryFields),
      description: `A representation of a CollectionEntry`
    }
  };

  createParentChildLink({ child: collectionEntryNode, parent: entryNode });

  return createNode(collectionEntryNode);
};

module.exports = {
  createCollectionNode,
  createCollectionEntryNode,
  getOrCreateCollectionNode,
  buildCollectionId
};
