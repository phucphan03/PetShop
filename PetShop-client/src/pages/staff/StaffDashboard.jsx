import { useState } from "react";
import { removeToken } from "../../utils/token";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

// ── dữ liệu mẫu ──────────────────────────────────────────────────────────────
const STATS = [
    {
        label: "Tổng đơn hôm nay",
        value: 84,
        icon: "fa-clipboard-list",
        color: "orange",
        trend: "+12%",
        trendUp: true,
        sub: "so với hôm qua",
    },
    {
        label: "Đã duyệt",
        value: 51,
        icon: "fa-circle-check",
        color: "success",
        percent: 61,
        sub: "tỉ lệ duyệt",
    },
    {
        label: "Từ chối",
        value: 11,
        icon: "fa-circle-xmark",
        color: "danger",
        percent: 13,
        sub: "tỉ lệ từ chối",
    },
    {
        label: "Chờ duyệt",
        value: 22,
        icon: "fa-clock",
        color: "warning",
        percent: 26,
        sub: "chờ xử lý",
    },
];

const SERVICE_REQUESTS = [
    { id: "SR-091", initials: "LT", name: "Lê Thị Thu", service: "Vệ sinh máy lạnh", time: "09:14", priority: "Khẩn cấp", status: "pending" },
    { id: "SR-090", initials: "MH", name: "Minh Hoàng", service: "Sửa chữa điện nước", time: "08:30", priority: "Bình thường", status: "approved" },
    { id: "SR-089", initials: "PN", name: "Phương Nam", service: "Lắp đặt camera an ninh", time: "07:55", priority: "Bình thường", status: "rejected" },
    { id: "SR-088", initials: "DK", name: "Đức Khoa", service: "Dọn vệ sinh văn phòng", time: "07:10", priority: "Định kỳ", status: "approved" },
    { id: "SR-087", initials: "BL", name: "Bảo Long", service: "Thi công sơn tường", time: "06:45", priority: "Dài hạn", status: "pending" },
    { id: "SR-086", initials: "TH", name: "Thanh Hoa", service: "Lắp kính cường lực", time: "06:20", priority: "Bình thường", status: "approved" },
];

const ORDERS = [
    { id: "#ORD-0814", customer: "Trần Hương", service: "Vệ sinh", value: "350.000₫", status: "done" },
    { id: "#ORD-0813", customer: "Nguyễn Tùng", service: "Sửa điện", value: "520.000₫", status: "processing" },
    { id: "#ORD-0812", customer: "Lê Minh Quân", service: "Camera", value: "1.200.000₫", status: "cancelled" },
    { id: "#ORD-0811", customer: "Phạm Thu Hà", service: "Sơn tường", value: "2.800.000₫", status: "done" },
    { id: "#ORD-0810", customer: "Hoàng Bảo Nam", service: "Máy lạnh", value: "780.000₫", status: "processing" },
    { id: "#ORD-0809", customer: "Vũ Thanh Linh", service: "Nước", value: "430.000₫", status: "done" },
    { id: "#ORD-0808", customer: "Đoàn Minh Trí", service: "Trần thạch cao", value: "3.500.000₫", status: "done" },
];

const ACTIVITIES = [
    { icon: "fa-circle-check", color: "success", title: "Duyệt đơn #ORD-0814", sub: "09:32 · Vệ sinh máy lạnh" },
    { icon: "fa-clock", color: "warning", title: "Đơn mới #ORD-0815", sub: "09:14 · Chờ xử lý" },
    { icon: "fa-circle-xmark", color: "danger", title: "Từ chối #ORD-0812", sub: "08:51 · Thiếu hồ sơ" },
    { icon: "fa-pen-to-square", color: "orange", title: "Cập nhật #ORD-0813", sub: "08:22 · Đổi lịch hẹn" },
    { icon: "fa-user-plus", color: "info", title: "Khách hàng mới", sub: "07:58 · Đỗ Thị Lan" },
];

const WEEKLY = [
    { day: "T2", approved: 42, pending: 18, rejected: 8, today: false },
    { day: "T3", approved: 55, pending: 14, rejected: 10, today: false },
    { day: "T4", approved: 38, pending: 22, rejected: 12, today: false },
    { day: "T5", approved: 62, pending: 10, rejected: 6, today: false },
    { day: "T6", approved: 48, pending: 20, rejected: 14, today: false },
    { day: "T7", approved: 51, pending: 22, rejected: 11, today: true },
];

