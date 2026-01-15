// src/app/lib/data/peruLocations.ts
// Datos de ubicaciones de Perú con mapeo a zonas de envío Olva

import { ShippingZone } from '@/src/types';

// ═══════════════════════════════════════════════════════════════
// MAPEO DE DEPARTAMENTOS A ZONAS DE ENVÍO
// ═══════════════════════════════════════════════════════════════

export const DEPARTAMENTO_TO_ZONE: Record<string, ShippingZone> = {
  // Lima Metropolitana - Zona local
  'LIMA': 'LIMA_LOCAL',
  
  // Lima Provincias y Callao
  'CALLAO': 'LIMA_PROVINCIAS',
  
  // Costa Nacional
  'LA LIBERTAD': 'COSTA_NACIONAL',
  'LAMBAYEQUE': 'COSTA_NACIONAL',
  'PIURA': 'COSTA_NACIONAL',
  'TUMBES': 'COSTA_NACIONAL',
  'ICA': 'COSTA_NACIONAL',
  'AREQUIPA': 'COSTA_NACIONAL',
  'MOQUEGUA': 'COSTA_NACIONAL',
  'TACNA': 'COSTA_NACIONAL',
  'ANCASH': 'COSTA_NACIONAL',
  
  // Sierra y Selva
  'CUSCO': 'SIERRA_SELVA',
  'PUNO': 'SIERRA_SELVA',
  'JUNIN': 'SIERRA_SELVA',
  'AYACUCHO': 'SIERRA_SELVA',
  'APURIMAC': 'SIERRA_SELVA',
  'HUANCAVELICA': 'SIERRA_SELVA',
  'CAJAMARCA': 'SIERRA_SELVA',
  'HUANUCO': 'SIERRA_SELVA',
  'PASCO': 'SIERRA_SELVA',
  'LORETO': 'SIERRA_SELVA',
  'UCAYALI': 'SIERRA_SELVA',
  'SAN MARTIN': 'SIERRA_SELVA',
  'AMAZONAS': 'SIERRA_SELVA',
  'MADRE DE DIOS': 'SIERRA_SELVA',
};

// ═══════════════════════════════════════════════════════════════
// DATOS DE UBICACIÓN - Estructura jerárquica
// ═══════════════════════════════════════════════════════════════

export interface Distrito {
  name: string;
}

export interface Provincia {
  name: string;
  distritos: Distrito[];
}

export interface Departamento {
  name: string;
  provincias: Provincia[];
}

