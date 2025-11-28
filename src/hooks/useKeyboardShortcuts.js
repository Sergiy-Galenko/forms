import { useEffect, useCallback } from 'react';

/**
 * Keyboard shortcuts hook
 */
export const useKeyboardShortcuts = (shortcuts) => {
    const handleKeyDown = useCallback((event) => {
        const { key, ctrlKey, metaKey, shiftKey, altKey } = event;

        shortcuts.forEach(shortcut => {
            const modifierMatch =
                (shortcut.ctrl === undefined || shortcut.ctrl === (ctrlKey || metaKey)) &&
                (shortcut.shift === undefined || shortcut.shift === shiftKey) &&
                (shortcut.alt === undefined || shortcut.alt === altKey);

            const keyMatch = shortcut.key.toLowerCase() === key.toLowerCase();

            if (modifierMatch && keyMatch) {
                event.preventDefault();
                shortcut.action();
            }
        });
    }, [shortcuts]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
