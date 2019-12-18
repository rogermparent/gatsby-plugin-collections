# Gatsby Plugin: Collections

This Gatsby plugin groups nodes into "collections"- distinct groups are often
queried with each other for one reason or another. This concept takes heavy
inspiration from the static site generator Hugo.

## Configuration

### collections: object

This object manually describes Collections- it can be used to give extra context to certain collections for use in index pages as well as actual collection-specific configuration for the plugin.

The format is <Collection Key>:<Options>, where the Collection Key is a string that matches what a Resolver would output and Options is an arbitrary object that holds configuration specific to that Collection.

### collectionResolvers: object

This object contains functions that are used to determine which collection any
node should be put in. Each node's `internal.type` property is checked against
this object, and the function under that key will be used to grab the collection key.

The functions that are this object's values receive an object with the following arguments:

**node**: A Node whose type matches this function's key  
**getNode**: The `getNode` function from Gatsby, for reaching into other nodes like `File`-type parents.  
**options**: The whole configuration object provided to the plugin, with default fields filled in.

## Node Types

### Collection

This node represents a Collection, and holds any Collection-level settings.  
One is made for each collection, whether it be manually specified or automatically generated.

#### Fields

- **key**: This string is what the resolver of each entry returned, and generally the best way to access Collection nodes other than the actual node ID.

- **indexSlug**: This string is what this Collection's index pages will be rendered under. If this isn't provided in the Collection's options, it will default to be the same as the key.

- **label**: A "human-friendly" string to identify this collection, mostly used for rendering purposes. Pulls from the Collection options and defaults to null, but won't break queries asking for it if no Collection has one.

- **options**: A fully Gatsby-inferred object that contains all of this Collection's options. Provided as a sort of "escape hatch" for quick-and-dirty feature addition- if you find yourself using it, consider manually specifying the field with `createSchemaCustomization` or `createNodeField`.


### CollectionEntry

This node type serves as a link between a node and the `Collection` it's
contained in. If you want to get all nodes in a certain collection, query these.

#### Fields

- **collection**: A direct link to the Collection node by ID.

- **parent**: The node being categorized into a Collection. Access its fields using conditional fragments, like this:

```graphql
allCollectionEntry{
  nodes{
    collection{
      key
    }
    parent {
      ... on EntryNodeType{
        entryNodeField
      }
    }
  }
}
```
