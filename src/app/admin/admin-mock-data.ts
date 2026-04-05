export interface AdminMetric {
  label: string;
  value: string;
  suffix?: string;
  today?: string;
  icon?: string;
}

export interface AdminTrendPoint {
  label: string;
  value: number;
}

export interface AdminRecentMemberRow {
  userId: string;
  name: string;
  team?: string;
  joinDate: string;
  mobile: string;
  status: string;
}

export interface AdminRecentWinnerRow {
  userId: string;
  name: string;
  group: string;
  date: string;
  prize: string;
  time: string;
}

export interface AdminSummaryBreakdown {
  label: string;
  value: string;
  percent: string;
  tone: 'gold' | 'blue' | 'muted';
}

export interface AdminRegisterRow {
  userId: string;
  name: string;
  password: string;
  sponsor: string;
  mobile: string;
}

export interface AdminClosedShareRow {
  userId: string;
  name: string;
  shareNo: string;
  roi: string;
  direct: string;
  matching: string;
}

export interface AdminGroupRow {
  id: number;
  date: string;
  groupName: string;
  planAmount: string;
  tenureMonths: number;
  totalMembers: number;
  joinedMembers: number;
  vacancy: number;
  roundCompleted: number;
  spinDate: string;
  spinTime: string;
  monthlyWindow: string;
  status: string;
}

