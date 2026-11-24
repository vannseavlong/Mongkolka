// `pnpm dev` for apps/web: Next dev on an inner port plus a thin proxy on PORT (default 3000) that maps real URLs
// (/<slug>, /<slug>/wishes, /templates/preview/<slug> ...) to the "_" shells, like Firebase does in production.
import http from "node:http";
import net from "node:net";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { devRewrite } from "./dev-rewrite.mjs";

const PORT = Number(process.env.PORT ?? 3000);
const INNER = PORT + 100;

// Start Next through pnpm's own `.bin/next` shim: it sets NODE_PATH so hoisted packages (tw-animate-css ...) still resolve.
const win = process.platform === "win32";
const nextBin = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "node_modules", ".bin", win ? "next.cmd" : "next");
const next = spawn(nextBin, ["dev", "-p", String(INNER)], { stdio: "inherit", shell: win, env: { ...process.env, PORT: String(INNER) } });
const stop = () => next.kill();
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
process.on("exit", stop);
next.on("exit", (code) => process.exit(code ?? 0));

const target = (url) => {
  const u = new URL(url, "http://x");
  return devRewrite(u.pathname) + u.search;
};

const server = http.createServer((req, res) => {
  const proxied = http.request({ host: "127.0.0.1", port: INNER, path: target(req.url), method: req.method, headers: req.headers }, (r) => {
    res.writeHead(r.statusCode ?? 502, r.headers);
    r.pipe(res);
  });
  proxied.on("error", () => {
    res.writeHead(502, { "content-type": "text/plain" });
    res.end("Next dev server is starting, retry in a moment.");
  });
  req.pipe(proxied);
});

// Hot-reload websocket: pass the upgrade straight through.
server.on("upgrade", (req, socket, head) => {
  const upstream = net.connect(INNER, "127.0.0.1", () => {
    upstream.write(`${req.method} ${target(req.url)} HTTP/${req.httpVersion}\r\n`);
    for (let i = 0; i < req.rawHeaders.length; i += 2) upstream.write(`${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}\r\n`);
    upstream.write("\r\n");
    if (head?.length) upstream.write(head);
    socket.pipe(upstream).pipe(socket);
  });
  upstream.on("error", () => socket.destroy());
  socket.on("error", () => upstream.destroy());
});

server.listen(PORT, () => console.log(`apps/web dev: http://localhost:${PORT} (Next on ${INNER}; real URLs map to the "_" shells)`));
