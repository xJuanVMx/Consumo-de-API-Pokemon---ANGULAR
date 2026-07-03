import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../model/pokemon.model';


@Component({
  selector: 'app-pokemon-list',
  standalone: false,
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {

  pokemons: Pokemon[] = [];
  cargando = false;
  error: string | null = null;

  readonly limit = 20;
  offset = 0;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.cargarPokemones();
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