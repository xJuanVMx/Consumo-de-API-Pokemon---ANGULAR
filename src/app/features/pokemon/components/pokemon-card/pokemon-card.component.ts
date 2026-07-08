import { Component, Input } from '@angular/core';
import { Pokemon } from '../../model/pokemon.model';
import { PokemonTypeDetail } from '../../model/pokemon-type-detail.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  standalone: false,
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;

  selectedType: string | null = null;
  typeDetail: PokemonTypeDetail | null = null;
  cargandoTipo = false;
  errorTipo: string | null = null;

  constructor(private pokemonService: PokemonService) {}

 
  seleccionarTipo(tipo: string): void {
    if (this.selectedType === tipo) {
      this.selectedType = null;
      this.typeDetail = null;
      this.errorTipo = null;
      return;
    }

    this.selectedType = tipo;
    this.typeDetail = null;
    this.errorTipo = null;
    this.cargandoTipo = true;

    this.pokemonService.getTypeDetail(tipo).subscribe({
      next: (detail: PokemonTypeDetail) => {
        this.typeDetail = detail;
        this.cargandoTipo = false;
      },
      error: (err: Error) => {
        this.errorTipo = err.message;
        this.cargandoTipo = false;
      }
    });
  }
}