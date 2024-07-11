import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { PDFDocument, rgb } from "pdf-lib";
const certificatesDir = join(
  new URL(".", import.meta.url).pathname,
  "..",
  "uploads",
  "users_certificates"
);

if (!existsSync(certificatesDir))
  mkdirSync(certificatesDir, { recursive: true });

export default async function generateCertificate(
  userName,
  courseTitle,
  courseId
) {
  const certificateTemplatePath = new URL("template.pdf", import.meta.url);
  const certificateTemplate = readFileSync(certificateTemplatePath);
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
  const filePath = join(`${userName}_${courseId}.pdf`.trim());
  writeFileSync(certificatesDir + "/" + filePath, pdfBytes);

  return filePath;
}
