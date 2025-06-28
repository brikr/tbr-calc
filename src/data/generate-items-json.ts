import { Buff, Item, Stat, STAT_NAMES, StatModifier } from "@/types/item";
import { parse } from "@fast-csv/parse";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import itemOverrides from "./item_overrides.json";

type ItemMap = { [key: string]: Item };
interface TbrCsvRow {
  name: string;
  path: string;
  level: string;
  rarity: string;
  tooltip: string;
  restriction: string;
  acquisition: string;
}

const CSV_PATH =
  "https://raw.githubusercontent.com/TheBlackRoad-RPG/TheBlackRoad-RPG.github.io/refs/heads/master/data/item_data.csv";

async function main() {
  // Download official TBR CSV
  const response = await fetch(CSV_PATH);
  const csv = await response.text();

  // Parse official tooltips
  const items: ItemMap = {};
  await new Promise((resolve) => {
    const stream = parse({ headers: true })
      .on("error", (error) => console.error(error))
      .on("data", (row: TbrCsvRow) => {
        const item = processItemRow(row);
        if (item) {
          items[item.name] = item;
        }
      });
    stream.write(csv);
    stream.end(() => resolve(items));
  });

  // Some items have weird tooltips and it's easier to just manually define those items than make the parser work with
  // them
  for (const [itemName, item] of Object.entries(itemOverrides as ItemMap)) {
    items[itemName] = item;
  }

  const json = JSON.stringify(items, null, 2);
  writeFileSync(`${__dirname}/items.json`, json);
}

function processItemRow(row: TbrCsvRow): Item | undefined {
  if (!shouldProcess(row)) {
    return undefined;
  }

  return {
    name: stripHtml(row.name),
    iconUrl: row.path,
    rarity: row.rarity,
    level: Number(row.level),
    restriction: row.restriction !== "NA" ? row.restriction : undefined,
    description: stripHtml(row.tooltip),
    stats: parseStatModifiers(row.tooltip),
    buffs: parseBuffs(row.tooltip)
  };
}

const STAT_INCREASE_SENTENCE =
  /^Increases (([\w, ]+ by [\d\.]+%?([\w ]+)?(,?( and )?)?)+)(\.| and )/;
const STAT_INCREASE_TOKEN = /([A-Z][A-Za-z, ]+?) (?:by )?([\d\.]+%?)/g;

function parseStatModifiers(tooltip: string): Array<StatModifier> {
  const match = tooltip.match(STAT_INCREASE_SENTENCE);
  const statIncreaseSentence = match?.[1];

  const stats: Array<StatModifier> = [];
  if (statIncreaseSentence) {
    const statIncreaseMatches =
      statIncreaseSentence.matchAll(STAT_INCREASE_TOKEN);
    for (const match of statIncreaseMatches) {
      const statStr = match[1];
      const amount = match[2];
      // statStr might be something like Strength, Agility, and Intelligence. Split into parts and for each segment that
      // matches a Stat enum, take note
      for (const statName of statStr.split(/,|and/)) {
        const trimmed = statName.trim() as Stat;
        if (STAT_NAMES.includes(trimmed)) {
          stats.push({
            stat: trimmed,
            value: Number(amount),
            type: "add" // TODO figure out type
          });
        }
        // else: probably just a space or "Health per second" which gets regex'd out. Can uncomment below for debugging
        // if necessary
        // else {
        //   console.warn(`Unrecognized stat name "${statName}"`);
        // }
      }
    }
  }

  return stats;
}

function parseBuffs(tooltip: string): Array<Buff> {
  return [];
}

function shouldProcess(row: TbrCsvRow): boolean {
  if (row.rarity === "Consumables") {
    return false;
  } else if (row.rarity === "Crafting Component / Unique Crafting Component") {
    return false;
  } else if (row.tooltip.includes("Consumable")) {
    return false;
  }
  return true;
}

const { document } = new JSDOM().window;

function stripHtml(str: string): string {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = str;
  return tmp.textContent || tmp.innerText || "";
}

main();
