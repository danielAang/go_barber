import app from "./app";

app.listen(3333);

/* const gracefulShutdown = async error => {
  if (error) console.log(error);
  process.kill(process.pid, "SIGUSR2");
  process.exit(error ? 1 : 0);
};

process.once("SIGUSR2", gracefulShutdown);
process.once("SIGHUP", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("uncaughtException", gracefulShutdown);
 */
