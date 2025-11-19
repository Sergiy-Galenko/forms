import { useState, useEffect } from 'react';
import { useForms } from '../../context/FormsContext';
import { QUESTION_TYPES, FORM_STATUS } from '../../types';
import FormBuilderHeader from './FormBuilderHeader';
import FormBuilderCanvas from './FormBuilderCanvas';
import './FormBuilder.css';

const FormBuilder = () => {
  const { currentForm, createForm, updateForm, setView } = useForms();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [],
    settings: {
      allowAnonymous: true,
      showProgress: true,
      randomizeQuestions: false,
      requireLogin: false
    }
  });

  useEffect(() => {
    if (currentForm) {
      setFormData(currentForm);
    }
  }, [currentForm]);

  const handleSave = () => {
    if (currentForm) {
      updateForm(currentForm.id, formData);
    } else {
      const newForm = createForm(formData);
      setFormData(newForm);
    }
  };

  const handlePublish = () => {
    const updated = { ...formData, status: FORM_STATUS.ACTIVE };
    if (currentForm) {
      updateForm(currentForm.id, updated);
    } else {
      const newForm = createForm(updated);
      setFormData(newForm);
    }
    setView('dashboard');
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: QUESTION_TYPES.TEXT,
      title: '',
      required: false,
      options: [],
      placeholder: ''
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const updateQuestion = (id, updates) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q =>
        q.id === id ? { ...q, ...updates } : q
      )
    });
  };

  const deleteQuestion = (id) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== id)
    });
  };

  const moveQuestion = (id, direction) => {
    const index = formData.questions.findIndex(q => q.id === id);
    if ((direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.questions.length - 1)) {
      return;
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newQuestions = [...formData.questions];
    [newQuestions[index], newQuestions[newIndex]] =
      [newQuestions[newIndex], newQuestions[index]];
    setFormData({ ...formData, questions: newQuestions });
  };

  return (
    <div className="form-builder">
      <FormBuilderHeader
        onBack={() => setView('dashboard')}
        onSave={handleSave}
        onPublish={handlePublish}
      />

      <FormBuilderCanvas
        formData={formData}
        setFormData={setFormData}
        updateQuestion={updateQuestion}
        deleteQuestion={deleteQuestion}
        moveQuestion={moveQuestion}
        addQuestion={addQuestion}
      />
    </div>
  );
};

export default FormBuilder;

