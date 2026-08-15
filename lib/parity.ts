export type Parity = "GANJIL" | "GENAP";

export type ParityMethod = {
  id: string;
  label: string;
  description: string;
  fn: (n: number) => Parity;
};

// 1. AND bit terakhir dengan 1. Bit terakhir 0 -> genap, 1 -> ganjil.
// Berlaku juga untuk bilangan negatif karena representasi two's complement.
function viaBitwiseAnd(n: number): Parity {
  return (n & 1) === 0 ? "GENAP" : "GANJIL";
}

// 2. Geser 1 bit ke kanan lalu ke kiri lagi. Kalau hasilnya sama dengan n,
// berarti bit terakhir tadinya 0 (genap); kalau beda, bit terakhir 1 (ganjil).
function viaBitShift(n: number): Parity {
  return (n >> 1) << 1 === n ? "GENAP" : "GANJIL";
}

// 3. Bagi 2, lalu cek apakah hasilnya bilangan bulat (tanpa sisa).
function viaDivisionIsInteger(n: number): Parity {
  return Number.isInteger(n / 2) ? "GENAP" : "GANJIL";
}

// 4. Bulatkan ke bawah hasil bagi 2, lalu kalikan lagi dengan 2.
// Kalau hasilnya kembali sama dengan n, berarti tidak ada sisa pembagian.
function viaFloorMultiplyBack(n: number): Parity {
  return 2 * Math.floor(n / 2) === n ? "GENAP" : "GANJIL";
}

// 5. Ubah nilai absolut n ke string, ambil karakter terakhir (digit satuan),
// lalu cek apakah termasuk digit genap.
function viaLastDigitString(n: number): Parity {
  const digits = Math.abs(n).toString();
  const lastDigit = digits[digits.length - 1];
  return ["0", "2", "4", "6", "8"].includes(lastDigit) ? "GENAP" : "GANJIL";
}

// 6. Ubah nilai absolut n ke representasi biner (basis 2) sebagai string.
// Bit paling kanan menentukan ganjil/genap, sama seperti pada bilangan desimal.
function viaBinaryString(n: number): Parity {
  const binary = Math.abs(n).toString(2);
  return binary.endsWith("0") ? "GENAP" : "GANJIL";
}

// 7. Rekursi: kurangi 2 berulang kali sampai mentok ke basis 0 (genap) atau 1 (ganjil).
// Bilangan negatif dinormalisasi dulu ke nilai absolutnya.
function viaRecursiveSubtraction(n: number): Parity {
  function isEven(value: number): boolean {
    if (value === 0) return true;
    if (value === 1) return false;
    return isEven(value - 2);
  }
  return isEven(Math.abs(n)) ? "GENAP" : "GANJIL";
}

// 8. Identitas trigonometri cos(n * PI) = (-1)^n, jadi hasilnya 1 untuk n genap
// dan -1 untuk n ganjil. Dibulatkan karena floating point.
function viaCosineTrick(n: number): Parity {
  return Math.round(Math.cos(n * Math.PI)) === 1 ? "GENAP" : "GANJIL";
}

export const parityMethods: ParityMethod[] = [
  {
    id: "bitwise-and",
    label: "Bitwise AND (n & 1)",
    description: "Cek bit terakhir dari representasi biner n dengan operator AND.",
    fn: viaBitwiseAnd,
  },
  {
    id: "bit-shift",
    label: "Bit shift (n >> 1 << 1)",
    description: "Geser 1 bit ke kanan lalu ke kiri, bandingkan dengan n asli.",
    fn: viaBitShift,
  },
  {
    id: "division-is-integer",
    label: "Pembagian + Number.isInteger",
    description: "Bagi n dengan 2, cek apakah hasilnya bilangan bulat.",
    fn: viaDivisionIsInteger,
  },
  {
    id: "floor-multiply-back",
    label: "Floor lalu kali balik",
    description: "Math.floor(n / 2) dikali 2, bandingkan hasilnya dengan n.",
    fn: viaFloorMultiplyBack,
  },
  {
    id: "last-digit-string",
    label: "Digit terakhir (string)",
    description: "Ambil digit satuan dari n sebagai teks, cek termasuk digit genap.",
    fn: viaLastDigitString,
  },
  {
    id: "binary-string",
    label: "Representasi biner (string)",
    description: "Ubah n ke basis 2, cek karakter paling kanan.",
    fn: viaBinaryString,
  },
  {
    id: "recursive-subtraction",
    label: "Rekursi pengurangan 2",
    description: "Kurangi n dengan 2 berulang kali secara rekursif sampai basis 0 atau 1.",
    fn: viaRecursiveSubtraction,
  },
  {
    id: "cosine-trick",
    label: "Trik trigonometri cos(nπ)",
    description: "Pakai identitas cos(n * PI) = (-1)^n untuk menentukan paritas.",
    fn: viaCosineTrick,
  },
];
