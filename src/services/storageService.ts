import { Student, SubjectCompetency, SubjectId, MusyrifUser, ReportCalculatedSubject, ReportSummary, StudentRankInfo } from '../types';
import { DEFAULT_COMPETENCIES, DEFAULT_SUBJECTS, INITIAL_STUDENTS, DEFAULT_USERS, DEFAULT_KKM } from '../data/defaultData';

const STORAGE_KEYS = {
  STUDENTS: 'erapot_da_students_v1',
  COMPETENCIES: 'erapot_da_competencies_v1',
  CURRENT_USER: 'erapot_da_current_user_v1',
  ACTIVE_STUDENT_ID: 'erapot_da_active_student_id_v1',
};

// --- Students Storage ---
export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENTS;
  } catch (err) {
    console.error('Error reading students from storage', err);
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students to storage', err);
  }
}

export function getActiveStudentId(): string {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
    if (id) return id;
    const students = getStoredStudents();
    return students.length > 0 ? students[0].id : '';
  } catch {
    return '';
  }
}

export function setActiveStudentId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
  } catch (err) {
    console.error('Error setting active student id', err);
  }
}

// --- Competencies Storage ---
export function getStoredCompetencies(): Record<SubjectId, SubjectCompetency> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPETENCIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMPETENCIES, JSON.stringify(DEFAULT_COMPETENCIES));
      return DEFAULT_COMPETENCIES;
    }
    return { ...DEFAULT_COMPETENCIES, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading competencies from storage', err);
    return DEFAULT_COMPETENCIES;
  }
}

export function saveStoredCompetencies(data: Record<SubjectId, SubjectCompetency>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPETENCIES, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving competencies to storage', err);
  }
}

export function resetStoredCompetencies(): Record<SubjectId, SubjectCompetency> {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPETENCIES, JSON.stringify(DEFAULT_COMPETENCIES));
    return DEFAULT_COMPETENCIES;
  } catch {
    return DEFAULT_COMPETENCIES;
  }
}

// --- Auth / User Storage ---
export function getStoredUser(): MusyrifUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      // Default initial login for easy use
      const defaultUser = DEFAULT_USERS[0];
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading user session', err);
    return DEFAULT_USERS[0];
  }
}

export function setStoredUser(user: MusyrifUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (err) {
    console.error('Error updating user session', err);
  }
}

// --- Calculation Utilities ---
export function calculateSubjectAverage(pts: number | null, pas: number | null): number {
  if (pts === null && pas === null) return 0;
  if (pts === null) return pas ?? 0;
  if (pas === null) return pts ?? 0;
  return Number(((pts + pas) / 2).toFixed(1));
}

