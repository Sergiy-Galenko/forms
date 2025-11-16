import { useState } from 'react';
import { useForms } from '../../context/FormsContext';
import ShareModal from '../ShareModal/ShareModal';
import './Dashboard.css';

const Dashboard = () => {
  const { forms, setView, setCurrentForm, deleteForm } = useForms();
  const [shareForm, setShareForm] = useState(null);

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

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Мої опитування</h1>
          <p className="subtitle">{forms.length} опитувань</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          + Створити опитування
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>Поки що немає опитувань</h2>
          <p>Створіть перше опитування, щоб почати збирати відповіді</p>
          <button className="btn-primary" onClick={handleCreate}>
            Створити опитування
          </button>
        </div>
      ) : (
        <div className="forms-grid">
          {forms.map((form) => (
            <div key={form.id} className="form-card">
              <div className="form-card-header">
                <div>
                  <h3>{form.title || 'Без назви'}</h3>
                  <p className="form-meta">
                    {form.status === 'active' ? '🟢 Активне' : 
                     form.status === 'closed' ? '🔴 Закрите' : '⚪ Чернетка'}
                  </p>
                </div>
                <div className="form-actions">
                  <button 
                    className="btn-icon" 
                    onClick={() => handleView(form)}
                    title="Переглянути"
                  >
                    👁️
                  </button>
                  <button 
                    className="btn-icon" 
                    onClick={() => handleEdit(form)}
                    title="Редагувати"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-icon" 
                    onClick={() => handleStats(form)}
                    title="Статистика"
                  >
                    📊
                  </button>
                  <button 
                    className="btn-icon" 
                    onClick={() => handleShare(form)}
                    title="Поділитися"
                  >
                    🔗
                  </button>
                  <button 
                    className="btn-icon danger" 
                    onClick={() => deleteForm(form.id)}
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

