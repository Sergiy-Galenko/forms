class StorageAdapter {
    get(key) { throw new Error('Method not implemented'); }
    set(key, value) { throw new Error('Method not implemented'); }
    remove(key) { throw new Error('Method not implemented'); }
}

class LocalStorageAdapter extends StorageAdapter {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage key "${key}":`, error);
            return null;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage key "${key}":`, error);
        }
    }
}

class StorageService {
    constructor(adapter = new LocalStorageAdapter()) {
        this.adapter = adapter;
        this.KEYS = {
            FORMS: 'forms',
            USER_SETTINGS: 'user_settings'
        };
    }

    getForms() {
        return this.adapter.get(this.KEYS.FORMS) || [];
    }

    saveForms(forms) {
        this.adapter.set(this.KEYS.FORMS, forms);
    }

    getItem(key) {
        return this.adapter.get(key);
    }

    setItem(key, value) {
        this.adapter.set(key, value);
    }
}

export const storageService = new StorageService();
