import { SubjectMeta, SubjectId, SubjectCompetency, Student, MusyrifUser } from '../types';

export const DEFAULT_KKM = 75;

export const DEFAULT_SUBJECTS: SubjectMeta[] = [
  { id: 'tahsin_ilmi', name: 'Tahsin Ilmi', category: 'Al-Qur\'an & Tahfidz', shortName: 'Tahsin Ilmi' },
  { id: 'tahsin_amali', name: 'Tahsin Amali', category: 'Al-Qur\'an & Tahfidz', shortName: 'Tahsin Amali' },
  { id: 'standarisasi_bacaan', name: 'Standarisasi Bacaan', category: 'Al-Qur\'an & Tahfidz', shortName: 'Standarisasi' },
  { id: 'kemampuan_ziyadah', name: 'Kemampuan Ziyadah', category: 'Al-Qur\'an & Tahfidz', shortName: 'Ziyadah' },
  { id: 'kemampuan_murojaah', name: 'Kemampuan Murojaah', category: 'Al-Qur\'an & Tahfidz', shortName: 'Murojaah' },
  { id: 'fahmil_quran', name: 'Fahmil Quran', category: 'Al-Qur\'an & Tahfidz', shortName: 'Fahmil Quran' },
  { id: 'adab', name: 'Adab', category: 'Kepribadian & Bahasa', shortName: 'Adab' },
  { id: 'kitabah', name: 'Kitabah', category: 'Kepribadian & Bahasa', shortName: 'Kitabah' },
  { id: 'maqomat', name: 'Maqomat', category: 'Al-Qur\'an & Tahfidz', shortName: 'Maqomat' },
  { id: 'bahasa_arab', name: 'Bahasa Arab', category: 'Kepribadian & Bahasa', shortName: 'B. Arab' },
  { id: 'kedisiplinan', name: 'Kedisiplinan', category: 'Kepribadian & Bahasa', shortName: 'Disiplin' },
  { id: 'hafalan_doa', name: 'Hafalan Doa', category: 'Kepribadian & Bahasa', shortName: 'Hafalan Doa' },
];

export const DEFAULT_COMPETENCIES: Record<SubjectId, SubjectCompetency> = {
  tahsin_ilmi: {
    kkm: 75,
    description: 'Memahami kaidah-kaidah hukum tajwid, makharijul huruf, sifatul huruf, ahkamul mad wal qasr, serta hukum waqaf dan ibtida secara teoritis.',
  },
  tahsin_amali: {
    kkm: 75,
    description: 'Mampu mempraktikkan bacaan Al-Qur\'an secara tartil dengan pelafalan huruf yang fasih, dengung yang terukur, dan kaidah tajwid yang benar.',
  },
  standarisasi_bacaan: {
    kkm: 75,
    description: 'Mencapai ketepatan dan keseragaman nada tartil sesuai standar mutu bacaan Ma\'had Tahfidz Qur\'an Daarul Abidin dengan ritme yang stabil.',
  },
  kemampuan_ziyadah: {
    kkm: 75,
    description: 'Memiliki kelancaran dan kecepatan daya serap dalam menambah setoran hafalan baru (ziyadah) sesuai target halaman yang ditetapkan.',
  },
  kemampuan_murojaah: {
    kkm: 75,
    description: 'Mampu menjaga dan memperkuat hafalan lama (murojaah kubro & sughro) sehingga hafalan tetap mutqin, lancar, dan terjaga dari kelupaan.',
  },
  fahmil_quran: {
    kkm: 75,
    description: 'Memahami arti kosakata dasar, konteks kandungan ayat, serta tafsir ringkas ayat-ayat pilihan yang telah dihafalkan.',
  },
  adab: {
    kkm: 75,
    description: 'Menunjukkan adab mulia hamalatul Qur\'an, santun kepada guru dan musyrif, tawadhu, serta menghormati sesama santri dalam halaqoh.',
  },
  kitabah: {
    kkm: 75,
    description: 'Terampil menulis huruf hijaiyah, kaidah imla, rasm utsmani, serta rapi dalam mencatat mutaba\'ah setoran ayat suci Al-Qur\'an.',
  },
  maqomat: {
    kkm: 75,
    description: 'Mampu membawakan ragam irama/lagu tilawah (Bayati, Nahawand, Hijaz, dll.) dengan penghayatan yang syahdu dan tidak merusak kaidah tajwid.',
  },
  bahasa_arab: {
    kkm: 75,
    description: 'Menguasai mufrodat yaumiyyah (kosakata harian), percakapan dasar (muhadatsah), dan kaidah dasar tata bahasa Arab sederhana.',
  },
  kedisiplinan: {
    kkm: 75,
    description: 'Tertib hadir tepat waktu di halaqoh tahfidz, shalat berjamaah di shaff awal, mematuhi tata tertib asrama dan ma\'had.',
  },
  hafalan_doa: {
    kkm: 75,
    description: 'Hafal dengan fasih dan lancar doa-doa harian, dzikir pagi-petang (al-ma\'tsurat), serta adab pengamalan doa dalam kehidupan sehari-hari.',
  },
};

