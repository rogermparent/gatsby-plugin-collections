# Gatsby Plugin: Collections

This Gatsby plugin groups nodes into "collections"- distinct groups that share
commonalities which aren't necessarily shared with items outside the group. This
concept takes heavy inspiration from the static site generator Hugo.

For instance, in a blog, there is a separation between the date-based content
"posts" and regular pages like "about" or "contact", despite all of them being
the same type of node. This plugin aims to make implementing that separation a
first-class concern.

This plugin was formerly known as `@arrempee/gatsby-theme-mdx-collections`, but
it only took minimal changes to allow for the existing logic to apply to any
node type while still being usable by `@arrempee/gatsby-theme-mdx-blog`.

## Configuration

### collections: object

While collections will be automatically parsed from top-level subdirectories of
the directory specified by contentDir, they may also be manually defined to add
extra context and configuration to the resulting `Collection` nodes.

### collectionResolvers: object

This object contains functions that are used to determine which collection any
node should be put in. Each node's `internal.type` property is checked against
this object, and the function under that key will be used to grab the collection key.

The functions that are this object's values recieve the node of the key's type,
and also has access to Gatsby's `getNode` to reach into other nodes, like a
parent `File` node.

## Node Types

### Collection

This node represents a Collection, and holds any Collection-level settings.  
One will be made for each top-level subdirectory in the contentDir.

Only one field will always be present: the **key** string that represents the 
name of the collection's directory and/or the key its configuration is under in 
the `collection` config object.

Any fields specified in a manual configuration will be added directly to the
resulting node, except `key`, which will be overwritten.

### CollectionEntry

This node type serves as a link between a node and the `Collection` it's
contained in. If you want to get all nodes in a certain collection, query these.

#### Fields

- **collection**: A direct link to the `Collection` node.

- **entry**: A direct link to the node this entry represents. It could be any
  type, or even one of multiple depending on your configuration.
