import path from "node:path";
import fs from "fs-extra";

export async function writeFile(
  filePath: string,
  content: string,
): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf-8");
}

export async function writeJson(filePath: string, data: object): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}
