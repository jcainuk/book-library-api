const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => {
    try {
      await Book.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });
  beforeEach(async () => {
    try {
      await Book.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });
  describe('POST /books', async () => {
    it('creates a new book in the database', async () => {
      const response = await request(app).post('/books').send({
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'science-fiction',
        ISBN: '9780450011849',
      });
      await expect(response.status).to.equal(201);
      expect(response.body.title).to.equal('Dune');
      const insertedBookRecords = await Book.findByPk(response.body.id, { raw: true });
      expect(insertedBookRecords.title).to.equal('Dune');
      expect(insertedBookRecords.author).to.equal('Frank Herbert');
      expect(insertedBookRecords.genre).to.equal('science-fiction');
      expect(insertedBookRecords.ISBN).to.equal('9780450011849');
    });
  });
});
