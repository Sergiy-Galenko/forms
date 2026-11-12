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
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={cx("share-url-section")}>
      <label>Посилання для опитування</label>
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
    </div>
  );
};
export default ShareLink;
