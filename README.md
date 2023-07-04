# Démonstration PRISMA

## Introduction

Nous allons utiliser un ORM (Object Relational Mapping) pour gérer la base de données. Cela permet de manipuler les données comme des objets, et de ne pas avoir à écrire de requêtes SQL.

Nous allons utiliser [Prisma](https://www.prisma.io/), qui est un ORM pour NodeJS. Il permet de gérer les bases de données PostgreSQL, MySQL et SQLite.

## Database

Pour manipuler un peu nos données, nous allons utiliser MySQL. Et concernant la base de données, nous allons partir sur la création de la base de données ci dessous

![Database](./_docs/mcd.png)

## Setup & Use

### Windows users

Be sure to run these commands in a git terminal to avoid [issues with newline formats](https://en.wikipedia.org/wiki/Newline#Issues_with_different_newline_formats):

```
git config --global core.eol lf
git config --global core.autocrlf false
```

### Project Initialization

-   In VSCode, install plugins **Prettier - Code formatter** and **ESLint** and configure them
-   Clone this repo, enter it
-   If you are using `yarn` or `pnpm`, adapt the `config/cli` in `package.json`
-   Run command `npm install`
-   _NB: To launch the backend server, you'll need an environment file with database credentials. You'll find a template one in `backend/.env.sample`_

### Available Commands

-   `migrate` : Run the database migration script
-   `dev` : Starts both servers (frontend + backend) in one terminal
-   `dev-front` : Starts the React frontend server
-   `dev-back` : Starts the Express backend server
-   `lint` : Runs validation tools, and refuses unclean code (will be executed on every _commit_)
-   `fix` : Fixes linter errors (run it if `lint` growls on your code !)

## FAQ

### Tools

-   _Concurrently_ : Allows for several commands to run concurrently in the same CLI
-   _Husky_ : Allows to execute specific commands that trigger on _git_ events
-   _Vite_ : Alternative to _Create-React-App_, packaging less tools for a more fluid experience
-   _ESLint_ : "Quality of code" tool, ensures chosen rules will be enforced
-   _Prettier_ : "Quality of code" tool as well, focuses on the styleguide
-   _ Airbnb Standard_ : One of the most known "standards", even though it's not officially linked to ES/JS
-   _Nodemon_ : Allows to restart the server everytime a .js file is udated
