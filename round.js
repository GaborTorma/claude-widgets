// A /workflow:map kör-widgetje: R(kód, tevékenység, célmondat, [[funkció, egy mondat], …]).
// A Küldés a választ szövegként küldi vissza: "<kód>-kör: 1l 2t 3s 4? · hiányzik: …".
function R(T, N, C, F) {
  const a = {}, w = document.createElement("div");
  w.innerHTML = `<style>.rw>div{display:flex;gap:8px;align-items:center;padding:10px 0;border-bottom:.5px solid var(--border)}.rw p{margin:0;flex:1;font-size:12px;line-height:1.4;color:var(--text-secondary)}.rw b{display:block;font-size:14px;font-weight:500;color:var(--text-primary)}.rw button{font-size:13px;padding:4px 10px;flex-shrink:0}</style>`
    + `<div class="rw"><div><p><b style="font-size:16px">${N} (${T})</b>${C}</p></div>`
    + F.map(([n, h], i) => `<div><p><b>${i + 1}. ${n}</b>${h}</p>`
      + [["l", "lesz"], ["t", "talán"], ["s", "soha"], ["?", "nem tudom"]]
        .map(([k, l]) => `<button data-i="${i}" data-k="${k}">${l}</button>`).join("") + "</div>").join("")
    + `</div><textarea placeholder="Hiányzó funkció (nem kötelező)" style="width:100%;margin:.75rem 0;min-height:56px"></textarea>`
    + `<div style="display:flex;justify-content:flex-end"><button>Küldés ↗</button></div>`;
  const rows = w.querySelector(".rw"), m = w.querySelector("textarea"), go = w.lastChild.firstChild;
  rows.onclick = e => {
    const b = e.target.closest("button");
    if (!b) return;
    a[b.dataset.i] = b.dataset.k;
    // Inline stílus: a host előre beállított gombstílusa felülírná az osztályt.
    b.parentNode.querySelectorAll("button").forEach(x => {
      x.style.background = x === b ? "var(--bg-accent)" : "";
      x.style.color = x === b ? "var(--text-accent)" : "";
    });
  };
  go.onclick = () => {
    const v = m.value.trim();
    sendPrompt(T + "-kör: " + F.map((f, i) => (i + 1) + (a[i] || "?")).join(" ") + (v ? " · hiányzik: " + v : ""));
  };
  document.currentScript ? document.currentScript.before(w) : document.body.appendChild(w);
}
