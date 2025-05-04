import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

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

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: newTaskTitle })
    })
      .then(res => res.json())
      .then(() => {
        setNewTaskTitle('');
        fetchTasks(); // タスク一覧を再取得
      })
      .catch(err => {
        console.error("POST error:", err);
      });
  };
  const handleNavigate = () => {
    navigate('/ManegementTable');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="px-6 mx-auto">
        <header className="flex justify-between">
          <h1 className="text-2xl font-bold">タスク表</h1>
          <div className="flex space-x-2">
            <button 
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={handleNavigate}
            >
              管理表
            </button>
          </div>
        </header>
        <hr className="my-4 border-gray-400" />

        <div className="flex items-center space-x-2 mb-4">
          <input
            className="border px-2 py-1"
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="新しいタスクを入力"
          />
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={handleAddTask}
          >
            追加
          </button>
        </div>

        <h2 className="text-xl font-semibold">タスクリスト</h2>
        <ul className="mt-2 space-y-1">
          {Array.isArray(tasks) && tasks.map((task) => (
            <li key={task.id} className="border-b py-1">{task.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomeScreen;
