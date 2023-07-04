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

A ce stade, nous avons donc nos models et nos migrations. Si on regarde dans notre base de données, nous avons bien notre database de créé ainsi que nos tables.

## Installation de prisma client

```bash
npm install @prisma/client
```

Le client prisma va nous permettre de faire des requêtes à notre base de données.

## Nos premières requêtes

Pour ma part, j'ai l'habitude de créer dans mon dossier `service` un fichier `prisma.js` qui possèdera mon client prisma.

```js
// ./services/prisma.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
```

Pouquoi le mettre ici ? Nous avons la possibilitée d'ajouter des options à notre client prisma. Par exemple, nous pouvons ajouter un `log` pour voir les requêtes qui sont faites à notre base de données.

```js
// ./services/prisma.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
  errorFormat: "pretty",
});

module.exports = prisma;
```

Et je souhaite que toutes mes requêtes passent par ce fichier. C'est pour ça que je le créer ici.

### Création d'un campus

Nous n'allons pas faire le CRUD complet, mais 2/3 requêtes pour voir comment ça fonctionne.

```js
const prisma = require("../services/prisma");

const get = async (req, res) => {
  try {
    // Ici, nous allons chercher tous les campus avec la méthode findMany
    const getAll = await prisma.campus.findMany();
    // Nous retournons le résultat
    res.status(200).json(getAll);
  } catch (error) {
    // Si nous avons une erreur, nous la retournons
    res.status(500).send(error.message);
  } finally {
    // Et nous nous déconnectons de la base de données
    await prisma.$disconnect();
  }
};

const getOne = async (req, res) => {
  try {
    // Ici, nous allons chercher un campus avec la méthode findUnique
    const getUnique = await prisma.campus.findUnique({
      // Nous lui passons un objet avec les paramètres de la requête
      where: {
        id: parseInt(req.params.id, 10),
      },
    });
    res.status(200).json(getUnique);
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    await prisma.$disconnect();
  }
};

const add = async (req, res) => {
  try {
    // Ici, nous allons créer un campus avec la méthode create
    const create = await prisma.campus.create({
      // data: est un objet avec les données à ajouter
      data: {
        name: req.body.name,
      },
    });
    res.status(201).json(create);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  get,
  getOne,
  add,
};
```

Et le `router.js`

```js
const campusControllers = require("./controllers/campusControllers");

router.get("/campuses", campusControllers.get);
router.get("/campuses/:id", campusControllers.getOne);
router.post("/campuses", campusControllers.add);
```

### Création d'un language

Nous allons avoir le même principe que pour le campus.

Je n'ai cas changer le nom de la table et le nom de la route.

```diff
méthode getAll

-   const getAll = await prisma.campus.findMany();
+   const getAll = await prisma.language.findMany();

méthode getOne

-   const getUnique = await prisma.campus.findUnique({});
+   const getUnique = await prisma.language.findUnique({});

méthode add

-   const create = await prisma.campus.create({});
+   const create = await prisma.language.create({});
```

Et le `router.js`

```js
const languageControllers = require("./controllers/languageControllers");

router.get("/languages", languageControllers.get);
router.get("/languages/:id", languageControllers.getOne);
router.post("/languages", languageControllers.add);
```

### Création d'un user

Pour le user, nous allons avoir un peu plus de travail.
Mais nous allons quand même partir des fichiers précédents.

La différence, se fera au niveau de les méthodes `getOne` & `add`.

```js
// ./controllers/userControllers.js

const getOne = async (req, res) => {
  try {
    const getUnique = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
      select: {
        name: true,
        // Ici, nous allons chercher le campus de l'utilisateur
        // Ainsi que les languages qu'il parle
        campus: { include: { languages: true } },
      },
    });
    return res.status(200).json(getUnique);
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    await prisma.$disconnect();
  }
};

const add = async (req, res) => {
  try {
    const create = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        // Ici, nous allons créer un user avec un campus
        // Nous allons le connecter avec la méthode connect
        // Et nous lui passons l'id du campus que nous avons dans la requête
        campus: { connect: { id: req.body.campus } },
      },
      include: { campus: true },
    });
    return res.status(201).json(create);
  } catch (error) {
    return res.status(500).send(error.message);
  } finally {
    await prisma.$disconnect();
  }
};
```
