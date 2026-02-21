const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const userService = {
    getUserName: async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/user?userId=${userId}`, {
                method: "GET",
                headers: getAuthHeader()
            });
            if (!res.ok) return "User tidak ditemukan";
            const data = await res.json();
            console.log("psuing2", data)
            return data.name;
        } catch (error) {
            return "Gagal memuat nama";
        }
    }
};