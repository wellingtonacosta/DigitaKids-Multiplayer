import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LICOES,
  MotorDigitacao,
  calcularEquilibrio,
  calcularEstrelas,
  calcularPontos,
  calcularPrecisao,
  calcularWpm,
  codeDoShift,
  dedoDaTecla,
  maoDaTecla,
  nivelPorPontos,
  toquesDoCaractere,
  toquesDoTexto,
  gerarDica,
} from "./index";

const ev = (code: string, shiftKey = false) => ({ code, key: "", shiftKey, isTrusted: true });

test("WPM: 50 caracteres em 1 minuto = 10 wpm", () => {
  assert.equal(calcularWpm(50, 60000), 10);
  assert.equal(calcularWpm(25, 30000), 10);
  assert.equal(calcularWpm(10, 0), 0);
});

test("precisão", () => {
  assert.equal(calcularPrecisao(90, 10), 90);
  assert.equal(calcularPrecisao(0, 0), 100);
  assert.equal(calcularPrecisao(50, 0), 100);
});

test("equilíbrio entre as mãos e alerta acima de 80%", () => {
  assert.equal(calcularEquilibrio(50, 50).desequilibrada, null);
  assert.equal(calcularEquilibrio(81, 19).desequilibrada, "esquerda");
  assert.equal(calcularEquilibrio(10, 90).desequilibrada, "direita");
  assert.equal(calcularEquilibrio(80, 20).desequilibrada, null);
});

test("mapeamento tecla → dedo e mão (linha base)", () => {
  assert.equal(dedoDaTecla("KeyA"), "mindinho-esquerdo");
  assert.equal(dedoDaTecla("KeyS"), "anelar-esquerdo");
  assert.equal(dedoDaTecla("KeyD"), "medio-esquerdo");
  assert.equal(dedoDaTecla("KeyF"), "indicador-esquerdo");
  assert.equal(dedoDaTecla("KeyG"), "indicador-esquerdo");
  assert.equal(dedoDaTecla("KeyH"), "indicador-direito");
  assert.equal(dedoDaTecla("KeyJ"), "indicador-direito");
  assert.equal(dedoDaTecla("KeyK"), "medio-direito");
  assert.equal(dedoDaTecla("KeyL"), "anelar-direito");
  assert.equal(dedoDaTecla("Semicolon"), "mindinho-direito");
  assert.equal(dedoDaTecla("Space"), "polegar");
});

test("mapeamento tecla → dedo nas outras linhas e números", () => {
  assert.equal(dedoDaTecla("KeyQ"), "mindinho-esquerdo");
  assert.equal(dedoDaTecla("KeyT"), "indicador-esquerdo");
  assert.equal(dedoDaTecla("KeyY"), "indicador-direito");
  assert.equal(dedoDaTecla("KeyP"), "mindinho-direito");
  assert.equal(dedoDaTecla("KeyV"), "indicador-esquerdo");
  assert.equal(dedoDaTecla("KeyM"), "indicador-direito");
  assert.equal(dedoDaTecla("Comma"), "medio-direito");
  assert.equal(dedoDaTecla("Digit5"), "indicador-esquerdo");
  assert.equal(dedoDaTecla("Digit6"), "indicador-direito");
  assert.equal(dedoDaTecla("Digit0"), "mindinho-direito");
  assert.equal(maoDaTecla("KeyE"), "esquerda");
  assert.equal(maoDaTecla("KeyO"), "direita");
  assert.equal(maoDaTecla("Space"), "ambas");
});

test("toques: letras, maiúsculas e acentos", () => {
  assert.deepEqual(toquesDoCaractere("a"), [{ code: "KeyA", shift: false }]);
  assert.deepEqual(toquesDoCaractere("A"), [{ code: "KeyA", shift: true }]);
  assert.deepEqual(toquesDoCaractere("ç"), [{ code: "Semicolon", shift: false }]);
  assert.deepEqual(toquesDoCaractere("?"), [{ code: "IntlRo", shift: true }]);
  assert.deepEqual(toquesDoCaractere("á"), [
    { code: "BracketLeft", shift: false, morta: true },
    { code: "KeyA", shift: false },
  ]);
  assert.deepEqual(toquesDoCaractere("ã")?.[0], { code: "Quote", shift: false, morta: true });
  assert.deepEqual(toquesDoCaractere("â")?.[0], { code: "Quote", shift: true, morta: true });
  assert.equal(toquesDoCaractere("€"), null);
});

