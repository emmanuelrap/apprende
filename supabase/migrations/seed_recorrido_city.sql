-- Seed: "Exploring the City with Ana" learning path
-- 3 progressive books (A1 → A2 → B1) about Ana exploring her city

-- Books
INSERT INTO books (id, title, author, description, cover_url, total_pages, difficulty, estimated_minutes, xp_base, min_level)
VALUES
  ('a0000000-a001-4000-a000-000000000001', 'My Neighborhood', 'Apprende', 'Ana introduces her neighborhood. A simple story with basic vocabulary about houses, parks, and stores. Perfect for beginners.', NULL, 3, 1, 10, 10, 1),
  ('a0000000-a002-4000-a000-000000000002', E'Ana\'s Day Out', 'Apprende', 'Ana goes to the market with her mother. A story with past tense and everyday vocabulary about shopping and food.', NULL, 4, 2, 15, 15, 1),
  ('a0000000-a003-4000-a000-000000000003', 'The Big Surprise', 'Apprende', 'Ana prepares a presentation about the city museum. A richer narrative with descriptive language and complex sentences.', NULL, 5, 3, 20, 20, 2);

-- Pages
INSERT INTO book_pages (id, book_id, page_number) VALUES
  ('a0000000-b101-4000-a000-000000000001', 'a0000000-a001-4000-a000-000000000001', 1),
  ('a0000000-b102-4000-a000-000000000002', 'a0000000-a001-4000-a000-000000000001', 2),
  ('a0000000-b103-4000-a000-000000000003', 'a0000000-a001-4000-a000-000000000001', 3),
  ('a0000000-b201-4000-a000-000000000001', 'a0000000-a002-4000-a000-000000000002', 1),
  ('a0000000-b202-4000-a000-000000000002', 'a0000000-a002-4000-a000-000000000002', 2),
  ('a0000000-b203-4000-a000-000000000003', 'a0000000-a002-4000-a000-000000000002', 3),
  ('a0000000-b204-4000-a000-000000000004', 'a0000000-a002-4000-a000-000000000002', 4),
  ('a0000000-b301-4000-a000-000000000001', 'a0000000-a003-4000-a000-000000000003', 1),
  ('a0000000-b302-4000-a000-000000000002', 'a0000000-a003-4000-a000-000000000003', 2),
  ('a0000000-b303-4000-a000-000000000003', 'a0000000-a003-4000-a000-000000000003', 3),
  ('a0000000-b304-4000-a000-000000000004', 'a0000000-a003-4000-a000-000000000003', 4),
  ('a0000000-b305-4000-a000-000000000005', 'a0000000-a003-4000-a000-000000000003', 5);

-- Content (Book 1)
INSERT INTO page_content (page_id, language, content) VALUES
  ('a0000000-b101-4000-a000-000000000001', 'en', 'Hello! My name is Ana. I am seven years old. I live in a small house on Green Street. There is a big tree in front of my house. I like my house very much. My room has a blue bed and a white desk. I have many books on my shelf. Every morning, I open the window and feel the fresh air. It makes me happy.'),
  ('a0000000-b101-4000-a000-000000000001', 'es', '¡Hola! Me llamo Ana. Tengo siete años. Vivo en una casa pequeña en la Calle Verde. Hay un árbol grande enfrente de mi casa. Me gusta mucho mi casa. Mi cuarto tiene una cama azul y un escritorio blanco. Tengo muchos libros en mi estante. Cada mañana, abro la ventana y siento el aire fresco. Me hace feliz.'),
  ('a0000000-b102-4000-a000-000000000002', 'en', 'There is a park near my house. I play in the park with my friends. We run and jump. The park has a big slide and a swing. I love the slide! My best friend is named Sofia. She lives next to the park. We like to play together. Sometimes we bring a ball and play catch. The park is my favorite place.'),
  ('a0000000-b102-4000-a000-000000000002', 'es', 'Hay un parque cerca de mi casa. Juego en el parque con mis amigos. Corremos y saltamos. El parque tiene un tobogán grande y un columpio. ¡Me encanta el tobogán! Mi mejor amiga se llama Sofía. Ella vive al lado del parque. Nos gusta jugar juntas. A veces traemos una pelota y jugamos a atraparla. El parque es mi lugar favorito.'),
  ('a0000000-b103-4000-a000-000000000003', 'en', 'There is a small store on my street. It sells candy and toys. Sometimes I buy candy. The store owner is very nice. His name is Mr. Lee. He always says hello to me. The store has many colors. I see red lollipops, blue balloons, and yellow balls. I like my neighborhood. It has my house, the park, and the store. I feel safe and happy here.'),
  ('a0000000-b103-4000-a000-000000000003', 'es', 'Hay una tienda pequeña en mi calle. Vende dulces y juguetes. A veces compro dulces. El dueño de la tienda es muy amable. Se llama el Sr. Lee. Siempre me saluda. La tienda tiene muchos colores. Veo piruletas rojas, globos azules y pelotas amarillas. Me gusta mi vecindario. Tiene mi casa, el parque y la tienda. Me siento segura y feliz aquí.');

