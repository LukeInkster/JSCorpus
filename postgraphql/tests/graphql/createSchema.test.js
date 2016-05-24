import expect from 'expect'
import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import { TestSchema, TestTable } from '../helpers.js'
import createSchema from '#/graphql/createSchema.js'

describe('createSchema', () => {
  it('creates a schema', () => {
    const graphqlSchema = createSchema(new TestSchema())
    expect(graphqlSchema).toBeA(GraphQLSchema)
    expect(graphqlSchema.getQueryType()).toBeA(GraphQLObjectType)
  })

  it('creates single field and list field', () => {
    const schema = new TestSchema()
    schema.catalog.addTable(new TestTable({ schema, name: 'person' }))
    const fields = createSchema(schema).getQueryType().getFields()
    expect(fields).toIncludeKeys(['person', 'personNodes'])
    expect(fields.person.type.name).toEqual('Person')
    expect(fields.personNodes.type.name).toEqual('PersonConnection')
  })

  it('camel cases table names in table fields', async () => {
    const schema = new TestSchema()
    schema.catalog.addTable(new TestTable({ schema, name: 'camel_case_me' }))
    const fields = createSchema(schema).getQueryType().getFields()
    expect(fields).toExcludeKey('camel_case_me')
    expect(fields).toIncludeKeys(['camelCaseMe', 'camelCaseMeNodes'])
  })
})
