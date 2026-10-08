import React, { useRef } from 'react';
import { Printer, Download, ArrowLeft, Share2, CheckCircle2, Award, BookCheck, User, Calendar } from 'lucide-react';
import { Student, SubjectCompetency, SubjectId, SchoolSettings } from '../types';
import { computeStudentReport } from '../services/storageService';
import { DEFAULT_KKM } from '../data/defaultData';

interface ReportCardViewProps {
  student: Student;
  competencies: Record<SubjectId, SubjectCompetency>;
  allStudents?: Student[];
  settings?: SchoolSettings;
  onBackToInput: () => void;
  onSelectAnotherStudent?: () => void;
}

export const ReportCardView: React.FC<ReportCardViewProps> = ({
  student,
  competencies,
  allStudents,
  settings,
  onBackToInput,
  onSelectAnotherStudent,
}) => {
  const { calculatedSubjects, summary } = computeStudentReport(student, competencies, allStudents);
  const printContainerRef = useRef<HTMLDivElement>(null);
  const rankInfo = summary.rankInfo;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-4 px-2 sm:px-4 pb-24">
      
      {/* Action Bar (Hidden during Print) */}
      <div className="no-print max-w-4xl mx-auto mb-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onBackToInput}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Input Nilai</span>
          </button>

          {onSelectAnotherStudent && (
            <button
              onClick={onSelectAnotherStudent}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Ganti Santri
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[11px] font-bold text-slate-700">Format Kertas A4 Resmi</span>
            <span className="text-[10px] text-slate-500">Hanya menampilkan Nilai Rata-rata</span>
          </div>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md active:scale-98 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* OFFICIAL A4 REPORT CARD CONTAINER (PRINTS BEAUTIFULLY ON A4) */}
      {/* ============================================================== */}
      <div className="max-w-4xl mx-auto flex justify-center">
        <div
          ref={printContainerRef}
          className="a4-document bg-white w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-10 shadow-xl print:shadow-none print:p-0 print:m-0 text-slate-900 border border-slate-200 print:border-none relative flex flex-col justify-between"
          style={{ boxSizing: 'border-box' }}
        >
          
          <div>
            {/* 1. KOP SURAT RESMI DENGAN LOGO DI ATAS */}
            <div className="text-center pb-3 border-b-4 border-double border-slate-900 mb-4">
              
              {/* Logo di atas (Centered Emblem as requested) */}
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                  <img
                    src="/logo.svg"
                    alt="Logo Ma'had Tahfidz Qur'an Darul Abidin"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Title & Address */}
              <h1 className="text-base sm:text-lg font-black tracking-wide text-slate-950 uppercase leading-snug">
                MA'HAD TAHFIDZ QUR'AN DARUL ABIDIN
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-700 tracking-tight mt-0.5">
                {settings?.alamatKop || 'KP. GUNTENG RT 03 RW 09 DS. BOJONG KEC. KARANGTENGAH KAB. CIANJUR'}
              </p>
              
              <div className="inline-block mt-2 px-3 py-0.5 rounded-md bg-slate-100 border border-slate-300">
                <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  LAPORAN HASIL PENILAIAN CAPAIAN BELAJAR SANTRI (RAPOT)
                </h2>
              </div>
            </div>

            {/* 2. IDENTITAS SISWA & SEMESTER */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-800 mb-4 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200">
              <div className="flex">
                <span className="w-28 font-bold text-slate-600 shrink-0">Nama Siswa</span>
                <span className="font-extrabold text-slate-900">: {student.nama}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-bold text-slate-600 shrink-0">Kelas / Halaqoh</span>
                <span className="font-semibold text-slate-900">: {student.kelas || settings?.namaHalaqoh || 'Kelas VII - Halaqoh Utsman bin Affan'}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-bold text-slate-600 shrink-0">Nomor Induk (NIS)</span>
                <span className="font-medium text-slate-900">: {student.nis}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-bold text-slate-600 shrink-0">Semester / TA</span>
                <span className="font-semibold text-slate-900">: {student.semester || settings?.semester || 'Genap'} / {student.tahunAjaran || settings?.tahunAjaran || '2025/2026'}</span>
              </div>
              {rankInfo && rankInfo.rank <= 3 && (
                <div className="col-span-2 pt-1.5 mt-1 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-700">Peringkat (Ranking) di Halaqoh</span>
                    <span className="font-black text-emerald-950 bg-emerald-100/90 px-2 py-0.5 rounded text-[11px] border border-emerald-300">
                      : {rankInfo.rank === 1 ? '🥇 Peringkat ke-1' : rankInfo.rank === 2 ? '🥈 Peringkat ke-2' : '🥉 Peringkat ke-3'} (dari {rankInfo.totalStudentsInClass} Santri)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 italic">
                    (Berdasarkan Rata-rata Nilai Akhir Rapot)
                  </span>
                </div>
              )}
            </div>

            {/* 3. TABEL NILAI RESMI: HANYA NILAI RATA-RATA PROSES PTS & PAS */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span>A. NILAI CAPAIAN MATA PELAJARAN</span>
                </h3>
                <span className="text-[10px] font-semibold text-slate-600 italic">
                  *Nilai Akhir merupakan Rata-rata dari Proses PTS & PAS (KKM: {DEFAULT_KKM})
                </span>
              </div>

              <table className="w-full text-left border-collapse border border-slate-400 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b border-slate-400 text-center font-bold">
                    <th className="border border-slate-400 py-1.5 px-1 w-8">No</th>
                    <th className="border border-slate-400 py-1.5 px-2 text-left">Mata Pelajaran</th>
                    <th className="border border-slate-400 py-1.5 px-1.5 w-12">KKM</th>
                    <th className="border border-slate-400 py-1.5 px-1.5 w-16 bg-emerald-50 text-emerald-950 font-black">
                      Nilai Akhir (Rata-rata)
                    </th>
                    <th className="border border-slate-400 py-1.5 px-1 w-14">Predikat</th>
                    <th className="border border-slate-400 py-1.5 px-2 text-left">
                      Penjelasan Capaian Kompetensi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedSubjects.map((sub, index) => (
                    <tr
                      key={sub.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                    >
                      <td className="border border-slate-400 py-1 px-1 text-center font-semibold text-slate-700">
                        {index + 1}
                      </td>
                      <td className="border border-slate-400 py-1 px-2 font-bold text-slate-900">
                        {sub.name}
                      </td>
                      <td className="border border-slate-400 py-1 px-1.5 text-center font-semibold text-slate-600">
                        {sub.kkm}
                      </td>
                      {/* ONLY RATA-RATA IS DISPLAYED IN THE REPORT TABLE */}
                      <td className="border border-slate-400 py-1 px-1.5 text-center font-black text-slate-900 bg-emerald-50/40">
                        {sub.rataRata.toFixed(1)}
                      </td>
                      <td className="border border-slate-400 py-1 px-1 text-center font-bold text-slate-800">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          sub.predikat === 'A' ? 'font-black text-emerald-800' :
                          sub.predikat === 'B' ? 'font-bold text-blue-800' :
                          sub.predikat === 'C' ? 'font-semibold text-amber-800' : 'text-rose-800'
                        }`}>
                          {sub.predikat}
                        </span>
                      </td>
                      <td className="border border-slate-400 py-1 px-2 text-[10.5px] leading-tight text-slate-700">
                        {sub.description}
                      </td>
                    </tr>
                  ))}

                  {/* Summary Rows */}
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                    <td colSpan={3} className="border border-slate-400 py-1.5 px-2 text-right">
                      Jumlah Rata-rata Nilai:
                    </td>
                    <td className="border border-slate-400 py-1.5 px-1 text-center font-black text-slate-900 bg-emerald-100/50">
                      {summary.totalRataRata.toFixed(1)}
                    </td>
                    <td colSpan={2} className="border border-slate-400 py-1.5 px-2 text-xs font-semibold text-slate-600">
                      (Total Rata-rata 12 Mata Pelajaran)
                    </td>
                  </tr>

                  <tr className="bg-emerald-50/80 font-black border-b border-slate-400">
                    <td colSpan={3} className="border border-slate-400 py-1.5 px-2 text-right text-emerald-950 font-black">
                      Nilai Akhir Rapot (Rata-rata Keseluruhan):
                    </td>
                    <td className="border border-slate-400 py-1.5 px-1 text-center text-sm font-black text-emerald-900 bg-emerald-200/60">
                      {summary.nilaiAkhir.toFixed(2)}
                    </td>
                    <td className="border border-slate-400 py-1 px-1 text-center text-xs font-black text-emerald-900">
                      {summary.predikatKeseluruhan}
                    </td>
                    <td className="border border-slate-400 py-1 px-2 text-xs font-bold text-emerald-900">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span>Keterangan: {summary.keteranganKeseluruhan}</span>
                        {rankInfo && rankInfo.rank <= 3 && (
                          <span className="px-2 py-0.5 rounded bg-emerald-800 text-white font-black text-[10px] whitespace-nowrap shadow-2xs">
                            {rankInfo.rank === 1 ? '🥇' : rankInfo.rank === 2 ? '🥈' : '🥉'} Peringkat ke-{rankInfo.rank} di Halaqoh
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. PENGISIAN TAMBAHAN DI HALAMAN RAPOT TANPA ADANYA NILAI PTS */}
            <div className="mb-4 avoid-break">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                B. CAPAIAN PROGRAM KHUSUS TAHFIDZ & KEISLAMAN (NON-PTS)
              </h3>
              
              <div className="border border-slate-400 rounded-xs overflow-hidden">
                <table className="w-full text-left border-collapse text-[11px]">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/2 p-2 border-r border-slate-300 bg-slate-50/50">
                        <span className="font-bold text-slate-600 block text-[10px] uppercase">
                          1. Level Standarisasi:
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs">
                          {student.additional.levelStandarisasi || '-'}
                        </span>
                      </td>
                      <td className="w-1/2 p-2 bg-slate-50/50">
                        <span className="font-bold text-slate-600 block text-[10px] uppercase">
                          2. Halaman Terakhir Tahsin / Pra Tahsin / Ihsan:
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs">
                          {student.additional.halamanTerakhirTahsin || '-'}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/2 p-2 border-r border-slate-300">
                        <span className="font-bold text-slate-600 block text-[10px] uppercase">
                          3. Capaian Hafalan (perhalaman):
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs">
                          {student.additional.capaianHafalan || '-'}
                        </span>
                      </td>
                      <td className="w-1/2 p-2">
                        <span className="font-bold text-slate-600 block text-[10px] uppercase">
                          4. Capaian Tasmi' (perhalaman):
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs">
                          {student.additional.capaianTasmi || '-'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/2 p-2 border-r border-slate-300 bg-slate-50/50">
                        <span className="font-bold text-slate-600 block text-[10px] uppercase">
                          5. Karantina Langit:
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs">
                          {student.additional.karantinaLangit || '-'}
                        </span>
                      </td>
                      <td className="w-1/2 p-2 bg-slate-50/50">
                        <span className="font-bold text-slate-600 block text-[10px] uppercase">
                          6. Hafidz Holiday:
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs">
                          {student.additional.hafidzHoliday || '-'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. CATATAN POSITIF MUSYRIF HALAQOH */}
            <div className="mb-4 avoid-break">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                C. CATATAN & MOTIVASI MUSYRIF HALAQOH
              </h3>
              <div className="p-3 bg-emerald-50/60 border border-emerald-300 rounded-md text-xs leading-relaxed text-slate-800 italic">
                "{student.catatanMusyrif || 'Alhamdulillah, ananda menunjukkan kesungguhan dan keistiqomahan yang tinggi dalam menghafal Al-Qur\'an serta berakhlak mulia di lingkungan ma\'had.'}"
              </div>
            </div>
          </div>

          {/* 6. KOLOM TANDA TANGAN RESMI (3 PIHAK) */}
          <div className="pt-3 avoid-break">
            <div className="text-right text-[11px] font-semibold text-slate-800 mb-2">
              {settings?.tempatPenerbitan || 'Cianjur'}, {student.tanggalRapot || settings?.tanggalPenerbitan || '20 Juni 2026'}
            </div>

            <div className="grid grid-cols-3 text-center text-xs">
              <div>
                <p className="font-medium text-slate-700">Orang Tua / Wali Santri,</p>
                <div className="h-16 sm:h-20" />
                <p className="font-bold text-slate-900 underline">( ............................................ )</p>
              </div>

              <div>
                <p className="font-medium text-slate-700">Musyrif Pembina Halaqoh,</p>
                <div className="h-16 sm:h-20 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400 italic print:hidden">[ Tanda Tangan ]</span>
                </div>
                <p className="font-bold text-slate-900 underline">
                  {student.namaMusyrif || settings?.namaMusyrif || 'Ustadz Ahmad Fauzi, S.Pd.I'}
                </p>
                {settings?.nipMusyrif && (
                  <p className="text-[9px] text-slate-500 mt-0.5">{settings.nipMusyrif}</p>
                )}
              </div>

              <div>
                <p className="font-medium text-slate-700">Mengetahui,</p>
                <p className="font-bold text-slate-800 text-[11px]">
                  {settings?.jabatanMudir || "Mudir Ma'had Darul Abidin"}
                </p>
                <div className="h-14 sm:h-18 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400 italic print:hidden">[ Stempel & Ttd ]</span>
                </div>
                <p className="font-bold text-slate-900 underline">
                  {settings?.namaMudir || 'Ustadz Muhammad Ridwan, M.Ag'}
                </p>
                {settings?.nipMudir && (
                  <p className="text-[9px] text-slate-500 mt-0.5">{settings.nipMudir}</p>
                )}
              </div>
            </div>

            {/* Micro footer note for official document validation */}
            <div className="mt-4 pt-2 border-t border-slate-300 flex justify-between text-[9px] text-slate-500 font-mono">
              <span>E-Rapot Ma'had Tahfidz Qur'an Darul Abidin • ID: {student.id}</span>
              <span>Dokumen Resmi • Standar Cetak Kertas A4</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
