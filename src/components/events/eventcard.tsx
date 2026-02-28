import { Calendar, MapPin, Users, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/types';
import { useTranslation } from '@/i18n';
import { format } from 'date-fns';
import { es, fr } from 'date-fns/locale';
import { useCommunityStore } from '@/store/communityStore';
import { toast } from 'sonner';

interface EventCardProps { event: Event; }

export function EventCard({ event }: EventCardProps) {
  const { t, lang } = useTranslation();
  const { rsvpEvent, fetchEvents } = useCommunityStore();
  const locale = lang === 'fr' ? fr : es;
  const eventTypeLabels: Record<string, string> = { meetup: t('events.types.meetup'), webinar: t('events.types.webinar'), workshop: t('events.types.workshop'), social: t('events.types.social') };

  const handleRSVP = async (status: 'confirmed' | 'cancelled') => {
    const { error } = await rsvpEvent(event.id, status);
    if (error) toast.error(t('errors.generic'));
    else { toast.success(status === 'confirmed' ? t('events.rsvp') : t('events.cancelRsvp')); await fetchEvents(event.community_id); }
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2">{eventTypeLabels[event.event_type]}</Badge>
            <h3 className="font-semibold text-lg">{event.title}</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{format(new Date(event.start_date), 'd')}</div>
            <div className="text-sm text-muted-foreground uppercase">{format(new Date(event.start_date), 'MMM', { locale })}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{format(new Date(event.start_date), 'PPP p', { locale })}</span></div>
          {event.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{event.location}</span></div>}
          <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>{event.attendees_count} {t('events.attendees')}</span>{event.max_attendees && <span>/ {event.max_attendees} max</span>}</div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 gap-2" onClick={() => handleRSVP('confirmed')}><Check className="w-4 h-4" />{t('events.rsvp')}</Button>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => handleRSVP('cancelled')}><X className="w-4 h-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
