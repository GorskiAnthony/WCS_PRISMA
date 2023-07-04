const prisma = require("../services/prisma");

const get = async (req, res) => {
  try {
    const getAll = await prisma.language.findMany();
    res.status(200).json(getAll);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await prisma.$disconnect();
  }
};

const getOne = async (req, res) => {
  try {
    const getUnique = await prisma.language.findUnique({
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
    const create = await prisma.language.create({
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
