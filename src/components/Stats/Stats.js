import { useForms } from '../../context/FormsContext';
import { QUESTION_TYPES } from '../../types';
import './Stats.css';

const Stats = () => {
  const { currentForm, setView } = useForms();

  if (!currentForm) {
    return <div>Опитування не знайдено</div>;
  }

  const stats = currentForm.stats || {};
  const responses = currentForm.responses || [];

  const getQuestionStats = (question) => {
    if (!responses.length) return null;

    const answers = responses.map(r => r.answers[question.id]).filter(Boolean);

    if (question.type === QUESTION_TYPES.SINGLE_CHOICE || 
        question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
      const counts = {};
      answers.forEach(answer => {
        const values = Array.isArray(answer) ? answer : [answer];
        values.forEach(v => {
          counts[v] = (counts[v] || 0) + 1;
        });
      });
      return counts;
    }

    if (question.type === QUESTION_TYPES.SCALE) {
      const values = answers.map(a => parseInt(a)).filter(v => !isNaN(v));
      if (values.length === 0) return null;
      const sum = values.reduce((a, b) => a + b, 0);
      return {
        average: (sum / values.length).toFixed(1),
        min: Math.min(...values),
        max: Math.max(...values),
        values
      };
    }

    return { total: answers.length };
  };

  return (
    <div className="stats-page">
      <div className="stats-header">
        <button className="btn-secondary" onClick={() => setView('dashboard')}>
          ← Назад
        </button>
        <div>
          <h1>{currentForm.title}</h1>
          <p className="stats-subtitle">Статистика та аналітика</p>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-label">Переглядів</div>
          <div className="stat-value">{stats.totalViews || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Відповідей</div>
          <div className="stat-value">{stats.totalResponses || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Завершення</div>
          <div className="stat-value">{stats.completionRate || 0}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Середній час</div>
          <div className="stat-value">{stats.averageTime || 0}с</div>
        </div>
      </div>

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
                  {question.type === QUESTION_TYPES.SINGLE_CHOICE || 
                   question.type === QUESTION_TYPES.MULTIPLE_CHOICE ? (
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

      {responses.length > 0 && (
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
      )}
    </div>
  );
};

export default Stats;

