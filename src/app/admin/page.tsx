"use client";
import { useState } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────
const SERVERS = [
  { id: "srv-uk-01", name: "UK246", location: "London, UK", provider: "Binary Racks", ip: "41.215.241.30",
    cpu: "16 cores", ramTotal: 64, ramUsed: 28, storageTotal: 480, storageUsed: 180,
    vpsCount: 5, vpsMax: 12, status: "online", cost: 48.60, proxmox: "https://41.215.241.30:8006" },
];

const VPS_LIST = [
  { id: "vps-001", customer: "Ahmed Raza", plan: "Business 8GB", ram: 8, cpu: 4, ip: "41.215.241.19", status: "running", price: 18, created: "May 17" },
  { id: "vps-002", customer: "Sarah Khan", plan: "Starter 4GB", ram: 4, cpu: 2, ip: "41.215.241.20", status: "running", price: 10, created: "May 17" },
  { id: "vps-003", customer: "Ali Hassan", plan: "Starter 4GB", ram: 4, cpu: 2, ip: "41.215.241.21", status: "running", price: 10, created: "May 18" },
  { id: "vps-004", customer: "John Smith", plan: "Business 8GB", ram: 8, cpu: 4, ip: "41.215.241.22", status: "running", price: 18, created: "May 18" },
  { id: "vps-005", customer: "Test Account", plan: "Starter 4GB", ram: 4, cpu: 2, ip: "41.215.241.23", status: "suspended", price: 10, created: "May 16" },
];

const CUSTOMERS = [
  { id: "C-01", name: "Ahmed Raza", email: "ahmed@example.com", country: "🇵🇰 PK", vps: 1, spent: 18, status: "active", joined: "May 17" },
  { id: "C-02", name: "Sarah Khan", email: "sarah@example.com", country: "🇵🇰 PK", vps: 1, spent: 10, status: "active", joined: "May 17" },
  { id: "C-03", name: "Ali Hassan", email: "ali@example.com", country: "🇵🇰 PK", vps: 1, spent: 10, status: "active", joined: "May 18" },
  { id: "C-04", name: "John Smith", email: "john@example.com", country: "🇬🇧 UK", vps: 1, spent: 18, status: "active", joined: "May 18" },
  { id: "C-05", name: "Test Account", email: "test@test.com", country: "🇬🇧 UK", vps: 1, spent: 0, status: "unpaid", joined: "May 16" },
];

const ORDERS = [
  { id: "ORD-105", customer: "John Smith", plan: "Business 8GB", amount: 18, status: "paid", time: "5 min ago" },
  { id: "ORD-104", customer: "Ali Hassan", plan: "Starter 4GB", amount: 10, status: "paid", time: "2 hours ago" },
  { id: "ORD-103", customer: "Test Account", plan: "Starter 4GB", amount: 10, status: "pending", time: "3 hours ago" },
  { id: "ORD-102", customer: "Sarah Khan", plan: "Starter 4GB", amount: 10, status: "paid", time: "5 hours ago" },
  { id: "ORD-101", customer: "Ahmed Raza", plan: "Business 8GB", amount: 18, status: "paid", time: "Yesterday" },
];

const AVAILABLE_IPS = ["41.215.241.24", "41.215.241.25", "41.215.241.26", "41.215.241.27", "41.215.241.28", "41.215.241.29"];

// ─── HELPERS ──────────────────────────────────────────────────
function Dot({ s }: { s: string }) {
  const c: Record<string, string> = { online: "#22c55e", running: "#22c55e", stopped: "#ef4444", suspended: "#eab308", active: "#22c55e", unpaid: "#ef4444", paid: "#22c55e", pending: "#eab308" };
  return <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: c[s] || "#71717a", boxShadow: `0 0 8px ${c[s]}`, marginRight: 7 }} />;
}
function Bar({ value, max, color = "#f59e0b" }: { value: number; max: number; color?: string }) {
  return <div style={{ height: 4, background: "rgba(255,255,255,.05)", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, transition: ".4s" }} /></div>;
}

