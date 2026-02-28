import { useState } from 'react';
import { X, Globe, Palette, Lock, User, Check, Lock as LockIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useTranslation, type Language } from '@/i18n';
import { useThemeStore, themes, applyTheme } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface SettingsMenuProps { open: boolean; onClose: () => void; }

export function SettingsMenu({ open, onClose }: SettingsMenuProps) {
  const { t, lang, changeLanguage } = useTranslation();
  const { currentTheme, unlockedThemes, setTheme, unlockPremiumThemes } = useThemeStore();
  const { user, updatePreferences } = useAuthStore();
  const [premiumCode, setPremiumCode] = useState('');

  const handleLanguageChange = async (value: Language) => {
    changeLanguage(value);
    await updatePreferences({ lang: value });
  };

  const handleThemeChange = async (themeId: string) => {
    if (unlockedThemes.includes(themeId)) {
      setTheme(themeId);
      const theme = themes.find(t => t.id === themeId);
      if (theme) applyTheme(theme);
      await updatePreferences({ theme: themeId });
    }
  };

  const handleUnlockPremium = () => {
    if (unlockPremiumThemes(premiumCode)) { toast.success(t('settings.premiumUnlocked')); setPremiumCode(''); }
    else toast.error('Código inválido');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">{t('settings.title')}<Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button></DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="language" className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="language" className="gap-2"><Globe className="w-4 h-4" /><span className="hidden sm:inline">{t('settings.language')}</span></TabsTrigger>
            <TabsTrigger value="theme" className="gap-2"><Palette className="w-4 h-4" /><span className="hidden sm:inline">{t('settings.theme')}</span></TabsTrigger>
            <TabsTrigger value="account" className="gap-2"><User className="w-4 h-4" /><span className="hidden sm:inline">{t('settings.account')}</span></TabsTrigger>
            <TabsTrigger value="security" className="gap-2"><Lock className="w-4 h-4" /><span className="hidden sm:inline">{t('settings.security')}</span></TabsTrigger>
          </TabsList>

          <TabsContent value="language" className="space-y-4">
            <h3 className="font-medium">{t('settings.language')}</h3>
            <RadioGroup value={lang} onValueChange={(v) => handleLanguageChange(v as Language)}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted cursor-pointer">
                <RadioGroupItem value="es" id="es" /><Label htmlFor="es" className="flex-1 cursor-pointer">Español</Label>{lang === 'es' && <Check className="w-4 h-4 text-primary" />}
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted cursor-pointer">
                <RadioGroupItem value="fr" id="fr" /><Label htmlFor="fr" className="flex-1 cursor-pointer">Français</Label>{lang === 'fr' && <Check className="w-4 h-4 text-primary" />}
              </div>
            </RadioGroup>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4">
            <h3 className="font-medium">{t('settings.theme')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((theme) => {
                const isUnlocked = unlockedThemes.includes(theme.id);
                const isSelected = currentTheme === theme.id;
                const themeName = lang === 'fr' ? theme.nameFr : theme.nameEs;
                return (
                  <button key={theme.id} onClick={() => handleThemeChange(theme.id)} disabled={!isUnlocked}
                    className={`relative p-4 rounded-lg border text-left transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'} ${!isUnlocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border" style={{ background: theme.colors.background, borderColor: theme.colors.border }}>
                        <div className="w-full h-3 rounded-t-lg" style={{ background: theme.colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{themeName}</p>
                        {theme.isPremium && !isUnlocked && <p className="text-xs text-muted-foreground flex items-center gap-1"><LockIcon className="w-3 h-3" />Premium</p>}
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {!unlockedThemes.includes('ocean') && (
              <div className="mt-6 p-4 rounded-lg bg-muted space-y-3">
                <h4 className="font-medium">{t('settings.unlockPremium')}</h4>
                <div className="flex gap-2">
                  <Input type="password" placeholder={t('settings.enterCode')} value={premiumCode} onChange={(e) => setPremiumCode(e.target.value)} />
                  <Button onClick={handleUnlockPremium}>{t('settings.unlock')}</Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <h3 className="font-medium">{t('settings.account')}</h3>
            <div className="p-4 rounded-lg bg-muted space-y-2">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>{t('auth.fullName')}:</strong> {user?.full_name}</p>
              <p><strong>{t('profile.joined')}:</strong> {new Date(user?.created_at || '').toLocaleDateString()}</p>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <h3 className="font-medium">{t('settings.security')}</h3>
            <Button variant="outline" className="w-full">{t('auth.forgotPassword')}</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
