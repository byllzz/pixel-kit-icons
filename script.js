(function () {
  // Normalize CSS color to 6-digit hex like "#rrggbb"
  function toHex(color) {
    if (!color) return '#000000';
    color = color.trim();
    if (color[0] === '#') {
      const hex = color.slice(1);
      if (hex.length === 3) {
        return (
          '#' +
          hex
            .split('')
            .map(c => c + c)
            .join('')
            .toLowerCase()
        );
      }
      if (hex.length === 6) return ('#' + hex).toLowerCase();
    }
    const rgbMatch = color.match(/rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return (
        '#' +
        [r, g, b]
          .map(n => n.toString(16).padStart(2, '0'))
          .join('')
          .toLowerCase()
      );
    }
    try {
      const el = document.createElement('div');
      el.style.color = color;
      document.body.appendChild(el);
      const cs = getComputedStyle(el).color;
      document.body.removeChild(el);
      const m = cs.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (m) {
        return '#' + [1, 2, 3].map(i => parseInt(m[i], 10).toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {}
    return '#000000';
  }

  // Setting css variable on :root
  function setRoot(k, v) {
    document.documentElement.style.setProperty(k, v);
  }

  // here Applying icon color to CSS var
  function applyIconColor(hex) {
    setRoot('--icon-color', hex);
    if (colorSwatch) colorSwatch.style.backgroundColor = hex;
    if (colorName) colorName.textContent = hex;
    document.querySelectorAll('.icon-card').forEach(c => (c.style.color = hex));
  }

  // Saving all progress to localStorage
  const LS = {
    prefix: 'pixelicons:',
    set(k, v) {
      try {
        localStorage.setItem(this.prefix + k, JSON.stringify(v));
      } catch (e) {}
    },
    get(k, fallback = null) {
      try {
        const v = localStorage.getItem(this.prefix + k);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    rm(k) {
      try {
        localStorage.removeItem(this.prefix + k);
      } catch (e) {}
    },
  };

  //  all selectors used inside the functioning..
  const themetoggleInput = document.querySelector('.toggle');
  const iconsGrid = document.getElementById('iconsGrid');
  const searchInput = document.getElementById('icon-search');
  const iconSizeRange = document.getElementById('iconSizeRange');
  const iconSizeNum = document.getElementById('iconSize-num');
  const colorInput = document.getElementById('icon-color-input');
  const colorSwatch = document.getElementById('color-swatch');
  const colorName = document.getElementById('color-name');
  const downloadAllBtn = document.getElementById('downloadAllBtn');

  // some configration
  const savedTheme = LS.get('theme', null); // true/false/null
  const savedColor = LS.get('color', null); // '#rrggbb' or null
  const savedColorUserSet = LS.get('colorUserSet', false); // bool
  const savedSize = LS.get('size', null); // number
  const savedWeight = LS.get('weight', null); // may be unused if custom-select removed
  const savedSearch = LS.get('search', '');

  // Apply saved theme
  if (savedTheme !== null) {
    document.documentElement.classList.toggle('theme', savedTheme === true);
    if (themetoggleInput) themetoggleInput.checked = !!savedTheme;
  }

  // Function to get the computed theme text color
  function themeTxtColorHex() {
    const txt = getComputedStyle(document.documentElement).getPropertyValue('--txt-color') || '';
    return toHex(txt || '#ffffff');
  }

  // Initialize icon size
  const initSize =
    savedSize !== null ? String(savedSize) : iconSizeRange ? iconSizeRange.value : '30';
  if (iconSizeRange) {
    iconSizeRange.value = initSize;
    if (iconSizeNum) iconSizeNum.textContent = initSize + 'px';
    setRoot('--icon-size', initSize + 'px');
  }

  // Initialize icon color preference:
  const initialHex =
    savedColor || themeTxtColorHex() || toHex((colorInput && colorInput.value) || '#ffffff');

  if (colorInput) colorInput.value = initialHex;
  if (colorSwatch) colorSwatch.style.backgroundColor = initialHex;
  if (colorName) colorName.textContent = initialHex;
  setRoot('--icon-color', initialHex);

  // theme toggle behaviour
  if (themetoggleInput) {
    themetoggleInput.addEventListener('change', () => {
      const checked = !!themetoggleInput.checked;
      document.documentElement.classList.toggle('theme', checked);
      LS.set('theme', checked);

      setTimeout(() => {
        const currentThemeTxt = themeTxtColorHex();
        const userSet = LS.get('colorUserSet', false);
        if (!userSet) {
          if (colorInput) colorInput.value = currentThemeTxt;
          applyIconColor(currentThemeTxt);
          LS.set('color', currentThemeTxt);
          LS.set('colorUserSet', false);
        } else {
          const saved =
            LS.get('color', null) ||
            toHex(
              getComputedStyle(document.documentElement).getPropertyValue('--icon-color') ||
                '#000000',
            );
          applyIconColor(saved);
        }
      }, 0);
    });
  }

  //  color input
  if (colorInput) {
    colorInput.addEventListener('input', () => {
      const v = toHex(colorInput.value);
      if (colorInput.value.toLowerCase() !== v) colorInput.value = v;
      applyIconColor(v);
      LS.set('color', v);
      LS.set('colorUserSet', true);
    });
  }

  //  icon size input
  if (iconSizeRange) {
    iconSizeRange.addEventListener('input', () => {
      const v = iconSizeRange.value;
      const px = v + 'px';
      if (iconSizeNum) iconSizeNum.textContent = px;
      document.querySelectorAll('.icon-card svg').forEach(svg => {
        svg.style.height = px;
        svg.style.width = px;
      });
      setRoot('--icon-size', px);
      LS.set('size', Number(v));
    });
  }

  // the process to fetch icons >> (here I gain helped from chatgpt , as I am still learning...)
  const VERSION = '1.8.1';
  const SVG_INDEX_URL = `https://cdn.jsdelivr.net/npm/pixelarticons@${VERSION}/svg/`;

  async function fetchIndex() {
    try {
      const res = await fetch(SVG_INDEX_URL);
      if (!res.ok) throw new Error('index fetch failed: ' + res.status);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const anchors = Array.from(doc.querySelectorAll('a')).filter(
        a => typeof a.textContent === 'string' && a.textContent.trim().endsWith('.svg'),
      );
      return anchors.map(a => a.textContent.trim());
    } catch (err) {
      console.error('Failed to fetch svg index:', err);
      return null;
    }
  }

  async function fetchSvgText(name) {
    const url = SVG_INDEX_URL + encodeURIComponent(name);
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error('svg fetch failed: ' + r.status);
      return await r.text();
    } catch (err) {
      console.warn('failed to fetch', name, err);
      return null;
    }
  }

  // loadIcons: creates cards, inlines SVGs and wires copy button per-card
  async function loadIcons(names, { limit = 30, max = 400 } = {}) {
    const toLoad = names.slice(0, max);
    const frag = document.createDocumentFragment();

    const currentIconColor = toHex(
      getComputedStyle(document.documentElement).getPropertyValue('--icon-color') ||
        colorInput?.value ||
        '#000000',
    );

    const placeholders = toLoad.map(name => {
      const card = document.createElement('div');
      card.className = 'icon-card';
      card.style.color = currentIconColor;
      card.innerHTML = `
      <div class="icon-wrap" aria-hidden="true">…</div>
      <div class="icon-name">${name.replace('.svg', '')}</div>
      <button class="icon-card-copybtn" type="button" aria-label="Copy SVG">
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M4 2h11v2H6v13H4V2zm4 4h12v16H8V6zm2 2v12h8V8h-8z" fill="currentColor"/>
        </svg>
      </button>
    `;
      frag.appendChild(card);
      return { name, card };
    });
    if (iconsGrid) iconsGrid.appendChild(frag);

    for (let i = 0; i < placeholders.length; i += limit) {
      const batch = placeholders.slice(i, i + limit);
      await Promise.all(
        batch.map(async ({ name, card }) => {
          const svgText = await fetchSvgText(name);
          const wrap = card.querySelector('.icon-wrap');

          if (!svgText) {
            if (wrap) wrap.textContent = '?';
            return;
          }

          const tmp = document.createElement('div');
          tmp.innerHTML = svgText.trim();
          const svgEl = tmp.querySelector('svg');
          if (!svgEl) {
            if (wrap) wrap.textContent = '?';
            return;
          }

          svgEl.querySelectorAll('[fill]').forEach(el => {
            try {
              el.setAttribute('fill', 'currentColor');
            } catch (e) {}
          });

          if (!svgEl.getAttribute('xmlns'))
            svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');

          const iconSize =
            getComputedStyle(document.documentElement).getPropertyValue('--icon-size') || '24px';
          svgEl.style.width = iconSize;
          svgEl.style.height = iconSize;

          if (wrap) {
            wrap.innerHTML = '';
            wrap.appendChild(svgEl);
          }

          // copy button
          const copyBtn = card.querySelector('.icon-card-copybtn');
          if (copyBtn) {
            const origHTML = copyBtn.innerHTML;
            const showCopied = () => {
              copyBtn.innerHTML = 'Copied!';
              copyBtn.classList.add('copied');
              setTimeout(() => {
                copyBtn.innerHTML = origHTML;
                copyBtn.classList.remove('copied');
              }, 1000);
            };

            copyBtn.addEventListener('click', async ev => {
              ev.stopPropagation();
              try {
                const serializer = new XMLSerializer();
                const svgString = serializer.serializeToString(svgEl);

                if (navigator.clipboard && navigator.clipboard.writeText) {
                  await navigator.clipboard.writeText(svgString);
                } else {
                  const ta = document.createElement('textarea');
                  ta.value = svgString;
                  ta.style.position = 'fixed';
                  ta.style.left = '-9999px';
                  document.body.appendChild(ta);
                  ta.select();
                  try {
                    document.execCommand('copy');
                  } finally {
                    document.body.removeChild(ta);
                  }
                }
                showCopied();
              } catch (err) {
                console.error('Copy failed', err);
                alert(
                  'Could not copy SVG automatically. Right-click the icon and "Inspect" to get the markup.',
                );
              }
            });
          }
        }),
      );
      await new Promise(r => setTimeout(r, 60));
    }
  }

  const FALLBACK_NAMES = [
    'check.svg',
    'close.svg',
    'arrow-right.svg',
    'arrow-left.svg',
    'user.svg',
    'search.svg',
  ];

  //  here the main things >loading icons & search functionality
  (async function init() {
    if (searchInput) {
      const q = savedSearch || '';
      searchInput.value = q;
      searchInput.addEventListener('input', () => {
        const val = searchInput.value.trim();
        LS.set('search', val);
        const qLower = val.toLowerCase();
        document.querySelectorAll('.icon-card').forEach(card => {
          const name = (card.querySelector('.icon-name')?.textContent || '').toLowerCase();
          card.style.display = name.includes(qLower) ? '' : 'none';
        });
      });
    }

    // Load icons
    let names = await fetchIndex();
    if (!names || !names.length) {
      console.warn('Using fallback icons (could not fetch index).');
      names = FALLBACK_NAMES;
    }
    await loadIcons(names, { limit: 30, max: 400 });

    // apply search filter from saved search immediately to loaded cards
    if (searchInput && searchInput.value) {
      const qLower = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.icon-card').forEach(card => {
        const name = (card.querySelector('.icon-name')?.textContent || '').toLowerCase();
        card.style.display = name.includes(qLower) ? '' : 'none';
      });
    }
  })();

  // locations to go
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', () => {
      window.open(SVG_INDEX_URL, '_blank', 'noopener');
    });
  }

  const githubbtn = document.getElementById('github');
  if (githubbtn) {
    githubbtn.addEventListener('click', () => {
      window.open('https://github.com/byllzz', '_blank', 'noopener');
    });
  }

  // debug API
  window._pixelIcons = {
    ls: LS,
    applyIconColor,
    toHex,
  };
})();
