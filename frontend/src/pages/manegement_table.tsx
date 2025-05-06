import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ManegementTable = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const lessonCount = 14;  //授業回数は14回+「最終レポートorテスト」とする。
  
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
              <th className="border border-gray-300 px-4 py-2">最終レポートorテスト</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tasks) && tasks.map((task, i) => (
              <tr key={i}>
                <td className="border border-gray-300 px-4 py-2 font-medium">{task.title}</td>
                {Array.from({ length: lessonCount+1 }, (_, j) => (
                  <td key={j} className="border border-gray-300 px-4 py-2 text-center">
                    <input 
                      type="checkbox" 
                      checked={task.is_done} 
                      className="cursor-not-allowed" 
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
  );
}

export default ManegementTable;