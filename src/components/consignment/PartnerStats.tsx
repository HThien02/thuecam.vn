import { formatVnd } from '@/lib/consignment';

export interface UnitStat {
  id: string;
  seriesId: string;
  name: string;
  serial: string;
  rentals: number;
  days: number;
  gross: number;
  yourShare: number;
  earned: number;
}

export interface SeriesStat {
  id: string;
  name: string;
  unitCount: number;
  rentals: number;
  days: number;
  gross: number;
  yourShare: number;
  earned: number;
  units: UnitStat[];
}

export interface MonthStat {
  month: string;
  count: number;
  gross: number;
  share: number;
}

const formatMonth = (month: string) => {
  const [year, m] = month.split('-');
  return `${m}/${year}`;
};

export default function PartnerStats({
  unitStats,
  seriesStats,
  monthly,
  sharePercent,
  totalGross,
  totalYourShare,
}: {
  unitStats: UnitStat[];
  seriesStats: SeriesStat[];
  monthly: MonthStat[];
  sharePercent: number;
  totalGross: number;
  totalYourShare: number;
}) {
  const platformPercent = Math.round((100 - sharePercent) * 100) / 100;
  const platformShare = totalGross - totalYourShare;
  const yourPercentWidth = totalGross > 0 ? (totalYourShare / totalGross) * 100 : sharePercent;

  return (
    <div className="space-y-8">
      <section aria-labelledby="revenue-split-heading" className="space-y-3">
        <h2 id="revenue-split-heading" className="text-lg font-bold text-slate-900">
          Chia doanh thu
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-600">
            Mỗi máy bạn ký gửi đều được chia theo cùng một tỷ lệ{' '}
            <strong className="text-slate-900">{sharePercent}%</strong> trên giá thuê (không tính tiền cọc). Phần còn lại{' '}
            <strong className="text-slate-900">{platformPercent}%</strong> là chi phí vận hành của THUECAM.
          </p>
          <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-500"
              style={{ width: `${Math.min(100, Math.max(0, yourPercentWidth))}%` }}
              aria-hidden="true"
            />
          </div>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-bold text-slate-500">Tổng giá thuê (gross)</dt>
              <dd className="mt-1 text-lg font-extrabold text-slate-900">{formatVnd(totalGross)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-sky-600">Phần của bạn ({sharePercent}%)</dt>
              <dd className="mt-1 text-lg font-extrabold text-sky-700">{formatVnd(totalYourShare)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-slate-500">Phần THUECAM ({platformPercent}%)</dt>
              <dd className="mt-1 text-lg font-extrabold text-slate-900">{formatVnd(platformShare)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="per-series-heading" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="per-series-heading" className="text-lg font-bold text-slate-900">
            Thống kê theo dòng máy
          </h2>
          <p className="text-xs text-slate-500">
            {seriesStats.length} dòng máy · {unitStats.length} máy (series)
          </p>
        </div>
        {seriesStats.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            Chưa có máy nào để thống kê.
          </p>
        ) : (
          <div className="space-y-4">
            {seriesStats.map((series) => (
              <div key={series.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-bold text-slate-900">{series.name}</p>
                    <p className="text-xs text-slate-500">
                      {series.unitCount} máy · {series.rentals} lượt thuê · {series.days} ngày
                    </p>
                  </div>
                  <div className="flex items-center gap-5 text-right">
                    <div>
                      <p className="text-[11px] font-bold uppercase text-slate-500">Tổng giá thuê</p>
                      <p className="text-sm font-extrabold text-slate-900">{formatVnd(series.gross)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-sky-600">Phần của bạn</p>
                      <p className="text-sm font-extrabold text-sky-700">{formatVnd(series.yourShare)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-emerald-600">Đã hoàn tất</p>
                      <p className="text-sm font-extrabold text-emerald-700">{formatVnd(series.earned)}</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Series (serial)</th>
                        <th className="px-4 py-2.5 font-semibold">Lượt thuê</th>
                        <th className="px-4 py-2.5 font-semibold">Tổng ngày</th>
                        <th className="px-4 py-2.5 font-semibold">Tổng giá thuê</th>
                        <th className="px-4 py-2.5 font-semibold">Phần của bạn</th>
                        <th className="px-4 py-2.5 font-semibold">Đã hoàn tất</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {series.units.map((unit) => (
                        <tr key={unit.id}>
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-700">{unit.serial}</td>
                          <td className="px-4 py-2.5 text-slate-700">{unit.rentals}</td>
                          <td className="px-4 py-2.5 text-slate-700">{unit.days}</td>
                          <td className="px-4 py-2.5 text-slate-700">{formatVnd(unit.gross)}</td>
                          <td className="px-4 py-2.5 font-bold text-sky-700">{formatVnd(unit.yourShare)}</td>
                          <td className="px-4 py-2.5 font-bold text-emerald-700">{formatVnd(unit.earned)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-white">
              <p className="font-bold">
                Tổng cộng · {unitStats.reduce((s, u) => s + u.rentals, 0)} lượt thuê ·{' '}
                {unitStats.reduce((s, u) => s + u.days, 0)} ngày
              </p>
              <div className="flex items-center gap-5 text-right">
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-300">Tổng giá thuê</p>
                  <p className="text-sm font-extrabold">{formatVnd(totalGross)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-sky-300">Phần của bạn</p>
                  <p className="text-sm font-extrabold text-sky-300">{formatVnd(totalYourShare)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-emerald-300">Đã hoàn tất</p>
                  <p className="text-sm font-extrabold text-emerald-300">
                    {formatVnd(unitStats.reduce((s, u) => s + u.earned, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {monthly.length > 0 ? (
        <section aria-labelledby="monthly-heading" className="space-y-3">
          <h2 id="monthly-heading" className="text-lg font-bold text-slate-900">
            Doanh thu theo tháng
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Tháng</th>
                  <th className="px-4 py-3">Số lượt thuê</th>
                  <th className="px-4 py-3">Tổng giá thuê</th>
                  <th className="px-4 py-3">Phần của bạn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthly.map((row) => (
                  <tr key={row.month}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{formatMonth(row.month)}</td>
                    <td className="px-4 py-3 text-slate-700">{row.count}</td>
                    <td className="px-4 py-3 text-slate-700">{formatVnd(row.gross)}</td>
                    <td className="px-4 py-3 font-bold text-sky-700">{formatVnd(row.share)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">Thống kê theo tháng bắt đầu thuê. Số liệu đối soát cuối cùng do THUECAM xác nhận.</p>
        </section>
      ) : null}
    </div>
  );
}
