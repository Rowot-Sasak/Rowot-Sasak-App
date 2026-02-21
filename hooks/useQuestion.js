"use client";
import { useState } from 'react';
import { questionService } from '../services/questionService';
import { answerService } from '../services/answerService';
import { userService } from '../services/userService';

export const useQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getSurveyQuestions = async (id) => {
    setLoading(true);
    try {
      const response = await questionService.getQuestionsBySurvey(id);
      return response;
    } catch (err) {
      showToast(err.message || "Gagal memuat pertanyaan", "error");
      return { questions: [] };
    } finally {
      setLoading(false);
    }
  };

  const manageQuestion = async (surveyId, payload, questionId = null) => {
    setLoading(true);
    try {
      if (questionId) {
        await questionService.updateQuestion(surveyId, questionId, payload);
        showToast("Pertanyaan berhasil diperbarui");
      } else {
        await questionService.saveQuestion(surveyId, payload);
        showToast("Pertanyaan berhasil ditambahkan");
      }
      return true;
    } catch (err) {
      showToast(err.message || "Gagal menyimpan pertanyaan", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeQuestion = async (surveyId, questionId) => {
    setLoading(true);
    try {
      await questionService.deleteQuestion(surveyId, questionId);
      showToast("Pertanyaan berhasil dihapus");
      return true;
    } catch (err) {
      showToast(err.message || "Gagal menghapus pertanyaan", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSurveyAnswers = async (surveyId) => {
    setLoading(true);
    try {
      const res = await answerService.getAnswersBySurvey(surveyId);
      return res.data;
    } catch (err) {
      showToast(err.message, "error");
      return [];
    } finally { setLoading(false); }
  };

  const getUserDisplayName = async (userId) => {
    try {
      const res = await userService.getUserName(userId);
      console.log("babi", res)
      return res;
    } catch (err) {
      showToast(err.message, "error");
      return [];
    } finally { setLoading(false); }
  };

  return {
    loading,
    notification,
    setNotification,
    getSurveyQuestions,
    getUserDisplayName,
    manageQuestion,
    getSurveyAnswers,
    removeQuestion
  };
};