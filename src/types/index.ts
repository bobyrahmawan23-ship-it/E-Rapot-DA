export type SubjectId =
  | 'tahsin_ilmi'
  | 'tahsin_amali'
  | 'standarisasi_bacaan'
  | 'kemampuan_ziyadah'
  | 'kemampuan_murojaah'
  | 'fahmil_quran'
  | 'adab'
  | 'kitabah'
  | 'maqomat'
  | 'bahasa_arab'
  | 'kedisiplinan'
  | 'hafalan_doa';

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  category: 'Al-Qur\'an & Tahfidz' | 'Kepribadian & Bahasa';
  shortName: string;
}

export interface SubjectGrade {
  pts: number | null;
  pas: number | null;
}

export interface SubjectCompetency {
  kkm: number;
  description: string;
}

export interface StudentAdditionalData {
  levelStandarisasi: string;
  halamanTerakhirTahsin: string;
  capaianHafalan: string;
  capaianTasmi: string;
  karantinaLangit: string;
  hafidzHoliday: string;
}

export interface Student {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string;
  namaMusyrif: string;
  tanggalRapot: string;
  grades: Record<SubjectId, SubjectGrade>;
  additional: StudentAdditionalData;
  catatanMusyrif: string;
  createdAt: string;
  updatedAt: string;
}

export interface MusyrifUser {
  id: string;
  username: string;
  nama: string;
  halaqoh: string;
  nip?: string;
  role: 'musyrif' | 'admin';
}

export interface ReportCalculatedSubject {
  id: SubjectId;
  name: string;
  kkm: number;
  pts: number | null;
  pas: number | null;
  rataRata: number;
  predikat: string;
  description: string;
  isLulus: boolean;
}

export interface StudentRankInfo {
  rank: number;
  totalStudentsInClass: number;
  rankFormatted: string;
  rankShort: string;
}

export interface ReportSummary {
  totalRataRata: number;
  nilaiAkhir: number;
  predikatKeseluruhan: string;
  keteranganKeseluruhan: string;
  rankInfo?: StudentRankInfo;
}
