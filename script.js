// Lightbox: abre a imagem grande a partir da miniatura e permite fechar com Esc ou clicando fora.
// Também evita scroll do body enquanto aberta.

document.addEventListener('DOMContentLoaded', () => {
  const thumb = document.querySelector('.thumb');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxInner = document.querySelector('.lightbox-inner');

  if (!thumb || !lightbox || !lightboxImage) return;

  function openLightbox(src, altText = '') {
    lightboxImage.src = src;
    lightboxImage.alt = altText || 'Imagem ampliada';
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    // foco no container para permitir teclado (Esc)
    lightboxInner.focus();
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    // limpar src para parar qualquer decode work
    lightboxImage.src = '';
    // devolver foco para a miniatura
    thumb.focus();
  }

  // abrir ao clicar/toque
  thumb.addEventListener('click', (e) => {
    const src = thumb.dataset.large || thumb.src;
    e.preventDefault();
    openLightbox(src, thumb.alt);
  });

  // permitir abrir com Enter/Space (acessibilidade)
  thumb.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      const src = thumb.dataset.large || thumb.src;
      openLightbox(src, thumb.alt);
    }
  });

  // fechar ao clicar no botão
  lightboxClose.addEventListener('click', closeLightbox);

  // fechar ao clicar fora da imagem (no overlay)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxInner) {
      closeLightbox();
    }
  });

  // fechar com Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });

  // impedir clique na imagem de propagar (evita fechar)
  lightboxImage.addEventListener('click', (e) => e.stopPropagation());

  // --- Novas melhorias: fallback para imagens quebradas e carregamento seguro ---

  // Função que aplica fallback a uma imagem quando ela falhar no carregamento
  function applyImageFallback(img) {
    if (!img) return;
    // não reaplicar
    if (img.dataset.fallbackApplied) return;
    img.addEventListener('error', function handleError() {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = '1';
      // usar placeholder adequado ao tamanho se disponível
      const placeholderSmall = 'https://via.placeholder.com/400x300?text=Imagem+indisponível';
      const placeholderLarge = 'https://via.placeholder.com/800x800?text=Imagem+indisponível';
      // se for a lightbox, usar a variante grande
      const fallback = img.classList.contains('lightbox-image') ? placeholderLarge : (img.classList.contains('thumb') ? 'https://via.placeholder.com/150x150?text=Miniatura' : placeholderSmall);
      console.warn('Imagem falhou ao carregar, aplicando fallback:', img, '->', fallback);
      img.src = fallback;
    });
  }

  // Aplicar fallback a todas as imagens visíveis na página
  document.querySelectorAll('img').forEach(img => {
    applyImageFallback(img);
    // caso o site use data-src (lazy loading), tentar ativar
    if ((!img.src || img.src.trim() === '') && img.dataset.src) {
      img.src = img.dataset.src;
    }
  });

  // Garantir fallback também na imagem da lightbox (evita src vazio após erro)
  if (lightboxImage) {
    lightboxImage.addEventListener('error', () => {
      if (lightboxImage.dataset.fallbackApplied) return;
      lightboxImage.dataset.fallbackApplied = '1';
      lightboxImage.src = 'https://via.placeholder.com/800x800?text=Imagem+indisponível';
    });
  }

  // Tentar detectar e corrigir caminhos relativos simples que podem ter sido quebrados
  // Ex.: './imgs/pic.jpg' -> '/imgs/pic.jpg' ou 'imgs/pic.jpg'
  document.querySelectorAll('img').forEach(img => {
    if (!img.src) return;
    try {
      const url = new URL(img.src, location.href);
      // se hostname é mesma do site e retorno 404 causado por rota do GitHub Pages pode ocorrer;
      // aqui apenas tentamos normalizar caminhos relativos começando com './' ou '../'
      if (img.getAttribute('src') && img.getAttribute('src').startsWith('./')) {
        const altPath = img.getAttribute('src').replace(/^\.\//, '/');
        // testar altPath sem enviar requests: atualizar para o altPath — se falhar, fallback acima tratará
        img.src = altPath;
      }
    } catch (e) {
      // URL inválida, deixar fallback lidar com o erro
    }
  });

  // Observador para aplicar fallback em imagens adicionadas dinamicamente (ex.: carregamento tardio)
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) {
          if (node.tagName === 'IMG') applyImageFallback(node);
          node.querySelectorAll && node.querySelectorAll('img').forEach(applyImageFallback);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

});
