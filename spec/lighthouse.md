# Проверка сайта через Lighthouse

## Дублирование JavaScript в отчёте

В `reports/lighthouse-dublicated.md` перечислены два экземпляра `astro/dist/runtime/client/dev-toolbar/entrypoint.js`; один URL содержит `/@id/`, другой — `/deps/` и Vite query string. Пользователь уточнил, что запускал `npm run preview`, поэтому нельзя утверждать, что Lighthouse точно смотрел на dev-сервер. При этом такие URL характерны для dev runtime Astro/Vite: [документация Astro](https://docs.astro.build/guides/dev-toolbar/) описывает toolbar как инструмент разработки, а локальная `dist/` на момент проверки не содержит ссылок на него.

Чтобы выяснить расхождение, проверьте именно страницу, измеренную Lighthouse: в её HTML и Network не должно быть запросов `/@vite/client`, `/@id/astro/runtime/client/dev-toolbar/entrypoint.js` или `/node_modules/.vite/deps/astro_runtime_client_dev-toolbar_entrypoint__js.js`. Если они есть, проверьте, что Lighthouse смотрит на нужный порт и процесс Astro preview, а перед запуском `npm run preview` была собрана актуальная версия. Если этих запросов нет, Lighthouse-отчёт мог относиться к другой загрузке страницы или устаревшей сборке.

Диагностика дублирования помечена `Unscored`: она не вычитает баллы непосредственно. [Оценка Performance в Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/) рассчитывается по метрикам загрузки; добавочные байты могут влиять на них косвенно.

## Как получить репрезентативный отчёт

1. Выполнить `npm run build`.
2. Запустить `npm run preview -- --host 127.0.0.1 --port 4322`.
3. Убедиться, что на этой странице Network не запрашивает dev runtime URL, перечисленные выше.
4. Запустить Lighthouse для `http://127.0.0.1:4322/`.
5. При сравнении прогонов сохранять одинаковые настройки Lighthouse: режим Mobile или Desktop, браузер и условия сети. Проверять сами FCP, LCP, TBT, CLS и другие метрики, а не только общую оценку.

Эти команды выполняет пользователь: по правилу `AGENTS.md` агент не запускает автотесты и профилирование без отдельной прямой просьбы.
