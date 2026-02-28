import { useState } from 'react';
import { Camera, Mail, Calendar, Users, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { useCommunityStore } from '@/store/communityStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Profile() {
  const { user, updateProfile } = useAuthStore();
  const { memberships, communities } = useCommunityStore();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);

  const myCommunities = memberships
    .map(m => ({ ...m, community: communities.find(c => c.id === m.community_id) }))
    .filter(m => m.community);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await updateProfile({ full_name: fullName });
    if (error) {
      toast.error('Error al guardar los cambios');
    } else {
      toast.success('Perfil actualizado');
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="text-4xl">{user.full_name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
                <Camera className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            {/* Info */}
            <div className="flex-1 pb-2">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="text-2xl font-bold bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    placeholder="Nombre completo"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setFullName(user.full_name || '');
                        setIsEditing(false);
                      }}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{user.full_name}</h1>
                  <div className="flex items-center gap-4 mt-2 opacity-90">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </span>
                  </div>
                </>
              )}
            </div>
            
            {!isEditing && (
              <Button 
                variant="secondary" 
                className="gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4" />
                Editar perfil
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
              <TabsTrigger value="info" className="gap-2">
                <Users className="w-4 h-4" />
                Información
              </TabsTrigger>
              <TabsTrigger value="communities" className="gap-2">
                <Users className="w-4 h-4" />
                Mis comunidades
              </TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Nombre completo</Label>
                      <p className="font-medium">{user.full_name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Correo electrónico</Label>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    {user.birth_date && (
                      <div>
                        <Label className="text-muted-foreground">Fecha de nacimiento</Label>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(user.birth_date), 'dd MMMM yyyy', { locale: es })}
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-muted-foreground">Miembro desde</Label>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(user.created_at), 'dd MMMM yyyy', { locale: es })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferencias</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Idioma</Label>
                      <p className="font-medium capitalize">
                        {user.preferences?.lang === 'es' ? 'Español' : 'Français'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Tema</Label>
                      <p className="font-medium capitalize">{user.preferences?.theme || 'light'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Communities Tab */}
            <TabsContent value="communities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mis comunidades</CardTitle>
                </CardHeader>
                <CardContent>
                  {myCommunities.length > 0 ? (
                    <div className="space-y-4">
                      {myCommunities.map((membership) => (
                        <div 
                          key={membership.id}
                          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {membership.community?.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{membership.community?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Rol: <span className="capitalize">{membership.role}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(membership.joined_at), 'dd/MM/yyyy')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No perteneces a ninguna comunidad aún</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
