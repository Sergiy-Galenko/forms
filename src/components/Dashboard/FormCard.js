import { useState } from "react";
import ShareModal from "../ShareModal/ShareModal";
import { publicTestUrl } from "../../services/TestsApi";
import screenStyles from "../../styles/screens.module.css";
import React from "react";
import { FiEdit } from "@react-icons/all-files/fi/FiEdit";
import { FiBarChart2 } from "@react-icons/all-files/fi/FiBarChart2";
import { FiTrash2 } from "@react-icons/all-files/fi/FiTrash2";
import { FiCopy } from "@react-icons/all-files/fi/FiCopy";
import { FiFileText } from "@react-icons/all-files/fi/FiFileText";
import { useForms } from "../../context/FormsContext";
import { useToast } from "../ui/Toast";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { FORM_STATUS } from "../../types";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const FormCard = ({ form }) => {
  const { setView, setCurrentForm, deleteForm } = useForms();
  const toast = useToast();
  const [sharing, setSharing] = useState(false);
  const handleEdit = () => {
    setCurrentForm(form);
    setView("edit");
  };
  const handleStats = () => {
    setCurrentForm(form);
    setView("stats");
  };
  const handleDelete = async () => {
    if (window.confirm(`Видалити форму "${form.title}"?`)) {
      try {
        await deleteForm(form.id);
        toast.success("Форму видалено");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  const handleCopyLink = async () => {
    if (!form.publication) {
      setSharing(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(publicTestUrl(form.publication));
      toast.success("Посилання скопійовано!");
    } catch {
      setSharing(true);
    }
  };
  const statusLabels = {
    [FORM_STATUS.ACTIVE]: "Активна",
    [FORM_STATUS.DRAFT]: "Чернетка",
    [FORM_STATUS.CLOSED]: "Закрита",
  };
  const responseCount = form.responses?.length || 0;
  const questionCount = form.questions?.length || 0;
  return (
    <Card hoverable className={cx("form-card")}>
      {sharing && <ShareModal form={form} onClose={() => setSharing(false)} />}
      <div className={cx("form-card-header")}>
        <div className={cx("form-card-icon")}>
          <FiFileText />
        </div>
        <span className={cx(`form-card-status ${form.status}`)}>
          {statusLabels[form.status]}
        </span>
      </div>

      <div className={cx("form-card-body")}>
        <h2 className={cx("form-card-title")}>{form.title || "Без назви"}</h2>
        {form.description && (
          <p className={cx("form-card-description")}>{form.description}</p>
        )}

        <div className={cx("form-card-meta")}>
          <div className={cx("meta-item")}>
            <span className={cx("meta-label")}>Питань:</span>
            <span className={cx("meta-value")}>{questionCount}</span>
          </div>
          <div className={cx("meta-item")}>
            <span className={cx("meta-label")}>Відповідей:</span>
            <span className={cx("meta-value")}>{responseCount}</span>
          </div>
        </div>

        <div className={cx("form-card-date")}>
          Створено: {new Date(form.createdAt).toLocaleDateString("uk-UA")}
        </div>
      </div>

      <div className={cx("form-card-actions")}>
        <Button
          variant="secondary"
          size="sm"
          icon={FiEdit}
          onClick={handleEdit}
        >
          Редагувати
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={FiBarChart2}
          onClick={handleStats}
        >
          Статистика
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setSharing(true)}>
          Поділитися
        </Button>
        <div className={cx("form-card-menu")}>
          <Button
            variant="ghost"
            size="sm"
            icon={FiCopy}
            onClick={handleCopyLink}
            title="Копіювати посилання"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={FiTrash2}
            onClick={handleDelete}
            title="Видалити"
          />
        </div>
      </div>
    </Card>
  );
};
export default FormCard;
