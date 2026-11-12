import { useState } from "react";
import { useForms, DEFAULT_SHARE_SETTINGS } from "../../context/FormsContext";
import { publicTestUrl } from "../../services/TestsApi";
import Modal from "../ui/Modal/Modal";
import Button from "../ui/Button";
import ShareLink from "./ShareLink";
import ShareSettings from "./ShareSettings";
export default function ShareModal({ form, onClose }) {
  const { publishForm } = useForms();
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SHARE_SETTINGS,
    ...form.shareSettings,
    maxResponses: form.shareSettings?.maxResponses ?? "",
  }));
  const [url, setUrl] = useState(() =>
    form.publication ? publicTestUrl(form.publication) : "",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const save = async () => {
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const normalized = {
        ...settings,
        expiresAt: settings.expiresAt
          ? new Date(settings.expiresAt).toISOString()
          : "",
        maxResponses: settings.limitResponsesEnabled
          ? Number(settings.maxResponses)
          : null,
      };
      const link = await publishForm(form.id, normalized);
      setUrl(link);
      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Поділитися тестом"
      size="lg"
      footer={
        <Button onClick={save} isLoading={busy}>
          {form.publication
            ? "Зберегти обмеження"
            : "Опублікувати й отримати посилання"}
        </Button>
      }
    >
      <p>
        Учасники зможуть пройти опублікований тест з будь-якого пристрою.
        Відповіді та бали зберігатимуться разом.
      </p>
      {url && <ShareLink shareUrl={url} />}
      <ShareSettings
        shareSettings={settings}
        onUpdate={(updates) => {
          setSettings((prev) => ({ ...prev, ...updates }));
          setSaved(false);
        }}
      />
      {error && <p role="alert">{error}</p>}
      <p role="status" aria-live="polite">
        {saved ? "Налаштування збережено. Посилання готове до поширення." : ""}
      </p>
    </Modal>
  );
}
