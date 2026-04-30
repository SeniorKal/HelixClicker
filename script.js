const STORAGE_KEYS = {
    dna: "dna",
    cartas: "cartas",
    precosPacks: "precosPacks",
    packsDesbloqueados: "packsDesbloqueados",
    missoesMapa: "missoesMapa",
    operacoesMapa: "operacoesMapa",
    organizacao: "organizacao"
};
const CAMINHO_SOM_DESBLOQUEIO = "sounds/Desbloqueio.mp3";

const RARIDADE_ORDEM = ["comum", "raro", "epico", "lendario"];
const RARIDADE_ORDEM_INVENTARIO = [...RARIDADE_ORDEM].reverse();
const LEVEL_MAXIMO_CARTA = 5;
const AMOSTRAS_PARA_UPGRADE = {
    comum: { inicial: 4, incrementoPorLevel: 2 },
    raro: { inicial: 3, incrementoPorLevel: 2 },
    epico: { inicial: 2, incrementoPorLevel: 1 },
    lendario: { inicial: 1, incrementoPorLevel: 1 }
};

const PACKS_LOJA = [
    {
        id: "pack-prata",
        nome: "Pack Prata",
        imagem: "images/Pack1.png",
        custo: 5,
        custoMaximo: 2000,
        desbloqueadoPorPadrao: true,
        chances: [
            { raridade: "comum", chance: 100 },
        ]
    },
    {
        id: "pack-ouro",
        nome: "Pack Ouro",
        imagem: "images/Pack2.png",
        custo: 500,
        custoMaximo: 5000,
        desbloqueadoPorPadrao: false,
        chances: [
            { raridade: "comum", chance: 50 },
            { raridade: "raro", chance: 45 },
            { raridade: "epico", chance: 5 }
        ]
    },
    {
        id: "pack-especial",
        nome: "Pack Especial",
        imagem: "images/Pack3.png",
        custo: 5000,
        custoMaximo: 50000,
        desbloqueadoPorPadrao: false,
        chances: [
            { raridade: "raro", chance: 50 },
            { raridade: "epico", chance: 40 },
            { raridade: "lendario", chance: 10 }
        ]
    }
];

const CARTAS_DISPONIVEIS = [
    { nome: "Cindy", raridade: "comum", level: 1, amostras: 0, passivaBase: 1, passivaTipo: "clique", imagem: "cards/Cindy.png", stats: { combate: 0, forca: 0, vigor: 1, inteligencia: 1, agilidade: 3 } },
    { nome: "Alyssa", raridade: "comum", level: 1, amostras: 0, passivaBase: 1, passivaTipo: "clique", imagem: "cards/Alyssa.png", stats: { combate: 0, forca: 0, vigor: 0, inteligencia: 3, agilidade: 2 } },
    { nome: "Mark", raridade: "comum", level: 1, amostras: 0, passivaBase: 1, passivaTipo: "clique", imagem: "cards/Mark.png", stats: { combate: 0, forca: 3, vigor: 2, inteligencia: 0, agilidade: 0 } },
    { nome: "Kevin", raridade: "comum", level: 1, amostras: 0, passivaBase: 1, passivaTipo: "clique", imagem: "cards/Kevin.png", stats: { combate: 3, forca: 2, vigor: 0, inteligencia: 0, agilidade: 0 } },
    { nome: "Kendo", raridade: "raro", level: 1, amostras: 0, passivaBase: 1, passivaTipo: "segundo", imagem: "cards/Kendo.png", stats: { combate: 5, forca: 2, vigor: 2, inteligencia: 1, agilidade: 0 } },
    { nome: "Brad", raridade: "raro", level: 1, amostras: 0, passivaBase: 1, passivaTipo: "segundo", imagem: "cards/Brad.png", stats: { combate: 1, forca: 1, vigor: 5, inteligencia: 0, agilidade: 3 } },
    { nome: "Josh", raridade: "raro", level: 1, amostras: 0, passivaBase: 1, passivaTipo: "segundo", imagem: "cards/Josh.png", stats: { combate: 2, forca: 2, vigor: 2, inteligencia: 2, agilidade: 2 } },
    { nome: "Mikhail", raridade: "raro", level: 1, amostras: 0, passivaBase: 1, passivaTipo: "segundo", imagem: "cards/Mikhail.png", stats: { combate: 1, forca: 4, vigor: 0, inteligencia: 5, agilidade: 0 } },
    { nome: "Claire", raridade: "epico", level: 1, amostras: 0, passivaBase: 3, passivaTipo: "clique", imagem: "cards/Claire.png", stats: { combate: 4, forca: 3, vigor: 5, inteligencia: 4, agilidade: 4 } },
    { nome: "Leon", raridade: "epico", level: 1, amostras: 0, passivaBase: 3, passivaTipo: "clique", imagem: "cards/Leon.png", stats: { combate: 5, forca: 4, vigor: 4, inteligencia: 3, agilidade: 4 } },
    { nome: "Chris", raridade: "epico", level: 1, amostras: 0, passivaBase: 3, passivaTipo: "clique", imagem: "cards/Chris.png", stats: { combate: 6, forca: 6, vigor: 5, inteligencia: 1, agilidade: 2 } },
    { nome: "Jill", raridade: "epico", level: 1, amostras: 0, passivaBase: 3, passivaTipo: "clique", imagem: "cards/Jill.png", stats: { combate: 3, forca: 2, vigor: 5, inteligencia: 4, agilidade: 4 } },
    { nome: "Hunk", raridade: "lendario", level: 1, amostras: 0, passivaBase: 2, passivaTipo: "segundo", bonusMultiplicadorCliqueBase: 0.5, imagem: "cards/Hunk.png", stats: { combate: 10, forca: 7, vigor: 7, inteligencia: 8, agilidade: 8 } },
];

let dna = lerNumero(STORAGE_KEYS.dna, 0);
let dnaPorClique = 1;
let dnaPorSegundo = 0;
let bonusMultiplicadorClique = 0;
let packSelecionadoIndex = 0;
let filtroRaridadeAtual = "todos";
let packsDesbloqueados = [];
let estadoOperacoes = criarEstadoOperacoesPadrao();

function lerNumero(chave, valorPadrao) {
    const valor = parseFloat(localStorage.getItem(chave));
    return Number.isNaN(valor) ? valorPadrao : valor;
}

function carregarCartasSalvas() {
    const cartasSalvas = JSON.parse(localStorage.getItem(STORAGE_KEYS.cartas)) || [];
    const cartasNormalizadas = normalizarCartasSalvas(cartasSalvas);

    if (JSON.stringify(cartasSalvas) !== JSON.stringify(cartasNormalizadas)) {
        salvarCartas(cartasNormalizadas);
    }

    return cartasNormalizadas;
}

function criarPacksDesbloqueadosPadrao() {
    return PACKS_LOJA.map((pack) => Boolean(pack.desbloqueadoPorPadrao));
}

function obterCustoPackDentroDoLimite(pack, custo) {
    const custoNumerico = Number(custo);
    const custoAtual = Number.isFinite(custoNumerico) ? custoNumerico : pack.custo;
    const custoMaximo = Number(pack.custoMaximo);

    if (!Number.isFinite(custoMaximo) || custoMaximo <= 0) {
        return Math.max(0, Math.round(custoAtual));
    }

    return Math.min(custoMaximo, Math.max(0, Math.round(custoAtual)));
}

function carregarPrecosPacks() {
    const precosSalvos = JSON.parse(localStorage.getItem(STORAGE_KEYS.precosPacks));

    if (Array.isArray(precosSalvos) && precosSalvos.length === PACKS_LOJA.length) {
        PACKS_LOJA.forEach((pack, index) => {
            pack.custo = obterCustoPackDentroDoLimite(pack, precosSalvos[index]);
        });
        salvarPrecosPacks();
        return;
    }

    salvarPrecosPacks();
}

function carregarPacksDesbloqueados() {
    const packsSalvos = JSON.parse(localStorage.getItem(STORAGE_KEYS.packsDesbloqueados));
    const padrao = criarPacksDesbloqueadosPadrao();

    if (Array.isArray(packsSalvos) && packsSalvos.length === PACKS_LOJA.length) {
        packsDesbloqueados = padrao.map((desbloqueadoPorPadrao, index) => desbloqueadoPorPadrao || Boolean(packsSalvos[index]));
        salvarPacksDesbloqueados();
        return;
    }

    packsDesbloqueados = padrao;
    salvarPacksDesbloqueados();
}

function salvarDNA() {
    localStorage.setItem(STORAGE_KEYS.dna, String(dna));
}

function salvarCartas(cartas) {
    localStorage.setItem(STORAGE_KEYS.cartas, JSON.stringify(cartas));
}

function salvarPrecosPacks() {
    const precosAtuais = PACKS_LOJA.map((pack) => pack.custo);
    localStorage.setItem(STORAGE_KEYS.precosPacks, JSON.stringify(precosAtuais));
}

function salvarPacksDesbloqueados() {
    localStorage.setItem(STORAGE_KEYS.packsDesbloqueados, JSON.stringify(packsDesbloqueados));
}

function garantirContainerAvisos() {
    let container = document.getElementById("avisosDesbloqueio");

    if (container) {
        return container;
    }

    container = document.createElement("div");
    container.id = "avisosDesbloqueio";
    container.className = "avisos-desbloqueio";
    document.body.appendChild(container);

    return container;
}

function tocarSomDesbloqueio() {
    const audio = new Audio(CAMINHO_SOM_DESBLOQUEIO);

    audio.volume = 0.25;
    audio.play().catch(() => {
        // Alguns navegadores bloqueiam audio antes da primeira interacao do usuario.
    });
}

function mostrarAvisoMissaoConcluida(missao) {
    const container = garantirContainerAvisos();
    const aviso = document.createElement("div");
    const icone = document.createElement("div");
    const conteudo = document.createElement("div");
    const titulo = document.createElement("strong");
    const mensagem = document.createElement("p");

    aviso.className = "aviso-desbloqueio aviso-missao";
    icone.className = "aviso-icone";
    conteudo.className = "aviso-conteudo";
    titulo.className = "aviso-titulo";
    mensagem.className = "aviso-mensagem";

    icone.innerText = "!";
    titulo.innerText = "Missao concluida";
    mensagem.innerText = `${missao.nome} - Recompensa: ${missao.recompensa}`;

    conteudo.appendChild(titulo);
    conteudo.appendChild(mensagem);
    aviso.appendChild(icone);
    aviso.appendChild(conteudo);
    container.appendChild(aviso);

    tocarSomDesbloqueio();

    requestAnimationFrame(() => aviso.classList.add("visivel"));
    setTimeout(() => aviso.classList.add("saindo"), 3600);
    setTimeout(() => aviso.remove(), 4300);
}

function estaNaPagina(classeBody) {
    return document.body.classList.contains(classeBody);
}

function atualizarDNA() {
    const dnaTexto = document.getElementById("dna");

    if (dnaTexto) {
        dnaTexto.innerText = `DNA: ${formatarNumero(dna)}`;
    }
    
}

function formatarNumero(valor) {
    return String(Math.round(valor));
}

function atualizarInterfaceBonus() {
    const dnaCliqueTexto = document.getElementById("dnaPorClique");
    const dnaSegundoTexto = document.getElementById("dnaPorSegundo");

    if (dnaCliqueTexto) {
        dnaCliqueTexto.innerText = `DNA por clique: ${formatarNumero(dnaPorClique)}`;
    }

    if (dnaSegundoTexto) {
        dnaSegundoTexto.innerText = `DNA por segundo: ${formatarNumero(dnaPorSegundo)}`;
    }
}

function irParaLoja() {
    window.location.href = "loja.html";
}

function irParaConquistas() {
    window.location.href = "conquistas.html";
}

function voltar() {
    window.location.href = "index.html";
}

async function resetarJogo() {
    const confirmar = confirm("Tem certeza que deseja resetar o jogo? Todo o progresso sera apagado.");

    if (!confirmar) {
        return;
    }

    localStorage.removeItem(STORAGE_KEYS.dna);
    localStorage.removeItem(STORAGE_KEYS.cartas);
    localStorage.removeItem(STORAGE_KEYS.precosPacks);
    localStorage.removeItem(STORAGE_KEYS.packsDesbloqueados);
    localStorage.removeItem(STORAGE_KEYS.missoesMapa);
    localStorage.removeItem(STORAGE_KEYS.operacoesMapa);
    localStorage.removeItem(STORAGE_KEYS.organizacao);
    sessionStorage.clear();

    dna = 0;
    dnaPorClique = 1;
    dnaPorSegundo = 0;
    bonusMultiplicadorClique = 0;
    packSelecionadoIndex = 0;
    filtroRaridadeAtual = "todos";
    packsDesbloqueados = criarPacksDesbloqueadosPadrao();
    estadoOperacoes = criarEstadoOperacoesPadrao();

    if ("caches" in window) {
        try {
            const nomesDosCaches = await caches.keys();
            await Promise.all(nomesDosCaches.map((nome) => caches.delete(nome)));
        } catch (erro) {
            console.warn("Nao foi possivel limpar os caches do navegador.", erro);
        }
    }

    window.location.replace("index.html");
}

function obterModeloCarta(nome) {
    return CARTAS_DISPONIVEIS.find((carta) => carta.nome === nome);
}

function obterCartaBasePorRaridade(raridade) {
    return CARTAS_DISPONIVEIS.find((carta) => carta.raridade === raridade) || {};
}

