import React from 'react';
import QuestionEditor from './QuestionEditor';
import './FormBuilder.css';

const FormBuilderCanvas = ({
    formData,
    setFormData,
    updateQuestion,
    deleteQuestion,
    moveQuestion,
    addQuestion
}) => {
    return (
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
    );
};

export default FormBuilderCanvas;
