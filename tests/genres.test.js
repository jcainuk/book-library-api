const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genres', () => {
  before(async () => {
    try {
      await Genre.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });
  beforeEach(async () => {
    try {
      await Genre.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });
  describe('POST /genres', async () => {
    it('creates a new genre in the database', async () => {
      const response = await request(app).post('/genres').send({
        genre: 'Science-Fiction',
      });
      await expect(response.status).to.equal(201);
      expect(response.body.genre).to.equal('Science-Fiction');
      const insertedGenreRecords = await Genre.findByPk(response.body.id, { raw: true });
      expect(insertedGenreRecords.genre).to.equal('Science-Fiction');
    });
    it('returns a 422 if the genre is null', async () => {
      await request(app)
        .post('/genres/')
        .send({
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter the genre');
        });
    });
  });
  describe('with genres in the database', () => {
    let genres;
    beforeEach(async () => {
      Promise.all([
        Genre.create({ genre: "Romance" }),
        Genre.create({ genre: "Fantasy" }),
        Genre.create({ genre: "Historical" }),
      ]).then((documents) => {
        genres = documents;
      });
    });
    describe('GET /genres', () => {
      it('gets all genre records', (done) => {
        request(app)
          .get('/genres')
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((genre) => {
              const expected = genres.find((a) => a.id === genre.id);
              expect(genre.genre).to.equal(expected.genre);
            });
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe("GET /genres/:genreId", () => {
      it("gets genre record by ID", (done) => {
        const genre = genres[0];
        request(app)
          .get(`/genres/${genre.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.genre).to.equal(genre.genre);
            done();
          })
          .catch((error) => done(error));
      });
      it("returns a 404 if the genre does not exist", (done) => {
        request(app)
          .get("/genres/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The genre could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe("PATCH /genres/:id", () => {
      it("updates genre by id", (done) => {
        const genre = genres[0];
        request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: "Chick lit" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Genre.findByPk(genre.id, { raw: true }).then((updatedGenre) => {
              expect(updatedGenre.genre).to.equal("Chick lit");
              done();
            });
          })
          .catch((error) => done(error));
      });
      it("returns a 404 if the genre does not exist", (done) => {
        request(app)
          .patch("/genres/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The genre could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe("DELETE /genres/:genreId", () => {
      it("deletes genre record by id", (done) => {
        const genre = genres[0];
        request(app)
          .delete(`/genres/${genre.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Genre.findByPk(genre.id, { raw: true }).then((updatedGenre) => {
              expect(updatedGenre).to.equal(null);
              done();
            });
          })
          .catch((error) => done(error));
      });
      it("returns a 404 if the genre does not exist", (done) => {
        request(app)
          .delete("/genres/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The genre could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
  });
});
