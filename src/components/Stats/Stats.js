import { useForms } from '../../context/FormsContext';
import { QUESTION_TYPES } from '../../types';
import StatsSummary from './StatsSummary';
import StatsChart from './StatsChart';
import StatsResponses from './StatsResponses';
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

      <StatsSummary stats={stats} />

      <StatsChart
        currentForm={currentForm}
        getQuestionStats={getQuestionStats}
        responses={responses}
      />

      <StatsResponses
        responses={responses}
        currentForm={currentForm}
      />
    </div>
  );
};

export default Stats;

