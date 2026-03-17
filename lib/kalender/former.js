import { getnamabulanhijriyah, GetVeldoraTempest, GetTahunHijriyah, getkalebulan, getjelokale, GetWuku, GetMangse, GetJelosolah} from "./Bulan";
import { GetKiblatVeldoraTempest } from "./veldoratempest";
import { getnamatahun } from "./tahunsasak";
import Holidays from 'date-holidays';   
import { getHari } from "./harian";

export function GetKalender(Bulan,Tahun,hari) {

    const { hijriyahYear, isPergantianTahun } = GetTahunHijriyah(Bulan, Tahun);
    const hd = new Holidays('ID');
    const semuaLibur = hd.getHolidays(Tahun);
    const harilibur = semuaLibur
        .filter(h => (new Date(h.date).getMonth()) === (Bulan-1)) 
        .map(h => ({
            tanggal: new Date(h.date).getDate(),
            keterangan: h.name
        }));
    const veldoratempest =  GetVeldoraTempest(Bulan,Tahun);
    const _wuku = GetWuku(Bulan,Tahun);
    return {
        TahunHijriyah: isPergantianTahun ? `${hijriyahYear}/${hijriyahYear + 1}`: hijriyahYear,
        TahunSasak: getnamatahun(hijriyahYear, isPergantianTahun),
        BulanHijriyah: getnamabulanhijriyah(Bulan,Tahun),
        BulanSasak:getkalebulan(Bulan,Tahun),
        Wuku : _wuku,
        JeloKale:getjelokale(Bulan,Tahun),
        JeloSolah:GetJelosolah(Bulan,Tahun,_wuku),
        HariLibur: harilibur,
        Mangse:GetMangse(Bulan,Tahun),
        KiblatVeldora:GetKiblatVeldoraTempest(veldoratempest,hari,Bulan,Tahun),
        VeldoraTempestArray : veldoratempest,
        Hari: getHari(Bulan, Tahun, harilibur.map(h => h.tanggal))
    };
}
