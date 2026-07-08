export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonTypeDamageRelations {
  double_damage_from: NamedApiResource[];
  half_damage_from: NamedApiResource[];
  no_damage_from: NamedApiResource[];
}

export interface PokemonTypeResponse {
  name: string;
  damage_relations: PokemonTypeDamageRelations;
}