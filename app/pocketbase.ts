import PocketBase from 'pocketbase';
import { API_URL } from './config'; // <-- Ayar dosyasını çağırdık

// Artık elle yazmak yok, config'den geliyor
const pb = new PocketBase(API_URL);

pb.autoCancellation(false);

export default pb;