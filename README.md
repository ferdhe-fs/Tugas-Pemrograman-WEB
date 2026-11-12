# SIAKAD - Universitas Siber Muhammadiyah (SiberMu)
> Tugas Pemrograman Web: Sistem Autentikasi Login & Dashboard Akademik

Aplikasi web modern berbasis **Svelte 5** (versi terbaru), **TypeScript**, dan **Bootstrap 5** untuk **Universitas Siber Muhammadiyah**. Sistem ini dibangun secara bersih tanpa data dummy bawaan, memungkinkan pengguna untuk mendaftarkan akun asli, melakukan login, serta mengelola rencana studi secara dinamis.

---

## 🏛️ Identitas Kampus
* **Nama Perguruan Tinggi:** Universitas Siber Muhammadiyah (SiberMu)
* **Sistem:** SIAKAD (Sistem Informasi Akademik)

---

## 🚀 Fitur Utama

1. **Autentikasi & Manajemen Pengguna (Tanpa Data Dummy):**
   * **Daftar Akun Baru (Registrasi):** Pengguna dapat mendaftarkan akun sendiri dengan menginput Nama Lengkap, NIM/NIDN, Program Studi (Informatika, Sistem Informasi, dll.), Peran (Mahasiswa/Dosen/Admin), Email, dan Kata Sandi.
   * **Formulir Login Bersih:** Input form tidak terisi data dummy awal. Dilengkapi tombol *Show/Hide Password* dan validasi kredensial.
   * **Penyimpanan Lokal (localStorage):** Akun tersimpan di browser secara persisten.
2. **Dashboard Akademik Dinamis:**
   * **Empty State Informatif:** Saat sistem baru dibuka, ditampilkan panduan bahwa data masih kosong dan siap diisi.
   * **Manajemen KRS (Tambah & Hapus):** Fitur input mata kuliah riil (Kode MK, Nama, SKS, Dosen, Hari, Jam, Ruang/LMS).
   * **Metrik Otomatis:** Perhitungan Total SKS dan SKS Disetujui dihitung secara *real-time* dari mata kuliah yang ditambahkan.
   * **Ubah Status Persetujuan:** Dosen/Admin dapat menyetujui atau membatalkan persetujuan KRS.
3. **Jadwal Perkuliahan & Biodata Profil:**
   * Tab **Jadwal Perkuliahan** merender daftar jadwal secara dinamis dari mata kuliah yang diambil.
   * Tab **Biodata Pengguna** menampilkan identitas resmi pengguna yang sedang login.
4. **Session Guard & Logout:**
   * Rute terproteksi: tidak bisa mengakses dashboard tanpa login.
   * Fitur logout dengan pembersihan sesi.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend Framework:** [Svelte 5](https://svelte.dev/) (Versi 5.57.3 - Versi resmi terbaru dengan Runes API: `$state`, `$derived`, `$props`)
* **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
* **CSS & Icon Framework:** [Bootstrap 5.3](https://getbootstrap.com/) & [Bootstrap Icons](https://icons.getbootstrap.com/)
* **Tooling:** [Vite](https://vitejs.dev/)

---

## 💻 Panduan Menjalankan

### 1. Jalankan Server Development
```bash
npm run dev
```
Buka alamat yang tertera di terminal (misalnya `http://localhost:5173`) pada browser Anda.

### 2. Alur Pengujian:
1. Buka halaman utama, pilih tab **"Buat Akun Baru"**.
2. Masukkan data asli Anda (Nama, NIM/NIDN, Program Studi, Username, Password).
3. Klik **"Daftar & Langsung Masuk"**.
4. Di dashboard, klik tombol **"Tambah Mata Kuliah (KRS)"** untuk menginput rencana studi pertama Anda.
5. Anda dapat mencoba fitur pencarian, filter, ubah status persetujuan, dan tab navigasi lainnya.
