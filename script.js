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
    if (e.key === 'Enter' || e.key === ' ') {
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
});
