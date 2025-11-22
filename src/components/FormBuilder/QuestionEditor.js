import { QUESTION_TYPES } from '../../types';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import './QuestionEditor.css';

const QuestionEditor = ({ question, index, total, onUpdate, onDelete, onMove }) => {
  const handleTypeChange = (type) => {
    const updates = { type };
    if (type === QUESTION_TYPES.SINGLE_CHOICE || type === QUESTION_TYPES.MULTIPLE_CHOICE) {
      updates.options = question.options.length > 0
        ? question.options
        : [{ id: Date.now().toString(), text: '' }];
    } else if (type === QUESTION_TYPES.SCALE) {
      updates.scale = question.scale || { min: 1, max: 5, minLabel: '', maxLabel: '' };
    }
    onUpdate(question.id, updates);
  };

  const addOption = () => {
    const newOption = { id: Date.now().toString(), text: '' };
    onUpdate(question.id, {
      options: [...(question.options || []), newOption]
    });
  };

  const updateOption = (optionId, text) => {
    onUpdate(question.id, {
      options: question.options.map(opt =>
        opt.id === optionId ? { ...opt, text } : opt
      )
    });
  };

  const deleteOption = (optionId) => {
    onUpdate(question.id, {
      options: question.options.filter(opt => opt.id !== optionId)
    });
  };

  const needsOptions = question.type === QUESTION_TYPES.SINGLE_CHOICE ||
    question.type === QUESTION_TYPES.MULTIPLE_CHOICE;

  return (
    <div className="question-editor">
      <div className="question-header">
        <div className="question-number">{index + 1}</div>
        <div className="question-controls">
          <button
            className="btn-icon-small"
            onClick={() => onMove(question.id, 'up')}
            disabled={index === 0}
            title="Move Up"
          >
            ↑
          </button>
          <button
            className="btn-icon-small"
            onClick={() => onMove(question.id, 'down')}
            disabled={index === total - 1}
            title="Move Down"
          >
            ↓
          </button>
          <button
            className="btn-icon-small danger"
            onClick={() => onDelete(question.id)}
            title="Delete Question"
          >
            ×
          </button>
        </div>
      </div>

      <Input
        value={question.title}
        onChange={(e) => onUpdate(question.id, { title: e.target.value })}
        placeholder="Текст питання"
        className="question-title-wrapper"
      />

      <select
        className="question-type-select"
        value={question.type}
        onChange={(e) => handleTypeChange(e.target.value)}
      >
        <option value={QUESTION_TYPES.TEXT}>Коротка відповідь</option>
        <option value={QUESTION_TYPES.TEXTAREA}>Довга відповідь</option>
        <option value={QUESTION_TYPES.SINGLE_CHOICE}>Вибір одного</option>
        <option value={QUESTION_TYPES.MULTIPLE_CHOICE}>Вибір кількох</option>
        <option value={QUESTION_TYPES.SCALE}>Шкала</option>
        <option value={QUESTION_TYPES.EMAIL}>Email</option>
        <option value={QUESTION_TYPES.NUMBER}>Число</option>
        <option value={QUESTION_TYPES.DATE}>Дата</option>
      </select>

      {needsOptions && (
        <div className="options-editor">
          {question.options?.map((option, optIndex) => (
            <div key={option.id} className="option-row">
              <Input
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                placeholder={`Варіант ${optIndex + 1}`}
                className="option-input-wrapper"
                style={{ flex: 1 }}
              />
              <button
                className="btn-icon-small"
                onClick={() => deleteOption(option.id)}
                title="Delete Option"
              >
                ×
              </button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={addOption}>
            + Додати варіант
          </Button>
        </div>
      )}

      {question.type === QUESTION_TYPES.SCALE && (
        <div className="scale-editor">
          <div className="scale-inputs">
            <Input
              type="number"
              value={question.scale?.min || 1}
              onChange={(e) => onUpdate(question.id, {
                scale: { ...question.scale, min: parseInt(e.target.value) || 1 }
              })}
              placeholder="Мін"
              style={{ width: '80px', textAlign: 'center' }}
            />
            <span>до</span>
            <Input
              type="number"
              value={question.scale?.max || 5}
              onChange={(e) => onUpdate(question.id, {
                scale: { ...question.scale, max: parseInt(e.target.value) || 5 }
              })}
              placeholder="Макс"
              style={{ width: '80px', textAlign: 'center' }}
            />
          </div>
          <div className="scale-labels">
            <Input
              value={question.scale?.minLabel || ''}
              onChange={(e) => onUpdate(question.id, {
                scale: { ...question.scale, minLabel: e.target.value }
              })}
              placeholder="Мінімальна підпис"
            />
            <Input
              value={question.scale?.maxLabel || ''}
              onChange={(e) => onUpdate(question.id, {
                scale: { ...question.scale, maxLabel: e.target.value }
              })}
              placeholder="Максимальна підпис"
            />
          </div>
        </div>
      )}

      <label className="required-checkbox">
        <input
          type="checkbox"
          checked={question.required}
          onChange={(e) => onUpdate(question.id, { required: e.target.checked })}
        />
        Обов'язкове питання
      </label>
    </div>
  );
};

export default QuestionEditor;

