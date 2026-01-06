"use client";
import { useEffect, useState } from 'react';
// Bir üst klasördeki (app/) pocketbase dosyasına çıkıyoruz
import pb from '../pocketbase';

export default function Dashboard() {
  // Oyları tutacağımız kasa
  const [stats, setStats] = useState<any>({ left: 0, right: 0, unsure: 0 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // 1. Sayfa açılınca: Önce mevcut oyları sayalım
    async function fetchVotes() {
      try {
        // Aktif soruyu bul
        const activeSession = await pb.collection('sessions').getFirstListItem('is_active=true');

        // O soruya ait tüm oyları çek
        const votes = await pb.collection('votes').getFullList({
            filter: `session="${activeSession.id}"`
        });

        // Sayım yap
        const newStats = { left: 0, right: 0, unsure: 0 };
        votes.forEach((v: any) => {
            if (v.choice === 'left') newStats.left++;
            if (v.choice === 'right') newStats.right++;
            if (v.choice === 'unsure') newStats.unsure++;
        });
        
        setStats(newStats);
        setTotal(votes.length);

      } catch (e) {
        console.log("Henüz aktif oturum yok veya hiç oy yok.");
      }
    }

    fetchVotes();

    // 2. REAL-TIME: Yeni oy atıldığında anlık yakala!
    pb.collection('votes').subscribe('*', function (e) {
      if (e.action === 'create') {
        // Yeni gelen oyun tercihini (left/right/unsure) al
        const choice = e.record.choice; 
        
        // Sayacı güncelle
        setStats((prev: any) => ({
            ...prev,
            [choice]: prev[choice] + 1
        }));
        
        // Toplamı artır
        setTotal(prev => prev + 1);
      }
    });

    // Sayfadan çıkınca dinlemeyi bırak (Performans için)
    return () => {
      pb.collection('votes').unsubscribe('*');
    };
  }, []);

  // Yüzde hesaplama fonksiyonu
  const getPercent = (val: number) => total === 0 ? 0 : Math.round((val / total) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-12 tracking-wider">CANLI SONUÇLAR</h1>

      <div className="w-full max-w-5xl space-y-10">
        {/* SOL SEÇENEK */}
        <div className='bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg'>
            <div className="flex justify-between text-2xl mb-4 font-bold">
                <span className="text-blue-400">SOLDAKİ FOTOĞRAF</span>
                <span>{stats.left} Oy (%{getPercent(stats.left)})</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-10 overflow-hidden border border-slate-600">
                <div 
                    className="bg-blue-500 h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                    style={{ width: `${getPercent(stats.left)}%` }}
                ></div>
            </div>
        </div>

        {/* SAĞ SEÇENEK */}
        <div className='bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg'>
            <div className="flex justify-between text-2xl mb-4 font-bold">
                <span className="text-purple-400">SAĞDAKİ FOTOĞRAF</span>
                <span>{stats.right} Oy (%{getPercent(stats.right)})</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-10 overflow-hidden border border-slate-600">
                <div 
                    className="bg-purple-500 h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
                    style={{ width: `${getPercent(stats.right)}%` }}
                ></div>
            </div>
        </div>

        {/* EMİN DEĞİLİM */}
        <div className='opacity-70'>
            <div className="flex justify-between text-lg mb-2 text-gray-400">
                <span>Emin Değilim</span>
                <span>{stats.unsure}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                <div 
                    className="bg-gray-500 h-full transition-all duration-500 ease-out" 
                    style={{ width: `${getPercent(stats.unsure)}%` }}
                ></div>
            </div>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Toplam Katılım</p>
        <div className="text-7xl font-mono font-bold text-white">
            {total}
        </div>
      </div>
    </div>
  );
}