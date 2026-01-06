
```markdown
# 🗳️ Live Voting System / Canlı Oylama Sistemi

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![PocketBase](https://img.shields.io/badge/PocketBase-Realtime-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-cyan)

[English](#english) | [Türkçe](#türkçe)

---

<a name="english"></a>
## 🇬🇧 English

### 🌟 Introduction
**Live Voting System** is a real-time, interactive voting application designed for presentations, classrooms, and events. It allows the audience to vote on questions displayed on a main screen using their mobile devices via a QR Code.

The results are updated **instantly** (real-time) on the main screen without requiring a page refresh, accompanied by visual effects (confetti) and progress bars.

### ✨ Key Features
* **Real-Time Updates:** Votes are pushed instantly to the client using PocketBase (WebSocket).
* **Interactive Dashboard:** Single Page Application (SPA) feel. Voting buttons transform into live result graphs immediately after voting.
* **Admin Panel:** A dedicated interface to manage sessions, activate/deactivate questions, and reset votes with a single click.
* **QR Code Integration:** Automatically generates a QR code for the active session, allowing users to join via mobile easily.
* **Duplicate Vote Prevention:** Uses `localStorage` to prevent users from voting multiple times on the same question.
* **Visual Effects:** Confetti celebration effect upon casting a vote.
* **Configurable Network:** Centralized `config.ts` file to easily update IP addresses for different local network environments.

### 🛠️ Tech Stack
* **Frontend:** Next.js (React), TypeScript
* **Backend & Database:** PocketBase (Go-based realtime backend)
* **Styling:** Tailwind CSS
* **Libraries:** `react-qr-code`, `canvas-confetti`

### 📸 Screenshots
*(Add your screenshots here, e.g., /screenshots/dashboard.png)*
### 🚀 Installation & Setup

#### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/live-voting-system.git](https://github.com/your-username/live-voting-system.git)
cd live-voting-system

```

#### 2. Backend Setup (PocketBase)

Navigate to the PocketBase directory and start the server.

```bash
# Windows
cd pocketbase_0.35.0_windows_amd64
./pocketbase serve --http="0.0.0.0:8090"

```

*Access the Admin UI at: `http://127.0.0.1:8090/_/` to create your collections (sessions, votes).*

#### 3. Frontend Setup (Next.js)

Open a new terminal, navigate to the app folder, and install dependencies.

```bash
cd canli-oylama
npm install

```

#### 4. Configuration (Important!)

Before running, check your local IP address (e.g., `ipconfig` on Windows) and update the `app/config.ts` file:

```typescript
// app/config.ts
export const SERVER_IP = "192.168.1.XX"; // Replace with your computer's IP

```

#### 5. Run the Application

```bash
npm run dev

```

* **Voting Screen:** `http://localhost:3001` (or your IP)
* **Admin Panel:** `http://localhost:3001/admin`

---

<a name="türkçe"></a>

## 🇹🇷 Türkçe

### 🌟 Proje Hakkında

**Canlı Oylama Sistemi**, sunumlar, sınıflar ve etkinlikler için tasarlanmış gerçek zamanlı (real-time) bir oylama uygulamasıdır. İzleyiciler, ekrandaki QR Kodu telefonlarıyla okutarak oylamaya anında katılabilirler.

Oylar verildiği anda sayfa yenilenmesine gerek kalmadan ana ekranda grafikler güncellenir, konfeti efektleri patlar ve sonuçlar canlı olarak yansıtılır.

### ✨ Temel Özellikler

* **Gerçek Zamanlı Güncelleme:** Oylar PocketBase (WebSocket) kullanılarak anında ekrana yansır.
* **İnteraktif Arayüz:** Tek sayfa yapısı (SPA). Kullanıcı oy verdiğinde butonlar gider, yerini canlı grafikler alır.
* **Yönetici (Admin) Paneli:** Soruları aktif/pasif yapmak ve oyları sıfırlamak için özel yönetim sayfası.
* **QR Kod Entegrasyonu:** Sunum ekranında otomatik oluşturulan QR kod ile mobil erişim kolaylığı.
* **Çoklu Oy Engelleme:** `localStorage` kullanılarak aynı tarayıcıdan tekrar oy verilmesi engellenir.
* **Görsel Efektler:** Oy verme işlemi tamamlandığında konfeti efekti çalışır.
* **Kolay Ağ Ayarı:** Farklı Wi-Fi ağlarında çalışabilmesi için IP adresini tek bir dosyadan (`config.ts`) değiştirme imkanı.

### 🛠️ Kullanılan Teknolojiler

* **Önyüz (Frontend):** Next.js (React), TypeScript
* **Arka Uç (Backend):** PocketBase
* **Stil:** Tailwind CSS
* **Kütüphaneler:** `react-qr-code`, `canvas-confetti`

### 🚀 Kurulum ve Çalıştırma

#### 1. Projeyi İndirin

```bash
git clone [https://github.com/kullanici-adiniz/live-voting-system.git](https://github.com/kullanici-adiniz/live-voting-system.git)
cd live-voting-system

```

#### 2. Backend Kurulumu (PocketBase)

PocketBase klasörüne gidin ve sunucuyu başlatın.

```bash
# Windows Terminali
cd pocketbase_0.35.0_windows_amd64
./pocketbase serve --http="0.0.0.0:8090"

```

*Veritabanı paneli için tarayıcıda `http://127.0.0.1:8090/_/` adresine gidin.*

#### 3. Frontend Kurulumu (Next.js)

Yeni bir terminal açın, uygulama klasörüne gidin ve paketleri yükleyin.

```bash
cd canli-oylama
npm install

```

#### 4. Yapılandırma (Önemli!)

Uygulamayı başlatmadan önce bilgisayarınızın yerel IP adresini öğrenin (Windows'ta terminale `ipconfig` yazarak) ve `app/config.ts` dosyasını güncelleyin:

```typescript
// app/config.ts
export const SERVER_IP = "192.168.1.XX"; // Kendi IP adresinizi buraya yazın

```

#### 5. Uygulamayı Başlatın

```bash
npm run dev

```

* **Oylama Ekranı:** `http://localhost:3001` (veya IP adresiniz)
* **Yönetici Paneli:** `http://localhost:3001/admin`

---

### 👤 Author / Yazar

Developed by **[bannimus@gmail.com]**

```

```