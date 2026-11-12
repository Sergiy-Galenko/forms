import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Button from "./Button/Button";
import Input from "./Input/Input";
import Modal from "./Modal/Modal";
import Tabs from "./Tabs/Tabs";

test("button preserves its label and blocks repeated clicks while loading", () => {
  const click = jest.fn();
  const { rerender } = render(<Button onClick={click}>Зберегти</Button>);
  fireEvent.click(screen.getByRole("button"));
  expect(click).toHaveBeenCalledTimes(1);
  rerender(
    <Button loading onClick={click}>
      Зберегти
    </Button>,
  );
  expect(screen.getByRole("button")).toBeDisabled();
  expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  fireEvent.click(screen.getByRole("button"));
  expect(click).toHaveBeenCalledTimes(1);
});
test("button renders a single semantic link", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Button to="/forms">Форми</Button>
    </MemoryRouter>,
  );
  expect(screen.getByRole("link")).toHaveAttribute("href", "/forms");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
test("input connects its visible label, hint and error", () => {
  render(
    <Input
      label="Ваше ім’я"
      hint="Як до вас звертатися"
      error="Введіть ім’я"
      required
    />,
  );
  const input = screen.getByLabelText(/Ваше ім’я/);
  expect(input).toBeRequired();
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription(
    "Як до вас звертатися Введіть ім’я",
  );
});
test("modal traps focus, closes with Escape and restores trigger focus", () => {
  function Harness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Відкрити</button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Доступ">
          <input aria-label="Пароль" />
          <button>Готово</button>
        </Modal>
      </>
    );
  }
  render(<Harness />);
  const trigger = screen.getByRole("button", { name: "Відкрити" });
  trigger.focus();
  fireEvent.click(trigger);
  const close = screen.getByRole("button", { name: "Закрити" });
  expect(close).toHaveFocus();
  fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
  expect(screen.getByRole("button", { name: "Готово" })).toHaveFocus();
  fireEvent.keyDown(document, { key: "Tab" });
  expect(close).toHaveFocus();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
test("tabs support arrow keys, Home and End", () => {
  function Harness() {
    const [value, setValue] = useState("a");
    return (
      <Tabs
        value={value}
        onChange={setValue}
        items={[
          { id: "a", label: "Поля", content: "Питання" },
          { id: "b", label: "Вигляд", content: "Попередній перегляд" },
        ]}
      />
    );
  }
  render(<Harness />);
  const [first, last] = screen.getAllByRole("tab");
  first.focus();
  fireEvent.keyDown(first, { key: "ArrowRight" });
  expect(last).toHaveFocus();
  expect(last).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Попередній перегляд");
  fireEvent.keyDown(last, { key: "Home" });
  expect(first).toHaveFocus();
  fireEvent.keyDown(first, { key: "End" });
  expect(last).toHaveFocus();
});
