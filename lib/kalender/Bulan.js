import moment from "moment-hijri";

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

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(Date.UTC(tahun, bulan - 1, day, 12));;
    const hijriDay = getHariHijriyah(date);
    result[index % 8].push(hijriDay);
    index++;
  }
  return result;
}
const daftarWuku = [
  // "Munigaram",
  "Jayengrana", "Umarmaya", "Kadimdawu", "Umarmadi",
  "Atas Angin", "Selandir", "Sadatsatil", "Jagatpati",
  "Ismayawati", "Baktak", "Bardangin", "Repatmaja",
  "Sekardiu","Gagaksui", "Kobatsareyat", "Gagakwilis", "Bangteng Jamal",
  "Betal Jemur", "Patih Alkas", "Tamtanus", "Maktal",
  "Sinaksil", "Bardanas", "Nursiwan", "Guritwesi",
  "Datu Pandite", "Rengganis", "Kalisahak", "Dewi Kuraisin"
  , "Munigaram"
];

export function GetWuku(bulan, tahun) {
  // console.log(daftarWuku)

  const tanggalsekarang = new Date(tahun, bulan - 1, 1);
  const tanggalReferensi = new Date(1990, 0, 14);
  // const tanggalReferensi = new Date(2018, 2, 18);
  // const testb = 2;
  // const test = new Date(2025, testb-1, 1);
  const selisih = Math.floor(Math.abs(tanggalReferensi - tanggalsekarang) / (7*24 * 60 * 60 * 1000));
  const index = (selisih%30)
  const result = [];
  // console.log("selisih",selisih)
  // console.log(index,daftarWuku[index])
  for (let i = 0; i < 6; i++) {
    result.push(daftarWuku[(i+index)%30]);
    // console.log("push",daftarWuku[(i+index)%30],(i+index)%30)
  }

  return result;
  
}

const mangseHari = [41, 24, 24, 25, 35, 33, 41, 26, 24, 24, 23, 40];
const namamangse = [
  "Saq",
  "Duwe",
  "Telu",
  "Empat",
  "Lime",
  "Enem",
  "Pituq",
  "Baluq",
  "Siwaq",
  "Sepulu",
  "Solas",
  "Duwe Olas"
];
const formatDayMonth = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long"
});
export function GetMangse(bulan, tahun) {
  const tanggalawal = 5+(tahun%3)*10;
  const indexbulan = (Math.floor((tahun-1995)/3))%12;
  namabulan[indexbulan]
  const dateh = `${tahun-579}-${indexbulan+1}-${tanggalawal}`;
  const masehi = moment(dateh, "iYYYY-iMM-iDD").toDate();

  console.log(tanggalawal, namabulan[indexbulan], "atau", masehi);

  const tanggal1 = new Date(tahun, bulan - 1, 1);

  const diffday = masehi - tanggal1;

  console.log(
    "beda hari =",
    Math.abs(diffday / (24 * 60 * 60 * 1000)) 
  );
  let arraybulansasak=[];
  let awal = new Date(masehi);
  let akhir = new Date(masehi);
  if(diffday>0){
    console.log("this pos (belum lewat tanggal 1 pada tahun ini)");
    for (let i=11;i>=0;i--){
      akhir = new Date(awal.getFullYear(),awal.getMonth(),awal.getDate() - 1);
      awal = new Date(akhir.getTime() - (mangseHari[i] * 86400000));
      const stringdata1 = "Mangse "+ namamangse[i]+" ("+mangseHari[i]+")";
      const stringdata2 = formatDayMonth.format(awal)+"/"+getHariHijriyah(awal)+" "+namabulan[getBulanHijriyah(awal)] +" - " +formatDayMonth.format(akhir)+"/"+getHariHijriyah(akhir)+" "+namabulan[getBulanHijriyah(akhir)] ;
      const data = [stringdata1,stringdata2]

      arraybulansasak.push(data);
    }
  }else{
    console.log("this neg (sudah lewat tanggal 1 pada tahun ini)");
    for (let i=0;i<12;i++){
      const stringdata1 = "Mangse "+ namamangse[i];
      const stringdata2 = "Example";
      const data = [stringdata1,stringdata2]

      arraybulansasak.push(data);
    }
  }
  console.log(arraybulansasak)
}