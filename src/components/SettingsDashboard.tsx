import React, { useState } from 'react';
import { 
  Settings, 
  UserCheck, 
  Building2, 
  Calendar, 
  MapPin, 
  Save, 
  RotateCcw, 
  Check, 
  Sparkles, 
  FileCheck2, 
  Users, 
  PenTool, 
  HelpCircle 
} from 'lucide-react';
import { SchoolSettings, Student } from '../types';

interface SettingsDashboardProps {
  settings: SchoolSettings;
  onSaveSettings: (updated: SchoolSettings, syncToAllStudents: boolean) => void;
  onResetSettings: () => void;
  studentsCount: number;
}

export const SettingsDashboard: React.FC<SettingsDashboardProps> = ({
  settings,
  onSaveSettings,
  onResetSettings,
  studentsCount,
}) => {
  const [formData, setFormData] = useState<SchoolSettings>({ ...settings });
  const [syncToAll, setSyncToAll] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleChange = (field: keyof SchoolSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveSettings(formData, syncToAll);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan pengaturan identitas Mudir, Musyrif, dan Halaqoh ke setelan standar?')) {
      onResetSettings();
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-5 pb-28">
      
      {/* Page Title & Overview */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 text-white p-4 sm:p-6 rounded-3xl shadow-sm border border-emerald-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Administrasi & Cetak Rapot Resmi
            </div>
            <h2 className="text-lg sm:text-xl font-black">
              Dasbor Pengaturan Pejabat & Halaqoh
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
              Atur nama Mudir/Kepala Sekolah, Musyrif Pembina, nama Halaqoh, dan tanggal penerbitan. Data ini akan otomatis dicetak pada Kop Surat, lembar identitas, dan kolom tanda tangan Rapot Resmi A4.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider block">
              Status Sinkronisasi
            </span>
            <div className="text-base sm:text-lg font-black text-amber-300">
              {studentsCount} Santri
            </div>
            <span className="text-[10px] text-emerald-100 font-medium">
              Otomatis Terhubung
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {savedToast && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>Pengaturan Mudir, Musyrif, dan Halaqoh berhasil disimpan ke memori HP!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Card 1: Pimpinan / Mudir Ma'had */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Kepala Sekolah / Mudir Ma'had
              </h3>
              <p className="text-[11px] text-slate-500">
                Pihak yang menandatangani kolom "Mengetahui" di lembar rapot A4
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Nama Lengkap Mudir (Beserta Gelar) *
              </label>
              <input
                type="text"
                value={formData.namaMudir}
                onChange={(e) => handleChange('namaMudir', e.target.value)}
                placeholder="Contoh: Ustadz Muhammad Ridwan, M.Ag"
                required
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-900 font-semibold transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Jabatan Resmi di Rapot *
              </label>
              <input
                type="text"
                value={formData.jabatanMudir}
                onChange={(e) => handleChange('jabatanMudir', e.target.value)}
                placeholder="Mudir Ma'had Tahfidz Qur'an Darul Abidin"
                required
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-900 font-semibold transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-800 block mb-1">
                NIP / NIY Mudir (Opsional)
              </label>
              <input
                type="text"
                value={formData.nipMudir || ''}
                onChange={(e) => handleChange('nipMudir', e.target.value)}
                placeholder="Contoh: NIP. 19870512 201201 1 002 (Boleh dikosongkan)"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-900 transition"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Musyrif Pembina & Halaqoh */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Musyrif Pembina & Identitas Halaqoh
              </h3>
              <p className="text-[11px] text-slate-500">
                Musyrif yang menguji dan menandatangani kolom Musyrif Halaqoh
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Nama Musyrif Halaqoh *
              </label>
              <input
                type="text"
                value={formData.namaMusyrif}
                onChange={(e) => handleChange('namaMusyrif', e.target.value)}
                placeholder="Contoh: Ustadz Ahmad Fauzi, S.Pd.I"
                required
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-900 font-semibold transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Nama Kelas / Halaqoh *
              </label>
              <input
                type="text"
                value={formData.namaHalaqoh}
                onChange={(e) => handleChange('namaHalaqoh', e.target.value)}
                placeholder="Contoh: Kelas VII - Halaqoh Utsman bin Affan"
                required
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-900 font-semibold transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-800 block mb-1">
                NIP / NIY Musyrif (Opsional)
              </label>
              <input
                type="text"
                value={formData.nipMusyrif || ''}
                onChange={(e) => handleChange('nipMusyrif', e.target.value)}
                placeholder="Contoh: NIP. 19920815 201803 1 004 (Boleh dikosongkan)"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-900 transition"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Tanggal & Tempat Penerbitan Rapot */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Waktu & Tempat Penerbitan Rapot
              </h3>
              <p className="text-[11px] text-slate-500">
                Format titimangsa penerbitan (misal: Cianjur, 20 Juni 2026)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Kota / Tempat Penerbitan *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.tempatPenerbitan}
                  onChange={(e) => handleChange('tempatPenerbitan', e.target.value)}
                  placeholder="Cianjur"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-900 font-semibold transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Tanggal Penerbitan Rapot *
              </label>
              <input
                type="text"
                value={formData.tanggalPenerbitan}
                onChange={(e) => handleChange('tanggalPenerbitan', e.target.value)}
                placeholder="Contoh: 20 Juni 2026"
                required
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-900 font-semibold transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Semester Berjalan
              </label>
              <select
                value={formData.semester}
                onChange={(e) => handleChange('semester', e.target.value as any)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-900 font-semibold transition"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Tahun Ajaran
              </label>
              <input
                type="text"
                value={formData.tahunAjaran}
                onChange={(e) => handleChange('tahunAjaran', e.target.value)}
                placeholder="2025/2026"
                required
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-900 font-semibold transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Alamat Kop Surat Rapot A4
              </label>
              <input
                type="text"
                value={formData.alamatKop}
                onChange={(e) => handleChange('alamatKop', e.target.value)}
                placeholder="KP. GUNTENG RT 03 RW 09 DS. BOJONG KEC. KARANGTENGAH KAB. CIANJUR"
                required
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-900 transition"
              />
            </div>
          </div>
        </div>

        {/* Sync checkbox option */}
        <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
          <input
            type="checkbox"
            id="syncCheckbox"
            checked={syncToAll}
            onChange={(e) => setSyncToAll(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="syncCheckbox" className="text-xs text-slate-800 cursor-pointer">
            <strong className="text-emerald-950 font-bold block">
              Sinkronkan Otomatis ke Seluruh ({studentsCount}) Santri
            </strong>
            <span className="text-slate-600 text-[11px] leading-relaxed block mt-0.5">
              Jika dicentang, nama Musyrif, nama Halaqoh, dan tanggal penerbitan yang diatur di sini akan langsung diperbarui ke seluruh santri yang tersimpan.
            </span>
          </label>
        </div>

        {/* Live Signature Preview Card */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-4 sm:p-5">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pratinjau Hasil Cetak Tanda Tangan Rapot A4</span>
          </h4>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center text-xs">
            <p className="text-right text-[11px] font-semibold text-slate-700 mb-3">
              {formData.tempatPenerbitan || 'Cianjur'}, {formData.tanggalPenerbitan || '20 Juni 2026'}
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-slate-600 text-[11px]">Orang Tua / Wali,</p>
                <div className="h-10" />
                <p className="font-bold underline text-slate-900">( ......................... )</p>
              </div>

              <div>
                <p className="text-slate-600 text-[11px]">Musyrif Pembina,</p>
                <div className="h-10" />
                <p className="font-bold underline text-slate-900">
                  {formData.namaMusyrif || 'Nama Musyrif'}
                </p>
                {formData.nipMusyrif && (
                  <p className="text-[9px] text-slate-500">{formData.nipMusyrif}</p>
                )}
              </div>

              <div>
                <p className="text-slate-600 text-[11px]">Mengetahui,</p>
                <p className="font-bold text-[10px] text-slate-800">
                  {formData.jabatanMudir || "Mudir Ma'had Darul Abidin"}
                </p>
                <div className="h-8" />
                <p className="font-bold underline text-slate-900">
                  {formData.namaMudir || 'Nama Mudir'}
                </p>
                {formData.nipMudir && (
                  <p className="text-[9px] text-slate-500">{formData.nipMudir}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-xs shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Rapot</span>
          </button>
        </div>

      </form>

    </div>
  );
};
