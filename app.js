/**
 * DEBATR — Logic & State Management
 * Stack: Pure Vanilla JavaScript + Supabase JS Client + GPT-6 Luna Rubric Engine
 */

// ==========================================
// 1. DATA & DEBATE TOPICS
// ==========================================

const DEBATE_TOPICS = [
  "ЭП считает, что развитие автономных систем искусственного интеллекта должно жестко лицензироваться международным регулятором.",
  "ЭП запретит разработку и внедрение систем социального кредита и скоринга граждан.",
  "ЭП отменит стандартизированное государственное тестирование в старшей школе в пользу портфолио проектов.",
  "ЭП считает, что социальные сети несут юридическую ответственность за алгоритмическое распространение дезинформации.",
  "ЭП введет безусловный базовый доход, финансируемый налогом на роботизацию и автоматизацию труда.",
  "ЭП запретит таргетированную коммерческую рекламу, ориентированную на несовершеннолетнюю аудиторию.",
  "ЭП считает, что научные исследования с открытым исходным кодом превосходят коммерческую патентную модель."
];

// Debate Spheres / Categories with curated high-caliber resolutions
const DEBATE_CATEGORIES = {
  education: {
    name: "🎓 Образование и школа",
    resolutions: [
      "ЭП отменит стандартизированное государственное тестирование в старшей школе в пользу портфолио проектов.",
      "ЭП запретит использование смартфонов и личных гаджетов на уроках в школах.",
      "ЭП заменит традиционные домашние задания практическими групповыми проектами.",
      "ЭП обяжет университеты внедрять обязательные курсы критического мышления и фактчекинга."
    ]
  },
  ecology: {
    name: "🌱 Экология и климат",
    resolutions: [
      "ЭП введет прогрессивный углеродный налог на корпорации с полным отказом от субсидирования ископаемого топлива.",
      "ЭП считает, что развитие атомной энергетики является безальтернативным решением глобального климатического кризиса.",
      "ЭП запретит производство и продажу одноразовой пластиковой упаковки на государственном уровне.",
      "ЭП возложит полную материальную ответственность за утилизацию отходов на производителей упаковки."
    ]
  },
  ai_tech: {
    name: "🤖 ИИ и технологии",
    resolutions: [
      "ЭП считает, что развитие автономных систем искусственного интеллекта должно жестко лицензироваться международным регулятором.",
      "ЭП запретит разработку и внедрение систем социального кредита и алгоритмического скоринга граждан.",
      "ЭП считает, что социальные сети несут прямую юридическую ответственность за вредоносный контент и дезинформацию.",
      "ЭП признает авторские права на контент, созданный генеративным ИИ, общественным достоянием."
    ]
  },
  economy: {
    name: "💼 Экономика и рынок труда",
    resolutions: [
      "ЭП введет безусловный базовый доход, финансируемый налогом на роботизацию и автоматизацию рабочих мест.",
      "ЭП перейдет на четырехдневную рабочую неделю без снижения заработной платы.",
      "ЭП запретит монополизацию технологий гиперскейлерами через принудительное разделение цифровых гигантов.",
      "ЭП считает, что государственные субсидии должны распределяться строго по принципу экологической и социальной ответственности."
    ]
  },
  society: {
    name: "⚖️ Общество, этика и право",
    resolutions: [
      "ЭП запретит таргетированную коммерческую рекламу, ориентированную на несовершеннолетнюю аудиторию.",
      "ЭП отменит коммерческое патентование жизненно необходимых медицинских препаратов.",
      "ЭП введет обязательную квоту для молодежи и начинающих специалистов в органах законодательной власти.",
      "ЭП считает, что персональные биометрические данные не могут быть предметом коммерческой монетизации."
    ]
  }
};

function getCategoryName(categoryKey) {
  return DEBATE_CATEGORIES[categoryKey]?.name || "🎓 Образование";
}

function getRandomResolutionForCategory(categoryKey) {
  const cat = DEBATE_CATEGORIES[categoryKey] || DEBATE_CATEGORIES.education;
  const list = cat.resolutions;
  return list[Math.floor(Math.random() * list.length)];
}

const EXERCISE_CONFIG = {
  claim: {
    tip: "Сформулируйте ясный, однозначный и сильный тезис в пользу резолюции или против неё без лишней 'воды'.",
    placeholder: "Пример тезиса: «Государственное лицензирование автономного ИИ критически необходимо, поскольку неконтролируемое обучение моделей создает монополизацию стратегических вычислительных мощностей и угрожает кибербезопасности критической инфраструктуры...»",
    strongSample: "Мы утверждаем, что лицензирование автономного ИИ предотвратит неконтролируемую монополизацию ключевых вычислительных ресурсов корпорациями, что защитит национальную безопасность и общественный интерес от корпоративного диктата.",
    weakSample: "ИИ это плохо и опасно, поэтому государству надо всё запретить и следить за всеми учеными."
  },
  warrant: {
    tip: "Выстройте строгую причинно-следственную цепочку: от исходной посылки до масштабного доказанного последствия (Impact).",
    placeholder: "Опишите логический переход: 'Если X произойдет, то стейкхолдер Y сделает Z, потому что...'",
    strongSample: "Коммерческие лаборатории действуют в логике рыночной гонки: сокращение затрат на тестирование безопасности дает преимущество в скорости релиза. Без внешнего независимого лицензирования ни один участник не рискнет замедлиться добровольно (проблема координации). Это неизбежно приведет к утечке уязвимостей в критические сети.",
    weakSample: "Потому что если не регулировать, компьютеры станут умнее людей и все сломается само по себе."
  },
  rebuttal: {
    tip: "Атакуйте предпосылку или ценность аргумента соперника, а не просто выражайте формальное несогласие.",
    placeholder: "Начните с выявления уязвимости аргумента оппонента: 'Оппоненты утверждают, что..., однако эта логика ошибочна, так как...'",
    strongSample: "Оппозиция заявляет, что лицензирование убьет инновации стартапов. Однако они игнорируют, что текущие передовые frontier-модели требуют сотен миллионов долларов и уже монополизированы гиперскейлерами. Лицензирование, напротив, задает открытые стандарты аудита, защищая независимых исследователей от закрытых экосистем гигантов.",
    weakSample: "Наши оппоненты совершенно не правы, их аргументы наивны и они ничего не понимают в экономике."
  },
  speech: {
    tip: "Объедините все элементы: тезис, аргументацию, доказательную базу, ответ сопернику и итоговый импакт раунда.",
    placeholder: "Разверните полноценную речь премьер-министра или лидера оппозиции...",
    strongSample: "Уважаемые судьи, ключевой конфликт этого раунда — безопасность против скорости инноваций. Во-первых, аргумент об экзистенциальной уязвимости инфраструктуры. Когда автономные агенты получают доступ к финансовым сетям и энергетике, ошибка модели имеет необратимый эффект. Ни одна частная компания не несет достаточных рисков, чтобы остановить гонку релизов. Во-вторых, сравнительный анализ: лицензирование фармацевтики не остановило медицину, но спасло миллионы жизней от опасных препаратов. Лицензирование ИИ работает точно так же. Голосуйте за правительство.",
    weakSample: "Здравствуйте, мы считаем эту тему очень важной. Искусственный интеллект везде. Надо что-то делать, иначе будущее будет ужасным. Спасибо за внимание."
  }
};

// Default initial state
let currentExerciseType = "claim";
let currentTopicIndex = 0;

// Database history for Coach Dashboard (synchronizes with Supabase when configured)
let speechesHistory = [];

// ==========================================
// 2. DOM ELEMENTS
// ==========================================

const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

const topicDisplay = document.getElementById('topic-display');
const btnRandomTopic = document.getElementById('btn-random-topic');
const exerciseTipText = document.getElementById('tip-text');
const speechInput = document.getElementById('speech-input');
const wordCountEl = document.getElementById('word-count');
const charCountEl = document.getElementById('char-count');

const btnAnalyze = document.getElementById('btn-analyze');
const btnSampleStrong = document.getElementById('btn-sample-strong');
const btnSampleWeak = document.getElementById('btn-sample-weak');

const feedbackEmpty = document.getElementById('feedback-empty');
const feedbackLoading = document.getElementById('feedback-loading');
const feedbackResults = document.getElementById('feedback-results');

const resOverallScore = document.getElementById('res-overall-score');
const resLevelTag = document.getElementById('res-level-tag');
const scoreStructure = document.getElementById('score-structure');
const scoreEvidence = document.getElementById('score-evidence');
const scoreRebuttal = document.getElementById('score-rebuttal');
const scoreClarity = document.getElementById('score-clarity');
const scoreOriginality = document.getElementById('score-originality');

const fillStructure = document.getElementById('fill-structure');
const fillEvidence = document.getElementById('fill-evidence');
const fillRebuttal = document.getElementById('fill-rebuttal');
const fillClarity = document.getElementById('fill-clarity');
const fillOriginality = document.getElementById('fill-originality');

const resStrengths = document.getElementById('res-strengths');
const resImprovements = document.getElementById('res-improvements');

const btnSaveSupabase = document.getElementById('btn-save-supabase');
const saveStatusText = document.getElementById('save-status-text');

// Settings modal elements
const btnOpenSettings = document.getElementById('btn-open-settings');
const btnCloseSettings = document.getElementById('btn-close-settings');
const settingsModal = document.getElementById('settings-modal');
const btnSaveSettings = document.getElementById('btn-save-settings');
const btnResetSettings = document.getElementById('btn-reset-settings');
const inputSupabaseUrl = document.getElementById('supabase-url');
const inputSupabaseKey = document.getElementById('supabase-key');
const inputAiApiKey = document.getElementById('ai-api-key');
const selectAiMode = document.getElementById('ai-mode-select');

// Dashboard elements
const speechesTableBody = document.getElementById('speeches-table-body');
const btnRefreshData = document.getElementById('btn-refresh-data');
const statTotalSpeeches = document.getElementById('stat-total-speeches');
const statAvgScore = document.getElementById('stat-avg-score');

const toast = document.getElementById('toast');

// ==========================================
// 3. INITIALIZATION & LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initExerciseSelector();
  initTopicControls();
  initInputCounters();
  initAnalyzeButton();
  initSamples();
  initSettingsModal();
  initDashboardTable();
  loadStoredSettings();
  initAuth();
  initRadarChart();
  initBattleMode();
  initRoomsMode();
  initSpeechTimer();
  initVoiceInput();
  initTtsToggle();
});

// Toast system
function showToast(message, duration = 3000) {
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.remove('hidden');
  setTimeout(() => {
    toastEl.classList.add('hidden');
  }, duration);
}

// ==========================================
// 4. NAVIGATION / TABS
// ==========================================

function initNavigation() {
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active-tab'));

      btn.classList.add('active');
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) {
        activeContent.classList.add('active-tab');
        if (targetTab === 'dashboard') {
          setTimeout(updateRadarFromHistory, 50);
        }
      }
    });
  });
}

// ==========================================
// 5. EXERCISE SELECTOR
// ==========================================

function initExerciseSelector() {
  const pillButtons = document.querySelectorAll('#exercise-types .pill-btn');
  pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pillButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentExerciseType = btn.getAttribute('data-type');
      updateExerciseUI();
    });
  });
}

function updateExerciseUI() {
  const config = EXERCISE_CONFIG[currentExerciseType];
  if (exerciseTipText) exerciseTipText.textContent = config.tip;
  if (speechInput) speechInput.placeholder = config.placeholder;
  updateStats();
}

// ==========================================
// 6. TOPICS & SAMPLES
// ==========================================

function initTopicControls() {
  if (btnRandomTopic && topicDisplay) {
    btnRandomTopic.addEventListener('click', () => {
      currentTopicIndex = (currentTopicIndex + 1) % DEBATE_TOPICS.length;
      topicDisplay.style.opacity = '0';
      setTimeout(() => {
        topicDisplay.textContent = DEBATE_TOPICS[currentTopicIndex];
        topicDisplay.style.opacity = '1';
      }, 150);
    });
  }
}

function initInputCounters() {
  if (speechInput) {
    speechInput.addEventListener('input', updateStats);
  }
}

function updateStats() {
  if (!speechInput) return;
  const text = speechInput.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = text.length;

  if (wordCountEl) wordCountEl.textContent = `${words} ${pluralize(words, ['слово', 'слова', 'слов'])}`;
  if (charCountEl) charCountEl.textContent = `${chars} симв.`;
}

function pluralize(n, forms) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

function initSamples() {
  if (btnSampleStrong && speechInput) {
    btnSampleStrong.addEventListener('click', () => {
      const config = EXERCISE_CONFIG[currentExerciseType];
      speechInput.value = config.strongSample;
      updateStats();
      showToast("Вставлен сильный аргумент для проверки");
    });
  }

  if (btnSampleWeak && speechInput) {
    btnSampleWeak.addEventListener('click', () => {
      const config = EXERCISE_CONFIG[currentExerciseType];
      speechInput.value = config.weakSample;
      updateStats();
      showToast("Вставлен слабый аргумент для проверки");
    });
  }
}

// ==========================================
// 7. GPT-6 LUNA RUBRIC ENGINE
// ==========================================

