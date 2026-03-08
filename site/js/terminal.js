/**
 * Terminal - Интерактивный эмулятор терминала Claude Code.
 * Поддерживает слэш-команды с анимированными ответами.
 */

class Terminal {
  constructor() {
    this.history = [];
    this.historyIndex = -1;
    this.isAnimating = false;
    this.collapsed = false;
    this.resizing = false;
    this.panel = null;
    this.output = null;
    this.input = null;
    this._activeLoop = null;
  }

  init() {
    this.panel = document.getElementById('terminal-panel');
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    if (!this.panel || !this.output || !this.input) return;

    this._setupInput();
    this._setupHeader();
    this._setupResize();
    this._showWelcome();
  }

  _setupInput() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = this.input.value.trim();
        if (cmd && !this.isAnimating) {
          this._execute(cmd);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this._navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this._navigateHistory(1);
      }
    });
    // Prevent global keyboard nav when terminal is focused
    this.input.addEventListener('keydown', (e) => {
      e.stopPropagation();
    });
  }

  _setupHeader() {
    const header = this.panel.querySelector('.terminal-header');
    const chevron = this.panel.querySelector('.terminal-header__chevron');

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    // On mobile, header/chevron taps close the terminal instead of collapsing
    const handleToggle = () => {
      if (isMobile()) {
        this._closeMobile();
      } else {
        this._toggleCollapse();
      }
    };

    if (header) {
      header.addEventListener('click', (e) => {
        if (e.target.closest('.terminal-header__btn')) return;
        handleToggle();
      });
    }
    if (chevron) {
      chevron.addEventListener('click', (e) => {
        e.stopPropagation();
        handleToggle();
      });
    }
  }

  _closeMobile() {
    this.panel.classList.remove('mobile-open');
    this.panel.style.display = 'none';
  }

  _setupResize() {
    const handle = this.panel.querySelector('.terminal-resize');
    if (!handle) return;

    const mainLayout = this.panel.closest('.main-layout');
    if (!mainLayout) return;

    let startX, startWidth;

    const onMouseMove = (e) => {
      if (!this.resizing) return;
      const delta = startX - e.clientX;
      const maxWidth = mainLayout.offsetWidth - 300; // leave room for sidebar + content
      const newWidth = Math.max(200, Math.min(startWidth + delta, maxWidth));
      this.panel.style.width = newWidth + 'px';
    };

    const onMouseUp = () => {
      this.resizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.resizing = true;
      startX = e.clientX;
      startWidth = this.panel.offsetWidth;
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  _toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.panel.classList.toggle('collapsed', this.collapsed);
    if (!this.collapsed) {
      this.input.focus();
    }
  }

  _showWelcome() {
    this._appendHtml(`
      <div class="term-welcome-banner">
        <div class="term-brand">
          <div class="term-brand__rule"></div>
          <pre class="term-brand__ascii"><span class="term-brand__char-bright">█▀▀ ▀▄▀ █▀█ █   █▀█ █▀█ █▀▀</span>
<span class="term-brand__char-bright">█▀▀  █  █▀▀ █   █ █ █▀▄ █▀▀</span>
<span class="term-brand__char-bright">▀▀▀ ▀ ▀ ▀   ▀▀▀ ▀▀▀ ▀ ▀ ▀▀▀</span></pre>
          <pre class="term-brand__ascii term-brand__ascii--sub"><span class="term-brand__char-accent">█▀▀ █   █▀█ █ █ █▀▄ █▀▀</span>
<span class="term-brand__char-accent">█   █   █▀█ █ █ █ █ █▀▀</span>
<span class="term-brand__char-accent">▀▀▀ ▀▀▀ ▀ ▀ ▀▀▀ ▀▀▀ ▀▀▀</span>
<span class="term-brand__char-dim">█▀▀ █▀█ █▀▄ █▀▀</span>
<span class="term-brand__char-dim">█   █ █ █ █ █▀▀</span>
<span class="term-brand__char-dim">▀▀▀ ▀▀▀ ▀▀▀ ▀▀▀</span></pre>
          <div class="term-brand__rule"></div>
        </div>

        <div class="term-banner-tagline">
          Учись на практике. Каждый файл — урок.<br>
          Каждая папка — глава.
        </div>

        <div class="term-banner-divider"></div>

        <div class="term-banner-section">
          <div class="term-banner-section__title">Быстрый старт</div>
          <div class="term-banner-cmd-row">
            <span class="term-text--accent">/help</span>
            <span class="term-text--dim">- список всех команд</span>
          </div>
          <div class="term-banner-cmd-row">
            <span class="term-text--accent">/init</span>
            <span class="term-text--dim">- смотри, как создаётся CLAUDE.md</span>
          </div>
          <div class="term-banner-cmd-row">
            <span class="term-text--accent">/doctor</span>
            <span class="term-text--dim">- запустить диагностику</span>
          </div>
          <div class="term-banner-cmd-row">
            <span class="term-text--accent">/diff</span>
            <span class="term-text--dim">- демо живого diff</span>
          </div>
        </div>

        <div class="term-banner-divider"></div>

        <div class="term-banner-section">
          <div class="term-banner-section__title">Как исследовать</div>
          <div class="term-banner-step">
            <span class="term-banner-step__num">1</span>
            <span>Просматривай дерево файлов слева</span>
          </div>
          <div class="term-banner-step">
            <span class="term-banner-step__num">2</span>
            <span>Кликни на любой файл, чтобы узнать, что он делает</span>
          </div>
          <div class="term-banner-step">
            <span class="term-banner-step__num">3</span>
            <span>Пробуй команды здесь, чтобы увидеть их в действии</span>
          </div>
        </div>

        <div class="term-banner-divider"></div>

        <div class="term-banner-info">
          <div class="term-banner-row">
            <span class="term-banner-key">версия</span>
            <span class="term-banner-val">1.0.42</span>
          </div>
          <div class="term-banner-row">
            <span class="term-banner-key">модель</span>
            <span class="term-banner-val term-text--accent">claude-opus-4-6</span>
          </div>
          <div class="term-banner-row">
            <span class="term-banner-key">проект</span>
            <span class="term-banner-val">my-project</span>
          </div>
        </div>
      </div>
    `);
  }

  _execute(rawCmd) {
    // Store in history
    this.history.push(rawCmd);
    this.historyIndex = this.history.length;

    // Echo the command
    this._appendHtml(`
      <div class="term-cmd">
        <span class="term-prompt-echo">claude &gt;</span> ${this._esc(rawCmd)}
      </div>
    `);

    this.input.value = '';

    // Parse command
    const cmd = rawCmd.startsWith('/') ? rawCmd.split(/\s+/)[0].toLowerCase() : rawCmd.toLowerCase();

    // Route to handler
    const handlers = {
      '/help': () => this._cmdHelp(),
      '/init': () => this._cmdInit(),
      '/doctor': () => this._cmdDoctor(),
      '/cost': () => this._cmdCost(),
      '/compact': () => this._cmdCompact(),
      '/model': () => this._cmdModel(),
      '/diff': () => this._cmdDiff(),
      '/clear': () => this._clearOutput(),
      '/status': () => this._cmdStatus(),
      '/config': () => this._cmdConfig(),
      '/memory': () => this._cmdMemory(),
      '/loop': () => this._cmdLoop(rawCmd),
      '/fast': () => this._cmdFast(),
      '/rewind': () => this._cmdRewind(),
      '/sandbox': () => this._cmdSandbox(),
      '/keybindings': () => this._cmdKeybindings(),
    };

    if (handlers[cmd]) {
      handlers[cmd]();
    } else {
      this._appendHtml(`
        <div class="term-block">
          <div class="term-text--error">Неизвестная команда: ${this._esc(rawCmd)}</div>
          <div class="term-text--dim">Введите <span class="term-text--accent">/help</span> чтобы увидеть доступные команды.</div>
        </div>
      `);
    }

    this._scrollToBottom();
  }

  _navigateHistory(direction) {
    if (this.history.length === 0) return;
    this.historyIndex = Math.max(0, Math.min(this.historyIndex + direction, this.history.length));
    this.input.value = this.historyIndex < this.history.length ? this.history[this.historyIndex] : '';
  }

  // ── Command Handlers ──────────────────────────────────────

  _cmdHelp() {
    const cmds = [
      ['/help', 'Показать справку по командам'],
      ['/init', 'Инициализировать файл CLAUDE.md проекта'],
      ['/doctor', 'Проверить состояние установки'],
      ['/cost', 'Показать использование токенов и стоимость сессии'],
      ['/compact', 'Сжать контекст разговора'],
      ['/model', 'Посмотреть доступные модели'],
      ['/diff', 'Показать незакоммиченные изменения'],
      ['/status', 'Версия, модель и информация об аккаунте'],
      ['/config', 'Открыть обозреватель настроек'],
      ['/memory', 'Посмотреть записи авто-памяти'],
      ['/loop', 'Запустить команду с повторением по интервалу'],
      ['/fast', 'Переключить fast mode (ускорение Opus 4.6)'],
      ['/rewind', 'Откат к предыдущему состоянию'],
      ['/sandbox', 'Настроить режим песочницы'],
      ['/keybindings', 'Открыть настройки горячих клавиш'],
      ['/clear', 'Очистить вывод терминала'],
    ];

    let rows = '';
    for (const [cmd, desc] of cmds) {
      rows += `<div class="term-row"><span class="term-col term-col--cmd">${cmd}</span><span class="term-col term-col--desc">${desc}</span></div>`;
    }

    this._appendHtml(`
      <div class="term-block">
        <div class="term-heading">Доступные команды</div>
        <div class="term-table">${rows}</div>
        <hr class="term-hr">
        <div class="term-text--dim">Совет: Используйте стрелки для навигации по истории команд.</div>
      </div>
    `);
  }

  _cmdInit() {
    this._animateSequence([
      { html: '<div class="term-text--dim">Сканирование структуры проекта...</div>', delay: 400 },
      { html: '<div class="term-text">Найдено: package.json, tsconfig.json, src/</div>', delay: 600 },
      { html: '<div class="term-text--dim">Генерация контекста проекта...</div>', delay: 500 },
      { html: '<hr class="term-hr">', delay: 200 },
      { html: `<div class="term-heading">Создан CLAUDE.md</div>`, delay: 300 },
      { html: `<div class="term-text--dim">  # Проект: my-project</div>`, delay: 100 },
      { html: `<div class="term-text--dim">  </div>`, delay: 50 },
      { html: `<div class="term-text--dim">  ## Технологический стек</div>`, delay: 100 },
      { html: `<div class="term-text--dim">  - TypeScript + React</div>`, delay: 80 },
      { html: `<div class="term-text--dim">  - Vite для сборки</div>`, delay: 80 },
      { html: `<div class="term-text--dim">  - Tailwind CSS</div>`, delay: 80 },
      { html: `<div class="term-text--dim">  </div>`, delay: 50 },
      { html: `<div class="term-text--dim">  ## Конвенции</div>`, delay: 100 },
      { html: `<div class="term-text--dim">  - Использовать функциональные компоненты</div>`, delay: 80 },
      { html: `<div class="term-text--dim">  - Предпочитать именованные экспорты</div>`, delay: 80 },
      { html: `<div class="term-text--dim">  - Тесты в директориях __tests__/</div>`, delay: 80 },
      { html: '<hr class="term-hr">', delay: 200 },
      { html: '<div class="term-text--success">CLAUDE.md успешно создан. Claude будет использовать его как контекст проекта.</div>', delay: 0 },
    ]);
  }

  _cmdDoctor() {
    const checks = [
      ['Аутентификация', 'авторизован как user@example.com', true, 500],
      ['Доступ к модели', 'claude-opus-4-6 доступна', true, 400],
      ['Git репозиторий', 'чистое рабочее дерево', true, 350],
      ['Node.js', 'v22.1.0', true, 300],
      ['MCP серверы', '2 подключено (filesystem, github)', true, 450],
      ['Разрешения', 'settings.json загружен', true, 300],
      ['CLAUDE.md', 'найден в корне проекта', true, 350],
    ];

    this._animateSequence([
      { html: '<div class="term-heading">Запуск диагностики...</div>', delay: 400 },
      ...checks.map(([label, detail, pass, delay]) => ({
        html: `<div class="term-check">
          <span class="term-check__icon term-check__icon--${pass ? 'pass' : 'fail'}">${pass ? '\u2713' : '\u2717'}</span>
          <span class="term-check__label">${label}</span>
          <span class="term-check__detail">${detail}</span>
        </div>`,
        delay,
      })),
      { html: '<hr class="term-hr">', delay: 200 },
      { html: '<div class="term-text--success">Все проверки пройдены. Claude Code готов к работе.</div>', delay: 0 },
    ]);
  }

  _cmdCost() {
    this._appendHtml(`
      <div class="term-block">
        <div class="term-heading">Использование сессии</div>
        <div class="term-stat"><span class="term-stat__key">Входные токены</span><span class="term-stat__val">42,817</span></div>
        <div class="term-stat"><span class="term-stat__key">Выходные токены</span><span class="term-stat__val">18,243</span></div>
        <div class="term-stat"><span class="term-stat__key">Чтение из кэша</span><span class="term-stat__val">156,092</span></div>
        <div class="term-stat"><span class="term-stat__key">Запись в кэш</span><span class="term-stat__val">28,451</span></div>
        <hr class="term-hr">
        <div class="term-stat"><span class="term-stat__key">Общая стоимость</span><span class="term-stat__val term-stat__val--accent">$0.847</span></div>
        <div class="term-stat"><span class="term-stat__key">Сообщений</span><span class="term-stat__val">23</span></div>
        <div class="term-stat"><span class="term-stat__key">Длительность</span><span class="term-stat__val">14м 32с</span></div>
      </div>
    `);
  }

  _cmdCompact() {
    const block = document.createElement('div');
    block.className = 'term-block';
    block.innerHTML = `
      <div class="term-text--dim">Сжатие контекста разговора...</div>
      <div class="term-progress">
        <div class="term-progress__bar"><div class="term-progress__fill" id="compact-fill"></div></div>
        <span class="term-progress__label" id="compact-pct">0%</span>
      </div>
    `;
    this.output.appendChild(block);
    this._scrollToBottom();

    const fill = document.getElementById('compact-fill');
    const pct = document.getElementById('compact-pct');
    let progress = 0;
    this.isAnimating = true;

    const step = () => {
      progress += 2 + Math.random() * 6;
      if (progress >= 100) {
        progress = 100;
        fill.style.width = '100%';
        pct.textContent = '100%';

        setTimeout(() => {
          block.innerHTML += `
            <hr class="term-hr">
            <div class="term-stat"><span class="term-stat__key">До</span><span class="term-stat__val">187,204 токенов</span></div>
            <div class="term-stat"><span class="term-stat__key">После</span><span class="term-stat__val term-stat__val--accent">24,817 токенов</span></div>
            <div class="term-stat"><span class="term-stat__key">Сокращение</span><span class="term-stat__val term-stat__val--accent">86.7%</span></div>
            <div class="term-text--success" style="margin-top:6px">Контекст сжат. Сводка разговора сохранена.</div>
          `;
          this.isAnimating = false;
          this._scrollToBottom();
        }, 300);
        return;
      }

      fill.style.width = progress + '%';
      pct.textContent = Math.floor(progress) + '%';
      setTimeout(step, 40 + Math.random() * 60);
    };

    setTimeout(step, 300);
  }

  _cmdModel() {
    const models = [
      ['claude-opus-4-6', 'Самая мощная, глубокое рассуждение', true],
      ['claude-sonnet-4-6', 'Быстрая, сбалансированная производительность', false],
      ['claude-haiku-4-5', 'Самая быстрая, лёгкие задачи', false],
    ];

    let rows = '';
    for (const [name, desc, active] of models) {
      rows += `<div class="term-model">
        <span class="term-model__indicator term-model__indicator--${active ? 'active' : 'inactive'}"></span>
        <span class="term-model__name ${active ? 'term-model__name--active' : ''}">${name}</span>
        <span class="term-model__desc">${desc}</span>
      </div>`;
    }

    this._appendHtml(`
      <div class="term-block">
        <div class="term-heading">Доступные модели</div>
        ${rows}
        <hr class="term-hr">
        <div class="term-text--dim">Активная модель показана значком <span class="term-text--accent">\u25CF</span>. Используйте <span class="term-text--accent">/model &lt;name&gt;</span> для переключения.</div>
      </div>
    `);
  }

  _cmdDiff() {
    this._animateSequence([
      { html: '<div class="term-text--dim">Проверка незакоммиченных изменений...</div>', delay: 400 },
      { html: '<div class="term-diff-hdr">--- a/src/utils/auth.ts</div>', delay: 200 },
      { html: '<div class="term-diff-hdr">+++ b/src/utils/auth.ts</div>', delay: 100 },
      { html: '<div class="term-diff-ctx">@@ -14,7 +14,9 @@ export function validateToken(token: string) {</div>', delay: 150 },
      { html: '<div class="term-diff-ctx">  const decoded = jwt.verify(token, SECRET);</div>', delay: 80 },
      { html: '<div class="term-diff-del">  return decoded;</div>', delay: 80 },
      { html: '<div class="term-diff-add">  if (!decoded.exp || decoded.exp < Date.now() / 1000) {</div>', delay: 80 },
      { html: '<div class="term-diff-add">    throw new TokenExpiredError(\'Token has expired\');</div>', delay: 80 },
      { html: '<div class="term-diff-add">  }</div>', delay: 80 },
      { html: '<div class="term-diff-add">  return decoded;</div>', delay: 80 },
      { html: '<div class="term-diff-ctx">}</div>', delay: 80 },
      { html: '<hr class="term-hr">', delay: 200 },
      { html: '<div class="term-stat"><span class="term-stat__key">Изменено файлов</span><span class="term-stat__val">1</span></div>', delay: 100 },
      { html: '<div class="term-stat"><span class="term-stat__key">Вставки</span><span class="term-stat__val term-text--success">+4</span></div>', delay: 80 },
      { html: '<div class="term-stat"><span class="term-stat__key">Удаления</span><span class="term-stat__val term-text--error">-1</span></div>', delay: 0 },
    ]);
  }

  _cmdStatus() {
    this._appendHtml(`
      <div class="term-block">
        <div class="term-heading">Статус Claude Code</div>
        <div class="term-stat"><span class="term-stat__key">Версия</span><span class="term-stat__val">1.0.42</span></div>
        <div class="term-stat"><span class="term-stat__key">Модель</span><span class="term-stat__val term-stat__val--accent">claude-opus-4-6</span></div>
        <div class="term-stat"><span class="term-stat__key">Аккаунт</span><span class="term-stat__val">user@example.com</span></div>
        <div class="term-stat"><span class="term-stat__key">Тариф</span><span class="term-stat__val">Max (5x лимит)</span></div>
        <div class="term-stat"><span class="term-stat__key">Проект</span><span class="term-stat__val">my-project</span></div>
        <div class="term-stat"><span class="term-stat__key">Рабочая директория</span><span class="term-stat__val">~/code/my-project</span></div>
        <hr class="term-hr">
        <div class="term-stat"><span class="term-stat__key">MCP серверы</span><span class="term-stat__val">2 подключено</span></div>
        <div class="term-stat"><span class="term-stat__key">CLAUDE.md</span><span class="term-stat__val term-text--success">загружен</span></div>
        <div class="term-stat"><span class="term-stat__key">Разрешения</span><span class="term-stat__val">default + 3 пользовательских</span></div>
      </div>
    `);
  }

  _cmdConfig() {
    this._appendHtml(`
      <div class="term-block">
        <div class="term-text--dim">Открытие настроек...</div>
      </div>
    `);
    // Navigate to settings.json in the file explorer
    setTimeout(() => {
      if (window.app && window.app.explorer) {
        window.app.explorer.selectPath('.claude/settings.json');
      }
    }, 300);
  }

  _cmdMemory() {
    this._animateSequence([
      { html: '<div class="term-heading">Записи авто-памяти</div>', delay: 300 },
      { html: '<div class="term-text--dim">из ~/.claude/projects/.../memory/MEMORY.md</div>', delay: 200 },
      { html: '<hr class="term-hr">', delay: 150 },
      { html: '<div class="term-text">\u2022 Пользователь предпочитает функциональные компоненты классам</div>', delay: 150 },
      { html: '<div class="term-text">\u2022 Всегда запускать тесты с флагом --coverage</div>', delay: 120 },
      { html: '<div class="term-text">\u2022 Проект использует pnpm, не npm</div>', delay: 120 },
      { html: '<div class="term-text">\u2022 Предпочитать именованные экспорты дефолтным</div>', delay: 120 },
      { html: '<div class="term-text">\u2022 Сообщения об ошибках должны быть понятны пользователю, не технические</div>', delay: 120 },
      { html: '<hr class="term-hr">', delay: 150 },
      { html: '<div class="term-text--dim">5 записей. Редактировать через <span class="term-text--accent">/memory --edit</span></div>', delay: 0 },
    ]);
  }

  _cmdLoop(rawCmd) {
    // Parse subcommands first
    const args = rawCmd.replace(/^\/loop\s*/i, '').trim();

    // Handle /loop stop
    if (args.toLowerCase() === 'stop') {
      if (!this._activeLoop) {
        this._appendHtml(`
          <div class="term-block">
            <div class="term-text--dim">Нет активных loop-ов для остановки.</div>
          </div>
        `);
      } else {
        const task = this._activeLoop.task;
        this._activeLoop = null;
        this._appendHtml(`
          <div class="term-block">
            <div class="term-text--success">\u2713 Loop остановлен</div>
            <div class="term-text--dim">Задача "${this._esc(task)}" больше не будет повторяться.</div>
          </div>
        `);
      }
      return;
    }

    // Handle /loop list
    if (args.toLowerCase() === 'list') {
      if (!this._activeLoop) {
        this._appendHtml(`
          <div class="term-block">
            <div class="term-text--dim">Нет активных loop-ов.</div>
          </div>
        `);
      } else {
        this._appendHtml(`
          <div class="term-block">
            <div class="term-heading">Активные loop-ы</div>
            <div class="term-stat"><span class="term-stat__key">Задача</span><span class="term-stat__val">${this._esc(this._activeLoop.task)}</span></div>
            <div class="term-stat"><span class="term-stat__key">Интервал</span><span class="term-stat__val">${this._activeLoop.intervalDisplay}</span></div>
            <div class="term-stat"><span class="term-stat__key">Выполнений</span><span class="term-stat__val">${this._activeLoop.runs}</span></div>
          </div>
        `);
      }
      return;
    }

    // Parse: /loop [interval] [command/prompt]
    const parts = rawCmd.match(/^\/loop\s+(\d+[smh]?)?\s*(.*)$/i);
    const interval = parts && parts[1] ? parts[1] : '10m';
    const task = parts && parts[2] ? parts[2] : '';

    if (!task) {
      this._appendHtml(`
        <div class="term-block">
          <div class="term-heading">Использование /loop</div>
          <div class="term-text">Запускает команду или промпт с повторением по интервалу.</div>
          <hr class="term-hr">
          <div class="term-text--dim">Синтаксис:</div>
          <div class="term-text"><span class="term-text--accent">/loop [интервал] [команда или промпт]</span></div>
          <hr class="term-hr">
          <div class="term-text--dim">Подкоманды:</div>
          <div class="term-text">/loop stop — остановить активный loop</div>
          <div class="term-text">/loop list — показать активные loop-ы</div>
          <hr class="term-hr">
          <div class="term-text--dim">Примеры:</div>
          <div class="term-text">/loop 5m /doctor</div>
          <div class="term-text">/loop 10m проверь статус деплоя</div>
          <div class="term-text">/loop 1h запусти тесты и отправь отчёт</div>
          <hr class="term-hr">
          <div class="term-text--dim">Интервалы: <span class="term-text--accent">s</span>=секунды, <span class="term-text--accent">m</span>=минуты, <span class="term-text--accent">h</span>=часы. По умолчанию: 10m</div>
        </div>
      `);
      return;
    }

    const intervalDisplay = this._formatInterval(interval);

    // Store active loop
    this._activeLoop = { task, interval, intervalDisplay, runs: 1 };

    this._animateSequence([
      { html: '<div class="term-heading">Loop запущен</div>', delay: 200 },
      { html: `<div class="term-stat"><span class="term-stat__key">Задача</span><span class="term-stat__val">${this._esc(task)}</span></div>`, delay: 150 },
      { html: `<div class="term-stat"><span class="term-stat__key">Интервал</span><span class="term-stat__val term-stat__val--accent">${intervalDisplay}</span></div>`, delay: 100 },
      { html: '<hr class="term-hr">', delay: 150 },
      { html: '<div class="term-text--dim">Выполнение #1...</div>', delay: 300 },
      { html: `<div class="term-text--success">\u2713 Выполнено. Следующий запуск через ${intervalDisplay}</div>`, delay: 400 },
      { html: '<hr class="term-hr">', delay: 200 },
      { html: '<div class="term-text--dim">Loop работает в фоне. Остановить: <span class="term-text--accent">/loop stop</span></div>', delay: 0 },
    ]);
  }

  _parseInterval(str) {
    const match = str.match(/^(\d+)([smh])?$/i);
    if (!match) return 600000; // default 10m
    const num = parseInt(match[1], 10);
    const unit = (match[2] || 'm').toLowerCase();
    const multipliers = { s: 1000, m: 60000, h: 3600000 };
    return num * (multipliers[unit] || 60000);
  }

  _formatInterval(str) {
    const match = str.match(/^(\d+)([smh])?$/i);
    if (!match) return '10 минут';
    const num = parseInt(match[1], 10);
    const unit = (match[2] || 'm').toLowerCase();
    const labels = { s: ['секунда', 'секунды', 'секунд'], m: ['минута', 'минуты', 'минут'], h: ['час', 'часа', 'часов'] };
    const forms = labels[unit] || labels.m;
    // Russian pluralization
    const lastTwo = num % 100;
    const lastOne = num % 10;
    let form;
    if (lastTwo >= 11 && lastTwo <= 19) form = forms[2];
    else if (lastOne === 1) form = forms[0];
    else if (lastOne >= 2 && lastOne <= 4) form = forms[1];
    else form = forms[2];
    return `${num} ${form}`;
  }

  _cmdFast() {
    this._fastModeOn = !this._fastModeOn;
    const status = this._fastModeOn ? 'ON' : 'OFF';
    const icon = this._fastModeOn ? '\u21af' : '';

    this._animateSequence([
      { html: `<div class="term-heading">Fast Mode ${status}</div>`, delay: 200 },
      { html: this._fastModeOn
        ? '<div class="term-text--success">Fast mode включён. Ответы Opus 4.6 будут в 2.5x быстрее.</div>'
        : '<div class="term-text--dim">Fast mode выключен. Стандартная скорость и стоимость.</div>', delay: 150 },
      { html: '<hr class="term-hr">', delay: 100 },
      { html: this._fastModeOn
        ? `<div class="term-stat"><span class="term-stat__key">Стоимость</span><span class="term-stat__val term-stat__val--accent">$30/150 MTok</span></div>`
        : `<div class="term-stat"><span class="term-stat__key">Стоимость</span><span class="term-stat__val">Стандартная</span></div>`, delay: 100 },
      { html: this._fastModeOn
        ? `<div class="term-text--dim">Иконка ${icon} появится рядом с промптом.</div>`
        : '<div class="term-text--dim">Модель остаётся Opus 4.6.</div>', delay: 0 },
    ]);
  }

  _cmdRewind() {
    this._animateSequence([
      { html: '<div class="term-heading">Checkpoints сессии</div>', delay: 200 },
      { html: '<div class="term-text--dim">Нажмите Esc+Esc или используйте /rewind</div>', delay: 150 },
      { html: '<hr class="term-hr">', delay: 100 },
      { html: '<div class="term-text">\u25cf <span class="term-text--accent">12:34</span> — Исправь баг в auth.ts</div>', delay: 120 },
      { html: '<div class="term-text">\u25cb <span class="term-text--dim">12:28</span> — Добавь валидацию токена</div>', delay: 100 },
      { html: '<div class="term-text">\u25cb <span class="term-text--dim">12:15</span> — Рефакторинг компонента Login</div>', delay: 100 },
      { html: '<div class="term-text">\u25cb <span class="term-text--dim">11:58</span> — Начальная настройка проекта</div>', delay: 100 },
      { html: '<hr class="term-hr">', delay: 150 },
      { html: '<div class="term-text--dim">Действия: <span class="term-text--accent">Restore code</span>, <span class="term-text--accent">Restore conversation</span>, <span class="term-text--accent">Summarize</span></div>', delay: 0 },
    ]);
  }

  _cmdSandbox() {
    this._animateSequence([
      { html: '<div class="term-heading">Настройка песочницы</div>', delay: 200 },
      { html: '<div class="term-text--dim">Выберите режим работы bash-команд:</div>', delay: 150 },
      { html: '<hr class="term-hr">', delay: 100 },
      { html: '<div class="term-text">\u25cf <span class="term-text--accent">Auto-allow</span> — команды в песочнице выполняются автоматически</div>', delay: 120 },
      { html: '<div class="term-text">\u25cb <span class="term-text--dim">Regular permissions</span> — стандартный flow разрешений</div>', delay: 100 },
      { html: '<div class="term-text">\u25cb <span class="term-text--dim">Disabled</span> — песочница отключена</div>', delay: 100 },
      { html: '<hr class="term-hr">', delay: 150 },
      { html: '<div class="term-stat"><span class="term-stat__key">Файловая система</span><span class="term-stat__val term-text--success">Изолирована</span></div>', delay: 100 },
      { html: '<div class="term-stat"><span class="term-stat__key">Сеть</span><span class="term-stat__val term-text--success">Ограничена</span></div>', delay: 100 },
      { html: '<div class="term-stat"><span class="term-stat__key">Платформа</span><span class="term-stat__val">macOS (Seatbelt)</span></div>', delay: 0 },
    ]);
  }

  _cmdKeybindings() {
    this._appendHtml(`
      <div class="term-block">
        <div class="term-text--dim">Открытие настроек клавиатурных сокращений...</div>
      </div>
    `);
    // Navigate to keybindings in the file explorer
    setTimeout(() => {
      if (window.app && window.app.explorer) {
        window.app.explorer.selectPath('.claude/keybindings.json');
      }
    }, 300);
  }

  // ── Utilities ─────────────────────────────────────────────

  _clearOutput() {
    this.output.innerHTML = '';
    this._showWelcome();
  }

  _appendHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    while (div.firstChild) {
      this.output.appendChild(div.firstChild);
    }
    this._scrollToBottom();
  }

  _scrollToBottom() {
    requestAnimationFrame(() => {
      this.output.scrollTop = this.output.scrollHeight;
    });
  }

  /** Animate a sequence of HTML blocks with delays */
  _animateSequence(steps) {
    this.isAnimating = true;
    let totalDelay = 0;

    const block = document.createElement('div');
    block.className = 'term-block';
    this.output.appendChild(block);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      totalDelay += step.delay;

      setTimeout(() => {
        const div = document.createElement('div');
        div.innerHTML = step.html;
        while (div.firstChild) {
          block.appendChild(div.firstChild);
        }
        this._scrollToBottom();

        if (i === steps.length - 1) {
          this.isAnimating = false;
        }
      }, totalDelay);
    }
  }

  _esc(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
}
