import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title_number: string;
  only_title: string;
  lesson_number: number;
  note: string;
  is_done: boolean;
}

const ManegementTable = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const lessonCount = 15;
  
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

  const groupedTasks: { [Key: string]:{ [lesson:number]: Task } } = {};
  tasks.forEach((task) => {
    if (!groupedTasks[task.only_title]) {
      groupedTasks[task.only_title] = {};
    }
    groupedTasks[task.only_title][task.lesson_number] = task;
  })

  const BackHome = () =>{
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="px-6 mx-auto">
        <header className="flex justify-between">
          <h1 className="text-2xl font-bold">管理リスト</h1>
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
      </div>

      <div className="overflow-x-auto p-4">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">項目</th>
              {Array.from({ length: lessonCount }, (_, i) => (
                <th key={i} className="border border-gray-300 px-4 py-2">
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedTasks).map(([title, lessons]) => (
              <tr key={title}>
                <td className="border border-gray-300 px-4 py-2 font-medium">{title}</td>
                {Array.from({ length: lessonCount }, (_, i) => {
                  const lessonTask = lessons[i + 1];
                  return (
                    <td key={i} className="border border-gray-300 px-4 py-2 text-center">
                      {lessonTask ? (
                        <input
                          type="checkbox"
                          checked={lessonTask.is_done}
                          className="cursor-not-allowed"
                          readOnly
                        />
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
  );
}

export default ManegementTable;