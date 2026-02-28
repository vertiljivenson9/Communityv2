import { useState } from 'react';
import { BarChart3, Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { Poll } from '@/types';
import { useTranslation } from '@/i18n';
import { useCommunityStore } from '@/store/communityStore';
import { toast } from 'sonner';

interface PollCardProps { poll: Poll; }

export function PollCard({ poll }: PollCardProps) {
  const { t } = useTranslation();
  const { votePoll, fetchPolls } = useCommunityStore();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(poll.has_voted);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async () => {
    if (selectedOptions.length === 0) return;
    setIsSubmitting(true);
    const { error } = await votePoll(poll.id, selectedOptions);
    if (error) toast.error(t('errors.generic'));
    else { toast.success(t('polls.vote')); setHasVoted(true); await fetchPolls(poll.community_id); }
    setIsSubmitting(false);
  };

  const handleOptionChange = (value: string) => {
    if (poll.poll_type === 'single') setSelectedOptions([value]);
    else setSelectedOptions(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const totalVotes = poll.total_votes || 1;

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">{t('polls.title')}</span>
          {poll.is_anonymous && <span className="text-xs text-muted-foreground">· {t('polls.anonymous')}</span>}
        </div>
        <h3 className="font-semibold text-lg">{poll.question}</h3>
      </CardHeader>
      <CardContent className="pt-0">
        {hasVoted ? (
          <div className="space-y-3">
            {poll.options?.map((option) => {
              const percentage = Math.round((option.votes_count / totalVotes) * 100);
              return (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between text-sm"><span>{option.option_text}</span><span className="text-muted-foreground">{percentage}% ({option.votes_count})</span></div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
            <p className="text-sm text-muted-foreground text-center pt-2">{t('polls.totalVotes')}: {poll.total_votes}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <RadioGroup value={selectedOptions[0]} onValueChange={handleOptionChange}>
              {poll.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted cursor-pointer" onClick={() => handleOptionChange(option.id)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">{option.option_text}</Label>
                  {selectedOptions.includes(option.id) && <Check className="w-4 h-4 text-primary" />}
                </div>
              ))}
            </RadioGroup>
            <Button className="w-full" onClick={handleVote} disabled={selectedOptions.length === 0 || isSubmitting}>
              {isSubmitting ? t('common.loading') : t('polls.vote')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
