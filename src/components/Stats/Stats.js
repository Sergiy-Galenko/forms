import { useForms } from '../../context/FormsContext';
import StatsSummary from './StatsSummary';
import StatsChart from './StatsChart';
import StatsResponses from './StatsResponses';
import { Button } from '../UI/Button';
import './Stats.css';

import { getQuestionStats } from '../../utils/statsUtils';

const Stats = () => {
  const { currentForm, setView } = useForms();

  if (!currentForm) {
    return <div>Опитування не знайдено</div>;
  }

  const stats = currentForm.stats || {};
  const responses = currentForm.responses || [];


  return (
    <div className="stats-page">
      <div className="stats-header">
        <Button variant="secondary" onClick={() => setView('dashboard')}>
          ← Назад
        </Button>
        <div>
          <h1>{currentForm.title}</h1>
          <p className="stats-subtitle">Статистика та аналітика</p>
        </div>
      </div>

      <StatsSummary stats={stats} />

      <StatsChart
        currentForm={currentForm}
        getQuestionStats={(q) => getQuestionStats(q, responses)}
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

