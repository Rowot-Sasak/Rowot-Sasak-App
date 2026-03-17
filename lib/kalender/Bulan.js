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

const namamangse = [
  "Saq","Duwe","Telu","Empat",
  "Lime","Enem","Pituq","Baluq",
  "Siwaq","Sepulu","Solas","Duwe Olas"
];

const mangseHari = [41, 24, 24, 25, 35, 33, 41, 26, 24, 24, 23, 40];

const formatDayMonth = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long"
});

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

export function GetMangse(bulan, tahun,second=false) {
  const tanggalawal = 5+(tahun%3)*10;
  const indexbulan = (Math.floor((tahun-1995)/3))%12;
  const dateh = `${tahun-579}-${indexbulan+1}-${tanggalawal}`;
  const masehi = moment(dateh, "iYYYY-iMM-iDD").toDate();

  let tanggal1,ceker;
  if(second){
    tanggal1 = new Date(tahun+1, bulan - 1, 1);
    ceker=tahun+1;
  }else{
    tanggal1 = new Date(tahun, bulan - 1, 1);
    ceker=tahun;
  }
  const diffday = masehi - tanggal1;
  let arraybulansasak=[];
  let awal = new Date(masehi);
  let akhir = new Date(masehi);
  if(diffday>0){
    return GetMangse(bulan,tahun-1,true)
  }
  for (let i=0;i<12;i++){
    awal = new Date(akhir.getFullYear(),akhir.getMonth(),akhir.getDate()+1);
    akhir = new Date(awal.getTime() + ((mangseHari[i]-1) * 86400000));
    const stringdata1 = "Mangse "+ namamangse[i]+" ("+mangseHari[i]+")";
    const stringdata2 = formatDayMonth.format(awal)+"/"+getHariHijriyah(awal)+" "+namabulan[getBulanHijriyah(awal)-1] +" - " +formatDayMonth.format(akhir)+"/"+getHariHijriyah(akhir)+" "+namabulan[getBulanHijriyah(akhir)-1] ;
    const data = [stringdata1,stringdata2]
    if(
      awal.getMonth()==bulan-1&&ceker==awal.getFullYear()||
      akhir.getMonth()==bulan-1&&ceker==akhir.getFullYear()||
      awal.getMonth()<=bulan-1&&akhir.getMonth()>=bulan-1&&ceker==awal.getFullYear()
    ){
      arraybulansasak.push(data);
    }
  }
  const tanggallast = new Date(tahun, bulan , 0);
  const diffday2 = masehi - tanggallast;
  if((diffday*diffday2)<=0){
    return arraybulansasak;
  }else{
    const tahun2 = tahun+1;
    const tanggalawal = 5+(tahun2%3)*10;
    const indexbulan = (Math.floor((tahun2-1995)/3))%12;
    const dateh = `${tahun2-579}-${indexbulan+1}-${tanggalawal}`;

    akhir = new Date(moment(dateh, "iYYYY-iMM-iDD").toDate());
    awal = new Date(akhir.getFullYear(),akhir.getMonth(),akhir.getDate()+1);
    akhir = new Date(awal.getTime() + ((mangseHari[0]-1) * 86400000));
    
    const stringdata1 = "Mangse "+ namamangse[0]+" ("+mangseHari[0]+")";
    const stringdata2 = formatDayMonth.format(awal)+"/"+getHariHijriyah(awal)+" "+namabulan[getBulanHijriyah(awal)-1] +" - " +formatDayMonth.format(akhir)+"/"+getHariHijriyah(akhir)+" "+namabulan[getBulanHijriyah(akhir)-1] ;
    const data = [stringdata1,stringdata2];

    arraybulansasak.push(data);
    return arraybulansasak;
  }
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
export function GetJelosolah(bulan, tahun, wuku) {
  const hari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

  function getHari(index) {
    return hari[(index + 7) % 7];
  }

  const tabel = [];

  for (let i = 0; i < 6; i++) {
    const base = i;

    tabel.push([
      [getHari(base + 1)],              
      [getHari(base + 2)],                  
      [getHari(base + 6), getHari(base + 0)], 
      [getHari(base + 3)]                     
    ]);
  }

  return tabel;
}
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