// ─── MAIN ─────────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [showCreate, setShowCreate] = useState(false);

  const running = VPS_LIST.filter(v => v.status === "running");
  const revenue = running.reduce((s, v) => s + v.price, 0);
  const cost = SERVERS.reduce((s, srv) => s + srv.cost, 0);
  const profit = revenue - cost;
  const paidCustomers = CUSTOMERS.filter(c => c.status === "active").length;

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "servers", label: "Servers", badge: SERVERS.length },
    { id: "vps", label: "VPS Instances", badge: VPS_LIST.length },
    { id: "customers", label: "Customers", badge: CUSTOMERS.length },
    { id: "orders", label: "Orders" },
    { id: "finance", label: "Finance" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#08080a", color: "#ededf0", fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
::selection{background:rgba(245,158,11,.3);color:#fff}
body{background:#08080a;-webkit-font-smoothing:antialiased}
.a-sb{width:230px;background:#0a0a0f;border-right:1px solid rgba(255,255,255,.05);padding:20px 14px;position:fixed;height:100vh;overflow-y:auto}
.a-mn{flex:1;margin-left:230px;padding:24px 28px}
.a-brand{display:flex;align-items:center;gap:9px;padding:0 8px 22px;border-bottom:1px solid rgba(255,255,255,.05);margin-bottom:14px;text-decoration:none;color:#fff}
.a-icon{width:30px;height:30px;border-radius:7px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#08080a;box-shadow:0 2px 8px rgba(245,158,11,.3)}
.a-title{font-weight:700;font-size:14px}.a-title span{display:block;color:#f59e0b;font-size:10px;font-weight:600;margin-top:1px;text-transform:uppercase;letter-spacing:.1em}
.a-sec{font-size:10px;color:rgba(255,255,255,.25);text-transform:uppercase;letter-spacing:.08em;font-weight:600;padding:14px 8px 7px}
.a-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:7px;color:rgba(255,255,255,.55);font-size:13px;font-weight:500;cursor:pointer;border:none;background:none;width:100%;text-align:left;font-family:inherit;margin-bottom:1px;transition:.2s}
.a-item:hover{background:rgba(255,255,255,.04);color:#fff}
.a-item.on{background:rgba(245,158,11,.1);color:#fbbf24;border:1px solid rgba(245,158,11,.2)}
.a-badge{margin-left:auto;background:rgba(245,158,11,.15);color:#fbbf24;font-size:10px;font-weight:700;padding:1px 6px;border-radius:99px}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;flex-wrap:wrap;gap:12px}
.pg-t{font-size:24px;font-weight:700;color:#fff;letter-spacing:-.025em}
.pg-s{font-size:13px;color:rgba(255,255,255,.4);margin-top:2px}
.btn{padding:8px 14px;border-radius:7px;font-size:12.5px;font-weight:600;border:none;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:6px;line-height:1;transition:.2s;text-decoration:none}
.btn-gold{background:#f59e0b;color:#08080a}.btn-gold:hover{background:#fbbf24}
.btn-g{background:rgba(255,255,255,.04);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.08)}.btn-g:hover{background:rgba(255,255,255,.08);color:#fff}
.btn-r{background:rgba(239,68,68,.1);color:#ef4444;border:1px solid rgba(239,68,68,.2)}.btn-r:hover{background:rgba(239,68,68,.18)}
.btn-pu{background:#8b5cf6;color:#fff}.btn-pu:hover{background:#7c3aed}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
.g2{display:grid;grid-template-columns:1.4fr 1fr;gap:14px}
.st{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:11px;padding:16px}
.st-l{font-size:10.5px;color:rgba(255,255,255,.35);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.st-v{font-size:24px;font-weight:700;color:#fff;font-family:'JetBrains Mono',monospace;letter-spacing:-.02em}
.st-x{font-size:11.5px;color:rgba(255,255,255,.4);margin-top:5px}
.st-x.green{color:#22c55e}.st-x.red{color:#ef4444}
.cd{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:12px;padding:18px;margin-bottom:14px}
.cd-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.cd-t{font-size:14px;font-weight:600;color:#fff}
.srv{padding:18px;background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.05);border-radius:11px;margin-bottom:10px}
.srv-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:14px}
.srv-nm{font-size:15px;font-weight:700;color:#fff;display:flex;align-items:center}
.srv-meta{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
.tag{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:99px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);font-size:11px;color:rgba(255,255,255,.6);font-weight:500}
.tag.code{font-family:'JetBrains Mono',monospace;font-size:10.5px}
.tag.gold{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.2);color:#fbbf24}
.srv-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:14px}
.ss-l{font-size:10px;color:rgba(255,255,255,.4);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.ss-v{font-size:13px;color:#fff;font-weight:600;display:flex;justify-content:space-between;margin-bottom:5px;font-family:'JetBrains Mono',monospace}
.tbl{width:100%;border-collapse:collapse}
.tbl th{font-size:10.5px;color:rgba(255,255,255,.4);font-weight:600;text-transform:uppercase;letter-spacing:.06em;text-align:left;padding:9px 11px;border-bottom:1px solid rgba(255,255,255,.06)}
.tbl td{padding:12px 11px;font-size:12.5px;color:rgba(255,255,255,.7);border-bottom:1px solid rgba(255,255,255,.04)}
.tbl tr:last-child td{border:none}
.tbl tr:hover td{background:rgba(255,255,255,.015)}
.tbl-id{font-family:'JetBrains Mono',monospace;font-size:11px;color:#fbbf24;font-weight:600}
.tbl-b{color:#fff;font-weight:600}
.tbl-n{font-family:'JetBrains Mono',monospace;color:#fff;font-weight:600}
.badge{display:inline-block;padding:2.5px 9px;border-radius:99px;font-size:10px;font-weight:700;text-transform:uppercase}
.b-g{background:rgba(34,197,94,.1);color:#22c55e;border:1px solid rgba(34,197,94,.2)}
.b-r{background:rgba(239,68,68,.1);color:#ef4444;border:1px solid rgba(239,68,68,.2)}
.b-y{background:rgba(245,158,11,.1);color:#fbbf24;border:1px solid rgba(245,158,11,.2)}
.act{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04)}.act:last-child{border:none}
.act-d{width:7px;height:7px;border-radius:50%;margin-top:6px;flex-shrink:0}
.act-t{font-size:12.5px;color:rgba(255,255,255,.85);font-weight:500}
.act-s{font-size:10.5px;color:rgba(255,255,255,.35);margin-top:2px}
.mod-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
.mod{background:#0c0c14;border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:24px;max-width:480px;width:100%}
.mod-t{font-size:17px;font-weight:700;color:#fff;margin-bottom:6px}
.mod-s{font-size:12.5px;color:rgba(255,255,255,.5);margin-bottom:18px}
.fld{margin-bottom:12px}
.fld-l{font-size:11px;color:rgba(255,255,255,.5);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;display:block}
.fld-i,.fld-s{width:100%;padding:9px 12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:7px;color:#fff;font-size:13px;font-family:inherit;outline:none}
.fld-i:focus,.fld-s:focus{border-color:#f59e0b}
@media(max-width:1024px){.g4{grid-template-columns:repeat(2,1fr)}.g2{grid-template-columns:1fr}.srv-stats{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.a-sb{display:none}.a-mn{margin-left:0;padding:14px}}
      `}</style>

      {/* SIDEBAR */}
      <aside className="a-sb">
        <a href="/" className="a-brand">
          <div className="a-icon">U</div>
          <div className="a-title">unicornweb<span>Admin Panel</span></div>
        </a>
        <div className="a-sec">Overview</div>
        {navItems.map(n => (
          <button key={n.id} className={`a-item ${tab === n.id ? "on" : ""}`} onClick={() => setTab(n.id)}>
            {n.label}
            {n.badge && <span className="a-badge">{n.badge}</span>}
          </button>
        ))}
        <div className="a-sec">System</div>
        <a href="https://41.215.241.30:8006" target="_blank" className="a-item" style={{ textDecoration: "none" }}>🖥 Proxmox Panel</a>
        <button className="a-item">⚙️ Settings</button>
      </aside>

      {/* MAIN */}
      <main className="a-mn">
        <div className="top">
          <div>
            <h1 className="pg-t">{navItems.find(n => n.id === tab)?.label || "Dashboard"}</h1>
            <p className="pg-s">{tab === "dashboard" ? "Business overview at a glance" : tab === "servers" ? "Manage dedicated servers" : tab === "vps" ? "All customer VPS instances" : tab === "customers" ? "Manage customers" : tab === "orders" ? "Recent orders" : "Revenue & costs"}</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-g">🔄 Refresh</button>
            <button className="btn btn-gold" onClick={() => setShowCreate(true)}>+ Create VPS</button>
          </div>
        </div>

        {/* DASHBOARD */}
        {tab === "dashboard" && <>
          <div className="g4">
            <div className="st"><div className="st-l">Monthly Revenue</div><div className="st-v">£{revenue}</div><div className="st-x green">From {running.length} active VPS</div></div>
            <div className="st"><div className="st-l">Monthly Profit</div><div className="st-v" style={{ color: "#22c55e" }}>£{profit.toFixed(2)}</div><div className="st-x green">{((profit / revenue) * 100).toFixed(0)}% margin</div></div>
            <div className="st"><div className="st-l">Active VPS</div><div className="st-v">{running.length}/{VPS_LIST.length}</div><div className="st-x">{12 - VPS_LIST.length} slots free</div></div>
            <div className="st"><div className="st-l">Customers</div><div className="st-v">{paidCustomers}</div><div className="st-x">{CUSTOMERS.length - paidCustomers} unpaid</div></div>
          </div>

          <div className="g2">
            <div className="cd">
              <div className="cd-h"><div className="cd-t">Server Capacity</div><button className="btn btn-g" onClick={() => setTab("servers")}>View →</button></div>
              {SERVERS.map(srv => (
                <div className="srv" key={srv.id}>
                  <div className="srv-top">
                    <div>
                      <div className="srv-nm"><Dot s={srv.status} />{srv.name}</div>
                      <div className="srv-meta">
                        <span className="tag code">{srv.ip}</span>
                        <span className="tag">📍 {srv.location}</span>
                        <span className="tag gold">{srv.vpsCount}/{srv.vpsMax} VPS</span>
                      </div>
                    </div>
                  </div>
                  <div className="srv-stats">
                    <div><div className="ss-l">RAM</div><div className="ss-v"><span>{srv.ramUsed}GB</span><span style={{ color: "rgba(255,255,255,.3)" }}>{srv.ramTotal}GB</span></div><Bar value={srv.ramUsed} max={srv.ramTotal} color="#8b5cf6" /></div>
                    <div><div className="ss-l">Storage</div><div className="ss-v"><span>{srv.storageUsed}GB</span><span style={{ color: "rgba(255,255,255,.3)" }}>{srv.storageTotal}GB</span></div><Bar value={srv.storageUsed} max={srv.storageTotal} color="#22c55e" /></div>
                    <div><div className="ss-l">Revenue</div><div className="ss-v" style={{ color: "#22c55e" }}>£{revenue}</div></div>
                    <div><div className="ss-l">Cost</div><div className="ss-v" style={{ color: "#ef4444" }}>£{srv.cost}</div></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cd">
              <div className="cd-h"><div className="cd-t">Recent Orders</div><button className="btn btn-g" onClick={() => setTab("orders")}>All →</button></div>
              {ORDERS.map((o, i) => (
                <div className="act" key={i}>
                  <div className="act-d" style={{ background: o.status === "paid" ? "#22c55e" : "#eab308" }} />
                  <div style={{ flex: 1 }}>
                    <div className="act-t">{o.customer} — {o.plan} <span style={{ color: "#fbbf24", fontFamily: "'JetBrains Mono',monospace" }}>£{o.amount}</span></div>
                    <div className="act-s">{o.time} · <span className={`badge ${o.status === "paid" ? "b-g" : "b-y"}`}>{o.status}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* SERVERS */}
        {tab === "servers" && <div className="cd">
          <div className="cd-h"><div className="cd-t">Dedicated Servers</div><button className="btn btn-gold">+ Add Server</button></div>
          {SERVERS.map(srv => (
            <div className="srv" key={srv.id}>
              <div className="srv-top">
                <div>
                  <div className="srv-nm"><Dot s={srv.status} />{srv.name}</div>
                  <div className="srv-meta">
                    <span className="tag code">{srv.ip}</span>
                    <span className="tag">📍 {srv.location}</span>
                    <span className="tag">{srv.provider}</span>
                    <span className="tag gold">{srv.vpsCount}/{srv.vpsMax} VPS</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-gold" onClick={() => setShowCreate(true)}>+ New VPS</button>
                  <a href={srv.proxmox} target="_blank" className="btn btn-pu" style={{ textDecoration: "none" }}>Proxmox</a>
                </div>
              </div>
              <div className="srv-stats">
                <div><div className="ss-l">RAM</div><div className="ss-v"><span>{srv.ramUsed}/{srv.ramTotal} GB</span></div><Bar value={srv.ramUsed} max={srv.ramTotal} color="#8b5cf6" /></div>
                <div><div className="ss-l">Storage</div><div className="ss-v"><span>{srv.storageUsed}/{srv.storageTotal} GB</span></div><Bar value={srv.storageUsed} max={srv.storageTotal} color="#22c55e" /></div>
                <div><div className="ss-l">Cost/mo</div><div className="ss-v" style={{ color: "#ef4444" }}>£{srv.cost}</div></div>
                <div><div className="ss-l">Revenue/mo</div><div className="ss-v" style={{ color: "#22c55e" }}>£{revenue}</div></div>
              </div>
            </div>
          ))}
        </div>}

        {/* VPS */}
        {tab === "vps" && <div className="cd">
          <div className="cd-h"><div><div className="cd-t">All VPS ({VPS_LIST.length})</div></div><button className="btn btn-gold" onClick={() => setShowCreate(true)}>+ Create VPS</button></div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Customer</th><th>Plan</th><th>IP</th><th>RAM</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {VPS_LIST.map(v => (
                <tr key={v.id}>
                  <td><span className="tbl-id">{v.id}</span></td>
                  <td className="tbl-b">{v.customer}</td>
                  <td>{v.plan}</td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", color: "#a78bfa" }}>{v.ip}</td>
                  <td className="tbl-n">{v.ram}GB</td>
                  <td className="tbl-n">£{v.price}</td>
                  <td><Dot s={v.status} />{v.status}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-g" style={{ padding: "3px 8px", fontSize: 10 }}>Manage</button>
                      {v.status === "running" ? <button className="btn btn-r" style={{ padding: "3px 8px", fontSize: 10 }}>Suspend</button> : <button className="btn btn-g" style={{ padding: "3px 8px", fontSize: 10 }}>Resume</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}

        {/* CUSTOMERS */}
        {tab === "customers" && <div className="cd">
          <div className="cd-h"><div className="cd-t">All Customers ({CUSTOMERS.length})</div><button className="btn btn-gold">+ Add Customer</button></div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Country</th><th>VPS</th><th>Spent</th><th>Status</th><th>Joined</th></tr></thead>
            <tbody>
              {CUSTOMERS.map(c => (
                <tr key={c.id}>
                  <td><span className="tbl-id">{c.id}</span></td>
                  <td className="tbl-b">{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.country}</td>
                  <td className="tbl-n">{c.vps}</td>
                  <td className="tbl-n">£{c.spent}</td>
                  <td><span className={`badge ${c.status === "active" ? "b-g" : "b-r"}`}>{c.status}</span></td>
                  <td>{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}

        {/* ORDERS */}
        {tab === "orders" && <div className="cd">
          <div className="cd-h"><div className="cd-t">All Orders ({ORDERS.length})</div></div>
          <table className="tbl">
            <thead><tr><th>Order</th><th>Customer</th><th>Plan</th><th>Amount</th><th>Status</th><th>Time</th><th></th></tr></thead>
            <tbody>
              {ORDERS.map(o => (
                <tr key={o.id}>
                  <td><span className="tbl-id">{o.id}</span></td>
                  <td className="tbl-b">{o.customer}</td>
                  <td>{o.plan}</td>
                  <td className="tbl-n">£{o.amount}</td>
                  <td><span className={`badge ${o.status === "paid" ? "b-g" : "b-y"}`}>{o.status}</span></td>
                  <td>{o.time}</td>
                  <td>{o.status === "pending" ? <button className="btn btn-gold" style={{ padding: "3px 8px", fontSize: 10 }}>Provision</button> : <button className="btn btn-g" style={{ padding: "3px 8px", fontSize: 10 }}>View</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}

        {/* FINANCE */}
        {tab === "finance" && <>
          <div className="g4">
            <div className="st"><div className="st-l">Revenue</div><div className="st-v">£{revenue}</div><div className="st-x green">Monthly</div></div>
            <div className="st"><div className="st-l">Costs</div><div className="st-v" style={{ color: "#ef4444" }}>£{cost.toFixed(2)}</div><div className="st-x">Servers</div></div>
            <div className="st"><div className="st-l">Profit</div><div className="st-v" style={{ color: "#22c55e" }}>£{profit.toFixed(2)}</div><div className="st-x green">{((profit / revenue) * 100).toFixed(0)}% margin</div></div>
            <div className="st"><div className="st-l">Annual Projection</div><div className="st-v">£{(profit * 12).toFixed(0)}</div><div className="st-x">If 0 growth</div></div>
          </div>
          <div className="g2">
            <div className="cd">
              <div className="cd-t" style={{ marginBottom: 14 }}>Revenue Breakdown</div>
              <table className="tbl">
                <thead><tr><th>Plan</th><th>Count</th><th>Price</th><th>Total</th></tr></thead>
                <tbody>
                  <tr><td className="tbl-b">Starter 4GB</td><td className="tbl-n">{running.filter(v => v.ram === 4).length}</td><td className="tbl-n">£10</td><td className="tbl-n">£{running.filter(v => v.ram === 4).length * 10}</td></tr>
                  <tr><td className="tbl-b">Business 8GB</td><td className="tbl-n">{running.filter(v => v.ram === 8).length}</td><td className="tbl-n">£18</td><td className="tbl-n">£{running.filter(v => v.ram === 8).length * 18}</td></tr>
                  <tr><td className="tbl-b">Enterprise 16GB</td><td className="tbl-n">0</td><td className="tbl-n">£30</td><td className="tbl-n">£0</td></tr>
                  <tr style={{ borderTop: "2px solid rgba(255,255,255,.1)" }}><td className="tbl-b" style={{ color: "#fbbf24" }}>TOTAL</td><td></td><td></td><td className="tbl-n" style={{ color: "#fbbf24", fontSize: 14 }}>£{revenue}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="cd">
              <div className="cd-t" style={{ marginBottom: 14 }}>Cost Breakdown</div>
              <table className="tbl">
                <thead><tr><th>Item</th><th>Provider</th><th>Cost</th></tr></thead>
                <tbody>
                  <tr><td className="tbl-b">UK246 Server</td><td>Binary Racks</td><td className="tbl-n">£40.50</td></tr>
                  <tr><td className="tbl-b">VAT (20%)</td><td>HMRC</td><td className="tbl-n">£8.10</td></tr>
                  <tr style={{ borderTop: "2px solid rgba(255,255,255,.1)" }}><td className="tbl-b" style={{ color: "#ef4444" }}>TOTAL</td><td></td><td className="tbl-n" style={{ color: "#ef4444", fontSize: 14 }}>£{cost.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </>}
      </main>

      {/* CREATE VPS MODAL */}
      {showCreate && <div className="mod-bg" onClick={() => setShowCreate(false)}>
        <div className="mod" onClick={e => e.stopPropagation()}>
          <div className="mod-t">Create New VPS</div>
          <div className="mod-s">Provision a new Windows VPS for a customer</div>
          <div className="fld"><label className="fld-l">Customer Name</label><input className="fld-i" placeholder="e.g. Ahmed Raza" /></div>
          <div className="fld"><label className="fld-l">Email</label><input className="fld-i" placeholder="e.g. ahmed@example.com" /></div>
          <div className="fld"><label className="fld-l">Plan</label><select className="fld-s"><option>Starter — 4GB RAM, 2 vCPU (£10/mo)</option><option>Business — 8GB RAM, 4 vCPU (£18/mo)</option><option>Enterprise — 16GB RAM, 6 vCPU (£30/mo)</option></select></div>
          <div className="fld"><label className="fld-l">Server</label><select className="fld-s"><option>UK246 (London) — {64 - SERVERS[0].ramUsed}GB RAM free</option></select></div>
          <div className="fld"><label className="fld-l">Assign IP</label><select className="fld-s">{AVAILABLE_IPS.map(ip => <option key={ip}>{ip}</option>)}</select></div>
          <div className="fld"><label className="fld-l">OS</label><select className="fld-s"><option>Windows Server 2022 (Template)</option><option>Windows Server 2019</option><option>Ubuntu 22.04</option></select></div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
            <button className="btn btn-g" onClick={() => setShowCreate(false)}>Cancel</button>
            <button className="btn btn-gold">Provision VPS →</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