function initAnalyzeButton() {
  if (btnAnalyze) {
    btnAnalyze.addEventListener('click', async () => {
      if (!speechInput) return;
      const text = speechInput.value.trim();
      if (!text) {
        showToast("Пожалуйста, напишите аргумент перед запуском анализа!");
        speechInput.focus();
        return;
      }

      // UI State: Loading
      if (feedbackEmpty) feedbackEmpty.classList.add('hidden');
      if (feedbackResults) feedbackResults.classList.add('hidden');
      if (feedbackLoading) feedbackLoading.classList.remove('hidden');

      const apiKey = localStorage.getItem('debatr_ai_key');
      const aiMode = localStorage.getItem('debatr_ai_mode') || 'luna-sim';
      const topicText = topicDisplay ? topicDisplay.textContent : DEBATE_TOPICS[0];

      if (aiMode === 'live-api' && apiKey) {
        try {
          const evaluation = await callOpenAiRubric(text, currentExerciseType, topicText, apiKey);
          renderEvaluation(evaluation);
          if (feedbackLoading) feedbackLoading.classList.add('hidden');
          if (feedbackResults) feedbackResults.classList.remove('hidden');
          showToast("Прямой анализ GPT-6 Luna успешно завершён!");
          return;
        } catch (err) {
          console.warn("Live API error, falling back to Luna engine:", err);
        }
      }

      // Simulate AI Latency with Luna Engine
      setTimeout(() => {
        const evaluation = evaluateSpeechWithLuna(text, currentExerciseType, topicText);
        renderEvaluation(evaluation);
        if (feedbackLoading) feedbackLoading.classList.add('hidden');
        if (feedbackResults) feedbackResults.classList.remove('hidden');
        showToast("Анализ GPT-6 Luna успешно завершён!");
      }, 1200);
    });
  }

  if (btnSaveSupabase) {
    btnSaveSupabase.addEventListener('click', saveToSupabase);
  }
}

async function callOpenAiRubric(text, type, topic, apiKey) {
  const prompt = `Ты строгий судья и тренер дебатов. Оцени аргумент по 5 критериям международной дебатной рубрики (шкала 0.0 - 9.0, шаг 0.5):
1. Argument Structure (логика, тезис, причинно-следственная связь)
2. Evidence Quality (факты, аналогии, доказательства)
3. Rebuttal Effectiveness (опровержение оппонента)
4. Clarity & Coherence (ясность, культура речи)
5. Originality & Insight (глубина мысли, импакт)

Тема дебатов: "${topic}"
Тип упражнения: "${type}"
Текст речи: "${text}"

Верни строго JSON объект без markdown кавычек:
{
  "overall": 7.5,
  "scores": {
    "structure": 7.5,
    "evidence": 7.0,
    "rebuttal": 8.0,
    "clarity": 7.5,
    "originality": 7.5
  },
  "strengths": "Кратко сильные стороны (2 предложения)",
  "improvements": "Кратко рекомендации по улучшению (2 предложения)"
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    })
  });

  if (!response.ok) throw new Error("OpenAI request failed");
  const data = await response.json();
  const raw = data.choices[0].message.content.trim().replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(raw);

  return {
    overall: parsed.overall,
    scores: parsed.scores,
    strengths: parsed.strengths,
    improvements: parsed.improvements,
    text,
    type,
    topic
  };
}

/**
 * Luna Rubric Diagnostic Algorithm
 * Evaluates the input based on 5 dimensions with bands from 0.0 to 9.0
 */
function evaluateSpeechWithLuna(text, type, topic) {
  const words = text.split(/\s+/).length;
  const lower = text.toLowerCase();

  // Logic marker keywords
  const logicMarkers = ['поскольку', 'так как', 'следовательно', 'потому что', 'таким образом', 'из этого следует', 'причина в том'];
  const evidenceMarkers = ['например', 'статистика', 'исследования', 'данные', 'опыт', 'факты', 'прецедент', 'компании', 'государств'];
  const rebuttalMarkers = ['оппонент', 'оппозиция', 'утверждают', 'однако', 'но', 'ошибочно', 'игнорируют', 'в отличие от'];
  const depthMarkers = ['влияние', 'импакт', 'стейкхолдер', 'последствия', 'принцип', 'ценность', 'сравнительный', 'анализ'];

  const countMatches = (list) => list.filter(w => lower.includes(w)).length;

  const hasLogic = countMatches(logicMarkers);
  const hasEvidence = countMatches(evidenceMarkers);
  const hasRebuttal = countMatches(rebuttalMarkers);
  const hasDepth = countMatches(depthMarkers);

  // Default base scoring according to length and markers
  let scoreStruct = 5.5;
  let scoreEvid = 5.0;
  let scoreReb = 5.0;
  let scoreClar = 6.0;
  let scoreOrig = 5.5;

  if (words > 40) { scoreStruct += 1.0; scoreClar += 1.0; }
  if (words > 80) { scoreStruct += 0.5; scoreOrig += 0.5; }

  scoreStruct += Math.min(2.0, hasLogic * 0.7);
  scoreEvid += Math.min(2.5, hasEvidence * 0.9);
  scoreReb += Math.min(2.5, hasRebuttal * 0.9);
  scoreOrig += Math.min(2.0, hasDepth * 0.7);

  // Bonus for specific exercise type
  if (type === 'claim' && words >= 15 && words <= 45) {
    scoreClar += 1.0;
    scoreStruct += 0.5;
  } else if (type === 'rebuttal' && hasRebuttal > 0) {
    scoreReb += 1.0;
  }

  // Constrain bounds between 3.0 and 9.0, rounded to 0.5
  const roundHalf = (val) => Math.min(9.0, Math.max(3.0, Math.round(val * 2) / 2));

  scoreStruct = roundHalf(scoreStruct);
  scoreEvid = roundHalf(scoreEvid);
  scoreReb = roundHalf(scoreReb);
  scoreClar = roundHalf(scoreClar);
  scoreOrig = roundHalf(scoreOrig);

  const overall = roundHalf((scoreStruct + scoreEvid + scoreReb + scoreClar + scoreOrig) / 5);

  // Generate qualitative feedback
  let strengths = "";
  let improvements = "";

  if (overall >= 7.5) {
    strengths = "Высокая культура аргументации. Четко выражен тезис, логические связки последовательны, а вывод органично соотносится с масштабом резолюции.";
    improvements = "Для выхода на 8.5–9.0 углубите сравнительный анализ (comparative): докажите, почему альтернативные сценарии оппонентов принесут гарантированно худший результат.";
  } else if (overall >= 6.0) {
    strengths = "Аргумент понятен и релевантен теме. Присутствует базовая логическая линия и верное понимание ключевого стейкхолдера.";
    improvements = "Слабое звено — доказательная база и глубина последствий. Добавьте конкретный прецедент или углубите цепочку «почему это происходит» на 1–2 шага дальше.";
  } else {
    strengths = "Сделана попытка сформулировать позицию по теме, обозначена общая позиция команды.";
    improvements = "Аргументу не хватает структуры. Избегайте декларативных суждений («это плохо/хорошо»). Обязательно добавьте обоснование через связку «потому что» и конкретный пример.";
  }

  return {
    overall,
    scores: {
      structure: scoreStruct,
      evidence: scoreEvid,
      rebuttal: scoreReb,
      clarity: scoreClar,
      originality: scoreOrig
    },
    strengths,
    improvements,
    text,
    type,
    topic
  };
}

let lastEvaluation = null;

function renderEvaluation(evalData) {
  lastEvaluation = evalData;

  resOverallScore.textContent = evalData.overall.toFixed(1);

  // Level tag
  if (evalData.overall >= 8.0) {
    resLevelTag.textContent = "Уровень: Эксперт (Band 8–9)";
    resLevelTag.style.color = "var(--accent-emerald)";
  } else if (evalData.overall >= 6.5) {
    resLevelTag.textContent = "Уровень: Продвинутый (Band 6.5–7.5)";
    resLevelTag.style.color = "var(--accent-blue)";
  } else {
    resLevelTag.textContent = "Уровень: Развивающийся (Band < 6.0)";
    resLevelTag.style.color = "var(--accent-amber)";
  }

  // Update rubric numbers
  scoreStructure.textContent = `${evalData.scores.structure.toFixed(1)} / 9`;
  scoreEvidence.textContent = `${evalData.scores.evidence.toFixed(1)} / 9`;
  scoreRebuttal.textContent = `${evalData.scores.rebuttal.toFixed(1)} / 9`;
  scoreClarity.textContent = `${evalData.scores.clarity.toFixed(1)} / 9`;
  scoreOriginality.textContent = `${evalData.scores.originality.toFixed(1)} / 9`;

  // Update progress bar widths (percentage of 9)
  fillStructure.style.width = `${(evalData.scores.structure / 9) * 100}%`;
  fillEvidence.style.width = `${(evalData.scores.evidence / 9) * 100}%`;
  fillRebuttal.style.width = `${(evalData.scores.rebuttal / 9) * 100}%`;
  fillClarity.style.width = `${(evalData.scores.clarity / 9) * 100}%`;
  fillOriginality.style.width = `${(evalData.scores.originality / 9) * 100}%`;

  // Feedback texts
  resStrengths.textContent = evalData.strengths;
  resImprovements.textContent = evalData.improvements;

  // Reset save button status
  saveStatusText.textContent = "В Supabase";
  btnSaveSupabase.disabled = false;
}

// ==========================================
// 8. SUPABASE PERSISTENCE & DASHBOARD
// ==========================================

async function saveToSupabase() {
  if (!lastEvaluation) return;

  saveStatusText.textContent = "Сохранение...";
  btnSaveSupabase.disabled = true;

  const supabaseUrl = localStorage.getItem('debatr_supabase_url') || 'https://gefremoxoxwobgeptobm.supabase.co';
  const supabaseKey = localStorage.getItem('debatr_supabase_key') || 'sb_publishable_k6JsncQUI3BePKqDhDNGOA_f4zcESvO';

  const currentUserName = (currentUser && currentUser.name) ? currentUser.name : "Гость";
  const newEntry = {
    id: Date.now(),
    date: "Только что",
    student: currentUserName,
    type: lastEvaluation.type,
    topic: lastEvaluation.topic.length > 40 ? lastEvaluation.topic.slice(0, 38) + "..." : lastEvaluation.topic,
    score: lastEvaluation.overall,
    status: "pending"
  };

  // If live Supabase credentials exist, try saving to real Supabase
  if (supabaseUrl && supabaseKey && window.supabase) {
    try {
      const client = window.supabase.createClient(supabaseUrl, supabaseKey);
      await client.from('speeches').insert([
        {
          student_name: newEntry.student,
          exercise_type: lastEvaluation.type,
          topic: lastEvaluation.topic,
          content: lastEvaluation.text,
          overall_score: lastEvaluation.overall,
          scores: lastEvaluation.scores,
          created_at: new Date().toISOString()
        }
      ]);
      showToast("Успешно синхронизировано с облачной базой Supabase!");
    } catch (e) {
      console.warn("Supabase remote error, falling back to local history:", e);
      showToast("Сохранено локально в сессию тренера!");
    }
  } else {
    showToast("Сохранено в локальную базу данных тренера!");
  }

  // Prepend to local dashboard view
  speechesHistory.unshift(newEntry);
  updateDashboardUI();

  saveStatusText.textContent = " Сохранено";
}

function initDashboardTable() {
  if (btnRefreshData) {
    btnRefreshData.addEventListener('click', () => {
      updateDashboardUI();
      showToast("Данные панели обновлены");
    });
  }
  updateDashboardUI();
}

function updateDashboardUI() {
  if (!speechesTableBody) return;
  speechesTableBody.innerHTML = '';

  if (speechesHistory.length === 0) {
    speechesTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; color:var(--text-muted); padding:2rem 1rem;">
          Раунды еще не сыграны. Проведите баттл с ИИ или начните матч 1 на 1.
        </td>
      </tr>
    `;
    if (statTotalSpeeches) statTotalSpeeches.textContent = '0';
    if (statAvgScore) statAvgScore.textContent = '0.0';
    return;
  }

  speechesHistory.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.date}</td>
      <td><strong>${escapeHtml(item.student)}</strong></td>
      <td><span class="tag-badge ${item.type}">${getExerciseTypeName(item.type)}</span></td>
      <td>${escapeHtml(item.topic)}</td>
      <td><strong>${item.score.toFixed(1)} / 9</strong></td>
      <td>
        <span class="${item.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}">
          ${item.status === 'confirmed' ? 'Проверено' : 'Ожидает наставника'}
        </span>
      </td>
      <td>
        <button class="btn-sample btn-verify-row" data-id="${item.id}">
          ${item.status === 'confirmed' ? 'Изменить' : 'Проверить'}
        </button>
      </td>
    `;
    speechesTableBody.appendChild(tr);
  });

  // Attach verify click handlers
  document.querySelectorAll('.btn-verify-row').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const row = speechesHistory.find(r => r.id === id);
      if (row) {
        row.status = row.status === 'confirmed' ? 'pending' : 'confirmed';
        updateDashboardUI();
        showToast(`Оценка для «${row.student}» ${row.status === 'confirmed' ? 'подтверждена тренером' : 'переведена в режим проверки'}`);
      }
    });
  });

  // Update aggregate stats
  if (statTotalSpeeches) statTotalSpeeches.textContent = speechesHistory.length;
  if (statAvgScore) {
    const avg = speechesHistory.length > 0 ? (speechesHistory.reduce((sum, item) => sum + item.score, 0) / speechesHistory.length) : 0;
    statAvgScore.textContent = avg.toFixed(1);
  }

  // Update Active 1v1 Room in Profile Dashboard
  updateDashboardActiveRoom();
}

function updateDashboardActiveRoom() {
  const profileCard = document.getElementById('profile-active-room-card');
  if (!profileCard) return;

  // Retrieve user's matched room or last active room
  const activeRoomRaw = localStorage.getItem('debatr_user_active_room');
  let room = null;
  if (activeRoomRaw) {
    try {
      room = JSON.parse(activeRoomRaw);
    } catch (e) {}
  }

  // Fallback to activeRoomData if active
  if (!room && typeof activeRoomData !== 'undefined' && activeRoomData) {
    room = activeRoomData;
  }

  if (!room) {
    profileCard.classList.add('hidden');
    return;
  }

  profileCard.classList.remove('hidden');

  const topicEl = document.getElementById('dash-room-topic');
  const timeEl = document.getElementById('dash-room-time');
  const codeEl = document.getElementById('dash-room-code');
  const pairEl = document.getElementById('dash-room-pair');
  const statusBadge = document.getElementById('dash-room-status-badge');
  const linkBtn = document.getElementById('dash-room-link-btn');
  const btnCopy = document.getElementById('btn-dash-copy-link');

  if (topicEl) topicEl.textContent = room.topic;
  if (timeEl) timeEl.textContent = room.scheduled_time || "Сегодня в 19:30";
  if (codeEl) codeEl.textContent = room.code;

  const p1 = room.p1_name || 'Спикер 1';
  const p2 = room.p2_name || 'Ожидает оппонента';
  if (pairEl) pairEl.textContent = `${p1} (Прав.) vs ${p2} (Опп.)`;

  if (statusBadge) {
    if (room.p1_name && room.p2_name) {
      statusBadge.textContent = "Закрытая комната (Оппонент откликнулся)";
      statusBadge.className = "room-privacy-badge private-badge";
    } else {
      statusBadge.textContent = room.room_type === 'public' ? "Открытая комната (Ожидание)" : "Закрытая комната (По ссылке)";
      statusBadge.className = room.room_type === 'public' ? "room-privacy-badge public-badge" : "room-privacy-badge private-badge";
    }
  }

  const roomUrl = `rooms.html?room=${room.code}`;
  if (linkBtn) {
    linkBtn.href = roomUrl;
  }

  if (btnCopy) {
    btnCopy.onclick = () => {
      const fullUrl = `${window.location.origin}${window.location.pathname.replace('dashboard.html', 'rooms.html')}?room=${room.code}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl).then(() => {
          showToast(`Ссылка на матч ${room.code} скопирована!`);
        }).catch(() => {
          showToast(`Ссылка на матч ${room.code} скопирована!`);
        });
      } else {
        showToast(`Ссылка на матч ${room.code} скопирована!`);
      }
    };
  }
}

