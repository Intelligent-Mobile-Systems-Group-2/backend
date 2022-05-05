import server from '../../src/server';
import request from 'supertest';

// This closes the server after the tests
afterEach((done) => {
  server.close();
  done();
});

// Tests for boundary collision
describe('PUT /boundary-collision', () => {
  it('should respond with position for x and y', async () => {
    const positionX = 43;
    const positionY = 23;
    const res = await request(server)
        .put('/boundary-collision')
        .send({
          x: positionX,
          y: positionY,
        })
    expect(res.status).toEqual(201);
    expect(res.body.x).toEqual(positionX);
    expect(res.body.y).toEqual(positionY);
  });
});

describe('GET /boundary-collision', () => {
  it('should respond with a date', async () => {
    const res = await request(server)
        .get('/boundary-collision')
    expect(res.status).toEqual(200);
  });
});

// Tests for object collision
describe('PUT /object-collision', () => {
  it('should respond with a turtle', async () => {
    const res = await request(server)
        .put('/object-collision')
        .attach('photo', './collision-photos/test-image.webp')
        .attach('x', 43)
        .attach('y', 22)
    expect(res.status).toEqual(200);
    expect(res.body.object).toEqual("Tortoise");
  });
});

describe('GET /object-collision', () => {
  it('should respond with a date', async () => {
    const res = await request(server)
        .get('/object-collision')
    expect(res.status).toEqual(200);
  });
});
