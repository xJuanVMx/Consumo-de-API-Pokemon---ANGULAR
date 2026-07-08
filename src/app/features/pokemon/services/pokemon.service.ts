import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { PokemonListResponse, PokemonListItem } from '../model/pokemon-list-response.model';
import { PokemonDetailResponse } from '../model/pokemon-detail-response.model';
import { Pokemon } from '../model/pokemon.model';
import { PokemonTypeResponse } from '../model/pokemon-type-response.model';
import { PokemonTypeDetail } from '../model/pokemon-type-detail.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemonList(limit: number = 20, offset: number = 0): Observable<Pokemon[]> {
    const url = `${this.baseUrl}?limit=${limit}&offset=${offset}`;

    return this.http.get<PokemonListResponse>(url).pipe(
      switchMap((listResponse: PokemonListResponse) => {
        const detailRequests: Observable<PokemonDetailResponse>[] =
          listResponse.results.map(item =>
            this.http.get<PokemonDetailResponse>(item.url)
          );

        return forkJoin(detailRequests);
      }),
      map((details: PokemonDetailResponse[]) =>
        details.map(detail => this.mapToPokemon(detail))
      ),
      catchError((error: unknown) => {
        console.error('Error al consumir la PokéAPI', error);
        return throwError(
          () => new Error('No fue posible cargar el listado de Pokémon. Intenta nuevamente.')
        );
      })
    );
  }

  searchPokemonByPartialName(term: string): Observable<Pokemon[]> {
    const normalizedTerm = term.trim().toLowerCase();
    const url = `${this.baseUrl}?limit=2000&offset=0`;

    return this.http.get<PokemonListResponse>(url).pipe(
      map((listResponse: PokemonListResponse): PokemonListItem[] =>
        listResponse.results
          .filter(item => item.name.includes(normalizedTerm))
          .slice(0, 30)
      ),
      switchMap((matches: PokemonListItem[]): Observable<PokemonDetailResponse[]> => {
        if (matches.length === 0) {
          return of<PokemonDetailResponse[]>([]);
        }

        const detailRequests: Observable<PokemonDetailResponse>[] = matches.map(item =>
          this.http.get<PokemonDetailResponse>(item.url)
        );

        return forkJoin(detailRequests);
      }),
      map((details: PokemonDetailResponse[]) =>
        details.map(detail => this.mapToPokemon(detail))
      ),
      catchError((error: unknown) => {
        console.error('Error al buscar Pokémon', error);
        return of<Pokemon[]>([]);
      })
    );
  }


  searchPokemonByName(name: string): Observable<Pokemon[]> {
    const normalizedName = name.trim().toLowerCase();
    const url = `${this.baseUrl}/${normalizedName}`;

    return this.http.get<PokemonDetailResponse>(url).pipe(
      map((detail: PokemonDetailResponse) => [this.mapToPokemon(detail)]),
      catchError(() => of([]))
    );
  }

  getTypeDetail(typeName: string): Observable<PokemonTypeDetail> {
    const url = `https://pokeapi.co/api/v2/type/${typeName}`;

    return this.http.get<PokemonTypeResponse>(url).pipe(
      map((response: PokemonTypeResponse) => ({
        name: response.name,
        doubleDamageFrom: response.damage_relations.double_damage_from.map(t => t.name),
        halfDamageFrom: response.damage_relations.half_damage_from.map(t => t.name),
        noDamageFrom: response.damage_relations.no_damage_from.map(t => t.name)
      })),
      catchError((error: unknown) => {
        console.error('Error al consultar el tipo', error);
        return throwError(
          () => new Error('No fue posible cargar la información del tipo.')
        );
      })
    );
  }


  private mapToPokemon(detail: PokemonDetailResponse): Pokemon {
    return {
      id: detail.id,
      name: detail.name,
      image: detail.sprites.front_default ?? '',
      height: detail.height,
      weight: detail.weight,
      types: detail.types.map(t => t.type.name),
      abilities: detail.abilities.map(a => a.ability.name)
    };
  }
}