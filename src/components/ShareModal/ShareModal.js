import Modal from "../ui/Modal/Modal";
import { useState, useEffect } from "react";
import { useForms } from "../../context/FormsContext";
import ShareLink from "./ShareLink";
import ShareSettings from "./ShareSettings";
const DEFAULT_SHARE_SETTINGS = {
  isPublic: true,
  passwordEnabled: false,
  password: "",
  limitResponsesEnabled: false,
  maxResponses: "",
};
const ShareModal = ({ form, onClose }) => {
  const { updateForm } = useForms();
  const [shareSettings, setShareSettings] = useState(() => ({
    ...DEFAULT_SHARE_SETTINGS,
    ...(form.shareSettings || {}),
    maxResponses:
      form.shareSettings?.maxResponses != null
        ? String(form.shareSettings.maxResponses)
        : "",
  }));
  const shareUrl = `${window.location.origin}/form/${form.id}`;
  useEffect(() => {
    setShareSettings({
      ...DEFAULT_SHARE_SETTINGS,
      ...(form.shareSettings || {}),
      maxResponses:
        form.shareSettings?.maxResponses != null
          ? String(form.shareSettings.maxResponses)
          : "",
    });
  }, [form]);
  const persistShareSettings = (updater) => {
    setShareSettings((prev) => {
      const next =
        typeof updater === "function"
          ? updater(prev)
          : {
              ...prev,
              ...updater,
            };
      const maxResponsesNumber = next.maxResponses
        ? parseInt(next.maxResponses, 10) || null
        : null;
      updateForm(form.id, {
        shareSettings: {
          isPublic: next.isPublic,
          passwordEnabled: next.passwordEnabled,
          password: next.password,
          limitResponsesEnabled: next.limitResponsesEnabled,
          maxResponses: maxResponsesNumber,
        },
      });
      return next;
    });
  };
  return (
    <Modal isOpen onClose={onClose} title="Поділитися опитуванням">
      <ShareLink shareUrl={shareUrl} />
      <ShareSettings
        shareSettings={shareSettings}
        onUpdate={persistShareSettings}
      />
    </Modal>
  );
};
export default ShareModal;
