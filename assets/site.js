(async () => {
  const body = document.getElementById('docBody');
  const topbar = document.querySelector('.topbar');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const synth = window.speechSynthesis;
  const hasSpeech = Boolean(synth && typeof SpeechSynthesisUtterance !== 'undefined');
  const pageEdit = document.querySelector('.doc-toolbar .edit-link[href]');
  const pagePrint = document.querySelector('.doc-toolbar [data-action="print"]');
  const EDIT_PREFIX = 'coop-answer-edit:v1:';
  const GLOSSARY_PREFIX = 'coop-glossary:v1';
  const GLOSSARY_SEED = [
    { term: 'Commercial awareness', definition: 'Understanding how an organisation creates value, controls cost, serves customers and responds to its market.', cue: 'Business model → costs → customers → decisions.' },
    { term: 'Correlation', definition: 'A measure of the strength and direction of association between two variables.', cue: 'Association, not causation.' },
    { term: 'Discounting', definition: 'Converting future cash flows into an equivalent value today using a discount rate.', cue: 'Future cash → rate → today.' },
    { term: 'Expected value', definition: 'The probability-weighted average outcome of a random variable.', cue: 'Outcome × probability, then add.' },
    { term: 'Model assumption', definition: 'A condition accepted as part of a model so that the problem can be analysed.', cue: 'State it → justify it → test sensitivity.' },
    { term: 'Numerical method', definition: 'A computational procedure used to approximate a mathematical solution when an exact method is impractical or unavailable.', cue: 'Approximate → iterate → check error.' },
    { term: 'Operations research', definition: 'The use of mathematical models and analytical methods to improve decisions about complex systems and limited resources.', cue: 'Model → constraints → optimise.' },
    { term: 'Optimisation', definition: 'Finding the best feasible value of an objective subject to stated constraints.', cue: 'Objective → constraints → best feasible solution.' },
    { term: 'Outlier', definition: 'An observation that lies unusually far from the rest of a dataset and may warrant investigation.', cue: 'Spot → investigate → decide treatment.' },
    { term: 'Present value', definition: 'The current worth of a future cash flow after discounting for time and required return.', cue: 'Future value ÷ growth factor.' },
    { term: 'Regression', definition: 'A statistical method for modelling the relationship between a response variable and one or more explanatory variables.', cue: 'Relationship → estimate → interpret.' },
    { term: 'Robustness', definition: 'The extent to which a result remains reliable when assumptions, inputs or conditions change.', cue: 'Change inputs → does the conclusion hold?' },
    { term: 'Sensitivity analysis', definition: 'Testing how changes in model inputs or assumptions affect the resulting output.', cue: 'Vary input → observe output.' },
    { term: 'Variance', definition: 'A measure of how widely values are dispersed around their mean.', cue: 'Distance from mean, squared and averaged.' }
  ];

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

    const raw = cleanText(heading.textContent);
    if (!raw) return null;

    const parsed = splitQuestionHeading(raw);
    if (parsed) return { ...parsed, id: heading.id };

    // Legacy H2: no pipe means the same text is both the menu handle
    // and the visible section title.
    return { handle: raw, question: raw, id: heading.id };
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
      const headings = Array.from(parsed.querySelectorAll('#docBody > h2')).filter(heading => headingInfo(heading));
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
     Glossary — available from every page and automatically alphabetical.
     User-added entries are stored locally in this browser.
     ----------------------------------------------------------------------- */
  const readGlossary = () => {
    let custom = [];
    try {
      custom = JSON.parse(localStorage.getItem(GLOSSARY_PREFIX) || '[]');
      if (!Array.isArray(custom)) custom = [];
    } catch (_) {
      custom = [];
    }
    const merged = new Map();
    GLOSSARY_SEED.forEach(item => merged.set(item.term.toLowerCase(), { ...item, builtIn: true }));
    custom.forEach(item => {
      if (!item?.term) return;
      merged.set(cleanText(item.term).toLowerCase(), { ...item, builtIn: false });
    });
    return Array.from(merged.values()).sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
  };

  const writeCustomGlossary = items => {
    localStorage.setItem(GLOSSARY_PREFIX, JSON.stringify(items));
    renderGlossaryPage();
  };

  const customGlossary = () => readGlossary().filter(item => !item.builtIn);

  const glossaryDialog = document.createElement('div');
  glossaryDialog.className = 'glossary-dialog-overlay';
  glossaryDialog.hidden = true;
  glossaryDialog.innerHTML = `
    <section class="glossary-dialog" role="dialog" aria-modal="true" aria-label="Glossary term">
      <button type="button" class="glossary-dialog-close" aria-label="Close glossary">×</button>
      <div class="glossary-dialog-body"></div>
    </section>
  `;
  document.body.appendChild(glossaryDialog);
  const glossaryDialogBody = glossaryDialog.querySelector('.glossary-dialog-body');

  const closeGlossaryDialog = () => {
    glossaryDialog.hidden = true;
    glossaryDialogBody.replaceChildren();
  };

  glossaryDialog.addEventListener('click', event => {
    if (event.target === glossaryDialog || event.target.closest('.glossary-dialog-close')) closeGlossaryDialog();
  });

  const lookupDefinition = async raw => {
    const term = cleanText(raw);
    if (!term) return '';
    const existing = readGlossary().find(item => item.term.toLowerCase() === term.toLowerCase());
    if (existing) return existing.definition || '';
    try {
      if (!term.includes(' ')) {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`);
        if (response.ok) {
          const data = await response.json();
          const found = data?.[0]?.meanings?.flatMap(m => m.definitions || [])?.find(d => d.definition);
          if (found?.definition) return found.definition;
        }
      }
    } catch (_) {}
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
      if (response.ok) {
        const data = await response.json();
        if (data?.extract) return data.extract.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
      }
    } catch (_) {}
    return '';
  };

  const openGlossaryTerm = async rawTerm => {
    const term = cleanText(rawTerm);
    if (!term) {
      const page = new URL('glossary.html', document.querySelector('.brand')?.href || location.href);
      location.href = page.href;
      return;
    }

    glossaryDialog.hidden = false;
    glossaryDialogBody.innerHTML = '<p class="glossary-looking-up">Looking up definition…</p>';

    const existing = readGlossary().find(item => item.term.toLowerCase() === term.toLowerCase());
    const suggested = existing?.definition || await lookupDefinition(term);

    const form = document.createElement('form');
    form.className = 'glossary-term-form';

    const h2 = document.createElement('h2');
    h2.textContent = existing ? term : 'Add to Glossary';

    const termLabel = document.createElement('label');
    termLabel.textContent = 'Term';
    const termInput = document.createElement('input');
    termInput.type = 'text';
    termInput.value = existing?.term || term;

    const defLabel = document.createElement('label');
    defLabel.textContent = 'Plain-English meaning';
    const defInput = document.createElement('textarea');
    defInput.rows = 5;
    defInput.value = suggested || '';

    const cueLabel = document.createElement('label');
    cueLabel.textContent = 'Recall cue';
    const cueInput = document.createElement('input');
    cueInput.type = 'text';
    cueInput.value = existing?.cue || '';

    const actions = document.createElement('div');
    actions.className = 'glossary-term-actions';

    const save = document.createElement('button');
    save.type = 'submit';
    save.textContent = existing?.builtIn ? 'Save my version' : 'Save';

    const view = document.createElement('a');
    view.href = new URL('glossary.html', document.querySelector('.brand')?.href || location.href).href;
    view.textContent = 'Open A–Z Glossary';

    actions.append(save, view);
    form.append(h2, termLabel, termInput, defLabel, defInput, cueLabel, cueInput, actions);

    form.addEventListener('submit', event => {
      event.preventDefault();
      const item = {
        term: cleanText(termInput.value),
        definition: cleanText(defInput.value),
        cue: cleanText(cueInput.value)
      };
      if (!item.term || !item.definition) return;
      const items = customGlossary().filter(x => x.term.toLowerCase() !== item.term.toLowerCase());
      items.push(item);
      writeCustomGlossary(items);
      save.textContent = 'Saved ✓';
      window.setTimeout(closeGlossaryDialog, 500);
    });

    glossaryDialogBody.replaceChildren(form);
    defInput.focus();
    defInput.setSelectionRange(defInput.value.length, defInput.value.length);
  };

  const renderGlossaryPage = () => {
    const app = document.getElementById('glossary-app');
    if (!app) return;

    const entries = readGlossary();
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const present = new Set(entries.map(item => item.term[0]?.toUpperCase()).filter(Boolean));

    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'glossary-search';
    search.placeholder = 'Search glossary…';
    search.setAttribute('aria-label', 'Search glossary');

    const alphabet = document.createElement('nav');
    alphabet.className = 'glossary-alphabet';
    alphabet.setAttribute('aria-label', 'Glossary alphabet');

    letters.forEach(letter => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = letter;
      button.disabled = !present.has(letter);
      button.addEventListener('click', () => document.getElementById(`glossary-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      alphabet.appendChild(button);
    });

    const list = document.createElement('div');
    list.className = 'glossary-az';

    const draw = query => {
      list.replaceChildren();
      const q = cleanText(query).toLowerCase();
      const filtered = entries.filter(item =>
        !q || item.term.toLowerCase().includes(q) || (item.definition || '').toLowerCase().includes(q)
      );
      let current = '';
      filtered.forEach(item => {
        const letter = item.term[0]?.toUpperCase() || '#';
        if (letter !== current) {
          current = letter;
          const heading = document.createElement('h2');
          heading.id = `glossary-${letter}`;
          heading.className = 'glossary-letter';
          heading.textContent = letter;
          list.appendChild(heading);
        }

        const card = document.createElement('details');
        card.className = 'glossary-entry';
        const summary = document.createElement('summary');
        summary.textContent = item.term;
        const p = document.createElement('p');
        p.textContent = item.definition;
        card.append(summary, p);

        if (item.cue) {
          const cue = document.createElement('p');
          cue.className = 'recall';
          cue.innerHTML = '<strong>Recall cue:</strong> ';
          cue.append(document.createTextNode(item.cue));
          card.appendChild(cue);
        }

        const tools = document.createElement('div');
        tools.className = 'glossary-entry-tools';
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.textContent = item.builtIn ? 'Adapt' : 'Edit';
        edit.addEventListener('click', () => openGlossaryTerm(item.term));
        tools.appendChild(edit);

        if (!item.builtIn) {
          const remove = document.createElement('button');
          remove.type = 'button';
          remove.textContent = 'Remove';
          remove.addEventListener('click', () => {
            const items = customGlossary().filter(x => x.term.toLowerCase() !== item.term.toLowerCase());
            writeCustomGlossary(items);
          });
          tools.appendChild(remove);
        }
        card.appendChild(tools);
        list.appendChild(card);
      });

      if (!filtered.length) {
        const empty = document.createElement('p');
        empty.className = 'glossary-empty';
        empty.textContent = 'No matching terms yet.';
        list.appendChild(empty);
      }
    };

    search.addEventListener('input', () => draw(search.value));
    app.replaceChildren(search, alphabet, list);
    draw('');
  };

  renderGlossaryPage();

  // Permanent access from every page.
  const globalGlossary = document.createElement('button');
  globalGlossary.type = 'button';
  globalGlossary.className = 'global-glossary-button';
  globalGlossary.textContent = 'A–Z Glossary';
  globalGlossary.title = 'Open the glossary from anywhere';
  globalGlossary.addEventListener('click', () => {
    const selection = window.getSelection()?.toString() || '';
    if (cleanText(selection)) openGlossaryTerm(selection);
    else location.href = new URL('glossary.html', document.querySelector('.brand')?.href || location.href).href;
  });
  document.body.appendChild(globalGlossary);

  // Select or double-click a word/phrase anywhere in the document and offer
  // a one-click route into the glossary.
  const selectionChip = document.createElement('button');
  selectionChip.type = 'button';
  selectionChip.className = 'glossary-selection-chip';
  selectionChip.textContent = '+ Glossary';
  selectionChip.hidden = true;
  document.body.appendChild(selectionChip);

  let selectedGlossaryText = '';
  const positionSelectionChip = () => {
    const selection = window.getSelection();
    const text = cleanText(selection?.toString() || '');
    if (!selection || selection.rangeCount === 0 || !text || text.length > 90) {
      selectionChip.hidden = true;
      selectedGlossaryText = '';
      return;
    }
    const range = selection.getRangeAt(0);
    if (!body?.contains(range.commonAncestorContainer)) {
      selectionChip.hidden = true;
      return;
    }
    const rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) {
      selectionChip.hidden = true;
      return;
    }
    selectedGlossaryText = text;
    selectionChip.style.left = `${Math.max(8, Math.min(window.innerWidth - 120, rect.left + window.scrollX))}px`;
    selectionChip.style.top = `${Math.max(8, rect.bottom + window.scrollY + 7)}px`;
    selectionChip.hidden = false;
  };

  body?.addEventListener('mouseup', () => window.setTimeout(positionSelectionChip, 0));
  body?.addEventListener('keyup', () => window.setTimeout(positionSelectionChip, 0));
  selectionChip.addEventListener('mousedown', event => event.preventDefault());
  selectionChip.addEventListener('click', () => {
    const term = selectedGlossaryText;
    selectionChip.hidden = true;
    openGlossaryTerm(term);
  });

  document.addEventListener('mousedown', event => {
    if (event.target === selectionChip || event.target.closest('.glossary-dialog')) return;
    selectionChip.hidden = true;
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

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.title = 'Edit this answer here';

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Save';
    saveButton.title = 'Save the edited answer';
    saveButton.disabled = true;

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.title = 'Cancel editing';
    cancelButton.disabled = true;

    let answerEditor = null;
    let formatToolbar = null;

    const runFormat = (command, value = null) => {
      if (!answerEditor) return;
      answerEditor.focus({ preventScroll: true });
      document.execCommand(command, false, value);
    };

    const makeFormatButton = (label, title, command, value = null) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.title = title;
      button.addEventListener('mousedown', event => {
        event.preventDefault();
      });
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        runFormat(command, value);
      });
      return button;
    };

    const stopEditing = () => {
      if (!answerEditor) return;
      answerEditor.remove();
      formatToolbar?.remove();
      answerEditor = null;
      formatToolbar = null;
      copy.hidden = false;
      editButton.disabled = false;
      saveButton.disabled = true;
      cancelButton.disabled = true;
    };

    editButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if (answerEditor) return;

      resetAudio();

      formatToolbar = document.createElement('div');
      formatToolbar.className = 'answer-format-toolbar';
      formatToolbar.setAttribute('aria-label', 'Text formatting controls');

      const normal = makeFormatButton('Text', 'Normal paragraph', 'formatBlock', 'p');
      const h1 = makeFormatButton('H1', 'Heading 1', 'formatBlock', 'h1');
      const h2 = makeFormatButton('H2', 'Heading 2', 'formatBlock', 'h2');
      const bold = makeFormatButton('B', 'Bold', 'bold');
      const italic = makeFormatButton('I', 'Italic', 'italic');
      const bullets = makeFormatButton('• List', 'Bulleted list', 'insertUnorderedList');
      const numbers = makeFormatButton('1. List', 'Numbered list', 'insertOrderedList');

      formatToolbar.append(normal, h1, h2, bold, italic, bullets, numbers);

      answerEditor = document.createElement('div');
      answerEditor.className = 'answer-focus-editor';
      answerEditor.contentEditable = 'true';
      answerEditor.setAttribute('role', 'textbox');
      answerEditor.setAttribute('aria-multiline', 'true');
      answerEditor.setAttribute('aria-label', 'Edit this answer');
      answerEditor.spellcheck = true;
      answerEditor.innerHTML = copy.innerHTML;

      copy.hidden = true;
      copy.insertAdjacentElement('afterend', formatToolbar);
      formatToolbar.insertAdjacentElement('afterend', answerEditor);

      editButton.disabled = true;
      saveButton.disabled = false;
      cancelButton.disabled = false;

      requestAnimationFrame(() => {
        answerEditor.focus({ preventScroll: true });
      });
    });

    saveButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if (!answerEditor) return;

      const html = answerEditor.innerHTML.trim();
      copy.innerHTML = html;

      localStorage.setItem(editKeyFor(heading), html);
      applySavedToSource(heading, html);

      stopEditing();
      saveButton.textContent = 'Saved ✓';
      window.setTimeout(() => {
        saveButton.textContent = 'Save';
      }, 900);
    });

    cancelButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      stopEditing();
    });

    const glossaryButton = document.createElement('button');
    glossaryButton.type = 'button';
    glossaryButton.textContent = '+ Glossary';
    glossaryButton.title = 'Select a word or phrase in this answer, then add it to the glossary';
    glossaryButton.addEventListener('click', event => {
      event.stopPropagation();
      const selection = cleanText(window.getSelection()?.toString() || '');
      openGlossaryTerm(selection);
    });

    controls.append(play, stop, copyButton, editButton, saveButton, cancelButton, glossaryButton);

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
  const initAbeloMap = () => {
  const mapHost = document.querySelector('[data-abelo-map] #abeloWorldMap');
  if (!mapHost || mapHost.dataset.mapReady === 'true') return;
  mapHost.dataset.mapReady = 'true';

  const placements = [
    {
      lat: 53.35, lng: -6.26,
      title: 'Ireland — Emerald Airlines',
      date: 'Aug 2026',
      atr42: 0,
      atr72: 1,
      age: 'Existing aircraft; exact vintage not stated in the public acquisition announcement',
      history: 'Acquired in August 2026 as part of the Aergo portfolio, with the existing lease continuing to Emerald Airlines.'
    },
    {
      lat: 59.33, lng: 18.07,
      title: 'Sweden — Braathens Regional Airways',
      date: '2025',
      atr42: 0,
      atr72: 3,
      age: '2015/2016 vintage — about 10–11 years old in 2026',
      history: 'Three ATR 72s were acquired from Bramora in 2025 with their leases to Braathens already in place.'
    },
    {
      lat: 37.98, lng: 23.72,
      title: 'Greece — SKY express / Olympic Air',
      date: '2024',
      atr42: 0,
      atr72: 3,
      age: 'New 2024 deliveries',
      history: 'Two new ATR 72s were placed with SKY express and one new ATR 72 with Olympic Air from Abelo’s orderbook.'
    },
    {
      lat: 28.29, lng: -16.63,
      title: 'Canary Islands — Binter Canarias',
      date: 'Aug 2026',
      atr42: 0,
      atr72: 1,
      age: 'Existing aircraft; exact vintage not stated in the public acquisition announcement',
      history: 'Added in August 2026 through the Aergo portfolio acquisition, with the existing lease continuing to Binter.'
    },
    {
      lat: 4.71, lng: -74.07,
      title: 'Colombia — SATENA',
      date: 'May 2026',
      atr42: 1,
      atr72: 1,
      age: 'New deliveries — ATR 42 in Dec 2025; ATR 72 in May 2026',
      history: 'Abelo first placed an ATR 42 with SATENA, then followed with an ATR 72 as the airline continued its fleet modernisation.'
    },
    {
      lat: 4.18, lng: 73.51,
      title: 'Maldives — Maldivian',
      date: 'May 2025',
      atr42: 2,
      atr72: 0,
      age: 'New deliveries — May 2024 and May 2025',
      history: 'Two new ATR 42s were delivered to support Maldivian’s domestic fleet renewal programme.'
    },
    {
      lat: 23.81, lng: 90.41,
      title: 'Bangladesh — Air Astra',
      date: 'Sep 2026',
      atr42: 0,
      atr72: 3,
      age: 'Brand-new aircraft; all three delivered by Sep 2026',
      history: 'Three new ATR 72s were delivered under one fleet-expansion agreement for Air Astra’s domestic network.'
    },
    {
      lat: -4.33, lng: 15.31,
      title: 'DR Congo — Air Congo via Ethiopian Airlines Group',
      date: '2026',
      atr42: 0,
      atr72: 2,
      age: 'Brand-new 2026 deliveries',
      history: 'Two new ATR 72s from Abelo’s orderbook were placed with Ethiopian Airlines Group for operation by Air Congo.'
    },
    {
      lat: -6.21, lng: 106.85,
      title: 'Indonesia — Citilink',
      date: 'Aug 2026',
      atr42: 0,
      atr72: 2,
      age: 'Existing aircraft; exact vintages not stated in the public acquisition announcement',
      history: 'Two ATR 72s were added in August 2026 through the Aergo portfolio acquisition with leases already in place.'
    },
    {
      lat: -31.95, lng: 115.86,
      title: 'Australia — Aerlink / Air Navigator Group',
      date: '2026',
      atr42: 0,
      atr72: 1,
      age: '2007 build — about 19 years old in 2026',
      history: 'The ATR 72 was transitioned from Blue Islands to Aerlink in 2026 after repossession, inspection, maintenance and reconfiguration.'
    },
    {
      lat: 19.08, lng: 72.88,
      title: 'India — IndiGo',
      date: 'Mar 2024',
      atr42: 0,
      atr72: 4,
      age: 'Existing aircraft; exact vintages not stated in Abelo’s acquisition announcement',
      history: 'Four ATR 72s were acquired in March 2024 with their IndiGo leases already in place.'
    },
    {
      lat: -1.29, lng: 36.82,
      title: 'Kenya — Renegade Air',
      date: '2024',
      atr42: 0,
      atr72: 1,
      age: '2009 build — about 17 years old in 2026',
      history: 'An older ATR 72 passenger aircraft was converted to cargo configuration and delivered to Renegade Air in 2024.'
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

  const customerName = p => p.title.includes('—')
    ? p.title.split('—').slice(1).join('—').trim()
    : p.title;

  const popupHtml = p => `
      <div class="abelo-popup-card">
        <div class="abelo-popup-line abelo-popup-date">${escapeHtml(p.date)}</div>
        <div class="abelo-popup-line abelo-popup-customer">${escapeHtml(customerName(p))}</div>
        <div class="abelo-popup-line abelo-popup-ratio" aria-label="ATR 42 count ${escapeHtml(p.atr42)}, ATR 72 count ${escapeHtml(p.atr72)}">
          <strong>${escapeHtml(p.atr42)} / ${escapeHtml(p.atr72)}</strong>
          <span>ATR 42 / ATR 72</span>
        </div>
      </div>`;

  loadLeaflet().then(L => {
    const map = L.map(mapHost, { scrollWheelZoom: false, worldCopyJump: true }).setView([18, 15], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 7,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    placements.forEach(p => {
      L.marker([p.lat, p.lng])
        .addTo(map)
        .bindPopup(popupHtml(p), { maxWidth: 460, minWidth: 360 });
    });

    const group = L.featureGroup(placements.map(p => L.marker([p.lat, p.lng])));
    map.fitBounds(group.getBounds().pad(0.18), { maxZoom: 2 });
  }).catch(() => {
    mapHost.innerHTML = '<p style="padding:1rem">Interactive map unavailable. The placement list below remains available.</p>';
  });
  };

  initAbeloMap();
  document.addEventListener('abeloResearchRendered', initAbeloMap);
})();


// Render the detailed Abelo research summary outside Pages CMS rich-text parsing.
(() => {
  const body = document.getElementById('docBody');
  if (!body) return;

  const marker = [...body.querySelectorAll('p')].find(p => p.textContent.trim() === 'ABEL0_RESEARCH_WIDGET');
  if (!marker) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'abelo-research-widget';
  wrapper.innerHTML = `
    <h3>Erik's 30-second summary</h3>
    <p><strong>Abelo is a Dublin-based B2B aircraft lessor specialising in regional turboprop aircraft.</strong> It does not sell tickets to passengers. It owns or finances aircraft and places them with airlines, then manages the commercial, financial and technical life of those assets.</p>
    <p>The business sits at the intersection of <strong>finance, aircraft, data, asset management, risk and sustainability</strong>. For Erik, that is the important connection: a Financial Mathematics degree can be applied to real assets with long lives, large capital values and uncertain future cash flows.</p>

    <h3>What has changed since Abelo was founded?</h3>
    <p>Abelo was created in <strong>2022</strong> and has moved quickly from a relatively new platform into a growing specialist lessor.</p>
    <ul>
      <li><strong>May 2025 — Cerberus acquired Abelo</strong> from funds managed by Oaktree Capital Management.</li>
      <li><strong>2025 — Abelo secured a warehouse financing facility of up to $750 million</strong> to support fleet and customer growth.</li>
      <li><strong>March 2026 — Abelo said it had 36 firm ATR aircraft ordered</strong>, with another nine options and purchase rights.</li>
      <li>Its newer placements show an increasingly international customer base across <strong>Europe, Latin America, Africa, Asia and Australia</strong>.</li>
    </ul>
    <p>That growth matters because an aircraft lessor is not simply buying planes. It has to decide <strong>which aircraft to buy, how to finance them, which airlines and markets to place them with, what lease structure to use, how to manage technical transitions, and what the aircraft may be worth years later</strong>.</p>

    <h3>The aircraft strategy | ATR 42 and ATR 72</h3>
    <p>Abelo's strategy is centred on larger regional turboprops, particularly the <strong>ATR 42-600</strong> and <strong>ATR 72-600</strong>. Modern turboprops are designed for shorter regional sectors where a jet may be unnecessarily expensive or inefficient.</p>
    <p>In January 2025, an earlier order for ten ATR 42 STOL aircraft was converted into <strong>five ATR 42-600 and five ATR 72-600 aircraft</strong>, with three further ATR 72-600s added.</p>

    <h3>Fleet mix | Documented aircraft by model</h3>
    <p>This chart counts the <strong>Abelo-linked aircraft individually documented in the research on this site</strong>. It is a verified subset of Abelo’s wider portfolio, which the company describes as more than 60 turboprop aircraft; it is not presented as a complete proprietary fleet register.</p>
    <div class="abelo-fleet-chart" role="img" aria-label="Documented Abelo aircraft by model: ATR 42-600 3, ATR 72-500 2, ATR 72-600 20, Dash 8-400 2">
      <div class="abelo-fleet-chart__plot">
        <div class="abelo-fleet-bar" style="--value:3; --max:20">
          <strong class="abelo-fleet-bar__value">3</strong>
          <span class="abelo-fleet-bar__column"></span>
          <span class="abelo-fleet-bar__label">ATR 42-600</span>
        </div>
        <div class="abelo-fleet-bar" style="--value:2; --max:20">
          <strong class="abelo-fleet-bar__value">2</strong>
          <span class="abelo-fleet-bar__column"></span>
          <span class="abelo-fleet-bar__label">ATR 72-500</span>
        </div>
        <div class="abelo-fleet-bar" style="--value:20; --max:20">
          <strong class="abelo-fleet-bar__value">20</strong>
          <span class="abelo-fleet-bar__column"></span>
          <span class="abelo-fleet-bar__label">ATR 72-600</span>
        </div>
        <div class="abelo-fleet-bar" style="--value:2; --max:20">
          <strong class="abelo-fleet-bar__value">2</strong>
          <span class="abelo-fleet-bar__column"></span>
          <span class="abelo-fleet-bar__label">Dash 8-400</span>
        </div>
      </div>
      <p class="abelo-fleet-chart__note"><strong>27 aircraft documented here.</strong> The bars show the researched subset, not Abelo’s complete 60+ aircraft portfolio.</p>
    </div>

    <h3>ATR fleet map | Type, age and fleet history</h3>
    <p>The map below shows <strong>documented Abelo-linked ATR placements</strong>. It is a portfolio-learning map, <strong>not live aircraft tracking</strong>.</p>
    <p><strong>Click a marker for a deliberately simple fleet card</strong>: ATR 42 count, ATR 72 count, age or vintage, and a short fleet-history note. Counts refer to the Abelo-linked aircraft identified in the public material shown here, <strong>not the airline’s total fleet</strong>.</p>
    <div class="abelo-map" data-abelo-map>
      <div class="abelo-map-canvas" id="abeloWorldMap" role="img" aria-label="World map of documented Abelo aircraft placements"></div>
      <p class="abelo-map-note"><strong>Map key:</strong> each marker shows only ATR 42 / ATR 72 cardinality, age or vintage, and a short Abelo fleet-history note. Locations are operating markets, not live aircraft positions.</p>
    </div>

    <h3>What one transaction actually involves</h3>
    <p>A useful example is the February 2026 transition of an <strong>ATR 72-500 to Air Navigator Group / Aerlink in Australia</strong>. Abelo said the work included <strong>repossession from Blue Islands, inspection, maintenance and reconfiguration to the new operator's specification in less than 100 days</strong>.</p>
    <p>That is a good picture of aircraft asset management. The job does not stop when a lease is signed. A lessor has to coordinate technical condition, documentation, maintenance, transition timing, customer requirements and the economics of keeping an expensive asset earning revenue.</p>

    <h3>How Abelo makes money | Think like an asset manager</h3>
    <p><strong>Raise capital → acquire aircraft → lease aircraft → collect lease cash flows → manage risk and maintenance → transition or sell the aircraft → manage residual value.</strong></p>
    <ul>
      <li><strong>Cash-flow modelling:</strong> lease rentals, deposits, maintenance reserves and financing payments.</li>
      <li><strong>Present value:</strong> comparing future lease income with the price paid for the asset.</li>
      <li><strong>Interest-rate risk:</strong> aircraft are capital-intensive and financing costs matter.</li>
      <li><strong>Credit risk:</strong> the airline must remain capable of meeting its lease obligations.</li>
      <li><strong>Residual-value risk:</strong> what will the aircraft be worth at the end of a lease?</li>
      <li><strong>Portfolio risk:</strong> diversification by airline, region, aircraft type and lease maturity.</li>
      <li><strong>Scenario analysis:</strong> fuel prices, rates, inflation, airline demand and aircraft values can all change.</li>
    </ul>

    <h3>Growth and financing | Why the $750m facility matters</h3>
    <p>A warehouse facility gives a lessor a pool of financing that can be drawn to acquire aircraft before those assets are refinanced, sold or moved into longer-term structures.</p>
    <p>Abelo had also previously announced a <strong>$190 million financing facility for a 20-turboprop portfolio</strong>, involving MUFG, Deutsche Bank and Société Générale.</p>

    <h3>Sustainability | More than a slogan</h3>
    <p>Abelo repeatedly describes turboprops as part of the transition toward lower-emission regional aviation. ATR states that its aircraft emit <strong>about 45% less CO₂ than similar-size regional jets</strong>.</p>
    <p><strong>Right-sized aircraft + lower fuel burn on suitable regional routes + access to smaller airports + replacement of older aircraft = a commercial as well as environmental proposition.</strong></p>

    <h3>What Erik should be able to say</h3>
    <p><strong>Specialist lessor → turboprops → global placements → finance → asset management → sustainable regional connectivity.</strong></p>
    <blockquote><p>“Abelo is a Dublin-based specialist turboprop lessor rather than an airline. What interests me is that the business combines aircraft with finance and asset management. It has been growing quickly, including a major ATR orderbook and international placements across Europe, Latin America, Africa, Asia and Australia. From a Financial Mathematics perspective, I can see direct links to cash flows, valuation, credit risk, financing, portfolio decisions and residual values.”</p></blockquote>

    <h3>News evidence | What the announcements tell us</h3>
    <ul>
      <li><strong>Cerberus acquisition:</strong> investor backing and a new growth phase.</li>
      <li><strong>$750m warehouse facility:</strong> capital available to scale the fleet.</li>
      <li><strong>ATR orderbook expansion:</strong> confidence in the underlying aircraft type and future demand.</li>
      <li><strong>SATENA / Colombia:</strong> repeat placement from the orderbook.</li>
      <li><strong>Air Astra / Bangladesh:</strong> three brand-new ATR 72-600s into a growing domestic market.</li>
      <li><strong>Maldivian:</strong> sale-and-leaseback and finance-lease examples.</li>
      <li><strong>Braathens / Sweden:</strong> acquisition of aircraft already on lease.</li>
      <li><strong>Aergo portfolio:</strong> diversification across five new operators and several regions.</li>
      <li><strong>Aerlink / Australia:</strong> hands-on aircraft transition and technical asset management.</li>
      <li><strong>IndiGo / India:</strong> four ATR 72-600s acquired while already on lease.</li>
      <li><strong>Renegade Air / Kenya:</strong> passenger-to-cargo conversion extending useful asset life.</li>
    </ul>
  `;

  marker.replaceWith(wrapper);

  // Fire a custom event so the map initializer can run after the map container exists.
  document.dispatchEvent(new CustomEvent('abeloResearchRendered'));
})();