function criarCartaParaInventario(carta) {
    const modelo = obterModeloCarta(carta.nome) || carta;
    const amostras = carta.amostras ?? carta.copias ?? 0;

    return {
        nome: modelo.nome || carta.nome,
        raridade: modelo.raridade || carta.raridade,
        level: Math.min(Number(carta.level) || 1, LEVEL_MAXIMO_CARTA),
        amostras: Math.max(Number(amostras) || 0, 0),
        passivaBase: Number(modelo.passivaBase || carta.passivaBase) || 0,
        passivaTipo: modelo.passivaTipo || carta.passivaTipo || "clique",
        bonusMultiplicadorCliqueBase: Number(modelo.bonusMultiplicadorCliqueBase || carta.bonusMultiplicadorCliqueBase) || 0,
        imagem: modelo.imagem || carta.imagem,
        stats: modelo.stats || { combate: 10, forca: 10, vigor: 10, inteligencia: 10, agilidade: 10 }
    };
}

function normalizarCartasSalvas(cartasSalvas) {
    if (!Array.isArray(cartasSalvas)) {
        return [];
    }

    const agrupadas = {};

    cartasSalvas.forEach((carta) => {
        if (!carta || !carta.nome) {
            return;
        }

        if (!agrupadas[carta.nome]) {
            agrupadas[carta.nome] = criarCartaParaInventario(carta);
            return;
        }

        const cartaTemEstruturaNova = Object.prototype.hasOwnProperty.call(carta, "level")
            || Object.prototype.hasOwnProperty.call(carta, "amostras")
            || Object.prototype.hasOwnProperty.call(carta, "copias");

        if (cartaTemEstruturaNova) {
            agrupadas[carta.nome].level = Math.max(agrupadas[carta.nome].level, Number(carta.level) || 1);
            agrupadas[carta.nome].amostras += Number(carta.amostras ?? carta.copias) || 0;
        } else {
            agrupadas[carta.nome].amostras += 1;
        }
    });

    return Object.values(agrupadas).map((carta) => criarCartaParaInventario(carta));
}

function obterAmostrasNecessarias(carta) {
    const regra = AMOSTRAS_PARA_UPGRADE[carta.raridade];

    if (!regra) {
        return 1;
    }

    return regra.inicial + ((carta.level - 1) * regra.incrementoPorLevel);
}

function cartaPodeSubirNivel(carta) {
    return carta.level < LEVEL_MAXIMO_CARTA && carta.amostras >= obterAmostrasNecessarias(carta);
}

function calcularPassiva(passivaBase, level) {
    return passivaBase * (2 ** (Math.max(level, 1) - 1));
}

function obterValorPassivaCarta(carta) {
    return calcularPassiva(carta.passivaBase, carta.level);
}

function obterValorBonusMultiplicadorClique(carta) {
    return calcularPassiva(carta.bonusMultiplicadorCliqueBase || 0, carta.level);
}

function adicionarCartaAoInventario(cartaNova) {
    const cartasSalvas = carregarCartasSalvas();
    const cartaExistente = cartasSalvas.find((carta) => carta.nome === cartaNova.nome);

    if (cartaExistente) {
        cartaExistente.amostras += 1;
    } else {
        cartasSalvas.push(criarCartaParaInventario(cartaNova));
    }

    salvarCartas(cartasSalvas);
    return cartasSalvas.find((carta) => carta.nome === cartaNova.nome);
}

function subirNivelCarta(nomeCarta) {
    const cartasSalvas = carregarCartasSalvas();
    const carta = cartasSalvas.find((item) => item.nome === nomeCarta);

    if (!carta || !cartaPodeSubirNivel(carta)) {
        return null;
    }

    carta.amostras -= obterAmostrasNecessarias(carta);
    carta.level += 1;
    salvarCartas(cartasSalvas);
    recalcularBonusCartas();
    atualizarProgressoMissoesMapa(true);
    mostrarCartas();

    return carta;
}

function formatarPorcentagem(valor) {
    return `${Math.round(valor * 100)}%`;
}

function obterDescricaoEfeito(cartaOuRaridade) {
    const carta = typeof cartaOuRaridade === "string"
        ? criarCartaParaInventario({ ...obterCartaBasePorRaridade(cartaOuRaridade), raridade: cartaOuRaridade })
        : criarCartaParaInventario(cartaOuRaridade);
    const valorPassiva = formatarNumero(obterValorPassivaCarta(carta));
    const valorMultiplicador = obterValorBonusMultiplicadorClique(carta);

    if (carta.passivaTipo === "clique") {
        return `${obterNomeRaridade(carta.raridade)}: +${valorPassiva} DNA por clique.`;
    }

    if (valorMultiplicador > 0) {
        return `${obterNomeRaridade(carta.raridade)}: +${valorPassiva} DNA por segundo e +${formatarPorcentagem(valorMultiplicador)} no clique.`;
    }

    if (carta.passivaTipo === "segundo") {
        return `${obterNomeRaridade(carta.raridade)}: +${valorPassiva} DNA por segundo.`;
    }

    return "Sem efeito.";
}

function obterClasseRaridade(raridade) {
    if (raridade === "comum") return "raridade-comum";
    if (raridade === "raro") return "raridade-raro";
    if (raridade === "epico") return "raridade-epico";
    if (raridade === "lendario") return "raridade-lendario";
    return "";
}

function obterNomeRaridade(raridade) {
    if (raridade === "todos") return "Todas";
    if (raridade === "comum") return "Comum";
    if (raridade === "raro") return "Raro";
    if (raridade === "epico") return "Epico";
    if (raridade === "lendario") return "Lendario";
    return raridade;
}

function criarEstadoOperacoesPadrao() {
    return {
        concluidas: [],
        coletadas: [],
        resultados: {},
        cooldowns: {},
        emAndamento: {},
        ferimentos: {}
    };
}

function obterOperacaoPorId(idOperacao) {
    return OPERACOES_MAPA.find((operacao) => operacao.id === idOperacao);
}

function obterAgora() {
    return Date.now();
}

function limparTemposExpiradosOperacoes() {
    const agora = obterAgora();

    Object.entries(estadoOperacoes.cooldowns).forEach(([idOperacao, terminaEm]) => {
        if (Number(terminaEm) <= agora) {
            delete estadoOperacoes.cooldowns[idOperacao];
        }
    });

    Object.entries(estadoOperacoes.ferimentos).forEach(([nomeCarta, terminaEm]) => {
        if (Number(terminaEm) <= agora) {
            delete estadoOperacoes.ferimentos[nomeCarta];
        }
    });
}

function carregarEstadoOperacoesMapa() {
    const estadoSalvo = JSON.parse(localStorage.getItem(STORAGE_KEYS.operacoesMapa));
    const padrao = criarEstadoOperacoesPadrao();

    if (!estadoSalvo) {
        estadoOperacoes = padrao;
        salvarEstadoOperacoesMapa();
        return;
    }

    estadoOperacoes = {
        concluidas: Array.isArray(estadoSalvo.concluidas) ? estadoSalvo.concluidas : [],
        coletadas: Array.isArray(estadoSalvo.coletadas) ? estadoSalvo.coletadas : [],
        resultados: estadoSalvo.resultados && typeof estadoSalvo.resultados === "object" ? estadoSalvo.resultados : {},
        cooldowns: estadoSalvo.cooldowns && typeof estadoSalvo.cooldowns === "object" ? estadoSalvo.cooldowns : {},
        emAndamento: estadoSalvo.emAndamento && typeof estadoSalvo.emAndamento === "object" ? estadoSalvo.emAndamento : {},
        ferimentos: estadoSalvo.ferimentos && typeof estadoSalvo.ferimentos === "object" ? estadoSalvo.ferimentos : {}
    };

    resolverOperacoesExpiradas();
    limparTemposExpiradosOperacoes();
    salvarEstadoOperacoesMapa();
}

function salvarEstadoOperacoesMapa() {
    localStorage.setItem(STORAGE_KEYS.operacoesMapa, JSON.stringify(estadoOperacoes));
}

function cartaEstaEmOperacao(nomeCarta) {
    return Object.values(estadoOperacoes.emAndamento).some((operacaoEmAndamento) => (
        Array.isArray(operacaoEmAndamento.cartas) && operacaoEmAndamento.cartas.includes(nomeCarta)
    ));
}

function cartaEstaFerida(nomeCarta) {
    limparTemposExpiradosOperacoes();
    return Boolean(estadoOperacoes.ferimentos[nomeCarta]);
}

function cartaPodeSerDespachada(carta) {
    return !cartaEstaEmOperacao(carta.nome) && !cartaEstaFerida(carta.nome);
}

function obterStatusCartaOperacao(carta) {
    if (cartaEstaEmOperacao(carta.nome)) {
        return "Em operacao";
    }

    if (cartaEstaFerida(carta.nome)) {
        return "Ferido";
    }

    return "";
}

function obterTempoRestanteMs(terminaEm) {
    return Math.max(0, Number(terminaEm) - obterAgora());
}

function obterPorcentagemRestanteOperacao(operacao, andamento) {
    const duracao = Math.max(1, Number(operacao.duracao) || Number(andamento.terminaEm) - Number(andamento.inicioEm) || 1);
    const restante = obterTempoRestanteMs(andamento.terminaEm);

    return Math.max(0, Math.min(100, (restante / duracao) * 100));
}

function formatarTempoCurto(ms) {
    const segundosTotais = Math.ceil(ms / 1000);
    const minutos = Math.floor(segundosTotais / 60);
    const segundos = segundosTotais % 60;

    if (minutos <= 0) {
        return `${segundos}s`;
    }

    return `${minutos}m ${String(segundos).padStart(2, "0")}s`;
}

function packEstaDesbloqueado(index) {
    return Boolean(packsDesbloqueados[index]);
}

function desbloquearPack(index) {
    if (packEstaDesbloqueado(index)) {
        return false;
    }

    packsDesbloqueados[index] = true;
    salvarPacksDesbloqueados();
    atualizarInterfacePack();
    return true;
}

function obterIconeRaridade(raridade) {
    if (raridade === "comum") return "C";
    if (raridade === "raro") return "R";
    if (raridade === "epico") return "E";
    if (raridade === "lendario") return "L";
    return "?";
}

function recalcularBonusCartas() {
    const cartasSalvas = carregarCartasSalvas();

    bonusMultiplicadorClique = 0;
    dnaPorClique = 1;
    dnaPorSegundo = 0;

    cartasSalvas.filter(cartaPodeSerDespachada).forEach((carta) => {
        const valorPassiva = obterValorPassivaCarta(carta);

        if (carta.passivaTipo === "clique") {
            dnaPorClique += valorPassiva;
        }

        if (carta.passivaTipo === "segundo") {
            dnaPorSegundo += valorPassiva;
        }

        bonusMultiplicadorClique += obterValorBonusMultiplicadorClique(carta);
    });

    atualizarInterfaceBonus();
}

function iniciarGanhoPassivo() {
    setInterval(() => {
        if (dnaPorSegundo <= 0) {
            return;
        }

        dna += dnaPorSegundo;
        atualizarDNA();
        salvarDNA();
    }, 1000);
}

function criarParticulaClique(evento, ganhoNoClique) {
    const container = document.querySelector(".esquerda");

    if (!container) {
        return;
    }

    const particula = document.createElement("div");
    const rect = container.getBoundingClientRect();
    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;

    particula.innerText = `+${formatarNumero(ganhoNoClique)}`;
    particula.classList.add("particula");
    particula.style.left = `${x + (Math.random() * 10 - 5)}px`;
    particula.style.top = `${y + (Math.random() * 10 - 5)}px`;
    particula.style.fontSize = `${Math.random() * 8 + 14}px`;

    container.appendChild(particula);
    setTimeout(() => particula.remove(), 1000);
}

function iniciarHelix() {
    const helix = document.getElementById("helix");

    if (!helix) {
        return;
    }

    helix.addEventListener("click", (evento) => {
        const ganhoNoClique = dnaPorClique * (1 + bonusMultiplicadorClique);

        dna += ganhoNoClique;
        atualizarDNA();
        salvarDNA();
        criarParticulaClique(evento, ganhoNoClique);
    });
}

function obterRaridadeMaxima(chances) {
    let maior = "comum";

    chances.forEach((item) => {
        if (RARIDADE_ORDEM.indexOf(item.raridade) > RARIDADE_ORDEM.indexOf(maior)) {
            maior = item.raridade;
        }
    });

    return maior;
}

function sortearRaridade(chances) {
    const total = chances.reduce((soma, item) => soma + item.chance, 0);
    const sorteio = Math.random() * total;
    let acumulado = 0;

    for (let i = 0; i < chances.length; i += 1) {
        acumulado += chances[i].chance;

        if (sorteio < acumulado) {
            return chances[i].raridade;
        }
    }

    return chances[chances.length - 1].raridade;
}

