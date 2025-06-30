class JogadorHumano {
  constructor(simbolo) {
    this.simbolo = simbolo;
    this.humano = true;
  }
}

class JogadorAleatorio {
  constructor(simbolo) {
    this.simbolo = simbolo;
    this.humano = false;
  }
  jogar(tabuleiro) {
    let linha = this.#aleatorio(1, tabuleiro.length);
    let coluna = this.#aleatorio(1, tabuleiro.length);
    return new Jogada(linha, coluna);
  }

  #aleatorio(min, max) {
    let valor = Math.random() * (max - min + 1) + min;
    return Math.floor(valor);
  }
}
class Jogada {
  constructor(linha, coluna) {
    this.linha = linha;
    this.coluna = coluna;
  }
  get valida() {
    return this.linha > 0 && this.coluna > 0;
  }
  get invalida() {
    return !this.valida;
  }
}

class JogoDaVelha {
  constructor(
    jogador1 = new JogadorHumano("X"),
    jogador2 = new JogadorHumano("O"),
    tamanho = 3
  ) {
    this.jogador1 = jogador1;
    this.jogador2 = jogador2;
    this.tamanho = tamanho;
    this.zerar();
  }
  #iniciarTabuleiro() {
    return Array(this.tamanho)
      .fill(0)
      .map(() => Array(this.tamanho).fill(null));
  }

  jogar(jogada) {
    if (this.jogadorAtual.humano) {
      this.#processarJogada(jogada);
    }
    while (!this.vencedor && !this.jogadorAtual.humano) {
      let jogada = this.jogadorAtual.jogar(this.tabuleiro);
      this.#processarJogada(jogada);
    }
  }

  #processarJogada(jogada) {
    if (!this.#jogadaValida(jogada)) return;
    this.#adicionar(jogada);

    if (this.#conquistouVitoriaComJogada(jogada)) {
      this.vencedor = this.jogadorAtual.simbolo;
      return;
    } else if (this.#finalizouComEmpate()) {
      this.vencedor = "-";
      return;
    }
    this.#trocarJogador();
  }

  #jogadaValida(jogada) {
    if (jogada.invalida) {
      return false;
    }

    let { linha, coluna } = jogada;
    if (linha > this.tamanho || coluna > this.tamanho) {
      return false;
    }
    if (this.#ocupado(jogada)) {
      return false;
    }
    if (this.vencedor) {
      return false;
    }
    return true;
  }

  #ocupado(jogada) {
    let { linha, coluna } = jogada;
    return this.#campo(linha, coluna) !== null;
  }

  #campo(linha, coluna) {
    return this.tabuleiro[linha - 1][coluna - 1];
  }

  #trocarJogador() {
    this.jogadorAtual =
      this.jogadorAtual.simbolo === this.jogador1.simbolo
        ? this.jogador2
        : this.jogador1;
  }

  #adicionar(jogada) {
    let { linha, coluna } = jogada;
    this.tabuleiro[linha - 1][coluna - 1] = this.jogadorAtual.simbolo;
  }

  #finalizouComEmpate() {
    let espacosVazios = this.tabuleiro.flat().filter((campo) => campo === null);
    return espacosVazios.length === 0;
  }

  #conquistouVitoriaComJogada(jogada) {
    let { linha, coluna } = jogada;
    let tamanho = this.tamanho;
    let indices = Array(tamanho)
      .fill(0)
      .map((_, i) => i + 1);

    // Verifica se ganhou em linha
    let ganhouEmLinha = indices.every(
      (i) => this.#campo(linha, i) === this.jogadorAtual.simbolo
    );

    // Verifica se ganhou em coluna
    let ganhouEmColuna = indices.every(
      (i) => this.#campo(i, coluna) === this.jogadorAtual.simbolo
    );

    // Verifica se ganhou na diagonal principal
    let ganhouEmDiag1 = indices.every(
      (i) => this.#campo(i, i) === this.jogadorAtual.simbolo
    );

    // Verifica se ganhou na diagonal secundária
    let ganhouEmDiag2 = indices.every(
      (i) => this.#campo(i, tamanho - i + 1) === this.jogadorAtual.simbolo
    );

    return ganhouEmLinha || ganhouEmColuna || ganhouEmDiag1 || ganhouEmDiag2;
  }

  zerar() {
    this.tabuleiro = this.#iniciarTabuleiro();
    this.jogadorAtual = this.jogador1;
    this.vencedor = null;
  }
  toString() {
    let matriz = this.tabuleiro
      .map((linha) => linha.map((posicao) => posicao ?? "-").join(" "))
      .join("\n");
    let quemVenceu = this.vencedor ? `Vencedor: ${this.vencedor}` : "";
    return `${matriz}\n ${quemVenceu}`;
  }
}

const jogo = new JogoDaVelha(new JogadorHumano("X"), new JogadorAleatorio("O"));
jogo.jogar(new Jogada(1, 1)); // X
jogo.jogar(new Jogada(2, 2)); // O
// jogo.jogar(new Jogada(1, 3)); // X
// jogo.jogar(new Jogada(1, 2)); // O
// jogo.jogar(new Jogada(3, 1)); // X
// jogo.jogar(new Jogada(3, 2)); // O
// jogo.jogar(new Jogada(3, 2)); // X
// jogo.jogar(new Jogada(3, 1)); // O
// jogo.jogar(new Jogada(3, 3)); // O

console.log(jogo.toString());
