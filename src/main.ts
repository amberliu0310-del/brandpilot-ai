import './styles.css';
import { api } from '@appdeploy/client';

type Brief = {
  brand: string;
  category: string;
  objective: string;
  audience: string;
  usp: string;
  platform: string;
  tone: string;
  constraints: string;
};

type Plan = {
  summary: string;
  audienceInsight: string;
  tension: string;
  bigIdea: string;
  messagePillars: string[];
  platformPlan: Array<{ platform: string; role: string; format: string; hook: string; cta: string }>;
  calendar: Array<{ day: string; theme: string; asset: string; purpose: string }>;
  kpis: Array<{ stage: string; metric: string; why: string }>;
  visualPrompt: string;
  copyPrompt: string;
  experiment: string;
};

type ResultState = Plan & { brief: Brief; mode: 'ai' | 'demo' };

const get = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
let lastPlan: ResultState | null = null;
let variation = 0;

const presets: Record<string, Brief> = {
  hotel: {
    brand: 'Luxury Hospitality Brand',
    category: '高端酒店 / 旅行',
    objective: '品牌心智',
    audience: '一二线城市、重视品质与目的地体验的年轻高净值旅行者',
    usp: '将品牌荣誉与目的地体验转译成可感知的生活方式内容',
    platform: '小红书',
    tone: '高级克制',
    constraints: '客户信息匿名化；不使用未经验证的数据；避免公告式表达',
  },
  homemuse: {
    brand: 'HomeMuse',
    category: '生活方式 / 家居',
    objective: '转化与销售',
    audience: '18–28 岁、在墨尔本租房或留学的年轻消费者',
    usp: '开学季生活场景的一站式家居小物与小电器，简洁、实用、适合租房生活',
    platform: '小红书',
    tone: '轻松生活方式',
    constraints: '预算有限，希望先用内容验证需求；避免空泛品牌话术',
  },
  culture: {
    brand: 'Stage Performance Project',
    category: '文化 / 演艺',
    objective: '互动与种草',
    audience: '18–30 岁、对戏剧、演员、热门 IP 与城市文化活动感兴趣的年轻观众',
    usp: '用人物、IP 与幕后内容降低演艺项目理解门槛，建立观看兴趣',
    platform: '多平台',
    tone: '年轻有梗',
    constraints: '不剧透核心剧情；兼顾项目信息完整度与社交平台可读性',
  },
};

document.querySelectorAll<HTMLButtonElement>('.preset').forEach(button => {
  button.addEventListener('click', () => {
    const preset = presets[button.dataset.preset ?? ''];
    if (!preset) return;
    Object.entries(preset).forEach(([key, value]) => {
      const el = document.getElementById(key) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (el) el.value = value;
    });
    toast('已加载预设案例');
  });
});

function getBrief(): Brief {
  return {
    brand: get<HTMLInputElement>('brand').value.trim(),
    category: get<HTMLSelectElement>('category').value,
    objective: get<HTMLSelectElement>('objective').value,
    audience: get<HTMLInputElement>('audience').value.trim(),
    usp: get<HTMLTextAreaElement>('usp').value.trim(),
    platform: get<HTMLSelectElement>('platform').value,
    tone: get<HTMLSelectElement>('tone').value,
    constraints: get<HTMLTextAreaElement>('constraints').value.trim(),
  };
}

