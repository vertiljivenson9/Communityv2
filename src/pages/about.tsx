import { Link } from 'react-router-dom';
import { 
  Heart, Users, Globe, Code, Coffee, 
  ExternalLink, Mail, Github, Twitter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/i18n';

export function About() {
  const { t } = useTranslation();

  const handleDonate = () => {
    window.open('https://www.paypal.com/donate/?hosted_button_id=2Z2SN9C5C6J8W', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Heart className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {t('about.description')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestra misión</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('about.mission')} Creemos en el poder de las comunidades para generar 
              cambios positivos y construir un mundo más conectado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Conectar personas</h3>
                <p className="text-muted-foreground text-sm">
                  Facilitamos la conexión entre personas con intereses comunes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Comunidades globales</h3>
                <p className="text-muted-foreground text-sm">
                  Soporte multi-idioma para comunidades internacionales.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Code className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Código abierto</h3>
                <p className="text-muted-foreground text-sm">
                  Transparencia y colaboración en el desarrollo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Developer */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
              VJ
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">{t('settings.developer')}</h2>
              <p className="text-xl font-semibold text-primary mb-4">{t('settings.author')}</p>
              <p className="text-muted-foreground mb-4">
                Desarrollador apasionado por crear herramientas que conectan personas 
                y facilitan la colaboración comunitaria. Con años de experiencia en 
                desarrollo web y comunidades digitales.
              </p>
              <div className="flex gap-3 justify-center md:justify-start">
                <a href="mailto:vertil@example.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <Mail className="w-4 h-4" />
                  </Button>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <Github className="w-4 h-4" />
                  </Button>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Apoya el proyecto</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Community Hub es un proyecto gratuito y de código abierto. Tu apoyo 
            nos ayuda a mantener los servidores, desarrollar nuevas funcionalidades 
            y mejorar la plataforma para todos.
          </p>
          <Button size="lg" className="gap-2" onClick={handleDonate}>
            <Heart className="w-5 h-5" />
            {t('about.donate')}
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Tecnologías utilizadas</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Supabase', 'PostgreSQL', 'Cloudinary'].map((tech) => (
              <span 
                key={tech}
                className="px-4 py-2 bg-background rounded-full text-sm font-medium border shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">{t('app.name')}</span>
          </div>
          <p className="text-muted-foreground mb-4">{t('app.tagline')}</p>
          <div className="flex justify-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">{t('navigation.home')}</Button>
            </Link>
            <Link to="/communities">
              <Button variant="ghost" size="sm">{t('navigation.communities')}</Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="sm">{t('navigation.profile')}</Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">{t('about.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
