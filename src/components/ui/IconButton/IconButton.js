import { forwardRef } from "react";
import Button from "../Button/Button";
import s from "./IconButton.module.css";
export default forwardRef(function IconButton(
  { "aria-label": label, ...props },
  ref,
) {
  if (!label) throw new Error("IconButton requires aria-label");
  return <Button {...props} ref={ref} aria-label={label} className={s.icon} />;
});
