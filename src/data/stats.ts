import type { Stat } from '~/types';

export const stats: Stat[] = [
  { value: 'Спецификация', label: 'Формулирую требования до начала разработки и автоматизирую процесс по Spec-Driven Development.' },
  { value: 'Архитектура', label: 'Продумываю структуру проекта и слежу за тем, чтобы решения оставались понятными и поддерживаемыми.' },
  { value: 'Качество', label: 'Провожу ревью кода, использую MCP, skills и агентов; при необходимости сам пишу код.' },
];

/** Headline above the stats band, split so the tail can be dimmed. */
export const statsHeading = {
  lead: 'Использую Spec-Driven Development и автоматизирую рутинную работу.',
  tail: 'Провожу тщательное ревью кода, слежу за архитектурой и применяю MCP, skills и агентов. Если нужно — самостоятельно берусь за реализацию.',
};

/**
 * Poster frame for the studio reel. Set `embedUrl` to a YouTube/Vimeo
 * privacy-friendly embed to make the play button load a real video;
 * leave it empty and the button is hidden.
 */
export const reel = {
  image: '/images/reel-poster.webp',
  alt: 'Two people reviewing notes and sketches at a studio table',
  width: 1000,
  height: 625,
  embedUrl: '',
  label: 'Play the studio reel',
};