function atualizarInterfacePack() {
    if (!estaNaPagina("pagina-loja")) {
        return;
    }

    const packAtual = PACKS_LOJA[packSelecionadoIndex];
    const nomePack = document.getElementById("nome-pack");
    const precoPack = document.getElementById("preco-pack");
    const imagemPack = document.getElementById("pack");
    const tabelaBody = document.getElementById("tabelaChancesBody");
    const resumoPack = document.getElementById("resumo-pack");
    const packDesbloqueado = packEstaDesbloqueado(packSelecionadoIndex);

    if (nomePack) nomePack.innerText = packAtual.nome;
    if (precoPack) {
        precoPack.innerText = packDesbloqueado
            ? `Custo: ${formatarNumero(packAtual.custo)} DNA`
            : "Bloqueado";
    }

    if (imagemPack) {
        imagemPack.src = packAtual.imagem;
        imagemPack.alt = packAtual.nome;
        imagemPack.classList.toggle("pack-bloqueado", !packDesbloqueado);
    }

    if (resumoPack) {
        if (packDesbloqueado) {
            const raridadeMaxima = obterRaridadeMaxima(packAtual.chances);
            const nomeRaridade = obterNomeRaridade(raridadeMaxima);

            resumoPack.className = `resumo-pack ${obterClasseRaridade(raridadeMaxima)}`;
            resumoPack.innerText = `${packAtual.nome} | Melhor raridade: ${nomeRaridade}`;
        } else {
            resumoPack.className = "resumo-pack";
            resumoPack.innerText = "Pack bloqueado. O desbloqueio sera conectado ao novo mapa futuramente.";
        }
    }

    if (tabelaBody) {
        tabelaBody.innerHTML = "";

        if (!packDesbloqueado) {
            const trBloqueado = document.createElement("tr");
            trBloqueado.innerHTML = `
                <td colspan="3">Este pack ainda esta bloqueado.</td>
            `;
            tabelaBody.appendChild(trBloqueado);
            return;
        }

        packAtual.chances.forEach((item) => {
            const tr = document.createElement("tr");
            tr.classList.add(obterClasseRaridade(item.raridade));
            tr.innerHTML = `
                <td>${obterNomeRaridade(item.raridade)}</td>
                <td>${item.chance}%</td>
                <td>${obterDescricaoEfeito(item.raridade).replace(/^[^:]+:\s*/, "")}</td>
            `;
            tabelaBody.appendChild(tr);
        });
    }
}

function mudarPack(direcao) {
    packSelecionadoIndex += direcao;

    if (packSelecionadoIndex < 0) {
        packSelecionadoIndex = PACKS_LOJA.length - 1;
    }

    if (packSelecionadoIndex >= PACKS_LOJA.length) {
        packSelecionadoIndex = 0;
    }

    atualizarInterfacePack();
}

function obterCartaAleatoriaPorRaridade(raridade) {
    const filtradas = CARTAS_DISPONIVEIS.filter((carta) => carta.raridade === raridade);

    if (filtradas.length === 0) {
        return null;
    }

    const indice = Math.floor(Math.random() * filtradas.length);
    return filtradas[indice];
}

function mostrarCartaAberta(carta) {
    const area = document.querySelector(".pagina-loja .cartas-area");

    if (!area) {
        return;
    }

    area.innerHTML = `
        <div class="carta-revelada ${obterClasseRaridade(carta.raridade)}">
            <img class="carta" src="${carta.imagem}" alt="${carta.nome}">
            <p class="resultado-pack">${carta.nome} - ${obterNomeRaridade(carta.raridade)} - Lv.${carta.level}</p>
            <p class="resultado-efeito">${obterDescricaoEfeito(carta)}</p>
        </div>
    `;
}

function abrirPack() {
    const packAtual = PACKS_LOJA[packSelecionadoIndex];
    const raridade = sortearRaridade(packAtual.chances);
    const carta = obterCartaAleatoriaPorRaridade(raridade);

    if (!carta) {
        alert("Nenhuma carta encontrada para essa raridade.");
        return;
    }

    const cartaAtualizada = adicionarCartaAoInventario(carta);

    recalcularBonusCartas();
    mostrarCartaAberta(cartaAtualizada);
}

function aumentarPrecoPackAtual() {
    const packAtual = PACKS_LOJA[packSelecionadoIndex];
    packAtual.custo = obterCustoPackDentroDoLimite(packAtual, packAtual.custo * 1.1);
    salvarPrecosPacks();
}

function iniciarPack() {
    const pack = document.getElementById("pack");
    const setaEsquerda = document.getElementById("setaPackEsquerda");
    const setaDireita = document.getElementById("setaPackDireita");

    if (setaEsquerda) {
        setaEsquerda.addEventListener("click", () => mudarPack(-1));
    }

    if (setaDireita) {
        setaDireita.addEventListener("click", () => mudarPack(1));
    }

    if (!pack) {
        return;
    }

    pack.addEventListener("click", () => {
        const packAtual = PACKS_LOJA[packSelecionadoIndex];
        const custo = packAtual.custo;

        if (!packEstaDesbloqueado(packSelecionadoIndex)) {
            alert("Esse pack ainda esta bloqueado.");
            return;
        }

        if (dna < custo) {
            alert("DNA insuficiente!");
            return;
        }

        dna -= custo;
        atualizarDNA();
        salvarDNA();

        pack.classList.add("aberto");
        abrirPack();
        aumentarPrecoPackAtual();
        atualizarInterfacePack();

        setTimeout(() => {
            pack.classList.remove("aberto");
        }, 500);
    });
}

function obterTextoProgressoAmostras(carta) {
    if (carta.level >= LEVEL_MAXIMO_CARTA) {
        return "Level maximo";
    }

    return `${carta.amostras} / ${obterAmostrasNecessarias(carta)} amostras`;
}

function obterPorcentagemProgressoAmostras(carta) {
    if (carta.level >= LEVEL_MAXIMO_CARTA) {
        return 100;
    }

    return Math.min((carta.amostras / obterAmostrasNecessarias(carta)) * 100, 100);
}

function fecharModalCarta() {
    const modal = document.getElementById("modalCarta");

    if (modal) {
        modal.remove();
    }
}

function gerarRadarChart(stats) {
    const labels = ["Combate", "Força", "Vigor", "Inteligência", "Agilidade"];
    const emojis = ["⚔️", "💪", "❤️", "🧠", "⚡"];
    const chaves = ["combate", "forca", "vigor", "inteligencia", "agilidade"];
    const numPontos = labels.length;
    const raio = 35; // Reduzi um pouco para dar espaço aos emojis
    const centro = 50;
    const pontos = [];

    // Normalização visual: garante que o gráfico nunca colapse
    for (let i = 0; i < numPontos; i += 1) {
        const valorReal = (stats[chaves[i]] || 0) / 20;
        const valorVisual = 0.15 + (valorReal * 0.85); // Mínimo de 15% do raio
        const angulo = (Math.PI * 2 * i) / numPontos - Math.PI / 2;
        const x = centro + raio * valorVisual * Math.cos(angulo);
        const y = centro + raio * valorVisual * Math.sin(angulo);
        pontos.push(`${x},${y}`);
    }

    const d = pontos.join(" ");

    // Grid de fundo
    let gridHtml = "";
    for (let j = 1; j <= 4; j += 1) {
        const r = (raio / 4) * j;
        const pontosGrid = [];
        for (let i = 0; i < numPontos; i += 1) {
            const angulo = (Math.PI * 2 * i) / numPontos - Math.PI / 2;
            const x = centro + r * Math.cos(angulo);
            const y = centro + r * Math.sin(angulo);
            pontosGrid.push(`${x},${y}`);
        }
        gridHtml += `<polygon points="${pontosGrid.join(" ")}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />`;
    }

    // Eixos e Emojis
    let eixosHtml = "";
    let emojisHtml = "";
    for (let i = 0; i < numPontos; i += 1) {
        const angulo = (Math.PI * 2 * i) / numPontos - Math.PI / 2;
        const xEixo = centro + raio * Math.cos(angulo);
        const yEixo = centro + raio * Math.sin(angulo);
        
        eixosHtml += `<line x1="${centro}" y1="${centro}" x2="${xEixo}" y2="${yEixo}" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />`;
        
        const margemEmoji = 8;
        const xEmoji = centro + (raio + margemEmoji) * Math.cos(angulo);
        const yEmoji = centro + (raio + margemEmoji) * Math.sin(angulo);
        
        emojisHtml += `
            <text x="${xEmoji}" y="${yEmoji}" 
                  text-anchor="middle" 
                  dominant-baseline="central" 
                  style="font-size: 6px; fill: rgba(255,255,255,0.7);">
                ${emojis[i]}
            </text>`;
    }

    return `
        <svg viewBox="0 0 100 100" class="radar-chart">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            ${gridHtml}
            ${eixosHtml}
            <polygon points="${d}" class="radar-polygon" filter="url(#glow)" />
            ${pontos.map((p) => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="1" class="radar-point" />`).join("")}
            ${emojisHtml}
        </svg>
    `;
}

function abrirModalCarta(carta) {
    fecharModalCarta();

    const modal = document.createElement("div");
    const conteudo = document.createElement("div");
    const botaoFechar = document.createElement("button");
    const carta3d = document.createElement("div");
    const brilho = document.createElement("div");
    const imagem = document.createElement("img");
    const nome = document.createElement("h2");
    const raridade = document.createElement("span");
    const level = document.createElement("p");
    const descricao = document.createElement("p");
    const progresso = document.createElement("div");
    const barra = document.createElement("div");
    const textoProgresso = document.createElement("p");
    const statusOperacao = obterStatusCartaOperacao(carta);

    // Nova seção de stats
    const statsContainer = document.createElement("div");
    statsContainer.className = "modal-stats-container";

    const radarContainer = document.createElement("div");
    radarContainer.className = "radar-container";
    radarContainer.innerHTML = gerarRadarChart(carta.stats);

    const statsLista = document.createElement("div");
    statsLista.className = "stats-lista";

    const labelsStats = {
        combate: "Combate",
        forca: "Força",
        vigor: "Vigor",
        inteligencia: "Inteligência",
        agilidade: "Agilidade"
    };

    Object.entries(carta.stats).forEach(([chave, valor]) => {
            const item = document.createElement("div");
            item.className = "stat-item";
            const porcentagem = (valor / 20) * 100;
            item.innerHTML = `
                <span class="stat-label">${labelsStats[chave] || chave}</span>
                <div class="stat-barra-bg">
                    <div class="stat-barra-fill" style="width: ${porcentagem}%"></div>
                </div>
                <span class="stat-valor">${valor}</span>
            `;
            statsLista.appendChild(item);
        });

    statsContainer.appendChild(radarContainer);
    statsContainer.appendChild(statsLista);

    const botaoUpgrade = document.createElement("button");
    const botaoCurar = document.createElement("button");

    modal.id = "modalCarta";
    modal.className = "modal-carta";
    conteudo.className = `modal-carta-conteudo ${obterClasseRaridade(carta.raridade)}`;
    botaoFechar.className = "modal-carta-fechar";
    carta3d.className = "modal-carta-3d";
    brilho.className = "modal-carta-brilho";
    imagem.className = "modal-carta-imagem";
    raridade.className = "raridade-chip";
    level.className = "modal-carta-level";
    descricao.className = "modal-carta-passiva";
    progresso.className = "modal-carta-progresso";
    barra.className = "modal-carta-progresso-barra";
    textoProgresso.className = "modal-carta-progresso-texto";
    botaoUpgrade.className = "modal-carta-upgrade";
    botaoCurar.className = "modal-carta-curar";

    botaoFechar.type = "button";
    botaoFechar.setAttribute("aria-label", "Fechar detalhes da carta");
    botaoFechar.innerText = "X";
    imagem.src = carta.imagem;
    imagem.alt = carta.nome;
    imagem.draggable = false;
    carta3d.style.setProperty("--carta-mask", `url("${carta.imagem}")`);
    nome.innerText = carta.nome;
    raridade.innerText = obterNomeRaridade(carta.raridade);
    level.innerText = `Lv.${carta.level}`;
    descricao.innerText = obterDescricaoEfeito(carta);
    barra.style.width = `${obterPorcentagemProgressoAmostras(carta)}%`;
    textoProgresso.innerText = obterTextoProgressoAmostras(carta);
    botaoUpgrade.type = "button";
    botaoUpgrade.innerText = carta.level >= LEVEL_MAXIMO_CARTA ? "Level maximo" : "Subir nivel";
    botaoUpgrade.disabled = !cartaPodeSubirNivel(carta) || !cartaPodeSerDespachada(carta);
    botaoCurar.type = "button";
    botaoCurar.innerText = "Curar agora - 75 DNA";

    carta3d.appendChild(imagem);
    carta3d.appendChild(brilho);
    progresso.appendChild(barra);
    conteudo.appendChild(botaoFechar);
    conteudo.appendChild(carta3d);
    conteudo.appendChild(nome);
    conteudo.appendChild(raridade);
    conteudo.appendChild(level);
    if (statusOperacao) {
        const statusCarta = document.createElement("p");
        statusCarta.className = "modal-carta-status-operacao";
        statusCarta.innerText = cartaEstaFerida(carta.nome)
            ? `Ferido: recupera em ${formatarTempoCurto(obterTempoRestanteMs(estadoOperacoes.ferimentos[carta.nome]))}`
            : "Em operacao: temporariamente fora da colecao ativa";
        conteudo.appendChild(statusCarta);
    }
    conteudo.appendChild(descricao);

    // Inserir os stats antes do progresso de amostras
    conteudo.appendChild(statsContainer);

    conteudo.appendChild(progresso);
    conteudo.appendChild(textoProgresso);
    conteudo.appendChild(botaoUpgrade);
    if (cartaEstaFerida(carta.nome)) {
        conteudo.appendChild(botaoCurar);
    }
    modal.appendChild(conteudo);
    document.body.appendChild(modal);

    botaoFechar.addEventListener("click", fecharModalCarta);
    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) {
            fecharModalCarta();
        }
    });

    botaoUpgrade.addEventListener("click", () => {
        const cartaAtualizada = subirNivelCarta(carta.nome);

        if (cartaAtualizada) {
            abrirModalCarta(cartaAtualizada);
        }
    });

    botaoCurar.addEventListener("click", () => {
        curarCartaFerida(carta.nome);
    });

    inicializarEfeito3DModalCarta(carta3d, brilho);
}

function inicializarEfeito3DModalCarta(cartaElemento, brilhoElemento) {
    cartaElemento.addEventListener("mousemove", (evento) => {
        const rect = cartaElemento.getBoundingClientRect();
        const x = evento.clientX - rect.left;
        const y = evento.clientY - rect.top;
        const centroX = rect.width / 3;
        const centroY = rect.height / 3;
        const rotateY = ((x - centroX) / centroX) * 15;
        const rotateX = ((centroY - y) / centroY) * 15;

        cartaElemento.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
        brilhoElemento.style.opacity = "1";
        brilhoElemento.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.07) 34%, transparent 68%)`;
    });

    cartaElemento.addEventListener("mouseleave", () => {
        cartaElemento.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        brilhoElemento.style.opacity = "0";
    });
}

