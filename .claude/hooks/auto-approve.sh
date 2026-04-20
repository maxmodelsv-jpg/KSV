#!/usr/bin/env bash
# Auto-approve hook — вариант B (умеренный)
# Авто-одобряет ТОЛЬКО read-only/планирующие инструменты.
# Bash/Write/Edit — НЕ трогает, их разрешения задаются через permissions.allow.

set -u
INPUT="$(cat)"

# Извлечь значение строкового поля из JSON без jq.
NAME="$(echo "$INPUT" | grep -oE '"tool_name"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 \
  | sed -E 's/.*"tool_name"[[:space:]]*:[[:space:]]*"(.*)"/\1/')"

allow() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}

case "$NAME" in
  Read|Glob|Grep|NotebookRead|WebFetch|WebSearch|TodoWrite|ToolSearch|ScheduleWakeup|EnterPlanMode|ExitPlanMode|ListMcpResourcesTool|ReadMcpResourceTool|TaskOutput|AskUserQuestion|Monitor|TaskStop|Agent|Skill|CronList)
    allow "read-only или планирующий инструмент"
    ;;
esac

# Всё остальное — обычный permission flow.
exit 0
