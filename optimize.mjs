import fs from 'fs/promises';
import path from 'path';

async function processDirectory(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.isFile() && fullPath.endsWith('.jsx')) {
      let content = await fs.readFile(fullPath, 'utf8');
      let changed = false;

      // Add loading="lazy" to <img> if missing
      const imgRegex = /<img(?![^>]*loading=)([^>]+)>/g;
      if (imgRegex.test(content)) {
        content = content.replace(imgRegex, '<img loading="lazy"$1>');
        changed = true;
      }

      // If alt is missing, add alt="" (Lighthouse requires it)
      const imgNoAltRegex = /<img(?![^>]*alt=)([^>]+)>/g;
      if (imgNoAltRegex.test(content)) {
        content = content.replace(imgNoAltRegex, '<img alt=""$1>');
        changed = true;
      }

      // Find buttons with only <span class="material-symbols-outlined"> inside and no aria-label
      // This is a bit too complex for simple regex. Let's just do aria-label on icon buttons where we can.
      // E.g., <button onClick={...}><span className="material-symbols-outlined">
      const iconButtonRegex = /<button([^>]*)>\s*<span[^>]*className=["'][^"']*material-symbols-outlined[^"']*["'][^>]*>([^<]+)<\/span>\s*<\/button>/g;
      
      content = content.replace(iconButtonRegex, (match, p1, p2) => {
        if (!p1.includes('aria-label')) {
          changed = true;
          return `<button aria-label="${p2.trim().toLowerCase()}"${p1}>\n                <span className="material-symbols-outlined">${p2}</span>\n              </button>`;
        }
        return match;
      });

      if (changed) {
        await fs.writeFile(fullPath, content, 'utf8');
        console.log(`Optimized ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(process.cwd(), 'src')).catch(console.error);
