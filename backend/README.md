# Prisma

## Installation

```bash
npm install -D prisma
```

Ensuite, nous allons l'initialiser avec la commande suivante :

```bash
npx prisma init
```

## Configuration

La commande ci dessus nous créer un dossier `prisma` avec un fichier `schema.prisma`. Il nous créer aussi un fichier `.env` avec les informations de connexion à la base de données.

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Nous devons modifier le fichier `.env` pour qu'il corresponde à notre base de données.

```diff
- DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
+ DATABASE_URL="mysql://user:password@localhost:3306/test_prisma"
```

Et dans le fichier `schema.prisma`, nous devons modifier le provider pour qu'il corresponde à notre base de données.

```diff

datasource db {
-  provider = "postgresql"
  url      = env("DATABASE_URL")
}

datasource db {
+  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## Générer les models

Comme je vous l'ai dis, nous allons nous basé sur le mcd suivant :

![MCD](../_docs/mcd.png)

Nous allons donc, dans un premier temps, générer les models à partir de notre base de données.

⚠️ Nous n'allons pas encore faire les relations entre les tables, nous allons le faire dans un second temps.

```prisma
// schema.prisma

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  // name String? veut dire que le champ est optionnel
  name      String?
  password  String
}

model Campus {
  id        Int      @id @default(autoincrement())
  name      String
}

model Language {
  id        Int      @id @default(autoincrement())
  name      String
}
```

Maintenant que nous avons nos models, nous allons faire nos relations.

> **Note**
>
> Version 1 (plus simple)

```prisma
// Définition du modèle User
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  name     String?
  password String
  campus   Campus   @relation(fields: [campusId], references: [id])
  campusId Int
}

// Définition du modèle Campus
model Campus {
  id        Int         @id @default(autoincrement())
  name      String
  users     User[]
  languages Language[]  @relation("CampusToLanguage")
}

// Définition du modèle Language
model Language {
  id        Int         @id @default(autoincrement())
  name      String
  campuses  Campus[]    @relation("CampusToLanguage")
}
```

> **Note**
>
> Version 2 (plus longue)

```prisma
model User {
  id Int @id @default(autoincrement())
  email String @unique
  name String?
  password String
  campus Campus @relation(fields: [campusId], references: [id])
  campusId Int
}

model Campus {
  id Int @id @default(autoincrement())
  name String
  users User[]
  languages CampusToLanguage[]
}

model Language {
  id Int @id @default(autoincrement())
  name String
  campuses CampusToLanguage[]
}

model CampusToLanguage {
  campus Campus @relation(fields: [campusId], references: [id])
  campusId Int
  language Language @relation(fields: [languageId], references: [id])
  languageId Int

  @@id([campusId, languageId])
}
```

Maintenant que nous avons nos models, nous allons générer les migrations.

```bash
npx prisma migrate dev --name init
```

Ça nous a créé un dossier `migrations` avec un dossier `20230704154109_init` (le nom du fichier est généré automatiquement) qui lui contient un fichier `migration.sql`.
