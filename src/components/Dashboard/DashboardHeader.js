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
                <h1>Мої опитування</h1>
                <p className="subtitle">
                    {formsCount} опитувань
                    {filteredCount !== formsCount && (
                        <span className="subtitle-filtered"> · відфільтровано {filteredCount}</span>
                    )}
                </p>
            </div>
            <div className="dashboard-controls">
                <div className="dashboard-filters">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Пошук за назвою або описом..."
                        className="dashboard-search-wrapper"
                        style={{ minWidth: '260px' }}
                    />
                    <select
                        className="dashboard-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Всі статуси</option>
                        <option value="active">Активні</option>
                        <option value="draft">Чернетки</option>
                        <option value="closed">Закриті</option>
                    </select>
                </div>
                <Button variant="primary" onClick={onCreate}>
                    + Створити опитування
                </Button>
            </div>
        </div>
    );
};

export default DashboardHeader;
