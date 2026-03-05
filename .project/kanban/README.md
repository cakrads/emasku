# Kanban Workflow

This folder manages the task lifecycle for the EmasKu project development.

## Folder Structure & Lifecycle

| Folder | Name | Description |
| :--- | :--- | :--- |
| `0 to do` | **To Do** | Tasks ready to be picked up. Human-curated and prioritized. Files named as `[0001] - XXXXX.md`. |
| `0 backlog` | **Backlog** | PRD generated tasks, not yet prioritized. Files named as `[0001] - XXXXX.md`. |
| `0.5 reject` | **Rejected** | Tasks that are deemed out of scope or redundant. |
| `1 in-progress` | **In Progress** | Tasks currently being worked on by the AI agent. |
| `1.5 in-progress-done` | **Done (AI)** | Tasks completed by the AI agent, awaiting PR or human review. |
| `2 PR` | **Pull Request** | Tasks that have a dedicated Pull Request for review. |
| `3 testing by human` | **Testing** | Tasks currently being manually verified by a human. |
| `4 task done` | **Task Done** | Successfully verified and completed tasks. |

## Development Flow

1. **Backlog Entry**: New tasks are added to `0 backlog`.
2. **Prioritization**: Human reviews backlog and moves ready tasks to `0 to do`.
3. **Execution**: AI agent picks a task from `0 to do` and moves it to `1 in-progress`.
4. **Completion**: Once implemented and verified (lint/build), AI moves the task to `1.5 in-progress-done`.
5. **Review**: Tasks move to `2 PR` when code review is initiated.
6. **Validation**: Human testing occurs in stage `3 testing by human`.
7. **Closing**: Finalized tasks are moved to `4 task done`.
