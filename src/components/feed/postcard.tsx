import { useState } from 'react';
import { MessageCircle, Share, ThumbsUp, Pin, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/types';
import { useTranslation } from '@/i18n';
import { formatDistanceToNow } from 'date-fns';
import { es, fr } from 'date-fns/locale';

interface PostCardProps { post: Post; }

export function PostCard({ post }: PostCardProps) {
  const { t, lang } = useTranslation();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const locale = lang === 'fr' ? fr : es;

  const handleLike = () => { setLiked(!liked); setLikesCount(prev => liked ? prev - 1 : prev + 1); };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.author?.avatar_url} />
              <AvatarFallback>{post.author?.full_name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author?.full_name}</p>
              <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale })}{post.category && ` · ${post.category.name}`}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {post.is_pinned && <Badge variant="secondary" className="gap-1"><Pin className="w-3 h-3" />{t('feed.pinned')}</Badge>}
            {post.is_locked && <Badge variant="secondary" className="gap-1"><Lock className="w-3 h-3" />{t('feed.locked')}</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <Button variant="ghost" size="sm" className={`gap-2 ${liked ? 'text-primary' : ''}`} onClick={handleLike}>
            <ThumbsUp className="w-4 h-4" />{likesCount > 0 ? likesCount : t('feed.likes')}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="w-4 h-4" />{post.replies_count > 0 ? `${post.replies_count} ${t('feed.comments')}` : t('feed.comments')}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2"><Share className="w-4 h-4" />{t('feed.share')}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
