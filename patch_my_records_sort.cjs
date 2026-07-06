const fs = require('fs');
let content = fs.readFileSync('src/views/MyRecordsView.tsx', 'utf-8');

content = content.replace(
  /const userClaims = claims\.filter\(c => \{[\s\S]*?return true;\s*\}\);/,
  `const userClaims = claims.filter(c => {
    if (c.userId !== user?.id) return false;
    if (claimFilter === '待审核') return c.status === '待审核';
    if (claimFilter === '已审核') return c.status === '已审核';
    if (claimFilter === '已撤销') return c.status === '已撤销';
    if (claimFilter === '已驳回') return c.status === '已驳回';
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());`
);

content = content.replace(
  /const userInpatients = inpatientApps\.filter\(c => \{[\s\S]*?return true;\s*\}\);/,
  `const userInpatients = inpatientApps.filter(c => {
    if (c.userId !== user?.id) return false;
    if (inpatientFilter === '待确认') return c.status === '待确认';
    if (inpatientFilter === '已确认') return c.status === '已确认';
    if (inpatientFilter === '已撤销') return c.status === '已撤销';
    if (inpatientFilter === '已驳回') return c.status === '已驳回';
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());`
);

fs.writeFileSync('src/views/MyRecordsView.tsx', content);
