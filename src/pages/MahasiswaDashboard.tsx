// Lokasi file: src/pages/MahasiswaDashboard.tsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import "../styles/MahasiswaDashboard.css";

// Interface dan Skeleton bisa dipindah ke file terpisah agar lebih rapi
interface Mahasiswa {
  nim: string;
  name: string;
  gender: string;
  contact: string | null;
  created_at: string;
}

const TableSkeleton = () => (
  <tbody>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td><div className="h-6 bg-gray-200 rounded"></div></td>
        <td><div className="h-6 bg-gray-200 rounded"></div></td>
        <td><div className="h-6 bg-gray-200 rounded"></div></td>
        <td><div className="h-6 bg-gray-200 rounded"></div></td>
        <td><div className="h-6 bg-gray-200 rounded"></div></td>
        <td><div className="h-6 bg-gray-200 rounded"></div></td>
      </tr>
    ))}
  </tbody>
);

const MahasiswaDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  const fetchMahasiswa = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("mahasiswa")
      .select("nim, name, gender, contact, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      setError("Gagal memuat data. Periksa RLS di Supabase.");
    } else if (data) {
      setMahasiswaList(data);
    }
    setLoading(false);
  }, []);

  // --- PERBAIKAN 1: "Penjaga" Halaman & "Live" Update yang BENAR ---
  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/login');
      } else {
        setUserEmail(session.user.email || '');
        fetchMahasiswa();
      }
    };
    
    checkSessionAndFetch();

    const handleFocus = () => checkSessionAndFetch();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [navigate, fetchMahasiswa]);

  // --- PERBAIKAN 2: Fungsi Logout yang BENAR ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // --- PERBAIKAN 3: Fungsi Delete sekarang akan berfungsi karena login sudah benar ---
  const handleDelete = async (nim: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus ${name} (NIM: ${nim})?`)) {
      const { error } = await supabase.from("mahasiswa").delete().eq("nim", nim);
      if (error) {
        setError("Gagal menghapus data: " + error.message);
      } else {
        setMahasiswaList(prev => prev.filter(mhs => mhs.nim !== nim));
      }
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="header-content">
          <div className="header-logo">Elearning MMA</div>
          <div className="header-actions">
            <div className="user-info">
              {/* --- PERBAIKAN 4: Tampilkan email user yang login --- */}
              <div>{userEmail}</div>
              <div>Admin Role</div>
            </div>
            <button onClick={handleLogout} className="logout-button-header" title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </header>

      <nav className="sub-header">
        <div className="nav-tabs">
          <button className="nav-link active">Daftar Mahasiswa</button>
          <button className="nav-link" onClick={() => navigate('/add')}>+ Tambah Baru</button>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-card">
          <div className="table-controls">
            <div className="search-bar">
              <svg width="20" height="20" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"></circle><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"></line></svg>
              <input type="text" placeholder="Cari mahasiswa..." />
            </div>
            <button className="filter-button">Filter</button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {error && <p className="error-message">{error}</p>}
            <table className="crud-table">
              <thead>
                <tr>
                  <th><input type="checkbox"/></th>
                  <th>Name</th>
                  <th>NIM</th>
                  <th>Kontak</th>
                  <th>Ditambahkan</th>
                  <th style={{ textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              {loading ? <TableSkeleton /> : (
                <tbody>
                  {mahasiswaList.map(mhs => (
                    <tr key={mhs.nim}>
                      <td><input type="checkbox"/></td>
                      <td>
                        <div className="user-cell">
                          <img src={`https://i.pravatar.cc/40?u=${mhs.nim}`} alt="avatar" />
                          <span>{mhs.name}</span>
                        </div>
                      </td>
                      <td>{mhs.nim}</td>
                      <td>{mhs.contact || '-'}</td>
                      <td>{new Date(mhs.created_at).toLocaleDateString()}</td>
                      <td className="action-buttons" style={{ textAlign: 'center' }}>
                        <button className="btn-edit" onClick={() => navigate(`/edit/${mhs.nim}`)}>Edit</button> |
                        <button className="btn-delete" onClick={() => handleDelete(mhs.nim, mhs.name)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          <div className="pagination">
            <button className="active">1</button><button>2</button><button>3</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MahasiswaDashboard;