// Lokasi file: src/App.tsx

import React from 'react'; // 'useState' tidak diperlukan di sini
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MahasiswaDashboard from "./pages/MahasiswaDashboard";
import AddMahasiswa from "./pages/AddMahasiswa";
import EditMahasiswa from "./pages/EditMahasiswa";
import MahasiswaDetail from "./pages/MahasiswaDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* --- PERBAIKAN DI SINI --- */}
        <Route path="/mahasiswa" element={<MahasiswaDashboard />} />
        
        <Route path="/add" element={<AddMahasiswa />} />
        <Route path="/edit/:id" element={<EditMahasiswa />} />
        <Route path="/detail/:id" element={<MahasiswaDetail />} />
      </Routes>
    </Router>
  );
}

export default App;