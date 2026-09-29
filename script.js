/* ============================================================
   SEKOLAH SOLVER — LKPD Interaktif K8P15
   ============================================================ */

/* ---------- ⚙️ TUNABLE CONSTANTS ---------- */
const NAMA_SEKOLAH   = "SMP Negeri 19 Kota Bekasi";
const FOOTER_TEXT    = "LKPD Informatika Kelas 8 · Proyek Integratif: Perancangan Solusi · © 2026 SMP Negeri 19 Kota Bekasi";
const TAHUN          = 2026;
const KODE_BERKAS    = "K8P15";
const DEFAULT_LANG   = "id";
const SHOW_TOOLTIP_PADANAN = true;
const SOUND_ENABLED  = true;
const MAX_RETRY      = 2;
const SKOR_MIN_BINTANG = [0, 40, 60, 80, 95];
const NAMA_KELOMPOK_MAX = 40;
const LOGO_PATH      = "logo.png";

/* ---------- STATE ---------- */
const state = {
  kelompok: "",
  anggota: [],
  peran: "Manajer Proyek",
  misiIndex: 0,          // 0..6 (7 misi)
  selesai: [],           // boolean per misi
  jawaban: {
    misi1: { skor: {gawai:[1,1,1], sampah:[1,1,1], antrean:[1,1,1], literasi:[1,1,1]}, pilihan: null, quizBenar: false },
    misi2: { hasil: {}, benar: false },
    misi3: { penempatan: {}, benar: false },
    misi4: { pilihan: null, benar: false },
    misi5: { penempatan: {}, benar: false },
    misi6: { urutan: [], pilihan: null, benar: false },
    misi7: { jawaban: {}, benar: false }
  },
  skorMisi: [0,0,0,0,0,0,0],
  warnaPerasaan: null,
  retryCount: {},
  soundOn: SOUND_ENABLED,
  lang: DEFAULT_LANG,
  dark: false,
  reduceMotion: false,
  fontLevel: 0
};

