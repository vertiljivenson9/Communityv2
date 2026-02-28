import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, MessageCircle, Calendar, BarChart3, Sparkles, 
  Plus, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { useCommunityStore } from '@/store/communityStore';
import { useTranslation } from '@/i18n';
import { CommunityCard } from '@/components/community/CommunityCard';
import { PostCard } from '@/components/feed/PostCard';
import { EventCard } from '@/components/events/EventCard';
import { PollCard } from '@/components/polls/PollCard';
import { CreateCommunityModal } from '@/components/community/CreateCommunityModal';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { Loader } from '@/components/Loader';

export function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { communities, posts, events, polls, fetchCommunities, fetchFeed, isLoading } = useCommunityStore();
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    fetchCommunities();
    fetchFeed();
  }, [fetchCommunities, fetchFeed]);

  if (isLoading) {
    return <Loader />;
  }

  const myCommunities = communities.slice(0, 6);
  const recentPosts = posts.slice(0, 5);
  const upcomingEvents = events.slice(0, 3);
  const activePolls = polls.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                ¡Bienvenido, {user?.full_name?.split(' ')[0] || 'Usuario'}!
              </h1>
              <p className="opacity-90">
                Aquí está lo que está pasando en tus comunidades hoy.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                className="gap-2"
                onClick={() => setIsCreatePostOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Nueva publicación
              </Button>
              <Button 
                className="gap-2 bg-white text-purple-600 hover:bg-white/90"
                onClick={() => setIsCreateCommunityOpen(true)}
              >
                <Sparkles className="w-4 h-4" />
                {t('community.create')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-6 px-4 -mt-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{communities.length}</p>
                  <p className="text-sm text-muted-foreground">Mis comunidades</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{posts.length}</p>
                  <p className="text-sm text-muted-foreground">Publicaciones</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{events.length}</p>
                  <p className="text-sm text-muted-foreground">Eventos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{polls.length}</p>
                  <p className="text-sm text-muted-foreground">Encuestas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="feed" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">{t('feed.title')}</span>
              </TabsTrigger>
              <TabsTrigger value="communities" className="gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">{t('navigation.communities')}</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">{t('events.title')}</span>
              </TabsTrigger>
              <TabsTrigger value="polls" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('polls.title')}</span>
              </TabsTrigger>
            </TabsList>

            {/* Feed Tab */}
            <TabsContent value="feed" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('feed.title')}</h2>
                <Button variant="outline" size="sm" onClick={() => setIsCreatePostOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('feed.newPost')}
                </Button>
              </div>
              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">{t('feed.noPosts')}</p>
                    <Button onClick={() => setIsCreatePostOpen(true)}>
                      {t('feed.createPost')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Communities Tab */}
            <TabsContent value="communities" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('navigation.myCommunities')}</h2>
                <Link to="/communities">
                  <Button variant="ghost" size="sm" className="gap-2">
                    Ver todas
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              {myCommunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myCommunities.map((community) => (
                    <CommunityCard key={community.id} community={community} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">No tienes comunidades aún</p>
                    <Button onClick={() => setIsCreateCommunityOpen(true)}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t('community.create')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('events.title')}</h2>
                <Link to="/events">
                  <Button variant="ghost" size="sm" className="gap-2">
                    Ver todos
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">{t('events.noEvents')}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Polls Tab */}
            <TabsContent value="polls" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('polls.title')}</h2>
                <Link to="/polls">
                  <Button variant="ghost" size="sm" className="gap-2">
                    Ver todas
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              {activePolls.length > 0 ? (
                <div className="space-y-4">
                  {activePolls.map((poll) => (
                    <PollCard key={poll.id} poll={poll} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">{t('polls.noPolls')}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Modals */}
      <CreateCommunityModal 
        open={isCreateCommunityOpen} 
        onClose={() => setIsCreateCommunityOpen(false)} 
      />
      <CreatePostModal 
        open={isCreatePostOpen} 
        onClose={() => setIsCreatePostOpen(false)} 
      />
    </div>
  );
}
