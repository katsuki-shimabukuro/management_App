import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Adding = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [lessonCount, setLessonCount] = useState(0);
  const [note, setNote] = useState('');
  const [titleError, setTitleError] = useState('');
  const [lessonCountError, setLessonCountError] = useState('');

  const handleAddTask = () => {
    let hasError = false;
    // 項目名に対するエラー表示
    if (!title.trim()) {
      setTitleError('記入してください');
      hasError = true;
    } else{
      setTitleError('');
    }
    // 授業回数に対するエラー表示
    if (lessonCount === 0) {
      setLessonCountError('選択してください');
      hasError = true;
    } else {
      setLessonCountError('');
    }

    if (hasError) return;

    const tasks = Array.from({ length: lessonCount }, (_, i) => ({
      title: `第${i + 1}回 ${title}`,
      lesson_number: i+1,
      note: note
    }));

    Promise.all(
      tasks.map(task =>
        fetch("http://localhost:8080/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(task)
        })
      )
    )
      .then(() => {
        setTitle('');
        setLessonCount(0);
        setNote('');
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
        </header>

        <hr className="my-4 border-gray-400" />

        <div className="flex flex-col space-y-5 w-full max-w-md mx-auto">
          <div>
            <label className="block font-semibold mb-1">項目名</label>
            {titleError && (<p className="text-red-500 text-sm mb-1">{titleError}</p>)}
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="例：数学" 
              className='w-full border px-4 py-2 rounded mb-1'
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">授業回数</label>
            {lessonCountError && <p className="text-red-500 text-sm mt-1">{lessonCountError}</p>}
            <select 
              value={lessonCount === 0 ? "" : lessonCount}
              onChange={(e) => setLessonCount(Number(e.target.value))}
              className={`border px-4 py-2 rounded ${lessonCount === 0 ? 'text-gray-400' : 'text-black'}`}
            >
              <option value="" disabled hidden>選択してください</option>
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}回</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">備考</label>
            <textarea 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder="自由記述欄" 
              className='w-full border px-4 py-2 rounded'
            />
          </div>

          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleAddTask}
            >
              追加
            </button>
            <button
              className="border border-blue-600 text-blue-600 px-4 py-1 rounded hover:bg-blue-100 "
              onClick={BackHome}
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Adding;