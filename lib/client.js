window.__ModuleLoader__.load({
	id: "dsh-llm-retry-settings",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const React = require("react");

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
			".rt-actions { margin-left: auto; display: flex; gap: 8px; flex-shrink: 0; }",
			".rt-select, .rt-num { background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; padding: 4px 8px; font-size: 13px; }",
			".rt-num { width: 84px; }",
			".rt-inline { color: var(--dsw-alias-label-secondary); font-size: 12px; margin: 0; white-space: nowrap; }",
			".rt-btn { border: none; border-radius: 8px; padding: 5px 14px; cursor: pointer; background: var(--dsw-alias-brand-primary); color: #fff; font-size: 13px; white-space: nowrap; }",
			".rt-btn:disabled { opacity: 0.45; cursor: default; }",
			".rt-btn.rt-ghost { background: transparent; border: 1px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-secondary); }",
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
					revision: undefined,
					userOverridden: false,
					policy: null,
				};
				if (row.configurable) {
					const view = namespaces.find((n) => n.ns === p.settingsNs);
					if (view === undefined) {
						row.configurable = false;
					} else {
						row.policyPath = [...p.settingsPath, "retryPolicy"];
						row.revision = view.revision;
						row.userOverridden = readAtPath(view.user, row.policyPath) !== undefined;
						row.policy = normalizePolicy(readAtPath(view.value, row.policyPath));
					}
				}
				rows.push(row);
			}
			return rows;
		}

		function Section(props) {
			const api = props.api;
			const [rows, setRows] = React.useState(null);
			const [error, setError] = React.useState(null);
			const [drafts, setDrafts] = React.useState({});
			const [busy, setBusy] = React.useState(null);
			const [message, setMessage] = React.useState(null);

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

			function reload() {
				loadRows(api).then(function (next) {
					setRows(next);
					setDrafts({});
				}, function (err) {
					setMessage({ kind: "err", text: "刷新失败:" + errText(err) });
				});
			}

			function draftOf(row) {
				const d = drafts[row.provider];
				const mode = d !== undefined && d.mode !== undefined ? d.mode : row.policy.mode;
				const maxRetries = d !== undefined && d.maxRetries !== undefined
					? d.maxRetries : (row.policy.maxRetries === undefined ? DEFAULT_MAX_RETRIES : row.policy.maxRetries);
				return { mode, maxRetries };
			}

			function isDirty(row) {
				const d = drafts[row.provider];
				if (d === undefined) return false;
				if (d.mode !== undefined && d.mode !== row.policy.mode) return true;
				if ((d.mode || row.policy.mode) === "normal" && d.maxRetries !== undefined && d.maxRetries !== row.policy.maxRetries) return true;
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

			function save(row) {
				const draft = draftOf(row);
				const value = draft.mode === "always"
					? { mode: "always" }
					: { mode: "normal", maxRetries: draft.maxRetries };
				setBusy(row.provider);
				setMessage(null);
				api.settings.mutate({
					ns: row.ns,
					ops: [{ op: "set", path: row.policyPath, value }],
					expectedRevision: row.revision,
				}).then(function (res) {
					setBusy(null);
					if (!res.result.ok) {
						setMessage({ kind: "err", text: "保存失败:" + errText(res.result.error) });
						reload();
						return;
					}
					setMessage({ kind: "ok", text: "已保存:对 " + row.displayName + " 的下一次模型请求生效" });
					reload();
				}, function (err) {
					setBusy(null);
					setMessage({ kind: "err", text: "保存失败:" + errText(err) });
				});
			}

			function reset(row) {
				setBusy(row.provider);
				setMessage(null);
				api.settings.mutate({
					ns: row.ns,
					ops: [{ op: "unset", path: row.policyPath }],
					expectedRevision: row.revision,
				}).then(function (res) {
					setBusy(null);
					if (!res.result.ok) {
						setMessage({ kind: "err", text: "恢复失败:" + errText(res.result.error) });
						reload();
						return;
					}
					setMessage({ kind: "ok", text: "已恢复默认策略(普通模式,最多重试 " + DEFAULT_MAX_RETRIES + " 次)" });
					reload();
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
					"重试策略由各 provider 配置持有,llm-retry 插件负责执行。此处修改直接写入 settings,对下一次模型请求即时生效,无需重启。"),
			];
			for (const row of rows) {
				const draft = draftOf(row);
				const dirty = isDirty(row);
				const bo = row.policy !== null && row.policy.backoff !== undefined ? row.policy.backoff : null;
				children.push(React.createElement("div", { className: "rt-row", key: row.provider },
					React.createElement("div", { className: "rt-head" },
						React.createElement("span", { className: "rt-name" }, row.displayName),
						React.createElement("span", { className: "rt-badge" }, row.ns || "无配置地址"),
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
						? React.createElement("p", { className: "rt-meta" }, "该 provider 没有可写的重试策略配置地址。")
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
