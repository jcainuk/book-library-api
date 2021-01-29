const { expect } = require('chai');
const request = require('supertest');
const {
  Book, Genre, Author,
} = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
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
      const genre = await Genre.create({ name: 'Vampire' });
      const author = await Author.create({ name: 'Anne Rice' });
      const response = await request(app).post('/books').send({
        title: 'Interview With The Vampire',
        AuthorId: author.id,
        GenreId: genre.id,
        ISBN: '9780450011849',
      });
      await expect(response.status).to.equal(201);
      expect(response.body.title).to.equal('Interview With The Vampire');
      const insertedBookRecord = await Book.findByPk(response.body.id, { raw: true });
      expect(insertedBookRecord.title).to.equal('Interview With The Vampire');
      expect(insertedBookRecord.AuthorId).to.equal(author.id);
      expect(insertedBookRecord.GenreId).to.equal(genre.id);
      expect(insertedBookRecord.ISBN).to.equal('9780450011849');
    });
    it('returns a 422 if the title is null', async () => {
      const genre = await Genre.create({ name: 'Vampire' });
      const author = await Author.create({ name: 'Anne Rice' });
      await request(app)
        .post('/books/')
        .send({
          AuthorId: author.id,
          GenreId: genre.id,
          ISBN: '9780450011849',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter the title');
        });
    });
    it('returns a 422 if the author is null', async () => {
      const genre = await Genre.create({ name: 'Vampire' });
      await request(app)
        .post('/books/')
        .send({
          title: 'Dune',
          GenreId: genre.id,
          ISBN: '9780450011849',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter the AuthorId');
        });
    });
    it('returns a 422 if the genre is null', async () => {
      const author = Author.create({ name: 'Helen Fielding' });
      await request(app)
        .post('/books/')
        .send({
          title: 'Bridget Jones 2',
          AuthorId: author.id,
          ISBN: '9780450011849',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter the GenreId');
        });
    });
    it('returns a 422 if the ISBN is null', async () => {
      const genre = Genre.create({ name: 'Vampire' });
      const author = Author.create({ name: 'Anne Rice' });
      await request(app)
        .post('/books/')
        .send({
          title: 'The Vampire Lestat',
          AuthorId: author.id,
          GenreId: genre.id,
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter the ISBN');
        });
    });
  });
  describe('with books in the database', () => {
    let books;
    let genres;
    let authors;

    beforeEach(async () => {
      try {
        await Book.destroy({ where: {} });
        await Genre.destroy({ where: {} });
        await Author.destroy({ where: {} });
        genres = await Promise.all([
          Genre.create({ name: 'Chick Lit' }),
          Genre.create({ name: 'Vampire' }),
          Genre.create({ name: 'Science Fiction' }),
        ]);
        authors = await Promise.all([
          Author.create({ name: 'Helen Fielding' }),
          Author.create({ name: 'Anne Rice' }),
          Author.create({ name: 'Frank Herbert' }),
        ]);
        books = await Promise.all([
          Book.create({
            title: "Bridget Jones's Diary", AuthorId: authors[0].id, GenreId: genres[0].id, ISBN: '1234',
          }),
          Book.create({
            title: 'Interview With The Vampire', AuthorId: authors[1].id, GenreId: genres[1].id, ISBN: '4321',
          }),
          Book.create({
            title: 'Dune', AuthorId: authors[2].id, GenreId: genres[2].id, ISBN: '9876',
          }),
        ]);
      } catch (err) {
        console.log(err);
      }
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
              expect(book.AuthorId).to.equal(expected.AuthorId);
              expect(book.GenreId).to.equal(expected.GenreId);
              expect(book.ISBN).to.equal(expected.ISBN);
            });
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe('GET /books/:bookId', () => {
      it('gets book record by ID', (done) => {
        const book = books[0];
        request(app)
          .get(`/books/${book.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.title).to.equal(book.title);
            expect(res.body.AuthorId).to.equal(book.AuthorId);
            expect(res.body.GenreId).to.equal(book.GenreId);
            expect(res.body.ISBN).to.equal(book.ISBN);
            done();
          })
          .catch((error) => done(error));
      });
      it('returns a 404 if the book does not exist', (done) => {
        request(app)
          .get('/books/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The book could not be found.');
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe('PATCH /books/:id', (done) => {
      it('updates book title by id', (done) => {
        const book = books[0];
        request(app)
          .patch(`/books/${book.id}`)
          .send({ title: 'The Rum Diary' })
          .then((res) => {
            expect(res.status).to.equal(200);
            Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
              expect(updatedBook.title).to.equal('The Rum Diary');
              done();
            });
          })
          .catch((error) => done(error));
      });
      it('updates book author by id', async () => {
        const book = books[0];
        request(app)
          .patch(`/books/${book.id}`)
          .send({ AuthorId: authors[2].id })
          .then((res) => {
            expect(res.status).to.equal(200);
            Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
              expect(updatedBook.AuthorId.name).to.equal('Frank Herbert');
              done();
            });
          })
          .catch((error) => done(error));
      });
      it('updates book genre by id', async () => {
        const book = books[0];
        request(app)
          .patch(`/books/${book.id}`)
          .send({ GenreId: genres[1] })
          .then((res) => {
            expect(res.status).to.equal(200);
            Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
              expect(updatedBook.GenreId.name).to.equal('Vampire');
              done();
            });
          })
          .catch((error) => done(error));
      });
      it('updates book ISBN by id', async () => {
        const book = books[0];
        request(app)
          .patch(`/books/${book.id}`)
          .send({ ISBN: '97809713363000' })
          .then((res) => {
            expect(res.status).to.equal(200);
            Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
              expect(updatedBook.ISBN).to.equal('97809713363000');
              done();
            });
          })
          .catch((error) => done(error));
      });
      it('returns a 404 if the book does not exist', (done) => {
        request(app)
          .patch('/books/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The book could not be found.');
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe('DELETE /books/:bookId', () => {
      it('deletes book record by id', (done) => {
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
      it('returns a 404 if the book does not exist', (done) => {
        request(app)
          .delete('/books/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The book could not be found.');
            done();
          })
          .catch((error) => done(error));
      });
    });
  });
});
