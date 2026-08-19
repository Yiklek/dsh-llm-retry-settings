window.__ModuleLoader__.load({
	id: "dsh-llm-retry-settings",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const React = require("react");
		const { rehydrateSchema, nodeAtPath } = require("@deepseek-ai/dsh-client-schema-form");

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

		function timeoutLabel(key) {
			switch (key) {
				case "timeoutMs": return "请求超时";
				case "websocketConnectTimeoutMs": return "WS 连接超时";
				case "streamIdleTimeoutMs": return "流空闲超时";
				default: return key;
			}
		}

		function timeoutFieldNames(view, settingsPath, settingsNs) {
			const names = [];
			try {
				if (view !== null && typeof view === "object" && view.schema !== undefined
					&& typeof rehydrateSchema === "function" && typeof nodeAtPath === "function") {
					const root = rehydrateSchema(view.schema);
					const node = nodeAtPath(root, settingsPath || []);
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
							for (const name of timeoutFieldNames(view, p.settingsPath, p.settingsNs)) {
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
					setMessage({ kind: "err", text: "刷新失败:" + errText(err) });
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
						setMessage({ kind: "err", text: timeoutLabel(tf.key) + " 必须是正整数(毫秒)" });
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
						setMessage({ kind: "err", text: "保存失败:" + errText(res.result.error) });
						return;
					}
					setMessage({ kind: "ok", text: "已保存 " + row.displayName + ":重试与超时配置将在下一次模型请求生效(其他行未保存的修改不受影响)" });
					reload(row.provider);
				}, function (err) {
					setBusy(null);
					setMessage({ kind: "err", text: "保存失败:" + errText(err) });
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
						setMessage({ kind: "err", text: "恢复失败:" + errText(res.result.error) });
						return;
					}
					setMessage({ kind: "ok", text: "已恢复 " + row.displayName + " 的默认重试与超时配置" });
					reload(row.provider);
				}, function (err) {
					setBusy(null);
					setMessage({ kind: "err", text: "恢复失败:" + errText(err) });
				});
			}

			if (error !== null) {
				return React.createElement("div", { className: "rt-wrap" },
					React.createElement("p", { className: "rt-msg-err" }, "加载失败:" + error));
			}
			if (rows === null) {
				return React.createElement("div", { className: "rt-wrap" },
					React.createElement("span", { className: "rt-load" }, "加载中…"));
			}

			const children = [
				React.createElement("p", { className: "rt-hint", key: "hint" },
					"重试策略由各 provider 配置持有,llm-retry 插件负责执行。每行独立保存,只写该行;修改即时生效,无需重启。"),
				React.createElement("div", { className: "rt-toolbar", key: "toolbar" },
					React.createElement("label", { className: "rt-toggle" },
						React.createElement("input", {
							type: "checkbox",
							checked: showUnconfigured,
							onChange: function (e) { setShowUnconfigured(e.target.checked); },
						}),
						"显示未配置的 provider")),
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
						React.createElement("span", { className: "rt-badge" }, row.ns || "未配置"),
						row.active
							? React.createElement("span", { className: "rt-badge rt-live" }, "在线")
							: React.createElement("span", { className: "rt-badge" }, "未注册"),
						row.userOverridden
							? React.createElement("span", { className: "rt-badge rt-over" }, "已覆盖默认")
							: React.createElement("span", { className: "rt-badge" }, "默认"),
						row.policy !== null
							? React.createElement("span", { className: "rt-badge" }, row.policy.mode === "always" ? "始终重试" : "普通")
							: null),
					row.configurable && row.policy !== null
						? React.createElement("div", { className: "rt-body" },
							React.createElement("div", { className: "rt-controls" },
								React.createElement("select", {
									className: "rt-select",
									value: draft.mode,
									onChange: function (e) { edit(row.provider, { mode: e.target.value }); },
								},
									React.createElement("option", { value: "normal" }, "普通(设次数上限)"),
									React.createElement("option", { value: "always" }, "始终重试(无上限)")),
								draft.mode === "normal"
									? React.createElement("label", { className: "rt-inline" },
										"重试次数",
										React.createElement("input", {
											className: "rt-num", type: "number", min: 0, max: 50, step: 1,
											value: draft.maxRetries,
											onChange: function (e) {
												const parsed = parseInt(e.target.value, 10);
												const clamped = Number.isFinite(parsed) ? Math.min(50, Math.max(0, parsed)) : 0;
												edit(row.provider, { maxRetries: clamped });
											},
										}))
									: React.createElement("span", { className: "rt-inline" }, "无限重试")),
							(row.timeoutFields || []).length > 0
								? React.createElement("button", {
									className: "rt-timeout-toggle",
									key: "toggle-timeouts",
									onClick: function () { toggleTimeouts(row.provider); },
								}, (openTimeouts[row.provider] === true ? "▾ " : "▸ ") + "超时设置")
								: null,
							openTimeouts[row.provider] === true && (row.timeoutFields || []).length > 0
								? React.createElement("div", { className: "rt-timeouts", key: "timeouts", style: timeoutStyle },
									row.timeoutFields.map(function (tf) {
										return React.createElement("div", { className: "rt-timeout-field", key: tf.key },
											React.createElement("span", { className: "rt-timeout-label" }, timeoutLabel(tf.key) + " (ms)"),
											React.createElement("input", {
												className: "rt-num", type: "number", min: 1, step: 1,
												value: draft.timeout[tf.key] !== undefined ? draft.timeout[tf.key] : "",
												placeholder: "默认",
												onChange: function (e) { editTimeout(row, tf.key, e.target.value); },
											}));
									}))
								: null,
							React.createElement("div", { className: "rt-actions" },
								React.createElement("button", {
									className: "rt-btn", disabled: !dirty || busy === row.provider,
									onClick: function () { save(row); },
								}, busy === row.provider ? "处理中…" : "保存"),
								React.createElement("button", {
									className: "rt-btn rt-ghost", disabled: !row.userOverridden || busy === row.provider,
									onClick: function () { reset(row); },
								}, "恢复默认")))
						: null,
					row.policy !== null && bo !== null
						? React.createElement("p", { className: "rt-meta" },
							"退避:" + bo.initialDelayMs + "ms 起,上限 " + bo.maxDelayMs + "ms,抖动 ±" + Math.round(bo.jitterRatio * 100) + "%"
							+ (row.policy.retryableCodes !== undefined ? ";可重试错误:" + row.policy.retryableCodes.join(" / ") : ";所有失败均会按指数退避一直重试"))
						: null,
					!row.configurable
						? React.createElement("p", { className: "rt-meta" }, "目录中声明但未配置:在 Models 设置页添加该 provider 后才会出现在请求路径上。")
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
			const connection = ctx.connection;
			ctx.slots.inject("settings.section", () => ctx.slots.register(
				{ name: "settings.section", id: "api-retry", order: 95, label: "API 重试" },
				() => React.createElement(Section, { api: connection.api })
			));
		}

		exports.apply = apply;
		exports.inject = ["slots", "connection"];
		return module.exports;
	}
});
