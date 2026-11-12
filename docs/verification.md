> Історичний звіт редизайну для ревізій 6c63cd4/efe4cc1. Після додавання Excel та серверних тестів актуальні можливості й перевірки описані в [excel-tests.md](excel-tests.md).

# Перевірка редизайну FormsCraft

Дата: 12 листопада 2026. Початкова ревізія: `49e1dfb`; редизайн: `6c63cd4`; дані браузерів: `efe4cc1`.

## Результат і межі

Виконано аудит, дизайн-токени, UI-компоненти, layout, оновлення всіх підключених екранів, lazy loading, тести, метадані та README. Бізнес-контексти, сховище, API-запити, константи та формат збережених форм не змінено. **Повний Definition of Done не закрито**: загальний розмір усіх JS-чанків зріс; наявні дефекти бізнес-логіки обмежують наскрізну перевірку публічної форми. Польовий INP не вимірювався.

## До / після

| Показник | До | Після |
|---|---:|---:|
| Початковий JS головної, gzip | 83,69 kB | 80,16 kB |
| Початковий CSS головної, gzip | 8,78 kB | 7,07 kB |
| Увесь JS усіх маршрутів, gzip | 83,69 kB | 98,75 kB |
| Увесь CSS усіх маршрутів, gzip | 8,78 kB | 9,40 kB |
| Lighthouse mobile Performance | 99 | 100 |
| Accessibility | 95 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 1,7 с | 1,9 с |
| CLS | 0 | 0 |
| TBT | 30 мс | 0 мс |
| Тести | 0 | 16 успішних |

Розміри — десяткові kB. Початковий JS після редизайну включає `main` і lazy-чанк головної; це не лише менший файл `main` (78,42 kB). Усі чанки пораховано окремо, зі стисненням gzip level 9. Додатковий код доступності й окреме стиснення чанків збільшили суму, тому вимогу «бандл не зріс» не позначено виконаною для всього застосунку.

Перший baseline із початковими залежностями дав 83,69 / 8,78 kB. Для порівняльного Lighthouse вихідну ревізію зібрано в окремій тимчасовій директорії з тією ж оновленою базою браузерів: її JS/CSS — 83,05 / 8,77 kB. В обох випадках сторінки віддавалися локальним статичним сервером з gzip та кешуванням файлів із хешами. Використано стандартний mobile-профіль Lighthouse через встановлений Chrome. Публічний Vercel-деплой не змінювався й не є джерелом цих оцінок. Результати лабораторні; TBT не є польовим INP.

Машиночитані виміри й результати браузерних перевірок: [verification-results.json](verification-results.json).

## Checklist

| Вимога | Статус та свідчення |
|---|---|
| npm install без помилок | Так: `npm install --ignore-scripts`, exit 0, up to date. У проєкті немає install lifecycle-скриптів. |
| Build без warnings | Так: `CI=true npm run build`, Compiled successfully. |
| Усі тести зелені | Так: 2 suites, 16 tests. |
| ESLint без помилок і warnings | Так: `npx eslint src --ext .js --max-warnings=0`, exit 0. |
| Усі наявні роути | URL збережено; перевірено `/`, `/about`, `/help`, `/forms`, `/form/:id` із закритим доступом. Повний сценарій дозволеної публічної форми обмежено початковим дефектом нижче. |
| Уся функціональність збережена | Формат даних і бізнес-операції збережено; створення/збереження, редагування, статистика, фільтри та 8 форматів відповідей перевірені. Усі початкові баги не можна прирівняти до успішної функціональності. |
| Light/dark, без спалаху | Обидві теми перевірено; script до React, системні зміни, збереження явного вибору після reload. |
| Контраст AA всюди | axe не знайшов порушень у 16 автоматичних перевірках. Повний ручний аудит усіх комбінацій станів не заявляється. |
| Клавіатура й фокус | Тести modal: trap/Esc/restore; Tabs: arrows/Home/End; native controls, skip link, focus-visible. Мобільне меню й вкладки перевірено в Chrome. Повний ручний screen-reader-аудит не проводився. |
| Немає горизонтального скролу 320 px | Так у перевірених екранах; 57 основних перевірок, додатково статистика та обмежений публічний доступ. |
| Reduced motion | Глобальний media query вимикає анімації й transitions; основні браузерні перевірки виконано з reduced motion. |
| Loading / empty / error | Загальний Suspense skeleton і ErrorBoundary з повторним завантаженням; empty список/статистика, перевірка доступу, inline-помилки й помилка submit. Помилки адаптера сховища, як у baseline, лише логуються — окремого UI немає. |
| Бандл не зріс | Частково: початкове завантаження зменшено; сума всіх чанків зросла. |
| Lighthouse 90/95/95/90 | Так: 100/100/100/100 на головній production-збірки. Не є гарантією всіх сторінок чи реальних пристроїв. |
| Заборонені CSS-патерни | `rg 'gradient|backdrop-filter|blur\(|!important' src public` — збігів немає. |
| README | Оновлено: запуск, структура, токени, UI, локальність даних, обмеження, скриншоти. |

