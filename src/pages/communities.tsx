import { useEffect, useState } from 'react';
import { Plus, Search, Users, Sparkles, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCommunityStore } from '@/store/communityStore';
import { useTranslation } from '@/i18n';
import { CommunityCard } from '@/components/community/CommunityCard';
import { CreateCommunityModal } from '@/components/community/CreateCommunityModal';
import { Loader } from '@/components/Loader';

export function Communities() {
  const { t } = useTranslation();
  const { communities, fetchCommunities, isLoading } = useCommunityStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publicCommunities = filteredCommunities.filter(c => !c.settings?.requireApproval);
  const privateCommunities = filteredCommunities.filter(c => c.settings?.requireApproval);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{t('navigation.communities')}</h1>
              <p className="opacity-90">Descubre y únete a comunidades increíbles</p>
            </div>
            <Button 
              className="gap-2 bg-white text-purple-600 hover:bg-white/90"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="w-4 h-4" />
              {t('community.create')}
            </Button>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar comunidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="all" className="gap-2">
                <Globe className="w-4 h-4" />
                Todas
              </TabsTrigger>
              <TabsTrigger value="public" className="gap-2">
                <Users className="w-4 h-4" />
                Públicas
              </TabsTrigger>
              <TabsTrigger value="private" className="gap-2">
                <Lock className="w-4 h-4" />
                Privadas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredCommunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCommunities.map((community) => (
                    <CommunityCard key={community.id} community={community} />
                  ))}
                </div>
              ) : (
                <EmptyState onCreate={() => setIsCreateOpen(true)} />
              )}
            </TabsContent>

            <TabsContent value="public" className="space-y-4">
              {publicCommunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {publicCommunities.map((community) => (
                    <CommunityCard key={community.id} community={community} />
                  ))}
                </div>
              ) : (
                <EmptyState onCreate={() => setIsCreateOpen(true)} />
              )}
            </TabsContent>

            <TabsContent value="private" className="space-y-4">
              {privateCommunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {privateCommunities.map((community) => (
                    <CommunityCard key={community.id} community={community} />
                  ))}
                </div>
              ) : (
                <EmptyState onCreate={() => setIsCreateOpen(true)} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Create Modal */}
      <CreateCommunityModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Users className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No se encontraron comunidades</h3>
        <p className="text-muted-foreground mb-4">
          Sé el primero en crear una comunidad y comenzar algo increíble.
        </p>
        <Button onClick={onCreate} className="gap-2">
          <Sparkles className="w-4 h-4" />
          {t('community.create')}
        </Button>
      </CardContent>
    </Card>
  );
}
