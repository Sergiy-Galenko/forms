import ExcelImport from "../ExcelImport/ExcelImport";
import screenStyles from "../../styles/screens.module.css";
import React, { useState, useMemo } from "react";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { FiSearch } from "@react-icons/all-files/fi/FiSearch";
import { FiGrid } from "@react-icons/all-files/fi/FiGrid";
import { useForms } from "../../context/FormsContext";
import { useDebounce } from "../../hooks/useDebounce";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import FormCard from "./FormCard";
import { FORM_STATUS } from "../../types";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const Dashboard = () => {
  const { forms, setView, setCurrentForm } = useForms();
  const [importOpen, setImportOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const handleCreateForm = () => {
    setCurrentForm(null);
    setView("create");
  };
  const filteredForms = useMemo(() => {
    let result = [...forms];
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (form) =>
          form.title?.toLowerCase().includes(term) ||
          form.description?.toLowerCase().includes(term),
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((form) => form.status === statusFilter);
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.title || "").localeCompare(b.title || "");
        case "responses":
          return (b.responses?.length || 0) - (a.responses?.length || 0);
        case "date":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    return result;
  }, [forms, debouncedSearch, statusFilter, sortBy]);
  const stats = useMemo(() => {
    return {
      total: forms.length,
      active: forms.filter((f) => f.status === FORM_STATUS.ACTIVE).length,
      draft: forms.filter((f) => f.status === FORM_STATUS.DRAFT).length,
      responses: forms.reduce((sum, f) => sum + (f.responses?.length || 0), 0),
    };
  }, [forms]);
  return (
    <div className={cx("dashboard")}>
      {importOpen && <ExcelImport onClose={() => setImportOpen(false)} />}
      {}
      <div className={cx("dashboard-header")}>
        <div>
          <h1 className={cx("dashboard-title")}>Мої форми</h1>
          <p className={cx("dashboard-subtitle")}>
            Створюйте, керуйте та аналізуйте свої форми
          </p>
        </div>
        <div className={cx("builder-actions")}>
          <Button variant="secondary" onClick={() => setImportOpen(true)}>
            Імпортувати Excel
          </Button>
          <Button icon={FiPlus} size="lg" onClick={handleCreateForm}>
            Створити форму
          </Button>
        </div>
      </div>

      {}
      <div className={cx("dashboard-stats")}>
        <Card className={cx("stat-card")}>
          <div className={cx("stat-value")}>{stats.total}</div>
          <div className={cx("stat-label")}>Всього форм</div>
        </Card>
        <Card className={cx("stat-card")}>
          <div className={cx("stat-value")}>{stats.active}</div>
          <div className={cx("stat-label")}>Активні</div>
        </Card>
        <Card className={cx("stat-card")}>
          <div className={cx("stat-value")}>{stats.draft}</div>
          <div className={cx("stat-label")}>Чернетки</div>
        </Card>
        <Card className={cx("stat-card")}>
          <div className={cx("stat-value")}>{stats.responses}</div>
          <div className={cx("stat-label")}>Відповіді</div>
        </Card>
      </div>

      {}
      <div className={cx("dashboard-controls")}>
        <div className={cx("dashboard-search")}>
          <Input
            label="Пошук форм..."
            placeholder="Пошук форм..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={FiSearch}
          />
        </div>

        <div className={cx("dashboard-filters")}>
          <select
            aria-label="Фільтр за статусом"
            className={cx("filter-select")}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Всі статуси</option>
            <option value={FORM_STATUS.ACTIVE}>Активні</option>
            <option value={FORM_STATUS.DRAFT}>Чернетки</option>
            <option value={FORM_STATUS.CLOSED}>Закриті</option>
          </select>

          <select
            aria-label="Сортування форм"
            className={cx("filter-select")}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">За датою</option>
            <option value="name">За назвою</option>
            <option value="responses">За відповідями</option>
          </select>
        </div>
      </div>

      {}
      {filteredForms.length > 0 ? (
        <div className={cx("dashboard-grid")}>
          {filteredForms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      ) : (
        <Card glass className={cx("empty-state")}>
          <FiGrid className={cx("empty-icon")} />
          <h2 className={cx("empty-title")}>
            {debouncedSearch || statusFilter !== "all"
              ? "Нічого не знайдено"
              : "У вас ще немає форм"}
          </h2>
          <p className={cx("empty-description")}>
            {debouncedSearch || statusFilter !== "all"
              ? "Спробуйте змінити параметри фільтрування"
              : "Створіть свою першу форму, щоб почати збирати відповіді"}
          </p>
          {!debouncedSearch && statusFilter === "all" && (
            <Button icon={FiPlus} onClick={handleCreateForm}>
              Створити першу форму
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};
export default Dashboard;
