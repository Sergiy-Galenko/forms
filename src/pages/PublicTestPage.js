import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { testsApi } from "../services/TestsApi";
import FormRenderer from "../components/FormView/FormRenderer";
import FormView from "../components/FormView/FormView";
import FormAccessControl from "../components/FormView/FormAccessControl";
import ErrorState from "../components/ui/ErrorState/ErrorState";
import Skeleton from "../components/ui/Skeleton";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import s from "./PublicTestPage.module.css";
const makeId = () =>
  window.crypto?.randomUUID?.().replace(/-/g, "") ||
  `${Date.now()}${Math.random().toString(36).slice(2)}padding`;
function RemoteTest({ id }) {
  const [state, setState] = useState("loading");
  const [form, setForm] = useState(null);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const viewId = useRef(makeId());
  const attemptId = useRef(makeId());
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setState("loading");
    setError("");
    testsApi
      .get(id, controller.signal)
      .then(async (data) => {
        if (cancelled) return;
        setForm(data.form);
        if (data.accessState === "allowed") {
          const access = await testsApi.access(id, "", viewId.current);
          if (!cancelled) {
            setForm(access.form);
            setToken(access.sessionToken);
            setState("allowed");
          }
        } else setState(data.accessState);
      })
      .catch((e) => {
        if (!cancelled && e.name !== "AbortError") {
          setError(e.message);
          setState(e.code === "not_found" ? "not_found" : "error");
        }
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [id]);
  const unlock = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await testsApi.access(id, password, viewId.current);
      setForm(data.form);
      setToken(data.sessionToken);
      setPassword("");
      setState("allowed");
    } catch (e) {
      setError(e.message);
      if (
        ["closed", "expired", "limited", "already_responded"].includes(e.code)
      )
        setState(e.code);
    } finally {
      setBusy(false);
    }
  };
  const submit = async (answers) => {
    try {
      const data = await testsApi.submit(id, {
        answers,
        sessionToken: token,
        attemptId: attemptId.current,
      });
      setResult(data);
      window.scrollTo(0, 0);
    } catch (e) {
      if (
        [
          "closed",
          "expired",
          "limited",
          "already_responded",
          "session",
        ].includes(e.code)
      ) {
        setState(e.code === "session" ? "error" : e.code);
        setError(e.message);
      }
      throw e;
    }
  };
  if (state === "loading")
    return (
      <div className={s.loading} role="status" aria-label="Завантаження тесту">
        <Skeleton count={4} />
      </div>
    );
  if (result)
    return (
      <section className={s.card}>
        <h1>Тест завершено</h1>
        <p>Ваші відповіді збережено.</p>
        {result.score !== undefined ? (
          <p className={s.score}>
            Ваш результат:{" "}
            <strong>
              {result.score} / {result.maxScore}
            </strong>{" "}
            балів
          </p>
        ) : (
          result.isQuiz && <p>Автор приховав результати цього тесту.</p>
        )}
        <Link to="/">На головну</Link>
      </section>
    );
  if (state === "error" || state === "not_found")
    return (
      <ErrorState
        title={
          state === "not_found"
            ? "Тест не знайдено"
            : "Не вдалося відкрити тест"
        }
        description={error}
        onRetry={() => window.location.reload()}
      />
    );
  if (state === "password")
    return (
      <section className={s.card}>
        <h1>{form?.title}</h1>
        <p>Для проходження введіть пароль від автора тесту.</p>
        <form onSubmit={unlock}>
          <Input
            label="Пароль доступу"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            required
          />
          <Button type="submit" isLoading={busy}>
            Почати тест
          </Button>
        </form>
      </section>
    );
  if (state !== "allowed") return <FormAccessControl state={state} />;
  return (
    <FormRenderer currentForm={form} onSubmit={submit} guidedMode={false} />
  );
}
export default function PublicTestPage() {
  const { id } = useParams();
  return id.startsWith("pub_") ? <RemoteTest key={id} id={id} /> : <FormView />;
}
