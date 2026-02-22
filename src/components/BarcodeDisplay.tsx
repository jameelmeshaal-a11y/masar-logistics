import React, { useRef } from 'react';
import { Printer } from 'lucide-react';

interface BarcodeDisplayProps {
  value: string;
  label?: string;
  width?: number;
  height?: number;
}

const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({ value, label, width = 200, height = 60 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Simple Code128-like barcode rendering
  const generateBars = () => {
    const bars: { x: number; w: number }[] = [];
    let x = 10;
    const charWidth = (width - 20) / (value.length * 11);

    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      const pattern = [
        (code >> 7) & 1, (code >> 6) & 1, (code >> 5) & 1, (code >> 4) & 1,
        (code >> 3) & 1, (code >> 2) & 1, (code >> 1) & 1, code & 1,
        1, 0, 1,
      ];
      for (const bit of pattern) {
        if (bit === 1) {
          bars.push({ x, w: charWidth * 0.9 });
        }
        x += charWidth;
      }
    }
    return bars;
  };

  const bars = generateBars();

  const handlePrint = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl"><head><title>طباعة باركود</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
          ${svgData}
          <p style="margin-top:8px;font-size:14px;">${label || value}</p>
          <script>window.print();window.close();</script>
        </body></html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="bg-white rounded">
        {bars.map((bar, i) => (
          <rect key={i} x={bar.x} y={4} width={bar.w} height={height - 20} fill="#1a1a2e" />
        ))}
        <text x={width / 2} y={height - 4} textAnchor="middle" fontSize="10" fill="#333" fontFamily="monospace">
          {value}
        </text>
      </svg>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <button onClick={handlePrint} className="flex items-center gap-1 text-xs text-accent hover:underline mt-1">
        <Printer className="w-3 h-3" /> طباعة
      </button>
    </div>
  );
};

export default BarcodeDisplay;
