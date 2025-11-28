import React, { useState } from 'react';
import { useForms } from '../../context/FormsContext';
import { Button } from '../UI/Button';
import StatsSummary from '../Stats/StatsSummary';
import StatsChart from '../Stats/StatsChart';
import { getQuestionStats } from '../../utils/statsUtils';
import './FormView.css';

const FormSuccess = ({ form }) => {
    const { setView, setCurrentForm } = useForms();
    const [showStats, setShowStats] = useState(false);

    const handleBack = () => {
        setCurrentForm(null);
        setView('dashboard');
    };

    if (showStats) {
        return (
            <div className="form-success-stats">
                <div className="success-stats-header">
                    <h2>Результати опитування</h2>
                    <Button variant="secondary" onClick={() => setShowStats(false)}>
                        Назад
                    </Button>
                </div>
                <StatsSummary stats={form.stats || {}} />
                <StatsChart
                    currentForm={form}
                    getQuestionStats={(q) => getQuestionStats(q, form.responses || [])}
                    responses={form.responses || []}
                />
            </div>
        );
    }

    return (
        <div className="form-success">
            <div className="success-card">
                <div className="success-icon">🎉</div>
                <h2>Дякуємо!</h2>
                <p>Вашу відповідь успішно збережено.</p>
                <div className="success-actions">
                    <Button variant="primary" onClick={handleBack}>
                        На головну
                    </Button>
                    {form.shareSettings?.showResults && (
                        <Button variant="secondary" onClick={() => setShowStats(true)}>
                            Переглянути результати
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormSuccess;
