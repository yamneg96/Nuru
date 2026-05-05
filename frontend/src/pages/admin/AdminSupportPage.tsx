import { useState, useEffect } from "react"
import { getAdminTickets, updateAdminTicket } from "@/api/admin.api"
import type { AdminTicketListResponse } from "@/api/admin.api"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

type Ticket = AdminTicketListResponse["tickets"][number]

const STATUS_COLORS: Record<string, string> = {
  open: "bg-tertiary-container/20 text-tertiary",
  in_progress: "bg-primary-container/20 text-primary",
  resolved: "bg-secondary-container/20 text-secondary",
  closed: "bg-surface-variant text-on-surface-variant",
}

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-surface-variant text-on-surface-variant",
  medium: "bg-tertiary-container/20 text-tertiary",
  high: "bg-error-container/20 text-error",
  urgent: "bg-error text-on-error",
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [replyName, setReplyName] = useState("Admin")
  const [actionLoading, setActionLoading] = useState(false)

  const fetchTickets = async (page = 1) => {
    setLoading(true)
    try {
      const res = await getAdminTickets({
        status: filterStatus || undefined,
        category: filterCategory || undefined,
        page,
        limit: 20,
      })
      setTickets(res.tickets)
      setPagination(res.pagination)
    } catch {
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterCategory])

  const handleStatusChange = async (ticketId: string, status: string) => {
    setActionLoading(true)
    try {
      await updateAdminTicket(ticketId, { status: status as any })
      await fetchTickets(pagination.page)
    } catch {
      /* ignore */
    } finally {
      setActionLoading(false)
    }
  }

  const handlePriorityChange = async (ticketId: string, priority: string) => {
    setActionLoading(true)
    try {
      await updateAdminTicket(ticketId, { priority: priority as any })
      await fetchTickets(pagination.page)
    } catch {
      /* ignore */
    } finally {
      setActionLoading(false)
    }
  }

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim()) return
    setActionLoading(true)
    try {
      await updateAdminTicket(ticketId, {
        response: { responderName: replyName || "Admin", message: replyText.trim() },
      })
      setReplyText("")
      await fetchTickets(pagination.page)
    } catch {
      /* ignore */
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <AdminSidebar active="Support Tickets" />

      <main className="ml-0 flex-1 overflow-y-auto p-6 md:ml-72">
        <div className="mb-6">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-background">
            Support Tickets
          </h1>
          <p className="mt-1 text-on-surface-variant">
            Manage user support tickets, respond to inquiries, and track resolution.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="medical">Medical</option>
            <option value="technical">Technical</option>
            <option value="escalation">Escalation</option>
          </select>
          <div className="ml-auto text-sm text-on-surface-variant">
            {pagination.total} ticket{pagination.total !== 1 ? "s" : ""} total
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined mb-4 text-[48px] text-outline">
              confirmation_number
            </span>
            <h3 className="text-lg font-semibold text-on-surface">No tickets found</h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-all"
              >
                {/* Ticket Header Row */}
                <button
                  onClick={() => setExpandedId(expandedId === ticket.ticketId ? null : ticket.ticketId)}
                  className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-surface-container-low/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container/30">
                    <span className="material-symbols-outlined text-primary">
                      {ticket.category === "medical" ? "medical_services" :
                       ticket.category === "escalation" ? "priority_high" :
                       ticket.category === "technical" ? "bug_report" : "mail"}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold text-on-surface">{ticket.subject}</h3>
                      <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${PRIORITY_COLORS[ticket.priority] || ""}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-on-surface-variant">
                      <span>#{ticket.ticketId}</span>
                      <span>•</span>
                      <span>{ticket.source}</span>
                      <span>•</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      {ticket.responses.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-primary">{ticket.responses.length} response{ticket.responses.length > 1 ? "s" : ""}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[ticket.status] || ""}`}>
                    {ticket.status.replace("_", " ")}
                  </span>

                  <span className={`material-symbols-outlined text-outline transition-transform ${expandedId === ticket.ticketId ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>

                {/* Expanded Detail */}
                {expandedId === ticket.ticketId && (
                  <div className="border-t border-outline-variant/20 p-4">
                    {/* Message */}
                    <div className="mb-4 rounded-xl bg-surface-container-low p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                        <span>{ticket.name || "Anonymous"}</span>
                        {ticket.email && <span className="text-primary">({ticket.email})</span>}
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-on-surface">{ticket.message}</p>
                    </div>

                    {/* Previous Responses */}
                    {ticket.responses.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-outline">Responses</h4>
                        {ticket.responses.map((r, i) => (
                          <div key={i} className="rounded-xl border border-primary/10 bg-primary-container/10 p-3">
                            <div className="mb-1 flex items-center gap-2 text-xs text-primary">
                              <span className="material-symbols-outlined text-[14px]">support_agent</span>
                              <span className="font-semibold">{r.responderName}</span>
                              <span className="text-on-surface-variant">
                                {new Date(r.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-on-surface">{r.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions Row */}
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <label className="text-xs font-semibold text-on-surface-variant">Status:</label>
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.ticketId, e.target.value)}
                        disabled={actionLoading}
                        className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none disabled:opacity-50"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>

                      <label className="ml-4 text-xs font-semibold text-on-surface-variant">Priority:</label>
                      <select
                        value={ticket.priority}
                        onChange={(e) => handlePriorityChange(ticket.ticketId, e.target.value)}
                        disabled={actionLoading}
                        className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none disabled:opacity-50"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    {/* Reply Form */}
                    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">reply</span>
                        <span className="text-xs font-semibold text-on-surface">Reply as:</span>
                        <input
                          type="text"
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                          className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2 py-1 text-xs text-on-surface focus:border-primary focus:outline-none"
                          placeholder="Your name"
                        />
                      </div>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                        className="mb-2 w-full resize-none rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
                        placeholder="Type your response..."
                      />
                      <button
                        onClick={() => handleReply(ticket.ticketId)}
                        disabled={!replyText.trim() || actionLoading}
                        className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-on-primary transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-50"
                      >
                        {actionLoading ? "Sending..." : "Send Response"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => fetchTickets(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="rounded-lg border border-outline-variant/30 px-3 py-1.5 text-sm text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-30"
                >
                  Previous
                </button>
                <span className="text-sm text-on-surface-variant">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => fetchTickets(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="rounded-lg border border-outline-variant/30 px-3 py-1.5 text-sm text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
