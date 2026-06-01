const { createClient } = require("@supabase/supabase-js");
const s = createClient(
  "https://sbbzwwnbvdtpynnittps.supabase.co",
  "sb_publishable_5lKjZOR1YgTyhgfcXuYaqw_WaCjeWDf"
);

const CATS = {
  ciencia: "7d1015ea-ec11-4966-97ee-f8e2ccc7c36e",
  historia: "c07d5e47-f9fd-4ec8-8646-194651b1c118",
  interesante: "bc445708-579a-4f25-95bc-78239129b26e",
};
const TAGS = {
  popular: "1bf4bac9-31c1-4147-87bf-3d8e11cab39a",
};

const makePar = (ps) => ps.join("\n\n");

const universo = {
  title: "El origen del universo: del Big Bang a los agujeros negros",
  author: "Dra. Valeria Espinoza",
  description:
    "Un viaje fascinante a través del tiempo y el espacio para entender cómo se formó el universo, desde la gran explosión inicial hasta los misteriosos agujeros negros que desafían las leyes de la física.",
  difficulty: 4, min_level: 1, estimated_minutes: 50, xp_base: 25,
  categories: [CATS.ciencia, CATS.interesante], tags: [TAGS.popular],
  pages: [
    {
      es: makePar([
        "Hace aproximadamente 13.800 millones de años, todo lo que conocemos hoy —cada estrella, cada planeta, cada ser vivo— estaba comprimido en un punto infinitamente pequeño y caliente. Los científicos llaman a este momento 'singularidad inicial'. Era un punto más pequeño que un átomo, pero contenía toda la energía y la materia del universo.",
        "De repente, este punto explotó en un evento que conocemos como el Big Bang. Pero no debemos imaginarlo como una explosión normal, como la de un petardo o un volcán. El Big Bang no fue una explosión dentro del espacio: fue la expansión del propio espacio. No había un 'afuera' hacia donde expandirse porque el espacio mismo estaba naciendo en ese momento.",
        "En los primeros segundos después del Big Bang, el universo estaba increíblemente caliente, a temperaturas de miles de millones de grados. No existía la materia como la conocemos. Solo había energía pura y partículas elementales que se movían a velocidades inimaginables. Poco a poco, el universo comenzó a enfriarse, y esas partículas empezaron a combinarse para formar los primeros átomos.",
        "Los primeros átomos que se formaron fueron los más simples: hidrógeno y helio. Estos dos elementos son los más abundantes en el universo incluso hoy. Durante cientos de millones de años, el universo fue un lugar oscuro y frío, lleno de una niebla de gas que no dejaba pasar la luz. A este período se le llama la 'Edad Oscura' del cosmos.",
        "Pero la gravedad comenzó a hacer su trabajo. Pequeñas variaciones en la densidad del gas hicieron que algunas regiones fueran ligeramente más densas que otras. Estas regiones atrajeron más gas, haciéndose cada vez más grandes y calientes. Después de millones de años, la presión y la temperatura en el centro de estas nubes de gas se volvieron tan altas que los átomos de hidrógeno comenzaron a fusionarse, liberando enormes cantidades de energía. Habían nacido las primeras estrellas.",
        "Hoy sabemos que el universo sigue expandiéndose. Los astrónomos lo han medido observando galaxias lejanas que se alejan de nosotros. Y la expansión no se está frenando, sino que se acelera. Esto fue uno de los descubrimientos más sorprendentes de la ciencia moderna, y aún no entendemos completamente qué la causa. Llamamos 'energía oscura' a esta fuerza misteriosa que impulsa la expansión acelerada del universo.",
      ]),
      en: makePar([
        "Approximately 13.8 billion years ago, everything we know today — every star, every planet, every living being — was compressed into an infinitely small and hot point. Scientists call this moment the 'initial singularity.' It was a point smaller than an atom, yet it contained all the energy and matter of the universe.",
        "Suddenly, this point exploded in an event we call the Big Bang. But we should not imagine it like a normal explosion. The Big Bang was not an explosion within space: it was the expansion of space itself. There was no 'outside' to expand into because space itself was being born at that moment.",
        "In the first seconds after the Big Bang, the universe was incredibly hot, at temperatures of billions of degrees. Matter as we know it did not exist. There was only pure energy and elementary particles moving at unimaginable speeds. Little by little, the universe began to cool, and those particles started to combine to form the first atoms.",
        "The first atoms to form were the simplest: hydrogen and helium. These two elements are the most abundant in the universe even today. For hundreds of millions of years, the universe was a dark and cold place, filled with a fog of gas that blocked light. This period is called the 'Dark Ages' of the cosmos.",
        "But gravity began to do its work. Small variations in gas density made some regions slightly denser than others. These regions attracted more gas, becoming larger and hotter. After millions of years, the pressure and temperature at the center of these gas clouds became so high that hydrogen atoms began to fuse, releasing enormous amounts of energy. The first stars had been born.",
        "Today we know that the universe continues to expand. Astronomers have measured it by observing distant galaxies moving away from us. And the expansion is not slowing down — it is accelerating. This was one of the most surprising discoveries of modern science, and we still do not fully understand what causes it. We call 'dark energy' this mysterious force driving the accelerated expansion of the universe.",
      ]),
    },
    {
      es: makePar([
        "Las primeras estrellas eran enormes, mucho más grandes que nuestro Sol. Vivían rápido y morían jóvenes, explotando como supernovas después de solo unos millones de años. Estas explosiones esparcieron elementos más pesados por el espacio: carbono, oxígeno, hierro y muchos otros. Sin estas explosiones, los planetas rocosos como la Tierra y los seres vivos nunca habrían podido formarse. Somos, literalmente, polvo de estrellas.",
        "A partir de estos elementos más pesados se formaron nuevas generaciones de estrellas, y alrededor de algunas de ellas nacieron planetas. Nuestro propio Sol es una estrella de tercera generación. Se formó hace unos 4.600 millones de años a partir de una nube de gas y polvo. A su alrededor, los materiales sobrantes se agruparon para formar los planetas, incluyendo la Tierra.",
        "La Vía Láctea, nuestra galaxia, contiene entre 100.000 y 400.000 millones de estrellas. Es una galaxia espiral, con brazos que giran lentamente alrededor de un centro brillante. Nuestro sistema solar se encuentra en uno de esos brazos, a unos 27.000 años luz del centro galáctico. Cuando miramos el cielo nocturno, esa banda blanca lechosa que vemos es precisamente el plano de nuestra galaxia vista desde dentro.",
        "Pero las galaxias no están quietas. Se mueven, chocan y se fusionan. La Vía Láctea está en curso de colisión con nuestra vecina más cercana, la galaxia de Andrómeda. Dentro de unos 4.500 millones de años, las dos galaxias comenzarán a fusionarse. A pesar de lo que pueda sonar, es poco probable que las estrellas individuales choquen, porque las distancias entre ellas son inmensas. Sin embargo, el cielo nocturno cambiará para siempre en un espectacular baile cósmico.",
        "Uno de los objetos más fascinantes del universo son los agujeros negros. Se forman cuando una estrella muy masiva colapsa sobre sí misma al final de su vida. La gravedad es tan intensa que ni siquiera la luz puede escapar. El punto central, llamado singularidad, tiene una densidad infinita. Alrededor de él hay una frontera invisible llamada 'horizonte de sucesos'. Una vez que algo cruza esa frontera, jamás puede regresar.",
        "Los agujeros negros no son aspiradoras cósmicas que absorben todo a su alrededor, como a veces se representa en las películas. Si nuestro Sol se convirtiera en un agujero negro (algo que no puede suceder porque no es lo suficientemente masivo), la Tierra seguiría orbitando a su alrededor exactamente como ahora, solo que no veríamos luz. El peligro está en acercarse demasiado al horizonte de sucesos, donde la gravedad se vuelve extrema.",
      ]),
      en: makePar([
        "The first stars were enormous, much larger than our Sun. They lived fast and died young, exploding as supernovae after only a few million years. These explosions scattered heavier elements across space: carbon, oxygen, iron, and many others. Without these explosions, rocky planets like Earth and living beings could never have formed. We are, literally, stardust.",
        "From these heavier elements, new generations of stars formed, and around some of them, planets were born. Our own Sun is a third-generation star. It formed about 4.6 billion years ago from a cloud of gas and dust. Around it, the remaining materials clumped together to form the planets, including Earth.",
        "The Milky Way, our galaxy, contains between 100 and 400 billion stars. It is a spiral galaxy, with arms that slowly rotate around a bright center. Our solar system is located in one of those arms, about 27,000 light-years from the galactic center. When we look at the night sky, that milky white band we see is precisely the plane of our galaxy viewed from within.",
        "But galaxies are not still. They move, collide, and merge. The Milky Way is on a collision course with our closest neighbor, the Andromeda galaxy. In about 4.5 billion years, the two galaxies will begin to merge. Despite how it may sound, individual stars are unlikely to collide because the distances between them are immense. However, the night sky will change forever in a spectacular cosmic dance.",
        "One of the most fascinating objects in the universe is black holes. They form when a very massive star collapses upon itself at the end of its life. Gravity is so intense that not even light can escape. The central point, called a singularity, has infinite density. Around it lies an invisible boundary called the 'event horizon.' Once something crosses that boundary, it can never return.",
        "Black holes are not cosmic vacuum cleaners that suck everything around them, as sometimes portrayed in movies. If our Sun were to become a black hole (something that cannot happen because it is not massive enough), Earth would continue orbiting it exactly as it does now, only we would not see light. The danger lies in getting too close to the event horizon, where gravity becomes extreme.",
      ]),
    },
    {
      es: makePar([
        "Durante mucho tiempo, los agujeros negros fueron solo una predicción teórica de la teoría de la relatividad general de Einstein. Pero en 2019, el mundo entero vio la primera fotografía real de un agujero negro. La imagen mostraba un anillo brillante de gas caliente alrededor de un centro oscuro: la sombra del agujero negro en el centro de la galaxia M87. Fue un logro tecnológico increíble que requirió un telescopio del tamaño de la Tierra.",
        "Las estrellas de neutrones son otro tipo de objeto fascinante. Cuando una estrella masiva explota como supernova, su núcleo puede colapsar hasta formar una esfera increíblemente densa de neutrones. Una cucharadita de material de una estrella de neutrones pesaría aproximadamente 10 millones de toneladas. Estas estrellas giran a velocidades vertiginosas, algunas cientos de veces por segundo, emitiendo pulsos regulares de radiación que los astrónomos pueden detectar.",
        "Más allá de nuestra galaxia, el universo observable contiene al menos 200 mil millones de galaxias, cada una con cientos de miles de millones de estrellas. Si multiplicamos esos números, obtenemos una cantidad de estrellas que supera nuestra capacidad de comprensión. Y eso es solo el universo observable. El universo total podría ser mucho, mucho más grande, posiblemente infinito.",
        "Los científicos también han descubierto que el universo está lleno de cosas que no podemos ver directamente. La materia oscura es una forma de materia invisible que no emite luz ni energía, pero que ejerce gravedad. Los astrónomos saben que existe porque las galaxias se comportan como si tuvieran mucha más masa de la que podemos observar. Se cree que la materia oscura constituye aproximadamente el 27% del universo.",
        "El otro 68% del universo es energía oscura, esa fuerza misteriosa que está acelerando la expansión del cosmos. Esto significa que todo lo que conocemos —estrellas, planetas, gas, polvo e incluso la materia oscura— representa apenas el 5% del contenido total del universo. El resto son dos grandes misterios que la ciencia aún no ha resuelto.",
        "La exploración del universo continúa. Cada año, nuevos telescopios y misiones espaciales nos revelan secretos que antes eran imposibles de imaginar. El telescopio espacial James Webb, lanzado en 2021, nos permite ver las primeras galaxias que se formaron después del Big Bang. Y las misiones a Marte, Júpiter y más allá siguen expandiendo nuestro conocimiento del sistema solar. El universo, al final, es el laboratorio más grande que existe, y apenas estamos empezando a entenderlo.",
      ]),
      en: makePar([
        "For a long time, black holes were only a theoretical prediction of Einstein's general theory of relativity. But in 2019, the world saw the first real photograph of a black hole. The image showed a bright ring of hot gas around a dark center: the shadow of the black hole at the center of galaxy M87. It was an incredible technological achievement that required a telescope the size of Earth.",
        "Neutron stars are another fascinating type of object. When a massive star explodes as a supernova, its core can collapse into an incredibly dense sphere of neutrons. A teaspoon of neutron star material would weigh approximately 10 million tons. These stars spin at dizzying speeds, some hundreds of times per second, emitting regular pulses of radiation that astronomers can detect.",
        "Beyond our galaxy, the observable universe contains at least 200 billion galaxies, each with hundreds of billions of stars. Multiplying those numbers gives us a quantity of stars that exceeds our capacity to comprehend. And that is only the observable universe. The total universe could be much, much larger, possibly infinite.",
        "Scientists have also discovered that the universe is full of things we cannot directly see. Dark matter is an invisible form of matter that does not emit light or energy but exerts gravity. Astronomers know it exists because galaxies behave as if they have much more mass than we can observe. Dark matter is believed to make up approximately 27% of the universe.",
        "The other 68% of the universe is dark energy, that mysterious force accelerating the expansion of the cosmos. This means that everything we know — stars, planets, gas, dust, and even dark matter — represents barely 5% of the total content of the universe. The rest are two great mysteries that science has not yet solved.",
        "The exploration of the universe continues. Every year, new telescopes and space missions reveal secrets that were previously impossible to imagine. The James Webb Space Telescope, launched in 2021, allows us to see the first galaxies that formed after the Big Bang. And missions to Mars, Jupiter, and beyond continue to expand our knowledge of the solar system. The universe, in the end, is the largest laboratory that exists, and we are only beginning to understand it.",
      ]),
    },
    {
      es: makePar([
        "Uno de los descubrimientos más importantes de la astronomía moderna fue encontrar planetas fuera de nuestro sistema solar, llamados exoplanetas. Desde 1995, cuando se descubrió el primer exoplaneta orbitando una estrella como el Sol, hemos encontrado más de 5.000 de ellos. Algunos son gigantes gaseosos como Júpiter, otros son pequeños y rocosos como la Tierra. Y algunos están en la 'zona habitable' de sus estrellas, donde podría existir agua líquida.",
        "La búsqueda de vida extraterrestre es uno de los motores más poderosos de la exploración espacial. Misiones como el rover Perseverance en Marte buscan signos de vida microbiana antigua. Las lunas de Júpiter y Saturno, como Europa y Encélado, tienen océanos subterráneos de agua líquida donde podría haber vida. Incluso se han encontrado moléculas orgánicas complejas en nubes interestelares y en la atmósfera de Titán, la luna más grande de Saturno.",
        "El telescopio espacial Kepler nos enseñó que los planetas son comunes en la galaxia. Las estadísticas sugieren que podría haber miles de millones de planetas similares a la Tierra solo en la Vía Láctea. Esto hace que la pregunta de si estamos solos en el universo sea más relevante que nunca. Aunque todavía no hemos encontrado señales de vida inteligente, la búsqueda continúa con proyectos como SETI, que escucha señales de radio del espacio.",
        "Para entender realmente el universo, los científicos han construido instrumentos cada vez más poderosos. El Gran Colisionador de Hadrones (LHC) en Suiza acelera partículas a velocidades cercanas a la de la luz y las hace chocar para recrear las condiciones del universo primitivo. Así podemos estudiar las partículas fundamentales que componen la materia y entender mejor cómo funciona la naturaleza en su nivel más básico.",
        "La teoría del Big Bang no nos dice qué había 'antes' del Big Bang, porque el tiempo mismo comenzó con él. Es como preguntar qué hay al norte del Polo Norte. Simplemente, la pregunta no tiene sentido en el marco de la física actual. Algunas teorías especulan sobre universos cíclicos o un multiverso, pero por ahora son solo ideas fascinantes sin evidencia concreta.",
        "El viaje para comprender el cosmos nos ha enseñado algo profundo: nosotros, los seres humanos, somos una manera que tiene el universo de conocerse a sí mismo. A través de nuestros ojos, telescopios y mentes curiosas, el universo observa, calcula y se maravilla de su propia existencia. Cada nuevo descubrimiento nos recuerda lo pequeños que somos, pero también lo extraordinario que es poder preguntarnos sobre todo esto.",
      ]),
      en: makePar([
        "One of the most important discoveries of modern astronomy was finding planets outside our solar system, called exoplanets. Since 1995, when the first exoplanet was discovered orbiting a Sun-like star, we have found more than 5,000 of them. Some are gas giants like Jupiter, others are small and rocky like Earth. And some are in the 'habitable zone' of their stars, where liquid water could exist.",
        "The search for extraterrestrial life is one of the most powerful drivers of space exploration. Missions like the Perseverance rover on Mars look for signs of ancient microbial life. The moons of Jupiter and Saturn, such as Europa and Enceladus, have underground oceans of liquid water where life could exist. Complex organic molecules have even been found in interstellar clouds and in the atmosphere of Titan, Saturn's largest moon.",
        "The Kepler space telescope taught us that planets are common in the galaxy. Statistics suggest there could be billions of Earth-like planets in the Milky Way alone. This makes the question of whether we are alone in the universe more relevant than ever. Although we have not yet found signs of intelligent life, the search continues with projects like SETI, which listens for radio signals from space.",
        "To truly understand the universe, scientists have built increasingly powerful instruments. The Large Hadron Collider (LHC) in Switzerland accelerates particles to near-light speeds and smashes them together to recreate the conditions of the early universe. This allows us to study the fundamental particles that make up matter and better understand how nature works at its most basic level.",
        "The Big Bang theory does not tell us what existed 'before' the Big Bang, because time itself began with it. It is like asking what is north of the North Pole. The question simply does not make sense within the framework of current physics. Some theories speculate about cyclic universes or a multiverse, but for now they are just fascinating ideas without concrete evidence.",
        "The journey to understand the cosmos has taught us something profound: we human beings are a way for the universe to know itself. Through our eyes, telescopes, and curious minds, the universe observes, calculates, and marvels at its own existence. Each new discovery reminds us how small we are, but also how extraordinary it is to be able to wonder about all of this.",
      ]),
    },
    {
      es: makePar([
        "El sistema solar es nuestro hogar cósmico. En el centro está el Sol, una estrella de tamaño mediano que contiene el 99,8% de toda la masa del sistema. A su alrededor orbitan ocho planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Cada uno es único, con características fascinantes que los científicos siguen estudiando.",
        "Marte ha sido el destino favorito de la exploración robótica. Los rovers que hemos enviado han encontrado evidencia de que hace miles de millones de años había agua líquida en su superficie. Hoy, el agua está congelada en los polos y bajo la superficie. Se han descubierto moléculas orgánicas en muestras de rocas marcianas, lo que sugiere que Marte pudo haber tenido las condiciones adecuadas para la vida.",
        "Júpiter es el planeta más grande del sistema solar. Su Gran Mancha Roja es una tormenta gigante que ha estado activa durante cientos de años y podría contener varias Tierras. Tiene más de 90 lunas conocidas, incluyendo Europa, que tiene un océano global bajo su corteza de hielo. La misión Europa Clipper de la NASA buscará signos de habitabilidad en este fascinante mundo.",
        "Saturno es famoso por sus hermosos anillos, compuestos principalmente de hielo y roca. Su luna Titán tiene una atmósfera densa y lagos de metano líquido en su superficie. Otra luna, Encélado, expulsa columnas de agua al espacio desde su océano subterráneo, lo que la convierte en uno de los lugares más prometedores para buscar vida extraterrestre en nuestro sistema solar.",
        "Más allá de Neptuno se extiende el Cinturón de Kuiper, una región llena de objetos helados como Plutón. Y aún más lejos está la Nube de Oort, una esfera de cometas que rodea todo el sistema solar. Se cree que la mayoría de los cometas que vemos desde la Tierra provienen de allí. La nave Voyager 1, lanzada en 1977, ya ha salido del sistema solar y lleva un mensaje para posibles civilizaciones extraterrestres.",
        "El estudio del universo nos enfrenta a preguntas fundamentales: ¿Hay otros universos? ¿Qué pasó antes del Big Bang? ¿Estamos solos? ¿Qué es la conciencia? Estas preguntas no tienen respuestas fáciles, pero el simple hecho de que podamos hacérnoslas nos hace especiales. En un universo de miles de millones de galaxias, nosotros podemos preguntar, explorar y maravillarnos. Quizás eso sea lo más extraordinario de todo.",
      ]),
      en: makePar([
        "The solar system is our cosmic home. At the center is the Sun, a medium-sized star that contains 99.8% of all the mass in the system. Orbiting around it are eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each one is unique, with fascinating characteristics that scientists continue to study.",
        "Mars has been the favorite destination of robotic exploration. The rovers we have sent have found evidence that billions of years ago, there was liquid water on its surface. Today, water is frozen at the poles and beneath the surface. Organic molecules have been discovered in Martian rock samples, suggesting that Mars may have had the right conditions for life.",
        "Jupiter is the largest planet in the solar system. Its Great Red Spot is a giant storm that has been active for hundreds of years and could contain several Earths. It has over 90 known moons, including Europa, which has a global ocean beneath its icy crust. NASA's Europa Clipper mission will search for signs of habitability on this fascinating world.",
        "Saturn is famous for its beautiful rings, composed mainly of ice and rock. Its moon Titan has a thick atmosphere and lakes of liquid methane on its surface. Another moon, Enceladus, shoots plumes of water into space from its underground ocean, making it one of the most promising places to search for extraterrestrial life in our solar system.",
        "Beyond Neptune lies the Kuiper Belt, a region filled with icy objects like Pluto. And even farther is the Oort Cloud, a sphere of comets surrounding the entire solar system. Most comets we see from Earth are believed to come from there. The Voyager 1 spacecraft, launched in 1977, has already left the solar system and carries a message for possible extraterrestrial civilizations.",
        "Studying the universe confronts us with fundamental questions: Are there other universes? What happened before the Big Bang? Are we alone? What is consciousness? These questions have no easy answers, but the mere fact that we can ask them makes us special. In a universe of billions of galaxies, we can ask, explore, and wonder. Perhaps that is the most extraordinary thing of all.",
      ]),
    },
  ],
};

