function SummaryCard({ label, meta, tone = 'neutral', value }) {
  return (
    <article className={`summary-card ${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      {meta && <span>{meta}</span>}
    </article>
  )
}

export default SummaryCard
