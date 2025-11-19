import React from 'react';
import './Stats.css';

const StatsSummary = ({ stats }) => {
    return (
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
    );
};

export default StatsSummary;
