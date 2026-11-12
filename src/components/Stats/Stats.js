import { useEffect, useState } from "react";
import screenStyles from "../../styles/screens.module.css";
import { useForms } from "../../context/FormsContext";
import StatsSummary from "./StatsSummary";
import StatsChart from "./StatsChart";
import StatsResponses from "./StatsResponses";
import { Button } from "../ui/Button";
import { getQuestionStats } from "../../utils/statsUtils";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const Stats = () => {
  const { currentForm, setView, refreshResponses } = useForms();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formId = currentForm?.id;
  const published = !!currentForm?.publication;
  useEffect(() => {
    if (!published) return;
    let active = true;
    setLoading(true);
    refreshResponses(formId)
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [formId, published, refreshResponses]);
  if (!currentForm) {
    return <div>Опитування не знайдено</div>;
  }
  const stats = currentForm.stats || {};
  const responses = currentForm.responses || [];
  return (
    <div className={cx("stats-page")}>
      {loading && <p role="status">Оновлюємо відповіді…</p>}
      {error && (
        <p role="alert">
          {error}{" "}
          <Button
            variant="secondary"
            onClick={() => {
              setError("");
              refreshResponses(formId).catch((e) => setError(e.message));
            }}
          >
            Спробувати ще раз
          </Button>
        </p>
      )}
      <div className={cx("stats-header")}>
        {published && (
          <Button
            variant="secondary"
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              setError("");
              try {
                await refreshResponses(formId);
              } catch (e) {
                setError(e.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            Оновити відповіді
          </Button>
        )}
        <Button variant="secondary" onClick={() => setView("dashboard")}>
          ← Назад
        </Button>
        <div>
          <h1>{currentForm.title}</h1>
          <p className={cx("stats-subtitle")}>Статистика та аналітика</p>
        </div>
      </div>

      <StatsSummary stats={stats} />

      <StatsChart
        currentForm={currentForm}
        getQuestionStats={(q) => getQuestionStats(q, responses)}
        responses={responses}
      />

      <StatsResponses responses={responses} currentForm={currentForm} />
    </div>
  );
};
export default Stats;
