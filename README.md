# post-display-widget

Staffbase-Custom-Widget. Entwickelt, gebaut und released wird es aus dem
Meta-Repo [`ps-mhp/man-staffbase-cms-extensions`](https://github.com/ps-mhp/man-staffbase-cms-extensions);
dieses Repo enthält nur Quellcode und das ausgelieferte Bundle unter `dist/`.

```bash
scripts/sync.sh post-display-widget
npm run build -- --env widget=post-display-widget
npm test -- src/widgets/post-display-widget
scripts/release.sh post-display-widget
```
