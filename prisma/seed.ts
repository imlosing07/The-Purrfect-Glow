// prisma/seed.ts
// Script de seed para The Purrfect Glow

import { PrismaClient, TagType, ShippingZone, ShippingModality, UsageTime, RoutineStep } from '@prisma/client';

const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════════
// TAGS (Tipos de piel, preocupaciones, categorías)
// ═══════════════════════════════════════════════════════════════

const tags = [
  // Tipo de piel
  { name: 'Piel Grasa', slug: 'piel-grasa', type: TagType.SKIN_TYPE },
  { name: 'Piel Seca', slug: 'piel-seca', type: TagType.SKIN_TYPE },
  { name: 'Piel Mixta', slug: 'piel-mixta', type: TagType.SKIN_TYPE },
  { name: 'Piel Sensible', slug: 'piel-sensible', type: TagType.SKIN_TYPE },
  { name: 'Piel Acnéica', slug: 'piel-acneica', type: TagType.SKIN_TYPE },
  { name: 'Todo Tipo de Piel', slug: 'todo-tipo-piel', type: TagType.SKIN_TYPE },

  // Preocupaciones
  { name: 'Manchas', slug: 'manchas', type: TagType.CONCERN },
  { name: 'Cicatrices', slug: 'cicatrices', type: TagType.CONCERN },
  { name: 'Aclarante', slug: 'aclarante', type: TagType.CONCERN },
  { name: 'Anti-edad', slug: 'anti-edad', type: TagType.CONCERN },
  { name: 'Hidratación', slug: 'hidratacion', type: TagType.CONCERN },
  { name: 'Control de Sebo', slug: 'control-sebo', type: TagType.CONCERN },
  { name: 'Poros', slug: 'poros', type: TagType.CONCERN },
  { name: 'Rojeces', slug: 'rojeces', type: TagType.CONCERN },
  { name: 'Luminosidad', slug: 'luminosidad', type: TagType.CONCERN },

  // Categorías de producto
  { name: 'Limpiador', slug: 'limpiador', type: TagType.CATEGORY },
  { name: 'Tónico', slug: 'tonico', type: TagType.CATEGORY },
  { name: 'Sérum', slug: 'serum', type: TagType.CATEGORY },
  { name: 'Ampolla', slug: 'ampolla', type: TagType.CATEGORY },
  { name: 'Crema', slug: 'crema', type: TagType.CATEGORY },
  { name: 'Mascarilla', slug: 'mascarilla', type: TagType.CATEGORY },
  { name: 'Protector Solar', slug: 'protector-solar', type: TagType.CATEGORY },
  { name: 'Contorno de Ojos', slug: 'contorno-ojos', type: TagType.CATEGORY },
  { name: 'Kit', slug: 'kit', type: TagType.CATEGORY },
  { name: 'Tone Up', slug: 'tone-up', type: TagType.CATEGORY },
];

// ═══════════════════════════════════════════════════════════════
// TARIFAS DE ENVÍO OLVA
// ═══════════════════════════════════════════════════════════════

const shippingRates = [
  // Lima Local
  { zone: ShippingZone.LIMA_LOCAL, modality: ShippingModality.DOMICILIO, cost: 8.00, estimatedDays: '24 - 48h' },

  // Lima Provincias
  { zone: ShippingZone.LIMA_PROVINCIAS, modality: ShippingModality.DOMICILIO, cost: 12.00, estimatedDays: '48 - 72h' },

  // Costa Nacional
  { zone: ShippingZone.COSTA_NACIONAL, modality: ShippingModality.DOMICILIO, cost: 12.00, estimatedDays: '3 - 5 días' },
  { zone: ShippingZone.COSTA_NACIONAL, modality: ShippingModality.AGENCIA, cost: 10.00, estimatedDays: '3 - 4 días' },

  // Sierra y Selva (Puno, Arequipa, Cusco, etc.)
  { zone: ShippingZone.SIERRA_SELVA, modality: ShippingModality.DOMICILIO, cost: 15.00, estimatedDays: '3 - 6 días' },
  { zone: ShippingZone.SIERRA_SELVA, modality: ShippingModality.AGENCIA, cost: 12.00, estimatedDays: '3 - 5 días' },

  // Zonas Remotas
  { zone: ShippingZone.ZONAS_REMOTAS, modality: ShippingModality.DOMICILIO, cost: 15.00, estimatedDays: '5 - 7 días' },
];

