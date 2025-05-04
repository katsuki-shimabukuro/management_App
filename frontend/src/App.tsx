import { Routes, Route } from 'react-router-dom';
import Home from './pages/home_screen';
import ManegementTable from './pages/manegement_table';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ManegementTable" element={<ManegementTable />} />
    </Routes>
  );
}

export default App;
