import { useId, useMemo, useState } from "react";
import "../../styles/components/figures.css";
import { evalsContent } from "../../content/evals";
import {
  ABSORPTION_LAYER,
  DEFAULT_PARAMS,
  EVENT_MONTH,
  eventJump,
  LAYER_SEES,
  MONTHS,
  simulate,
  type MonthPoint,
  type Params,
} from "./absorptionLogic";

const W = 640;
const H = 280;
const LEFT = 46;
const RIGHT = 620;
const TOP = 18;
const BOTTOM = 240;
const MAX_RATE = 0.12;

const x = (month: number) => LEFT + ((RIGHT - LEFT) * month) / MONTHS;
const y = (rate: number) => BOTTOM - ((BOTTOM - TOP) * rate) / MAX_RATE;
const yShare = (share: number) => BOTTOM - (BOTTOM - TOP) * share;

const path = (points: MonthPoint[], pick: (p: MonthPoint) => number) =>
  points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${x(p.month).toFixed(1)} ${y(pick(p)).toFixed(1)}`,
    )
    .join(" ");

const pct = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`;

export function AbsorptionFigure() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
  const [revealed, setRevealed] = useState(false);
  const uid = useId();

  const points = useMemo(() => simulate(params), [params]);
  const last = points[MONTHS];
  const eventful = params.extend || params.cut;
  const jump = eventful ? eventJump(points) : 0;
  const shadowPoint = points[EVENT_MONTH];
  const layers = evalsContent.evaluationStack.layers;

  const dependenceArea = `${points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${x(p.month).toFixed(1)} ${yShare(p.dependence).toFixed(1)}`,
    )
    .join(" ")} L ${x(MONTHS)} ${BOTTOM} L ${x(0)} ${BOTTOM} Z`;

  const summary = `Reported error rate falls from ${pct(points[0].reported)} to ${pct(last.reported)} over ${MONTHS} months while the true rate stays near ${pct(last.trueRate)}. Dependence rises from ${points[0].dependence.toFixed(2)} to ${last.dependence.toFixed(2)}.${
    eventful
      ? ` At month ${EVENT_MONTH} the reported rate jumps by ${jump.toFixed(1)} points.`
      : ""
  }`;

  const set = (patch: Partial<Params>) =>
    setParams((previous) => ({ ...previous, ...patch }));

  return (
    <div className="absorb">
      <div className="absorb__grid">
        <section className="absorb__panel" aria-labelledby={`${uid}-chart`}>
          <div className="absorb__head">
            <h4 className="absorb__title" id={`${uid}-chart`}>
              The instrument, month by month
            </h4>
            <label className="absorb__reveal">
              <input
                type="checkbox"
                checked={revealed}
                onChange={(event) => setRevealed(event.target.checked)}
              />
              Overlay the true rate
            </label>
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={summary}
            className="absorb__chart"
          >
            {[0.04, 0.08, 0.12].map((tick) => (
              <g key={tick}>
                <line
                  x1={LEFT}
                  x2={RIGHT}
                  y1={y(tick)}
                  y2={y(tick)}
                  className="absorb__grid-line"
                />
                <text
                  x={LEFT - 8}
                  y={y(tick) + 4}
                  textAnchor="end"
                  className="demo-figure__svg-label"
                >
                  {Math.round(tick * 100)}%
                </text>
              </g>
            ))}
            {[0, 12, 24, 36].map((month) => (
              <text
                key={month}
                x={x(month)}
                y={BOTTOM + 18}
                textAnchor="middle"
                className="demo-figure__svg-label"
              >
                {month === 0 ? "month 0" : month}
              </text>
            ))}
            <path d={dependenceArea} className="absorb__dependence" />
            <text
              x={RIGHT - 4}
              y={BOTTOM - 8}
              textAnchor="end"
              className="demo-figure__svg-label"
            >
              dependence {last.dependence.toFixed(2)}
            </text>
            {revealed && (
              <path
                d={path(points, (p) => p.trueRate)}
                className="absorb__true"
              />
            )}
            <path
              d={path(points, (p) => p.reported)}
              className="absorb__reported"
            />
            {eventful && (
              <g>
                <line
                  x1={x(EVENT_MONTH)}
                  x2={x(EVENT_MONTH)}
                  y1={TOP}
                  y2={BOTTOM}
                  className="absorb__event"
                />
                <text
                  x={x(EVENT_MONTH) + 6}
                  y={TOP + 12}
                  className="demo-figure__svg-label"
                >
                  {params.extend && params.cut
                    ? "extended and cut"
                    : params.extend
                      ? "extended to a second site"
                      : "staff cut 30%"}
                </text>
              </g>
            )}
            {params.shadow && (
              <g>
                <circle
                  cx={x(EVENT_MONTH)}
                  cy={y(shadowPoint.reported)}
                  r={5}
                  className="absorb__shadow-dot"
                />
                <text
                  x={x(EVENT_MONTH) - 8}
                  y={y(shadowPoint.reported) - 10}
                  textAnchor="end"
                  className="demo-figure__svg-mono"
                >
                  absorbed {pct(shadowPoint.absorbed, 0)}
                </text>
              </g>
            )}
            <text
              x={RIGHT - 4}
              y={y(last.reported) + 16}
              textAnchor="end"
              className="demo-figure__svg-mono"
            >
              reported {pct(last.reported)}
            </text>
            {revealed && (
              <text
                x={RIGHT - 4}
                y={y(last.trueRate) - 8}
                textAnchor="end"
                className="demo-figure__svg-mono absorb__true-label"
              >
                true {pct(last.trueRate)}
              </text>
            )}
          </svg>
          <dl className="demo-stats">
            <div className="demo-stat">
              <dt className="demo-stat__label">Reported, month {MONTHS}</dt>
              <dd className="demo-stat__value">{pct(last.reported)}</dd>
            </div>
            <div className="demo-stat">
              <dt className="demo-stat__label">True, month {MONTHS}</dt>
              <dd className="demo-stat__value">
                {revealed ? pct(last.trueRate) : "hidden"}
              </dd>
            </div>
            <div className="demo-stat">
              <dt className="demo-stat__label">Absorbed share</dt>
              <dd className="demo-stat__value">
                {params.shadow ? pct(shadowPoint.absorbed, 0) : "unmeasured"}
              </dd>
            </div>
            <div className="demo-stat">
              <dt className="demo-stat__label">Caught, uncounted</dt>
              <dd className="demo-stat__value">
                {params.shadow ? `${shadowPoint.uncounted}/mo` : "—"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="absorb__panel" aria-labelledby={`${uid}-controls`}>
          <h4 className="absorb__title" id={`${uid}-controls`}>
            What is around the system
          </h4>
          <div className="demo-field">
            <label className="demo-field__label" htmlFor={`${uid}-competence`}>
              Staff competence: {pct(params.competence, 0)} of errors caught
              when positioned to
            </label>
            <input
              id={`${uid}-competence`}
              className="demo-range"
              type="range"
              min={0}
              max={100}
              step={5}
              value={Math.round(params.competence * 100)}
              onChange={(event) =>
                set({ competence: Number(event.target.value) / 100 })
              }
            />
            <p className="demo-field__hint">
              The more skilled the people around the system, the better it
              reports. Set this to zero and the instrument is honest.
            </p>
          </div>
          <div className="absorb__events">
            <p className="demo-field__label">At month {EVENT_MONTH}</p>
            <label
              className={`demo-switch${params.extend ? " demo-switch--on" : ""}`}
            >
              <input
                type="checkbox"
                checked={params.extend}
                onChange={(event) => set({ extend: event.target.checked })}
              />
              <span className="absorb__switch-name">
                Extend it to a second site
              </span>
              <span className="demo-switch__text">
                Nobody there has learned to catch its errors. Half the volume
                now reaches the instrument unabsorbed.
              </span>
            </label>
            <label
              className={`demo-switch${params.cut ? " demo-switch--on" : ""}`}
            >
              <input
                type="checkbox"
                checked={params.cut}
                onChange={(event) => set({ cut: event.target.checked })}
              />
              <span className="absorb__switch-name">Cut the staff by 30%</span>
              <span className="demo-switch__text">
                An efficiency gain, on paper. The reported rate rises and the
                system is blamed.
              </span>
            </label>
            <label
              className={`demo-switch${params.shadow ? " demo-switch--on" : ""}`}
            >
              <input
                type="checkbox"
                checked={params.shadow}
                onChange={(event) => set({ shadow: event.target.checked })}
              />
              <span className="absorb__switch-name">
                Shadow the staff for a month
              </span>
              <span className="demo-switch__text">
                Count what they fix. The only instrument that measures the bias
                is one designed to.
              </span>
            </label>
          </div>
          {eventful && (
            <p
              className={`demo-verdict ${revealed ? "demo-verdict--good" : "demo-verdict--bad"}`}
            >
              {revealed
                ? `The reported rate jumped ${jump.toFixed(1)} points at month ${EVENT_MONTH} and the true rate did not move. Nothing declined. The concealment ended.`
                : `The dashboard flags a regression at month ${EVENT_MONTH}: the reported rate jumped ${jump.toFixed(1)} points. Overlay the true rate before deciding what happened.`}
            </p>
          )}
          {params.shadow && (
            <p className="demo-verdict">
              In month {EVENT_MONTH} the staff caught {shadowPoint.uncounted}{" "}
              errors that no instrument recorded, {pct(shadowPoint.absorbed, 0)}{" "}
              of everything the system got wrong. Where the absorbed share is
              this large, the people doing the absorbing are performing the
              institution's safety function, and the case that they hold
              standing over the system is correspondingly strong (
              <a href="/standards/laws#law-vii">Law VII</a>).
            </p>
          )}
        </section>
      </div>

      <section className="absorb__panel" aria-labelledby={`${uid}-layers`}>
        <h4 className="absorb__title" id={`${uid}-layers`}>
          Which layer's evaluation would have seen this
        </h4>
        <ol className="absorb__layers">
          {layers.map((layer) => (
            <li
              key={layer.id}
              className={`absorb__layer${layer.id === ABSORPTION_LAYER ? " absorb__layer--sees" : ""}`}
            >
              <p className="absorb__layer-title">{layer.title}</p>
              <p className="absorb__layer-question">{layer.question}</p>
              <p className="absorb__layer-sees">{LAYER_SEES[layer.id]}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className="demo-figure__note">
        A demonstration, not a measurement of any deployment. The true rate, the
        dependence curve, and the absorbed share are fixed functions in{" "}
        <code>src/features/absorption-figure/absorptionLogic.ts</code>; the
        layers are read from the evaluation stack on{" "}
        <a href="/evals">the evals index</a>, and a test holds the two together.
      </p>
    </div>
  );
}

export default AbsorptionFigure;
