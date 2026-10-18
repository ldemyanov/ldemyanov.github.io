# Структура проекта и страницы

## Назначение

Это личное портфолио Леонида Демьянова. Сайт представляет опыт и проекты разработчика, описывает направления работы и даёт возможность связаться по поводу найма или фриланс-задачи. Astro собирает его как статический сайт для GitHub Pages.

## Папки

| Путь | Содержимое |
| --- | --- |
| **src/pages/** | Файловые маршруты; файлы с **[...slug]** создают страницы из коллекций |
| **src/layouts/** | Общий HTML-каркас, метаданные, шапка и футер; стандартный заголовок внутренних страниц |
| **src/components/home/** | Отдельные секции главной и интерактивный фон |
| **src/components/cards/** | Карточки проектов, услуг и будущих записей |
| **src/components/art/** | Авторский графический элемент |
| **src/components/icons/** | Встроенный SVG-спрайт интерфейса |
| **src/components/** | Общие кнопка, навигация, форма, SEO и другие элементы |
| **src/content/projects/** | Описания проектов в Markdown |
| **src/content/services/** | Подробные страницы услуг в Markdown |
| **src/content/blog/** | Черновая запись; маршруты блога сейчас отключены |
| **src/content.config.ts** | Загрузка и проверка полей коллекций |
| **src/data/** | Навигация, компании, тексты секций, навыки и настройки анимации |
| **src/config/site.ts** | Имя, роль, контакты, социальные ссылки и общие сведения для SEO |
| **src/lib/** | Вспомогательные функции и генерация JSON-LD |
| **src/styles/** | Шрифты, дизайн-переменные, общие стили и стили страниц |
| **public/images/** | WebP-фотографии и изображения проектов по тематическим папкам |
| **public/icons/** | Все публичные SVG: favicon, логотипы, технологические и социальные иконки |
| **public/fonts/** | Локальные файлы Unbounded и IBM Plex Sans с лицензиями |
| **public/docs/** | Резюме и документы проектов |
| **public/** | Служебные PNG для платформ, Open Graph изображение и манифест |
| **scripts/check-local-links.mjs** | Проверка локальных ссылок после сборки Astro |
| **spec/** | Документация, планы и список улучшений |
| **.github/workflows/** | Сборка и публикация в GitHub Pages |

В **public/images/** используются папки **about/**, **blog/**, **forus/**, **geological-map/**, **hero/** и **sbercraft/**. Путь файла после **public/** совпадает с URL: например, **public/images/forus/contact-center.webp** доступен по адресу **/images/forus/contact-center.webp**.

## Маршруты

| URL | Исходный файл | Содержимое |
| --- | --- | --- |
| **/** | **src/pages/index.astro** | Секции главной из **src/components/home/** и данные из **src/data/** |
| **/about/** | **src/pages/about.astro** | Опыт, подход и технологии |
| **/work/** | **src/pages/work/index.astro** | Список проектов из коллекции **projects** |
| **/work/{slug}/** | **src/pages/work/[...slug].astro** | Статья проекта и сведения из её frontmatter |
| **/services/** | **src/pages/services/index.astro** | Направления работы из коллекции **services** |
| **/services/{slug}/** | **src/pages/services/[...slug].astro** | Подробная страница услуги |
| **/contact/** | **src/pages/contact.astro** | Форма Web3Forms и альтернативные способы связи |
| **/privacy/** | **src/pages/privacy.astro** | Политика конфиденциальности |
| **/terms/** | **src/pages/terms.astro** | Условия использования |
| **/404.html** | **src/pages/404.astro** | Страница для несуществующего адреса |
| **/robots.txt** | **src/pages/robots.txt.ts** | Правила индексации и ссылка на sitemap |

Интеграция **@astrojs/sitemap** создаёт файлы sitemap во время сборки. Отдельных маршрутов блога сейчас нет.

## Как связаны файлы

**src/layouts/BaseLayout.astro** подключает общие стили, SEO-компонент, шапку, футер и общие скрипты. **PageLayout.astro** добавляет стандартный заголовок внутренней страницы. Главная собирается непосредственно в **src/pages/index.astro**.

Коллекции загружает **src/content.config.ts**. Для проекта имя Markdown-файла становится частью URL. Frontmatter определяет заголовок, обложку, порядок, статус черновика и данные боковой панели; текст после frontmatter отображается как статья. Аналогично устроены страницы услуг. Схемы frontmatter — источник истины для обязательных полей.

Для поиска нужного текста начните с **src/config/site.ts** (общие данные), **src/data/highlights.ts** (главная), **src/content/projects/** (кейсы) или **src/content/services/** (услуги). Для изменения внешнего вида сначала проверьте **src/styles/tokens.css**, затем **sections.css** или **pages.css**.

Сведения о стеке — в [stack-and-dependencies.md](stack-and-dependencies.md), о публикации — в [github-build-and-deploy.md](github-build-and-deploy.md).
