const { expect } = require('chai');
const request = require('supertest');
const { Author } = require('../src/models');
const app = require('../src/app');

describe('/authors', () => {
  before(async () => {
    try {
      await Author.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });
  beforeEach(async () => {
    try {
      await Author.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });
  describe('POST /authors', async () => {
    it('creates a new author in the database', async () => {
      await request(app)
        .post('/authors').send({
          name: 'Helen Fielding',
        })
        .then(async (res) => {
          expect(res.status).to.equal(201);
          expect(res.body.name).to.equal('Helen Fielding');
          const insertedAuthorRecords = await Author.findByPk(res.body.id, { raw: true });
          expect(insertedAuthorRecords.name).to.equal('Helen Fielding');
        });
    });
    it('returns a 422 if the author is null', async () => {
      await request(app)
        .post('/authors/')
        .send({
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter the author');
        });
    });
  });
  describe('with authors in the database', () => {
    let authors;
    beforeEach((done) => {
      authors = Promise.all([
        Author.create({ name: 'H. P. Lovecraft' }),
        Author.create({ name: 'Neil Gaiman' }),
        Author.create({ name: 'Clare Azzopardi' }),
      ]).then((documents) => {
        authors = documents;
        done();
      });
    });
    describe('GET /authors', () => {
      it('gets all author records', (done) => {
        request(app)
          .get('/authors')
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((author) => {
              const expected = authors.find((a) => a.id === author.id);
              expect(author.name).to.equal(expected.name);
            });
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe('GET /authors/:authorId', () => {
      it('gets author record by ID', async () => {
        const author = authors[0];
        request(app)
          .get(`/authors/${author.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(author.name);
            done();
          });
        // .catch((error) => done(error));
      });
      it('returns a 404 if the author does not exist', (done) => {
        request(app)
          .get('/authors/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The author could not be found.');
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe('PATCH /authors/:id', () => {
      it('updates author by id', async () => {
        const author = authors[0];
        request(app)
          .patch(`/authors/${author.id}`)
          .send({ name: 'Dun Karm Psaila' })
          .then((res) => {
            expect(res.status).to.equal(200);
            Author.findByPk(author.id, { raw: true }).then((updatedAuthor) => {
              expect(updatedAuthor.name).to.equal('Dun Karm Psaila');
            });
          })
          .catch((error) => done(error));
      });
      it('returns a 404 if the author does not exist', (done) => {
        request(app)
          .patch('/authors/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The author could not be found.');
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe('DELETE /authors/:authorId', () => {
      it('deletes author record by id', (done) => {
        const author = authors[0];
        request(app)
          .delete(`/authors/${author.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Author.findByPk(author.id, { raw: true }).then((updatedAuthor) => {
              expect(updatedAuthor).to.equal(null);
              done();
            });
          })
          .catch((error) => done(error));
      });
      it('returns a 404 if the author does not exist', (done) => {
        request(app)
          .delete('/authors/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The author could not be found.');
            done();
          })
          .catch((error) => done(error));
      });
    });
  });
});
