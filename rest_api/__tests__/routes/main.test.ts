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


describe('POST /image', () => {
  it('should respond with a label & image', async () => {
    const imageBase64 = 'base64EncodedImageData';
    const label = 'It is a rock';
    request(server)
        .post('/user')
        .send({
          imageBase64,
        })
        .expect((res) => {
          res.body.imageBase64 = imageBase64;
          res.body.label = label;
        })
        .expect(200);
  });
});
