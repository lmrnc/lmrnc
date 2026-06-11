# Guion orientativo para el video de la PEC4

Duración objetivo: 6-8 minutos.

## 1. Presentación del proyecto

Presento una visualización de una red de colaboraciones musicales construida a partir de datos seleccionados de MusicBrainz. El caso se centra en Bad Bunny como artista central y en colaboradores asociados a dos álbumes de referencia: *Un Verano Sin Ti* y *DeBÍ TiRAR MáS FOToS*.

## 2. Preguntas y objetivos

Las preguntas principales son:

- Qué estructura tiene una red sencilla de colaboraciones alrededor de un artista central.
- Qué colaboradores pertenecen a cada álbum de referencia.
- Si existen relaciones internas entre colaboradores, además de las conexiones directas con Bad Bunny.

El objetivo es crear una visualización que permita identificar centralidad, agrupaciones y relaciones concretas por canción.

## 3. Datos y metodología

La red se compone de nodos y aristas. Cada nodo representa un artista o grupo. Cada arista representa una colaboración musical en una canción concreta. La fuente seleccionada es MusicBrainz porque ofrece información estructurada sobre artistas, grabaciones y relaciones musicales. La muestra se ha acotado para que sea manejable y clara en el contexto de una práctica de visualización.

## 4. Decisiones de diseño visual

He escogido una red nodo-arista porque el fenómeno que se representa es relacional. El color permite distinguir los colaboradores de cada álbum. El tamaño del nodo destaca a Bad Bunny como nodo central. Las líneas continuas representan colaboraciones directas y la línea discontinua representa una co-colaboración entre Omar Courtz y Dei V en la canción *Veldá*.

También se incluyen gráficos de barras para resumir la distribución de colaboradores por álbum y por tipo de entidad musical. Estos gráficos complementan la red porque ayudan a leer cantidades sin depender solo de la posición de los nodos.

## 5. Interactividad

La visualización permite filtrar por álbum, buscar artistas o grupos, activar o desactivar la co-colaboración y seleccionar nodos o aristas. Al seleccionar un nodo se destacan sus relaciones visibles y aparece un panel de detalle. Al seleccionar una arista se muestra la canción, el álbum y el tipo de relación.

Estas interacciones ayudan a reducir ruido visual y facilitan la exploración progresiva de la red.

## 6. Conclusiones

Sobre los datos, he aprendido que una red musical puede mostrar patrones que una tabla no comunica con la misma claridad, especialmente la centralidad y las relaciones entre colaboradores.

Sobre las visualizaciones, he aprendido que una red es útil para explicar relaciones, pero necesita filtros, leyenda y resúmenes complementarios para no depender únicamente de la forma del grafo.

Sobre el proceso de visualización de información, he aprendido que la selección y limpieza de datos condiciona mucho el resultado final. También he visto la importancia de justificar cada decisión visual en función de la pregunta que se quiere responder.
