import { createContext, useContext, useState, useCallback } from 'react';
import { FORM_STATUS } from '../types';

const FormsContext = createContext();

export const useForms = () => {
  const context = useContext(FormsContext);
  if (!context) {
    throw new Error('useForms must be used within FormsProvider');
  }
  return context;
};

export const FormsProvider = ({ children }) => {
  const [forms, setForms] = useState(() => {
    const saved = localStorage.getItem('forms');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentForm, setCurrentForm] = useState(null);
  const [view, setView] = useState('dashboard'); // dashboard, create, edit, view, stats

  const saveForms = useCallback((newForms) => {
    setForms(newForms);
    localStorage.setItem('forms', JSON.stringify(newForms));
  }, []);

  const createForm = useCallback((formData) => {
    const newForm = {
      id: Date.now().toString(),
      ...formData,
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
    const updated = [...forms, newForm];
    saveForms(updated);
    return newForm;
  }, [forms, saveForms]);

  const updateForm = useCallback((id, updates) => {
    const updated = forms.map(form => 
      form.id === id ? { ...form, ...updates } : form
    );
    saveForms(updated);
    if (currentForm?.id === id) {
      setCurrentForm(updated.find(f => f.id === id));
    }
  }, [forms, saveForms, currentForm]);

  const deleteForm = useCallback((id) => {
    const updated = forms.filter(form => form.id !== id);
    saveForms(updated);
    if (currentForm?.id === id) {
      setCurrentForm(null);
      setView('dashboard');
    }
  }, [forms, saveForms, currentForm]);

  const addResponse = useCallback((formId, response) => {
    const form = forms.find(f => f.id === formId);
    if (!form) return;

    const newResponse = {
      id: Date.now().toString(),
      ...response,
      submittedAt: new Date().toISOString()
    };

    const updated = forms.map(f => {
      if (f.id === formId) {
        const responses = [...f.responses, newResponse];
        const stats = calculateStats(f, responses);
        return { ...f, responses, stats };
      }
      return f;
    });

    saveForms(updated);
  }, [forms, saveForms]);

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

