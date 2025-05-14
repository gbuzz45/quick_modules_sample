const fs = require("fs");
const path = require("path");

const templatesDir = path.join(__dirname, "../templates");

// 模組簡語對照（可自行擴充）
const aliasMap = {
  "頁籤": "頁籤RWD轉下拉選單",
  "swiper": "swiper輪播"
};

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "help") {
  console.log(`🧰 可用指令：
  list                 列出所有可用模組
  add [模組名稱或簡語]   匯入模組到當前專案
  help                 顯示說明`);
  process.exit(0);
}

if (command === "list") {
  console.log("📦 可用模組：");
  const list = fs.readdirSync(templatesDir);
  list.forEach((mod) => console.log(" -", mod));
  process.exit(0);
}

if (command === "add") {
  const rawName = args[1];
  const modName = aliasMap[rawName] || rawName;

  const modPath = path.join(templatesDir, modName);
  if (!fs.existsSync(modPath)) {
    console.log(`❌ 找不到模組：「${rawName}」`);
    process.exit(1);
  }

  const currentProject = process.cwd();
  const files = fs.readdirSync(modPath);
  files.forEach((file) => {
    let destDir = "";
    if (file.endsWith(".html")) destDir = "components";
    else if (file.endsWith(".js")) destDir = "scripts";
    else if (file.endsWith(".css")) destDir = "styles";
    else return;

    const srcPath = path.join(modPath, file);
    const destPath = path.join(currentProject, destDir, file);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ 匯入 ${file} → ${destDir}/`);
  });

  console.log("🎉 模組匯入完成！");
  process.exit(0);
}

console.log("❓ 不支援的指令，請用 `help` 查看");
