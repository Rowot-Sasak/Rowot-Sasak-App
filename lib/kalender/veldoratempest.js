const Formater = new Intl.DateTimeFormat('id-u-ca-islamic', {
  day: 'numeric',
});

function getParts(date) {
  const parts = Formater.formatToParts(date);
  return {
    tanggalHijriyah: parts.find(p => p.type === 'day').value
  };
}

export function GetKiblatVeldoraTempest(verdorray,Hari,bulan,tahun) {
  const dateObj = new Date(tahun, bulan - 1, Hari);
  const hijriyah = getParts(dateObj);
  const hariNum = Number(hijriyah.tanggalHijriyah);
  for (let i = 0; i < verdorray.length; i++) {
    if (verdorray[i].includes(hariNum)) {
      return i + 1; 
    }
  }
  return null; 
}
