// Simpan sebagai src/components/EditMahasiswa.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../utils/supabase";
import "../styles/AddMahasiswa.css"; // Menggunakan kembali style yang sama

// Interface untuk data form, bisa dipindahkan ke file types terpusat
interface MahasiswaData {
  name: string;
  gender: string;
  birthdate: string;
  address: string;
  contact: string;
  status: boolean;
}

// Komponen untuk UI saat loading (opsional tapi sangat direkomendasikan)
const FormSkeleton = () => (
  <div className="form-add animate-pulse">
    <div className="h-10 bg-gray-200 rounded-md w-full mb-4"></div>
    <div className="h-10 bg-gray-200 rounded-md w-full mb-4"></div>
    <div className="h-10 bg-gray-200 rounded-md w-full mb-4"></div>
    <div className="h-10 bg-gray-200 rounded-md w-full mb-4"></div>
    <div className="h-10 bg-gray-200 rounded-md w-full mb-4"></div>
    <div className="h-10 bg-gray-300 rounded-md w-1/3 mt-6"></div>
  </div>
);


const EditMahasiswa: React.FC = () => {
  const navigate = useNavigate();
  const { nim } = useParams<{ nim: string }>(); // Memberi tipe pada params

  // 1. Tambahkan state untuk loading, error, dan proses submit
  const [formData, setFormData] = useState<MahasiswaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Gunakan useCallback untuk membungkus fungsi fetch data
  const fetchData = useCallback(async (studentNim: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("mahasiswa")
      .select("name, gender, birthdate, address, contact, status") // Pilih kolom spesifik
      .eq("nim", studentNim)
      .single();

    if (error || !data) {
      setError("Data mahasiswa tidak ditemukan atau gagal dimuat.");
      console.error("Fetch error:", error?.message);
    } else {
      // 3. Pastikan format tanggal sesuai untuk input type="date" (YYYY-MM-DD)
      setFormData({
        ...data,
        birthdate: data.birthdate ? data.birthdate.split("T")[0] : "",
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (nim) {
      fetchData(nim);
    } else {
      // Jika tidak ada NIM di URL, arahkan pergi.
      navigate("/mahasiswa");
    }
  }, [nim, fetchData, navigate]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const updatedValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    // Pastikan formData tidak null sebelum update
    if (formData) {
      setFormData((prev) => ({
        ...(prev as MahasiswaData),
        [name]: updatedValue,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData || submitting) return; // Mencegah submit ganda

    setSubmitting(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("mahasiswa")
      .update(formData)
      .eq("nim", nim);

    if (updateError) {
      setError("Gagal mengupdate data: " + updateError.message);
    } else {
      alert("Data mahasiswa berhasil diupdate!");
      // 4. Arahkan ke halaman daftar mahasiswa untuk konsistensi
      navigate("/mahasiswa"); 
    }

    setSubmitting(false);
  };
  
  // Tampilkan skeleton saat memuat data
  if (loading) {
    return (
      <div className="add-container">
        <h2 className="text-xl font-bold mb-4">Edit Data Mahasiswa</h2>
        <FormSkeleton />
      </div>
    );
  }

  // Tampilkan pesan error jika data tidak ditemukan atau gagal dimuat
  if (error && !formData) {
    return (
      <div className="add-container text-center">
        <p className="text-red-500">{error}</p>
        <button onClick={() => navigate('/mahasiswa')} className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded">
          Kembali ke Daftar
        </button>
      </div>
    );
  }
  
  if (!formData) return null; // Seharusnya tidak pernah terjadi, tapi pengaman

  return (
    <div className="add-container">
      <div>
        <h2 className="text-xl font-bold">Edit Data Mahasiswa</h2>
        {/* 5. Tampilkan NIM sebagai informasi read-only */}
        <p className="text-sm text-gray-500 mb-4">NIM: {nim}</p>
      </div>

      {/* Tampilkan error update di atas form */}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="form-add">
        {/* ... (semua input tetap sama) ... */}
        <input type="text" name="name" placeholder="Nama Lengkap" value={formData.name} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="" disabled>Pilih Jenis Kelamin</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
        <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Alamat Domisili" value={formData.address} onChange={handleChange} required />
        <input type="text" name="contact" placeholder="No. HP / WhatsApp" value={formData.contact} onChange={handleChange} required />
        <label className="checkbox-label">
          <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
          Status Aktif
        </label>
        
        {/* 6. Beri feedback saat tombol disubmit */}
        <button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
};

export default EditMahasiswa;