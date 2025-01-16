const router = require("express").Router();
const { upload } = require("../libs/multer");
const verifyToken = require("../libs/verifyToken");

const {
  createProduk,
  getAllProduk,
  getProdukById,
  updateProduk,
  deleteProduk,
} = require("../controllers/produk.controller");

router.get("/", verifyToken, getAllProduk);
router.get("/:id", verifyToken, getProdukById);
router.put("/:id", upload.single("image"), verifyToken, updateProduk);
router.delete("/:id", verifyToken, deleteProduk);
router.post("/", upload.single("image"), verifyToken, createProduk);

module.exports = router;
