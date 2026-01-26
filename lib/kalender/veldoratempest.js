import { GetVeldoraTempest } from "./Bulan";
/**
 *
 * @param {number} Hari 
 * @param {number} Bulan 
 * @param {number} Tahun 
 * @returns {number} 
 */
export function GetKiblatVeldoraTempest(verdorray,Hari) {
  const hariNum = Number(Hari);
  for (let i = 0; i < verdorray.length; i++) {
    if (verdorray[i].includes(hariNum)) {
      return i + 1; 
    }
  }
  return null; 
}
