# Project instructions

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
  src: "/photo/forus/image.png"
  alt: "Коллаж страниц сайта «Форус»: логотип, услуги и кейсы"
  width: 1024
  height: 1024
featured: false
```
