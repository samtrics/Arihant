import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add CryptoJS import
if (!content.includes("import CryptoJS")) {
  content = content.replace('import { supabase } from "./supabaseClient";', 'import { supabase } from "./supabaseClient";\nimport CryptoJS from "crypto-js";\n\nconst SECRET_KEY = "arihant_secure_key_2026";\n\nconst saveEncryptedSession = (key, data) => {\n  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();\n  localStorage.setItem(key, ciphertext);\n};\n\nconst getDecryptedSession = (key) => {\n  const ciphertext = localStorage.getItem(key);\n  if (!ciphertext) return null;\n  try {\n    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);\n    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));\n    return decryptedData;\n  } catch (e) {\n    return null;\n  }\n};\n');
}

// 2. Replace JSON.parse(saved) with getDecryptedSession logic
// Where saved = localStorage.getItem(...)
content = content.replace(/const saved = localStorage\.getItem\('([^']+)'\);\n\s*if \(saved\) \{\n\s*try \{\n\s*const sessionData = JSON\.parse\(saved\);/g, 
  "const sessionData = getDecryptedSession('$1');\n    if (sessionData) {\n      try {");

// Wait, the regex might not perfectly match.
// Instead of complex regex, let's just do exact string replacements for the known patterns.

content = content.replace(/localStorage\.setItem\('adminSession', JSON\.stringify\(sessionData\)\)/g, "saveEncryptedSession('adminSession', sessionData)");
content = content.replace(/localStorage\.setItem\('distributorSession', JSON\.stringify\(sessionData\)\)/g, "saveEncryptedSession('distributorSession', sessionData)");

// For the getters, we can just replace the block.
// "const saved = localStorage.getItem('adminSession');"
// "if (saved) {"
// "try {"
// "const sessionData = JSON.parse(saved);"
// Change to:
// "const sessionData = getDecryptedSession('adminSession');"
// "if (sessionData) {"
// "try {"

content = content.replace(/const saved = localStorage\.getItem\('adminSession'\);\n\s*if \(saved\) \{\n\s*try \{\n\s*const sessionData = JSON\.parse\(saved\);/g, "const sessionData = getDecryptedSession('adminSession');\n    if (sessionData) {\n      try {");

content = content.replace(/const saved = localStorage\.getItem\('distributorSession'\);\n\s*if \(saved\) \{\n\s*try \{\n\s*const sessionData = JSON\.parse\(saved\);/g, "const sessionData = getDecryptedSession('distributorSession');\n    if (sessionData) {\n      try {");

// There's a catch block that does: `return JSON.parse(saved);`
content = content.replace(/return JSON\.parse\(saved\);/g, "return sessionData;");

fs.writeFileSync('src/App.jsx', content);
console.log("Updated App.jsx successfully!");
