// app/config.ts

// DİKKAT: Sunum yapacağın yere gidince sadece buradaki tırnak içindeki IP'yi değiştirmen yeterli!
export const SERVER_IP = "192.168.1.34"; 

export const POCKETBASE_PORT = "8090";
export const NEXTJS_PORT = "3001"; // Terminalde hangi port yazıyorsa (3000, 3001, 3002)

// Bunlara dokunmana gerek yok, otomatik oluşacak
export const API_URL = `http://${SERVER_IP}:${POCKETBASE_PORT}`;
export const SITE_URL = `http://${SERVER_IP}:${NEXTJS_PORT}`;