const NAV_ITEMS = [
    { icon: "fa-grip", label: "Tổng quan", active: true },
    { icon: "fa-clipboard-list", label: "Đơn dịch vụ", active: false },
    { icon: "fa-users", label: "Khách hàng", active: false },
    { icon: "fa-chart-bar", label: "Báo cáo", active: false },
    { icon: "fa-gear", label: "Cài đặt", active: false },
    { icon: "fa-solid fa-arrow-right-from-bracket", label: "Đăng xuất", action: "logout" },
];

// ── helper badge ──────────────────────────────────────────────────────────────
const statusMap = {
    approved: { label: "Đã duyệt", bg: "bg-success-subtle text-success" },
    rejected: { label: "Từ chối", bg: "bg-danger-subtle text-danger" },
    pending: { label: "Chờ duyệt", bg: "bg-warning-subtle text-warning" },
    done: { label: "Hoàn thành", bg: "bg-success-subtle text-success" },
    processing: { label: "Đang xử lý", bg: "bg-warning-subtle text-warning" },
    cancelled: { label: "Đã huỷ", bg: "bg-danger-subtle text-danger" },
};

const StatusBadge = ({ status }) => {
    const s = statusMap[status] || { label: status, bg: "bg-secondary-subtle text-secondary" };
    return (
        <span className={`badge rounded-pill fw-semibold ${s.bg}`} style={{ fontSize: "0.7rem" }}>
            {s.label}
        </span>
    );
};

// ── stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ stat }) => {
    const iconColor =
        stat.color === "orange" ? "#F57C00"
            : stat.color === "success" ? "#3B6D11"
                : stat.color === "danger" ? "#A32D2D"
                    : "#854F0B";

    const bgColor =
        stat.color === "orange" ? "#FFF3E8"
            : stat.color === "success" ? "#EAF3DE"
                : stat.color === "danger" ? "#FCEBEB"
                    : "#FAEEDA";

    const valueColor =
        stat.color === "orange" ? "var(--orange-600)"
            : stat.color === "success" ? "#3B6D11"
                : stat.color === "danger" ? "#A32D2D"
                    : "#854F0B";

    const barColor =
        stat.color === "success" ? "#639922"
            : stat.color === "danger" ? "#E24B4A"
                : "#EF9F27";

    return (
        <div className="card border-0 h-100" style={{ borderRadius: 14, border: "1px solid rgba(217,104,0,0.15) !important", boxShadow: "0 1px 4px rgba(217,104,0,0.07)" }}>
            <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 500 }}>{stat.label}</span>
                    <div className="d-flex align-items-center justify-content-center rounded-2"
                        style={{ width: 32, height: 32, background: bgColor }}>
                        <i className={`fa-solid ${stat.icon}`} style={{ color: iconColor, fontSize: 13 }} />
                    </div>
                </div>
                <div className="fw-bold mb-2" style={{ fontSize: "1.9rem", lineHeight: 1, color: valueColor }}>
                    {stat.value}
                </div>
                {stat.trendUp !== undefined ? (
                    <div style={{ fontSize: "0.7rem", color: "#3B6D11" }}>
                        <i className="fa-solid fa-arrow-trend-up me-1" />
                        {stat.trend} {stat.sub}
                    </div>
                ) : (
                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <div className="flex-grow-1 rounded-pill overflow-hidden" style={{ height: 5, background: bgColor }}>
                                <div className="rounded-pill" style={{ width: `${stat.percent}%`, height: "100%", background: barColor }} />
                            </div>
                            <span className="fw-semibold" style={{ fontSize: "0.7rem", color: iconColor }}>{stat.percent}%</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── weekly bar chart ──────────────────────────────────────────────────────────
const WeeklyChart = () => {
    const maxTotal = Math.max(...WEEKLY.map(d => d.approved + d.pending + d.rejected));
    return (
        <div className="card border-0 h-100" style={{ borderRadius: 14, boxShadow: "0 1px 4px rgba(217,104,0,0.07)" }}>
            <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="mb-0 fw-bold" style={{ color: "#2C1A0E", fontSize: "0.875rem" }}>
                        <i className="fa-solid fa-chart-column me-2" style={{ color: "#F57C00" }} />
                        Đơn trong tuần
                    </h6>
                    <div className="d-flex gap-3" style={{ fontSize: "0.68rem" }}>
                        <span className="d-flex align-items-center gap-1 text-muted">
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#639922", display: "inline-block" }} /> Duyệt
                        </span>
                        <span className="d-flex align-items-center gap-1 text-muted">
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#EF9F27", display: "inline-block" }} /> Chờ
                        </span>
                        <span className="d-flex align-items-center gap-1 text-muted">
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#E24B4A", display: "inline-block" }} /> Từ chối
                        </span>
                    </div>
                </div>
                <div className="d-flex align-items-flex-end gap-2" style={{ height: 120 }}>
                    {WEEKLY.map((d) => {
                        //const total = d.approved + d.pending + d.rejected;
                        const scale = 90 / maxTotal;
                        const aH = Math.round(d.approved * scale);
                        const pH = Math.round(d.pending * scale);
                        const rH = Math.round(d.rejected * scale);
                        return (
                            <div key={d.day} className="d-flex flex-column align-items-center flex-fill" style={{ gap: 2 }}>
                                {d.today && (
                                    <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#F57C00", marginBottom: 2 }}>
                                        Hôm nay
                                    </div>
                                )}
                                <div className="d-flex flex-column w-75" style={{ gap: 2 }}>
                                    <div className="rounded-top" style={{ height: aH, background: d.today ? "#F57C00" : "#639922" }} />
                                    <div style={{ height: pH, background: "#EF9F27" }} />
                                    <div className="rounded-bottom" style={{ height: rH, background: "#E24B4A" }} />
                                </div>
                                <span className="mt-1" style={{ fontSize: "0.68rem", color: d.today ? "#F57C00" : "#7A4A2A", fontWeight: d.today ? 700 : 400 }}>
                                    {d.day}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ── main component ────────────────────────────────────────────────────────────
export default function StaffDashboard() {
    const [activeNav, setActiveNav] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [orderFilter, setOrderFilter] = useState("all");
    const [serviceSearch, setServiceSearch] = useState("");

    const filteredOrders = ORDERS.filter(o =>
        orderFilter === "all" ? true : o.status === orderFilter
    );

    const filteredServices = SERVICE_REQUESTS.filter(s =>
        s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.service.toLowerCase().includes(serviceSearch.toLowerCase())
    );

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.log(err);
        }

        removeToken();
        navigate("/login", { replace: true });
    };
    return (
        <>
            {/* ── Google Font + FA ── */}
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
            />
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
            />

            <style>{`
        :root {
          --orange-50: #FFF3E8;
          --orange-100: #FFE0C2;
          --orange-200: #FFCA99;
          --orange-400: #FF9A45;
          --orange-500: #F57C00;
          --orange-600: #D96800;
          --orange-700: #A84D00;
          --sidebar-w: 220px;
        }
        * { box-sizing: border-box; }
        body, .db-root { font-family: 'Be Vietnam Pro', sans-serif !important; background: #FFF8F2 !important; }
        .db-root { min-height: 100vh; }
        .sidebar {
          width: var(--sidebar-w);
          background: #fff;
          border-right: 1px solid rgba(217,104,0,0.13);
          min-height: 100vh;
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .nav-link-custom {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 8px;
          color: #7A4A2A; font-size: 0.82rem; font-weight: 500;
          text-decoration: none; margin-bottom: 2px; transition: all 0.15s;
          cursor: pointer; border: none; background: transparent; width: 100%;
        }
        .nav-link-custom:hover { background: var(--orange-50); color: var(--orange-600); }
        .nav-link-custom.active { background: var(--orange-50); color: var(--orange-600); font-weight: 700; }
        .card { border: 1px solid rgba(217,104,0,0.13) !important; }
        .table th { font-size: 0.72rem; color: #C88055; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(217,104,0,0.13) !important; }
        .table td { font-size: 0.8rem; vertical-align: middle; border-bottom: 1px solid rgba(217,104,0,0.08) !important; color: #2C1A0E; }
        .table-hover tbody tr:hover { background: var(--orange-50) !important; }
        .order-id { color: var(--orange-600); font-weight: 700; }
        .avatar-circle {
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700; flex-shrink: 0;
        }
        .activity-dot {
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .topbar-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; background: var(--orange-500); color: #fff;
          border: none; border-radius: 8px; font-size: 0.82rem; font-weight: 700;
          cursor: pointer; transition: background 0.15s; font-family: inherit;
        }
        .topbar-btn:hover { background: var(--orange-600); }
        .filter-btn {
          font-size: 0.72rem; padding: 4px 12px; border-radius: 20px;
          border: 1px solid rgba(217,104,0,0.2); background: #fff;
          color: #7A4A2A; cursor: pointer; font-weight: 500; font-family: inherit;
          transition: all 0.15s;
        }
        .filter-btn.active, .filter-btn:hover {
          background: var(--orange-500); color: #fff; border-color: var(--orange-500);
        }
        .search-input {
          border: 1px solid rgba(217,104,0,0.2); border-radius: 8px;
          padding: 6px 10px 6px 32px; font-size: 0.78rem; background: #fff;
          outline: none; font-family: inherit; width: 100%;
        }
        .search-input:focus { border-color: var(--orange-400); }
        .section-title { font-size: 0.875rem; font-weight: 700; color: #2C1A0E; }
        .see-all { font-size: 0.72rem; color: var(--orange-600); font-weight: 600; cursor: pointer; text-decoration: none; }
        .see-all:hover { color: var(--orange-700); }
        .service-row {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 11px; border-radius: 8px; margin-bottom: 6px;
          transition: background 0.12s;
        }
        .service-row:hover { background: var(--orange-50); }
        @media (max-width: 768px) {
          .sidebar { position: fixed; top: 0; left: 0; z-index: 999; transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); box-shadow: 4px 0 20px rgba(0,0,0,0.1); }
          .main-content { padding: 16px !important; }
        }
      `}</style>

            <div className="db-root d-flex">

                {/* ── SIDEBAR ── */}
                <aside className={`sidebar d-flex flex-column py-3 ${sidebarOpen ? "open" : ""}`}>
                    {/* Logo */}
                    <div className="px-3 pb-3" style={{ borderBottom: "1px solid rgba(217,104,0,0.13)" }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className="d-flex align-items-center justify-content-center rounded-2"
                                style={{ width: 36, height: 36, background: "#F57C00" }}>
                                <i className="fa-solid fa-house-chimney" style={{ color: "#fff", fontSize: 15 }} />
                            </div>
                            <div>
                                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#D96800" }}>ServiceHub</div>
                                <div style={{ fontSize: "0.65rem", color: "#C88055" }}>Quản lý dịch vụ</div>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="px-2 pt-3 flex-grow-1">
                        <div className="mb-2 px-2" style={{ fontSize: "0.65rem", fontWeight: 600, color: "#C88055", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Menu chính
                        </div>
                        {NAV_ITEMS.map((item, i) => (
                            <button
                                key={i}
                                className={`nav-link-custom ${activeNav === i ? "active" : ""}`}
                                onClick={() => {
                                    setActiveNav(i);
                                    setSidebarOpen(false);
                                    if (item.action === "logout") {
                                        handleLogout();
                                    }
                                }}
                            >
                                <i className={`fa-solid ${item.icon}`} style={{ width: 16, fontSize: 13 }} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* User */}
                    <div className="px-3 pt-3" style={{ borderTop: "1px solid rgba(217,104,0,0.13)" }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className="avatar-circle" style={{ background: "#FFE0C2", color: "#D96800" }}>NV</div>
                            <div>
                                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#2C1A0E" }}>Nguyễn Văn A</div>
                                <div style={{ fontSize: "0.65rem", color: "#C88055" }}>Nhân viên</div>
                            </div>
                            <i className="fa-solid fa-ellipsis-vertical ms-auto" style={{ color: "#C88055", fontSize: 12, cursor: "pointer" }} />
                        </div>
                    </div>
                </aside>

                {/* Overlay mobile */}
                {sidebarOpen && (
                    <div
                        className="d-md-none position-fixed top-0 start-0 w-100 h-100"
                        style={{ background: "rgba(0,0,0,0.3)", zIndex: 998 }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* ── MAIN ── */}
                <main className="flex-grow-1 main-content" style={{ padding: "28px 28px 48px", background: "#FFF8F2", minWidth: 0 }}>

                    {/* Topbar */}
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <button
                                className="d-md-none btn btn-sm border-0 p-1"
                                onClick={() => setSidebarOpen(true)}
                                style={{ color: "#F57C00" }}
                            >
                                <i className="fa-solid fa-bars fa-lg" />
                            </button>
                            <div>
                                <h1 className="mb-0 fw-bold" style={{ fontSize: "1.2rem", color: "#2C1A0E" }}>
                                    Tổng quan hôm nay
                                </h1>
                                <div style={{ fontSize: "0.72rem", color: "#C88055" }}>
                                    <i className="fa-regular fa-calendar me-1" />
                                    Thứ Bảy, 11 tháng 4 năm 2026
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div className="position-relative">
                                <button className="btn btn-light border-0 d-flex align-items-center justify-content-center"
                                    style={{ width: 36, height: 36, borderRadius: 8, background: "#fff", border: "1px solid rgba(217,104,0,0.2) !important" }}>
                                    <i className="fa-regular fa-bell" style={{ color: "#7A4A2A", fontSize: 14 }} />
                                </button>
                                <span className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
                                    style={{ fontSize: "0.55rem", padding: "2px 4px" }}>3</span>
                            </div>
                            <button className="topbar-btn">
                                <i className="fa-solid fa-plus" />
                                <span className="d-none d-sm-inline">Tạo đơn mới</span>
                            </button>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="row g-3 mb-4">
                        {STATS.map((s, i) => (
                            <div key={i} className="col-6 col-xl-3">
                                <StatCard stat={s} />
                            </div>
                        ))}
                    </div>

                    {/* Service Requests + Orders */}
                    <div className="row g-3 mb-3">
                        {/* Service Requests */}
                        <div className="col-12 col-lg-5">
                            <div className="card border-0 h-100" style={{ borderRadius: 14, boxShadow: "0 1px 4px rgba(217,104,0,0.07)" }}>
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h6 className="mb-0 section-title">
                                            <i className="fa-solid fa-list-check me-2" style={{ color: "#F57C00" }} />
                                            Yêu cầu dịch vụ
                                        </h6>
                                        <a href="#" className="see-all">Xem tất cả <i className="fa-solid fa-arrow-right fa-xs" /></a>
                                    </div>
                                    {/* search */}
                                    <div className="position-relative mb-3">
                                        <i className="fa-solid fa-magnifying-glass position-absolute"
                                            style={{ left: 10, top: "50%", transform: "translateY(-50%)", color: "#C88055", fontSize: 12 }} />
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Tìm khách hàng, dịch vụ..."
                                            value={serviceSearch}
                                            onChange={e => setServiceSearch(e.target.value)}
                                        />
                                    </div>
                                    {/* list */}
                                    <div>
                                        {filteredServices.map((sr, i) => (
                                            <div key={i} className="service-row">
                                                <div className="avatar-circle"
                                                    style={{
                                                        background: sr.status === "approved" ? "#C0DD97" : sr.status === "rejected" ? "#F7C1C1" : "#FFE0C2",
                                                        color: sr.status === "approved" ? "#3B6D11" : sr.status === "rejected" ? "#A32D2D" : "#A84D00",
                                                    }}>
                                                    {sr.initials}
                                                </div>
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <div className="fw-semibold text-truncate" style={{ fontSize: "0.78rem", color: "#2C1A0E" }}>
                                                        {sr.service}
                                                    </div>
                                                    <div style={{ fontSize: "0.68rem", color: "#C88055" }}>
                                                        {sr.name} · {sr.time}
                                                    </div>
                                                </div>
                                                <StatusBadge status={sr.status} />
                                            </div>
                                        ))}
                                        {filteredServices.length === 0 && (
                                            <div className="text-center py-3" style={{ fontSize: "0.8rem", color: "#C88055" }}>
                                                <i className="fa-solid fa-circle-exclamation me-1" /> Không tìm thấy kết quả
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders */}
                        <div className="col-12 col-lg-7">
                            <div className="card border-0 h-100" style={{ borderRadius: 14, boxShadow: "0 1px 4px rgba(217,104,0,0.07)" }}>
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <h6 className="mb-0 section-title">
                                            <i className="fa-solid fa-bag-shopping me-2" style={{ color: "#F57C00" }} />
                                            Danh sách đơn hàng
                                        </h6>
                                        <a href="#" className="see-all">Xem tất cả <i className="fa-solid fa-arrow-right fa-xs" /></a>
                                    </div>
                                    {/* filter */}
                                    <div className="d-flex gap-2 flex-wrap mb-3">
                                        {[
                                            { key: "all", label: "Tất cả" },
                                            { key: "done", label: "Hoàn thành" },
                                            { key: "processing", label: "Đang xử lý" },
                                            { key: "cancelled", label: "Đã huỷ" },
                                        ].map(f => (
                                            <button
                                                key={f.key}
                                                className={`filter-btn ${orderFilter === f.key ? "active" : ""}`}
                                                onClick={() => setOrderFilter(f.key)}
                                            >
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                    {/* table */}
                                    <div style={{ overflowX: "auto" }}>
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Mã đơn</th>
                                                    <th>Khách hàng</th>
                                                    <th>Dịch vụ</th>
                                                    <th className="text-end">Giá trị</th>
                                                    <th className="text-center">Trạng thái</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOrders.map((o, i) => (
                                                    <tr key={i}>
                                                        <td className="order-id">{o.id}</td>
                                                        <td>{o.customer}</td>
                                                        <td style={{ color: "#7A4A2A" }}>{o.service}</td>
                                                        <td className="text-end fw-semibold">{o.value}</td>
                                                        <td className="text-center"><StatusBadge status={o.status} /></td>
                                                        <td className="text-center">
                                                            <button className="btn btn-sm border-0 p-0" style={{ color: "#C88055" }}>
                                                                <i className="fa-solid fa-ellipsis" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filteredOrders.length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} className="text-center py-3" style={{ fontSize: "0.8rem", color: "#C88055" }}>
                                                            <i className="fa-solid fa-inbox me-1" /> Không có đơn hàng
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Chart + Activity */}
                    <div className="row g-3">
                        <div className="col-12 col-lg-7">
                            <WeeklyChart />
                        </div>
                        <div className="col-12 col-lg-5">
                            <div className="card border-0 h-100" style={{ borderRadius: 14, boxShadow: "0 1px 4px rgba(217,104,0,0.07)" }}>
                                <div className="card-body p-3">
                                    <h6 className="mb-3 section-title">
                                        <i className="fa-solid fa-bolt me-2" style={{ color: "#F57C00" }} />
                                        Hoạt động gần đây
                                    </h6>
                                    <div>
                                        {ACTIVITIES.map((a, i) => {
                                            const dotBg = a.color === "success" ? "#EAF3DE"
                                                : a.color === "danger" ? "#FCEBEB"
                                                    : a.color === "warning" ? "#FAEEDA"
                                                        : a.color === "info" ? "#E6F1FB"
                                                            : "#FFF3E8";
                                            const dotColor = a.color === "success" ? "#3B6D11"
                                                : a.color === "danger" ? "#A32D2D"
                                                    : a.color === "warning" ? "#854F0B"
                                                        : a.color === "info" ? "#185FA5"
                                                            : "#F57C00";
                                            return (
                                                <div key={i} className="d-flex gap-3" style={{ paddingBottom: i < ACTIVITIES.length - 1 ? 14 : 0 }}>
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div className="activity-dot" style={{ background: dotBg }}>
                                                            <i className={`fa-solid ${a.icon}`} style={{ color: dotColor, fontSize: 11 }} />
                                                        </div>
                                                        {i < ACTIVITIES.length - 1 && (
                                                            <div style={{ width: 1, flex: 1, background: "rgba(217,104,0,0.13)", marginTop: 4, minHeight: 14 }} />
                                                        )}
                                                    </div>
                                                    <div style={{ paddingTop: 2 }}>
                                                        <div className="fw-semibold" style={{ fontSize: "0.78rem", color: "#2C1A0E" }}>{a.title}</div>
                                                        <div style={{ fontSize: "0.68rem", color: "#C88055" }}>{a.sub}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}