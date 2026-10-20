# Portfolio — Praja Alim Zamzani

Website portfolio statis (HTML, CSS, JavaScript murni, tanpa framework) untuk GitHub Pages.
Live: https://zamzania.github.io/Portfolio/

## Struktur

```
index.html                  Semua konten halaman
assets/css/style.css        Desain, warna, tipografi, animasi
assets/js/main.js           Interaksi: animasi, jam analog, jadwal, sertifikat, form
assets/js/lenis.min.js      Smooth scrolling (Lenis, lisensi MIT)
assets/fonts/               Font Playfair Display, Cormorant Garamond, Montserrat (self-hosted, lisensi OFL)
assets/img/                 Foto profil, favicon, gambar share (og-image.jpg)
assets/img/certs/           Thumbnail sertifikat (960px) dan versi besar di full/ (1600px)
assets/Praja_Alim_Zamzani_CV.pdf   CV yang diunduh lewat tombol "Download CV"
Certificates/               PDF asli sertifikat
```

## Cara mengedit

**Mengganti CV**: timpa `assets/Praja_Alim_Zamzani_CV.pdf` dengan file baru (nama file sama).

**Jadwal kuliah**: buka `assets/js/main.js`, cari `const SCHEDULE`. Format:
`{ day: 1, start: '15:20', end: '17:50', name: 'Nama Mata Kuliah', lecturer: 'Nama Dosen' }`
(`day`: 1 = Senin … 5 = Jumat, jam dalam WITA). Status "In class / Available" dihitung otomatis.

**Kata kunci berbingkai** (di bawah hero dan setelah Skills): ubah daftar `<li class="keyword">` di `index.html`.

**Menambah sertifikat**:
1. Simpan PDF ke `Certificates/`.
2. Buat gambar halaman pertama (mis. ekspor dari PDF ke JPG) dan simpan ke `assets/img/certs/` (lebar ±960px) dan `assets/img/certs/full/` (lebar ±1600px).
3. Di `index.html`, salin satu blok `<li class="cert" ...>` di bagian CERTIFICATES lalu ganti `data-cat`
   (`diplomacy`, `data`, `professional`, atau `organization`), path PDF/gambar, judul, dan tanggal.

**Menambah project**: salin satu blok `<article class="project-card ...">` di bagian PROJECTS (di dalam `projects-grid`), lalu ganti judul, peran, deskripsi, tag, dan link website-nya.

**Menambah pengalaman**: salin satu blok `<li class="tl-item ...">` di bagian EXPERIENCE. Ganti kelas `left`/`right` supaya posisinya tetap berselang-seling.

## Deploy ke GitHub Pages

1. Hapus isi lama repository `Portfolio` (index.html, style.css, script.js, profile.jpg).
2. Upload seluruh isi folder ini ke root repository (pertahankan struktur foldernya).
3. Settings → Pages → Source: branch `main`, folder `/ (root)`.

## Catatan teknis

- Semua animasi mati otomatis untuk pengunjung yang mengaktifkan "reduce motion".
- Partikel emas berhenti saat tab tidak aktif, jadi hemat baterai.
- Form kontak membuka aplikasi email pengunjung (mailto), tanpa server.
- Animasi pembuka (tanda tangan Z) hanya tampil sekali per sesi browser.
