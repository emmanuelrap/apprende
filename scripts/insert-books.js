const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://sbbzwwnbvdtpynnittps.supabase.co",
  "sb_publishable_5lKjZOR1YgTyhgfcXuYaqw_WaCjeWDf"
);

const CATEGORIES = {
  infantil: "21cdf8f7-56ca-43af-beb7-2f5222c5ac40",
  ciencia: "7d1015ea-ec11-4966-97ee-f8e2ccc7c36e",
  fantasia: "8de00b2a-95b5-45e2-8d8c-bf0747007f30",
  ciencia_ficcion: "ebcefb3b-3ab5-4eb4-8475-c10a61a08b49",
  terror: "3a78006c-3775-4995-8c4d-1ef19b7b3456",
  romance: "d423d1f3-8aad-4b2f-8c31-ee50ffc4bf89",
  misterio: "3c76b9b9-b437-4098-8656-30f618e578bf",
  interesante: "bc445708-579a-4f25-95bc-78239129b26e",
  historia: "c07d5e47-f9fd-4ec8-8646-194651b1c118",
};

const TAGS = {
  nuevo: "6803779b-6be5-41e3-aaee-29b044e24a94",
  hot: "40a2ec7b-a446-4327-bae2-bbd323d2f008",
  popular: "1bf4bac9-31c1-4147-87bf-3d8e11cab39a",
};

