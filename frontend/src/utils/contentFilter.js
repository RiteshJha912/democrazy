/**
 * Content moderation filter for a decentralized polling platform.
 * This list is used to prevent abusive, hateful, or explicit poll titles/questions.
 * It is NOT an endorsement of any of these terms.
 */

const BAD_WORDS = [
  "badword", "offensive", "nsfw", "curse", "ugly", "stupid", "idiot", 
  "scam", "ponzi", "rugpull", "fake",
  // Common abuses and insults
  "asshole", "bastard", "bitch", "cunt", "dick", "douchebag", "faggot", "fuck", "fucker", "motherfucker",
  "prick", "pussy", "shit", "shithead", "twat", "wanker", "whore", "slut", "retard", "moron",
  "dumbass", "fatass", "loser", "nigger", "kike", "spic", "chink", "gook", "cracker", "hillbilly",
  "redneck", "trash", "scumbag", "dickhead", "asswipe", "cocksucker", "jerkoff", "pissoff",
  "bollocks", "bugger", "tosser", "knobhead", "wankstain", "bellend", "shitbag", "fuckwit",
  "dickwad", "assclown", "dipshit", "numbskull", "blockhead", "imbecile", "cretin", "fool",
  "nitwit", "dolt", "simpleton", "dunce", "oaf", "lout", "boor", "churl", "yokel",
  // Famous NSFW words and sexual terms
  "porn", "sex", "orgasm", "blowjob", "handjob", "rimjob", "anal", "vagina", "penis", "cock",
  "tits", "boobs", "ass", "butt", "fisting", "bdsm", "bondage", "domination", "submission",
  "masturbate", "jerkoff", "wank", "cum", "jizz", "semen", "ejaculate", "squirt", "piss",
  "golden shower", "scat", "feces", "shitplay", "bestiality", "zoophilia", "necrophilia",
  "pedophilia", "incest", "rape", "molest", "harass", "grope", "fondle", "perv", "creep",
  "voyeur", "exhibitionist", "flasher", "upskirt", "downblouse", "nude", "naked", "strip",
  "lapdance", "pole dance", "escort", "prostitute", "hooker", "pimp", "brothel", "orgy",
  "threesome", "gangbang", "bukkake", "creampie", "deepthroat", "facefuck", "titfuck",
  "footjob", "milf", "dilf", "cougar", "twink", "bear", "otter", "femboy", "trap",
  // Additional restricted words: hate speech, threats, illegal activities
  "kill", "murder", "assassinate", "bomb", "explode", "terrorist", "jihad", "nazi", "hitler",
  "holocaust", "genocide", "racist", "xenophobe", "homophobe", "transphobe", "sexist", "misogynist",
  "fascist", "communist", "anarchist", "riot", "loot", "arson", "vandalize", "hack", "phish",
  "spam", "virus", "malware", "dox", "swat", "harassment", "stalk", "threaten", "intimidate",
  "extort", "blackmail", "fraud", "steal", "rob", "burgle", "embezzle", "launder", "counterfeit",
  "drug", "heroin", "cocaine", "meth", "ecstasy", "lsd", "weed", // Note: "weed" might be context-dependent, but included for restriction
  // Hindi abuses and insults (common Romanized forms + variations for better filtering)
  "madarchod", "madarchood", "maderchod", "mc", "bc", "behenchod", "bhenchod", "behanchod", "bhenchood",
  "chutiya", "chutiye", "chutiyapa", "chootiya", "bhosdike", "bhosdika", "bhosdi", "bhosda", "bhosdawale",
  "randi", "raand", "randi", "kutiya", "kuttiya", "kutta", "kutte", "gaandu", "ganduu", "gandu", "lund",
  "lauda", "lavda", "lavde", "chut", "choot", "bhosada", "haramkhor", "harami", "sala", "saala", "suar",
  "ullu", "ulluka", "patha", "pattha", "bakchod", "bakchodi", "gand", "gaand", "hijra", "hijda", "chodu"
  // You can continue expanding this list based on specific needs or regional sensitivities.
];

export const containsBadWords = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  // Check for exact word matches or robust substring matching if preferred.
  // For a basic filter, checking if the bad word exists as a substring or distinct word is validated.
  // Using word boundary \b to avoid false positives (e.g., "scunthorpe") is better.
  
  return BAD_WORDS.some(word => {
    // Escape special regex characters if any (not needed for simple alphanumeric list above)
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
};