/* ---------- DATA SOAL (PERSIS dari modul K8P15) ---------- */
const DATA_SOAL = {
  kartuMasalah: [
    { id: "gawai",    ikon: "📱", judul: "Gawai: Istirahat Sambil Menunduk",     cerita: "Banyak murid main HP saat istirahat, 8 murid terlambat masuk kelas pekan lalu." },
    { id: "sampah",   ikon: "🗑️", judul: "Sampah: Botol & Bungkus Jajanan",     cerita: "Tempat sampah masih campur, bank sampah sekolah belum aktif." },
    { id: "antrean",  ikon: "⏱️", judul: "Antrean: Istirahat Habis untuk Antre", cerita: "360 murid, hanya 3 penjual kantin, istirahat bersamaan 20 menit." },
    { id: "literasi", ikon: "📨", judul: "Literasi Digital: Teruskan ke 10 Grup!", cerita: "Pesan berantai hoaks & penipuan kuota gratis menyebar di grup kelas." }
  ],
  dataMisi2: {
    gawai: {
      tabel: [
        ["Bermain gawai", 15],
        ["Jajan di kantin", 8],
        ["Mengobrol / bermain di lapangan", 5],
        ["Ke perpustakaan", 2]
      ],
      totalMurid: 30,
      soal: [
        { kunci: "persenGawai", label: "Berapa persen murid yang bermain gawai saat istirahat? (angka saja, tanpa %)", jawaban: 50, toleransi: 0.5 }
      ],
      catatan: "Survei 30 murid kelas 8 · 8 murid terlambat karena gawai pekan lalu."
    },
    sampah: {
      tabel: [
        ["Kelas 8A", 24], ["Kelas 8B", 18], ["Kelas 8C", 30], ["Kelas 8D", 20]
      ],
      soal: [
        { kunci: "totalBotol", label: "Jumlah seluruh botol plastik (buah)", jawaban: 92, toleransi: 0 },
        { kunci: "persenC",   label: "Persentase botol dari kelas 8C (bulatkan ke bilangan bulat, tanpa %)", jawaban: 33, toleransi: 1 }
      ],
      catatan: "Data sampah kelas pekan lalu (buah)."
    },
    antrean: {
      tabel: [
        ["Senin",12],["Selasa",10],["Rabu",14],["Kamis",9],["Jumat",15]
      ],
      soal: [
        { kunci: "jumlah",   label: "Jumlah waktu antre 5 hari (menit)", jawaban: 60, toleransi: 0 },
        { kunci: "rata",     label: "Rata-rata waktu antre (menit)",     jawaban: 12, toleransi: 0.01 },
        { kunci: "terlama",  label: "Hari dengan antrean terlama",       jawaban: "jumat", toleransi: "teks" }
      ],
      catatan: "Waktu antre kantin 5 hari terakhir (menit)."
    },
    literasi: {
      tabel: [
        ["Pernah meneruskan tanpa cek", 21],
        ["Memeriksa dulu sebelum teruskan", 6],
        ["Tidak pernah menerima", 3]
      ],
      totalMurid: 30,
      soal: [
        { kunci: "persen", label: "Persentase murid yang meneruskan tanpa memeriksa (tanpa %)", jawaban: 70, toleransi: 0.5 }
      ],
      catatan: "Survei 30 murid kelas 8. Ada juga 9 murid menerima pesan penipuan kuota gratis."
    }
  },
  misi3: {
    gawai: {
      pertanyaan: [
        { id: "siapa",  label: "Siapa yang terlibat?" },
        { id: "kapan",  label: "Kapan & di mana terjadi?" },
        { id: "sebab",  label: "Apa penyebabnya?" },
        { id: "dampak", label: "Apa dampaknya?" }
      ],
      kartu: [
        { id: "k1", teks: "Murid, wali kelas, guru BK", cocok: "siapa" },
        { id: "k2", teks: "Saat istirahat, di kelas & halaman", cocok: "kapan" },
        { id: "k3", teks: "Gawai menarik, tidak ada aturan jelas", cocok: "sebab" },
        { id: "k4", teks: "Kurang bergerak, terlambat masuk kelas", cocok: "dampak" }
      ]
    },
    sampah: {
      pertanyaan: [
        { id: "siapa",  label: "Siapa yang terlibat?" },
        { id: "kapan",  label: "Kapan & di mana terjadi?" },
        { id: "sebab",  label: "Apa penyebabnya?" },
        { id: "dampak", label: "Apa dampaknya?" }
      ],
      kartu: [
        { id: "k1", teks: "Murid, petugas kebersihan, OSIS", cocok: "siapa" },
        { id: "k2", teks: "Setiap Jumat, di sudut kelas & halaman", cocok: "kapan" },
        { id: "k3", teks: "Tempat sampah hanya satu jenis, belum ada bank sampah", cocok: "sebab" },
        { id: "k4", teks: "Kelas kotor, lingkungan tidak sehat", cocok: "dampak" }
      ]
    },
    antrean: {
      pertanyaan: [
        { id: "siapa",  label: "Siapa yang terlibat?" },
        { id: "kapan",  label: "Kapan & di mana terjadi?" },
        { id: "sebab",  label: "Apa penyebabnya?" },
        { id: "dampak", label: "Apa dampaknya?" }
      ],
      kartu: [
        { id: "k1", teks: "Murid, 3 penjual kantin, guru piket", cocok: "siapa" },
        { id: "k2", teks: "Saat istirahat 20 menit, di kantin", cocok: "kapan" },
        { id: "k3", teks: "Semua kelas istirahat bersamaan, penjual hanya 3", cocok: "sebab" },
        { id: "k4", teks: "Tidak sempat makan, kembali ke kelas tergesa-gesa", cocok: "dampak" }
      ]
    },
    literasi: {
      pertanyaan: [
        { id: "siapa",  label: "Siapa yang terlibat?" },
        { id: "kapan",  label: "Kapan & di mana terjadi?" },
        { id: "sebab",  label: "Apa penyebabnya?" },
        { id: "dampak", label: "Apa dampaknya?" }
      ],
      kartu: [
        { id: "k1", teks: "Murid, wali kelas, admin grup WhatsApp", cocok: "siapa" },
        { id: "k2", teks: "Kapan saja, di grup WhatsApp kelas", cocok: "kapan" },
        { id: "k3", teks: "Tidak dicek sumbernya, langsung diteruskan", cocok: "sebab" },
        { id: "k4", teks: "Bingung, datang ke sekolah padahal libur; data pribadi terancam", cocok: "dampak" }
      ]
    }
  },
  misi4: {
    gawai: {
      tabel: [["Bermain gawai",15],["Jajan",8],["Mengobrol",5],["Perpustakaan",2]],
      opsi: [
        { id: "a", teks: "Paling banyak murid bermain gawai saat istirahat (50%)", benar: true },
        { id: "b", teks: "Warna seragam memengaruhi kebiasaan bermain gawai", benar: false },
        { id: "c", teks: "Semua kegiatan sama banyaknya", benar: false }
      ]
    },
    sampah: {
      tabel: [["8A",24],["8B",18],["8C",30],["8D",20]],
      opsi: [
        { id: "a", teks: "Kelas 8C menyumbang botol paling banyak", benar: true },
        { id: "b", teks: "Semua kelas menyumbang jumlah yang sama", benar: false },
        { id: "c", teks: "Kelas 8B paling banyak menyumbang", benar: false }
      ]
    },
    antrean: {
      tabel: [["Senin",12],["Selasa",10],["Rabu",14],["Kamis",9],["Jumat",15]],
      opsi: [
        { id: "a", teks: "Antrean paling lama terjadi hari Jumat, disusul Rabu", benar: true },
        { id: "b", teks: "Warna seragam memengaruhi antrean", benar: false },
        { id: "c", teks: "Semua hari antreannya sama", benar: false }
      ]
    },
    literasi: {
      tabel: [["Meneruskan tanpa cek",21],["Memeriksa dulu",6],["Tidak pernah menerima",3]],
      opsi: [
        { id: "a", teks: "Mayoritas murid (70%) meneruskan pesan tanpa memeriksa", benar: true },
        { id: "b", teks: "Semua murid sudah memeriksa dulu", benar: false },
        { id: "c", teks: "Tidak ada murid yang menerima pesan berantai", benar: false }
      ]
    }
  },
  misi5: {
    gawai: {
      penting: ["Jumlah murid yang main gawai", "Jam istirahat", "Aturan kelas"],
      tidak:   ["Warna seragam", "Merek HP", "Warna tas"]
    },
    sampah: {
      penting: ["Jumlah botol per kelas", "Jenis sampah (plastik/organik)", "Jadwal piket"],
      tidak:   ["Warna tempat sampah", "Merek sepatu", "Warna bungkus"]
    },
    antrean: {
      penting: ["Jumlah murid", "Jumlah penjaga koperasi", "Jenis barang yang dibeli"],
      tidak:   ["Warna seragam", "Merek pulpen", "Warna tas"]
    },
    literasi: {
      penting: ["Sumber pesan", "Isi pesan", "Jumlah murid yang meneruskan"],
      tidak:   ["Warna HP", "Warna wallpaper", "Merek HP"]
    }
  },
  misi6: {
    // Puzzle algoritma untuk semua isu (urut benar)
    gawai: {
      langkah: [
        { id: "1", teks: "Mulai", jenis: "Mulai" },
        { id: "2", teks: "Murid menyimpan HP di kotak kelas saat istirahat", jenis: "Proses" },
        { id: "3", teks: "Murid memilih kegiatan: olahraga, baca, atau mengobrol", jenis: "Proses" },
        { id: "4", teks: "JIKA 10 menit berlalu, MAKA ambil HP kembali", jenis: "Pilihan" },
        { id: "5", teks: "JIKA TIDAK, MAKA lanjut kegiatan", jenis: "Pilihan" },
        { id: "6", teks: "Selesai", jenis: "Selesai" }
      ]
    },
    sampah: {
      langkah: [
        { id: "1", teks: "Mulai", jenis: "Mulai" },
        { id: "2", teks: "Ambil satu sampah", jenis: "Proses" },
        { id: "3", teks: "JIKA botol plastik, MAKA masukkan ke tempat anorganik", jenis: "Pilihan" },
        { id: "4", teks: "JIKA sisa makanan, MAKA masukkan ke tempat organik", jenis: "Pilihan" },
        { id: "5", teks: "JIKA TIDAK keduanya, MAKA ke tempat residu", jenis: "Pilihan" },
        { id: "6", teks: "Selesai", jenis: "Selesai" }
      ]
    },
    antrean: {
      langkah: [
        { id: "1", teks: "Mulai", jenis: "Mulai" },
        { id: "2", teks: "Murid mengisi kertas pesanan & memasukkannya ke kotak", jenis: "Proses" },
        { id: "3", teks: "Petugas menyiapkan barang per kelas", jenis: "Proses" },
        { id: "4", teks: "Ketua kelas mengambil kotak pesanan saat istirahat", jenis: "Proses" },
        { id: "5", teks: "JIKA barang lengkap, MAKA ketua kelas membagikannya ke teman", jenis: "Pilihan" },
        { id: "6", teks: "JIKA TIDAK lengkap, MAKA petugas mencatat barang kurang & menyiapkan besok", jenis: "Pilihan" },
        { id: "7", teks: "Selesai", jenis: "Selesai" }
      ]
    },
    literasi: {
      langkah: [
        { id: "1", teks: "Mulai", jenis: "Mulai" },
        { id: "2", teks: "Baca pesan yang masuk", jenis: "Proses" },
        { id: "3", teks: "Cek sumber pesan", jenis: "Proses" },
        { id: "4", teks: "JIKA sumber resmi, MAKA bagikan", jenis: "Pilihan" },
        { id: "5", teks: "JIKA TIDAK, MAKA jangan bagikan & tanya orang dewasa", jenis: "Pilihan" },
        { id: "6", teks: "Selesai", jenis: "Selesai" }
      ]
    }
  },
  misi7: [
    {
      id: "q1",
      soal: "Sebuah kelompok ingin menempel di mading daftar nama murid yang paling sering bermain HP saat istirahat. Apakah ini baik?",
      opsi: [
        { id: "a", teks: "Baik, agar mereka malu dan berhenti", benar: false },
        { id: "b", teks: "Tidak baik — melanggar privasi dan bisa memicu perundungan", benar: true },
        { id: "c", teks: "Boleh, asal hanya nama panggilan", benar: false }
      ],
      penjelasan: "Data yang mempermalukan orang lain melanggar privasi. Lebih baik tampilkan data agregat: “50% murid memakai HP saat istirahat”."
    },
    {
      id: "q2",
      soal: "Solusi 'Jadwal Istirahat Sehat' hanya bisa diikuti murid yang punya HP. Apakah ini adil?",
      opsi: [
        { id: "a", teks: "Adil, karena semua murid sekarang punya HP", benar: false },
        { id: "b", teks: "Tidak adil — solusi harus bisa diikuti semua murid", benar: true },
        { id: "c", teks: "Adil, yang tidak punya HP tidak perlu ikut", benar: false }
      ],
      penjelasan: "Solusi yang baik harus inklusif. Murid yang tidak punya HP tetap harus bisa berpartisipasi."
    },
    {
      id: "q3",
      soal: "Data diubah agar terlihat lebih bagus untuk laporan ke kepala sekolah. Apakah ini boleh?",
      opsi: [
        { id: "a", teks: "Boleh, agar sekolah terlihat baik", benar: false },
        { id: "b", teks: "Boleh, asal tidak ada yang tahu", benar: false },
        { id: "c", teks: "Tidak jujur — data harus ditulis apa adanya", benar: true }
      ],
      penjelasan: "Kejujuran data adalah kunci. Data yang diubah membuat solusi tidak tepat sasaran."
    }
  ],
  glosarium: [
    ["Decomposition", "Dekomposisi (memecah masalah)"],
    ["Pattern Recognition", "Pengenalan pola"],
    ["Abstraction", "Abstraksi (memilih yang penting)"],
    ["Algorithm", "Algoritma (langkah berurutan)"],
    ["Computational Thinking", "Berpikir Komputasional"],
    ["Flowchart", "Diagram alur"],
    ["Sequence", "Urutan"],
    ["Conditional / IF–THEN", "Pilihan / JIKA–MAKA"],
    ["Looping", "Pengulangan"],
    ["Spreadsheet", "Lembar kerja elektronik"],
    ["Pitch", "Presentasi singkat"],
    ["Worked Example", "Contoh terselesaikan"],
    ["Scaffolding", "Bantuan bertahap"]
  ]
};

/* ---------- DOM SHORTCUTS ---------- */
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ============================================================
   FUNGSI UTILITAS
   ============================================================ */

/* Simpan progres ke localStorage */
function saveProgress() {
  try {
    localStorage.setItem("sekolahSolver_progress", JSON.stringify({
      kelompok: state.kelompok,
      anggota: state.anggota,
      peran: state.peran,
      misiIndex: state.misiIndex,
      selesai: state.selesai,
      jawaban: state.jawaban,
      skorMisi: state.skorMisi,
      warnaPerasaan: state.warnaPerasaan,
      soundOn: state.soundOn,
      dark: state.dark,
      reduceMotion: state.reduceMotion,
      fontLevel: state.fontLevel,
      lang: state.lang
    }));
  } catch (e) { /* localStorage mungkin diblokir */ }
}

/* Muat progres dari localStorage */
function loadProgress() {
  try {
    const raw = localStorage.getItem("sekolahSolver_progress");
    if (!raw) return false;
    const d = JSON.parse(raw);
    Object.assign(state, d);
    return true;
  } catch (e) { return false; }
}

/* Hapus progres */
function resetProgress() {
  localStorage.removeItem("sekolahSolver_progress");
}

