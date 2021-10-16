export function formatISODate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

export const teamMap = {
  1: { name: "New Jersey Devils", primaryColor: "#ce1126", secondaryColor: "#111" },
  2: { name: "New York Islanders", primaryColor: "#00529b", secondaryColor: "#F47920" },
  3: { name: "New York Rangers", primaryColor: "#0038a8", secondaryColor: "#CE1126" },
  4: { name: "Philadelphia Flyers", primaryColor: "#f74902", secondaryColor: "#000" },
  5: { name: "Pittsburgh Penguins", primaryColor: "#000", secondaryColor: "#FCB514" },
  6: { name: "Boston Bruins", primaryColor: "#111", secondaryColor: "#FCB514" },
  7: { name: "Buffalo Sabres", primaryColor: "#002654", secondaryColor: "#FCB514" },
  8: { name: "Montréal Canadiens", primaryColor: "#c51230", secondaryColor: "#192168" },
  9: { name: "Ottawa Senators", primaryColor: "#e31837", secondaryColor: "#111" },
  10: { name: "Toronto Maple Leafs", primaryColor: "#003e7e", secondaryColor: "#003E7E" },
  12: { name: "Carolina Hurricanes", primaryColor: "#b72b35", secondaryColor: "#111" },
  13: { name: "Florida Panthers", primaryColor: "#041e42", secondaryColor: "#C8102E" },
  14: { name: "Tampa Bay Lightning", primaryColor: "#002868", secondaryColor: "#000" },
  15: { name: "Washington Capitals", primaryColor: "#041e41", secondaryColor: "#CF0A2C" },
  16: { name: "Chicago Blackhawks", primaryColor: "#cf0a2c", secondaryColor: "#111" },
  17: { name: "Detroit Red Wings", primaryColor: "#ce1126", secondaryColor: "#fff" },
  18: { name: "Nashville Predators", primaryColor: "#041e42", secondaryColor: "#FFB81C" },
  19: { name: "St. Louis Blues", primaryColor: "#002f87", secondaryColor: "#FCB514" },
  20: { name: "Calgary Flames", primaryColor: "#b72b35", secondaryColor: "#F1BE48" },
  21: { name: "Colorado Avalanche", primaryColor: "#6f263d", secondaryColor: "#236192" },
  22: { name: "Edmonton Oilers", primaryColor: "#041e41", secondaryColor: "#FF4C00" },
  23: { name: "Vancouver Canucks", primaryColor: "#001f5c", secondaryColor: "#021B2C" },
  24: { name: "Anaheim Ducks", primaryColor: "#f95602", secondaryColor: "#111" },
  25: { name: "Dallas Stars", primaryColor: "#006847", secondaryColor: "#8F8F8C" },
  26: { name: "Los Angeles Kings", primaryColor: "#111111", secondaryColor: "#a2aaad" },
  28: { name: "San Jose Sharks", primaryColor: "#006d75", secondaryColor: "#EA7200" },
  29: { name: "Columbus Blue Jackets", primaryColor: "#002654", secondaryColor: "#CE1126" },
  30: { name: "Minnesota Wild", primaryColor: "#004f30", secondaryColor: "#C51230" },
  52: { name: "Winnipeg Jets", primaryColor: "#041e41", secondaryColor: "#AC162C" },
  53: { name: "Arizona Coyotes", primaryColor: "#8c2633", secondaryColor: "#E2D6B5" },
  54: { name: "Vegas Golden Knights", primaryColor: "#b4975a", secondaryColor: "#333F42" },
};

export const teamsByDivision = {
  Atlantic: [
    {
      shortName: "Boston",
      id: 6,
    },
    {
      shortName: "Buffalo",
      id: 7,
    },
    {
      shortName: "Detroit",
      id: 17,
    },
    {
      shortName: "Florida",
      id: 13,
    },
    {
      shortName: "Montréal",
      id: 8,
    },
    {
      shortName: "Ottawa",
      id: 9,
    },
    {
      shortName: "Tampa Bay",
      id: 14,
    },
    {
      shortName: "Toronto",
      id: 10,
    },
  ],
  Central: [
    {
      shortName: "Arizona",
      id: 53,
    },
    {
      shortName: "Chicago",
      id: 16,
    },
    {
      shortName: "Colorado",
      id: 21,
    },
    {
      shortName: "Dallas",
      id: 25,
    },
    {
      shortName: "Minnesota",
      id: 30,
    },
    {
      shortName: "Nashville",
      id: 18,
    },
    {
      shortName: "St Louis",
      id: 19,
    },
    {
      shortName: "Winnipeg",
      id: 52,
    },
  ],
  Metropolitan: [
    {
      shortName: "Carolina",
      id: 12,
    },
    {
      shortName: "Columbus",
      id: 29,
    },
    {
      shortName: "NY Islanders",
      id: 2,
    },
    {
      shortName: "NY Rangers",
      id: 3,
    },
    {
      shortName: "New Jersey",
      id: 1,
    },
    {
      shortName: "Philadelphia",
      id: 4,
    },
    {
      shortName: "Pittsburgh",
      id: 5,
    },
    {
      shortName: "Washington",
      id: 15,
    },
  ],
  Pacific: [
    {
      shortName: "Anaheim",
      id: 24,
    },
    {
      shortName: "Calgary",
      id: 20,
    },
    {
      shortName: "Edmonton",
      id: 22,
    },
    {
      shortName: "Los Angeles",
      id: 26,
    },
    {
      shortName: "San Jose",
      id: 28,
    },
    {
      shortName: "Seattle",
      id: 55,
    },
    {
      shortName: "Vancouver",
      id: 23,
    },
    {
      shortName: "Vegas",
      id: 54,
    },
  ],
};