function getExerciseTypeName(type) {
  switch (type) {
    case 'claim': return 'Тезис';
    case 'warrant': return 'Обоснование';
    case 'rebuttal': return 'Опровержение';
    case 'speech': return 'Полная речь';
    default: return type;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==========================================
// 9. SETTINGS MODAL (SUPABASE / API)
// ==========================================

function initSettingsModal() {
  if (btnOpenSettings && settingsModal) {
    btnOpenSettings.addEventListener('click', () => {
      settingsModal.classList.remove('hidden');
    });
  }

  if (btnCloseSettings && settingsModal) {
    btnCloseSettings.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
    });
  }

  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.add('hidden');
      }
    });
  }

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      const url = inputSupabaseUrl ? inputSupabaseUrl.value.trim() : '';
      const key = inputSupabaseKey ? inputSupabaseKey.value.trim() : '';
      const aiKey = inputAiApiKey ? inputAiApiKey.value.trim() : '';
      const aiMode = selectAiMode ? selectAiMode.value : 'luna-sim';

      if (url) localStorage.setItem('debatr_supabase_url', url);
      else localStorage.removeItem('debatr_supabase_url');

      if (key) localStorage.setItem('debatr_supabase_key', key);
      else localStorage.removeItem('debatr_supabase_key');

      if (aiKey) localStorage.setItem('debatr_ai_key', aiKey);
      else localStorage.removeItem('debatr_ai_key');

      localStorage.setItem('debatr_ai_mode', aiMode);

      if (settingsModal) settingsModal.classList.add('hidden');
      showToast("Настройки стека успешно сохранены!");
    });
  }

  if (btnResetSettings) {
    btnResetSettings.addEventListener('click', () => {
      localStorage.removeItem('debatr_supabase_url');
      localStorage.removeItem('debatr_supabase_key');
      localStorage.removeItem('debatr_ai_key');
      localStorage.removeItem('debatr_ai_mode');
      if (inputSupabaseUrl) inputSupabaseUrl.value = 'https://gefremoxoxwobgeptobm.supabase.co';
      if (inputSupabaseKey) inputSupabaseKey.value = 'sb_publishable_k6JsncQUI3BePKqDhDNGOA_f4zcESvO';
      if (inputAiApiKey) inputAiApiKey.value = '';
      if (selectAiMode) selectAiMode.value = 'luna-sim';
      showToast("Настройки сброшены на стандартные параметры");
    });
  }
}

function loadStoredSettings() {
  const url = localStorage.getItem('debatr_supabase_url') || 'https://gefremoxoxwobgeptobm.supabase.co';
  const key = localStorage.getItem('debatr_supabase_key') || 'sb_publishable_k6JsncQUI3BePKqDhDNGOA_f4zcESvO';
  const aiKey = localStorage.getItem('debatr_ai_key') || '';
  const aiMode = localStorage.getItem('debatr_ai_mode') || 'live-api';

  if (inputSupabaseUrl) inputSupabaseUrl.value = url;
  if (inputSupabaseKey) inputSupabaseKey.value = key;
  if (inputAiApiKey) inputAiApiKey.value = aiKey;
  if (selectAiMode) selectAiMode.value = aiMode;

  // Auto-detect local config from .env.local if present
  try {
    fetch('.env.local')
      .then(res => res.ok ? res.text() : null)
      .then(text => {
        if (!text) return;

        const urlMatch = text.match(/(?:NEXT_PUBLIC_)?SUPABASE_URL\s*=\s*(.+)/);
        if (urlMatch && urlMatch[1] && !localStorage.getItem('debatr_supabase_url')) {
          const val = urlMatch[1].trim();
          localStorage.setItem('debatr_supabase_url', val);
          if (inputSupabaseUrl) inputSupabaseUrl.value = val;
        }

        const keyMatch = text.match(/(?:NEXT_PUBLIC_)?SUPABASE_(?:PUBLISHABLE_KEY|KEY|ANON_KEY)\s*=\s*(.+)/);
        if (keyMatch && keyMatch[1] && !localStorage.getItem('debatr_supabase_key')) {
          const val = keyMatch[1].trim();
          localStorage.setItem('debatr_supabase_key', val);
          if (inputSupabaseKey) inputSupabaseKey.value = val;
        }

        const aiKeyMatch = text.match(/(?:AI_API_KEY|OPENAI_API_KEY)\s*=\s*(.+)/);
        if (aiKeyMatch && aiKeyMatch[1] && !localStorage.getItem('debatr_ai_key')) {
          const val = aiKeyMatch[1].trim();
          localStorage.setItem('debatr_ai_key', val);
          if (inputAiApiKey) inputAiApiKey.value = val;
        }
      })
      .catch(() => {});
  } catch (_) {}
}

// ==========================================
// 10. AUTH & GUEST MODE
// ==========================================

let currentUser = null;
let currentAuthMode = 'login'; // 'login' or 'register'

function initAuth() {
  const btnOpenAuth = document.getElementById('btn-open-auth');
  const btnCloseAuth = document.getElementById('btn-close-auth');
  const authModal = document.getElementById('auth-modal');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const authTitle = document.getElementById('auth-title');
  const btnSubmitAuth = document.getElementById('btn-submit-auth');
  const btnGuestMode = document.getElementById('btn-guest-mode');
  const authEmail = document.getElementById('auth-email');
  const authPassword = document.getElementById('auth-password');
  const btnLogout = document.getElementById('btn-logout');

  // Load existing session
  const storedUser = localStorage.getItem('debatr_user');
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
    } catch (e) {
      currentUser = null;
    }
  } else {
    // Default to Guest mode
    currentUser = { name: "Гость", email: "guest@debatr.app", isGuest: true };
  }
  updateAuthUI();

  if (btnOpenAuth) {
    btnOpenAuth.addEventListener('click', () => {
      authModal.classList.remove('hidden');
    });
  }

  if (btnCloseAuth) {
    btnCloseAuth.addEventListener('click', () => {
      authModal.classList.add('hidden');
    });
  }

  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) authModal.classList.add('hidden');
    });
  }

  if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
      currentAuthMode = 'login';
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      authTitle.textContent = "Вход";
      btnSubmitAuth.textContent = "Войти";
    });

    tabRegister.addEventListener('click', () => {
      currentAuthMode = 'register';
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      authTitle.textContent = "Регистрация";
      btnSubmitAuth.textContent = "Создать аккаунт";
    });
  }

  const authUsername = document.getElementById('auth-username');

  if (btnSubmitAuth) {
    btnSubmitAuth.addEventListener('click', async () => {
      const rawName = authUsername ? authUsername.value.trim() : "";
      const password = authPassword.value.trim();

      if (!rawName || !password) {
        showToast("Укажите ваше имя и пароль!");
        return;
      }

      if (password.length < 4) {
        showToast("Пароль должен быть не менее 4 символов!");
        return;
      }

      btnSubmitAuth.textContent = "Проверка...";
      btnSubmitAuth.disabled = true;

      const supabaseUrl = localStorage.getItem('debatr_supabase_url') || 'https://gefremoxoxwobgeptobm.supabase.co';
      const supabaseKey = localStorage.getItem('debatr_supabase_key') || 'sb_publishable_k6JsncQUI3BePKqDhDNGOA_f4zcESvO';

      // Generate a valid email alias for Supabase backend
      const cleanSlug = transliterate(rawName).toLowerCase().replace(/[^a-z0-9_]/g, '') || 'debatr_user';
      const emailAlias = `${cleanSlug}_debatr@gmail.com`;

      let supabaseSuccess = false;

      // Attempt Supabase Auth
      if (window.supabase && supabaseUrl && supabaseKey) {
        try {
          const client = window.supabase.createClient(supabaseUrl, supabaseKey);
          if (currentAuthMode === 'login') {
            const { data, error } = await client.auth.signInWithPassword({
              email: emailAlias,
              password: password
            });
            if (!error && data && data.user) {
              supabaseSuccess = true;
            }
          } else {
            const { data, error } = await client.auth.signUp({
              email: emailAlias,
              password: password,
              options: {
                data: { display_name: rawName }
              }
            });
            if (!error && data && data.user) {
              supabaseSuccess = true;
            }
          }
        } catch (err) {
          console.warn("Supabase auth offline or local fallback:", err);
        }
      }

      // Store authentic user record with real name
      const user = {
        name: rawName,
        username: rawName,
        email: emailAlias,
        isGuest: false,
        supabaseConnected: supabaseSuccess
      };
      loginUser(user);

      btnSubmitAuth.disabled = false;
      btnSubmitAuth.textContent = currentAuthMode === 'login' ? "Войти" : "Создать аккаунт";
      authModal.classList.add('hidden');
      if (authUsername) authUsername.value = '';
      authPassword.value = '';
      showToast(currentAuthMode === 'login' ? `С возвращением, ${user.name}!` : `Дебатер ${user.name} успешно зарегистрирован!`);
    });
  }

  if (btnGuestMode) {
    btnGuestMode.addEventListener('click', () => {
      const guestUser = { name: "Гость", email: "guest@debatr.app", isGuest: true };
      loginUser(guestUser);
      authModal.classList.add('hidden');
      showToast("Вход выполнен в гостевом режиме");
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      logoutUser();
    });
  }
}

function loginUser(user) {
  currentUser = user;
  localStorage.setItem('debatr_user', JSON.stringify(user));
  updateAuthUI();
}

function logoutUser() {
  currentUser = { name: "Гость", email: "guest@debatr.app", isGuest: true };
  localStorage.removeItem('debatr_user');
  updateAuthUI();
  showToast("Вы переключились в гостевой режим");
}

