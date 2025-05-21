
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Settings as SettingsIcon, Languages, Monitor } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'en' | 'lt');
    toast({
      title: t('settings.language'),
      description: value === 'en' ? t('settings.english') : t('settings.lithuanian'),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted-foreground">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Languages className="h-5 w-5" />
              <CardTitle>{t('settings.languageSection')}</CardTitle>
            </div>
            <CardDescription>
              {t('settings.language')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              defaultValue={language} 
              onValueChange={handleLanguageChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en">English</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="lt" id="lt" />
                <Label htmlFor="lt">Lietuvių</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <CardTitle>{t('settings.appearanceSection')}</CardTitle>
            </div>
            <CardDescription>
              {t('settings.theme')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="system" className="space-y-3">
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">{t('settings.light')}</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">{t('settings.dark')}</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">{t('settings.system')}</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
