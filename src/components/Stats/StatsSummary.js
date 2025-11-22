import React from 'react';
import { Card } from '../UI/Card';
import './Stats.css';

const StatsSummary = ({ stats }) => {
    return (
        <div className="stats-overview">
            <Card className="stat-card">
                <div className="stat-label">Переглядів</div>
                <div className="stat-value">{stats.totalViews || 0}</div>
            </Card>
            <Card className="stat-card">
                <div className="stat-label">Відповідей</div>
                <div className="stat-value">{stats.totalResponses || 0}</div>
            </Card>
            <Card className="stat-card">
                <div className="stat-label">Завершення</div>
                <div className="stat-value">{stats.completionRate || 0}%</div>
            </Card>
            <Card className="stat-card">
                <div className="stat-label">Середній час</div>
                <div className="stat-value">{stats.averageTime || 0}с</div>
            </Card>
        </div>
    );
};

export default StatsSummary;
