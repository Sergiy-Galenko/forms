import { useState, useEffect } from 'react';
import { useForms } from '../../context/FormsContext';
import ShareLink from './ShareLink';
import ShareSettings from './ShareSettings';
import './ShareModal.css';

const DEFAULT_SHARE_SETTINGS = {
  isPublic: true,
  passwordEnabled: false,
  password: '',
  limitResponsesEnabled: false,
  maxResponses: ''
};

const ShareModal = ({ form, onClose }) => {
  const { updateForm } = useForms();
  const [shareSettings, setShareSettings] = useState(() => ({
    ...DEFAULT_SHARE_SETTINGS,
    ...(form.shareSettings || {}),
    maxResponses:
      form.shareSettings?.maxResponses != null
        ? String(form.shareSettings.maxResponses)
        : ''
  }));

  const shareUrl = `${window.location.origin}/form/${form.id}`;

  useEffect(() => {
    setShareSettings({
      ...DEFAULT_SHARE_SETTINGS,
      ...(form.shareSettings || {}),
      maxResponses:
        form.shareSettings?.maxResponses != null
          ? String(form.shareSettings.maxResponses)
          : ''
    });
  }, [form]);

  const persistShareSettings = (updater) => {
    setShareSettings((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };

      const maxResponsesNumber = next.maxResponses
        ? parseInt(next.maxResponses, 10) || null
        : null;

      updateForm(form.id, {
        shareSettings: {
          isPublic: next.isPublic,
          passwordEnabled: next.passwordEnabled,
          password: next.password,
          limitResponsesEnabled: next.limitResponsesEnabled,
          maxResponses: maxResponsesNumber
        }
      });

      return next;
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Поділитися опитуванням</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <ShareLink shareUrl={shareUrl} />
          <ShareSettings
            shareSettings={shareSettings}
            onUpdate={persistShareSettings}
          />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

