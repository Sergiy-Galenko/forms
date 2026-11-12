import { FiLock } from "@react-icons/all-files/fi/FiLock";
import screenStyles from "../../styles/screens.module.css";
import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const FormAccessControl = ({ state, onPasswordSubmit }) => {
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onPasswordSubmit(password);
  };
  if (state === "password") {
    return (
      <div className={cx("form-access-control")}>
        <div className={cx("access-card")}>
          <div className={cx("access-icon")}>
            <FiLock aria-hidden="true" />
          </div>
          <h1>Цей опитування захищено паролем</h1>
          <p>Будь ласка, введіть пароль, щоб продовжити</p>
          <form onSubmit={handleSubmit}>
            <Input
              label="Пароль"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cx("access-input")}
            />
            <Button type="submit" variant="primary" fullWidth>
              Увійти
            </Button>
          </form>
        </div>
      </div>
    );
  }
  let message = "";
  switch (state) {
    case "closed":
      message = "Це опитування наразі закрите автором.";
      break;
    case "limited":
      message = "Це опитування досягло ліміту відповідей.";
      break;
    case "expired":
      message = "Термін дії цього опитування закінчився.";
      break;
    case "already_responded":
      message = "Ви вже пройшли це опитування.";
      break;
    default:
      message = "Доступ обмежено.";
  }
  return (
    <div className={cx("form-access-control")}>
      <div className={cx("access-card")}>
        <div className={cx("access-icon")}>
          <FiLock aria-hidden="true" />
        </div>
        <h1>Доступ обмежено</h1>
        <p>{message}</p>
      </div>
    </div>
  );
};
export default FormAccessControl;