## Що саме перевірено

- 56 комбінацій: 4 інформаційні/спискові маршрути × light/dark × 320, 375, 414, 768, 1024, 1280, 1536 px; окремо редактор на 320 px. Немає overflow чи pageerror.
- Створення форми → введення назви й питання → «Зберегти» → індикатор → правильний об’єкт у `forms` localStorage.
- Статистика з тестовою відповіддю: обидві теми, 320 і 1280 px, 0 axe violations.
- Публічний URL із закритим доступом: обидві теми, 320 і 1280 px.
- Мобільні вкладки зберігають введене між перемиканнями; тема зберігається після reload.
- Головна при CSS zoom 200% не має горизонтального скролу. Це симуляція масштабування, не повний ручний аудит browser zoom кожної сторінки.
- Компонентні тести: кнопка loading/disabled/Link; label/hint/error; modal focus/Esc; клавіатура Tabs; головна й dashboard; фокус першої помилки; незмінні формати всіх 8 типів відповідей.

## Наявні обмеження бізнес-логіки

Нижченаведені речі знайдено у вихідній ревізії. Їх не виправлено, оскільки завдання прямо забороняє змінювати бізнес-логіку, валідацію, відправлення та формат даних.

1. `FormView` запускає перевірку доступу ефектом із `currentForm`/`updateFormStats`; успішна перевірка оновлює статистику й обидві залежності. Це створює цикл оновлення лічильника переглядів. Наскрізний сценарій дозволеної форми не позначено успішним. Сам renderer і передавання відповідей перевірено окремими тестами.
2. `createForm` завжди встановлює `DRAFT` після переданих даних. «Опублікувати» нову форму не змінює цей порядок.
3. Збереження нової форми не встановлює `currentForm`; повторне збереження може створити ще один запис. Кнопка створення в Dashboard також не очищає попередню `currentForm`.
4. Загальна кнопка «Додати питання» передає callback напряму, тому event може потрапити в аргумент типу. Перевірений шлях додавання — наявні кнопки конкретних типів.
5. `ShareModal.persistShareSettings` зберігає лише частину полів і не записує `expiresAt`, `showResults`, `oneResponsePerDevice`. Компонент не має активної точки входу в поточному Dashboard.
6. Невідомий id форми може показувати список; перехід із публічної форми до `/forms` не завжди скидає `view`. Маршрути та ці правила не переписувалися.
7. Дані існують лише в localStorage; URL з id не передає форму іншим користувачам. `ipify` лишається зовнішнім best-effort запитом.
8. Експортні утиліти не були підключені до активного UI. Нову кнопку експорту не додано.

## Припущення й питання власнику

- Збережено CRA + JS + React Router, українську мову й усі URL. Нового бекенду, синхронізації, drag-and-drop або багатокроковості не додано: їх немає у підключених екранах baseline.
- Чи має наступне окреме завдання дозволити виправлення циклу переглядів, публікації та повторного збереження? Це потрібно для надійної наскрізної роботи.
- Чи потрібен реальний обмін формами між пристроями? Поточна локальна модель цього не підтримує.
- Чи обмеження бандла стосується початкового завантаження, чи строго суми всіх lazy-чанків? Перше покращено, друге наразі перевищено.
- Чи потрібно окремо підключити наявні поширення/експорт? У цьому редизайні нову функціональність не вмикали.

## Файли

Список нижче включає весь код редизайну, зміну двох транзитивних баз браузерів та документацію. Старий каталог `components/UI` замінено на `components/ui`; регістр усіх відносних імпортів перевірено за Git index для Linux/Vercel.

### Створені

