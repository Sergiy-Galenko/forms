import { useState } from 'react';
import { useForms } from '../../context/FormsContext';
import ShareModal from '../ShareModal/ShareModal';
import DashboardHeader from './DashboardHeader';
import DashboardGrid from './DashboardGrid';
import { Button } from '../UI/Button';
import './Dashboard.css';

const Dashboard = () => {
  const { forms, setView, setCurrentForm, deleteForm } = useForms();
  const [shareForm, setShareForm] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleCreate = () => {
    setCurrentForm(null);
    setView('create');
  };

  const handleEdit = (form) => {
    setCurrentForm(form);
    setView('edit');
  };

  const handleView = (form) => {
    setCurrentForm(form);
    setView('view');
  };

  const handleStats = (form) => {
    setCurrentForm(form);
    setView('stats');
  };

  const handleShare = (form) => {
    setShareForm(form);
  };

  const filteredForms = forms.filter((form) => {
    const query = search.toLowerCase().trim();
    const matchesSearch = !query
      ? true
      : (form.title || '').toLowerCase().includes(query) ||
      (form.description || '').toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'all' ? true : form.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard">
      <DashboardHeader
        formsCount={forms.length}
        filteredCount={filteredForms.length}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onCreate={handleCreate}
      />

      {forms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>Поки що немає опитувань</h2>
          <p>Створіть перше опитування, щоб почати збирати відповіді</p>
          <Button variant="primary" onClick={handleCreate}>
            Створити опитування
          </Button>
        </div>
      ) : (
        <DashboardGrid
          forms={filteredForms}
          onView={handleView}
          onEdit={handleEdit}
          onStats={handleStats}
          onShare={handleShare}
          onDelete={deleteForm}
          onCreate={handleCreate}
        />
      )}

      {shareForm && (
        <ShareModal
          form={shareForm}
          onClose={() => setShareForm(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;

