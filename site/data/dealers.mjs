// Dealer network. Source: beta.rangsx.com /dealers (RSC payload). type: both | fleet | bike.
// ponytail: the beta's +880 1711-00000X numbers look like placeholders; flagged in progress.md.
const d = (id, name, type, phone, address, landmark, district, lat, lng, close = "20:00") =>
  ({ id, name, type, phone, address, landmark, district, lat, lng, open: "10:00", close });

export const DEALERS = [
  d("tejgaon", "RangsX Tejgaon Showroom", "both", "+880 1332-832892", "215 Bir Uttam Mir Shawkat Sarak, Tejgaon", "Beside Rangs Industries, opposite Nabisco", "Dhaka", 23.7706031, 90.4078426, "18:00"),
  d("uttara", "Rangs Motors, Uttara", "both", "+880 1711-000001", "House 12, Sector 7, Airport Road", "Near Uttara Sector 7 Bus Stand", "Dhaka", 23.8759, 90.3795),
  d("motijheel", "Rangs EV Hub, Motijheel", "fleet", "+880 1711-000002", "64 Motijheel Commercial Area", "Near Shapla Chattar", "Dhaka", 23.733, 90.419),
  d("dhanmondi", "RX Centre, Dhanmondi", "bike", "+880 1711-000003", "Road 27, Dhanmondi R/A", "Near Dhanmondi 27 Bridge", "Dhaka", 23.7461, 90.3742),
  d("savar", "Rangs EV Hub, Savar", "fleet", "+880 1711-000004", "Savar Economic Zone, Ashulia", "Near Savar EPZ Gate", "Dhaka", 23.8706, 90.2698),
  d("agrabad", "Rangs Motors, Agrabad", "both", "+880 1711-000005", "15 Agrabad Commercial Area", "Near Agrabad Access Road Signal", "Chattogram", 22.3192, 91.7855),
  d("nasirabad", "RX Centre, Nasirabad", "bike", "+880 1711-000006", "88 Nasirabad Housing Society", "Near Nasirabad Housing Society Gate", "Chattogram", 22.368, 91.818),
  d("sylhet", "Rangs Motors, Sylhet", "both", "+880 1711-000007", "Zindabazar, Sylhet City", "Near Sylhet Kean Bridge", "Sylhet", 24.8997, 91.8729),
  d("rajshahi", "Rangs EV Hub, Rajshahi", "fleet", "+880 1711-000008", "Saheb Bazar, Rajshahi City", "Near Shaheb Bazar Zero Point", "Rajshahi", 24.3745, 88.6042),
  d("khulna", "Rangs Motors, Khulna", "both", "+880 1711-000009", "KDA Avenue, Khulna City", "Near Shib Bari Mor", "Khulna", 22.8456, 89.5403),
  d("barishal", "RX Centre, Barishal", "bike", "+880 1711-000010", "Band Road, Barishal City", "Near Bibir Pukur", "Barishal", 22.701, 90.3535),
  d("mymensingh", "Rangs EV Hub, Mymensingh", "fleet", "+880 1711-000011", "SS Road, Mymensingh City", "Near Mymensingh Town Hall", "Mymensingh", 24.7471, 90.4203),
  d("rangpur", "Rangs Motors, Rangpur", "both", "+880 1711-000012", "Station Road, Rangpur City", "Near Rangpur Railway Station", "Rangpur", 25.7439, 89.2752),
];

export const DIVISIONS = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Mymensingh", "Rangpur"];
