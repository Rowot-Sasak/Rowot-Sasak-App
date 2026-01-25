const namabulan = [
  "Muharram", "Shafar", "Rabiul Awal", "Rabiul Akhir",
  "Jumadil Awal", "Jumadil Akhir","Rajab", "Syaban",
  "Ramadhan","Syawal","Dzulqadah","DzulHijjah"
];

const namabulansasak = [
  "Bubur Puteq", "Bubur Beaq", "Mulut", "Suwung Penembeq",
  "Suwung Penengaq", "Suwung Penutuq","Mi rat", "Rowah",
  "Puase","Lebaran Nine","Lalang","Lebaran Mame"
];

const jelokale = [
  "Sabtu, Ahad", "Sabtu, Ahad", "Sabtu, Ahad", "Senen, Selase",
  "Senen, Selase", "Senen, Selase","Rebo, Kamis", "Rebo, Kamis",
  "Rebo, Kamis","Jumat","Jumat","Jumat"
];

const Formater = new Intl.DateTimeFormat('id-u-ca-islamic', {
  month: 'numeric',
  year: 'numeric'
});

function getBulanHijriyah(date) {
  const parts = Formater.formatToParts(date);
  return Number(parts.find(p => p.type === 'month').value);
}

export function getnamabulanhijriyah(bulan, tahun) {
    const tanggalterkahir = new Date(tahun, bulan, 0).getDate();
    const tanggal1 = new Date(tahun, bulan - 1, 1);
    const tanggal2 = new Date(tahun, bulan - 1, tanggalterkahir); 

    const bulanHijriyah1 = getBulanHijriyah(tanggal1);
    const bulanHijriyah2 = getBulanHijriyah(tanggal2);

    if (bulanHijriyah1 !== bulanHijriyah2) {
        return [namabulan[bulanHijriyah1 - 1], namabulan[bulanHijriyah2 - 1]];
    }
    return [namabulan[bulanHijriyah1 - 1]];
}

export function getkalebulan(bulan, tahun) {
  const bulanHijriyah = getnamabulanhijriyah(bulan, tahun).map(b => {
    const index = namabulan.indexOf(b);
    return namabulansasak[index];
  });
  return bulanHijriyah;
}

export function getjelokale(bulan, tahun) {
  const bulanHijriyah = getnamabulanhijriyah(bulan, tahun).map(b => {
    const index = namabulan.indexOf(b);
    return jelokale[index];
  });
  return bulanHijriyah;
}
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