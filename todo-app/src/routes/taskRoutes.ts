import express from 'express';
import { AppDataSource } from '../database';
import { Task } from '../entity/Task';

const router = express.Router();
interface TaskBody {
  name: string;
  startDate?: Date;
  endDate?: Date;
}
// Lấy danh sách các công việc
router.get('/tasks', async (req, res) => {
  const taskRepository = AppDataSource.getRepository(Task);
  const tasks = await taskRepository.find();
  res.json(tasks);
});
//Thêm công việc
router.post('/createtasks', async (req, res) => {
  const { name, startDate, endDate } = req.body as TaskBody;
  // Kiểm tra tên task
  if (!name || name.length > 80) {
    res.status(400).json({ error: 'Invalid task name' });
    return;
  }
  // Kiểm tra ngày bắt đầu không được thiếu nếu có ngày kết thúc
  if (endDate && !startDate) {
    res.status(400).json({ error: 'Start date is required if end date is provided' });
    return;
  }
  const today = new Date().setHours(0, 0, 0, 0); // Lấy ngày hiện tại, bỏ đi giờ/phút/giây
  // Kiểm tra ngày bắt đầu không được trước ngày hiện tại
  if (startDate && new Date(startDate).getTime() < today) {
    res.status(400).json({ error: 'Start date cannot be before today' });
    return;
  }
  // Kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc
  if (startDate && endDate && new Date(startDate).getTime() > new Date(endDate).getTime()) {
    res.status(400).json({ error: 'Start date cannot be after end date' });
    return;
  }
  const taskRepository = AppDataSource.getRepository(Task);
  const task = taskRepository.create({ name, startDate, endDate });
  await taskRepository.save(task);
  res.status(201).json(task);
});
//Cập nhật công việc
router.post('/update/:id', async (req, res) => {
  const { name, startDate, endDate } = req.body as TaskBody;
  const { id } = req.params;
  // Kiểm tra tên task
  if (!name || name.length > 80) {
    res.status(400).json({ error: 'Invalid task name' });
    return;
  }
  // Kiểm tra ngày bắt đầu không được thiếu nếu có ngày kết thúc
  if (endDate && !startDate) {
    res.status(400).json({ error: 'Start date is required if end date is provided' });
    return;
  }
  const today = new Date().setHours(0, 0, 0, 0); // Lấy ngày hiện tại, bỏ đi giờ/phút/giây
  // Kiểm tra ngày bắt đầu không được trước ngày hiện tại
  if (startDate && new Date(startDate).getTime() < today) {
    res.status(400).json({ error: 'Start date cannot be before today' });
    return;
  }
  // Kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc
  if (startDate && endDate && new Date(startDate).getTime() > new Date(endDate).getTime()) {
    res.status(400).json({ error: 'Start date cannot be after end date' });
    return;
  }
  const taskRepository = AppDataSource.getRepository(Task);
  const task = await taskRepository.findOne({ where: { id } });
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  task.name = name;
  task.startDate = startDate;
  task.endDate = endDate;
  await taskRepository.save(task);
  res.json(task);
});
//Xóa công việc
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const taskRepository = AppDataSource.getRepository(Task);
  const task = await taskRepository.findOne({ where: { id } });
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  await taskRepository.remove(task);
  res.json({ message: 'Task deleted' });
});

export default router;