function localPlan(brief: Brief, version = 0): Plan {
  const scenes: Record<string, string> = {
    '生活方式 / 家居': '真实租房与日常使用场景',
    美妆护肤: '真实肤感、使用时刻与自我表达场景',
    '高端酒店 / 旅行': '目的地、节庆与生活方式体验',
    食品饮料: '口味瞬间、分享场景与消费情绪',
    '文化 / 演艺': '人物、IP、幕后与观看情绪',
    消费科技: '具体任务、效率提升与生活问题',
    其他: '高频真实使用场景',
  };
  const scene = scenes[brief.category] ?? scenes.其他;
  const ideas = [
    '把产品卖点翻译成生活瞬间',
    '先建立用户相关性，再让品牌进入',
    '让内容进入可参与的真实场景',
  ];

  return {
    summary: `为 ${brief.brand} 设计一套以「${scene}」为入口的 ${brief.objective} 内容系统：先建立用户相关性，再用 ${brief.usp || '核心利益点'} 完成品牌承接，并把 CTA 与衡量指标接到同一条路径。`,
    audienceInsight: `假设：${brief.audience} 会优先判断内容是否和自己的当下需求有关。这个假设需要通过收藏、评论语义、主页访问或点击行为继续验证。`,
    tension: `品牌希望表达「${brief.usp || '产品价值'}」，用户更关注它能否解决一个具体问题。`,
    bigIdea: ideas[version % ideas.length],
    messagePillars: [
      `场景先行：用${scene}建立第一秒相关性`,
      `价值翻译：把「${brief.usp || '卖点'}」改写成用户能直接感知的结果`,
      '行动闭环：每条内容只承担一个清晰动作',
    ],
    platformPlan: [
      { platform: brief.platform, role: '核心承接平台', format: '图文 / 短视频', hook: '从真实场景切入', cta: '收藏 / 评论 / 点击主页' },
      { platform: 'Instagram', role: '视觉氛围与品牌识别', format: 'Carousel / Reel', hook: '用强视觉动作建立记忆', cta: 'Save / Share' },
    ],
    calendar: ['痛点钩子','场景解决','产品证据','用户视角','对比 / 误区','互动收集','复盘转化'].map((theme, i) => ({
      day: `D${i + 1}`,
      theme,
      asset: i === 0 ? 'Hero content' : i === 6 ? 'Recap + CTA' : 'Support content',
      purpose: ['建立相关性','展示结果','降低不确定感','增加真实感','制造保存价值','获取用户语言','推动下一步'][i],
    })),
    kpis: [
      { stage: 'Reach', metric: '有效触达', why: '判断内容是否进入目标用户视野' },
      { stage: 'Engagement', metric: '高质量互动', why: '判断用户是否真正产生兴趣' },
      { stage: 'Growth', metric: '主页访问 / 新增关注', why: '判断内容是否转化为品牌兴趣' },
      { stage: 'Action', metric: '点击 / 咨询 / 转化', why: '判断内容是否推动下一步行为' },
    ],
    visualPrompt: `Create a ${brief.tone} campaign key visual for ${brief.brand}. Focus on ${scene}. Product/value: ${brief.usp}. Mobile-first composition, one clear focal point, no fake statistics.`,
    copyPrompt: `为「${brief.brand}」生成 3 版 ${brief.platform} 内容开头。目标：${brief.objective}；受众：${brief.audience}；核心价值：${brief.usp}。要求：场景具体、不虚构数据、每版只保留 1 个 CTA。`,
    experiment: 'A/B test：A 版先讲用户场景，B 版先讲品牌利益点。保持视觉、发布时间与 CTA 尽量一致，比较互动、主页访问或点击变化。',
  };
}

async function generatePlan(): Promise<void> {
  const brief = getBrief();
  if (!brief.brand || !brief.audience) {
    toast('请先填写品牌和目标受众');
    return;
  }

  const button = get<HTMLButtonElement>('generate');
  const badge = get<HTMLSpanElement>('engineBadge');
  button.disabled = true;
  button.innerHTML = '<span class="spinner"></span><span>正在生成...</span>';
  badge.textContent = 'Thinking';

  let plan: Plan | null = null;
  let mode: 'ai' | 'demo' = 'demo';

  try {
    const response = await api.post('/api/generate', brief);
    if (response.data?.result) {
      plan = response.data.result as Plan;
      mode = 'ai';
    }
  } catch (error) {
    console.warn('AI route unavailable, using demo engine.', error);
  }

  if (!plan) plan = localPlan(brief, variation);
  lastPlan = { ...plan, brief, mode };
  render(lastPlan);

  button.disabled = false;
  button.innerHTML = '<span>✦</span><span>生成营销方案</span>';
  badge.textContent = mode === 'ai' ? 'AI Mode' : 'Demo Engine';
  badge.className = `status ${mode}`;
  get<HTMLButtonElement>('alt').disabled = false;
  get<HTMLButtonElement>('copy').disabled = false;
  get<HTMLButtonElement>('download').disabled = false;
}

function escapeHtml(value = ''): string {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char);
}

