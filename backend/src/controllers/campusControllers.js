const prisma = require("../services/prisma");

const get = async (req, res) => {
  try {
    const getAll = await prisma.campus.findMany();
    return res.status(200).json(getAll);
  } catch (error) {
    return res.status(500).send(error.message);
  } finally {
    await prisma.$disconnect();
  }
};

const getOne = async (req, res) => {
  try {
    const getUnique = await prisma.campus.findUnique({
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
    const create = await prisma.campus.create({
      data: {
        name: req.body.name,
      },
    });
    return res.status(201).json(create);
  } catch (error) {
    return res.status(500).send(error.message);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  get,
  getOne,
  add,
};
