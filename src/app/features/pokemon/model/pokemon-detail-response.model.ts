export interface PokemonSprites {
  front_default: string | null;
}

export interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbilitySlot {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStatSlot {
  base_stat: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  abilities: PokemonAbilitySlot[];
  stats: PokemonStatSlot[];
}