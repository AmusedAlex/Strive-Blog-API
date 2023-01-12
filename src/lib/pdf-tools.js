import { createReadStream } from "fs";
import { dirname, join } from "path";
import PdfPrinter from "pdfmake";
import { fileURLToPath } from "url";

export const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../api/blogPosts/blogPosts.json"
);

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
      header: {
        fontSize: 48,
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};

export const getBlogPostsJsonReadableStream = () =>
  createReadStream(blogPostsJSONPath);
