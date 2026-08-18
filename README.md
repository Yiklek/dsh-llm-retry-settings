# dsh-llm-retry-settings

DSH plugin: a settings page that views and edits each LLM provider's request
retry policy (`retryPolicy`: mode `normal`/`always`, `maxRetries`) over the
public settings / llm wire faces.

- The `llm-retry` executor plugin has no configuration of its own — policies
  live in each provider's settings namespace (`llm-pi-ai`, `llm-deepseek`).
- Writes go through `settings.mutate` and take effect on the next model
  request, without a restart.
- Client-only: the host half is empty; the GUI talks to the loopback API
  gateway exactly like the shipped Models settings page.

Mount (profile `web`): `~/.dsh/profiles/web/package.json` holds the `link:`
dependency, `cordis.patch.yml` inserts the plugin row.

## 安装

```sh
npx @deepseek-ai/dsh plugin --profile web add github:Yiklek/dsh-llm-retry-settings
```

```yaml
- insert:
    - id: llm-retry-settings
      name: dsh-llm-retry-settings
```
