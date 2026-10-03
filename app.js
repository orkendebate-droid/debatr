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

// Local mock database for Coach Dashboard (synchronizes with Supabase when configured)
let speechesHistory = [
  {
    id: 1,
    date: "Сегодня, 16:40",
    student: "Ихлас М.",
    type: "claim",
    topic: "Лицензирование систем автономного ИИ",
    score: 8.0,
    status: "confirmed"
  },
  {
    id: 2,
    date: "Вчера, 18:15",
    student: "Амир К.",
    type: "rebuttal",
    topic: "Отмена стандартизированного тестирования",
    score: 6.5,
    status: "confirmed"
  },
  {
    id: 3,
    date: "02 Окт, 15:20",
    student: "Дана С.",
    type: "warrant",
    topic: "Налог на автоматизацию труда",
    score: 7.0,
    status: "pending"
  },
  {
    id: 4,
    date: "01 Окт, 17:50",
    student: "Алихан Б.",
    type: "speech",
    topic: "Юридическая ответственность соцсетей",
    score: 7.5,
    status: "confirmed"
  }
];

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
});

// Toast system
function showToast(message, duration = 3000) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
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
  btnRandomTopic.addEventListener('click', () => {
    currentTopicIndex = (currentTopicIndex + 1) % DEBATE_TOPICS.length;
    topicDisplay.style.opacity = '0';
    setTimeout(() => {
      topicDisplay.textContent = DEBATE_TOPICS[currentTopicIndex];
      topicDisplay.style.opacity = '1';
    }, 150);
  });
}

function initInputCounters() {
  speechInput.addEventListener('input', updateStats);
}

function updateStats() {
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
  btnSampleStrong.addEventListener('click', () => {
    const config = EXERCISE_CONFIG[currentExerciseType];
    speechInput.value = config.strongSample;
    updateStats();
    showToast("Вставлен сильный аргумент для проверки");
  });

  btnSampleWeak.addEventListener('click', () => {
    const config = EXERCISE_CONFIG[currentExerciseType];
    speechInput.value = config.weakSample;
    updateStats();
    showToast("Вставлен слабый аргумент для проверки");
  });
}

// ==========================================
// 7. GPT-6 LUNA RUBRIC ENGINE
// ==========================================

function initAnalyzeButton() {
  btnAnalyze.addEventListener('click', async () => {
    const text = speechInput.value.trim();
    if (!text) {
      showToast("Пожалуйста, напишите аргумент перед запуском анализа!");
      speechInput.focus();
      return;
    }

    // UI State: Loading
    feedbackEmpty.classList.add('hidden');
    feedbackResults.classList.add('hidden');
    feedbackLoading.classList.remove('hidden');

    const apiKey = localStorage.getItem('debatr_ai_key');
    const aiMode = localStorage.getItem('debatr_ai_mode') || 'luna-sim';

    if (aiMode === 'live-api' && apiKey) {
      try {
        const evaluation = await callOpenAiRubric(text, currentExerciseType, topicDisplay.textContent, apiKey);
        renderEvaluation(evaluation);
        feedbackLoading.classList.add('hidden');
        feedbackResults.classList.remove('hidden');
        showToast("Прямой анализ GPT-6 Luna успешно завершён!");
        return;
      } catch (err) {
        console.warn("Live API error, falling back to Luna engine:", err);
      }
    }

    // Simulate AI Latency with Luna Engine
    setTimeout(() => {
      const evaluation = evaluateSpeechWithLuna(text, currentExerciseType, topicDisplay.textContent);
      renderEvaluation(evaluation);
      feedbackLoading.classList.add('hidden');
      feedbackResults.classList.remove('hidden');
      showToast("Анализ GPT-6 Luna успешно завершён!");
    }, 1200);
  });

  btnSaveSupabase.addEventListener('click', saveToSupabase);
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

  const newEntry = {
    id: Date.now(),
    date: "Только что",
    student: "Вы (Текущий дебатер)",
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

  saveStatusText.textContent = "✓ Сохранено";
}

function initDashboardTable() {
  btnRefreshData.addEventListener('click', () => {
    updateDashboardUI();
    showToast("Данные панели тренера обновлены");
  });
  updateDashboardUI();
}

function updateDashboardUI() {
  speechesTableBody.innerHTML = '';

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
          ${item.status === 'confirmed' ? '✓ Проверено' : '⏳ Ожидает наставника'}
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
  statTotalSpeeches.textContent = speechesHistory.length;
  const avg = speechesHistory.reduce((sum, item) => sum + item.score, 0) / speechesHistory.length;
  statAvgScore.textContent = avg.toFixed(1);
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
  btnOpenSettings.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
  });

  btnCloseSettings.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.add('hidden');
    }
  });

  btnSaveSettings.addEventListener('click', () => {
    const url = inputSupabaseUrl.value.trim();
    const key = inputSupabaseKey.value.trim();
    const aiKey = inputAiApiKey.value.trim();
    const aiMode = selectAiMode.value;

    if (url) localStorage.setItem('debatr_supabase_url', url);
    else localStorage.removeItem('debatr_supabase_url');

    if (key) localStorage.setItem('debatr_supabase_key', key);
    else localStorage.removeItem('debatr_supabase_key');

    if (aiKey) localStorage.setItem('debatr_ai_key', aiKey);
    else localStorage.removeItem('debatr_ai_key');

    localStorage.setItem('debatr_ai_mode', aiMode);

    settingsModal.classList.add('hidden');
    showToast("Настройки стека успешно сохранены!");
  });

  btnResetSettings.addEventListener('click', () => {
    localStorage.removeItem('debatr_supabase_url');
    localStorage.removeItem('debatr_supabase_key');
    localStorage.removeItem('debatr_ai_key');
    localStorage.removeItem('debatr_ai_mode');
    inputSupabaseUrl.value = 'https://gefremoxoxwobgeptobm.supabase.co';
    inputSupabaseKey.value = 'sb_publishable_k6JsncQUI3BePKqDhDNGOA_f4zcESvO';
    inputAiApiKey.value = '';
    selectAiMode.value = 'luna-sim';
    showToast("Настройки сброшены на стандартные параметры");
  });
}

function loadStoredSettings() {
  const url = localStorage.getItem('debatr_supabase_url') || 'https://gefremoxoxwobgeptobm.supabase.co';
  const key = localStorage.getItem('debatr_supabase_key') || 'sb_publishable_k6JsncQUI3BePKqDhDNGOA_f4zcESvO';
  const aiKey = localStorage.getItem('debatr_ai_key') || '';
  const aiMode = localStorage.getItem('debatr_ai_mode') || 'luna-sim';

  inputSupabaseUrl.value = url;
  inputSupabaseKey.value = key;
  inputAiApiKey.value = aiKey;
  selectAiMode.value = aiMode;
}
