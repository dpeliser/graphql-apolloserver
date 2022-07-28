const { GraphQLScalarType } = require('graphql');

const userResolvers = {
  RolesType: {
    ESTUDANTE: 'ESTUDANTE',
    DOCENTE: 'DOCENTE',
    COORDENACAO: 'COORDENACAO',
  },

  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'String de data e hora no formato ISO-8601',
    serialize: value => value.toISOString(),
    parseValue: value => new Date(value),
    parseLiteral: ast => new Date(ast.value),
  }),

  Query: {
    users: (root, args, { dataSources }) => dataSources.usersApi.getUsers(args),
    user: (root, { id }, { dataSources }) => dataSources.usersApi.getUserById(id),
  },

  Mutation: {
    adicionaUser: (root, { user }, { dataSources }) => dataSources.usersApi.adicionaUser(user),
    atualizaUser: (root, novosDados, { dataSources }) => dataSources.usersApi.atualizaUser(novosDados),
    deletaUser: (root, { id }, { dataSources }) => dataSources.usersApi.deletaUser(id),
  },

  User: {
    matriculas: (parent, _, { dataSources }) => dataSources.matriculasApi.matriculasLoader.load(parent.id),
  },
};

module.exports = userResolvers;