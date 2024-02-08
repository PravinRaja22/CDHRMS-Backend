import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";
import { convertCurrencyToWords } from "./CurrencyToWords.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
// const PizZip = require("pizzip");
// const Docxtemplater = require("docxtemplater");
// const fs = require("fs");
// const path = require("path");
// const { exec } = require("child_process");
// const util = require("util");
const execAsync = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const generatePayslipFile = async (data) => {
  console.log(data, "data is");
  for (const e of data) {
    e.netPayInWords = await convertCurrencyToWords(e.netPay);
    console.log(e);
    await fileGeneration(e);
  }
};

const fileGeneration = async (data) => {
  //   const currentEpochTimeInSeconds = Math.floor(Date.now() / 1000);
  const content = fs.readFileSync(
    path.resolve("src/CD_paySlip.docx"),
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

  const docxFilePath = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    `${data.name}_PaySlip_${data.paySlipMonth}_${data.paySlipYear}.docx`
  );

  const pdfFilePath = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    `${data.name}_PaySlip_${data.paySlipMonth}_${data.paySlipYear}.pdf`
  );

  fs.writeFileSync(docxFilePath, buf);

  await convertToPdf(docxFilePath, pdfFilePath);
};

const convertToPdf = async (docxFilePath, pdfFilePath) => {
  try {
    const pdfDirectory = path.dirname(pdfFilePath);
    const command = `soffice --headless --convert-to pdf "${docxFilePath}" --outdir "${pdfDirectory}"`;
    const { stdout, stderr } = await execAsync(command);
    console.log("PDF Generated Successfully", stdout);
    if (stderr) {
      console.error("Stderr:", stderr);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
