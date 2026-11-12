import s from "./Skeleton.module.css";
export default function Skeleton({ count = 1, width, height, circle = false }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`${s.item} ${circle ? s.circle : ""}`}
          style={{ width, height: circle ? width : height }}
        />
      ))}
    </>
  );
}
