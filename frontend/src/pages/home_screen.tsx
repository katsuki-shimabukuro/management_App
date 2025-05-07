import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  lesson_number: number;
  note: string;
  is_done: boolean;
}

const HomeScreen = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error('API fetch error:', err);
      });
  };

  const handleDeleteTask = (id: number) => {
    fetch(`http://localhost:8080/api/tasks/${id}` ,{
      method: "DELETE",
    })
      .then(() => {
        fetchTasks();
      })
      .catch(err => {
        console.error('DELETE error:', err);
      })
  };

  const handleToggleDone = (id: number, isDone: boolean) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_done: isDone }),
    })
      .then(() => {
        fetchTasks();
      })
      .catch((err) => {
        console.error('PATCH error:', err);
      });
  };

  const handleNavigate_Table = () => {
    navigate('/ManegementTable');
  }

  const handleNavigate_add = () => {
    navigate('/Adding');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="px-6 mx-auto">
        <header className="flex justify-between">
          <h1 className="text-2xl font-bold">タスク表</h1>
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={handleNavigate_add}
            >
              追加
            </button>
            <button 
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={handleNavigate_Table}
            >
              管理リスト
            </button>
          </div>
        </header>
        <hr className="my-4 border-gray-400" />

        <div className='px-30'>
          <h2 className="text-xl font-semibold">タスクリスト</h2>
          <hr className="my-4 border-gray-400" />
          <ul className="mt-2 space-y-1">
            {Array.isArray(tasks) && tasks.map((task) => (
              <li key={task.id} className="bg-white rounded-lg shadow p-4 mb-2 flex justify-between items-center">
                <span className='font-semibold'>
                  {task.title}
                </span>
                <div className="text-sm text-gray-600">備考：{task.note}</div>
                <div className='flex space-x-2'>
                  <input 
                    type="checkbox"
                    checked={task.is_done}
                    onChange={(e) => handleToggleDone(task.id, e.target.checked)} 
                  />
                  <button
                    className='bg-red-500 text-white px-2 py-1 rounded text-sm'
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
