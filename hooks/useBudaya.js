import { useState, useEffect } from 'react';
import { budayaService } from '../services/budayaService';

export const useBudaya = (initialPage = 1, limit = 5) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
  };

  const fetchBudaya = async (page) => {
    setLoading(true);
    try {
      const result = await budayaService.getAll(page, limit);
      setData(result.data || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.page || page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudaya(currentPage);
  }, [currentPage]);

  const addBudaya = async (formData, id = null) => {
    try {
      if (id) {
        await budayaService.updateBudaya(id, formData);
        showToast("Data berhasil diperbarui!");
      } else {
        await budayaService.saveBudaya(formData);
        showToast("Data berhasil ditambahkan!");
      }
      await fetchBudaya(currentPage);
    } catch (err) {
      showToast(err.message || "Gagal menyimpan data", "error");
      throw err;
    }
  };

  const removeBudaya = async (id) => {
    try {
      await budayaService.delete(id);
      showToast("Data berhasil dihapus!");
      fetchBudaya(currentPage);
    } catch (err) {
      alert(err.message);
      showToast(err.message || "Gagal menghapus data", "error");
    }
  };

  return { data, loading, error, notification, setNotification, addBudaya, removeBudaya, currentPage, totalPages, setCurrentPage };
};