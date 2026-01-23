const Formater = new Intl.DateTimeFormat('id-u-ca-islamic', {
  year: 'numeric'
});

/**
 * @param {number} bulan - 1-12
 * @param {number} tahun - tahun Masehi
 * @returns {Object} 
 */
export function GetTahunHijriyah(bulan, tahun) {
  const tanggal1 = new Date(tahun, bulan - 1, 1);

  const parts1 = Formater.formatToParts(tanggal1);
  const hijriyahYear1 = Number(parts1.find(p => p.type === 'year').value);

  const lastDay = new Date(tahun, bulan, 0).getDate();
  const tanggalAkhir = new Date(tahun, bulan - 1, lastDay);
  const parts2 = Formater.formatToParts(tanggalAkhir);
  const hijriyahYear2 = Number(parts2.find(p => p.type === 'year').value);

  const isPergantianTahun = hijriyahYear1 !== hijriyahYear2;

  return {
    hijriyahYear: hijriyahYear1,
    isPergantianTahun
  };
}
