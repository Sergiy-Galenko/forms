import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";
import Dashboard from "../components/Dashboard/Dashboard";
import FormRenderer from "../components/FormView/FormRenderer";
import { FormsProvider } from "../context/FormsContext";
import { ToastProvider } from "../components/ui/Toast/Toast";
const Wrapper = ({ children }) => (
  <MemoryRouter
    initialEntries={["/forms"]}
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <ToastProvider>
      <FormsProvider>{children}</FormsProvider>
    </ToastProvider>
  </MemoryRouter>
);
beforeEach(() => localStorage.clear());
test("home links to the existing forms route", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <HomePage />
    </MemoryRouter>,
  );
  expect(screen.getByRole("link", { name: "Створити форму" })).toHaveAttribute(
    "href",
    "/forms",
  );
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
});
test("dashboard retains local data, filters and empty state", async () => {
  localStorage.setItem(
    "forms",
    JSON.stringify([
      {
        id: "1",
        title: "Відгук",
        description: "",
        status: "draft",
        questions: [],
        responses: [],
        createdAt: "2026-01-01",
      },
    ]),
  );
  render(<Dashboard />, { wrapper: Wrapper });
  expect(screen.getByRole("heading", { name: "Відгук" })).toBeInTheDocument();
  fireEvent.change(
    screen.getByRole("combobox", { name: "Фільтр за статусом" }),
    { target: { value: "active" } },
  );
  expect(await screen.findByText("Нічого не знайдено")).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("forms"))).toHaveLength(1);
});
test("public form focuses first missing answer and submits unchanged answer data", async () => {
  const submit = jest.fn().mockResolvedValue();
  render(
    <FormRenderer
      currentForm={{
        title: "Відгук",
        questions: [
          { id: "q1", type: "text", title: "Ваше ім’я", required: true },
        ],
      }}
      onSubmit={submit}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Відправити" }));
  const input = screen.getByRole("textbox", { name: "Ваше ім’я" });
  expect(input).toHaveFocus();
  expect(submit).not.toHaveBeenCalled();
  fireEvent.change(input, { target: { value: "Олена" } });
  fireEvent.click(screen.getByRole("button", { name: "Відправити" }));
  await waitFor(() => expect(submit).toHaveBeenCalledWith({ q1: "Олена" }));
});

test.each([
  ["text", "Олена"],
  ["textarea", "Довша відповідь"],
  ["email", "olena@example.com"],
  ["number", "2"],
  ["date", "2026-11-12"],
  ["single", "Варіант A"],
  ["multiple", ["Варіант A"]],
  ["scale", 3],
])("preserves answer shape for %s", async (type, value) => {
  const submit = jest.fn().mockResolvedValue();
  render(
    <FormRenderer
      currentForm={{
        title: "Тест типу",
        questions: [
          {
            id: "q",
            title: "Питання",
            type,
            required: true,
            options: [{ id: "a", text: "Варіант A" }],
            scale: { min: 1, max: 5 },
          },
        ],
      }}
      onSubmit={submit}
    />,
  );
  if (type === "single" || type === "multiple")
    fireEvent.click(screen.getByLabelText("Варіант A"));
  else
    fireEvent.change(screen.getByLabelText("Питання"), {
      target: { value: Array.isArray(value) ? value[0] : String(value) },
    });
  fireEvent.click(screen.getByRole("button", { name: "Відправити" }));
  await waitFor(() => expect(submit).toHaveBeenCalledWith({ q: value }));
});
