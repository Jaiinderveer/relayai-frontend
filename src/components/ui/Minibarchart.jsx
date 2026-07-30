import { useEffect, useState } from 'react';

/**
 * MiniBarChart — small animated bar comparison (e.g. call outcome
 * distribution). Pure CSS/SVG-free, no charting dependency. `data`:
 * [{ label, value, color }]. Purely presentational — caller supplies
 * already-fetched numbers.
 */
export default function MiniBarChart({ data, height = 180 }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 60);
        return () => clearTimeout(t);
    }, []);

    const max = Math.max(1, ...data.map((d) => d.value));

    return (
        <div className="flex items-end justify-between gap-5 px-2" style={{ height }}>
            {data.map((d, i) => {
                const pct = mounted ? (d.value / max) * 100 : 0;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div className="text-sm font-semibold text-text-1 mb-2 tabular-nums">{d.value}</div>
                        <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                            <div
                                className="w-full max-w-14 rounded-t-ds-sm transition-all duration-700 ease-out"
                                style={{
                                    height: `${pct}%`,
                                    minHeight: d.value > 0 ? '4px' : '0px',
                                    background: d.color,
                                }}
                            />
                        </div>
                        <div className="text-[11px] text-text-3 font-medium mt-2 uppercase tracking-wide">{d.label}</div>
                    </div>
                );
            })}
        </div>
    );
}