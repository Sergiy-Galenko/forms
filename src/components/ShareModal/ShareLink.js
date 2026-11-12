import screenStyles from "../../styles/screens.module.css";
import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const ShareLink = ({ shareUrl }) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const copyToClipboard = async () => {
    setError("");
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        "Не вдалося скопіювати. Виділіть посилання та скопіюйте вручну.",
      );
    }
  };
  return (
    <div className={cx("share-url-section")}>
      <p>Посилання для учасників</p>
      <div className={cx("url-input-group")}>
        <Input
          label="Посилання на форму"
          value={shareUrl}
          readOnly
          className={cx("url-input-wrapper")}
        />
        <Button variant="primary" onClick={copyToClipboard}>
          {copied ? "✓ Скопійовано" : "Копіювати"}
        </Button>
      </div>
      {error && <p role="alert">{error}</p>}
    </div>
  );
};
export default ShareLink;