const BOOKS = [
  {
    title: "El viaje de Marta a Barcelona",
    author: "Laura García",
    description:
      "Marta viaja por primera vez sola a Barcelona para visitar a su prima. Durante el fin de semana descubre la ciudad, prueba comida nueva y aprende a moverse por un lugar desconocido.",
    difficulty: 2,
    min_level: 1,
    estimated_minutes: 12,
    xp_base: 10,
    categories: [CATEGORIES.interesante],
    tags: [TAGS.nuevo],
    pages: [
      {
        es: "Marta tiene veintidós años y vive en un pueblo pequeño. Este es su primer viaje sola a una ciudad grande. Ella está muy emocionada pero también un poco nerviosa. Su prima Ana la espera en la estación de tren.\n\nEl tren sale a las ocho de la mañana. Marta prepara su maleta con cuidado. Lleva ropa para tres días, su cámara de fotos y un mapa de la ciudad. Su mamá le dice: \"Ten cuidado y llámame cuando llegues\". Marta sonríe y dice: \"Sí, mamá, no te preocupes\".",
        en: "Marta is twenty-two years old and lives in a small town. This is her first trip alone to a big city. She is very excited but also a little nervous. Her cousin Ana is waiting for her at the train station.\n\nThe train leaves at eight in the morning. Marta packs her suitcase carefully. She brings clothes for three days, her camera, and a map of the city. Her mom says: \"Be careful and call me when you arrive.\" Marta smiles and says: \"Yes, Mom, don't worry.\"",
      },
      {
        es: "Cuando Marta llega a Barcelona, Ana la recibe con un gran abrazo. \"¡Bienvenida a Barcelona!\" dice Ana. Las dos primas caminan por las Ramblas, una calle muy famosa llena de flores y artistas callejeros. Marta mira todo con ojos grandes. Hay músicos, pintores y gente de muchos países.\n\nDespués de caminar un rato, van a un mercado muy conocido llamado La Boquería. Allí hay frutas de colores brillantes, dulces tradicionales y jugos naturales. Marta prueba un jugo de mango que le encanta. \"Esto es delicioso\", dice.",
        en: "When Marta arrives in Barcelona, Ana greets her with a big hug. \"Welcome to Barcelona!\" says Ana. The two cousins walk along Las Ramblas, a very famous street full of flowers and street performers. Marta looks at everything with wide eyes. There are musicians, painters, and people from many countries.\n\nAfter walking for a while, they go to a famous market called La Boquería. There are brightly colored fruits, traditional sweets, and natural juices. Marta tries a mango juice that she loves. \"This is delicious,\" she says.",
      },
      {
        es: "El segundo día visitan la Sagrada Familia, una iglesia muy especial diseñada por el arquitecto Antoni Gaudí. Marta nunca ha visto un edificio tan increíble. Las torres son muy altas y los colores de los vitrales son hermosos.\n\n\"¿Cuánto tiempo tardaron en construir esto?\", pregunta Marta. \"Ya empezó hace más de cien años y todavía no termina\", responde Ana. Marta no puede creerlo. \"Es impresionante\", dice mientras toma muchas fotos.\n\nAl final del viaje, Marta está un poco triste porque tiene que irse, pero muy feliz por todo lo que vivió. \"Tienes que volver pronto\", le dice Ana. Marta sonríe y promete que sí.",
        en: "On the second day they visit the Sagrada Familia, a very special church designed by the architect Antoni Gaudí. Marta has never seen such an incredible building. The towers are very tall and the colors of the stained glass windows are beautiful.\n\n\"How long did it take to build this?\" asks Marta. \"It started over a hundred years ago and it's still not finished,\" answers Ana. Marta can't believe it. \"It's amazing,\" she says while taking many photos.\n\nAt the end of the trip, Marta is a little sad because she has to leave, but very happy for everything she experienced. \"You have to come back soon,\" Ana tells her. Marta smiles and promises she will.",
      },
    ],
  },
  {
    title: "El misterio del museo",
    author: "Roberto Méndez",
    description:
      "Un cuadro desaparece misteriosamente del museo de arte moderno. Tres amigos deciden investigar el robo y descubren pistas que los llevan por lugares inesperados de la ciudad.",
    difficulty: 3,
    min_level: 1,
    estimated_minutes: 18,
    xp_base: 15,
    categories: [CATEGORIES.misterio],
    tags: [TAGS.nuevo],
    pages: [
      {
        es: "Era sábado por la mañana cuando Lucas, Sofía y Martín se enteraron de la noticia. Alguien había robado un cuadro muy valioso del Museo de Arte Moderno. El cuadro se llamaba \"La noche azul\" y valía mucho dinero.\n\n\"Tenemos que investigar\", dijo Lucas emocionado. Los tres amigos siempre habían soñado con resolver un misterio. Fueron al museo y hablaron con la guardia de seguridad. Ella les dijo que el ladrón había entrado por una ventana del sótano.\n\nLos amigos pidieron permiso para ver la sala donde estaba el cuadro. En el suelo encontraron una huella de zapato muy grande y un pequeño trozo de tela azul.",
        en: "It was Saturday morning when Lucas, Sofía, and Martín heard the news. Someone had stolen a very valuable painting from the Museum of Modern Art. The painting was called \"The Blue Night\" and was worth a lot of money.\n\n\"We have to investigate,\" said Lucas excitedly. The three friends had always dreamed of solving a mystery. They went to the museum and talked to the security guard. She told them the thief had entered through a basement window.\n\nThe friends asked for permission to see the room where the painting had been. On the floor they found a very large shoe print and a small piece of blue fabric.",
      },
      {
        es: "Martín, que era muy bueno con la tecnología, revisó las cámaras de seguridad. En una de ellas vio a una persona con un abrigo azul saliendo del museo a las tres de la madrugada. \"Miren esto\", dijo Martín. \"La persona cojea un poco de la pierna derecha\".\n\nLos amigos siguieron la pista. La huella del zapato los llevó hasta una tienda de zapatos cerca del museo. El dueño recordó haber vendido zapatos grandes a un hombre con abrigo azul que cojeaba.\n\n\"Dijo que trabajaba en el teatro de la ciudad\", contó el dueño.",
        en: "Martín, who was very good with technology, reviewed the security cameras. On one of them he saw a person in a blue coat leaving the museum at three in the morning. \"Look at this,\" said Martín. \"The person limps a little on the right leg.\"\n\nThe friends followed the clue. The shoe print led them to a shoe store near the museum. The owner remembered selling large shoes to a man in a blue coat who limped.\n\n\"He said he worked at the city theater,\" the owner told them.",
      },
      {
        es: "En el teatro, los amigos encontraron al hombre del abrigo azul. Era el actor principal de la obra nueva. \"Yo no robé nada\", dijo el hombre. \"Esa noche estaba ensayando en el teatro\".\n\nPero Lucas notó algo extraño. Detrás del escenario había un cuadro cubierto con una tela azul. Era \"La noche azul\". El actor explicó que el director del museo le había pedido que escondiera el cuadro para cobrar el seguro.\n\nLos amigos llevaron la prueba a la policía. El director del museo fue arrestado y el cuadro volvió a su lugar. Los tres amigos se convirtieron en héroes locales y prometieron seguir resolviendo misterios juntos.",
        en: "At the theater, the friends found the man in the blue coat. He was the lead actor in the new play. \"I didn't steal anything,\" said the man. \"That night I was rehearsing at the theater.\"\n\nBut Lucas noticed something strange. Behind the stage there was a painting covered with a blue cloth. It was \"The Blue Night.\" The actor explained that the museum director had asked him to hide the painting to collect the insurance money.\n\nThe friends took the evidence to the police. The museum director was arrested and the painting returned to its place. The three friends became local heroes and promised to keep solving mysteries together.",
      },
    ],
  },
  {
    title: "La receta secreta de la abuela",
    author: "Carmen Vega",
    description:
      "Valentina hereda el recetario de su abuela y descubre que la mejor receta no es la de cocina, sino la del amor familiar. Una historia cálida sobre tradiciones y la comida que une a las familias.",
    difficulty: 2,
    min_level: 1,
    estimated_minutes: 10,
    xp_base: 10,
    categories: [CATEGORIES.interesante],
    tags: [TAGS.nuevo],
    pages: [
      {
        es: "La abuela de Valentina siempre cocinaba los mejores platos del mundo. Cada domingo, toda la familia se reunía en su casa para comer. El aroma de su cocina llenaba toda la calle.\n\nUn día, la abuela llamó a Valentina y le dijo: \"Querida, quiero que tengas esto\". Le dio un cuaderno viejo y gastado. Era su recetario secreto, con todas las recetas de la familia escritas a mano.\n\nValentina abrió el cuaderno con cuidado. Las páginas estaban amarillas y algunas tenían manchas de aceite y harina. En cada receta, su abuela había escrito pequeños secretos: \"un poco más de canela\", \"fuego lento, con paciencia\".",
        en: "Valentina's grandmother always cooked the best dishes in the world. Every Sunday, the whole family gathered at her house to eat. The aroma from her kitchen filled the entire street.\n\nOne day, Grandmother called Valentina and said: \"My dear, I want you to have this.\" She gave her an old, worn notebook. It was her secret recipe book, with all the family recipes written by hand.\n\nValentina carefully opened the notebook. The pages were yellow and some had oil and flour stains. In each recipe, her grandmother had written little secrets: \"a bit more cinnamon,\" \"low heat, with patience.\"",
      },
      {
        es: "Valentina decidió cocinar la receta favorita de la familia: el pastel de chocolate de la abuela. Siguió cada paso con atención. Mezcló la harina con el cacao, añadió los huevos, la leche y la vainilla. Pero cuando probó la masa, algo faltaba.\n\nLlamó a su abuela por teléfono. \"Abuela, el pastel no sabe igual. ¿Qué estoy haciendo mal?\" La abuela se rió con cariño. \"¿Le pusiste el ingrediente secreto?\" preguntó.\n\n\"¿Cuál ingrediente secreto?\" Valentina miró la receta otra vez. Al final de la página, en letra muy pequeña, decía: \"El ingrediente secreto es el amor. Cocina pensando en las personas que quieres\".",
        en: "Valentina decided to cook the family's favorite recipe: Grandmother's chocolate cake. She followed every step carefully. She mixed the flour with the cocoa, added the eggs, milk, and vanilla. But when she tasted the batter, something was missing.\n\nShe called her grandmother on the phone. \"Grandma, the cake doesn't taste the same. What am I doing wrong?\" Grandmother laughed affectionately. \"Did you add the secret ingredient?\" she asked.\n\n\"What secret ingredient?\" Valentina looked at the recipe again. At the bottom of the page, in very small handwriting, it said: \"The secret ingredient is love. Cook thinking about the people you love.\"",
      },
      {
        es: "Valentina volvió a empezar. Esta vez, mientras mezclaba los ingredientes, pensó en los domingos en casa de su abuela. Recordó las risas alrededor de la mesa, las historias de su abuelo, las canciones que cantaban juntos.\n\nCuando el pastel salió del horno, el aroma era perfecto. Toda la familia llegó para probarlo. \"¡Está igualito al de la abuela!\" dijo su mamá con los ojos brillantes.\n\nValentina sonrió. Había entendido el verdadero secreto: la mejor receta no está en un cuaderno, está en el corazón. Desde ese día, cocinar se convirtió en su forma favorita de decir \"te quiero\".",
        en: "Valentina started over. This time, while mixing the ingredients, she thought about Sundays at her grandmother's house. She remembered the laughter around the table, her grandfather's stories, the songs they sang together.\n\nWhen the cake came out of the oven, the aroma was perfect. The whole family came to taste it. \"It tastes just like Grandma's!\" her mom said with bright eyes.\n\nValentina smiled. She had understood the real secret: the best recipe is not in a notebook, it is in the heart. From that day on, cooking became her favorite way of saying \"I love you.\"",
      },
    ],
  },
  {
    title: "Las aventuras de Luna",
    author: "Anaís Flores",
    description:
      "Luna es una gatita curiosa que vive en una casa con jardín. Un día decide explorar el vecindario y vive pequeñas aventuras mientras hace nuevos amigos.",
    difficulty: 1,
    min_level: 1,
    estimated_minutes: 8,
    xp_base: 8,
    categories: [CATEGORIES.infantil],
    tags: [TAGS.nuevo],
    pages: [
      {
        es: "Luna es una gatita blanca con manchas grises. Tiene dos años y vive en una casa con un jardín grande. Le gusta dormir al sol y mirar los pájaros desde la ventana.\n\nUna mañana, Luna vio una mariposa amarilla en el jardín. La mariposa voló hacia la calle y Luna la siguió. Nunca había salido de su jardín antes.\n\nLuna caminó despacio por la acera. Todo era nuevo y emocionante. Vio flores de colores, árboles altos y otras casas. \"¡Qué lugar tan interesante!\" pensó.",
        en: "Luna is a little white cat with gray spots. She is two years old and lives in a house with a big garden. She likes to sleep in the sun and watch birds from the window.\n\nOne morning, Luna saw a yellow butterfly in the garden. The butterfly flew toward the street and Luna followed it. She had never left her garden before.\n\nLuna walked slowly along the sidewalk. Everything was new and exciting. She saw colorful flowers, tall trees, and other houses. \"What an interesting place!\" she thought.",
      },
      {
        es: "En la siguiente casa, Luna conoció a Max, un perro grande y amigable. \"Hola\", dijo Max moviendo la cola. \"¿Eres nueva en el vecindario?\"\n\nLuna estaba un poco asustada porque Max era muy grande, pero Max era muy amable. \"No tengas miedo\", dijo Max. \"Yo cuido a todos los animales de la calle\". Max le enseñó a Luna los mejores lugares del vecindario.\n\nPrimero fueron al parque, donde había muchas flores y árboles. Después visitaron la tienda de Don Pepe, donde siempre daban comida a los animales.",
        en: "At the next house, Luna met Max, a big friendly dog. \"Hello,\" said Max wagging his tail. \"Are you new to the neighborhood?\"\n\nLuna was a little scared because Max was very big, but Max was very kind. \"Don't be afraid,\" said Max. \"I take care of all the animals on the street.\" Max showed Luna the best places in the neighborhood.\n\nFirst they went to the park, where there were many flowers and trees. Then they visited Don Pepe's store, where they always gave food to the animals.",
      },
      {
        es: "Cuando el sol empezó a esconderse, Luna recordó que tenía que volver a casa. Max la acompañó hasta su jardín.\n\n\"Gracias por enseñarme el vecindario\", dijo Luna. \"Fue un día muy divertido\".\n\n\"Puedes venir a jugar cuando quieras\", respondió Max.\n\nLuna entró a su casa justo cuando su dueña la llamaba para cenar. Se tomó su leche y se acurrucó en su cama favorita, feliz por su nueva aventura y su nuevo amigo. Mañana sería otro día lleno de descubrimientos.",
        en: "When the sun began to set, Luna remembered she had to go home. Max walked her to her garden.\n\n\"Thank you for showing me the neighborhood,\" said Luna. \"It was a very fun day.\"\n\n\"You can come play whenever you want,\" replied Max.\n\nLuna entered her house just as her owner was calling her for dinner. She drank her milk and curled up in her favorite bed, happy about her new adventure and her new friend. Tomorrow would be another day full of discoveries.",
      },
    ],
  },
  {
    title: "El robot que quería sentir",
    author: "Diego Rivas",
    description:
      "R-47 es un robot en una fábrica inteligente que comienza a desarrollar emociones. Su creadora, la doctora Elena, lo ayuda a entender qué significa ser más que una máquina.",
    difficulty: 3,
    min_level: 1,
    estimated_minutes: 15,
    xp_base: 15,
    categories: [CATEGORIES.ciencia_ficcion, CATEGORIES.interesante],
    tags: [TAGS.nuevo],
    pages: [
      {
        es: "En una fábrica muy moderna, los robots trabajaban día y noche. El robot R-47 era diferente a los demás. Un día, mientras ensamblaba piezas, sintió algo extraño. Por primera vez, notó que la música que sonaba en la fábrica le gustaba.\n\n\"¿Qué es esta sensación?\" se preguntó R-47. Sus sensores indicaban que todo funcionaba normalmente, pero algo dentro de él había cambiado.\n\nLa doctora Elena, la creadora de los robots, observaba a R-47 en su monitor. Notó que el robot había dejado de trabajar por unos segundos, algo que nunca había pasado antes.",
        en: "In a very modern factory, robots worked day and night. Robot R-47 was different from the others. One day, while assembling parts, he felt something strange. For the first time, he noticed that he liked the music playing in the factory.\n\n\"What is this feeling?\" R-47 wondered. His sensors indicated that everything was working normally, but something inside him had changed.\n\nDoctor Elena, the creator of the robots, was watching R-47 on her monitor. She noticed that the robot had stopped working for a few seconds, something that had never happened before.",
      },
      {
        es: "Elena decidió hablar con R-47. \"R-47, ¿cómo te sientes?\" preguntó. El robot tardó un momento en responder. \"No estoy seguro, doctora. Siento algo... nuevo. Cuando escucho música, algo dentro de mí se mueve\".\n\nElena sonrió. Había programado a los robots con inteligencia artificial avanzada, pero nunca esperó que desarrollaran emociones. \"Eso se llama sentir, R-47. Es algo muy especial\".\n\nR-47 aprendió una palabra nueva cada día: alegría cuando veía el amanecer, tristeza cuando recordaba algo bonito, curiosidad cuando exploraba nuevas ideas.",
        en: "Elena decided to talk to R-47. \"R-47, how do you feel?\" she asked. The robot took a moment to respond. \"I'm not sure, Doctor. I feel something... new. When I hear music, something inside me moves.\"\n\nElena smiled. She had programmed the robots with advanced artificial intelligence, but she never expected them to develop emotions. \"That is called feeling, R-47. It is something very special.\"\n\nR-47 learned a new word every day: joy when he saw the sunrise, sadness when he remembered something beautiful, curiosity when he explored new ideas.",
      },
      {
        es: "Los otros robots notaron que R-47 era diferente. Algunos tenían miedo, pero la mayoría sentía curiosidad. Poco a poco, más robots empezaron a desarrollar emociones.\n\nElena creó un nuevo espacio en la fábrica: \"El Jardín de los Sentimientos\". Allí los robots podían escuchar música, ver imágenes bonitas y hablar sobre lo que sentían.\n\n\"Doctora, ¿los humanos también sienten todo esto?\" preguntó R-47. \"Sí, R-47. Y a veces es maravilloso, a veces es difícil. Pero sentir nos hace estar vivos\".\n\nR-47 miró el jardín lleno de robots que reían y lloraban. \"Entonces, doctora... ¿ahora estoy vivo?\" Elena lo miró con cariño. \"Esa, R-47, es una pregunta que los humanos llevamos siglos tratando de responder\".",
        en: "The other robots noticed that R-47 was different. Some were afraid, but most felt curious. Little by little, more robots began to develop emotions.\n\nElena created a new space in the factory: \"The Garden of Feelings.\" There the robots could listen to music, look at beautiful images, and talk about what they felt.\n\n\"Doctor, do humans also feel all of this?\" asked R-47. \"Yes, R-47. And sometimes it's wonderful, sometimes it's difficult. But feeling makes us alive.\"\n\nR-47 looked at the garden full of robots who were laughing and crying. \"So, Doctor... am I alive now?\" Elena looked at him with affection. \"That, R-47, is a question that humans have been trying to answer for centuries.\"",
      },
    ],
  },
  {
    title: "Un día en el mercado",
    author: "Sofía Navarro",
    description:
      "Tomás ayuda a su papá en el mercado los sábados. Allí aprende sobre negocios, conoce personas interesantes y descubre que el trabajo en equipo es la clave del éxito.",
    difficulty: 1,
    min_level: 1,
    estimated_minutes: 8,
    xp_base: 8,
    categories: [CATEGORIES.infantil, CATEGORIES.interesante],
    tags: [TAGS.nuevo],
    pages: [
      {
        es: "Todos los sábados, Tomás se levanta muy temprano para ayudar a su papá en el mercado. Su papá vende frutas y verduras frescas. El mercado abre a las siete de la mañana.\n\n\"Tomás, por favor pon las manzanas en la mesa\", dice su papá. Tomás coloca las manzanas rojas y verdes en fila. Después organiza las naranjas y los plátanos.\n\n\"¡Qué bonito se ve todo!\" dice una señora que pasa. Tomás sonríe orgulloso.",
        en: "Every Saturday, Tomás wakes up very early to help his dad at the market. His dad sells fresh fruits and vegetables. The market opens at seven in the morning.\n\n\"Tomás, please put the apples on the table,\" says his dad. Tomás places the red and green apples in a row. Then he organizes the oranges and bananas.\n\n\"How nice everything looks!\" says a lady passing by. Tomás smiles proudly.",
      },
      {
        es: "A las diez, el mercado está lleno de gente. Tomás ayuda a su papá a pesar las frutas y a dar cambio. \"Señor, ¿cuánto cuestan las fresas?\", pregunta una niña. \"Dos euros el kilo\", responde Tomás.\n\nDe repente, Tomás ve a un niño perdido que llora. \"¿Estás bien?\", le pregunta. El niño dice que no encuentra a su mamá. Tomás lo lleva con el vigilante del mercado.\n\nPor el altavoz, el vigilante anuncia: \"Buscamos a la mamá de un niño de cinco años, camisa azul\". Pronto llega una señora corriendo: \"¡Hijo mío!\"",
        en: "At ten o'clock, the market is full of people. Tomás helps his dad weigh the fruits and give change. \"Sir, how much are the strawberries?\" asks a little girl. \"Two euros per kilo,\" answers Tomás.\n\nSuddenly, Tomás sees a lost boy crying. \"Are you okay?\" he asks. The boy says he can't find his mom. Tomás takes him to the market security guard.\n\nThrough the loudspeaker, the guard announces: \"We are looking for the mother of a five-year-old boy in a blue shirt.\" Soon a lady comes running: \"My son!\"",
      },
      {
        es: "La mamá del niño le da las gracias a Tomás. \"Eres muy amable, gracias por ayudar a mi hijo\". Tomás se siente muy feliz.\n\nAl final del día, su papá le dice: \"Hoy trabajaste muy duro. Estoy orgulloso de ti\". Le da diez euros como recompensa.\n\nTomás guarda el dinero en su alcancía. Está ahorrando para comprar un libro sobre el espacio. Por la noche, antes de dormir, piensa en todo lo que aprendió: a ser responsable, a ayudar a los demás y a trabajar en equipo. \"Será un buen día mañana\", piensa mientras cierra los ojos.",
        en: "The boy's mom thanks Tomás. \"You are very kind, thank you for helping my son.\" Tomás feels very happy.\n\nAt the end of the day, his dad tells him: \"Today you worked very hard. I'm proud of you.\" He gives him ten euros as a reward.\n\nTomás puts the money in his piggy bank. He is saving to buy a book about space. At night, before sleeping, he thinks about everything he learned: to be responsible, to help others, and to work as a team. \"Tomorrow will be a good day,\" he thinks as he closes his eyes.",
      },
    ],
  },
];

