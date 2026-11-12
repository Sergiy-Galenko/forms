import { FiCheckCircle } from "@react-icons/all-files/fi/FiCheckCircle";
import screenStyles from "../../styles/screens.module.css";
import React, { useState } from "react";
import { useForms } from "../../context/FormsContext";
import { Button } from "../ui/Button";
import StatsSummary from "../Stats/StatsSummary";
import StatsChart from "../Stats/StatsChart";
import { getQuestionStats } from "../../utils/statsUtils";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const FormSuccess = ({ form }) => {
  const { setView, setCurrentForm } = useForms();
  const [showStats, setShowStats] = useState(false);
  const handleBack = () => {
    setCurrentForm(null);
    setView("dashboard");
  };
  if (showStats) {
    return (
      <div className={cx("form-success-stats")}>
        <div className={cx("success-stats-header")}>
          <h1>Результати опитування</h1>
          <Button variant="secondary" onClick={() => setShowStats(false)}>
            Назад
          </Button>
        </div>
        <StatsSummary stats={form.stats || {}} />
        <StatsChart
          currentForm={form}
          getQuestionStats={(q) => getQuestionStats(q, form.responses || [])}
          responses={form.responses || []}
        />
      </div>
    );
  }
  return (
    <div className={cx("form-success")}>
      <div className={cx("success-card")}>
        <div className={cx("success-icon")}>
          <FiCheckCircle aria-hidden="true" />
        </div>
        <h1>Дякуємо!</h1>
        <p>Вашу відповідь успішно збережено.</p>
        <div className={cx("success-actions")}>
          <Button variant="primary" onClick={handleBack}>
            На головну
          </Button>
          {form.shareSettings?.showResults && (
            <Button variant="secondary" onClick={() => setShowStats(true)}>
              Переглянути результати
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default FormSuccess;
