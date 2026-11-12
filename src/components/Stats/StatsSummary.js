import screenStyles from "../../styles/screens.module.css";
import React from "react";
import { Card } from "../ui/Card";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const StatsSummary = ({ stats }) => {
  return (
    <div className={cx("stats-overview")}>
      <Card className={cx("stat-card")}>
        <div className={cx("stat-label")}>Переглядів</div>
        <div className={cx("stat-value")}>{stats.totalViews || 0}</div>
      </Card>
      <Card className={cx("stat-card")}>
        <div className={cx("stat-label")}>Відповідей</div>
        <div className={cx("stat-value")}>{stats.totalResponses || 0}</div>
      </Card>
      <Card className={cx("stat-card")}>
        <div className={cx("stat-label")}>Завершення</div>
        <div className={cx("stat-value")}>{stats.completionRate || 0}%</div>
      </Card>
      <Card className={cx("stat-card")}>
        <div className={cx("stat-label")}>Середній час</div>
        <div className={cx("stat-value")}>{stats.averageTime || 0}с</div>
      </Card>
    </div>
  );
};
export default StatsSummary;
