const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const budayaService = {
  getAll: async (page = 1, limit = 5) => {
    const res = await fetch(`/api/budaya?page=${page}&limit=${limit}`);

    if (!res.ok) throw new Error("Gagal mengambil data");
    return res.json();
  },

  saveBudaya: async (payload) => {
    const res = await fetch("/api/admin/budaya", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal menyimpan data");
    }
    return res.json();
  },

  updateBudaya: async (id, payload) => {
    const res = await fetch("/api/admin/budaya", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id, ...payload }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal memperbarui data");
    }
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch("/api/admin/budaya", {
      method: "DELETE",
      headers: getAuthHeader(),
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Gagal menghapus data");
    return res.json();
  },
};
