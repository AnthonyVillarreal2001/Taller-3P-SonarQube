const { Pool } = require('pg');

// Mock pg module
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn()
  };
  return {
    Pool: jest.fn(() => mockPool)
  };
});

describe('Database Configuration', () => {
  beforeAll(() => {
    // Ensure environment variables are set for tests
    process.env.DB_USER = 'postgres';
    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_NAME = 'parking_db';
    process.env.DB_PASSWORD = 'postgres';
    process.env.DB_PORT = '5433';
  });

  it('should export database module successfully', () => {
    const db = require('../config/db');
    
    expect(db).toBeDefined();
    expect(db.query).toBeDefined();
    expect(db.rawQuery).toBeDefined();
    expect(typeof db.query).toBe('function');
    expect(typeof db.rawQuery).toBe('function');
  });

  it('should create Pool with correct configuration', () => {
    expect(Pool).toHaveBeenCalled();
  });
});