- `docs/screenshots/dashboard-dark.png`
- `docs/screenshots/dashboard-light.png`
- `docs/screenshots/editor.png`
- `docs/screenshots/home.png`
- `docs/screenshots/stats-dark.png`
- `docs/screenshots/stats-light.png`
- `docs/verification-results.json`
- `docs/verification.md`
- `public/icon.svg`
- `src/components/FormBuilder/ScaleEditor.js`
- `src/components/FormView/QuestionAnswer.js`
- `src/components/Layout/Footer.module.css`
- `src/components/Layout/Header.module.css`
- `src/components/ui/Badge/Badge.js`
- `src/components/ui/Badge/Badge.module.css`
- `src/components/ui/Button.js`
- `src/components/ui/Button/Button.js`
- `src/components/ui/Button/Button.module.css`
- `src/components/ui/Card.js`
- `src/components/ui/Card/Card.js`
- `src/components/ui/Card/Card.module.css`
- `src/components/ui/Checkbox/Checkbox.js`
- `src/components/ui/Checkbox/Checkbox.module.css`
- `src/components/ui/EmptyState/EmptyState.js`
- `src/components/ui/EmptyState/EmptyState.module.css`
- `src/components/ui/ErrorBoundary/ErrorBoundary.js`
- `src/components/ui/ErrorBoundary/ErrorBoundary.module.css`
- `src/components/ui/ErrorState/ErrorState.js`
- `src/components/ui/ErrorState/ErrorState.module.css`
- `src/components/ui/Field/Field.js`
- `src/components/ui/Field/Field.module.css`
- `src/components/ui/IconButton/IconButton.js`
- `src/components/ui/IconButton/IconButton.module.css`
- `src/components/ui/Input.js`
- `src/components/ui/Input/Input.js`
- `src/components/ui/Input/Input.module.css`
- `src/components/ui/Modal.js`
- `src/components/ui/Modal/Modal.js`
- `src/components/ui/Modal/Modal.module.css`
- `src/components/ui/ProgressBar/ProgressBar.js`
- `src/components/ui/ProgressBar/ProgressBar.module.css`
- `src/components/ui/Radio/Radio.js`
- `src/components/ui/Radio/Radio.module.css`
- `src/components/ui/Select/Select.js`
- `src/components/ui/Select/Select.module.css`
- `src/components/ui/Skeleton.js`
- `src/components/ui/Skeleton/Skeleton.js`
- `src/components/ui/Skeleton/Skeleton.module.css`
- `src/components/ui/Spinner/Spinner.js`
- `src/components/ui/Spinner/Spinner.module.css`
- `src/components/ui/Switch/Switch.js`
- `src/components/ui/Switch/Switch.module.css`
- `src/components/ui/Tabs/Tabs.js`
- `src/components/ui/Tabs/Tabs.module.css`
- `src/components/ui/Tag/Tag.js`
- `src/components/ui/Tag/Tag.module.css`
- `src/components/ui/Textarea/Textarea.js`
- `src/components/ui/Textarea/Textarea.module.css`
- `src/components/ui/Toast.js`
- `src/components/ui/Toast/Toast.js`
- `src/components/ui/Toast/Toast.module.css`
- `src/components/ui/Tooltip/Tooltip.js`
- `src/components/ui/Tooltip/Tooltip.module.css`
- `src/components/ui/ui.test.js`
- `src/hooks/useMediaQuery.js`
- `src/layouts/AppLayout/AppLayout.js`
- `src/layouts/AppLayout/AppLayout.module.css`
- `src/pages/HomePage.module.css`
- `src/pages/pages.test.js`
- `src/setupTests.js`
- `src/styles/base.css`
- `src/styles/screens.module.css`
- `src/styles/tokens.css`

### Змінені

- `README.md`
- `package-lock.json`
- `public/index.html`
- `public/manifest.json`
- `src/App.js`
- `src/components/Dashboard/Dashboard.js`
- `src/components/Dashboard/FormCard.js`
- `src/components/FormBuilder/FormBuilder.js`
- `src/components/FormBuilder/FormBuilderCanvas.js`
- `src/components/FormBuilder/FormBuilderHeader.js`
- `src/components/FormBuilder/QuestionEditor.js`
- `src/components/FormView/FormAccessControl.js`
- `src/components/FormView/FormRenderer.js`
- `src/components/FormView/FormSuccess.js`
- `src/components/FormView/FormView.js`
- `src/components/Layout/Footer.js`
- `src/components/Layout/Header.js`
- `src/components/ShareModal/ShareLink.js`
- `src/components/ShareModal/ShareModal.js`
- `src/components/ShareModal/ShareSettings.js`
- `src/components/Stats/Stats.js`
- `src/components/Stats/StatsChart.js`
- `src/components/Stats/StatsResponses.js`
- `src/components/Stats/StatsSummary.js`
- `src/context/ThemeContext.js`
- `src/hooks/useLocalStorage.js`
- `src/index.js`
- `src/pages/AboutPage.js`
- `src/pages/HelpPage.js`
- `src/pages/HomePage.js`

### Видалені

- `src/App.css`
- `src/components/Dashboard/Dashboard.css`
- `src/components/Dashboard/DashboardGrid.js`
- `src/components/Dashboard/DashboardHeader.js`
- `src/components/Dashboard/DashboardTemplates.js`
- `src/components/Dashboard/FormCard.css`
- `src/components/FormBuilder/FormBuilder.css`
- `src/components/FormBuilder/QuestionEditor.css`
- `src/components/FormView/FormView.css`
- `src/components/Layout/Footer.css`
- `src/components/Layout/Header.css`
- `src/components/ShareModal/ShareModal.css`
- `src/components/Stats/Stats.css`
- `src/components/UI/AppHeader.css`
- `src/components/UI/AppHeader.js`
- `src/components/UI/Button.css`
- `src/components/UI/Button.js`
- `src/components/UI/Card.css`
- `src/components/UI/Card.js`
- `src/components/UI/ExperienceBar.css`
- `src/components/UI/ExperienceBar.js`
- `src/components/UI/Input.css`
- `src/components/UI/Input.js`
- `src/components/UI/Modal.css`
- `src/components/UI/Modal.js`
- `src/components/UI/Skeleton.css`
- `src/components/UI/Skeleton.js`
- `src/components/UI/Toast.css`
- `src/components/UI/Toast.js`
- `src/index.css`
- `src/pages/Pages.css`
- `src/styles/components.css`
- `src/styles/global.css`
- `src/styles/variables.css`
