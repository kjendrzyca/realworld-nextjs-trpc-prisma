# Conduit - starter do ćwiczeń

Aplikacja z artykułami, komentarzami, ulubionymi i obserwowaniem autorów. Ten branch używa **npm** oraz dostarczonej lokalnej bazy SQLite. Nie pobiera danych z zewnętrznego API RealWorld.

## Uruchomienie

Potrzebny jest **Node.js 24 LTS**. npm jest dołączony do Node.js; nie trzeba instalować pnpm.

```sh
git clone --branch starter-oct-26 --single-branch https://github.com/kjendrzyca/realworld-nextjs-trpc-prisma.git
cd realworld-nextjs-trpc-prisma
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

`npm install` przygotowuje brakujący `.env`, kopiuje lokalną bazę do pliku roboczego i generuje klienta Prisma. Nie trzeba ręcznie kopiować konfiguracji ani uruchamiać seeda. Kolejne instalacje i uruchomienia zachowują istniejące dane oraz konfigurację.

## Konta i dane demonstracyjne

| Konto | Hasło |
| --- | --- |
| `test@user.com` | `testuser` |
| `author@of.all.com` | `Test1234` |

Baza zawiera 200 artykułów, 15 kont, 76 tagów, 12 komentarzy, 12 zapisów ulubionych i 4 relacje obserwowania autorów. Trzy artykuły demonstracyjne znajdują się na początku listy:

- `demo-krotki-artykul` - krótki tekst.
- `demo-dlugi-artykul` - tekst na kilka ekranów, z nagłówkami i akapitami.
- `demo-widoki-i-dane` - przykład do poznania listy, profilu i powiązanych danych.

Są to dane demonstracyjne. Starter nie zawiera rozwiązań ćwiczeń z trybem czytania ani Saved Articles.

## Jak działa lokalna baza

- `prisma/test.sqlite` jest dostarczonym wzorcem, przechowywanym w Git.
- `prisma/db.sqlite` jest kopią roboczą. Jest ignorowana przez Git; aplikacja zapisuje w niej Twoją pracę.
- Setup kopiuje wzorzec tylko wtedy, gdy brakuje domyślnej bazy roboczej. Nie nadpisuje istniejącego pliku i nie zmienia automatycznie jego schematu.
- `npm run db:seed` przygotowuje brakujące pliki lokalne. Ponowne wywołanie zachowuje istniejące dane; nie jest resetem.
- Własny `DATABASE_URL` ma pierwszeństwo. Niestandardowa baza musi być wcześniej przygotowana; setup nie wgrywa do niej danych demonstracyjnych.
- Pusty, uszkodzony plik albo symlink powoduje czytelny błąd. Setup nie usuwa go ani nie zastępuje bez wiedzy użytkownika.

Po świadomej zmianie modeli w `prisma/schema.prisma` możesz zastosować schemat do swojej bazy:

```sh
npm run db:push
```

## Sprawdzenia

Testy przygotowania środowiska i danych, lint oraz TypeScript:

```sh
npm run test:setup
npm run lint
npm run typecheck
```

Testy przeglądarkowe:

```sh
npm run browser:install
npm run test:ui
```

Playwright uruchamia aplikację automatycznie, jeżeli nie działa jeszcze pod wskazanym adresem. Sprawdza widok desktopowy i mobilny.

Testy API wymagają działającej aplikacji. Przy uruchomionym `npm run dev` wykonaj w drugim terminalu:

```sh
npm run test:api
```

Runner API działa przez Node.js również na Windows, bez Bash. Domyślnie używa `http://localhost:3000/api` i tworzy unikalne konto testowe. Opcjonalne zmienne to `APIURL`, `CONDUIT_TEST_USERNAME`, `CONDUIT_TEST_EMAIL` oraz `CONDUIT_TEST_PASSWORD`.

W CI i przy odtwarzaniu instalacji z lockfile można używać `npm ci`. Początkowe pobranie pakietów i przeglądarki wymaga połączenia z ich rejestrami; dane aplikacji są już w repo.

## Kod

- `src/pages` - strony Next.js i wejścia do API.
- `src/components` - komponenty interfejsu.
- `src/server/api/routers` - operacje tRPC oraz REST zgodny ze specyfikacją RealWorld.
- `prisma/schema.prisma` - model danych.
- `tests` - testy przygotowania startera, UI i kolekcja API.
- `scripts` - lokalny setup i runner API.

Aplikacja korzysta z Next.js Pages Router, tRPC, Prisma i SQLite. Zachowano istniejące wersje głównych bibliotek; zmiana managera pakietów nie jest migracją frameworków.

Projekt bazuje na [RealWorld](https://github.com/gothinkster/realworld) i [implementacji Next.js, tRPC i Prisma](https://github.com/gutentag2012/realworld-nextjs-trpc-prisma). Licencja znajduje się w [LICENSE](LICENSE).
