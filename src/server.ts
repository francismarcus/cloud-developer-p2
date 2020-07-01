import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const url: string = req.query.image_url;

    if (!url) {
      return res
        .status(400)
        .send("Invalid request, query param image_url is missing");
    }

    try {
      const filteredImageFromURL = await filterImageFromURL(url);
      res.sendFile(filteredImageFromURL, () =>
        deleteLocalFiles([filteredImageFromURL])
      );
    } catch (error) {
      res.sendStatus(422).send(`Something went wrong: ${error}`);
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
