import { forwardRef, useId } from "react";
import Field from "../Field/Field";
import s from "./Input.module.css";
const Input = forwardRef(function Input(
  {
    label,
    type = "text",
    error,
    hint,
    helperText,
    icon: Icon,
    iconPosition = "left",
    required = false,
    disabled = false,
    showCharCount = false,
    maxLength,
    autoResize = false,
    className = "",
    id: provided,
    ...props
  },
  ref,
) {
  const auto = useId();
  const id = provided || auto;
  const Control =
    type === "textarea" ? "textarea" : type === "select" ? "select" : "input";
  return (
    <div className={className}>
      <Field
        id={id}
        label={label}
        hint={hint || helperText}
        error={error}
        required={required}
      >
        {(a) => (
          <div className={s.wrap}>
            {Icon && <Icon className={s.icon} aria-hidden="true" />}
            <Control
              {...props}
              {...a}
              ref={ref}
              type={Control === "input" ? type : undefined}
              required={required}
              disabled={disabled}
              maxLength={maxLength}
              className={[s.control, Icon ? s.withIcon : ""].join(" ")}
            />
          </div>
        )}
      </Field>
      {showCharCount && maxLength && (
        <small>
          {props.value?.length || 0}/{maxLength}
        </small>
      )}
    </div>
  );
});
export const TextArea = forwardRef((props, ref) => (
  <Input {...props} ref={ref} type="textarea" />
));
export { Input };
export default Input;
