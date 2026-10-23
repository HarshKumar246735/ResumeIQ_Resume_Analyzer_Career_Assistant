export default function ScoreDonut({ score }) {
  return (
    <div className="donut" role="img" aria-label={`Compatibility score ${score} out of 100`} style={{ background: `conic-gradient(var(--color-primary) ${score * 3.6}deg, #eeeaf9 0)` }}>
      <div className="donut-inner"><div><b>{score}</b><small>/100</small></div></div>
    </div>
  );
}
