
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define available languages and their labels
export type Language = 'en' | 'lt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define translations
const translations = {
  en: {
    // General
    'app.title': 'UtilityFlow',
    'app.description': 'Track and manage your utility consumption',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.addReading': 'Add Reading',
    'nav.history': 'History',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Monitor your utility consumption and costs',
    'dashboard.addReading': 'Add Reading',
    'dashboard.trends': 'Consumption Trends',
    'dashboard.trendsDescription': 'Monthly utility consumption over the last 6 months',
    'dashboard.recent': 'Recent Readings',
    'dashboard.recentDescription': 'Your latest submitted utility readings',
    
    // Add Reading
    'addReading.title': 'Add Reading',
    'addReading.subtitle': 'Record a new utility reading to track your consumption',
    'addReading.formTitle': 'New Utility Reading',
    'addReading.formDescription': 'Enter the details for your utility reading below',
    'addReading.utilityType': 'Utility Type',
    'addReading.utilityTypeDesc': 'Select the type of utility',
    'addReading.date': 'Date',
    'addReading.dateDesc': 'Date of the meter reading',
    'addReading.reading': 'Reading Value',
    'addReading.readingDesc': 'Enter the meter reading value',
    'addReading.cost': 'Cost',
    'addReading.costDesc': 'Enter the cost for this utility',
    'addReading.notes': 'Notes (Optional)',
    'addReading.submit': 'Save Reading',
    'addReading.submitting': 'Saving...',
    'addReading.supplier': 'Supplier',
    'addReading.supplierDesc': 'Select the supplier for this utility',
    'addReading.pickDate': 'Pick a date',
    
    // Utility Types
    'utility.electricity': 'Electricity',
    'utility.water': 'Water',
    'utility.gas': 'Gas',
    'utility.hotWater': 'Hot Water & Heating',
    'utility.internet': 'Internet',
    'utility.phone': 'Phone',
    'utility.housing': 'Housing Services',
    'utility.renovation': 'Renovation',
    'utility.loan': 'Loan',
    'utility.interest': 'Interest',
    'utility.insurance': 'Insurance',
    'utility.waste': 'Waste Management',
    
    // Suppliers
    'supplier.elektrum': 'Elektrum',
    'supplier.ignitis': 'Ignitis',
    'supplier.klaipedosEnergija': 'Klaipėdos Energija',
    'supplier.klaipedosVanduo': 'Klaipėdos Vanduo',
    'supplier.paslauga': 'Paslaugos Būstui',
    'supplier.telia': 'Telia',
    'supplier.arvilas': 'Arvilas',
    'supplier.bank': 'Bank',
    'supplier.kratc': 'KRATC',
    
    // History
    'history.title': 'Reading History',
    'history.subtitle': 'View and filter all your past utility readings',
    'history.search': 'Search readings...',
    'history.filter': 'Filter by type',
    'history.clear': 'Clear Filters',
    'history.allTypes': 'All Types',
    'history.noResults': 'No readings match the current filters',
    'history.loading': 'Loading readings...',
    'history.showing': 'Showing',
    'history.of': 'of',
    'history.readings': 'readings',
    'history.deleteAll': 'Delete All',
    'history.import': 'Import CSV',
    
    // Table Headers
    'table.date': 'Date',
    'table.type': 'Type',
    'table.supplier': 'Supplier',
    'table.reading': 'Reading',
    'table.unit': 'Unit',
    'table.amount': 'Amount',
    'table.notes': 'Notes',
    
    // Settings
    'settings.language': 'Language',
    'settings.english': 'English',
    'settings.lithuanian': 'Lithuanian',
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your application preferences',
    'settings.languageSection': 'Language Settings',
    'settings.appearanceSection': 'Appearance Settings',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',
    
    // Confirmations
    'confirm.deleteTitle': 'Are you absolutely sure?',
    'confirm.deleteDescription': 'This action cannot be undone. This will permanently delete all your utility readings data from the server.',
    'confirm.cancel': 'Cancel',
    'confirm.delete': 'Yes, delete all',
    
    // Success/Error messages
    'success.reading': 'Reading Added',
    'success.readingDesc': 'Your utility reading has been saved.',
    'success.import': 'Success',
    'success.importDesc': 'Entries imported successfully',
    'success.delete': 'Success',
    'success.deleteDesc': 'All entries have been deleted',
    'error.load': 'Error',
    'error.loadDesc': 'Failed to load utility readings',
    'error.deleteDesc': 'Failed to delete entries',
  },
  lt: {
    // General
    'app.title': 'Komunaliniai',
    'app.description': 'Sekite ir valdykite savo komunalinių paslaugų vartojimą',
    
    // Navigation
    'nav.dashboard': 'Skydelis',
    'nav.addReading': 'Pridėti Rodmenis',
    'nav.history': 'Istorija',
    'nav.analytics': 'Analitika',
    'nav.settings': 'Nustatymai',
    
    // Dashboard
    'dashboard.title': 'Skydelis',
    'dashboard.subtitle': 'Stebėkite savo komunalinių paslaugų vartojimą ir išlaidas',
    'dashboard.addReading': 'Pridėti Rodmenis',
    'dashboard.trends': 'Vartojimo Tendencijos',
    'dashboard.trendsDescription': 'Mėnesinis komunalinių paslaugų vartojimas per pastaruosius 6 mėnesius',
    'dashboard.recent': 'Naujausi Rodmenys',
    'dashboard.recentDescription': 'Jūsų paskutiniai pateikti komunalinių paslaugų rodmenys',
    
    // Add Reading
    'addReading.title': 'Pridėti Rodmenis',
    'addReading.subtitle': 'Įrašykite naujus komunalinių paslaugų rodmenis, kad galėtumėte sekti vartojimą',
    'addReading.formTitle': 'Nauji Komunalinių Paslaugų Rodmenys',
    'addReading.formDescription': 'Įveskite savo komunalinių paslaugų rodmenų informaciją žemiau',
    'addReading.utilityType': 'Paslaugos Tipas',
    'addReading.utilityTypeDesc': 'Pasirinkite komunalinės paslaugos tipą',
    'addReading.date': 'Data',
    'addReading.dateDesc': 'Skaitiklio rodmenų data',
    'addReading.reading': 'Rodmens Reikšmė',
    'addReading.readingDesc': 'Įveskite skaitiklio rodmenų reikšmę',
    'addReading.cost': 'Kaina',
    'addReading.costDesc': 'Įveskite kainą už šią komunalinę paslaugą',
    'addReading.notes': 'Pastabos (Neprivaloma)',
    'addReading.submit': 'Išsaugoti Rodmenis',
    'addReading.submitting': 'Saugoma...',
    'addReading.supplier': 'Tiekėjas',
    'addReading.supplierDesc': 'Pasirinkite šios komunalinės paslaugos tiekėją',
    'addReading.pickDate': 'Pasirinkite datą',
    
    // Utility Types
    'utility.electricity': 'Elektra',
    'utility.water': 'Vanduo',
    'utility.gas': 'Dujos',
    'utility.hotWater': 'Karštas Vanduo ir Šiluma',
    'utility.internet': 'Internetas',
    'utility.phone': 'Telefonas',
    'utility.housing': 'Būsto Paslaugos',
    'utility.renovation': 'Renovacija',
    'utility.loan': 'Paskola',
    'utility.interest': 'Palūkanos',
    'utility.insurance': 'Draudimas',
    'utility.waste': 'Atliekų Tvarkymas',
    
    // Suppliers
    'supplier.elektrum': 'Elektrum',
    'supplier.ignitis': 'Ignitis',
    'supplier.klaipedosEnergija': 'Klaipėdos Energija',
    'supplier.klaipedosVanduo': 'Klaipėdos Vanduo',
    'supplier.paslauga': 'Paslaugos Būstui',
    'supplier.telia': 'Telia',
    'supplier.arvilas': 'Arvilas',
    'supplier.bank': 'Bankas',
    'supplier.kratc': 'KRATC',
    
    // History
    'history.title': 'Rodmenų Istorija',
    'history.subtitle': 'Peržiūrėkite ir filtruokite visus savo praeities komunalinių paslaugų rodmenis',
    'history.search': 'Ieškoti rodmenų...',
    'history.filter': 'Filtruoti pagal tipą',
    'history.clear': 'Išvalyti Filtrus',
    'history.allTypes': 'Visi Tipai',
    'history.noResults': 'Nėra rodmenų atitinkančių filtrus',
    'history.loading': 'Kraunami rodmenys...',
    'history.showing': 'Rodoma',
    'history.of': 'iš',
    'history.readings': 'rodmenų',
    'history.deleteAll': 'Ištrinti Viską',
    'history.import': 'Importuoti CSV',
    
    // Table Headers
    'table.date': 'Data',
    'table.type': 'Tipas',
    'table.supplier': 'Tiekėjas',
    'table.reading': 'Rodmenys',
    'table.unit': 'Vienetas',
    'table.amount': 'Suma',
    'table.notes': 'Pastabos',
    
    // Settings
    'settings.language': 'Kalba',
    'settings.english': 'Anglų',
    'settings.lithuanian': 'Lietuvių',
    'settings.title': 'Nustatymai',
    'settings.subtitle': 'Tvarkykite savo programos nuostatas',
    'settings.languageSection': 'Kalbos Nustatymai',
    'settings.appearanceSection': 'Išvaizdos Nustatymai',
    'settings.theme': 'Tema',
    'settings.light': 'Šviesi',
    'settings.dark': 'Tamsi',
    'settings.system': 'Sistema',
    
    // Confirmations
    'confirm.deleteTitle': 'Ar tikrai to norite?',
    'confirm.deleteDescription': 'Šio veiksmo negalima atšaukti. Bus visam laikui ištrinti visi jūsų komunalinių paslaugų rodmenys iš serverio.',
    'confirm.cancel': 'Atšaukti',
    'confirm.delete': 'Taip, ištrinti viską',
    
    // Success/Error messages
    'success.reading': 'Rodmenys Pridėti',
    'success.readingDesc': 'Jūsų komunalinių paslaugų rodmenys buvo išsaugoti.',
    'success.import': 'Sėkmingai',
    'success.importDesc': 'Įrašai importuoti sėkmingai',
    'success.delete': 'Sėkmingai',
    'success.deleteDesc': 'Visi įrašai buvo ištrinti',
    'error.load': 'Klaida',
    'error.loadDesc': 'Nepavyko įkelti komunalinių paslaugų rodmenų',
    'error.deleteDesc': 'Nepavyko ištrinti įrašų',
  }
};

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language from local storage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'lt' ? 'lt' : 'en') as Language;
  });

  // Function to change language and save to local storage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    const langPack = translations[language];
    return langPack[key as keyof typeof langPack] || key;
  };

  // Effect to update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
