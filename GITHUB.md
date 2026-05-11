# GitHub Beginner Guide

This guide is for team members who are using Git and GitHub for the first time.
It explains how to upload the project, download it, and work with the team in a simple way.

## 1. What is the difference?

`Git` is the tool that tracks code changes.

`GitHub` is the website where the team stores and shares the project.

## 2. What you need before you start

Make sure you have these:

- A GitHub account
- Git installed on your computer
- VS Code installed
- Node.js installed if you want to run the project locally

## 3. One-time Git setup

Run these commands one time on your computer:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
git config --global init.defaultBranch main
```

To check your settings:

```bash
git config --global --list
```

## 4. If you want to upload this project to GitHub for the first time

### Step 1: Create a repository on GitHub

Go to GitHub and create a new repository.

Recommended settings:

- Repository name: `devscreen`
- Visibility: `Private` or `Public` based on team needs
- Do not add a README if this project already has one
- Do not add `.gitignore` if the project already has one

### Step 2: Open the project folder in VS Code

Open the project folder:

```bash
cd devscreen
```

### Step 3: Initialize Git if needed

Run this only if the project is not already a Git repository:

```bash
git init
```

### Step 4: Add and commit the project

```bash
git add .
git commit -m "Initial project setup"
```

### Step 5: Connect the project to GitHub

Replace the URL below with your real GitHub repository URL:

```bash
git remote add origin https://github.com/your-team/devscreen.git
git branch -M main
git push -u origin main
```

After this, the project will be uploaded to GitHub.

## 5. If you want to download the project from GitHub

### Option 1: Clone with Git

This is the correct option if you want to work with the team.

```bash
git clone https://github.com/your-team/devscreen.git
cd devscreen
```

Then install the project packages:

```bash
npm install
```

Then start the project:

```bash
npm run dev
```

### Option 2: Download ZIP

This is only for reading or testing quickly.
It is not the best choice for team collaboration.

On GitHub:

1. Open the repository.
2. Click `Code`.
3. Click `Download ZIP`.

## 6. The safest daily workflow for beginners

Use this flow every time you start work.

### Step 1: Go to the project folder

```bash
cd devscreen
```

### Step 2: Get the latest version from GitHub

```bash
git checkout main
git pull origin main
```

### Step 3: Create a new branch for your work

Replace the branch name with something clear:

```bash
git checkout -b feature/login-page
```

### Step 4: Make your changes

Edit files, test the project, and make sure everything works.

### Step 5: Save your work in Git

```bash
git add .
git commit -m "Add login page improvements"
```

### Step 6: Upload your branch to GitHub

```bash
git push -u origin feature/login-page
```

### Step 7: Open a Pull Request on GitHub

After pushing your branch:

1. Open GitHub.
2. Open the repository.
3. GitHub will usually show a button like `Compare & pull request`.
4. Click it.
5. Add a short title and description.
6. Submit the Pull Request.

This lets the team review your work before merging it into `main`.

## 7. If your branch was merged and you want to start new work

```bash
git checkout main
git pull origin main
git checkout -b feature/next-task
```

## 8. Useful commands to remember

Check changed files:

```bash
git status
```

See commit history:

```bash
git log --oneline
```

See current branch:

```bash
git branch
```

See remote repository:

```bash
git remote -v
```

## 9. Common beginner mistakes

### Do not work directly on `main`

Always create a new branch for your task.

### Do not forget to pull first

Before you start new work, always run:

```bash
git checkout main
git pull origin main
```

### Do not use very large commit messages

Keep commit messages short and clear.

Good examples:

- `Add recruiter dashboard layout`
- `Create candidate interview page`
- `Fix landing page navigation`

### Do not upload secret files

Never commit passwords, API keys, or `.env` secrets.

## 10. If GitHub asks you to sign in

When you push or clone, GitHub may ask you to authenticate.
This is normal.

Common options:

- Sign in through the browser
- Use GitHub Desktop
- Use a Personal Access Token if your team uses HTTPS auth

If authentication feels confusing, ask the team lead to help you set it up once.

## 11. Simple team rules

Use these rules to avoid problems:

1. Pull the latest `main` before starting work.
2. Create a new branch for each task.
3. Commit small, clear changes.
4. Push your branch to GitHub.
5. Open a Pull Request.
6. Merge only after review.

## 12. Project setup for this repository

After cloning this project, use these commands:

```bash
cd devscreen
npm install
npm run dev
```

If you want to check code quality:

```bash
npm run lint -- src/app
```

## 13. Very short version

If you only want the basic flow, use this:

```bash
git checkout main
git pull origin main
git checkout -b feature/my-task
```

Make your changes, then:

```bash
git add .
git commit -m "Describe your change"
git push -u origin feature/my-task
```

Then open a Pull Request on GitHub.
