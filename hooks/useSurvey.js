"use client";
import { useState, useEffect } from 'react';
import { surveyService } from '../services/surveyService';

export const useSurvey = (initialPage = 1, limit = 5) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => setNotification({ message, type });

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const result = await surveyService.getAllSurveys();
      setData(result || []);
    } catch (err) {
      showToast(err.message, "error");
    } finally { setLoading(false); }
  };

  const fetchQuestions = async (idInteger) => {
    setLoading(true);
    try {
      const response = await surveyService.getQuestionsBySurvey(idInteger);
      return response;
    } catch (err) {
      showToast("Gagal memuat pertanyaan", "error");
      return null;
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchSurveys(); }, []);

  const addSurvey = async (formData, surveyId = null) => {
    try {
      setLoading(true);
      surveyId ? await surveyService.updateSurvey(surveyId, formData) : await surveyService.saveSurvey(formData);
      showToast("Survey berhasil disimpan!");
      await fetchSurveys();
    } catch (err) { showToast(err.message, "error"); throw err; }
    finally { setLoading(false); }
  };

  const removeSurvey = async (surveyId) => {
    try {
      await surveyService.deleteSurvey(surveyId);
      showToast("Survey berhasil dihapus!");
      await fetchSurveys();
    } catch (err) { showToast(err.message, "error"); }
  };

  const manageQuestion = async (surveyIdMongo, questionData, questionId = null) => {
    try {
      setLoading(true);
      questionId
        ? await surveyService.updateQuestion(surveyIdMongo, questionId, questionData)
        : await surveyService.saveQuestion(surveyIdMongo, questionData);
      showToast("Pertanyaan berhasil disimpan!");
    } catch (err) { showToast(err.message, "error"); throw err; }
    finally { setLoading(false); }
  };

  const removeQuestion = async (surveyIdMongo, questionId) => {
    try {
      await surveyService.deleteQuestion(surveyIdMongo, questionId);
      showToast("Pertanyaan dihapus!");
    } catch (err) { showToast(err.message, "error"); }
  };

  return {
    data, loading, setLoading, notification, setNotification,
    addSurvey, removeSurvey, manageQuestion, removeQuestion, fetchQuestions
  };
};