const cuerpo = {
  title: "El cuerpo humano: una máquina extraordinaria",
  author: "Dr. Ricardo Montesinos",
  description:
    "Un recorrido fascinante por el interior del cuerpo humano. Descubre cómo funciona tu corazón, cómo tu cerebro procesa la información y cómo tu sistema inmunológico te defiende cada segundo.",
  difficulty: 3, min_level: 1, estimated_minutes: 45, xp_base: 25,
  categories: [CATS.ciencia, CATS.interesante], tags: [TAGS.popular],
  pages: [
    {
      es: makePar([
        "El cuerpo humano es una de las estructuras más complejas y maravillosas del universo conocido. Está compuesto por aproximadamente 37 billones de células, cada una realizando funciones específicas que, en conjunto, nos permiten vivir, pensar, movernos y sentir. Cada célula es como una pequeña ciudad en miniatura, con sus propias centrales eléctricas (las mitocondrias), bibliotecas de información (el núcleo con el ADN) y sistemas de transporte.",
        "El corazón es el motor incansable del cuerpo. Late aproximadamente 100.000 veces al día, bombeando unos 7.500 litros de sangre a través de más de 96.000 kilómetros de vasos sanguíneos. En una vida promedio de 80 años, el corazón late más de 3.000 millones de veces sin descanso. Es un músculo del tamaño de un puño que trabaja con una eficiencia asombrosa.",
        "La sangre que bombea el corazón no solo transporta oxígeno. También lleva nutrientes, hormonas, células del sistema inmunológico y ayuda a regular la temperatura corporal. Los glóbulos rojos viven aproximadamente 120 días y viajan por todo el cuerpo unas 250.000 veces antes de ser reemplazados. Cada segundo, la médula ósea produce unos 2 millones de nuevos glóbulos rojos.",
        "Los pulmones son los grandes intercambiadores de gases. Cada día respiramos aproximadamente 20.000 veces, inhalando unos 10.000 litros de aire. Los pulmones contienen alrededor de 300 millones de pequeños sacos llamados alvéolos. Si extendiéramos todos los alvéolos, cubrirían una superficie del tamaño de una cancha de tenis. Esa enorme superficie permite que el oxígeno pase eficientemente a la sangre.",
        "El sistema respiratorio no solo nos provee de oxígeno. También es fundamental para nuestra comunicación: el aire que pasa por nuestras cuerdas vocales nos permite hablar, cantar, reír y expresar emociones. Las cuerdas vocales vibran entre 100 y 1.000 veces por segundo, y el sonido se modifica en la garganta, la boca y la nariz para formar las palabras que usamos para comunicarnos.",
        "La respiración es también una de las pocas funciones corporales que podemos controlar de forma consciente e inconsciente. Podemos contener la respiración voluntariamente, pero cuando dormimos, el cerebro sigue enviando señales a los músculos respiratorios para que sigan funcionando. Este control automático está gestionado por el tronco encefálico, la parte más primitiva de nuestro cerebro.",
      ]),
      en: makePar([
        "The human body is one of the most complex and wonderful structures in the known universe. It is composed of approximately 37 trillion cells, each performing specific functions that, together, allow us to live, think, move, and feel. Each cell is like a tiny miniature city, with its own power plants (mitochondria), information libraries (the nucleus with DNA), and transportation systems.",
        "The heart is the tireless engine of the body. It beats approximately 100,000 times a day, pumping about 7,500 liters of blood through more than 96,000 kilometers of blood vessels. In an average lifetime of 80 years, the heart beats more than 3 billion times without rest. It is a muscle the size of a fist that works with astonishing efficiency.",
        "The blood pumped by the heart does not only transport oxygen. It also carries nutrients, hormones, immune system cells, and helps regulate body temperature. Red blood cells live approximately 120 days and travel throughout the body about 250,000 times before being replaced. Every second, bone marrow produces about 2 million new red blood cells.",
        "The lungs are the great gas exchangers. Each day we breathe approximately 20,000 times, inhaling about 10,000 liters of air. The lungs contain around 300 million tiny sacs called alveoli. If we spread out all the alveoli, they would cover an area the size of a tennis court. This enormous surface allows oxygen to pass efficiently into the blood.",
        "The respiratory system does not only provide us with oxygen. It is also fundamental for our communication: the air passing through our vocal cords allows us to speak, sing, laugh, and express emotions. The vocal cords vibrate between 100 and 1,000 times per second, and the sound is modified in the throat, mouth, and nose to form the words we use to communicate.",
        "Breathing is also one of the few bodily functions that we can control both consciously and unconsciously. We can voluntarily hold our breath, but when we sleep, the brain continues sending signals to the respiratory muscles to keep working. This automatic control is managed by the brainstem, the most primitive part of our brain.",
      ]),
    },
    {
      es: makePar([
        "El cerebro humano es el objeto más complejo conocido en el universo. Contiene aproximadamente 86.000 millones de neuronas, cada una conectada con otras miles, formando una red de unos 100 billones de conexiones sinápticas. Esta red es tan compleja que algunos científicos comparan su estructura con la del universo mismo a gran escala.",
        "Las neuronas se comunican entre sí mediante señales eléctricas y químicas. Una señal puede viajar a velocidades de hasta 120 metros por segundo. Cuando aprendes algo nuevo, las conexiones entre neuronas se fortalecen. Cuando repites algo, se vuelven más eficientes. Por eso la práctica es tan importante para aprender cualquier habilidad: literalmente estás construyendo caminos en tu cerebro.",
        "El cerebro consume aproximadamente el 20% de la energía del cuerpo, aunque representa solo el 2% de nuestro peso. Esta energía se usa principalmente para mantener el delicado equilibrio eléctrico de las neuronas. Incluso cuando estamos en reposo, el cerebro está activo, procesando información, consolidando recuerdos y preparándose para el día siguiente.",
        "Dormir es fundamental para la salud del cerebro. Durante el sueño, el cerebro procesa la información del día, fortalece recuerdos importantes y elimina desechos metabólicos que se acumulan durante la vigilia. El sistema glinfático, descubierto recientemente, actúa como un sistema de limpieza que elimina toxinas del cerebro mientras dormimos. La falta de sueño afecta la memoria, la concentración y el estado de ánimo.",
        "Los sentidos son las ventanas del cerebro al mundo. La vista es el sentido más dominante: aproximadamente un tercio del cerebro está dedicado a procesar información visual. El oído puede detectar cambios de presión de menos de una milmillonésima parte de la presión atmosférica. El olfato está directamente conectado a las áreas del cerebro que procesan emociones y recuerdos, por eso ciertos olores pueden traer recuerdos vívidos del pasado.",
        "La neuroplasticidad es una de las propiedades más sorprendentes del cerebro. Es la capacidad del cerebro de cambiar, adaptarse y reorganizarse a lo largo de la vida. Durante mucho tiempo se creyó que el cerebro adulto era fijo e inmutable, pero ahora sabemos que puede crear nuevas neuronas y conexiones incluso en la vejez. Aprender un idioma nuevo, tocar un instrumento o viajar estimula esta plasticidad y mantiene el cerebro joven.",
      ]),
      en: makePar([
        "The human brain is the most complex object known in the universe. It contains approximately 86 billion neurons, each connected to thousands of others, forming a network of about 100 trillion synaptic connections. This network is so complex that some scientists compare its structure to that of the universe itself on a large scale.",
        "Neurons communicate with each other through electrical and chemical signals. A signal can travel at speeds of up to 120 meters per second. When you learn something new, the connections between neurons strengthen. When you repeat something, they become more efficient. That is why practice is so important for learning any skill: you are literally building pathways in your brain.",
        "The brain consumes approximately 20% of the body's energy, even though it represents only 2% of our weight. This energy is mainly used to maintain the delicate electrical balance of neurons. Even when we are at rest, the brain is active, processing information, consolidating memories, and preparing for the next day.",
        "Sleeping is fundamental for brain health. During sleep, the brain processes the day's information, strengthens important memories, and eliminates metabolic waste that accumulates during wakefulness. The glymphatic system, recently discovered, acts as a cleaning system that removes toxins from the brain while we sleep. Lack of sleep affects memory, concentration, and mood.",
        "The senses are the brain's windows to the world. Sight is the most dominant sense: approximately one-third of the brain is dedicated to processing visual information. Hearing can detect pressure changes of less than one billionth of atmospheric pressure. Smell is directly connected to the brain areas that process emotions and memories, which is why certain smells can bring back vivid memories from the past.",
        "Neuroplasticity is one of the most surprising properties of the brain. It is the brain's ability to change, adapt, and reorganize throughout life. For a long time, it was believed that the adult brain was fixed and unchangeable, but we now know that it can create new neurons and connections even in old age. Learning a new language, playing an instrument, or traveling stimulates this plasticity and keeps the brain young.",
      ]),
    },
    {
      es: makePar([
        "El sistema inmunológico es el ejército personal de nuestro cuerpo. Está compuesto por una red compleja de células, tejidos y órganos que trabajan juntos para defendernos de invasores externos como virus, bacterias y hongos. Cuando funciona correctamente, ni siquiera notamos su presencia. Pero cuando falla, pueden aparecer enfermedades.",
        "Los glóbulos blancos son los soldados de este ejército. Hay varios tipos especializados: los neutrófilos son la primera línea de defensa; los linfocitos B producen anticuerpos que reconocen y neutralizan patógenos específicos; los linfocitos T matan células infectadas y coordinan la respuesta inmunológica. Cada uno tiene un papel crucial en la defensa del organismo.",
        "Una de las capacidades más asombrosas del sistema inmunológico es la memoria. Cuando te encuentras con un virus por primera vez, tu cuerpo tarda varios días en producir los anticuerpos adecuados. Pero la próxima vez que ese mismo virus intente infectarte, el sistema inmunológico lo reconocerá y responderá mucho más rápido. Esto es lo que hacen las vacunas: entrenan a tu sistema inmunológico sin causar la enfermedad.",
        "El sistema digestivo es otro ejemplo de ingeniería biológica perfecta. Desde que la comida entra por la boca hasta que sale, recorre un camino de aproximadamente nueve metros a través del cuerpo. En el estómago, los ácidos y enzimas descomponen los alimentos. En el intestino delgado, que mide unos seis metros, los nutrientes se absorben y pasan a la sangre.",
        "El microbioma intestinal es un ecosistema de billones de bacterias que viven en nuestro intestino. Estas bacterias nos ayudan a digerir alimentos, producen vitaminas esenciales, influyen en nuestro estado de ánimo y fortalecen nuestro sistema inmunológico. Cada persona tiene un microbioma único, como una huella digital interna.",
        "La piel es el órgano más grande del cuerpo humano. Un adulto promedio tiene aproximadamente 1,8 metros cuadrados de piel. Actúa como una barrera protectora, regula la temperatura corporal y nos permite sentir el tacto, la presión, el calor y el frío. La piel se regenera completamente cada 27 días aproximadamente.",
      ]),
      en: makePar([
        "The immune system is our body's personal army. It is composed of a complex network of cells, tissues, and organs that work together to defend us against external invaders such as viruses, bacteria, and fungi. When it works correctly, we do not even notice its presence. But when it fails, diseases can appear.",
        "White blood cells are the soldiers of this army. There are several specialized types: neutrophils are the first line of defense; B lymphocytes produce antibodies that recognize and neutralize specific pathogens; T lymphocytes kill infected cells and coordinate the immune response. Each one has a crucial role in defending the body.",
        "One of the most amazing abilities of the immune system is memory. When you encounter a virus for the first time, your body takes several days to produce the right antibodies. But the next time that same virus tries to infect you, the immune system will recognize it and respond much faster. This is what vaccines do: they train your immune system without causing the disease.",
        "The digestive system is another example of perfect biological engineering. From the moment food enters the mouth until it exits, it travels a path of approximately nine meters through the body. In the stomach, acids and enzymes break down food. In the small intestine, which measures about six meters, nutrients are absorbed and pass into the blood.",
        "The gut microbiome is an ecosystem of trillions of bacteria that live in our intestine. These bacteria help us digest food, produce essential vitamins, influence our mood, and strengthen our immune system. Each person has a unique microbiome, like an internal fingerprint.",
        "The skin is the largest organ of the human body. An average adult has approximately 1.8 square meters of skin. It acts as a protective barrier, regulates body temperature, and allows us to feel touch, pressure, heat, and cold. The skin completely regenerates approximately every 27 days.",
      ]),
    },
    {
      es: makePar([
        "El esqueleto humano está formado por 206 huesos en la edad adulta. Al nacer tenemos alrededor de 270 huesos, pero algunos se fusionan durante el crecimiento. Los huesos son órganos vivos que se renuevan constantemente. Cada siete años aproximadamente, reemplazamos la mayoría de nuestras células óseas. El hueso más pequeño es el estribo, en el oído medio, que mide apenas tres milímetros.",
        "Los músculos son los motores del movimiento. Tenemos más de 600 músculos en el cuerpo, que representan aproximadamente el 40% de nuestro peso total. El músculo más potente en relación a su tamaño es el masetero, en la mandíbula, que puede ejercer una fuerza de hasta 90 kilogramos al morder. El más largo es el sartorio, que va desde la cadera hasta la rodilla.",
        "El ojo humano es un órgano extraordinario. Puede distinguir hasta 10 millones de colores diferentes y es capaz de detectar un solo fotón de luz. El ojo procesa unas 36.000 piezas de información por hora. La retina tiene aproximadamente 120 millones de bastones para la visión en blanco y negro con poca luz y 6 millones de conos para la visión en color.",
        "El oído no solo nos permite escuchar. También es responsable del equilibrio. En el oído interno hay tres canales semicirculares llenos de líquido y pequeños pelos sensoriales que detectan el movimiento de la cabeza. Cuando estos canales se alteran, el cerebro recibe señales contradictorias y sentimos mareo.",
        "El sentido del olfato está íntimamente ligado al gusto. La lengua tiene aproximadamente 10.000 papilas gustativas, pero solo detecta cinco sabores básicos: dulce, salado, amargo, ácido y umami. La complejidad de los sabores que percibimos al comer proviene principalmente del olfato. Por eso cuando tenemos la nariz tapada la comida parece no tener sabor.",
        "Cuidar nuestro cuerpo es la mejor inversión que podemos hacer. Una alimentación equilibrada, ejercicio regular, sueño suficiente y gestión del estrés son los pilares de una vida saludable. El cuerpo humano tiene una capacidad de recuperación asombrosa: puede sanar heridas, combatir enfermedades y adaptarse a condiciones extremas.",
      ]),
      en: makePar([
        "The human skeleton is made up of 206 bones in adulthood. At birth we have about 270 bones, but some fuse together during growth. Bones are living organs that constantly renew themselves. Approximately every seven years, we replace most of our bone cells. The smallest bone is the stirrup, in the middle ear, measuring barely three millimeters.",
        "Muscles are the engines of movement. We have more than 600 muscles in the body, representing approximately 40% of our total weight. The most powerful muscle relative to its size is the masseter, in the jaw, which can exert a force of up to 90 kilograms when biting. The longest is the sartorius, running from the hip to the knee.",
        "The human eye is an extraordinary organ. It can distinguish up to 10 million different colors and is capable of detecting a single photon of light. The eye processes about 36,000 pieces of information per hour. The retina has approximately 120 million rods for black-and-white vision in low light and 6 million cones for color vision.",
        "The ear does not only allow us to hear. It is also responsible for balance. In the inner ear there are three semicircular canals filled with fluid and tiny sensory hairs that detect head movement. When these canals are disturbed, the brain receives contradictory signals and we feel dizzy.",
        "The sense of smell is intimately linked to taste. The tongue has approximately 10,000 taste buds, but it only detects five basic tastes: sweet, salty, bitter, sour, and umami. The complexity of flavors we perceive when eating comes mainly from smell. That is why when our nose is stuffy, food seems to have no taste.",
        "Taking care of our body is the best investment we can make. A balanced diet, regular exercise, sufficient sleep, and stress management are the pillars of a healthy life. The human body has an amazing capacity for recovery: it can heal wounds, fight diseases, and adapt to extreme conditions.",
      ]),
    },
  ],
};

