const prisma = require("../services/prisma");

const get = async (req, res) => {
  try {
    const getAll = await prisma.user.findMany();
    res.status(200).json(getAll);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await prisma.$disconnect();
  }
};

const getOne = async (req, res) => {
  try {
    const getUnique = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
      select: {
        name: true,
        campus: {
          include: {
            languages: {
              select: { language: true },
            },
          },
        },
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
    const create = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        campus: { connect: { id: req.body.campus } },
      },
      include: { campus: true },
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
