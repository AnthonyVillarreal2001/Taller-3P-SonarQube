const request = require('supertest');

// Set test environment before requiring app
process.env.NODE_ENV = 'test';

const app = require('../server');

describe('Server Configuration', () => {
  describe('Security Headers', () => {
    it('should not expose X-Powered-By header', async () => {
      const response = await request(app).get('/zones');
      
      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('CORS Configuration', () => {
    it('should have CORS headers configured', async () => {
      const response = await request(app)
        .get('/zones')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.headers['access-control-allow-methods']).toBe('GET, POST, PUT, DELETE');
    });

    it('should handle OPTIONS preflight requests', async () => {
      const response = await request(app)
        .options('/zones')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app).get('/nonexistent');
      
      expect(response.status).toBe(404);
    });

    it('should handle JSON parsing errors with 500', async () => {
      const response = await request(app)
        .post('/zones')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(500);
      expect(response.text).toContain('Something broke!');
    });
  });

  describe('Routes Integration', () => {
    it('should have zones route mounted', async () => {
      const response = await request(app).get('/zones');
      
      expect(response.status).not.toBe(404);
    });

    it('should have spaces route mounted', async () => {
      const response = await request(app).get('/spaces');
      
      expect(response.status).not.toBe(404);
    });
  });

  describe('Body Parser Configuration', () => {
    it('should parse JSON bodies', async () => {
      const response = await request(app)
        .post('/zones')
        .set('Content-Type', 'application/json')
        .send({ name: 'Test Zone', description: 'Test' });

      expect(response.status).toBe(201);
    });

    it('should parse URL-encoded bodies', async () => {
      const response = await request(app)
        .post('/zones')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('name=Test Zone&description=Test');

      expect(response.status).toBe(201);
    });
  });
});
