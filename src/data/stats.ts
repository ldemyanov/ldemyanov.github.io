import type { Stat } from '~/types';

export const stats: Stat[] = [
  { value: 'Спецификация', label: 'Формулирую требования до начала разработки и автоматизирую процесс по методологии Spec-Driven Development.' },
  { value: 'Архитектура', label: 'Продумываю структуру проекта и слежу за тем, чтобы решения оставались понятными и поддерживаемыми.' },
  { value: 'Качество', label: 'Провожу ревью кода, использую MCP, навыки и агентов; при необходимости сам пишу код.' },
];

/** Headline above the stats band, split so the tail can be dimmed. */
export const statsHeading = {
  lead: 'Сочетаю классический подход к разработке с vibe coding, а в крупных репозиториях применяю Spec-Driven Development.',
  tail: 'Тщательно проверяю код, слежу за архитектурой и использую MCP, навыки и агентов как инструменты в работе.',
};
