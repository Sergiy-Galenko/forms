import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import { storageService } from "../services/StorageService";
import { testsApi, publicTestUrl } from "../services/TestsApi";
const FormsContext = createContext();
export const DEFAULT_SHARE_SETTINGS = {
  isPublic: true,
  passwordEnabled: false,
  password: "",
  limitResponsesEnabled: false,
  maxResponses: null,
  expiresAt: "",
  showResults: true,
  oneResponsePerDevice: false,
};
export const useForms = () => {
  const value = useContext(FormsContext);
  if (!value) throw new Error("useForms must be used within FormsProvider");
  return value;
};
const newId = () =>
  window.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function FormsProvider({ children }) {
  const [forms, setForms] = useState(() => storageService.getForms());
  const latest = useRef(forms);
  const [currentId, setCurrentId] = useState(null);
  const [view, setView] = useState("dashboard");
  const location = useLocation();
  const commit = useCallback((next) => {
    storageService.saveForms(next);
    latest.current = next;
    setForms(next);
  }, []);
  const setCurrentForm = useCallback(
    (form) => setCurrentId(form?.id || null),
    [],
  );
  useEffect(() => {
    const match = location.pathname.match(/^\/form\/([^/]+)$/);
    if (match && !match[1].startsWith("pub_")) {
      const found = latest.current.find((f) => f.id === match[1]);
      setCurrentId(found?.id || null);
      setView("view");
    } else if (location.pathname === "/forms") {
      setView("dashboard");
    }
  }, [location.pathname]);
  const createForm = useCallback(
    (data) => {
      const form = {
        ...data,
        id: newId(),
        shareSettings: { ...DEFAULT_SHARE_SETTINGS, ...data.shareSettings },
        status: data.status || "draft",
        createdAt: new Date().toISOString(),
        responses: [],
        stats: {
          totalViews: 0,
          totalResponses: 0,
          completionRate: 0,
          averageTime: 0,
        },
      };
      commit([...latest.current, form]);
      return form;
    },
    [commit],
  );
  const updateForm = useCallback(
    (id, updates) => {
      const current = latest.current.find((f) => f.id === id);
      if (!current) return null;
      const next = { ...current, ...updates };
      commit(latest.current.map((f) => (f.id === id ? next : f)));
      return next;
    },
    [commit],
  );
  const deleteForm = useCallback(
    async (id) => {
      const form = latest.current.find((f) => f.id === id);
      if (form?.publication) await testsApi.close(form.publication);
      commit(latest.current.filter((f) => f.id !== id));
      setCurrentId((current) => (current === id ? null : current));
      setView("dashboard");
    },
    [commit],
  );
  const publishForm = useCallback(
    async (id, shareSettings) => {
      const current = latest.current.find((f) => f.id === id);
      if (!current) throw new Error("Спочатку збережіть тест.");
      const form = {
        ...current,
        status: "active",
        shareSettings: {
          ...DEFAULT_SHARE_SETTINGS,
          ...current.shareSettings,
          ...shareSettings,
        },
      };
      let publication = current.publication;
      if (publication) await testsApi.update(publication, form);
      else publication = await testsApi.publish(form);
      updateForm(id, {
        publication,
        status: "active",
        shareSettings: form.shareSettings,
      });
      return publicTestUrl(publication);
    },
    [updateForm],
  );
  const refreshResponses = useCallback(
    async (id) => {
      const form = latest.current.find((f) => f.id === id);
      if (!form?.publication) return;
      const data = await testsApi.owner(form.publication);
      updateForm(id, data);
    },
    [updateForm],
  );
  const addResponse = useCallback(
    async (id, response) => {
      const form = latest.current.find((f) => f.id === id);
      if (!form) throw new Error("Форму не знайдено.");
      const responses = [
        ...form.responses,
        {
          id: newId(),
          ...response,
          submittedAt: new Date().toISOString(),
          ip: null,
        },
      ];
      const totalViews = form.stats?.totalViews || 0;
      updateForm(id, {
        responses,
        stats: {
          ...form.stats,
          totalResponses: responses.length,
          completionRate: totalViews
            ? Math.round((responses.length / totalViews) * 100)
            : 0,
        },
      });
    },
    [updateForm],
  );
  const updateFormStats = useCallback(
    (id, stats) => updateForm(id, { stats }),
    [updateForm],
  );
  return (
    <FormsContext.Provider
      value={{
        forms,
        currentForm: forms.find((f) => f.id === currentId) || null,
        view,
        setView,
        setCurrentForm,
        createForm,
        updateForm,
        deleteForm,
        addResponse,
        updateFormStats,
        publishForm,
        refreshResponses,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
}
