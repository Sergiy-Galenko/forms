import { useState } from 'react';
import { useForms } from '../../context/FormsContext';
import { useExperience } from '../../context/ExperienceContext';
import ShareModal from '../ShareModal/ShareModal';
import DashboardHeader from './DashboardHeader';
import DashboardGrid from './DashboardGrid';
import DashboardTemplates from './DashboardTemplates';
import { Button } from '../UI/Button';
import './Dashboard.css';

const Dashboard = () => {
  const { forms, setView, setCurrentForm, deleteForm, createForm } = useForms();
  const { experience } = useExperience();
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

  const handleUseTemplate = (template) => {
    const templateQuestions = template.questions.map((question, index) => ({
      ...question,
      id: `${Date.now()}-${template.id}-${index}`
    }));

    const newForm = createForm({
      title: template.title,
      description: template.description,
      questions: templateQuestions,
      settings: {
        allowAnonymous: true,
        showProgress: true,
        randomizeQuestions: false
      }
    });

    setCurrentForm(newForm);
    setView('edit');
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

      <div className="dashboard-two-col">
        <div className="dashboard-main">
          {experience.guidedMode && (
            <div className="guided-panel" role="status">
              <div className="guided-icon" aria-hidden="true">ℹ️</div>
              <div>
                <p className="guided-title">Як працювати зі списком</p>
                <p className="guided-text">
                  Спершу пошук або фільтр за статусом, далі великі кнопки «Переглянути», «Редагувати», «Статистика». Менше іконок — більше зрозумілого тексту.
                </p>
              </div>
            </div>
          )}

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
        </div>

        <aside className="dashboard-side">
          <DashboardTemplates onUseTemplate={handleUseTemplate} />
          <div className="side-help">
            <h3>Швидкі дії</h3>
            <ul>
              <li>Створити нове опитування одним кліком.</li>
              <li>Використати готовий шаблон зі списку.</li>
              <li>Переглянути статистику за останніми відповідями.</li>
            </ul>
            <Button variant="secondary" onClick={handleCreate} fullWidth>
              + Нова форма
            </Button>
          </div>
        </aside>
      </div>

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
