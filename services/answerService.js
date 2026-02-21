const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const answerService = {
    getAnswersBySurvey: async (surveyId) => {
        const res = await fetch(`/api/admin/answer?surveyId=${surveyId}`, {
            method: "GET",
            headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error("Gagal mengambil data jawaban");
        return res.json();
    },
};