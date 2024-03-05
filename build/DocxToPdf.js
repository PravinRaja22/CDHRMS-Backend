import { load } from "@pspdfkit/nodejs";
import fs from "fs";
export async function convertToPDF(docxFilePath) {
    try {
        const docxContent = fs.readFileSync(docxFilePath);
        const instance = await load({
            document: docxContent,
        });
        const buffer = await instance.exportPDF();
        fs.writeFileSync("converted.pdf", Buffer.from(buffer));
        await instance.close();
    }
    catch (error) {
        console.error("Error converting to PDF:", error);
    }
}
//# sourceMappingURL=DocxToPdf.js.map