const fs = require('fs');
const files = [
  'src/store.tsx',
  'src/views/MyRecordsView.tsx',
  'src/views/ClaimApplyView.tsx',
  'src/views/InpatientApplyView.tsx',
  'src/views/ReviewWorkBenchView.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/\\s*applyType: '[^']+',/g, '');
  content = content.replace(/\\s*applyType,/g, '');
  content = content.replace(/\\s*const \\[applyType.*\\];/g, '');
  
  // Clean up InpatientApplyView applyType logic
  if (file.includes('InpatientApplyView') || file.includes('ClaimApplyView')) {
     content = content.replace(/<div className="flex bg-slate-50 p-1 rounded-xl">[\\s\\S]*?<\\/div>/, '');
  }

  content = content.replace(/patientIdCardImage:\\s*\\[(.*?),(.*?)\\]/g, 'patientIdCardFront: $1, patientIdCardBack: $2');
  
  // Replace patientIdCardImage in MyRecordsView and ReviewWorkBenchView
  content = content.replace(/patientIdCardImage \\|\\| \\[\\]/g, 'patientIdCardFront ? [selectedClaim.patientIdCardFront, selectedClaim.patientIdCardBack].filter(Boolean) : []');
  
  fs.writeFileSync(file, content);
});
