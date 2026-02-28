import { useState } from 'react';
import { X, Calendar, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/i18n';
import { useCommunityStore } from '@/store/communityStore';
import { toast } from 'sonner';

interface CreateEventModalProps { open: boolean; onClose: () => void; communityId: string; }

export function CreateEventModal({ open, onClose, communityId }: CreateEventModalProps) {
  const { t } = useTranslation();
  const { createEvent, fetchEvents } = useCommunityStore();
  const [formData, setFormData] = useState({ title: '', description: '', location: '', event_type: 'meetup' as const, start_date: '', end_date: '', max_attendees: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await createEvent({
      community_id: communityId, title: formData.title, description: formData.description,
      location: formData.location || undefined, event_type: formData.event_type,
      start_date: formData.start_date, end_date: formData.end_date || undefined,
      max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined
    });
    if (error) toast.error(t('errors.generic'));
    else { toast.success(t('common.success')); await fetchEvents(communityId); onClose(); setFormData({ title: '', description: '', location: '', event_type: 'meetup', start_date: '', end_date: '', max_attendees: '' }); }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">{t('events.createEvent')}<Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('events.eventName')} *</Label>
            <Input value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label>{t('events.type')} *</Label>
            <Select value={formData.event_type} onValueChange={(v: any) => setFormData(prev => ({ ...prev, event_type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="meetup">{t('events.types.meetup')}</SelectItem>
                <SelectItem value="webinar">{t('events.types.webinar')}</SelectItem>
                <SelectItem value="workshop">{t('events.types.workshop')}</SelectItem>
                <SelectItem value="social">{t('events.types.social')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('events.eventDescription')}</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>{t('events.location')}</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} className="pl-10" placeholder="Ubicación o enlace" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('events.startDate')} *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="datetime-local" value={formData.start_date} onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('events.endDate')}</Label>
              <Input type="datetime-local" value={formData.end_date} onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('events.maxAttendees')}</Label>
            <Input type="number" value={formData.max_attendees} onChange={(e) => setFormData(prev => ({ ...prev, max_attendees: e.target.value }))} placeholder="Sin límite" min="1" />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>{isLoading ? t('common.loading') : t('events.createEvent')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
