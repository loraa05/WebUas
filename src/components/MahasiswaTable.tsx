// Lokasi file: src/components/MahasiswaTable.tsx

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';

// 1. Definisikan tipe data Mahasiswa yang akan digunakan
interface Mahasiswa {
  id: number; // ID penting untuk operasi hapus
  nim: string;
  name: string;
  gender: string;
  birthdate: string;
  address: string;
  contact: string;
  status: boolean;
}

// Komponen Skeleton untuk UX Loading
const TableSkeleton = () => (
  <div className="w-full animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex space-x-4 p-4 border-b">
        <div className="flex-1 h-5 bg-gray-200 rounded"></div>
        <div className="flex-1 h-5 bg-gray-200 rounded"></div>
        <div className="flex-1 h-5 bg-gray-200 rounded"></div>
        <div className="flex-1 h-5 bg-gray-200 rounded"></div>
        <div className="flex-1 h-5 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);


const MahasiswaTable = () => {
  const navigate = useNavigate();
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  
  // 2. Tambahkan state untuk UX yang lebih baik
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMahasiswa = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // 3. Pilih kolom yang dibutuhkan dan urutkan
    const { data, error: fetchError } = await supabase
      .from('mahasiswa')
      .select('id, nim, name, gender, birthdate, address, contact, status')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Gagal mengambil data mahasiswa:', fetchError.message);
      setError('Gagal memuat data. Silakan coba lagi.');
    } else {
      setMahasiswaList(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMahasiswa();
  }, [fetchMahasiswa]);

  const handleDelete = async (id: number, name: string) => {
    // 4. Gunakan 'confirm' bawaan browser sebagai ganti modal
    const isConfirmed = confirm(`Apakah Anda yakin ingin menghapus data mahasiswa bernama "${name}"?`);
    if (!isConfirmed) return;

    const { error: deleteError } = await supabase
      .from('mahasiswa')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError('Gagal menghapus data: ' + deleteError.message);
    } else {
      // Refresh data setelah berhasil hapus
      fetchMahasiswa();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // 5. Render konten berdasarkan state (loading, error, atau data)
  const renderTable = () => {
    if (loading) {
      return <TableSkeleton />;
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600 font-semibold">{error}</p>
          <button onClick={fetchMahasiswa} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Coba Lagi
          </button>
        </div>
      );
    }

    if (mahasiswaList.length === 0) {
      return <p className="text-center p-8">Belum ada data mahasiswa.</p>;
    }
    
    return (
      <table className="min-w-full border text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">NIM</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Gender</th>
            <th className="border px-4 py-2">Tgl Lahir</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswaList.map((mhs) => (
            // --- INI BAGIAN UTAMA YANG DIPERBAIKI ---
            <tr key={mhs.id}>
              <td className="border px-4 py-2 font-mono">{mhs.nim}</td>
              <td className="border px-4 py-2">{mhs.name}</td>
              <td className="border px-4 py-2">{mhs.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
              <td className="border px-4 py-2">{new Date(mhs.birthdate).toLocaleDateString('id-ID')}</td>
              <td className="border px-4 py-2">
                <span className={`px-2 py-1 text-xs rounded-full ${mhs.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {mhs.status ? 'Aktif' : 'Nonaktif'}
                </span>
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button onClick={() => navigate(`/detail/${mhs.nim}`)} className="text-blue-600 hover:underline">Lihat</button>
                <button onClick={() => navigate(`/edit/${mhs.nim}`)} className="text-yellow-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(mhs.id, mhs.name)} className="text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Mahasiswa</h1>
        <div className="flex space-x-3">
            <button onClick={() => navigate('/add')} className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
                + Tambah Mahasiswa
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700">
                Logout
            </button>
        </div>
      </header>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {renderTable()}
      </div>
    </div>
  );
};

export default MahasiswaTable;