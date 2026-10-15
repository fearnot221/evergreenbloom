import { Link, useSearchParams } from 'react-router-dom';
import { CaretDownIcon } from '../components/icons';
import { MapLink, PageHeader, PrototypeNotice, useDocumentTitle } from '../components/page';
import { categories, days, getEvent, getLocation, snapshot } from '../data/festival';
import '../styles/pages.css';

type Option = { id: string; label: string };

function FilterGroup({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="filter-group">
      <legend>{label}</legend>
      <div className="chips">
        {options.map((option) => (
          <label key={option.id} className="chip">
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ProgramPage() {
  useDocumentTitle('節目表');
  const [query, setQuery] = useSearchParams();
  const day = query.get('day') || 'all';
  const category = query.get('category') || 'all';
  const selected = snapshot.program.filter(
    (entry) =>
      (day === 'all' || entry.dayId === day) &&
      (category === 'all' || getEvent(entry.eventId)?.category === category),
  );
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(query);
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    setQuery(next, { replace: true, preventScrollReset: true });
  };
  const filtered = day !== 'all' || category !== 'all';

  return (
    <main id="route-content" tabIndex={-1} className="page container program">
      <PageHeader
        lines={['春日', '節目表']}
        lede="第二屆的日期與節目尚未公布。先用兩個測試日，體驗一天如何在祭典裡展開。"
        accent="pine"
      />
      <PrototypeNotice />

      <div className="program-filters surface">
        <FilterGroup
          label="日期"
          name="day"
          value={day}
          options={[{ id: 'all', label: '全部' }, ...days]}
          onChange={(value) => update('day', value)}
        />
        <FilterGroup
          label="類型"
          name="category"
          value={category}
          options={[
            { id: 'all', label: '全部' },
            ...Object.entries(categories).map(([id, label]) => ({ id, label })),
          ]}
          onChange={(value) => update('category', value)}
        />
        <div className="filter-summary">
          <p role="status">{selected.length} 個測試時段</p>
          {filtered && (
            <button
              type="button"
              className="button button-quiet"
              onClick={() => setQuery({}, { replace: true, preventScrollReset: true })}
            >
              清除篩選
            </button>
          )}
        </div>
      </div>

      {selected.length === 0 && (
        <div className="empty-state surface">
          <h2>沒有符合的時段</h2>
          <p>這個組合目前沒有測試資料。換一個日期或類型看看。</p>
        </div>
      )}

      {days
        .filter((d) => selected.some((entry) => entry.dayId === d.id))
        .map((d) => (
          <section className="schedule-day" key={d.id} aria-labelledby={`day-${d.id}`}>
            <h2 className="schedule-day-title" id={`day-${d.id}`}>
              <span className="display">{d.label}</span>
              <span className="small-note">非實際活動日期</span>
            </h2>
            <ol className="schedule">
              {selected
                .filter((entry) => entry.dayId === d.id)
                .sort((a, b) => a.start.localeCompare(b.start))
                .map((entry) => {
                  const event = getEvent(entry.eventId);
                  if (!event) return null;
                  return (
                    <li className="slot" key={entry.id}>
                      <p className="slot-time">
                        <time>{entry.start}</time>
                        <span>至 {entry.end}</span>
                      </p>
                      <div className="slot-body">
                        <p className="slot-kind">{categories[event.category]}</p>
                        <h3>
                          <Link to={`/events/${event.id}`}>{event.title}</Link>
                        </h3>
                        <p className="slot-place">{getLocation(entry.locationId)?.name}</p>
                        <details className="disclosure">
                          <summary>
                            參與資訊
                            <CaretDownIcon size={16} weight="bold" aria-hidden="true" />
                          </summary>
                          <div className="disclosure-body">
                            <p>{event.description}</p>
                            <p>報名、費用、參與條件：待確認。</p>
                          </div>
                        </details>
                      </div>
                      <MapLink locationId={entry.locationId} label={event.title} />
                    </li>
                  );
                })}
            </ol>
          </section>
        ))}
    </main>
  );
}