// ═══════════════════════════════════════════════════════════════
// PRODUCTOS SKINCARE
// ═══════════════════════════════════════════════════════════════

const products = [
  {
    name: "Beauty of Joseon - Protector Solar Relief Sun",
    price: 85.00,
    images: ["https://cdn1.skinsafeproducts.com/photo/AFC618BEFA84A2/medium_1707901672.png"],
    summary: "Un protector solar químico ligero y orgánico con SPF50+ PA++++, enriquecido con extracto de arroz y probióticos para hidratar, nutrir y proteger la piel sin dejar residuo blanco. Ideal para todo tipo de piel, incluyendo sensible.",
    benefits: ["Fortalece la barrera cutánea", "Proporciona un brillo natural", "Calma la piel", "Hidratación duradera", "Protección UV alta sin residuo blanco"],
    howToUse: "Aplica una cantidad generosa (aproximadamente del tamaño de un cuarto) como último paso de tu rutina después del humectante. Masajea suavemente en la piel. Úsalo diariamente en la mañana y reaplica cada 2 horas si estás expuesto al sol.",
    routineStep: RoutineStep.SUNSCREEN,
    usageTime: UsageTime.AM,
    keyIngredients: {
      "Extracto de arroz": "Hidrata y nutre la piel",
      "Niacinamida": "Ilumina y fortalece la barrera",
      "Extracto de ginseng": "Proporciona propiedades antioxidantes",
      "Extracto de té verde": "Calma irritaciones",
      "Fermentos probióticos": "Mejora la salud de la microbiota cutánea",
      "Glicerina": "Atrae y retiene humedad",
      "Tocoferol (Vitamina E)": "Antioxidante y protector"
    },
    isAvailable: true,
    featured: true,
    stock: 10,
    tagSlugs: ['todo-tipo-piel', 'piel-sensible', 'protector-solar', 'hidratacion']
  },
  {
    name: "SKIN1004 Madagascar Centella Cleansing Duo",
    price: 130.00,
    images: ["https://www.koreanbeautykr.com/cdn/shop/files/3-1.webp"],
    summary: "Un set de doble limpieza con aceite limpiador ligero y espuma de ampoule, infundido con extracto de centella asiática de Madagascar para calmar, hidratar y exfoliar suavemente la piel sensible o irritada, removiendo maquillaje e impurezas sin resecar.",
    benefits: ["Limpieza profunda sin resecar", "Calma irritaciones", "Hidrata la piel", "Remueve maquillaje e impurezas", "Mejora la textura y claridad de la piel"],
    howToUse: "Aplica unas bombas de aceite limpiador en el rostro seco con manos secas. Masajea en movimientos circulares para disolver maquillaje y suciedad. Enjuaga con agua tibia. Luego, aplica la espuma ampoule en el rostro húmedo, masajea y enjuaga. Úsalo en la noche para remover el maquillaje y en la mañana si es necesario.",
    routineStep: RoutineStep.CLEANSE,
    usageTime: UsageTime.BOTH,
    keyIngredients: {
      "Extracto de centella asiática": "Calma y repara la piel irritada",
      "Madecassic acid": "Propiedades anti-inflamatorias",
      "Asiaticoside": "Antioxidante y regenerador",
      "Aceites vegetales": "Limpieza suave y nutritiva"
    },
    isAvailable: true,
    featured: true,
    stock: 10,
    tagSlugs: ['piel-sensible', 'todo-tipo-piel', 'limpiador', 'kit', 'hidratacion', 'rojeces']
  },
  {
    name: "SKIN1004 Madagascar Poremizing Quick Clay Stick Mask",
    price: 85.00,
    images: ["https://keautiful.com/cdn/shop/files/b0bbb03f70b0e2761286d78e100b7c29-0.jpg"],
    summary: "Una máscara de arcilla en barra para minimizar poros, absorber exceso de sebo y exfoliar suavemente con polvo de frijol rojo y cinco tipos de arcillas, dejando la piel suave y refinada sin irritación.",
    benefits: ["Minimiza poros visibles", "Absorbe exceso de sebo", "Exfolia suavemente", "Deja la piel suave y refinada", "Calma y purifica sin irritar"],
    howToUse: "Después de lavar el rostro, aplica en el rostro evitando ojos y boca. Deja actuar 3-5 minutos y enjuaga con agua tibia. Úsalo 1-2 veces por semana, dependiendo de las necesidades de tu piel.",
    routineStep: RoutineStep.SPECIAL_CARE,
    usageTime: UsageTime.BOTH,
    keyIngredients: {
      "Caolín": "Absorbe sebo y purifica",
      "Extracto de centella asiática": "Calma irritaciones",
      "Bentonita": "Limpia impurezas",
      "Illita": "Exfolia suavemente",
      "Montmorillonita": "Detoxifica la piel",
      "Polvo de frijol rojo": "Exfoliante natural",
      "Extracto de aloe": "Hidrata y calma"
    },
    isAvailable: true,
    featured: false,
    stock: 10,
    tagSlugs: ['piel-grasa', 'piel-mixta', 'mascarilla', 'poros', 'control-sebo']
  },
  {
    name: "SKIN1004 Lab in Nature Madagascar Centella Niacinamide 10 Boosting Shot Ampoule",
    price: 80.00,
    images: ["https://m.media-amazon.com/images/S/aplus-media-library-service-media/381943f0-abfd-4cac-90d6-5b31ef744620.__CR0,0,600,450_PT0_SX600_V1___.jpg"],
    summary: "Ampolla concentrada con 10% de niacinamida para iluminar, refinar poros y mejorar el tono de la piel, combinada con centella para calmar y ácido tranexámico para reducir hiperpigmentación.",
    benefits: ["Ilumina el tono de la piel", "Refina y minimiza poros", "Mejora la uniformidad del tono", "Calma irritaciones", "Reduce hiperpigmentación y manchas"],
    howToUse: "Aplica una cantidad adecuada en la piel después del tónico y masajea suavemente hasta absorber. Úsalo dos veces al día, mañana y noche, para mejores resultados.",
    routineStep: RoutineStep.AMPOULE,
    usageTime: UsageTime.BOTH,
    keyIngredients: {
      "Niacinamida (10%)": "Ilumina y refina poros",
      "Ácido tranexámico": "Reduce manchas oscuras",
      "Extracto de centella asiática": "Calma y repara",
      "Ascorbil glucósido (Vitamina C)": "Antioxidante e iluminador",
      "Pantenol": "Hidrata y calma",
      "Madecassoside": "Fortalece la barrera cutánea"
    },
    isAvailable: true,
    featured: true,
    stock: 10,
    tagSlugs: ['todo-tipo-piel', 'ampolla', 'manchas', 'aclarante', 'poros', 'luminosidad']
  },
  {
    name: "SKIN1004 Madagascar Centella Travel Kit",
    price: 120.00,
    images: ["https://us-i.makeupstore.com/u/u3/u3omg1ui1lzt.jpg"],
    summary: "Kit de viaje con cinco productos en tamaño mini (aceite limpiador, espuma, tónico, ampulla y crema) enfocados en centella asiática para limpiar, tonificar, hidratar y calmar la piel en movimiento.",
    benefits: ["Limpieza completa y suave", "Tonificación equilibrante", "Hidratación profunda", "Calma la piel irritada", "Ideal para rutinas de viaje"],
    howToUse: "Sigue los pasos: 1. Aceite limpiador en rostro seco. 2. Espuma en rostro húmedo. 3. Tónico con algodón o manos. 4. Ampulla masajeando. 5. Crema como sellador. Úsalo mañana y noche.",
    routineStep: RoutineStep.SPECIAL_CARE,
    usageTime: UsageTime.BOTH,
    keyIngredients: {
      "Extracto de centella asiática": "Calma y regenera",
      "Aceites vegetales": "Limpieza nutritiva",
      "Extractos botánicos calmantes": "Equilibra y hidrata"
    },
    isAvailable: true,
    featured: false,
    stock: 10,
    tagSlugs: ['piel-sensible', 'todo-tipo-piel', 'kit', 'hidratacion', 'rojeces']
  },
  {
    name: "CELIMAX Noni Ampoule 50ml",
    price: 100.00,
    images: ["https://m.media-amazon.com/images/I/61Z3PWSvZ3L.jpg"],
    summary: "Ampolla calmante y revitalizante con 71.77% de extracto de noni para hidratar, calmar irritaciones y mejorar la luminosidad, ideal para piel sensible o estresada.",
    benefits: ["Hidrata intensamente", "Calma irritaciones y rojeces", "Mejora la luminosidad", "Revitaliza piel estresada", "Fortalece la barrera cutánea"],
    howToUse: "Después de limpiar, aplica una cantidad adecuada en la palma y extiende suavemente sobre el rostro. Úsalo mañana o noche; muchos lo usan en ambas rutinas para resultados óptimos.",
    routineStep: RoutineStep.AMPOULE,
    usageTime: UsageTime.BOTH,
    keyIngredients: {
      "Extracto de fruta de noni": "Antioxidante y calmante",
      "Aceite de semilla de noni": "Nutritivo y reparador",
      "Ácido hialurónico": "Hidratante profundo",
      "Adenosina": "Anti-envejecimiento",
      "Pantenol": "Calmante e hidratante",
      "Extracto de cacao": "Antioxidante",
      "Aceite de romero": "Antibacteriano y refrescante"
    },
    isAvailable: true,
    featured: true,
    stock: 10,
    tagSlugs: ['piel-sensible', 'piel-seca', 'ampolla', 'hidratacion', 'rojeces', 'luminosidad']
  },
  {
    name: "YUJA NIACIN Starter Kit",
    price: 120.00,
    images: ["https://i.ebayimg.com/images/g/Dt0AAOSwdB1hS0kf/s-l1200.png"],
    summary: "Kit de inicio de Some By Mi con cuatro productos (limpiador, tónico, suero y crema) para iluminar y tratar manchas, con extracto de yuja y niacinamida para una piel más clara en 30 días.",
    benefits: ["Ilumina en 30 días", "Reduce manchas y blemishes", "Revitaliza y nutre", "Hidratación intensa", "Equilibra el tono de la piel"],
    howToUse: "1. Limpiador: Usa dos veces al día. 2. Tónico: Aplica con algodón o manos después de limpiar. 3. Suero: 2-3 gotas masajeando. 4. Crema: Como sellador. Úsalo mañana y noche.",
    routineStep: RoutineStep.SPECIAL_CARE,
    usageTime: UsageTime.BOTH,
    keyIngredients: {
      "Extracto de yuja (82%)": "Ilumina y revitaliza",
      "Niacinamida": "Reduce manchas y equilibra tono",
      "Extractos botánicos iluminadores": "Nutren y protegen"
    },
    isAvailable: true,
    featured: true,
    stock: 10,
    tagSlugs: ['todo-tipo-piel', 'kit', 'manchas', 'aclarante', 'luminosidad']
  },
  {
    name: "ANUA Brightening Boost Serum Duo Set",
    price: 200.00,
    images: ["https://u-mercari-images.mercdn.net/photos/m35561451723_1.jpg"],
    summary: "Set de dos sueros (niacinamida 10% + ácido tranexámico 4%, y suero de melocotón) para iluminar, equilibrar el tono y reducir manchas oscuras, con textura ligera para todo tipo de piel.",
    benefits: ["Ilumina la piel", "Equilibra el tono", "Reduce manchas oscuras", "Calma y fortalece barrera", "Hidratación ligera"],
    howToUse: "Después del tónico, aplica el suero en el rostro y masajea hasta absorber. Úsalo en la rutina de mañana y noche para resultados óptimos.",
    routineStep: RoutineStep.SERUM,
    usageTime: UsageTime.BOTH,
    keyIngredients: {
      "Niacinamida (10%)": "Ilumina y reduce inflamación",
      "Ácido tranexámico (4%)": "Reduce manchas y hiperpigmentación",
      "Arbutina": "Blanqueador natural",
      "Extracto de melocotón": "Calmante y refrescante",
      "Ceramidas": "Fortalece la barrera cutánea"
    },
    isAvailable: true,
    featured: false,
    stock: 10,
    tagSlugs: ['todo-tipo-piel', 'serum', 'kit', 'manchas', 'aclarante', 'luminosidad']
  },
  {
    name: "Beauty of Joseon - Revive Eye Serum",
    price: 80.00,
    images: ["https://m.media-amazon.com/images/I/71st32TtEJL.jpg"],
    summary: "Suero para ojos con ginseng y retinal para reducir arrugas, mejorar elasticidad y iluminar el contorno de ojos, combinando tradición coreana con ingredientes anti-envejecimiento.",
    benefits: ["Reduce arrugas y líneas finas", "Mejora elasticidad", "Ilumina el contorno de ojos", "Hidratante y nutritivo", "Gentil para piel sensible"],
    howToUse: "Bombea 1-2 veces y aplica suavemente con el dedo anular bajo los ojos y alrededor del área. Úsalo mañana y noche después del suero o humectante.",
    routineStep: RoutineStep.SERUM,
    usageTime: UsageTime.BOTH,
    keyIngredients: {
      "Extracto de raíz de ginseng": "Revitaliza y energiza",
      "Retinal (2%)": "Reduce arrugas y mejora textura",
      "Niacinamida": "Ilumina y fortalece",
      "Ceramida NP": "Hidratante de barrera",
      "Colesterol": "Apoya la integridad de la piel"
    },
    isAvailable: true,
    featured: false,
    stock: 10,
    tagSlugs: ['todo-tipo-piel', 'piel-sensible', 'contorno-ojos', 'anti-edad', 'luminosidad']
  },
  {
    name: "CELIMAX Noni Acne Bubble Cleanser",
    price: 80.00,
    images: ["https://m.media-amazon.com/images/I/51ENhh5seAL.jpg"],
    summary: "Limpiador en espuma burbujeante para piel acneica, con BHA para exfoliar poros y noni para calmar y nutrir, manteniendo la hidratación sin resecar.",
    benefits: ["Exfolia y limpia poros", "Calma y nutre la piel", "Reduce acné y breakouts", "Mantiene hidratación", "Purifica sin resecar"],
    howToUse: "Bombea 1-2 veces en manos húmedas o rostro. Masajea en movimientos circulares por 60 segundos, evitando ojos. Enjuaga con agua tibia. Úsalo diariamente como segundo limpiador o como máscara de burbujas por 10 segundos.",
    routineStep: RoutineStep.CLEANSE,
    usageTime: UsageTime.BOTH,
    keyIngredients: {
      "Extracto de noni (35.51%)": "Calmante y nutritivo",
      "Ácido salicílico (0.5%)": "Exfoliante de poros",
      "Extracto de centella": "Calmante anti-inflamatorio",
      "Extracto de té verde": "Antioxidante",
      "Pantenol": "Hidratante y reparador"
    },
    isAvailable: true,
    featured: false,
    stock: 10,
    tagSlugs: ['piel-acneica', 'piel-grasa', 'limpiador', 'poros', 'control-sebo']
  },
  {
    name: "Dr. Althea 345 Relief Cream",
    price: 100.00,
    images: ["https://m.media-amazon.com/images/I/51ANDu4OdpL.jpg"],
    summary: "Crema de alivio post-acné para calmar irritaciones, hidratar y reducir manchas, con una fórmula sensible que fortalece la barrera cutánea y mejora el tono.",
    benefits: ["Calma irritaciones post-acné", "Hidrata y nutre", "Reduce manchas y marcas", "Fortalece la barrera cutánea", "Mejora el tono general"],
    howToUse: "Aplica una cantidad adecuada uniformemente sobre el rostro y da palmaditas para mejor absorción como paso final de la rutina. Úsalo mañana y noche.",
    routineStep: RoutineStep.MOISTURIZER,
    usageTime: UsageTime.BOTH,
    keyIngredients: {
      "Niacinamida": "Ilumina y reduce manchas",
      "Pantenol": "Calmante e hidratante",
      "Extracto de centella asiática": "Repara y calma",
      "Ceramida NP": "Fortalece barrera",
      "Resveratrol": "Antioxidante",
      "Extracto de opuntia": "Hidratante natural"
    },
    isAvailable: true,
    featured: false,
    stock: 10,
    tagSlugs: ['piel-acneica', 'piel-sensible', 'crema', 'cicatrices', 'manchas', 'hidratacion']
  },
  {
    name: "COSNORI Crema Blanqueadora Whitening Dress Tone Up Cream",
    price: 120.00,
    images: ["https://m.media-amazon.com/images/I/61HtCvrOU4L.jpg"],
    summary: "Crema tone-up para iluminar instantáneamente el tono de la piel, con efecto blanqueador y humectante, usando extractos botánicos para un acabado mate y natural sin maquillaje.",
    benefits: ["Ilumina instantáneamente", "Efecto blanqueador natural", "Humecta la piel", "Acabado mate y uniforme", "Puede usarse solo o como base"],
    howToUse: "Al final de la rutina, aplica una cantidad del tamaño de un guisante en la piel limpia. Masajea suavemente hasta absorber. Puede usarse en rostro y cuerpo, solo o como base de maquillaje.",
    routineStep: RoutineStep.SPECIAL_CARE,
    usageTime: UsageTime.AM,
    keyIngredients: {
      "Niacinamida": "Ilumina el tono",
      "Extracto de flor de cerezo": "Antioxidante y calmante",
      "Extracto de aloe vera": "Hidratante y suavizante",
      "Dióxido de titanio": "Protección UV ligera",
      "Aceites esenciales (limón, romero, lavanda)": "Aromáticos y refrescantes"
    },
    isAvailable: true,
    featured: true,
    stock: 10,
    tagSlugs: ['todo-tipo-piel', 'tone-up', 'aclarante', 'luminosidad']
  }
];