/* Tampilkan toast notifikasi */
function showToast(msg, tipe = "info") {
  const el = document.createElement("div");
  el.className = "toast " + tipe;
  el.textContent = msg;
  $("#toastWrap").appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity 0.3s"; }, 2400);
  setTimeout(() => el.remove(), 2800);
}

/* Suara via Web Audio API (oscillator) */
let audioCtx = null;
function playSound(tipe) {
  if (!state.soundOn) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    if (tipe === "benar") {
      o.frequency.setValueAtTime(880, audioCtx.currentTime);
      o.frequency.setValueAtTime(1320, audioCtx.currentTime + 0.1);
      g.gain.setValueAtTime(0.15, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      o.start(); o.stop(audioCtx.currentTime + 0.35);
    } else if (tipe === "salah") {
      o.type = "square";
      o.frequency.setValueAtTime(180, audioCtx.currentTime);
      g.gain.setValueAtTime(0.12, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      o.start(); o.stop(audioCtx.currentTime + 0.3);
    } else if (tipe === "klik") {
      o.frequency.setValueAtTime(520, audioCtx.currentTime);
      g.gain.setValueAtTime(0.08, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      o.start(); o.stop(audioCtx.currentTime + 0.08);
    } else if (tipe === "menang") {
      const notes = [523, 659, 784, 1046];
      notes.forEach((n, i) => {
        const oo = audioCtx.createOscillator();
        const gg = audioCtx.createGain();
        oo.connect(gg); gg.connect(audioCtx.destination);
        oo.frequency.setValueAtTime(n, audioCtx.currentTime + i * 0.1);
        gg.gain.setValueAtTime(0.14, audioCtx.currentTime + i * 0.1);
        gg.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 0.25);
        oo.start(audioCtx.currentTime + i * 0.1);
        oo.stop(audioCtx.currentTime + i * 0.1 + 0.25);
      });
    }
  } catch (e) { /* audio opsional */ }
}

/* Confetti canvas (tulis sendiri, tanpa library) */
function runConfetti(duration = 1800) {
  if (state.reduceMotion) return;
  const canvas = $("#confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ["#1E5B94", "#39B54A", "#F5C518", "#D9534F", "#ffffff"];
  const particles = [];
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2
    });
  }
  const start = performance.now();
  function frame(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (t - start < duration) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(frame);
}

/* Buka modal */
function openModal(title, html) {
  $("#modalTitle").textContent = title;
  $("#modalBody").innerHTML = html;
  $("#modal").hidden = false;
}
function closeModal() { $("#modal").hidden = true; }

/* Render mini-map progress bintang */
function renderProgress() {
  const wrap = $("#progressStars");
  wrap.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const d = document.createElement("div");
    d.className = "star";
    if (state.selesai[i]) d.classList.add("done");
    if (i === state.misiIndex && !state.selesai[i]) d.classList.add("active");
    d.textContent = i + 1;
    wrap.appendChild(d);
  }
  $("#progressWrap").hidden = !state.kelompok;
}

/* Format istilah dwibahasa */
function istilah(en, id) {
  return `<span class="en-term">${en}</span> <span class="id-term padanan">(${id})</span>`;
}

/* ============================================================
   RENDER: START
   ============================================================ */
function renderStart() {
  // Buat 6 input anggota
  const wrap = $("#anggotaList");
  wrap.innerHTML = "";
  for (let i = 1; i <= 6; i++) {
    const inp = document.createElement("input");
    inp.type = "text";
    inp.maxLength = 25;
    inp.placeholder = `Anggota ${i}${i > 5 ? " (opsional)" : ""}`;
    inp.id = "inputAnggota" + i;
    wrap.appendChild(inp);
  }
  // Isi form jika ada progres tersimpan
  if (state.kelompok) {
    $("#inputKelompok").value = state.kelompok;
    state.anggota.forEach((a, i) => {
      const el = $("#inputAnggota" + (i + 1));
      if (el) el.value = a;
    });
    $("#inputPeran").value = state.peran;
    $("#btnContinue").hidden = false;
  } else {
    $("#btnContinue").hidden = true;
  }
}

/* ============================================================
   MISI HANDLER
   ============================================================ */
const MISI_TITLES = [
  "Misi 1 — Pilih Masalah",
  "Misi 2 — Olah Data",
  "Misi 3 — Pecah Masalah (Decomposition)",
  "Misi 4 — Cari Pola (Pattern Recognition)",
  "Misi 5 — Pilih yang Penting (Abstraction)",
  "Misi 6 — Susun Algoritma (Algorithm)",
  "Misi 7 — Etika & Dampak Sosial"
];
const MISI_DESCS = [
  "Pilih 1 masalah sekolah yang paling layak dikerjakan, berdasarkan skor kriteria.",
  "Hitung jumlah, rata-rata, atau persentase dari data yang tersedia.",
  "Pecah masalah menjadi 4 bagian kecil: siapa, kapan, penyebab, dampak.",
  "Temukan pola paling kuat dari data yang sudah kamu olah.",
  "Pilah informasi: mana yang penting dipakai, mana yang dibuang.",
  "Susun langkah solusi berurutan, wajib ada percabangan JIKA–MAKA.",
  "Renungkan: apakah solusimu adil, jujur, dan menjaga privasi?"
];

function gotoMisi(idx) {
  state.misiIndex = idx;
  $("#screen-start").classList.remove("active");
  $("#screen-result").classList.remove("active");
  $("#screen-misi").classList.add("active");
  $("#misiBadge").textContent = `Misi ${idx + 1} / 7`;
  $("#misiTitle").textContent = MISI_TITLES[idx];
  $("#misiDesc").textContent = MISI_DESCS[idx];
  renderProgress();
  renderMisi(idx);
  window.scrollTo({ top: 0, behavior: state.reduceMotion ? "auto" : "smooth" });
  $("#btnCheck").hidden = false;
  $("#btnNext").hidden = true;
  saveProgress();
}

/* ---------- RENDER MISI 1 ---------- */
function renderMisi1() {
  const body = $("#misiBody");
  let html = `<p>Beri skor <strong>1 (rendah)</strong> sampai <strong>3 (tinggi)</strong> untuk tiap kriteria. Kartu dengan total skor tertinggi akan menjadi <em>Masalah Terpilih</em>.</p>`;
  html += `<div class="kartu-grid">`;
  DATA_SOAL.kartuMasalah.forEach(k => {
    const skor = state.jawaban.misi1.skor[k.id] || [1,1,1];
    const total = skor.reduce((a,b) => a+b, 0);
    html += `
      <div class="kartu-masalah" data-id="${k.id}">
        <div class="km-ikon">${k.ikon}</div>
        <h4>${k.judul}</h4>
        <p>${k.cerita}</p>
        <div class="kriteria-row">
          <label>Seberapa penting?</label>
          <select data-id="${k.id}" data-k="0">
            <option value="1" ${skor[0]==1?"selected":""}>1</option>
            <option value="2" ${skor[0]==2?"selected":""}>2</option>
            <option value="3" ${skor[0]==3?"selected":""}>3</option>
          </select>
        </div>
        <div class="kriteria-row">
          <label>Ada datanya?</label>
          <select data-id="${k.id}" data-k="1">
            <option value="1" ${skor[1]==1?"selected":""}>1</option>
            <option value="2" ${skor[1]==2?"selected":""}>2</option>
            <option value="3" ${skor[1]==3?"selected":""}>3</option>
          </select>
        </div>
        <div class="kriteria-row">
          <label>Bisa kami selesaikan?</label>
          <select data-id="${k.id}" data-k="2">
            <option value="1" ${skor[2]==1?"selected":""}>1</option>
            <option value="2" ${skor[2]==2?"selected":""}>2</option>
            <option value="3" ${skor[2]==3?"selected":""}>3</option>
          </select>
        </div>
        <div class="total-skor">Total: <span class="tv">${total}</span></div>
      </div>`;
  });
  html += `</div>`;

  // Mini quiz
  html += `
    <div class="card mt-2">
      <h3>❓ Mini-Quiz</h3>
      <p>Kenapa kita memakai skor kriteria, bukan asal memilih masalah?</p>
      <div class="opsi-list" id="quiz1">
        <label class="opsi"><input type="radio" name="q1" value="a"><span class="opsi-txt">Supaya cepat selesai</span></label>
        <label class="opsi"><input type="radio" name="q1" value="b"><span class="opsi-txt">Supaya pilihan kita berbasis bukti & pertimbangan yang jelas</span></label>
        <label class="opsi"><input type="radio" name="q1" value="c"><span class="opsi-txt">Supaya menang lomba</span></label>
      </div>
    </div>`;
  body.innerHTML = html;

  // Event: update total saat select berubah
  body.querySelectorAll("select").forEach(sel => {
    sel.addEventListener("change", () => {
      const id = sel.dataset.id, k = +sel.dataset.k;
      if (!state.jawaban.misi1.skor[id]) state.jawaban.misi1.skor[id] = [1,1,1];
      state.jawaban.misi1.skor[id][k] = +sel.value;
      // update total di kartu
      const card = body.querySelector(`.kartu-masalah[data-id="${id}"]`);
      const total = state.jawaban.misi1.skor[id].reduce((a,b)=>a+b,0);
      card.querySelector(".tv").textContent = total;
      // highlight kartu terbaik
      let maxTotal = -1, maxId = null;
      DATA_SOAL.kartuMasalah.forEach(kk => {
        const s = state.jawaban.misi1.skor[kk.id] || [1,1,1];
        const t = s.reduce((a,b)=>a+b,0);
        if (t > maxTotal) { maxTotal = t; maxId = kk.id; }
      });
      body.querySelectorAll(".kartu-masalah").forEach(c => c.classList.toggle("terbaik", c.dataset.id === maxId));
      playSound("klik");
    });
  });

  // Trigger highlight pertama
  body.querySelectorAll("select")[0]?.dispatchEvent(new Event("change"));
}

