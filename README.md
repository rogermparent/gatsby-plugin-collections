# Gatsby Theme: MDX Collections

This Gatsby theme sits on top of `gatsby-theme-mdx-pages`, expanding on it and
its Hugo inspiration by implementing "collections"- distinct groups of content
that share commonalities with each other which aren't necessarily shared between
other groups.

For instance, in a blog, there is a separation between the date-based content
"posts" and regular pages like "about" or "contact". This theme aims to make
implementing that separation a first-class concern.

## Configuration

On top of the options specific to this theme, all provided options are also
passed through to the underlying `gatsby-theme-mdx-pages` instance.

### collections: object

While collections will be automatically parsed from top-level subdirectories of
the directory specified by contentDir, they may also be manually defined to add
extra context and configuration to the resulting `Collection` nodes.

### getCollection: function({ node, getNode })

This function is used by the theme to get the key of the collection each
particular `MdxPage` node is under. It recieves the `MdxPage` node in question,
and also has access to Gatsby's `getNode` to reach into other nodes, like the
`Mdx` or `File` nodes above it.

### createPages: boolean

If set to false, the `createPages` callback will be aborted. Useful for
implementing your own `createPages` while still using nodes made by this theme.

### templateDirectory: string

The directory where template components are located, relative to the site's
root. defaults to "src/templates".

This is also passed to `gatsby-theme-mdx-pages`

### defaultTemplate: string

The path of the template that pages will fall back on if their specified
template cannot be found.

Defaults to "default", making the default default template
"src/templates/default.js".

### getTemplateComponent: function({ node, defaultTemplate, templateDirectory, collection })

If provided, this function will override the default one that searches for a
component given an `MdxPage` node, its collection, and the defaultTemplate and
templateDirectory settings

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

This node type serves as a link between an `MdxPage` and the `Collection` it's
contained in. If you want to get all nodes in a certain collection, query these.

#### Fields

- **collection**: A direct link to the `Collection` node.

- **page**: A direct link to the `MdxPage` node.
