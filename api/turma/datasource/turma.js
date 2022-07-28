const { SQLDataSource } = require("datasource-sql");
const DataLoader = require('dataloader')

class TurmasAPI extends SQLDataSource {
  constructor(dbConfig) {
    super(dbConfig);
    this.resposta = {
      mensagem: "",
    };
  }

  getTurmasCarregadas = new DataLoader(async idsTurmas => {
    const turmas = await this.db.select('*').from('turmas').whereIn('id', idsTurmas);

    return idsTurmas.map(id => turmas.find(turma => turma.id === id));
  })

  async getTurmas({ page = 0, pageOffset = Infinity }) {
    const offset = page === 0 || page === 1 ? 0 : (page * pageOffset) - 1;
    return this.db.select("*").from("turmas").offset(offset).limit(pageOffset);
  }

  async getTurma(id) {
    const turma = await this.db
      .select("*")
      .from("turmas")
      .where({ id: Number(id) });
    return turma[0];
  }

  async incluiTurma(novaTurma) {
    const novaTurmaId = await this.db
      .insert(novaTurma)
      .returning("id")
      .into("turmas");

    const turmaInserida = await this.getTurma(novaTurmaId[0]);
    return { ...turmaInserida };
  }

  async atualizaTurma(novosDados) {
    await this.db
      .update({ ...novosDados.turma })
      .where({ id: Number(novosDados.id) })
      .into("turmas");

    const turmaAtualizada = await this.getTurma(novosDados.id);
    return {
      ...turmaAtualizada,
    };
  }

  async deletaTurma(id) {
    await this.db("turmas").where({ id: id }).del();

    this.resposta.mensagem = "Registro deletado";
    return this.resposta;
  }
}

module.exports = TurmasAPI;
