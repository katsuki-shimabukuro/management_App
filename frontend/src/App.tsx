import { Routes, Route } from 'react-router-dom';
import Home from './pages/home_screen';
import ManegementTable from './pages/manegement_table';
import Adding from './pages/adding'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ManegementTable" element={<ManegementTable />} />
      <Route path="/Adding" element={<Adding />} />
    </Routes>
  );
}

export default App;
