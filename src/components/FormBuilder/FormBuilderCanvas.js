import React from 'react';
import QuestionEditor from './QuestionEditor';
import { Input, TextArea } from '../UI/Input';
import { Button } from '../UI/Button';
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
