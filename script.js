// Controle de abas
const linkJogo = document.getElementById('linkJogo');
const linkHistoria = document.getElementById('linkHistoria');
const linkCuriosidades = document.getElementById('linkCuriosidades');

const secJogo = document.getElementById('jogo');
const secHistoria = document.getElementById('historia');
const secCuriosidades = document.getElementById('curiosidades');

function ativarAba(aba) {
  [linkJogo, linkHistoria, linkCuriosidades].forEach(link => link.classList.remove('active'));
  [secJogo, secHistoria, secCuriosidades].forEach(sec => sec.style.display = 'none');

  if (aba === 'jogo') {
    linkJogo.classList.add('active');
    secJogo.style.display = 'block';
  } else if (aba === 'historia') {
    linkHistoria.classList.add('active');
    secHistoria.style.display = 'block';
  } else if (aba === 'curiosidades') {
    linkCuriosidades.classList.add('active');
    secCuriosidades.style.display = 'block';
  }
}

linkJogo.addEventListener('click', e => {
  e.preventDefault();
  ativarAba('jogo');
});
linkHistoria.addEventListener('click', e => {
  e.preventDefault();
  ativarAba('historia');
});
linkCuriosidades.addEventListener('click', e => {
  e.preventDefault();
  ativarAba('curiosidades');
});

// Jogo da memória
const nivelSelect = document.getElementById('nivelSelect');
const tabuleiro = document.getElementById('tabuleiro');
const pontosEl = document.getElementById('pontos');
const modalVitoria = document.getElementById('modalVitoria');
const botaoFecharModal = document.getElementById('botaoFecharModal');
const botaoProximoNivel = document.getElementById('botaoProximoNivel');

let pontos = 0;
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let totalPares = 0;

const niveis = ['facil', 'medio', 'dificil'];

const emojisFacil = ['🚜', '🌽', '🐓', '🐄'];
const emojisMedio = ['🚜', '🌽', '🐓', '🐄', '🌻', '🚦'];
const emojisDificil = ['🚜', '🌽', '🐓', '🐄', '🌻', '🚦', '🏙️', '🌳'];

function iniciarJogo() {
  pontos = 0;
  pontosEl.textContent = `Pontos: ${pontos}`;
  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;
  tabuleiro.innerHTML = '';

  let emojis;
  if (nivelSelect.value === 'facil') {
    emojis = emojisFacil;
    tabuleiro.style.gridTemplateColumns = 'repeat(4, 100px)';
  } else if (nivelSelect.value === 'medio') {
    emojis = emojisMedio;
    tabuleiro.style.gridTemplateColumns = 'repeat(6, 100px)';
  } else {
    emojis = emojisDificil;
    tabuleiro.style.gridTemplateColumns = 'repeat(8, 100px)';
  }

  const cartas = [...emojis, ...emojis];
  totalPares = emojis.length;
  cartas.sort(() => 0.5 - Math.random());

  cartas.forEach(emoji => {
    const carta = document.createElement('div');
    carta.classList.add('carta');
    carta.dataset.valor = emoji;
    carta.textContent = '';

    carta.addEventListener('click', () => {
      if (bloqueado || carta.classList.contains('revelada') || carta === primeiraCarta) return;

      carta.classList.add('revelada');
      carta.textContent = emoji;

      if (!primeiraCarta) {
        primeiraCarta = carta;
      } else {
        segundaCarta = carta;
        bloqueado = true;

        if (primeiraCarta.dataset.valor === segundaCarta.dataset.valor) {
          pontos += 10;
          pontosEl.textContent = `Pontos: ${pontos}`;
          primeiraCarta = null;
          segundaCarta = null;
          bloqueado = false;

          if (pontos === totalPares * 10) {
            setTimeout(() => {
              mostrarVitoria();
            }, 400);
          }
        } else {
          setTimeout(() => {
            primeiraCarta.classList.remove('revelada');
            segundaCarta.classList.remove('revelada');
            primeiraCarta.textContent = '';
            segundaCarta.textContent = '';
            primeiraCarta = null;
            segundaCarta = null;
            bloqueado = false;
          }, 1000);
        }
      }
    });

    tabuleiro.appendChild(carta);
  });
}

function mostrarVitoria() {
  modalVitoria.style.display = 'flex';
}

botaoFecharModal.addEventListener('click', () => {
  modalVitoria.style.display = 'none';
  iniciarJogo();
});

botaoProximoNivel.addEventListener('click', () => {
  const nivelAtual = nivelSelect.value;
  let indiceAtual = niveis.indexOf(nivelAtual);

  indiceAtual = (indiceAtual + 1) % niveis.length;
  nivelSelect.value = niveis[indiceAtual];

  modalVitoria.style.display = 'none';
  iniciarJogo();
});

nivelSelect.addEventListener('change', iniciarJogo);

iniciarJogo();
