const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');

describe('/readers', () => {
  /* The before part is to define some stuff that will be done once, before all tests. */
  before(async () => {
    try {
    /* Below the command creates new tables according to the schema
      specified in the model reader. */
      await Reader.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });
  /* The beforeEach part is to define some stuff that will be done before each test.
    (If you have 3 tests, it will be run 3 times, before each of those 3 tests). */
  beforeEach(async () => {
    try {
      await Reader.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });
  describe('POST /readers', async () => {
    it('creates a new reader in the database', async () => {
    /* Below sends a HTTP POST request to the route /readers
         with the specified object in the body of the request. */
      const response = await request(app).post('/readers').send({
        name: 'Joe Bloggs',
        email: 'jbloggs@fakemail.com',
        password: 'supersecret',
      });
      await expect(response.status).to.equal(201);
      expect(response.body.name).to.equal('Joe Bloggs');
      expect(response.body.password).to.equal(undefined);
      /* Below findByPk (find by primary key) is to find an reader record
        from our table readers (abstracted from the model Reader)
         with the id corresponding to response.body.id.
        Here, we want to retrieve the record created after calling our POST request
        to make sure its properties (name and email) correspond with what we have sent.
        In plain SQL, the code would look like (assuming connection variable was defined):
        connection.query('SELECT * FROM readers WHERE id = ?', response.body.id); */
      const insertedReaderRecords = await Reader.findByPk(response.body.id, { raw: true });
      expect(insertedReaderRecords.name).to.equal('Joe Bloggs');
      expect(insertedReaderRecords.email).to.equal('jbloggs@fakemail.com');
      expect(insertedReaderRecords.password).to.equal('supersecret');
    });
    it('returns a 422 if the name is null', async () => {
      await request(app)
        .post('/readers/')
        .send({
          email: 'jbloggs@fakemail.com',
          password: 'supersupersuper',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter your name');
        });
    });
    it('returns a 422 if the email is null', async () => {
      await request(app)
        .post('/readers/')
        .send({
          name: 'Joe Bloggs',
          password: 'super',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter your email');
        });
    });
    it('returns a 422 if the password is null', async () => {
      await request(app)
        .post('/readers/')
        .send({
          name: 'Joe Bloggs',
          email: 'jbloggs@fakemail.com',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter your password');
        });
    });
    it('returns a 422 if the reader email invalid', async () => {
      await request(app)
        .post('/readers/')
        .send({
          name: 'Joe Bloggs',
          email: 'jbloggsfakemail.com',
          password: 'supersecret',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Please enter a valid email');
        });
    });
    it('returns a 422 if the password is less than 8 characters', async () => {
      await request(app)
        .post('/readers/')
        .send({
          name: 'Joe Bloggs',
          email: 'jbloggs@fakemail.com',
          password: 'super',
        })
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.contain('Password must be at least 8 characters.');
        });
    });
  });

  describe('with readers in the database', () => {
    let readers;
    beforeEach((done) => {
      Promise.all([
        Reader.create({ name: 'Harry Hill', email: 'hhill@gmail.com', password: 'supersecret1' }),
        Reader.create({ name: 'Jason Donovan', email: 'Jdawg@outlook.com', password: 'supersecret2' }),
        Reader.create({ name: 'Dave Windsor', email: 'Windsor40@hotmail.com', password: 'supersecret3' }),
      ]).then((documents) => {
        readers = documents;
        done();
      });
    });
    describe('GET /readers', () => {
      it('gets all reader records', async () => {
        await request(app)
          .get('/readers')
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((reader) => {
              const expected = readers.find((a) => a.id === reader.id);
              expect(reader.name).to.equal(expected.name);
              expect(reader.email).to.equal(expected.email);
              expect(reader.password).to.equal(undefined);
            });
          });
      });
    });
    describe('GET /readers/:readerId', () => {
      it('gets reader record by ID', async () => {
        const reader = readers[0];
        await request(app)
          .get(`/readers/${reader.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(reader.name);
            expect(res.body.email).to.equal(reader.email);
            expect(res.body.password).to.equal(undefined);
          });
      });
      it('returns a 404 if the reader does not exist', async () => {
        await request(app)
          .get('/readers/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The reader could not be found.');
          });
      });
    });
    describe('PATCH /readers/:id', () => {
      it('updates reader name by id', async () => {
        const reader = readers[0];
        await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ name: 'Steven Jones' })
          .then((res) => {
            expect(res.status).to.equal(200);
            Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
              expect(updatedReader.name).to.equal('Steven Jones');
              expect(updatedReader.password).to.equal(undefined);
            });
          });
      });
      it('updates reader email by id', async () => {
        const reader = readers[0];
        await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: 'LSmith@fakemail.co.uk' })
          .then((res) => {
            expect(res.status).to.equal(200);
            Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
              expect(updatedReader.email).to.equal('LSmith@fakemail.co.uk');
              expect(updatedReader.password).to.equal(undefined);
            });
          });
      });
      it('returns a 404 if the reader does not exist', async () => {
        await request(app)
          .patch('/readers/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The reader could not be found.');
          });
      });
    });
    describe('DELETE /readers/:readerId', () => {
      it('deletes reader record by id', async () => {
        const reader = readers[0];
        await request(app)
          .delete(`/readers/${reader.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
              expect(updatedReader).to.equal(null);
            });
          });
      });
      it('returns a 404 if the reader does not exist', async () => {
        await request(app)
          .delete('/readers/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The reader could not be found.');
          });
      });
    });
  });
});