-- Content (Book 2)
INSERT INTO page_content (page_id, language, content) VALUES
  ('a0000000-b201-4000-a000-000000000001', 'en', 'Yesterday was Saturday. Ana woke up early. She looked out the window. The sun was shining. "What a beautiful day!" she said. She decided to go to the market with her mother. She put on her favorite dress and her red shoes. Her mother called her from the kitchen. "Ana, breakfast is ready!" Ana ran downstairs happily.'),
  ('a0000000-b201-4000-a000-000000000001', 'es', 'Ayer fue sábado. Ana se despertó temprano. Miró por la ventana. El sol brillaba. "¡Qué día tan bonito!" dijo. Decidió ir al mercado con su mamá. Se puso su vestido favorito y sus zapatos rojos. Su mamá la llamó desde la cocina. "¡Ana, el desayuno está listo!" Ana bajó las escaleras felizmente.'),
  ('a0000000-b202-4000-a000-000000000002', 'en', 'The market was very busy. There were many people. Some were buying vegetables. Others were selling fresh fruit. Ana saw apples, bananas, and oranges. Everything looked delicious. She also saw carrots, lettuce, and tomatoes. The colors were beautiful. Red tomatoes, green lettuce, and orange carrots. Ana loved the market. There was so much to see and smell.'),
  ('a0000000-b202-4000-a000-000000000002', 'es', 'El mercado estaba muy lleno. Había mucha gente. Algunos compraban verduras. Otros vendían fruta fresca. Ana vio manzanas, plátanos y naranjas. Todo se veía delicioso. También vio zanahorias, lechuga y tomates. Los colores eran hermosos. Tomates rojos, lechuga verde y zanahorias anaranjadas. A Ana le encantaba el mercado. Había tanto que ver y oler.'),
  ('a0000000-b203-4000-a000-000000000003', 'en', E'Ana\'s mother bought some tomatoes and lettuce. Ana carried the bag. Then they saw a woman selling flowers. The flowers were red, yellow, and pink. Ana\'s mother bought a small bouquet. The woman smiled and gave Ana a yellow flower. "For you, little girl," she said. Ana thanked her and smelled the flower. It smelled wonderful. She put it in her hair.'),
  ('a0000000-b203-4000-a000-000000000003', 'es', 'La mamá de Ana compró tomates y lechuga. Ana cargó la bolsa. Luego vieron a una mujer vendiendo flores. Las flores eran rojas, amarillas y rosadas. La mamá de Ana compró un ramo pequeño. La mujer sonrió y le dio a Ana una flor amarilla. "Para ti, niña", dijo. Ana le agradeció y olió la flor. Olía maravilloso. Se la puso en el cabello.'),
  ('a0000000-b204-4000-a000-000000000004', 'en', 'On the way home, Ana felt happy. She helped her mother carry the bags. "Thank you, Ana," said her mother. Ana smiled. She loved spending time with her mother. They talked about the market and the flower lady. When they arrived home, Ana put the yellow flower in a small vase on her desk. It was a wonderful morning. She could not wait for next Saturday.'),
  ('a0000000-b204-4000-a000-000000000004', 'es', 'De camino a casa, Ana se sintió feliz. Ayudó a su mamá a cargar las bolsas. "Gracias, Ana", dijo su mamá. Ana sonrió. Le encantaba pasar tiempo con su mamá. Hablaron sobre el mercado y la mujer de las flores. Cuando llegaron a casa, Ana puso la flor amarilla en un jarrón pequeño sobre su escritorio. Fue una mañana maravillosa. No podía esperar al próximo sábado.');

