/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { GradeInputForm } from './components/GradeInputForm';
import { ReportCardView } from './components/ReportCardView';
import { CompetencyDashboard } from './components/CompetencyDashboard';
import { StudentManager } from './components/StudentManager';
import { BottomNav } from './components/BottomNav';
import { PWAInstallModal } from './components/PWAInstallModal';

import { Student, SubjectCompetency, SubjectId, MusyrifUser, SchoolSettings } from './types';
import { 
  getStoredStudents, 
  saveStoredStudents, 
  getActiveStudentId, 
  setActiveStudentId,
  getStoredCompetencies,
  saveStoredCompetencies,
  resetStoredCompetencies,
  getStoredSchoolSettings,
  saveStoredSchoolSettings,
  resetStoredSchoolSettings,
  getStoredUser,
  setStoredUser,
  createNewStudent
} from './services/storageService';
import { SettingsDashboard } from './components/SettingsDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<MusyrifUser | null>(() => getStoredUser());
  const [students, setStudents] = useState<Student[]>(() => getStoredStudents());
  const [activeStudentId, setActiveId] = useState<string>(() => getActiveStudentId());
  const [competencies, setCompetencies] = useState<Record<SubjectId, SubjectCompetency>>(() => getStoredCompetencies());
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => getStoredSchoolSettings());
  const [activeTab, setActiveTab] = useState<'input' | 'rapot' | 'kompetensi' | 'santri' | 'pengaturan'>('input');
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Sync active student
  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0] || null;

  // Update active id in storage
  useEffect(() => {
    if (activeStudentId) {
      setActiveStudentId(activeStudentId);
    }
  }, [activeStudentId]);

  // Auth handlers
  const handleLogin = (user: MusyrifUser) => {
    setCurrentUser(user);
    setStoredUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStoredUser(null);
  };

  // Student handlers
  const handleSaveStudent = (updated: Student) => {
    const updatedList = students.map((s) => (s.id === updated.id ? updated : s));
    setStudents(updatedList);
    saveStoredStudents(updatedList);
  };

  const handleAddNewStudent = () => {
    const newStudent = createNewStudent(
      schoolSettings.namaMusyrif || currentUser?.nama,
      schoolSettings.namaHalaqoh || currentUser?.halaqoh,
      schoolSettings
    );
    const updatedList = [newStudent, ...students];
    setStudents(updatedList);
    saveStoredStudents(updatedList);
    setActiveId(newStudent.id);
    setActiveTab('input');
  };

  const handleDeleteStudent = (id: string) => {
    const remaining = students.filter((s) => s.id !== id);
    setStudents(remaining);
    saveStoredStudents(remaining);
    if (activeStudentId === id && remaining.length > 0) {
      setActiveId(remaining[0].id);
    }
  };

  const handleSelectStudent = (id: string) => {
    setActiveId(id);
    setActiveTab('input');
  };

  const handleViewReportForStudent = (target: Student) => {
    setActiveId(target.id);
    setActiveTab('rapot');
  };

  // Competency handlers
  const handleSaveCompetencies = (updated: Record<SubjectId, SubjectCompetency>) => {
    setCompetencies(updated);
    saveStoredCompetencies(updated);
  };

  const handleResetCompetencies = () => {
    const defaultData = resetStoredCompetencies();
    setCompetencies({ ...defaultData });
  };

  // School Settings handlers
  const handleSaveSchoolSettings = (updated: SchoolSettings, syncToAll: boolean) => {
    setSchoolSettings(updated);
    saveStoredSchoolSettings(updated);

    if (syncToAll && students.length > 0) {
      const syncedStudents: Student[] = students.map((s) => ({
        ...s,
        kelas: updated.namaHalaqoh || s.kelas,
        namaMusyrif: updated.namaMusyrif || s.namaMusyrif,
        tanggalRapot: updated.tanggalPenerbitan || s.tanggalRapot,
        semester: updated.semester || s.semester,
        tahunAjaran: updated.tahunAjaran || s.tahunAjaran,
      }));
      setStudents(syncedStudents);
      saveStoredStudents(syncedStudents);
    }
  };

  const handleResetSchoolSettings = () => {
    const defaultSettings = resetStoredSchoolSettings();
    setSchoolSettings({ ...defaultSettings });
  };

  // Backup & Restore
  const handleExportBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      institution: "Ma'had Tahfidz Qur'an Darul Abidin",
      schoolSettings,
      students,
      competencies,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `backup_rapot_darul_abidin_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.students)) {
          setStudents(parsed.students);
          saveStoredStudents(parsed.students);
          if (parsed.competencies) {
            setCompetencies(parsed.competencies);
            saveStoredCompetencies(parsed.competencies);
          }
          if (parsed.schoolSettings) {
            setSchoolSettings(parsed.schoolSettings);
            saveStoredSchoolSettings(parsed.schoolSettings);
          }
          if (parsed.students.length > 0) {
            setActiveId(parsed.students[0].id);
          }
          alert('Data cadangan berhasil dipulihkan!');
        } else {
          alert('Format file JSON tidak sesuai.');
        }
      } catch (err) {
        alert('Gagal membaca file cadangan: ' + err);
      }
    };
    reader.readAsText(file);
  };

  // If user is not logged in, show Login Screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenInstallGuide={() => setShowInstallModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentCount={students.length}
      />

      {/* Desktop / Tablet Tab Navigation Bar (Visible on sm screens and up) */}
      <div className="no-print hidden sm:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab('input')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'input'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📝 Input Nilai PTS & PAS
            </button>
            <button
              onClick={() => setActiveTab('rapot')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'rapot'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📄 Halaman Rapot A4 (Rata-rata)
            </button>
            <button
              onClick={() => setActiveTab('kompetensi')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'kompetensi'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              🎯 Dasbor Kompetensi & KKM (75)
            </button>
            <button
              onClick={() => setActiveTab('santri')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'santri'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              👥 Kelola Santri ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('pengaturan')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'pengaturan'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              ⚙️ Pengaturan Mudir & Halaqoh
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'input' && activeStudent && (
          <GradeInputForm
            student={activeStudent}
            competencies={competencies}
            allStudents={students}
            settings={schoolSettings}
            onSaveStudent={handleSaveStudent}
            onViewReport={() => setActiveTab('rapot')}
            onOpenStudentList={() => setActiveTab('santri')}
            onAddNewStudent={handleAddNewStudent}
          />
        )}

        {activeTab === 'rapot' && activeStudent && (
          <ReportCardView
            student={activeStudent}
            competencies={competencies}
            allStudents={students}
            settings={schoolSettings}
            onBackToInput={() => setActiveTab('input')}
            onSelectAnotherStudent={() => setActiveTab('santri')}
          />
        )}

        {activeTab === 'kompetensi' && (
          <CompetencyDashboard
            competencies={competencies}
            onSaveCompetencies={handleSaveCompetencies}
            onResetCompetencies={handleResetCompetencies}
          />
        )}

        {activeTab === 'santri' && (
          <StudentManager
            students={students}
            activeStudentId={activeStudentId}
            competencies={competencies}
            onSelectStudent={handleSelectStudent}
            onAddNewStudent={handleAddNewStudent}
            onDeleteStudent={handleDeleteStudent}
            onViewReport={handleViewReportForStudent}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}

        {activeTab === 'pengaturan' && (
          <SettingsDashboard
            settings={schoolSettings}
            onSaveSettings={handleSaveSchoolSettings}
            onResetSettings={handleResetSchoolSettings}
            studentsCount={students.length}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile Devices */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenInstallGuide={() => setShowInstallModal(true)}
      />

      {/* PWA Install Guide Modal */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />

    </div>
  );
}
