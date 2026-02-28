import { useState, useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/i18n';
import { useCommunityStore } from '@/store/communityStore';
import { uploadToCloudinary } from '@/lib/supabase';
import { toast } from 'sonner';

interface CreateCommunityModalProps { open: boolean; onClose: () => void; onSuccess?: () => void; }

export function CreateCommunityModal({ open, onClose, onSuccess }: CreateCommunityModalProps) {
  const { t } = useTranslation();
  const { createCommunity } = useCommunityStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ name: '', description: '', maxMembers: '', requireApproval: false, requireOnboarding: false, allowGuests: false });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setLogo(file); setLogoPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let logoUrl = '';
      if (logo) { const result = await uploadToCloudinary(logo, 'community-hub/communities'); logoUrl = result.url; }
      const maxMembersValue = formData.maxMembers ? parseInt(formData.maxMembers) : undefined;
      const { data, error } = await createCommunity({
        name: formData.name, description: formData.description,
        logo_url: logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${formData.name}`,
        max_members: maxMembersValue,
        settings: { requireApproval: formData.requireApproval, requireOnboarding: formData.requireOnboarding, allowGuests: formData.allowGuests, postsNeedApproval: false }
      });
      if (error) toast.error(t('errors.generic'));
      else if (data) { toast.success(t('common.success')); onSuccess?.(); onClose(); setFormData({ name: '', description: '', maxMembers: '', requireApproval: false, requireOnboarding: false, allowGuests: false }); setLogo(null); setLogoPreview(null); }
    } catch (error) { toast.error(t('errors.generic')); }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">{t('community.createTitle')}<Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>{t('community.logo')}</Label>
            <div onClick={() => fileInputRef.current?.click()} className="relative w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary cursor-pointer flex items-center justify-center overflow-hidden bg-muted/50">
              {logoPreview ? <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center text-muted-foreground"><ImageIcon className="w-8 h-8 mb-1" /><span className="text-xs">{t('community.upload')}</span></div>}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">{t('community.name')} *</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Mi Comunidad" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('community.description')}</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe tu comunidad..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxMembers">{t('community.maxMembers')}</Label>
            <Input id="maxMembers" type="number" value={formData.maxMembers} onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: e.target.value }))} placeholder="Sin límite" min="1" />
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">{t('community.settings')}</h4>
            <div className="flex items-center justify-between">
              <div><Label htmlFor="requireApproval" className="cursor-pointer">{t('community.requireApproval')}</Label><p className="text-sm text-muted-foreground">Los nuevos miembros necesitan aprobación</p></div>
              <Switch id="requireApproval" checked={formData.requireApproval} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requireApproval: checked }))} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label htmlFor="requireOnboarding" className="cursor-pointer">{t('community.requireOnboarding')}</Label><p className="text-sm text-muted-foreground">Los miembros deben completar el onboarding</p></div>
              <Switch id="requireOnboarding" checked={formData.requireOnboarding} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requireOnboarding: checked }))} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label htmlFor="allowGuests" className="cursor-pointer">{t('community.allowGuests')}</Label><p className="text-sm text-muted-foreground">Permitir visitantes no registrados</p></div>
              <Switch id="allowGuests" checked={formData.allowGuests} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowGuests: checked }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>{isLoading ? t('common.loading') : t('community.create')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
