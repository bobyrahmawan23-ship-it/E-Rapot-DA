import React, { useState } from 'react';
import { Lock, User, KeyRound, Sparkles, BookOpen, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { MusyrifUser } from '../types';
import { DEFAULT_USERS } from '../data/defaultData';

interface LoginScreenProps {
  onLogin: (user: MusyrifUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('musyrif');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customNama, setCustomNama] = useState('');
  const [customHalaqoh, setCustomHalaqoh] = useState('Halaqoh Tahfidz');

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim().toLowerCase();
    const matched = DEFAULT_USERS.find(
      (u) => u.username.toLowerCase() === trimmedUser
    );

    // Accept standard demo PIN/passwords or general musyrif
    if (matched) {
      if (password === '123456' || password === 'daarulabidin' || password.length >= 4) {
        onLogin(matched);
        return;
      }
    }

    if (trimmedUser === 'musyrif' || trimmedUser === 'ustadz' || trimmedUser === 'admin') {
      onLogin({
        id: 'user-' + Date.now(),
        username: trimmedUser,
        nama: trimmedUser === 'admin' ? 'Ustadz Muhammad Ridwan, M.Ag' : 'Ustadz Ahmad Fauzi, S.Pd.I',
        halaqoh: 'Halaqoh Utsman bin Affan',
        role: trimmedUser === 'admin' ? 'admin' : 'musyrif',
      });
      return;
    }

    if (password.length >= 4) {
      // Allow custom username login
      onLogin({
        id: 'user-' + Date.now(),
        username: trimmedUser,
        nama: `Ustadz ${username}`,
        halaqoh: 'Halaqoh Tahfidz',
        role: 'musyrif',
      });
      return;
    }

    setError('Kata sandi minimal 4 karakter (Default: 123456)');
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNama.trim()) {
      setError('Mohon masukkan nama Ustadz / Musyrif');
      return;
    }

    onLogin({
      id: 'user-custom-' + Date.now(),
      username: customNama.toLowerCase().replace(/\s+/g, ''),
      nama: customNama.trim(),
      halaqoh: customHalaqoh.trim() || 'Halaqoh Tahfidz Qur\'an',
      role: 'musyrif',
    });
  };

  const handleQuickSelect = (user: MusyrifUser) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white">
      
      {/* Decorative Islamic Background glow */}
      <div className="w-full max-w-md">
        
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-emerald-100 relative overflow-hidden">
          
          {/* Top Brand Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />

          {/* Logo and Header Title */}
          <div className="text-center mb-6 pt-2">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white border border-emerald-200 shadow-md p-2 flex items-center justify-center mb-3">
              <img 
                src="/logo.svg" 
                alt="Logo Ma'had Tahfidz Qur'an Daarul Abidin" 
                className="w-full h-full object-contain"
              />
            </div>

            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Ma'had Tahfidz Qur'an
            </span>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
              DAARUL ABIDIN
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sistem Input Nilai PTS, PAS & E-Rapot Resmi (A4)
            </p>
          </div>

          {/* Preset Quick Login Buttons (Very convenient for mobile use!) */}
          <div className="mb-5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <p className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span>Masuk Cepat Sebagai Musyrif:</span>
              <span className="text-emerald-700 text-[10px] font-semibold">1-Klik Langsung</span>
            </p>
            <div className="grid grid-cols-1 gap-2">
              {DEFAULT_USERS.map((usr) => (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => handleQuickSelect(usr)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50/50 active:scale-98 transition text-left shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {usr.nama.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                        {usr.nama}
                      </p>
                      <p className="text-[10px] text-slate-500">{usr.halaqoh}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
                </button>
              ))}
            </div>
          </div>

          {/* Form Switcher */}
          <div className="flex items-center justify-center gap-4 my-3 text-xs text-slate-500">
            <span className="h-px bg-slate-200 flex-1" />
            <span>atau isi formulir login</span>
            <span className="h-px bg-slate-200 flex-1" />
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 text-center font-medium">
              {error}
            </div>
          )}

          {!isCustomMode ? (
            <form onSubmit={handleStandardLogin} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  ID Pengguna / Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="musyrif / admin"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Kata Sandi / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="PIN: 123456"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Default PIN: <strong>123456</strong>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                Masuk ke Aplikasi
              </button>

              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className="w-full py-2 text-center text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                Gunakan Nama Ustadz Lain & Halaqoh Baru →
              </button>
            </form>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Nama Lengkap Ustadz / Musyrif
                </label>
                <input
                  type="text"
                  value={customNama}
                  onChange={(e) => setCustomNama(e.target.value)}
                  placeholder="Contoh: Ustadz Bilal bin Rabah, S.Ag"
                  required
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Nama Halaqoh Binaan
                </label>
                <input
                  type="text"
                  value={customHalaqoh}
                  onChange={(e) => setCustomHalaqoh(e.target.value)}
                  placeholder="Contoh: Halaqoh Ali bin Abi Thalib"
                  required
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Masuk dengan Profil Ini
              </button>

              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="w-full py-2 text-center text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                ← Kembali ke Akun Default
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Penyimpanan Offline Aman di Layar HP</span>
          </div>

        </div>

        {/* Address footer */}
        <p className="text-center text-xs text-emerald-200/80 mt-4 leading-relaxed px-4">
          Kp. Gunteng RT 03 RW 09 Ds. Bojong Kec. Karangtengah Kab. Cianjur
        </p>

      </div>
    </div>
  );
};
