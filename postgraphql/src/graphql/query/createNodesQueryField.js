import createConnectionType from '../createConnectionType.js'
import createConnectionArgs from '../createConnectionArgs.js'
import resolveConnection from '../resolveConnection.js'

/**
 * Gets the Relay connection specification compliant list field for a `Table`.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createNodesQueryField = table => ({
  // Make sure the type of this field is our connection type. This connection
  // type will expect functions (that cache their values) and not traditional
  // values. This improves performance when we don’t have to do potentially
  // expensive queries on fields we don’t actually need.
  type: createConnectionType(table),

  description:
    'Queries and returns a set of items with some metatadata for ' +
    `${table.getMarkdownTypeName()}. Note that cursors will not work ` +
    'across different `orderBy` values. If you want to reuse a cursor, make ' +
    'sure you don’t change `orderBy`.',

  args: createConnectionArgs(table),

  resolve: resolveConnection(table),
})

export default createNodesQueryField
