const dotenv = require("dotenv");
const path = require("path")

// Set up environment variables configuration
var nodeEnvironment = process.env.NODE_ENV || "development";

// 读取env配置
dotenv.config({
  path: [path.resolve(__dirname, `.${nodeEnvironment}.env.local`), path.resolve(__dirname, `.${nodeEnvironment}.env`)] // 配置文件路径
}).parsed // 引入 dotenv

const app = require("./app");

const PORT = process.env.PORT || 3001;

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception: ", err.message);
  console.log("Closing server now...");
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("Closing server now...");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });
});
