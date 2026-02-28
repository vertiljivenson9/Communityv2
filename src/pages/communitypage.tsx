import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Users, Settings, MessageCircle, Calendar, 
  BarChart3, Plus, UserPlus, Lock, Globe, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCommunityStore } from '@/store/communityStore';
import { PostCard } from '@/components/feed/PostCard';
import { EventCard } from '@/components/events/EventCard';
import { PollCard } from '@/components/polls/PollCard';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { CreatePollModal } from '@/components/polls/CreatePollModal';
import { Loader } from '@/components/Loader';
import { toast } from 'sonner';

export function CommunityPage() {
  const { slug } = useParams<{ slug: string }>();
  const { 
    currentCommunity, 
    posts, 
    events, 
    polls, 
    memberships,
    fetchCommunityBySlug, 
    fetchCommunityPosts,
    fetchCommunityEvents,
    fetchCommunityPolls,
    joinCommunity,
    isLoading 
  } = useCommunityStore();

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCommunityBySlug(slug);
      fetchCommunityPosts(slug);
      fetchCommunityEvents(slug);
      fetchCommunityPolls(slug);
    }
  }, [slug, fetchCommunityBySlug, fetchCommunityPosts, fetchCommunityEvents, fetchCommunityPolls]);

  const communityPosts = posts.filter(p => p.community_id === currentCommunity?.id);
  const communityEvents = events.filter(e => e.community_id === currentCommunity?.id);
  const communityPolls = polls.filter(p => p.community_id === currentCommunity?.id);
  
  const userMembership = memberships.find(m => m.community_id === currentCommunity?.id);
  const isMember = !!userMembership;
  const isAdmin = userMembership?.role === 'admin';
  const isModerator = userMembership?.role === 'moderator';
  const canManage = isAdmin || isModerator;

  const handleJoin = async () => {
    if (!currentCommunity) return;
    setIsJoining(true);
    const { error } = await joinCommunity(currentCommunity.id);
    if (error) {
      toast.error('Error al unirse a la comunidad');
    } else {
      toast.success('¡Te has unido a la comunidad!');
    }
    setIsJoining(false);
  };

  if (isLoading || !currentCommunity) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/communities">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a comunidades
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold">
              {currentCommunity.logo_url ? (
                <img 
                  src={currentCommunity.logo_url} 
                  alt={currentCommunity.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                currentCommunity.name.charAt(0)
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{currentCommunity.name}</h1>
                {currentCommunity.settings?.requireApproval ? (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Lock className="w-3 h-3 mr-1" />
                    Privada
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Globe className="w-3 h-3 mr-1" />
                    Pública
                  </Badge>
                )}
              </div>
              <p className="opacity-90 mb-4 max-w-2xl">{currentCommunity.description}</p>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{currentCommunity.member_count || 0} miembros</span>
                </div>
                
                {!isMember ? (
                  <Button 
                    className="bg-white text-purple-600 hover:bg-white/90"
                    onClick={handleJoin}
                    disabled={isJoining}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isJoining ? 'Uniendo...' : 'Unirse'}
                  </Button>
                ) : (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Miembro
                  </Badge>
                )}
                
                {canManage && (
                  <Link to={`/communities/${slug}/settings`}>
                    <Button variant="outline" className="border-white text-white hover:bg-white/20">
                      <Settings className="w-4 h-4 mr-2" />
                      Gestionar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="posts" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Publicaciones
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <Calendar className="w-4 h-4" />
                Eventos
              </TabsTrigger>
              <TabsTrigger value="polls" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Encuestas
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-4">
              {isMember && (
                <div className="flex justify-end">
                  <Button onClick={() => setIsCreatePostOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva publicación
                  </Button>
                </div>
              )}
              
              {communityPosts.length > 0 ? (
                <div className="space-y-4">
                  {communityPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={<MessageCircle className="w-12 h-12" />}
                  title="Sin publicaciones"
                  description="Sé el primero en publicar algo en esta comunidad."
                  action={isMember ? (
                    <Button onClick={() => setIsCreatePostOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear publicación
                    </Button>
                  ) : undefined}
                />
              )}
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4">
              {isMember && (
                <div className="flex justify-end">
                  <Button onClick={() => setIsCreateEventOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo evento
                  </Button>
                </div>
              )}
              
              {communityEvents.length > 0 ? (
                <div className="space-y-4">
                  {communityEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={<Calendar className="w-12 h-12" />}
                  title="Sin eventos"
                  description="No hay eventos programados en esta comunidad."
                  action={isMember ? (
                    <Button onClick={() => setIsCreateEventOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear evento
                    </Button>
                  ) : undefined}
                />
              )}
            </TabsContent>

            {/* Polls Tab */}
            <TabsContent value="polls" className="space-y-4">
              {isMember && (
                <div className="flex justify-end">
                  <Button onClick={() => setIsCreatePollOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva encuesta
                  </Button>
                </div>
              )}
              
              {communityPolls.length > 0 ? (
                <div className="space-y-4">
                  {communityPolls.map((poll) => (
                    <PollCard key={poll.id} poll={poll} />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={<BarChart3 className="w-12 h-12" />}
                  title="Sin encuestas"
                  description="No hay encuestas activas en esta comunidad."
                  action={isMember ? (
                    <Button onClick={() => setIsCreatePollOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear encuesta
                    </Button>
                  ) : undefined}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Modals */}
      {currentCommunity && (
        <>
          <CreatePostModal 
            open={isCreatePostOpen} 
            onClose={() => setIsCreatePostOpen(false)} 
            communityId={currentCommunity.id}
          />
          <CreateEventModal 
            open={isCreateEventOpen} 
            onClose={() => setIsCreateEventOpen(false)} 
            communityId={currentCommunity.id}
          />
          <CreatePollModal 
            open={isCreatePollOpen} 
            onClose={() => setIsCreatePollOpen(false)} 
            communityId={currentCommunity.id}
          />
        </>
      )}
    </div>
  );
}

function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="text-muted-foreground opacity-50 mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
