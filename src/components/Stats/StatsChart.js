import React from 'react';
import { QUESTION_TYPES } from '../../types';
import './Stats.css';

const StatsChart = ({ currentForm, getQuestionStats, responses }) => {
    return (
        <div className="questions-stats">
            <h2>Статистика по питаннях</h2>
            {currentForm.questions.map((question, index) => {
                const questionStats = getQuestionStats(question);
                return (
                    <div key={question.id} className="question-stats-card">
                        <div className="question-stats-header">
                            <span className="question-number">{index + 1}</span>
                            <h3>{question.title}</h3>
                        </div>

                        {!questionStats ? (
                            <p className="no-data">Поки що немає відповідей</p>
                        ) : (
                            <div className="question-stats-content">
                                {(question.type === QUESTION_TYPES.SINGLE_CHOICE ||
                                    question.type === QUESTION_TYPES.MULTIPLE_CHOICE) ? (
                                    <div className="options-stats">
                                        {question.options?.map((option) => {
                                            const count = questionStats[option.text] || 0;
                                            const percentage = responses.length > 0
                                                ? Math.round((count / responses.length) * 100)
                                                : 0;
                                            return (
                                                <div key={option.id} className="option-stat">
                                                    <div className="option-stat-header">
                                                        <span>{option.text}</span>
                                                        <span className="option-stat-count">
                                                            {count} ({percentage}%)
                                                        </span>
                                                    </div>
                                                    <div className="option-stat-bar">
                                                        <div
                                                            className="option-stat-fill"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : question.type === QUESTION_TYPES.SCALE ? (
                                    <div className="scale-stats">
                                        <div className="scale-stat-item">
                                            <span>Середнє:</span>
                                            <strong>{questionStats.average}</strong>
                                        </div>
                                        <div className="scale-stat-item">
                                            <span>Мін:</span>
                                            <strong>{questionStats.min}</strong>
                                        </div>
                                        <div className="scale-stat-item">
                                            <span>Макс:</span>
                                            <strong>{questionStats.max}</strong>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-stats">
                                        <p>Відповідей: {questionStats.total}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StatsChart;
