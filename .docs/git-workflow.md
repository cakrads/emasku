# Git Workflow

This project uses a **rebase-only** merge strategy. All PRs are merged via rebase, keeping a linear commit history on every branch.

## Branch Structure

```
master          ← production-ready, stable
redesign        ← active redesign line (feature PRs merge here)
redesign-feat   ← working branch for redesign features
feat/<name>     ← short-lived feature branches
fix/<name>      ← short-lived fix branches
```

## PR & Rebase Workflow

### 1. Create a feature branch off the target branch

```bash
git checkout redesign
git pull
git checkout -b feat/my-feature
```

### 2. Commit your work

Follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`

### 3. Open a PR → merge via **Rebase**

When the PR is merged on GitHub, select **"Rebase and merge"**. This replays your commits on top of the target branch, producing new commit SHAs with a linear history.

### 4. Sync your local branch after rebase merge

Because rebase produces new SHAs, your local branch and its remote tracking ref will diverge from the target branch. You must reset them.

```bash
# Example: your feature was merged into origin/redesign
git checkout redesign-feat
git reset --hard origin/redesign

# Force-push to sync the remote tracking branch
git push origin redesign-feat --force
```

> **Why `--force`?** After a rebase merge, the old commits on `origin/redesign-feat` are orphaned (different SHAs than `origin/redesign`). Force-pushing replaces them with the rebased history.

## What Happens Without This Fix

Without syncing after a rebase merge, the graph looks like two parallel lines:

```
* 546e973 feat: ... (origin/redesign — rebased SHA)
* 08de5f9 feat: ...
| * 0cb9aac feat: ... (origin/redesign-feat — old SHA)
| * 6748c4e feat: ...
|/
* 0135f1f ...
```

After the fix, the history is linear:

```
* 546e973 feat: ... (origin/redesign, redesign-feat)
* 08de5f9 feat: ...
* 61f3db7 feat: ...
* 0135f1f ...
```

## GitHub Automation

A GitHub Actions workflow (`.github/workflows/sync-source-branch.yml`) runs after a rebase merge PR closes. It syncs the source branch automatically so the remote tracking ref stays in line with the target branch.

## Rules

- Never use "Create a merge commit" — this breaks the linear history.
- Never use "Squash and merge" unless explicitly agreed, as it loses individual commit context.
- Always `git reset --hard <target>` + `git push --force` on the source branch after a rebase merge PR.
- Never force-push to `master` or `redesign` — only force-push working/feature branches.
