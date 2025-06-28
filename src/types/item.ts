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
  "Agility" = "Agility",
  "Armor" = "Armor",
  "Attack Damage" = "Attack Damage",
  "Attack Speed" = "Attack Speed",
  "Health" = "Health",
  "Health Regeneration" = "Health Regeneration",
  "Intelligence" = "Intelligence",
  "Mana" = "Mana",
  "Mana Regeneration" = "Mana Regeneration",
  "Movement Speed" = "Movement Speed",
  "Resist" = "Resist",
  "Spell Damage" = "Spell Damage",
  "Spell Healing" = "Spell Healing",
  "Spell Power" = "Spell Power",
  "Strength" = "Strength"
}

export const STAT_NAMES = Object.values(Stat).map(String);
