import { FiArrowRight } from "@react-icons/all-files/fi/FiArrowRight";
import Button from "../components/ui/Button/Button";
import s from "./HomePage.module.css";
export default function HomePage() {
  return (
    <div>
      <section className={s.hero}>
        <div className={s.copy}>
          <p className={s.eyebrow}>FORMSCRAFT · ПРОСТІР ДЛЯ ВАШИХ ПИТАНЬ</p>
          <h1>
            Хороші рішення
            <br />
            починаються
            <br />з <span>хороших питань.</span>
          </h1>
          <p className={s.intro}>
            Від першого питання до зрозумілих відповідей. Створюйте опитування,
            діліться ними й бачте головне.
          </p>
          <div className={s.actions}>
            <Button
              to="/forms"
              iconRight={<FiArrowRight aria-hidden="true" />}
              size="lg"
            >
              Створити форму
            </Button>
            <Button to="/about" variant="ghost">
              Про FormsCraft
            </Button>
          </div>
          <p className={s.note}>
            Без реєстрації. Ваші дані — у вашому браузері.
          </p>
        </div>
        <div className={s.preview} aria-label="Приклад оформлення опитування">
          <div className={s.previewTop}>
            <span>ПРИКЛАД ФОРМИ</span>
            <span>01 / 03</span>
          </div>
          <div className={s.rule} />
          <p className={s.category}>ЗВОРОТНИЙ ЗВ’ЯЗОК</p>
          <h2>
            Ваша думка
            <br />
            має значення.
          </h2>
          <p>Кілька питань, щоб наступного разу стати кращими.</p>
          <div className={s.question}>
            <span>01</span>
            <h3>Що вам сподобалося найбільше?</h3>
          </div>
          <div className={s.answer}>Поділіться враженнями…</div>
          <div className={s.previewBottom}>
            <span>Приклад короткої відповіді</span>
            <FiArrowRight aria-hidden="true" />
          </div>
        </div>
      </section>
      <section className={s.workflow}>
        <div>
          <p className={s.eyebrow}>ВІД ІДЕЇ ДО ВІДПОВІДЕЙ</p>
          <h2>
            Менше налаштувань.
            <br />
            Більше змісту.
          </h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <h3>Сформулюйте питання</h3>
              <p>
                Вісім типів полів: від короткої відповіді до шкали оцінювання.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Підготуйте форму</h3>
              <p>Додайте опис і налаштуйте доступ для респондентів.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Побачте результат</h3>
              <p>Переглядайте відповіді та статистику в одному місці.</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  );
}
