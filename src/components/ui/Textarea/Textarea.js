import { forwardRef } from "react";
import Input from "../Input/Input";
import s from "./Textarea.module.css";
export default forwardRef(function Textarea(props, ref) {
  return (
    <Input
      {...props}
      ref={ref}
      type="textarea"
      className={[s.field, props.className].filter(Boolean).join(" ")}
    />
  );
});
