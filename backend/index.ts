import { router, json, error, ai } from '@appdeploy/sdk';

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

const text = (value: unknown, max = 700): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

function parseBrief(body: unknown): Brief | null {
  if (!body || typeof body !== 'object') return null;
  const source = body as Record<string, unknown>;
  const brief: Brief = {
    brand: text(source.brand, 120),
    category: text(source.category, 100),
    objective: text(source.objective, 100),
    audience: text(source.audience, 350),
    usp: text(source.usp, 500),
    platform: text(source.platform, 100),
    tone: text(source.tone, 100),
    constraints: text(source.constraints, 500),
  };
  return brief.brand && brief.audience ? brief : null;
}

const planSchema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    audienceInsight: { type: 'string' },
    tension: { type: 'string' },
    bigIdea: { type: 'string' },
    messagePillars: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 3 },
    platformPlan: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          platform: { type: 'string' },
          role: { type: 'string' },
          format: { type: 'string' },
          hook: { type: 'string' },
          cta: { type: 'string' },
        },
        required: ['platform', 'role', 'format', 'hook', 'cta'],
      },
      minItems: 1,
      maxItems: 4,
    },
    calendar: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'string' },
          theme: { type: 'string' },
          asset: { type: 'string' },
          purpose: { type: 'string' },
        },
        required: ['day', 'theme', 'asset', 'purpose'],
      },
      minItems: 7,
      maxItems: 7,
    },
    kpis: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          stage: { type: 'string' },
          metric: { type: 'string' },
          why: { type: 'string' },
        },
        required: ['stage', 'metric', 'why'],
      },
      minItems: 4,
      maxItems: 4,
    },
    visualPrompt: { type: 'string' },
    copyPrompt: { type: 'string' },
    experiment: { type: 'string' },
  },
  required: [
    'summary', 'audienceInsight', 'tension', 'bigIdea', 'messagePillars',
    'platformPlan', 'calendar', 'kpis', 'visualPrompt', 'copyPrompt', 'experiment'
  ],
};

export const handler = router({
  'GET /api/_healthcheck': [async () => json({ message: 'Success' })],
  'POST /api/generate': [
    async ({ body }) => {
      const brief = parseBrief(body);
      if (!brief) return error('Brand and audience are required.', 400);

      const system = `You are a marketing strategy copilot. Produce a practical campaign workflow, not generic ad copy. Treat unsupported market claims as hypotheses. Never invent performance numbers, market shares, awards, research findings or consumer statistics. Keep output concise, specific and recruiter-readable. Use Chinese for strategic explanations when the brief is Chinese; English marketing terms such as KPI, CTA and Big Idea are fine. Avoid slogan-like contrast structures such as “不是…而是…”.`;

      const prompt = `Create a structured campaign plan from this brief:\nBrand/project: ${brief.brand}\nCategory: ${brief.category}\nObjective: ${brief.objective}\nAudience: ${brief.audience}\nCore product/value: ${brief.usp}\nPrimary platform: ${brief.platform}\nTone: ${brief.tone}\nConstraints: ${brief.constraints}\n\nRequirements:\n1. Start from a user-relevance hypothesis and a clear core tension.\n2. Create one Big Idea and exactly three message pillars.\n3. Give a platform plan for the primary platform and up to three complementary platforms when useful.\n4. Build a seven-day content sprint.\n5. Give four KPI stages: Reach, Engagement, Growth and Action, with metrics framed as measurement choices rather than fabricated benchmarks.\n6. Provide one visual-generation prompt and one copy-generation prompt.\n7. End with one concrete A/B test that isolates one variable.`;

      try {
        const result = await ai.generate({
          system,
          prompt,
          schema: planSchema,
          maxTokens: 2800,
          temperature: 0.55,
          thinkingMode: 'FAST',
        });
        return json({ result: JSON.parse(result.text) });
      } catch (caught) {
        console.error('BrandPilot AI generation failed', caught);
        return error('AI generation unavailable.', 503);
      }
    },
  ],
});
