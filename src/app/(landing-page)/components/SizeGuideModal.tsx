'use client';

import { useState, useEffect } from 'react';

type MeasurementUnit = 'CM' | 'IN';
type ProductCategory = 'FORMAL' | 'CASUAL' | 'DEPORTIVO';

interface SizeData {
    size: string;
    footLengthCM: string;
    footLengthIN: string;
}

const SIZE_TABLES: Record<ProductCategory, SizeData[]> = {
  FORMAL: [
    { size: '35', footLengthCM: '22.5 - 23.0', footLengthIN: '8.9 - 9.1' },
    { size: '36', footLengthCM: '23.0 - 23.5', footLengthIN: '9.1 - 9.3' },
    { size: '37', footLengthCM: '23.5 - 24.0', footLengthIN: '9.3 - 9.4' },
    { size: '38', footLengthCM: '24.0 - 24.5', footLengthIN: '9.4 - 9.6' },
    { size: '39', footLengthCM: '24.5 - 25.0', footLengthIN: '9.6 - 9.8' },
    { size: '40', footLengthCM: '25.0 - 25.5', footLengthIN: '9.8 - 10.0' },
    { size: '41', footLengthCM: '25.5 - 26.0', footLengthIN: '10.0 - 10.2' },
    { size: '42', footLengthCM: '26.0 - 26.5', footLengthIN: '10.2 - 10.4' },
    { size: '43', footLengthCM: '26.5 - 27.0', footLengthIN: '10.4 - 10.6' },
    { size: '44', footLengthCM: '27.0 - 27.5', footLengthIN: '10.6 - 10.8' },
    { size: '45', footLengthCM: '27.5 - 28.0', footLengthIN: '10.8 - 11.0' },
  ],
  CASUAL: [
    { size: '35', footLengthCM: '22.5 - 23.0', footLengthIN: '8.9 - 9.1' },
    { size: '36', footLengthCM: '23.0 - 23.5', footLengthIN: '9.1 - 9.3' },
    { size: '37', footLengthCM: '23.5 - 24.0', footLengthIN: '9.3 - 9.4' },
    { size: '38', footLengthCM: '24.0 - 24.5', footLengthIN: '9.4 - 9.6' },
    { size: '39', footLengthCM: '24.5 - 25.0', footLengthIN: '9.6 - 9.8' },
    { size: '40', footLengthCM: '25.0 - 25.5', footLengthIN: '9.8 - 10.0' },
    { size: '41', footLengthCM: '25.5 - 26.0', footLengthIN: '10.0 - 10.2' },
    { size: '42', footLengthCM: '26.0 - 26.5', footLengthIN: '10.2 - 10.4' },
    { size: '43', footLengthCM: '26.5 - 27.0', footLengthIN: '10.4 - 10.6' },
    { size: '44', footLengthCM: '27.0 - 27.5', footLengthIN: '10.6 - 10.8' },
    { size: '45', footLengthCM: '27.5 - 28.0', footLengthIN: '10.8 - 11.0' },
  ],
  DEPORTIVO: [
    { size: '35', footLengthCM: '22.5 - 23.0', footLengthIN: '8.9 - 9.1' },
    { size: '36', footLengthCM: '23.0 - 23.5', footLengthIN: '9.1 - 9.3' },
    { size: '37', footLengthCM: '23.5 - 24.0', footLengthIN: '9.3 - 9.4' },
    { size: '38', footLengthCM: '24.0 - 24.5', footLengthIN: '9.4 - 9.6' },
    { size: '39', footLengthCM: '24.5 - 25.0', footLengthIN: '9.6 - 9.8' },
    { size: '40', footLengthCM: '25.0 - 25.5', footLengthIN: '9.8 - 10.0' },
    { size: '41', footLengthCM: '25.5 - 26.0', footLengthIN: '10.0 - 10.2' },
    { size: '42', footLengthCM: '26.0 - 26.5', footLengthIN: '10.2 - 10.4' },
    { size: '43', footLengthCM: '26.5 - 27.0', footLengthIN: '10.4 - 10.6' },
    { size: '44', footLengthCM: '27.0 - 27.5', footLengthIN: '10.6 - 10.8' },
    { size: '45', footLengthCM: '27.5 - 28.0', footLengthIN: '10.8 - 11.0' },
  ],
};

const MEASUREMENT_TIPS = [
  {
    title: '¿Cómo medir tu pie correctamente?',
    steps: [
      'Coloca una hoja de papel en el suelo contra una pared',
      'Párate sobre el papel con el talón contra la pared',
      'Marca el punto más largo de tu pie en el papel',
      'Mide la distancia desde el borde del papel hasta la marca',
      'Repite con el otro pie y usa la medida más grande',
    ],
  },
  {
    title: 'Consejos para elegir la talla correcta',
    steps: [
      'Mide tus pies al final del día cuando estén más grandes',
      'Usa los calcetines que planeas usar con los zapatos',
      'Si estás entre dos tallas, elige la más grande',
      'Considera que el cuero se estira ligeramente con el uso',
      'Para calzado deportivo, considera medio número más',
    ],
  },
];

interface SizeGuideModalProps {
    category: ProductCategory;
    onClose: () => void;
}

export default function SizeGuideModal({ category, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<MeasurementUnit>('CM');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [isClosing, setIsClosing] = useState(false);

  const sizeTable = SIZE_TABLES[category] || SIZE_TABLES.CASUAL;

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Duración de la animación
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal Container - Responsive */}
      <div
        className={`fixed z-50 bg-white shadow-2xl transition-transform duration-300 ease-out
          md:top-0 md:right-0 md:h-full md:w-[500px]
          bottom-0 left-0 right-0 h-[85vh] md:h-full rounded-t-3xl md:rounded-none
          ${isClosing
      ? 'md:translate-x-full translate-y-full'
      : 'md:translate-x-0 translate-y-0'
    }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Guía de Tallas</h2>
              <p className="text-sm text-gray-500 mt-1">
                                Encuentra tu talla perfecta
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Unit Toggle */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1">
                <button
                  onClick={() => setUnit('CM')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${unit === 'CM'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-black'
                  }`}
                >
                                    Centímetros (CM)
                </button>
                <button
                  onClick={() => setUnit('IN')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${unit === 'IN'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-black'
                  }`}
                >
                                    Pulgadas (IN)
                </button>
              </div>

              {/* Size Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Talla
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Largo del Pie ({unit})
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {sizeTable.map((row, index) => (
                        <tr
                          key={row.size}
                          className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          }`}
                        >
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                            {row.size}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {unit === 'CM' ? row.footLengthCM : row.footLengthIN}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Measurement Tips - Accordion */}
              <div className="space-y-3">
                {MEASUREMENT_TIPS.map((tip, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left"
                    >
                      <span className="font-medium text-gray-900">{tip.title}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${openAccordion === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openAccordion === index && (
                      <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                        <ol className="space-y-2 list-decimal list-inside">
                          {tip.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-sm text-gray-600 leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                                            ¿Tienes dudas sobre tu talla?
                    </h4>
                    <p className="text-sm text-blue-700">
                                            Contáctanos y te ayudaremos a encontrar la talla perfecta para ti.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
