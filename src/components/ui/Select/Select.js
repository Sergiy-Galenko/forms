import { forwardRef } from "react";
import Input from "../Input/Input";
import s from "./Select.module.css";
export default forwardRef(function Select(props, ref) {
  return (
    <Input
      {...props}
      ref={ref}
      type="select"
      className={[s.field, props.className].filter(Boolean).join(" ")}
    />
  );
});