export function getGradePredicate(score: number, kkm = DEFAULT_KKM): { predikat: string; label: string; color: string } {
  if (score >= 90) {
    return { predikat: 'A', label: 'Sangat Baik (Mumtaz)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  }
  if (score >= 80) {
    return { predikat: 'B', label: 'Baik (Jayyid Jiddan)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  }
  if (score >= kkm) {
    return { predikat: 'C', label: 'Cukup (Jayyid)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  }
  return { predikat: 'D', label: 'Perlu Bimbingan (Kurang)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
}

export function computeStudentClassRank(
  studentId: string,
  students: Student[],
  competencies: Record<SubjectId, SubjectCompetency>
): StudentRankInfo {
  const targetStudent = students.find((s) => s.id === studentId);
  if (!targetStudent) {
    return { rank: 1, totalStudentsInClass: 1, rankFormatted: 'Peringkat ke-1 dari 1 Santri', rankShort: '1 / 1' };
  }

  // Filter students in the same class (or all students if class is empty or single)
  const normalizedClass = (targetStudent.kelas || '').trim().toLowerCase();
  const classStudents = students.filter(
    (s) => (s.kelas || '').trim().toLowerCase() === normalizedClass
  );

  const studentPool = classStudents.length > 0 ? classStudents : students;

  // Calculate final score for each student in the class
  const scored = studentPool.map((s) => {
    // Basic sum of averages
    let sum = 0;
    DEFAULT_SUBJECTS.forEach((sub) => {
      const g = s.grades[sub.id] || { pts: null, pas: null };
      sum += calculateSubjectAverage(g.pts, g.pas);
    });
    const finalScore = Number((sum / 12).toFixed(2));
    return {
      id: s.id,
      score: finalScore,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Find 1-based rank with handling for ties
  const targetItem = scored.find((s) => s.id === studentId);
  let rank = 1;
  if (targetItem) {
    const firstIndex = scored.findIndex((s) => s.score === targetItem.score);
    rank = firstIndex + 1;
  }

  const total = studentPool.length;
  return {
    rank,
    totalStudentsInClass: total,
    rankFormatted: `Peringkat ke-${rank} dari ${total} Santri`,
    rankShort: `${rank} dari ${total}`,
  };
}

export function computeStudentReport(
  student: Student,
  competencies: Record<SubjectId, SubjectCompetency>,
  allStudents?: Student[]
): {
  calculatedSubjects: ReportCalculatedSubject[];
  summary: ReportSummary;
} {
  let totalRataRata = 0;

  const calculatedSubjects: ReportCalculatedSubject[] = DEFAULT_SUBJECTS.map((sub) => {
    const grade = student.grades[sub.id] || { pts: null, pas: null };
    const avg = calculateSubjectAverage(grade.pts, grade.pas);
    const comp = competencies[sub.id] || { kkm: DEFAULT_KKM, description: '' };
    const pred = getGradePredicate(avg, comp.kkm);

    totalRataRata += avg;

    return {
      id: sub.id,
      name: sub.name,
      kkm: comp.kkm,
      pts: grade.pts,
      pas: grade.pas,
      rataRata: avg,
      predikat: pred.predikat,
      description: comp.description,
      isLulus: avg >= comp.kkm,
    };
  });

  const nilaiAkhir = Number((totalRataRata / 12).toFixed(2));
  const overallPredicate = getGradePredicate(nilaiAkhir, DEFAULT_KKM);

  const rankInfo = allStudents && allStudents.length > 0
    ? computeStudentClassRank(student.id, allStudents, competencies)
    : undefined;

  return {
    calculatedSubjects,
    summary: {
      totalRataRata: Number(totalRataRata.toFixed(1)),
      nilaiAkhir,
      predikatKeseluruhan: overallPredicate.predikat,
      keteranganKeseluruhan: overallPredicate.label,
      rankInfo,
    },
  };
}

export function createNewStudent(namaMusyrif: string, halaqoh: string): Student {
  const emptyGrades: Record<SubjectId, { pts: number | null; pas: number | null }> = {} as any;
  DEFAULT_SUBJECTS.forEach((sub) => {
    emptyGrades[sub.id] = { pts: 80, pas: 80 };
  });

  const id = 'std-' + Date.now();
  return {
    id,
    nama: 'Santri Baru',
    nis: `DA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    kelas: halaqoh || 'Kelas VII - Halaqoh Utsman bin Affan',
    semester: 'Genap',
    tahunAjaran: '2025/2026',
    namaMusyrif: namaMusyrif || 'Ustadz Ahmad Fauzi, S.Pd.I',
    tanggalRapot: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
    grades: emptyGrades,
    additional: {
      levelStandarisasi: 'Level 1 (Pra Tahsin / Juz 30)',
      halamanTerakhirTahsin: 'Pra Tahsin Hal. 10',
      capaianHafalan: '20 Halaman (1 Juz)',
      capaianTasmi: '10 Halaman (1/2 Juz Sekali Duduk)',
      karantinaLangit: 'Mengikuti Penuh',
      hafidzHoliday: 'Aktif Menjaga Hafalan',
    },
    catatanMusyrif: 'Alhamdulillah, ananda menunjukkan kesungguhan dan keistiqomahan yang tinggi dalam menghafal Al-Qur\'an serta berakhlak mulia di lingkungan ma\'had.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
