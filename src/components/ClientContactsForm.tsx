
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { ClientContact } from '@/types/survey';

interface ClientContactsFormProps {
  contacts: ClientContact[];
  onChange: (contacts: ClientContact[]) => void;
}

const ClientContactsForm = ({ contacts, onChange }: ClientContactsFormProps) => {
  const [newContact, setNewContact] = useState<ClientContact>({
    name: '',
    email: '',
    phone: '',
  });

  const addContact = () => {
    if (newContact.name.trim()) {
      onChange([...contacts, newContact]);
      setNewContact({ name: '', email: '', phone: '' });
    }
  };

  const removeContact = (index: number) => {
    onChange(contacts.filter((_, i) => i !== index));
  };

  const updateContact = (index: number, field: keyof ClientContact, value: string) => {
    const updated = contacts.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Client Contacts</Label>
      
      {contacts.map((contact, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 bg-gray-50 rounded border">
          <Input
            placeholder="Name"
            value={contact.name}
            onChange={(e) => updateContact(index, 'name', e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={contact.email}
            onChange={(e) => updateContact(index, 'email', e.target.value)}
          />
          <Input
            placeholder="Phone"
            value={contact.phone}
            onChange={(e) => updateContact(index, 'phone', e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeContact(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <Input
          placeholder="Name"
          value={newContact.name}
          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
        />
        <Input
          placeholder="Email"
          type="email"
          value={newContact.email}
          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
        />
        <Input
          placeholder="Phone"
          value={newContact.phone}
          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
        />
        <Button type="button" onClick={addContact}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ClientContactsForm;
