
import { useLanguage } from "@/contexts/LanguageContext";
import { ReadingForm } from "@/components/reading/ReadingForm";

const AddReading = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('addReading.title')}</h1>
        <p className="text-muted-foreground">
          {t('addReading.subtitle')}
        </p>
      </div>

      <ReadingForm />
    </div>
  );
};

export default AddReading;