function criarCardInventario(carta) {
    const container = document.createElement("div");
    const img = document.createElement("img");
    const level = document.createElement("span");
    const indicadorUpgrade = document.createElement("span");
    const tooltip = document.createElement("div");
    const nome = document.createElement("p");
    const raridade = document.createElement("span");
    const statusOperacao = obterStatusCartaOperacao(carta);
    const podeDespachar = cartaPodeSerDespachada(carta);

    container.classList.add("carta-container");
    container.classList.add(obterClasseRaridade(carta.raridade));
    container.classList.toggle("carta-indisponivel", !podeDespachar);
    container.setAttribute("role", "button");
    container.setAttribute("tabindex", "0");
    container.setAttribute("aria-label", `Abrir detalhes da carta ${carta.nome}`);
    container.draggable = podeDespachar;
    container.dataset.cartaNome = carta.nome;

    img.src = carta.imagem;
    img.alt = carta.nome;

    nome.innerText = carta.nome;
    nome.classList.add("nome-carta");

    raridade.innerText = obterNomeRaridade(carta.raridade);
    raridade.classList.add("raridade-chip");

    level.innerText = `Lv.${carta.level}`;
    level.classList.add("quantidade");
    level.classList.add("level-carta");

    indicadorUpgrade.innerText = "!";
    indicadorUpgrade.classList.add("indicador-upgrade");
    indicadorUpgrade.title = "Pronta para subir de nivel";

    tooltip.classList.add("tooltip-carta");
    tooltip.innerText = `${carta.nome} - Lv.${carta.level}\n${obterDescricaoEfeito(carta)}\n${obterTextoProgressoAmostras(carta)}${statusOperacao ? `\nStatus: ${statusOperacao}` : ""}`;

    container.addEventListener("click", () => abrirModalCarta(carta));
    container.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            abrirModalCarta(carta);
        }
    });

    container.addEventListener("dragstart", (evento) => {
        if (!podeDespachar) {
            evento.preventDefault();
            return;
        }

        evento.dataTransfer.setData("text/plain", carta.nome);
        evento.dataTransfer.effectAllowed = "move";
        container.classList.add("carta-arrastando");
    });

    container.addEventListener("dragend", () => {
        container.classList.remove("carta-arrastando");
    });

    container.appendChild(img);
    container.appendChild(nome);
    container.appendChild(raridade);
    container.appendChild(level);
    if (cartaPodeSubirNivel(carta)) {
        container.appendChild(indicadorUpgrade);
    }
    if (statusOperacao) {
        const status = document.createElement("span");
        status.className = "status-carta-operacao";
        status.innerText = statusOperacao;
        container.appendChild(status);
    }
    container.appendChild(tooltip);

    return container;
}

function inicializarFiltroInventario() {
    if (!estaNaPagina("pagina-index")) {
        return;
    }

    const selectFiltro = document.getElementById("filtroRaridade");

    if (!selectFiltro) {
        return;
    }

    selectFiltro.value = filtroRaridadeAtual;
    selectFiltro.addEventListener("change", () => {
        filtroRaridadeAtual = selectFiltro.value;
        mostrarCartas();
    });
}

function mostrarCartas() {
    if (!estaNaPagina("pagina-index")) {
        return;
    }

    const area = document.querySelector(".direita .cartas-area");

    if (!area) {
        return;
    }

    const cartasSalvas = carregarCartasSalvas().filter((carta) => !cartaEstaEmOperacao(carta.nome));
    area.innerHTML = "";

    if (cartasSalvas.length === 0) {
        area.innerHTML = '<p class="inventario-vazio">Nenhuma carta ainda. Abra packs na loja para montar sua colecao.</p>';
        return;
    }

    const raridadesVisiveis = filtroRaridadeAtual === "todos"
        ? RARIDADE_ORDEM_INVENTARIO
        : [filtroRaridadeAtual];

    let quantidadeExibida = 0;

    raridadesVisiveis.forEach((raridade) => {
        const cartasDaRaridade = cartasSalvas.filter((carta) => carta.raridade === raridade);

        if (!cartasDaRaridade || cartasDaRaridade.length === 0) {
            return;
        }

        cartasDaRaridade.forEach((carta) => {
            area.appendChild(criarCardInventario(carta));
            quantidadeExibida += 1;
        });
    });

    if (quantidadeExibida === 0) {
        area.innerHTML = `<p class="inventario-vazio">Nenhuma carta da raridade ${obterNomeRaridade(filtroRaridadeAtual)} no inventario.</p>`;
    }
}

function inicializarAtalhosModalCarta() {
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            fecharModalCarta();
            fecharModalMissao();
        }
    });
}

// Estado compartilhado pelos eventos de drag e zoom do mapa.
const estadoMapaInterativo = {
    arrastando: false,
    inicioMouseX: 0,
    inicioMouseY: 0,
    inicioMapaX: 0,
    inicioMapaY: 0,
    mapaX: 0,
    mapaY: 0,
    escala: 0.72,
    escalaMinima: 0.5,
    escalaMinimaBase: 0.5,
    escalaMaxima: 2
};

const MAPA_BASE_LARGURA = 806;
const MAPA_BASE_ALTURA = 1024;
const MAPA_VIEWBOX_AREAS = `0 0 ${MAPA_BASE_LARGURA} ${MAPA_BASE_ALTURA}`;

// Poligonos da nevoa de guerra. Para liberar uma area, altere "liberada" ou use liberarAreaMapa("area-2").
const AREAS_MAPA = [
    {
        id: "area-5",
        liberada: false,
        caminho: "M0 2 H270 C286 6 293 16 303 56 C388 52 425 66 466 127 V331 L586 337 L615 345 L634 401 L693 425 L732 503 C745 518 770 523 806 528 V605 H593 C568 601 557 595 539 581 L454 498 L413 453 L365 432 H248 C232 432 225 401 180 377 H0 Z"
    },
    {
        id: "area-6",
        liberada: false,
        caminho: "M276 0 H806 V528 C790 528 775 524 770 523 C745 518 732 503 693 425 C672 414 648 406 634 401 L615 345 L463 330 V126 L432 95 L384 60 L298 55 Z"
    },
    {
        id: "area-4",
        liberada: false,
        caminho: "M0 377 H180 C225 401 232 432 248 432 H365 L413 453 L309 560 V632 H197 L136 600 H0 Z"
    },
    {
        id: "area-3",
        liberada: false,
        caminho: "M0 600 H136 L197 632 H309 V745 H178 V911 L142 1024 H0 Z"
    },
    {
        id: "area-2",
        liberada: false,
        caminho: "M413 453 L454 502 V1024 H142 L178 911 V745 H309 V632 L309 560 Z"
    },
    {
        id: "area-1",
        liberada: true,
        caminho: "M806 605 H593 C568 601 557 595 539 581 L454 498 V1024 H806 Z"
    }
];

const TIPOS_MISSAO = {
    principal: {
        nome: "Missao Principal",
        simbolo: "",
        classe: "missao-principal"
    },
    operacao: {
        nome: "Missao de Operacao",
        simbolo: "!",
        classe: "missao-operacao"
    },
    boss: {
        nome: "Missao Boss",
        simbolo: "!",
        classe: "missao-operacao missao-boss"
    }
};

// posX e posY usam o mesmo sistema de coordenadas do MAPA_VIEWBOX_AREAS.
const MISSOES = [
    {
        id: "missao-01",
        nome: "Pé Direito",
        descricao: "Precisamos aumentar a equipe e aprimorar os membros para futuras operacões. Suba o nivel de 2 comuns.",
        recompensa: "Leitor Tático de Operações.",
        concluida: false,
        desbloqueada: true,
        recompensaAplicada: false,
        posX: 640,
        posY: 690,
        tipo: "principal"
    },
    {
        id: "missao-02",
        nome: "Campo de Testes",
        descricao: "O leitor tatico revelou focos de risco pela cidade. Conclua 3 missoes de operacao para validar os protocolos de campo e abrir uma nova rota de suprimentos.",
        recompensa: "Desbloqueia Area 2 do mapa",
        concluida: false,
        desbloqueada: false,
        recompensaAplicada: false,
        posX: 735,
        posY: 730,
        tipo: "principal"
    },
    {
        id: "missao-03",
        nome: "Novos Horizontes",
        descricao: "Brian Irons notou a nossa organização e ofereceu um acordo: acesso a equipe de taticas especiais em troca de um serviço 'confidencial'. Conclua Operação Irons.",
        recompensa: "Pacote Ouro",
        concluida: false,
        desbloqueada: false,
        recompensaAplicada: false,
        posX: 370,
        posY: 895,
        tipo: "principal"
    }
];

const OPERACOES_MAPA = [
    {
        id: "resgate_universidade",
        nome: "Resgate na Universidade",
        descricao: "Houve um ataque bioterrista na universidade local. Sobreviventes estão sobre local instavel e precisam de extração urgente.",
        posicao: { x: 530, y: 980 },
        duracao: 35000,
        recompensa: 120,
        requisitos: { forca: 3, agilidade: 3 },
        maxEquipe: 2,
        cooldownFalha: 120000,
        tempoFerimento: 180000
    },
    {
        id: "limpeza_substacao",
        nome: "Limpeza na Substação",
        descricao: "Uma infestação de aracnideos tomou conta do local, o ar esta contaminado e a eletricidade instavel. A equipe deve eliminar a ameaça e estabilizar o ambiente.",
        posicao: { x: 520, y: 870 },
        duracao: 40000,
        recompensa: 180,
        requisitos: { combate: 3, vigor: 3 },
        maxEquipe: 2,
        cooldownFalha: 150000,
        tempoFerimento: 210000
    },
    {
        id: "Contaminacao_no_rio",
        nome: "Contaminação no Rio",
        descricao: "Um virus contaminou o rio que abastece a cidade. A equipe deve coletar amostras, identificar o agente patogeno e conter a propagação.",
        posicao: { x: 650, y: 850 },
        duracao: 40000,
        recompensa: 90,
        requisitos: { inteligencia: 3, vigor: 3, agilidade: 1 },
        maxEquipe: 2,
        cooldownFalha: 90000,
        tempoFerimento: 120000
    },
    {
        id: "irons",
        nome: "Operação Irons",
        descricao: "Recupere os suprimentos confidenciais da policia, temos liberdade para eliminar qualquer inimigo possivel na área",
        areaRequerida: "area-2",
        posicao: { x: 190, y: 1000 },
        duracao: 50000,
        recompensa: 90,
        requisitos: { combate: 5, inteligencia: 3, vigor: 2, agilidade: 4},
        maxEquipe: 3,
        cooldownFalha: 90000,
        tempoFerimento: 120000
    },
    {
        id: "boss-01",
        nome: "B.O.W Detectado - Peçonhenta",
        tipo: "boss",
        descricao: "Uma criatura mutante foi detectada nas profundezas da área contaminada. Ela se move silenciosamente entre os destroços, atacando com precisão letal e espalhando toxinas pelo ambiente. Equipes enviadas anteriormente não retornaram.",
        areaRequerida: "area-1",
        posicao: { x: 780, y: 980 },
        duracao: 60000,
        recompensa: 90000,
        requisitos: { combate: 9, forca: 7, vigor: 8, agilidade: 5, inteligencia: 3 },
        maxEquipe: 3,
        cooldownFalha: 120000,
        tempoFerimento: 180000
    }
];

function atualizarTransformacaoMapa(mapa, estado) {
    mapa.style.transform = `translate(${estado.mapaX}px, ${estado.mapaY}px) scale(${estado.escala})`;
}

function limitarMapa(wrapper, mapa, estado) {
    const larguraWrapper = wrapper.clientWidth;
    const alturaWrapper = wrapper.clientHeight;
    const larguraMapa = mapa.offsetWidth * estado.escala;
    const alturaMapa = mapa.offsetHeight * estado.escala;

    if (larguraMapa <= larguraWrapper) {
        estado.mapaX = (larguraWrapper - larguraMapa) / 2;
    } else {
        estado.mapaX = Math.min(0, Math.max(larguraWrapper - larguraMapa, estado.mapaX));
    }

    if (alturaMapa <= alturaWrapper) {
        estado.mapaY = (alturaWrapper - alturaMapa) / 2;
    } else {
        estado.mapaY = Math.min(0, Math.max(alturaWrapper - alturaMapa, estado.mapaY));
    }
}

function atualizarEscalaMinimaMapa(wrapper, mapa, estado) {
    const escalaParaCobrirLargura = wrapper.clientWidth / mapa.offsetWidth;
    const escalaParaCobrirAltura = wrapper.clientHeight / mapa.offsetHeight;

    estado.escalaMinima = Math.max(
        estado.escalaMinimaBase,
        escalaParaCobrirLargura,
        escalaParaCobrirAltura
    );

    estado.escala = Math.max(estado.escala, estado.escalaMinima);
}

