import { useEffect, useRef, useState } from "react";
import { useForms } from "../../context/FormsContext";
import { useExperience } from "../../context/ExperienceContext";
import FormRenderer from "./FormRenderer";
import FormSuccess from "./FormSuccess";
import ErrorState from "../ui/ErrorState/ErrorState";
export default function FormView() {
  const { currentForm, addResponse, updateFormStats } = useForms();
  const { experience } = useExperience();
  const [submitted, setSubmitted] = useState(false);
  const viewed = useRef(null);
  useEffect(() => {
    if (currentForm && viewed.current !== currentForm.id) {
      viewed.current = currentForm.id;
      updateFormStats(currentForm.id, {
        ...currentForm.stats,
        totalViews: (currentForm.stats?.totalViews || 0) + 1,
      });
    }
  }, [currentForm, updateFormStats]);
  if (!currentForm)
    return (
      <ErrorState
        title="Форму не знайдено"
        description="Це локальне посилання. Попросіть автора опублікувати тест і надіслати нове посилання."
      />
    );
  if (submitted) return <FormSuccess form={currentForm} />;
  return (
    <>
      <p>
        Локальний перегляд. Для проходження іншими учасниками опублікуйте тест
        через «Поділитися».
      </p>
      <FormRenderer
        currentForm={currentForm}
        onSubmit={async (answers) => {
          await addResponse(currentForm.id, { answers });
          setSubmitted(true);
        }}
        guidedMode={experience.guidedMode}
      />
    </>
  );
}
