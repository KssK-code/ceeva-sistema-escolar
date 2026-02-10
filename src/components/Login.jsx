import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const Login = () => {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [schoolSettings, setSchoolSettings] = useState(null);

  useEffect(() => {
    const fetchSchoolSettings = async () => {
      const { data, error } = await supabase
        .from('school_settings')
        .select('school_name, logo_url')
        .single();
      console.log('School Settings Data:', data);
      console.log('School Settings Error:', error);
      if (data) setSchoolSettings(data);
    };
    fetchSchoolSettings();
  }, []);

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isSigningUp) {
      const { error } = await signUp(email, password, {
        data: { full_name: fullName }
      });
      if (!error) {
        toast({
          title: "¡Registro exitoso!",
          description: "Hemos enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada.",
        });
        setIsSigningUp(false);
        setFullName('');
      }
    } else {
      await signIn(email, password);
    }
    setLoading(false);
  };

  const toggleAuthMode = () => {
    setIsSigningUp(!isSigningUp);
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[380px] glass-effect border-white/20 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSigningUp ? 'signup' : 'login'}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleAuthAction}>
                <CardHeader className="text-center">
                  {!isSigningUp && schoolSettings?.logo_url && (
                    <div className="flex justify-center mb-4">
                      <img 
                        src={schoolSettings.logo_url} 
                        alt="Logo" 
                        className="h-20 w-20 object-contain"
                      />
                    </div>
                  )}
                  <CardTitle className="text-3xl font-bold gradient-text">
                    {isSigningUp ? 'Crear Cuenta' : (schoolSettings?.school_name || 'CEVM')}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {isSigningUp ? 'Ingresa tus datos para registrarte' : 'Sistema de Gestión Educativa'}
                  </CardDescription>
                  {!isSigningUp && (
                    <p className="text-white/50 text-sm mt-1">Zapopan, Jalisco</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {isSigningUp && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-white/80">Nombre Completo</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Tu nombre completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/80">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/80">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="input-field"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full btn-primary" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isSigningUp ? (
                      <UserPlus className="mr-2 h-4 w-4" />
                    ) : (
                      <LogIn className="mr-2 h-4 w-4" />
                    )}
                    {isSigningUp ? 'Registrarse' : 'Iniciar Sesión'}
                  </Button>
                  <Button variant="link" type="button" onClick={toggleAuthMode} className="text-white/70 hover:text-white">
                    {isSigningUp ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                  </Button>
                </CardFooter>
              </form>
            </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;