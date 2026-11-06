import { useQueryClient } from "@tanstack/react-query";
import { useObterJogadorAtual, useSair, getObterJogadorAtualQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";

export function useSessao() {
  const q = useObterJogadorAtual({ query: { retry: false, queryKey: getObterJogadorAtualQueryKey(), staleTime: 30_000 } });
  const status = (q.error as { status?: number } | null)?.status;
  const deslogado = !!q.error && status === 401;
  return { jogador: q.data, carregando: q.isLoading, deslogado, erro: q.error && !deslogado ? q.error : null, refetch: q.refetch };
}

export function useSairDoJogo() {
  const qc = useQueryClient();
  const [, setLocation] = useLocation();
  const sair = useSair();
  return {
    sair: () =>
      sair.mutate(undefined, {
        onSettled: () => {
          qc.removeQueries({ queryKey: getObterJogadorAtualQueryKey() });
          qc.invalidateQueries({ queryKey: getObterJogadorAtualQueryKey() });
          setLocation("/");
        },
      }),
    saindo: sair.isPending,
  };
}

export function useTecladoFisico() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return !(window.matchMedia("(pointer: coarse)").matches && window.matchMedia("(hover: none)").matches);
}
