import React, { useState } from 'react';
import { BookOpen, Check, RotateCcw, Save, ShieldCheck, AlertCircle, Sparkles, Layers } from 'lucide-react';
import { SubjectId, SubjectCompetency } from '../types';
import { DEFAULT_SUBJECTS, DEFAULT_KKM } from '../data/defaultData';

interface CompetencyDashboardProps {
  competencies: Record<SubjectId, SubjectCompetency>;
  onSaveCompetencies: (updated: Record<SubjectId, SubjectCompetency>) => void;
  onResetCompetencies: () => void;
}

export const CompetencyDashboard: React.FC<CompetencyDashboardProps> = ({
  competencies,
  onSaveCompetencies,
  onResetCompetencies,
}) => {
  const [formData, setFormData] = useState<Record<SubjectId, SubjectCompetency>>({ ...competencies });
  const [savedToast, setSavedToast] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Al-Qur\'an & Tahfidz' | 'Kepribadian & Bahasa'>('Semua');

  const handleTextChange = (id: SubjectId, text: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { kkm: DEFAULT_KKM }),
        description: text,
      },
    }));
  };

  const handleKkmChange = (id: SubjectId, val: number) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { description: '' }),
        kkm: val,
      },
    }));
  };

  const handleSave = () => {
    onSaveCompetencies(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan semua deskripsi kompetensi dan KKM ke standar kurikulum Ma\'had Darul Abidin?')) {
      onResetCompetencies();
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }
  };

  const filteredSubjects = DEFAULT_SUBJECTS.filter((sub) => {
    if (activeCategory === 'Semua') return true;
    return sub.category === activeCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-5">
      
      {/* Page Title & Overview */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 sm:p-6 rounded-3xl shadow-sm border border-emerald-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Kurikulum Ma'had Darul Abidin
            </div>
            <h2 className="text-lg sm:text-xl font-black">
              Dasbor Penjelasan Kompetensi & KKM
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
              Atur penjelasan capaian kompetensi pembelajaran untuk 12 mata pelajaran. Narasi ini akan otomatis tercetak pada kolom penjelasan di lembar rapot resmi A4 santri.
            </p>
          </div>

          {/* KKM Badge Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider block">
              KKM Standar
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {DEFAULT_KKM}
            </div>
            <span className="text-[10px] text-emerald-100 font-medium">
              Kriteria Ketuntasan
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls & Category Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['Semua', 'Al-Qur\'an & Tahfidz', 'Kepribadian & Bahasa'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition"
            title="Kembalikan narasi ke bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reset Standar</span>
            <span className="xs:hidden">Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-extrabold text-white shadow-xs active:scale-98 transition"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Kompetensi
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedToast && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>Penjelasan kompetensi dan KKM berhasil disimpan ke memori HP!</span>
        </div>
      )}

      {/* List of 12 Subject Competencies Form */}
      <div className="space-y-3.5">
        {filteredSubjects.map((sub, idx) => {
          const comp = formData[sub.id] || { kkm: DEFAULT_KKM, description: '' };
          return (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-emerald-300 transition"
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0">
                    {DEFAULT_SUBJECTS.findIndex((s) => s.id === sub.id) + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {sub.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {sub.category}
                    </span>
                  </div>
                </div>

                {/* KKM Setting per subject */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600">KKM:</span>
                  <input
                    type="number"
                    min="60"
                    max="100"
                    value={comp.kkm}
                    onChange={(e) => handleKkmChange(sub.id, Number(e.target.value))}
                    className="w-12 text-center text-xs font-black bg-white border border-slate-300 rounded-lg py-0.5 text-emerald-800 focus:outline-emerald-600"
                  />
                </div>
              </div>

              {/* Textarea for competency description */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Deskripsi / Penjelasan Capaian Kompetensi (Tampil di Kolom Rapot A4):
                </label>
                <textarea
                  rows={2}
                  value={comp.description}
                  onChange={(e) => handleTextChange(sub.id, e.target.value)}
                  placeholder={`Masukkan penjelasan kompetensi untuk mata pelajaran ${sub.name}...`}
                  className="w-full text-xs p-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-800 leading-relaxed transition"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Save Button on Mobile */}
      <div className="sticky bottom-20 z-20 sm:hidden">
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Simpan Semua Kompetensi
        </button>
      </div>

    </div>
  );
};
