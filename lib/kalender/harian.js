const namahariJawa = ["Manis", "Paing", "Pon", "Wage", "Kliwon"];
const namahariJawaAngka = [5,9,7,4,8];
const namahariMasehi = ["Ahad", "Senen", "Selase", "Rebo", "Kemis", "Jumat", "Saptu"];
const namahariMasehiAngka = [5,4,3,7,8,6,9];
const namaharisasak = ["Tutup","Ariyang", "Aras", "Wulan", "Lintang", "Sringenge", "Banyu", "Geni", "Bumi", "Angin"];
const fasegerhana = ["Fase1", "Fase2", "Fase3", "Fase4"];

const Formater = new Intl.DateTimeFormat('id-u-ca-islamic', {
  day: 'numeric',
});

function getParts(date) {
  const parts = Formater.formatToParts(date);
  return {
    tanggalHijriyah: parts.find(p => p.type === 'day').value
  };
}

/**
 * @param {number} bulan - 1-12
 * @param {number} tahun - tahun Masehi
 * @param {Array<number>} tanggallibur 
 * @returns {Array<Object>} 
 */
export function getHari(bulan, tahun, tanggallibur = []) { 
  const jumlahHari = new Date(tahun, bulan, 0).getDate(); 

  const anchorDate = new Date(1990, 1, 2); 
  const diffDay = Math.floor((new Date(tahun, bulan - 1, 1) - anchorDate) / (1000 * 60 * 60 * 24));
  const startIndex = ((diffDay % namahariJawa.length) + namahariJawa.length) % namahariJawa.length; 

  const result = [];
  for (let i = 1; i <= jumlahHari; i++) {
    const hariIndex = (startIndex + i - 1) % namahariJawa.length;
    const dateObj = new Date(tahun, bulan - 1, i);
    const angkahari = dateObj.getDay();
    const hariMasehi = namahariMasehi[angkahari];
    const harisasak = ((namahariJawaAngka[hariIndex] + namahariMasehiAngka[angkahari]) % 10);
    const fase = (i === 9) ? fasegerhana[1] : null;
    const hijriyah = getParts(dateObj);

    const isLibur = tanggallibur.includes(i);

    result.push({
      tanggal: i,
      tanggalHijriyah: hijriyah.tanggalHijriyah,
      harijawa: namahariJawa[hariIndex],
      hari: hariMasehi,
      harisasak: namaharisasak[harisasak],
      fasegerhana: fase,
      isLibur: isLibur
    });
  }

  return result;
}
