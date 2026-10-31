import { useEffect, useState } from 'react';
import { LEVELS } from './curriculum.js';
import { getPyodide, runPython } from './python.js';

const ALL = LEVELS.flatMap((l) => l.lessons.map((x) => ({ ...x, level: l.name })));

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

const MESSAGES = {
  ok: 'Correct! Your output matches.',
  wrong: 'Not quite. Compare your output with the expected output.',
  error: 'Your code has an error. Read the output and fix it.',
};

export default function App() {
  const [i, setI] = useState(() => Math.min(read('pystep-cur', 0), ALL.length - 1));
  const [done, setDone] = useState(() => read('pystep-done', []));
  const [code, setCode] = useState(() => ALL[Math.min(read('pystep-cur', 0), ALL.length - 1)].c);
  const [out, setOut] = useState('');
  const [state, setState] = useState('idle');
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const lesson = ALL[i];

  useEffect(() => {
    getPyodide()
      .then(() => setReady(true))
      .catch((e) => {
        setOut(e.message);
        setState('error');
      });
  }, []);

  const go = (n) => {
    setI(n);
    setCode(ALL[n].c);
    setOut('');
    setState('idle');
    setMenu(false);
    write('pystep-cur', n);
  };

  const run = async () => {
    setState('running');
    const { text, error } = await runPython(code);
    setOut(error ? (text ? text + '\n' : '') + error : text);
    if (error) return setState('error');
    if (text.trim() === lesson.x.trim()) {
      setState('ok');
      if (!done.includes(lesson.id)) {
        const next = [...done, lesson.id];
        setDone(next);
        write('pystep-done', next);
      }
    } else {
      setState('wrong');
    }
  };

  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const t = e.target;
    const s = t.selectionStart;
    setCode(code.slice(0, s) + '    ' + code.slice(t.selectionEnd));
    requestAnimationFrame(() => t.setSelectionRange(s + 4, s + 4));
  };

  return (
    <>
      <header className="top">
        <div className="logo">
          <span className="mark">Py</span>
          PyStep
        </div>
        <div className="meta">
          <span>
            {done.length} of {ALL.length} done
          </span>
          <button className="menu" onClick={() => setMenu(!menu)} aria-expanded={menu}>
            Lessons
          </button>
        </div>
      </header>

      <div className="layout">
        <nav className={'side' + (menu ? ' open' : '')} aria-label="Lessons">
          <div className="bar" aria-hidden="true">
            <i style={{ width: (done.length / ALL.length) * 100 + '%' }} />
          </div>
          {LEVELS.map((l) => (
            <div key={l.name}>
              <h3>{l.name}</h3>
              {l.lessons.map((x) => {
                const n = ALL.findIndex((a) => a.id === x.id);
                const isDone = done.includes(x.id);
                return (
                  <button
                    key={x.id}
                    className={'item' + (n === i ? ' cur' : '')}
                    onClick={() => go(n)}
                    aria-current={n === i ? 'true' : undefined}
                  >
                    <span className={'dot' + (isDone ? ' ok' : '')} aria-hidden="true">
                      {isDone ? '✓' : n + 1}
                    </span>
                    {x.t}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <main>
          <section className="card">
            <p className="sub">
              {lesson.level}, lesson {i + 1} of {ALL.length}
            </p>
            <h1>{lesson.t}</h1>
            <p>{lesson.e}</p>
          </section>

          <section className="card">
            <h2>Your turn</h2>
            <div className="grid">
              <div>
                <label className="lab" htmlFor="code">
                  main.py
                </label>
                <textarea
                  id="code"
                  className="editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
              <div>
                <span className="lab">Output</span>
                <pre className="out" aria-live="polite">
                  {out || (ready ? 'Press Run code to see the output.' : 'Loading Python...')}
                </pre>
              </div>
            </div>
            <span className="lab">Expected output</span>
            <pre className="exp">{lesson.x}</pre>
            <div className="row">
              <button className="btn" onClick={run} disabled={!ready || state === 'running'}>
                {state === 'running' ? 'Running...' : 'Run code'}
              </button>
              <button
                className="ghost"
                onClick={() => {
                  setCode(lesson.c);
                  setOut('');
                  setState('idle');
                }}
              >
                Reset code
              </button>
              {MESSAGES[state] && <span className={'msg ' + state}>{MESSAGES[state]}</span>}
            </div>
            <div className="row pager">
              <button className="ghost" disabled={i === 0} onClick={() => go(i - 1)}>
                Previous lesson
              </button>
              <button className="ghost" disabled={i === ALL.length - 1} onClick={() => go(i + 1)}>
                Next lesson
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
