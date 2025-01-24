const joi = require("joi");

const petaniSchema = joi.object({
  nama: joi.string().required(),
  alamat: joi.string().required(),
  no_hp: joi.string().required(),
});

const Status = {
  DIAYAK: 'DIAYAK',
  DIOVEN: 'DIOVEN',
  DISORTIR: 'DISORTIR',
  DIKEMAS: 'DIKEMAS',
  SELESAI: 'SELESAI'
};

const produksiSchema = joi.object({
  id_petani: joi.number().required(),
  produk: joi.string().required(),
  jumlah: joi.number().required(),
});

const produksiSchemaUpdate = joi.object({
  id_petani: joi.number().required(),
  produk: joi.string().required(),
  jumlah: joi.number().required(),
  status: joi
    .string()
    .valid(Status.DIAYAK, Status.DIOVEN, Status.DISORTIR, Status.DIKEMAS, Status.SELESAI)
    .required(),
});

const produksiSchemaUpdateStatus = joi.object({
  status: joi
    .string()
    .valid(Status.DIAYAK, Status.DIOVEN, Status.DISORTIR, Status.DIKEMAS, Status.SELESAI)
    .required(),
});


const produkSchema = joi.object({
  nama: joi.string().required(),
  link: joi.string().required(),
  deskripsi: joi.string().required(),
  linkGambar: joi.string(),
});

const cocoblogSchema = joi.object({
  judul: joi.string().required(),
  isi: joi.string().required(),
  linkGambar: joi.string(),
})

const pembeliSchema = joi.object({
  nama: joi.string().required(),
  alamat: joi.string().required(),
  no_telp: joi.string().required(),
})

const transaksiSchme = joi.object({
  id_pembeli: joi.number().required(),
  id_produk: joi.number().required(),
  jumlah: joi.number().required(),
  harga: joi.number().required(),
});

module.exports = {
  petaniSchema,
  produksiSchema,
  produkSchema,
  produksiSchemaUpdate,
  produksiSchemaUpdateStatus,
  cocoblogSchema,
  pembeliSchema,
  transaksiSchme,
};
