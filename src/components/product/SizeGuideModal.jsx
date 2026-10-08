import Modal from '../ui/Modal'

export const SIZE_CHART = [
  { eu: 39, us: 6.5, uk: 5.5, cm: 24.5 },
  { eu: 40, us: 7, uk: 6, cm: 25 },
  { eu: 41, us: 8, uk: 7, cm: 26 },
  { eu: 42, us: 8.5, uk: 7.5, cm: 26.5 },
  { eu: 43, us: 9.5, uk: 8.5, cm: 27.5 },
  { eu: 44, us: 10, uk: 9, cm: 28 },
  { eu: 45, us: 11, uk: 10, cm: 29 },
]

export function SizeTable({ highlight }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-fog">
      <table className="w-full text-center text-sm">
        <caption className="sr-only">Shoe size conversion chart</caption>
        <thead className="bg-paper text-xs uppercase tracking-wider text-steel">
          <tr>
            {['EU', 'US', 'UK', 'Foot (cm)'].map((h) => (
              <th key={h} scope="col" className="px-3 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SIZE_CHART.map((r) => (
            <tr key={r.eu} className={r.eu === highlight ? 'bg-volt/10 font-semibold' : 'border-t border-fog'}>
              <td className="px-3 py-2.5">{r.eu}</td>
              <td className="px-3 py-2.5">{r.us}</td>
              <td className="px-3 py-2.5">{r.uk}</td>
              <td className="px-3 py-2.5">{r.cm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SizeGuideModal({ open, onClose, highlight }) {
  return (
    <Modal open={open} onClose={onClose} title="Size Guide">
      <div className="space-y-5 px-6 pb-7 pt-4">
        <p className="text-sm leading-relaxed text-steel">
          STRIDEVOLT shoes fit true to size. Measure your foot from heel to longest toe and match it to the
          centimetre column. Between sizes? Go half a size up for running styles.
        </p>
        <SizeTable highlight={highlight} />
        <ol className="grid gap-3 text-sm sm:grid-cols-3">
          {['Stand on a sheet of paper, heel against a wall.', 'Mark the tip of your longest toe.', 'Measure heel to mark in cm.'].map((t, i) => (
            <li key={t} className="rounded-2xl bg-paper p-4">
              <span className="display text-lg text-volt">0{i + 1}</span>
              <p className="mt-1 text-steel">{t}</p>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  )
}