export const POSITIVE_NOTES_TEMPLATES = [
  {
    title: 'Sangat Tekun & Mutqin (Mumtaz)',
    content: 'Alhamdulillah, ananda menunjukkan kesungguhan dan keistiqomahan yang tinggi dalam menghafal Al-Qur\'an serta berakhlak mulia di lingkungan ma\'had. Hafalannya sangat mutqin dan bacaannya tartil. Semoga Allah senantiasa menjadikannya ahlul Qur\'an fiddunya wal akhirah.',
  },
  {
    title: 'Semangat Ziyadah & Murojaah Kuat',
    content: 'Barakallahu fiik, ananda sangat antusias dalam menambah setoran ziyadah baru dan disiplin menyimak murojaah bersama teman halaqoh. Pertahankan ritme tilawah harian dan tetap rendah hati dalam menuntut ilmu.',
  },
  {
    title: 'Adab Mulia & Karakter Santun',
    content: 'Masya Allah, ananda memiliki adab yang sangat terpuji, santun kepada para musyrif, serta gemar membantu sesama santri. Sikap tawadhu ini mencerminkan akhlak sejati penghafal Al-Qur\'an. Terus tingkatkan kelancaran setoran hafalan.',
  },
  {
    title: 'Kemajuan Tahsin & Kelancaran Pesat',
    content: 'Alhamdulillah, ananda mengalami progres peningkatan tajwid dan fashohah yang sangat membanggakan pada semester ini. Makhorijul huruf terdengar semakin bersih dan tartil. Terus istiqomah melatih maqomat dan murojaah.',
  },
  {
    title: 'Motivasi & Penguatan Fokus',
    content: 'Ananda memiliki daya ingat dan potensi yang luar biasa. Dengan menambah fokus saat halaqoh dan memperbanyak tilawah mandiri di waktu luang, insya Allah ananda akan mencapai target hafalan yang lebih tinggi lagi. Ustadz selalu mendoakan keberkahan ananda.',
  },
  {
    title: 'Kedisiplinan & Doa Harian Istimewa',
    content: 'Alhamdulillah, ananda sangat tertib menjaga sholat berjamaah, disiplin bangun qiyamullail, dan lancar dalam mengamalkan dzikir serta doa harian. Semoga Allah memberkahi setiap langkah perjuangannya di Ma\'had.',
  },
];

