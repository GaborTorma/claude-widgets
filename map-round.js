// A /planning:map kör-widgetje: R(kód, tevékenység, célmondat, [[sorszám, funkció, egy mondat, adat, rövid név], …]).
// Soronként státusz (🟣 🟠 🟡 ⛔ ❓); 🟣 sornál az adat forrása is (⚙️ 🔌 🌱), kötelezően. Adat nélküli sor
// (szerkesztő funkció) nem kap forrást. A 🌱 alatt nem kötelező al-sor: a későbbi forrás (S: ⚙️, A: 🔌) és
// státusza (🟠 🟡 ⛔ ❓); a forrás csak 🟠/🟡/⛔ után választható, akkor kötelező.
// A Küldés szövegként válaszol: "<kód>-kör: 1🟣🌱→🔌⛔ 4🟣⚙️ 9🟠 · megjegyzés: …".
function R(T, N, C, F) {
  const ST = [["🟣", "Most"], ["🟠", "Később — csak adatkapcsolat"], ["🟡", "Talán"], ["⛔", "Soha"], ["❓", "Nyitott"]],
    SRC = [["⚙️", "Beállítható"], ["🔌", "Automatikus forrás"], ["🌱", "Fejlesztő tartja karban (seed, config)"]],
    SSRC = SRC.slice(0, 2), SST = ST.slice(1), DEC = ["🟠", "🟡", "⛔"],
    S = F.map(() => ({ st: null, src: null, ssrc: null, sst: null })), w = document.createElement("div");
  const btn = (c, [e, t]) => `<button data-c="${c}" data-e="${e}" title="${t}" aria-label="${t}">${e}</button>`,
    gap = n => '<button class="gap" tabindex="-1" aria-hidden="true"></button>'.repeat(n),
    grp = (c, L, off) => `<span class="g ${c}${off ? " off" : ""}">${L.map(x => btn(c, x)).join("")}</span>`;
  w.innerHTML = `<style>.mr .r{border-bottom:.5px solid var(--border);padding:10px 0}.mr .top{display:flex;gap:10px;align-items:center}.mr .top>div:first-child{flex:1;min-width:0}.mr b{display:block;font-size:14px;font-weight:500;color:var(--text-primary)}.mr p{margin:0;font-size:12px;line-height:1.4;color:var(--text-secondary)}.mr .sd{font-size:12px;color:var(--text-muted);margin-top:2px}.mr .g{display:flex;gap:4px;flex-shrink:0;align-items:center}.mr .g button{width:32px;height:30px;padding:0;font-size:15px;display:inline-flex;align-items:center;justify-content:center}.mr .sep{width:.5px;height:22px;background:var(--border-strong);margin:0 5px}.mr .off{opacity:.3;pointer-events:none}.mr .gap{visibility:hidden}.mr .sub{display:none;margin:8px 0 0 16px;padding:6px 0 0 12px;border-left:2px solid var(--border-strong);border-radius:0;align-items:center;gap:10px}.mr .sn{flex:1;font-size:13px;min-width:0}.mr .lg{display:flex;gap:12px;flex-wrap:wrap;font-size:12px;color:var(--text-secondary);margin-top:10px}</style>`
    + `<div class="mr"><div><b style="font-size:16px">${N} (${T})</b><p>${C}</p></div><div class="rows">`
    + F.map(([n, f, h, a]) => `<div class="r"><div class="top"><div><b>${n}. ${f}</b><p>${h}</p>${a ? `<div class="sd">🧬 ${a}</div>` : ""}</div>`
      + `<div class="g">${a ? grp("src", SRC, true) : `<span class="g">${gap(3)}</span>`}<span class="sep"></span>${grp("st", ST)}</div></div>`
      + (a ? `<div class="sub"><div class="sn"></div>${grp("ssrc", SSRC, true)}<span class="sep"></span>${grp("sst", SST)}</div>` : "") + "</div>").join("")
    + `</div><div class="lg">${SRC.map(([e, t]) => `<span>${e} ${t.split(" (")[0]}</span>`).join("")}<span>|</span>${ST.map(([e, t]) => `<span>${e} ${t.split(" — ")[0]}</span>`).join("")}</div>`
    + `<textarea placeholder="Megjegyzés (nem kötelező)" style="width:100%;margin:.75rem 0;min-height:56px"></textarea>`
    + `<div style="display:flex;justify-content:flex-end;align-items:center;gap:8px"><span style="font-size:13px"></span><button>Küldés ↗</button></div></div>`;
  const root = w.querySelector(".mr"), rows = [...root.querySelectorAll(".r")], m = root.querySelector("textarea"),
    err = root.lastChild.firstChild, go = root.lastChild.lastChild;
  // Inline stílus: a host előre beállított gombstílusa felülírná az osztályt. Az inset keret nem lóg ki a widgetből.
  const mark = (g, e) => g && g.querySelectorAll("button").forEach(x => {
    const on = x.dataset.e === e;
    x.style.background = on ? "var(--bg-accent)" : "";
    x.style.boxShadow = on ? "inset 0 0 0 1.5px var(--border-accent)" : "";
  });
  const subOn = s => s.st === "🟣" && s.src === "🌱";
  const upd = i => {
    const s = S[i], r = rows[i], q = c => r.querySelector("." + c), [n, , , a, k] = F[i];
    if (!a) return;
    q("src").classList.toggle("off", s.st !== "🟣");
    if (s.st !== "🟣") { s.src = null; mark(q("src"), null); }
    q("sub").style.display = subOn(s) ? "flex" : "none";
    const dec = DEC.includes(s.sst);
    q("ssrc").classList.toggle("off", !dec);
    if (!dec) { s.ssrc = null; mark(q("ssrc"), null); }
    const sn = q("sn");
    sn.textContent = s.ssrc === "⚙️" ? `${n}S. ${k} beállítása` : s.ssrc === "🔌" ? `${n}A. ${k} automatikusan`
      : dec ? `${k}: beállítható vagy automatikus?` : `${k} később?`;
    sn.style.color = s.ssrc ? "var(--text-primary)" : dec ? "var(--text-danger)" : "var(--text-muted)";
  };
  root.querySelector(".rows").onclick = e => {
    const b = e.target.closest("button[data-c]");
    if (!b) return;
    const i = rows.indexOf(b.closest(".r")), c = b.dataset.c, s = S[i];
    // Az al-sor választása újabb kattintással visszavonható: az al-sor nem kötelező.
    s[c] = s[c] === b.dataset.e && (c === "ssrc" || c === "sst") ? null : b.dataset.e;
    mark(b.parentNode, s[c]);
    rows[i].querySelector("b").style.color = "";
    err.textContent = "";
    upd(i);
  };
  go.onclick = () => {
    const miss = S.map((s, i) => i).filter(i => {
      const s = S[i];
      return !s.st || (F[i][3] && s.st === "🟣" && !s.src) || (subOn(s) && DEC.includes(s.sst) && !s.ssrc);
    });
    if (miss.length) {
      miss.forEach(i => { rows[i].querySelector("b").style.color = "var(--text-danger)"; });
      err.style.color = "var(--text-danger)";
      err.textContent = "Hiányzik: " + miss.map(i => F[i][0]).join(", ");
      return;
    }
    const v = m.value.trim(), a = S.map((s, i) => F[i][0] + s.st + (s.src || "")
      + (subOn(s) && s.ssrc && DEC.includes(s.sst) ? "→" + s.ssrc + s.sst : "")).join(" ");
    // Visszajelzés a hívás előtt: látszik, hogy a kattintás célba ért, akkor is, ha a host késleltet.
    err.style.color = "var(--text-secondary)";
    err.textContent = "Küldés…";
    sendPrompt(T + "-kör: " + a + (v ? " · megjegyzés: " + v : ""));
    err.textContent = "Elküldve";
  };
  document.currentScript ? document.currentScript.before(w) : document.body.appendChild(w);
}