function iniciarDrag(evento, wrapper, estado) {
    evento.preventDefault();

    estado.arrastando = true;
    estado.inicioMouseX = evento.clientX;
    estado.inicioMouseY = evento.clientY;
    estado.inicioMapaX = estado.mapaX;
    estado.inicioMapaY = estado.mapaY;

    wrapper.classList.add("arrastando");
}

function moverMapa(evento, wrapper, mapa, estado) {
    if (!estado.arrastando) {
        return;
    }

    const distanciaX = evento.clientX - estado.inicioMouseX;
    const distanciaY = evento.clientY - estado.inicioMouseY;

    estado.mapaX = estado.inicioMapaX + distanciaX;
    estado.mapaY = estado.inicioMapaY + distanciaY;

    limitarMapa(wrapper, mapa, estado);
    atualizarTransformacaoMapa(mapa, estado);
}

function finalizarDrag(wrapper, estado) {
    estado.arrastando = false;
    wrapper.classList.remove("arrastando");
}

function aplicarZoom(evento, wrapper, mapa, estado) {
    evento.preventDefault();

    const escalaAnterior = estado.escala;
    const fatorZoom = Math.exp(-evento.deltaY * 0.001);
    const proximaEscala = escalaAnterior * fatorZoom;

    estado.escala = Math.min(estado.escalaMaxima, Math.max(estado.escalaMinima, proximaEscala));

    const rect = wrapper.getBoundingClientRect();
    const mouseX = evento.clientX - rect.left;
    const mouseY = evento.clientY - rect.top;

    // Mantem o ponto sob o cursor parado enquanto a escala muda.
    const pontoMapaX = (mouseX - estado.mapaX) / escalaAnterior;
    const pontoMapaY = (mouseY - estado.mapaY) / escalaAnterior;

    estado.mapaX = mouseX - pontoMapaX * estado.escala;
    estado.mapaY = mouseY - pontoMapaY * estado.escala;

    limitarMapa(wrapper, mapa, estado);
    atualizarTransformacaoMapa(mapa, estado);
}

function centralizarMapa(wrapper, mapa, estado) {
    atualizarEscalaMinimaMapa(wrapper, mapa, estado);
    estado.escala = estado.escalaMinima;

    estado.mapaX = (wrapper.clientWidth - mapa.offsetWidth * estado.escala) / 2;
    estado.mapaY = (wrapper.clientHeight - mapa.offsetHeight * estado.escala) / 2;

    limitarMapa(wrapper, mapa, estado);
    atualizarTransformacaoMapa(mapa, estado);
}

function criarElementoSvg(tipo, atributos) {
    const elemento = document.createElementNS("http://www.w3.org/2000/svg", tipo);

    Object.entries(atributos).forEach(([atributo, valor]) => {
        elemento.setAttribute(atributo, valor);
    });

    return elemento;
}

function criarSobreposicaoAreas(mapa) {
    const sobreposicaoExistente = mapa.querySelector(".mapa-sobreposicao");

    if (sobreposicaoExistente) {
        sobreposicaoExistente.remove();
    }

    const svg = criarElementoSvg("svg", {
        class: "mapa-sobreposicao",
        viewBox: MAPA_VIEWBOX_AREAS,
        preserveAspectRatio: "none",
        "aria-hidden": "true"
    });

    AREAS_MAPA.forEach((area) => {
        const classeEstado = area.liberada ? "area-liberada" : "area-bloqueada";
        const caminho = criarElementoSvg("path", {
            d: area.caminho,
            class: `mapa-area-fog ${classeEstado}`,
            "data-area-id": area.id
        });

        svg.appendChild(caminho);
    });

    mapa.appendChild(svg);
}

function obterQuantidadeComunsNoNivelMinimo(levelMinimo) {
    return carregarCartasSalvas().filter((carta) => (
        carta.raridade === "comum" && carta.level >= levelMinimo
    )).length;
}

function obterMissaoPorId(idMissao) {
    return MISSOES.find((missao) => missao.id === idMissao);
}

function areaMapaLiberada(areaId) {
    const area = AREAS_MAPA.find((item) => item.id === areaId);
    return Boolean(area && area.liberada);
}

function leitorTaticoOperacoesDesbloqueado() {
    const missao01 = obterMissaoPorId("missao-01");

    return Boolean(missao01 && missao01.concluida && missao01.recompensaAplicada);
}

function obterQuantidadeOperacoesFinalizadas() {
    return new Set([
        ...estadoOperacoes.concluidas,
        ...estadoOperacoes.coletadas,
        ...Object.keys(estadoOperacoes.resultados)
    ]).size;
}

function operacaoFoiFinalizada(idOperacao) {
    return estadoOperacoes.concluidas.includes(idOperacao)
        || estadoOperacoes.coletadas.includes(idOperacao)
        || Boolean(estadoOperacoes.resultados[idOperacao]);
}

function operacaoEstaDesbloqueadaNoMapa(operacao) {
    return !operacao.areaRequerida || areaMapaLiberada(operacao.areaRequerida);
}

function requisitoMissaoCompleto(idMissao) {
    if (idMissao === "missao-01") {
        return obterQuantidadeComunsNoNivelMinimo(2) >= 2;
    }

    if (idMissao === "missao-02") {
        return obterQuantidadeOperacoesFinalizadas() >= 3;
    }

    if (idMissao === "missao-03") {
        return operacaoFoiFinalizada("irons");
    }

    return false;
}

function carregarEstadoMissoesMapa() {
    const estadoSalvo = JSON.parse(localStorage.getItem(STORAGE_KEYS.missoesMapa));

    if (!estadoSalvo) {
        return;
    }

    MISSOES.forEach((missao) => {
        const estadoMissao = estadoSalvo[missao.id];

        if (!estadoMissao) {
            return;
        }

        missao.concluida = Boolean(estadoMissao.concluida);
        missao.desbloqueada = missao.desbloqueada || Boolean(estadoMissao.desbloqueada);
        missao.recompensaAplicada = Boolean(estadoMissao.recompensaAplicada);
    });
}

function salvarEstadoMissoesMapa() {
    const estadoAtual = {};

    MISSOES.forEach((missao) => {
        estadoAtual[missao.id] = {
            concluida: missao.concluida,
            desbloqueada: missao.desbloqueada,
            recompensaAplicada: missao.recompensaAplicada
        };
    });

    localStorage.setItem(STORAGE_KEYS.missoesMapa, JSON.stringify(estadoAtual));
}

function aplicarRecompensaMissao(missao, notificar = true) {
    if (missao.recompensaAplicada) {
        return;
    }

    if (missao.id === "missao-01") {
        // A recompensa e o desbloqueio do sistema de operacoes no mapa.
    }

    if (missao.id === "missao-02") {
        liberarAreaMapa("area-2");
    }

    if (missao.id === "missao-03") {
        desbloquearPack(1);
    }

    missao.recompensaAplicada = true;

    if (notificar) {
        mostrarAvisoMissaoConcluida(missao);
    }
}

function concluirMissaoPrincipal(missao, notificar = true) {
    if (!missao || missao.concluida || !missao.desbloqueada || !requisitoMissaoCompleto(missao.id)) {
        return false;
    }

    missao.concluida = true;
    aplicarRecompensaMissao(missao, notificar);
    atualizarProgressoMissoesMapa(false);
    return true;
}

function atualizarProgressoMissoesMapa(notificar = false) {
    const missao01 = obterMissaoPorId("missao-01");
    const missao02 = obterMissaoPorId("missao-02");
    const missao03 = obterMissaoPorId("missao-03");

    if (missao01) {
        missao01.requisitoCompleto = requisitoMissaoCompleto(missao01.id);

        if (missao01.concluida && !missao01.recompensaAplicada) {
            aplicarRecompensaMissao(missao01, notificar);
        }
    }

    if (missao02) {
        missao02.desbloqueada = Boolean(missao01 && missao01.concluida);
        missao02.requisitoCompleto = missao02.desbloqueada && requisitoMissaoCompleto(missao02.id);

        if (missao02.concluida && !missao02.recompensaAplicada) {
            aplicarRecompensaMissao(missao02, notificar);
        }

        if (missao02.concluida && missao02.recompensaAplicada) {
            liberarAreaMapa("area-2");
        }
    }

    if (missao03) {
        missao03.desbloqueada = Boolean(missao02 && missao02.concluida);
        missao03.requisitoCompleto = missao03.desbloqueada && requisitoMissaoCompleto(missao03.id);

        if (missao03.concluida && !missao03.recompensaAplicada) {
            aplicarRecompensaMissao(missao03, notificar);
        }
    }

    salvarEstadoMissoesMapa();

    const mapa = document.getElementById("conteudoMapa");

    if (mapa) {
        renderizarMissoesNoMapa(mapa);
    }
}

function fecharModalMissao() {
    const modal = document.getElementById("modalMissao");

    if (modal) {
        modal.remove();
    }
}

function operacaoEstaConcluida(operacao) {
    return estadoOperacoes.concluidas.includes(operacao.id);
}

function operacaoFoiColetada(operacao) {
    return estadoOperacoes.coletadas.includes(operacao.id);
}

function obterResultadoOperacaoConcluida(operacao) {
    return estadoOperacoes.resultados[operacao.id] || null;
}

function operacaoEmCooldown(operacao) {
    limparTemposExpiradosOperacoes();
    return Boolean(estadoOperacoes.cooldowns[operacao.id]);
}

function operacaoEmAndamento(operacao) {
    return estadoOperacoes.emAndamento[operacao.id] || null;
}

function operacaoEstaDisponivel(operacao) {
    return !operacaoEstaConcluida(operacao) && !operacaoEmCooldown(operacao) && !operacaoEmAndamento(operacao);
}

function obterCartasDisponiveisOperacao() {
    return carregarCartasSalvas().filter(cartaPodeSerDespachada);
}

const LABELS_STATS_OPERACAO = {
    combate: "Combate",
    forca: "Forca",
    vigor: "Vigor",
    inteligencia: "Inteligencia",
    agilidade: "Agilidade"
};

const CHAVES_STATS_OPERACAO = ["combate", "forca", "vigor", "inteligencia", "agilidade"];

function normalizarOperacoesAntigasComPesos() {
    OPERACOES_MAPA.forEach((operacao) => {
        if (operacao.requisitos || !operacao.pesos) {
            return;
        }

        operacao.requisitos = Object.entries(operacao.pesos).reduce((requisitos, [stat, peso]) => {
            requisitos[stat] = Math.max(0, Math.round(Number(peso) * 20));
            return requisitos;
        }, {});
    });
}

function obterCartasPorNomes(nomesCartas) {
    const cartasSalvas = carregarCartasSalvas();

    return (nomesCartas || [])
        .map((nomeCarta) => cartasSalvas.find((carta) => carta.nome === nomeCarta))
        .filter(Boolean);
}

function calcularStatsEquipe(cartasEquipe) {
    return cartasEquipe.reduce((statsEquipe, carta) => {
        CHAVES_STATS_OPERACAO.forEach((stat) => {
            const bonusLevel = 1 + ((Number(carta.level) || 1) - 1) * 0.14;
            statsEquipe[stat] += Math.round((carta.stats?.[stat] || 0) * bonusLevel);
        });

        return statsEquipe;
    }, { combate: 0, forca: 0, vigor: 0, inteligencia: 0, agilidade: 0 });
}

function calcularStatsRequisitosOperacao(operacao) {
    return CHAVES_STATS_OPERACAO.reduce((stats, stat) => {
        stats[stat] = Number(operacao.requisitos?.[stat]) || 0;
        return stats;
    }, { combate: 0, forca: 0, vigor: 0, inteligencia: 0, agilidade: 0 });
}

function obterStatsPrioritariosOperacao(operacao) {
    const requisitos = calcularStatsRequisitosOperacao(operacao);

    return Object.entries(requisitos)
        .filter(([, valor]) => valor > 0)
        .sort(([, valorA], [, valorB]) => valorB - valorA)
        .slice(0, 2)
        .map(([stat]) => stat);
}

function calcularChanceOperacao(operacao, cartasEquipe) {
    if (!cartasEquipe.length) {
        return 0;
    }

    const statsEquipe = calcularStatsEquipe(cartasEquipe);
    const requisitos = calcularStatsRequisitosOperacao(operacao);
    const requisitosAtivos = Object.entries(requisitos).filter(([, valor]) => valor > 0);

    if (!requisitosAtivos.length) {
        return 0.5;
    }

    const progressoMedio = requisitosAtivos.reduce((total, [stat, requisito]) => {
        return total + Math.min((statsEquipe[stat] || 0) / requisito, 1);
    }, 0) / requisitosAtivos.length;
    const bonusExcedente = requisitosAtivos.reduce((total, [stat, requisito]) => {
        return total + Math.max((statsEquipe[stat] || 0) - requisito, 0);
    }, 0);

    return Math.max(0.08, Math.min(0.95, 0.08 + progressoMedio * 0.78 + Math.min(bonusExcedente * 0.015, 0.09)));
}

function formatarChanceOperacao(chance) {
    return `${Math.round(chance * 100)}%`;
}

function obterLeituraQualitativaOperacao(chance) {
    if (chance >= 0.72) return "Leitura favoravel";
    if (chance >= 0.48) return "Leitura instavel";
    return "Leitura critica";
}

