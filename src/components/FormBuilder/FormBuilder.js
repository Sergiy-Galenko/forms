import { useState, useEffect } from 'react';
import { useForms } from '../../context/FormsContext';
import { useExperience } from '../../context/ExperienceContext';
import { QUESTION_TYPES, FORM_STATUS } from '../../types';
import FormBuilderHeader from './FormBuilderHeader';
import FormBuilderCanvas from './FormBuilderCanvas';
import './FormBuilder.css';

const FormBuilder = () => {
  const { currentForm, createForm, updateForm, setView } = useForms();
  const { experience } = useExperience();
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

  const addQuestion = (type = QUESTION_TYPES.TEXT) => {
    const base = {
      id: Date.now().toString(),
      type,
      title: '',
      required: false,
      options: [],
      placeholder: ''
    };

    if (type === QUESTION_TYPES.SINGLE_CHOICE || type === QUESTION_TYPES.MULTIPLE_CHOICE) {
      base.options = [
        { id: `${Date.now()}-1`, text: 'Варіант 1' },
        { id: `${Date.now()}-2`, text: 'Варіант 2' }
      ];
    }

    if (type === QUESTION_TYPES.SCALE) {
      base.scale = { min: 1, max: 5, minLabel: 'Мін', maxLabel: 'Макс' };
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, base]
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

  const checklist = [
    { label: 'Додайте назву', done: formData.title.trim().length > 2 },
    { label: 'Є хоча б одне питання', done: formData.questions.length > 0 },
    { label: 'Позначте важливе як обов’язкове', done: formData.questions.some((q) => q.required) }
  ];

  const readiness = Math.round(
    (checklist.filter((item) => item.done).length / checklist.length) * 100
  );

  return (
    <div className="form-builder">
      <FormBuilderHeader
        onBack={() => setView('dashboard')}
        onSave={handleSave}
        onPublish={handlePublish}
        readiness={readiness}
        checklist={checklist}
      />

      {experience.guidedMode && (
        <div className="builder-guided">
          <div className="guided-dot" aria-hidden="true">🧭</div>
          <div>
            <p className="guided-title">Почніть із трьох простих кроків</p>
            <ul>
              <li>Назвіть опитування зрозуміло для будь-якого віку.</li>
              <li>Додайте питання або виберіть готовий шаблон варіантів.</li>
              <li>Перевірте обов’язкові поля й натисніть «Опублікувати».</li>
            </ul>
          </div>
        </div>
      )}

      <FormBuilderCanvas
        formData={formData}
        setFormData={setFormData}
        updateQuestion={updateQuestion}
        deleteQuestion={deleteQuestion}
        moveQuestion={moveQuestion}
        addQuestion={addQuestion}
        guidedMode={experience.guidedMode}
      />
    </div>
  );
};

export default FormBuilder;
