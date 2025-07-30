// Simpan sebagai: src/pages/MahasiswaDetail.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import "../styles/MahasiswaDetail.css"; // Pastikan file CSS ini ada dan sesuai

// 1. Sesuaikan tipe data agar konsisten dengan komponen lain (Dashboard, Edit)
type Mahasiswa = {
  nim: string;
  name: string;
  gender: string;
  birthdate: string;
  address: string;
  contact: string;
  status: boolean;
};

// Komponen untuk UI saat loading (Skeleton)
const DetailSkeleton = () => (
  <div className="detail-box animate-pulse">
    <div className="h-8 bg-gray-300 rounded-md w-3/4 mb-6"></div>
    <div className="space-y-4">
      <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
      <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
      <div className="h-5 bg-gray-200 rounded-md w-full"></div>
      <div className="h-5 bg-gray-200 rounded-md w-1/3"></div>
    </div>
  </div>
);

const MahasiswaDetail: React.FC = () => {
  // Gunakan 'nim' sebagai parameter, sesuai dengan alur dari dashboard
  const { nim } = useParams<{ nim: string }>();
  const navigate = useNavigate();

  // 2. Tambahkan state untuk error
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Gunakan useCallback untuk efisiensi
  const fetchDetail = useCallback(async (studentNim: string) => {
    setLoading(true);
    setError(null);

    // Pilih kolom yang relevan, bukan '*'
    const { data, error: fetchError } = await supabase
      .from("mahasiswa")
      .select("nim, name, gender, birthdate, address, contact, status")
      .eq("nim", studentNim)
      .single();

    if (fetchError) {
      console.error("Gagal mengambil detail:", fetchError.message);
      setError("Data mahasiswa tidak ditemukan atau terjadi kesalahan server.");
    } else {
      setMahasiswa(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (nim) {
      fetchDetail(nim);
    } else {
      // Jika tidak ada nim, kembali ke halaman utama
      navigate("/mahasiswa");
    }
  }, [nim, fetchDetail, navigate]);

  const renderContent = () => {
    if (loading) {
      return <DetailSkeleton />;
    }

    if (error || !mahasiswa) {
      return (
        <div className="text-center p-8">
          <p className="text-red-500 font-semibold">{error || "Data tidak ditemukan."}</p>
        </div>
      );
    }

    // 4. Tampilkan data dengan layout yang lebih baik
    return (
      <div className="detail-box">
        <div className="detail-header">
          <h3 className="detail-name">{mahasiswa.name}</h3>
          <span className={`status-badge ${mahasiswa.status ? 'status-active' : 'status-inactive'}`}>
            {mahasiswa.status ? 'Aktif' : 'Tidak Aktif'}
          </span>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">NIM</span>
            <span className="detail-value">{mahasiswa.nim}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Jenis Kelamin</span>
            <span className="detail-value">{mahasiswa.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Tanggal Lahir</span>
            <span className="detail-value">{new Date(mahasiswa.birthdate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Kontak</span>
            <span className="detail-value">{mahasiswa.contact}</span>
          </div>
          <div className="detail-item detail-item-full">
            <span className="detail-label">Alamat</span>
            <span className="detail-value">{mahasiswa.address}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="detail-container">
      <div className="detail-title-bar">
        <h2>Detail Mahasiswa</h2>
        <button className="btn-back" onClick={() => navigate('/mahasiswa')}>
          ⬅ Kembali ke Daftar
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default MahasiswaDetail;