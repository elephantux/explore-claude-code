#!/bin/bash
# .claude/hooks/my-hook.sh
#
# PreToolUse хук, который проверяет Bash-команды перед выполнением.
# Claude отправляет JSON-контекст на stdin. Ваш скрипт читает его,
# проверяет условия и завершается с правильным кодом:
#
#   exit 0   разрешить вызов инструмента
#   exit 2   заблокировать его (stderr передаётся Claude как ошибка)
#
# Зарегистрируйте этот хук в .claude/settings.json:
#
#   {
#     "hooks": {
#       "PreToolUse": [
#         {
#           "matcher": "Bash",
#           "hooks": [
#             {
#               "type": "command",
#               "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/my-hook.sh"
#             }
#           ]
#         }
#       ]
#     }
#   }

# ── Чтение JSON-ввода из stdin ──────────────────────────────────
# Каждый хук получает JSON-объект с общими полями (session_id,
# cwd, hook_event_name) плюс поля, специфичные для события.
# Для PreToolUse на Bash ключевое поле — tool_input.command.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

# ── Проверка условий ────────────────────────────────────────────
# Этот пример блокирует деструктивные shell-команды. Замените эту
# логику на любую валидацию, нужную вашему проекту: проверки путей,
# гейты окружения, белые списки команд и т.д.

if echo "$COMMAND" | grep -q 'rm -rf'; then
  # stderr возвращается Claude как сообщение об ошибке
  echo "Заблокировано: 'rm -rf' не разрешён хуками проекта." >&2
  exit 2
fi

if echo "$COMMAND" | grep -q 'git push.*--force'; then
  echo "Заблокировано: force-push не разрешён хуками проекта." >&2
  exit 2
fi

# ── Разрешить всё остальное ───────────────────────────────────────
# Выход 0 без вывода означает "продолжить нормально". Вы также можете
# вывести JSON в stdout для более тонкого контроля:
#
#   # Автоодобрение (пропустить диалог разрешения):
#   echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}'
#
#   # Отказать с причиной, которую увидит Claude:
#   echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Причина здесь"}}'
#
#   # Спросить пользователя для подтверждения:
#   echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask"}}'
#
#   # Модифицировать ввод инструмента перед выполнением:
#   echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow","updatedInput":{"command":"safer-command"}}}'

exit 0
