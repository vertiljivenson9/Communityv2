import { useState } from 'react';
import { X, Image, Link, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/i18n';
import { useCommunityStore } from '@/store/communityStore';
import { toast } from 'sonner';

interface CreatePostModalProps { open: boolean; onClose: () => void; communityId?: string; }

export function CreatePostModal({ open, onClose, communityId }: CreatePostModalProps) {
  const { t } = useTranslation();
  const { categories, createPost, fetchPosts } = useCommunityStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !communityId) return;
    setIsLoading(true);
    const { error } = await createPost({ community_id: communityId, title, content, category_id: categoryId || undefined });
    if (error) toast.error(t('errors.generic'));
    else { toast.success(t('common.success')); await fetchPosts(communityId); onClose(); setTitle(''); setContent(''); setCategoryId(''); }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">{t('feed.createPost')}<Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('feed.titlePlaceholder')}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" required />
          </div>
          {categories.length > 0 && (
            <div className="space-y-2">
              <Label>{t('forum.categoryName')}</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="content">{t('feed.contentPlaceholder')}</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escribe tu publicación..." rows={5} required />
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="gap-2"><Image className="w-4 h-4" />Imagen</Button>
            <Button type="button" variant="outline" size="sm" className="gap-2"><Link className="w-4 h-4" />Enlace</Button>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="submit" className="flex-1 gap-2" disabled={isLoading}><Send className="w-4 h-4" />{isLoading ? t('common.loading') : t('feed.publish')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
