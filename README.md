# NiklasFlaig_ProgrammierenII_WiSe2122
## Beschreibung
Das Projekt ist ein Chat, der es ermöglicht daten zwischen mehreren Clients hin und her zu senden. 
Dabei werden diese an einen zentralen Server geleitet, der wiederum dafür sorgt, dass alle Nutzer/innen
in dem jeweiligen Chat die Nachrichten bekommen.

### Feature-List
1.Registrierung und später Anmelden in einem eigenen passwortgeschützten Profil<br>
2.Erstellen von "personToPersonChats" und "groupChats"<br>
3.Versenden von Nachrichten innerhalb dieser Chats
### Future Work
1.Löschen von Chats<br>
2.Nachträgliches hinzufügen von Membern in einen Chat<br>
3.Profilbearbeitung und Kontaktnamenbearbeitung<br>
4.File und ImageMessages<br>
5. ...

## Usage
### get the code
Einfach das Repo hier ziehen und los gehts!
### make it work
1. Navigiere in der Shell deiner Wahl zu dem Repository-Ordner
2. gib in die Shell folgendes ein: node server/server.js
3. öffne den Browser deiner Wahl und öffne folgende url: http://127.0.0.1/
4. öffne diese url so oft, bis du genügend theoretische Nutzer hast
5. Registriere ein neues Konto und erstelle deinen ersten Chat
6. alternativ kannst du auch die test Konten benutzen um eine bestehende Struktur zu testen
("Name","Password")<br>
("Niklas Flaig", "1234"),<br>
("Peter Obama", "4321"),<br>
("Katherine", "0000"),<br>
("Michi", "1234"),<br>
## tech-stack
Der tech-stack besteht aus vue.js einem front.end view+viewModel binding framework<br>
socket.io das es vereinfacht html protokolle zwischen server und client auszutauschen<br>
node.js als backend runtime environment, um den Server laufen zu lassen, der die Daten hin und her schickt<br>
und mqtt, welches benuztt wird um, wenn möglich protokolle an eine externe Remoji-Box zu senden (siehe: https://ausstellung.hfg-gmuend.de/w-2122/projekte/remoji)
