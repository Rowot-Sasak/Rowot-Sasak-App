import { useState, useEffect } from 'react';
import { eventService } from '../services/eventServeice';

export const useEvent = (initialPage = 1, limit = 5) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
  };

  const fetchEvent = async (page) => {
    setLoading(true);
    try {
      const result = await eventService.getAll(page, limit);
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
    fetchEvent(currentPage);
  }, [currentPage]);

  const addEvent = async (formData, id = null) => {
    try {
      if (id) {
        await eventService.updateEvent(id, formData);
        showToast("Data berhasil diperbarui!");
      } else {
        await eventService.saveEvent(formData);
        showToast("Data berhasil ditambahkan!");
      }
      await fetchEvent(currentPage);
    } catch (err) {
      showToast(err.message || "Gagal menyimpan data", "error");
      throw err;
    }
  };

  const removeEvent = async (id) => {
    try {
      await eventService.delete(id);
      showToast("Data berhasil dihapus!");
      fetchEvent(currentPage);
    } catch (err) {
      showToast(err.message || "Gagal menyimpan data", "error");
      alert(err.message);
    }
  };

  return { data, loading, error, notification, setNotification, addEvent, removeEvent, currentPage, totalPages, setCurrentPage };
};