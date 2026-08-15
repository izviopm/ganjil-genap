# Bilangan Ganjil dan Genap tanpa Modulus

Tugas 2.6 — Program untuk menginput sebuah bilangan bulat (boleh positif, boleh negatif) dan mencetak **"GANJIL"** atau **"GENAP"**, **tanpa menggunakan operator/fungsi modulus (`%`)**.

Dibuat dengan **Next.js** (TypeScript + React), berisi **8 cara berbeda** untuk menentukan paritas sebuah bilangan tanpa modulus. Semua cara dijalankan sekaligus untuk satu input angka, sehingga bisa langsung dibandingkan hasilnya.

- Kode sumber cara-caranya: [`lib/parity.ts`](./lib/parity.ts)
- Tampilan web (input + hasil): [`app/page.tsx`](./app/page.tsx)
- Repo: https://github.com/izviopm/ganjil-genap
- Live demo: di-deploy otomatis via Vercel dari branch `main`

## Cara menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000), masukkan sebuah bilangan bulat, lalu semua metode di bawah akan langsung menghitung dan menampilkan hasilnya.

## Penjelasan 8 Cara

Semua fungsi bertipe `(n: number) => "GANJIL" | "GENAP"`. Bilangan negatif ditangani secara eksplisit di beberapa metode dengan menormalisasinya lebih dulu ke nilai absolut (`Math.abs(n)`), karena konsep "digit terakhir" atau "representasi biner" secara alami hanya didefinisikan untuk bilangan non-negatif.

### 1. Bitwise AND (`n & 1`)

```ts
function viaBitwiseAnd(n: number): Parity {
  return (n & 1) === 0 ? "GENAP" : "GANJIL";
}
```

**Konsep:** Setiap bilangan bulat disimpan komputer dalam bentuk biner. Bit paling kanan (bit ke-0) dari sebuah bilangan biner selalu bernilai `1` jika bilangan itu ganjil, dan `0` jika genap — persis seperti aturan "digit satuan" pada bilangan desimal, hanya saja dalam basis 2. Operator `&` (AND) membandingkan bit demi bit; meng-AND-kan `n` dengan `1` (yang dalam biner adalah `...0001`) hanya akan menyisakan bit paling kanan dari `n`, sisanya jadi nol.

**Kenapa tanpa modulus:** Sama sekali tidak memakai pembagian atau sisa bagi, murni operasi bit.

**Bilangan negatif:** Tetap benar, karena JavaScript (dan hampir semua bahasa lain) merepresentasikan bilangan negatif dengan format *two's complement*, di mana bit terakhir tetap mengikuti aturan ganjil/genap yang sama.

### 2. Bit shift (`(n >> 1) << 1`)

```ts
function viaBitShift(n: number): Parity {
  return (n >> 1) << 1 === n ? "GENAP" : "GANJIL";
}
```

**Konsep:** `n >> 1` menggeser semua bit `n` satu langkah ke kanan (otomatis membuang bit paling kanan). `<< 1` menggeser hasilnya kembali satu langkah ke kiri (mengisi bit paling kanan dengan `0`). Jika bit yang terbuang tadi awalnya `0` (genap), proses geser-lalu-kembali ini akan menghasilkan bilangan yang **persis sama** dengan `n`. Jika bit yang terbuang adalah `1` (ganjil), hasilnya akan berbeda satu dari `n` karena bit itu hilang dan diganti `0`.

**Kenapa tanpa modulus:** Murni operasi geser bit (bitwise shift), tidak ada pembagian.

### 3. Pembagian + `Number.isInteger`

```ts
function viaDivisionIsInteger(n: number): Parity {
  return Number.isInteger(n / 2) ? "GENAP" : "GANJIL";
}
```

**Konsep:** Bilangan genap selalu bisa dibagi 2 dengan hasil bulat tanpa sisa (misal `8 / 2 = 4`), sedangkan bilangan ganjil menghasilkan pecahan (misal `7 / 2 = 3.5`). `Number.isInteger()` mengecek apakah hasil pembagian itu bulat atau tidak.

**Kenapa tanpa modulus:** Menggunakan operator pembagian biasa (`/`), bukan sisa bagi (`%`) — keduanya operator yang berbeda.

### 4. Floor lalu kali balik

```ts
function viaFloorMultiplyBack(n: number): Parity {
  return 2 * Math.floor(n / 2) === n ? "GENAP" : "GANJIL";
}
```

**Konsep:** `Math.floor(n / 2)` membulatkan hasil bagi ke bawah, lalu dikalikan 2 lagi. Jika `n` genap, proses bagi-lalu-kali-balik ini akan mengembalikan `n` yang sama persis. Jika `n` ganjil, bagian pecahan yang "hilang" saat pembulatan ke bawah membuat hasil akhirnya berbeda dari `n`.

**Kenapa tanpa modulus:** Ini sebenarnya cara manual untuk menghitung "sisa bagi" tanpa memakai operator `%` secara langsung — hanya memakai pembagian, pembulatan, dan perkalian.

