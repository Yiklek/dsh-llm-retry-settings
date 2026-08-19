# dsh-llm-retry-settings

DSH plugin: a settings page that views and edits each LLM provider's request
retry policy (`retryPolicy`: mode `normal`/`always`, `maxRetries`) and supported
timeout fields (`timeoutMs`, `websocketConnectTimeoutMs`, `streamIdleTimeoutMs`)
over the public settings / llm wire faces.

- The `llm-retry` executor plugin has no configuration of its own — policies
  and timeouts live in each provider's settings namespace (`llm-pi-ai`,
  `llm-deepseek`).
- Writes go through `settings.mutate` and take effect on the next model
  request, without a restart.
- Timeout fields are discovered from each namespace's settings schema when
  available, with a known fallback map for the shipped providers.
- Client-only: the host half is empty; the GUI talks to the loopback API
  gateway exactly like the shipped Models settings page.

This package is a standard dsh bundle plugin: `package.json` declares
`dsh.bundle.patch` pointing at its `cordis.patch.yml`, so `dsh plugin add`
automatically adds the package to `dsh.profile.bundles` and loads this plugin's
own patch layer. No manual edit to `~/.dsh/profiles/web/cordis.patch.yml` is
needed.

## 安装

```sh
npx @deepseek-ai/dsh plugin --profile web add github:Yiklek/dsh-llm-retry-settings
```
