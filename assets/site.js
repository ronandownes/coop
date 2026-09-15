(() => {
  const backdrop = document.querySelector('[data-modal-backdrop]');
  const modalContent = document.querySelector('[data-modal-content]');
  const closeBtn = document.querySelector('[data-modal-close]');
  let lastFocus = null;

  function enhanceQuestions(scope = document) {
    scope.querySelectorAll('.question').forEach((q) => {
      if (q.querySelector('.question-toggle')) return;
      const h3 = q.querySelector('h3');
      if (!h3) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'question-toggle';
      btn.setAttribute('aria-label', 'Show or hide answer');
      btn.textContent = '▼';
      btn.addEventListener('click', () => {
        q.classList.toggle('is-collapsed');
        btn.textContent = q.classList.contains('is-collapsed') ? '▶' : '▼';
      });
      q.insertBefore(btn, h3);
    });
  }

  function words(text) {
    const stop = new Set(['a','an','and','or','the','this','that','you','your','me','my','i','to','of','for','in','on','with','what','why','how','about','tell','role']);
    return (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9& ]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stop.has(w));
  }

  function bestQuestion(article, label) {
    const target = words(label);
    if (!target.length) return null;
    let best = null;
    let bestScore = 0;
    article.querySelectorAll('.question').forEach((q) => {
      const heading = words(q.querySelector('h3')?.textContent || '');
      const score = target.reduce((n, w) => n + (heading.some((h) => h === w || h.includes(w) || w.includes(h)) ? 1 : 0), 0);
      if (score > bestScore) {
        bestScore = score;
        best = q;
      }
    });
    return bestScore >= 1 ? best : null;
  }

  async function openSection(url, opener) {
    if (!backdrop || !modalContent) return;
    lastFocus = opener || document.activeElement;
    modalContent.innerHTML = '<p>Loading…</p>';
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const hero = doc.querySelector('.hero');
      const article = doc.querySelector('.article-body');

      if (!article) throw new Error('Section content not found');

      const isDropdownQuestion = opener?.closest('.dropmenu');
      const selected = isDropdownQuestion ? bestQuestion(article, opener.textContent) : null;

      if (selected) {
        const title = selected.querySelector('h3')?.textContent || opener.textContent.trim();
        modalContent.innerHTML = `<header class="hero"><p class="eyebrow">INTERVIEW QUESTION</p><h1 id="modal-title">${title}</h1></header><div class="article-body"></div>`;
        modalContent.querySelector('.article-body').appendChild(selected.cloneNode(true));
      } else {
        modalContent.innerHTML = `${hero ? hero.outerHTML : ''}${article.outerHTML}`;
        const h1 = modalContent.querySelector('h1');
        if (h1) h1.id = 'modal-title';
      }

      enhanceQuestions(modalContent);
      modalContent.scrollTop = 0;
      closeBtn?.focus();
    } catch (e) {
      modalContent.innerHTML = '<h2>Unable to load this section</h2><p>Please close this window and try again after the latest GitHub Pages build has completed.</p>';
    }
  }

  function closeModal() {
    if (!backdrop) return;
    backdrop.hidden = true;
    document.body.style.overflow = '';
    modalContent.innerHTML = '';
    lastFocus?.focus?.();
  }

  document.querySelectorAll('.navtoggle').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const item = btn.closest('.navitem');
      document.querySelectorAll('.navitem.open').forEach((other) => {
        if (other !== item) other.classList.remove('open');
      });
      item?.classList.toggle('open');
    });
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-modal-url]');
    if (trigger) {
      event.preventDefault();
      document.querySelectorAll('.navitem.open').forEach((item) => item.classList.remove('open'));
      openSection(trigger.dataset.modalUrl, trigger);
      return;
    }
    if (event.target === backdrop || event.target.closest('[data-modal-close]')) {
      closeModal();
      return;
    }
    if (!event.target.closest('.navitem')) document.querySelectorAll('.navitem.open').forEach((item) => item.classList.remove('open'));

    const term = event.target.closest('[data-term]');
    if (term) {
      const panel = document.querySelector('[data-term-panel]');
      if (!panel) return;
      panel.innerHTML = `<h3>${term.dataset.term}</h3><p>${term.dataset.definition}</p><p class="recall"><strong>Recall cue:</strong> ${term.dataset.cue || 'Define it simply, give a use, then give an example.'}</p>`;
    }
  });

  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

  document.querySelector('[data-listen]')?.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = document.querySelector('.paper')?.innerText || document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop && !backdrop.hidden) closeModal();
  });

  enhanceQuestions(document);
})();