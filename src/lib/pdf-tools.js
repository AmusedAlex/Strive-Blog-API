import PdfPrinter from "pdfmake";

export const getPDFreadableStream = (blogsArray) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: blogsArray.map((blogPost) => {
      return [blogPost.title, blogPost.category, blogPost.price];
    }),
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
