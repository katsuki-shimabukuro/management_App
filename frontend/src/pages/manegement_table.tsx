import { useNavigate } from 'react-router-dom';

const ManegementTable = () => {
  const navigate = useNavigate();
  // 仮のデータ。あとで消す。(shima)
  const subjects = ["生体医工学", "情報セキュリティ", "電気電子工学", "理工学概論", "算数"];
  const lessonCount = 14;
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
              <th className="border border-gray-300 px-4 py-2 text-left">教科</th>
              {Array.from({ length: lessonCount }, (_, i) => (
                <th key={i} className="border border-gray-300 px-4 py-2">
                  {i + 1}
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2">最終レポートorテスト</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium">{subject}</td>
                {Array.from({ length: lessonCount+1 }, (_, j) => (
                  <td key={j} className="border border-gray-300 px-4 py-2 text-center">
                    <input type="checkbox" />
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