/* ---------- RENDER MISI 2 ---------- */
function renderMisi2() {
  const isu = state.jawaban.misi1.pilihan || "antrean";
  const data = DATA_SOAL.dataMisi2[isu];
  const body = $("#misiBody");
  let html = `<p>Kamu memilih isu <strong>${isu.toUpperCase()}</strong>. Olah datanya dengan teliti!</p>`;
  html += `<div class="card"><h3>📊 Tabel Data</h3>`;
  html += `<table class="data-table"><thead><tr><th>Keterangan</th><th>Nilai</th></tr></thead><tbody>`;
  data.tabel.forEach(([a,b]) => { html += `<tr><td>${a}</td><td><strong>${b}</strong></td></tr>`; });
  html += `</tbody></table>`;
  html += `<p><em>${data.catatan}</em></p></div>`;

  html += `<div class="card"><h3>🧮 Hitung & Isi</h3>`;
  data.soal.forEach((s, i) => {
    const saved = state.jawaban.misi2.hasil[s.kunci];
    html += `<div class="input-row">
      <label>${i+1}. ${s.label}</label>
      <input type="text" data-kunci="${s.kunci}" value="${saved !== undefined ? saved : ""}" placeholder="Jawaban">
    </div>`;
  });
  html += `</div>`;
  body.innerHTML = html;

  body.querySelectorAll("input[data-kunci]").forEach(inp => {
    inp.addEventListener("input", () => {
      state.jawaban.misi2.hasil[inp.dataset.kunci] = inp.value;
    });
  });
}

/* ---------- RENDER MISI 3 ---------- */
function renderMisi3() {
  const isu = state.jawaban.misi1.pilihan || "antrean";
  const data = DATA_SOAL.misi3[isu];
  const body = $("#misiBody");

  let html = `<p>Seret (atau klik) kartu jawaban ke kotak yang tepat. Ini latihan <strong>Decomposition (Dekomposisi)</strong> — memecah masalah menjadi bagian kecil.</p>`;
  html += `<div class="card"><h3>🧩 Kartu Jawaban</h3><div class="dnd-pool" id="pool">`;
  // Acak urutan kartu untuk tantangan
  const kartuAcak = [...data.kartu].sort(() => Math.random() - 0.5);
  kartuAcak.forEach(k => {
    html += `<div class="kartu-item" data-id="${k.id}" data-cocok="${k.cocok}" draggable="true">${k.teks}</div>`;
  });
  html += `</div></div>`;

  html += `<div class="drop-zones two" id="zones">`;
  data.pertanyaan.forEach(q => {
    html += `<div class="drop-zone" data-qid="${q.id}"><h4>${q.label}</h4></div>`;
  });
  html += `</div>`;
  body.innerHTML = html;

  // Isi ulang dari state jika ada
  Object.entries(state.jawaban.misi3.penempatan).forEach(([kid, qid]) => {
    const el = body.querySelector(`.kartu-item[data-id="${kid}"]`);
    const zone = body.querySelector(`.drop-zone[data-qid="${qid}"]`);
    if (el && zone) zone.appendChild(el);
  });

  setupDnD();
}

