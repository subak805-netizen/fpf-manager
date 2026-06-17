#!/usr/bin/env bash
# 안전 푸시 — 여러 채팅방/기기가 동시에 작업할 때 충돌 방지.
# 다른 방이 먼저 push했으면(거부되면) 자동으로 받아서(pull --rebase) 합친 뒤 다시 push 한다.
# 사용법: 먼저 git commit 한 다음  ./safe-push.sh   (재시도 횟수 바꾸려면 ./safe-push.sh 20)
set -u
cd "$(dirname "$0")" || exit 1

# 커밋 안 된 변경이 있으면 중단 (rebase 꼬임 방지)
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "⚠️  커밋 안 된 변경이 있어요. 먼저  git add -A && git commit  하세요."
  exit 1
fi

N=${1:-12}   # 최대 재시도 횟수
for i in $(seq 1 "$N"); do
  if git push origin main 2>/tmp/safepush.err; then
    echo "✅ push 성공 (시도 ${i}회)"
    exit 0
  fi
  if grep -qiE "non-fast-forward|fetch first|rejected|behind" /tmp/safepush.err; then
    echo "⏳ 다른 방이 먼저 올렸어요 → 받아서 합치고 재시도 (${i}/${N})"
    if ! git pull --rebase origin main 2>/tmp/safepull.err; then
      echo "❌ 자동 병합 충돌 — 같은 부분을 동시에 고쳤어요. 수동 확인 필요."
      cat /tmp/safepull.err
      git rebase --abort 2>/dev/null
      exit 2
    fi
    sleep 3   # 다른 방 push 마무리될 짧은 여유
  else
    echo "❌ push 실패 (다른 원인):"
    cat /tmp/safepush.err
    exit 3
  fi
done

echo "❌ ${N}회 시도해도 push 실패 — 다른 방이 계속 올리는 중일 수 있어요. 잠시 후 다시 시도하세요."
exit 4
