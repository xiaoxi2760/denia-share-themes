import { asset, icon, intro } from "./core.js";

// Entries paraphrase Lily's three keepsakes and her voice line about a scent for the Rover.
const leaves = [
  { id: "summer", title: "第一瓶香水", section: "随身物品", detail: "柠檬与柑橘", art: "scent-flask.webp",
    body: "莉莉第一次成功调出的香水，装着她记忆里的夏天。她挑了柠檬和柑橘，希望即使窗外下着暴雨，推开房门的人也能闻到阳光。", source: "角色档案 · 第一瓶香水" },
  { id: "sea", title: "给漂泊者的香", section: "角色语音", detail: "海洋木质调 · 白麝香", art: "black-atelier.webp",
    body: "替漂泊者挑香时，莉莉想到海风和浪潮。水汽的清新、木质的沉稳，让她想起那个独自行路的人。最后一点白麝香，是留给那颗仍愿意为他人挺身而出的心。", source: "角色语音 · 为漂泊者挑选香水" },
  { id: "journal", title: "调香手记", section: "随身物品", detail: "从香方到工作日志", art: "white-atelier.webp",
    body: "这本手记原先就摊在莉莉的调香台上。战争爆发以后，她在里面写下与战士们相处的日子。记香方的册子，后来也留住了新联邦的一段历史。", source: "角色档案 · 调香手记" },
  { id: "tokens", title: "活过的证明", section: "随身物品", detail: "被托付的铭牌", art: "chapter-garden.webp",
    body: "联邦城的战士有一个约定。最后活下来的人，要带走并保管大家的身份铭牌。莉莉把一枚枚铭牌串在一起，答应带他们回家，也一直记着这件事。", source: "角色档案 ·「活过的证明」" },
];

export function notebook() {
  const key = new URLSearchParams(location.hash.split("?")[1]).get("leaf");
  const entry = leaves.find(item => item.id === key) || leaves[0];
  return intro("PERFUMER’S JOURNAL", "调香手记", "从第一瓶夏日的香，到她一直带在身边的铭牌。") + `
    <section class="open-journal">
      <nav class="journal-index" aria-label="手记篇目">
        <h2>篇目</h2>
        ${leaves.map(item => `<a href="#/notebook?leaf=${item.id}" ${item === entry ? 'aria-current="page"' : ""}>
          <span>${item.title}</span><small>${item.detail}</small></a>`).join("")}
      </nav>
      <article class="journal-page" aria-labelledby="leaf-heading">
        <img class="journal-illustration illustration-${entry.id}" src="${asset(entry.art)}" alt="">
        <div class="journal-text"><small>${entry.section}</small><h2 id="leaf-heading">${entry.title}</h2>
          <p>${entry.body}</p><footer>${icon("book")} ${entry.source}</footer>
        </div>
      </article>
    </section>`;
}
