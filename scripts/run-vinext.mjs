import { spawnSync } from "node:child_process";

// Vinext의 Windows 네이티브 빌드는 현재 프로젝트가 고정한 Node 22에서 실행한다.
// 상위 Node 버전에서 명령이 조용히 중단되어 오래된 dist가 재사용되는 일을 막는다.
const args = ["-y", "node@22", "./node_modules/vinext/dist/cli.js", ...process.argv.slice(2)];
const env = {
  ...process.env,
  WRANGLER_LOG_PATH: process.env.WRANGLER_LOG_PATH ?? ".wrangler/wrangler.log",
};

const runningOnNode22 = Number(process.versions.node.split(".")[0]) === 22;

const result =
  runningOnNode22
    ? spawnSync(process.execPath, ["./node_modules/vinext/dist/cli.js", ...process.argv.slice(2)], {
        stdio: "inherit",
        env,
      })
    : process.platform === "win32"
    ? spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", `npx ${args.join(" ")}`], {
        stdio: "inherit",
        env,
      })
    : spawnSync("npx", args, {
        stdio: "inherit",
        env,
      });

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
