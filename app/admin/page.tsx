"use client";
import { useEffect, useState } from 'react';
import pb from '../pocketbase'; // Bir üst klasöre çıkıp pocketbase'i buluyoruz
import { API_URL } from '../config'; // <-- Bunu ekle

export default function AdminPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Sayfa açılınca tüm soruları getir
  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      // Oluşturulma tarihine göre tersten sırala (en yeni en üstte)
      const res = await pb.collection('sessions').getFullList({
        sort: '-created',
      });
      setSessions(res);
    } catch (err) {
      alert("Oturumlar çekilemedi!");
    }
  }

  // Seçilen soruyu AKTİF yap, diğerlerini PASİF yap
  async function activateSession(id: string) {
    if (loading) return;
    setLoading(true);

    try {
      // 1. Önce şu an aktif olan HER ŞEYİ pasif yap (Temizlik)
      const activeSessions = sessions.filter(s => s.is_active);
      for (const session of activeSessions) {
        await pb.collection('sessions').update(session.id, { is_active: false });
      }

      // 2. Seçilen soruyu aktif yap
      await pb.collection('sessions').update(id, { is_active: true });

      // 3. Listeyi yenile ki ekranda yeşil yandığını görelim
      await fetchSessions();
      
    } catch (err) {
      alert("Hata oluştu: " + err);
    } finally {
      setLoading(false);
    }
  }

  // Oyları Sıfırla (Opsiyonel: Test ederken işe yarar)
  async function resetVotes(sessionId: string) {
    if(!confirm("Bu soruya ait TÜM OYLAR silinecek. Emin misin?")) return;
    
    try {
      const votes = await pb.collection('votes').getFullList({ filter: `session="${sessionId}"`});
      for (const vote of votes) {
        await pb.collection('votes').delete(vote.id);
      }
      alert("Oylar temizlendi.");
    } catch (err) {
      alert("Silinemedi.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">YÖNETİCİ PANELİ</h1>

      <div className="max-w-4xl mx-auto grid gap-6">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className={`p-6 rounded-xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 transition-all
              ${session.is_active 
                ? 'border-green-500 bg-green-900/20 shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-105' 
                : 'border-gray-700 bg-gray-800 opacity-80 hover:opacity-100'
              }`}
          >
            
            {/* Sol Taraf: Bilgiler */}
            <div className="flex items-center gap-4">
               {/* Küçük resim önizlemesi */}
<img 
  src={`${API_URL}/api/files/sessions/${session.id}/${session.image_left}`} 
  className="w-16 h-16 object-cover rounded bg-black"
/>
               <div>
                 <h2 className="text-xl font-bold">{session.title}</h2>
                 <p className="text-sm text-gray-400">ID: {session.id}</p>
                 {session.is_active && <span className="text-green-400 font-bold animate-pulse">● CANLI YAYINDA</span>}
               </div>
            </div>

            {/* Sağ Taraf: Butonlar */}
            <div className="flex gap-3">
              {session.is_active ? (
                <button disabled className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold cursor-default">
                  AKTİF ✅
                </button>
              ) : (
                <button 
                  onClick={() => activateSession(session.id)}
                  disabled={loading}
                  className="bg-gray-700 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition hover:scale-105"
                >
                  {loading ? "..." : "BAŞLAT 🚀"}
                </button>
              )}

              <button 
                onClick={() => resetVotes(session.id)}
                className="bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white px-4 py-2 rounded-lg text-sm border border-red-800 transition"
              >
                Oyları Sil 🗑️
              </button>
            </div>

          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-center text-gray-500">Hiç oturum bulunamadı. PocketBase'den ekleyin.</div>
        )}
      </div>
    </div>
  );
}