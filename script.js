// ==========================================
// VARIAVEIS DE CONTROLE GLOBAL DO CARROSSEL
// ==========================================
let fotosDoDestaqueAtual = [];
let indexStoryAtual = 0;
let indexPostAtual = -1; // Controla qual post do feed está aberto no modal

// ==========================================
// FUNÇÕES DE CONTROLE DO FEED (POSTS)
// ==========================================

function obterTodosOsPosts() {
    // Captura dinamicamente todos os elementos clicáveis do grid de fotos
    return Array.from(document.querySelectorAll('.photo-grid .grid-item'));
}

function abrirPost(imageSrc, captionText) {
    const modal = document.getElementById("postModal");
    const modalImg = document.getElementById("modalImage");
    const modalVideoArea = document.getElementById("modalVideoEmbed");
    const modalCaption = document.getElementById("modalCaption");

    modalVideoArea.innerHTML = "";
    modalImg.style.display = "block"; 

    modal.style.display = "flex";
    modalImg.src = imageSrc;
    modalCaption.textContent = captionText;

    // Atualiza o índice do post ativo baseado na imagem correspondente
    const posts = obterTodosOsPosts();
    indexPostAtual = posts.findIndex(post => {
        const img = post.querySelector('img');
        return img && img.getAttribute('src') === imageSrc;
    });

    atualizarSetasPost();
    atualizarLikesDoGrid();
}

