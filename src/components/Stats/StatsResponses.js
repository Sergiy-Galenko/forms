import screenStyles from "../../styles/screens.module.css";
import React from "react";
import { Card } from "../ui/Card";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const StatsResponses = ({ responses, currentForm }) => {
  if (!responses.length) return null;
  return (
    <div className={cx("responses-list")}>
      <h2>Останні відповіді</h2>
      <div className={cx("responses-grid")}>
        {responses
          .slice(-10)
          .reverse()
          .map((response) => (
            <Card key={response.id} className={cx("response-card")}>
              <div className={cx("response-date")}>
                {new Date(response.submittedAt).toLocaleString("uk-UA")}
              </div>
              <div className={cx("response-answers")}>
                {Object.entries(response.answers).map(
                  ([questionId, answer]) => {
                    const question = currentForm.questions.find(
                      (q) => q.id === questionId,
                    );
                    if (!question) return null;
                    return (
                      <div key={questionId} className={cx("response-answer")}>
                        <strong>{question.title}:</strong>
                        <span>
                          {Array.isArray(answer)
                            ? answer.join(", ")
                            : String(answer)}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};
export default StatsResponses;
