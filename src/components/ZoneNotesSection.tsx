
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MapPin } from 'lucide-react';
import { SurveyZone, SurveyNote } from '@/types/survey';

interface ZoneNotesSectionProps {
  surveyId: string;
  zones: SurveyZone[];
  notes: SurveyNote[];
  loading: boolean;
  onCreateZone: (zoneName: string, zoneType: SurveyZone['zone_type']) => Promise<SurveyZone>;
  onCreateNote: (zoneId: string, noteContent: string) => Promise<SurveyNote>;
}

const ZoneNotesSection = ({ surveyId, zones, notes, loading, onCreateZone, onCreateNote }: ZoneNotesSectionProps) => {
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneType, setNewZoneType] = useState<SurveyZone['zone_type']>('area');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [newNote, setNewNote] = useState('');

  const handleCreateZone = async () => {
    if (newZoneName.trim()) {
      await onCreateZone(newZoneName.trim(), newZoneType);
      setNewZoneName('');
    }
  };

  const handleCreateNote = async () => {
    if (selectedZoneId && newNote.trim()) {
      await onCreateNote(selectedZoneId, newNote.trim());
      setNewNote('');
    }
  };

  const getZoneNotes = (zoneId: string) => {
    return notes.filter(note => note.zone_id === zoneId);
  };

  if (loading) {
    return <div className="text-center py-8">Loading zones and notes...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create New Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Create New Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              placeholder="Zone name..."
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
            />
            <Select value={newZoneType} onValueChange={(value: SurveyZone['zone_type']) => setNewZoneType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="cabin">Cabin</SelectItem>
                <SelectItem value="public_zone">Public Zone</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreateZone} disabled={!newZoneName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Zone
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Notes to Zones */}
      {zones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Add Note</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedZoneId} onValueChange={setSelectedZoneId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a zone..." />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.zone_name} ({zone.zone_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Enter your note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleCreateNote} 
                disabled={!selectedZoneId || !newNote.trim()}
              >
                Add Note
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Display Zones and Notes */}
      <div className="space-y-4">
        {zones.map((zone) => {
          const zoneNotes = getZoneNotes(zone.id);
          return (
            <Card key={zone.id}>
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {zone.zone_name}
                  <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {zone.zone_type.replace('_', ' ')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {zoneNotes.length > 0 ? (
                  <div className="space-y-3">
                    {zoneNotes.map((note) => (
                      <div key={note.id} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                        <p className="text-gray-800">{note.note_content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(note.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No notes yet for this zone.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {zones.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No zones created yet</h3>
            <p className="text-gray-500">Create your first zone to start adding notes.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ZoneNotesSection;
