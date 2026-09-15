(() => {
  const backdrop = document.querySelector('[data-modal-backdrop]');
  const modalContent = document.querySelector('[data-modal-content]');
  const closeBtn = document.querySelector('[data-modal-close]');
  let lastFocus = null;

  async function openSection(url, opener) {
    if (!backdrop || !modalContent) return;
    lastFocus = opener || document.activeElement;
    modalContent.innerHTML = '<p>Loading…</p>';
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    try {
      const res = await fetch(url);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const hero = doc.querySelector('.hero');
      const article = doc.querySelector('.article-body');
      modalContent.innerHTML = `${hero ? hero.outerHTML : ''}${article ? article.outerHTML : html}`;
      const h1 = modalContent.querySelector('h1');
      if (h1) h1.id = 'modal-title';
      closeBtn?.focus();
    } catch (e) {
      modalContent.innerHTML = '<h2>Unable to load this section</h2><p>Open the section directly and try again.</p>';
    }
  }

  function closeModal() {
    if (!backdrop) return;
    backdrop.hidden = true;
    document.body.style.overflow = '';
    modalContent.innerHTML = '';
    lastFocus?.focus?.();
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-modal-url]');
    if (trigger) {
      event.preventDefault();
      openSection(trigger.dataset.modalUrl, trigger);
      return;
    }
    if (event.target === backdrop || event.target.closest('[data-modal-close]')) closeModal();

    const term = event.target.closest('[data-term]');
    if (term) {
      const panel = document.querySelector('[data-term-panel]');
      if (!panel) return;
      panel.innerHTML = `<h3>${term.dataset.term}</h3><p>${term.dataset.definition}</p><p class="recall"><strong>Recall cue:</strong> ${term.dataset.cue || 'Define it simply, give a use, then give an example.'}</p>`;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop && !backdrop.hidden) closeModal();
  });
})();