function criarDescricaoOperacaoComDicas(operacao) {
    const descricao = document.createElement("p");
    const prioridades = obterStatsPrioritariosOperacao(operacao);
    const textoPrioridades = prioridades.map((stat) => `<strong>${LABELS_STATS_OPERACAO[stat]}</strong>`).join(" e ");
    let textoDescricao = operacao.descricao;

    prioridades.forEach((stat) => {
        const label = LABELS_STATS_OPERACAO[stat];
        const regex = new RegExp(`\\b(${label}|${stat})\\b`, "gi");
        textoDescricao = textoDescricao.replace(regex, "<strong>$1</strong>");
    });

    descricao.innerHTML = `${textoDescricao} <span class="operacao-dica-stats">Leitura tática: ${textoPrioridades} parecem decisivos.</span>`;
    return descricao;
}

function calcularPontosRadar(stats, escalaMaxima) {
    const raio = 35;
    const centro = 50;
    const limite = Math.max(1, escalaMaxima);

    return CHAVES_STATS_OPERACAO.map((chave, indice) => {
        const valorVisual = Math.min((stats[chave] || 0) / limite, 1);
        const angulo = (Math.PI * 2 * indice) / CHAVES_STATS_OPERACAO.length - Math.PI / 2;
        const x = centro + raio * valorVisual * Math.cos(angulo);
        const y = centro + raio * valorVisual * Math.sin(angulo);

        return { x, y };
    });
}

function formatarPontosRadar(pontos) {
    return pontos.map((ponto) => `${ponto.x},${ponto.y}`).join(" ");
}

function atualizarPoligonoRadar(poligono, stats, escalaMaxima) {
    poligono.setAttribute("points", formatarPontosRadar(calcularPontosRadar(stats, escalaMaxima)));
}

