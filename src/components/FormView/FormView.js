import { useState, useEffect } from 'react';
import { useForms } from '../../context/FormsContext';
import { useExperience } from '../../context/ExperienceContext';
import FormRenderer from './FormRenderer';
import FormAccessControl from './FormAccessControl';
import FormSuccess from './FormSuccess';
import './FormView.css';

const FormView = () => {
  const { currentForm, addResponse, updateFormStats } = useForms();
  const { experience } = useExperience();
  const [accessState, setAccessState] = useState('loading'); // loading, allowed, password, closed, limited, already_responded, expired
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!currentForm) return;

      const settings = currentForm.shareSettings || {};

      // 1. Check if public
      if (!settings.isPublic) {
        setAccessState('closed');
        return;
      }

      // 2. Check expiration
      if (settings.expiresAt && new Date(settings.expiresAt) < new Date()) {
        setAccessState('expired');
        return;
      }

      // 3. Check response limit
      if (settings.limitResponsesEnabled && settings.maxResponses) {
        if ((currentForm.responses?.length || 0) >= parseInt(settings.maxResponses)) {
          setAccessState('limited');
          return;
        }
      }

      // 4. Check one response per device
      if (settings.oneResponsePerDevice) {
        // Check localStorage
        const localResponded = localStorage.getItem(`responded_${currentForm.id}`);
        if (localResponded) {
          setAccessState('already_responded');
          return;
        }

        // Check IP (async)
        try {
          const ipRes = await fetch('https://api.ipify.org?format=json');
          if (ipRes.ok) {
            const { ip } = await ipRes.json();
            const hasRespondedFromIp = currentForm.responses?.some(r => r.ip === ip);
            if (hasRespondedFromIp) {
              setAccessState('already_responded');
              return;
            }
          }
        } catch (e) {
          console.warn('IP check failed, relying on localStorage', e);
        }
      }

      // 5. Check password
      if (settings.passwordEnabled && settings.password) {
        setAccessState('password');
        return;
      }

      setAccessState('allowed');
      updateFormStats(currentForm.id, {
        ...currentForm.stats,
        totalViews: (currentForm.stats?.totalViews || 0) + 1
      });
    };

    checkAccess();
  }, [currentForm, updateFormStats]);

  const handleSubmit = async (answers) => {
    await addResponse(currentForm.id, { answers });

    // Mark as responded in localStorage
    localStorage.setItem(`responded_${currentForm.id}`, 'true');

    setIsSubmitted(true);
  };

  const handlePasswordSubmit = (password) => {
    if (password === currentForm.shareSettings.password) {
      setAccessState('allowed');
      updateFormStats(currentForm.id, {
        ...currentForm.stats,
        totalViews: (currentForm.stats?.totalViews || 0) + 1
      });
    } else {
      alert('Невірний пароль');
    }
  };

  if (!currentForm) return <div>Завантаження...</div>;

  if (isSubmitted) {
    return <FormSuccess form={currentForm} />;
  }

  if (accessState === 'loading') {
    return <div className="form-loading">Перевірка доступу...</div>;
  }

  if (accessState !== 'allowed') {
    return (
      <FormAccessControl
        state={accessState}
        onPasswordSubmit={handlePasswordSubmit}
      />
    );
  }

  return (
    <FormRenderer
      currentForm={currentForm}
      onSubmit={handleSubmit}
      guidedMode={experience.guidedMode}
    />
  );
};

export default FormView;
