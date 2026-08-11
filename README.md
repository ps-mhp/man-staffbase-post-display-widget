# post-display-widget

Zeigt einen einzelnen Staffbase-Beitrag an der Stelle an, an der das Widget
platziert wird. Konfiguriert wird nur die Beitrags-ID (oder die Beitrags-URL,
aus der die ID gelesen wird); die Sprachfassung ergibt sich aus der Sprache des
Nutzers — `<html lang>`, dann `<meta content-language>`, dann
`navigator.language`. Gibt es den Beitrag nur in einer anderen Sprache, wird
diese angezeigt statt gar nichts.

Abgerufen wird `GET /api/posts/<id>` mit dem Sessioncookie des Nutzers, es
gelten also dessen Leseberechtigungen unverändert.

Staffbase-Custom-Widget. Entwickelt, gebaut und released wird es aus dem
Meta-Repo [`ps-mhp/man-staffbase-cms-extensions`](https://github.com/ps-mhp/man-staffbase-cms-extensions);
dieses Repo enthält nur Quellcode und das ausgelieferte Bundle unter `dist/`.

```bash
scripts/sync.sh post-display-widget
npm run build -- --env widget=post-display-widget
npm test -- src/widgets/post-display-widget
scripts/release.sh post-display-widget
```
