# B2B pricing — handoff

Состояние на 2026-09-13. Кто угодно (человек или агент) должен по этому файлу
понять, что уже сделано, что осталось, и как продолжать.
Код-документация для агентов — раздел «B2B pricing» в корневом `CLAUDE.md`.

---

## 1. Что сделано

### Суть
Магазин на плане **Basic** — нативный Shopify B2B (компании / каталоги /
прайс-листы) недоступен. Сделано своими руками, но на «родных» механизмах:

| Слой | Что | Где |
|---|---|---|
| Админка | Метаполе клиента **«B2B discount %»** (`custom.b2b_discount`, integer 0–100, закреплено на карточке клиента, доступ Customer Account API = READ) | def `gid://shopify/MetafieldDefinition/171614371863` |
| Приложение | **`la-lighting-b2b`** — extension-only app (без сервера): Shopify Function читает процент клиента из корзины и делает автоматическую скидку на каждую строку | `b2b-app/` в этом репо; Dev Dashboard org `203205869`, app `422245761025`, client_id `3188f87bedb72948c0d7786188598d28`; выпущена версия **la-lighting-b2b-3** |
| Админка | Автоматическая скидка **«B2B pricing»** (тип `DiscountAutomaticApp`, ACTIVE, привязана к функции) | `gid://shopify/DiscountAutomaticNode/1366083665943` |
| Витрина | Вход (иконка пользователя в шапке → Shopify customer accounts), чтение процента через Customer Account API, показ B2B-цены с зачёркнутой розничной; корзина привязывается к логину, чтобы функция «видела» клиента | `app/lib/b2b.tsx`, `app/lib/b2b.server.ts`, `app/root.tsx`, `app/routes/cart.tsx`, коммиты `ca8eed4` → `28b5b79` |
| Тест | Клиент **gl9778301872@gmail.com** с `b2b_discount = 20` | `gid://shopify/Customer/9588593000471` |

Всё запушено в `main` → продакшн https://losangeleslightingelectrical.com
(push-to-deploy). Витрина уже с новой шапкой, `/account/login` уводит на
Shopify-логин.

### Как это работает для мерчанта
1. Customers → открыть клиента → поле **B2B discount %** → ввести `20` → Save.
2. Клиент входит на сайте → видит цены −20 % (розница зачёркнута) → в
   корзине и на чекауте Shopify сам применяет «B2B pricing (20% off)».
3. Пусто или `0` — обычная розница. Код трогать не нужно.

«Сегменты» = клиенты с одинаковым значением. В админке можно сделать
сегмент по полю (например `B2B discount % = 20`), назвать «Contractors» и
массово редактировать.

### Что убрано
Первый вариант (тег `b2b` + промокод `B2B` для сегмента) заменён:
промокод деактивирован (EXPIRED), сегмент «B2B customers» остался, но ни на
что не влияет, тег на тест-клиенте ни на что не влияет.

---

## 2. Что дальше (по порядку)

### 2.1 Живая проверка — ещё НЕ сделана (нужен человек: код из почты)
1. https://losangeleslightingelectrical.com → иконка пользователя →
   войти как `gl9778301872@gmail.com` (одноразовый код на почту).
2. Проверить:
   - каталог `/collections` и любой товар: цена −20 %, розничная зачёркнута,
     бейдж «B2B price · 20% off»;
   - страница аккаунта `/account`: строка «B2B pricing is active … 20% off»;
   - добавить товар → `/cart`: строка со сниженной суммой и зачёркнутой
     полной, пометка «B2B pricing — 20% off»; чекаут показывает скидку
     «B2B pricing (20% off)».
3. Если цена на сайте −20 %, а в корзине/чекауте скидки нет → см. §4.

### 2.2 Боевые клиенты
Проставить проценты реальным B2B-клиентам (карточка клиента → поле).
Массово: Customers → сегмент → Bulk edit → колонка «B2B discount %».

### 2.3 Возможные расширения (не начинались)
- **Индивидуальная цена на товар** (`custom.b2b_price` на продукте, для
  B2B-клиентов вместо процента). Функция расширяется на ~10 строк (в input
  query добавить `merchandise { ... on ProductVariant { product { metafield(namespace:"custom", key:"b2b_price") { value } } } }` и `cost { amountPerQuantity { amount } }`, отдать `fixedAmount` на разницу); на витрине —
  добавить метаполе в запросы PDP/каталога и показать его в `b2bAmount`.
  Бюджет сложности input query — 30, каждое `metafield` стоит 3.
