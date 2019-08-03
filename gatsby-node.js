const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { getFirstResolvableComponent } = require('@arrempee/gatsby-helpers');

exports.sourceNodes = ({ actions, schema, createNodeId }, {
    collections = {},
    contentDir = "content"
}) => {
    // Pre-define the required Mdx frontmatter and fields properties.
    // This prevents the site from breaking if no pages have them defined.
    const {createTypes, createNode} = actions;
    const types = [
        schema.buildObjectType({
            name: `CollectionEntry`,
            interfaces: [`Node`],
            fields: {
                collection: {
                    type: `Collection!`,
                    extensions: {
                        link: {
                            by: 'key'
                        }
                    },
                }
            }
        }),
        schema.buildObjectType({
            name: `Collection`,
            interfaces: [`Node`],
            fields: {
                key: `String!`,
            }
        }),
    ];
    createTypes(types);

    /* Grab all directories in the contentDir, then add any which aren't
     * manually specified to the list as option-less collections.
     */
    for(const dirent of fs.readdirSync(
        path.join(process.cwd(), contentDir),
        { withFileTypes: true }
    )) {
        if(dirent.isDirectory()){
            collections[dirent.name] = collections[dirent.name] || null
        }
    }

    for(collectionKey in collections) {
        const collectionConfig = collections[collectionKey];

        const fieldData = {
            ...collectionConfig,
            key: collectionKey,
        };

        const collectionNode = {
            ...fieldData,
            // Required fields
            id: createNodeId(`CollectionNode >>> ${collectionKey}`),
            children: [],
            internal: {
                type: `Collection`,
                contentDigest: crypto
                    .createHash(`md5`)
                    .update(JSON.stringify(fieldData))
                    .digest(`hex`),
                content: JSON.stringify(fieldData),
                description: `custom configuration pertaining to a collection`
            }
        };

        createNode(collectionNode);
    }
};

exports.onCreateNode = ({
    node,
    getNode,
    createNodeId,
    actions: {
        createNode,
        createParentChildLink
    }
}, {
    collectionResolvers = {}
}) => {

    const getCollection = collectionResolvers[node.internal.type];

    if(getCollection) {
        const fieldData = {
            collection: getCollection({node, getNode}),
            page___NODE: node.id
        };

        const collectionEntryNode = {
            ...fieldData,
            // Required fields
            id: createNodeId(`${node.id} >>> CollectionEntry`),
            parent: node.id,
            children: [],
            internal: {
                type: `CollectionEntry`,
                contentDigest: crypto
                    .createHash(`md5`)
                    .update(JSON.stringify(fieldData))
                    .digest(`hex`),
                content: JSON.stringify(fieldData),
                description: `A stub grouping an MDX page in a collection.`
            }
        };

        createNode(collectionEntryNode);
        createParentChildLink({parent: node, child: collectionEntryNode});
    }
};
