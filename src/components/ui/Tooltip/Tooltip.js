import { useId } from "react";
import s from "./Tooltip.module.css";
export default function Tooltip({ children, text }) {
  const id = useId();
  return (
    <span className={s.wrap} tabIndex={0} aria-describedby={id}>
      {children}
      <span role="tooltip" id={id} className={s.tip}>
        {text}
      </span>
    </span>
  );
}
