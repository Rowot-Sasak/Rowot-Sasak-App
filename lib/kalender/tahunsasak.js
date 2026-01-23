const namatahun = [
  "Alif", "Ehe", "Jim Awal", "Se",
  "Dal", "Be", "Wau", "Jim Akhir"
];
export function getnamatahun(TahunHijriyah, onchange = false) {
  if (onchange) {
    const first = namatahun[(TahunHijriyah + 3) % 8];
    const second = namatahun[(TahunHijriyah + 4) % 8];
    return `${first}/${second}`;
  } else {
    return namatahun[(TahunHijriyah + 3) % 8];
  }
}