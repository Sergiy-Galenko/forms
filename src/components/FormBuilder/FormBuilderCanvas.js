import React from 'react';
import QuestionEditor from './QuestionEditor';
import { Input, TextArea } from '../UI/Input';
import { Button } from '../UI/Button';
import { QUESTION_TYPES } from '../../types';
import './FormBuilder.css';

const FormBuilderCanvas = ({
    formData,
    setFormData,
    updateQuestion,
    deleteQuestion,
    moveQuestion,
    addQuestion,
    guidedMode
}) => {
    return (
        <div className="builder-content">
            <div className="form-settings">
                <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Назва опитування"
                    className="form-title-input-wrapper"
                    style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                />
                <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Опис опитування (необов'язково)"
                    rows={2}
                />
            </div>

            <div className="builder-overview">
                <div className="overview-item">
                    <span className="overview-label">Питань</span>
                    <strong className="overview-value">{formData.questions.length}</strong>
                </div>
                <div className="overview-item">
                    <span className="overview-label">Обов’язкових</span>
                    <strong className="overview-value">
                        {formData.questions.filter((q) => q.required).length}
                    </strong>
                </div>
                <div className="overview-item">
                    <span className="overview-label">Типів</span>
                    <strong className="overview-value">
                        {new Set(formData.questions.map((q) => q.type)).size || 0}
                    </strong>
                </div>
            </div>

            <div className="builder-quick-add">
                <div>
                    <p className="quick-title">Додати питання одним кліком</p>
                    {guidedMode && (
                        <p className="quick-helper">
                            Оберіть заготовку: ми автоматично підставимо базові варіанти відповіді.
                        </p>
                    )}
                </div>
                <div className="quick-buttons">
                    <Button variant="secondary" size="sm" onClick={() => addQuestion(QUESTION_TYPES.TEXT)}>
                        Коротка відповідь
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => addQuestion(QUESTION_TYPES.SINGLE_CHOICE)}>
                        Вибір одного
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => addQuestion(QUESTION_TYPES.MULTIPLE_CHOICE)}>
                        Вибір кількох
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => addQuestion(QUESTION_TYPES.SCALE)}>
                        Шкала 1–5
                    </Button>
                </div>
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

            <Button
                variant="ghost"
                className="btn-add-question"
                onClick={addQuestion}
                fullWidth
            >
                + Додати питання
            </Button>
        </div>
    );
};

export default FormBuilderCanvas;
