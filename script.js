const RED_FLAGS = [
  "Deixa no visto por 3 dias e finge que o WhatsApp bugou",
  "Come metade da sua sobremesa dizendo 'eu não ia comer doce hoje'",
  "Diz 'já to indo' quando ainda nem tirou o pijama",
  "Nunca decide onde vai comer, mas reclama de toda sugestão",
  "Reage com '😐' em mensagens que mereciam parágrafo",
];

const HEAVY_FLAGS = [
  "Gaslighting nível PhD: jura que nunca disse aquilo, mesmo com print na tela",
  "Aplica lei do silêncio porque você demorou 3 minutos pra responder",
  "Ameaça terminar toda vez que perde uma discussão bem boba (tipo qual pizza pedir)",
  "Guarda rancor de uma coisa de 2019 que nem você lembra mais",
  "Faz love bombing com 40 corações no story e depois some 3 dias sem explicação",
  "Reescreve a história da briga no dia seguinte igual roteirista de novela",
  "Vira vítima até quando é ela quem erra",
  "Interroga seu celular tipo tá cobrindo plantão da polícia federal",
  "Faz manha calculada bem na hora que ia perder o argumento",
  "Compara com ex só pra testar se você tem ciúme",
  "Chantagem emocional pra escolher o filme (ou vocês não assistem nada)",
  "Ameaça deletar o Instagram toda semana e nunca deleta",
  "Se joga de vítima na hora que é confrontada com print",
  "Testa sua paciência de propósito só pra ver até onde você aguenta",
];

const TOTAL_FLAGS = RED_FLAGS.length + HEAVY_FLAGS.length;

const STATUS_LEVELS = [
  { max: 20, text: "tranquilo, ainda dá pra namorar 😌" },
  { max: 45, text: "atenção... fica de olho 👀" },
  { max: 70, text: "hmm, tá ficando preocupante 😬" },
  { max: 90, text: "SOCORRO, ALGUÉM CHAME AJUDA 🚨" },
  { max: 100, text: "ABORTAR MISSÃO IMEDIATAMENTE 🏃‍♂️💨" },
];

let revealed = [];
let pool = [];
let heavyPool = [];
let heavyBannerShown = false;

const cardsContainer = document.getElementById("cardsContainer");
const meterFill = document.getElementById("meterFill");
const meterValue = document.getElementById("meterValue");
const meterStatus = document.getElementById("meterStatus");
const addFlagBtn = document.getElementById("addFlagBtn");
const resetBtn = document.getElementById("resetBtn");
const flagsBg = document.getElementById("flagsBg");

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function init() {
  pool = shuffle(RED_FLAGS);
  heavyPool = shuffle(HEAVY_FLAGS);
  heavyBannerShown = false;
  revealed = [];
  addFlagBtn.disabled = false;
  render();
}

function render() {
  cardsContainer.innerHTML = "";

  if (revealed.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "nenhuma red flag revelada ainda... clique no botão se tiver coragem";
    cardsContainer.appendChild(empty);
  } else {
    revealed.forEach((item) => {
      if (item.banner) {
        const banner = document.createElement("div");
        banner.className = "toxic-banner";
        banner.textContent = "⚠️ MODO TÓXICO ATIVADO ⚠️";
        cardsContainer.appendChild(banner);
        return;
      }
      const card = document.createElement("div");
      card.className = item.heavy ? "card heavy" : "card";
      const emoji = item.heavy ? "💀" : "🚩";
      card.innerHTML = `<span class="flag-emoji">${emoji}</span><span>${item.text}</span>`;
      cardsContainer.appendChild(card);
    });
  }

  const flagCount = revealed.filter((item) => !item.banner).length;
  const percent = Math.min(100, Math.round((flagCount / TOTAL_FLAGS) * 100));
  meterFill.style.width = percent + "%";
  meterValue.textContent = percent;

  const level = STATUS_LEVELS.find((l) => percent <= l.max) || STATUS_LEVELS[STATUS_LEVELS.length - 1];
  meterStatus.textContent = level.text;

  if (pool.length === 0 && heavyPool.length === 0) {
    addFlagBtn.disabled = true;
    addFlagBtn.textContent = "🏁 acabaram as red flags (por enquanto)";
  } else if (pool.length === 0 && heavyPool.length > 0) {
    addFlagBtn.textContent = heavyBannerShown
      ? "💀 Revelar mais uma red flag tóxica"
      : "☠️ Ativar modo tóxico";
  } else {
    addFlagBtn.textContent = "🚩 Revelar mais uma red flag";
  }
}

function spawnFallingFlag(emoji = "🚩") {
  const flag = document.createElement("div");
  flag.className = "floating-flag";
  flag.textContent = emoji;
  flag.style.left = Math.random() * 100 + "vw";
  flag.style.animationDuration = 2 + Math.random() * 2 + "s";
  flag.style.fontSize = 1.2 + Math.random() * 1.8 + "rem";
  document.body.appendChild(flag);
  setTimeout(() => flag.remove(), 4000);
}

addFlagBtn.addEventListener("click", () => {
  let isHeavy = false;

  if (pool.length > 0) {
    const text = pool.pop();
    revealed.push({ text, heavy: false });
  } else if (heavyPool.length > 0) {
    if (!heavyBannerShown) {
      revealed.push({ banner: true });
      heavyBannerShown = true;
    }
    const text = heavyPool.pop();
    revealed.push({ text, heavy: true });
    isHeavy = true;
  } else {
    return;
  }

  render();
  const emoji = isHeavy ? "💀" : "🚩";
  for (let i = 0; i < 6; i++) {
    setTimeout(() => spawnFallingFlag(emoji), i * 80);
  }
});

resetBtn.addEventListener("click", init);

function fillBackground() {
  flagsBg.innerHTML = "🚩".repeat(80);
}

fillBackground();
init();
