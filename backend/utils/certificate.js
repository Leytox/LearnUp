const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const certificatesDir = path.join(
  __dirname,
  "..",
  "uploads",
  "users_certificates",
);

if (!fs.existsSync(certificatesDir))
  fs.mkdirSync(certificatesDir, { recursive: true });

module.exports = async function generateCertificate(
  userName,
  courseTitle,
  courseId,
) {
  const certificateTemplatePath = path.join(__dirname, "template.pdf");
  const certificateTemplate = fs.readFileSync(certificateTemplatePath);
  const pdfDoc = await PDFDocument.load(certificateTemplate);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const fontSize = 30;
  const textColor = rgb(0, 0, 0);
  firstPage.drawText(`This approves that`, {
    x: 340,
    y: 400,
    size: fontSize - 10,
    color: textColor,
    font: await pdfDoc.embedFont("Helvetica"),
  });

  firstPage.drawText(userName, {
    x: 360,
    y: 350,
    size: fontSize,
    color: textColor,
    font: await pdfDoc.embedFont("Helvetica"),
  });

  firstPage.drawText(`has successfully completed the course`, {
    x: 250,
    y: 300,
    size: fontSize - 10,
    color: textColor,
    font: await pdfDoc.embedFont("Helvetica"),
  });

  firstPage.drawText(courseTitle, {
    x: 255,
    y: 250,
    size: fontSize,
    color: textColor,
    font: await pdfDoc.embedFont("Helvetica"),
  });

  firstPage.drawText(`${new Date().toLocaleDateString()}`, {
    x: 240,
    y: 160,
    size: fontSize - 10,
    color: textColor,
    font: await pdfDoc.embedFont("Helvetica"),
  });

  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(`${userName}_${courseId}.pdf`.trim());
  fs.writeFileSync(certificatesDir + "/" + filePath, pdfBytes);

  return filePath;
};
