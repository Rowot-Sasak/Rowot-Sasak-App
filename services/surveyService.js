const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const surveyService = {
    getAllSurveys: async () => {
        const res = await fetch(`/api/surveys`);
        if (!res.ok) throw new Error("Gagal mengambil data survey");
        return res.json();
    },

    saveSurvey: async (payload) => {
        const res = await fetch("/api/admin/surveys", {
            method: "POST",
            headers: getAuthHeader(),
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Gagal menyimpan survey");
        }
        return res.json();
    },

    updateSurvey: async (surveyId, payload) => {
        const res = await fetch("/api/admin/surveys", {
            method: "PUT",
            headers: getAuthHeader(),
            body: JSON.stringify({ surveyId, ...payload }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Gagal memperbarui survey");
        }
        return res.json();
    },

    deleteSurvey: async (surveyId) => {
        const res = await fetch("/api/admin/surveys", {
            method: "DELETE",
            headers: getAuthHeader(),
            body: JSON.stringify({ surveyId }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Gagal menghapus survey");
        }
        return res.json();
    },
};