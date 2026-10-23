export default function Badge({ tone = 'violet', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