-- Content (Book 3)
INSERT INTO page_content (page_id, language, content) VALUES
  ('a0000000-b301-4000-a000-000000000001', 'en', 'Last week, Ana''s teacher announced an exciting project. Each student had to prepare a presentation about their favorite place in the city. Ana thought carefully. She loved the city museum. She had visited it many times with her family. She decided to talk about the museum. She raised her hand and told the teacher her idea. The teacher smiled and said, "Excellent choice, Ana!"'),
  ('a0000000-b301-4000-a000-000000000001', 'es', 'La semana pasada, la maestra de Ana anunció un proyecto emocionante. Cada estudiante tenía que preparar una presentación sobre su lugar favorito de la ciudad. Ana pensó cuidadosamente. Le encantaba el museo de la ciudad. Lo había visitado muchas veces con su familia. Decidió hablar sobre el museo. Levantó la mano y le contó a la maestra su idea. La maestra sonrió y dijo: "¡Excelente elección, Ana!"'),
  ('a0000000-b302-4000-a000-000000000002', 'en', 'Ana spent the whole week researching. She learned that the museum had opened fifty years ago. It had three floors with different exhibitions. The first floor showed ancient artifacts. There were old tools, pottery, and coins from hundreds of years ago. The second floor had paintings by local artists. The third floor was dedicated to science, with interactive displays about space and dinosaurs.'),
  ('a0000000-b302-4000-a000-000000000002', 'es', 'Ana pasó toda la semana investigando. Aprendió que el museo había abierto hace cincuenta años. Tenía tres pisos con diferentes exhibiciones. El primer piso mostraba artefactos antiguos. Había herramientas viejas, cerámica y monedas de hace cientos de años. El segundo piso tenía pinturas de artistas locales. El tercer piso estaba dedicado a la ciencia, con exhibiciones interactivas sobre el espacio y los dinosaurios.'),
  ('a0000000-b303-4000-a000-000000000003', 'en', 'On Friday morning, it was Ana''s turn to present. She felt nervous. Her hands were a little sweaty. She took a deep breath and began to speak. She talked about the dinosaur skeleton in the entrance hall. She described the beautiful stained glass windows. She showed pictures she had drawn of her favorite exhibits. Everyone listened carefully. Her voice became stronger as she continued speaking.'),
  ('a0000000-b303-4000-a000-000000000003', 'es', 'El viernes por la mañana, llegó el turno de Ana. Se sentía nerviosa. Sus manos estaban un poco sudadas. Respiró profundamente y comenzó a hablar. Habló sobre el esqueleto de dinosaurio en la entrada. Describió los hermosos vitrales. Mostró dibujos que había hecho de sus exhibiciones favoritas. Todos escucharon con atención. Su voz se volvió más fuerte mientras seguía hablando.'),
  ('a0000000-b304-4000-a000-000000000004', 'en', 'When Ana finished, the class applauded. Her teacher smiled warmly. "Excellent work, Ana," she said. One of Ana''s classmates raised his hand. "I have never been to the museum," he said. "Now I really want to go!" Ana felt proud. Her presentation had inspired someone. She realized that sharing what you love can make others love it too. It was a valuable lesson.'),
  ('a0000000-b304-4000-a000-000000000004', 'es', 'Cuando Ana terminó, la clase aplaudió. Su maestra sonrió cálidamente. "Excelente trabajo, Ana", dijo. Uno de los compañeros de Ana levantó la mano. "Nunca he ido al museo", dijo. "¡Ahora tengo muchas ganas de ir!" Ana se sintió orgullosa. Su presentación había inspirado a alguien. Se dio cuenta de que compartir lo que amas puede hacer que otros también lo amen. Fue una lección valiosa.'),
  ('a0000000-b305-4000-a000-000000000005', 'en', 'That evening, Ana told her parents about the presentation. They decided to celebrate. On Saturday, the whole family would visit the museum together. Ana could show them everything she had learned. She went to bed with a big smile. It had been the best week ever. As she closed her eyes, she thought about the museum. She dreamed of becoming a scientist or an artist. The museum had opened a new world for her.'),
  ('a0000000-b305-4000-a000-000000000005', 'es', 'Esa tarde, Ana les contó a sus padres sobre la presentación. Decidieron celebrar. El sábado, toda la familia visitaría el museo juntos. Ana podría mostrarles todo lo que había aprendido. Se fue a la cama con una gran sonrisa. Había sido la mejor semana de todas. Mientras cerraba los ojos, pensaba en el museo. Soñaba con convertirse en científica o artista. El museo había abierto un mundo nuevo para ella.');

