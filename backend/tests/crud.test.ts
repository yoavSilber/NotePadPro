import request from 'supertest';
import mongoose from 'mongoose';
import app from '../expressApp';
import dotenv from 'dotenv';
dotenv.config();


// Sample note for creation
const sampleNote = {
  title: 'Test Note',
  author: {
    name: 'Test Author',
    email: 'author@example.com',
  },
  content: 'This is a test note.',
};

describe('CRUD API tests', () => {
  let createdNoteId: string;

  beforeAll(async () => {
    // Connect to test DB (make sure MONGODB_CONNECTION_URL in .env points to a test DB)
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_CONNECTION_URL!);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('creates a new note', async () => {
    const res = await request(app).post('/notes').send(sampleNote);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.content).toBe(sampleNote.content);
    createdNoteId = res.body._id;
  });

  it('reads the created note', async () => {
    const res = await request(app).get(`/notes/${createdNoteId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', createdNoteId);
    expect(res.body.title).toBe(sampleNote.title);
  });

  it('updates the note', async () => {
    const updated = { ...sampleNote, content: 'Updated content' };
    const res = await request(app).put(`/notes/${createdNoteId}`).send(updated);
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Updated content');
  });

  it('deletes the note', async () => {
    const res = await request(app).delete(`/notes/${createdNoteId}`);
    expect(res.status).toBe(204);

    const followUp = await request(app).get(`/notes/${createdNoteId}`);
    expect(followUp.status).toBe(404);
  });
});
