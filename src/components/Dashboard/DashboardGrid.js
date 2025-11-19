import React from 'react';
import './Dashboard.css';

const DashboardGrid = ({
    forms,
    onView,
    onEdit,
    onStats,
    onShare,
    onDelete,
    onCreate
}) => {
    if (forms.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h2>Нічого не знайдено</h2>
                <p>Спробуйте змінити критерії пошуку або фільтри</p>
            </div>
        );
    }

    return (
        <div className="forms-grid">
            {forms.map((form) => (
                <div key={form.id} className="form-card">
                    <div className="form-card-header">
                        <div>
                            <h3>{form.title || 'Без назви'}</h3>
                            <p className="form-meta">
                                {form.status === 'active'
                                    ? '🟢 Активне'
                                    : form.status === 'closed'
                                        ? '🔴 Закрите'
                                        : '⚪ Чернетка'}
                            </p>
                        </div>
                        <div className="form-actions">
                            <button
                                className="btn-icon"
                                onClick={() => onView(form)}
                                title="Переглянути"
                            >
                                👁️
                            </button>
                            <button
                                className="btn-icon"
                                onClick={() => onEdit(form)}
                                title="Редагувати"
                            >
                                ✏️
                            </button>
                            <button
                                className="btn-icon"
                                onClick={() => onStats(form)}
                                title="Статистика"
                            >
                                📊
                            </button>
                            <button
                                className="btn-icon"
                                onClick={() => onShare(form)}
                                title="Поділитися"
                            >
                                🔗
                            </button>
                            <button
                                className="btn-icon danger"
                                onClick={() => onDelete(form.id)}
                                title="Видалити"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                    <p className="form-description">{form.description || 'Без опису'}</p>
                    <div className="form-stats">
                        <span>👁️ {form.stats?.totalViews || 0}</span>
                        <span>✅ {form.stats?.totalResponses || 0}</span>
                        <span>📈 {form.stats?.completionRate || 0}%</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardGrid;
