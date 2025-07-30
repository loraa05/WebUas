// Lokasi file: src/App.tsx

import React from 'react';
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
        <Route path="/login" element={<Login />} />
        
        <Route path="/mahasiswa" element={<MahasiswaDashboard />} />
        <Route path="/add" element={<AddMahasiswa />} />
        
        {/* --- PERBAIKAN: Gunakan :nim agar cocok dengan Dashboard --- */}
        <Route path="/edit/:nim" element={<EditMahasiswa />} />
        <Route path="/detail/:nim" element={<MahasiswaDetail />} />
      </Routes>
    </Router>
  );
}

export default App;