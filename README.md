# SIAKAD - Universitas Siber Muhammadiyah (SiberMu)
> Tugas Pemrograman Web: Sistem Autentikasi Login & Dashboard Akademik Berbasis Peran

Aplikasi web modern berbasis **Svelte 5** (versi terbaru), **TypeScript**, dan **Bootstrap 5** dengan tema warna tunggal **Navy Blue SiberMu**. Dilengkapi sistem sidebar adaptif yang memisahkan menu khusus untuk **Mahasiswa** dan **Dosen**.

---

## 🏛️ Identitas Kampus
* **Nama Perguruan Tinggi:** Universitas Siber Muhammadiyah (SiberMu)
* **Sistem:** SIAKAD (Sistem Informasi Akademik)

---

## 🔑 Akun Demo Sementara (Untuk Pengujian)

Tersedia tombol akses cepat di halaman login atau gunakan data berikut:

| Peran (Role) | Username / ID | Kata Sandi | Nama Pengguna | Program Studi |
| :--- | :--- | :--- | :--- | :--- |
| **Mahasiswa** | `mahasiswa` atau `230101001` | `password123` | Ahmad Fauzan Syahputra | S1 Informatika |
| **Dosen** | `dosen` atau `0612048501` | `password123` | Dr. Ir. Muhammad Arifin, M.Kom. | S1 Informatika |

> **Catatan:** Anda juga tetap dapat mendaftarkan akun baru secara mandiri melalui tombol *"Daftar di sini"*.

---

## 📑 Data Mata Kuliah Sementara (Dummy KRS)

Sistem sudah diisi data KRS awal agar dashboard langsung hidup dan siap diuji:

1. `IF201` - **Pemrograman Berbasis Web** (3 SKS) &bull; Dosen: Dr. Ir. Muhammad Arifin, M.Kom. &bull; *Status: Disetujui*
2. `IF203` - **Basis Data & SQL Terapan** (3 SKS) &bull; Dosen: Dewi Rahmawati, M.Cs. &bull; *Status: Disetujui*
3. `IF205` - **Rekayasa Perangkat Lunak** (3 SKS) &bull; Dosen: Dr. Ir. Muhammad Arifin, M.Kom. &bull; *Status: Menunggu*
4. `IF207` - **Keamanan Siber & Jaringan** (3 SKS) &bull; Dosen: Hadi Pranoto, M.T. &bull; *Status: Menunggu*

*(Mata kuliah dengan status "Menunggu" dapat disetujui langsung oleh akun Dosen di menu **Validasi KRS Mahasiswa**).*

---

## 👥 Fitur Menu Berdasarkan Peran

### 🎓 Menu Mahasiswa:
* **Ringkasan Studi:** Metrik beban SKS, SKS disetujui, dan ringkasan matkul.
* **Rencana Studi (KRS):** Mengambil mata kuliah baru, mencari matkul, dan menghapus.
* **Jadwal Kuliah:** Jadwal mingguan sinkron otomatis dari matkul terdaftar.
* **Transkrip Nilai (KHS):** Evaluasi progres SKS dan status her-registrasi.
* **Biodata Mahasiswa:** Informasi identitas diri resmi mahasiswa.

### 👨‍🏫 Menu Dosen:
* **Ringkasan Mengajar:** Metrik jumlah pengajuan KRS yang perlu divalidasi.
* **Validasi KRS Mahasiswa:** Tinjau dan setujui / batalkan rencana studi mahasiswa dengan 1 klik.
* **Mata Kuliah Diampu:** Daftar mata kuliah yang dibimbing.
* **Jadwal Mengajar:** Jadwal perkuliahan daring dan bimbingan akademik.
* **Profil Dosen:** Data NIDN dan kepegawaian dosen.

---

## 🛠️ Teknologi yang Digunakan
* **Framework:** [Svelte 5](https://svelte.dev/) (`5.57.3`) dengan Runes API (`$state`, `$derived`, `$props`)
* **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
* **CSS:** [Bootstrap 5.3](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/)
* **Build Tool:** [Vite](https://vitejs.dev/)

---

## 💻 Cara Menjalankan
```bash
npm run dev
```
Buka `http://localhost:5173` di browser Anda.