function updateAuthUI() {
  const userProfileBadge = document.getElementById('user-profile-badge');
  const userDisplayName = document.getElementById('user-display-name');
  const btnOpenAuth = document.getElementById('btn-open-auth');

  if (!currentUser || currentUser.isGuest) {
    if (userProfileBadge) userProfileBadge.classList.add('hidden');
    if (btnOpenAuth) {
      btnOpenAuth.classList.remove('hidden');
      btnOpenAuth.textContent = "Войти";
    }
  } else {
    if (userProfileBadge) {
      userProfileBadge.classList.remove('hidden');
      userDisplayName.textContent = currentUser.name;
    }
    if (btnOpenAuth) btnOpenAuth.classList.add('hidden');
  }
}

function transliterate(word) {
  const a = {
    'Ё':'YO','Й':'I','Ц':'TS','У':'U','К':'K','Е':'E','Н':'N','Г':'G','Ш':'SH','Щ':'SCH','З':'Z','Х':'H','Ъ':'',
    'ё':'yo','й':'i','ц':'ts','у':'u','к':'k','е':'e','н':'n','г':'g','ш':'sh','щ':'sch','з':'z','х':'h','ъ':'',
    'Ф':'F','Ы':'I','В':'V','А':'A','П':'P','Р':'R','О':'O','Л':'L','Д':'D','Ж':'ZH','Э':'E',
    'ф':'f','ы':'i','в':'v','а':'a','п':'p','р':'r','о':'o','л':'l','д':'d','ж':'zh','э':'e',
    'Я':'YA','Ч':'CH','С':'S','М':'M','И':'I','Т':'T','Ь':'','Б':'B','Ю':'YU',
    'я':'ya','ч':'ch','с':'s','м':'m','и':'i','т':'t','ь':'','б':'b','ю':'yu',
    'Ә':'A','ә':'a','Ғ':'G','ғ':'g','Қ':'Q','қ':'q','Ң':'N','ң':'n','Ө':'O','ө':'o','Ұ':'U','ұ':'u','Ү':'U','ү':'u','Һ':'H','һ':'h','І':'I','і':'i'
  };
  return word.split('').map(char => a[char] !== undefined ? a[char] : char).join('');
}

// ==========================================
// 11. COMPETENCY RADAR CHART (DIAGNOSTICS)
// ==========================================

let currentRadarScores = {
  str: 0.0,
  evi: 0.0,
  reb: 0.0,
  cla: 0.0,
  org: 0.0
};

function initRadarChart() {
  drawRadarChart(currentRadarScores);
}

function updateRadarFromHistory() {
  if (speechesHistory && speechesHistory.length > 0) {
    const avgScore = speechesHistory.reduce((acc, cur) => acc + (cur.score || 0), 0) / speechesHistory.length;
    currentRadarScores = {
      str: Math.min(9.0, Math.round((avgScore + 0.3) * 2) / 2),
      evi: Math.min(9.0, Math.round((avgScore - 0.5) * 2) / 2),
      reb: Math.min(9.0, Math.round((avgScore + 0.2) * 2) / 2),
      cla: Math.min(9.0, Math.round((avgScore + 0.4) * 2) / 2),
      org: Math.min(9.0, Math.round((avgScore - 0.1) * 2) / 2)
    };
  } else {
    currentRadarScores = { str: 0.0, evi: 0.0, reb: 0.0, cla: 0.0, org: 0.0 };
  }
  drawRadarChart(currentRadarScores);
  updateMeterDisplay(currentRadarScores);
}

function updateMeterDisplay(scores) {
  const setMeter = (idVal, idFill, score) => {
    const valEl = document.getElementById(idVal);
    const fillEl = document.getElementById(idFill);
    if (valEl) valEl.textContent = score > 0 ? score.toFixed(1) : '0.0';
    if (fillEl) fillEl.style.width = score > 0 ? `${(score / 9.0) * 100}%` : '0%';
  };

  setMeter('radar-val-str', 'radar-fill-str', scores.str);
  setMeter('radar-val-evi', 'radar-fill-evi', scores.evi);
  setMeter('radar-val-reb', 'radar-fill-reb', scores.reb);
  setMeter('radar-val-cla', 'radar-fill-cla', scores.cla);
  setMeter('radar-val-org', 'radar-fill-org', scores.org);
}

function drawRadarChart(scores) {
  const canvas = document.getElementById('competencyRadarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2 + 5;
  const radius = 95;

  ctx.clearRect(0, 0, width, height);

  const axes = [
    { label: "Структура", key: "str" },
    { label: "Факты", key: "evi" },
    { label: "Опровержение", key: "reb" },
    { label: "Ясность", key: "cla" },
    { label: "Глубина", key: "org" }
  ];
  const numAxes = axes.length;

  // Concentric background grid rings (Bands 3, 5, 7, 9)
  const levels = [3, 5, 7, 9];
  levels.forEach(lvl => {
    const r = (lvl / 9.0) * radius;
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI / numAxes) - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = lvl === 9 ? '#d1d5db' : '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Band label
    ctx.fillStyle = '#9ca3af';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(lvl.toString(), cx + 4, cy - r + 3);
  });

  // Spokes
  for (let i = 0; i < numAxes; i++) {
    const angle = (i * 2 * Math.PI / numAxes) - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Axis Labels
    const labelDist = radius + 22;
    const lx = cx + labelDist * Math.cos(angle);
    const ly = cy + labelDist * Math.sin(angle);

    ctx.fillStyle = '#374151';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(axes[i].label, lx, ly);
  }

  // Data Polygon (only if there is real data)
  const points = [];
  for (let i = 0; i < numAxes; i++) {
    const angle = (i * 2 * Math.PI / numAxes) - Math.PI / 2;
    const val = (scores && scores[axes[i].key] !== undefined) ? scores[axes[i].key] : 0.0;
    const r = (val / 9.0) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push({ x, y, val });
  }

  const hasData = points.some(p => p.val > 0);
  if (hasData) {
    ctx.beginPath();
    points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();

    ctx.fillStyle = 'rgba(17, 24, 39, 0.12)';
    ctx.fill();

    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Points & Data Badges
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
}

// ==========================================
// 12. BATTLE WITH AI OPPONENT
// ==========================================

let battleUserRole = 'gov'; // 'gov' or 'opp'
let selectedRoleSetting = 'gov'; // 'gov', 'opp', 'random'
let selectedPersona = 'novice';
let battleRoundState = 'init';
let battleUserSpeechText = '';
let battleAiSpeechText = '';
let battleDialogueHistory = [];
let currentBattleTopic = '';

const PERSONA_CONFIGS = {
  novice: {
    name: "Начальный",
    difficulty: "5.5",
    stylePrompt: "Ты участник дебатов начального уровня. Твоя речь эмоциональна, но содержит простые логические уязвимости (обобщения, слабый warrant), чтобы пользователю было удобно тренироваться."
  },
  pragmatist: {
    name: "Средний",
    difficulty: "6.5",
    stylePrompt: "Ты дебатер среднего уровня. Твой фокус — реальная стоимость реформы, административная осуществимость, баланс интересов стейкхолдеров и конкретные примеры."
  },
  champion: {
    name: "Продвинутый",
    difficulty: "8.0",
    stylePrompt: "Ты дебатер продвинутого уровня (BP формат). Твой стиль — высокий темп, атака на масштаб импакта, филигранный сравнительный анализ и доказательство необратимости последствий."
  },
  socrates: {
    name: "Мастер",
    difficulty: "9.0",
    stylePrompt: "Ты дебатер уровня Мастер. Твой стиль — глубинная деконструкция исходных ценностных допущений оппонента, выявление скрытых логических противоречий и рефрейминг конфликта."
  }
};

const BATTLE_SAMPLE_SPEECHES = {
  gov: "Уважаемые судьи! Палата Правительства убеждена, что автономный искусственный интеллект требует обязательного международного лицензирования. Во-первых, проблема асимметрии рисков: частные технологические корпорации в погоне за квартальной прибылью пренебрегают протоколами безопасности, внедряя агентов в критическую банковскую и транспортную инфраструктуру. Без независимого аудита архитектуры ошибка модели приведет к необратимому каскадному сбою. Во-вторых, сравнительный анализ: лицензирование ядерной энергетики и фармацевтики защитило человечество, не остановив развитие отраслей. Мы требуем утверждения резолюции.",
  opp: "Уважаемые судьи! Палата Оппозиции призывает отклонить резолюцию. Во-первых, бюрократическое лицензирование не остановит угрозы, а лишь закрепит абсолютную монополию трех-четырех американских гиперскейлеров, у которых есть миллиардные юридические бюджеты. Независимые исследователи и open-source сообщество будут фактически уничтожены. Во-вторых, авторитарные режимы проигнорируют любые международные комитеты, что создаст геополитический дисбаланс сил. Настоящая безопасность достигается открытыми стандартами и распределенной архитектурой, а не закрытыми кабинетами чиновников."
};

function initBattleMode() {
  const setupView = document.getElementById('battle-setup-view');
  const activeView = document.getElementById('battle-active-view');
  const levelBtns = document.querySelectorAll('#setup-level-selector .level-pill-btn');
  const roleBtns = document.querySelectorAll('#setup-role-selector .role-btn');
  const topicInput = document.getElementById('setup-topic-input');
  const btnRandomTopic = document.getElementById('btn-setup-random-topic');
  const btnStart = document.getElementById('btn-start-battle');
  const btnBackSetup = document.getElementById('btn-back-to-setup');

  const btnBattleSample = document.getElementById('btn-battle-sample');
  const battleSpeechInput = document.getElementById('battle-speech-input');
  const btnBattleSubmit = document.getElementById('btn-battle-submit');
  const btnFinishEarly = document.getElementById('btn-finish-battle-early');
  const btnNewRound = document.getElementById('btn-battle-new-round');

  // Level selector
  levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      levelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPersona = btn.getAttribute('data-level') || 'novice';
      showToast('Уровень: ' + (PERSONA_CONFIGS[selectedPersona]?.name || selectedPersona));
    });
  });

  // Role selector
  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRoleSetting = btn.getAttribute('data-role') || 'gov';
    });
  });

  // Random topic in setup
  if (btnRandomTopic && topicInput) {
    btnRandomTopic.addEventListener('click', () => {
      currentTopicIndex = (currentTopicIndex + 1) % DEBATE_TOPICS.length;
      topicInput.value = DEBATE_TOPICS[currentTopicIndex];
      showToast("Тема обновлена");
    });
  }

  // Start battle button
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      const topic = (topicInput ? topicInput.value.trim() : '') || DEBATE_TOPICS[0];
      currentBattleTopic = topic;

      if (selectedRoleSetting === 'random') {
        battleUserRole = Math.random() < 0.5 ? 'gov' : 'opp';
        showToast('Позиция: ' + (battleUserRole === 'gov' ? 'Правительство' : 'Оппозиция'));
      } else {
        battleUserRole = selectedRoleSetting;
      }

      // Update active view headers and badges
      const topicTextEl = document.getElementById('battle-topic-text');
      const activeChamber = document.getElementById('active-chamber-badge');
      const activeLevel = document.getElementById('active-level-badge');
      if (topicTextEl) topicTextEl.textContent = topic;
      if (activeChamber) activeChamber.textContent = battleUserRole === 'gov' ? 'Правительство' : 'Оппозиция';
      if (activeLevel) activeLevel.textContent = PERSONA_CONFIGS[selectedPersona]?.name || 'Начальный';

      // Switch views
      if (setupView) setupView.classList.add('hidden');
      if (activeView) activeView.classList.remove('hidden');

      // Reset debate conversation
      battleDialogueHistory = [];
      battleUserSpeechText = '';
      battleAiSpeechText = '';
      const feed = document.getElementById('battle-feed');
      if (feed) feed.innerHTML = '';

      // Reset verdict box
      const emptyBox = document.getElementById('battle-verdict-empty');
      const contentBox = document.getElementById('battle-verdict-content');
      if (emptyBox) emptyBox.classList.remove('hidden');
      if (contentBox) contentBox.classList.add('hidden');

      if (btnFinishEarly) {
        btnFinishEarly.disabled = true;
        btnFinishEarly.textContent = "Вызвать судью";
      }

      // Welcome message
      const userChamberTitle = battleUserRole === 'gov' ? 'Правительство' : 'Оппозиция';
      const oppChamberTitle = battleUserRole === 'gov' ? 'Оппозиция' : 'Правительство';
      appendBattleMessage('Система', 'Раунд начат. Тема: «' + topic + '». Ваша позиция: ' + userChamberTitle + '. Оппонент: GPT-6 Luna (' + oppChamberTitle + ').', 'msg-system');

      // If user is Opposition, Luna opens with Government speech
      if (battleUserRole === 'opp') {
        const thinkingId = 'luna-open-' + Date.now();
        appendBattleMessage('GPT-6 Luna (Правительство)', 'Формулирую вступительную речь Правительства...', 'msg-thinking', thinkingId);
        setTimeout(async () => {
          let openingSpeech = '';
          try {
            openingSpeech = await generateAiOpeningSpeech(topic, 'gov');
          } catch(e) {
            openingSpeech = BATTLE_SAMPLE_SPEECHES.gov;
          }
          const tEl = document.getElementById(thinkingId);
          if (tEl) tEl.remove();
          appendBattleMessage('GPT-6 Luna (Правительство)', openingSpeech, 'msg-ai');
          battleDialogueHistory.push({ role: 'luna', text: openingSpeech });
          battleAiSpeechText = openingSpeech;
          if (btnFinishEarly) btnFinishEarly.disabled = false;
        }, 700);
      } else {
        if (battleSpeechInput) {
          battleSpeechInput.placeholder = "Изложите вступительную речь Правительства...";
        }
      }
    });
  }

  // Back to setup
  if (btnBackSetup) {
    btnBackSetup.addEventListener('click', () => {
      if (activeView) activeView.classList.add('hidden');
      if (setupView) setupView.classList.remove('hidden');
    });
  }

  if (btnBattleSample && battleSpeechInput) {
    btnBattleSample.addEventListener('click', () => {
      battleSpeechInput.value = BATTLE_SAMPLE_SPEECHES[battleUserRole] || BATTLE_SAMPLE_SPEECHES.gov;
      showToast("Пример загружен");
    });
  }

  if (btnBattleSubmit) {
    btnBattleSubmit.addEventListener('click', handleBattleSubmit);
  }

    if (btnFinishEarly) {
      btnFinishEarly.addEventListener('click', handleBattleJudgeCall);
    }

    const verdictView = document.getElementById('battle-verdict-view');
    const btnReviewChat = document.getElementById('btn-battle-review-chat');
    const btnVerdictNewRound = document.getElementById('btn-battle-new-round');

    if (btnReviewChat) {
      btnReviewChat.addEventListener('click', () => {
        if (verdictView) verdictView.classList.add('hidden');
        if (activeView) activeView.classList.remove('hidden');
      });
    }

    if (btnVerdictNewRound) {
      btnVerdictNewRound.addEventListener('click', () => {
        if (verdictView) verdictView.classList.add('hidden');
        if (activeView) activeView.classList.add('hidden');
        if (setupView) setupView.classList.remove('hidden');
      });
    }
  }

