const { createClient } = require("@supabase/supabase-js");
const s = createClient(
  "https://sbbzwwnbvdtpynnittps.supabase.co",
  "sb_publishable_5lKjZOR1YgTyhgfcXuYaqw_WaCjeWDf"
);

const CATS = {
  infantil: "21cdf8f7-56ca-43af-beb7-2f5222c5ac40",
  ciencia: "7d1015ea-ec11-4966-97ee-f8e2ccc7c36e",
  interesante: "bc445708-579a-4f25-95bc-78239129b26e",
};
const TAGS = { nuevo: "6803779b-6be5-41e3-aaee-29b044e24a94" };

const makePar = (ps) => ps.join("\n\n");

const page = (es, en) => ({ es: makePar(es), en: makePar(en) });

const books = [
  {
    title: "Animales increíbles del mundo",
    author: "María Soledad Torres",
    description: "Descubre los animales más sorprendentes del planeta. Aprende dónde viven, qué comen y por qué son tan especiales. Un libro fácil de leer para jóvenes exploradores.",
    difficulty: 1, min_level: 1, estimated_minutes: 15, xp_base: 8,
    categories: [CATS.infantil, CATS.interesante], tags: [TAGS.nuevo],
    pages: [
      page([
        "Los elefantes son los animales más grandes que viven en la tierra. Un elefante adulto puede pesar hasta 7.000 kilogramos. Eso es como dos coches grandes juntos. Los elefantes tienen orejas muy grandes que usan para refrescarse. Cuando hace calor, mueven las orejas como si fueran abanicos.",
        "Los elefantes viven en África y en Asia. Les gusta vivir en grupos con su familia. La abuela es la jefa del grupo. Ella sabe dónde hay agua y comida. Los elefantes son muy inteligentes y tienen buena memoria. Pueden recordar caminos y lugares por muchos años.",
        "Los elefantes usan su trompa para muchas cosas: para comer, para beber agua, para bañarse y para saludar a otros elefantes. Les gusta mucho el agua. Nadan muy bien y juegan en los ríos. También se ponen barro en el cuerpo para protegerse del sol y de los insectos.",
        "Los elefantes están en peligro porque algunas personas cazan sus colmillos de marfil. Por eso es importante cuidarlos y protegerlos. En muchos países hay parques naturales donde los elefantes viven seguros. Así podemos asegurarnos de que los niños del futuro también puedan ver estos animales tan maravillosos.",
      ], [
        "Elephants are the largest animals that live on land. An adult elephant can weigh up to 7,000 kilograms. That is like two big cars together. Elephants have very large ears that they use to cool down. When it is hot, they move their ears like fans.",
        "Elephants live in Africa and Asia. They like to live in groups with their family. The grandmother is the leader of the group. She knows where there is water and food. Elephants are very intelligent and have good memory. They can remember paths and places for many years.",
        "Elephants use their trunk for many things: to eat, to drink water, to bathe, and to greet other elephants. They love water very much. They swim very well and play in rivers. They also put mud on their body to protect themselves from the sun and insects.",
        "Elephants are in danger because some people hunt their ivory tusks. That is why it is important to take care of them and protect them. In many countries there are natural parks where elephants live safely. This way we can make sure that future children can also see these wonderful animals.",
      ]),
      page([
        "Los delfines son animales muy inteligentes y juguetones. Viven en el mar pero respiran aire como nosotros. Por eso tienen que salir a la superficie para respirar. Pueden aguantar la respiración debajo del agua por unos 15 minutos. Los delfines duermen con un ojo abierto para vigilar.",
        "Los delfines viven en grupos llamados manadas. En una manada puede haber hasta 1.000 delfines. Ellos se comunican haciendo sonidos como clics y silbidos. Cada delfín tiene un silbido especial, como un nombre. Las mamás delfines les enseñan este silbido a sus bebés.",
        "Los delfines son muy amigables con las personas. A veces nadan cerca de los barcos y saltan sobre el agua. Les gusta jugar con las olas y saltar muy alto. Pueden saltar hasta 6 metros fuera del agua. Eso es más alto que una casa pequeña.",
        "Los delfines ayudan a otros animales cuando están heridos. Han salvado a nadadores en el mar llevándolos hacia la superficie para que respiren. También protegen a los miembros más débiles de su grupo. Los delfines nos enseñan que la amistad y la ayuda son muy importantes.",
      ], [
        "Dolphins are very intelligent and playful animals. They live in the sea but breathe air like us. That is why they have to come to the surface to breathe. They can hold their breath underwater for about 15 minutes. Dolphins sleep with one eye open to watch for danger.",
        "Dolphins live in groups called pods. A pod can have up to 1,000 dolphins. They communicate by making sounds like clicks and whistles. Each dolphin has a special whistle, like a name. Mother dolphins teach this whistle to their babies.",
        "Dolphins are very friendly with people. Sometimes they swim near boats and jump out of the water. They like to play with waves and jump very high. They can jump up to 6 meters out of the water. That is taller than a small house.",
        "Dolphins help other animals when they are hurt. They have saved swimmers in the sea by carrying them to the surface to breathe. They also protect the weaker members of their group. Dolphins teach us that friendship and helping others are very important.",
      ]),
      page([
        "Los pingüinos son aves que no pueden volar. Pero son nadadores excelentes. Usan sus alas como aletas para nadar muy rápido en el agua. Pueden nadar a 40 kilómetros por hora. Eso es más rápido que un coche en la ciudad. Los pingüinos pasan mucho tiempo en el mar buscando comida.",
        "Los pingüinos viven en lugares muy fríos como la Antártida. Tienen una capa gruesa de grasa y plumas que los mantienen calientes. Cuando hace mucho frío, los pingüinos se juntan en grupos grandes para darse calor. Se turnan para estar en el centro, donde hace más calor.",
        "El papá pingüino cuida el huevo mientras la mamá va a buscar comida. El papá mantiene el huevo caliente sobre sus pies y lo cubre con su panza. Puede estar así por dos meses sin comer. Cuando el bebé nace, los dos padres lo cuidan y le dan comida.",
        "Los pingüinos son muy divertidos de ver cuando caminan. Se balancean de un lado a otro. A veces se tiran al piso y se deslizan sobre la nieve como si fueran trineos. Los pingüinos nos muestran que trabajar en equipo y cuidar la familia es muy importante.",
      ], [
        "Penguins are birds that cannot fly. But they are excellent swimmers. They use their wings like flippers to swim very fast in the water. They can swim at 40 kilometers per hour. That is faster than a car in the city. Penguins spend a lot of time in the sea looking for food.",
        "Penguins live in very cold places like Antarctica. They have a thick layer of fat and feathers that keep them warm. When it is very cold, penguins gather in large groups to share warmth. They take turns being in the center, where it is warmest.",
        "The daddy penguin takes care of the egg while the mommy goes to find food. The daddy keeps the egg warm on his feet and covers it with his belly. He can stay like this for two months without eating. When the baby is born, both parents take care of it and give it food.",
        "Penguins are very funny to watch when they walk. They waddle from side to side. Sometimes they lie on the ground and slide on the snow like sleds. Penguins show us that working as a team and taking care of family is very important.",
      ]),
      page([
        "Los leones son conocidos como los reyes de la selva. Pero en realidad viven en la sabana africana, no en la selva. El león macho tiene una melena grande y hermosa alrededor de su cabeza. La melena lo protege cuando pelea con otros leones. Las leonas no tienen melena.",
        "Los leones viven en grupos llamados manadas. En una manada hay un macho, varias hembras y sus bebés. Las leonas son las que cazan para todo el grupo. Trabajan juntas para atrapar animales grandes como cebras y ñus. Los leones machos protegen al grupo de otros animales.",
        "Los leones duermen mucho, aproximadamente 20 horas al día. Cuando no están durmiendo, juegan, caminan por su territorio y cuidan a sus bebés. Los bebés leones se llaman cachorros. Nacen con manchas en el cuerpo que desaparecen cuando crecen.",
        "Los leones rugen para comunicarse con otros leones. Su rugido se puede escuchar hasta 8 kilómetros de distancia. Cada león tiene un rugido único, como una huella digital. El rugido del león nos recuerda que es un animal poderoso y majestuoso.",
      ], [
        "Lions are known as the kings of the jungle. But they actually live in the African savanna, not in the jungle. The male lion has a large and beautiful mane around his head. The mane protects him when he fights with other lions. Lionesses do not have manes.",
        "Lions live in groups called prides. In a pride there is one male, several females, and their babies. The lionesses are the ones who hunt for the whole group. They work together to catch large animals like zebras and wildebeests. Male lions protect the group from other animals.",
        "Lions sleep a lot, about 20 hours a day. When they are not sleeping, they play, walk through their territory, and take care of their babies. Baby lions are called cubs. They are born with spots on their body that disappear when they grow up.",
        "Lions roar to communicate with other lions. Their roar can be heard up to 8 kilometers away. Each lion has a unique roar, like a fingerprint. The lion's roar reminds us that it is a powerful and majestic animal.",
      ]),
    ],
  },
  {
    title: "El sistema solar para niños",
    author: "Luis Estrella",
    description: "Un viaje por nuestro sistema solar explicado de forma sencilla. Conoce el Sol, los planetas y otros objetos que flotan en el espacio. Perfecto para lectores jóvenes que sueñan con ser astronautas.",
    difficulty: 1, min_level: 1, estimated_minutes: 15, xp_base: 8,
    categories: [CATS.infantil, CATS.ciencia, CATS.interesante], tags: [TAGS.nuevo],
    pages: [
      page([
        "El Sol es una estrella muy grande y caliente. Está en el centro de nuestro sistema solar. Todos los planetas giran alrededor del Sol. La luz del Sol tarda 8 minutos en llegar a la Tierra. Sin el Sol, no habría vida en nuestro planeta. El Sol nos da luz y calor todos los días.",
        "El Sol es tan grande que dentro podrían caber un millón de Tierras. Pero en el espacio hay estrellas mucho más grandes. Su temperatura en la superficie es de aproximadamente 5.500 grados. Por eso no podemos mirar directamente al Sol, porque lastima nuestros ojos.",
        "A pesar de estar muy lejos, el Sol es muy importante para nosotros. Las plantas lo necesitan para crecer. Los paneles solares usan su luz para hacer electricidad. El Sol también ayuda a crear el viento y las nubes. El Sol es como una gran lámpara que ilumina todo el sistema solar.",
      ], [
        "The Sun is a very big and hot star. It is at the center of our solar system. All the planets orbit around the Sun. Sunlight takes 8 minutes to reach Earth. Without the Sun, there would be no life on our planet. The Sun gives us light and heat every day.",
        "The Sun is so big that a million Earths could fit inside it. But in space, there are much bigger stars. Its surface temperature is about 5,500 degrees. That is why we cannot look directly at the Sun, because it hurts our eyes.",
        "Even though it is very far away, the Sun is very important for us. Plants need it to grow. Solar panels use its light to make electricity. The Sun also helps create wind and clouds. The Sun is like a big lamp that lights up the whole solar system.",
      ]),
      page([
        "Mercurio es el planeta más cercano al Sol. Es muy pequeño, más pequeño que la Tierra. Durante el día hace mucho calor en Mercurio, hasta 430 grados. Pero por la noche hace mucho frío, baja a -180 grados. Mercurio no tiene atmósfera como la Tierra, por eso los cambios de temperatura son tan grandes.",
        "Venus es el segundo planeta desde el Sol. Es el planeta más caliente del sistema solar, incluso más que Mercurio. Esto pasa porque Venus tiene una atmósfera muy gruesa que atrapa el calor. En Venus, un día dura más que un año. El planeta gira muy lentamente.",
        "La Tierra es nuestro planeta. Es el único planeta que conocemos con vida. Tiene agua líquida, una atmósfera que nos protege y la temperatura perfecta para los seres vivos. La Tierra tarda 365 días en dar una vuelta alrededor del Sol. Eso es lo que llamamos un año.",
      ], [
        "Mercury is the closest planet to the Sun. It is very small, smaller than Earth. During the day it is very hot on Mercury, up to 430 degrees. But at night it is very cold, dropping to -180 degrees. Mercury does not have an atmosphere like Earth, so temperature changes are so big.",
        "Venus is the second planet from the Sun. It is the hottest planet in the solar system, even hotter than Mercury. This happens because Venus has a very thick atmosphere that traps heat. On Venus, a day lasts longer than a year. The planet rotates very slowly.",
        "Earth is our planet. It is the only planet we know with life. It has liquid water, an atmosphere that protects us, and the perfect temperature for living things. Earth takes 365 days to go around the Sun. That is what we call a year.",
      ]),
      page([
        "Marte es llamado el planeta rojo porque tiene ese color. Tiene el volcán más grande del sistema solar, se llama Monte Olimpo. Es tres veces más alto que el Monte Everest en la Tierra. Los científicos han enviado robots a Marte para estudiarlo. Quieren saber si alguna vez hubo vida allí.",
        "Júpiter es el planeta más grande del sistema solar. Es tan grande que todos los otros planetas podrían caber dentro de él. Júpiter tiene una mancha roja enorme que es una tormenta gigante. Esta tormenta ha estado activa por más de 300 años. Júpiter tiene más de 90 lunas.",
        "Saturno es famoso por sus anillos. Los anillos están hechos de hielo y rocas. Algunos son pequeños como granos de arena y otros son grandes como casas. Saturno es el segundo planeta más grande. Es tan ligero que flotaría en el agua si hubiera una bañera gigante.",
      ], [
        "Mars is called the red planet because of its color. It has the largest volcano in the solar system, called Olympus Mons. It is three times taller than Mount Everest on Earth. Scientists have sent robots to Mars to study it. They want to know if there was ever life there.",
        "Jupiter is the largest planet in the solar system. It is so big that all the other planets could fit inside it. Jupiter has a huge red spot that is a giant storm. This storm has been active for more than 300 years. Jupiter has more than 90 moons.",
        "Saturn is famous for its rings. The rings are made of ice and rocks. Some are small like grains of sand and others are big like houses. Saturn is the second largest planet. It is so light that it would float in water if there were a giant bathtub.",
      ]),
      page([
        "Urano es un planeta muy especial porque gira de lado. Mientras los otros planetas giran como trompos, Urano gira como si estuviera acostado. Esto pasa porque algo muy grande chocó con él hace mucho tiempo. Urano es de color azul verdoso por los gases en su atmósfera.",
        "Neptuno es el planeta más lejano del sistema solar. Es muy frío y ventoso. Los vientos en Neptuno son los más rápidos del sistema solar, pueden soplar a 2.000 kilómetros por hora. Neptuno es de color azul intenso. Tarda 165 años terrestres en dar una vuelta alrededor del Sol.",
        "Plutón ya no es considerado un planeta. Ahora lo llamamos planeta enano. Es muy pequeño y está muy lejos. Plutón es más pequeño que la Luna de la Tierra. A pesar de no ser un planeta, Plutón es un objeto muy interesante y tiene cinco lunas propias.",
      ], [
        "Uranus is a very special planet because it rotates on its side. While other planets spin like tops, Uranus spins like it is lying down. This happened because something very big crashed into it a long time ago. Uranus is blue-green because of gases in its atmosphere.",
        "Neptune is the farthest planet from the Sun. It is very cold and windy. The winds on Neptune are the fastest in the solar system, they can blow at 2,000 kilometers per hour. Neptune is deep blue. It takes 165 Earth years to go around the Sun once.",
        "Pluto is no longer considered a planet. Now we call it a dwarf planet. It is very small and very far away. Pluto is smaller than Earth's Moon. Even though it is not a planet, Pluto is a very interesting object and has five moons of its own.",
      ]),
    ],
  },
  {
    title: "Inventos que hicieron la vida más fácil",
    author: "Roberto Ingenio",
    description: "Conoce los inventos más importantes de la historia. Desde la bombilla hasta internet, descubre cómo personas creativas cambiaron el mundo con sus ideas. Lectura fácil para mentes curiosas.",
    difficulty: 2, min_level: 1, estimated_minutes: 18, xp_base: 10,
    categories: [CATS.infantil, CATS.interesante, CATS.ciencia], tags: [TAGS.nuevo],
    pages: [
      page([
        "La bombilla es uno de los inventos más importantes. Antes de la bombilla, la gente usaba velas y lámparas de aceite para ver en la noche. Thomas Alva Edison inventó la bombilla en 1879. Probó más de 1.000 materiales antes de encontrar uno que funcionara bien.",
        "La bombilla cambió la vida de las personas. Ahora podemos trabajar, leer y estudiar de noche. Las calles se volvieron más seguras con luz eléctrica. Las fábricas podían trabajar más horas. La bombilla iluminó el mundo y nunca más volvimos a estar en oscuridad.",
        "Hoy tenemos muchos tipos de bombillas: LED, fluorescentes y halógenas. Las luces LED gastan poca electricidad y duran mucho tiempo. Una bombilla LED puede durar hasta 25 años. Los inventos siempre mejoran con el tiempo, y la bombilla es un buen ejemplo de eso.",
        "Edison dijo una frase famosa: 'No fallé, solo encontré 10.000 formas que no funcionan'. Esta frase nos enseña que no debemos rendirnos cuando algo no sale bien. La perseverancia es muy importante para lograr grandes cosas, como inventar algo que ayuda a millones de personas.",
      ], [
        "The light bulb is one of the most important inventions. Before the light bulb, people used candles and oil lamps to see at night. Thomas Alva Edison invented the light bulb in 1879. He tried more than 1,000 materials before finding one that worked well.",
        "The light bulb changed people's lives. Now we can work, read, and study at night. Streets became safer with electric light. Factories could work more hours. The light bulb lit up the world and we never went back to darkness.",
        "Today we have many types of light bulbs: LED, fluorescent, and halogen. LED lights use little electricity and last a long time. An LED bulb can last up to 25 years. Inventions always improve over time, and the light bulb is a good example of that.",
        "Edison said a famous phrase: 'I have not failed. I've just found 10,000 ways that won't work.' This phrase teaches us that we should not give up when something does not work out. Perseverance is very important to achieve great things, like inventing something that helps millions of people.",
      ]),
      page([
        "El teléfono fue inventado por Alexander Graham Bell en 1876. Antes del teléfono, la gente tenía que enviar cartas o viajar largas distancias para hablar con alguien. El teléfono permitió que las personas se comunicaran al instante, aunque estuvieran lejos.",
        "El primer teléfono solo podía transmitir la voz a través de cables. Hoy tenemos teléfonos móviles que caben en nuestro bolsillo. Los teléfonos inteligentes no solo sirven para llamar, también para tomar fotos, navegar por internet, escuchar música y mucho más.",
        "Los teléfonos han cambiado mucho desde que Bell hizo la primera llamada. Dijo 'Señor Watson, venga aquí, lo necesito'. Esa fue la primera conversación por teléfono de la historia. Hoy podemos hablar con personas al otro lado del mundo en segundos.",
        "El teléfono nos conecta con nuestros seres queridos. Podemos llamar a nuestros abuelos, a nuestros amigos y a nuestra familia cuando queramos. La comunicación es muy importante para los seres humanos, y el teléfono nos ayuda a estar más cerca de quienes queremos.",
      ], [
        "The telephone was invented by Alexander Graham Bell in 1876. Before the telephone, people had to send letters or travel long distances to talk to someone. The telephone allowed people to communicate instantly, even if they were far away.",
        "The first telephone could only transmit voice through wires. Today we have mobile phones that fit in our pocket. Smartphones are not only for calling, but also for taking photos, browsing the internet, listening to music, and much more.",
        "Phones have changed a lot since Bell made the first call. He said 'Mr. Watson, come here, I need you.' That was the first telephone conversation in history. Today we can talk to people on the other side of the world in seconds.",
        "The phone connects us with our loved ones. We can call our grandparents, our friends, and our family whenever we want. Communication is very important for human beings, and the telephone helps us stay closer to those we love.",
      ]),
      page([
        "Internet es uno de los inventos más importantes de la historia moderna. Comenzó como un proyecto pequeño para conectar computadoras en universidades. Hoy conecta a miles de millones de personas en todo el mundo. Internet es como una biblioteca gigante que cabe en tu bolsillo.",
        "Con internet podemos aprender casi cualquier cosa. Podemos ver videos educativos, leer libros, hacer cursos y buscar información sobre cualquier tema. También podemos jugar con amigos, ver películas y escuchar música. Internet nos da acceso al conocimiento del mundo entero.",
        "Pero es importante usar internet con cuidado. No todo lo que vemos en internet es verdad. Debemos preguntar a un adulto si tenemos dudas. También es importante no pasar demasiado tiempo frente a la pantalla. El equilibrio entre el mundo digital y el mundo real es muy importante.",
        "Internet fue creado por muchas personas inteligentes que trabajaron juntas. Tim Berners-Lee inventó la World Wide Web en 1989, que es la parte de internet que usamos para ver páginas web. Él quería que el conocimiento fuera libre y accesible para todos. Gracias a su idea, hoy podemos aprender cualquier cosa.",
      ], [
        "The internet is one of the most important inventions of modern history. It started as a small project to connect computers in universities. Today it connects billions of people around the world. The internet is like a giant library that fits in your pocket.",
        "With the internet we can learn almost anything. We can watch educational videos, read books, take courses, and search for information about any topic. We can also play with friends, watch movies, and listen to music. The internet gives us access to the knowledge of the entire world.",
        "But it is important to use the internet carefully. Not everything we see on the internet is true. We should ask an adult if we have doubts. It is also important not to spend too much time in front of the screen. Balance between the digital world and the real world is very important.",
        "The internet was created by many smart people who worked together. Tim Berners-Lee invented the World Wide Web in 1989, which is the part of the internet we use to view websites. He wanted knowledge to be free and accessible to everyone. Thanks to his idea, today we can learn anything.",
      ]),
      page([
        "El avión fue inventado por los hermanos Wright en 1903. Orville y Wilbur Wright lograron que una máquina más pesada que el aire volara por primera vez. Su primer vuelo duró solo 12 segundos y recorrió 37 metros. ¡Menos que la longitud de un autobús!",
        "Hoy los aviones pueden llevar a cientos de personas a través del océano. Podemos viajar de un país a otro en horas, cuando antes tomaba semanas en barco. Los aviones nos permiten conocer culturas nuevas, visitar a nuestra familia lejana y explorar el mundo.",
        "Los aeropuertos son como ciudades pequeñas. Tienen tiendas, restaurantes y salas de espera. Los pilotos y las azafatas trabajan para que nuestro viaje sea seguro y agradable. Antes de volar, los aviones pasan por muchas revisiones para asegurarse de que todo funciona bien.",
        "Los hermanos Wright soñaban con volar desde que eran niños. Observaban los pájaros y querían imitarlos. Trabajaron mucho tiempo en su taller de bicicletas hasta que lograron construir su primer avión. Su historia nos enseña que los sueños se pueden hacer realidad con esfuerzo y dedicación.",
      ], [
        "The airplane was invented by the Wright brothers in 1903. Orville and Wilbur Wright made a machine heavier than air fly for the first time. Their first flight lasted only 12 seconds and traveled 37 meters. Less than the length of a bus!",
        "Today airplanes can carry hundreds of people across the ocean. We can travel from one country to another in hours, when before it took weeks by boat. Airplanes allow us to discover new cultures, visit our faraway family, and explore the world.",
        "Airports are like small cities. They have shops, restaurants, and waiting rooms. Pilots and flight attendants work to make our trip safe and pleasant. Before flying, airplanes go through many checks to make sure everything works well.",
        "The Wright brothers dreamed of flying since they were children. They watched birds and wanted to imitate them. They worked for a long time in their bicycle shop until they built their first airplane. Their story teaches us that dreams can come true with effort and dedication.",
      ]),
    ],
  },
];

(async () => {
  for (const b of books) {
    const { data: book, error: be } = await s
      .from("books")
      .insert({
        title: b.title, author: b.author, description: b.description,
        cover_url: "", difficulty: b.difficulty, min_level: b.min_level,
        estimated_minutes: b.estimated_minutes, xp_base: b.xp_base,
        total_pages: b.pages.length,
      }).select().single();
    if (be) { console.error("Error:", be.message); continue; }
    console.log("✓", book.title);

    for (let i = 0; i < b.pages.length; i++) {
      const { data: page } = await s
        .from("book_pages").insert({ book_id: book.id, page_number: i + 1 }).select().single();
      await s.from("page_content").insert({ page_id: page.id, language: "es", content: b.pages[i].es, audio_url: null });
      await s.from("page_content").insert({ page_id: page.id, language: "en", content: b.pages[i].en, audio_url: null });
    }
    console.log("  →", b.pages.length, "páginas");

    for (const cid of b.categories) await s.from("book_categories").insert({ book_id: book.id, category_id: cid });
    for (const tid of b.tags) await s.from("book_tag_relations").insert({ book_id: book.id, tag_id: tid });
  }
  console.log("✅ 3 libros A1/A2 insertados");
})();
