const { SQLDataSource } = require('datasource-sql');
const DataLoader = require('dataloader');

class MatriculasAPI extends SQLDataSource {

    constructor(dbConfig) {
      super(dbConfig);
      this.resposta = {
        mensagem: '',
      };
    }

    async matricularEstudante(ids) {
      const novaMatricula = {
        estudante_id: ids.estudante,
        turma_id: ids.turma,
        status: 'confirmado',
      };

      await this.db.insert(novaMatricula).into('matriculas');

      this.resposta.mensagem = 'Matrícula confirmada';
      return this.resposta;
    }

    async getMatriculasPorTurma(turma_id) {
      return await this.db.select('*').from('matriculas').where({ turma_id });
    }

    matriculasLoader = new DataLoader(this.getMatriculasPorEstudante.bind(this))

    async getMatriculasPorEstudante(estudanteIds) {
      const matriculas = await this.db.select('*').from('matriculas').whereIn('estudante_id', estudanteIds);
      const result = estudanteIds.map(id => matriculas.filter(matricula => matricula.estudante_id === id));
      console.log(result)
      return result;
    }

    async deletarMatricula(idMatricula) {
      await this.db('matriculas').where({ id: Number(idMatricula) }).del();
   
      this.resposta.mensagem = 'Registro deletado com sucesso';
      return this.resposta;
    }

    async cancelarMatricula(idMatricula) {
      await this.db.update({ status: 'cancelado' }).where({ id: Number(idMatricula) }).into('matriculas');
   
      this.resposta.mensagem = "Matrícula cancelada com sucesso";
      return this.resposta;
    }

};

module.exports = MatriculasAPI;