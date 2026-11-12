# SIAKAD - Universitas Siber Muhammadiyah (SiberMu)
> Tugas Pemrograman Web: Sistem Autentikasi Login & Dashboard Akademik Berbasis Peran

Aplikasi web modern berbasis **Svelte 5** (versi terbaru), **TypeScript**, dan **Bootstrap 5** dengan tema warna tunggal **Navy Blue SiberMu**.

---

## 🏛️ Identitas Kampus
* **Nama Perguruan Tinggi:** Universitas Siber Muhammadiyah (SiberMu)
* **Sistem:** SIAKAD (Sistem Informasi Akademik)

---

## 🔒 Sistem Autentikasi Login (Hanya Akun Terdaftar)

Sistem login tidak menyediakan menu pendaftaran mandiri (*no self-register*), melainkan menerapkan kontrol akses berbasis **Nomor Induk (NIK/NIM/NIDN)** dan **Peran (Role)** resmi yang sudah terdaftar di pangkalan data:

| Peran (Role) | Nomor Induk (NIK / NIM / NIDN) | Kata Sandi | Nama Pengguna | Program Studi |
| :--- | :--- | :--- | :--- | :--- |
| **Mahasiswa** | `230101001` | `password123` | **Ahmad Fauzan Syahputra** | S1 Informatika |
| **Dosen** | `0612048501` | `password123` | **Dr. Ir. Muhammad Arifin, M.Kom.** | S1 Informatika |

> **Validasi Sistem:**
> 1. Jika NIK tidak ditemukan di sistem, login akan ditolak.
> 2. Jika NIK valid tetapi pilihan peran tidak cocok (misal: memasukkan NIK mahasiswa tetapi memilih peran Dosen), sistem akan menolak dan memberi peringatan.
> 3. Kata sandi harus sesuai dengan NIK terdaftar.

---

## 👥 Fitur Menu Berdasarkan Peran

### 🎓 Menu Mahasiswa (Portal Mahasiswa):
* **Ringkasan Studi:** Metrik beban SKS, SKS disetujui, dan ringkasan matkul terkini.
* **Rencana Studi (KRS):** Mengambil mata kuliah baru, mencari matkul, dan menghapus.
* **Jadwal Kuliah:** Jadwal mingguan sinkron otomatis dari matkul terdaftar.
* **Transkrip Nilai (KHS):** Evaluasi progres SKS dan status her-registrasi.
* **Biodata Mahasiswa:** Informasi identitas diri resmi mahasiswa.

### 👨‍🏫 Menu Dosen (Portal Dosen):
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
Buka `http://localhost:5173` di peramban Anda.
