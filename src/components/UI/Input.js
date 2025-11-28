import React, { useState, useRef, useEffect } from 'react';
import './Input.css';

const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    helperText,
    icon: Icon,
    iconPosition = 'left',
    required = false,
    disabled = false,
    maxLength,
    showCharCount = false,
    autoResize = false,
    rows = 3,
    className = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef(null);
    const isTextarea = type === 'textarea';

    useEffect(() => {
        if (autoResize && isTextarea && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value, autoResize, isTextarea]);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const containerClasses = [
        'input-container',
        isFocused && 'input-focused',
        error && 'input-error',
        disabled && 'input-disabled',
        className
    ].filter(Boolean).join(' ');

    const wrapperClasses = [
        'input-wrapper',
        Icon && `input-with-icon-${iconPosition}`
    ].filter(Boolean).join(' ');

    const charCount = value?.length || 0;
    const showCount = showCharCount && maxLength;

    return (
        <div className={containerClasses}>
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}

            <div className={wrapperClasses}>
                {Icon && iconPosition === 'left' && (
                    <Icon className="input-icon input-icon-left" />
                )}

                {isTextarea ? (
                    <textarea
                        ref={textareaRef}
                        className="input-field input-textarea"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        maxLength={maxLength}
                        rows={autoResize ? 1 : rows}
                        {...props}
                    />
                ) : (
                    <input
                        type={type}
                        className="input-field"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        maxLength={maxLength}
                        {...props}
                    />
                )}

                {Icon && iconPosition === 'right' && (
                    <Icon className="input-icon input-icon-right" />
                )}
            </div>

            {(error || helperText || showCount) && (
                <div className="input-footer">
                    <div className="input-message">
                        {error && <span className="input-error-message">{error}</span>}
                        {!error && helperText && (
                            <span className="input-helper-text">{helperText}</span>
                        )}
                    </div>
                    {showCount && (
                        <span className="input-char-count">
                            {charCount}/{maxLength}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export { Input };
export const TextArea = Input; // Alias for backward compatibility
export default Input;
