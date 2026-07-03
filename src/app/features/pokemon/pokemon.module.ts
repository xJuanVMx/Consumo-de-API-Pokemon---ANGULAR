import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokemonListComponent } from './pages/pokemon-list/pokemon-list.component';
import { PokemonCardComponent } from './components/pokemon-card/pokemon-card.component';

@NgModule({
  declarations: [
    PokemonListComponent,
    PokemonCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PokemonListComponent
  ]
})
export class PokemonModule {}