const Scavengers = require("../models/Scavenger");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");

exports.homePage = (req, res, next) => {
  res.render("home");
};

const generateQRCode = async (text) => {
  try {
    const qrCode = await QRCode.toDataURL(text);
    return qrCode;
  } catch (err) {
    console.error(err);
  }
};

const generatePDF = async (qrCodeData) => {
  const doc = new PDFDocument();
  //   doc.pipe(fs.createWriteStream("qrcode.pdf"));
  doc.image(qrCodeData, 100, 100, { width: 200 });
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    fs.writeFileSync("qrcode.pdf", pdfData);
  });
  doc.end();
  return doc;
};

const createQRCodePDF = async (data) => {
  const qrCodeBuffer = await QRCode.toBuffer(data);
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream("qrcode.pdf"));
  doc.image(qrCodeBuffer, 100, 100, { width: 200, height: 200 });
  doc.end();
  return "qrcode.pdf";
};

exports.createScavenger = (req, res, next) => {
  console.log("req.body");
  console.log(req.body);

  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPassword) => {
      const scavenger_hunt = new Scavengers({
        title: req.body.title,
        location: req.body.location,
        password: hashedPassword,
        category: req.body.category,
        created_by: req.body.created_by,
      });
      return scavenger_hunt.save();
    })
    .then((result) => {
      return res
        .status(200)
        .send({ result, message: "Scavenger Hunt successfully created" });
    })
    .catch((err) => console.log(err));
};

exports.getScavenger = (req, res, next) => {
  Scavengers.findAll({
    where: {
      created_by: req.body.id,
    },
  })
    .then((result) => res.status(200).send({ success: true, data: result }))
    .catch((err) => {
      console.log(err);
      res.status(404).send({ success: false, data: [] });
    });
};

exports.getCardQRCode = async (req, res, next) => {
  // const id = req.params.id;

  // Generate QR code as a data URL
  const qrCodeDataURL = await QRCode.toDataURL(req.body.id);

  // Create a new PDF document
  const doc = new PDFDocument();

  // Set the response headers for PDF download
  res.setHeader("Content-disposition", `attachment; QRCode.pdf`);
  res.setHeader("Content-type", "application/pdf");

  // Pipe the PDF document to the response
  doc.pipe(res);

  // Add QR code image to PDF document

  doc.image(qrCodeDataURL, 100, 250, { width: 400 });
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .text(
      `QR code for ID: \n${req.body.id}\n\n\nPlease Scan a card and choose correct option to increase points!`,
      100,
      50
    );

  // Finalize PDF document
  doc.end();
};
