import fs from "fs";
import path from "path";
import util from "util";
import { fileURLToPath } from "url";
import { dirname } from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import libre from "libreoffice-convert";
import { convertCurrencyToWords } from "./CurrencyToWords.js";
import { exec } from "child_process";

const execAsync = util.promisify(exec);
const libreConvertAsync = util.promisify(libre.convert);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generatePayslipFile = async (data) => {
  console.log(data, "generatePayslipFile data");
  const result = [];

  for (const e of data) {
    e.netPayInWords = await convertCurrencyToWords(e.netPay);
    console.log(e);
    let payslipData = await fileGeneration(e);
    result.push(payslipData);
  }

  return result;
};

const fileGeneration = async (data) => {
  console.log(__dirname, "directory Name");
  const content = fs.readFileSync(
    path.resolve(__dirname, "../../CD_paySlip.docx"),
    "binary"
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter() {
      return "-";
    },
  });

  await doc.render(data);

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  const timestamp = new Date().getTime();
  const pdfFileName = `${timestamp}_tesr_PaySlip_${data.paySlipMonth}_${data.paySlipYear}.pdf`;
  const docxFileName = `${timestamp}_tesr_PaySlip_${data.paySlipMonth}_${data.paySlipYear}.docx`;

  const pdfFilePath = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    pdfFileName
  );
  const docxFilePath = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    docxFileName
  );
  console.log(docxFilePath, "docxfilepath");
  fs.writeFileSync(docxFilePath, buf);

  let payslipUrl = await convertToPDF(docxFilePath);

  return {
    userName: data.name,
    payslipUrl: payslipUrl,
  };
};

const convertToPDF = async (docxFilePath) => {
  try {
    const pdfFilePath = docxFilePath.replace(/\.docx$/, ".pdf");
    const input = fs.readFileSync(docxFilePath);
    const pdfBuffer = await libreConvertAsync(input, ".pdf", undefined);
    fs.writeFileSync(pdfFilePath, pdfBuffer);
    console.log("PDF Generated Successfully");
    return pdfFilePath;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