export interface AdminMemberRow {
  id: number;
  userId: string;
  name: string;
  mobile: string;
  username: string;
  password: string;
  sponsor: string;
  packageAmount: string;
  joiningDate: string;
  team: string;
  address: string;
  city: string;
  pincode: string;
  email: string;
  status: string;
  bankName: string;
  branch: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export interface AdminPaymentRow {
  id: number;
  userId: string;
  beneficiaryName: string;
  address: string;
  bankName: string;
  branch: string;
  accountNumber: string;
  ifsc: string;
  amount: string;
}

export interface AdminCashRow {
  id: number;
  userId: string;
  userName: string;
  team: string;
  collector: string;
  receivedOn: string;
  receiptNo: string;
  amount: string;
  status: string;
}

export interface AdminWinnerRow {
  id: number;
  group: string;
  userId: string;
  name: string;
  month: string;
  prize: string;
  settlementMode: string;
  status: string;
}

export interface AdminPaymentRequestRow {
  id: number;
  userId: string;
  name: string;
  team: string;
  channel: string;
  reference: string;
  requestedOn: string;
  amount: string;
  status: string;
}

export interface AdminBankProfileRow {
  userId: string;
  name: string;
  team: string;
  bankName: string;
  branch: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  address: string;
}

export interface AdminSpinScheduleRow {
  id: number;
  team: string;
  month: string;
  round: number;
  date: string;
  time: string;
  timezone: string;
  window: string;
  status: string;
}

export interface AdminDashboardTask {
  title: string;
  detail: string;
  route: string;
  cta: string;
}

export const adminMetrics: AdminMetric[] = [
  { label: 'Total Members', value: '1,245', today: '12 today', icon: 'groups' },
  { label: 'Total Collection', value: '33,00,000 INR', today: '35,000 INR today', icon: 'payments' },
  { label: 'Total Payout', value: '5,40,000 INR', today: '0.00 INR today', icon: 'trophy' },
  { label: 'Active Groups', value: '15', suffix: 'Groups', today: 'Live portfolio', icon: 'cluster' }
];

export const adminRevenueTrend: AdminTrendPoint[] = [
  { label: 'May', value: 12 },
  { label: 'Jun', value: 18 },
  { label: 'Jul', value: 21 },
  { label: 'Aug', value: 28 },
  { label: 'Sep', value: 25 },
  { label: 'Oct', value: 39 },
  { label: 'Nov', value: 36 },
  { label: 'Dec', value: 33 },
  { label: 'Jan', value: 48 },
  { label: 'Feb', value: 44 },
  { label: 'Mar', value: 58 },
  { label: 'Apr', value: 72 }
];

export const adminMemberGrowth: AdminTrendPoint[] = [
  { label: 'May', value: 16 },
  { label: 'Jun', value: 21 },
  { label: 'Jul', value: 24 },
  { label: 'Aug', value: 31 },
  { label: 'Sep', value: 36 },
  { label: 'Oct', value: 43 },
  { label: 'Nov', value: 47 },
  { label: 'Dec', value: 55 },
  { label: 'Jan', value: 61 },
  { label: 'Feb', value: 58 },
  { label: 'Mar', value: 63 },
  { label: 'Apr', value: 74 }
];

export const adminRecentMembers: AdminRecentMemberRow[] = [
  { userId: 'USM10082', name: 'Venkaramesh', team: 'THE UNIVERSE', joinDate: '2026-04-22', mobile: '792110239', status: 'KYC pending' },
  { userId: 'USM10085', name: 'Suresh', team: 'THE UNIVERSE', joinDate: '2026-04-22', mobile: '79086036', status: 'Active' },
  { userId: 'USM10086', name: 'Prakash', team: 'THE SPARTANS', joinDate: '2026-04-22', mobile: '39285029', status: 'Bank review' },
  { userId: 'USM10087', name: 'Anil Kumar', team: 'THE RAISING STARS', joinDate: '2026-04-22', mobile: '95285026', status: 'Active' }
];

export const adminRecentWinners: AdminRecentWinnerRow[] = [
  { userId: 'USM73301', name: 'Santhosh', group: 'The Sparts', date: 'April 5, 2026', prize: '20,000 INR', time: '16:00' },
  { userId: 'USM73501', name: 'Kirubakaran R', group: 'The Universe', date: 'April 5, 2026', prize: '20,000 INR', time: '18:00' },
  { userId: 'USM72355', name: 'Karthick R', group: 'The Spartans', date: 'April 5, 2026', prize: '20,000 INR', time: '19:00' },
  { userId: 'USM25950', name: 'Akash', group: 'Clove Groups', date: 'April 5, 2026', prize: '20,000 INR', time: '12:00' }
];

export const adminGroupProgress: AdminSummaryBreakdown[] = [
  { label: 'Completed', value: '4', percent: '60%', tone: 'gold' },
  { label: 'In progress', value: '7', percent: '30%', tone: 'blue' },
  { label: 'Upcoming', value: '4', percent: '10%', tone: 'muted' }
];

export const adminRecentRegisters: AdminRegisterRow[] = [
  { userId: 'USM759095', name: 'VENKATESH', password: '123456', sponsor: 'USM100001', mobile: '8667220803' },
  { userId: 'USM966387', name: 'GOPINATH', password: '123456', sponsor: 'USM100001', mobile: '+91 80151 84522' },
  { userId: 'USM956020', name: 'SUGENESHVARAN V', password: 'sugan7481', sponsor: 'USM100001', mobile: '9988697333' },
  { userId: 'USM342185', name: 'USM100025', password: '123456', sponsor: 'USM100001', mobile: '9876543210' },
  { userId: 'USM475912', name: 'USM100024', password: '123456', sponsor: 'USM100001', mobile: '9876543210' }
];

export const adminShareClosedList: AdminClosedShareRow[] = [
  { userId: 'USM15374', name: 'Karthick R', shareNo: 'SH-001', roi: '0', direct: '0', matching: '0' },
  { userId: 'USM73355', name: 'Kirubakaran R', shareNo: 'SH-002', roi: '0', direct: '0', matching: '0' },
  { userId: 'USM71079', name: 'M Shankar', shareNo: 'SH-003', roi: '0', direct: '0', matching: '0' }
];

export const adminGroups: AdminGroupRow[] = [
  { id: 1, date: '2026-02-05', groupName: 'THE RAISING STARS', planAmount: '500000', tenureMonths: 20, totalMembers: 20, joinedMembers: 16, vacancy: 4, roundCompleted: 2, spinDate: '2026-04-25', spinTime: '11:00 AM', monthlyWindow: '25th of every month', status: 'Open' },
  { id: 2, date: '2026-03-12', groupName: 'THE UNIVERSE', planAmount: '500000', tenureMonths: 20, totalMembers: 20, joinedMembers: 20, vacancy: 0, roundCompleted: 4, spinDate: '2026-05-05', spinTime: '11:00 AM', monthlyWindow: '5th of every month', status: 'Live' },
  { id: 3, date: '2026-03-29', groupName: 'THE SPARTANS', planAmount: '500000', tenureMonths: 20, totalMembers: 20, joinedMembers: 18, vacancy: 2, roundCompleted: 1, spinDate: '2026-04-20', spinTime: '06:30 PM', monthlyWindow: '20th of every month', status: 'Filling' }
];

export const adminMembers: AdminMemberRow[] = [
  { id: 1, userId: 'USM61533', name: 'Kalaiselvi', mobile: '9043888904', username: 'USM61533', password: '5RZOAHG', sponsor: 'USM90001', packageAmount: '500000 INR', joiningDate: '2026-02-20 00:00:00', team: 'THE RAISING STARS', address: '14 Market Road', city: 'Chennai', pincode: '600042', email: 'kalaiselvi@usm.test', status: 'Active', bankName: 'Federal Bank', branch: 'Kallakurichi', accountNumber: '112245786530', ifscCode: 'FDRL0001122', upiId: 'kalaiselvi@upi' },
  { id: 2, userId: 'USM80560', name: 'Santhoshni', mobile: '7904131633', username: 'USM80560', password: '0UJZAPF', sponsor: 'USM90001', packageAmount: '500000 INR', joiningDate: '2026-02-20 00:00:00', team: 'THE RAISING STARS', address: '22 Lake View Street', city: 'Coimbatore', pincode: '641018', email: 'santhoshni@usm.test', status: 'Active', bankName: 'KVB', branch: 'Padi', accountNumber: '552344119900', ifscCode: 'KVBL0007788', upiId: 'santhoshni@okicici' },
  { id: 3, userId: 'USM58501', name: 'Karthick R', mobile: '8122705680', username: 'USM58501', password: 'NKXVG4L', sponsor: 'USM15374', packageAmount: '500000 INR', joiningDate: '2026-02-19 00:00:00', team: 'THE SPARTANS', address: '9 Temple Street', city: 'Dharmapuri', pincode: '636701', email: 'karthickr@usm.test', status: 'Address review', bankName: 'ICICI Bank', branch: 'Pennagaram', accountNumber: '542300112245', ifscCode: 'ICIC0005432', upiId: 'karthickr@oksbi' },
  { id: 4, userId: 'USM15374', name: 'Karnan V', mobile: '8122705680', username: 'USM15374', password: 'M5ULTSK', sponsor: 'USM62680', packageAmount: '500000 INR', joiningDate: '2026-02-19 00:00:00', team: 'THE SPARTANS', address: '44 Bazaar Lane', city: 'Salem', pincode: '636004', email: 'karnanv@usm.test', status: 'Active', bankName: 'Canara Bank', branch: 'Salem Town', accountNumber: '662245781233', ifscCode: 'CNRB0004567', upiId: 'karnan@upi' },
  { id: 5, userId: 'USM55557', name: 'S.venkateshkumar', mobile: '8825759083', username: 'USM55557', password: '2CEHQKG', sponsor: 'USM11352', packageAmount: '500000 INR', joiningDate: '2026-02-19 00:00:00', team: 'THE UNIVERSE', address: '5 Station Road', city: 'Madurai', pincode: '625001', email: 'venkateshkumar@usm.test', status: 'Bank review', bankName: 'Indian Bank', branch: 'Velachery', accountNumber: '152334009871', ifscCode: 'IDIB000VLC', upiId: 'venkatesh@ibl' },
  { id: 6, userId: 'USM15560', name: 'Renugadevi', mobile: '8220075609', username: 'USM15560', password: 'QIN739H', sponsor: 'USM11352', packageAmount: '500000 INR', joiningDate: '2026-02-19 00:00:00', team: 'THE UNIVERSE', address: '18 Anna Nagar', city: 'Trichy', pincode: '620018', email: 'renugadevi@usm.test', status: 'Active', bankName: 'State Bank of India', branch: 'Cantonment', accountNumber: '881245009876', ifscCode: 'SBIN0003344', upiId: 'renuga@oksbi' }
];

export const adminBankPayments: AdminPaymentRow[] = [
  { id: 1, userId: 'USM58501', beneficiaryName: 'Karthick R', address: 'Dharmapuri', bankName: 'ICICI Bank', branch: 'Pennagaram', accountNumber: '542300112245', ifsc: 'ICIC0005432', amount: '50000' },
  { id: 2, userId: 'USM73355', beneficiaryName: 'Kirubakaran R', address: 'Chennai', bankName: 'Indian Bank', branch: 'Velachery', accountNumber: '152334009871', ifsc: 'IDIB000VLC', amount: '50000' },
  { id: 3, userId: 'USM71079', beneficiaryName: 'M Shankar', address: 'Dharmapuri', bankName: 'Canara Bank', branch: 'Pennagaram', accountNumber: '991245009876', ifsc: 'CNRB0004567', amount: '50000' }
];

export const adminHandCashPayments: AdminCashRow[] = [
  { id: 1, userId: 'USM61533', userName: 'Kalaiselvi', team: 'THE RAISING STARS', collector: 'Field Officer A', receivedOn: '2026-04-02', receiptNo: 'HC-2402', amount: '25000', status: 'Received' },
  { id: 2, userId: 'USM80560', userName: 'Santhoshni', team: 'THE RAISING STARS', collector: 'Field Officer B', receivedOn: '2026-04-03', receiptNo: 'HC-2403', amount: '25000', status: 'Pending verification' },
  { id: 3, userId: 'USM58501', userName: 'Karthick R', team: 'THE SPARTANS', collector: 'Field Officer A', receivedOn: '2026-04-04', receiptNo: 'HC-2404', amount: '25000', status: 'Posted' }
];

export const adminWinners: AdminWinnerRow[] = [
  { id: 1, group: 'THE SPARTANS', userId: 'USM58501', name: 'Karthick R', month: '2026-03', prize: '20,000 INR', settlementMode: 'Bank transfer', status: 'Released' },
  { id: 2, group: 'THE UNIVERSE', userId: 'USM73355', name: 'KIRUBAKARAN R', month: '2026-04', prize: '20,000 INR', settlementMode: 'UPI', status: 'Awaiting release' }
];

export const adminPaymentRequests: AdminPaymentRequestRow[] = [
  { id: 1, userId: 'USM61533', name: 'Kalaiselvi', team: 'THE RAISING STARS', channel: 'UPI', reference: 'UPI-88219', requestedOn: '2026-04-01 10:12', amount: '25,000 INR', status: 'Matched' },
  { id: 2, userId: 'USM58501', name: 'Karthick R', team: 'THE SPARTANS', channel: 'Bank Transfer', reference: 'BNK-532119', requestedOn: '2026-04-02 15:45', amount: '25,000 INR', status: 'Pending confirmation' },
  { id: 3, userId: 'USM55557', name: 'S.venkateshkumar', team: 'THE UNIVERSE', channel: 'UPI', reference: 'UPI-99218', requestedOn: '2026-04-04 09:20', amount: '25,000 INR', status: 'Flagged' }
];

export const adminBankProfiles: AdminBankProfileRow[] = adminMembers.map((member) => ({
  userId: member.userId,
  name: member.name,
  team: member.team,
  bankName: member.bankName,
  branch: member.branch,
  accountNumber: member.accountNumber,
  ifscCode: member.ifscCode,
  upiId: member.upiId,
  address: `${member.address}, ${member.city} - ${member.pincode}`
}));

export const adminSpinSchedules: AdminSpinScheduleRow[] = [
  { id: 1, team: 'THE RAISING STARS', month: 'April 2026', round: 3, date: '2026-04-25', time: '11:00 AM', timezone: 'IST', window: 'Visible 30 mins before spin', status: 'Scheduled' },
  { id: 2, team: 'THE UNIVERSE', month: 'May 2026', round: 5, date: '2026-05-05', time: '11:00 AM', timezone: 'IST', window: 'Visible on exact start time', status: 'Scheduled' },
  { id: 3, team: 'THE SPARTANS', month: 'April 2026', round: 2, date: '2026-04-20', time: '06:30 PM', timezone: 'IST', window: 'Visible 15 mins before spin', status: 'Draft' }
];

export const adminDashboardTasks: AdminDashboardTask[] = [
  { title: 'Create a new team', detail: 'Launch a 500000 plan with 20 months tenure and 20 member capacity.', route: '/admin/groups', cta: 'Open Team Setup' },
  { title: 'Onboard and assign user', detail: 'Generate credentials, capture address details, and attach the user to an active team.', route: '/admin/register', cta: 'Open User Onboarding' },
  { title: 'Configure monthly spin window', detail: 'Publish the exact date and time when each team can access the wheel for the month.', route: '/admin/spin-schedule', cta: 'Open Spin Schedule' },
  { title: 'Review payment channels', detail: 'Match UPI, bank transfer, and hand cash collections before the next round closes.', route: '/admin/payments', cta: 'Open Payments' }
];
