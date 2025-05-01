function ManegementTable() {
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="px-6 mx-auto">
        <header className="flex justify-between">
          <h1 className="text-2xl font-bold">管理リスト</h1>
          <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
              管理表
            </button>
            <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
              追加
            </button>
          </div>
        </header>

        <hr className="my-4 border-gray-400" />
      </div>
    </div>
  );
}

export default ManegementTable