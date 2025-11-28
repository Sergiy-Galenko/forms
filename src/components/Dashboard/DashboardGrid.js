import React from 'react';
import { Card, CardTitle, CardSubtitle } from '../UI/Card';
import { Button } from '../UI/Button';
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
                <Button variant="primary" onClick={onCreate}>+ Створити</Button>
            </div>
        );
    }

    return (
        <div className="forms-list">
            {forms.map((form) => (
                <Card key={form.id} className="form-row">
                    <div className="form-row-main">
                        <div>
                            <CardTitle>{form.title || 'Без назви'}</CardTitle>
                            <CardSubtitle className="form-meta">
                                {form.status === 'active'
                                    ? 'Активне'
                                    : form.status === 'closed'
                                        ? 'Закрите'
                                        : 'Чернетка'}
                            </CardSubtitle>
                            <p className="form-description">{form.description || 'Без опису'}</p>
                        </div>
                        <div className="form-stats">
                            <span>Перегляди: {form.stats?.totalViews || 0}</span>
                            <span>Відповіді: {form.stats?.totalResponses || 0}</span>
                            <span>Завершення: {form.stats?.completionRate || 0}%</span>
                        </div>
                    </div>
                    <div className="form-row-actions">
                        <Button size="sm" variant="secondary" onClick={() => onView(form)}>Переглянути</Button>
                        <Button size="sm" variant="secondary" onClick={() => onEdit(form)}>Редагувати</Button>
                        <Button size="sm" variant="secondary" onClick={() => onStats(form)}>Статистика</Button>
                        <Button size="sm" variant="secondary" onClick={() => onShare(form)}>Поділитися</Button>
                        <Button size="sm" variant="danger" onClick={() => onDelete(form.id)}>Видалити</Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default DashboardGrid;
