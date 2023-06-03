const Scavengers = require("../models/Scavenger");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const axios = require("axios");
const { Buffer } = require("buffer");

exports.homePage = (req, res, next) => {
  res.render("home");
};

// const generateQRCode = async (text) => {
//   try {
//     const qrCode = await QRCode.toDataURL(text);
//     return qrCode;
//   } catch (err) {
//     console.error(err);
//   }
// };

// const generatePDF = async (qrCodeData) => {
//   const doc = new PDFDocument();
//   //   doc.pipe(fs.createWriteStream("qrcode.pdf"));
//   doc.image(qrCodeData, 100, 100, { width: 200 });
//   const buffers = [];
//   doc.on("data", buffers.push.bind(buffers));
//   doc.on("end", () => {
//     const pdfData = Buffer.concat(buffers);
//     fs.writeFileSync("qrcode.pdf", pdfData);
//   });
//   doc.end();
//   return doc;
// };

// const createQRCodePDF = async (data) => {
//   const qrCodeBuffer = await QRCode.toBuffer(data);
//   const doc = new PDFDocument();
//   doc.pipe(fs.createWriteStream("qrcode.pdf"));
//   doc.image(qrCodeBuffer, 100, 100, { width: 200, height: 200 });
//   doc.end();
//   return "qrcode.pdf";
// };

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

async function convertImageToBase64(imageUrl) {
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  const imageData = Buffer.from(response.data, "binary");

  return imageData;
}

exports.getCardQRCode = async (req, res, next) => {
  // const id = req.params.id;
  var arr_id = req.body.id.split(",");
  // let card_data = {
  //   id: "9e80ba5b-d53f-4bec-84d6-ddc068903537",
  //   image:
  //     "http://res.cloudinary.com/dfz28acim/image/upload/v1683922947/Test_Card_5_eit3mh.jpg",
  //   points: 0,
  //   correct: "Cricket",
  //   options: ["Football", "Cricket", "Baseball"],
  //   card_title: "Name the Sports?",
  // };
  var scavenger_data;
  console.log(arr_id);
  try {
    let card_data = await Scavengers.findOne({
      where: {
        id: Number(arr_id[0]),
      },
    })
      .then((scavenger) => {
        const card_list = scavenger.category
          .map((eachCategory) => eachCategory.cards)
          .flat();
        return card_list.find((eachCard) => eachCard?.id == arr_id[1]);
      })
      .catch((err) => {
        console.log({ err });
        res.status(404).send({ success: false, data: { err } });
      });

    scavenger_data = await Scavengers.findOne({
      where: {
        id: +arr_id[0],
      },
    })
      .then((scavenger) => scavenger)
      .catch((err) => {
        console.log({ err });
        res.status(404).send({
          success: false,
          data: { err, message: "Scavenger not found" },
        });
      });

    const card_image = await convertImageToBase64(card_data.image);
    // Generate QR code as a data URL
    const qrCodeDataURL = await QRCode.toDataURL(req.body.id);

    // Create a new PDF document
    const doc = new PDFDocument({ size: "LETTER" });

    // Set the response headers for PDF download
    res.setHeader("Content-disposition", `attachment; QRCode.pdf`);
    res.setHeader("Content-type", "application/pdf");

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add QR code image to PDF document
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .text(scavenger_data.title, { align: "center", width: 400 });
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text(scavenger_data.category[0].title, { align: "center", width: 400 });

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(16).text(card_data.card_title, {
      align: "left",
      width: 200,
      marginLeft: -50,
    });

    doc.moveDown();
    doc.font("Helvetica").fontSize(16).text(`1: ${card_data.options[0]}`, {
      align: "left",
      width: 400,
    });
    doc.moveDown();
    doc
      .font("Helvetica")
      .fontSize(16)
      .text(`2: ${card_data.options[1]}`, { align: "left", width: 400 });
    doc.moveDown();
    doc
      .font("Helvetica")
      .fontSize(16)
      .text(`3: ${card_data.options[2]}`, { align: "left", width: 400 });

    const section = doc.struct("Span", { display: "flex" });
    doc.addStructure(section);
    section.add(
      doc.struct("Span", () => {
        doc
          .image(qrCodeDataURL, 260, 170, { width: 300 })
          .text(" Title of QR", 370, 170);
      })
    );
    section.add(
      doc.struct("Span", () => {
        doc.image(card_image, 60, 300, { width: 180 }).stroke();
        // .text("Image", 170, 320);
      })
    );

    // doc.image(
    //   "https://static.vecteezy.com/packs/media/vectors/term-bg-1-3d6355ab.jpg",
    //   320,
    //   15,
    //   { fit: [100, 100] }
    // );

    // doc
    //   .font("Helvetica-Bold")
    //   .fontSize(20)
    //   .text(
    //     `QR code for ID: \n${req.body.id}\n\n\nPlease Scan a card and choose correct option to increase points!`,
    //     100,
    //     50
    //   );

    // Finalize PDF document
    doc.end();
  } catch (err) {
    console.log(err);
    res.status(404).send({ success: false, data: { err } });
  }
};
