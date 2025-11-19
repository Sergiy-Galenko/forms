import { useState } from 'react';
import { useForms } from '../../context/FormsContext';
import FormAccessControl from './FormAccessControl';
import FormSuccess from './FormSuccess';
import FormRenderer from './FormRenderer';
import './FormView.css';

const FormView = () => {
  const { currentForm, addResponse, updateFormStats, setView } = useForms();
  const [submitted, setSubmitted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  if (!currentForm) {
    return <div>Опитування не знайдено</div>;
  }

  const isPublicLink =
    typeof window !== 'undefined' && /^\/form\//.test(window.location.pathname);

  const shareSettings = {
    isPublic: true,
    passwordEnabled: false,
    password: '',
    limitResponsesEnabled: false,
    maxResponses: null,
    ...(currentForm.shareSettings || {})
  };

  const totalResponses = currentForm.stats?.totalResponses || 0;
  const maxResponses =
    typeof shareSettings.maxResponses === 'number'
      ? shareSettings.maxResponses
      : shareSettings.maxResponses
        ? parseInt(shareSettings.maxResponses, 10) || null
        : null;

  const limitReached =
    isPublicLink &&
    shareSettings.limitResponsesEnabled &&
    maxResponses &&
    totalResponses >= maxResponses;

  const handleAuthorized = () => {
    setIsAuthorized(true);
  };

  const handleFormSubmit = (answers) => {
    if (limitReached) {
      alert('Ліміт відповідей для цього опитування вичерпано');
      return;
    }

    addResponse(currentForm.id, { answers });
    updateFormStats(currentForm.id, {
      ...currentForm.stats,
      totalViews: (currentForm.stats?.totalViews || 0) + 1
    });
    setSubmitted(true);
  };

  if (submitted) {
    return <FormSuccess setView={setView} />;
  }

  if ((isPublicLink && !shareSettings.isPublic) || limitReached || (isPublicLink && shareSettings.passwordEnabled && !isAuthorized)) {
    return (
      <FormAccessControl
        isPublicLink={isPublicLink}
        shareSettings={shareSettings}
        limitReached={limitReached}
        currentForm={currentForm}
        onAuthorized={handleAuthorized}
      />
    );
  }

  return (
    <FormRenderer
      currentForm={currentForm}
      onSubmit={handleFormSubmit}
    />
  );
};

export default FormView;