// Datos simplificados de Perú (principales ubicaciones por departamento)
export const PERU_LOCATIONS: Departamento[] = [
  {
    name: 'LIMA',
    provincias: [
      {
        name: 'Lima',
        distritos: [
          { name: 'Miraflores' },
          { name: 'San Isidro' },
          { name: 'San Borja' },
          { name: 'Surco' },
          { name: 'La Molina' },
          { name: 'Barranco' },
          { name: 'Jesús María' },
          { name: 'Lince' },
          { name: 'Magdalena del Mar' },
          { name: 'Pueblo Libre' },
          { name: 'San Miguel' },
          { name: 'Surquillo' },
          { name: 'Chorrillos' },
          { name: 'Lima Cercado' },
          { name: 'Breña' },
          { name: 'Rimac' },
          { name: 'San Juan de Lurigancho' },
          { name: 'San Juan de Miraflores' },
          { name: 'Villa María del Triunfo' },
          { name: 'Villa El Salvador' },
          { name: 'Los Olivos' },
          { name: 'San Martín de Porres' },
          { name: 'Comas' },
          { name: 'Independencia' },
          { name: 'Carabayllo' },
          { name: 'Puente Piedra' },
          { name: 'Ancón' },
          { name: 'Santa Rosa' },
          { name: 'Ate' },
          { name: 'El Agustino' },
          { name: 'Santa Anita' },
          { name: 'Chaclacayo' },
          { name: 'Lurigancho-Chosica' },
          { name: 'Cieneguilla' },
          { name: 'Pachacámac' },
          { name: 'Lurín' },
          { name: 'Punta Hermosa' },
          { name: 'Punta Negra' },
          { name: 'San Bartolo' },
          { name: 'Santa María del Mar' },
          { name: 'Pucusana' },
        ],
      },
      {
        name: 'Cañete',
        distritos: [
          { name: 'San Vicente de Cañete' },
          { name: 'Asia' },
          { name: 'Calango' },
          { name: 'Cerro Azul' },
          { name: 'Chilca' },
          { name: 'Coayllo' },
          { name: 'Imperial' },
          { name: 'Lunahuaná' },
          { name: 'Mala' },
          { name: 'Nuevo Imperial' },
          { name: 'Pacarán' },
          { name: 'Quilmaná' },
          { name: 'San Antonio' },
          { name: 'San Luis' },
          { name: 'Santa Cruz de Flores' },
          { name: 'Zúñiga' },
        ],
      },
      {
        name: 'Huaral',
        distritos: [
          { name: 'Huaral' },
          { name: 'Atavillos Alto' },
          { name: 'Atavillos Bajo' },
          { name: 'Aucallama' },
          { name: 'Chancay' },
          { name: 'Ihuarí' },
          { name: 'Lampián' },
          { name: 'Pacaraos' },
          { name: 'San Miguel de Acos' },
          { name: 'Santa Cruz de Andamarca' },
          { name: 'Sumbilca' },
          { name: '27 de Noviembre' },
        ],
      },
      {
        name: 'Huarochirí',
        distritos: [
          { name: 'Matucana' },
          { name: 'Antioquia' },
          { name: 'Callahuanca' },
          { name: 'Carampoma' },
          { name: 'Chicla' },
          { name: 'Cuenca' },
          { name: 'Huachupampa' },
          { name: 'Huanza' },
          { name: 'Huarochirí' },
          { name: 'Lahuaytambo' },
          { name: 'Langa' },
          { name: 'Laraos' },
          { name: 'Mariatana' },
          { name: 'Ricardo Palma' },
          { name: 'San Andrés de Tupicocha' },
          { name: 'San Antonio' },
          { name: 'San Bartolomé' },
          { name: 'San Damián' },
          { name: 'San Juan de Iris' },
          { name: 'San Juan de Tantaranche' },
          { name: 'San Lorenzo de Quinti' },
          { name: 'San Mateo' },
          { name: 'San Mateo de Otao' },
          { name: 'San Pedro de Casta' },
          { name: 'San Pedro de Huancayre' },
          { name: 'Sangallaya' },
          { name: 'Santa Cruz de Cocachacra' },
          { name: 'Santa Eulalia' },
          { name: 'Santiago de Anchucaya' },
          { name: 'Santiago de Tuna' },
          { name: 'Santo Domingo de los Olleros' },
          { name: 'Surco' },
        ],
      },
      {
        name: 'Barranca',
        distritos: [
          { name: 'Barranca' },
          { name: 'Paramonga' },
          { name: 'Pativilca' },
          { name: 'Supe' },
          { name: 'Supe Puerto' },
        ],
      },
      {
        name: 'Huaura',
        distritos: [
          { name: 'Huacho' },
          { name: 'Ámbar' },
          { name: 'Caleta de Carquín' },
          { name: 'Checras' },
          { name: 'Hualmay' },
          { name: 'Huaura' },
          { name: 'Leoncio Prado' },
          { name: 'Paccho' },
          { name: 'Santa Leonor' },
          { name: 'Santa María' },
          { name: 'Sayán' },
          { name: 'Végueta' },
        ],
      },
    ],
  },
  {
    name: 'CALLAO',
    provincias: [
      {
        name: 'Callao',
        distritos: [
          { name: 'Callao' },
          { name: 'Bellavista' },
          { name: 'Carmen de la Legua Reynoso' },
          { name: 'La Perla' },
          { name: 'La Punta' },
          { name: 'Ventanilla' },
          { name: 'Mi Perú' },
        ],
      },
    ],
  },
  {
    name: 'AREQUIPA',
    provincias: [
      {
        name: 'Arequipa',
        distritos: [
          { name: 'Arequipa' },
          { name: 'Alto Selva Alegre' },
          { name: 'Cayma' },
          { name: 'Cerro Colorado' },
          { name: 'Characato' },
          { name: 'Chiguata' },
          { name: 'Jacobo Hunter' },
          { name: 'José Luis Bustamante y Rivero' },
          { name: 'La Joya' },
          { name: 'Mariano Melgar' },
          { name: 'Miraflores' },
          { name: 'Mollebaya' },
          { name: 'Paucarpata' },
          { name: 'Pocsi' },
          { name: 'Polobaya' },
          { name: 'Quequeña' },
          { name: 'Sabandía' },
          { name: 'Sachaca' },
          { name: 'San Juan de Siguas' },
          { name: 'San Juan de Tarucani' },
          { name: 'Santa Isabel de Siguas' },
          { name: 'Santa Rita de Siguas' },
          { name: 'Socabaya' },
          { name: 'Tiabaya' },
          { name: 'Uchumayo' },
          { name: 'Vítor' },
          { name: 'Yanahuara' },
          { name: 'Yarabamba' },
          { name: 'Yura' },
        ],
      },
    ],
  },
  {
    name: 'LA LIBERTAD',
    provincias: [
      {
        name: 'Trujillo',
        distritos: [
          { name: 'Trujillo' },
          { name: 'El Porvenir' },
          { name: 'Florencia de Mora' },
          { name: 'Huanchaco' },
          { name: 'La Esperanza' },
          { name: 'Laredo' },
          { name: 'Moche' },
          { name: 'Poroto' },
          { name: 'Salaverry' },
          { name: 'Simbal' },
          { name: 'Victor Larco Herrera' },
        ],
      },
    ],
  },
  {
    name: 'LAMBAYEQUE',
    provincias: [
      {
        name: 'Chiclayo',
        distritos: [
          { name: 'Chiclayo' },
          { name: 'Chongoyape' },
          { name: 'Eten' },
          { name: 'Eten Puerto' },
          { name: 'José Leonardo Ortiz' },
          { name: 'La Victoria' },
          { name: 'Lagunas' },
          { name: 'Monsefú' },
          { name: 'Nueva Arica' },
          { name: 'Oyotún' },
          { name: 'Pátapo' },
          { name: 'Picsi' },
          { name: 'Pimentel' },
          { name: 'Pomalca' },
          { name: 'Pucalá' },
          { name: 'Reque' },
          { name: 'Santa Rosa' },
          { name: 'Saña' },
          { name: 'Cayaltí' },
          { name: 'Tumán' },
        ],
      },
      {
        name: 'Lambayeque',
        distritos: [
          { name: 'Lambayeque' },
          { name: 'Chóchope' },
          { name: 'Íllimo' },
          { name: 'Jayanca' },
          { name: 'Mochumí' },
          { name: 'Mórrope' },
          { name: 'Motupe' },
          { name: 'Olmos' },
          { name: 'Pacora' },
          { name: 'Salas' },
          { name: 'San José' },
          { name: 'Túcume' },
        ],
      },
    ],
  },
  {
    name: 'PIURA',
    provincias: [
      {
        name: 'Piura',
        distritos: [
          { name: 'Piura' },
          { name: 'Castilla' },
          { name: 'Catacaos' },
          { name: 'Cura Mori' },
          { name: 'El Tallán' },
          { name: 'La Arena' },
          { name: 'La Unión' },
          { name: 'Las Lomas' },
          { name: 'Tambo Grande' },
          { name: 'Veintiséis de Octubre' },
        ],
      },
      {
        name: 'Sullana',
        distritos: [
          { name: 'Sullana' },
          { name: 'Bellavista' },
          { name: 'Ignacio Escudero' },
          { name: 'Lancones' },
          { name: 'Marcavelica' },
          { name: 'Miguel Checa' },
          { name: 'Querecotillo' },
          { name: 'Salitral' },
        ],
      },
    ],
  },
  {
    name: 'ICA',
    provincias: [
      {
        name: 'Ica',
        distritos: [
          { name: 'Ica' },
          { name: 'La Tinguiña' },
          { name: 'Los Aquijes' },
          { name: 'Ocucaje' },
          { name: 'Pachacútec' },
          { name: 'Parcona' },
          { name: 'Pueblo Nuevo' },
          { name: 'Salas' },
          { name: 'San José de Los Molinos' },
          { name: 'San Juan Bautista' },
          { name: 'Santiago' },
          { name: 'Subtanjalla' },
          { name: 'Tate' },
          { name: 'Yauca del Rosario' },
        ],
      },
      {
        name: 'Nazca',
        distritos: [
          { name: 'Nazca' },
          { name: 'Changuillo' },
          { name: 'El Ingenio' },
          { name: 'Marcona' },
          { name: 'Vista Alegre' },
        ],
      },
    ],
  },
  {
    name: 'CUSCO',
    provincias: [
      {
        name: 'Cusco',
        distritos: [
          { name: 'Cusco' },
          { name: 'Ccorca' },
          { name: 'Poroy' },
          { name: 'San Jerónimo' },
          { name: 'San Sebastián' },
          { name: 'Santiago' },
          { name: 'Saylla' },
          { name: 'Wanchaq' },
        ],
      },
      {
        name: 'Urubamba',
        distritos: [
          { name: 'Urubamba' },
          { name: 'Chinchero' },
          { name: 'Huayllabamba' },
          { name: 'Machupicchu' },
          { name: 'Maras' },
          { name: 'Ollantaytambo' },
          { name: 'Yucay' },
        ],
      },
    ],
  },
  {
    name: 'PUNO',
    provincias: [
      {
        name: 'Puno',
        distritos: [
          { name: 'Puno' },
          { name: 'Acora' },
          { name: 'Amantani' },
          { name: 'Atuncolla' },
          { name: 'Capachica' },
          { name: 'Chucuito' },
          { name: 'Coata' },
          { name: 'Huata' },
          { name: 'Mañazo' },
          { name: 'Paucarcolla' },
          { name: 'Pichacani' },
          { name: 'Platería' },
          { name: 'San Antonio' },
          { name: 'Tiquillaca' },
          { name: 'Vilque' },
        ],
      },
      {
        name: 'Juliaca',
        distritos: [
          { name: 'Juliaca' },
          { name: 'Cabana' },
          { name: 'Cabanillas' },
          { name: 'Caracoto' },
          { name: 'San Miguel' },
        ],
      },
    ],
  },
  {
    name: 'JUNIN',
    provincias: [
      {
        name: 'Huancayo',
        distritos: [
          { name: 'Huancayo' },
          { name: 'Carhuacallanga' },
          { name: 'Chacapampa' },
          { name: 'Chicche' },
          { name: 'Chilca' },
          { name: 'Chongos Alto' },
          { name: 'Chupuro' },
          { name: 'Colca' },
          { name: 'Cullhuas' },
          { name: 'El Tambo' },
          { name: 'Huacrapuquio' },
          { name: 'Hualhuas' },
          { name: 'Huancán' },
          { name: 'Huasicancha' },
          { name: 'Huayucachi' },
          { name: 'Ingenio' },
          { name: 'Pariahuanca' },
          { name: 'Pilcomayo' },
          { name: 'Pucará' },
          { name: 'Quichuay' },
          { name: 'Quilcas' },
          { name: 'San Agustín' },
          { name: 'San Jerónimo de Tunán' },
          { name: 'Santo Domingo de Acobamba' },
          { name: 'Saño' },
          { name: 'Sapallanga' },
          { name: 'Sicaya' },
          { name: 'Viques' },
        ],
      },
    ],
  },
  {
    name: 'CAJAMARCA',
    provincias: [
      {
        name: 'Cajamarca',
        distritos: [
          { name: 'Cajamarca' },
          { name: 'Asunción' },
          { name: 'Chetilla' },
          { name: 'Cosspán' },
          { name: 'Encañada' },
          { name: 'Jesús' },
          { name: 'Llacanora' },
          { name: 'Los Baños del Inca' },
          { name: 'Magdalena' },
          { name: 'Matara' },
          { name: 'Namora' },
          { name: 'San Juan' },
        ],
      },
    ],
  },
  {
    name: 'ANCASH',
    provincias: [
      {
        name: 'Huaraz',
        distritos: [
          { name: 'Huaraz' },
          { name: 'Cochabamba' },
          { name: 'Colcabamba' },
          { name: 'Huanchay' },
          { name: 'Independencia' },
          { name: 'Jangas' },
          { name: 'La Libertad' },
          { name: 'Olleros' },
          { name: 'Pampas Grande' },
          { name: 'Pariacoto' },
          { name: 'Pira' },
          { name: 'Tarica' },
        ],
      },
      {
        name: 'Chimbote',
        distritos: [
          { name: 'Chimbote' },
          { name: 'Cáceres del Perú' },
          { name: 'Coishco' },
          { name: 'Macate' },
          { name: 'Moro' },
          { name: 'Nepeña' },
          { name: 'Nuevo Chimbote' },
          { name: 'Samanco' },
          { name: 'Santa' },
        ],
      },
    ],
  },
  {
    name: 'LORETO',
    provincias: [
      {
        name: 'Maynas',
        distritos: [
          { name: 'Iquitos' },
          { name: 'Alto Nanay' },
          { name: 'Fernando Lores' },
          { name: 'Indiana' },
          { name: 'Las Amazonas' },
          { name: 'Mazán' },
          { name: 'Napo' },
          { name: 'Punchana' },
          { name: 'Torres Causana' },
          { name: 'Belén' },
          { name: 'San Juan Bautista' },
        ],
      },
    ],
  },
  {
    name: 'SAN MARTIN',
    provincias: [
      {
        name: 'San Martín',
        distritos: [
          { name: 'Tarapoto' },
          { name: 'Alberto Leveau' },
          { name: 'Cacatachi' },
          { name: 'Chazuta' },
          { name: 'Chipurana' },
          { name: 'El Porvenir' },
          { name: 'Huimbayoc' },
          { name: 'Juan Guerra' },
          { name: 'La Banda de Shilcayo' },
          { name: 'Morales' },
          { name: 'Papaplaya' },
          { name: 'San Antonio' },
          { name: 'Sauce' },
          { name: 'Shapaja' },
        ],
      },
    ],
  },
  {
    name: 'UCAYALI',
    provincias: [
      {
        name: 'Coronel Portillo',
        distritos: [
          { name: 'Callería' },
          { name: 'Campoverde' },
          { name: 'Iparia' },
          { name: 'Masisea' },
          { name: 'Yarinacocha' },
          { name: 'Nueva Requena' },
          { name: 'Manantay' },
        ],
      },
    ],
  },
  {
    name: 'TACNA',
    provincias: [
      {
        name: 'Tacna',
        distritos: [
          { name: 'Tacna' },
          { name: 'Alto de la Alianza' },
          { name: 'Calana' },
          { name: 'Ciudad Nueva' },
          { name: 'Coronel Gregorio Albarracín Lanchipa' },
          { name: 'Inclán' },
          { name: 'Pachía' },
          { name: 'Palca' },
          { name: 'Pocollay' },
          { name: 'Sama' },
        ],
      },
    ],
  },
  {
    name: 'MOQUEGUA',
    provincias: [
      {
        name: 'Mariscal Nieto',
        distritos: [
          { name: 'Moquegua' },
          { name: 'Carumas' },
          { name: 'Cuchumbaya' },
          { name: 'Samegua' },
          { name: 'San Cristóbal' },
          { name: 'Torata' },
        ],
      },
    ],
  },
  {
    name: 'TUMBES',
    provincias: [
      {
        name: 'Tumbes',
        distritos: [
          { name: 'Tumbes' },
          { name: 'Corrales' },
          { name: 'La Cruz' },
          { name: 'Pampas de Hospital' },
          { name: 'San Jacinto' },
          { name: 'San Juan de la Virgen' },
        ],
      },
    ],
  },
  {
    name: 'AYACUCHO',
    provincias: [
      {
        name: 'Huamanga',
        distritos: [
          { name: 'Ayacucho' },
          { name: 'Acocro' },
          { name: 'Acos Vinchos' },
          { name: 'Carmen Alto' },
          { name: 'Chiara' },
          { name: 'Ocros' },
          { name: 'Pacaycasa' },
          { name: 'Quinua' },
          { name: 'San José de Ticllas' },
          { name: 'San Juan Bautista' },
          { name: 'Santiago de Pischa' },
          { name: 'Socos' },
          { name: 'Tambillo' },
          { name: 'Vinchos' },
          { name: 'Jesús Nazareno' },
          { name: 'Andrés Avelino Cáceres Dorregaray' },
        ],
      },
    ],
  },
  {
    name: 'HUANUCO',
    provincias: [
      {
        name: 'Huánuco',
        distritos: [
          { name: 'Huánuco' },
          { name: 'Amarilis' },
          { name: 'Chinchao' },
          { name: 'Churubamba' },
          { name: 'Margos' },
          { name: 'Pillco Marca' },
          { name: 'Quisqui' },
          { name: 'San Francisco de Cayran' },
          { name: 'San Pedro de Chaulán' },
          { name: 'Santa María del Valle' },
          { name: 'Yarumayo' },
        ],
      },
    ],
  },
  {
    name: 'APURIMAC',
    provincias: [
      {
        name: 'Abancay',
        distritos: [
          { name: 'Abancay' },
          { name: 'Chacoche' },
          { name: 'Circa' },
          { name: 'Curahuasi' },
          { name: 'Huanipaca' },
          { name: 'Lambrama' },
          { name: 'Pichirhua' },
          { name: 'San Pedro de Cachora' },
          { name: 'Tamburco' },
        ],
      },
    ],
  },
  {
    name: 'MADRE DE DIOS',
    provincias: [
      {
        name: 'Tambopata',
        distritos: [
          { name: 'Tambopata' },
          { name: 'Inambari' },
          { name: 'Las Piedras' },
          { name: 'Laberinto' },
        ],
      },
    ],
  },
  {
    name: 'PASCO',
    provincias: [
      {
        name: 'Pasco',
        distritos: [
          { name: 'Chaupimarca' },
          { name: 'Huachón' },
          { name: 'Huariaca' },
          { name: 'Huayllay' },
          { name: 'Ninacaca' },
          { name: 'Pallanchacra' },
          { name: 'Paucartambo' },
          { name: 'San Francisco de Asís de Yarusyacán' },
          { name: 'Simón Bolívar' },
          { name: 'Ticlacayán' },
          { name: 'Tinyahuarco' },
          { name: 'Vicco' },
          { name: 'Yanacancha' },
        ],
      },
    ],
  },
  {
    name: 'HUANCAVELICA',
    provincias: [
      {
        name: 'Huancavelica',
        distritos: [
          { name: 'Huancavelica' },
          { name: 'Acobambilla' },
          { name: 'Acoria' },
          { name: 'Conayca' },
          { name: 'Cuenca' },
          { name: 'Huachocolpa' },
          { name: 'Huayllahuara' },
          { name: 'Izcuchaca' },
          { name: 'Laria' },
          { name: 'Manta' },
          { name: 'Mariscal Cáceres' },
          { name: 'Moya' },
          { name: 'Nuevo Occoro' },
          { name: 'Palca' },
          { name: 'Pilchaca' },
          { name: 'Vilca' },
          { name: 'Yauli' },
          { name: 'Ascensión' },
          { name: 'Huando' },
        ],
      },
    ],
  },
  {
    name: 'AMAZONAS',
    provincias: [
      {
        name: 'Chachapoyas',
        distritos: [
          { name: 'Chachapoyas' },
          { name: 'Asunción' },
          { name: 'Balsas' },
          { name: 'Cheto' },
          { name: 'Chiliquín' },
          { name: 'Chuquibamba' },
          { name: 'Granada' },
          { name: 'Huancas' },
          { name: 'La Jalca' },
          { name: 'Leimebamba' },
          { name: 'Levanto' },
          { name: 'Magdalena' },
          { name: 'Mariscal Castilla' },
          { name: 'Molinopampa' },
          { name: 'Montevideo' },
          { name: 'Olleros' },
          { name: 'Quinjalca' },
          { name: 'San Francisco de Daguas' },
          { name: 'San Isidro de Maino' },
          { name: 'Soloco' },
          { name: 'Sonche' },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Obtiene todos los departamentos
 */
export function getDepartamentos(): string[] {
  return PERU_LOCATIONS.map(d => d.name);
}

/**
 * Obtiene las provincias de un departamento
 */
export function getProvincias(departamento: string): string[] {
  const dept = PERU_LOCATIONS.find(d => d.name === departamento);
  return dept ? dept.provincias.map(p => p.name) : [];
}

/**
 * Obtiene los distritos de una provincia en un departamento
 */
export function getDistritos(departamento: string, provincia: string): string[] {
  const dept = PERU_LOCATIONS.find(d => d.name === departamento);
  if (!dept) return [];
  
  const prov = dept.provincias.find(p => p.name === provincia);
  return prov ? prov.distritos.map(d => d.name) : [];
}

/**
 * Obtiene la zona de envío basada en el departamento
 */
export function getShippingZoneFromDepartamento(departamento: string): ShippingZone {
  return DEPARTAMENTO_TO_ZONE[departamento] || 'ZONAS_REMOTAS';
}
