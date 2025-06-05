class Jogador {
  constructor(simbolo) {
    this.simbolo = simbolo;
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
  constructor(jogador1 = new Jogador("X"), jogador2 = new Jogador("O")) {
    this.jogador1 = jogador1;
    this.jogador2 = jogador2;
    this.jogadorAtual = this.jogador1;
    this.tamanho = 3;
    this.tabuleiro = this.#iniciarTabuleiro();
    this.vencedor = null;
  }
  #iniciarTabuleiro() {
    return Array(this.tamanho)
      .fill(0)
      .map(() => Array(this.tamanho).fill(null));
  }

  jogar(jogada) {
    if (this.#jogadaValida(jogada)) {
      this.#adicionar(jogada);
      this.#trocarJogador();
    } else {
      console.log("Jogada inválida");
    }
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

  toString() {
    let matriz = this.tabuleiro
      .map((linha) => linha.map((posicao) => posicao ?? "-").join(" "))
      .join("\n");

    return matriz;
  }
}

const jogo = new JogoDaVelha();
jogo.jogar(new Jogada(1, 1)); // X
jogo.jogar(new Jogada(1, 2)); // O
jogo.jogar(new Jogada(2, 2)); // X
jogo.jogar(new Jogada(1, 1)); // O
console.log(jogo.toString());
