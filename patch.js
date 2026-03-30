const fs = require('fs');
let content = fs.readFileSync('src/components/features/SearchForm.tsx', 'utf-8');

content = content.replace(
  '<div className="absolute top-full left-0 mt-2 z-50">',
  '<div className="absolute top-[calc(100%+8px)] left-0 z-50">'
);
content = content.replace(
  '<div className="absolute top-full left-0 mt-1 z-50">',
  '<div className="absolute top-[calc(100%+8px)] left-0 z-50">'
);

fs.writeFileSync('src/components/features/SearchForm.tsx', content);
