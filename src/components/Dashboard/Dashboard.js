import React, { useState, useMemo } from 'react';
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { FiSearch } from '@react-icons/all-files/fi/FiSearch';
import { FiGrid } from '@react-icons/all-files/fi/FiGrid';
import { useForms } from '../../context/FormsContext';
import { useDebounce } from '../../hooks/useDebounce';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Card from '../UI/Card';
import FormCard from './FormCard';
import { FORM_STATUS } from '../../types';
import './Dashboard.css';

const Dashboard = () => {
  const { forms, setView } = useForms();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, responses, name

  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleCreateForm = () => {
    setView('create');
  };

  // Filter and sort forms
  const filteredForms = useMemo(() => {
    let result = [...forms];

    // Search filter
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(form =>
        form.title?.toLowerCase().includes(term) ||
        form.description?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(form => form.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.title || '').localeCompare(b.title || '');
        case 'responses':
          return (b.responses?.length || 0) - (a.responses?.length || 0);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [forms, debouncedSearch, statusFilter, sortBy]);

  const stats = useMemo(() => {
    return {
      total: forms.length,
      active: forms.filter(f => f.status === FORM_STATUS.ACTIVE).length,
      draft: forms.filter(f => f.status === FORM_STATUS.DRAFT).length,
      responses: forms.reduce((sum, f) => sum + (f.responses?.length || 0), 0)
    };
  }, [forms]);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Мої форми</h1>
          <p className="dashboard-subtitle">
            Створюйте, керуйте та аналізуйте свої форми
          </p>
        </div>
        <Button icon={FiPlus} size="lg" onClick={handleCreateForm}>
          Створити форму
        </Button>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <Card className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Всього форм</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Активні</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">{stats.draft}</div>
          <div className="stat-label">Чернетки</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">{stats.responses}</div>
          <div className="stat-label">Відповіді</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-controls">
        <div className="dashboard-search">
          <Input
            placeholder="Пошук форм..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={FiSearch}
          />
        </div>

        <div className="dashboard-filters">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Всі статуси</option>
            <option value={FORM_STATUS.ACTIVE}>Активні</option>
            <option value={FORM_STATUS.DRAFT}>Чернетки</option>
            <option value={FORM_STATUS.CLOSED}>Закриті</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">За датою</option>
            <option value="name">За назвою</option>
            <option value="responses">За відповідями</option>
          </select>
        </div>
      </div>

      {/* Forms Grid */}
      {filteredForms.length > 0 ? (
        <div className="dashboard-grid">
          {filteredForms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      ) : (
        <Card glass className="empty-state">
          <FiGrid className="empty-icon" />
          <h3 className="empty-title">
            {debouncedSearch || statusFilter !== 'all'
              ? 'Нічого не знайдено'
              : 'У вас ще немає форм'}
          </h3>
          <p className="empty-description">
            {debouncedSearch || statusFilter !== 'all'
              ? 'Спробуйте змінити параметри фільтрування'
              : 'Створіть свою першу форму, щоб почати збирати відповіді'}
          </p>
          {!debouncedSearch && statusFilter === 'all' && (
            <Button icon={FiPlus} onClick={handleCreateForm}>
              Створити першу форму
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
