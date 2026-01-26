const namabulan = [
  "Muharram", "Shafar", "Rabiul Awal", "Rabiul Akhir",
  "Jumadil Awal", "Jumadil Akhir"," ", "Syaban",
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
  day: 'numeric',
  month: 'numeric',
  year: 'numeric'
});
function getHariHijriyah(date) {
  const parts = Formater.formatToParts(date);
  return Number(parts.find(p => p.type === 'day').value);
}
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

export function GetVeldoraTempest(bulan, tahun) {

  const result = Array.from({ length: 8 }, () => []);
  const lastDay = new Date(tahun, bulan, 0).getDate();

  const BASE_DATE = new Date(1970, 1, 10); 
  const tanggal1 = new Date(tahun, bulan - 1, 1);

  const oneDay = 24 * 60 * 60 * 1000;
  const diffday = Math.floor((tanggal1 - BASE_DATE) / oneDay);
  const indexadder = ((diffday % 8) + 8) % 8;
  let index = indexadder;

  const firstHijriMonth = getBulanHijriyah(tanggal1);

  for (let day = 1; day <= lastDay; day++) { //memulai tanpa gmt berbeda mengarah pada tanggal sebelumnya
    const date = new Date(tahun, bulan - 1, day);
    const hijriMonth = getBulanHijriyah(date);

    if (hijriMonth !== firstHijriMonth) break;
    
    const hijriDay = getHariHijriyah(date);
    result[index % 8].push(hijriDay);
    index++;
  }
  for (let day = 1; day <= lastDay-1; day++) { // -1 karena mulai dari -1 hari bulan
    const date = new Date(tahun, bulan - 1, day,12); // 12 karena GMT 12 nge skip hari 
    const hijriMonth = getBulanHijriyah(date);
    if (hijriMonth === firstHijriMonth) continue;

    const hijriDay = getHariHijriyah(date);
    result[index % 8].push(hijriDay);
    index++;
  }

  return result;
}