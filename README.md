# Gatsby Plugin: Collections

This Gatsby plugin groups nodes into "collections"- distinct groups whose items
are often queried with each other and excluding others, whether within or across
node types. This concept takes heavy inspiration from the static site generator
Hugo.

## Configuration

### collections: Object

This object manually describes Collections- it can be used to give extra context
to certain collections for use in index pages as well as actual
collection-specific configuration for the plugin.

The format is <Key>:<Options>, where Key is a string that matches what a
resolver would output and Options is an arbitrary object that holds
configuration specific to that Collection.

#### Collection Options

**indexSlug:** This string will be used as the path for the index page of the Collection it's under. Falls back to the key if not specified.

In addition, all other options will be added to the Collection node. This can be
useful for providing context to templates involving those Collections.

### resolvers: Object

This object contains functions that are used to determine which collection each
node should be put in.

Each node's type is checked against this object, and the function under that key
will be used to grab the collection key. Alternatively a string can be used as a
key, which will make every node of that type resolve to the string.

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

### CollectionEntry

This node type serves as a link between a node and the Collection it's contained
in. If you want to get all nodes in a certain collection, query these.

#### Fields

- **collection**: A foreign-key relation to the parent Collection.

- **parent**: The node being categorized into a Collection. Access its fields using a fragment, like this:

```graphql
allCollectionEntry{
  nodes{
    parent {
      ... on EntryNodeType{
        entryNodeField
      }
    }
  }
}
```
