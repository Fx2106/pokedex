# Pokedex
## Descripción
He decidido hacer un pokédex de pokemons usando pokemonAPI para obtener la información de cada pokemon, y después procesar la información y mostrarlo gráficamente en cartitas. Se puede consultar por nombre, número y tipo.

## Uso de AI
He utilizado ChatGPT para que me ayude a lo largo de toda la misión. Me ha ayudado a organizar los archivos, generar gran parte del código y entender conceptos de JavaScript que todavía estoy aprendiendo.

Algunos de los prompts que he utilizado durante el proceso son:
- como funciona API y q es json
- comienza la explicación de la misión 2 desde cero, para aprender qué hace cada parte del proyecto y poder explicarla.

Estoy revisando el código con ayuda de explicaciones paso a paso para entender conceptos como fetch, async/await, los módulos de JavaScript y los métodos map, filter y reduce.

No he escrito manualmente todo el código: una parte importante ha sido generada con ayuda de IA.

## Autopsia
1. En main.js he decidido utilizar Promise.allSettled() para gestionar las peticiones de los detalles de los Pokémon. Además, he dividido las peticiones en lotes de 20 elementos en lugar de lanzar las 151 consultas a la vez. Una alternativa habría sido utilizar Promise.all(), que devuelve los resultados cuando todas las promesas se resuelven correctamente, pero rechaza la operación completa si una de ellas falla. Con Promise.allSettled() puedo revisar cada resultado individualmente y conservar los Pokémon que sí se han cargado, aunque alguna petición falle.
2. En render.js he utilizado métodos como document.createElement(), textContent y document.createDocumentFragment() para construir las tarjetas de los Pokémon antes de añadirlas al contenedor de resultados. Una alternativa habría sido generar una cadena de texto HTML mediante plantillas literales e insertarla utilizando innerHTML. Esta opción puede requerir menos código y resultar más rápida de escribir, pero obliga a prestar atención a cómo se insertan los datos recibidos de una fuente externa.

