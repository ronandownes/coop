(() => {
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

  // First click opens and pins the menu; a second click follows the section link.
  document.querySelectorAll('.navitem > .navlabel').forEach(label => {
    const item = label.closest('.navitem');
    const menu = item?.querySelector(':scope > .dropmenu');
    if (!menu) return;
    label.addEventListener('click', event => {
      if (item.classList.contains('is-open')) return;
      event.preventDefault();
      event.stopPropagation();
      closeNavMenus(item);
      item.classList.add('is-open');
      item.querySelector('[data-nav-toggle]')?.setAttribute('aria-expanded', 'true');
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

  restoreSavedAnswers();

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

    const select = document.createElement('button');
    select.type = 'button';
    select.textContent = 'Select';
    select.title = 'Select the full answer for copying';
    select.addEventListener('click', event => {
      event.stopPropagation();
      selectContent(copy);
      const original = select.textContent;
      select.textContent = 'Selected';
      window.setTimeout(() => { select.textContent = original; }, 900);
    });

    const edit = document.createElement('button');
    edit.type = 'button';
    edit.textContent = 'Edit';
    edit.title = 'Make a temporary local edit while settling the answer';

    const bold = document.createElement('button');
    bold.type = 'button';
    bold.textContent = 'B';
    bold.title = 'Bold or unbold the selected words';
    bold.hidden = true;

    const save = document.createElement('button');
    save.type = 'button';
    save.className = 'answer-focus-save';
    save.textContent = 'Save';
    save.hidden = true;

    const hint = document.createElement('div');
    hint.className = 'answer-focus-hint';
    hint.hidden = true;
    hint.textContent = 'Local rehearsal edit. Use Open CMS to commit permanent wording to GitHub.';

    const setEditing = on => {
      resetAudio();
      copy.toggleAttribute('contenteditable', on);
      copy.toggleAttribute('spellcheck', on);
      edit.textContent = on ? 'Cancel' : 'Edit';
      bold.hidden = !on;
      save.hidden = !on;
      hint.hidden = !on;
      if (on) copy.focus({ preventScroll: true });
    };

    const toggleBold = () => {
      if (copy.getAttribute('contenteditable') !== 'true') return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
      const range = selection.getRangeAt(0);
      if (!copy.contains(range.commonAncestorContainer)) return;
      document.execCommand('bold', false, null);
    };

    copy.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b' && copy.getAttribute('contenteditable') === 'true') {
        event.preventDefault();
        toggleBold();
      }
    });

    bold.addEventListener('mousedown', event => event.preventDefault());
    bold.addEventListener('click', event => {
      event.stopPropagation();
      toggleBold();
    });

    edit.addEventListener('click', event => {
      event.stopPropagation();
      const editing = copy.getAttribute('contenteditable') === 'true';
      if (editing) {
        const fresh = cloneAnswer(heading);
        copy.innerHTML = fresh.innerHTML;
        setEditing(false);
      } else {
        setEditing(true);
      }
    });

    save.addEventListener('click', event => {
      event.stopPropagation();
      const html = copy.innerHTML;
      localStorage.setItem(editKeyFor(heading), html);
      applySavedToSource(heading, html);
      setEditing(false);
      save.textContent = 'Saved';
      window.setTimeout(() => { save.textContent = 'Save'; }, 1000);
    });

    controls.append(play, stop, select, edit, bold, save);

    if (pageEdit?.href) {
      const cms = document.createElement('a');
      cms.href = `${pageEdit.href.split('#')[0]}#:~:text=${encodeURIComponent(sourceHeadingText(heading))}`;
      cms.target = '_blank';
      cms.rel = 'noopener';
      cms.textContent = 'Open CMS';
      cms.title = 'Open this page in Pages CMS for a permanent edit';
      controls.appendChild(cms);
    }

    focusContent.replaceChildren(title, controls, hint, copy);
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

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !overlay.hidden) closeFocus();
  });
  window.addEventListener('pagehide', resetAudio);
  window.addEventListener('beforeunload', resetAudio);
})();