const ciencia = {
  title: "Grandes descubrimientos científicos que cambiaron el mundo",
  author: "Dra. Natalia Ríos y Dr. Andrés Molina",
  description:
    "Desde la rueda hasta la inteligencia artificial, este libro recorre los descubrimientos más importantes de la historia de la ciencia y cómo transformaron nuestra forma de entender el mundo.",
  difficulty: 3, min_level: 1, estimated_minutes: 50, xp_base: 25,
  categories: [CATS.ciencia, CATS.historia, CATS.interesante], tags: [TAGS.popular],
  pages: [
    {
      es: makePar([
        "La ciencia no es solo una colección de datos y fórmulas. Es una historia fascinante de curiosidad humana, perseverancia y momentos de inspiración que han transformado nuestra comprensión del mundo. Cada descubrimiento científico es como una pieza de un rompecabezas gigante que la humanidad ha estado armando durante miles de años.",
        "Los primeros seres humanos ya hacían ciencia sin saberlo. Observaban el movimiento del sol, la luna y las estrellas para predecir las estaciones y saber cuándo plantar y cosechar. Aprendieron qué plantas eran comestibles y cuáles venenosas. Descubrieron cómo hacer fuego y cómo transformar la piedra en herramientas.",
        "La revolución agrícola, hace unos 10.000 años, fue probablemente el primer gran avance tecnológico de la humanidad. Aprender a cultivar plantas y domesticar animales cambió para siempre nuestra forma de vivir. Las personas pudieron establecerse en un lugar fijo, construir ciudades y desarrollar civilizaciones.",
        "La invención de la escritura, hace unos 5.000 años, fue otro salto gigantesco. Permitió registrar el conocimiento y transmitirlo de generación en generación sin depender de la memoria oral. Las primeras formas de escritura surgieron en Mesopotamia, Egipto, China y Mesoamérica.",
        "Los antiguos griegos fueron los primeros en hacer ciencia de manera sistemática. Filósofos como Aristóteles, Pitágoras y Arquímedes observaban la naturaleza, hacían preguntas y buscaban explicaciones racionales. Aristóteles clasificó cientos de especies de animales. Arquímedes descubrió principios fundamentales de la física.",
        "Pero la ciencia no avanzó en línea recta. Hubo períodos de gran progreso y otros de estancamiento. La caída del Imperio Romano sumergió a Europa en la Edad Media. Sin embargo, en el mundo islámico, la ciencia floreció. Académicos como Al-Juarismi, Avicena y Alhacén hicieron contribuciones fundamentales en matemáticas, medicina y óptica.",
      ]),
      en: makePar([
        "Science is not just a collection of data and formulas. It is a fascinating story of human curiosity, perseverance, and moments of inspiration that have transformed our understanding of the world. Each scientific discovery is like a piece of a giant puzzle that humanity has been assembling for thousands of years.",
        "The first human beings were already doing science without knowing it. They observed the movement of the sun, moon, and stars to predict the seasons and know when to plant and harvest. They learned which plants were edible and which were poisonous. They discovered how to make fire and how to transform stone into tools.",
        "The agricultural revolution, about 10,000 years ago, was probably humanity's first great technological advance. Learning to cultivate plants and domesticate animals changed our way of living forever. People could settle in a fixed place, build cities, and develop civilizations.",
        "The invention of writing, about 5,000 years ago, was another gigantic leap. It allowed knowledge to be recorded and transmitted from generation to generation without relying on oral memory. The first forms of writing emerged in Mesopotamia, Egypt, China, and Mesoamerica.",
        "The ancient Greeks were the first to do science systematically. Philosophers like Aristotle, Pythagoras, and Archimedes observed nature, asked questions, and sought rational explanations. Aristotle classified hundreds of animal species. Archimedes discovered fundamental principles of physics.",
        "But science did not advance in a straight line. There were periods of great progress and others of stagnation. The fall of the Roman Empire plunged Europe into the Middle Ages. However, in the Islamic world, science flourished. Scholars like Al-Khwarizmi, Avicenna, and Alhazen made fundamental contributions.",
      ]),
    },
    {
      es: makePar([
        "El Renacimiento marcó el renacer de la ciencia en Europa. Nicolás Copérnico revolucionó la astronomía al proponer que la Tierra no era el centro del universo, sino que orbitaba alrededor del Sol. Esta idea, llamada heliocentrismo, contradecía siglos de enseñanza de la Iglesia y fue recibida con gran resistencia.",
        "Galileo Galilei fue otro gigante de la ciencia. Mejoró el telescopio y lo usó para observar los cielos, descubriendo las lunas de Júpiter, las fases de Venus y las manchas solares. Sus observaciones apoyaban la teoría de Copérnico. Por sus ideas, fue juzgado por la Inquisición y pasó el resto de su vida bajo arresto domiciliario.",
        "Isaac Newton es posiblemente el científico más influyente de la historia. En solo un año desarrolló el cálculo matemático, la teoría de la gravedad y las leyes del movimiento. Sus tres leyes de la mecánica clásica y su ley de gravitación universal explicaban tanto el movimiento de los planetas como la caída de una manzana.",
        "La revolución científica del siglo XVII no solo cambió lo que sabíamos, sino también cómo lo sabíamos. Filósofos como Francis Bacon y René Descartes desarrollaron el método científico: observar, formular hipótesis, experimentar y concluir. Este método es la herramienta más poderosa que tenemos para entender la naturaleza.",
        "En el siglo XVIII, la ciencia se diversificó. Antoine Lavoisier, padre de la química moderna, identificó el oxígeno y estableció la ley de conservación de la masa. Carl Linneo creó el sistema de clasificación de los seres vivos. Benjamin Franklin demostró que los rayos eran descargas eléctricas.",
        "El siglo XIX fue testigo de descubrimientos transformadores. Charles Darwin propuso la teoría de la evolución mediante selección natural. Louis Pasteur desarrolló la teoría germinal de las enfermedades y creó las primeras vacunas. James Clerk Maxwell unificó la electricidad y el magnetismo en el electromagnetismo.",
      ]),
      en: makePar([
        "The Renaissance marked the rebirth of science in Europe. Nicolaus Copernicus revolutionized astronomy by proposing that Earth was not the center of the universe but orbited around the Sun. This idea, called heliocentrism, contradicted centuries of Church teaching and was met with great resistance.",
        "Galileo Galilei was another giant of science. He improved the telescope and used it to observe the skies, discovering Jupiter's moons, Venus's phases, and sunspots. His observations supported Copernicus's theory. For his ideas, he was tried by the Inquisition and spent the rest of his life under house arrest.",
        "Isaac Newton is arguably the most influential scientist in history. In just one year he developed mathematical calculus, the theory of gravity, and the laws of motion. His three laws of classical mechanics and his universal law of gravitation explained both the movement of planets and the fall of an apple.",
        "The scientific revolution of the 17th century changed not only what we knew, but also how we knew it. Philosophers like Francis Bacon and René Descartes developed the scientific method: observe, hypothesize, experiment, and conclude. This method is the most powerful tool we have for understanding nature.",
        "In the 18th century, science diversified. Antoine Lavoisier, father of modern chemistry, identified oxygen and established the law of conservation of mass. Carl Linnaeus created the classification system for living things. Benjamin Franklin demonstrated that lightning was electrical discharge.",
        "The 19th century witnessed transformative discoveries. Charles Darwin proposed the theory of evolution by natural selection. Louis Pasteur developed the germ theory of disease and created the first vaccines. James Clerk Maxwell unified electricity and magnetism into electromagnetism.",
      ]),
    },
    {
      es: makePar([
        "La ciencia del siglo XX superó todo lo que se había logrado antes. Albert Einstein publicó su teoría de la relatividad especial en 1905 y la teoría de la relatividad general en 1915, revolucionando nuestra comprensión del espacio, el tiempo y la gravedad. La famosa ecuación E=mc² mostró que masa y energía son equivalentes.",
        "La mecánica cuántica, desarrollada por científicos como Max Planck, Niels Bohr, Werner Heisenberg y Erwin Schrödinger, reveló un mundo extraño en la escala de los átomos. Descubrieron que las partículas pueden estar en múltiples lugares a la vez y que el observador afecta lo observado.",
        "El descubrimiento de la estructura del ADN por James Watson y Francis Crick en 1953 abrió las puertas a la biología molecular. Con la ayuda del trabajo de Rosalind Franklin, descubrieron la doble hélice que contiene las instrucciones genéticas de todos los seres vivos.",
        "La tecnología transformó la ciencia y la vida cotidiana. La invención del transistor en 1947 hizo posible la electrónica moderna. Los ordenadores pasaron de ocupar habitaciones enteras a caber en nuestros bolsillos. Internet conecta a miles de millones de personas. La inteligencia artificial promete ser la próxima gran revolución.",
        "La carrera espacial del siglo XX nos llevó a la Luna. En 1969, Neil Armstrong y Buzz Aldrin caminaron sobre la superficie lunar. Las misiones Apolo nos dieron una nueva perspectiva de nuestro planeta. Las fotografías de la Tierra desde el espacio inspiraron el movimiento ecologista moderno.",
        "Hoy, la ciencia enfrenta desafíos enormes: el cambio climático, las pandemias, la exploración espacial y la comprensión de la conciencia humana. Pero si la historia nos enseña algo, es que la curiosidad humana y el método científico pueden superar obstáculos que parecen imposibles. El próximo gran descubrimiento podría estar esperando a quien se atreva a preguntar: '¿Y por qué?'",
      ]),
      en: makePar([
        "20th century science surpassed everything achieved before. Albert Einstein published his special theory of relativity in 1905 and the general theory of relativity in 1915, revolutionizing our understanding of space, time, and gravity. The famous equation E=mc² showed that mass and energy are equivalent.",
        "Quantum mechanics, developed by scientists like Max Planck, Niels Bohr, Werner Heisenberg, and Erwin Schrödinger, revealed a strange world at the atomic scale. They discovered that particles can be in multiple places at once and that the observer affects the observed.",
        "The discovery of DNA's structure by James Watson and Francis Crick in 1953 opened the doors to molecular biology. With the help of Rosalind Franklin's work, they discovered the double helix that contains the genetic instructions of all living things.",
        "Technology transformed science and daily life. The invention of the transistor in 1947 made modern electronics possible. Computers went from occupying entire rooms to fitting in our pockets. The internet connects billions of people. Artificial intelligence promises to be the next great revolution.",
        "The 20th-century space race took us to the Moon. In 1969, Neil Armstrong and Buzz Aldrin walked on the lunar surface. The Apollo missions gave us a new perspective of our planet. Photographs of Earth from space inspired the modern environmental movement.",
        "Today, science faces enormous challenges: climate change, pandemics, space exploration, and understanding human consciousness. But if history teaches us anything, it is that human curiosity and the scientific method can overcome obstacles that seem impossible. The next great discovery could be waiting for someone brave enough to ask: 'Why?'",
      ]),
    },
  ],
};

