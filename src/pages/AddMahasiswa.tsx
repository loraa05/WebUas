import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import "../styles/AddMahasiswa.css"; 

const AddMahasiswa: React.FC = () => {
  const navigate = useNavigate();
  const [nim, setNim] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
        }
      } catch (err) {
        console.error("Gagal memeriksa sesi:", err);
        navigate('/login'); 
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = { nim, name, gender, birthdate, address, contact, status };

    if (!nim || !name || !gender || !birthdate) {
      setError("Field dengan tanda bintang (*) wajib diisi.");
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("mahasiswa").insert([formData]);

    if (insertError) {
      setError("Gagal menambahkan data: " + insertError.message);
    } else {
      alert("Data berhasil ditambahkan!");
      navigate("/mahasiswa");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="header-content">
          <div className="header-logo">Elearning MMA</div>
          <button onClick={() => navigate('/mahasiswa')} className="logout-button">Kembali</button>
        </div>
      </header>
      <main className="main-content">
        <div className="add-container">
          <h2>Tambah Mahasiswa Baru</h2>
          <form onSubmit={handleSubmit} className="form-add">
            {/* Input NIM */}
            <div className="form-group">
              <label htmlFor="nim">NIM *</label>
              <input id="nim" value={nim} onChange={(e) => setNim(e.target.value)} required />
            </div>
            {/* Input Nama */}
            <div className="form-group">
              <label htmlFor="name">Nama *</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            {/* Input Gender */}
            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="" disabled>Pilih Gender</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            {/* Input Tanggal Lahir */}
            <div className="form-group">
              <label htmlFor="birthdate">Tanggal Lahir *</label>
              <input id="birthdate" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
            </div>
            {/* Input Alamat */}
            <div className="form-group form-group-full">
              <label htmlFor="address">Alamat</label>
              <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            {/* Input Kontak */}
            <div className="form-group form-group-full">
              <label htmlFor="contact">Kontak</label>
              <input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            {/* Checkbox Status */}
            <label className="checkbox-label">
              <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />
              Status Aktif
            </label>
            {/* Tombol Aksi */}
            <div className="form-actions">
              <button type="button" onClick={() => navigate('/mahasiswa')} className="btn-secondary">Batal</button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Tambah'}
              </button>
            </div>
            {/* Pesan Error */}
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddMahasiswa;