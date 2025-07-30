// Simpan sebagai src/components/AddMahasiswa.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase"; // Pastikan path ini benar
import "../styles/AddMahasiswa.css"; // Pastikan path ini benar

// 1. Definisikan interface untuk tipe data form agar lebih aman dan jelas.
interface MahasiswaFormData {
  nim: string;
  name: string;
  gender: string;
  birthdate: string;
  address: string;
  contact: string;
  status: boolean;
}

const AddMahasiswa: React.FC = () => {
  const navigate = useNavigate();

  // 2. Gunakan interface untuk memberi tipe pada state `useState`.
  const [formData, setFormData] = useState<MahasiswaFormData>({
    nim: "",
    name: "",
    gender: "", // Dikosongkan agar placeholder "Pilih Gender" muncul
    birthdate: "",
    address: "",
    contact: "",
    status: true, // Default status aktif
  });

  // 3. Beri tipe yang benar pada event handler.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Gunakan type assertion untuk menangani properti 'checked' yang hanya ada di HTMLInputElement
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // 4. Beri tipe pada event submit form.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nim || !formData.name || !formData.gender || !formData.birthdate) {
      alert("Field NIM, Nama, Gender, dan Tanggal Lahir wajib diisi.");
      return;
    }

    // Objek `formData` sudah memiliki tipe yang sesuai dengan tabel Supabase
    const { error } = await supabase.from("mahasiswa").insert([formData]);

    if (error) {
      alert("Gagal menambahkan data mahasiswa: " + error.message);
      console.error("Supabase Error:", error);
    } else {
      alert("Data mahasiswa berhasil ditambahkan!");
      navigate("/mahasiswa");
    }
  };

  return (
    <div className="add-container">
      <h2>Tambah Data Mahasiswa</h2>
      <form onSubmit={handleSubmit} className="form-add">
        <input
          type="text"
          name="nim"
          placeholder="NIM (contoh: 418230100099)"
          value={formData.nim}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          {/* Nilai "" cocok dengan state awal agar placeholder ini terpilih */}
          <option value="" disabled>Pilih Jenis Kelamin</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
        <input
          type="date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Alamat"
          value={formData.address}
          onChange={handleChange}
          required // Sesuai tabel, address tidak boleh null
        />
        <input
          type="text"
          name="contact"
          placeholder="No. Kontak / HP"
          value={formData.contact}
          onChange={handleChange}
          required // Sesuai tabel, contact tidak boleh null
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
          />
          Status Aktif
        </label>
        <button type="submit">Tambah Mahasiswa</button>
      </form>
    </div>
  );
};

export default AddMahasiswa;