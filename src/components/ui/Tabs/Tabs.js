import { useId, useRef } from "react";
import s from "./Tabs.module.css";
export default function Tabs({ items, value, onChange, label = "Вкладки" }) {
  const id = useId();
  const refs = useRef([]);
  return (
    <div>
      <div className={s.list} role="tablist" aria-label={label}>
        {items.map((item, i) => (
          <button
            ref={(el) => (refs.current[i] = el)}
            key={item.id}
            id={`${id}-${item.id}`}
            role="tab"
            type="button"
            aria-selected={value === item.id}
            aria-controls={`${id}-${item.id}-panel`}
            tabIndex={value === item.id ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => {
              let n;
              if (e.key === "ArrowRight") n = (i + 1) % items.length;
              if (e.key === "ArrowLeft")
                n = (i - 1 + items.length) % items.length;
              if (e.key === "Home") n = 0;
              if (e.key === "End") n = items.length - 1;
              if (n !== undefined) {
                e.preventDefault();
                onChange(items[n].id);
                refs.current[n].focus();
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          tabIndex={0}
          hidden={value !== item.id}
          id={`${id}-${item.id}-panel`}
          aria-labelledby={`${id}-${item.id}`}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
