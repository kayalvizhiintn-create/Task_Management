const fs = require('fs');
const path = require('path');

const mastersPath = path.join(__dirname, 'src/pages/Masters.jsx');
let content = fs.readFileSync(mastersPath, 'utf8');

// Replace all hardcoded axios calls with apiClient
content = content.replace(/axios\.get\([\'\"]http:\/\/192\.23\.2\.19:1012(\/api\/[\w\-\/]+)[\'\"]/g, 'apiClient.get(\'$1\'');
content = content.replace(/axios\.post\([\'\"]http:\/\/192\.23\.2\.19:1012(\/api\/[\w\-\/]+)[\'\"]/g, 'apiClient.post(\'$1\'');
content = content.replace(/axios\.put\([\'\"]http:\/\/192\.23\.2\.19:1012(\/api\/[\w\-\/]+)[\'\"]/g, 'apiClient.put(\'$1\'');
content = content.replace(/axios\.delete\([\'\"]http:\/\/192\.23\.2\.19:1012(\/api\/[\w\-\/]+)[\'\"]/g, 'apiClient.delete(\'$1\'');

// Template string replacements
content = content.replace(/axios\.(get|post|put|delete)\(\`http:\/\/192\.23\.2\.19:1012(\/api\/[\w\-\/]+)\/([^`]*)\`/g, 'apiClient.$1(\`$2/$3\`');
content = content.replace(/axios\.(get|post|put|delete)\(\`http:\/\/192\.23\.2\.19:1012(\/api\/[\w\-\/]+)\`/g, 'apiClient.$1(\`$2\`');

// Make sure apiClient is imported
if (!content.includes('import apiClient')) {
  content = 'import apiClient from \'../services/apiClient\';\n' + content;
}

fs.writeFileSync(mastersPath, content);
console.log('Fixed Masters.jsx');
