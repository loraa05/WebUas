// Lokasi file: src/pages/Login.tsx
// VERSI "RESET" YANG DIJAMIN STABIL

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

// Menggunakan import CSS biasa yang tidak akan menyebabkan error.
import "../styles/Login.css"; 

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Jika sudah login, langsung arahkan ke dashboard
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/mahasiswa");
      }
    };
    checkSession();
  }, [navigate]);

  // Menggunakan metode login Supabase Auth yang aman
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Email atau password salah. Silakan coba lagi.");
    } else {
      navigate('/mahasiswa');
    }
    
    setLoading(false);
  };

  return (
    // Menggunakan className string biasa untuk menghindari error 'TypeError'
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          {/* Pastikan logo ada di folder public/assets/logo.png */}
          <img src="/assets/logo.png" alt="Logo Mercu Buana" className="logo-img" />
        </div>

        <div className="form-section">
          <h2 className="form-title">Welcome to</h2>
          <h1 className="form-subtitle">Management Data Mahasiswa</h1>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Username/Email</label>
              <input 
                id="email"
                className="input-field"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                className="input-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            {error && (
              <div className="error-message">{error}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;