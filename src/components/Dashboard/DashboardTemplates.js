import React from 'react';
import { Button } from '../UI/Button';
import '../UI/Card.css';

const TEMPLATES = [
  {
    id: 'feedback',
    title: 'Зворотній зв’язок',
    description: 'Зберіть відгуки про ваш продукт або послугу.',
    questions: [
      { type: 'scale', title: 'Наскільки ви задоволені нашим сервісом?', required: true, min: 1, max: 5, minLabel: 'Жахливо', maxLabel: 'Чудово' },
      { type: 'text', title: 'Що ми можемо покращити?', required: false }
    ]
  },
  {
    id: 'registration',
    title: 'Реєстрація на подію',
    description: 'Проста форма для реєстрації учасників.',
    questions: [
      { type: 'text', title: 'Ваше ім’я та прізвище', required: true },
      { type: 'text', title: 'Email', required: true },
      { type: 'single_choice', title: 'Формат участі', options: ['Онлайн', 'Офлайн'], required: true }
    ]
  },
  {
    id: 'quiz',
    title: 'Опитування команди',
    description: 'Дізнайтеся настрій вашої команди.',
    questions: [
      { type: 'scale', title: 'Як ви оцінюєте свій рівень енергії?', required: true, min: 1, max: 10 },
      { type: 'text', title: 'Які перешкоди виникали цього тижня?', required: false }
    ]
  }
];

const DashboardTemplates = ({ onUseTemplate }) => {
  return (
    <div className="templates-section">
      <div className="templates-heading">
        <h2>Шаблони</h2>
        <p className="templates-lede">Почніть швидше з готовими варіантами</p>
      </div>
      <div className="template-list">
        {TEMPLATES.map(template => (
          <li key={template.id}>
            <div style={{ flex: 1 }}>
              <strong>{template.title}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                {template.description}
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => onUseTemplate(template)}>
              Обрати
            </Button>
          </li>
        ))}
      </div>
    </div>
  );
};

export default DashboardTemplates;
