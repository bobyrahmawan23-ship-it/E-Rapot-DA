import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Printer, 
  Edit3, 
  CheckCircle, 
  FileText, 
  ArrowRight,
  Download,
  Upload,
  Sparkles
} from 'lucide-react';
import { Student, SubjectCompetency, SubjectId } from '../types';
import { computeStudentReport } from '../services/storageService';

interface StudentManagerProps {
  students: Student[];
  activeStudentId: string;
  competencies: Record<SubjectId, SubjectCompetency>;
  onSelectStudent: (id: string) => void;
  onAddNewStudent: () => void;
  onDeleteStudent: (id: string) => void;
  onViewReport: (student: Student) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  activeStudentId,
  competencies,
  onSelectStudent,
  onAddNewStudent,
  onDeleteStudent,
  onViewReport,
  onExportBackup,
  onImportBackup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = students.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportBackup(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-4 pb-24">
      
      {/* Header and Add Student */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <span>Daftar & Rekap Santri</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {students.length} santri tercatat di penyimpanan lokal HP
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportBackup}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition"
            title="Download cadangan data JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Backup</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Pulihkan</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={onAddNewStudent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs active:scale-98 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Santri
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan nama santri, NIS, atau halaqoh..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-emerald-600 shadow-2xs text-slate-800"
        />
      </div>

      {/* Students Card List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">Tidak ada santri yang cocok</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Coba gunakan kata kunci pencarian lain atau tambahkan santri baru.
            </p>
          </div>
        ) : (
          filtered.map((s) => {
            const { summary } = computeStudentReport(s, competencies, students);
            const rankInfo = summary.rankInfo;
            const isActive = s.id === activeStudentId;

            return (
              <div
                key={s.id}
                className={`bg-white rounded-2xl p-4 border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${
                  isActive
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Left Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${
                        isActive
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {s.nama.charAt(0)}
                    </div>
                    {rankInfo && rankInfo.rank <= 3 && (
                      <span className={`absolute -bottom-1 -right-1 text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs border ${
                        rankInfo.rank === 1
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : rankInfo.rank === 2
                          ? 'bg-slate-300 text-slate-800 border-slate-200'
                          : 'bg-amber-700 text-white border-amber-600'
                      }`}>
                        {rankInfo.rank}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-900 truncate">
                        {s.nama}
                      </h3>
                      {rankInfo && rankInfo.rank <= 3 && (
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                          rankInfo.rank === 1
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : rankInfo.rank === 2
                            ? 'bg-slate-100 text-slate-800 border border-slate-300'
                            : 'bg-orange-100 text-orange-900 border border-orange-200'
                        }`}>
                          {rankInfo.rank === 1 ? '🥇 Juara 1 Halaqoh' : rankInfo.rank === 2 ? '🥈 Juara 2 Halaqoh' : '🥉 Juara 3 Halaqoh'}
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                          Sedang Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {s.nis} • {s.kelas}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold truncate mt-0.5">
                      Hafalan: {s.additional?.capaianHafalan || '-'} • Tasmi': {s.additional?.capaianTasmi || '-'}
                    </p>
                  </div>
                </div>

                {/* Right Average & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  
                  {/* Score badge */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Rata-rata Rapot
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-slate-900">
                        {summary.nilaiAkhir.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {summary.predikatKeseluruhan}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewReport(s)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 transition"
                      title="Cetak Rapot A4"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectStudent(s.id)}
                      className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>Input Nilai</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {students.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(s.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus Santri"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Hapus Data Santri?</h3>
            <p className="text-xs text-slate-600 mt-1 mb-5">
              Data nilai dan capaian santri ini akan dihapus dari penyimpanan HP. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteStudent(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
