const { GraphQLScalarType } = require('graphql');

const matriculaResolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'String de data e hora no formato ISO-8601',
    serialize: value => value.toISOString(),
    parseValue: value => new Date(value),
    parseLiteral: ast => new Date(ast.value),
  }),

  Mutation: {
    matricularEstudante: (_, ids, { dataSources }) => dataSources.matriculasApi.matricularEstudante(ids),
    deletarMatricula: (_, { matricula }, { dataSources }) => dataSources.matriculasApi.deletarMatricula(matricula),
    cancelarMatricula: (_, { matricula }, { dataSources }) => dataSources.matriculasApi.cancelarMatricula(matricula),
  },

  Matricula: {
    estudante: (parent, _, { dataSources }) => dataSources.usersApi.getUserById(parent.estudante_id),
    turma: (parent, _, { dataSources }) => dataSources.turmasApi.getTurmasCarregadas.load(parent.turma_id),
  },
};

module.exports = matriculaResolvers;