import {useState} from "react";
import {useNavigate} from "react-router-dom";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import {useAuth} from "@/hooks/useAuth";
import {useToast} from "@/hooks/use-toast";
import {Loader2, ArrowUpRight, Eye, EyeOff} from "lucide-react";
import {
  APP_ATMOSPHERE_CLASS,
  AUTH_HEADING_CLASS,
  AUTH_LEAD_CLASS,
  AUTH_SHELL_CLASS,
} from "@/lib/app-glass";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({email: "", password: ""});
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });

  const {signIn, signUp} = useAuth();
  const {toast} = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const {error} = await signIn(loginForm.email, loginForm.password);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description:
          error.message === "Invalid login credentials"
            ? "Email ou senha incorretos"
            : error.message
      });
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard..."
      });
      navigate("/");
    }

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem."
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres."
      });
      return;
    }

    setIsLoading(true);

    const {error} = await signUp(
      signupForm.email,
      signupForm.password,
      signupForm.fullName
    );

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description:
          error.message === "User already registered"
            ? "Este email já está cadastrado"
            : error.message
      });
    } else {
      toast({
        title: "Conta criada com sucesso!",
        description: "Acesse a aba de login para fazer login."
      });
      setSignupForm({email: "", password: "", confirmPassword: "", fullName: ""});
    }

    setIsLoading(false);
  };

  return (
    <div className={AUTH_SHELL_CLASS}>
      <div className={APP_ATMOSPHERE_CLASS} aria-hidden="true" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className={AUTH_HEADING_CLASS}>Shape stock</h1>
          <p className={AUTH_LEAD_CLASS}>Acesse sua conta para continuar</p>
        </div>

        <TabsPrimitive.Root defaultValue="login" className="w-full">
          <TabsPrimitive.List className="auth-tabs-list">
            <TabsPrimitive.Trigger value="login" className="auth-tab-trigger">
              Login
            </TabsPrimitive.Trigger>
            <TabsPrimitive.Trigger value="signup" className="auth-tab-trigger">
              Criar nova conta
            </TabsPrimitive.Trigger>
          </TabsPrimitive.List>

          <TabsPrimitive.Content value="login" className="mt-4">
            <div className="auth-card">
              <div className="auth-card-header">
                <h3 className="auth-card-title">Fazer Login</h3>
                <p className="auth-card-description">
                  Entre com sua conta existente
                </p>
              </div>
              <div className="auth-card-content">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label htmlFor="login-email" className="auth-label">
                      Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      className="auth-input"
                      placeholder="seu@email.com"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm((prev) => ({...prev, email: e.target.value}))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="auth-label">
                      Senha
                    </label>
                    <div className="auth-input-wrapper">
                      <input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        className="auth-input auth-input-password"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm((prev) => ({...prev, password: e.target.value}))
                        }
                        required
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowLoginPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label={showLoginPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="auth-btn"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Entrar
                    {!isLoading && (
                      <span className="auth-btn-arrow">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </TabsPrimitive.Content>

          <TabsPrimitive.Content value="signup" className="mt-4">
            <div className="auth-card">
              <div className="auth-card-header">
                <h3 className="auth-card-title">Criar Conta</h3>
                <p className="auth-card-description">
                  Cadastre-se para acessar o sistema
                </p>
              </div>
              <div className="auth-card-content">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div>
                    <label htmlFor="signup-name" className="auth-label">
                      Nome Completo
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      className="auth-input"
                      placeholder="Seu nome completo"
                      value={signupForm.fullName}
                      onChange={(e) =>
                        setSignupForm((prev) => ({...prev, fullName: e.target.value}))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-email" className="auth-label">
                      Email
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      className="auth-input"
                      placeholder="seu@email.com"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm((prev) => ({...prev, email: e.target.value}))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-password" className="auth-label">
                      Senha
                    </label>
                    <div className="auth-input-wrapper">
                      <input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        className="auth-input auth-input-password"
                        placeholder="••••••••"
                        value={signupForm.password}
                        onChange={(e) =>
                          setSignupForm((prev) => ({...prev, password: e.target.value}))
                        }
                        required
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowSignupPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label={showSignupPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="signup-confirm" className="auth-label">
                      Confirmar Senha
                    </label>
                    <div className="auth-input-wrapper">
                      <input
                        id="signup-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        className="auth-input auth-input-password"
                        placeholder="••••••••"
                        value={signupForm.confirmPassword}
                        onChange={(e) =>
                          setSignupForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value
                          }))
                        }
                        required
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="auth-btn"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Criar Conta
                    {!isLoading && (
                      <span className="auth-btn-arrow">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </TabsPrimitive.Content>
        </TabsPrimitive.Root>
      </div>
    </div>
  );
};

export default AuthPage;