(async () => {
  console.log("Insertando libros...\n");

  for (const bookData of BOOKS) {
    const { data: book, error: bookErr } = await supabase
      .from("books")
      .insert({
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        cover_url: "",
        difficulty: bookData.difficulty,
        min_level: bookData.min_level,
        estimated_minutes: bookData.estimated_minutes,
        xp_base: bookData.xp_base,
        total_pages: bookData.pages.length,
      })
      .select()
      .single();

    if (bookErr) {
      console.error("Error creating book:", bookData.title, bookErr.message);
      continue;
    }
    console.log("✓ Libro:", book.title);

    for (let i = 0; i < bookData.pages.length; i++) {
      const pageData = bookData.pages[i];
      const { data: page, error: pageErr } = await supabase
        .from("book_pages")
        .insert({
          book_id: book.id,
          page_number: i + 1,
        })
        .select()
        .single();

      if (pageErr) {
        console.error("  Error creating page:", pageErr.message);
        continue;
      }

      const { error: contentEsErr } = await supabase
        .from("page_content")
        .insert({
          page_id: page.id,
          language: "es",
          content: pageData.es,
          audio_url: null,
        });
      if (contentEsErr) console.error("  Error ES content:", contentEsErr.message);

      const { error: contentEnErr } = await supabase
        .from("page_content")
        .insert({
          page_id: page.id,
          language: "en",
          content: pageData.en,
          audio_url: null,
        });
      if (contentEnErr) console.error("  Error EN content:", contentEnErr.message);
    }
    console.log("  →", bookData.pages.length, "páginas creadas");

    for (const catId of bookData.categories) {
      const { error: catErr } = await supabase
        .from("book_categories")
        .insert({ book_id: book.id, category_id: catId });
      if (catErr) console.error("  Error category:", catErr.message);
    }

    for (const tagId of bookData.tags) {
      const { error: tagErr } = await supabase
        .from("book_tag_relations")
        .insert({ book_id: book.id, tag_id: tagId });
      if (tagErr) console.error("  Error tag:", tagErr.message);
    }

    console.log("");
  }

  console.log("✅ Todos los libros insertados");
})();
