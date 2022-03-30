import server from '../../src/server';
import request from 'supertest';

// This closes the server after the tests
afterEach((done) => {
  server.close();
  done();
});

describe('POST /user', () => {
  it('should respond with the lowercased name', async () => {
    const name = 'William';
    request(server)
        .post('/user')
        .send({
          name,
        })
        .expect((res) => {
          res.body.name = name.toLowerCase();
        })
        .expect(200);
  });
});
