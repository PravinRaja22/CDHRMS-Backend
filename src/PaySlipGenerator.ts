import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import util from "util";
import libre from "libreoffice-convert";
import { convertCurrencyToWords } from "./utils/CurrencyToWords.js";

const execAsync = util.promisify(exec);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export module payslipService {
  export const generateFile = async (data) => {
    console.log(data, "data is");
    for (const e of data) {
      e.netPayInWords = await convertCurrencyToWords(e.netPay);
      console.log(e);
      await fileGeneration(e);
    }
  };
}

const fileGeneration = async (data) => {
  const content = await fs.readFile(
    path.resolve("src/services/Hrms/CD_paySlip.docx"),
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

  const pdfFilePath = path.resolve(
    `${data.name}_PaySlip_${data.paySlipMonth}_${data.paySlipYear}.pdf`
  );

  const docxFilePath = path.resolve(
    `${data.name}_PaySlip_${data.paySlipMonth}_${data.paySlipYear}.docx`
  );

  await fs.writeFile(docxFilePath, buf);

  await convertToPdf(docxFilePath, pdfFilePath);
};

const convertToPdf = async (docxFilePath, pdfFilePath) => {
  try {
    const libre = require("libreoffice-convert");
    libre.convertAsync = util.promisify(libre.convert);

    // const command = `soffice --headless --convert-to pdf "${docxFilePath}" --outdir ""`;
    // const { stdout, stderr } = await execAsync(command);
    // console.log('PDF Generated Successfully', stdout);
    // if (stderr) {
    //   console.error('Stderr:', stderr);
    // }
  } catch (error) {
    console.error("Error:", error);
  }
};