function render(plan: ResultState): void {
  get<HTMLDivElement>('empty').style.display = 'none';
  const output = get<HTMLDivElement>('output');
  output.classList.add('show');
  output.innerHTML = `
    <div class="summary"><div class="kicker">Campaign summary</div><h3>${escapeHtml(plan.summary)}</h3></div>
    <div class="two"><div class="mini"><div class="kicker">Audience hypothesis</div><p>${escapeHtml(plan.audienceInsight)}</p></div><div class="mini"><div class="kicker">Core tension</div><p>${escapeHtml(plan.tension)}</p></div></div>
    <div class="block"><div class="kicker">Big idea</div><div class="idea">${escapeHtml(plan.bigIdea)}</div><div class="pillars">${plan.messagePillars.map(item => `<div class="pillar">${escapeHtml(item)}</div>`).join('')}</div></div>
    <div class="block"><div class="kicker">Platform plan</div>${plan.platformPlan.map(row => `<p><strong>${escapeHtml(row.platform)}</strong> · ${escapeHtml(row.role)} · ${escapeHtml(row.format)} · ${escapeHtml(row.hook)} · ${escapeHtml(row.cta)}</p>`).join('')}</div>
    <div class="block"><div class="kicker">7-day content sprint</div>${plan.calendar.map(row => `<p><strong>${row.day}</strong> · ${escapeHtml(row.theme)} · ${escapeHtml(row.asset)} · ${escapeHtml(row.purpose)}</p>`).join('')}</div>
    <div class="block"><div class="kicker">Measurement framework</div>${plan.kpis.map(row => `<p><strong>${escapeHtml(row.stage)}</strong> · ${escapeHtml(row.metric)} · ${escapeHtml(row.why)}</p>`).join('')}</div>
    <div class="two"><div class="block"><div class="kicker">Visual generation prompt</div><div class="promptbox">${escapeHtml(plan.visualPrompt)}</div></div><div class="block"><div class="kicker">Copy generation prompt</div><div class="promptbox">${escapeHtml(plan.copyPrompt)}</div></div></div>
    <div class="block"><div class="kicker">Next experiment</div><p>${escapeHtml(plan.experiment)}</p></div>`;
}

function toMarkdown(plan: ResultState): string {
  return `# BrandPilot AI — Campaign Plan\n\n**Brand:** ${plan.brief.brand}\n**Objective:** ${plan.brief.objective}\n**Audience:** ${plan.brief.audience}\n**Engine:** ${plan.mode === 'ai' ? 'AI Mode' : 'Structured Demo Engine'}\n\n## Summary\n${plan.summary}\n\n## Audience hypothesis\n${plan.audienceInsight}\n\n## Core tension\n${plan.tension}\n\n## Big idea\n${plan.bigIdea}\n\n## Message pillars\n${plan.messagePillars.map(item => `- ${item}`).join('\n')}\n\n## Experiment\n${plan.experiment}\n`;
}

get<HTMLButtonElement>('generate').addEventListener('click', () => void generatePlan());
get<HTMLButtonElement>('alt').addEventListener('click', () => {
  variation += 1;
  const brief = getBrief();
  lastPlan = { ...localPlan(brief, variation), brief, mode: 'demo' };
  render(lastPlan);
  const badge = get<HTMLSpanElement>('engineBadge');
  badge.textContent = 'Demo Engine';
  badge.className = 'status demo';
  toast('已切换策略角度');
});
get<HTMLButtonElement>('copy').addEventListener('click', () => {
  if (!lastPlan) return;
  void navigator.clipboard.writeText(toMarkdown(lastPlan)).then(() => toast('已复制完整方案'));
});
get<HTMLButtonElement>('download').addEventListener('click', () => {
  if (!lastPlan) return;
  const blob = new Blob([toMarkdown(lastPlan)], { type: 'text/markdown;charset=utf-8' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `${lastPlan.brief.brand.replace(/\s+/g, '-')}-campaign-plan.md`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
});

function toast(message: string): void {
  const element = get<HTMLDivElement>('toast');
  element.textContent = message;
  element.classList.add('on');
  window.setTimeout(() => element.classList.remove('on'), 1600);
}
