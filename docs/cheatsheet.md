# 🍵 OchaCoder Cheatsheet – Fastify + Qwik Project Setup

This is your friendly helper guide when pushing, renaming, or deploying your project 🌱⚙️

## 1. Renaming Your Project Folder

If your project folder was named `showcase001`, you can rename it to match your GitHub repo:

```bash
pwd
# /Users/you/Documents/dev/showcase001

cd ..
mv showcase001 ocha-auth
cd ocha-auth
```

## 2. Git Push Flow (With Explanation)

Run these commands **inside the `project-name/` project folder**, not one level above!

```bash
cd /Users/ocha/Projects/UserName/ocha-auth
# Go into your project root where README.md, backend/, and frontend/ live

git init
# Initialize a local Git repository in this folder

git remote add origin git@github.com:GitHubName/ocha-auth.git
# Connect your local project to the GitHub remote

git add .
# Stage all files (ignores anything in .gitignore)

git commit -m "Initial commit 🌱"
# Create your first commit — this also creates the main branch

git branch
# Optional: Check what your branch is named (usually 'main' or 'master')

git push -u origin main
# Push your code to GitHub (replace 'main' with 'master' if needed)


```

## 3. If You Accidentally Initialized Git in the Wrong Folder

```bash

cd ..
rm -rf .git
# Delete the .git folder to reset Git tracking (safe – does NOT delete your code!)

```

Then go into the correct folder and restart the Git flow from there.

## 4. Helpful git commands

```bash
git status             # See what’s staged or modified
git remote -v          # Show your GitHub remote URL
git log --oneline      # Quick view of commit history
git rm -r --cached .   # Unstage all files (if you want to reset)
```

## 5. .env Safety Rules - Create a unified .gitignore at the root of your project:

```ini
# Env & Secrets
.env
.env.*
*.local

# Node
node_modules/
*.log

# Build
dist/
lib/
lib-types/
server/
.cache/
.mf/
.rollup.cache
*.tsbuildinfo

# Editor / System
.vscode/
.idea/
.DS_Store

# Backend
/backend/node_modules/
/backend/dist/
/backend/.tsbuildinfo

# Frontend
/frontend/dist/
/frontend/.cache/
/frontend/.rollup.cache

```

## 6. Recommended Project Structure

```bash
ocha-auth/
├── backend/
├── frontend/
├── docs/
│ └── cheatsheet.md ← (You are here💡)
├── .gitignore
├── README.md
```

## 7. After Successful Push

Check your repo at:

👉 https://github.com/OchaCoder/ocha-auth

You should now see your whole project live and clean.
