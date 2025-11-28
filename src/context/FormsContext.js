import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FORM_STATUS } from '../types';
import { storageService } from '../services/StorageService';

const FormsContext = createContext();

const DEFAULT_SHARE_SETTINGS = {
  isPublic: true,
  passwordEnabled: false,
  password: '',
  limitResponsesEnabled: false,
  maxResponses: null,
  expiresAt: '', // ISO date string
  showResults: false,
  oneResponsePerDevice: false
};

export const useForms = () => {
  const context = useContext(FormsContext);
  if (!context) {
    throw new Error('useForms must be used within FormsProvider');
  }
  return context;
};

export const FormsProvider = ({ children }) => {
  const [forms, setForms] = useState(() => storageService.getForms());
  const [currentForm, setCurrentForm] = useState(null);
  const [view, setView] = useState('dashboard'); // dashboard, create, edit, view, stats

  // Initialize from URL
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;
    const match = path.match(/^\/form\/([^/]+)$/);

    if (match) {
      const formId = match[1];
      const form = forms.find((f) => f.id === formId);
      if (form) {
        setCurrentForm(form);
        setView('view');
      }
    }
  }, [forms]); // Added forms dependency to ensure it runs after initial load if needed

  const createForm = useCallback((formData) => {
    const shareSettings = {
      ...DEFAULT_SHARE_SETTINGS,
      ...(formData.shareSettings || {})
    };

    const newForm = {
      id: Date.now().toString(),
      ...formData,
      shareSettings,
      status: FORM_STATUS.DRAFT,
      createdAt: new Date().toISOString(),
      responses: [],
      stats: {
        totalViews: 0,
        totalResponses: 0,
        completionRate: 0,
        averageTime: 0
      }
    };

    // Use functional update to ensure we have latest state
    setForms(prevForms => {
      const updated = [...prevForms, newForm];
      storageService.saveForms(updated);
      return updated;
    });

    return newForm;
  }, []);

  const updateForm = useCallback((id, updates) => {
    setForms(prevForms => {
      const updated = prevForms.map(form =>
        form.id === id ? { ...form, ...updates } : form
      );
      storageService.saveForms(updated);

      // Update current form if it's the one being modified
      if (currentForm?.id === id) {
        setCurrentForm(updated.find(f => f.id === id));
      }

      return updated;
    });
  }, [currentForm]);

  const deleteForm = useCallback((id) => {
    setForms(prevForms => {
      const updated = prevForms.filter(form => form.id !== id);
      storageService.saveForms(updated);
      return updated;
    });

    if (currentForm?.id === id) {
      setCurrentForm(null);
      setView('dashboard');
    }
  }, [currentForm]);

  const addResponse = useCallback(async (formId, response) => {
    // Fetch IP if needed (best effort)
    let clientIp = null;
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      if (ipRes.ok) {
        const data = await ipRes.json();
        clientIp = data.ip;
      }
    } catch (e) {
      console.warn('Failed to fetch client IP:', e);
    }

    setForms(prevForms => {
      const form = prevForms.find(f => f.id === formId);
      if (!form) return prevForms;

      const newResponse = {
        id: Date.now().toString(),
        ...response,
        submittedAt: new Date().toISOString(),
        ip: clientIp
      };

      const responses = [...form.responses, newResponse];
      const stats = calculateStats(form, responses);

      const updatedForm = { ...form, responses, stats };

      const updatedForms = prevForms.map(f =>
        f.id === formId ? updatedForm : f
      );

      storageService.saveForms(updatedForms);
      return updatedForms;
    });
  }, []);

  const calculateStats = (form, responses) => {
    const totalResponses = responses.length;
    const totalViews = form.stats?.totalViews || 0;
    const completionRate = totalViews > 0
      ? Math.round((totalResponses / totalViews) * 100)
      : 0;

    // Calculate average time (mock for now)
    const averageTime = totalResponses > 0 ? Math.floor(Math.random() * 300 + 120) : 0;

    return {
      totalViews: totalViews + 1,
      totalResponses,
      completionRate,
      averageTime
    };
  };

  const value = {
    forms,
    currentForm,
    view,
    setView,
    setCurrentForm,
    createForm,
    updateForm,
    deleteForm,
    addResponse,
    updateFormStats: (formId, stats) => {
      updateForm(formId, { stats });
    }
  };

  return <FormsContext.Provider value={value}>{children}</FormsContext.Provider>;
};

