import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/i18n';
import { useCommunityStore } from '@/store/communityStore';
import { toast } from 'sonner';

interface CreatePollModalProps { open: boolean; onClose: () => void; communityId: string; }

export function CreatePollModal({ open, onClose, communityId }: CreatePollModalProps) {
  const { t } = useTranslation();
  const { createPoll, fetchPolls } = useCommunityStore();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [pollType, setPollType] = useState<'single' | 'multiple'>('single');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addOption = () => setOptions(prev => [...prev, '']);
  const removeOption = (index: number) => setOptions(prev => prev.filter((_, i) => i !== index));
  const updateOption = (index: number, value: string) => setOptions(prev => prev.map((opt, i) => i === index ? value : opt));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) { toast.error('Se necesitan al menos 2 opciones'); return; }
    setIsLoading(true);
    const { error } = await createPoll({ community_id: communityId, question, poll_type: pollType, is_anonymous: isAnonymous }, validOptions);
    if (error) toast.error(t('errors.generic'));
    else { toast.success(t('common.success')); await fetchPolls(communityId); onClose(); setQuestion(''); setOptions(['', '']); setPollType('single'); setIsAnonymous(false); }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">{t('polls.createPoll')}<Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('polls.question')} *</Label>
            <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Escribe tu pregunta..." required />
          </div>
          <div className="space-y-2">
            <Label>{t('polls.type')}</Label>
            <RadioGroup value={pollType} onValueChange={(v: 'single' | 'multiple') => setPollType(v)} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="single" id="single" /><Label htmlFor="single">{t('polls.singleChoice')}</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="multiple" id="multiple" /><Label htmlFor="multiple">{t('polls.multipleChoice')}</Label></div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>{t('polls.options')} *</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input value={option} onChange={(e) => updateOption(index, e.target.value)} placeholder={`Opción ${index + 1}`} required />
                  {options.length > 2 && <Button type="button" variant="outline" size="icon" onClick={() => removeOption(index)}><Trash2 className="w-4 h-4" /></Button>}
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-2"><Plus className="w-4 h-4" />{t('polls.addOption')}</Button>
          </div>
          <div className="flex items-center justify-between">
            <div><Label htmlFor="anonymous" className="cursor-pointer">{t('polls.anonymous')}</Label><p className="text-sm text-muted-foreground">Los votos no mostrarán quién votó</p></div>
            <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>{isLoading ? t('common.loading') : t('polls.createPoll')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
