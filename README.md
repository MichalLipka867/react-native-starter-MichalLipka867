[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/7LzBu2L3)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=22183111&assignment_repo_type=AssignmentRepo)
# React Native: Field Notes

## Cel
Stwórz podstawową aplikację mobilną w **React Native (React)**, która wykorzystuje **natywną funkcję urządzenia** oraz **komunikuje się z API**. Aplikacja ma mieć **3–4 widoki**.


## Zakres i wymagania funkcjonalne
- **Natywna funkcja (min. 1):** wybierz i uzasadnij (np. aparat/kamera, lokalizacja GPS, wibracje/haptics, pliki/galeria).
- **API (min. 1 endpoint):** odczyt lub zapis danych (publiczne lub własne/mock).
- **Widoki (3–4):**
  1. **Lista notatek** (tytuł, data, miniaturka/znacznik lokalizacji).
  2. **Szczegóły notatki** (opis, zdjęcie/pozycja, akcje).
  3. **Dodaj/Edytuj** (formularz: tytuł, opis, dodaj zdjęcie **lub** pobierz lokalizację).
  4. *(Opcjonalnie)* **Ustawienia/O aplikacji** (akcenty dostępności, info o wersji).
- **Stan:** lokalny lub prosty store; brak trwałego storage wymagany, ale dopuszczalny.
- **Dostępność:** podstawowe etykiety i rozmiary celów dotyku (~44–48 px).

## Testowanie lokalne (w trakcie developmentu)
- Uruchom na **urządzeniu/emulatorze**.
- Pokaż: dodanie notatki, użycie **natywnej funkcji** (np. zrobienie zdjęcia lub pobranie GPS), wyświetlenie listy i szczegółów.
- Pokaż komunikację z **API** (np. pobranie listy lub zapis nowej notatki).
- Zweryfikuj: błędy/edge cases (brak uprawnień, brak internetu).

## Definition of Done (DoD)
- [x] 3–4 kompletne widoki zgodne z opisem.
- [x] Użyta co najmniej **1 natywna funkcja**.
- [x] Integracja z **API** (co najmniej 1 żądanie).
- [x] Czytelny UI + podstawowa dostępność.
- [x] Aktualizacja `README.md` z opisem funkcji i sposobem testowania.
- [x] Min. 3 logiczne commity.

---

## Opis aplikacji

Aplikacja Field Notes pozwala tworzyć notatki terenowe z lokalizacją GPS i zdjęciami.

### Funkcje
- **4 widoki**: Lista notatek, Szczegóły, Dodaj/Edytuj, Ustawienia
- **Natywne funkcje**:
  - 📷 Aparat - robienie zdjęć do notatek
  - 🖼️ Galeria - wybieranie zdjęć z galerii
  - 📍 GPS - zapisywanie lokalizacji z adresem
- **API**: Integracja z JSONPlaceholder (pobieranie przykładowych notatek, zapisywanie nowych)
- **Storage**: Lokalne przechowywanie w AsyncStorage
- **Dostępność**: Etykiety dostępności, przyciski min. 48px, czytniki ekranu

### Instalacja i uruchomienie

```bash
npm install
npx expo start
```

Następnie wybierz urządzenie/emulator (a - Android, i - iOS).

### Testowanie

1. **Dodanie notatki**: 
   - Naciśnij "+" na liście
   - Podaj tytuł
   - Opcjonalnie: dodaj zdjęcie (aparat/galeria) lub pobierz lokalizację
   - Zapisz

2. **Natywne funkcje**:
   - Aparat: przycisk "📷 Zrób zdjęcie" - wymaga uprawnień
   - GPS: przycisk "📍 Pobierz lokalizację" - wymaga uprawnień

3. **API**:
   - Przy pierwszym uruchomieniu pobiera 5 przykładowych notatek z JSONPlaceholder
   - Nowe notatki są wysyłane do API (POST /posts)

4. **Edge cases**:
   - Brak uprawnień - pokazuje alert
   - Brak internetu - API zwraca błąd, ale lokalne zapisywanie działa
   - Pusta lista - pokazuje komunikat "Brak notatek"

### Technologie
- React Native (Expo)
- React Navigation
- Expo Image Picker (kamera/galeria)
- Expo Location (GPS)
- AsyncStorage (lokalne przechowywanie)
- JSONPlaceholder API