export const DEFAULT_USERS: MusyrifUser[] = [
  {
    id: 'user-1',
    username: 'musyrif',
    nama: 'Ustadz Ahmad Fauzi, S.Pd.I',
    halaqoh: 'Halaqoh Utsman bin Affan',
    nip: '19920815 201803 1 004',
    role: 'musyrif',
  },
  {
    id: 'user-2',
    username: 'admin',
    nama: 'Ustadz Muhammad Ridwan, M.Ag',
    halaqoh: 'Pimpinan & Koordinator Kurikulum',
    nip: '19870512 201201 1 002',
    role: 'admin',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    nama: 'Muhammad Fatih Al-Ayyubi',
    nis: 'DA-2025-0142',
    kelas: 'Kelas VII - Halaqoh Utsman bin Affan',
    semester: 'Genap',
    tahunAjaran: '2025/2026',
    namaMusyrif: 'Ustadz Ahmad Fauzi, S.Pd.I',
    tanggalRapot: '20 Juni 2026',
    grades: {
      tahsin_ilmi: { pts: 88, pas: 92 },
      tahsin_amali: { pts: 90, pas: 94 },
      standarisasi_bacaan: { pts: 86, pas: 90 },
      kemampuan_ziyadah: { pts: 92, pas: 96 },
      kemampuan_murojaah: { pts: 88, pas: 90 },
      fahmil_quran: { pts: 85, pas: 89 },
      adab: { pts: 95, pas: 98 },
      kitabah: { pts: 84, pas: 88 },
      maqomat: { pts: 82, pas: 86 },
      bahasa_arab: { pts: 80, pas: 85 },
      kedisiplinan: { pts: 92, pas: 95 },
      hafalan_doa: { pts: 90, pas: 94 },
    },
    additional: {
      levelStandarisasi: 'Level 2 (Juz 1 s/d 5 Mutqin)',
      halamanTerakhirTahsin: 'Pra Tahsin Al-Ihsan Halaman 48',
      capaianHafalan: '120 Halaman (6 Juz)',
      capaianTasmi: '20 Halaman (1 Juz Sekali Duduk)',
      karantinaLangit: 'Selesai 5 Juz Mutqin',
      hafidzHoliday: 'Aktif & Tuntas Target Ziyadah Mandiri',
    },
    catatanMusyrif: 'Alhamdulillah, ananda menunjukkan kesungguhan dan keistiqomahan yang tinggi dalam menghafal Al-Qur\'an serta berakhlak mulia di lingkungan ma\'had. Hafalannya sangat mutqin dan bacaannya tartil. Semoga Allah senantiasa menjadikannya ahlul Qur\'an fiddunya wal akhirah.',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-06-20T10:00:00.000Z',
  },
  {
    id: 'std-2',
    nama: 'Abdullah Azzam Al-Faruq',
    nis: 'DA-2025-0143',
    kelas: 'Kelas VII - Halaqoh Utsman bin Affan',
    semester: 'Genap',
    tahunAjaran: '2025/2026',
    namaMusyrif: 'Ustadz Ahmad Fauzi, S.Pd.I',
    tanggalRapot: '20 Juni 2026',
    grades: {
      tahsin_ilmi: { pts: 82, pas: 86 },
      tahsin_amali: { pts: 85, pas: 88 },
      standarisasi_bacaan: { pts: 80, pas: 84 },
      kemampuan_ziyadah: { pts: 86, pas: 90 },
      kemampuan_murojaah: { pts: 80, pas: 82 },
      fahmil_quran: { pts: 78, pas: 82 },
      adab: { pts: 90, pas: 92 },
      kitabah: { pts: 82, pas: 85 },
      maqomat: { pts: 78, pas: 82 },
      bahasa_arab: { pts: 76, pas: 80 },
      kedisiplinan: { pts: 88, pas: 90 },
      hafalan_doa: { pts: 85, pas: 88 },
    },
    additional: {
      levelStandarisasi: 'Level 1 (Juz 30 & Juz 1)',
      halamanTerakhirTahsin: 'Tahsin Jilid 2 Halaman 30',
      capaianHafalan: '80 Halaman (4 Juz)',
      capaianTasmi: '10 Halaman (1/2 Juz Sekali Duduk)',
      karantinaLangit: 'Mengikuti Penuh & Tuntas 3 Juz',
      hafidzHoliday: 'Disiplin Murojaah Mandiri',
    },
    catatanMusyrif: 'Barakallahu fiik, ananda sangat tekun dalam menambah ziyadah dan menjaga murojaah hafalan. Semoga Allah selalu membimbing ananda menjadi ahlul Qur\'an yang mutqin.',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-06-20T10:00:00.000Z',
  },
];
