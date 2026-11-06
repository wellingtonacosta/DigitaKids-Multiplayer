import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import { RefreshCw } from "lucide-react";
import { useHealthCheck, getHealthCheckQueryKey } from "@workspace/api-client-react";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout, Logo } from "@/components/layout";
import { useSessao } from "@/hooks/use-sessao";
import NotFound from "@/pages/not-found";
import Entrada from "@/pages/entrada";
import Inicio from "@/pages/inicio";
import RankingPagina from "@/pages/ranking";
import PerfilPagina from "@/pages/perfil";
import Aulas from "@/pages/aulas";
import LicaoPagina from "@/pages/licao";
import Corridas from "@/pages/corridas";
import SalaPagina from "@/pages/sala";

const queryClient = new QueryClient();
const ROTAS = ["/", "/aulas", "/corridas", "/ranking", "/perfil"];

function Carregando() {
  return (
    <div className="min-h-[100dvh] dots-bg p-6 space-y-5" aria-busy="true" aria-label="Carregando">
      <Logo />
      <div className="h-36 rounded-3xl bg-muted animate-pulse" />
      <div className="grid sm:grid-cols-3 gap-4">{[0,1,2].map(i=><div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />)}</div>
    </div>
  );
}

function ErroConexao({ onRetry }: { onRetry: () => void }) {
  const health = useHealthCheck({ query: { retry: false, queryKey: getHealthCheckQueryKey() } });
  return (
    <div className="min-h-[100dvh] dots-bg grid place-items-center p-4">
      <div className="chunky rounded-3xl bg-card p-8 text-center max-w-md" role="status" aria-live="polite">
        <h1 className="font-display text-3xl font-extrabold">Opa, o jogo deu uma pausa</h1>
        <p className="mt-2 text-muted-foreground">{health.isError ? "O servidor está descansando um pouquinho." : "Não conseguimos carregar seus dados agora."} Vamos tentar de novo?</p>
        <button onClick={() => { onRetry(); health.refetch(); }} data-testid="button-tentar-novamente" className="chunky-btn mt-6 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-bold text-lg">
          <RefreshCw className="h-5 w-5" aria-hidden="true" />Tentar de novo
        </button>
      </div>
    </div>
  );
}

function Router() {
  const [loc] = useLocation();
  const { jogador, carregando, erro, refetch } = useSessao();
  if (!ROTAS.includes(loc) && !/^\/aulas\/\d+$/.test(loc) && !/^\/sala\/[A-Za-z0-9]{5}$/.test(loc)) return <NotFound />;
  if (carregando) return <Carregando />;
  if (erro) return <ErroConexao onRetry={() => refetch()} />;
  if (!jogador) return <Entrada />;
  return (
    <Layout jogador={jogador}>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/">{() => <Inicio jogador={jogador} />}</Route>
          <Route path="/aulas" component={Aulas} />
          <Route path="/aulas/:id" component={LicaoPagina} />
          <Route path="/corridas" component={Corridas} />
          <Route path="/sala/:codigo" component={SalaPagina} />
          <Route path="/ranking" component={RankingPagina} />
          <Route path="/perfil" component={PerfilPagina} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Layout>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
