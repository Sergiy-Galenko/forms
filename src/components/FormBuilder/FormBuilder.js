import { useState, useEffect } from 'react';
import { useForms } from '../../context/FormsContext';
import { QUESTION_TYPES, FORM_STATUS } from '../../types';
import QuestionEditor from './QuestionEditor';
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
      <div className="builder-header">
        <button className="btn-secondary" onClick={() => setView('dashboard')}>
          ← Назад
        </button>
        <div className="builder-actions">
          <button className="btn-secondary" onClick={handleSave}>
            Зберегти
          </button>
          <button className="btn-primary" onClick={handlePublish}>
            Опублікувати
          </button>
        </div>
      </div>

      <div className="builder-content">
        <div className="form-settings">
          <input
            type="text"
            className="form-title-input"
            placeholder="Назва опитування"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            className="form-description-input"
            placeholder="Опис опитування (необов'язково)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="2"
          />
        </div>

        <div className="questions-list">
          {formData.questions.map((question, index) => (
            <QuestionEditor
              key={question.id}
              question={question}
              index={index}
              total={formData.questions.length}
              onUpdate={updateQuestion}
              onDelete={deleteQuestion}
              onMove={moveQuestion}
            />
          ))}
        </div>

        <button className="btn-add-question" onClick={addQuestion}>
          + Додати питання
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;

