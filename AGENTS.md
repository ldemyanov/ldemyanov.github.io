# Project instructions

## Контекст проекта

Это личное портфолио Леонида Демьянова, fullstack-разработчика из Астаны. Сайт показывает опыт, проекты и услуги, помогает работодателям и заказчикам связаться с автором. Публикуется как статический сайт на GitHub Pages по адресу **ldemyanov.github.io**.

Перед изменением незнакомого раздела откройте нужный документ:

- [Структура папок и страниц](spec/project-structure.md) — маршруты, коллекции, компоненты и расположение контента.
- [Стек и зависимости](spec/stack-and-dependencies.md) — технологии сайта, npm-пакеты и внешние сервисы.
- [Сборка и публикация](spec/github-build-and-deploy.md) — Astro build, Web3Forms и GitHub Actions.

Основные точки входа: **src/pages/** для страниц, **src/content/projects/** и **src/content/services/** для статей, **src/data/** для повторяющихся данных, **src/config/site.ts** для общих сведений, **src/styles/** для оформления. Публичные фотографии и иллюстрации находятся в **public/images/**, SVG — в **public/icons/**. После сборки **scripts/check-local-links.mjs** проверяет ссылки в **dist/**.

## Правила работы с кодом

- При написании функций на JavaScript добавляйте JSDoc: текстовое описание назначения функции, `@param` для каждого аргумента и `@returns` с описанием результата, в том числе `void`, если функция ничего не возвращает.
- Файлы с логикой должны содержать не более 200 строк. Если файл превышает этот размер, разделите логику между несколькими файлами.
- Если задача кажется невыполнимой или для продолжения нужны уточнения, остановите работу и задайте вопрос пользователю.

## YAML frontmatter in Markdown content

- Quote every human-readable string value in Markdown frontmatter with double quotes. This includes titles, descriptions, excerpts, alt text, labels, URLs, and string values inside lists.
- Always quote a string containing a colon. An unquoted colon followed by a space can make YAML parse the rest of the line as a new mapping entry and cause Astro content syncing to fail.
- Keep numbers and booleans as native YAML values, without quotes. For example, leave `width: 1024`, `featured: false`, and `order: 1` unquoted.
- After editing content frontmatter, parse it with the project's YAML parser (`js-yaml`) to catch syntax errors before finishing.

Example:

```yaml
title: "Сайт компании «Форус»"
description: "Создал раздел кейсов: добавил поиск и фильтры."
image:
  src: "/images/forus/forus-site-cover.webp"
  alt: "Коллаж страниц сайта «Форус»: логотип, услуги и кейсы"
  width: 1237
  height: 848
featured: false
```
