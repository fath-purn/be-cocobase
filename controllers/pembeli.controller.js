const prisma = require("../libs/prisma");
const { getPagination } = require("../helpers/pagination");
const { pembeliSchema } = require("../validations/validation");
const { handleErrorResponse } = require("../middlewares/handleErrorResponse");

function formatNomorHP(nomerHP) {
  const nomerHPString = nomerHP.toString();
  if (nomerHPString.startsWith("0")) {
    return "62" + nomerHPString.slice(1);
  } else if (!nomerHPString.startsWith("62")) {
    return "62" + nomerHPString;
  } else {
    return nomerHPString;
  }
}

const handleValidation = (data) => {
  const { value, error } = pembeliSchema.validate(data);
  return { value, error };
};

const toNumber = (value) => {
  return Number(value);
};

const createPembeli = async (req, res, next) => {
  try {
    const { value, error } = handleValidation(req.body);
    const id_admin = req.user.id;

    if (error) {
      return handleErrorResponse(res, error);
    }

    const pembeli = await prisma.pembeli.create({
      data: {
        id_admin,
        ...value,
        no_telp: formatNomorHP(value.no_telp),
      },
    });

    res.status(201).json({
      success: true,
      message: "Pembeli berhasil ditambahkan",
      err: null,
      data: { pembeli },
    });
  } catch (err) {
    next(err);
    handleErrorResponse(res, err);
  }
};

const getAllPembeli = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (toNumber(page) - 1) * toNumber(limit);
    const take = toNumber(limit);

    const [getPembeli, { _count }] = await Promise.all([
      prisma.pembeli.findMany({
        where: search ? {
          nama: {
            contains: search,
            mode: "insensitive",
          },
        } : {},
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.pembeli.aggregate({
        _count: { id: true },
        where: search ? {
          nama: {
            contains: search,
            mode: "insensitive",
          },
        } : {},
      }),
    ]);

    const pagination = getPagination(req, res, _count.id, page, limit, search);
    return res.status(200).json({
      success: true,
      message: "OK",
      err: null,
      data: { pagination, pembeli: getPembeli },
    });
  } catch (err) {
    next(err);
    handleErrorResponse(res, err);
  }
};

const getPembeliById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pembeli = await prisma.pembeli.findUnique({
      where: { id: toNumber(id) },
      include: {
        transaksi: true,
      },
    });

    if (!pembeli) {
      return res.status(404).json({
        success: false,
        message: "Pembeli tidak ditemukan",
        err: null,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pembeli ditemukan",
      err: null,
      data: pembeli,
    });
  } catch (err) {
    next(err);
    handleErrorResponse(res, err);
  }
};

const updatePembeli = async (req, res, next) => {
  try {
    const { value, error } = handleValidation(req.body);
    const id_admin = req.user.id;
    const { id } = req.params;

    if (error) {
      return handleErrorResponse(res, error);
    }

    const check = await prisma.pembeli.findUnique({
      where: { id: toNumber(id) },
    });

    if (!check) {
      return res.status(404).json({
        success: false,
        message: "Pembeli tidak ditemukan",
        err: null,
        data: null,
      });
    }

    const pembeli = await prisma.pembeli.update({
      where: { id: toNumber(id) },
      data: {
        id_admin,
        ...value,
        no_telp: formatNomorHP(value.no_telp),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Pembeli berhasil diperbarui",
      err: null,
      data: pembeli,
    });
  } catch (err) {
    next(err);
    handleErrorResponse(res, err);
  }
};

const deletePembeli = async (req, res, next) => {
  try {
    const { id } = req.params;

    const check = await prisma.pembeli.findUnique({
      where: { id: toNumber(id) },
    });

    if (!check) {
      return res.status(404).json({
        success: false,
        message: "Pembeli tidak ditemukan",
        err: null,
        data: null,
      });
    }

    await prisma.pembeli.delete({ where: { id: toNumber(id) }, });

    return res.status(200).json({
      success: true,
      message: "Pembeli berhasil dihapus",
      err: null,
      data: null,
    });
  } catch (err) {
    next(err);
    handleErrorResponse(res, err);
  }
};

module.exports = {
  createPembeli,
  getAllPembeli,
  updatePembeli,
  deletePembeli,
  getPembeliById,
};