import screenStyles from "../../styles/screens.module.css";
import React from "react";
import { Input } from "../ui/Input";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const ShareSettings = ({ shareSettings, onUpdate }) => {
  return (
    <div className={cx("share-options-section")}>
      <h3>Налаштування доступу</h3>

      <div className={cx("share-option")}>
        <label className={cx("share-option-main")}>
          <input
            type="checkbox"
            checked={shareSettings.isPublic}
            onChange={(e) =>
              onUpdate({
                isPublic: e.target.checked,
              })
            }
          />
          <span>Публічне посилання</span>
        </label>
        <p className={cx("share-option-description")}>
          Якщо вимкнути, сторінка за посиланням стане недоступною для
          респондентів.
        </p>
      </div>

      <div className={cx("share-option")}>
        <label className={cx("share-option-main")}>
          <input
            type="checkbox"
            checked={shareSettings.passwordEnabled}
            onChange={(e) =>
              onUpdate({
                passwordEnabled: e.target.checked,
              })
            }
          />
          <span>Захист паролем</span>
        </label>
        {shareSettings.passwordEnabled && (
          <div className={cx("share-option-extra")}>
            <Input
              label="Введіть пароль для доступу"
              type="password"
              placeholder="Введіть пароль для доступу"
              value={shareSettings.password}
              onChange={(e) =>
                onUpdate({
                  password: e.target.value,
                })
              }
              className={cx("share-option-input-wrapper")}
            />
          </div>
        )}
      </div>

      <div className={cx("share-option")}>
        <label className={cx("share-option-main")}>
          <input
            type="checkbox"
            checked={shareSettings.limitResponsesEnabled}
            onChange={(e) =>
              onUpdate({
                limitResponsesEnabled: e.target.checked,
              })
            }
          />
          <span>Обмежити кількість відповідей</span>
        </label>
        {shareSettings.limitResponsesEnabled && (
          <div className={cx("share-option-extra")}>
            <Input
              label="Наприклад, 100"
              type="number"
              min="1"
              placeholder="Наприклад, 100"
              value={shareSettings.maxResponses}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                onUpdate({
                  maxResponses: value,
                });
              }}
              className={cx("share-option-input-wrapper")}
            />
          </div>
        )}
      </div>

      <div className={cx("share-option")}>
        <label className={cx("share-option-main")}>
          <input
            type="checkbox"
            checked={!!shareSettings.expiresAt}
            onChange={(e) =>
              onUpdate({
                expiresAt: e.target.checked
                  ? new Date().toISOString().slice(0, 16)
                  : "",
              })
            }
          />
          <span>Дата закінчення</span>
        </label>
        {!!shareSettings.expiresAt && (
          <div className={cx("share-option-extra")}>
            <Input
              label="Налаштування доступу"
              type="datetime-local"
              value={shareSettings.expiresAt}
              onChange={(e) =>
                onUpdate({
                  expiresAt: e.target.value,
                })
              }
              className={cx("share-option-input-wrapper")}
            />
          </div>
        )}
      </div>

      <div className={cx("share-option")}>
        <label className={cx("share-option-main")}>
          <input
            type="checkbox"
            checked={shareSettings.showResults}
            onChange={(e) =>
              onUpdate({
                showResults: e.target.checked,
              })
            }
          />
          <span>Показувати результати після відповіді</span>
        </label>
      </div>

      <div className={cx("share-option")}>
        <label className={cx("share-option-main")}>
          <input
            type="checkbox"
            checked={shareSettings.oneResponsePerDevice}
            onChange={(e) =>
              onUpdate({
                oneResponsePerDevice: e.target.checked,
              })
            }
          />
          <span>Одна відповідь на пристрій</span>
        </label>
        <p className={cx("share-option-description")}>
          Перевіряє IP-адресу та файли cookie для запобігання повторним
          відповідям.
        </p>
      </div>
    </div>
  );
};
export default ShareSettings;
