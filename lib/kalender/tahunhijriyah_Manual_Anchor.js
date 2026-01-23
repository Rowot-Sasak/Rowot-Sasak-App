const ANCHOR = {
  bulan: 6,     
  tahun: 2025,
  hijriyahYear: 1447
};

const HIJRIYAH_YEAR_DAYS = 354;
const DAY_MS = 86400000;

function daysBetween(bulan, tahun, anchor) {
  const date = new Date(tahun, bulan - 1, 1);
  const anchorDate = new Date(anchor.tahun, anchor.bulan - 1, 1);
  return Math.floor((date - anchorDate) / DAY_MS);
}

export function GetTahunHijriyah(bulan, tahun) {
  const diffDay = daysBetween(bulan, tahun, ANCHOR);
  const yearOffset = Math.floor(diffDay / HIJRIYAH_YEAR_DAYS);

  const hijriyahYear = ANCHOR.hijriyahYear + yearOffset;

  const startHijriyahMonth = new Date(
    new Date(ANCHOR.tahun, ANCHOR.bulan - 1, 1).getTime() +
    yearOffset * HIJRIYAH_YEAR_DAYS * DAY_MS
  );
  const isPergantianTahun =
    startHijriyahMonth.getMonth() + 1 === bulan &&
    startHijriyahMonth.getFullYear() === tahun;

  return {
    hijriyahYear,
    isPergantianTahun
  };
  
}
