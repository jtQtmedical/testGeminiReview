const request = require('supertest');
const app = require('../app');

let server;

beforeAll((done) => {
  server = app.listen(4000, () => {
    global.agent = request.agent(server);
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe('GET /', () => {
  it('should return a welcome message', async () => {
    const res = await global.agent.get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Hello, this is a simple Todo List application!');
  });
});