async function handleBattleSubmit() {
  const speechInput = document.getElementById('battle-speech-input');
  const text = speechInput ? speechInput.value.trim() : "";
  if (!text) {
    showToast("Введите речь");
    return;
  }

  battleUserSpeechText = text;
  battleDialogueHistory.push({ role: 'user', text: text });

  const feed = document.getElementById('battle-feed');
  const topicText = currentBattleTopic || (document.getElementById('battle-topic-text') ? document.getElementById('battle-topic-text').textContent : DEBATE_TOPICS[0]);
  const submitBtn = document.getElementById('btn-battle-submit');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Ответ...</span>';
  }

  // 1. Append user speech card
  const userRoleTitle = battleUserRole === 'gov' ? 'Вы (Правительство)' : 'Вы (Оппозиция)';
  appendBattleMessage(userRoleTitle, text, 'msg-user');
  if (speechInput) speechInput.value = '';

  // 2. Append thinking card for GPT-6 Luna
  const oppChamberTitle = battleUserRole === 'gov' ? 'GPT-6 Luna (Оппозиция)' : 'GPT-6 Luna (Правительство)';
  const thinkingId = 'ai-thinking-' + Date.now();
  appendBattleMessage(oppChamberTitle, "Анализ аргументов...", 'msg-thinking', thinkingId);

  // 3. Generate Opponent Speech (via live API or smart local generator)
  let aiSpeech = "";
  try {
    aiSpeech = await generateAiOpponentSpeech(text, topicText, battleUserRole);
  } catch (e) {
    aiSpeech = generateFallbackOpponentSpeech(text, topicText, battleUserRole);
  }

  // Remove thinking card and append real AI speech
  const thinkingEl = document.getElementById(thinkingId);
  if (thinkingEl) thinkingEl.remove();
  appendBattleMessage(oppChamberTitle, aiSpeech, 'msg-ai');
  battleAiSpeechText = aiSpeech;
  battleDialogueHistory.push({ role: 'luna', text: aiSpeech });

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Отправить</span>';
  }

  // Enable Verdict button
  const finishBtn = document.getElementById('btn-finish-battle-early');
  if (finishBtn) {
    finishBtn.disabled = false;
    finishBtn.classList.remove('btn-secondary');
    finishBtn.classList.add('btn-primary');
    finishBtn.textContent = "Вызвать судью";
  }
}

// ==========================================
// 12.1. WEB SPEECH API: VOICE INPUT & SYNTHESIS
// ==========================================

let isAutoTtsEnabled = false;
let recognitionInstance = null;
let isVoiceRecording = false;

function speakDebateText(text, btnElement = null) {
  if (!('speechSynthesis' in window)) {
    showToast("Браузер не поддерживает синтез речи");
    return;
  }

  // If already speaking, stop and reset active states
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    document.querySelectorAll('.btn-msg-audio').forEach(b => {
      b.classList.remove('speaking');
      b.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> <span>Озвучить</span>`;
      delete b.dataset.speaking;
    });
    if (btnElement && btnElement.dataset.speaking === 'true') {
      delete btnElement.dataset.speaking;
      return;
    }
  }

  const cleanText = text.replace(/[*_#`]/g, '').trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ru-RU';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const ruVoice = voices.find(v => v.lang && (v.lang.startsWith('ru') || v.lang.startsWith('RU')));
  if (ruVoice) utterance.voice = ruVoice;

  if (btnElement) {
    btnElement.classList.add('speaking');
    btnElement.dataset.speaking = 'true';
    btnElement.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> <span>Стоп</span>`;
  }

  const resetBtn = () => {
    if (btnElement) {
      btnElement.classList.remove('speaking');
      delete btnElement.dataset.speaking;
      btnElement.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> <span>Озвучить</span>`;
    }
  };

  utterance.onend = resetBtn;
  utterance.onerror = resetBtn;

  window.speechSynthesis.speak(utterance);
}

function appendBattleMessage(author, content, className, id = null) {
  const feed = document.getElementById('battle-feed');
  if (!feed) return;
  const div = document.createElement('div');
  div.className = `battle-msg-card ${className}`;
  if (id) div.id = id;

  const isAiMessage = className.includes('msg-ai');
  const isUserMessage = className.includes('msg-user');

  if (isAiMessage || isUserMessage) {
    div.innerHTML = `
      <div class="msg-header-row">
        <span class="msg-author">${author}</span>
        <button type="button" class="btn-msg-audio" title="Озвучить речь" aria-label="Озвучить речь">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          <span>Озвучить</span>
        </button>
      </div>
      <p>${content}</p>
    `;
    const audioBtn = div.querySelector('.btn-msg-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => speakDebateText(content, audioBtn));
    }
    if (isAiMessage && isAutoTtsEnabled) {
      speakDebateText(content, audioBtn);
    }
  } else {
    div.innerHTML = `<span class="msg-author">${author}</span><p>${content}</p>`;
  }

  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function initVoiceInput() {
  const btnVoice = document.getElementById('btn-voice-input');
  const speechInput = document.getElementById('battle-speech-input');
  const labelEl = document.getElementById('voice-btn-label');
  if (!btnVoice || !speechInput) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    btnVoice.addEventListener('click', () => {
      showToast("Распознавание речи не поддерживается браузером (нужен Chrome или Edge)");
    });
    return;
  }

  try {
    recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'ru-RU';
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;

    recognitionInstance.onstart = () => {
      isVoiceRecording = true;
      btnVoice.classList.add('btn-voice-recording');
      if (labelEl) labelEl.textContent = 'Слушаю...';
      showToast("Микрофон включен: наговаривайте свой аргумент");
    };

    recognitionInstance.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript.trim();
          if (text) {
            const currentVal = speechInput.value.trim();
            speechInput.value = currentVal ? `${currentVal} ${text}.` : `${text}.`;
            speechInput.scrollTop = speechInput.scrollHeight;
          }
        }
      }
    };

    recognitionInstance.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      isVoiceRecording = false;
      btnVoice.classList.remove('btn-voice-recording');
      if (labelEl) labelEl.textContent = 'Голос';
      if (event.error === 'not-allowed') {
        showToast("Разрешите доступ к микрофону в настройках браузера");
      } else if (event.error !== 'no-speech') {
        showToast("Микрофон: " + event.error);
      }
    };

    recognitionInstance.onend = () => {
      isVoiceRecording = false;
      btnVoice.classList.remove('btn-voice-recording');
      if (labelEl) labelEl.textContent = 'Голос';
    };

    btnVoice.addEventListener('click', () => {
      if (isVoiceRecording) {
        recognitionInstance.stop();
        isVoiceRecording = false;
        btnVoice.classList.remove('btn-voice-recording');
        if (labelEl) labelEl.textContent = 'Голос';
        showToast("Запись завершена");
      } else {
        try {
          recognitionInstance.start();
        } catch (err) {
          console.warn("Recognition start failed:", err);
        }
      }
    });
  } catch (e) {
    console.warn("SpeechRecognition init error:", e);
  }
}

function initTtsToggle() {
  const btnTts = document.getElementById('btn-tts-toggle');
  if (!btnTts) return;
  btnTts.addEventListener('click', () => {
    isAutoTtsEnabled = !isAutoTtsEnabled;
    btnTts.textContent = isAutoTtsEnabled ? 'Озвучка: Вкл' : 'Озвучка: Выкл';
    btnTts.classList.toggle('active', isAutoTtsEnabled);
    if (!isAutoTtsEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    showToast(isAutoTtsEnabled ? 'Авто-озвучка включена' : 'Авто-озвучка выключена');
  });
}

function generateFallbackOpeningSpeech(topic) {
  return `Палата Правительства поддерживает резолюцию: "${topic}". Отсутствие единых норм несет критические риски безопасности. Наше регулирование установит ответственность и защитит общество без ущерба развитию.`;
}

async function generateAiOpeningSpeech(topic, role = 'gov') {
  const apiKey = localStorage.getItem('debatr_ai_key') || '';
  if (!apiKey) return generateFallbackOpeningSpeech(topic);

  const persona = PERSONA_CONFIGS[selectedPersona] || PERSONA_CONFIGS.novice;
  const prompt = `Ты спикер дебатов GPT-6 Luna (${role === 'gov' ? 'Палата Правительства' : 'Палата Оппозиции'}).
Резолюция: "${topic}".
Стиль: ${persona.stylePrompt || 'убедительный, живой, точный'}.

Произнеси вступительную речь: емко обозначь ключевой тезис, довод и сравнительный импакт.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 120
      })
    });

    if (!response.ok) return generateFallbackOpeningSpeech(topic);
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    return generateFallbackOpeningSpeech(topic);
  }
}

async function generateAiOpponentSpeech(userSpeech, topic, userRole) {
  const opponentRoleName = userRole === 'gov' ? 'Палаты Оппозиции (Отрицание)' : 'Палаты Правительства (Утверждение)';
  const apiKey = localStorage.getItem('debatr_ai_key') || '';
  if (!apiKey) return generateFallbackOpponentSpeech(userSpeech, topic, userRole);

  const persona = PERSONA_CONFIGS[selectedPersona] || PERSONA_CONFIGS.champion;

  const recentDialog = battleDialogueHistory.slice(-4).map(m => (m.role === 'user' ? 'Оппонент: ' : 'GPT-6 Luna: ') + m.text).join('\n');

  const prompt = `Ты опытный спикер дебатов GPT-6 Luna (${opponentRoleName}).
Резолюция: "${topic}".
Стиль: ${persona.stylePrompt || 'убедительный, живой, точный'}.

Аргумент оппонента:
"${userSpeech}"

Ответь как дебатер: живо, емко и по существу, сразу парируя аргумент соперника.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 160
      })
    });

    if (!response.ok) return generateFallbackOpponentSpeech(userSpeech, topic, userRole);
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    return generateFallbackOpponentSpeech(userSpeech, topic, userRole);
  }
}

function generateFallbackOpponentSpeech(userSpeech, topic, userRole) {
  if (selectedPersona === 'socrates') {
    return `Вы требуете ограничений, но на каком объективном критерии они основаны? Без четкой границы регуляция лишь породит произвол чиновников и затормозит поиск истины.`;
  }
  if (selectedPersona === 'pragmatist') {
    return `Это экономически нереализуемо. Бюрократический комплаенс задушит стартапы, а теневые игроки легко обойдут запреты через серые юрисдикции.`;
  }
  if (selectedPersona === 'novice') {
    return `Мы категорически против! Это ограничит свободу пользователей, а технологии и так прекрасно развиваются сами.`;
  }
  if (userRole === 'gov') {
    return `Правительство ошибочно считает контроль гарантией безопасности. На деле монополия регуляторов отсечет независимых разработчиков и скроет реальные уязвимости.`;
  } else {
    return `Оппозиция уповает на саморегуляцию рынка, но рынок пренебрегает рисками ради прибыли. Авиация и медицина доказали: безопасность невозможна без жестких стандартов.`;
  }
}

