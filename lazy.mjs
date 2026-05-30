import fs from 'fs/promises';
import path from 'path';

async function applyLazyLoading() {
  const filePath = path.join(process.cwd(), 'src', 'App.jsx');
  let content = await fs.readFile(filePath, 'utf8');

  // 1. Import Suspense
  content = content.replace(
    'import React, { useState, useEffect, useRef } from "react";',
    'import React, { useState, useEffect, useRef, Suspense } from "react";'
  );

  // 2. Replace static imports with lazy imports
  const lazyImports = [
    'About',
    'Products',
    'Contact',
    'Auth',
    'Distributor',
    'DistributorLogin',
    'ResetPassword',
    'DistributorDashboard',
    'CustomerDashboard'
  ];

  for (const component of lazyImports) {
    const importRegex = new RegExp(`import ${component} from "\\./components/${component}";\\n?`, 'g');
    content = content.replace(importRegex, '');
    content = content.replace('export default function App() {', `const ${component} = React.lazy(() => import("./components/${component}"));\nexport default function App() {`);
  }
  
  const adminImports = ['AdminLogin', 'AdminDashboard'];
  for (const component of adminImports) {
    const importRegex = new RegExp(`import ${component} from "\\./admin/${component}";\\n?`, 'g');
    content = content.replace(importRegex, '');
    content = content.replace('export default function App() {', `const ${component} = React.lazy(() => import("./admin/${component}"));\nexport default function App() {`);
  }

  // 3. Wrap <main> children in <Suspense>
  const mainOpenIndex = content.indexOf('<main>');
  const mainCloseIndex = content.lastIndexOf('</main>');

  if (mainOpenIndex !== -1 && mainCloseIndex !== -1) {
    const beforeMain = content.slice(0, mainOpenIndex + '<main>'.length);
    const mainContent = content.slice(mainOpenIndex + '<main>'.length, mainCloseIndex);
    const afterMain = content.slice(mainCloseIndex);
    
    const fallback = '<div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>';
    const wrappedContent = `\n        <Suspense fallback={${fallback}}>${mainContent}\n        </Suspense>\n      `;
    
    content = beforeMain + wrappedContent + afterMain;
  }

  await fs.writeFile(filePath, content, 'utf8');
  console.log('App.jsx updated with lazy loading');
}

applyLazyLoading().catch(console.error);
