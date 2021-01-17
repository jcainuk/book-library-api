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
  describe('with books in the database', () => {
    let books;
    beforeEach((done) => {
      Promise.all([
        Book.create({ title: "Dune", author: "Frank Herbert", genre: "science-fiction", ISBN: "9780450011849" }),
        Book.create({ title: "Bridget Jones's Diary", author: "Helen Fielding", genre: "humour/diary fiction", ISBN: "8601410718626" }),
        Book.create({ title: "Interview With The Vampire", author: "Anne Rice", genre: "gothic horror/vampire", ISBN: "9780751541977" }),
      ]).then((documents) => {
        books = documents;
        done();
      });
    });
    describe('GET /books', () => {
      it('gets all book records', (done) => {
        request(app)
          .get('/books')
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((book) => {
              const expected = books.find((a) => a.id === book.id);
              expect(book.title).to.equal(expected.title);
              expect(book.author).to.equal(expected.author);
              expect(book.genre).to.equal(expected.genre);
              expect(book.ISBN).to.equal(expected.ISBN);
            });
            done();
          })
          .catch((error) => done(error));
      });
    });
  });
});