/* Setup drag-drop + fallback klik */
function setupDnD() {
  const pool = $("#pool");
  const zones = $$(".drop-zone");
  let selected = null;

  // Drag
  $$(".kartu-item").forEach(item => {
    item.addEventListener("dragstart", e => {
      item.classList.add("dragging");
      e.dataTransfer.setData("text/plain", item.dataset.id);
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
    // Klik fallback
    item.addEventListener("click", () => {
      if (item.classList.contains("selected")) {
        item.classList.remove("selected");
        selected = null;
      } else {
        $$(".kartu-item").forEach(i => i.classList.remove("selected"));
        item.classList.add("selected");
        selected = item;
        playSound("klik");
      }
    });
  });

  // Drop zones
  zones.forEach(z => {
    z.addEventListener("dragover", e => { e.preventDefault(); z.classList.add("over"); });
    z.addEventListener("dragleave", () => z.classList.remove("over"));
    z.addEventListener("drop", e => {
      e.preventDefault(); z.classList.remove("over");
      const id = e.dataTransfer.getData("text/plain");
      const item = document.querySelector(`.kartu-item[data-id="${id}"]`);
      if (item) {
        z.appendChild(item);
        saveMisi3();
      }
    });
    // Klik fallback
    z.addEventListener("click", () => {
      if (selected) {
        z.appendChild(selected);
        selected.classList.remove("selected");
        selected = null;
        saveMisi3();
      }
    });
  });

  // Kembalikan ke pool bila drop ke pool
  pool.addEventListener("dragover", e => e.preventDefault());
  pool.addEventListener("drop", e => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const item = document.querySelector(`.kartu-item[data-id="${id}"]`);
    if (item) { pool.appendChild(item); saveMisi3(); }
  });
  pool.addEventListener("click", () => {
    if (selected) {
      pool.appendChild(selected);
      selected.classList.remove("selected");
      selected = null;
      saveMisi3();
    }
  });
}

function saveMisi3() {
  const map = {};
  $$(".drop-zone").forEach(z => {
    z.querySelectorAll(".kartu-item").forEach(item => {
      map[item.dataset.id] = z.dataset.qid;
    });
  });
  state.jawaban.misi3.penempatan = map;
}

/* ---------- RENDER MISI 4 ---------- */
function renderMisi4() {
  const isu = state.jawaban.misi1.pilihan || "antrean";
  const data = DATA_SOAL.misi4[isu];
  const body = $("#misiBody");
  let html = `<p>Perhatikan tabel. Pilih <strong>satu pola</strong> paling kuat. Ini latihan <strong>Pattern Recognition (Pengenalan Pola)</strong>.</p>`;
  html += `<div class="card"><table class="data-table"><thead><tr><th>Keterangan</th><th>Nilai</th></tr></thead><tbody>`;
  data.tabel.forEach(([a,b]) => { html += `<tr><td>${a}</td><td><strong>${b}</strong></td></tr>`; });
  html += `</tbody></table></div>`;

  html += `<div class="card"><h3>🔍 Pilih Pola</h3><div class="opsi-list" id="opsiMisi4">`;
  data.opsi.forEach(o => {
    const checked = state.jawaban.misi4.pilihan === o.id;
    html += `<label class="opsi ${checked?'selected':''}" data-id="${o.id}">
      <input type="radio" name="pola" value="${o.id}" ${checked?'checked':''}>
      <span class="opsi-txt">${o.teks}</span>
    </label>`;
  });
  html += `</div></div>`;
  body.innerHTML = html;

  body.querySelectorAll('#opsiMisi4 .opsi').forEach(el => {
    el.addEventListener("click", () => {
      body.querySelectorAll('#opsiMisi4 .opsi').forEach(x => x.classList.remove("selected"));
      el.classList.add("selected");
      state.jawaban.misi4.pilihan = el.dataset.id;
      playSound("klik");
    });
  });
}

/* ---------- RENDER MISI 5 ---------- */
function renderMisi5() {
  const isu = state.jawaban.misi1.pilihan || "antrean";
  const data = DATA_SOAL.misi5[isu];
  const body = $("#misiBody");

  // Gabungkan & acak
  const semua = [
    ...data.penting.map(t => ({ teks: t, cocok: "penting" })),
    ...data.tidak.map(t => ({ teks: t, cocok: "tidak" }))
  ].sort(() => Math.random() - 0.5);

  let html = `<p>Pilah informasi: mana yang <strong>PENTING (dipakai)</strong> dan mana yang <strong>TIDAK PENTING (dibuang)</strong>. Ini latihan <strong>Abstraction (Abstraksi)</strong>.</p>`;
  html += `<div class="card"><h3>🧠 Kartu Informasi</h3><div class="dnd-pool" id="pool5">`;
  semua.forEach((k, i) => {
    html += `<div class="kartu-item" data-teks="${k.teks}" data-cocok="${k.cocok}" draggable="true">${k.teks}</div>`;
  });
  html += `</div></div>`;

  html += `<div class="drop-zones two" id="zones5">
    <div class="drop-zone" data-tipe="penting"><h4>✅ PENTING (dipakai)</h4></div>
    <div class="drop-zone" data-tipe="tidak"><h4>❌ TIDAK PENTING (dibuang)</h4></div>
  </div>`;
  body.innerHTML = html;

  // Restore
  Object.entries(state.jawaban.misi5.penempatan).forEach(([teks, tipe]) => {
    const el = body.querySelector(`.kartu-item[data-teks="${CSS.escape(teks)}"]`);
    const zone = body.querySelector(`.drop-zone[data-tipe="${tipe}"]`);
    if (el && zone) zone.appendChild(el);
  });

  setupDnD5();
}

function setupDnD5() {
  const pool = $("#pool5");
  const zones = $$("#zones5 .drop-zone");
  let selected = null;
  $$("#pool5 .kartu-item, #zones5 .kartu-item").forEach(item => {
    item.setAttribute("draggable", "true");
    item.addEventListener("dragstart", e => {
      item.classList.add("dragging");
      e.dataTransfer.setData("text/plain", item.dataset.teks);
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
    item.addEventListener("click", () => {
      if (item.classList.contains("selected")) { item.classList.remove("selected"); selected = null; }
      else {
        $$(".kartu-item").forEach(i => i.classList.remove("selected"));
        item.classList.add("selected"); selected = item; playSound("klik");
      }
    });
  });
  zones.forEach(z => {
    z.addEventListener("dragover", e => { e.preventDefault(); z.classList.add("over"); });
    z.addEventListener("dragleave", () => z.classList.remove("over"));
    z.addEventListener("drop", e => {
      e.preventDefault(); z.classList.remove("over");
      const teks = e.dataTransfer.getData("text/plain");
      const item = document.querySelector(`.kartu-item[data-teks="${CSS.escape(teks)}"]`);
      if (item) { z.appendChild(item); saveMisi5(); }
    });
    z.addEventListener("click", () => {
      if (selected) { z.appendChild(selected); selected.classList.remove("selected"); selected = null; saveMisi5(); }
    });
  });
  pool.addEventListener("dragover", e => e.preventDefault());
  pool.addEventListener("drop", e => {
    e.preventDefault();
    const teks = e.dataTransfer.getData("text/plain");
    const item = document.querySelector(`.kartu-item[data-teks="${CSS.escape(teks)}"]`);
    if (item) { pool.appendChild(item); saveMisi5(); }
  });
  pool.addEventListener("click", () => {
    if (selected) { pool.appendChild(selected); selected.classList.remove("selected"); selected = null; saveMisi5(); }
  });
}

function saveMisi5() {
  const map = {};
  $$("#zones5 .drop-zone").forEach(z => {
    z.querySelectorAll(".kartu-item").forEach(item => {
      map[item.dataset.teks] = z.dataset.tipe;
    });
  });
  state.jawaban.misi5.penempatan = map;
}

/* ---------- RENDER MISI 6 ---------- */
function renderMisi6() {
  const isu = state.jawaban.misi1.pilihan || "antrean";
  const data = DATA_SOAL.misi6[isu];
  const body = $("#misiBody");

  // Simpan urutan yang benar
  const benar = data.langkah.map(l => l.id);

  // Urutan tampil (acak kecuali Mulai/Selesai kalau kosong)
  if (!state.jawaban.misi6.urutan || state.jawaban.misi6.urutan.length === 0) {
    const acak = [...data.langkah].sort(() => Math.random() - 0.5);
    state.jawaban.misi6.urutan = acak.map(l => l.id);
  }

  let html = `<p>Susun langkah solusi agar berurutan. Ada <strong>1 atau lebih pilihan JIKA–MAKA</strong> di dalamnya. Latihan <strong>Algorithm (Algoritma)</strong>.</p>`;
  html += `<div class="card"><h3>⚙️ Susun Langkah</h3><ul class="algo-list" id="algoList">`;
  state.jawaban.misi6.urutan.forEach((id, idx) => {
    const l = data.langkah.find(x => x.id === id);
    if (!l) return;
    const cls = l.jenis === "Pilihan" ? "pilihan" : "";
    html += `<li class="algo-item ${cls}" draggable="true" data-id="${id}">
      <span class="num">${idx + 1}</span>
      <span>${l.teks}</span>
    </li>`;
  });
  html += `</ul>`;
  html += `<p class="mt-2"><strong>Klik dua langkah untuk menukar posisinya.</strong></p>`;
  html += `</div>`;
  body.innerHTML = html;

  let selectedId = null;
  body.querySelectorAll(".algo-item").forEach(item => {
    item.addEventListener("click", () => {
      if (selectedId === null) {
        selectedId = item.dataset.id;
        item.style.outline = "3px solid #F5C518";
      } else {
        const a = state.jawaban.misi6.urutan.indexOf(selectedId);
        const b = state.jawaban.misi6.urutan.indexOf(item.dataset.id);
        [state.jawaban.misi6.urutan[a], state.jawaban.misi6.urutan[b]] =
          [state.jawaban.misi6.urutan[b], state.jawaban.misi6.urutan[a]];
        selectedId = null;
        renderMisi6();
      }
      playSound("klik");
    });
  });
}

/* ---------- RENDER MISI 7 ---------- */
function renderMisi7() {
  const body = $("#misiBody");
  let html = `<p>Jawab pertanyaan berikut dengan jujur. Ini tentang <strong>etika, keadilan, dan privasi</strong>.</p>`;
  DATA_SOAL.misi7.forEach((q, i) => {
    html += `<div class="card"><h3>Soal ${i+1}</h3><p>${q.soal}</p><div class="opsi-list">`;
    q.opsi.forEach(o => {
      const checked = state.jawaban.misi7.jawaban[q.id] === o.id;
      html += `<label class="opsi ${checked?'selected':''}" data-qid="${q.id}" data-oid="${o.id}">
        <input type="radio" name="${q.id}" value="${o.id}" ${checked?'checked':''}>
        <span class="opsi-txt">${o.teks}</span>
      </label>`;
    });
    html += `</div><p class="mt-1" id="penj_${q.id}" style="display:none; padding:10px; background:rgba(57,181,74,0.1); border-radius:8px;"></p></div>`;
  });
  body.innerHTML = html;

  body.querySelectorAll(".opsi").forEach(el => {
    el.addEventListener("click", () => {
      const qid = el.dataset.qid, oid = el.dataset.oid;
      state.jawaban.misi7.jawaban[qid] = oid;
      body.querySelectorAll(`.opsi[data-qid="${qid}"]`).forEach(x => x.classList.remove("selected"));
      el.classList.add("selected");
      playSound("klik");
    });
  });
}

/* ---------- RENDER MISI (router) ---------- */
function renderMisi(idx) {
  const fn = [renderMisi1, renderMisi2, renderMisi3, renderMisi4, renderMisi5, renderMisi6, renderMisi7][idx];
  if (fn) fn();
}

/* ============================================================
   CEK JAWABAN
   ============================================================ */
function cekJawaban() {
  const idx = state.misiIndex;
  const checkers = [cekMisi1, cekMisi2, cekMisi3, cekMisi4, cekMisi5, cekMisi6, cekMisi7];
  const hasil = checkers[idx]();
  if (hasil.benar) {
    playSound("benar");
    showToast("🎉 " + (hasil.pesan || "Benar! Hebat!"), "success");
    state.selesai[idx] = true;
    state.skorMisi[idx] = hasil.skor || 100;
    runConfetti();
    $("#btnCheck").hidden = true;
    if (idx < 6) {
      $("#btnNext").hidden = false;
    } else {
      // Misi terakhir → ke hasil
      setTimeout(() => gotoResult(), 900);
    }
    renderProgress();
    saveProgress();
  } else {
    playSound("salah");
    state.retryCount[idx] = (state.retryCount[idx] || 0) + 1;
    if (state.retryCount[idx] > MAX_RETRY) {
      showToast("💡 " + (hasil.pesan || "Belum tepat. Coba lagi ya!"), "error");
    } else {
      showToast("💡 " + (hasil.pesan || "Belum tepat. Coba lagi ya!"), "error");
    }
  }
}

function cekMisi1() {
  // Cek quiz
  const q1 = document.querySelector('input[name="q1"]:checked');
  if (!q1) return { benar: false, pesan: "Jawab mini-quiz dulu ya!" };
  if (q1.value !== "b") return { benar: false, pesan: "Mini-quiz belum tepat. Pikirkan: kenapa kita butuh pertimbangan yang jelas?" };
  // Tentukan masalah terbaik
  let maxTotal = -1, maxId = null;
  DATA_SOAL.kartuMasalah.forEach(k => {
    const s = state.jawaban.misi1.skor[k.id] || [1,1,1];
    const t = s.reduce((a,b)=>a+b,0);
    if (t > maxTotal) { maxTotal = t; maxId = k.id; }
  });
  state.jawaban.misi1.pilihan = maxId;
  state.jawaban.misi1.quizBenar = true;
  return { benar: true, pesan: "Pilihanmu berbasis bukti! Masalah terpilih: " + maxId.toUpperCase() };
}

function cekMisi2() {
  const isu = state.jawaban.misi1.pilihan;
  const data = DATA_SOAL.dataMisi2[isu];
  let semuaBenar = true;
  const rincian = [];
  for (const s of data.soal) {
    const jawab = String(state.jawaban.misi2.hasil[s.kunci] || "").trim().toLowerCase();
    if (s.toleransi === "teks") {
      if (jawab !== String(s.jawaban).toLowerCase()) semuaBenar = false;
      else rincian.push(s.kunci + ": benar");
    } else {
      const num = parseFloat(jawab.replace(",", "."));
      if (isNaN(num) || Math.abs(num - s.jawaban) > s.toleransi) semuaBenar = false;
      else rincian.push(s.kunci + ": benar");
    }
  }
  return {
    benar: semuaBenar,
    pesan: semuaBenar ? "Data berhasil diolah dengan tepat!" : "Masih ada jawaban yang belum tepat. Periksa lagi hitunganmu."
  };
}

function cekMisi3() {
  const isu = state.jawaban.misi1.pilihan;
  const data = DATA_SOAL.misi3[isu];
  let benar = 0, total = data.kartu.length;
  data.kartu.forEach(k => {
    if (state.jawaban.misi3.penempatan[k.id] === k.cocok) benar++;
  });
  // Tandai zone
  $$(".drop-zone").forEach(z => {
    z.classList.remove("correct", "wrong");
    const qid = z.dataset.qid;
    const items = z.querySelectorAll(".kartu-item");
    let ok = 0, salah = 0;
    items.forEach(it => {
      const kartu = data.kartu.find(x => x.id === it.dataset.id);
      if (kartu && kartu.cocok === qid) ok++;
      else salah++;
    });
    if (items.length && salah === 0) z.classList.add("correct");
    else if (salah > 0) z.classList.add("wrong");
  });
  return {
    benar: benar === total,
    pesan: benar === total ? "Masalah berhasil dipecah dengan tepat!" : `Baru ${benar} dari ${total} kartu yang tepat. Periksa lagi!`,
    skor: Math.round((benar/total) * 100)
  };
}

function cekMisi4() {
  const isu = state.jawaban.misi1.pilihan;
  const data = DATA_SOAL.misi4[isu];
  const o = data.opsi.find(x => x.id === state.jawaban.misi4.pilihan);
  if (!o) return { benar: false, pesan: "Pilih salah satu pola dulu." };
  // Highlight
  $$("#opsiMisi4 .opsi").forEach(el => {
    const oo = data.opsi.find(x => x.id === el.dataset.id);
    el.classList.remove("correct", "wrong");
    if (oo.benar) el.classList.add("correct");
    else if (el.dataset.id === state.jawaban.misi4.pilihan) el.classList.add("wrong");
  });
  return { benar: o.benar, pesan: o.benar ? "Pola berhasil kamu temukan!" : "Belum tepat. Lihat lagi data yang paling menonjol." };
}

function cekMisi5() {
  const isu = state.jawaban.misi1.pilihan;
  const data = DATA_SOAL.misi5[isu];
  let benar = 0, total = data.penting.length + data.tidak.length;
  $$("#zones5 .drop-zone").forEach(z => {
    z.classList.remove("correct", "wrong");
    const tipe = z.dataset.tipe;
    let ok = 0, salah = 0;
    z.querySelectorAll(".kartu-item").forEach(it => {
      if (it.dataset.cocok === tipe) { ok++; benar++; }
      else salah++;
    });
    if (ok > 0 && salah === 0) z.classList.add("correct");
    else if (salah > 0) z.classList.add("wrong");
  });
  // Cek juga yang masih di pool
  const diPool = $$("#pool5 .kartu-item").length;
  return {
    benar: benar === total && diPool === 0,
    pesan: benar === total && diPool === 0 ? "Hebat! Kamu sudah bisa memilah informasi penting." : `Baru ${benar} dari ${total} kartu yang tepat. Periksa lagi!`,
    skor: Math.round((benar/total) * 100)
  };
}

function cekMisi6() {
  const isu = state.jawaban.misi1.pilihan;
  const data = DATA_SOAL.misi6[isu];
  const benar = data.langkah.map(l => l.id);
  const userOrder = state.jawaban.misi6.urutan;
  let cocok = 0;
  benar.forEach((id, i) => { if (userOrder[i] === id) cocok++; });
  const persen = Math.round((cocok / benar.length) * 100);
  // Cek ada JIKA-MAKA
  const adaIf = userOrder.some(id => data.langkah.find(l => l.id === id)?.jenis === "Pilihan");
  if (cocok === benar.length && adaIf) {
    // Render diagram alur
    renderFlowchart(data, userOrder);
    return { benar: true, pesan: "Algoritma tersusun rapi! Lihat diagram alurnya di bawah." };
  }
  return {
    benar: false,
    pesan: `Urutan baru ${persen}% tepat${adaIf ? "" : " dan belum ada JIKA–MAKA"}. Klik dua langkah untuk menukar posisinya.`,
    skor: persen
  };
}

function cekMisi7() {
  let benar = 0;
  DATA_SOAL.misi7.forEach(q => {
    const jwb = state.jawaban.misi7.jawaban[q.id];
    const o = q.opsi.find(x => x.id === jwb);
    const el = document.getElementById("penj_" + q.id);
    if (el) {
      el.style.display = "block";
      el.innerHTML = o && o.benar
        ? "✅ <strong>Benar!</strong> " + q.penjelasan
        : "❌ <strong>Belum tepat.</strong> " + q.penjelasan;
    }
    if (o && o.benar) benar++;
  });
  return {
    benar: benar === DATA_SOAL.misi7.length,
    pesan: benar === DATA_SOAL.misi7.length ? "Semua jawaban etika tepat. Kamu perancang solusi yang bertanggung jawab!" : `Baru ${benar} dari ${DATA_SOAL.misi7.length} soal yang benar.`,
    skor: Math.round((benar/DATA_SOAL.misi7.length) * 100)
  };
}

/* ---------- DIAGRAM ALUR SVG ---------- */
function renderFlowchart(data, urutan) {
  const isu = state.jawaban.misi1.pilihan;
  const steps = urutan.map(id => data.langkah.find(l => l.id === id));
  let svg = `<svg viewBox="0 0 420 ${steps.length * 70 + 40}" width="100%" style="max-width:420px">`;
  steps.forEach((s, i) => {
    const y = 20 + i * 70;
    let fill = "#BFD7EA", stroke = "#1E5B94";
    if (s.jenis === "Mulai" || s.jenis === "Selesai") { fill = "#C8E6C9"; stroke = "#39B54A"; }
    if (s.jenis === "Pilihan") { fill = "#FFF4C2"; stroke = "#D4A600"; }
    const w = 360, x = 30, h = 44;
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    svg += `<text x="${x + w/2}" y="${y + 28}" text-anchor="middle" font-size="12" fill="#1a2733" font-family="Poppins, sans-serif">${escapeXML(truncate(s.teks, 55))}</text>`;
    if (i < steps.length - 1) {
      svg += `<polygon points="${x+w/2-6},${y+h+2} ${x+w/2+6},${y+h+2} ${x+w/2},${y+h+14}" fill="#1E5B94"/>`;
    }
  });
  svg += `</svg>`;
  const wrap = document.createElement("div");
  wrap.className = "card";
  wrap.innerHTML = `<h3>📊 Diagram Alur (Flowchart) Algoritma Kamu</h3><div class="flow-svg-wrap">${svg}</div>`;
  $("#misiBody").appendChild(wrap);
}
function truncate(s, n) { return s.length > n ? s.slice(0, n) + "…" : s; }
function escapeXML(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

/* ============================================================
   HALAMAN HASIL
   ============================================================ */
function gotoResult() {
  $("#screen-misi").classList.remove("active");
  $("#screen-start").classList.remove("active");
  $("#screen-result").classList.add("active");
  renderProgress();

  // Hitung skor total
  const totalSkor = state.skorMisi.reduce((a,b)=>a+b,0);
  const persen = Math.round(totalSkor / 7);
  $("#resKelompok").textContent = state.kelompok || "Kelompok";
  $("#resScore").textContent = persen;

  // Bintang
  let bintang = 0;
  for (let i = SKOR_MIN_BINTANG.length - 1; i >= 0; i--) {
    if (persen >= SKOR_MIN_BINTANG[i]) { bintang = i + 1; break; }
  }
  if (bintang === 0) bintang = 1;
  $("#resStars").textContent = "⭐".repeat(bintang) + "☆".repeat(5 - bintang);

  // Ringkasan
  const isu = state.jawaban.misi1.pilihan || "-";
  const isuLabel = { gawai: "Penggunaan Gawai", sampah: "Sampah", antrean: "Antrean", literasi: "Literasi Digital" }[isu] || isu;
  const algoData = DATA_SOAL.misi6[isu];
  const algoText = state.jawaban.misi6.urutan.map(id => {
    const l = algoData?.langkah.find(x => x.id === id);
    return l ? l.teks : "";
  }).filter(Boolean);

  let html = `<ul style="line-height:1.8">`;
  html += `<li><strong>Kelompok:</strong> ${state.kelompok}</li>`;
  html += `<li><strong>Anggota:</strong> ${state.anggota.filter(Boolean).join(", ")}</li>`;
  html += `<li><strong>Masalah terpilih:</strong> ${isuLabel}</li>`;
  html += `<li><strong>Jawaban data (Misi 2):</strong> ${Object.entries(state.jawaban.misi2.hasil).map(([k,v])=>`${k}=${v}`).join(", ") || "-"}</li>`;
  html += `<li><strong>Algoritma (Misi 6):</strong><ol>${algoText.map(t=>`<li>${t}</li>`).join("")}</ol></li>`;
  html += `<li><strong>Skor per misi:</strong> ${state.skorMisi.map((s,i)=>`M${i+1}=${s}`).join(" | ")}</li>`;
  html += `</ul>`;
  $("#resSummary").innerHTML = html;

  // Pelangi perasaan
  $$(".rainbow-btn").forEach(b => b.classList.toggle("active", b.dataset.warna === state.warnaPerasaan));
  $("#rainbowNote").textContent = state.warnaPerasaan ? `Kamu memilih: ${state.warnaPerasaan}` : "";

  // Refleksi
  $("#refleksi1").value = state.jawaban.refleksi1 || "";
  $("#refleksi2").value = state.jawaban.refleksi2 || "";

  playSound("menang");
  runConfetti(2500);
  window.scrollTo({ top: 0, behavior: state.reduceMotion ? "auto" : "smooth" });
  saveProgress();
}

/* ---------- Salin & Unduh Hasil ---------- */
function teksHasil() {
  const isu = state.jawaban.misi1.pilihan || "-";
  const isuLabel = { gawai: "Penggunaan Gawai", sampah: "Sampah", antrean: "Antrean", literasi: "Literasi Digital" }[isu] || isu;
  const algoData = DATA_SOAL.misi6[isu];
  const algoText = state.jawaban.misi6.urutan.map((id, i) => {
    const l = algoData?.langkah.find(x => x.id === id);
    return l ? `${i+1}. ${l.teks}` : "";
  }).filter(Boolean).join("\n");

  let t = `========================================\n`;
  t += `HASIL LKPD — SEKOLAH SOLVER (K8P15)\n`;
  t += `========================================\n`;
  t += `Kelompok   : ${state.kelompok}\n`;
  t += `Anggota    : ${state.anggota.filter(Boolean).join(", ")}\n`;
  t += `Peran      : ${state.peran}\n`;
  t += `Tanggal    : ${new Date().toLocaleString("id-ID")}\n`;
  t += `----------------------------------------\n`;
  t += `MASALAH TERPILIH : ${isuLabel}\n\n`;
  t += `DATA (Misi 2):\n`;
  Object.entries(state.jawaban.misi2.hasil).forEach(([k,v]) => { t += `  - ${k} = ${v}\n`; });
  t += `\nALGORITMA (Misi 6):\n${algoText}\n\n`;
  t += `SKOR PER MISI: ${state.skorMisi.map((s,i)=>`M${i+1}=${s}`).join(" | ")}\n`;
  t += `TOTAL SKOR   : ${Math.round(state.skorMisi.reduce((a,b)=>a+b,0)/7)}/100\n`;
  t += `----------------------------------------\n`;
  t += `REFLEKSI:\n1. ${$("#refleksi1").value || "-"}\n2. ${$("#refleksi2").value || "-"}\n`;
  t += `Perasaan   : ${state.warnaPerasaan || "-"}\n`;
  t += `========================================\n`;
  t += FOOTER_TEXT + "\n";
  return t;
}

function copyResult() {
  const t = teksHasil();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(t).then(
      () => showToast("📋 Hasil disalin! Tempel di WA/Classroom.", "success"),
      () => showToast("Gagal menyalin. Coba unduh .txt saja.", "error")
    );
  } else {
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = t; document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove();
    showToast("📋 Hasil disalin!", "success");
  }
}

function downloadResult() {
  const t = teksHasil();
  const blob = new Blob([t], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Hasil_SekolahSolver_${(state.kelompok || "Kelompok").replace(/\s+/g, "_")}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  showToast("⬇️ File hasil berhasil diunduh!", "success");
}

/* ============================================================
   MODAL: HOW TO PLAY, GLOSARIUM, WORKED EXAMPLE
   ============================================================ */
function showHowToPlay() {
  openModal("📖 Cara Bermain", `
    <ol style="line-height:1.9">
      <li>Isi <strong>nama kelompok</strong> dan <strong>nama anggota</strong>, lalu klik <strong>MULAI PETUALANGAN</strong>.</li>
      <li>Selesaikan <strong>7 misi</strong> secara berurutan. Kamu tidak bisa melompat misi.</li>
      <li>Setiap misi ada tombol <strong>✅ Cek Jawaban</strong>. Kalau benar, kamu dapat bintang ⭐.</li>
      <li>Di akhir, kamu dapat <strong>halaman hasil</strong> yang bisa disalin atau diunduh untuk dikirim ke guru.</li>
      <li>Progres tersimpan otomatis di browser. Refresh tidak akan menghapus jawaban.</li>
    </ol>
  `);
}

function showGlosarium() {
  let html = `<p>Daftar istilah bahasa Inggris beserta padanan Indonesianya:</p><table class="data-table"><thead><tr><th>English</th><th>Bahasa Indonesia</th></tr></thead><tbody>`;
  DATA_SOAL.glosarium.forEach(([en, id]) => {
    html += `<tr><td><span class="en-term">${en}</span></td><td><span class="id-term">${id}</span></td></tr>`;
  });
  html += `</tbody></table>`;
  openModal("📖 Glosarium (Glossary)", html);
}

function showWorkedExample() {
  openModal("🔗 Worked Example — Contoh Terselesaikan: Antrean Koperasi", `
    <p>Perhatikan bagaimana SMP Harapan Nusantara menyelesaikan masalah antrean koperasi.</p>
    <table class="data-table">
      <thead><tr><th>Langkah</th><th>Contoh Pengerjaan</th></tr></thead>
      <tbody>
        <tr><td>1. Rumusan masalah</td><td>"Bagaimana agar murid tidak menghabiskan lebih dari 5 menit mengantre di koperasi saat istirahat?"</td></tr>
        <tr><td>2. Data</td><td>Waktu antre lima hari: 8, 6, 10, 5, 11 menit.<br>Jumlah = 40, Rata-rata = 8 menit. Terlama Jumat (11 menit). Tersingkat Kamis (5 menit).</td></tr>
        <tr><td>3. Memecah masalah</td><td>Siapa? Kapan? Berapa penjaga? Apa yang dibeli? Cara membayar?</td></tr>
        <tr><td>4. Mencari pola</td><td>Antrean paling panjang hari Rabu & Jumat karena ada tugas alat tulis.</td></tr>
        <tr><td>5. Memilih yang penting</td><td>Penting: jumlah murid, penjaga, jenis barang. Tidak penting: warna seragam, merek pulpen.</td></tr>
        <tr><td>6. Algoritma</td><td>Mulai → Murid mengisi kertas pesanan → Petugas menyiapkan barang per kelas → Ketua kelas mengambil pesanan → JIKA lengkap, MAKA bagikan → JIKA TIDAK, MAKA catat untuk besok → Selesai.</td></tr>
        <tr><td>7. Produk</td><td>Diagram alur + tabel rekap pesanan di spreadsheet.</td></tr>
        <tr><td>8. Uji coba</td><td>Jika tiap kelas hanya kirim 1 ketua kelas, yang mengantre tinggal 12 orang. Perkiraan waktu turun jadi sekitar 3 menit.</td></tr>
      </tbody>
    </table>
  `);
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Set footer text
  $("#footerText").textContent = FOOTER_TEXT;

  // Cek progres lama
  const adaProgres = loadProgress();
  renderStart();

  // Terapkan preferensi
  if (state.dark) document.body.classList.add("dark");
  if (state.reduceMotion) document.body.classList.add("reduce-motion");
  if (state.fontLevel === 1) document.body.classList.add("font-large");
  if (state.fontLevel === 2) document.body.classList.add("font-xl");

  // Form submit
  $("#formStart").addEventListener("submit", (e) => {
    e.preventDefault();
    state.kelompok = $("#inputKelompok").value.trim();
    state.anggota = [];
    for (let i = 1; i <= 6; i++) state.anggota.push($("#inputAnggota" + i).value.trim());
    state.peran = $("#inputPeran").value;
    state.selesai = [false,false,false,false,false,false,false];
    state.skorMisi = [0,0,0,0,0,0,0];
    state.jawaban = {
      misi1: { skor: {gawai:[1,1,1], sampah:[1,1,1], antrean:[1,1,1], literasi:[1,1,1]}, pilihan: null, quizBenar: false },
      misi2: { hasil: {}, benar: false },
      misi3: { penempatan: {}, benar: false },
      misi4: { pilihan: null, benar: false },
      misi5: { penempatan: {}, benar: false },
      misi6: { urutan: [], pilihan: null, benar: false },
      misi7: { jawaban: {}, benar: false },
      refleksi1: "",
      refleksi2: ""
    };
    saveProgress();
    gotoMisi(0);
  });

  // Lanjutkan progres
  $("#btnContinue").addEventListener("click", () => {
    if (!state.kelompok) return showToast("Belum ada progres. Mulai dulu ya!", "info");
    const next = state.selesai.indexOf(false);
    gotoMisi(next === -1 ? 6 : next);
  });

  // How to play
  $("#btnHowToPlay").addEventListener("click", showHowToPlay);

  // Worked Example
  $("#btnWorkedExample").addEventListener("click", showWorkedExample);

  // Glosarium
  $("#btnGlosarium").addEventListener("click", showGlosarium);

  // Modal close
  $("#modalClose").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });

  // Cek jawaban
  $("#btnCheck").addEventListener("click", cekJawaban);

  // Lanjut
  $("#btnNext").addEventListener("click", () => {
    if (state.misiIndex < 6) gotoMisi(state.misiIndex + 1);
  });

  // Toggle bahasa (info tooltips)
  $("#btnLang").addEventListener("click", () => {
    state.lang = state.lang === "id" ? "en" : "id";
    showToast(state.lang === "id" ? "🇮🇩 Mode Bahasa Indonesia aktif" : "🇬🇧 English mode — padanan tetap tampil", "info");
    saveProgress();
  });

  // Toggle suara
  $("#btnSound").addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    $("#btnSound").textContent = state.soundOn ? "🔊" : "🔇";
    showToast(state.soundOn ? "🔊 Suara aktif" : "🔇 Suara dimatikan", "info");
    saveProgress();
  });

  // Dark mode
  $("#btnDark").addEventListener("click", () => {
    state.dark = !state.dark;
    document.body.classList.toggle("dark", state.dark);
    showToast(state.dark ? "🌙 Mode Gelap aktif" : "☀️ Mode Terang aktif", "info");
    saveProgress();
  });

  // Reduce motion
  $("#btnReduceMotion").addEventListener("click", () => {
    state.reduceMotion = !state.reduceMotion;
    document.body.classList.toggle("reduce-motion", state.reduceMotion);
    showToast(state.reduceMotion ? "🎞️ Animasi dikurangi" : "🎞️ Animasi penuh", "info");
    saveProgress();
  });

  // Font size
  $("#btnFontSize").addEventListener("click", () => {
    state.fontLevel = (state.fontLevel + 1) % 3;
    document.body.classList.remove("font-large", "font-xl");
    if (state.fontLevel === 1) document.body.classList.add("font-large");
    if (state.fontLevel === 2) document.body.classList.add("font-xl");
    $("#btnFontSize").textContent = state.fontLevel === 0 ? "A+" : (state.fontLevel === 1 ? "A++" : "A");
    showToast(`🔤 Ukuran teks: ${["Normal","Besar","Ekstra Besar"][state.fontLevel]}`, "info");
    saveProgress();
  });

  // Pelangi perasaan
  $$(".rainbow-btn").forEach(b => {
    b.addEventListener("click", () => {
      state.warnaPerasaan = b.dataset.warna;
      $$(".rainbow-btn").forEach(x => x.classList.toggle("active", x === b));
      const peta = {
        merah: "Semangat ya! Istirahat cukup, besok pasti lebih baik.",
        kuning: "Biasa saja itu wajar. Yang penting kamu sudah berusaha.",
        hijau: "Senang mendengarnya! Terus belajar hal baru.",
        biru: "Keren! Kamu bangga dengan hasil kerjamu — pertahankan!"
      };
      $("#rainbowNote").textContent = peta[state.warnaPerasaan];
      saveProgress();
    });
  });

  // Refleksi
  $("#refleksi1").addEventListener("input", () => {
    state.jawaban.refleksi1 = $("#refleksi1").value;
    saveProgress();
  });
  $("#refleksi2").addEventListener("input", () => {
    state.jawaban.refleksi2 = $("#refleksi2").value;
    saveProgress();
  });

  // Salin & Unduh
  $("#btnCopy").addEventListener("click", copyResult);
  $("#btnDownload").addEventListener("click", downloadResult);

  // Flowchart
  $("#btnFlowchart").addEventListener("click", () => {
    const isu = state.jawaban.misi1.pilihan || "antrean";
    const data = DATA_SOAL.misi6[isu];
    const urutan = state.jawaban.misi6.urutan.length ? state.jawaban.misi6.urutan : data.langkah.map(l => l.id);
    const steps = urutan.map(id => data.langkah.find(l => l.id === id)).filter(Boolean);
    let svg = `<svg viewBox="0 0 420 ${steps.length * 70 + 40}" width="100%" style="max-width:420px">`;
    steps.forEach((s, i) => {
      const y = 20 + i * 70;
      let fill = "#BFD7EA", stroke = "#1E5B94";
      if (s.jenis === "Mulai" || s.jenis === "Selesai") { fill = "#C8E6C9"; stroke = "#39B54A"; }
      if (s.jenis === "Pilihan") { fill = "#FFF4C2"; stroke = "#D4A600"; }
      const w = 360, x = 30, h = 44;
      svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
      svg += `<text x="${x+w/2}" y="${y+28}" text-anchor="middle" font-size="12" fill="#1a2733" font-family="Poppins, sans-serif">${escapeXML(truncate(s.teks, 55))}</text>`;
      if (i < steps.length - 1) {
        svg += `<polygon points="${x+w/2-6},${y+h+2} ${x+w/2+6},${y+h+2} ${x+w/2},${y+h+14}" fill="#1E5B94"/>`;
      }
    });
    svg += `</svg>`;
    openModal("📊 Diagram Alur Algoritma Kelompokmu", `<div class="flow-svg-wrap">${svg}</div>`);
  });

  // Reset
  $("#btnReset").addEventListener("click", () => {
    if (confirm("Yakin mau mengulang dari awal? Semua jawaban akan dihapus.")) {
      resetProgress();
      location.reload();
    }
  });

  // Mode Guru (klik logo 3× berturut-turut)
  let logoClicks = 0, logoTimer = null;
  $$(".logo, .hero-logo").forEach(img => {
    img.addEventListener("click", () => {
      logoClicks++;
      clearTimeout(logoTimer);
      logoTimer = setTimeout(() => { logoClicks = 0; }, 800);
      if (logoClicks >= 3) {
        logoClicks = 0;
        bukaModeGuru();
      }
    });
  });
});

