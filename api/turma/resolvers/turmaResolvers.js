const { GraphQLScalarType } = require('graphql');

const turmaResolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'String de data e hora no formato ISO-8601',
    serialize: value => value.toISOString(),
    parseValue: value => new Date(value),
    parseLiteral: ast => new Date(ast.value),
  }),

  Query: {
    turmas: (_, args, { dataSources }) => dataSources.turmasApi.getTurmas(args),
    turma: (_, { id }, { dataSources }) => dataSources.turmasApi.getTurma(id),
  },

  Mutation: {
    incluiTurma: (_, {turma}, { dataSources }) => dataSources.turmasApi.incluiTurma(turma),
    atualizaTurma: (_, novosDados, { dataSources }) => dataSources.turmasApi.atualizaTurma(novosDados),
    deletaTurma: (_, { id }, { dataSources }) => dataSources.turmasApi.deletaTurma(id),
  },

  Turma: {
    matriculas: (parent, _, { dataSources }) => dataSources.matriculasApi.getMatriculasPorTurma(parent.id),
    docente: (parent, _, { dataSources }) => dataSources.usersApi.getUserById(parent.docente_id),
  },
};

module.exports = turmaResolvers;