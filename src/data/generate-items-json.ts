import { parse } from "@fast-csv/parse";
import { JSDOM } from "jsdom";

interface Item {
  name: string;
  iconUrl: string;
  rarity: string;
  level: number;
  restriction?: string;
  description: string;
}

const CSV_PATH =
  "https://raw.githubusercontent.com/TheBlackRoad-RPG/TheBlackRoad-RPG.github.io/refs/heads/master/data/item_data.csv";

async function main() {
  const response = await fetch(CSV_PATH);
  const csv = await response.text();

  const items: Item[] = [];
  await new Promise((resolve) => {
    const stream = parse({ headers: true })
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        const item = processItemRow(row);
        if (item) {
          items.push(item);
        }
      });
    stream.write(csv);
    stream.end(() => resolve(items));
  });

  // console.log(items);
}

function processItemRow(row: any): Item | undefined {
  if (!shouldProcess(row)) {
    return undefined;
  }

  parseStatIncreases(row.tooltip);

  return {
    name: stripHtml(row.name),
    iconUrl: row.path,
    rarity: row.rarity,
    level: Number(row.level),
    restriction: row.restriction !== "NA" ? row.restriction : undefined,
    description: stripHtml(row.tooltip)
  };
}

const STAT_INCREASE_SENTENCE = /^Increases ([\w ]+ by [\d\.]+%?(,?( and )?)?)+/;

function parseStatIncreases(tooltip: string) {
  const match = tooltip.match(STAT_INCREASE_SENTENCE);
  const statIncreaseSentence = match?.[1];
  console.log(tooltip, statIncreaseSentence);
}

function shouldProcess(row: any): boolean {
  if (row.rarity === "Consumables") {
    return false;
  } else if (row.rarity === "Crafting Component / Unique Crafting Component") {
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
