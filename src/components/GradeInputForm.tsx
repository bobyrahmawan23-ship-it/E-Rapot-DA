import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw, 
  Printer, 
  User, 
  Sparkles, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Plus, 
  Minus,
  MessageSquare,
  Bookmark,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Student, SubjectGrade, SubjectId, SubjectCompetency, SchoolSettings } from '../types';
import { DEFAULT_SUBJECTS, DEFAULT_KKM, POSITIVE_NOTES_TEMPLATES } from '../data/defaultData';
import { calculateSubjectAverage, getGradePredicate, computeStudentReport } from '../services/storageService';

interface GradeInputFormProps {
  student: Student;
  competencies: Record<SubjectId, SubjectCompetency>;
  allStudents?: Student[];
  settings?: SchoolSettings;
  onSaveStudent: (updated: Student) => void;
  onViewReport: () => void;
  onOpenStudentList: () => void;
  onAddNewStudent: () => void;
}

export const GradeInputForm: React.FC<GradeInputFormProps> = ({
  student,
  competencies,
  allStudents,
  settings,
  onSaveStudent,
  onViewReport,
  onOpenStudentList,
  onAddNewStudent,
}) => {
  const [formData, setFormData] = useState<Student>({ ...student });
  const [saveToast, setSaveToast] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'nilai' | 'tambahan' | 'catatan' | 'identitas'>('nilai');

  // Sync state if active student prop changes
  useEffect(() => {
    setFormData({ ...student });
  }, [student.id]);

  // Handle grade change for PTS or PAS
  const handleGradeChange = (subjectId: SubjectId, field: 'pts' | 'pas', value: string) => {
    const num = value === '' ? null : Math.min(100, Math.max(0, Number(value)));
    setFormData((prev) => ({
      ...prev,
      grades: {
        ...prev.grades,
        [subjectId]: {
          ...(prev.grades[subjectId] || { pts: null, pas: null }),
          [field]: num,
        },
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Quick adjust grade (+/- points)
  const adjustGrade = (subjectId: SubjectId, field: 'pts' | 'pas', delta: number) => {
    const current = formData.grades[subjectId]?.[field] ?? 80;
    const nextVal = Math.min(100, Math.max(0, current + delta));
    setFormData((prev) => ({
      ...prev,
      grades: {
        ...prev.grades,
        [subjectId]: {
          ...(prev.grades[subjectId] || { pts: null, pas: null }),
          [field]: nextVal,
        },
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Preset quick fill for single subject
  const setQuickGrade = (subjectId: SubjectId, ptsVal: number, pasVal: number) => {
    setFormData((prev) => ({
      ...prev,
      grades: {
        ...prev.grades,
        [subjectId]: { pts: ptsVal, pas: pasVal },
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Handle additional fields without PTS
  const handleAdditionalChange = (field: keyof Student['additional'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      additional: {
        ...prev.additional,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Save student data
  const handleSave = () => {
    onSaveStudent(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Reset grades to default 80
  const handleReset = () => {
    if (window.confirm('Reset seluruh nilai santri ini ke nilai default?')) {
      const resetGrades: Record<SubjectId, SubjectGrade> = {} as any;
      DEFAULT_SUBJECTS.forEach((sub) => {
        resetGrades[sub.id] = { pts: 80, pas: 80 };
      });
      const updated = {
        ...formData,
        grades: resetGrades,
        updatedAt: new Date().toISOString(),
      };
      setFormData(updated);
      onSaveStudent(updated);
    }
  };

  // Select positive musyrif note template
  const applyNoteTemplate = (templateContent: string) => {
    setFormData((prev) => ({
      ...prev,
      catatanMusyrif: templateContent,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Real-time calculation of overall summary (including ranking)
  const { summary } = computeStudentReport(formData, competencies, allStudents);
  const rankInfo = summary.rankInfo;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-4 pb-28">
      
      {/* 1. Student Selector & Quick Navigation Header */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-200">
            {formData.nama.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                {formData.nama}
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                NIS: {formData.nis}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">
              {formData.kelas} • Semester {formData.semester} ({formData.tahunAjaran})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenStudentList}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-xs font-bold text-slate-700 transition"
          >
            Pilih Santri Lain
          </button>
          <button
            type="button"
            onClick={onAddNewStudent}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Santri Baru
          </button>
        </div>
      </div>

      {/* 2. Real-time Overall Score & Rank Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-emerald-600">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 block">
                Rata-rata 12 Mapel (PTS + PAS)
              </span>
              {rankInfo && rankInfo.rank <= 3 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-2xs">
                  {rankInfo.rank === 1 ? '🥇' : rankInfo.rank === 2 ? '🥈' : '🥉'} Peringkat ke-{rankInfo.rank} di Halaqoh
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {summary.nilaiAkhir.toFixed(2)}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white/20 text-white border border-white/20">
                Predikat: {summary.predikatKeseluruhan}
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1 font-medium">
              Keterangan: <strong>{summary.keteranganKeseluruhan}</strong> (KKM: {DEFAULT_KKM})
            </p>
          </div>

          <button
            type="button"
            onClick={onViewReport}
            className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md active:scale-95 transition flex items-center gap-1.5 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden xs:inline">Lihat Rapot A4</span>
            <span className="xs:hidden">Rapot A4</span>
          </button>
        </div>
      </div>

      {/* 3. Section Switcher Tabs (Nilai 12 Mapel, Tambahan Non-PTS, Catatan Positif, Identitas) */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-200/80 p-1 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTabSection('nilai')}
          className={`py-2 px-1 rounded-xl transition text-center truncate ${
            activeTabSection === 'nilai'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Nilai 12 Mapel
        </button>
        <button
          type="button"
          onClick={() => setActiveTabSection('tambahan')}
          className={`py-2 px-1 rounded-xl transition text-center truncate ${
            activeTabSection === 'tambahan'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Non-PTS (6 Poin)
        </button>
        <button
          type="button"
          onClick={() => setActiveTabSection('catatan')}
          className={`py-2 px-1 rounded-xl transition text-center truncate ${
            activeTabSection === 'catatan'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Catatan Musyrif
        </button>
        <button
          type="button"
          onClick={() => setActiveTabSection('identitas')}
          className={`py-2 px-1 rounded-xl transition text-center truncate ${
            activeTabSection === 'identitas'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          4. Biodata
        </button>
      </div>

      {/* Save Toast notification */}
      {saveToast && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Data nilai dan santri berhasil disimpan ke memori HP!</span>
        </div>
      )}

      {/* =============================================================== */}
      {/* SECTION 1: 12 MATA PELAJARAN (PTS & PAS WITH LIVE AVERAGE)     */}
      {/* =============================================================== */}
      {activeTabSection === 'nilai' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Input Nilai PTS & PAS (0-100):</span>
            <span className="text-emerald-700 font-semibold">
              *Rapot A4 otomatis hanya memuat nilai Rata-rata
            </span>
          </div>

          {DEFAULT_SUBJECTS.map((sub, index) => {
            const grade = formData.grades[sub.id] || { pts: null, pas: null };
            const avg = calculateSubjectAverage(grade.pts, grade.pas);
            const comp = competencies[sub.id] || { kkm: DEFAULT_KKM, description: '' };
            const pred = getGradePredicate(avg, comp.kkm);

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                        {sub.name}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        {sub.category}
                      </span>
                    </div>
                  </div>

                  {/* Calculated Average Display */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Rata-rata</span>
                      <span className="text-sm font-black text-slate-900">
                        {avg.toFixed(1)}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${pred.color}`}>
                      {pred.predikat}
                    </span>
                  </div>
                </div>

                {/* Input Controls for PTS & PAS */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  
                  {/* PTS Column */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        Nilai PTS
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjustGrade(sub.id, 'pts', -5)}
                          className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center"
                          title="-5"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustGrade(sub.id, 'pts', 5)}
                          className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center"
                          title="+5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.pts ?? ''}
                      onChange={(e) => handleGradeChange(sub.id, 'pts', e.target.value)}
                      placeholder="0-100"
                      className="w-full text-center text-sm font-black py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-emerald-600"
                    />
                  </div>

                  {/* PAS Column */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        Nilai PAS
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjustGrade(sub.id, 'pas', -5)}
                          className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center"
                          title="-5"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustGrade(sub.id, 'pas', 5)}
                          className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center"
                          title="+5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.pas ?? ''}
                      onChange={(e) => handleGradeChange(sub.id, 'pas', e.target.value)}
                      placeholder="0-100"
                      className="w-full text-center text-sm font-black py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-emerald-600"
                    />
                  </div>

                </div>

                {/* Quick Presets for this subject */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5">
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">Preset:</span>
                  {[75, 80, 85, 90, 95].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setQuickGrade(sub.id, val, val)}
                      className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 transition"
                    >
                      {val}
                    </button>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* =============================================================== */}
      {/* SECTION 2: PENGISIAN TAMBAHAN NON-PTS (6 POIN WAJIB)            */}
      {/* =============================================================== */}
      {activeTabSection === 'tambahan' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Halaman Rapot Khusus
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">
              Pengisian Tambahan Capaian Santri (Non-PTS)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Enam indikator ini akan dicetak langsung pada tabel capaian program khusus Al-Qur'an & Tahfidz tanpa nilai angka PTS.
            </p>
          </div>

          <div className="space-y-3.5">
            {/* 1. Level Standarisasi */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                1. Level Standarisasi
              </label>
              <input
                type="text"
                value={formData.additional.levelStandarisasi}
                onChange={(e) => handleAdditionalChange('levelStandarisasi', e.target.value)}
                placeholder="Contoh: Level 2 (Juz 1 s/d 5 Mutqin)"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[
                  'Level 1 (Pra Tahsin / Juz 30)',
                  'Level 2 (Juz 1-5 Mutqin)',
                  'Level 3 (Juz 6-15 Mutqin)',
                  'Level 4 (Juz 16-29)',
                  'Mumtaz (30 Juz Khotam)',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAdditionalChange('levelStandarisasi', preset)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Halaman Terakhir Tahsin */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                2. Halaman Terakhir Tahsin / Pra Tahsin / Ihsan
              </label>
              <input
                type="text"
                value={formData.additional.halamanTerakhirTahsin}
                onChange={(e) => handleAdditionalChange('halamanTerakhirTahsin', e.target.value)}
                placeholder="Contoh: Pra Tahsin Al-Ihsan Halaman 48"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            {/* 3. Capaian Hafalan (perhalaman) */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                3. Capaian Hafalan (perhalaman)
              </label>
              <input
                type="text"
                value={formData.additional.capaianHafalan}
                onChange={(e) => handleAdditionalChange('capaianHafalan', e.target.value)}
                placeholder="Contoh: 120 Halaman (6 Juz)"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            {/* 4. Capaian Tasmi' (perhalaman) */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                4. Capaian Tasmi' (perhalaman)
              </label>
              <input
                type="text"
                value={formData.additional.capaianTasmi}
                onChange={(e) => handleAdditionalChange('capaianTasmi', e.target.value)}
                placeholder="Contoh: 20 Halaman (1 Juz Sekali Duduk)"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            {/* 5. Karantina Langit */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                5. Karantina Langit
              </label>
              <input
                type="text"
                value={formData.additional.karantinaLangit}
                onChange={(e) => handleAdditionalChange('karantinaLangit', e.target.value)}
                placeholder="Contoh: Selesai 5 Juz Mutqin / Mengikuti Penuh"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            {/* 6. Hafidz Holiday */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                6. Hafidz Holiday
              </label>
              <input
                type="text"
                value={formData.additional.hafidzHoliday}
                onChange={(e) => handleAdditionalChange('hafidzHoliday', e.target.value)}
                placeholder="Contoh: Aktif & Tuntas Target Ziyadah Mandiri"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* SECTION 3: CATATAN POSITIF MUSYRIF HALAQOH (TEMPLATES & EDIT)  */}
      {/* =============================================================== */}
      {activeTabSection === 'catatan' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Bimbingan & Motivasi
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">
              Catatan Musyrif Halaqoh (Kalimat Positif)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Pilih rekomendasi catatan positif yang sudah disediakan sesuai kondisi santri, atau sunting secara bebas.
            </p>
          </div>

          {/* Bank of Positive Templates */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Pilih Cepat Rekomendasi Catatan Positif (1-Klik):
            </label>
            <div className="space-y-2">
              {POSITIVE_NOTES_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyNoteTemplate(tmpl.content)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition group active:scale-99"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-slate-800 group-hover:text-emerald-800">
                      ★ {tmpl.title}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold group-hover:underline">
                      Gunakan Template
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed italic">
                    "{tmpl.content}"
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea for editing note */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Teks Catatan yang Akan Tercetak di Rapot:
            </label>
            <textarea
              rows={4}
              value={formData.catatanMusyrif}
              onChange={(e) => setFormData({ ...formData, catatanMusyrif: e.target.value })}
              placeholder="Tuliskan catatan dan motivasi pembinaan dari Musyrif untuk santri..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white text-slate-800 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* SECTION 4: BIODATA IDENTITAS SANTRI                             */}
      {/* =============================================================== */}
      {activeTabSection === 'identitas' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Identitas Santri & Administrasi Rapot
            </h3>
            {settings && (
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    kelas: settings.namaHalaqoh || prev.kelas,
                    namaMusyrif: settings.namaMusyrif || prev.namaMusyrif,
                    tanggalRapot: settings.tanggalPenerbitan || prev.tanggalRapot,
                    semester: settings.semester || prev.semester,
                    tahunAjaran: settings.tahunAjaran || prev.tahunAjaran,
                    updatedAt: new Date().toISOString(),
                  }));
                  setSaveToast(true);
                  setTimeout(() => setSaveToast(false), 2000);
                }}
                className="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-xl transition flex items-center gap-1 self-start sm:self-auto"
                title="Terapkan Nama Musyrif, Halaqoh, dan Tanggal dari Pengaturan"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Terapkan dari Pengaturan Halaqoh
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nama Lengkap Siswa
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nomor Induk Santri (NIS)
              </label>
              <input
                type="text"
                value={formData.nis}
                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Kelas / Halaqoh
              </label>
              <input
                type="text"
                value={formData.kelas}
                onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tahun Ajaran
              </label>
              <input
                type="text"
                value={formData.tahunAjaran}
                onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                placeholder="2025/2026"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tanggal Penerbitan Rapot
              </label>
              <input
                type="text"
                value={formData.tanggalRapot}
                onChange={(e) => setFormData({ ...formData, tanggalRapot: e.target.value })}
                placeholder="Contoh: 20 Juni 2026"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nama Musyrif Pembina
              </label>
              <input
                type="text"
                value={formData.namaMusyrif}
                onChange={(e) => setFormData({ ...formData, namaMusyrif: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Action Buttons Bar (Sticky on mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
            title="Reset Nilai"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 sm:py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Data</span>
          </button>

          <button
            type="button"
            onClick={onViewReport}
            className="flex-1 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak Rapot A4</span>
          </button>

        </div>
      </div>

    </div>
  );
};
