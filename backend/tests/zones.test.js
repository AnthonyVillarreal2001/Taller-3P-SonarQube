const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const zonesRoutes = require('../routes/zones');
const db = require('../config/db');

// Mock the database module
jest.mock('../config/db');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/zones', zonesRoutes);

describe('Zones API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /zones', () => {
    it('should return all zones', async () => {
      const mockZones = [
        { id: 1, name: 'Zona A', description: 'Primera zona' },
        { id: 2, name: 'Zona B', description: 'Segunda zona' }
      ];

      db.rawQuery.mockResolvedValue({ rows: mockZones });

      const response = await request(app).get('/zones');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockZones);
      expect(db.rawQuery).toHaveBeenCalledWith("SELECT * FROM zones WHERE name LIKE '%%'");
    });

    it('should filter zones by search query', async () => {
      const mockZones = [
        { id: 1, name: 'Zona A', description: 'Primera zona' }
      ];

      db.rawQuery.mockResolvedValue({ rows: mockZones });

      const response = await request(app).get('/zones?search=A');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockZones);
      expect(db.rawQuery).toHaveBeenCalledWith("SELECT * FROM zones WHERE name LIKE '%A%'");
    });

    it('should handle database errors', async () => {
      db.rawQuery.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/zones');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Database error');
    });
  });

  describe('GET /zones/:id', () => {
    it('should return a specific zone', async () => {
      const mockZone = { id: 1, name: 'Zona A', description: 'Primera zona' };

      db.rawQuery.mockResolvedValue({ rows: [mockZone] });

      const response = await request(app).get('/zones/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockZone);
      expect(db.rawQuery).toHaveBeenCalledWith('SELECT * FROM zones WHERE id = 1');
    });

    it('should handle errors when getting zone by id', async () => {
      db.rawQuery.mockRejectedValue(new Error('Zone not found'));

      const response = await request(app).get('/zones/999');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Zone not found');
    });
  });

  describe('POST /zones', () => {
    it('should create a new zone', async () => {
      db.rawQuery.mockResolvedValue({});

      const newZone = {
        name: 'Zona C',
        description: 'Tercera zona'
      };

      const response = await request(app)
        .post('/zones')
        .send(newZone);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Zone created'
      });
      expect(db.rawQuery).toHaveBeenCalledWith(
        "INSERT INTO zones (name, description) VALUES ('Zona C', 'Tercera zona')"
      );
    });

    it('should handle errors when creating zone', async () => {
      const error = new Error('Insert failed');
      error.stack = 'Error stack trace';
      db.rawQuery.mockRejectedValue(error);

      const newZone = {
        name: 'Zona C',
        description: 'Tercera zona'
      };

      const response = await request(app)
        .post('/zones')
        .send(newZone);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: 'Insert failed',
        stack: 'Error stack trace'
      });
    });
  });

  describe('PUT /zones/:id', () => {
    it('should update a zone', async () => {
      db.rawQuery.mockResolvedValue({});

      const updatedZone = {
        name: 'Zona A Updated',
        description: 'Updated description'
      };

      const response = await request(app)
        .put('/zones/1')
        .send(updatedZone);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Zone updated'
      });
    });

    it('should handle errors when updating zone', async () => {
      const error = new Error('Update failed');
      error.stack = 'Error stack trace';
      db.rawQuery.mockRejectedValue(error);

      const updatedZone = {
        name: 'Zona A',
        description: 'Updated'
      };

      const response = await request(app)
        .put('/zones/1')
        .send(updatedZone);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: 'Update failed',
        stack: 'Error stack trace'
      });
    });
  });

  describe('DELETE /zones/:id', () => {
    it('should delete a zone', async () => {
      db.rawQuery.mockResolvedValue({});

      const response = await request(app).delete('/zones/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Zone deleted'
      });
      expect(db.rawQuery).toHaveBeenCalledWith('DELETE FROM zones WHERE id = 1');
    });

    it('should handle errors when deleting zone', async () => {
      const error = new Error('Delete failed');
      error.stack = 'Error stack trace';
      db.rawQuery.mockRejectedValue(error);

      const response = await request(app).delete('/zones/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: 'Delete failed',
        stack: 'Error stack trace'
      });
    });
  });
});
