import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Calendar, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/i18n';
import { toast } from 'sonner';

export function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuthStore();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', birthDate: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const age = calculateAge(formData.birthDate);
    if (age < 16) { toast.error(t('auth.ageError')); setIsLoading(false); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Las contraseñas no coinciden'); setIsLoading(false); return; }
    const { error } = await register(formData.email, formData.password, formData.fullName, formData.birthDate);
    if (error) toast.error(t('errors.generic'));
    else { toast.success(t('common.success')); navigate('/dashboard'); }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await loginWithGoogle();
    if (error) toast.error(t('errors.generic'));
  };

  const updateField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{t('auth.createAccount')}</CardTitle>
        <CardDescription className="text-center">{t('auth.joinCommunity')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full gap-2" onClick={handleGoogleLogin}>
          <Chrome className="w-5 h-5" />{t('auth.loginWithGoogle')}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t('auth.or')}</span></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t('auth.fullName')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="pl-10" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">{t('auth.birthDate')}</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => updateField('birthDate', e.target.value)} className="pl-10" required />
            </div>
            <p className="text-xs text-muted-foreground">{t('auth.ageError')}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="pl-10" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={(e) => updateField('password', e.target.value)} className="pl-10 pr-10" required minLength={8} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} className="pl-10" required />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? t('common.loading') : t('auth.register')}</Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">{t('auth.hasAccount')} <Link to="/login" className="text-primary hover:underline font-medium">{t('auth.login')}</Link></p>
      </CardFooter>
    </Card>
  );
}