test("Shift é da mão oposta", () => {
  assert.equal(codeDoShift("KeyA"), "ShiftRight");
  assert.equal(codeDoShift("KeyJ"), "ShiftLeft");
});

test("todas as lições usam só caracteres que existem no teclado ABNT2", () => {
  assert.equal(LICOES.length, 15);
  LICOES.forEach((l, i) => assert.equal(l.ordem, i + 1));
  for (const l of LICOES) assert.doesNotThrow(() => toquesDoTexto(l.textoAlvo), `lição ${l.ordem}`);
});

test("lições 9 a 15 podem ser digitadas do início ao fim sem erros", () => {
  for (const l of LICOES.filter((x) => x.ordem >= 9)) {
    const m = new MotorDigitacao(l.textoAlvo, () => 0);
    let ultimo: ReturnType<typeof m.processar> | null = null;
    for (const toque of toquesDoTexto(l.textoAlvo)) {
      ultimo = m.processar(ev(toque.code, toque.shift));
      assert.equal(ultimo.tipo, "acerto", `lição ${l.ordem}`);
    }
    assert.ok(m.terminou, `lição ${l.ordem} terminou`);
    assert.equal(m.resumo().erros, 0);
  }
});

test("estrelas das lições 9 a 15 têm metas alcançáveis", () => {
  assert.equal(calcularEstrelas(8, 30, 98), 3);
  for (let o = 9; o <= 15; o++) {
    assert.equal(calcularEstrelas(o, 40, 98), 3, "ordem " + o);
    assert.equal(calcularEstrelas(o, 25, 95), 2, "ordem " + o);
  }
});

test("motor: só avança com o toque certo e conta erros por tecla", () => {
  let t = 0;
  const m = new MotorDigitacao("ás", () => (t += 1000));
  assert.equal(m.processar(ev("KeyA")).tipo, "erro"); // faltou o acento
  assert.equal(m.indiceCaractere, 0);
  assert.equal(m.processar(ev("BracketLeft")).tipo, "acerto");
  assert.equal(m.progressoNoCaractere, 1);
  assert.equal(m.processar(ev("KeyS")).tipo, "erro"); // errou a letra: volta ao acento
  assert.equal(m.progressoNoCaractere, 0);
  assert.equal(m.processar(ev("BracketLeft")).tipo, "acerto");
  assert.equal(m.processar(ev("KeyA")).tipo, "acerto");
  const r = m.processar(ev("KeyS"));
  assert.deepEqual(r, { tipo: "acerto", terminou: true });
  const s = m.resumo();
  assert.equal(s.erros, 2);
  assert.equal(s.errosPorTecla["BracketLeft"], 1);
  assert.equal(s.errosPorTecla["KeyA"], 1);
  assert.equal(s.toquesCertos, 4);
  assert.equal(m.terminou, true);
});

test("motor: Shift sozinho não é erro, repeat e isTrusted=false são ignorados", () => {
  const m = new MotorDigitacao("Ab");
  assert.equal(m.processar(ev("ShiftRight", true)).tipo, "ignorado");
  assert.equal(m.processar({ ...ev("KeyA", true), isTrusted: false }).tipo, "ignorado");
  assert.equal(m.processar({ ...ev("KeyA", true), repeat: true }).tipo, "ignorado");
  assert.equal(m.processar(ev("KeyA", false)).tipo, "erro"); // sem Shift
  assert.equal(m.processar(ev("KeyA", true)).tipo, "acerto");
  assert.equal(m.resumo().erros, 1);
});

test("motor: conta teclas por mão", () => {
  const m = new MotorDigitacao("af j");
  for (const c of ["KeyA", "KeyF", "Space", "KeyJ"]) m.processar(ev(c));
  const s = m.resumo();
  assert.equal(s.teclasEsquerda, 2);
  assert.equal(s.teclasDireita, 1);
});

test("corrida: aceita maiúscula com Caps Lock, mas rejeita letra ou caixa errada", () => {
  const m = new MotorDigitacao("Aa!", Date.now, "caractere");
  assert.equal(m.processar({ ...ev("KeyA"), key: "a" }).tipo, "erro");
  assert.equal(m.processar({ ...ev("KeyA"), key: "A" }).tipo, "acerto");
  assert.equal(m.processar({ ...ev("KeyA", true), key: "a" }).tipo, "acerto");
  assert.equal(m.processar({ ...ev("Digit1", true), key: "?" }).tipo, "erro");
  assert.equal(m.processar({ ...ev("Digit1", true), key: "!" }).tipo, "acerto");
  assert.equal(m.terminou, true);
});

