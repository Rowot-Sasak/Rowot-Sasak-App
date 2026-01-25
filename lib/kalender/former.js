import { getnamatahun } from "./tahunsasak";
import { getnamabulanhijriyah } from "./Bulan";
import { GetTahunHijriyah } from "./Bulan";
import { getkalebulan } from "./Bulan";
import { getjelokale } from "./Bulan";
import { getHari } from "./harian";
import Holidays from 'date-holidays';

export function GetKalender(Bulan,Tahun) {
    const { hijriyahYear, isPergantianTahun } = GetTahunHijriyah(Bulan, Tahun);
    const hd = new Holidays('ID');
    const semuaLibur = hd.getHolidays(Tahun);
    const harilibur = semuaLibur
        .filter(h => (new Date(h.date).getMonth() + 1) === Bulan) 
        .map(h => ({
            tanggal: new Date(h.date).getDate(),
            keterangan: h.name
        }));
    return {
        TahunHijriyah: isPergantianTahun ? `${hijriyahYear}/${hijriyahYear + 1}`: hijriyahYear,
        TahunSasak: getnamatahun(hijriyahYear, isPergantianTahun),
        BulanHijriyah: getnamabulanhijriyah(Bulan,Tahun),
        BulanSasak:getkalebulan(Bulan,Tahun),
        JeloKale:getjelokale(Bulan,Tahun),
        HariLibur: harilibur,
        Hari: getHari(Bulan, Tahun, harilibur.map(h => h.tanggal)),
    };
}
