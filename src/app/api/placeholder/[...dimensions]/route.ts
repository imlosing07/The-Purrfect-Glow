type Props={
  params: {
    dimensions: string[];
  };
};

export async function GET(request: any, { params }: Props) {

  params = await params;
  // Extract dimensions from the URL
  const dimensions = params.dimensions || [];
  const [width = 200, height = 200] = dimensions;
    
  // Create a simple SVG placeholder
  const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#CCCCCC"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666666" text-anchor="middle" dominant-baseline="middle">${width}x${height}</text>
      </svg>
    `;
    
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
}