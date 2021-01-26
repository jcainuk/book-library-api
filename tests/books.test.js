const { expect } = require('chai');
const request = require('supertest');
const { Book, Genre, Author, Reader } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  let books;
  let genres;
  let authors;
  before(async () => {
    try {
      await Book.sequelize.sync();
      await Genre.sequelize.sync();
      await Author.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });
  beforeEach(async () => {
    try {
      await Book.destroy({ where: {} });
      await Genre.destroy({ where: {} });
      await Author.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });
  describe('POST /books', async () => {
    it('creates a new book in the database', async () => {
      const response = await request(app).post('/books').send({
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Science-Fiction',
        ISBN: '9780450011849',
      });
      await expect(response.status).to.equal(201);
      expect(response.body.title).to.equal('Dune');
      const insertedBookRecords = await Book.findByPk(response.body.id, { raw: true });
      expect(insertedBookRecords.title).to.equal('Dune');
      expect(insertedBookRecords.author).to.equal('Frank Herbert');
      expect(insertedBookRecords.genre).to.equal('Science-Fiction');
      expect(insertedBookRecords.ISBN).to.equal('9780450011849');
    });
    it('returns a 422 if the title is null', async () => {
      await request(app)
        .post('/books/')
        .send({
          author: 'Frank Herbert',
          genre: 'Science-Fiction',
          ISBN: '9780450011849',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter the title');
        });
    });
    it('returns a 422 if the author is null', async () => {
      await request(app)
        .post('/books/')
        .send({
          title: 'Dune',
          genre: 'Science-Fiction',
          ISBN: '9780450011849',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter the author');
        });
    });
    it('returns a 422 if the genre is null', async () => {
      await request(app)
        .post('/books/')
        .send({
          title: 'Dune',
          author: 'Frank Herbert',
          ISBN: '9780450011849',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter the genre');
        });
    });
    it('returns a 422 if the ISBN is null', async () => {
      await request(app)
        .post('/books/')
        .send({
          title: 'Dune',
          author: 'Frank Herbert',
          genre: 'Science-Fiction',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter the ISBN');
        });
    });
  });
  describe('with books in the database', () => {
    let books;
    beforeEach((done) => {
      Promise.all([
        Book.create({ title: "Dune", author: "Frank Herbert", genre: "Science-Fiction", ISBN: "9780450011849" }),
        Book.create({ title: "Bridget Jones's Diary", author: "Helen Fielding", genre: "Chick lit", ISBN: "8601410718626" }),
        Book.create({ title: "Interview With The Vampire", author: "Anne Rice", genre: "Vampire", ISBN: "9780751541977" }),
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
    describe("GET /books/:bookId", () => {
      it("gets book record by ID", (done) => {
        const book = books[0];
        request(app)
          .get(`/books/${book.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.title).to.equal(book.title);
            expect(res.body.author).to.equal(book.author);
            expect(res.body.genre).to.equal(book.genre);
            expect(res.body.ISBN).to.equal(book.ISBN);
            done();
          })
          .catch((error) => done(error));
      });
      it("returns a 404 if the book does not exist", (done) => {
        request(app)
          .get("/books/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The book could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe("PATCH /books/:id", () => {
      it("updates book title by id", (done) => {
        const book = books[0];
        request(app)
          .patch(`/books/${book.id}`)
          .send({ title: "The Rum Diary" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
              expect(updatedBook.title).to.equal("The Rum Diary");
              done();
            });
          })
          .catch((error) => done(error));
      });
      it("updates book author by id", (done) => {
        const book = books[0];
        request(app)
          .patch(`/books/${book.id}`)
          .send({ author: "H. P. Lovecraft" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
              expect(updatedBook.author).to.equal("H. P. Lovecraft");
              done();
            });
          })
          .catch((error) => done(error));
      });
      it("updates book genre by id", (done) => {
        const book = books[0];
        request(app)
          .patch(`/books/${book.id}`)
          .send({ genre: "Chick lit" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
              expect(updatedBook.genre).to.equal("Chick lit");
              done();
            });
          })
          .catch((error) => done(error));
      });
      it("updates book ISBN by id", (done) => {
        const book = books[0];
        request(app)
          .patch(`/books/${book.id}`)
          .send({ ISBN: "9780971336360" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
              expect(updatedBook.ISBN).to.equal("9780971336360");
              done();
            });
          })
          .catch((error) => done(error));
      });
      it("returns a 404 if the book does not exist", (done) => {
        request(app)
          .patch("/books/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The book could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe("DELETE /books/:bookId", () => {
      it("deletes book record by id", (done) => {
        const book = books[0];
        request(app)
          .delete(`/books/${book.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
              expect(updatedBook).to.equal(null);
              done();
            });
          })
          .catch((error) => done(error));
      });
      it("returns a 404 if the book does not exist", (done) => {
        request(app)
          .delete("/books/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The book could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
  });
});