(async () => {
  for (const b of [universo, cuerpo, ciencia]) {
    const { data: book, error: be } = await s
      .from("books")
      .insert({
        title: b.title,
        author: b.author,
        description: b.description,
        cover_url: "",
        difficulty: b.difficulty,
        min_level: b.min_level,
        estimated_minutes: b.estimated_minutes,
        xp_base: b.xp_base,
        total_pages: b.pages.length,
      })
      .select()
      .single();
    if (be) { console.error("Error:", be.message); continue; }
    console.log("✓", book.title);

    for (let i = 0; i < b.pages.length; i++) {
      const { data: page } = await s
        .from("book_pages")
        .insert({ book_id: book.id, page_number: i + 1 })
        .select()
        .single();
      await s.from("page_content").insert({ page_id: page.id, language: "es", content: b.pages[i].es, audio_url: null });
      await s.from("page_content").insert({ page_id: page.id, language: "en", content: b.pages[i].en, audio_url: null });
    }
    console.log("  →", b.pages.length, "páginas");

    for (const cid of b.categories) await s.from("book_categories").insert({ book_id: book.id, category_id: cid });
    for (const tid of b.tags) await s.from("book_tag_relations").insert({ book_id: book.id, tag_id: tid });
  }
  console.log("✅ 3 libros extensos insertados");
})();
