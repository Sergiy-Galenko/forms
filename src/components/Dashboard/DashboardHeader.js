import React from 'react';
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
                    <input
                        type="text"
                        className="dashboard-search"
                        placeholder="Пошук за назвою або описом..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                <button className="btn-primary" onClick={onCreate}>
                    + Створити опитування
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
