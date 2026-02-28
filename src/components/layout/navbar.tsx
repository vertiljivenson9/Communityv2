import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, User, Home, Users, Compass, LogOut, Settings, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/i18n';
import { SettingsMenu } from '@/components/settings/SettingsMenu';

export function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
            <span className="text-white font-bold text-sm">CH</span>
          </div>
          <span className="font-bold text-lg hidden sm:block">{t('app.name')}</span>
        </Link>

        {/* Navigation Links - Desktop */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button variant={isActive('/') ? 'secondary' : 'ghost'} size="sm" className="gap-2">
                <Home className="w-4 h-4" />{t('navigation.home')}
              </Button>
            </Link>
            <Link to="/communities">
              <Button variant={isActive('/communities') ? 'secondary' : 'ghost'} size="sm" className="gap-2">
                <Users className="w-4 h-4" />{t('navigation.communities')}
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant={isActive('/explore') ? 'secondary' : 'ghost'} size="sm" className="gap-2">
                <Compass className="w-4 h-4" />{t('navigation.explore')}
              </Button>
            </Link>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              </Button>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback>{user?.full_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </Link>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">CH</span>
                      </div>
                      {t('navigation.menu')}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col gap-1">
                    <Link to="/profile">
                      <Button variant="ghost" className="w-full justify-start gap-3"><User className="w-4 h-4" />{t('navigation.profile')}</Button>
                    </Link>
                    <Link to="/my-communities">
                      <Button variant="ghost" className="w-full justify-start gap-3"><Users className="w-4 h-4" />{t('navigation.myCommunities')}</Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => setIsSettingsOpen(true)}>
                      <Settings className="w-4 h-4" />{t('navigation.settings')}
                    </Button>
                    <Link to="/about">
                      <Button variant="ghost" className="w-full justify-start gap-3"><Heart className="w-4 h-4" />{t('navigation.about')}</Button>
                    </Link>
                    <hr className="my-2" />
                    <Button variant="ghost" className="w-full justify-start gap-3 text-destructive" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />{t('auth.logout')}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">{t('auth.login')}</Button></Link>
              <Link to="/register"><Button size="sm">{t('auth.register')}</Button></Link>
            </div>
          )}
        </div>
      </div>
      <SettingsMenu open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
}