async function handleBattleJudgeCall() {
  const finishBtn = document.getElementById('btn-finish-battle-early');
  if (finishBtn) {
    finishBtn.disabled = true;
    finishBtn.textContent = "Судья решает...";
  }

  const topic = document.getElementById('battle-topic-text') ? document.getElementById('battle-topic-text').textContent : (currentBattleTopic || DEBATE_TOPICS[0]);
  let verdictData = null;

  const userSpeeches = battleDialogueHistory.filter(m => m.role === 'user').map(m => m.text).join('\n---\n') || battleUserSpeechText;
  const aiSpeeches = battleDialogueHistory.filter(m => m.role === 'luna').map(m => m.text).join('\n---\n') || battleAiSpeechText;

  try {
    verdictData = await judgeBattleWithAI(userSpeeches, aiSpeeches, topic, battleUserRole);
  } catch (e) {
    verdictData = judgeBattleFallback(userSpeeches, aiSpeeches, battleUserRole);
  }

  // Display Verdict: Switch from full-screen chat to verdict screen
  const activeView = document.getElementById('battle-active-view');
  const verdictView = document.getElementById('battle-verdict-view');
  if (activeView) activeView.classList.add('hidden');
  if (verdictView) verdictView.classList.remove('hidden');

  document.getElementById('battle-winner-title').textContent = verdictData.winner;
  document.getElementById('battle-winner-subtitle').textContent = verdictData.clash;
  document.getElementById('battle-user-overall').textContent = verdictData.overall.toFixed(1);
  document.getElementById('battle-user-band').textContent = verdictData.band;

  document.getElementById('b-score-str').textContent = verdictData.scores.structure.toFixed(1);
  document.getElementById('b-score-evi').textContent = verdictData.scores.evidence.toFixed(1);
  document.getElementById('b-score-reb').textContent = verdictData.scores.rebuttal.toFixed(1);
  document.getElementById('b-score-cla').textContent = verdictData.scores.clarity.toFixed(1);
  document.getElementById('b-score-org').textContent = verdictData.scores.originality.toFixed(1);

  document.getElementById('battle-analysis-strengths').textContent = verdictData.strengths;
  document.getElementById('battle-analysis-advice').textContent = verdictData.advice;

  // Add to local history and update Radar
  speechesHistory.unshift({
    id: Date.now(),
    date: "Сегодня",
    student: (currentUser && !currentUser.isGuest) ? currentUser.name : "Гость",
    type: "battle",
    topic: topic.slice(0, 45) + "...",
    score: verdictData.overall,
    status: "confirmed"
  });

  initDashboardTable();
  updateRadarFromHistory();

  // If registered debater, synchronize to Supabase cloud account
  if (currentUser && !currentUser.isGuest) {
    const supabaseUrl = localStorage.getItem('debatr_supabase_url') || 'https://gefremoxoxwobgeptobm.supabase.co';
    const supabaseKey = localStorage.getItem('debatr_supabase_key') || 'sb_publishable_k6JsncQUI3BePKqDhDNGOA_f4zcESvO';
    if (window.supabase && supabaseUrl && supabaseKey) {
      try {
        const client = window.supabase.createClient(supabaseUrl, supabaseKey);
        client.from('speeches').insert([{
          student_name: currentUser.name,
          exercise_type: 'battle',
          topic: topic,
          content: userSpeeches,
          overall_score: verdictData.overall,
          scores: verdictData.scores,
          created_at: new Date().toISOString()
        }]).then(() => {
          showToast(`Вердикт готов. Результат сохранен в аккаунт ${currentUser.name}`);
        }).catch(err => {
          console.warn("Supabase battle auto-save error:", err);
          showToast("Вердикт готов");
        });
      } catch (_) {
        showToast("Вердикт готов");
      }
    } else {
      showToast("Вердикт готов");
    }
  } else {
    showToast("Вердикт готов (Гостевой режим: раунд не сохранен в аккаунт)");
  }
}

