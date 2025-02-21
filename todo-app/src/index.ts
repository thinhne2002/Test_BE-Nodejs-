import express from 'express';
import 'reflect-metadata';
import { AppDataSource } from './database';
import taskRoutes from './routes/taskRoutes';
import axios from 'axios';

const app = express();

app.use(express.json());

app.use('/api', taskRoutes);

// Lấy danh sách công việc
const fetchTasks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/tasks');
    console.log('Tasks:', response.data);
  } catch (error: any) {
    console.error('Error fetching tasks:', error.response ? error.response.data : error.message);
  }
};
// Tạo công việc
const CreateTask = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/createtasks',{
      name: 'Task 1',
      startDate: '2025-02-25',
      endDate: '2025-03-01',
    });
    console.log('Tasks:', response.data);
    fetchTasks();
  } catch (error: any) {
    console.error('Error fetching tasks:', error.response ? error.response.data : error.message);
  }
};


AppDataSource.initialize().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
  //fetchTasks();
  CreateTask();
});

export default app;
