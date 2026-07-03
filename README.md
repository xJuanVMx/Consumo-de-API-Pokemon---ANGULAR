# Consumo de API desde Angular - PokeAPI

Aplicación desarrollada en **Angular v19** que consume la [PokéAPI](https://pokeapi.co/docs/v2)
para listar Pokémon con su información de detalle, aplicando operadores RxJS
(`switchMap`, `forkJoin`, `map`, `catchError`) en el servicio, sin suscripciones anidadas.

## Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [Angular CLI](https://angular.dev/tools/cli) v19

Para instalar Angular CLI de forma global (si no lo tienes):

```bash
npm install -g @angular/cli
```

Verifica las versiones instaladas:

```bash
node -v
ng version
```

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/xJuanVMx/Consumo-de-API-desde-Angular.git
   ```

2. Entra a la carpeta del proyecto:

   ```bash
   cd Consumo-de-API-desde-Angular
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

## Ejecución en modo desarrollo

```bash
ng serve
```

Luego abre el navegador en:

```
http://localhost:4200
```

La aplicación recarga automáticamente cada vez que modificas un archivo fuente.

## Estructura del proyecto

```
src/app/
├── app.component.ts / .html / .css   # Componente raíz
├── app.module.ts                     # Módulo raíz (registra HttpClientModule)
└── features/
    └── pokemon/
        ├── components/
        │   └── pokemon-card/         # Tarjeta individual de Pokémon
        ├── model/                    # Interfaces TypeScript (sin "any")
        ├── pages/
        │   └── pokemon-list/         # Página de listado (ngOnInit, *ngFor, carga/error)
        ├── services/
        │   └── pokemon.service.ts    # switchMap + forkJoin + map + catchError
        └── pokemon.module.ts         # Módulo de la feature
```

## Funcionalidades

- **Listado de Pokémon** obtenido desde `GET /pokemon?limit=20&offset=0`, enriquecido
  con el detalle de cada uno (`GET /pokemon/:id_o_nombre`) usando `switchMap` + `forkJoin`.
- **Tarjetas** con imagen, nombre, altura, peso, tipos y habilidades.
- **Estados visuales** de carga y error durante la consulta.
- **Paginación**: botones "Anterior" / "Siguiente" que modifican el `offset` y
  vuelven a disparar la consulta.

## Tecnologías utilizadas

- Angular 19
- TypeScript
- RxJS
- HttpClient
- [PokéAPI](https://pokeapi.co/)

## Autor

Juan David Vera Moreno
ADSO 3231651