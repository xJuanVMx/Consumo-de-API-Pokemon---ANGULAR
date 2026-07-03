import { Component, Input } from '@angular/core';
import { Pokemon } from '../../model/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  standalone: false,
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
}