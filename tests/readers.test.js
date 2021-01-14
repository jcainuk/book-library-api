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
        });
        await expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('Joe Bloggs');
  
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
      });
    });
  });