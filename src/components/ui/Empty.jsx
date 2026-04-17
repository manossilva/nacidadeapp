export default function Empty({ text, py = 'py-10' }) {
  return (
    <p className={`text-sm text-center ${py}`} style={{ color: '#9aad92' }}>
      {text}
    </p>
  )
}
