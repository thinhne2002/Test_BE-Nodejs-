import request from 'supertest';
import { AppDataSource } from '../database';
import app from '../index';

beforeAll(async () => {
    await AppDataSource.initialize();
});

afterAll(async () => {
    await AppDataSource.destroy();
});

// Test case 1 - Lấy danh sách công việc
describe('Task API - List Tasks', () => {
    it('should return a list of tasks', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
// Test case 2 - Thêm công việc
describe('Task API - Create Task', () => {
    // Test case 2.1 - Thêm công việc thành công
    it('should create a task successfully', async () => {
      const response = await request(app)
        .post('/api/createtasks')
        .send({ name: 'New Task', startDate: '2025-02-22', endDate: '2025-02-23' });
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('New Task');
      expect(new Date(response.body.startDate)).toEqual(new Date('2025-02-22'));
    });
    // Test case 2.2 - Thêm công việc không thành công
    it('should fail to create task without a name', async () => {
      const response = await request(app)
        .post('/api/createtasks')
        .send({ startDate: '2025-02-22' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid task name');
    });
    // Test case 2.3 - Thêm công việc không thành công
    it('should fail if start date is after end date', async () => {
      const response = await request(app)
        .post('/api/createtasks')
        .send({ name: 'Invalid Task', startDate: '2025-02-24', endDate: '2025-02-23' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Start date cannot be after end date');
    });
  });
// Test case 3 - Cập nhật công việc
describe('Task API - Update Task', () => {
    // Test case 3.1 - Cập nhật công việc thành công
    it('should update a task successfully', async () => {
      const newTask = await request(app)
        .post('/api/createtasks')
        .send({ name: 'Task to Update', startDate: '2025-02-20' });
      
      const taskId = newTask.body.id;
      const response = await request(app)
        .post(`/api/tasks/${taskId}`)
        .send({ name: 'Updated Task', startDate: '2025-02-21' });
  
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Task');
    });
    // Test case 3.2 - Cập nhật công việc không thành công
    it('should return 404 if task not found', async () => {
      const response = await request(app)
        .post('/api/tasks/999')
        .send({ name: 'Non-existent Task', startDate: '2025-02-22' });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });
// Test case 4 - Xóa công việc
describe('Task API - Delete Task', () => {
    it('should delete a task', async () => {
      const newTask = await request(app)
        .post('/api/createtasks')
        .send({ name: 'Task to Delete', startDate: '2025-02-20' });
      
      const taskId = newTask.body.id;
      const response = await request(app).delete(`/api/tasks/${taskId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted');
    });
  
    it('should return 404 if task not found', async () => {
      const response = await request(app).delete('/api/tasks/999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });
  
  