- **Разные проценты по категориям** — тоже через функцию (product `inAnyCollection`).
- **Минимальный заказ для B2B** — Cart & Checkout Validation Function в том же приложении.
- **Скрыть цены до входа** («Login to see prices») — только витрина, `useB2B()`/`isLoggedIn` уже в root loader.

---

## 3. Как продолжать (команды)

### Витрина (корень репо)
```bash
nvm use            # Node 22 обязательно
npm run dev        # localhost:3000 — НО /account/login тут даёт 400
npx shopify hydrogen dev --codegen --customer-account-push
                   # для проверки входа локально: открывать *.tryhydrogen.dev URL
npm run codegen && npm run typecheck && npm run build   # «готово» = всё зелёное
git push           # main → Production, любая другая ветка → Preview
```

### Приложение (`b2b-app/`)
```bash
cd b2b-app && nvm use 22 && npm install
shopify app build                                   # функция + UI-блок
(cd extensions/b2b-pricing && npx vitest run)       # 6 фикстур в tests/fixtures/
shopify app deploy --allow-updates --message "…"    # выпуск новой версии → магазин обновится сам
```
- Логика функции: `b2b-app/extensions/b2b-pricing/src/cart_lines_discounts_generate_run.js`
  + input query рядом (`.graphql`). Схема функции — `schema.graphql` там же.
- Блок на странице скидки: `b2b-app/extensions/b2b-pricing-settings/src/DiscountFunctionSettings.jsx`
  (статичный текст, настроек нет).
- **Магазин не dev-store** → `shopify app dev` и `shopify app execute -s …`
  его не видят. Установка/переустановка — Dev Dashboard → кнопка
  **Install app** (блок Installs). После `deploy` переустанавливать не нужно.
- Промпты CLI (`app init` / `generate` / `deploy`) интерактивные; из агента
  их можно прогнать через pty-хелпер (`expect` стрелки не доставляет),
  `deploy --allow-updates` — без промптов.

### Админ-API из терминала
```bash
shopify store execute -s 7c20fd-dq.myshopify.com --query '…'      # чтение
shopify store execute -s 7c20fd-dq.myshopify.com --allow-mutations --query '…'
```
Токен уже имеет `write_customers`, `write_discounts` (плюс products/
metaobjects/content/publications/files). Переавторизация:
`shopify store auth -s 7c20fd-dq.myshopify.com --scopes …` (открывает браузер).

Полезные проверки:
```graphql
# скидка на месте?
{ discountNodes(first: 10, query: "status:active") { nodes { id discount { __typename
  ... on DiscountAutomaticApp { title status appDiscountType { functionId app { title } } } } } } }
# процент клиента
{ customer(id: "gid://shopify/Customer/9588593000471") { email metafield(namespace:"custom", key:"b2b_discount") { value } } }
```

---

## 4. Если что-то не так

| Симптом | Куда смотреть |
|---|---|
| После входа цены на сайте обычные | Витрина не прочитала метаполе: у определения должен быть `customerAccount: READ` (есть). Кэш в сессии — выйти и войти заново (`account_.authorize` сбрасывает `session.b2b`). Проверить значение у клиента запросом выше. |
| На сайте −20 %, в корзине/чекауте нет | Функция не видит клиента: корзина создана гостем до входа — `attachCustomerToCart` в `/cart` action должен привязать её при любом действии с корзиной; проверить `discountNodes` (скидка ACTIVE?) и Dev Dashboard → app → **Logs** (ошибки функции). |
| Скидка удвоилась | Остался активным старый код `B2B` (должен быть EXPIRED) или в «Combinations» разрешили product discounts. |
| `shopify app deploy` ругается на UID/handle | Не менять `uid`/`handle` в `shopify.extension.toml` — они привязаны к выпущенным версиям. |
| `/account/login` → 400 локально | Норма на `localhost`; использовать `--customer-account-push` и tryhydrogen-URL. |

---

## 5. Открытые вопросы для владельца
- Нужны ли индивидуальные цены на товар (а не единый процент)? → §2.3, п.1.
- Скрывать ли цены для незалогиненных? → §2.3, п.4.
- Удалить ли мёртвые артефакты первого варианта (код `B2B`, сегмент «B2B customers», тег `b2b`)? Безопасно, но не обязательно.
