import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";

const NAVY = "#1A2B4A";
const GOLD = "#D4AF37";
const WHITE = "#FFFFFF";
const LIGHT = "#F5F7FA";
const GREEN = "#27AE60";
const RED = "#E74C3C";
const GRAY = "#8492A6";

const generateQRCells = (seed) => {
  const size = 21;
  return Array.from({ length: size * size }, (_, i) => {
    const r = Math.floor(i / size), c = i % size;
    const inFinder = (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
    return { r, c, filled: inFinder ? 1 : ((r * size + c + seed) % 3 === 0 ? 1 : 0) };
  });
};

const QRCode = ({ unit, size = 180 }) => {
  const cells = generateQRCells(unit * 7);
  const cs = size / 21;
  return (
    <div style={{ background: WHITE, padding: 12, borderRadius: 12, display: "inline-block", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
      <svg width={size} height={size}>
        {cells.map((cell, i) => cell.filled && (
          <rect key={i} x={cell.c * cs} y={cell.r * cs} width={cs - 0.5} height={cs - 0.5} fill={NAVY} />
        ))}
        <rect x={size / 2 - 18} y={size / 2 - 18} width={36} height={36} fill={WHITE} rx={6} />
        <text x={size / 2} y={size / 2 + 7} textAnchor="middle" fontSize={15} fill={GOLD} fontWeight="900">CF</text>
      </svg>
      <div style={{ textAlign: "center", fontSize: 11, color: GRAY, marginTop: 6 }}>QP-2847 · Unit {unit}</div>
    </div>
  );
};

const Ring = ({ score, size = 80, label }) => {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const prog = (score / 100) * circ;
  const color = score >= 90 ? GREEN : score >= 75 ? GOLD : RED;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E8ECF0" strokeWidth={10} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${prog} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
        <text x={size/2} y={size/2+6} textAnchor="middle" fill={color} fontSize={size/4} fontWeight="bold">{score}</text>
      </svg>
      <span style={{ fontSize: 10, color: GRAY, textAlign: "center", maxWidth: size }}>{label}</span>
    </div>
  );
};

export default function CasaFeliz() {
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("welcome");
  const [userType, setUserType] = useState(null);
  const [step, setStep] = useState(1);
  const [tab, setTab] = useState("dashboard");
  const [showQR, setShowQR] = useState(null);
  const [paid, setPaid] = useState(false);
  const [pts, setPts] = useState(340);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [bankConnected, setBankConnected] = useState(false);
  const [msgs, setMsgs] = useState([
    { id: 1, from: "landlord", name: "Juan Q.", text: "Welcome to your new home! 🏠", time: "2d ago", unit: null },
    { id: 2, from: "tenant", name: "Maria G.", text: "Love the welcome basket! 🧺", time: "2d ago", unit: 2 },
    { id: 3, from: "tenant", name: "James W.", text: "Can you check the AC in unit 3?", time: "1d ago", unit: 3 },
    { id: 4, from: "landlord", name: "Juan Q.", text: "James — Fixed tomorrow 9am ✅", time: "1d ago", unit: 3 },
  ]);
  const [newMsg, setNewMsg] = useState("");

  const {
    configured: authConfigured,
    user: authUser,
    profile,
    loading: authLoading,
    error: authError,
    clearError: clearAuthError,
    signUp,
    logIn,
    logOut,
    saveProfileFields,
  } = useAuth();
  const [fullNameInput, setFullNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [unitsInput, setUnitsInput] = useState(4);

  const displayName = profile?.fullName || (userType === "landlord" ? "Juan Quiroz" : "Maria Garcia");

  // Restore a signed-in session straight to the dashboard on app load.
  useEffect(() => {
    if (!authLoading && authUser && profile && screen === "welcome") {
      setUserType(profile.userType);
      setScreen("dashboard");
    }
  }, [authLoading, authUser, profile]);

  const T = {
    en: {
      welcome: "CasaFeliz", tagline: "Happy Tenants. Stress-Free Landlords.",
      isLandlord: "I'm a Landlord", isTenant: "I'm a Tenant",
      scanQR: "Scan QR Code", enterCode: "Enter Invite Code",
      step1: "Basic Info", step2: "Verify Phone", step3: "Verify ID", step4: "Connect Bank", step5: "Property",
      fullName: "Full Name", email: "Email", phone: "Phone", pass: "Password",
      address: "Property Address",
      cont: "Continue →", back: "← Back", skip: "Skip (Demo)",
      dashboard: "Home", qrTab: "QR Codes", msgTab: "Messages", payTab: "Pay", secTab: "Security",
      payNow: "Pay Rent — $1,700", paid: "✅ Paid!",
      overview: "Overview", tenants: "Tenant Status",
      privacy: "Your Privacy is Protected",
      howQR: "How QR Codes Work",
      sendSMS: "Send Verification Code", verifySMS: "Enter 6-digit code", confirmSMS: "Verify",
      takePhoto: "Take Photo of ID", uploadID: "Upload from Gallery", verifyID: "Verify (Demo)",
      selectBank: "Select Your Bank", bankSecure: "Secured by Plaid",
      generate: "Generate QR Code", share: "Share", copyCode: "Copy Code",
      expires: "Expires in 7 days · One-time use only",
      typeMsg: "Type a message...", send: "Send",
      privWalls: "Privacy Walls",
      secPartners: "Security Partners",
      complete: "Complete Setup 🚀",
      logIn: "Log In", alreadyHaveAccount: "Already have an account?",
      logOut: "Log Out",
    },
    es: {
      welcome: "CasaFeliz", tagline: "Inquilinos Felices. Propietarios Sin Estrés.",
      isLandlord: "Soy Propietario", isTenant: "Soy Inquilino",
      scanQR: "Escanear QR", enterCode: "Ingresar Código",
      step1: "Info Básica", step2: "Verificar Tel.", step3: "Verificar ID", step4: "Banco", step5: "Propiedad",
      fullName: "Nombre Completo", email: "Correo", phone: "Teléfono", pass: "Contraseña",
      address: "Dirección",
      cont: "Continuar →", back: "← Atrás", skip: "Saltar (Demo)",
      dashboard: "Inicio", qrTab: "Códigos QR", msgTab: "Mensajes", payTab: "Pagar", secTab: "Seguridad",
      payNow: "Pagar Renta — $1,700", paid: "✅ ¡Pagado!",
      overview: "Panel", tenants: "Inquilinos",
      privacy: "Tu Privacidad Está Protegida",
      howQR: "Cómo Funcionan los QR",
      sendSMS: "Enviar Código SMS", verifySMS: "Ingresar código de 6 dígitos", confirmSMS: "Verificar",
      takePhoto: "Foto del ID", uploadID: "Subir desde Galería", verifyID: "Verificar (Demo)",
      selectBank: "Seleccionar Banco", bankSecure: "Asegurado por Plaid",
      generate: "Generar QR", share: "Compartir", copyCode: "Copiar Código",
      expires: "Vence en 7 días · Solo un uso",
      typeMsg: "Escribe un mensaje...", send: "Enviar",
      privWalls: "Muros de Privacidad",
      secPartners: "Socios de Seguridad",
      complete: "Completar Configuración 🚀",
      logIn: "Iniciar Sesión", alreadyHaveAccount: "¿Ya tienes cuenta?",
      logOut: "Cerrar Sesión",
    }
  };

  const t = T[lang];

  const s = {
    app: { fontFamily: "'Inter',-apple-system,sans-serif", background: LIGHT, minHeight: "100vh", maxWidth: 480, margin: "0 auto" },
    hdr: { background: NAVY, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    logo: { color: GOLD, fontSize: 22, fontWeight: 900 },
    langBtn: { background: "rgba(212,175,55,0.15)", border: `1px solid ${GOLD}`, borderRadius: 20, padding: "4px 12px", color: GOLD, fontSize: 12, cursor: "pointer" },
    body: { padding: 16, paddingBottom: 90 },
    card: { background: WHITE, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    title: { fontSize: 12, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
    inp: { width: "100%", padding: 13, border: "1.5px solid #E0E6ED", borderRadius: 10, fontSize: 14, marginBottom: 10, boxSizing: "border-box", fontFamily: "inherit", outline: "none" },
    btn: (bg = NAVY, color = WHITE) => ({ width: "100%", padding: 14, background: bg, border: "none", borderRadius: 12, color, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 8 }),
    nav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: WHITE, borderTop: "1px solid #E8ECF0", display: "flex", padding: "8px 0 12px", zIndex: 100 },
    navBtn: (active) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: 4, background: "none", border: "none", cursor: "pointer", color: active ? GOLD : GRAY }),
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #F5F7FA" },
    badge: (ok) => ({ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: ok ? "#E8F8F0" : "#FEE8E8", color: ok ? GREEN : RED }),
    privRow: { display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #F5F7FA", fontSize: 13, color: "#2D3748" },
    dot: (c = GREEN) => ({ width: 7, height: 7, borderRadius: "50%", background: c, flexShrink: 0 }),
  };

  const Header = ({ back: backFn }) => (
    <div style={s.hdr}>
      {backFn
        ? <button style={{ background: "none", border: "none", color: WHITE, fontSize: 20, cursor: "pointer" }} onClick={backFn}>←</button>
        : <div style={{ width: 32 }} />}
      <div style={s.logo}>{t.welcome}</div>
      <button style={s.langBtn} onClick={() => setLang(l => l === "en" ? "es" : "en")}>
        {lang === "en" ? "🇪🇸 ES" : "🇺🇸 EN"}
      </button>
    </div>
  );

  const Progress = () => {
    const total = userType === "landlord" ? 5 : 4;
    return (
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? GOLD : "#E0E6ED", transition: "background 0.3s" }} />
        ))}
      </div>
    );
  };

  const tenants = [
    { name: "Maria Garcia", unit: 2, score: 94, paid: true, pts: 340 },
    { name: "James Wilson", unit: 3, score: 87, paid: true, pts: 280 },
    { name: "Sarah Chen", unit: 4, score: 71, paid: false, pts: 150 },
  ];

  // ─── WELCOME SCREEN ────────────────────────────────────────────────────────
  if (screen === "welcome") return (
    <div style={{ ...s.app, background: `linear-gradient(160deg,${NAVY} 0%,#2C4A7A 100%)`, minHeight: "100vh" }}>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", justifyContent: "center", position: "relative" }}>
        <button style={{ ...s.langBtn, position: "absolute", top: 20, right: 20 }} onClick={() => setLang(l => l === "en" ? "es" : "en")}>
          {lang === "en" ? "🇪🇸 ES" : "🇺🇸 EN"}
        </button>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 36 }}>🏠</div>
          <div style={{ color: GOLD, fontSize: 34, fontWeight: 900 }}>CasaFeliz</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, marginTop: 6 }}>{t.tagline}</div>
        </div>
        <div style={{ width: "100%" }}>
          <button style={{ ...s.btn(GOLD, NAVY), fontSize: 16 }}
            onClick={() => { setUserType("landlord"); setScreen("register"); setStep(1); }}>
            🏢 {t.isLandlord}
          </button>
          <button style={{ ...s.btn("rgba(255,255,255,0.12)", WHITE), border: "1.5px solid rgba(255,255,255,0.25)", marginBottom: 6 }}
            onClick={() => setScreen("scan")}>
            📱 {t.scanQR}
          </button>
          <button style={{ ...s.btn("transparent", "rgba(255,255,255,0.6)"), border: "1.5px solid rgba(255,255,255,0.15)", fontSize: 13 }}
            onClick={() => { setUserType("tenant"); setScreen("register"); setStep(1); }}>
            👤 {t.isTenant} — {lang === "en" ? "Create Account" : "Crear Cuenta"}
          </button>
          <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 13, cursor: "pointer", padding: 8, width: "100%" }}
            onClick={() => { clearAuthError(); setScreen("login"); }}>
            {t.alreadyHaveAccount} <span style={{ color: GOLD, fontWeight: 700 }}>{t.logIn}</span>
          </button>
        </div>
        {!authConfigured && (
          <div style={{ marginTop: 16, background: "rgba(212,175,55,0.12)", border: `1px solid ${GOLD}`, borderRadius: 10, padding: 10, fontSize: 11, color: GOLD, maxWidth: 340, textAlign: "center" }}>
            ⚠️ Firebase isn't configured yet — see FIREBASE_SETUP.md. Sign-up/login will not work until it is.
          </div>
        )}
        <div style={{ marginTop: 28, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {["🔒 256-bit Encrypted", "🛡️ Stripe Identity", "📱 2FA SMS", "🏦 Plaid"].map((b, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{b}</div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── LOG IN SCREEN ──────────────────────────────────────────────────────────
  if (screen === "login") return (
    <div style={s.app}>
      <Header back={() => { clearAuthError(); setScreen("welcome"); }} />
      <div style={s.body}>
        <div style={s.card}>
          <div style={s.title}>{t.logIn}</div>
          {!authConfigured && (
            <div style={{ background: "#FFF8E6", border: `1px solid ${GOLD}`, borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12, color: "#8B6914" }}>
              ⚠️ Firebase isn't configured yet — see FIREBASE_SETUP.md.
            </div>
          )}
          {authError && (
            <div style={{ background: "#FEE8E8", border: `1px solid ${RED}`, borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12, color: RED }}>
              {authError}
            </div>
          )}
          <input style={s.inp} placeholder={t.email} type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
          <input style={s.inp} placeholder={t.pass} type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
          <button style={s.btn(GOLD, NAVY)} disabled={!authConfigured || authBusy} onClick={async () => {
            setAuthBusy(true);
            try {
              await logIn(loginEmail, loginPassword);
            } catch {
              // error surfaced via authError
            } finally {
              setAuthBusy(false);
            }
          }}>
            {authBusy ? "…" : t.logIn}
          </button>
        </div>
      </div>
    </div>
  );

  // ─── SCAN SCREEN ────────────────────────────────────────────────────────────
  if (screen === "scan") return (
    <div style={s.app}>
      <Header back={() => setScreen("welcome")} />
      <div style={s.body}>
        <div style={s.card}>
          <div style={s.title}>{t.scanQR}</div>
          <div style={{ background: NAVY, borderRadius: 14, padding: 20, textAlign: "center", marginBottom: 14, position: "relative", minHeight: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {[{top:14,left:14},{top:14,right:14},{bottom:14,left:14},{bottom:14,right:14}].map((pos, i) => (
              <div key={i} style={{ position: "absolute", width: 22, height: 22, ...pos,
                borderTop: (pos.top !== undefined) ? `3px solid ${GOLD}` : undefined,
                borderBottom: (pos.bottom !== undefined) ? `3px solid ${GOLD}` : undefined,
                borderLeft: (pos.left !== undefined) ? `3px solid ${GOLD}` : undefined,
                borderRight: (pos.right !== undefined) ? `3px solid ${GOLD}` : undefined,
              }} />
            ))}
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 12 }}>📷 Camera Viewfinder</div>
            <div style={{ width: 100, height: 2, background: GOLD, borderRadius: 2, boxShadow: `0 0 8px ${GOLD}` }} />
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 10 }}>
              {lang === "en" ? "Point at landlord's QR code" : "Apunta al código QR del propietario"}
            </div>
          </div>
          <button style={s.btn(GOLD, NAVY)} onClick={() => setScreen("scanned")}>
            📱 {lang === "en" ? "Simulate QR Scan (Demo)" : "Simular Escaneo QR (Demo)"}
          </button>
          <div style={{ textAlign: "center", color: GRAY, fontSize: 12, margin: "6px 0" }}>— {lang === "en" ? "or" : "o"} —</div>
          <input style={s.inp} placeholder="QP-2847-U2" />
          <button style={s.btn(NAVY)} onClick={() => setScreen("scanned")}>{t.enterCode}</button>
        </div>
        <div style={s.card}>
          <div style={s.title}>{t.howQR}</div>
          {[
            lang === "en" ? "Landlord generates unique QR for your unit" : "El propietario genera un QR único para tu unidad",
            lang === "en" ? "You scan it — app pre-fills your details" : "Escaneas — la app llena tus datos automáticamente",
            lang === "en" ? "Verify phone, ID + connect bank" : "Verifica teléfono, ID + conecta tu banco",
            lang === "en" ? "Instantly bonded to your landlord privately" : "Vinculado al propietario de forma privada",
            lang === "en" ? "Code expires after 7 days or first use" : "Código vence en 7 días o al primer uso",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: GOLD, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: "#2D3748", paddingTop: 3 }}>{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── SCANNED SCREEN ─────────────────────────────────────────────────────────
  if (screen === "scanned") return (
    <div style={s.app}>
      <Header back={() => setScreen("scan")} />
      <div style={s.body}>
        <div style={{ ...s.card, background: `linear-gradient(135deg,${NAVY},#2C4A7A)`, textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>✅</div>
          <div style={{ color: GOLD, fontSize: 18, fontWeight: 800 }}>QR Code Verified!</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 4 }}>You've been invited to join</div>
        </div>
        <div style={s.card}>
          <div style={s.title}>Property Details</div>
          {[["Property Code", "QP-2847"], ["Unit", "Unit 2"], ["Monthly Rent", "$1,700"], ["Landlord", "Juan Quiroz"], ["Due Date", "1st of each month"]].map(([k, v], i) => (
            <div key={i} style={s.row}>
              <span style={{ fontSize: 13, color: GRAY }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ ...s.card, background: "#FFF8E6", border: `1px solid ${GOLD}` }}>
          <div style={{ fontSize: 13, color: "#8B6914", fontWeight: 600 }}>
            ⚠️ {lang === "en" ? "This QR code is one-time use and expires in 7 days. Complete registration now." : "Este código QR es de un solo uso y vence en 7 días. Completa el registro ahora."}
          </div>
        </div>
        <button style={s.btn(GOLD, NAVY)} onClick={() => { setUserType("tenant"); setScreen("register"); setStep(1); }}>
          ✓ {lang === "en" ? "Confirm & Create Account" : "Confirmar y Crear Cuenta"}
        </button>
        <button style={s.btn(LIGHT, NAVY)} onClick={() => setScreen("welcome")}>{t.back}</button>
      </div>
    </div>
  );

  // ─── REGISTER SCREEN ────────────────────────────────────────────────────────
  if (screen === "register") {
    const steps = userType === "landlord" ? [t.step1, t.step2, t.step3, t.step4, t.step5] : [t.step1, t.step2, t.step3, t.step4];
    return (
      <div style={s.app}>
        <Header back={() => step === 1 ? setScreen("welcome") : setStep(step - 1)} />
        <div style={s.body}>
          <Progress />
          <div style={s.card}>
            <div style={{ fontSize: 11, color: GRAY, marginBottom: 4 }}>
              {lang === "en" ? `Step ${step} of ${steps.length}` : `Paso ${step} de ${steps.length}`}: {steps[step - 1]}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginBottom: 16 }}>
              {step === 1 && "👤 " + (lang === "en" ? "Basic Information" : "Información Básica")}
              {step === 2 && "📱 " + (lang === "en" ? "Phone Verification" : "Verificación de Teléfono")}
              {step === 3 && "🪪 " + (lang === "en" ? "Identity Verification" : "Verificación de Identidad")}
              {step === 4 && "🏦 " + (lang === "en" ? "Connect Bank Account" : "Conectar Cuenta Bancaria")}
              {step === 5 && "🏠 " + (lang === "en" ? "Property Setup" : "Configuración de Propiedad")}
            </div>

            {step === 1 && <>
              {!authConfigured && (
                <div style={{ background: "#FFF8E6", border: `1px solid ${GOLD}`, borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12, color: "#8B6914" }}>
                  ⚠️ Firebase isn't configured yet — see FIREBASE_SETUP.md.
                </div>
              )}
              {authError && (
                <div style={{ background: "#FEE8E8", border: `1px solid ${RED}`, borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12, color: RED }}>
                  {authError}
                </div>
              )}
              <input style={s.inp} placeholder={t.fullName} value={fullNameInput} onChange={e => setFullNameInput(e.target.value)} />
              <input style={s.inp} placeholder={t.email} type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} />
              <input style={s.inp} placeholder={t.pass} type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
              <div style={{ fontSize: 11, color: GRAY, marginBottom: 12 }}>🔒 {lang === "en" ? "AES-256 encrypted · Never stored in plain text" : "Cifrado AES-256 · Nunca almacenado en texto plano"}</div>
              <button style={s.btn(GOLD, NAVY)} disabled={!authConfigured || authBusy} onClick={async () => {
                setAuthBusy(true);
                try {
                  await signUp(fullNameInput, emailInput, passwordInput, userType);
                  setStep(2);
                } catch {
                  // error surfaced via authError
                } finally {
                  setAuthBusy(false);
                }
              }}>
                {authBusy ? "…" : t.cont}
              </button>
            </>}

            {step === 2 && <>
              <div style={{ background: "#F0FBF5", border: `1px solid ${GREEN}`, borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 12, color: GREEN, fontWeight: 600 }}>
                🛡️ {lang === "en" ? "Powered by Twilio — Enterprise SMS Security" : "Impulsado por Twilio — Seguridad SMS Empresarial"}
              </div>
              <input style={s.inp} placeholder={t.phone} type="tel" />
              {!phoneVerified ? <>
                <button style={s.btn(NAVY)} onClick={() => {}}>{t.sendSMS}</button>
                <input style={s.inp} placeholder={t.verifySMS} />
                <button style={s.btn(GREEN)} onClick={() => setPhoneVerified(true)}>{t.confirmSMS}</button>
                <button style={{ ...s.btn(LIGHT, GRAY), fontSize: 12 }} onClick={() => { setPhoneVerified(true); setStep(3); }}>{t.skip}</button>
              </> : <>
                <div style={{ background: "#E8F8F0", borderRadius: 10, padding: 12, textAlign: "center", color: GREEN, fontWeight: 700, marginBottom: 12 }}>✅ {lang === "en" ? "Phone Verified!" : "¡Teléfono Verificado!"}</div>
                <button style={s.btn(GOLD, NAVY)} onClick={() => setStep(3)}>{t.cont}</button>
              </>}
            </>}

            {step === 3 && <>
              <div style={{ background: "#F0F4FF", border: "1px solid #7B9CFF", borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 12, color: "#3A5CCC", fontWeight: 600 }}>
                🛡️ {lang === "en" ? "Powered by Stripe Identity — Bank-level KYC" : "Impulsado por Stripe Identity — KYC a nivel bancario"}
              </div>
              {!idVerified ? <>
                <div style={{ border: "2px dashed #E0E6ED", borderRadius: 12, padding: 24, textAlign: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: 13, color: GRAY }}>{lang === "en" ? "Upload your:" : "Sube tu:"}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginTop: 4 }}>
                    {lang === "en" ? "Driver's License, Passport, or Green Card" : "Licencia, Pasaporte o Green Card"}
                  </div>
                </div>
                <button style={s.btn(NAVY)}>📸 {t.takePhoto}</button>
                <button style={s.btn(LIGHT, NAVY)}>🖼 {t.uploadID}</button>
                <button style={s.btn(GREEN)} onClick={() => setIdVerified(true)}>✓ {t.verifyID}</button>
              </> : <>
                <div style={{ background: "#E8F8F0", borderRadius: 10, padding: 12, textAlign: "center", color: GREEN, fontWeight: 700, marginBottom: 12 }}>✅ {lang === "en" ? "Identity Verified by Stripe!" : "¡Identidad Verificada por Stripe!"}</div>
                <button style={s.btn(GOLD, NAVY)} onClick={() => setStep(4)}>{t.cont}</button>
              </>}
              <div style={{ background: "#FFF8E6", border: `1px solid ${GOLD}`, borderRadius: 10, padding: 10, marginTop: 8, fontSize: 11, color: "#8B6914" }}>
                🔒 {lang === "en" ? "ID encrypted · Never shared · Deleted after 30 days (GDPR)" : "ID cifrado · Nunca compartido · Eliminado en 30 días (GDPR)"}
              </div>
            </>}

            {step === 4 && <>
              <div style={{ background: "#F0F4FF", border: "1px solid #7B9CFF", borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 12, color: "#3A5CCC", fontWeight: 600 }}>
                🏦 {lang === "en" ? "Powered by Plaid — Trusted by 8,000+ institutions" : "Impulsado por Plaid — Confiado por 8,000+ instituciones"}
              </div>
              {!bankConnected ? <>
                {[
                  { name: "USAA", icon: "⭐", best: true },
                  { name: "Navy Federal", icon: "🏦", best: false },
                  { name: "Chase", icon: "🏧", best: false },
                  { name: "Wells Fargo", icon: "🏦", best: false },
                  { name: lang === "en" ? "Other Bank" : "Otro Banco", icon: "➕", best: false },
                ].map((bank, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", border: `1.5px solid ${bank.best ? GOLD : "#E0E6ED"}`, borderRadius: 10, marginBottom: 8, background: bank.best ? "#FFFBF0" : WHITE, cursor: "pointer" }}
                    onClick={() => setBankConnected(true)}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 20 }}>{bank.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{bank.name}</span>
                    </div>
                    {bank.best && <span style={{ background: GOLD, color: NAVY, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 10 }}>BEST</span>}
                  </div>
                ))}
              </> : <>
                <div style={{ background: "#E8F8F0", borderRadius: 10, padding: 14, textAlign: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>✅</div>
                  <div style={{ color: GREEN, fontWeight: 700 }}>{lang === "en" ? "Bank Connected!" : "¡Banco Conectado!"}</div>
                  <div style={{ color: GRAY, fontSize: 12, marginTop: 2 }}>{lang === "en" ? "Read-only access secured by Plaid" : "Acceso de solo lectura por Plaid"}</div>
                </div>
                <button style={s.btn(GOLD, NAVY)} onClick={() => userType === "landlord" ? setStep(5) : setScreen("dashboard")}>
                  {userType === "landlord" ? t.cont : t.complete}
                </button>
              </>}
            </>}

            {step === 5 && userType === "landlord" && <>
              <input style={s.inp} placeholder={t.address} value={addressInput} onChange={e => setAddressInput(e.target.value)} />
              <select style={{ ...s.inp, background: WHITE }} value={unitsInput} onChange={e => setUnitsInput(Number(e.target.value))}>
                {[2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n} {lang === "en" ? "Units" : "Unidades"}</option>)}
              </select>
              <div style={{ background: LIGHT, borderRadius: 12, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: GRAY, marginBottom: 4 }}>{lang === "en" ? "Your Property Code" : "Tu Código de Propiedad"}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: NAVY, letterSpacing: 3 }}>QP-2847</div>
                <div style={{ fontSize: 11, color: GRAY }}>{lang === "en" ? "Share with tenants or generate QR codes" : "Comparte con inquilinos o genera códigos QR"}</div>
              </div>
              <button style={s.btn(GOLD, NAVY)} onClick={async () => {
                await saveProfileFields({ address: addressInput, unitsCount: unitsInput, propertyCode: "QP-2847" });
                setScreen("dashboard");
              }}>{t.complete}</button>
            </>}
          </div>

          {step >= 2 && (
            <div style={s.card}>
              <div style={s.title}>{lang === "en" ? "Why We Need This" : "Por Qué Lo Necesitamos"}</div>
              {(step === 2 ? [
                lang === "en" ? "Prevents fake accounts" : "Previene cuentas falsas",
                lang === "en" ? "Two-factor authentication for every login" : "Autenticación de 2 factores en cada inicio",
                lang === "en" ? "Instant payment + maintenance alerts via SMS" : "Alertas instantáneas por SMS",
              ] : step === 3 ? [
                lang === "en" ? "Confirms you are a real person" : "Confirma que eres una persona real",
                lang === "en" ? "Prevents fraudulent tenants" : "Previene inquilinos fraudulentos",
                lang === "en" ? "Required by law for financial transactions" : "Requerido por ley para transacciones financieras",
              ] : [
                lang === "en" ? "Read-only — cannot move money without permission" : "Solo lectura — no puede mover dinero sin permiso",
                lang === "en" ? "Bank credentials never stored by CasaFeliz" : "Credenciales bancarias nunca almacenadas",
                lang === "en" ? "Disconnect anytime from settings" : "Desconectar en cualquier momento desde ajustes",
              ]).map((item, i) => (
                <div key={i} style={s.privRow}><div style={s.dot(GREEN)} />{item}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── MAIN DASHBOARD ─────────────────────────────────────────────────────────
  const navTabs = userType === "landlord"
    ? [{ id: "dashboard", icon: "📊", label: t.overview }, { id: "qr", icon: "📱", label: t.qrTab }, { id: "messages", icon: "💬", label: t.msgTab }, { id: "security", icon: "🔒", label: t.secTab }]
    : [{ id: "dashboard", icon: "🏠", label: t.dashboard }, { id: "pay", icon: "💳", label: t.payTab }, { id: "messages", icon: "💬", label: t.msgTab }, { id: "security", icon: "🔒", label: t.secTab }];

  return (
    <div style={s.app}>
      <div style={s.hdr}>
        <div>
          <div style={s.logo}>{t.welcome}</div>
          <div style={{ fontSize: 10, color: "rgba(212,175,55,0.65)" }}>{userType === "landlord" ? "🏢 Landlord" : "👤 Tenant"} · QP-2847</div>
        </div>
        <button style={s.langBtn} onClick={() => setLang(l => l === "en" ? "es" : "en")}>
          {lang === "en" ? "🇪🇸 ES" : "🇺🇸 EN"}
        </button>
      </div>

      <div style={s.body}>

        {/* LANDLORD OVERVIEW */}
        {tab === "dashboard" && userType === "landlord" && <>
          <div style={s.card}>
            <div style={{ fontSize: 13, color: GRAY }}>{lang === "en" ? "Welcome back," : "Bienvenido,"}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: NAVY }}>{displayName}</div>
            <div style={{ fontSize: 12, color: GRAY }}>{profile?.address || "Quiroz Properties LLC"} · Code: {profile?.propertyCode || "QP-2847"}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {[
              { label: lang === "en" ? "Revenue" : "Ingresos", value: "$5,100", sub: lang === "en" ? "This Month" : "Este Mes", color: GREEN },
              { label: lang === "en" ? "Occupied" : "Ocupadas", value: "3/4", sub: "75%", color: GOLD },
              { label: lang === "en" ? "Avg Score" : "Puntaje Prom.", value: "84", sub: "↑ Good", color: GREEN },
              { label: lang === "en" ? "Pending" : "Pendiente", value: "1", sub: lang === "en" ? "Payment" : "Pago", color: RED },
            ].map((stat, i) => (
              <div key={i} style={{ background: WHITE, borderRadius: 14, padding: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 11, color: GRAY }}>{stat.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: GRAY }}>{stat.sub}</div>
              </div>
            ))}
          </div>
          <div style={s.card}>
            <div style={s.title}>{lang === "en" ? "Happiness Scores" : "Puntuaciones"}</div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {tenants.map((ten, i) => <Ring key={i} score={ten.score} size={70} label={`Unit ${ten.unit}`} />)}
            </div>
          </div>
          <div style={s.card}>
            <div style={s.title}>{t.tenants}</div>
            {tenants.map((tenant, i) => (
              <div key={i} style={{ ...s.row, borderBottom: i < 2 ? "1px solid #F5F7FA" : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{tenant.name}</div>
                  <div style={{ fontSize: 11, color: GRAY }}>Unit {tenant.unit} · {tenant.pts} pts</div>
                </div>
                <div style={s.badge(tenant.paid)}>{tenant.paid ? "✓ Paid" : "⚠ Pending"}</div>
              </div>
            ))}
          </div>
        </>}

        {/* TENANT DASHBOARD */}
        {tab === "dashboard" && userType === "tenant" && <>
          <div style={s.card}>
            <div style={{ fontSize: 13, color: GRAY }}>{lang === "en" ? "Welcome back," : "Bienvenida,"}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: NAVY }}>{displayName}</div>
            <div style={{ fontSize: 12, color: GRAY }}>Unit 2 · {profile?.propertyCode || "QP-2847"} · Quiroz Properties</div>
          </div>
          <div style={s.card}>
            <div style={s.title}>{lang === "en" ? "Happiness Score" : "Puntuación de Felicidad"}</div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Ring score={94} size={80} label={lang === "en" ? "Your Score" : "Tu Puntaje"} />
              <Ring score={96} size={80} label={lang === "en" ? "Landlord Score" : "Puntaje Propietario"} />
            </div>
          </div>
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={s.title}>{lang === "en" ? "Rent Due" : "Renta Pendiente"}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: NAVY }}>$1,700</div>
                <div style={{ fontSize: 12, color: GRAY }}>July 1, 2026</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: GOLD }}>{pts}</div>
                <div style={{ fontSize: 11, color: GRAY }}>Points</div>
              </div>
            </div>
            <button style={{ ...s.btn(paid ? GREEN : GOLD, paid ? WHITE : NAVY), marginTop: 12 }}
              onClick={() => setTab("pay")}>
              {paid ? t.paid : "💳 " + t.payNow}
            </button>
          </div>
          <div style={s.card}>
            <div style={s.title}>{lang === "en" ? "Notifications" : "Notificaciones"}</div>
            {[
              { dot: GOLD, text: lang === "en" ? "Water station refilled ✓" : "Estación de agua reabastecida ✓", time: lang === "en" ? "Today 9am" : "Hoy 9am" },
              { dot: GREEN, text: lang === "en" ? "Bi-weekly cleaning this Friday" : "Limpieza quincenal este viernes", time: lang === "en" ? "Reminder" : "Recordatorio" },
              { dot: NAVY, text: lang === "en" ? "Rent due in 4 days" : "Renta vence en 4 días", time: "Jun 27" },
            ].map((n, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 2 ? "1px solid #F5F7FA" : "none", alignItems: "flex-start" }}>
                <div style={s.dot(n.dot)} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: GRAY }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* QR CODES TAB */}
        {tab === "qr" && <>
          <div style={s.card}>
            <div style={s.title}>{lang === "en" ? "Generate Tenant QR Codes" : "Generar Códigos QR para Inquilinos"}</div>
            <div style={{ fontSize: 13, color: GRAY, marginBottom: 16 }}>
              {lang === "en" ? "Each code is unique, one-time use, expires in 7 days" : "Cada código es único, de un solo uso, vence en 7 días"}
            </div>
            {[2, 3, 4].map((unit) => (
              <div key={unit} style={{ border: "1.5px solid #E0E6ED", borderRadius: 12, padding: 12, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Unit {unit}</div>
                    <div style={{ fontSize: 12, color: GRAY }}>$1,700/mo · Code: QP-2847-U{unit}</div>
                    <div style={{ fontSize: 11, color: tenants.find(ten => ten.unit === unit) ? GREEN : GOLD }}>
                      {tenants.find(ten => ten.unit === unit) ? `✓ ${tenants.find(ten => ten.unit === unit).name}` : lang === "en" ? "⚡ Awaiting tenant" : "⚡ Esperando inquilino"}
                    </div>
                  </div>
                  <button style={{ padding: "8px 14px", background: showQR === unit ? GOLD : NAVY, border: "none", borderRadius: 8, color: showQR === unit ? NAVY : WHITE, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    onClick={() => setShowQR(showQR === unit ? null : unit)}>
                    {showQR === unit ? (lang === "en" ? "Hide" : "Ocultar") : "📱 QR"}
                  </button>
                </div>
                {showQR === unit && (
                  <div style={{ marginTop: 16, textAlign: "center" }}>
                    <QRCode unit={unit} size={180} />
                    <div style={{ fontSize: 11, color: GRAY, marginTop: 8 }}>🔒 {t.expires}</div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
                      <button style={{ padding: "8px 16px", background: NAVY, border: "none", borderRadius: 8, color: WHITE, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        📤 {t.share}
                      </button>
                      <button style={{ padding: "8px 16px", background: LIGHT, border: "none", borderRadius: 8, color: NAVY, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        📋 {t.copyCode}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={s.card}>
            <div style={s.title}>{t.howQR}</div>
            {[
              ["📱", lang === "en" ? "You generate unique QR for each unit" : "Generas un QR único para cada unidad"],
              ["📲", lang === "en" ? "Tenant scans with phone camera" : "Inquilino escanea con la cámara"],
              ["🔗", lang === "en" ? "Instantly linked to your property & unit" : "Vinculado instantáneamente a tu propiedad"],
              ["⏰", lang === "en" ? "Expires after 7 days or first use" : "Vence en 7 días o al primer uso"],
              ["🔒", lang === "en" ? "Cannot be shared or reused" : "No se puede compartir ni reutilizar"],
              ["✅", lang === "en" ? "Tenant completes 3-step verification" : "Inquilino completa verificación de 3 pasos"],
            ].map(([icon, text], i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 13, color: "#2D3748" }}>{text}</span>
              </div>
            ))}
          </div>
        </>}

        {/* MESSAGES TAB */}
        {tab === "messages" && <>
          <div style={s.card}>
            <div style={s.title}>{userType === "landlord" ? (lang === "en" ? "All Conversations" : "Todas las Conversaciones") : (lang === "en" ? "Messages with Juan Q." : "Mensajes con Juan Q.")}</div>
            <div style={{ maxHeight: 320, overflowY: "auto", marginBottom: 12 }}>
              {msgs
                .filter(m => userType === "landlord" || m.from === "landlord" || m.unit === 2)
                .map((msg) => {
                  const isMine = (userType === "landlord" && msg.from === "landlord") || (userType === "tenant" && msg.from === "tenant");
                  return (
                    <div key={msg.id} style={{ display: "flex", flexDirection: isMine ? "row-reverse" : "row", gap: 8, marginBottom: 12, alignItems: "flex-end" }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: msg.from === "landlord" ? NAVY : GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: WHITE, fontWeight: 800, flexShrink: 0 }}>
                        {msg.name[0]}
                      </div>
                      <div style={{ maxWidth: "74%", background: isMine ? NAVY : WHITE, color: isMine ? WHITE : NAVY, borderRadius: 12, padding: "10px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                        {userType === "landlord" && <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 2, color: isMine ? "rgba(255,255,255,0.6)" : GOLD }}>{msg.name}{msg.unit ? ` · Unit ${msg.unit}` : " · All"}</div>}
                        <div style={{ fontSize: 13 }}>{msg.text}</div>
                        <div style={{ fontSize: 10, marginTop: 4, color: isMine ? "rgba(255,255,255,0.45)" : GRAY }}>{msg.time}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...s.inp, marginBottom: 0, flex: 1 }} placeholder={t.typeMsg} value={newMsg} onChange={e => setNewMsg(e.target.value)} />
              <button style={{ padding: "12px 16px", background: GOLD, border: "none", borderRadius: 10, color: NAVY, fontWeight: 800, cursor: "pointer" }}
                onClick={() => {
                  if (newMsg.trim()) {
                    setMsgs([...msgs, { id: Date.now(), from: userType, name: userType === "landlord" ? "Juan Q." : "Maria G.", text: newMsg, time: "Just now", unit: userType === "tenant" ? 2 : null }]);
                    setNewMsg("");
                  }
                }}>{t.send}</button>
            </div>
          </div>
          {userType === "landlord" && (
            <div style={s.card}>
              <div style={s.title}>{t.privWalls}</div>
              {[
                lang === "en" ? "Maria (Unit 2) cannot see James or Sarah's messages" : "Maria (Unidad 2) no puede ver mensajes de James ni Sarah",
                lang === "en" ? "James (Unit 3) cannot see Maria or Sarah's messages" : "James (Unidad 3) no puede ver mensajes de Maria ni Sarah",
                lang === "en" ? "Sarah (Unit 4) cannot see Maria or James's messages" : "Sarah (Unidad 4) no puede ver mensajes de Maria ni James",
                lang === "en" ? "Only YOU see all conversations" : "Solo TÚ ves todas las conversaciones",
              ].map((item, i) => <div key={i} style={s.privRow}><div style={s.dot(GREEN)} />{item}</div>)}
            </div>
          )}
        </>}

        {/* PAY TAB */}
        {tab === "pay" && userType === "tenant" && <>
          <div style={{ background: `linear-gradient(135deg,${NAVY},#2C4A7A)`, borderRadius: 16, padding: 24, marginBottom: 12, textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{lang === "en" ? "Amount Due" : "Monto a Pagar"}</div>
            <div style={{ color: WHITE, fontSize: 52, fontWeight: 900 }}>$1,700</div>
            <div style={{ color: GOLD, fontSize: 13 }}>July 1, 2026 · +50 pts early pay</div>
          </div>
          <div style={s.card}>
            <div style={s.title}>{lang === "en" ? "Payment Method" : "Método de Pago"}</div>
            {[{ name: "USAA Checking ••4521", icon: "⭐", primary: true }, { name: lang === "en" ? "Add New Account" : "Agregar Cuenta", icon: "➕", primary: false }].map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", border: `1.5px solid ${m.primary ? GOLD : "#E0E6ED"}`, borderRadius: 10, marginBottom: 8, background: m.primary ? "#FFFBF0" : WHITE }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span>{m.icon}</span><span style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{m.name}</span>
                </div>
                {m.primary && <span style={{ fontSize: 10, color: GOLD, fontWeight: 700 }}>PRIMARY</span>}
              </div>
            ))}
          </div>
          <div style={s.card}>
            {[
              [lang === "en" ? "Rent Amount" : "Renta", "$1,700.00", NAVY],
              [lang === "en" ? "Processing (ACH)" : "Procesamiento (ACH)", lang === "en" ? "FREE" : "GRATIS", GREEN],
            ].map(([k, v, c], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i === 0 ? 6 : 0 }}>
                <span style={{ fontSize: 13, color: GRAY }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 6, borderTop: "1.5px solid #F0F3F7" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Total</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: NAVY }}>$1,700.00</span>
            </div>
          </div>
          <div style={{ background: "#E8F8F0", borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 12, color: GREEN, fontWeight: 600 }}>
            🏦 {lang === "en" ? "Secured by Stripe · Arrives in landlord's LLC account within 2 business days" : "Asegurado por Stripe · Llega a cuenta LLC del propietario en 2 días hábiles"}
          </div>
          <button style={s.btn(paid ? GREEN : GOLD, paid ? WHITE : NAVY)}
            onClick={() => { setPaid(true); setPts(p => p + 50); }}>
            {paid ? t.paid : "💳 " + t.payNow}
          </button>
          {paid && (
            <div style={{ background: "#E8F8F0", borderRadius: 12, padding: 14, textAlign: "center", marginTop: 4 }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🎉</div>
              <div style={{ color: GREEN, fontWeight: 700 }}>{lang === "en" ? "Payment Confirmed!" : "¡Pago Confirmado!"}</div>
              <div style={{ color: GRAY, fontSize: 12, marginTop: 2 }}>+50 {lang === "en" ? "points added · Receipt emailed" : "puntos agregados · Recibo enviado"}</div>
            </div>
          )}
        </>}

        {/* SECURITY TAB */}
        {tab === "security" && <>
          {authUser && (
            <div style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: GRAY }}>{lang === "en" ? "Signed in as" : "Sesión iniciada como"}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{authUser.email}</div>
              </div>
              <button style={{ padding: "8px 14px", background: "#FEE8E8", border: "none", borderRadius: 8, color: RED, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                onClick={async () => {
                  await logOut();
                  setScreen("welcome");
                  setUserType(null);
                  setStep(1);
                  setTab("dashboard");
                }}>
                {t.logOut}
              </button>
            </div>
          )}
          <div style={{ background: `linear-gradient(135deg,${NAVY},#2C4A7A)`, borderRadius: 16, padding: 24, marginBottom: 12, textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🔒</div>
            <div style={{ color: GOLD, fontSize: 20, fontWeight: 800 }}>{lang === "en" ? "Bank-Level Security" : "Seguridad Bancaria"}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 6 }}>
              {lang === "en" ? "Same technology used by major banks" : "La misma tecnología usada por los grandes bancos"}
            </div>
          </div>
          <div style={s.card}>
            <div style={s.title}>{t.secPartners}</div>
            {[
              { logo: "🔐", name: "Auth0", desc: lang === "en" ? "Identity & Access Management" : "Gestión de Identidad y Acceso" },
              { logo: "🏦", name: "Plaid", desc: lang === "en" ? "Bank Connection Security" : "Seguridad de Conexión Bancaria" },
              { logo: "💳", name: "Stripe", desc: lang === "en" ? "Payments + Identity Verify" : "Pagos + Verificación de Identidad" },
              { logo: "📱", name: "Twilio", desc: lang === "en" ? "SMS 2-Factor Authentication" : "Autenticación de 2 Factores SMS" },
              { logo: "☁️", name: "Firebase", desc: lang === "en" ? "Encrypted Cloud Database" : "Base de Datos Cifrada en la Nube" },
            ].map((p, i) => (
              <div key={i} style={{ ...s.row, borderBottom: i < 4 ? "1px solid #F5F7FA" : "none" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 22 }}>{p.logo}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: GRAY }}>{p.desc}</div>
                  </div>
                </div>
                <div style={{ padding: "3px 10px", background: "#E8F8F0", borderRadius: 20, fontSize: 11, fontWeight: 700, color: GREEN }}>Active</div>
              </div>
            ))}
          </div>
          <div style={s.card}>
            <div style={s.title}>{t.privacy}</div>
            {[
              "🔒 " + (lang === "en" ? "256-bit AES encryption on all data" : "Cifrado AES de 256 bits en todos los datos"),
              "🛡️ " + (lang === "en" ? "Identity verified by Stripe Identity" : "Identidad verificada por Stripe Identity"),
              "📱 " + (lang === "en" ? "2-Factor Authentication on every login" : "Autenticación de 2 Factores en cada inicio"),
              "🏦 " + (lang === "en" ? "Payments processed by Stripe — never us" : "Pagos procesados por Stripe — nunca nosotros"),
              "👤 " + (lang === "en" ? "Tenants cannot see each other's data" : "Inquilinos no pueden ver los datos del otro"),
              "🔑 " + (lang === "en" ? "QR codes expire in 7 days — one-time use" : "Códigos QR vencen en 7 días — uso único"),
              "🗑️ " + (lang === "en" ? "ID documents deleted after 30 days (GDPR)" : "Documentos de ID eliminados en 30 días (GDPR)"),
              "🚫 " + (lang === "en" ? "Your data is NEVER sold to third parties" : "Tus datos NUNCA se venden a terceros"),
            ].map((item, i) => <div key={i} style={s.privRow}>{item}</div>)}
          </div>
          <div style={s.card}>
            <div style={s.title}>{lang === "en" ? "Privacy Architecture" : "Arquitectura de Privacidad"}</div>
            <div style={{ fontSize: 13, fontFamily: "monospace", background: LIGHT, borderRadius: 10, padding: 12, lineHeight: 1.8, color: NAVY }}>
              <div style={{ color: GOLD, fontWeight: 700 }}>QP-2847 (Your Property)</div>
              <div>├── 🏢 Juan (Landlord) → <span style={{ color: GREEN }}>Sees ALL</span></div>
              <div>├── 👤 Unit 2 → <span style={{ color: GREEN }}>Juan only</span></div>
              <div>├── 👤 Unit 3 → <span style={{ color: GREEN }}>Juan only</span></div>
              <div>└── 👤 Unit 4 → <span style={{ color: GREEN }}>Juan only</span></div>
              <div style={{ marginTop: 8, color: RED }}>Other Properties → <span style={{ fontWeight: 700 }}>INVISIBLE ✅</span></div>
            </div>
          </div>
        </>}
      </div>

      {/* BOTTOM NAV */}
      <div style={s.nav}>
        {navTabs.map((navTab) => (
          <button key={navTab.id} style={s.navBtn(tab === navTab.id)} onClick={() => setTab(navTab.id)}>
            <span style={{ fontSize: 20 }}>{navTab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === navTab.id ? 700 : 500 }}>{navTab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
