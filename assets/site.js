(async () => {
  const body = document.getElementById('docBody');
  const topbar = document.querySelector('.topbar');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const synth = window.speechSynthesis;
  const hasSpeech = Boolean(synth && typeof SpeechSynthesisUtterance !== 'undefined');
  const pageEdit = document.querySelector('.doc-toolbar .edit-link[href]');
  const pagePrint = document.querySelector('.doc-toolbar [data-action="print"]');
  const EDIT_PREFIX = 'coop-answer-edit:v1:';

  const cleanText = value => (value || '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,.;:!?–—-]+|[\s,.;:!?–—-]+$/g, '')
    .trim();

  const normalisePath = value => {
    try {
      return new URL(value, location.href).pathname.replace(/\/+$/, '') || '/';
    } catch (_) {
      return '/';
    }
  };

  const splitQuestionHeading = value => {
    const text = cleanText(value);
    const pipeIndex = text.indexOf('|');
    if (pipeIndex < 0) return null;
    const handle = cleanText(text.slice(0, pipeIndex));
    const question = cleanText(text.slice(pipeIndex + 1));
    return handle && question ? { handle, question } : null;
  };

  const currentPath = location.pathname.replace(/\/+$/, '') || '/';

  // Keep page names and ordering fresh even while GitHub Pages/CDN caches an
  // older HTML page. nav.json is rebuilt from the current page titles/orders,
  // then fetched with a cache-busting query on every page load.
  const syncFreshNavigation = async () => {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    try {
      const rootHref = document.querySelector('.brand')?.href || new URL('/coop/', location.origin).href;
      const manifestUrl = new URL('nav.json', rootHref);
      manifestUrl.searchParams.set('_', Date.now().toString());
      const response = await fetch(manifestUrl.href, { cache: 'no-store' });
      if (!response.ok) return;
      const entries = await response.json();
      if (!Array.isArray(entries) || !entries.length) return;

      const existing = new Map(
        Array.from(nav.querySelectorAll(':scope > .navitem')).map(item => {
          const label = item.querySelector(':scope > .navlabel[href]');
          return [label ? normalisePath(label.href) : '', item];
        })
      );

      const fragment = document.createDocumentFragment();
      entries.forEach(entry => {
        const href = new URL(entry.url, location.origin).href;
        const path = normalisePath(href);
        let item = existing.get(path);
        if (!item) {
          item = document.createElement('div');
          item.className = 'navitem nav-dynamic';
          item.dataset.questionMenu = '';
          item.innerHTML = '<a class="navlabel"><span></span></a><div class="dropmenu"><a>Open page</a></div>';
        }
        const label = item.querySelector(':scope > .navlabel');
        const span = label?.querySelector('span');
        const menuTitle = entry.title || '';
        const pageTitle = entry.page_title || entry.title || '';
        if (label) label.href = href;
        if (span) span.textContent = menuTitle;
        else if (label) label.textContent = menuTitle;
        const fallback = item.querySelector(':scope > .dropmenu > a');
        if (fallback && !fallback.hash) fallback.href = href;
        fragment.appendChild(item);

        if (path === currentPath) {
          const h1 = document.querySelector('.doc-paper > h1');
          if (h1 && pageTitle) h1.textContent = pageTitle;
          if (pageTitle) document.title = pageTitle + ' | UL Co-op Interview';
        }
      });
      nav.replaceChildren(fragment);
    } catch (_) {
      // If the manifest is temporarily unavailable, leave the server-rendered
      // navigation untouched.
    }
  };

  await syncFreshNavigation();

  /* -----------------------------------------------------------------------
     Navigation: same open/pin behaviour as the Education site.
     ----------------------------------------------------------------------- */
  const closeNavMenus = (except = null) => {
    document.querySelectorAll('.navitem.is-open').forEach(item => {
      if (item === except) return;
      item.classList.remove('is-open');
      item.querySelectorAll('[data-nav-toggle]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    });
  };

  const closeMobileNav = () => {
    if (!topbar || !mobileNavToggle) return;
    topbar.classList.remove('nav-open');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNavToggle.setAttribute('aria-label', 'Open main navigation');
    closeNavMenus();
  };

  mobileNavToggle?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    const willOpen = !topbar.classList.contains('nav-open');
    topbar.classList.toggle('nav-open', willOpen);
    mobileNavToggle.setAttribute('aria-expanded', String(willOpen));
    mobileNavToggle.setAttribute('aria-label', willOpen ? 'Close main navigation' : 'Open main navigation');
    if (!willOpen) closeNavMenus();
  });

  document.querySelectorAll('[data-nav-toggle]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const item = button.closest('.navitem');
      if (!item) return;
      const willOpen = !item.classList.contains('is-open');
      closeNavMenus(item);
      item.classList.toggle('is-open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    });
  });

  // Match the Education site: on desktop, clicking a top menu item opens the
  // whole page immediately. On smaller screens, the first tap opens its
  // section menu and a second tap follows the page link.
  document.querySelectorAll('.navitem > .navlabel').forEach(label => {
    label.addEventListener('click', event => {
      if (window.innerWidth > 1500) return;
      const item = label.closest('.navitem');
      const menu = item?.querySelector(':scope > .dropmenu');
      if (!item || !menu || item.classList.contains('is-open')) return;
      event.preventDefault();
      event.stopPropagation();
      closeNavMenus(item);
      item.classList.add('is-open');
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.topbar')) closeNavMenus();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && topbar?.classList.contains('nav-open')) closeMobileNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1500 && topbar?.classList.contains('nav-open')) closeMobileNav();
  });

  document.querySelectorAll('.navitem > .navlabel[href]').forEach(label => {
    const isCurrent = normalisePath(label.href) === currentPath;
    const item = label.closest('.navitem');
    item?.classList.toggle('is-current', isCurrent);
    if (isCurrent) label.setAttribute('aria-current', 'page');
    else label.removeAttribute('aria-current');
  });

  const headingInfo = heading => {
    if (!heading) return null;
    const handle = cleanText(heading.dataset?.menuLabel);
    const question = cleanText(heading.dataset?.questionText);
    if (handle && question) return { handle, question, id: heading.id };
    const parsed = splitQuestionHeading(heading.textContent);
    return parsed ? { ...parsed, id: heading.id } : null;
  };

  const populateQuestionMenu = (item, headings, pageUrl) => {
    const menu = item.querySelector(':scope > .dropmenu');
    if (!menu) return;
    const questions = headings.map(headingInfo).filter(Boolean);
    menu.replaceChildren();

    if (!questions.length) {
      const fallback = document.createElement('a');
      fallback.href = pageUrl.href;
      fallback.textContent = 'Open section';
      menu.appendChild(fallback);
      return;
    }

    questions.forEach((question, index) => {
      const link = document.createElement('a');
      const id = question.id || `question-${index + 1}`;
      link.href = `${pageUrl.pathname}${pageUrl.search}#${id}`;
      link.textContent = question.handle;
      link.title = question.question;
      link.addEventListener('click', () => {
        item.classList.remove('is-open');
        item.querySelector('[data-nav-toggle]')?.setAttribute('aria-expanded', 'false');
        if (window.innerWidth <= 1500) topbar?.classList.remove('nav-open');
      });
      menu.appendChild(link);
    });
  };

  const syncQuestionMenu = async item => {
    const label = item.querySelector(':scope > .navlabel[href]');
    const menu = item.querySelector(':scope > .dropmenu');
    if (!label || !menu) return;
    const pageUrl = new URL(label.href, location.href);
    const targetPath = normalisePath(pageUrl.href);

    try {
      if (targetPath === currentPath && body) {
        const headings = Array.from(body.querySelectorAll(':scope > h2')).filter(heading => headingInfo(heading));
        populateQuestionMenu(item, headings, pageUrl);
        return;
      }

      const response = await fetch(pageUrl.href, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const headings = Array.from(parsed.querySelectorAll('#docBody > h2')).filter(heading => splitQuestionHeading(heading.textContent));
      populateQuestionMenu(item, headings, pageUrl);
    } catch (_) {
      menu.replaceChildren();
      const fallback = document.createElement('a');
      fallback.href = pageUrl.href;
      fallback.textContent = 'Open section';
      menu.appendChild(fallback);
    }
  };

  document.querySelectorAll('[data-question-menu]').forEach(syncQuestionMenu);

  pagePrint?.addEventListener('click', () => window.print());

  /* -----------------------------------------------------------------------
     Word Wall page.
     ----------------------------------------------------------------------- */
  document.addEventListener('click', event => {
    const term = event.target.closest('[data-term]');
    if (!term) return;
    const panel = document.querySelector('[data-term-panel]');
    if (!panel) return;
    panel.innerHTML = `<h3>${term.dataset.term}</h3><p>${term.dataset.definition}</p><p class="recall"><strong>Recall cue:</strong> ${term.dataset.cue || 'Define it simply, give a use, then give an example.'}</p>`;
  });

  if (!body) return;

  const interviewHeadings = () => Array.from(body.querySelectorAll(':scope > h2[data-question-text]'));

  const sourceNodesFor = heading => {
    const nodes = [];
    let node = heading.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      nodes.push(node);
      node = node.nextElementSibling;
    }
    return nodes;
  };

  const sourceHeadingText = heading => cleanText(
    heading.dataset.sourceHeading || `${heading.dataset.menuLabel || ''} | ${heading.dataset.questionText || heading.textContent}`
  );

  const answerTextFor = heading => sourceNodesFor(heading)
    .filter(node => !node.matches?.('.answer-focus-chain'))
    .map(node => node.textContent || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const editKeyFor = heading => `${EDIT_PREFIX}${location.pathname}:${sourceHeadingText(heading).toLowerCase()}`;

  const applySavedToSource = (heading, html) => {
    const current = sourceNodesFor(heading);
    const template = document.createElement('template');
    template.innerHTML = html;
    const replacement = Array.from(template.content.childNodes);
    if (current.length) {
      const anchor = current[0];
      replacement.forEach(node => anchor.parentNode.insertBefore(node, anchor));
      current.forEach(node => node.remove());
    } else {
      replacement.forEach(node => heading.parentNode.insertBefore(node, heading.nextSibling));
    }
  };

  const restoreSavedAnswers = () => {
    interviewHeadings().forEach(heading => {
      const saved = localStorage.getItem(editKeyFor(heading));
      if (saved) applySavedToSource(heading, saved);
    });
  };

  /* -----------------------------------------------------------------------
     Audio state shared by inline play, focus play and page Listen.
     ----------------------------------------------------------------------- */
  let activeAudioButton = null;
  let activeAudioTarget = null;
  let activeUtterance = null;

  const resetAudio = () => {
    if (synth) synth.cancel();
    activeAudioButton?.classList.remove('is-active', 'is-paused');
    activeAudioTarget?.classList.remove('cm-audio-speaking');
    activeAudioButton = null;
    activeAudioTarget = null;
    activeUtterance = null;
  };

  const speak = ({ text, button = null, target = null, rate = 0.92, restart = false }) => {
    if (!hasSpeech || !cleanText(text)) return;

    if (!restart && button && activeAudioButton === button && synth.speaking) {
      if (synth.paused) {
        synth.resume();
        button.classList.remove('is-paused');
      } else {
        synth.pause();
        button.classList.add('is-paused');
      }
      return;
    }

    resetAudio();
    activeAudioButton = button;
    activeAudioTarget = target;
    button?.classList.add('is-active');
    target?.classList.add('cm-audio-speaking');
    activeUtterance = new SpeechSynthesisUtterance(text);
    activeUtterance.lang = 'en-IE';
    activeUtterance.rate = rate;
    activeUtterance.onend = resetAudio;
    activeUtterance.onerror = resetAudio;
    synth.speak(activeUtterance);
  };

  const addInlinePlayButtons = () => {
    interviewHeadings().forEach(heading => {
      if (heading.querySelector(':scope > .cm-question-play')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cm-question-play';
      button.setAttribute('aria-label', `Play question and answer: ${heading.dataset.questionText}`);
      button.title = 'Play question and answer · double-click to restart';
      const text = () => `${heading.dataset.questionText}. ${answerTextFor(heading)}`;
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        speak({ text: text(), button, target: heading });
      });
      button.addEventListener('dblclick', event => {
        event.preventDefault();
        event.stopPropagation();
        speak({ text: text(), button, target: heading, restart: true });
      });
      heading.prepend(button);
    });
  };

  addInlinePlayButtons();

  /* -----------------------------------------------------------------------
     Focus answer overlay — clicking a question produces the same blocking,
     distraction-free rehearsal view as the Education site.
     ----------------------------------------------------------------------- */
  const overlay = document.createElement('div');
  overlay.className = 'answer-focus-overlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Focused interview answer');
  overlay.innerHTML = `
    <article class="answer-focus-card" tabindex="-1">
      <button class="answer-focus-close" type="button" data-focus-close aria-label="Close focused answer">×</button>
      <div class="answer-focus-content" data-focus-content></div>
    </article>
  `;
  document.body.appendChild(overlay);

  const focusCard = overlay.querySelector('.answer-focus-card');
  const focusContent = overlay.querySelector('[data-focus-content]');
  let lastTrigger = null;

  const cloneAnswer = heading => {
    const wrapper = document.createElement('div');
    wrapper.className = 'answer-focus-copy';
    const saved = localStorage.getItem(editKeyFor(heading));
    if (saved) {
      wrapper.innerHTML = saved;
      return wrapper;
    }
    sourceNodesFor(heading).forEach(node => {
      const clone = node.cloneNode(true);
      clone.querySelectorAll?.('script,style,button,.cm-question-play,a[href*="pagescms.org"]').forEach(el => el.remove());
      if (cleanText(clone.textContent) || clone.matches?.('img,table,ul,ol,blockquote,.key-vocab,.recall')) wrapper.appendChild(clone);
    });
    return wrapper;
  };

  const selectContent = content => {
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(content);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const closeFocus = () => {
    if (overlay.hidden) return;
    resetAudio();
    overlay.hidden = true;
    focusContent.replaceChildren();
    document.body.classList.remove('answer-focus-open');
    lastTrigger?.focus({ preventScroll: true });
    lastTrigger = null;
  };

  const openFocus = heading => {
    const copy = cloneAnswer(heading);
    if (!cleanText(copy.textContent)) return;

    const title = document.createElement('h2');
    title.textContent = heading.dataset.questionText || cleanText(heading.textContent);
    title.dataset.focusClose = '';
    title.title = 'Click the question to close';

    const controls = document.createElement('div');
    controls.className = 'answer-focus-tools';

    const play = document.createElement('button');
    play.type = 'button';
    play.textContent = '▶ Play';
    play.title = 'Play or pause this question and answer';
    play.addEventListener('click', event => {
      event.stopPropagation();
      if (activeAudioButton === play && synth?.speaking) {
        if (synth.paused) {
          synth.resume();
          play.textContent = '⏸ Pause';
        } else {
          synth.pause();
          play.textContent = '▶ Resume';
        }
        return;
      }
      resetAudio();
      if (!hasSpeech) return;
      activeAudioButton = play;
      play.classList.add('is-active');
      play.textContent = '⏸ Pause';
      activeUtterance = new SpeechSynthesisUtterance(`${title.textContent}. ${cleanText(copy.innerText)}`);
      activeUtterance.lang = 'en-IE';
      activeUtterance.rate = 0.92;
      activeUtterance.onend = () => { play.textContent = '▶ Play'; resetAudio(); };
      activeUtterance.onerror = () => { play.textContent = '▶ Play'; resetAudio(); };
      synth.speak(activeUtterance);
    });

    const stop = document.createElement('button');
    stop.type = 'button';
    stop.textContent = '■ Stop';
    stop.addEventListener('click', event => {
      event.stopPropagation();
      resetAudio();
      play.textContent = '▶ Play';
    });

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.textContent = 'Copy';
    copyButton.title = 'Copy this answer to the clipboard';
    copyButton.addEventListener('click', async event => {
      event.stopPropagation();
      const text = cleanText(copy.innerText);
      try {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = 'Copied';
      } catch (_) {
        selectContent(copy);
        copyButton.textContent = 'Selected';
      }
      window.setTimeout(() => { copyButton.textContent = 'Copy'; }, 900);
    });

    controls.append(play, stop, copyButton);



    if (pageEdit?.href) {
      const cms = document.createElement('a');
      cms.href = `${pageEdit.href.split('#')[0]}#:~:text=${encodeURIComponent(sourceHeadingText(heading))}`;
      cms.target = '_blank';
      cms.rel = 'noopener';
      cms.textContent = 'Edit in CMS';
      cms.title = 'Edit this page permanently in Pages CMS';
      controls.appendChild(cms);
    }

    focusContent.replaceChildren(title, controls, copy);
    lastTrigger = heading;
    overlay.hidden = false;
    document.body.classList.add('answer-focus-open');
    focusCard.scrollTop = 0;
    focusCard.focus({ preventScroll: true });
  };

  interviewHeadings().forEach(heading => {
    heading.tabIndex = 0;
    heading.setAttribute('role', 'button');
    heading.setAttribute('aria-haspopup', 'dialog');
    heading.title = 'Click the question to open focus view';
    heading.addEventListener('click', event => {
      if (event.target.closest('button,a,input,textarea,select,summary')) return;
      openFocus(heading);
    });
    heading.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('button,a,input,textarea,select,summary')) return;
      event.preventDefault();
      openFocus(heading);
    });
  });

  overlay.addEventListener('click', event => {
    if (event.target === overlay || event.target.closest('[data-focus-close]')) closeFocus();
  });

  /* -----------------------------------------------------------------------
     Floating page tools: Edit here, Print, Listen.
     ----------------------------------------------------------------------- */
  const setupFloatingTools = () => {
    if (!pageEdit && !pagePrint) return;
    const rail = document.createElement('div');
    rail.id = 'floating-page-tools';
    rail.setAttribute('aria-label', 'Page tools');

    let floatingEdit = null;
    if (pageEdit?.href) {
      floatingEdit = document.createElement('a');
      floatingEdit.id = 'floating-section-edit';
      floatingEdit.href = pageEdit.href;
      floatingEdit.target = '_blank';
      floatingEdit.rel = 'noopener';
      floatingEdit.textContent = 'Edit here';
      floatingEdit.setAttribute('aria-label', 'Edit the section currently in view');
      floatingEdit.dataset.cmsBase = pageEdit.href.split('#')[0];
      rail.appendChild(floatingEdit);
      pageEdit.hidden = true;
    }

    const print = document.createElement('button');
    print.id = 'floating-page-print';
    print.type = 'button';
    print.textContent = 'Print';
    print.setAttribute('aria-label', 'Print this page');
    print.addEventListener('click', () => window.print());
    rail.appendChild(print);
    if (pagePrint) pagePrint.hidden = true;

    if (hasSpeech) {
      const listen = document.createElement('button');
      listen.id = 'floating-page-listen';
      listen.type = 'button';
      listen.textContent = 'Listen';
      listen.setAttribute('aria-label', 'Listen to this page');
      listen.addEventListener('click', () => {
        if (activeAudioButton === listen && synth.speaking) {
          if (synth.paused) {
            synth.resume();
            listen.textContent = 'Pause';
          } else {
            synth.pause();
            listen.textContent = 'Resume';
          }
          return;
        }
        const questions = interviewHeadings();
        const text = questions.length
          ? questions.map(heading => `${heading.dataset.questionText}. ${answerTextFor(heading)}`).join(' ')
          : `${document.querySelector('.doc-paper > h1')?.textContent || ''}. ${body.innerText}`;
        resetAudio();
        activeAudioButton = listen;
        listen.classList.add('is-active');
        listen.textContent = 'Pause';
        activeUtterance = new SpeechSynthesisUtterance(cleanText(text));
        activeUtterance.lang = 'en-IE';
        activeUtterance.rate = 0.92;
        activeUtterance.onend = () => { listen.textContent = 'Listen'; resetAudio(); };
        activeUtterance.onerror = () => { listen.textContent = 'Listen'; resetAudio(); };
        synth.speak(activeUtterance);
      });
      rail.appendChild(listen);
    }

    document.body.appendChild(rail);

    if (!floatingEdit) return;
    let ticking = false;
    const updateEditTarget = () => {
      ticking = false;
      const headings = interviewHeadings();
      if (!headings.length) {
        floatingEdit.href = floatingEdit.dataset.cmsBase;
        return;
      }
      const marker = Math.min(window.innerHeight * 0.38, 300);
      let active = headings[0];
      headings.forEach(heading => {
        if (heading.getBoundingClientRect().top <= marker) active = heading;
      });
      const source = sourceHeadingText(active);
      floatingEdit.href = source ? `${floatingEdit.dataset.cmsBase}#:~:text=${encodeURIComponent(source)}` : floatingEdit.dataset.cmsBase;
      floatingEdit.title = source ? `Edit near “${source}”` : 'Edit this page';
    };
    const queue = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateEditTarget);
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    updateEditTarget();
  };

  setupFloatingTools();

  /* -----------------------------------------------------------------------
     Hash target alignment: give the last section enough temporary scroll
     runway to sit below the sticky navigation, without dummy headings or
     permanent blank space at the end of every page.
     ----------------------------------------------------------------------- */
  const alignHashTarget = () => {
    if (!location.hash) {
      body.style.removeProperty('padding-bottom');
      return;
    }

    let id = '';
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch (_) {
      id = location.hash.slice(1);
    }

    const target = document.getElementById(id);
    if (!target || !body.contains(target)) {
      body.style.removeProperty('padding-bottom');
      return;
    }

    // Recalculate from the page's natural height first, then add only the
    // extra space needed for this target to reach its normal anchored position.
    body.style.removeProperty('padding-bottom');

    requestAnimationFrame(() => {
      const topOffset = (topbar?.getBoundingClientRect().height || 0) + 20;
      const targetTop = Math.max(0, window.scrollY + target.getBoundingClientRect().top - topOffset);
      const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const shortfall = Math.ceil(targetTop - maxScrollTop);

      if (shortfall > 0) {
        body.style.paddingBottom = `${shortfall + 24}px`;
      }

      requestAnimationFrame(() => {
        window.scrollTo({ top: targetTop, behavior: 'auto' });
      });
    });
  };

  window.addEventListener('hashchange', alignHashTarget);
  if (document.readyState === 'complete') alignHashTarget();
  else window.addEventListener('load', alignHashTarget, { once: true });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !overlay.hidden) closeFocus();
  });
  window.addEventListener('pagehide', resetAudio);
  window.addEventListener('beforeunload', resetAudio);
})();


