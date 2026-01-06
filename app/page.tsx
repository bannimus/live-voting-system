"use client";
import { useEffect, useState } from 'react';
import pb from './pocketbase';
// @ts-ignore
import QRCode from "react-qr-code";
import confetti from 'canvas-confetti';
// YENİ: Config dosyasından URL'leri alıyoruz
import { API_URL, SITE_URL } from './config'; 

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [voted, setVoted] = useState(false);
  
  // İstatistikleri ve toplamı tutan state
  const [stats, setStats] = useState<any>({ left: 0, right: 0, unsure: 0 });
  const [total, setTotal] = useState(0);

  // --- 1. Başlangıç Verilerini ve Oturumu Çek ---
  useEffect(() => {
    loadSessionAndVotes();

    pb.collection('votes').subscribe('*', function (e) {
      if (e.action === 'create') {
        const choice = e.record.choice;
        setStats((prev: any) => ({ ...prev, [choice]: prev[choice] + 1 }));
        setTotal(prev => prev + 1);
      }
    });

    pb.collection('sessions').subscribe('*', function (e) {
      if (e.action === 'update' && e.record.is_active) {
         loadSessionAndVotes();
      }
    });

    return () => {
      pb.collection('votes').unsubscribe('*');
      pb.collection('sessions').unsubscribe('*');
    };
  }, []);

  async function loadSessionAndVotes() {
    try {
      const activeSession = await pb.collection('sessions').getFirstListItem('is_active=true');
      setSession(activeSession);

      const localVote = localStorage.getItem(`voted_${activeSession.id}`);
      if (localVote) {
        setVoted(true); 
      } else {
        setVoted(false); 
      }

      const votes = await pb.collection('votes').getFullList({
          filter: `session="${activeSession.id}"`
      });

      const newStats = { left: 0, right: 0, unsure: 0 };
      votes.forEach((v: any) => {
          if (v.choice === 'left') newStats.left++;
          if (v.choice === 'right') newStats.right++;
          if (v.choice === 'unsure') newStats.unsure++;
      });
      
      setStats(newStats);
      setTotal(votes.length);

    } catch (err) {
      console.log("Aktif oturum yok");
      setSession(null);
    }
  }

  async function vote(choice: string) {
    if (!session) return;
    try {
      await pb.collection('votes').create({
        session: session.id,
        choice: choice,
      });
// --- YENİ EKLENEN KISIM: KONFETİ PATLAT ---
      confetti({
        particleCount: 150, // Parçacık sayısı
        spread: 70,         // Ne kadar geniş alana yayılsın
        origin: { y: 0.6 }, // Ekranın neresinden çıksın (0.6 = biraz aşağısı)
        colors: ['#3b82f6', '#a855f7', '#ffffff'] // Mavi, Mor ve Beyaz renkler
      });
      // ------------------------------------------

      localStorage.setItem(`voted_${session.id}`, 'true');
      setVoted(true); 
    } catch (err) {
      alert("Hata oluştu, tekrar deneyin.");
    }
  }

  const getPercent = (val: number) => total === 0 ? 0 : Math.round((val / total) * 100);

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <h1 className="text-2xl animate-pulse">Yeni soru bekleniyor...</h1>
      </div>
    );
  }

// --- BURAYI DEĞİŞTİRİYORUZ ---
  // Eski: const imgLeft = `http://192.168.1.34:8090/...`;
  // Yeni: API_URL değişkenini kullanıyoruz
  const imgLeft = `${API_URL}/api/files/sessions/${session.id}/${session.image_left}`;
  const imgRight = `${API_URL}/api/files/sessions/${session.id}/${session.image_right}`;
  
  // QR Kod için SITE_URL kullanıyoruz
  const voteUrl = SITE_URL;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 py-6 font-sans relative">
      
      {/* BAŞLIK */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center tracking-wide">{session.title}</h1>

      {/* RESİMLER */}
      <div className="flex w-full max-w-4xl gap-3 mb-8">
        <div className="flex-1 bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-xl">
          <img src={imgLeft} className="w-full h-48 md:h-80 object-cover rounded-lg" alt="Sol" />
          <p className="text-center font-bold mt-2 text-blue-400 text-lg">SOL</p>
        </div>
        <div className="flex-1 bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-xl">
          <img src={imgRight} className="w-full h-48 md:h-80 object-cover rounded-lg" alt="Sağ" />
          <p className="text-center font-bold mt-2 text-purple-400 text-lg">SAĞ</p>
        </div>
      </div>
      
      {/* OY / SONUÇ ALANI */}
      {!voted ? (
        <div className="flex flex-col w-full max-w-lg gap-4 animate-in fade-in zoom-in duration-300 z-10">
          <button onClick={() => vote('left')} className="bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-xl font-bold text-xl transition shadow-lg hover:scale-105 active:scale-95">
            👈 Soldaki AI
          </button>
          <button onClick={() => vote('right')} className="bg-purple-600 hover:bg-purple-500 text-white p-5 rounded-xl font-bold text-xl transition shadow-lg hover:scale-105 active:scale-95">
            👉 Sağdaki AI
          </button>
          <button onClick={() => vote('unsure')} className="bg-slate-700 hover:bg-slate-600 text-gray-300 p-3 rounded-xl font-bold text-lg transition mt-2">
            🤔 Emin Değilim
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-6 animate-in slide-in-from-bottom duration-500 z-10">
            <div className="text-center mb-4">
                <span className="inline-block bg-green-900/30 text-green-400 px-4 py-2 rounded-full font-bold border border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                    ✅ Oyunuz Alındı! Sonuçlar Canlı:
                </span>
            </div>

            <div className='bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden'>
                <div className="flex justify-between mb-2 font-bold z-10 relative">
                    <span className="text-blue-400">SOLDAKİ</span>
                    <span>%{getPercent(stats.left)} ({stats.left} Oy)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-6 overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-700 ease-out" style={{ width: `${getPercent(stats.left)}%` }}></div>
                </div>
            </div>

            <div className='bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden'>
                <div className="flex justify-between mb-2 font-bold z-10 relative">
                    <span className="text-purple-400">SAĞDAKİ</span>
                    <span>%{getPercent(stats.right)} ({stats.right} Oy)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-6 overflow-hidden">
                    <div className="bg-purple-500 h-full transition-all duration-700 ease-out" style={{ width: `${getPercent(stats.right)}%` }}></div>
                </div>
            </div>

             <div className="text-center mt-8 opacity-50 text-sm">
                TOPLAM OY: <span className="font-mono text-xl text-white ml-2">{total}</span>
             </div>
        </div>
      )}

      {/* --- QR KOD ALANI --- */}
      {/* Sağ alt köşeye sabitledik. Telefondan girince çok yer kaplamasın diye 'hidden md:block' ekledim. 
          Böylece sadece büyük ekranlarda (bilgisayar/projeksiyon) görünür. */}
      <div className="fixed bottom-4 right-4 bg-white p-2 rounded-lg shadow-2xl hidden md:block opacity-80 hover:opacity-100 transition">


      {/* TypeScript hatasını susturmak için şu satırı ekle: */}
      {/* @ts-ignore */}
      <QRCode 
          value={voteUrl} 
          size={100}
      />
        <p className="text-black text-xs text-center font-bold mt-1">Oy Ver</p>
      </div>

    </div>
  );
}