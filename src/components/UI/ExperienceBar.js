import { useExperience } from '../../context/ExperienceContext';
import './ExperienceBar.css';

const ExperienceBar = () => {
  const {
    experience,
    toggleContrast,
    toggleFontScale,
    toggleGuidedMode,
    toggleCalmMotion
  } = useExperience();

  const controls = [
    {
      key: 'font',
      label: 'Великий текст',
      helper: 'Збільшує читабельність кнопок і полів',
      active: experience.fontScale === 'large',
      onClick: toggleFontScale
    },
    {
      key: 'contrast',
      label: 'Високий контраст',
      helper: 'Чіткіший фон для старших користувачів',
      active: experience.highContrast,
      onClick: toggleContrast
    },
    {
      key: 'guide',
      label: 'Підказки',
      helper: 'Додаткові пояснення у конструкторі',
      active: experience.guidedMode,
      onClick: toggleGuidedMode
    },
    {
      key: 'calm',
      label: 'Менше анімацій',
      helper: 'Прибирає зайві рухи та мерехтіння',
      active: experience.calmMotion,
      onClick: toggleCalmMotion
    }
  ];

  return (
    <section className="experience-bar" aria-label="Налаштування зручності та доступності">
      <div className="experience-copy">
        <p className="eyebrow">Доступність</p>
        <h2>Режими комфорту</h2>
        <p className="experience-lede">
          Підлаштуйте інтерфейс під свій темп: великі шрифти, контраст, менше анімацій та підказки для тих, хто тільки починає.
        </p>
      </div>
      <div className="experience-controls">
        {controls.map((control) => (
          <button
            key={control.key}
            type="button"
            className={`experience-toggle ${control.active ? 'is-active' : ''}`}
            onClick={control.onClick}
            aria-pressed={control.active}
          >
            <div className="toggle-dot" aria-hidden="true" />
            <div className="toggle-texts">
              <span className="toggle-label">{control.label}</span>
              <span className="toggle-helper">{control.helper}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ExperienceBar;
