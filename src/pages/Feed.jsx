import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { MOCK_FEED, MOCK_EVENTS, MOCK_PLACES } from '../lib/mockData'
import { shareWhatsappLink } from '../lib/whatsapp'
import { timeAgo } from '../lib/time'

function Avatar({ initials, size = 'md' }) {
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-10 h-10 text-sm'
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{ background: '#2e4226', color: '#f5f0e8' }}
    >
      {initials}
    </div>
  )
}

function CommentInput({ onSubmit }) {
  const [text, setText] = useState('')
  function submit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text.trim())
    setText('')
  }
  return (
    <form onSubmit={submit} className="flex gap-2 mt-3 items-center">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Escreve aí..."
        className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none"
        style={{
          background: 'rgba(237,232,223,0.7)',
          border: '1px solid rgba(255,255,255,0.5)',
          color: '#1f2e1a',
        }}
      />
      <button
        type="submit"
        className="px-3 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
        style={{ background: '#2e4226', color: '#f5f0e8' }}
      >
        Enviar
      </button>
    </form>
  )
}

function FeedCard({ post, onColar, onComment }) {
  const [showComments, setShowComments] = useState(false)
  const item = post.event ?? post.place
  const itemType = post.event ? 'evento' : 'local'
  const to = post.event ? `/evento/${item.slug}` : `/local/${item.slug}`
  const colado = post._userColado

  function handleShare() {
    const link = shareWhatsappLink(item.name, item.slug, itemType)
    window.open(link, '_blank')
  }

  return (
    <article
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(255,252,247,0.55)',
        backdropFilter: 'blur(16px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
        border: '1px solid rgba(255,255,255,0.62)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header do post */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <Avatar initials={post.user.avatar} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight" style={{ color: '#1f2e1a' }}>
            {post.user.name}
            <span className="font-normal" style={{ color: '#728c68' }}> colou em </span>
            <Link to={to} className="font-semibold underline decoration-dotted" style={{ color: '#2e4226' }}>
              {item.name}
            </Link>
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#9aad92' }}>{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {/* Imagem */}
      {item.cover_image_url && (
        <Link to={to}>
          <div className="relative mx-4 rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img
              src={item.cover_image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(15,22,10,0.4) 0%, transparent 60%)' }}
            />
          </div>
        </Link>
      )}

      {/* Mensagem do usuário */}
      {post.message && (
        <p className="px-4 pt-3 text-sm" style={{ color: '#2e4226' }}>
          {post.message}
        </p>
      )}

      {/* Ações */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-2">
        {/* Tô colado */}
        <button
          onClick={() => onColar(post.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
          style={{
            background: colado ? '#2e4226' : 'rgba(46,66,38,0.08)',
            color: colado ? '#f5f0e8' : '#2e4226',
          }}
        >
          <svg className="w-3.5 h-3.5" fill={colado ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {colado ? 'Colado' : 'Tô colado'}
          {post.colados > 0 && (
            <span
              className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px]"
              style={{ background: colado ? 'rgba(255,255,255,0.2)' : 'rgba(46,66,38,0.12)' }}
            >
              {post.colados}
            </span>
          )}
        </button>

        {/* Comentar */}
        <button
          onClick={() => setShowComments(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95"
          style={{ background: 'rgba(46,66,38,0.08)', color: '#2e4226' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {post.comments.length > 0 ? post.comments.length : 'Comentar'}
        </button>

        {/* Compartilhar */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 ml-auto"
          style={{ background: 'rgba(46,66,38,0.08)', color: '#2e4226' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Mandar
        </button>
      </div>

      {/* Comentários */}
      {showComments && (
        <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
          {post.comments.length > 0 && (
            <div className="space-y-2 mb-3">
              {post.comments.map(c => (
                <div key={c.id} className="flex items-start gap-2">
                  <Avatar initials={c.user.slice(0, 2).toUpperCase()} size="sm" />
                  <div
                    className="flex-1 rounded-xl px-3 py-2 text-xs"
                    style={{ background: 'rgba(237,232,223,0.6)', color: '#1f2e1a' }}
                  >
                    <span className="font-semibold">{c.user} </span>
                    {c.text}
                  </div>
                </div>
              ))}
            </div>
          )}
          <CommentInput onSubmit={text => onComment(post.id, text)} />
        </div>
      )}
    </article>
  )
}

export default function Feed() {
  const [posts, setPosts] = useState(
    () => MOCK_FEED.map(p => ({ ...p, _userColado: false }))
  )
  const [checkin, setCheckin] = useState(null) // null = closed, { item, msg } = open

  const allItems = useMemo(() => [...MOCK_EVENTS, ...MOCK_PLACES], [])

  function handleColar(postId) {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, _userColado: !p._userColado, colados: p._userColado ? p.colados - 1 : p.colados + 1 }
          : p
      )
    )
  }

  function handleComment(postId, text) {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, comments: [...p.comments, { id: `c-${Date.now()}`, user: 'Você', text }] }
          : p
      )
    )
  }

  function submitCheckin() {
    if (!checkin?.item) return
    const { item, msg } = checkin
    const isEvent = !!item.starts_at
    setPosts(prev => [{
      id: `feed-${Date.now()}`,
      user: { name: 'Você', avatar: 'VC' },
      type: 'checkin',
      [isEvent ? 'event' : 'place']: item,
      message: msg,
      colados: 0,
      createdAt: new Date().toISOString(),
      comments: [],
      _userColado: false,
    }, ...prev])
    setCheckin(null)
  }

  return (
    <PageShell>
      <div className="pt-5 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1f2e1a' }}>Feed</h1>
            <p className="text-sm mt-0.5" style={{ color: '#728c68' }}>Quem saiu hoje em Aju</p>
          </div>
          <button
            onClick={() => setCheckin({ item: null, msg: '' })}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold active:scale-95 transition-all"
            style={{ background: '#2e4226', color: '#f5f0e8', boxShadow: '0 2px 12px rgba(30,46,26,0.25)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Colar
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {posts.map(post => (
          <FeedCard key={post.id} post={post} onColar={handleColar} onComment={handleComment} />
        ))}
      </div>

      {checkin !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(15,22,10,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setCheckin(null) }}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl p-6 pb-10"
            style={{ background: 'rgba(240,235,226,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)' }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(46,66,38,0.2)' }} />
            <h2 className="font-bold text-lg mb-4" style={{ color: '#1f2e1a' }}>Onde você tá colado?</h2>

            <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
              {allItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCheckin(c => ({ ...c, item }))}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all active:scale-[0.98]"
                  style={{
                    background: checkin.item?.id === item.id ? '#2e4226' : 'rgba(255,252,247,0.6)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    color: checkin.item?.id === item.id ? '#f5f0e8' : '#1f2e1a',
                  }}
                >
                  {item.cover_image_url && (
                    <img src={item.cover_image_url} alt={item.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">{item.name}</p>
                    <p className="text-xs mt-0.5 opacity-70">{item.category}</p>
                  </div>
                </button>
              ))}
            </div>

            <input
              value={checkin.msg}
              onChange={e => setCheckin(c => ({ ...c, msg: e.target.value }))}
              placeholder="Conta alguma coisa (opcional)..."
              className="input mb-4"
            />

            <button onClick={submitCheckin} disabled={!checkin.item} className="btn-primary disabled:opacity-40">
              Postar no feed
            </button>
          </div>
        </div>
      )}
    </PageShell>
  )
}
