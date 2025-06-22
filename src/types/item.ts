export interface Item {
  name: string;
  iconUrl: string;
  rarity: string;
  level: number;
  restriction?: string;
  description: string;
  stats: Array<StatModifier>;
  buffs: Array<Buff>;
}

export interface StatModifier {
  stat: Stat;
  value: number;
  type: "add" | "mult";
}

export interface Buff {
  name: string;
  level: number;
}

export enum Stat {
  "Agility",
  "Armor",
  "Attack Damage",
  "Attack Speed",
  "Health",
  "Health Regeneration",
  "Intelligence",
  "Mana",
  "Mana Regeneration",
  "Movement Speed",
  "Resist",
  "Spell Damage",
  "Spell Healing",
  "Spell Power",
  "Strength"
}
