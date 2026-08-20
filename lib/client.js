window.__ModuleLoader__.load({
	id: "dsh-llm-retry-settings",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const React = require("react");
		// dsh-client-schema-form is not a client-inject service; resolve it lazily
// through the shell module system (same approach as dsh-better-sidebar).
let schemaForm = null;
async function loadSchemaForm() {
if (schemaForm !== null) return schemaForm;
const modules = globalThis.__DSH_MODULES__;
if (modules !== undefined && typeof modules.import === "function") {
try {
const mod = await modules.import("@deepseek-ai/dsh-client-schema-form");
schemaForm = { rehydrateSchema: mod.rehydrateSchema, nodeAtPath: mod.nodeAtPath };
} catch {
schemaForm = false;
}
} else {
schemaForm = false;
}
return schemaForm;
}

		const DEFAULT_MAX_RETRIES = 2;
		const RETRYABLE_DEFAULT = ["EMPTY_RESPONSE", "RATE_LIMIT", "SERVER", "TIMEOUT", "TRANSPORT"];

		const CSS = [
			".rt-wrap { display: flex; flex-direction: column; gap: 14px; }",
			".rt-hint { color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 1.6; margin: 0; }",
			".rt-row { border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; background: var(--dsw-alias-bg-layer-1); }",
			".rt-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }",
			".rt-name { font-weight: 600; color: var(--dsw-alias-label-primary); }",
			".rt-badge { font-size: 11px; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-secondary); white-space: nowrap; }",
			".rt-badge.rt-over { color: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); }",
			".rt-badge.rt-live { color: var(--dsw-alias-state-success-primary); border-color: var(--dsw-alias-state-success-primary); }",
			".rt-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }",
			".rt-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }",
			".rt-timeouts { flex: 1 1 100%; display: grid; gap: 10px; padding-top: 8px; border-top: 1px solid var(--dsw-alias-border-l2); }",
			".rt-timeout-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }",
			".rt-timeout-label { color: var(--dsw-alias-label-secondary); font-size: 12px; white-space: nowrap; }",
			".rt-timeouts .rt-num { width: 100%; box-sizing: border-box; }",
			".rt-timeout-toggle { display: inline-flex; align-items: center; gap: 4px; background: transparent; border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; color: var(--dsw-alias-label-secondary); font-size: 12px; padding: 3px 8px; cursor: pointer; white-space: nowrap; }",
			".rt-timeout-toggle:hover { color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-border-l2); }",
			".rt-actions { margin-left: auto; display: flex; gap: 8px; flex-shrink: 0; }",
			".rt-select, .rt-num { box-sizing: border-box; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; padding: 4px 8px; font-size: 13px; }",
			".rt-select:focus, .rt-num:focus { border-color: var(--dsw-alias-brand-primary); outline: none; }",
			".rt-toolbar { display: flex; align-items: center; gap: 8px; }",
			".rt-toggle { display: inline-flex; align-items: center; gap: 6px; margin-left: auto; color: var(--dsw-alias-label-secondary); font-size: 12px; cursor: pointer; user-select: none; white-space: nowrap; }",
			".rt-num { width: 84px; }",
			".rt-inline { color: var(--dsw-alias-label-secondary); font-size: 12px; margin: 0; white-space: nowrap; }",
			".rt-btn { border: none; border-radius: 8px; padding: 5px 14px; cursor: pointer; background: var(--dsw-alias-button-primary-fill); color: var(--dsw-alias-label-primary-foreground); font-size: 13px; white-space: nowrap; }",
			".rt-btn:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover); }",
			".rt-btn.rt-ghost { background: transparent; border: 1px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-primary); }",
			".rt-btn.rt-ghost:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }",
			".rt-btn:disabled { opacity: 0.45; cursor: default; }",
						".rt-msg-ok { color: var(--dsw-alias-state-success-primary); font-size: 13px; margin: 0; }",
			".rt-msg-err { color: var(--dsw-alias-state-error-primary); font-size: 13px; margin: 0; }",
			".rt-meta { color: var(--dsw-alias-label-secondary); font-size: 12px; margin: 0; }",
			".rt-load { color: var(--dsw-alias-label-secondary); font-size: 13px; }",
		].join("\n");

		function insertStyles(css) {
			const el = document.createElement("style");
			el.textContent = css;
			document.head.appendChild(el);
			return () => el.remove();
		}

		function errText(error) {
			if (error !== null && typeof error === "object" && typeof error.message === "string") return error.message;
			return String(error);
		}

		function readAtPath(root, path) {
			let node = root;
			for (const part of path) {
				if (node === null || typeof node !== "object") return undefined;
				node = node[part];
			}
			return node;
		}

		const NS = "llmRetrySettings";
		const ZH = {
			nav: "API 重试",
			timeoutRequest: "请求超时",
			timeoutWs: "WS 连接超时",
			timeoutIdle: "流空闲超时",
			refreshFailed: "刷新失败:",
			positiveIntMs: "{name} 必须是正整数(毫秒)",
			saveFailed: "保存失败:",
			saved: "已保存 {name}:重试与超时配置将在下一次模型请求生效(其他行未保存的修改不受影响)",
			resetFailed: "恢复失败:",
			resetDone: "已恢复 {name} 的默认重试与超时配置",
			loadFailed: "加载失败:",
			loading: "加载中…",
			hint: "重试策略由各 provider 配置持有,llm-retry 插件负责执行。每行独立保存,只写该行;修改即时生效,无需重启。",
			showUnconfigured: "显示未配置的 provider",
			notConfigured: "未配置",
			online: "在线",
			notRegistered: "未注册",
			overridden: "已覆盖默认",
			defaultBadge: "默认",
			alwaysRetry: "始终重试",
			normal: "普通",
			modeNormal: "普通(设次数上限)",
			modeAlways: "始终重试(无上限)",
			maxRetries: "重试次数",
			unlimited: "无限重试",
			timeoutSettings: "超时设置",
			defaultPh: "默认",
			working: "处理中…",
			save: "保存",
			resetDefaults: "恢复默认",
			backoff: "退避:{initial}ms 起,上限 {max}ms,抖动 ±{jitter}%",
			backoffCodes: ";可重试错误:{codes}",
			backoffAll: ";所有失败均会按指数退避一直重试",
			catalogNote: "目录中声明但未配置:在 Models 设置页添加该 provider 后才会出现在请求路径上。",
		};
		const EN = {
			nav: "API Retry",
			timeoutRequest: "Request timeout",
			timeoutWs: "WS connect timeout",
			timeoutIdle: "Stream idle timeout",
			refreshFailed: "Refresh failed:",
			positiveIntMs: "{name} must be a positive integer (ms)",
			saveFailed: "Save failed:",
			saved: "Saved {name}: retry and timeout settings take effect on the next model request (unsaved changes in other rows are not affected)",
			resetFailed: "Reset failed:",
			resetDone: "Reset {name} to default retry and timeout settings",
			loadFailed: "Load failed:",
			loading: "Loading…",
			hint: "Retry policies live in each provider's config; the llm-retry plugin executes them. Each row saves independently; changes apply immediately without restart.",
			showUnconfigured: "Show unconfigured providers",
			notConfigured: "Not configured",
			online: "Online",
			notRegistered: "Not registered",
			overridden: "Overridden",
			defaultBadge: "Default",
			alwaysRetry: "Always retry",
			normal: "Normal",
			modeNormal: "Normal (capped)",
			modeAlways: "Always retry (uncapped)",
			maxRetries: "Max retries",
			unlimited: "Unlimited retries",
			timeoutSettings: "Timeouts",
			defaultPh: "Default",
			working: "Working…",
			save: "Save",
			resetDefaults: "Reset defaults",
			backoff: "Backoff: from {initial}ms, capped at {max}ms, jitter ±{jitter}%",
			backoffCodes: "; retryable errors: {codes}",
			backoffAll: "; all failures retry forever with exponential backoff",
			catalogNote: "Declared in the catalog but not configured: add this provider on the Models settings page to put it on the request path.",
		};
		function fmt(text, params) {
			if (params === undefined || params === null) return text;
			return text.replace(/\{(\w+)\}/g, function (m, key) {
				return Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : m;
			});
		}
		function useT(locale) {
			const subscribe = React.useCallback(function (cb) {
				return locale !== undefined && locale !== null && typeof locale.subscribe === "function" ? locale.subscribe(cb) : function () {};
			}, [locale]);
			const getSnapshot = React.useCallback(function () {
				return locale !== undefined && locale !== null && typeof locale.getSnapshot === "function" ? locale.getSnapshot() : null;
			}, [locale]);
			const snap = React.useSyncExternalStore(subscribe, getSnapshot);
			const active = snap !== null && snap !== undefined && snap.active !== undefined ? String(snap.active) : "";
			const dict = active.toLowerCase().startsWith("zh") ? ZH : EN;
			return React.useCallback(function (key, params) {
				return fmt(dict[key] !== undefined ? dict[key] : (EN[key] !== undefined ? EN[key] : key), params);
			}, [dict]);
		}
		function timeoutLabel(key, t) {
			switch (key) {
				case "timeoutMs": return t("timeoutRequest");
				case "websocketConnectTimeoutMs": return t("timeoutWs");
				case "streamIdleTimeoutMs": return t("timeoutIdle");
				default: return key;
			}
		}

		function timeoutFieldNames(view, settingsPath, settingsNs, fns) {
			const names = [];
			try {
				if (view !== null && typeof view === "object" && view.schema !== undefined
					&& fns !== null && fns !== false && typeof fns.rehydrateSchema === "function" && typeof fns.nodeAtPath === "function") {
					const root = fns.rehydrateSchema(view.schema);
					const node = fns.nodeAtPath(root, settingsPath || []);
					if (node !== null && typeof node === "object" && node.dict !== null && typeof node.dict === "object") {
						for (const key of Object.keys(node.dict)) {
							if (/timeout/i.test(key)) names.push(key);
						}
					}
				}
			} catch (err) { /* fall through to known map */ }
			if (names.length > 0) return names;
			const known = {
				"llm-pi-ai": ["timeoutMs", "websocketConnectTimeoutMs", "streamIdleTimeoutMs"],
				"llm-deepseek": ["streamIdleTimeoutMs"]
			};
			const fallback = known[settingsNs];
			return fallback !== undefined ? fallback.slice() : [];
		}

		function normalizePolicy(raw) {
			if (raw === null || typeof raw !== "object" || typeof raw.mode !== "string") {
				return { mode: "normal", maxRetries: DEFAULT_MAX_RETRIES, retryableCodes: RETRYABLE_DEFAULT.slice(), backoff: undefined };
			}
			if (raw.mode === "always") return { mode: "always" };
			const maxRetries = typeof raw.maxRetries === "number" && Number.isInteger(raw.maxRetries) && raw.maxRetries >= 0
				? raw.maxRetries : DEFAULT_MAX_RETRIES;
			const retryableCodes = Array.isArray(raw.retryableCodes) && raw.retryableCodes.length > 0
				? raw.retryableCodes.filter((code) => typeof code === "string") : RETRYABLE_DEFAULT.slice();
			return { mode: "normal", maxRetries, retryableCodes, backoff: raw.backoff };
		}

		// Join the configurable-provider directory (settingsNs + settingsPath
		// per route, straight from the llm wire face) with the layered settings
		// views: resolved value shows the live policy, the user layer marks the
		// "overridden" badge.
		async function loadRows(api) {
			const fns = await loadSchemaForm();
			const providersRes = await api.llm.providers({});
			if (!providersRes.result.ok) throw new Error(errText(providersRes.result.error));
			const describeRes = await api.settings.describe({});
			if (!describeRes.result.ok) throw new Error(errText(describeRes.result.error));
			const namespaces = describeRes.result.value.namespaces;
			const rows = [];
			for (const p of providersRes.result.value.providers) {
				const row = {
					provider: p.provider,
					displayName: p.displayName || p.provider,
					active: p.active === true,
					configurable: typeof p.settingsNs === "string" && p.settingsNs !== "",
					ns: p.settingsNs || null,
					policyPath: null,
					timeoutFields: [],
					revision: undefined,
					userOverridden: false,
					policy: null,
				};
				if (row.configurable) {
					const view = namespaces.find((n) => n.ns === p.settingsNs);
					if (view === undefined) {
						row.configurable = false;
					} else {
						const profile = readAtPath(view.value, p.settingsPath);
						if (profile === null || typeof profile !== "object") {
							row.configurable = false; // declared in the catalog, never configured
						} else {
							row.policyPath = [...p.settingsPath, "retryPolicy"];
							row.revision = view.revision;
							row.userOverridden = readAtPath(view.user, row.policyPath) !== undefined;
							row.policy = normalizePolicy(readAtPath(view.value, row.policyPath));
							const timeoutFields = [];
							for (const name of timeoutFieldNames(view, p.settingsPath, p.settingsNs, fns)) {
								const path = [...p.settingsPath, name];
								const value = readAtPath(view.value, path);
								timeoutFields.push({
									key: name,
									path: path,
									value: typeof value === "number" && Number.isFinite(value) ? value : undefined,
									userOverridden: readAtPath(view.user, path) !== undefined
								});
							}
							row.timeoutFields = timeoutFields;
						}
					}
				}
				rows.push(row);
			}
			// Stable display order: llm.providers / the registry order shifts whenever a
			// provider adapter re-registers after a settings change (Map delete+re-insert
			// moves its routes to the end). Sort by provider id so saving never reorders.
			rows.sort(function (left, right) {
				return left.provider < right.provider ? -1 : left.provider > right.provider ? 1 : 0;
			});
			return rows;
		}

		function Section(props) {
			const api = props.api;
			const t = useT(props.locale);
			const [rows, setRows] = React.useState(null);
			const [error, setError] = React.useState(null);
			const [drafts, setDrafts] = React.useState({});
			const [busy, setBusy] = React.useState(null);
			const [message, setMessage] = React.useState(null);
			const [showUnconfigured, setShowUnconfigured] = React.useState(false);
			const [openTimeouts, setOpenTimeouts] = React.useState({});

			React.useEffect(function () {
				let alive = true;
				loadRows(api).then(function (next) {
					if (!alive) return;
					setRows(next);
					setDrafts({});
					setError(null);
				}, function (err) {
					if (!alive) return;
					setError(errText(err));
				});
				return function () { alive = false; };
			}, []);

			// Reload rows after a write. Only the draft of `clearProvider` (the row
			// just saved or reset) is discarded; other rows\u0027 pending edits survive,
			// so saving one provider never silently reverts another\u0027s unsaved draft.
			function reload(clearProvider) {
				loadRows(api).then(function (next) {
					setRows(next);
					setDrafts(function (prev) {
						const nextDrafts = {};
						for (const key in prev) {
							if (key !== clearProvider) nextDrafts[key] = prev[key];
						}
						return nextDrafts;
					});
				}, function (err) {
					setMessage({ kind: "err", text: t("refreshFailed") + errText(err) });
				});
			}

			function draftOf(row) {
				const d = drafts[row.provider];
				// Unconfigured rows carry policy=null; they render no controls, but this
				// function still runs for every row, so fall back to defaults instead of
				// crashing the whole section on row.policy.mode.
				const policy = row.policy !== null ? row.policy : { mode: "normal", maxRetries: DEFAULT_MAX_RETRIES };
				const mode = d !== undefined && d.mode !== undefined ? d.mode : policy.mode;
				const maxRetries = d !== undefined && d.maxRetries !== undefined
					? d.maxRetries : (policy.maxRetries === undefined ? DEFAULT_MAX_RETRIES : policy.maxRetries);
				const timeout = {};
				for (const tf of row.timeoutFields || []) {
					const raw = d !== undefined && d.timeout !== undefined ? d.timeout[tf.key] : undefined;
					timeout[tf.key] = raw !== undefined ? raw : (tf.value !== undefined ? String(tf.value) : "");
				}
				return { mode, maxRetries, timeout };
			}

			function isDirty(row) {
				const d = drafts[row.provider];
				if (d === undefined) return false;
				if (d.mode !== undefined && d.mode !== row.policy.mode) return true;
				if ((d.mode || row.policy.mode) === "normal" && d.maxRetries !== undefined && d.maxRetries !== row.policy.maxRetries) return true;
				const draft = draftOf(row);
				for (const tf of row.timeoutFields || []) {
					const current = draft.timeout[tf.key] !== undefined ? draft.timeout[tf.key] : "";
					const base = tf.value !== undefined ? String(tf.value) : "";
					if (current !== base) return true;
				}
				return false;
			}

			function edit(provider, patch) {
				setDrafts(function (prev) {
					const next = {};
					for (const key in prev) next[key] = prev[key];
					const merged = prev[provider] !== undefined ? { ...prev[provider] } : {};
					for (const key in patch) merged[key] = patch[key];
					next[provider] = merged;
					return next;
				});
			}

			function editTimeout(row, key, value) {
				setDrafts(function (prev) {
					const next = {};
					for (const k in prev) next[k] = prev[k];
					const merged = prev[row.provider] !== undefined ? { ...prev[row.provider] } : {};
					const timeout = merged.timeout !== undefined ? { ...merged.timeout } : {};
					timeout[key] = value;
					merged.timeout = timeout;
					next[row.provider] = merged;
					return next;
				});
			}

			function toggleTimeouts(provider) {
				setOpenTimeouts(function (prev) {
					const next = { ...prev };
					if (next[provider] === true) delete next[provider];
					else next[provider] = true;
					return next;
				});
			}

			function save(row) {
				const draft = draftOf(row);
				const ops = [];
				const retryValue = draft.mode === "always"
					? { mode: "always" }
					: { mode: "normal", maxRetries: draft.maxRetries };
				ops.push({ op: "set", path: row.policyPath, value: retryValue });
				for (const tf of row.timeoutFields || []) {
					const raw = draft.timeout[tf.key];
					if (raw === undefined || raw === "") {
						if (tf.userOverridden) ops.push({ op: "unset", path: tf.path });
						continue;
					}
					const parsed = Number(raw);
					if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
						setMessage({ kind: "err", text: t("positiveIntMs", { name: timeoutLabel(tf.key, t) }) });
						return;
					}
					ops.push({ op: "set", path: tf.path, value: parsed });
				}
				setBusy(row.provider);
				setMessage(null);
				api.settings.mutate({
					ns: row.ns,
					ops: ops,
					expectedRevision: row.revision,
				}).then(function (res) {
					setBusy(null);
					if (!res.result.ok) {
						setMessage({ kind: "err", text: t("saveFailed") + errText(res.result.error) });
						return;
					}
					setMessage({ kind: "ok", text: t("saved", { name: row.displayName }) });
					reload(row.provider);
				}, function (err) {
					setBusy(null);
					setMessage({ kind: "err", text: t("saveFailed") + errText(err) });
				});
			}

			function reset(row) {
				const ops = [{ op: "unset", path: row.policyPath }];
				for (const tf of row.timeoutFields || []) {
					if (tf.userOverridden) ops.push({ op: "unset", path: tf.path });
				}
				setBusy(row.provider);
				setMessage(null);
				api.settings.mutate({
					ns: row.ns,
					ops: ops,
					expectedRevision: row.revision,
				}).then(function (res) {
					setBusy(null);
					if (!res.result.ok) {
						setMessage({ kind: "err", text: t("resetFailed") + errText(res.result.error) });
						return;
					}
					setMessage({ kind: "ok", text: t("resetDone", { name: row.displayName }) });
					reload(row.provider);
				}, function (err) {
					setBusy(null);
					setMessage({ kind: "err", text: t("resetFailed") + errText(err) });
				});
			}

			if (error !== null) {
				return React.createElement("div", { className: "rt-wrap" },
					React.createElement("p", { className: "rt-msg-err" }, t("loadFailed") + error));
			}
			if (rows === null) {
				return React.createElement("div", { className: "rt-wrap" },
					React.createElement("span", { className: "rt-load" }, t("loading")));
			}

			const children = [
				React.createElement("p", { className: "rt-hint", key: "hint" }, t("hint")),
				React.createElement("div", { className: "rt-toolbar", key: "toolbar" },
					React.createElement("label", { className: "rt-toggle" },
						React.createElement("input", {
							type: "checkbox",
							checked: showUnconfigured,
							onChange: function (e) { setShowUnconfigured(e.target.checked); },
						}),
						t("showUnconfigured"))),
			];
			for (const row of rows) {
				if (!showUnconfigured && (row.policy === null || !row.configurable)) continue;
				const draft = draftOf(row);
				const dirty = isDirty(row);
				const bo = row.policy !== null && row.policy.backoff !== undefined ? row.policy.backoff : null;
				const timeoutCount = (row.timeoutFields || []).length;
				const timeoutStyle = timeoutCount === 1
					? { gridTemplateColumns: "minmax(150px, 220px)" }
					: { gridTemplateColumns: "repeat(" + timeoutCount + ", minmax(0, 1fr))" };
				children.push(React.createElement("div", { className: "rt-row", key: row.provider },
					React.createElement("div", { className: "rt-head" },
						React.createElement("span", { className: "rt-name" }, row.displayName),
						React.createElement("span", { className: "rt-badge" }, row.ns || t("notConfigured")),
						row.active
							? React.createElement("span", { className: "rt-badge rt-live" }, t("online"))
							: React.createElement("span", { className: "rt-badge" }, t("notRegistered")),
						row.userOverridden
							? React.createElement("span", { className: "rt-badge rt-over" }, t("overridden"))
							: React.createElement("span", { className: "rt-badge" }, t("defaultBadge")),
						row.policy !== null
							? React.createElement("span", { className: "rt-badge" }, row.policy.mode === "always" ? t("alwaysRetry") : t("normal"))
							: null),
					row.configurable && row.policy !== null
						? React.createElement("div", { className: "rt-body" },
							React.createElement("div", { className: "rt-controls" },
								React.createElement("select", {
									className: "rt-select",
									value: draft.mode,
									onChange: function (e) { edit(row.provider, { mode: e.target.value }); },
								},
									React.createElement("option", { value: "normal" }, t("modeNormal")),
									React.createElement("option", { value: "always" }, t("modeAlways"))),
								draft.mode === "normal"
									? React.createElement("label", { className: "rt-inline" },
										t("maxRetries"),
										React.createElement("input", {
											className: "rt-num", type: "number", min: 0, max: 50, step: 1,
											value: draft.maxRetries,
											onChange: function (e) {
												const parsed = parseInt(e.target.value, 10);
												const clamped = Number.isFinite(parsed) ? Math.min(50, Math.max(0, parsed)) : 0;
												edit(row.provider, { maxRetries: clamped });
											},
										}))
									: React.createElement("span", { className: "rt-inline" }, t("unlimited"))),
							(row.timeoutFields || []).length > 0
								? React.createElement("button", {
									className: "rt-timeout-toggle",
									key: "toggle-timeouts",
									onClick: function () { toggleTimeouts(row.provider); },
								}, (openTimeouts[row.provider] === true ? "▾ " : "▸ ") + t("timeoutSettings"))
								: null,
							openTimeouts[row.provider] === true && (row.timeoutFields || []).length > 0
								? React.createElement("div", { className: "rt-timeouts", key: "timeouts", style: timeoutStyle },
									row.timeoutFields.map(function (tf) {
										return React.createElement("div", { className: "rt-timeout-field", key: tf.key },
											React.createElement("span", { className: "rt-timeout-label" }, timeoutLabel(tf.key, t) + " (ms)"),
											React.createElement("input", {
												className: "rt-num", type: "number", min: 1, step: 1,
												value: draft.timeout[tf.key] !== undefined ? draft.timeout[tf.key] : "",
												placeholder: t("defaultPh"),
												onChange: function (e) { editTimeout(row, tf.key, e.target.value); },
											}));
									}))
								: null,
							React.createElement("div", { className: "rt-actions" },
								React.createElement("button", {
									className: "rt-btn", disabled: !dirty || busy === row.provider,
									onClick: function () { save(row); },
								}, busy === row.provider ? t("working") : t("save")),
								React.createElement("button", {
									className: "rt-btn rt-ghost", disabled: !row.userOverridden || busy === row.provider,
									onClick: function () { reset(row); },
								}, t("resetDefaults"))))
						: null,
					row.policy !== null && bo !== null
						? React.createElement("p", { className: "rt-meta" },
							t("backoff", { initial: bo.initialDelayMs, max: bo.maxDelayMs, jitter: Math.round(bo.jitterRatio * 100) })
							+ (row.policy.retryableCodes !== undefined ? t("backoffCodes", { codes: row.policy.retryableCodes.join(" / ") }) : t("backoffAll")))
						: null,
					!row.configurable
						? React.createElement("p", { className: "rt-meta" }, t("catalogNote"))
						: null));
			}
			if (message !== null) {
				children.push(React.createElement("p",
					{ className: message.kind === "ok" ? "rt-msg-ok" : "rt-msg-err", key: "msg" }, message.text));
			}
			return React.createElement("div", { className: "rt-wrap" }, children);
		}

		function apply(ctx) {
			ctx.effect(() => insertStyles(CSS), "llm-retry-settings: styles");
			ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), "llm-retry-settings: dictionaries");
			const t = ctx.locale.bind(NS);
			const connection = ctx.connection;
			const locale = ctx.locale;
			ctx.slots.inject("settings.section", () => ctx.slots.register(
				{
					name: "settings.section",
					id: "api-retry",
					order: 95,
					label: () => t("nav"),
					locale: NS,
					inject: () => ({ t, locale }),
				},
				(props) => React.createElement(Section, {
					api: connection.api,
					locale: props !== undefined && props !== null && props.locale !== undefined ? props.locale : locale,
				})
			));
		}

		exports.apply = apply;
		exports.inject = ["slots", "connection", "locale"];
		return module.exports;
	}
});
