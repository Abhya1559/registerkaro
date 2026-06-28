import express, {} from "express";
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware to parse JSON bodies
app.use(express.json());
// Type-safe Route Handler
app.get("/", (req, res) => {
    res.json({ message: "Hello from TypeScript and Express!" });
});
// App listening
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map