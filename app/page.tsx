"use client";

import { useState } from "react";
import { parityMethods, type Parity } from "@/lib/parity";

export default function Home() {
  const [raw, setRaw] = useState("");
  const [value, setValue] = useState<number | null>(null);
  const [error, setError] = useState("");

  function handleChange(text: string) {
    setRaw(text);

    if (text.trim() === "") {
      setValue(null);
      setError("");
      return;
    }

    const parsed = Number(text);
    if (!Number.isInteger(parsed)) {
      setValue(null);
      setError("Masukkan bilangan bulat (boleh negatif), tanpa desimal.");
      return;
    }

    setError("");
    setValue(parsed);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Ganjil / Genap tanpa Modulus
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Masukkan sebuah bilangan bulat. Hasilnya dihitung dengan{" "}
            {parityMethods.length} cara berbeda, tanpa satu pun memakai
            operator atau fungsi modulus (<code>%</code>).
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="number-input"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Bilangan bulat
          </label>
          <input
            id="number-input"
            type="number"
            inputMode="numeric"
            step={1}
            value={raw}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="contoh: -7, 0, 12"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-lg text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {value !== null && (
          <div className="flex flex-col gap-3">
            {parityMethods.map((method) => {
              let result: Parity | null = null;
              try {
                result = method.fn(value);
              } catch {
                result = null;
              }
              const isGenap = result === "GENAP";
              return (
                <div
                  key={method.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-black dark:text-zinc-50">
                      {method.label}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {method.description}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${
                      result === null
                        ? "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        : isGenap
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {result ?? "Angka terlalu besar"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
