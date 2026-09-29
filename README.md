# 🎮 Sekolah Solver — LKPD Interaktif Informatika Kelas 8

**Kode Berkas:** K8P15 · **Semester:** Ganjil 2026/2027  
**Materi:** Proyek Integratif: Perancangan Solusi  
**Mata Pelajaran:** Informatika — Fase D (Kelas VIII SMP)  
**Penyusun:** TIM MGMP INFORMATIKA SMP NEGERI 19 KOTA BEKASI

---

## 📌 Deskripsi

**Sekolah Solver** adalah aplikasi web LKPD (Lembar Kerja Peserta Didik) interaktif berbasis game bertingkat yang mendigitalkan LKPD cetak Bagian A–F dari Modul Ajar Informatika K8P15.

Murid memilih satu masalah nyata sekolah (gawai, sampah, antrean, atau literasi digital), mengolah data sederhana, menerapkan **4 alat Berpikir Komputasional**, menyusun algoritma dengan percabangan **JIKA–MAKA**, dan merefleksikan dampak sosial solusinya.

---

## ✨ Fitur

- 7 misi bertingkat + halaman pembuka + halaman hasil
- **Dwibahasa**: setiap istilah Inggris disertai padanan Indonesia
- **Auto-save progres** ke `localStorage`
- **Mode Gelap** dan **Mode Kurangi Gerak**
- **Suara (Web Audio API)** tanpa file eksternal — bisa dimatikan
- **Confetti canvas** buatan sendiri
- **Salin Hasil** & **Unduh Hasil (.txt)** untuk penilaian guru
- **Mode Guru** tersembunyi (klik logo 3×) → tampilkan kunci & reset
- **Pelangi Perasaan** (4 warna) sesuai LKPD Bagian F
- **Diagram Alur SVG** otomatis dari algoritma murid
- Responsif (HP, tablet, laptop) + aksesibel (WCAG AA)
- Tanpa backend, tanpa tracker, tanpa iklan

---

## 🚀 Cara Pakai

### Untuk Murid
1. Buka link aplikasi di browser (Chrome/Edge/Firefox).
2. Isi **nama kelompok**, **nama anggota**, dan **pilih peran**.
3. Klik **MULAI PETUALANGAN 🚀**.
4. Selesaikan 7 misi secara berurutan.
5. Di halaman akhir, klik **Salin Hasil** atau **Unduh .txt** untuk dikirim ke guru.

### Untuk Guru
- Sebelum murid memulai: siapkan link & QR code.
- Setelah selesai: minta murid kirim hasil via WA/Classroom/Google Form.
- **Mode Guru** (klik logo 3×) menampilkan kunci jawaban & tombol reset.

---

## 🌐 Cara Deploy Gratis di GitHub Pages

### Langkah 1 — Buat Akun GitHub
1. Buka https://github.com/signup
2. Isi email aktif, password, username (contoh: `guru-informatika-smpn19`)
3. Verifikasi email → login.

### Langkah 2 — (Opsional) Install Git
- Windows: unduh **Git for Windows** di https://git-scm.com
- Mac: buka Terminal → `git --version`
- Jika tidak mau install, gunakan upload via web (Langkah 4A).

### Langkah 3 — Buat Repository Baru
1. Di GitHub, klik **"+"** kanan atas → **"New repository"**
2. Isi:
   - **Repository name:** `sekolah-solver`
   - **Description:** `LKPD Interaktif Informatika Kelas 8 - Proyek Integratif Perancangan Solusi`
   - **Public** ✅
   - **Add a README file** ✅
3. Klik **"Create repository"**

### Langkah 4A — Upload via Web (PALING MUDAH)
1. Di halaman repository, klik **"Add file"** → **"Upload files"**
2. Seret semua file: `index.html`, `style.css`, `script.js`, `favicon.svg`, `README.md`, dan `logo.png`
3. Scroll bawah → tulis commit message → **"Commit changes"**
4. Tunggu 10 detik.

### Langkah 4B — Upload via Git
```bash
git init
git add .
git commit -m "Upload LKPD Sekolah Solver"
git branch -M main
git remote add origin https://github.com/USERNAME/sekolah-solver.git
git push -u origin main