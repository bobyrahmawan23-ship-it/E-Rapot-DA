import React, { useState } from 'react';
import { Download, Wifi, WifiOff, LogOut, User, Smartphone, Sparkles, BookOpen } from 'lucide-react';
import { MusyrifUser } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface HeaderProps {
  currentUser: MusyrifUser | null;
  onLogout: () => void;
  onOpenInstallGuide: () => void;
  activeTab: 'input' | 'rapot' | 'kompetensi' | 'santri' | 'pengaturan';
  setActiveTab: (tab: 'input' | 'rapot' | 'kompetensi' | 'santri' | 'pengaturan') => void;
  studentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onOpenInstallGuide,
  activeTab,
  setActiveTab,
  studentCount,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      onOpenInstallGuide();
    }
  };

  return (
    <>
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-2">
            
            {/* Logo and Brand Title */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-emerald-200 shadow-xs flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <img 
                  src="/logo.svg" 
                  alt="Logo Darul Abidin" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate flex items-center gap-1">
                    <span>E-Rapot</span>
                    <span className="text-emerald-700 font-black">Darul Abidin</span>
                  </h1>
                  <span className="hidden xs:inline-flex text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    PWA v1.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                  Ma'had Tahfidz Qur'an Darul Abidin • Cianjur
                </p>
                <p className="text-[10px] text-slate-400 truncate sm:hidden">
                  Sistem Nilai PTS & PAS
                </p>
              </div>
            </div>

            {/* Actions: Online Badge, PWA Install, User Profile & Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Online / Offline status badge */}
              <div 
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border ${
                  isOnline 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                }`}
                title={isOnline ? 'Terhubung (Online)' : 'Mode Offline (Data tersimpan di HP)'}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>Offline</span>
                  </>
                )}
              </div>

              {/* Install PWA Button (Prompt or Guide) */}
              {!isInstalled && (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs active:scale-95 transition"
                  title="Pasang aplikasi di layar utama HP Anda"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Instal Aplikasi</span>
                  <span className="sm:hidden">Instal</span>
                </button>
              )}

              {/* User / Musyrif Info and Logout */}
              {currentUser && (
                <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
                  <div className="hidden lg:block text-right">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                      {currentUser.nama}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-medium">
                      {currentUser.halaqoh || 'Musyrif Halaqoh'}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition"
                    title="Keluar / Ganti Akun"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Quick Top Sub-Bar for Mobile view tab indicators */}
        <div className="bg-emerald-800 text-white text-[11px] px-3 py-1 flex items-center justify-between sm:hidden">
          <span className="truncate">
            Musyrif: <strong className="font-semibold">{currentUser?.nama || 'Musyrif'}</strong>
          </span>
          <span className="shrink-0 bg-emerald-900/60 px-2 py-0.5 rounded font-mono">
            {studentCount} Santri Terdata
          </span>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Keluar</h3>
            <p className="text-xs text-slate-600 mt-1 mb-5">
              Apakah Ustadz yakin ingin keluar dari sesi? Data nilai yang telah disimpan tetap aman tersimpan di HP Anda.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm active:scale-95 transition"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
