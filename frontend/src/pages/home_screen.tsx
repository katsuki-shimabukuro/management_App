import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title_number: string;
  only_title: string;
  lesson_number: number;
  note: string;
  is_done: boolean;
  deadline?: string;
}

const HomeScreen = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [newDeadline, setNewDeadline] = useState<string>("");


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

  const handleUpdateDeadline = () => {
    if (editingTaskId === null) return;
    fetch(`http://localhost:8080/api/tasks/${editingTaskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deadline: newDeadline }),
    })
      .then(() => {
        setEditingTaskId(null);
        setNewDeadline("");
        fetchTasks();
      })
      .catch((err) => {
        console.error("期限更新エラー:", err);
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
      <div className="px-30 mx-auto">
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
          <ul className="mt-2 space-y-1">
            {Array.isArray(tasks) && tasks.map((task) => (
              <li key={task.id} className="bg-white rounded-lg shadow p-4 mb-2 flex flex-col">
                <div className="flex justify-between items-center">
                  <span className='font-semibold'>{task.title_number}</span>
                  <div className='flex space-x-2'>
                    <input 
                      type="checkbox"
                      checked={task.is_done}
                      onChange={(e) => handleToggleDone(task.id, e.target.checked)} 
                    />
                    <button
                      className='bg-yellow-400 text-white px-2 py-1 rounded text-sm'
                      onClick={() => setEditingTaskId(task.id)}
                    >
                      期限設定
                    </button>
                    <button
                      className='bg-red-500 text-white px-2 py-1 rounded text-sm'
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">備考：{task.note}</div>
                {task.deadline && (
                  <div className="text-sm text-gray-500">
                    期限：{new Date(task.deadline).toLocaleString(undefined, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </li>
            ))}
            {editingTaskId !== null && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-100/40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-lg font-bold mb-2">期限を設定</h2>
                  <input
                    type="datetime-local"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={handleUpdateDeadline}
                    >
                      保存
                    </button>
                    <button
                      className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                      onClick={() => {
                        setEditingTaskId(null);
                        setNewDeadline("");
                      }}
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
