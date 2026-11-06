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
  assert.equal(LICOES.length, 8);
  for (const l of LICOES) assert.doesNotThrow(() => toquesDoTexto(l.textoAlvo), `lição ${l.ordem}`);
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
  assert.equal(nivelPorPontos(0), "Pintinho");
  assert.equal(nivelPorPontos(200), "Galinha");
  assert.equal(nivelPorPontos(800), "Galo");
  assert.equal(nivelPorPontos(2000), "Mestre do Milharal");
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
