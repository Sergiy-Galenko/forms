import { useState } from 'react';
import { useForms } from '../../context/FormsContext';
import { QUESTION_TYPES } from '../../types';
import './FormView.css';

const FormView = () => {
  const { currentForm, addResponse, updateFormStats, setView } = useForms();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!currentForm) {
    return <div>Опитування не знайдено</div>;
  }

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required questions
    const requiredQuestions = currentForm.questions.filter(q => q.required);
    const missing = requiredQuestions.filter(q => !answers[q.id] || 
      (Array.isArray(answers[q.id]) && answers[q.id].length === 0));
    
    if (missing.length > 0) {
      alert('Будь ласка, заповніть всі обов\'язкові питання');
      return;
    }

    addResponse(currentForm.id, { answers });
    updateFormStats(currentForm.id, {
      ...currentForm.stats,
      totalViews: (currentForm.stats?.totalViews || 0) + 1
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form-view">
        <div className="form-container">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Дякуємо за відповідь!</h2>
            <p>Ваші відповіді успішно збережено.</p>
            <button className="btn-primary" onClick={() => setView('dashboard')}>
              Повернутися до дашборду
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-view">
      <div className="form-container">
        <div className="form-header">
          <h1>{currentForm.title}</h1>
          {currentForm.description && (
            <p className="form-description">{currentForm.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          {currentForm.questions.map((question, index) => (
            <div key={question.id} className="question-block">
              <label className="question-label">
                {index + 1}. {question.title}
                {question.required && <span className="required">*</span>}
              </label>

              {question.type === QUESTION_TYPES.TEXT && (
                <input
                  type="text"
                  className="form-input"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  required={question.required}
                />
              )}

              {question.type === QUESTION_TYPES.TEXTAREA && (
                <textarea
                  className="form-textarea"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  rows="4"
                  required={question.required}
                />
              )}

              {question.type === QUESTION_TYPES.SINGLE_CHOICE && (
                <div className="options-list">
                  {question.options?.map((option) => (
                    <label key={option.id} className="radio-option">
                      <input
                        type="radio"
                        name={question.id}
                        value={option.text}
                        checked={answers[question.id] === option.text}
                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                        required={question.required}
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
                <div className="options-list">
                  {question.options?.map((option) => (
                    <label key={option.id} className="checkbox-option">
                      <input
                        type="checkbox"
                        checked={(answers[question.id] || []).includes(option.text)}
                        onChange={(e) => {
                          const current = answers[question.id] || [];
                          const updated = e.target.checked
                            ? [...current, option.text]
                            : current.filter(v => v !== option.text);
                          handleAnswer(question.id, updated);
                        }}
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === QUESTION_TYPES.SCALE && (
                <div className="scale-input">
                  <div className="scale-labels">
                    {question.scale?.minLabel && (
                      <span className="scale-label-min">{question.scale.minLabel}</span>
                    )}
                    {question.scale?.maxLabel && (
                      <span className="scale-label-max">{question.scale.maxLabel}</span>
                    )}
                  </div>
                  <input
                    type="range"
                    min={question.scale?.min || 1}
                    max={question.scale?.max || 5}
                    value={answers[question.id] || question.scale?.min || 1}
                    onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                    className="scale-slider"
                    required={question.required}
                  />
                  <div className="scale-value">
                    {answers[question.id] || question.scale?.min || 1}
                  </div>
                </div>
              )}

              {question.type === QUESTION_TYPES.EMAIL && (
                <input
                  type="email"
                  className="form-input"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  required={question.required}
                />
              )}

              {question.type === QUESTION_TYPES.NUMBER && (
                <input
                  type="number"
                  className="form-input"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  required={question.required}
                />
              )}

              {question.type === QUESTION_TYPES.DATE && (
                <input
                  type="date"
                  className="form-input"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  required={question.required}
                />
              )}
            </div>
          ))}

          <div className="form-footer">
            <button type="submit" className="btn-primary btn-submit">
              Відправити
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormView;

