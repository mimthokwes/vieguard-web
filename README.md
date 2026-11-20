# VieGuard Web

Portal web resmi pelanggan untuk pemesanan, penyewaan, dan pembuatan kostum custom (drumband, parade, karnaval, dan event perayaan). Terintegrasi langsung dengan backend VieGuard dan aplikasi mobile manajemen admin.

---

## Target Pengguna

Website ini dirancang khusus untuk memenuhi kebutuhan:
* **Sekolah & Institusi**: Pemesanan seragam drumband/marching band dalam jumlah massal untuk satu tim/regu.
* **Sanggar Seni & Komunitas**: Penyewaan kostum tari, parade budaya, atau karnaval tematik.
* **Panitia Acara & EO**: Pengadaan kostum acara 17 Agustusan, festival daerah, atau maskot kegiatan.
* **Pelanggan Umum**: Pembelian maupun sewa kostum satuan atau request pembuatan kostum custom dengan ukuran spesifik.

---

## Fitur Utama

### 1. Katalog & Sistem Penyewaan
* **Katalog Lengkap**: Eksplorasi berbagai pilihan kostum dengan filter kategori, detail ukuran (S/M/L/XL/All Size), dan foto detail.
* **Penyewaan Terjadwal**: Memilih tanggal mulai sewa dan tanggal pengembalian, lengkap dengan ketentuan dan perjanjian sewa resmi.

### 2. Pesanan Custom (Jahit Khusus)
* **Request Desain Sendiri**: Formulir pemesanan khusus untuk kostum yang belum ada di katalog.
* **Upload Referensi**: Pelanggan dapat mengunggah foto sketsa, referensi model, dan menentukan detail ukuran perorangan/tim.

### 3. Alur Pembayaran Fleksibel (DP & Pelunasan)
* **Sistem Pembayaran Bertahap**: Mendukung pembayaran DP (Down Payment) di awal untuk pesanan borongan/custom, dan pelunasan saat kostum siap dikirim.
* **Multi Metode Pembayaran**: Terintegrasi dengan Midtrans (QRIS, Virtual Account, Transfer Bank) serta upload bukti bayar manual.

### 4. Pelacakan Pesanan & Progres Produksi
* **Timeline Status Pesanan**: Pelanggan dapat memantau status pesanan secara transparan (Menunggu DP -> Proses Jahit/Produksi -> Siap Kirim -> Pelunasan -> Selesai).

### 5. Konsultasi & Live Chat
* **Chat Realtime**: Komunikasi langsung dengan pemilik/admin melalui Socket.IO untuk koordinasi ukuran, bahan, dan revisi.
* **Asisten AI**: Konsultasi cerdas berbasis AI untuk rekomendasi kostum dan ide tema acara.

### 6. Galeri Portofolio & Profil
* Menampilkan dokumentasi karya kostum yang pernah diproduksi dan dipakai di berbagai festival.

---

## Teknologi yang Digunakan

* **Framework**: Next.js 16 (App Router, Standalone Mode)
* **Bahasa**: TypeScript
* **Styling**: Tailwind CSS & Lucide Icons
* **State & Data Fetching**: TanStack React Query & Axios
* **Realtime**: Socket.IO Client
* **Payment Gateway**: Midtrans Snap

---

## Panduan Lingkungan & Deployment

### 1. Prasyarat Lingkungan (.env)
Pastikan file `.env` diisi dengan endpoint API yang sesuai:
```env
NEXT_PUBLIC_API_URL=https://api.vieguard.web.id/api/v0/website
NEXT_PUBLIC_API_HOST=https://api.vieguard.web.id
NEXT_PUBLIC_SOCKET_URL=https://api.vieguard.web.id
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

### 2. Menjalankan di Mode Development (Lokal)
```bash
# Instal dependensi
npm install

# Jalankan server pengembangan
npm run dev
```
Akses di browser: `http://localhost:3000`

### 3. Build & Deployment (Docker / STB Server)
Proyek ini dikonfigurasi untuk menghasilkan build mandiri (*standalone*) yang ringan dan hemat RAM untuk deployment di ARM64 / server lokal:
```bash
# Build production lokal
npm run build

# Menjalankan hasil build standalone
node .next/standalone/server.js
```
*Note: Image Docker otomatis dibuild dan dipush ke GitHub Container Registry (GHCR) via GitHub Actions setiap kali push ke branch `main`.*
