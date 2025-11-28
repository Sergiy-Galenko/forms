import React from 'react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import './Dashboard.css';

const DashboardHeader = ({
    formsCount,
    filteredCount,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    onCreate
}) => {
    return (
        <div className="dashboard-header">
            <div className="dashboard-header-main">
                <h1>Ваші опитування</h1>
                <p className="subtitle">
                    {formsCount} всього · {filteredCount} у списку
                </p>
            </div>
            <div className="dashboard-controls">
                <div className="dashboard-filters">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Пошук за назвою або описом..."
                        className="dashboard-search-wrapper"
                    />
                    <div className="status-pills" role="group" aria-label="Фільтр за статусом">
                        <button
                            type="button"
                            className={`pill ${statusFilter === 'all' ? 'is-active' : ''}`}
                            onClick={() => setStatusFilter('all')}
                        >
                            Усі
                        </button>
                        <button
                            type="button"
                            className={`pill ${statusFilter === 'active' ? 'is-active' : ''}`}
                            onClick={() => setStatusFilter('active')}
                        >
                            Активні
                        </button>
                        <button
                            type="button"
                            className={`pill ${statusFilter === 'draft' ? 'is-active' : ''}`}
                            onClick={() => setStatusFilter('draft')}
                        >
                            Чернетки
                        </button>
                        <button
                            type="button"
                            className={`pill ${statusFilter === 'closed' ? 'is-active' : ''}`}
                            onClick={() => setStatusFilter('closed')}
                        >
                            Закриті
                        </button>
                    </div>
                </div>
                <Button variant="primary" onClick={onCreate}>
                    + Створити опитування
                </Button>
            </div>
        </div>
    );
};

export default DashboardHeader;