// ═══════════════════════════════════════════════════════════════
// ADMIN USER
// ═══════════════════════════════════════════════════════════════

const adminUser = {
  email: 'solicorn@thepurrfectglow.com',
  name: 'Solicorn',
  role: 'ADMIN' as const
};

// ═══════════════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('🌱 Starting seed...\n');

  // 1. Crear Tags
  console.log('📌 Creating tags...');
  const createdTags = await Promise.all(
    tags.map(tag =>
      prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag
      })
    )
  );
  console.log(`   ✅ Created ${createdTags.length} tags\n`);

  // Crear mapa de tags para lookup
  const tagMap = new Map(createdTags.map(t => [t.slug, t.id]));

  // 2. Crear Tarifas de Envío
  console.log('🚚 Creating shipping rates...');
  for (const rate of shippingRates) {
    await prisma.shippingRate.upsert({
      where: {
        zone_modality: { zone: rate.zone, modality: rate.modality }
      },
      update: { cost: rate.cost, estimatedDays: rate.estimatedDays },
      create: rate
    });
  }
  console.log(`   ✅ Created ${shippingRates.length} shipping rates\n`);

  // 3. Crear Productos con Tags
  console.log('🧴 Creating products...');
  for (const product of products) {
    const { tagSlugs, ...productData } = product;

    // Verificar si el producto ya existe
    const existing = await prisma.product.findFirst({
      where: { name: product.name }
    });

    if (existing) {
      console.log(`   ⏭️  Skipping existing product: ${product.name}`);
      continue;
    }

    await prisma.product.create({
      data: {
        ...productData,
        tags: {
          create: tagSlugs.map(slug => ({
            tag: { connect: { id: tagMap.get(slug)! } }
          }))
        }
      }
    });
    console.log(`   ✅ Created: ${product.name}`);
  }
  console.log('');

  // 4. Crear Usuario Admin (si no existe)
  console.log('👤 Creating admin user...');
  await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {},
    create: adminUser
  });
  console.log(`   ✅ Admin user ready: ${adminUser.email}\n`);

  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   • Tags: ${tags.length}`);
  console.log(`   • Shipping Rates: ${shippingRates.length}`);
  console.log(`   • Products: ${products.length}`);
  console.log(`   • Admin User: 1`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
