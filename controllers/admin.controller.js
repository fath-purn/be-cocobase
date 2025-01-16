const prisma = require("../libs/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: {
        username,
      },
    });

    if (admin) {
      return res.status(409).json({
        success: false,
        message: "Bad Request!",
        err: "Username already exists!",
        data: null,
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: encryptedPassword,
      },
    });
    delete newAdmin.password;

    return res.status(201).json({
      success: true,
      message: "Created Successfully!",
      data: newAdmin,
    });
  } catch (error) {
    next(error);
  }
};

const authenticate = async (req, res) => {
  return res.status(200).json({
    status: true,
    message: "OK",
    err: null,
    data: { user: req.user },
  });
};

const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: {
        username: username,
      },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Wrong id or Password',
        data: null,
      });
    }

    const payload = {
      id: admin.id,
      username: admin.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "YOUR_SECRET_KEY", {
      expiresIn: '1d',
    });

    return res.status(200).json({
      success: true,
      message: 'Login success',
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

const dashboardAtas = async (req, res, next) => {
  try {
    // petani
    const petani = await prisma.petani.aggregate({
      _count: { id: true },
    });

    // produk
    const produk = await prisma.produk.aggregate({
      _count: { jumlah: true  },
      });

      console.log(petani, produk);
      

    // artikel

    return res.status(200).json({
      success: true,
      message: "OK",
      err: null,
      data: null,
    });
  } catch (err) {
    next(err);
    return res.status(400).json({
      success: false,
      message: "Bad Request!",
      err: err.message,
      data: null,
    });
  }
};

module.exports = {
  createAdmin,
  authenticate,
  loginAdmin,
  dashboardAtas,
};
