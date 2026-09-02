type TakoyakiState = "生" | "表" | "裏";

const buttons = document.querySelectorAll<HTMLButtonElement>(".takoyaki");
const memo = document.getElementById("memo") as HTMLParagraphElement;

// 状態を次に進める関数
function nextState(state: TakoyakiState): TakoyakiState {
  if (state === "生") return "表";
  if (state === "表") return "裏";
  return "裏"; // 裏はそのまま
}

// 全部裏かチェック
function isAllDone(): boolean {
  return Array.from(buttons).every(btn => btn.textContent === "裏");
}

// イベント
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const current = btn.textContent as TakoyakiState;

    if (current === "裏") return;

    const next = nextState(current);
    btn.textContent = next;

    if (isAllDone()) {
      memo.textContent = "できあがり！";
    }
  });
});
