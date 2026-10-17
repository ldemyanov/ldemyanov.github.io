import type { Stat } from '~/types';

export const stats: Stat[] = [
  { value: 'Спецификация', label: 'Формулирую требования до начала разработки и автоматизирую процесс по методологии Spec-Driven Development.' },
  { value: 'Архитектура', label: 'Продумываю структуру проекта и слежу за тем, чтобы решения оставались понятными и поддерживаемыми.' },
  { value: 'Качество', label: 'Провожу ревью кода, использую MCP, навыки и агентов; при необходимости сам пишу код.' },
];

/** Headline above the stats band, split so the tail can be dimmed. */
export const statsHeading = {
  lead: 'Использую разработку на основе спецификаций и автоматизирую рутинную работу.',
  tail: 'Тщательно проверяю код, слежу за архитектурой и применяю MCP, навыки и агентов. Если нужно — самостоятельно берусь за реализацию.',
};

/**
 * Poster frame for the studio reel. Set `embedUrl` to a YouTube/Vimeo
 * privacy-friendly embed to make the play button load a real video;
 * leave it empty and the button is hidden.
 */
export const reel = {
  image: '/images/reel-poster.webp',
  alt: 'Два человека обсуждают заметки и эскизы за рабочим столом',
  width: 1000,
  height: 625,
  embedUrl: '',
  label: 'Воспроизвести видео о работе',
};
