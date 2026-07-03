import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { PokemonListResponse } from '../model/pokemon-list-response.model';
import { PokemonDetailResponse } from '../model/pokemon-detail-response.model';
import { Pokemon } from '../model/pokemon.model';

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