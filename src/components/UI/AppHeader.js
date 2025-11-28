import { useForms } from '../../context/FormsContext';
import { Button } from './Button';
import './AppHeader.css';

const AppHeader = () => {
  const { setView, setCurrentForm, forms } = useForms();

  const handleCreate = () => {
    setCurrentForm(null);
    setView('create');
  };

  const handleHome = () => {
    setCurrentForm(null);
    setView('dashboard');
  };

  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-mark" aria-hidden="true">◎</div>
        <div className="brand-copy">
          <p className="eyebrow">Новий вигляд</p>
          <h1>Опитування, які зрозумілі людям будь-якого віку</h1>
          <p className="lede">
            Зручні великі шрифти, зрозумілі кнопки та поради допоможуть як школярам, так і дорослим швидко створити форму.
          </p>
          <div className="brand-pills" aria-hidden="true">
            <span>Доступність</span>
            <span>Підказки</span>
            <span>Шаблони</span>
            <span>Статистика</span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <div className="header-meta">
          <p className="meta-label">Опитувань збережено</p>
          <p className="meta-value">{forms.length}</p>
        </div>
        <div className="header-buttons">
          <Button variant="secondary" onClick={handleHome}>
            На головну
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Створити опитування
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
