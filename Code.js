// Entry Point
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('ShiftCare AI')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Helper to include HTML files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/* -------------------------------------------------------------------------- */
/*  API Functions (Mock)                                                      */
/* -------------------------------------------------------------------------- */

function getStaffList() {
  return [
    { id: 'U001', name: '佐藤 健一', group: ['1'], unit: 'さくら', role: 'リーダー', isQualified: true, employmentType: '常勤', isAdmin: true, password: 'admin' },
    { id: 'U002', name: '鈴木 花子', group: ['1'], unit: 'さくら', role: '職員', isQualified: true, employmentType: '常勤', isAdmin: false, password: 'user' },
    { id: 'U003', name: '田中 次郎', group: ['1'], unit: 'さくら', role: '職員', isQualified: false, employmentType: '常勤', isAdmin: false },
    { id: 'U004', name: '高橋 優子', group: ['1'], unit: 'さくら', role: 'パート', isQualified: false, employmentType: 'パート', isAdmin: false },
    { id: 'U005', name: '伊藤 翔太', group: ['1'], unit: 'さくら', role: '派遣', isQualified: true, employmentType: '派遣', isAdmin: false },
    { id: 'U006', name: '渡辺 さゆり', group: ['1'], unit: 'さくら', role: '職員', isQualified: true, employmentType: '常勤', isAdmin: false },
  ];
}

function getEvents() {
  return [
    { id: 'E001', date: '2023-11-15', title: '避難訓練', group: ['1'], description: '14:00から実施' },
    { id: 'E002', date: '2023-11-20', title: '誕生日会', group: ['1'], description: '入居者様の誕生日会' },
  ];
}

function saveShiftRequests(requests) {
  Logger.log('Saving requests: ' + JSON.stringify(requests));
  return { success: true };
}

function saveEvents(events) {
  Logger.log('Saving events: ' + JSON.stringify(events));
  return { success: true };
}

function saveStaffList(staffList) {
  Logger.log('Saving staff list: ' + JSON.stringify(staffList));
  return { success: true };
}