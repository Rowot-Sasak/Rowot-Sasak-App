const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const questionService = {
  getQuestionsBySurvey: async (surveyId) => {
    const res = await fetch(`/api/questions?survey_id=${surveyId}`);
    if (!res.ok) throw new Error("Gagal mengambil pertanyaan");
    return res.json();
  },

  saveQuestion: async (surveyId, payload) => {
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ surveyId, ...payload }),
    });
    if (!res.ok) throw new Error("Gagal menambah pertanyaan");
    return res.json();
  },

  updateQuestion: async (surveyId, questionId, payload) => {
    const res = await fetch("/api/admin/questions", {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify({
        surveyId,
        questionId: Number(questionId),
        question: payload.question,
        choices: payload.choices,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal memperbarui pertanyaan");
    }
    return res.json();
  },

  deleteQuestion: async (surveyId, questionId) => {
    const res = await fetch("/api/admin/questions", {
      method: "DELETE",
      headers: getAuthHeader(),
      body: JSON.stringify({ surveyId, questionId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal menghapus pertanyaan");
    }
    return res.json();
  },
};