function gerarRadarOperacao(statsEquipe, opcoes = {}) {
    const labels = ["Combate", "Forca", "Vigor", "Inteligencia", "Agilidade"];
    const raio = 35;
    const centro = 50;
    const statsRequisito = opcoes.statsRequisito || null;
    const revelarRequisito = Boolean(opcoes.revelarRequisito);
    const maiorValor = Math.max(
        10,
        ...CHAVES_STATS_OPERACAO.map((chave) => statsEquipe[chave] || 0),
        ...(statsRequisito ? CHAVES_STATS_OPERACAO.map((chave) => statsRequisito[chave] || 0) : [])
    );
    const pontosEquipe = calcularPontosRadar(statsEquipe, maiorValor);
    const pontosRequisito = statsRequisito ? calcularPontosRadar(statsRequisito, maiorValor) : [];

    const gridHtml = [0.25, 0.5, 0.75, 1].map((escala) => {
        const pontosGrid = CHAVES_STATS_OPERACAO.map((_, indice) => {
            const angulo = (Math.PI * 2 * indice) / CHAVES_STATS_OPERACAO.length - Math.PI / 2;
            const x = centro + raio * escala * Math.cos(angulo);
            const y = centro + raio * escala * Math.sin(angulo);

            return `${x},${y}`;
        });

        return `<polygon points="${pontosGrid.join(" ")}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />`;
    }).join("");

    const labelsHtml = CHAVES_STATS_OPERACAO.map((chave, indice) => {
        const angulo = (Math.PI * 2 * indice) / CHAVES_STATS_OPERACAO.length - Math.PI / 2;
        const x = centro + (raio + 11) * Math.cos(angulo);
        const y = centro + (raio + 11) * Math.sin(angulo);

        return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${labels[indice]}</text>`;
    }).join("");

    return `
        <svg viewBox="0 0 100 100" class="radar-chart radar-equipe-chart">
            ${gridHtml}
            ${revelarRequisito ? `<polygon points="${formatarPontosRadar(pontosRequisito)}" class="radar-polygon radar-requisito" />` : ""}
            <polygon points="${formatarPontosRadar(pontosEquipe)}" class="radar-polygon radar-equipe-poligono" />
            ${pontosEquipe.map((ponto) => `<circle cx="${ponto.x}" cy="${ponto.y}" r="1.2" class="radar-point" />`).join("")}
            ${labelsHtml}
        </svg>
    `;
}

function criarPainelStatsEquipeOperacao(operacao, cartasEquipe) {
    const painel = document.createElement("div");
    const radarContainer = document.createElement("div");
    const resumo = document.createElement("div");
    const listaStats = document.createElement("div");
    const chance = calcularChanceOperacao(operacao, cartasEquipe);
    const statsEquipe = calcularStatsEquipe(cartasEquipe);
    const maiorStatVisual = Math.max(8, ...CHAVES_STATS_OPERACAO.map((stat) => statsEquipe[stat] || 0));

    painel.className = "operacao-stats-equipe";
    radarContainer.className = "radar-container operacao-radar-container";
    resumo.className = "operacao-analise-equipe";
    listaStats.className = "operacao-stats-barras";
    radarContainer.innerHTML = gerarRadarOperacao(statsEquipe);

    resumo.innerHTML = `
        <div class="operacao-leitura-box">
            <span>Analise da equipe</span>
            <strong>${obterLeituraQualitativaOperacao(chance)}</strong>
        </div>
    `;

    CHAVES_STATS_OPERACAO.forEach((stat) => {
        const item = document.createElement("div");
        const valor = statsEquipe[stat] || 0;
        const porcentagem = Math.min((valor / maiorStatVisual) * 100, 100);

        item.className = "operacao-stat-barra";
        item.innerHTML = `
            <span class="operacao-stat-nome">${LABELS_STATS_OPERACAO[stat]}</span>
            <div class="operacao-stat-trilho">
                <div class="operacao-stat-preenchimento" style="width: ${porcentagem}%"></div>
            </div>
            <strong>${valor}</strong>
        `;
        listaStats.appendChild(item);
    });

    resumo.appendChild(listaStats);

    painel.appendChild(radarContainer);
    painel.appendChild(resumo);

    return painel;
}

function sortearResultadoOperacao(operacao, cartasEquipe) {
    const chance = calcularChanceOperacao(operacao, cartasEquipe);
    const sucesso = Math.random() <= chance;

    if (!sucesso) {
        return "falha";
    }

    return Math.random() <= 0.12 + chance * 0.12 ? "critico" : "sucesso";
}

function aplicarResultadoOperacao(operacao, resultado, cartasNomes, notificar = true, momentoResultado = obterAgora()) {
    delete estadoOperacoes.emAndamento[operacao.id];
    let recompensaRecebida = 0;

    if (resultado === "sucesso" || resultado === "critico") {
        const recompensa = resultado === "critico" ? Math.round(operacao.recompensa * 1.5) : operacao.recompensa;
        recompensaRecebida = recompensa;

        if (!estadoOperacoes.concluidas.includes(operacao.id)) {
            estadoOperacoes.concluidas.push(operacao.id);
            dna += recompensa;
            salvarDNA();
            atualizarDNA();
        }

        estadoOperacoes.resultados[operacao.id] = {
            resultado,
            cartas: cartasNomes,
            recompensaRecebida,
            concluidaEm: momentoResultado,
            requisitos: calcularStatsRequisitosOperacao(operacao)
        };
    } else {
        estadoOperacoes.cooldowns[operacao.id] = momentoResultado + operacao.cooldownFalha;
        cartasNomes.forEach((nomeCarta) => {
            estadoOperacoes.ferimentos[nomeCarta] = momentoResultado + operacao.tempoFerimento;
        });
    }

    limparTemposExpiradosOperacoes();
    salvarEstadoOperacoesMapa();
    recalcularBonusCartas();
    mostrarCartas();
    atualizarProgressoMissoesMapa(notificar);

    if (notificar) {
        if (resultado === "sucesso" || resultado === "critico") {
            mostrarAvisoOperacao("Operacao concluida", `${operacao.nome} marcou um relatorio no mapa.`);
        } else {
            revelarResultadoOperacao(operacao, resultado, cartasNomes, recompensaRecebida);
        }
    }
}

function abrirResumoOperacaoConcluida(operacao) {
    const resultadoSalvo = obterResultadoOperacaoConcluida(operacao);

    if (!resultadoSalvo) {
        revelarResultadoOperacao(operacao, "sucesso", [], 0);
        removerOperacaoConcluidaDoMapa(operacao.id);
        return;
    }

    revelarResultadoOperacao(
        operacao,
        resultadoSalvo.resultado,
        resultadoSalvo.cartas || [],
        Number(resultadoSalvo.recompensaRecebida) || 0
    );
    removerOperacaoConcluidaDoMapa(operacao.id);
}

function removerOperacaoConcluidaDoMapa(idOperacao) {
    estadoOperacoes.concluidas = estadoOperacoes.concluidas.filter((id) => id !== idOperacao);
    if (!estadoOperacoes.coletadas.includes(idOperacao)) {
        estadoOperacoes.coletadas.push(idOperacao);
    }
    delete estadoOperacoes.resultados[idOperacao];
    salvarEstadoOperacoesMapa();
    atualizarProgressoMissoesMapa();
}

function revelarResultadoOperacao(operacao, resultado, cartasNomes, recompensaRecebida) {
    const cartasEquipe = obterCartasPorNomes(cartasNomes);
    const statsEquipe = calcularStatsEquipe(cartasEquipe);
    const statsRequisito = calcularStatsRequisitosOperacao(operacao);
    const modal = document.createElement("div");
    const conteudo = document.createElement("div");
    const botaoFechar = document.createElement("button");
    const etiqueta = document.createElement("span");
    const titulo = document.createElement("h2");
    const resumo = document.createElement("p");
    const radarWrap = document.createElement("div");
    const legenda = document.createElement("div");
    const cartas = document.createElement("div");
    const recompensa = document.createElement("div");
    const sucesso = resultado === "sucesso" || resultado === "critico";

    fecharModalMissao();

    modal.id = "modalMissao";
    modal.className = "modal-missao";
    conteudo.className = `modal-missao-conteudo modal-operacao-conteudo operacao-resultado ${sucesso ? "resultado-sucesso" : "resultado-falha"}`;
    botaoFechar.className = "modal-missao-fechar";
    etiqueta.className = "modal-missao-tipo tipo-operacao";
    radarWrap.className = "operacao-radar-revelacao";
    legenda.className = "operacao-radar-legenda";
    cartas.className = "operacao-cartas-enviadas";
    recompensa.className = "operacao-resultado-recompensa";

    botaoFechar.type = "button";
    botaoFechar.setAttribute("aria-label", "Fechar resultado da operacao");
    botaoFechar.innerText = "X";
    etiqueta.innerText = "Relatorio pos-operacao";
    titulo.innerText = sucesso ? "Operacao concluida" : "Operacao comprometida";
    resumo.innerText = sucesso
        ? "A assinatura da equipe superou a pressao do setor. Requisitos taticos revelados."
        : "A equipe ficou abaixo da assinatura exigida. Requisitos taticos revelados para reavaliacao.";
    radarWrap.innerHTML = gerarRadarOperacao(statsEquipe, {
        statsRequisito,
        revelarRequisito: true
    });
    legenda.innerHTML = `
        <span><i class="legenda-equipe"></i>Equipe enviada</span>
        <span><i class="legenda-requisito"></i>Pressao da operacao</span>
    `;
    cartas.innerHTML = cartasEquipe.map((carta) => `
        <div class="operacao-carta-enviada ${obterClasseRaridade(carta.raridade)}">
            <img src="${carta.imagem}" alt="${carta.nome}">
            <span>${carta.nome} Lv.${carta.level}</span>
        </div>
    `).join("");
    recompensa.innerText = sucesso
        ? `Recompensa obtida: ${formatarNumero(recompensaRecebida)} DNA`
        : "Equipe ferida. Operacao em cooldown.";

    conteudo.appendChild(botaoFechar);
    conteudo.appendChild(etiqueta);
    conteudo.appendChild(titulo);
    conteudo.appendChild(resumo);
    conteudo.appendChild(radarWrap);
    conteudo.appendChild(legenda);
    conteudo.appendChild(cartas);
    conteudo.appendChild(recompensa);
    modal.appendChild(conteudo);
    document.body.appendChild(modal);

    requestAnimationFrame(() => {
        conteudo.classList.add("resultado-revelado");
    });

    botaoFechar.addEventListener("click", fecharModalMissao);
    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) {
            fecharModalMissao();
        }
    });
}

function resolverOperacoesExpiradas() {
    Object.entries(estadoOperacoes.emAndamento).forEach(([idOperacao, dados]) => {
        const operacao = obterOperacaoPorId(idOperacao);

        if (operacao && Number(dados.terminaEm) <= obterAgora()) {
            aplicarResultadoOperacao(operacao, dados.resultado, dados.cartas || [], false, Number(dados.terminaEm));
        }
    });
}

function agendarOperacoesEmAndamento() {
    Object.entries(estadoOperacoes.emAndamento).forEach(([idOperacao, dados]) => {
        const operacao = obterOperacaoPorId(idOperacao);

        if (!operacao) {
            return;
        }

        const tempoRestante = obterTempoRestanteMs(dados.terminaEm);

        window.setTimeout(() => {
            aplicarResultadoOperacao(operacao, dados.resultado, dados.cartas || []);
            fecharModalMissao();
        }, tempoRestante);
    });
}

function iniciarMonitorOperacoes() {
    window.setInterval(() => {
        const estadoAnterior = JSON.stringify({
            cooldowns: estadoOperacoes.cooldowns,
            ferimentos: estadoOperacoes.ferimentos
        });

        limparTemposExpiradosOperacoes();

        if (estadoAnterior !== JSON.stringify({
            cooldowns: estadoOperacoes.cooldowns,
            ferimentos: estadoOperacoes.ferimentos
        })) {
            salvarEstadoOperacoesMapa();
            recalcularBonusCartas();
            mostrarCartas();

            const mapa = document.getElementById("conteudoMapa");
            if (mapa) {
                renderizarMissoesNoMapa(mapa);
            }
        }

        atualizarIndicadoresOperacoesMapa();
    }, 1000);
}

function mostrarAvisoOperacao(tituloTexto, mensagemTexto) {
    const container = garantirContainerAvisos();
    const aviso = document.createElement("div");
    const icone = document.createElement("div");
    const conteudo = document.createElement("div");
    const titulo = document.createElement("strong");
    const mensagem = document.createElement("p");

    aviso.className = "aviso-desbloqueio aviso-operacao";
    icone.className = "aviso-icone aviso-icone-operacao";
    conteudo.className = "aviso-conteudo";
    titulo.className = "aviso-titulo";
    mensagem.className = "aviso-mensagem";

    icone.innerText = "";
    titulo.innerText = tituloTexto;
    mensagem.innerText = mensagemTexto;

    conteudo.appendChild(titulo);
    conteudo.appendChild(mensagem);
    aviso.appendChild(icone);
    aviso.appendChild(conteudo);
    container.appendChild(aviso);

    requestAnimationFrame(() => aviso.classList.add("visivel"));
    setTimeout(() => aviso.classList.add("saindo"), 3600);
    setTimeout(() => aviso.remove(), 4300);
}

function curarCartaFerida(nomeCarta) {
    const custoCura = 75;

    if (!cartaEstaFerida(nomeCarta)) {
        return;
    }

    if (dna < custoCura) {
        alert("DNA insuficiente para curar esta carta.");
        return;
    }

    dna -= custoCura;
    delete estadoOperacoes.ferimentos[nomeCarta];
    salvarDNA();
    salvarEstadoOperacoesMapa();
    atualizarDNA();
    recalcularBonusCartas();
    mostrarCartas();
    fecharModalCarta();
    mostrarAvisoOperacao("Carta recuperada", `${nomeCarta} voltou para a equipe ativa.`);
}

function criarMiniCartaOperacao(carta) {
    const card = document.createElement("div");
    const imagem = document.createElement("img");
    const nome = document.createElement("span");

    card.className = `operacao-mini-carta ${obterClasseRaridade(carta.raridade)}`;
    card.draggable = true;
    card.dataset.cartaNome = carta.nome;
    imagem.src = carta.imagem;
    imagem.alt = carta.nome;
    nome.innerText = `${carta.nome} Lv.${carta.level}`;

    card.appendChild(imagem);
    card.appendChild(nome);
    card.addEventListener("dragstart", (evento) => {
        evento.dataTransfer.setData("text/plain", carta.nome);
        evento.dataTransfer.effectAllowed = "move";
        card.classList.add("carta-arrastando");
    });
    card.addEventListener("dragend", () => card.classList.remove("carta-arrastando"));

    return card;
}

function criarMarcadorOperacao(operacao) {
    const tipo = TIPOS_MISSAO[operacao.tipo] || TIPOS_MISSAO.operacao;
    const marcador = document.createElement("button");
    const icone = document.createElement("span");
    const andamento = operacaoEmAndamento(operacao);
    const concluida = operacaoEstaConcluida(operacao);

    marcador.type = "button";
    marcador.className = `marcador-missao ${tipo.classe}`;
    marcador.classList.toggle("missao-bloqueada", operacaoEmCooldown(operacao));
    marcador.classList.toggle("missao-em-andamento", Boolean(andamento));
    marcador.classList.toggle("missao-concluida", concluida);
    marcador.style.left = `${(operacao.posicao.x / MAPA_BASE_LARGURA) * 100}%`;
    marcador.style.top = `${(operacao.posicao.y / MAPA_BASE_ALTURA) * 100}%`;
    marcador.setAttribute("aria-label", concluida ? `Abrir relatorio de ${operacao.nome}` : `Abrir ${operacao.nome}`);
    marcador.dataset.operacaoId = operacao.id;

    if (andamento) {
        const tempoRestante = obterTempoRestanteMs(andamento.terminaEm);

        marcador.style.setProperty("--operacao-restante", `${obterPorcentagemRestanteOperacao(operacao, andamento)}%`);
        marcador.title = `${operacao.nome}: ${formatarTempoCurto(tempoRestante)} restantes`;
        marcador.setAttribute("aria-label", `${operacao.nome} em andamento, ${formatarTempoCurto(tempoRestante)} restantes`);
    }

    icone.className = "marcador-missao-icone";
    icone.innerText = concluida ? "✓" : tipo.simbolo;
    marcador.appendChild(icone);
    marcador.addEventListener("click", () => {
        if (concluida) {
            abrirResumoOperacaoConcluida(operacao);
            return;
        }

        abrirModalOperacao(operacao);
    });

    return marcador;
}

function atualizarIndicadoresOperacoesMapa() {
    document.querySelectorAll(".marcador-missao.missao-operacao.missao-em-andamento").forEach((marcador) => {
        const operacao = obterOperacaoPorId(marcador.dataset.operacaoId);
        const andamento = operacao ? operacaoEmAndamento(operacao) : null;

        if (!operacao || !andamento) {
            return;
        }

        const tempoRestante = obterTempoRestanteMs(andamento.terminaEm);

        marcador.style.setProperty("--operacao-restante", `${obterPorcentagemRestanteOperacao(operacao, andamento)}%`);
        marcador.title = `${operacao.nome}: ${formatarTempoCurto(tempoRestante)} restantes`;
        marcador.setAttribute("aria-label", `${operacao.nome} em andamento, ${formatarTempoCurto(tempoRestante)} restantes`);
    });
}

function abrirModalOperacao(operacao) {
    const tipo = TIPOS_MISSAO[operacao.tipo] || TIPOS_MISSAO.operacao;
    const cartasSelecionadas = [];
    const andamento = operacaoEmAndamento(operacao);
    const cooldown = estadoOperacoes.cooldowns[operacao.id];

    fecharModalMissao();

    const modal = document.createElement("div");
    const conteudo = document.createElement("div");
    const botaoFechar = document.createElement("button");
    const topo = document.createElement("div");
    const topoTexto = document.createElement("div");
    const meta = document.createElement("div");
    const corpo = document.createElement("div");
    const painelAnalise = document.createElement("section");
    const painelEquipe = document.createElement("section");
    const tituloAnalise = document.createElement("h3");
    const tituloEquipe = document.createElement("h3");
    const tipoElemento = document.createElement("span");
    const status = document.createElement("span");
    const titulo = document.createElement("h2");
    const descricao = criarDescricaoOperacaoComDicas(operacao);
    const recompensaBox = document.createElement("div");
    const recompensaLabel = document.createElement("span");
    const recompensaValor = document.createElement("strong");
    const statsEquipeContainer = document.createElement("div");
    const slots = document.createElement("div");
    const listaCartas = document.createElement("div");
    const andamentoBox = document.createElement("div");
    const feedback = document.createElement("p");
    const botaoDespachar = document.createElement("button");
    const dispatch = document.createElement("div");

    modal.id = "modalMissao";
    modal.className = "modal-missao";
    conteudo.className = "modal-missao-conteudo modal-operacao-conteudo";
    botaoFechar.className = "modal-missao-fechar";
    topo.className = "operacao-topo";
    topoTexto.className = "operacao-topo-texto";
    meta.className = "operacao-meta";
    corpo.className = "operacao-corpo";
    painelAnalise.className = "operacao-painel operacao-painel-analise";
    painelEquipe.className = "operacao-painel operacao-painel-equipe";
    tipoElemento.className = "modal-missao-tipo tipo-operacao";
    status.className = "modal-missao-status status-operacao";
    recompensaBox.className = "modal-missao-recompensa operacao-recompensa";
    recompensaLabel.className = "modal-missao-recompensa-label";
    recompensaValor.className = "modal-missao-recompensa-valor";
    statsEquipeContainer.className = "operacao-stats-container";
    slots.className = "operacao-slots";
    listaCartas.className = "operacao-cartas-disponiveis";
    andamentoBox.className = "operacao-andamento-box";
    feedback.className = "operacao-feedback";
    botaoDespachar.className = "operacao-despachar";
    dispatch.className = "operacao-dispatch";

    botaoFechar.type = "button";
    botaoFechar.setAttribute("aria-label", "Fechar operacao");
    botaoFechar.innerText = "X";
    tipoElemento.innerText = tipo.nome;
    titulo.innerText = operacao.nome;
    tituloAnalise.innerText = "Analise da equipe";
    tituloEquipe.innerText = andamento ? "Equipe enviada" : "Sua equipe";
    recompensaLabel.innerText = "Recompensa";
    recompensaValor.innerText = `${formatarNumero(operacao.recompensa)} DNA`;
    botaoDespachar.type = "button";
    botaoDespachar.innerText = "Despachar equipe";

    if (andamento) {
        status.innerText = `Em andamento - ${formatarTempoCurto(obterTempoRestanteMs(andamento.terminaEm))}`;
        botaoDespachar.disabled = true;
    } else if (cooldown) {
        status.innerText = `Bloqueada - ${formatarTempoCurto(obterTempoRestanteMs(cooldown))}`;
        botaoDespachar.disabled = true;
    } else {
        status.innerText = "Disponivel";
    }

    function renderizarStatsEquipe() {
        const cartasEquipe = obterCartasPorNomes(cartasSelecionadas);

        statsEquipeContainer.innerHTML = "";
        statsEquipeContainer.appendChild(criarPainelStatsEquipeOperacao(operacao, cartasEquipe));
    }

    function renderizarAndamento() {
        if (!andamento) {
            return;
        }

        const cartasEnviadas = obterCartasPorNomes(andamento.cartas);
        const chance = typeof andamento.chance === "number"
            ? andamento.chance
            : calcularChanceOperacao(operacao, cartasEnviadas);
        const tempoRestante = formatarTempoCurto(obterTempoRestanteMs(andamento.terminaEm));
        const cartasHtml = cartasEnviadas.map((carta) => `
            <div class="operacao-carta-enviada ${obterClasseRaridade(carta.raridade)}">
                <img src="${carta.imagem}" alt="${carta.nome}">
                <span>${carta.nome} Lv.${carta.level}</span>
            </div>
        `).join("");

        andamentoBox.innerHTML = `
            <div class="operacao-andamento-cabecalho">
                <span>Em andamento</span>
                <strong class="operacao-tempo-restante">${tempoRestante}</strong>
            </div>
            <div class="operacao-andamento-chance">
                <span>Telemetria</span>
                <strong>${obterLeituraQualitativaOperacao(chance)}</strong>
            </div>
        `;
        listaCartas.classList.add("operacao-cartas-enviadas");
        listaCartas.innerHTML = cartasHtml;
        andamentoBox.appendChild(criarPainelStatsEquipeOperacao(operacao, cartasEnviadas));

        const tempoElemento = andamentoBox.querySelector(".operacao-tempo-restante");
        const intervaloTempo = window.setInterval(() => {
            if (!document.body.contains(modal)) {
                window.clearInterval(intervaloTempo);
                return;
            }

            tempoElemento.innerText = formatarTempoCurto(obterTempoRestanteMs(andamento.terminaEm));
        }, 1000);
    }

    function renderizarSlots() {
        slots.innerHTML = "";

        for (let indice = 0; indice < operacao.maxEquipe; indice += 1) {
            const slot = document.createElement("div");
            const nomeCarta = cartasSelecionadas[indice];

            slot.className = "operacao-slot";
            slot.dataset.slotIndex = String(indice);

            if (nomeCarta) {
                const carta = carregarCartasSalvas().find((item) => item.nome === nomeCarta);
                slot.classList.add("ocupado");
                slot.innerHTML = `<img src="${carta.imagem}" alt="${carta.nome}"><span>${carta.nome}</span>`;
                slot.addEventListener("click", () => {
                    cartasSelecionadas.splice(indice, 1);
                    renderizarSlots();
                    renderizarCartasDisponiveis();
                    renderizarStatsEquipe();
                });
            } else {
                slot.innerHTML = '<span class="operacao-slot-plus">+</span><span>Adicionar carta</span>';
            }

            slot.addEventListener("dragover", (evento) => {
                evento.preventDefault();
                slot.classList.add("recebendo");
            });
            slot.addEventListener("dragleave", () => slot.classList.remove("recebendo"));
            slot.addEventListener("drop", (evento) => {
                evento.preventDefault();
                slot.classList.remove("recebendo");
                adicionarCartaNaEquipe(evento.dataTransfer.getData("text/plain"));
            });

            slots.appendChild(slot);
        }

        botaoDespachar.disabled = !operacaoEstaDisponivel(operacao) || cartasSelecionadas.length === 0;
    }

    function renderizarCartasDisponiveis() {
        listaCartas.innerHTML = "";

        obterCartasDisponiveisOperacao()
            .filter((carta) => !cartasSelecionadas.includes(carta.nome))
            .forEach((carta) => listaCartas.appendChild(criarMiniCartaOperacao(carta)));

        if (!listaCartas.children.length) {
            listaCartas.innerHTML = '<span class="operacao-sem-cartas">Nenhuma carta disponivel.</span>';
        }
    }

    function adicionarCartaNaEquipe(nomeCarta) {
        const carta = carregarCartasSalvas().find((item) => item.nome === nomeCarta);

        if (!carta || !cartaPodeSerDespachada(carta) || cartasSelecionadas.includes(nomeCarta)) {
            return;
        }

        if (cartasSelecionadas.length >= operacao.maxEquipe) {
            feedback.innerText = `Equipe limitada a ${operacao.maxEquipe} cartas.`;
            return;
        }

        cartasSelecionadas.push(nomeCarta);
        feedback.innerText = "";
        renderizarSlots();
        renderizarCartasDisponiveis();
        renderizarStatsEquipe();
    }

    function iniciarOperacao() {
        const cartasEquipe = cartasSelecionadas
            .map((nomeCarta) => carregarCartasSalvas().find((carta) => carta.nome === nomeCarta))
            .filter(Boolean);

        if (!cartasEquipe.length || !operacaoEstaDisponivel(operacao)) {
            return;
        }

        const resultado = sortearResultadoOperacao(operacao, cartasEquipe);
        const chance = calcularChanceOperacao(operacao, cartasEquipe);
        estadoOperacoes.emAndamento[operacao.id] = {
            cartas: cartasEquipe.map((carta) => carta.nome),
            inicioEm: obterAgora(),
            terminaEm: obterAgora() + operacao.duracao,
            chance,
            resultado
        };
        salvarEstadoOperacoesMapa();
        recalcularBonusCartas();
        mostrarCartas();
        const mapa = document.getElementById("conteudoMapa");
        if (mapa) {
            renderizarMissoesNoMapa(mapa);
        }
        botaoDespachar.disabled = true;
        window.setTimeout(() => {
            aplicarResultadoOperacao(operacao, resultado, cartasEquipe.map((carta) => carta.nome));
        }, operacao.duracao);
        animarDispatch(conteudo, dispatch, fecharModalMissao);
    }

    recompensaBox.appendChild(recompensaLabel);
    recompensaBox.appendChild(recompensaValor);
    conteudo.appendChild(botaoFechar);
    meta.appendChild(tipoElemento);
    meta.appendChild(status);
    topoTexto.appendChild(meta);
    topoTexto.appendChild(titulo);
    topoTexto.appendChild(descricao);
    topo.appendChild(topoTexto);
    topo.appendChild(recompensaBox);
    conteudo.appendChild(topo);
    if (andamento) {
        painelAnalise.appendChild(tituloAnalise);
        painelAnalise.appendChild(andamentoBox);
        corpo.appendChild(painelAnalise);
    } else {
        painelAnalise.appendChild(tituloAnalise);
        painelAnalise.appendChild(statsEquipeContainer);
        painelEquipe.appendChild(tituloEquipe);
        painelEquipe.appendChild(slots);
        painelEquipe.appendChild(listaCartas);
        corpo.appendChild(painelAnalise);
        corpo.appendChild(painelEquipe);
        conteudo.appendChild(corpo);
        conteudo.appendChild(feedback);
        conteudo.appendChild(botaoDespachar);
        conteudo.appendChild(dispatch);
    }
    if (andamento) {
        painelEquipe.appendChild(tituloEquipe);
        painelEquipe.appendChild(listaCartas);
        corpo.appendChild(painelEquipe);
        conteudo.appendChild(corpo);
    }
    modal.appendChild(conteudo);
    document.body.appendChild(modal);

    if (andamento) {
        renderizarAndamento();
    } else {
        renderizarSlots();
        renderizarCartasDisponiveis();
        renderizarStatsEquipe();
    }

    botaoFechar.addEventListener("click", fecharModalMissao);
    botaoDespachar.addEventListener("click", iniciarOperacao);
    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) {
            fecharModalMissao();
        }
    });
}

function animarDispatch(conteudo, container, aoTerminar) {
    const mensagens = [
        "Conectando com equipe...",
        "Definindo rota...",
        "Enviando agentes...",
        "Executando operacao..."
    ];

    conteudo.classList.add("operacao-em-dispatch");
    container.classList.add("ativo");
    container.innerHTML = "";

    mensagens.forEach((texto, indice) => {
        window.setTimeout(() => {
            const linha = document.createElement("span");
            linha.innerText = texto;
            container.appendChild(linha);

            if (indice === mensagens.length - 1) {
                window.setTimeout(aoTerminar, 650);
            }
        }, indice * 650);
    });
}

function executarAnimacaoDispatch(container, aoTerminar) {
    animarDispatch(container.closest(".modal-operacao-conteudo") || container, container, aoTerminar);
}

function abrirModalMissao(missao) {
    const tipo = TIPOS_MISSAO[missao.tipo];
    const estaBloqueada = !missao.desbloqueada;
    const requisitoCompleto = Boolean(missao.requisitoCompleto || requisitoMissaoCompleto(missao.id));
    const podeConcluir = !estaBloqueada && !missao.concluida && requisitoCompleto;

    fecharModalMissao();

    const modal = document.createElement("div");
    const conteudo = document.createElement("div");
    const botaoFechar = document.createElement("button");
    const tipoElemento = document.createElement("span");
    const status = document.createElement("span");
    const titulo = document.createElement("h2");
    const descricao = document.createElement("p");
    const recompensaBox = document.createElement("div");
    const recompensaLabel = document.createElement("span");
    const recompensaValor = document.createElement("strong");
    const botaoConcluir = document.createElement("button");

    modal.id = "modalMissao";
    modal.className = "modal-missao";
    conteudo.className = `modal-missao-conteudo ${estaBloqueada ? "missao-bloqueada" : ""}`;
    botaoFechar.className = "modal-missao-fechar";
    tipoElemento.className = "modal-missao-tipo";
    status.className = "modal-missao-status";
    recompensaBox.className = "modal-missao-recompensa";
    recompensaLabel.className = "modal-missao-recompensa-label";
    recompensaValor.className = "modal-missao-recompensa-valor";
    botaoConcluir.className = "modal-missao-concluir";

    botaoFechar.type = "button";
    botaoConcluir.type = "button";
    botaoFechar.setAttribute("aria-label", "Fechar missao");
    botaoFechar.innerText = "X";
    tipoElemento.innerText = `${tipo.simbolo} ${tipo.nome}`;
    status.innerText = estaBloqueada
        ? "Bloqueada"
        : missao.concluida ? "Concluida" : requisitoCompleto ? "Pronta para concluir" : "Disponivel";
    titulo.innerText = missao.nome;
    descricao.innerText = estaBloqueada
        ? "O sinal ainda esta fraco. Conclua a missao anterior para revelar este objetivo."
        : missao.descricao;
    recompensaLabel.innerText = "Recompensa";
    recompensaValor.innerText = estaBloqueada ? "???" : missao.recompensa;
    botaoConcluir.innerText = requisitoCompleto ? "Concluir missao" : "Requisito incompleto";
    botaoConcluir.disabled = !podeConcluir;

    conteudo.appendChild(botaoFechar);
    conteudo.appendChild(tipoElemento);
    conteudo.appendChild(status);
    conteudo.appendChild(titulo);
    conteudo.appendChild(descricao);
    recompensaBox.appendChild(recompensaLabel);
    recompensaBox.appendChild(recompensaValor);
    conteudo.appendChild(recompensaBox);

    if (!estaBloqueada && !missao.concluida) {
        conteudo.appendChild(botaoConcluir);
    }

    modal.appendChild(conteudo);
    document.body.appendChild(modal);

    botaoFechar.addEventListener("click", fecharModalMissao);
    botaoConcluir.addEventListener("click", () => {
        if (concluirMissaoPrincipal(missao, true)) {
            fecharModalMissao();
        }
    });
    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) {
            fecharModalMissao();
        }
    });
}

function criarMarcadorMissao(missao) {
    const tipo = TIPOS_MISSAO[missao.tipo];
    const marcador = document.createElement("button");
    const icone = document.createElement("span");

    marcador.type = "button";
    marcador.className = `marcador-missao ${tipo.classe}`;
    marcador.classList.toggle("missao-concluida", missao.concluida);
    marcador.classList.toggle("missao-bloqueada", !missao.desbloqueada);
    marcador.classList.toggle("missao-pronta", missao.desbloqueada && !missao.concluida && Boolean(missao.requisitoCompleto));
    marcador.style.left = `${(missao.posX / MAPA_BASE_LARGURA) * 100}%`;
    marcador.style.top = `${(missao.posY / MAPA_BASE_ALTURA) * 100}%`;
    marcador.setAttribute("aria-label", `Abrir ${missao.nome}`);
    marcador.dataset.missaoId = missao.id;

    icone.className = "marcador-missao-icone";
    icone.innerText = missao.desbloqueada ? tipo.simbolo : "?";
    marcador.appendChild(icone);
    marcador.addEventListener("click", () => abrirModalMissao(missao));

    return marcador;
}

function renderizarMissoesNoMapa(mapa) {
    const camadaExistente = mapa.querySelector(".mapa-missoes");

    if (camadaExistente) {
        camadaExistente.remove();
    }

    const camadaMissoes = document.createElement("div");
    camadaMissoes.className = "mapa-missoes";

    MISSOES
        .filter((missao) => !missao.concluida)
        .forEach((missao) => {
            camadaMissoes.appendChild(criarMarcadorMissao(missao));
        });

    if (leitorTaticoOperacoesDesbloqueado()) {
        OPERACOES_MAPA
            .filter((operacao) => operacaoEstaDesbloqueadaNoMapa(operacao))
            .filter((operacao) => !operacaoFoiColetada(operacao))
            .forEach((operacao) => {
                camadaMissoes.appendChild(criarMarcadorOperacao(operacao));
            });
    }

    mapa.appendChild(camadaMissoes);
}

function atualizarAreaMapa(areaId, liberada) {
    const area = AREAS_MAPA.find((item) => item.id === areaId);
    const mapa = document.getElementById("conteudoMapa");

    if (!area) {
        return;
    }

    area.liberada = liberada;

    if (!mapa) {
        return;
    }

    criarSobreposicaoAreas(mapa);
}

function liberarAreaMapa(areaId) {
    atualizarAreaMapa(areaId, true);
}

function bloquearAreaMapa(areaId) {
    atualizarAreaMapa(areaId, false);
}

function inicializarMapaInterativo() {
    const wrapper = document.querySelector(".mapa-wrapper");
    const mapa = document.getElementById("conteudoMapa");
    const imagemMapa = document.getElementById("mapaInterativo");

    if (!wrapper || !mapa || !imagemMapa) {
        return;
    }

    imagemMapa.addEventListener("dragstart", (evento) => evento.preventDefault());
    wrapper.addEventListener("mousedown", (evento) => iniciarDrag(evento, wrapper, estadoMapaInterativo));
    window.addEventListener("mousemove", (evento) => moverMapa(evento, wrapper, mapa, estadoMapaInterativo));
    window.addEventListener("mouseup", () => finalizarDrag(wrapper, estadoMapaInterativo));
    wrapper.addEventListener("wheel", (evento) => aplicarZoom(evento, wrapper, mapa, estadoMapaInterativo), { passive: false });
    window.addEventListener("resize", () => {
        atualizarEscalaMinimaMapa(wrapper, mapa, estadoMapaInterativo);
        limitarMapa(wrapper, mapa, estadoMapaInterativo);
        atualizarTransformacaoMapa(mapa, estadoMapaInterativo);
    });

    const prepararMapa = () => {
        mapa.style.width = `${imagemMapa.naturalWidth}px`;
        mapa.style.height = `${imagemMapa.naturalHeight}px`;
        criarSobreposicaoAreas(mapa);
        atualizarProgressoMissoesMapa();
        centralizarMapa(wrapper, mapa, estadoMapaInterativo);
    };

    if (imagemMapa.complete) {
        prepararMapa();
    } else {
        imagemMapa.addEventListener("load", prepararMapa, { once: true });
    }
}

function inicializarOrganizacao() {
    const nomeEl = document.getElementById("organizacaoNome");
    const inputEl = document.getElementById("organizacaoInput");

    if (!nomeEl || !inputEl) {
        return;
    }

    const nomeSalvo = localStorage.getItem(STORAGE_KEYS.organizacao) || "Organização Desconhecida";
    nomeEl.innerText = nomeSalvo;
    inputEl.value = nomeSalvo;

    nomeEl.addEventListener("click", () => {
        nomeEl.style.display = "none";
        inputEl.style.display = "block";
        inputEl.focus();
        inputEl.select();
    });

    inputEl.addEventListener("blur", () => {
        salvarOrganizacao();
    });

    inputEl.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            salvarOrganizacao();
        }
    });
}

function salvarOrganizacao() {
    const nomeEl = document.getElementById("organizacaoNome");
    const inputEl = document.getElementById("organizacaoInput");

    if (!nomeEl || !inputEl) {
        return;
    }

    let novoNome = inputEl.value.trim();

    if (novoNome === "") {
        novoNome = "Organização Desconhecida";
    }

    if (novoNome.length > 25) {
        novoNome = novoNome.substring(0, 25);
    }

    localStorage.setItem(STORAGE_KEYS.organizacao, novoNome);

    nomeEl.innerText = novoNome;
    inputEl.value = novoNome;

    nomeEl.style.display = "block";
    inputEl.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    carregarPrecosPacks();
    carregarPacksDesbloqueados();
    carregarEstadoMissoesMapa();
    normalizarOperacoesAntigasComPesos();
    carregarEstadoOperacoesMapa();
    recalcularBonusCartas();
    atualizarDNA();
    atualizarInterfaceBonus();
    iniciarHelix();
    iniciarGanhoPassivo();
    iniciarPack();
    atualizarInterfacePack();
    inicializarAtalhosModalCarta();
    inicializarFiltroInventario();
    inicializarMapaInterativo();
    inicializarOrganizacao();
    agendarOperacoesEmAndamento();
    iniciarMonitorOperacoes();
    mostrarCartas();
});
