import React from 'react';
import './Stats.css';

const StatsResponses = ({ responses, currentForm }) => {
    if (!responses.length) return null;

    return (
        <div className="responses-list">
            <h2>Останні відповіді</h2>
            <div className="responses-grid">
                {responses.slice(-10).reverse().map((response) => (
                    <div key={response.id} className="response-card">
                        <div className="response-date">
                            {new Date(response.submittedAt).toLocaleString('uk-UA')}
                        </div>
                        <div className="response-answers">
                            {Object.entries(response.answers).map(([questionId, answer]) => {
                                const question = currentForm.questions.find(q => q.id === questionId);
                                if (!question) return null;
                                return (
                                    <div key={questionId} className="response-answer">
                                        <strong>{question.title}:</strong>
                                        <span>
                                            {Array.isArray(answer) ? answer.join(', ') : String(answer)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsResponses;