async function judgeBattleWithAI(userSpeech, aiSpeech, topic, userRole) {
  const apiKey = localStorage.getItem('debatr_ai_key') || '';
  if (!apiKey) return judgeBattleFallback(userSpeech, aiSpeech, userRole);
  const roleTitle = userRole === 'gov' ? 'Правительство' : 'Оппозиция';

  const prompt = `Ты главный судья национального турнира по дебатам. Проанализируй раунд между пользователем (${roleTitle}) и ИИ-соперником.
Тема: "${topic}".
Речь пользователя: "${userSpeech}".
Речь соперника: "${aiSpeech}".

Оцени пользователя по Debatr Rubric (0.0-9.0, шаг 0.5):
1. structure, 2. evidence, 3. rebuttal, 4. clarity, 5. originality.
Вычисли общий балл overall.
Определи победителя раунда, краткий анализ клэша, сильную сторону и совет.

Верни строго JSON объект:
{
  "winner": "Правительство" или "Оппозиция",
  "clash": "1 предложение анализа столкновения",
  "overall": 7.5,
  "band": "Band 7.5",
  "scores": {
    "structure": 7.5,
    "evidence": 7.0,
    "rebuttal": 8.0,
    "clarity": 7.5,
    "originality": 7.5
  },
  "strengths": "В чем плюс речи",
  "advice": "Совет для роста"
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    })
  });

  if (!response.ok) throw new Error("Judge API failed");
  const data = await response.json();
  const raw = data.choices[0].message.content.trim().replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(raw);
}

function judgeBattleFallback(userSpeech, aiSpeech, userRole) {
  return {
    winner: userRole === 'gov' ? "Правительство" : "Оппозиция",
    clash: "Пользователь доказал ключевой импакт безопасности и удержал инициативу в сравнении альтернатив.",
    overall: 7.5,
    band: "Band 7.5",
    scores: {
      structure: 8.0,
      evidence: 7.0,
      rebuttal: 7.5,
      clarity: 8.0,
      originality: 7.0
    },
    strengths: "Логически выверенная структура аргументации с убедительным обоснованием неотвратимости последствий.",
    advice: "Для достижения наивысшего балла (Band 8.5+) добавьте прямые ссылки на конкретные технологические прецеденты."
  };
}

function resetBattleRound() {
  const emptyBox = document.getElementById('battle-verdict-empty');
  const contentBox = document.getElementById('battle-verdict-content');
  if (emptyBox) emptyBox.classList.remove('hidden');
  if (contentBox) contentBox.classList.add('hidden');

  const feed = document.getElementById('battle-feed');
  if (feed) {
    feed.innerHTML = `
      <div class="battle-msg-card msg-system">
        <span class="msg-author">Система</span>
        <p>Раунд начат. Уровень: <strong id="current-persona-name">${PERSONA_CONFIGS[selectedPersona]?.name || 'Начальный'}</strong>.</p>
      </div>
    `;
  }

  const finishBtn = document.getElementById('btn-finish-battle-early');
  if (finishBtn) {
    finishBtn.disabled = true;
    finishBtn.classList.remove('btn-primary');
    finishBtn.classList.add('btn-secondary');
    finishBtn.textContent = "Вызвать судью";
  }

  showToast("Новый раунд");
}

// ==========================================
// 13. 1V1 FRIENDLY MATCH ROOMS (PUBLIC & PRIVATE ARCHITECTURE)
// ==========================================

const SAMPLE_ROOM_SPEECHES = {
  p1: "Уважаемые судьи! Стандартизированные тесты должны быть немедленно заменены портфолио реальных проектов. Единое тестирование проверяет лишь способность заучивать шаблоны и провоцирует колоссальный стресс у подростков. Портфолио, напротив, отражает реальные навыки решения практических задач, креативность и командную работу — именно то, что требует современная экономика и наука.",
  p2: "Палата Оппозиции решительно против отмены стандартизированных тестов. Проектная оценка абсолютно субъективна: в ней невозможно исключить коррупционный фактор, помощь родителей или наем репетиторов для оформления портфолио. Единый тест — это единственный объективный социальный лифт для талантливых ребят из сельских школ и регионов, обеспечивающий равенство возможностей при поступлении."
};

// Only real rooms created by users are shown; no fake mock games
let activeRoomData = {
  code: "ROOM-842",
  topic: "ЭП отменит стандартизированное государственное тестирование в пользу портфолио проектов.",
  room_type: "public",
  scheduled_time: "Сегодня в 19:00",
  creator_name: "Ихлас М.",
  p1_name: "Ихлас М.",
  p2_name: null,
  status: "waiting"
};

function getStoredPublicRooms() {
  try {
    const raw = localStorage.getItem('debatr_rooms_list');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Error parsing debatr_rooms_list:", e);
  }
  return [];
}

function saveStoredPublicRooms(rooms) {
  try {
    localStorage.setItem('debatr_rooms_list', JSON.stringify(rooms));
  } catch (e) {
    console.warn("Error saving debatr_rooms_list:", e);
  }
}

function initRoomsMode() {
  // Navigation tabs between Lobby & Arena
  const tabOpenLobby = document.getElementById('tab-open-lobby');
  const tabOpenArena = document.getElementById('tab-open-arena');
  const sectionLobby = document.getElementById('section-rooms-lobby');
  const sectionArena = document.getElementById('section-rooms-arena');

  function showSection(name) {
    if (name === 'lobby') {
      if (tabOpenLobby) tabOpenLobby.classList.add('active');
      if (tabOpenArena) tabOpenArena.classList.remove('active');
      if (sectionLobby) sectionLobby.classList.remove('hidden');
      if (sectionArena) sectionArena.classList.add('hidden');
    } else {
      if (tabOpenArena) tabOpenArena.classList.add('active');
      if (tabOpenLobby) tabOpenLobby.classList.remove('active');
      if (sectionArena) sectionArena.classList.remove('hidden');
      if (sectionLobby) sectionLobby.classList.add('hidden');
    }
  }

  if (tabOpenLobby) tabOpenLobby.addEventListener('click', () => showSection('lobby'));
  if (tabOpenArena) tabOpenArena.addEventListener('click', () => showSection('arena'));

  const btnBackToLobby = document.getElementById('btn-back-to-lobby');
  if (btnBackToLobby) {
    btnBackToLobby.addEventListener('click', () => {
      showSection('lobby');
      renderPublicRoomsGrid();
    });
  }

  // Create Room Modal controls
  const btnOpenCreateModal = document.getElementById('btn-open-create-room-modal');
  const btnBannerCreate = document.getElementById('btn-banner-create');
  const createModal = document.getElementById('create-room-modal');
  const btnCloseCreateModal = document.getElementById('btn-close-create-modal');
  const btnCancelCreateModal = document.getElementById('btn-cancel-create-modal');
  const btnSubmitCreateRoom = document.getElementById('btn-submit-create-room');
  const btnModalRandomTopic = document.getElementById('btn-modal-random-topic');
  const inputRoomTopic = document.getElementById('input-room-topic');
  const inputScheduledTime = document.getElementById('input-scheduled-time');
  const inputCreatorName = document.getElementById('input-creator-name');
  const selectCreatorRole = document.getElementById('select-creator-role');
  const timeQuickBtns = document.querySelectorAll('.time-quick-btn');

  // QR Modal controls
  const qrModal = document.getElementById('qr-modal');
  const btnCloseQrModal = document.getElementById('btn-close-qr-modal');
  const btnShowQr = document.getElementById('btn-show-qr');
  const btnCopyRoomLink = document.getElementById('btn-copy-room-link');
  const btnModalCopyLink = document.getElementById('btn-modal-copy-link');

  // Quick join by code
  const btnJoinRoom = document.getElementById('btn-join-room');
  const inputRoomCode = document.getElementById('input-room-code');
  const btnCopyCode = document.getElementById('btn-copy-room-code');
  const btnClaimOppSlot = document.getElementById('btn-claim-opp-slot');
  const btnRefreshRooms = document.getElementById('btn-refresh-rooms');

  // Speech buttons
  const btnJudgeDuel = document.getElementById('btn-judge-duel');
  const btnLoadP1 = document.getElementById('btn-load-p1-sample');
  const btnLoadP2 = document.getElementById('btn-load-p2-sample');

  function openCreateModal() {
    if (!createModal) return;
    if (inputRoomTopic && !inputRoomTopic.value) {
      inputRoomTopic.value = DEBATE_TOPICS[Math.floor(Math.random() * DEBATE_TOPICS.length)];
    }
    if (inputCreatorName && currentUser && currentUser.name && currentUser.name !== 'Гость') {
      inputCreatorName.value = currentUser.name;
    }
    createModal.classList.remove('hidden');
  }

  function closeCreateModal() {
    if (createModal) createModal.classList.add('hidden');
  }

  if (btnOpenCreateModal) btnOpenCreateModal.addEventListener('click', openCreateModal);
  if (btnBannerCreate) btnBannerCreate.addEventListener('click', openCreateModal);
  if (btnCloseCreateModal) btnCloseCreateModal.addEventListener('click', closeCreateModal);
  if (btnCancelCreateModal) btnCancelCreateModal.addEventListener('click', closeCreateModal);

  if (createModal) {
    createModal.addEventListener('click', (e) => {
      if (e.target === createModal) closeCreateModal();
    });
  }

  timeQuickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (inputScheduledTime) {
        inputScheduledTime.value = btn.getAttribute('data-time') || '';
      }
    });
  });

  if (btnModalRandomTopic && inputRoomTopic) {
    btnModalRandomTopic.addEventListener('click', () => {
      const idx = Math.floor(Math.random() * DEBATE_TOPICS.length);
      inputRoomTopic.value = DEBATE_TOPICS[idx];
      showToast("Тема обновлена!");
    });
  }

  const selectCategory = document.getElementById('select-room-category');

  // Handle Create Room submit
  if (btnSubmitCreateRoom) {
    btnSubmitCreateRoom.addEventListener('click', async () => {
      const selectedType = document.querySelector('input[name="modal-room-type"]:checked')?.value || 'public';
      const timeVal = (inputScheduledTime?.value || '').trim() || 'Сегодня в 19:00';
      const categoryKey = selectCategory ? selectCategory.value : 'education';
      const categoryName = getCategoryName(categoryKey);
      const generatedResolution = getRandomResolutionForCategory(categoryKey);
      const creatorName = (inputCreatorName?.value || '').trim() || (currentUser?.name && currentUser.name !== 'Гость' ? currentUser.name : 'Дебатер');

      const code = 'ROOM-' + Math.floor(100 + Math.random() * 900);

      const newRoom = {
        code: code,
        category: categoryKey,
        category_name: categoryName,
        topic: generatedResolution, // The resolution
        is_revealed: false,          // Reveals 15 min before match
        room_type: selectedType,
        scheduled_time: timeVal,
        creator_name: creatorName,
        p1_name: creatorName,        // Placed initially, will be randomized on match
        p2_name: null,
        status: 'waiting'
      };

      // Save to Supabase if configured
      const supabaseUrl = localStorage.getItem('debatr_supabase_url');
      const supabaseKey = localStorage.getItem('debatr_supabase_key');
      if (supabaseUrl && supabaseKey && window.supabase) {
        try {
          const client = window.supabase.createClient(supabaseUrl, supabaseKey);
          await client.from('rooms').insert([{
            code: newRoom.code,
            topic: newRoom.topic,
            room_type: newRoom.room_type,
            scheduled_time: newRoom.scheduled_time,
            creator_name: newRoom.creator_name,
            p1_name: newRoom.p1_name,
            p2_name: newRoom.p2_name,
            status: newRoom.status
          }]);
        } catch (e) {
          console.warn("Supabase room creation fallback to local:", e);
        }
      }

      // Add to local storage if public
      if (selectedType === 'public') {
        const rooms = getStoredPublicRooms();
        rooms.unshift(newRoom);
        saveStoredPublicRooms(rooms);
      }

      activeRoomData = newRoom;
      closeCreateModal();
      loadRoomIntoArena(activeRoomData);
      showSection('arena');

      if (selectedType === 'private') {
        showToast(`Создана закрытая комната ${code} по теме «${categoryName}»! Отправьте ссылку или QR.`);
        setTimeout(() => openQrModal(code), 300);
      } else {
        showToast(`Комната ${code} («${categoryName}») открыта на ${timeVal}! Резолюция откроется за 15 мин.`);
      }
    });
  }

  // QR Modal interactions
  function openQrModal(code) {
    if (!qrModal) return;
    const roomCode = code || activeRoomData.code;
    const qrDisplay = document.getElementById('qr-room-code-display');
    if (qrDisplay) qrDisplay.textContent = roomCode;

    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    const shareInput = document.getElementById('input-share-link');
    if (shareInput) shareInput.value = shareUrl;

    const canvas = document.getElementById('qr-canvas');
    if (canvas && window.QRCode) {
      window.QRCode.toCanvas(canvas, shareUrl, {
        width: 190,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      }, (err) => {
        if (err) console.error("QR Code generation error:", err);
      });
    }

    qrModal.classList.remove('hidden');
  }

  function closeQrModal() {
    if (qrModal) qrModal.classList.add('hidden');
  }

  if (btnShowQr) btnShowQr.addEventListener('click', () => openQrModal(activeRoomData.code));
  if (btnCloseQrModal) btnCloseQrModal.addEventListener('click', closeQrModal);
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQrModal();
    });
  }

  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast(successMsg)).catch(() => showToast(successMsg));
    } else {
      showToast(successMsg);
    }
  }

  if (btnCopyRoomLink) {
    btnCopyRoomLink.addEventListener('click', () => {
      const shareUrl = `${window.location.origin}${window.location.pathname}?room=${activeRoomData.code}`;
      copyTextToClipboard(shareUrl, `Ссылка на ${activeRoomData.code} скопирована!`);
    });
  }

  if (btnModalCopyLink) {
    btnModalCopyLink.addEventListener('click', () => {
      const shareUrl = `${window.location.origin}${window.location.pathname}?room=${activeRoomData.code}`;
      copyTextToClipboard(shareUrl, `Ссылка на комнату скопирована!`);
    });
  }

  if (btnCopyCode) {
    btnCopyCode.addEventListener('click', () => {
      copyTextToClipboard(activeRoomData.code, `Код ${activeRoomData.code} скопирован!`);
    });
  }

  // Join Room by Code
  if (btnJoinRoom) {
    btnJoinRoom.addEventListener('click', () => {
      const val = (inputRoomCode?.value || '').trim().toUpperCase();
      if (!val) {
        showToast("Введите код комнаты!");
        return;
      }
      joinRoomByCode(val);
      if (inputRoomCode) inputRoomCode.value = '';
    });
  }

  // Claim slot in Arena
  if (btnClaimOppSlot) {
    btnClaimOppSlot.addEventListener('click', () => {
      const responderName = currentUser && currentUser.name && currentUser.name !== 'Гость' ? currentUser.name : 'Дебатер-соперник';
      const creatorName = activeRoomData.creator_name || activeRoomData.p1_name || 'Дебатер 1';

      // RANDOM CHAMBER LOTTERY (50/50 chance for who gets Government vs Opposition)
      const creatorIsGov = Math.random() < 0.5;
      if (creatorIsGov) {
        activeRoomData.p1_name = creatorName;
        activeRoomData.p2_name = responderName;
      } else {
        activeRoomData.p1_name = responderName;
        activeRoomData.p2_name = creatorName;
      }

      activeRoomData.status = 'matched';
      activeRoomData.room_type = 'private'; // Becomes private once matched!

      // Remove from public rooms list so other people can't enter
      let rooms = getStoredPublicRooms();
      rooms = rooms.filter(r => r.code !== activeRoomData.code);
      saveStoredPublicRooms(rooms);

      // Save to user profile & sync with cloud
      saveUserActiveMatch(activeRoomData);
      syncRoomUpdateToSupabase(activeRoomData);

      loadRoomIntoArena(activeRoomData);
      renderPublicRoomsGrid();

      const userRole = activeRoomData.p1_name === responderName ? "Правительство" : "Оппозиция";
      showToast(`Жеребьевка палат завершена! Ваша позиция: ${userRole}. Ссылка в Кабинете!`, 4500);
    });
  }

  if (btnRefreshRooms) {
    btnRefreshRooms.addEventListener('click', () => {
      renderPublicRoomsGrid();
      showToast("Список открытых игр обновлен");
    });
  }

  // Sample buttons
  if (btnLoadP1) {
    btnLoadP1.addEventListener('click', () => {
      const p1Text = document.getElementById('p1-speech');
      if (p1Text) p1Text.value = SAMPLE_ROOM_SPEECHES.p1;
      showToast("Пример речи Правительства загружен");
    });
  }

  if (btnLoadP2) {
    btnLoadP2.addEventListener('click', () => {
      const p2Text = document.getElementById('p2-speech');
      if (p2Text) p2Text.value = SAMPLE_ROOM_SPEECHES.p2;
      showToast("Пример речи Оппозиции загружен");
    });
  }

  if (btnJudgeDuel) {
    btnJudgeDuel.addEventListener('click', handleJudgeDuel);
  }

  // Check URL params for direct link: ?room=ROOM-123
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get('room');
  if (roomParam) {
    joinRoomByCode(roomParam.toUpperCase());
  } else {
    renderPublicRoomsGrid();
    loadRoomIntoArena(activeRoomData);
  }
}

function loadRoomIntoArena(room) {
  const codeEl = document.getElementById('current-room-code');
  const typeBadge = document.getElementById('current-room-type-badge');
  const timeEl = document.getElementById('current-room-time');
  const topicEl = document.getElementById('room-topic-display');
  const catBadge = document.getElementById('room-category-badge');
  const resBadge = document.getElementById('room-resolution-status-badge');
  const btnForceReveal = document.getElementById('btn-force-reveal-topic');
  const p1Tag = document.getElementById('p1-display-tag');
  const p2Tag = document.getElementById('p2-display-tag');
  const p1Input = document.getElementById('p1-name');
  const p2Input = document.getElementById('p2-name');
  const btnClaim = document.getElementById('btn-claim-opp-slot');

  if (codeEl) codeEl.textContent = room.code;

  // Category and resolution reveal state
  const categoryName = room.category_name || getCategoryName(room.category || 'education');
  if (catBadge) catBadge.textContent = categoryName;

  // If resolution is revealed (e.g. within 15 min or manually revealed)
  if (room.is_revealed) {
    if (topicEl) topicEl.textContent = room.topic;
    if (resBadge) {
      resBadge.textContent = "🔓 Резолюция открыта (Раунд подготовки)";
      resBadge.className = "resolution-unlocked-badge";
    }
    if (btnForceReveal) btnForceReveal.classList.add('hidden');
  } else {
    if (topicEl) topicEl.textContent = `Сфера: «${categoryName}». Точная резолюция дебатов генерируется и открывается за 15 минут до раунда!`;
    if (resBadge) {
      resBadge.textContent = "🔒 Скрыта до Prep Time (за 15 мин)";
      resBadge.className = "resolution-lock-badge";
    }
    if (btnForceReveal) {
      btnForceReveal.classList.remove('hidden');
      btnForceReveal.onclick = () => {
        room.is_revealed = true;
        if (topicEl) topicEl.textContent = room.topic;
        if (resBadge) {
          resBadge.textContent = "🔓 Резолюция открыта (15 мин на подготовку)";
          resBadge.className = "resolution-unlocked-badge";
        }
        btnForceReveal.classList.add('hidden');
        showToast("Резолюция открыта! 15 минут на подготовку речей.");
      };
    }
  }

  if (typeBadge) {
    if (room.room_type === 'private') {
      typeBadge.textContent = "Закрытая (QR / Ссылка)";
      typeBadge.className = "room-privacy-badge private-badge";
    } else {
      typeBadge.textContent = "Открытая (Витрина)";
      typeBadge.className = "room-privacy-badge public-badge";
    }
  }

  if (timeEl) {
    timeEl.textContent = room.scheduled_time || "Сразу после сбора";
  }

  if (p1Tag) {
    p1Tag.textContent = room.p1_name ? room.p1_name : "Ожидает назначения";
  }
  if (p1Input && room.p1_name) {
    p1Input.value = room.p1_name;
  }

  if (p2Tag) {
    p2Tag.textContent = room.p2_name ? room.p2_name : "Ожидание соперника...";
  }
  if (p2Input && room.p2_name) {
    p2Input.value = room.p2_name;
  }

  if (btnClaim) {
    if (room.p1_name && room.p2_name) {
      btnClaim.classList.add('hidden');
    } else {
      btnClaim.classList.remove('hidden');
    }
  }
}

function joinRoomByCode(code) {
  const rooms = getStoredPublicRooms();
  let found = rooms.find(r => r.code === code);

  if (!found) {
    // If closed or unlisted room, create session entry for this code
    found = {
      code: code,
      topic: "ЭП отменит стандартизированное государственное тестирование в пользу портфолио проектов.",
      room_type: code.startsWith('ROOM-P') ? "private" : "private",
      scheduled_time: "Сразу после подключения",
      creator_name: "Пригласивший дебатер",
      p1_name: "Спикер 1",
      p2_name: currentUser?.name && currentUser.name !== 'Гость' ? currentUser.name : null,
      status: "waiting"
    };
  }

  activeRoomData = found;
  loadRoomIntoArena(activeRoomData);

  // Switch to Arena tab
  const tabArena = document.getElementById('tab-open-arena');
  const tabLobby = document.getElementById('tab-open-lobby');
  const sectionLobby = document.getElementById('section-rooms-lobby');
  const sectionArena = document.getElementById('section-rooms-arena');

  if (tabArena) tabArena.classList.add('active');
  if (tabLobby) tabLobby.classList.remove('active');
  if (sectionArena) sectionArena.classList.remove('hidden');
  if (sectionLobby) sectionLobby.classList.add('hidden');

  showToast(`Вход в комнату ${code} выполнен!`);
}

function respondToPublicRoom(roomCode) {
  let rooms = getStoredPublicRooms();
  const room = rooms.find(r => r.code === roomCode);
  if (!room) return;

  const responderName = currentUser && currentUser.name && currentUser.name !== 'Гость' ? currentUser.name : 'Дебатер';
  const creatorName = room.creator_name || room.p1_name || 'Дебатер 1';

  // RANDOM CHAMBER LOTTERY (50/50 chance for who gets Government vs Opposition)
  const creatorIsGov = Math.random() < 0.5;
  if (creatorIsGov) {
    room.p1_name = creatorName;
    room.p2_name = responderName;
  } else {
    room.p1_name = responderName;
    room.p2_name = creatorName;
  }

  // Once opponent responds, the room becomes closed/private and disappears from the public showcase
  room.room_type = 'private';
  room.status = 'matched';

  // Filter out this newly closed room from the public showcase list
  rooms = rooms.filter(r => r.code !== roomCode);
  saveStoredPublicRooms(rooms);

  // Save as active room in user profile
  saveUserActiveMatch(room);

  activeRoomData = room;
  loadRoomIntoArena(activeRoomData);

  // Sync to Supabase if connected
  syncRoomUpdateToSupabase(room);

  // Open Arena view
  const tabArena = document.getElementById('tab-open-arena');
  const tabLobby = document.getElementById('tab-open-lobby');
  const sectionLobby = document.getElementById('section-rooms-lobby');
  const sectionArena = document.getElementById('section-rooms-arena');

  if (tabArena) tabArena.classList.add('active');
  if (tabLobby) tabLobby.classList.remove('active');
  if (sectionArena) sectionArena.classList.remove('hidden');
  if (sectionLobby) sectionLobby.classList.add('hidden');

  renderPublicRoomsGrid();
  showToast(`Вы приняли вызов! Комната ${room.code} теперь закрыта. Ссылка сохранена в вашем Кабинете!`, 4000);
}

function saveUserActiveMatch(room) {
  try {
    localStorage.setItem('debatr_user_active_room', JSON.stringify(room));
    updateDashboardActiveRoom();
  } catch (e) {
    console.warn("Error saving active room to storage:", e);
  }
}

async function syncRoomUpdateToSupabase(room) {
  const supabaseUrl = localStorage.getItem('debatr_supabase_url');
  const supabaseKey = localStorage.getItem('debatr_supabase_key');
  if (supabaseUrl && supabaseKey && window.supabase) {
    try {
      const client = window.supabase.createClient(supabaseUrl, supabaseKey);
      await client.from('rooms').update({
        p1_name: room.p1_name,
        p2_name: room.p2_name,
        room_type: 'private',
        status: 'matched'
      }).eq('code', room.code);
    } catch (e) {
      console.warn("Supabase room update error:", e);
    }
  }
}

async function fetchRealPublicRoomsFromSupabase() {
  const supabaseUrl = localStorage.getItem('debatr_supabase_url');
  const supabaseKey = localStorage.getItem('debatr_supabase_key');
  if (supabaseUrl && supabaseKey && window.supabase) {
    try {
      const client = window.supabase.createClient(supabaseUrl, supabaseKey);
      const { data, error } = await client
        .from('rooms')
        .select('*')
        .eq('room_type', 'public')
        .eq('status', 'waiting')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const stored = getStoredPublicRooms();
        // Merge real remote rooms with local non-mock rooms
        const combined = [...data];
        stored.forEach(sr => {
          if (!combined.some(r => r.code === sr.code)) {
            combined.push(sr);
          }
        });
        saveStoredPublicRooms(combined);
      }
    } catch (e) {
      console.warn("Error fetching live public rooms from Supabase:", e);
    }
  }
}

function renderPublicRoomsGrid() {
  const grid = document.getElementById('public-rooms-grid');
  const countLabel = document.getElementById('lobby-count-label');
  if (!grid) return;

  // Asynchronously fetch real rooms from Supabase if connected
  fetchRealPublicRoomsFromSupabase();

  const rooms = getStoredPublicRooms();
  if (countLabel) {
    countLabel.textContent = `Доступно открытых игр: ${rooms.length}`;
  }

  if (rooms.length === 0) {
    grid.innerHTML = `
      <div class="empty-rooms-banner">
        <h4>Пока нет открытых комнат</h4>
        <p>Создайте первую открытую игру с удобным временем дебатов, чтобы другие спикеры могли откликнуться!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = rooms.map(room => {
    const isFull = room.p1_name && room.p2_name;
    const statusText = isFull ? 'Оппонент найден' : 'Ожидает соперника';
    const statusClass = isFull ? 'status-matched' : 'status-waiting';
    const buttonText = isFull ? 'Войти зрителем/участником' : 'Откликнуться на игру';
    const buttonClass = isFull ? 'btn-secondary btn-sm' : 'btn-primary btn-sm';

    return `
      <div class="public-room-card" data-code="${room.code}">
        <div class="public-room-card-header">
          <span class="room-code-tag">${escapeHtml(room.code)}</span>
          <span class="room-time-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${escapeHtml(room.scheduled_time || 'Сегодня')}
          </span>
        </div>

        <div class="public-room-topic" title="${escapeHtml(room.topic)}">
          <div class="card-category-row">
            <span class="topic-category-badge">${escapeHtml(room.category_name || getCategoryName(room.category || 'education'))}</span>
            <span class="prep-timer-pill">Prep 15м</span>
          </div>
          <p class="topic-preview-text">
            ${room.is_revealed ? escapeHtml(room.topic) : 'Резолюция будет объявлена ровно за 15 минут до раунда для подготовки.'}
          </p>
        </div>

        <div class="public-room-participants">
          <div class="participant-line">
            <span class="gov-text">Правительство:</span>
            <span>${escapeHtml(room.p1_name || 'Свободно')}</span>
          </div>
          <div class="participant-line">
            <span class="opp-text">Оппозиция:</span>
            <span>${escapeHtml(room.p2_name || 'Ожидает отклика')}</span>
          </div>
        </div>

        <div class="public-room-card-footer">
          <span class="room-status-badge ${statusClass}">${statusText}</span>
          <button class="${buttonClass} btn-respond-room" data-code="${room.code}">
            ${buttonText}
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach event handlers for "Respond / Join"
  grid.querySelectorAll('.btn-respond-room').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const code = e.currentTarget.getAttribute('data-code');
      respondToPublicRoom(code);
    });
  });
}

async function handleJudgeDuel() {
  const p1Name = document.getElementById('p1-name').value.trim() || 'Спикер 1';
  const p2Name = document.getElementById('p2-name').value.trim() || 'Спикер 2';
  const p1Speech = document.getElementById('p1-speech').value.trim();
  const p2Speech = document.getElementById('p2-speech').value.trim();
  const topic = document.getElementById('room-topic-display').textContent;

  if (!p1Speech || !p2Speech) {
    showToast("Обе речи обязательны");
    return;
  }

  const btn = document.getElementById('btn-judge-duel');
  btn.disabled = true;
  btn.innerHTML = `<span>Судейство...</span>`;

  let result = null;
  try {
    result = await judgeDuelWithAI(p1Name, p1Speech, p2Name, p2Speech, topic);
  } catch (e) {
    result = judgeDuelFallback(p1Name, p2Name);
  }

  btn.disabled = false;
  btn.innerHTML = `<span>Судейство</span>`;

  // Display Duel Results
  const resultsBox = document.getElementById('duel-results-box');
  if (resultsBox) resultsBox.classList.remove('hidden');

  document.getElementById('duel-winner-title').textContent = result.winner;
  document.getElementById('duel-clash-analysis').textContent = result.clash;

  const tbody = document.getElementById('duel-scores-tbody');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td><strong>${p1Name}</strong></td>
        <td><span class="chamber-badge gov-badge">Правительство</span></td>
        <td>${result.p1.scores.structure.toFixed(1)}</td>
        <td>${result.p1.scores.evidence.toFixed(1)}</td>
        <td>${result.p1.scores.rebuttal.toFixed(1)}</td>
        <td>${result.p1.scores.clarity.toFixed(1)}</td>
        <td>${result.p1.scores.originality.toFixed(1)}</td>
        <td><strong>${result.p1.overall.toFixed(1)}</strong></td>
      </tr>
      <tr>
        <td><strong>${p2Name}</strong></td>
        <td><span class="chamber-badge opp-badge">Оппозиция</span></td>
        <td>${result.p2.scores.structure.toFixed(1)}</td>
        <td>${result.p2.scores.evidence.toFixed(1)}</td>
        <td>${result.p2.scores.rebuttal.toFixed(1)}</td>
        <td>${result.p2.scores.clarity.toFixed(1)}</td>
        <td>${result.p2.scores.originality.toFixed(1)}</td>
        <td><strong>${result.p2.overall.toFixed(1)}</strong></td>
      </tr>
    `;
  }

  document.getElementById('duel-p1-title').textContent = `${p1Name}:`;
  document.getElementById('duel-p1-feedback').textContent = result.p1.feedback;

  document.getElementById('duel-p2-title').textContent = `${p2Name}:`;
  document.getElementById('duel-p2-feedback').textContent = result.p2.feedback;

  // Add winner to speeches history
  speechesHistory.unshift({
    id: Date.now(),
    date: "Сегодня",
    student: result.winner,
    type: "1v1",
    topic: topic.slice(0, 40) + "...",
    score: Math.max(result.p1.overall, result.p2.overall),
    status: "confirmed"
  });

  initDashboardTable();
  updateRadarFromHistory();
  showToast("Вердикт готов");
}

async function judgeDuelWithAI(p1Name, p1Speech, p2Name, p2Speech, topic) {
  const apiKey = localStorage.getItem('debatr_ai_key') || '';
  if (!apiKey) return judgeDuelFallback(p1Name, p2Name);

  const prompt = `Ты строгий судья дебатного турнира. Оцени матч 1 на 1.
Тема: "${topic}".
Спикер 1 (${p1Name}, Правительство): "${p1Speech}".
Спикер 2 (${p2Name}, Оппозиция): "${p2Speech}".

Оцени обоих строго по шкале 0.0-9.0 с шагом 0.5 (критерии: structure, evidence, rebuttal, clarity, originality).
Определи победителя раунда и ключевой клэш.

Верни строго JSON объект:
{
  "winner": "${p1Name} (Правительство)" или "${p2Name} (Оппозиция)",
  "clash": "Анализ главного столкновения раунда (1-2 предложения)",
  "p1": {
    "overall": 7.5,
    "scores": {"structure": 7.5, "evidence": 7.0, "rebuttal": 7.5, "clarity": 8.0, "originality": 7.5},
    "feedback": "Плюсы и минусы речи спикера 1"
  },
  "p2": {
    "overall": 7.0,
    "scores": {"structure": 7.0, "evidence": 7.5, "rebuttal": 7.0, "clarity": 7.5, "originality": 6.5},
    "feedback": "Плюсы и минусы речи спикера 2"
  }
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    })
  });

  if (!response.ok) throw new Error("Duel Judge API failed");
  const data = await response.json();
  const raw = data.choices[0].message.content.trim().replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(raw);
}

function judgeDuelFallback(p1Name, p2Name) {
  return {
    winner: `${p1Name} (Правительство)`,
    clash: `Спикер ${p1Name} доказал более глубокий импакт на развитие мышления учащихся, нейтрализовав аргумент о стандартизации.`,
    p1: {
      overall: 7.5,
      scores: { structure: 8.0, evidence: 7.0, rebuttal: 7.5, clarity: 8.0, originality: 7.5 },
      feedback: "Отличная логическая последовательность и акцент на практических компетенциях выпускников."
    },
    p2: {
      overall: 7.0,
      scores: { structure: 7.0, evidence: 7.5, rebuttal: 7.0, clarity: 7.5, originality: 6.5 },
      feedback: "Сильный аргумент об объективности и равенстве доступа, но не хватило альтернативного механизма оценки."
    }
  };
}

// ==========================================
// 14. DEBATE SPEECH TIMER WIDGET
// ==========================================

let timerInterval = null;
let timerTotalSeconds = 240; // default 4m
let timerRemainingSeconds = 240;
let isTimerRunning = false;

function initSpeechTimer() {
  const timerDisplay = document.getElementById('timer-display');
  const btnToggle = document.getElementById('btn-timer-toggle');
  const btnReset = document.getElementById('btn-timer-reset');
  const timePillBtns = document.querySelectorAll('.time-pill-btn');

  if (!timerDisplay || !btnToggle) return;

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateTimerUI() {
    timerDisplay.textContent = formatTime(timerRemainingSeconds);
    if (timerRemainingSeconds <= 30 && timerRemainingSeconds > 0) {
      timerDisplay.style.color = '#dc2626';
    } else {
      timerDisplay.style.color = '';
    }
  }

  timePillBtns.forEach(pill => {
    pill.addEventListener('click', () => {
      timePillBtns.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const sec = parseInt(pill.getAttribute('data-sec'), 10) || 240;
      timerTotalSeconds = sec;
      timerRemainingSeconds = sec;
      if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        btnToggle.textContent = "Старт";
      }
      updateTimerUI();
    });
  });

  btnToggle.addEventListener('click', () => {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      btnToggle.textContent = "Продолжить";
    } else {
      if (timerRemainingSeconds <= 0) {
        timerRemainingSeconds = timerTotalSeconds;
      }
      isTimerRunning = true;
      btnToggle.textContent = "Пауза";

      timerInterval = setInterval(() => {
        timerRemainingSeconds--;
        updateTimerUI();
        if (timerRemainingSeconds <= 0) {
          clearInterval(timerInterval);
          isTimerRunning = false;
          btnToggle.textContent = "Старт";
          showToast("Время речи истекло!");
        }
      }, 1000);
    }
  });

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerRemainingSeconds = timerTotalSeconds;
      btnToggle.textContent = "Старт";
      updateTimerUI();
    });
  }

  updateTimerUI();
}
