// Lokasi file: src/pages/Login.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Query manual ke tabel users (sama seperti kode yang bisa jalan)
      const { data, error: queryError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.trim())
        .single();

      if (queryError || !data) {
        setError("Email tidak ditemukan.");
        setLoading(false);
        return;
      }

      // Check password (plain-text comparison)
      if (data.password !== password) {
        setError("Password salah!");
        setLoading(false);
        return;
      }

      // Simpan info login di localStorage
      localStorage.setItem("user", JSON.stringify(data));
      
      // Berhasil login - kasih notifikasi
      console.log("Login berhasil:", data);
      setSuccess(`Login berhasil! Selamat datang`);
      
      // Delay sedikit biar user baca notifikasi
      setTimeout(() => {
        navigate("/mahasiswa"); // atau "/dashboard" sesuai kebutuhan
      }, 2000);
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Kolom Kiri: Logo */}
        <div className="logo-section">
          <img src="/assets/logo.png" alt="Logo Mercu Buana" className="logo-img" />
        </div>

        {/* Kolom Kanan: Form */}
        <div className="form-section">
          <h2 className="form-title">Welcome to</h2>
          <h1 className="form-subtitle">Management Data
Mahasiswa</h1>

          <form onSubmit={handleLogin} noValidate>
            <div className="input-group">
              <label className="input-label">Username/Email</label>
              <input 
                id="email"
                className="input-field"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
              />
              <span className="input-icon">📧</span>
            </div>
            
            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                id="password"
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
              />
              <span className="input-icon">🔑</span>
              <span 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <button 
              type="submit" 
              className="login-button" 
              disabled={loading || !email || !password}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            {error && (
              <div className="error-message">{error}</div>
            )}
            
            {success && (
              <div className="success-message" style={{ 
                color: 'green', 
                padding: '10px', 
                backgroundColor: '#d4edda', 
                border: '1px solid #c3e6cb', 
                borderRadius: '4px', 
                marginTop: '10px' 
              }}>
                {success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;