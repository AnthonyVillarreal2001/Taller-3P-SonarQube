const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const spacesRoutes = require('../routes/spaces');
const db = require('../config/db');

// Mock the database module
jest.mock('../config/db');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/spaces', spacesRoutes);

describe('Spaces API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /spaces', () => {
    it('should return all spaces', async () => {
      const mockSpaces = [
        { id: 1, zone_id: 1, number: 'A-01', status: 'available' },
        { id: 2, zone_id: 1, number: 'A-02', status: 'occupied' }
      ];

      db.rawQuery.mockResolvedValue({ rows: mockSpaces });

      const response = await request(app).get('/spaces');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSpaces);
      expect(db.rawQuery).toHaveBeenCalledWith("SELECT * FROM spaces WHERE number LIKE '%%'");
    });

    it('should filter spaces by search query', async () => {
      const mockSpaces = [
        { id: 1, zone_id: 1, number: 'A-01', status: 'available' }
      ];

      db.rawQuery.mockResolvedValue({ rows: mockSpaces });

      const response = await request(app).get('/spaces?search=A-01');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSpaces);
      expect(db.rawQuery).toHaveBeenCalledWith("SELECT * FROM spaces WHERE number LIKE '%A-01%'");
    });

    it('should handle database errors', async () => {
      db.rawQuery.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/spaces');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Database error');
    });
  });

  describe('GET /spaces/:id', () => {
    it('should return a specific space', async () => {
      const mockSpace = { id: 1, zone_id: 1, number: 'A-01', status: 'available' };

      db.rawQuery.mockResolvedValue({ rows: [mockSpace] });

      const response = await request(app).get('/spaces/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSpace);
      expect(db.rawQuery).toHaveBeenCalledWith('SELECT * FROM spaces WHERE id = 1');
    });

    it('should handle errors when getting space by id', async () => {
      db.rawQuery.mockRejectedValue(new Error('Space not found'));

      const response = await request(app).get('/spaces/999');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Space not found');
    });
  });

  describe('POST /spaces', () => {
    it('should create a new space', async () => {
      db.rawQuery.mockResolvedValue({});

      const newSpace = {
        zone_id: 1,
        number: 'A-03',
        status: 'available'
      };

      const response = await request(app)
        .post('/spaces')
        .send(newSpace);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Space created'
      });
      expect(db.rawQuery).toHaveBeenCalledWith(
        "INSERT INTO spaces (zone_id, number, status) VALUES (1, 'A-03', 'available')"
      );
    });

    it('should handle errors when creating space', async () => {
      const error = new Error('Insert failed');
      error.stack = 'Error stack trace';
      db.rawQuery.mockRejectedValue(error);

      const newSpace = {
        zone_id: 1,
        number: 'A-03',
        status: 'available'
      };

      const response = await request(app)
        .post('/spaces')
        .send(newSpace);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: 'Insert failed',
        stack: 'Error stack trace'
      });
    });
  });

  describe('PUT /spaces/:id', () => {
    it('should update a space', async () => {
      db.rawQuery.mockResolvedValue({});

      const updatedSpace = {
        zone_id: 1,
        number: 'A-01',
        status: 'occupied'
      };

      const response = await request(app)
        .put('/spaces/1')
        .send(updatedSpace);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Space updated');
    });

    it('should handle errors when updating space', async () => {
      db.rawQuery.mockRejectedValue(new Error('Update failed'));

      const updatedSpace = {
        zone_id: 1,
        number: 'A-01',
        status: 'occupied'
      };

      const response = await request(app)
        .put('/spaces/1')
        .send(updatedSpace);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Update failed');
    });
  });

  describe('DELETE /spaces/:id', () => {
    it('should delete a space', async () => {
      db.rawQuery.mockResolvedValue({});

      const response = await request(app).delete('/spaces/1');

      expect(response.status).toBe(200);
      expect(response.text).toBe('Space deleted');
      expect(db.rawQuery).toHaveBeenCalledWith('DELETE FROM spaces WHERE id = 1');
    });

    it('should handle errors when deleting space', async () => {
      db.rawQuery.mockRejectedValue(new Error('Delete failed'));

      const response = await request(app).delete('/spaces/1');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Delete failed');
    });
  });
});
