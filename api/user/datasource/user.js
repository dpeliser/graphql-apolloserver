const { RESTDataSource } = require('apollo-datasource-rest');

class UsersAPI extends RESTDataSource {

  constructor() {
    super();
    this.baseURL = 'http://localhost:3000';
    this.respostaCustom = {
      code: 200,
      mensagem: 'Operacão efetuada com sucesso',
    };
  }

  async getUsers({ page = 1, limit = 0}) {
    const query = limit ? `/users?_page=${page}&_limit=${limit}` : `/users?_page=${page}`;
    const users = await this.get(query);
    return users.map(async user => {
      const role = await this.get(`/roles/${user.role}`);
      return { ...user, role };
    });
  }

  async getUserById(id) {
    const user = await this.get(`/users/${id}`);
    const role = await this.get(`/roles/${user.role}`);
    return { ...user, role };
  }

  async adicionaUser(user) {
    const users = await this.get('/users');
    user.id = users.length + 1;

    const role = await this.get(`roles?type=${user.role}`);
    user.role = role[0].id;

    await this.post('users', { ...user });

    return {
      ...this.respostaCustom,
      code: 201,
      user: { ...user, role: role[0] },
    };
  }

  async atualizaUser({ id, user }) {
    const role = await this.get(`roles?type=${user.role}`);
    user.role = role[0].id;

    await this.put(`users/${id}`, { ...user });

    return {
      ...this.respostaCustom,
      user: {
        ...user,
        role: role[0],
      },
    };
  }

  async deletaUser(id) {
    await this.delete(`users/${id}`);

    return this.respostaCustom;
  }

};

module.exports = UsersAPI;