import { Link } from 'react-router-dom';
import { Users, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Community, Membership } from '@/types';
import { useTranslation } from '@/i18n';

interface CommunityCardProps { community: Community; membership?: Membership; showManageButton?: boolean; }

export function CommunityCard({ community, membership, showManageButton }: CommunityCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="hover:shadow-lg transition-shadow border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 rounded-xl">
            <AvatarImage src={community.logo_url} className="object-cover" />
            <AvatarFallback className="rounded-xl text-lg bg-primary/10 text-primary">{community.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg truncate">{community.name}</h3>
                <p className="text-sm text-muted-foreground">@{community.slug}</p>
              </div>
              {membership && <Badge variant={membership.role === 'admin' ? 'default' : 'secondary'} className="text-xs">{t(`roles.${membership.role}`)}</Badge>}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{community.description || 'Sin descripción'}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="w-4 h-4" /><span>{t('community.memberCount', { count: community.member_count || 0 })}</span></div>
          <div className="flex gap-2">
            {showManageButton && membership?.role === 'admin' && (
              <Link to={`/c/${community.slug}/manage`}>
                <Button variant="outline" size="sm" className="gap-1"><Settings className="w-3.5 h-3.5" />{t('common.manage')}</Button>
              </Link>
            )}
            <Link to={`/c/${community.slug}`}>
              <Button size="sm">{membership ? t('common.open') : t('community.join')}</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