-- Vocabulary
INSERT INTO book_vocabulary (book_id, word_es, word_en, level) VALUES
  ('a0000000-a001-4000-a000-000000000001', 'casa', 'house', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'árbol', 'tree', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'parque', 'park', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'amigo', 'friend', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'tobogán', 'slide', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'columpio', 'swing', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'tienda', 'store', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'dulce', 'candy', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'calle', 'street', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'vecindario', 'neighborhood', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'feliz', 'happy', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'ventana', 'window', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'cama', 'bed', 'A1'),
  ('a0000000-a001-4000-a000-000000000001', 'juguete', 'toy', 'A1'),
  ('a0000000-a002-4000-a000-000000000002', 'despertarse', 'to wake up', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'brillar', 'to shine', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'mercado', 'market', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'gente', 'people', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'verdura', 'vegetable', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'fruta', 'fruit', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'flor', 'flower', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'ramo', 'bouquet', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'oler', 'to smell', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'jarrón', 'vase', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'vestido', 'dress', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'maravilloso', 'wonderful', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'cargar', 'to carry', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'comprar', 'to buy', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'vender', 'to sell', 'A2'),
  ('a0000000-a002-4000-a000-000000000002', 'delicioso', 'delicious', 'A2'),
  ('a0000000-a003-4000-a000-000000000003', 'proyecto', 'project', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'presentación', 'presentation', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'museo', 'museum', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'investigar', 'to research', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'exhibición', 'exhibition', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'artefacto', 'artifact', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'antiguo', 'ancient', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'pintura', 'painting', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'nervioso', 'nervous', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'aplaudir', 'to applaud', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'orgulloso', 'proud', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'inspirar', 'to inspire', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'celebrar', 'to celebrate', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'vitral', 'stained glass', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'esqueleto', 'skeleton', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'interactivo', 'interactive', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'científico', 'scientist', 'B1'),
  ('a0000000-a003-4000-a000-000000000003', 'lección', 'lesson', 'B1');

-- Categories (two-step insert to ensure clean data)
INSERT INTO categories (id, name, slug)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Aprendizaje', 'aprendizaje')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO book_categories (book_id, category_id) VALUES
  ('a0000000-a001-4000-a000-000000000001', '21cdf8f7-56ca-43af-beb7-2f5222c5ac40'),
  ('a0000000-a001-4000-a000-000000000001', 'a0000000-0000-0000-0000-000000000001'),
  ('a0000000-a002-4000-a000-000000000002', '21cdf8f7-56ca-43af-beb7-2f5222c5ac40'),
  ('a0000000-a002-4000-a000-000000000002', 'a0000000-0000-0000-0000-000000000001'),
  ('a0000000-a003-4000-a000-000000000003', '21cdf8f7-56ca-43af-beb7-2f5222c5ac40'),
  ('a0000000-a003-4000-a000-000000000003', 'a0000000-0000-0000-0000-000000000001');

-- Tags
INSERT INTO book_tag_relations (book_id, tag_id) VALUES
  ('a0000000-a001-4000-a000-000000000001', '6803779b-6be5-41e3-aaee-29b044e24a94'),
  ('a0000000-a002-4000-a000-000000000002', '6803779b-6be5-41e3-aaee-29b044e24a94'),
  ('a0000000-a003-4000-a000-000000000003', '6803779b-6be5-41e3-aaee-29b044e24a94');

-- Recorrido
INSERT INTO recorridos (id, title, description, difficulty, min_level, estimated_minutes, xp_reward, is_published, sort_order)
VALUES (
  'a0000000-0001-4000-a000-000000000001',
  'Exploring the City with Ana',
  'Follow Ana as she explores her neighborhood, visits the market, and discovers the city museum. This progressive learning path takes you from beginner to intermediate English.',
  1, 1, 45, 50, true, 1
);

INSERT INTO recorrido_books (recorrido_id, book_id, sort_order, required) VALUES
  ('a0000000-0001-4000-a000-000000000001', 'a0000000-a001-4000-a000-000000000001', 1, true),
  ('a0000000-0001-4000-a000-000000000001', 'a0000000-a002-4000-a000-000000000002', 2, true),
  ('a0000000-0001-4000-a000-000000000001', 'a0000000-a003-4000-a000-000000000003', 3, true);
