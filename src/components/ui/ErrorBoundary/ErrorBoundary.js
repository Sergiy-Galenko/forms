import { Component } from "react";
import Button from "../Button/Button";
import s from "./ErrorBoundary.module.css";
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div role="alert" className={s.error}>
        <h1>Не вдалося відкрити сторінку</h1>
        <p>Спробуйте ще раз. Ваші збережені форми залишаються у браузері.</p>
        <Button onClick={() => window.location.reload()}>
          Спробувати ще раз
        </Button>
      </div>
    ) : (
      this.props.children
    );
  }
}
