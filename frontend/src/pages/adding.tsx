import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Adding = () => {
  const navigate = useNavigate();
  const [newTaskTitle, setNewTaskTitle] = useState('');

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
      })
      .then(() => {
        navigate('/');
      })
      .catch(err => {
        console.error("POST error:", err);
      });
  };

  const BackHome = () =>{
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="px-6 mx-auto">
        <header className="flex justify-between">
          <h1 className="text-2xl font-bold">追加</h1>
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              onClick={BackHome}
            >
              戻る
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
        
      </div>
    </div>
    
  );
}

export default Adding;