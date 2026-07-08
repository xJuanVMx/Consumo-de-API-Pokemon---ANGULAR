import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../model/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  standalone: false,
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit, OnDestroy {

  pokemons: Pokemon[] = [];
  cargando = false;
  error: string | null = null;

  readonly limit = 20;
  offset = 0;

  private readonly searchTerm$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();
  isSearching = false;
  searchNotFound = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.cargarPokemones();
    this.suscribirBusqueda();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private suscribirBusqueda(): void {
    this.searchTerm$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => {
          const trimmed = term.trim();

          if (!trimmed) {
            this.isSearching = false;
            this.searchNotFound = false;
            this.cargarPokemones();
            return [];
          }

          this.isSearching = true;
          this.searchNotFound = false;
          this.cargando = true;
          this.error = null;

          return this.pokemonService.searchPokemonByPartialName(trimmed);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(resultados => {
        if (!this.isSearching) {
          return;
        }
        this.cargando = false;
        this.searchNotFound = resultados.length === 0;
        this.pokemons = resultados;
      });
  }

  onBuscar(valor: string): void {
    this.searchTerm$.next(valor);
  }

  cargarPokemones(): void {
    this.cargando = true;
    this.error = null;

    this.pokemonService.getPokemonList(this.limit, this.offset).subscribe({
      next: (pokemons: Pokemon[]) => {
        this.pokemons = pokemons;
        this.cargando = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.cargando = false;
      }
    });
  }

  paginaSiguiente(): void {
    this.offset += this.limit;
    this.cargarPokemones();
  }

  paginaAnterior(): void {
    if (this.offset === 0) {
      return;
    }
    this.offset = Math.max(0, this.offset - this.limit);
    this.cargarPokemones();
  }
}