
import { useLanguage } from "@/contexts/LanguageContext";
import { AccordionReadingForm } from "@/components/reading/AccordionReadingForm";

const AddMonthlyReadings = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('addMonthly.pageTitle')}</h1>
        <p className="text-muted-foreground">
          {t('addMonthly.pageSubtitle')}
        </p>
      </div>

      <AccordionReadingForm />
    </div>
  );
};

export default AddMonthlyReadings;
