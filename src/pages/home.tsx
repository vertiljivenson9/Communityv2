import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, MessageCircle, Calendar, BarChart3, Shield, Globe, 
  Heart, ArrowRight, Sparkles, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useCommunityStore } from '@/store/communityStore';
import { useTranslation } from '@/i18n';
import { PostCard } from '@/components/feed/PostCard';
import { EventCard } from '@/components/events/EventCard';
import { PollCard } from '@/components/polls/PollCard';
import { Loader } from '@/components/Loader';

export function Home() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { communities, posts, events, polls, fetchCommunities, fetchFeed, isLoading } = useCommunityStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCommunities();
      fetchFeed();
    }
  }, [isAuthenticated, fetchCommunities, fetchFeed]);

  if (authLoading || isLoading) {
    return <Loader />;
  }

  // Authenticated Dashboard View
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Welcome Section */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{t('app.name')}</h1>
                <p className="text-muted-foreground">{t('app.tagline')}</p>
              </div>
              <div className="flex gap-2">
                <Link to="/communities">
                  <Button variant="outline" className="gap-2">
                    <Users className="w-4 h-4" />
                    {t('navigation.communities')}
                  </Button>
                </Link>
                <Link to="/communities/create">
                  <Button className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    {t('community.create')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section className="py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      {t('feed.title')}
                    </h2>
                    {posts.length > 0 ? (
                      <div className="space-y-4">
                        {posts.slice(0, 5).map((post) => (
                          <PostCard key={post.id} post={post} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>{t('feed.noPosts')}</p>
                        <Link to="/communities">
                          <Button variant="outline" className="mt-4">
                            {t('navigation.communities')}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Events */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      {t('events.title')}
                    </h2>
                    {events.length > 0 ? (
                      <div className="space-y-4">
                        {events.slice(0, 3).map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>{t('events.noEvents')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* My Communities */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      {t('navigation.myCommunities')}
                    </h2>
                    {communities.length > 0 ? (
                      <div className="space-y-3">
                        {communities.slice(0, 5).map((community) => (
                          <Link 
                            key={community.id} 
                            to={`/communities/${community.slug}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {community.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{community.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {t('community.memberCount', { count: community.member_count || 0 })}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">{t('common.noResults')}</p>
                        <Link to="/communities">
                          <Button variant="outline" size="sm" className="mt-2">
                            {t('navigation.explore')}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Polls */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      {t('polls.title')}
                    </h2>
                    {polls.length > 0 ? (
                      <div className="space-y-4">
                        {polls.slice(0, 2).map((poll) => (
                          <PollCard key={poll.id} poll={poll} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">{t('polls.noPolls')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
                    <div className="space-y-2">
                      <Link to="/communities/create">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Sparkles className="w-4 h-4" />
                          {t('community.create')}
                        </Button>
                      </Link>
                      <Link to="/profile">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Users className="w-4 h-4" />
                          {t('navigation.profile')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Unauthenticated Landing Page
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center space-y-6">
            {/* Animated Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl animate-pulse">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl opacity-30 blur-xl animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('app.name')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              {t('app.tagline')}. Conecta, colabora y crece con tu comunidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/register">
                <Button size="lg" className="gap-2 text-lg px-8">
                  <Sparkles className="w-5 h-5" />
                  {t('auth.createAccount')}
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                  {t('auth.login')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Características principales</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Todo lo que necesitas para gestionar y hacer crecer tu comunidad en un solo lugar.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Lock className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Comunidades Privadas</h3>
                <p className="text-muted-foreground text-sm">
                  Crea espacios seguros con control de acceso, aprobación de miembros y configuraciones personalizables.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Feed Inteligente</h3>
                <p className="text-muted-foreground text-sm">
                  Publicaciones, comentarios y reacciones. Mantén a tu comunidad engaged con contenido relevante.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Calendar className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Eventos y Calendario</h3>
                <p className="text-muted-foreground text-sm">
                  Organiza encuentros, webinars y talleres. Gestiona asistentes y envía recordatorios.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <BarChart3 className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Encuestas y Votaciones</h3>
                <p className="text-muted-foreground text-sm">
                  Toma decisiones democráticas con encuestas anónimas o públicas, de opción única o múltiple.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                  <Shield className="w-6 h-6 text-pink-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Roles y Permisos</h3>
                <p className="text-muted-foreground text-sm">
                  Admin, moderadores, miembros e invitados. Control granular sobre quién puede hacer qué.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                  <Globe className="w-6 h-6 text-cyan-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multi-idioma</h3>
                <p className="text-muted-foreground text-sm">
                  Soporte completo en español y francés. Perfecto para comunidades internacionales.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                1
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">Crea tu cuenta</h3>
                <p className="text-muted-foreground">
                  Regístrate en segundos con tu email o cuenta de Google. Solo necesitas tener 16 años o más.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                2
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">Únete o crea una comunidad</h3>
                <p className="text-muted-foreground">
                  Explora comunidades existentes o crea la tuya propia con configuraciones personalizadas.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                3
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">Conecta y colabora</h3>
                <p className="text-muted-foreground">
                  Publica, comenta, participa en eventos y vota en encuestas. ¡Haz crecer tu comunidad!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para conectar tu comunidad?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Únete a miles de comunidades que ya están creciendo con Community Hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8">
                <Sparkles className="w-5 h-5" />
                {t('auth.createAccount')}
              </Button>
            </Link>
            <Link to="/communities">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 border-white text-white hover:bg-white/10">
                <Globe className="w-5 h-5" />
                Explorar comunidades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">{t('app.name')}</span>
              </div>
              <p className="text-muted-foreground mb-4">
                {t('about.description')}
              </p>
              <div className="flex gap-2">
                <Link to="/about">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Heart className="w-4 h-4" />
                    {t('about.donate')}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">{t('navigation.home')}</Link></li>
                <li><Link to="/communities" className="text-muted-foreground hover:text-foreground transition-colors">{t('navigation.communities')}</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">{t('navigation.about')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacidad</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Términos</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>{t('about.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
