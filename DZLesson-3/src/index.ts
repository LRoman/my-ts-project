import { setTasks, getTaskById, createTask, updateTask, deleteTask, filterTasks, isTaskCompletedBeforeDeadline } from './services/taskService';
import { parsedTasks } from './utils/json-validation'
import { Status, Priority } from './models/task';

const start = () => {
  console.log('My first TS function for parsing JSON data:')

  setTasks(parsedTasks);

  // Testing getTaskById function:
  try {
    const task = getTaskById(2);
    console.log('Get task by ID 2:');
    console.log('Found task:', task);
  } catch (error) {
    console.error('Error parsing tasks:', error);
  }

  // Testing createTask function:
  console.log('Testing of createTask function:');

  const newTask = createTask({
    title: 'New Task',
    description: 'This is a new task created for testing.',
    deadline: '2025-12-31',
  })
  console.log('Created task:', newTask);

  // Testing updateTask function:
  const updatedTask = updateTask(newTask.id, {
    status: Status.InProgress,
    priority: Priority.High,
    description: 'Updated task description.',
  })
  console.log('Updated:', updatedTask);

  // Testing deleteTask function:
  const deleted = deleteTask(10);
  console.log(deleted ? 'Task deleted successfully' : 'Task not found');

  try {
    console.log('Checking deleted task:', 10);
    const taskFound = getTaskById(10);
    console.log('Found:', taskFound);
  } catch (err) {
    console.error('Expected error:', (err as Error).message);
  }

  //checking filtering tasks by status:
  console.log('--- Filter by status: done ---')
  const doneTasks = filterTasks({ status: Status.Done })
  console.log(doneTasks)
  console.log('Number of done tasks:', doneTasks.length)
  console.log('\n')

  console.log('--- Filter by priority: high ---')
  const highPriority = filterTasks({ priority: Priority.High })
  console.log(highPriority)
  console.log('Number of high priority tasks:', highPriority.length)
  console.log('\n')

  console.log('--- Filter by createdAfter: 2024-10-05 ---')
  const afterDate = filterTasks({ createdAfter: new Date('2024-10-05') })
  console.log(afterDate)
  console.log('Number of tasks created after 2024-10-05:', afterDate.length)
  console.log('\n')

  console.log('--- Filter by createdBefore: 2024-10-05 ---')
  const beforeDate = filterTasks({ createdBefore: new Date('2024-10-05') })
  console.log(beforeDate)
  console.log('Number of tasks created before 2024-10-05:', beforeDate.length)
  console.log('\n')

  console.log('--- Checking deadlines ---');
  isTaskCompletedBeforeDeadline(1) // Assuming task with id 1 is done
  isTaskCompletedBeforeDeadline(2) // not done
  isTaskCompletedBeforeDeadline(3) // not done
  isTaskCompletedBeforeDeadline(4) // done, but after deadline
  isTaskCompletedBeforeDeadline(5) // not done
  isTaskCompletedBeforeDeadline(6) // done before deadline
  isTaskCompletedBeforeDeadline(7) // done before deadline
  isTaskCompletedBeforeDeadline(8) // not done
  isTaskCompletedBeforeDeadline(9) // done, but after deadline
  isTaskCompletedBeforeDeadline(10) // not found (deleted)
  isTaskCompletedBeforeDeadline(100) // Non-existent task
  console.log('\n')

  //Checking new filters:

  //All completed before deadline:
  console.log('--- Filter: completed before deadline ---')
  console.log(filterTasks({ completedBeforeDeadline: true }))
  console.log('\n')

  // All completed after deadline or not completed at all
  console.log('--- Filter: completed after deadline or not completed at all ---')
  console.log(filterTasks({ completedBeforeDeadline: false }))
  console.log('\n')

  // All high-priority, completed in time
  console.log('--- Filter: high-priority, completed in time ---')
  console.log(filterTasks({ status: Status.Done, priority: Priority.High, completedBeforeDeadline: true }))
  console.log('\n')

}
start()