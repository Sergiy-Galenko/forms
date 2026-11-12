import screenStyles from "../../styles/screens.module.css";
import React from "react";
import { QUESTION_TYPES } from "../../types";
import { Card } from "../ui/Card";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const StatsChart = ({ currentForm, getQuestionStats, responses }) => {
  return (
    <div className={cx("questions-stats")}>
      <h2>Статистика по питаннях</h2>
      {currentForm.questions.map((question, index) => {
        const questionStats = getQuestionStats(question);
        return (
          <Card key={question.id} className={cx("question-stats-card")}>
            <div className={cx("question-stats-header")}>
              <span className={cx("question-number")}>{index + 1}</span>
              <h3>{question.title}</h3>
            </div>

            {!questionStats ? (
              <p className={cx("no-data")}>Поки що немає відповідей</p>
            ) : (
              <div className={cx("question-stats-content")}>
                {question.type === QUESTION_TYPES.SINGLE_CHOICE ||
                question.type === QUESTION_TYPES.MULTIPLE_CHOICE ? (
                  <div className={cx("options-stats")}>
                    {question.options?.map((option) => {
                      const count = questionStats[option.text] || 0;
                      const percentage =
                        responses.length > 0
                          ? Math.round((count / responses.length) * 100)
                          : 0;
                      return (
                        <div key={option.id} className={cx("option-stat")}>
                          <div className={cx("option-stat-header")}>
                            <span>{option.text}</span>
                            <span className={cx("option-stat-count")}>
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className={cx("option-stat-bar")}>
                            <div
                              className={cx("option-stat-fill")}
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : question.type === QUESTION_TYPES.SCALE ? (
                  <div className={cx("scale-stats")}>
                    <div className={cx("scale-stat-item")}>
                      <span>Середнє:</span>
                      <strong>{questionStats.average}</strong>
                    </div>
                    <div className={cx("scale-stat-item")}>
                      <span>Мін:</span>
                      <strong>{questionStats.min}</strong>
                    </div>
                    <div className={cx("scale-stat-item")}>
                      <span>Макс:</span>
                      <strong>{questionStats.max}</strong>
                    </div>
                  </div>
                ) : (
                  <div className={cx("text-stats")}>
                    <p>Відповідей: {questionStats.total}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
export default StatsChart;
