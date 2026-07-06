const fs = require('fs');
let content = fs.readFileSync('src/views/ReviewWorkBenchView.tsx', 'utf-8');

content = content.replace(
  /const filteredClaims = claims\.filter\(c => \{[\s\S]*?return true; \/\/ 全部\s*\}\);/,
  `const filteredClaims = claims.filter(c => {
    if (!isInsurance) return false;
    if (claimFilter === '待审核') return c.status === '待审核';
    if (claimFilter === '已审核') return c.status === '已审核';
    if (claimFilter === '已驳回') return c.status === '已驳回';
    return true; // 全部
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());`
);

content = content.replace(
  /const filteredInpatients = inpatientApps\.filter\(c => \{[\s\S]*?return true; \/\/ 全部\s*\}\);/,
  `const filteredInpatients = inpatientApps.filter(c => {
    if (!isBeiyi) return false;
    if (inpatientFilter === '待确认') return c.status === '待确认';
    if (inpatientFilter === '已确认') return c.status === '已确认';
    if (inpatientFilter === '已驳回') return c.status === '已驳回';
    return true; // 全部
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());`
);

fs.writeFileSync('src/views/ReviewWorkBenchView.tsx', content);