test("corrida: aceita acento composto e sequência de tecla morta sem perder posição", () => {
  const m = new MotorDigitacao("Áãç", Date.now, "caractere");
  assert.equal(m.processar({ ...ev("KeyA"), key: "A" }).tipo, "erro");
  assert.equal(m.processar({ ...ev("BracketLeft"), key: "Dead" }).tipo, "acerto");
  assert.equal(m.indiceCaractere, 0);
  assert.equal(m.processar({ ...ev("KeyA"), key: "Á" }).tipo, "acerto");
  assert.equal(m.processar({ ...ev("Quote"), key: "Dead" }).tipo, "acerto");
  assert.equal(m.processar({ ...ev("KeyA"), key: "a" }).tipo, "acerto");
  assert.equal(m.processar({ ...ev("Semicolon"), key: "ç" }).tipo, "acerto");
  assert.equal(m.terminou, true);
  assert.equal(m.resumo().toquesCertos, 5);
});

test("corrida: todos os textos aceitam os caracteres corretos sem erros", () => {
  for (const { texto } of TEXTOS_CORRIDA) {
    const m = new MotorDigitacao(texto, Date.now, "caractere");
    for (const key of texto) {
      assert.equal(m.processar({ ...ev("Unidentified"), key }).tipo, "acerto", `${texto}: ${key}`);
    }
    assert.equal(m.terminou, true);
    assert.equal(m.resumo().erros, 0);
    assert.equal(m.resumo().toquesCertos, toquesDoTexto(texto).length);
  }
});

test("estrelas: precisão abaixo de 90% não passa", () => {
  assert.equal(calcularEstrelas(1, 40, 89.9), 0);
  assert.equal(calcularEstrelas(1, 1, 90), 1);
  assert.equal(calcularEstrelas(1, 8, 95), 2);
  assert.equal(calcularEstrelas(1, 8, 94), 1);
  assert.equal(calcularEstrelas(1, 13, 98), 3);
  assert.equal(calcularEstrelas(1, 13, 97), 2);
});

test("pontos e nível", () => {
  assert.equal(calcularPontos(3, 100, 0), 75);
  assert.equal(calcularPontos(1, 92, 0), 20);
  assert.equal(calcularPontos(1, 92, 1), 5);
  assert.equal(nivelPorPontos(0), "Aprendiz");
  assert.equal(nivelPorPontos(200), "Digitador");
  assert.equal(nivelPorPontos(800), "Ninja do Teclado");
  assert.equal(nivelPorPontos(2000), "Mestre das Teclas");
});

test("dica personalizada fala da mão desequilibrada", () => {
  const d = gerarDica({
    errosPorTecla: {},
    equilibrio: calcularEquilibrio(90, 10),
    precisao: 95,
    estrelas: 2,
  });
  assert.match(d, /mão esquerda/);
});

import { TEXTOS_CORRIDA, codigoValido, indiceMaximoPlausivel, pontosCorrida } from "./index";

test("textos de corrida: 60 textos, 20 por nível, só com teclas ABNT2", () => {
  assert.equal(TEXTOS_CORRIDA.length, 60);
  for (const n of [1, 2, 3]) assert.equal(TEXTOS_CORRIDA.filter((t) => t.dificuldade === n).length, 20);
  const vistos = new Set<string>();
  for (const t of TEXTOS_CORRIDA) {
    assert.doesNotThrow(() => toquesDoTexto(t.texto), t.texto);
    assert.ok(!vistos.has(t.texto), "repetido: " + t.texto);
    vistos.add(t.texto);
    assert.equal(t.texto, t.texto.trim());
  }
});

test("código de sala sem caracteres ambíguos", () => {
  assert.equal(codigoValido("AB2CD"), true);
  assert.equal(codigoValido("ABOCD"), false);
  assert.equal(codigoValido("AB1CD"), false);
  assert.equal(codigoValido("ABCD"), false);
});

test("limite de progresso e pontos da corrida", () => {
  assert.ok(indiceMaximoPlausivel(1000, 100) < 30);
  assert.equal(indiceMaximoPlausivel(600000, 100), 100);
  assert.equal(pontosCorrida(1, 96), 60);
  assert.equal(pontosCorrida(2, 90), 35);
  assert.equal(pontosCorrida(5, 100), 25);
});