### 5. Digit terakhir (string)

```ts
function viaLastDigitString(n: number): Parity {
  const digits = Math.abs(n).toString();
  const lastDigit = digits[digits.length - 1];
  return ["0", "2", "4", "6", "8"].includes(lastDigit) ? "GENAP" : "GANJIL";
}
```

**Konsep:** Ini aturan yang biasa diajarkan secara manual: sebuah bilangan bulat genap atau ganjil ditentukan oleh digit satuannya (paling kanan). `toString()` mengubah angka menjadi teks, lalu diambil karakter paling terakhir, dan dicek apakah termasuk salah satu digit genap `{0, 2, 4, 6, 8}`.

**Kenapa tanpa modulus:** Tidak ada operasi aritmatika pembagian sama sekali, hanya manipulasi teks (string).

**Bilangan negatif:** Tanda minus dibuang dulu dengan `Math.abs()`, supaya karakter terakhir yang diambil tetap sebuah digit, bukan tanda `-`.

### 6. Representasi biner (string)

```ts
function viaBinaryString(n: number): Parity {
  const binary = Math.abs(n).toString(2);
  return binary.endsWith("0") ? "GENAP" : "GANJIL";
}
```

**Konsep:** Mirip dengan cara #5, tapi memakai basis 2 (biner) bukan basis 10 (desimal). `toString(2)` mengubah angka menjadi representasi biner dalam bentuk teks (misal `13` menjadi `"1101"`). Karakter paling kanan dari representasi biner itu menentukan ganjil/genap, sama seperti alasan pada cara #1.

**Kenapa tanpa modulus:** Sama seperti #5, murni manipulasi teks setelah konversi basis.

### 7. Rekursi pengurangan 2

```ts
function viaRecursiveSubtraction(n: number): Parity {
  function isEven(value: number): boolean {
    if (value === 0) return true;
    if (value === 1) return false;
    return isEven(value - 2);
  }
  return isEven(Math.abs(n)) ? "GENAP" : "GANJIL";
}
```

**Konsep:** Kalau sebuah bilangan terus-menerus dikurangi 2, ia pada akhirnya akan "mendarat" tepat di `0` (jika awalnya genap) atau tepat di `1` (jika awalnya ganjil) — tidak akan pernah melompati keduanya. Fungsi ini memakai rekursi: mengurangi `2` berulang kali sampai mencapai salah satu dari dua basis kasus tersebut.

**Kenapa tanpa modulus:** Hanya memakai pengurangan (`-`) dan pemanggilan fungsi berulang (rekursi).

**Catatan:** Karena rekursi ini memanggil dirinya sendiri sebanyak `n / 2` kali, untuk bilangan yang sangat besar (ratusan ribu ke atas) fungsi ini bisa mencapai batas *call stack* JavaScript. Aplikasi web ini menangkap kondisi tersebut dan menampilkan "Angka terlalu besar" pada kartu metode ini saja, tanpa mengganggu ketujuh metode lainnya.

### 8. Trik trigonometri `cos(nπ)`

```ts
function viaCosineTrick(n: number): Parity {
  return Math.round(Math.cos(n * Math.PI)) === 1 ? "GENAP" : "GANJIL";
}
```

**Konsep:** Ini memakai identitas matematika `cos(n × π) = (-1)ⁿ`. Artinya, untuk `n` genap hasilnya selalu `+1`, dan untuk `n` ganjil hasilnya selalu `-1`. `Math.round()` dipakai untuk membulatkan pembulatan kecil akibat perhitungan angka desimal (*floating point*) di komputer.

**Kenapa tanpa modulus:** Murni fungsi trigonometri (`cos`) dan konstanta `π`, tidak menyentuh operator pembagian maupun sisa bagi sama sekali.

## Ringkasan

| # | Metode | Teknik utama |
|---|--------|---------------|
| 1 | Bitwise AND | Operasi bit `&` |
| 2 | Bit shift | Operasi bit `>>` `<<` |
| 3 | Pembagian + isInteger | Pembagian `/` |
| 4 | Floor lalu kali balik | Pembagian `/`, pembulatan, perkalian |
| 5 | Digit terakhir (string) | Konversi ke teks (basis 10) |
| 6 | Representasi biner (string) | Konversi ke teks (basis 2) |
| 7 | Rekursi pengurangan 2 | Pengurangan `-` + rekursi |
| 8 | Trik trigonometri | Fungsi `cos` |

Kedelapan cara di atas sudah diuji konsisten satu sama lain untuk berbagai kasus: `0`, bilangan positif ganjil/genap, bilangan negatif ganjil/genap, dan bilangan besar.

## Deploy

Repo ini terhubung ke Vercel — setiap push ke branch `main` akan otomatis membangun ulang dan men-deploy versi terbaru secara gratis (Vercel Hobby plan).