function abrirModalComVideo(videoId, captionText) {
    const modal = document.getElementById("postModal");
    const modalImg = document.getElementById("modalImage");
    const modalVideoArea = document.getElementById("modalVideoEmbed");
    const modalCaption = document.getElementById("modalCaption");

    // 1. Esconde a tag de imagem padrão do modal
    modalImg.style.display = "none"; 
    
    // 2. Injeta o iframe configurado para dar PLAY AUTOMÁTICO e COM SOM apenas aqui dentro
    modalVideoArea.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1" 
            title="Vídeo do Post" 
            frameborder="0" 
            allow="autoplay; encrypted-media" 
            allowfullscreen>
        </iframe>
    `;

    // 3. Define a legenda e mostra o modal na tela
    modalCaption.textContent = captionText;
    modal.style.display = "flex";

    // Atualiza o índice do post ativo baseado no id do vídeo correspondente
    const posts = obterTodosOsPosts();
    indexPostAtual = posts.findIndex(post => {
        return post.getAttribute('onclick') && post.getAttribute('onclick').includes(videoId);
    });

    atualizarSetasPost();
    atualizarLikesDoGrid();
}

function navegarPost(event, direcao) {
    if (event) event.stopPropagation(); // Impede o modal de fechar involuntariamente
    
    const posts = obterTodosOsPosts();
    let novoIndex = indexPostAtual + direcao;

    // Limita a navegação aos limites existentes do array de posts
    if (novoIndex >= 0 && novoIndex < posts.length) {
        indexPostAtual = novoIndex;
        const proximoPostElemento = posts[indexPostAtual];
        
        // Simula o clique no elemento correspondente da grid para re-abrir com os dados certos
        proximoPostElemento.click();
    }
}

function atualizarSetasPost() {
    const setaEsquerda = document.getElementById("postArrowLeft");
    const setaDireita = document.getElementById("postArrowRight");
    const posts = obterTodosOsPosts();

    if (!setaEsquerda || !setaDireita) return;

    // Se for o primeiro post da lista, esconde a seta esquerda
    setaEsquerda.style.display = (indexPostAtual === 0) ? "none" : "flex";

    // Se for o último post da lista, esconde a seta direita
    setaDireita.style.display = (indexPostAtual === posts.length - 1) ? "none" : "flex";
}

function atualizarLikesDoGrid() {
    // Sincroniza dinamicamente o número de curtidas que vem do overlay da foto do grid para o modal
    const posts = obterTodosOsPosts();
    if (indexPostAtual !== -1 && posts[indexPostAtual]) {
        const overlaySpan = posts[indexPostAtual].querySelector('.grid-item-overlay span');
        const modalLikesText = document.getElementById('modalLikesText');
        
        if (overlaySpan && modalLikesText) {
            let textoLikes = overlaySpan.textContent.trim().replace('Reproduzir', '').trim();
            if (textoLikes) {
                modalLikesText.innerHTML = `<strong>${textoLikes} curtidas</strong>`;
            } else {
                modalLikesText.innerHTML = `<strong>Projeto J+M</strong>`;
            }
        }
    }
    
    // Reseta o coração do modal para o estado "não curtido" ao mudar de publicação
    const iconeCoracao = document.querySelector(".btn-like-modal i");
    if (iconeCoracao) {
        iconeCoracao.className = "fa-regular fa-heart";
        iconeCoracao.style.color = "";
    }
}

function fecharPostModal() {
    const modal = document.getElementById("postModal");
    const modalVideoArea = document.getElementById("modalVideoEmbed");

    if (modal) {
        modal.style.display = "none";
        indexPostAtual = -1;
        // Destrói o player para o som parar na hora ao fechar
        if (modalVideoArea) {
            modalVideoArea.innerHTML = ""; 
        }
    }
}

// ===================================================
// FUNÇÕES PARA ABRIR E NAVEGAR NOS DESTAQUES (STORIES)
// ===================================================

function abrirHighlight(arrayFotos, titleText) {
    const highlightModal = document.getElementById("highlightModal");
    const storyUsername = document.getElementById("storyUsername");
    const storyReplyInput = document.getElementById("storyReplyInput");
    const progressContainer = document.getElementById("storyProgressContainer");

    fotosDoDestaqueAtual = arrayFotos;
    indexStoryAtual = 0; 
    
    if (storyUsername) storyUsername.textContent = titleText;
    if (storyReplyInput) storyReplyInput.placeholder = `Responder a ${titleText}...`;

    const storyMusicName = document.getElementById("storyMusicName");
    if (storyMusicName) storyMusicName.textContent = `Sertanejo • Nome da Música`;

    if (progressContainer) {
        progressContainer.innerHTML = "";
        fotosDoDestaqueAtual.forEach((_, i) => {
            const segment = document.createElement("div");
            segment.classList.add("story-segment");
            if (i === 0) segment.classList.add("active");
            progressContainer.appendChild(segment);
        });
    }

    atualizarFotoStory();
    highlightModal.style.display = "flex";
}

function atualizarFotoStory() {
    const storyImage = document.getElementById("storyImage");
    if (storyImage && fotosDoDestaqueAtual[indexStoryAtual]) {
        storyImage.src = fotosDoDestaqueAtual[indexStoryAtual];
    }

    const segmentos = document.querySelectorAll(".story-segment");
    segmentos.forEach((seg, idx) => {
        if (idx <= indexStoryAtual) {
            seg.classList.add("active");
        } else {
            seg.classList.remove("active");
        }
    });

    // Controla a visibilidade das setas laterais
    atualizarSetas();
}

function proximoStory(event) {
    if (event) event.stopPropagation();

    indexStoryAtual++;

    if (indexStoryAtual < fotosDoDestaqueAtual.length) {
        atualizarFotoStory();
    } else {
        fecharHighlight();
    }
}

function voltarStory(event) {
    if (event) event.stopPropagation();

    if (indexStoryAtual > 0) {
        indexStoryAtual--;
        atualizarFotoStory();
    }
}

function atualizarSetas() {
    const setaEsquerda = document.getElementById("storyArrowLeft");
    const setaDireita = document.getElementById("storyArrowRight");

    // Esconde a seta esquerda se for o primeiro story
    if (setaEsquerda) {
        if (indexStoryAtual === 0) {
            setaEsquerda.style.display = "none";
        } else {
            setaEsquerda.style.display = "flex";
        }
    }

    if (setaDireita) {
        setaDireita.style.display = "flex";
    }
}

function fecharHighlight() {
    const highlightModal = document.getElementById("highlightModal");
    if (highlightModal) {
        highlightModal.style.display = "none";
    }
}

// Alternar curtidas nos Posts do Feed
function darLike(botao) {
    const icone = botao.querySelector("i");
    if (icone.classList.contains("fa-regular")) {
        icone.classList.remove("fa-regular");
        icone.classList.add("fa-solid");
        icone.style.color = "#ed4956";
    } else {
        icone.classList.remove("fa-solid");
        icone.classList.add("fa-regular");
        icone.style.color = "";
    }
}

// Alternar curtidas diretamente nos Stories (Rodapé)
function darLikeStory(icone) {
    if (icone.classList.contains("fa-regular")) {
        icone.classList.remove("fa-regular");
        icone.classList.add("fa-solid");
        icone.style.color = "#ff3040";
    } else {
        icone.classList.remove("fa-solid");
        icone.classList.add("fa-regular");
        icone.style.color = "#fff";
    }
}