/* ---------- MODE GURU ---------- */
function bukaModeGuru() {
  const kunci = `🔑 Kunci Jawaban (Mode Guru)\n\n` +
    `Misi 1: Jawaban mini-quiz = B. Masalah terbaik = yang total skornya tertinggi.\n` +
    `Misi 2: Data menyesuaikan isu:\n` +
    `  - Gawai → 50%\n  - Sampah → 92 botol, 33% dari 8C\n  - Antrean → jumlah 60, rata-rata 12, terlama Jumat\n  - Literasi → 70%\n` +
    `Misi 3: Cocokkan kartu ke kotak (siapa/kapan/sebab/dampak).\n` +
    `Misi 4: Pilih opsi "a" untuk semua isu (pola paling kuat).\n` +
    `Misi 5: Cocokkan kartu ke kotak PENTING/TIDAK PENTING.\n` +
    `Misi 6: Susun urutan sesuai data di script.js.\n` +
    `Misi 7: q1=b, q2=b, q3=c.`;
  openModal("🧑‍🏫 Mode Guru", `
    <pre style="white-space:pre-wrap; font-size:0.9rem; background:rgba(30,91,148,0.08); padding:12px; border-radius:10px;">${kunci}</pre>
    <div class="btn-row mt-2">
      <button class="btn btn-danger" onclick="if(confirm('Reset semua progres?')){localStorage.removeItem('sekolahSolver_progress');location.reload();}">🔄 Reset Semua Progres</button>
      <button class="btn btn-ghost" onclick="document.getElementById('modal').hidden=true">Tutup</button>
    </div>
  `);
}

/* ---------- ENTER KEY untuk modal ---------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("#modal").hidden) closeModal();
});