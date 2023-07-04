const { PrismaClient } = require("@prisma/client");

const options = {
  log: ["query", "info", "warn"],
  errorFormat: "pretty",
};

const prisma = new PrismaClient(options);

module.exports = prisma;
