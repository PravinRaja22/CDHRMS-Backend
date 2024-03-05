import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";
import { promisify } from "util";
import libre from "libreoffice-convert";
import { convertCurrencyToWords } from "./CurrencyToWords.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { payslipService } from "../../PaySlipGenerator.js";
import { PayslipServices } from "../../services/Hrms/payslip.service.js";
// const PizZip = require("pizzip");
// const Docxtemplater = require("docxtemplater");
// const fs = require("fs");
// const path = require("path");
// const { exec } = require("child_process");
// const util = require("util");
const libreConvertAsync = promisify(libre.convert);
const execAsync = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generatePayslipFile = async (request, reply) => {
  const data = request.body || request;
  console.log(data, "data is generatePayslipFile");
  const result = [];
  for (const e of data) {
    e.netPayInWords = await convertCurrencyToWords(e.netPay);
    console.log(e);
    let payslipData = await fileGeneration(
      e,
      request.protocol,
      request.headers.host
    );
    // let fileurl =
    //   request.protocol +
    //   "://" +
    //   request.headers.host +
    //   "/" +
    //   payslipData.payslipUrl;
    // console.log(fileurl, "File Url is ");
    // payslipData.url = fileurl;
    let insertPaysloip = await PayslipServices.insertpaySlip(payslipData);
    console.log(insertPaysloip, "Data inserted ?????????");
    console.log(payslipData, " final Pay slip data ");
    result.push(payslipData);
  }
  return result;
};

export const generateBulkPayslipFile = async (request, payslipJSON) => {
  const data = payslipJSON;
  console.log(data, "data is generatePayslipFile");
  const result = [];
  try {
    for (const e of data) {
      e.netPayInWords = await convertCurrencyToWords(e.netPay);
      console.log(e);
      let payslipData = await fileGeneration(
        e,
        request.protocol,
        request.headers.host
      );

      // let fileurl =
      //   request.protocol +
      //   "://" +
      //   request.headers.host +
      //   "/" +
      //   payslipData.payslipUrl;
      // console.log(fileurl, "File Url is ");
      // payslipData.url = fileurl;
      let insertPaysloip = await PayslipServices.insertpaySlip(payslipData);
      console.log(insertPaysloip, "Data inserted ?????????");
      console.log(payslipData, " final Pay slip data ");
      result.push(payslipData);
    }
  } catch (error) {
    console.log(error.message, "generateBulkPayslipFile catch");
    return error.message;
  }
  return result;
};

const fileGeneration = async (data, protocol, host) => {
  //   const currentEpochTimeInSeconds = Math.floor(Date.now() / 1000);
  console.log(data, "fileGeneration data");
  if (Object.values(data) === null || "") {
  }
  const content = await fs.promises.readFile(
    path.resolve("src/CD_PaySlip_Chennai.docx"),
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

  await fs.promises.writeFile(docxFilePath, buf);
  let payslipUrl = await convertToPdf(docxFilePath, pdfFilePath);
  console.log(payslipUrl, "payslipUrl");
  return {
    userid: data.userId,
    filename: payslipUrl,
    payslipmonth: data.paySlipMonth,
    payslipyear: data.paySlipYear,
    payslipdata: data,
    url: protocol + "s://" + host + "/" + payslipUrl,
  };
  // await convertToPdf(docxFilePath, pdfFilePath);
};

function extractFilenameFromUrl(url) {
  const filename = path.basename(url);
  return filename;
}

const convertToPdf = async (docxFilePath, pdfFilePath) => {
  try {
    const pdfDirectory = path.dirname(pdfFilePath);
    const command = `soffice --headless --convert-to pdf "${docxFilePath}" --outdir "${pdfDirectory}"`;
    const { stdout, stderr } = await execAsync(command);
    console.log("PDF Generated Successfully", stdout);
    if (stderr) {
      console.error("Stderr:", stderr);
    }
    // const pdfFilePath = docxFilePath.replace(/\.docx$/, ".pdf");
    // const input = fs.readFileSync(docxFilePath);
    // const pdfBuffer = await libreConvertAsync(input, ".pdf", undefined);
    // fs.promises.writeFile(pdfFilePath, pdfBuffer);
    // console.log("PDF Generated Successfully");
    let extractedURL = extractFilenameFromUrl(pdfFilePath);
    console.log(extractedURL, "extractedURL");

    return extractedURL;
  } catch (error) {
    console.error("Error:", error);
  }
};
