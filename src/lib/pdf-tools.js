import PdfPrinter from "pdfmake";

export const getPDFreadableStream = (blogsArray) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      { text: "This is a header", style: "header" },
      blogsArray.map((blogPost) => {
        return [blogPost.title, blogPost.category, blogPost.price];
      }),
    ],
    styles: {
      // does not work for undefinable reasons
      header: {
        fontSize: 48,
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