// Abelo global footprint map
(() => {
  const mapHost = document.querySelector('[data-abelo-map] #abeloWorldMap');
  if (!mapHost) return;

  const placements = [
    {
      lat: 53.35, lng: -6.26,
      title: 'Ireland — Emerald Airlines',
      aircraft: 'ATR 72-600',
      count: '1 aircraft identified in the Aergo portfolio announcement',
      structure: 'Existing lease acquired as part of a six-aircraft portfolio',
      role: 'Portfolio acquisition / continuing lease',
      sourceDate: '2026',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 58,
      detail: 'Abelo acquired a portfolio including an aircraft on lease to Emerald Airlines, adding the operator to its global customer base.'
    },
    {
      lat: 59.33, lng: 18.07,
      title: 'Sweden — Braathens Regional Airways',
      aircraft: '3 × ATR 72-600',
      count: '3 aircraft',
      structure: 'Aircraft acquired while already on lease to Braathens',
      role: 'Portfolio acquisition / existing operating leases',
      sourceDate: 'June–July 2025 deliveries',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 62,
      detail: 'Three 2015/2016-vintage ATR 72-600 aircraft were acquired from Bramora Ltd and remained on lease to Braathens.'
    },
    {
      lat: 37.98, lng: 23.72,
      title: 'Greece — SKY express / AEGEAN-Olympic',
      aircraft: 'ATR 72-600',
      count: 'Multiple aircraft across documented placements',
      structure: 'New aircraft leases from Abelo orderbook',
      role: 'Orderbook placement / fleet renewal',
      sourceDate: '2024 onward',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 34,
      detail: 'Abelo placed new ATR 72-600 aircraft with SKY express and Olympic Air / AEGEAN, supporting regional and island networks.'
    },
    {
      lat: 28.29, lng: -16.63,
      title: 'Canary Islands — Binter Canarias',
      aircraft: 'ATR 72-600',
      count: '1 aircraft identified in the Aergo portfolio announcement',
      structure: 'Existing lease acquired as part of a six-aircraft portfolio',
      role: 'Portfolio acquisition / continuing lease',
      sourceDate: '2026',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 55,
      detail: 'Binter Canarias was one of five new operators added to Abelo through the Aergo-managed portfolio acquisition.'
    },
    {
      lat: 4.71, lng: -74.07,
      title: 'Colombia — SATENA',
      aircraft: 'ATR 42-600 + ATR 72-600',
      count: 'At least 2 aircraft publicly documented',
      structure: 'New aircraft placements from Abelo orderbook',
      role: 'Orderbook placement / repeat customer',
      sourceDate: 'Dec 2025 and May 2026',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 22,
      detail: 'Abelo delivered an ATR 42-600 to SATENA in December 2025 and then announced a follow-on ATR 72-600 placement in May 2026.'
    },
    {
      lat: 4.18, lng: 73.51,
      title: 'Maldives — Maldivian',
      aircraft: '2 × ATR 42-600',
      count: '2 aircraft',
      structure: 'Sale-and-leaseback for the first documented 2024 aircraft; later finance lease backed by EDC',
      role: 'Fleet renewal / structured leasing',
      sourceDate: '2024–2025',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 38,
      detail: 'The public material shows two distinct structures: a sale-and-leaseback transaction in 2024 and an EDC-backed finance lease for the second ATR 42-600 delivered in 2025.'
    },
    {
      lat: 23.81, lng: 90.41,
      title: 'Bangladesh — Air Astra',
      aircraft: '3 × ATR 72-600',
      count: '3 aircraft',
      structure: 'New aircraft lease placements',
      role: 'Orderbook placement / fleet expansion',
      sourceDate: 'Third aircraft delivered Sep 2026',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 14,
      detail: 'Three brand-new ATR 72-600 aircraft were delivered to Air Astra to support domestic network expansion in Bangladesh.'
    },
    {
      lat: -4.33, lng: 15.31,
      title: 'DR Congo — Air Congo via Ethiopian Airlines Group',
      aircraft: '2 × ATR 72-600',
      count: '2 aircraft',
      structure: 'Lease to Ethiopian Airlines Group for operation by partner airline Air Congo',
      role: 'New aircraft lease / African market expansion',
      sourceDate: 'March 2026',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 18,
      detail: 'Two brand-new ATR 72-600 aircraft from Abelo’s orderbook were leased to Ethiopian Airlines Group for operation by Air Congo.'
    },
    {
      lat: -6.21, lng: 106.85,
      title: 'Indonesia — Citilink',
      aircraft: '2 aircraft in the Aergo portfolio',
      count: '2 aircraft',
      structure: 'Existing leases acquired as part of a portfolio transaction',
      role: 'Portfolio acquisition / continuing leases',
      sourceDate: '2026',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 57,
      detail: 'Citilink accounted for two of the six aircraft in the Aergo-managed portfolio acquired by Abelo.'
    },
    {
      lat: 14.60, lng: 120.98,
      title: 'Philippines — Philippine Airlines',
      aircraft: 'Turboprop aircraft in Aergo portfolio',
      count: '1 aircraft identified',
      structure: 'Existing lease acquired as part of a portfolio transaction',
      role: 'Portfolio acquisition / continuing lease',
      sourceDate: '2026',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 56,
      detail: 'Philippine Airlines was added as a new operator through Abelo’s acquisition of the Aergo-managed six-aircraft portfolio.'
    },
    {
      lat: -33.87, lng: 151.21,
      title: 'Australia — National Jet Express',
      aircraft: 'Turboprop aircraft in Aergo portfolio',
      count: '1 aircraft identified',
      structure: 'Existing lease acquired as part of a portfolio transaction',
      role: 'Portfolio acquisition / continuing lease',
      sourceDate: '2026',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 56,
      detail: 'National Jet Express was added as a new Abelo operator through the Aergo-managed portfolio acquisition.'
    },
    {
      lat: -31.95, lng: 115.86,
      title: 'Australia — Aerlink / Air Navigator Group',
      aircraft: 'ATR 72-500, MSN 762',
      count: '1 aircraft',
      structure: 'Aircraft transition to a new operator',
      role: 'Repossession → inspection → maintenance → reconfiguration → redelivery',
      sourceDate: 'February 2026',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 20,
      detail: 'Abelo coordinated the transition from Blue Islands to Aerlink in less than 100 days, including repossession, inspection, maintenance and reconfiguration.'
    },
    {
      lat: 19.08, lng: 72.88,
      title: 'India — IndiGo',
      aircraft: '4 × ATR 72-600',
      count: '4 aircraft',
      structure: 'Aircraft acquired while already on lease to IndiGo',
      role: 'Portfolio acquisition / existing leases',
      sourceDate: 'March 2024',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 70,
      detail: 'Abelo acquired four ATR 72-600 aircraft through SKY Leasing; all four were already on lease to IndiGo. The deal took Abelo’s portfolio to 57 owned and managed aircraft at that time.'
    },
    {
      lat: -1.29, lng: 36.82,
      title: 'Kenya — Renegade Air',
      aircraft: 'ATR 72 cargo conversion, MSN 875',
      count: '1 aircraft',
      structure: 'Passenger-to-cargo conversion and lease placement',
      role: 'Life-extension / asset repurposing',
      sourceDate: 'May 2024',
      maturityKnown: false,
      maturityLabel: 'Lease maturity not disclosed publicly',
      progress: 82,
      detail: 'MSN 875 was converted from passenger use to cargo. Abelo said the conversion can extend useful life beyond the typical 25 years.'
    }
  ];

  const loadLeaflet = () => new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L);

    if (!document.querySelector('link[data-leaflet-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.crossOrigin = '';
      link.dataset.leafletCss = 'true';
      document.head.appendChild(link);
    }

    const existing = document.querySelector('script[data-leaflet-js]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.L), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.crossOrigin = '';
    script.dataset.leafletJs = 'true';
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[ch]));

  const popupHtml = p => {
    const barClass = p.maturityKnown ? 'is-known' : 'is-estimate';
    const maturityText = p.maturityKnown
      ? p.maturityLabel
      : 'Contractual maturity is not public. The bar is a visual asset-life / transaction-stage cue only — not a claimed lease expiry date.';

    return `
      <div class="abelo-popup-card">
        <h3>${escapeHtml(p.title)}</h3>
        <div class="abelo-popup-grid">
          <div><span>Aircraft</span><strong>${escapeHtml(p.aircraft)}</strong></div>
          <div><span>How many?</span><strong>${escapeHtml(p.count)}</strong></div>
          <div><span>Lease / deal type</span><strong>${escapeHtml(p.structure)}</strong></div>
          <div><span>Abelo role</span><strong>${escapeHtml(p.role)}</strong></div>
          <div><span>Public date</span><strong>${escapeHtml(p.sourceDate)}</strong></div>
        </div>
        <p class="abelo-popup-detail">${escapeHtml(p.detail)}</p>
        <div class="abelo-maturity">
          <div class="abelo-maturity-head">
            <strong>Lease / asset progress</strong>
            <span>${escapeHtml(p.maturityLabel)}</span>
          </div>
          <div class="abelo-progress" aria-label="Lease or asset progress visual">
            <span class="${barClass}" style="width:${Math.max(8, Math.min(100, p.progress))}%"></span>
          </div>
          <p>${escapeHtml(maturityText)}</p>
        </div>
        <details class="abelo-lease-params">
          <summary>Lease parameters to think about</summary>
          <ul>
            <li>Lease start date and contractual maturity</li>
            <li>Monthly / quarterly rent and escalation</li>
            <li>Security deposit or letter of credit</li>
            <li>Maintenance reserves and return conditions</li>
            <li>Flight-hour / cycle assumptions</li>
            <li>Residual value at lease end</li>
            <li>Airline credit risk and jurisdiction risk</li>
            <li>Interest rate, financing cost and currency exposure</li>
          </ul>
          <p><strong>Important:</strong> these contractual values are generally not disclosed in the public announcements, so they should be treated as the analytical questions Erik would ask — not as known Abelo lease terms.</p>
        </details>
      </div>`;
  };

  loadLeaflet().then(L => {
    const map = L.map(mapHost, { scrollWheelZoom: false, worldCopyJump: true }).setView([18, 15], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 7,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    placements.forEach(p => {
      L.marker([p.lat, p.lng])
        .addTo(map)
        .bindPopup(popupHtml(p), { maxWidth: 420, minWidth: 300 });
    });

    const group = L.featureGroup(placements.map(p => L.marker([p.lat, p.lng])));
    map.fitBounds(group.getBounds().pad(0.18), { maxZoom: 2 });
  }).catch(() => {
    mapHost.innerHTML = '<p style="padding:1rem">Interactive map unavailable. The placement list below remains available.</p>';
  });
})();
