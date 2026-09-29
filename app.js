const $ = (sel, el = document) => el.querySelector(sel);
const app = $("#app");

const store = {
  get(k, fallback) {
    try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; }
  },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function haversine(a, b) {
  if (!a || !b) return null;
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1-s));
}

const state = {
  route: location.hash.replace("#", "") || "home",
  user: store.get("karibu_user", null),
  likes: store.get("karibu_likes", []),
  passes: store.get("karibu_passes", []),
  matches: store.get("karibu_matches", []),
  chats: store.get("karibu_chats", {}),
  reports: store.get("karibu_reports", []),
  premium: store.get("karibu_premium", false),
  filters: store.get("karibu_filters", { county: "All", maxKm: 50, mode: "Open", minAge: 21, maxAge: 40 }),
  gps: store.get("karibu_gps", null),
  deckIndex: 0,
  activeChat: null
};

window.addEventListener("hashchange", () => {
  state.route = location.hash.replace("#", "") || "home";
  render();
});

function persist() {
  store.set("karibu_user", state.user);
  store.set("karibu_likes", state.likes);
  store.set("karibu_passes", state.passes);
  store.set("karibu_matches", state.matches);
  store.set("karibu_chats", state.chats);
  store.set("karibu_reports", state.reports);
  store.set("karibu_premium", state.premium);
  store.set("karibu_filters", state.filters);
  store.set("karibu_gps", state.gps);
}

function go(r) { location.hash = r; }

function options(list, selected) {
  return list.map(x => `<option ${x === selected ? "selected" : ""}>${x}</option>`).join("");
}

function landing() {
  return `
  <div class="wrap">
    <nav class="nav">
      <div class="brand"><div class="logo">K</div> Karibu Leo</div>
      <div>
        <button class="btn" onclick="go('login')">Log in</button>
        <button class="btn btn-primary" onclick="go('signup')">Join free</button>
      </div>
    </nav>
    <section class="hero">
      <div>
        <div class="kicker">Kenya · location-based matchmaking</div>
        <h1>Meet someone nearby — not just online.</h1>
        <p class="lede">Karibu Leo helps people in Nairobi, Mombasa, Kisumu and across the counties connect by distance, vibe, and real-life proximity.</p>
        <div class="cta-row">
          <button class="btn btn-primary" onclick="go('signup')">Create your profile</button>
          <button class="btn" onclick="go('discover')">Peek nearby</button>
        </div>
        <div class="stats">
          <div><b>47</b> counties</div>
          <div><b>GPS</b> nearby first</div>
          <div><b>Safety</b> built in</div>
        </div>
      </div>
      <div class="phone">
        <div class="phone-card">
          <div class="meta">
            <span class="chip">2.8 km · Westlands</span>
            <span class="chip">Professional</span>
            <h2 style="margin-top:10px;font-family:Fraunces,serif;">Brian, 29</h2>
            <p>Product guy by day, rugby on weekends.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="grid-3">
        <div class="card"><h3>Nearby first</h3><p>We request location (with permission) and rank people by kilometres and county — Nairobi CBD is not the same as Ruiru.</p></div>
        <div class="card"><h3>Kenya filters</h3><p>County, age, mode (student / professional / church), interests, and optional tribe or faith — you choose what matters.</p></div>
        <div class="card"><h3>Chat after a match</h3><p>Like someone, they like you back, then talk. Report and block sit one tap away. Premium unlocks extra radius via M-Pesa later.</p></div>
      </div>
    </section>
  </div>`;
}

function authForm(kind) {
  const isLogin = kind === "login";
  return `
  <div class="wrap" style="max-width:480px;padding:40px 20px;">
    <div class="brand" style="margin-bottom:18px;"><div class="logo">K</div> Karibu Leo</div>
    <h1 style="font-size:36px;">${isLogin ? "Welcome back" : "Karibu. Create your space."}</h1>
    <p class="lede" style="margin:8px 0 20px;">${isLogin ? "Log in to keep swiping nearby." : "A few details. Then we find people around you."}</p>
    <form onsubmit="submitAuth(event,'${kind}')">
      ${isLogin ? "" : `<div class="field"><label>Name</label><input name="name" required placeholder="e.g. Wanjiru" /></div>`}
      <div class="field"><label>Email</label><input name="email" type="email" required placeholder="you@email.com" /></div>
      <div class="field"><label>Password</label><input name="password" type="password" required minlength="4" /></div>
      <button class="btn btn-primary" style="width:100%;margin-top:8px;">${isLogin ? "Log in" : "Create account"}</button>
    </form>
    <p style="margin-top:14px;color:var(--muted);">${isLogin ? `New here? <a href="#signup" style="color:var(--gold)">Sign up</a>` : `Have an account? <a href="#login" style="color:var(--gold)">Log in</a>`}</p>
  </div>`;
}

window.submitAuth = (e, kind) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const email = fd.get("email");
  const users = store.get("karibu_users", []);
  if (kind === "signup") {
    const user = {
      id: "me",
      name: fd.get("name"),
      email,
      password: fd.get("password"),
      age: 25,
      gender: "Woman",
      county: "Nairobi",
      town: "Kilimani",
      tribe: "Kikuyu",
      religion: "Christian",
      mode: "Open",
      bio: "New on Karibu Leo. Say hi if you're nearby.",
      interests: ["Travel", "Afrobeats"],
      photo: ""
    };
    users.push({ email, password: user.password, profile: user });
    store.set("karibu_users", users);
    state.user = user;
    persist();
    toast("Account created. Finish your profile.");
    go("profile");
  } else {
    const found = users.find(u => u.email === email && u.password === fd.get("password"));
    if (!found && email) {
      state.user = store.get("karibu_user") || {
        id: "me", name: email.split("@")[0], email, age: 26, gender: "Man",
        county: "Nairobi", town: "Westlands", tribe: "Luo", religion: "Christian",
        mode: "Open", bio: "Exploring nearby connections.", interests: ["Football"], photo: ""
      };
      persist();
      go("discover");
      return;
    }
    if (!found) { toast("No account found. Sign up first."); return; }
    state.user = found.profile;
    persist();
    go("discover");
  }
};

function shell(inner) {
  if (!state.user && !["home","login","signup"].includes(state.route)) {
    return landing();
  }
  const tab = (id, label) => `<button class="${state.route===id?"active":""}" onclick="go('${id}')">${label}</button>`;
  return `
  <div class="app-shell">
    <header class="topbar">
      <div class="brand"><div class="logo">K</div> Karibu</div>
      <div>
        ${state.premium ? `<span class="badge">Premium</span>` : `<button class="btn" onclick="go('premium')">Go Plus</button>`}
      </div>
    </header>
    <main class="view">${inner}</main>
    <nav class="tabs">
      ${tab("discover","Nearby")}
      ${tab("matches","Matches")}
      ${tab("chats","Chats")}
      ${tab("safety","Safety")}
      ${tab("profile","Me")}
    </nav>
  </div>`;
}

function filteredPeople() {
  const seen = new Set([...state.likes, ...state.passes, ...state.reports]);
  const f = state.filters;
  return SEED.filter(p => {
    if (seen.has(p.id)) return false;
    if (f.county !== "All" && p.county !== f.county) return false;
    if (p.age < f.minAge || p.age > f.maxAge) return false;
    if (f.mode !== "Open" && p.mode !== f.mode && p.mode !== "Open") return false;
    const cap = state.premium ? 80 : Number(f.maxKm || 50);
    if (p.km > cap) return false;
    return true;
  });
}

function discoverView() {
  const people = filteredPeople();
  const p = people[0];
  return `
    <div class="filters">
      <div class="row-2">
        <div class="field"><label>County</label>
          <select onchange="setFilter('county', this.value)">
            <option>All</option>${options(COUNTIES, state.filters.county)}
          </select>
        </div>
        <div class="field"><label>Max km ${state.premium?"":"(Plus: 80km)"}</label>
          <input type="number" min="2" max="${state.premium?80:50}" value="${state.filters.maxKm}" onchange="setFilter('maxKm', this.value)" />
        </div>
      </div>
      <div class="modes">
        ${MODES.map(m => `<button class="${state.filters.mode===m?"on":""}" onclick="setFilter('mode','${m}')">${m}</button>`).join("")}
      </div>
      <button class="btn" onclick="askGPS()">Use my GPS</button>
      ${state.gps ? `<span class="badge">${state.gps.lat.toFixed(3)}, ${state.gps.lng.toFixed(3)}</span>` : ""}
    </div>
    ${p ? `
      <div class="deck">
        <article class="person">
          <img src="${p.photo}" alt="${p.name}" />
          <div class="info">
            <span class="chip">${p.km} km · ${p.town}, ${p.county}</span>
            <span class="chip">${p.mode}</span>
            <h2>${p.name}, ${p.age}</h2>
            <p>${p.bio}</p>
            <p style="margin-top:6px;color:#ddd;">${p.interests.join(" · ")}</p>
          </div>
        </article>
      </div>
      <div class="actions">
        <button class="round no" onclick="pass('${p.id}')">✕</button>
        <button class="round" onclick="report('${p.id}')">⚑</button>
        <button class="round yes" onclick="like('${p.id}')">♥</button>
      </div>
    ` : `<div class="empty"><h3>That's the neighbourhood for now.</h3><p>Widen county or distance, or check Matches.</p></div>`}
  `;
}

window.setFilter = (k, v) => {
  state.filters[k] = k === "maxKm" ? Number(v) : v;
  persist();
  render();
};

window.askGPS = () => {
  if (!navigator.geolocation) { toast("Geolocation not supported"); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    state.gps = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    persist();
    toast("Location saved on this device");
    render();
  }, () => toast("Location permission denied — use county filter"));
};

window.pass = (id) => {
  state.passes.push(id);
  persist();
  render();
};

window.like = (id) => {
  state.likes.push(id);
  const person = SEED.find(p => p.id === id);
  if (person && state.likes.length % 2 === 0) {
    if (!state.matches.find(m => m.id === id)) {
      state.matches.push(person);
      state.chats[id] = state.chats[id] || [
        { from: "them", text: `Heh, karibu. You're in ${state.user?.town || "town"} too?`, t: Date.now() }
      ];
      toast(`It's a match with ${person.name}`);
    }
  } else {
    toast("Like sent");
  }
  persist();
  render();
};

window.report = (id) => {
  state.reports.push(id);
  persist();
  toast("Reported. They won't appear again on this device.");
  render();
};

function matchesView() {
  if (!state.matches.length) return `<div class="empty"><h3>No matches yet</h3><p>Keep liking nearby profiles. Mutual likes open chat.</p></div>`;
  return `<div class="match-list">${state.matches.map(m => `
    <div class="match-item">
      <img class="avatar" src="${m.photo}" alt="" />
      <div style="flex:1;">
        <strong>${m.name}, ${m.age}</strong>
        <div style="color:var(--muted);font-size:13px;">${m.town} · ${m.km} km</div>
      </div>
      <button class="btn btn-primary" onclick="openChat('${m.id}')">Chat</button>
    </div>`).join("")}</div>`;
}

window.openChat = (id) => { state.activeChat = id; go("thread"); };

function chatsView() {
  const ids = Object.keys(state.chats);
  if (!ids.length) return `<div class="empty"><h3>Inbox is quiet</h3><p>Match first, then talk.</p></div>`;
  return `<div class="chat-list">${ids.map(id => {
    const p = SEED.find(x => x.id === id);
    const last = state.chats[id].slice(-1)[0];
    return `<div class="chat-item" onclick="openChat('${id}')">
      <img class="avatar" src="${p.photo}" alt="" />
      <div><strong>${p.name}</strong><div style="color:var(--muted);font-size:13px;">${last.text}</div></div>
    </div>`;
  }).join("")}</div>`;
}

function threadView() {
  const p = SEED.find(x => x.id === state.activeChat);
  if (!p) return `<div class="empty">Select a chat.</div>`;
  const msgs = state.chats[p.id] || [];
  return `
    <button class="btn" onclick="go('chats')">← Back</button>
    <h2 style="margin:12px 0;font-family:Fraunces,serif;">${p.name}</h2>
    <p style="color:var(--muted);margin-bottom:12px;">${p.town}, ${p.county} · ${p.km} km</p>
    <div class="msg-thread">
      ${msgs.map(m => `<div class="bubble ${m.from==="me"?"me":""}">${m.text}</div>`).join("")}
    </div>
    <form class="composer" onsubmit="sendMsg(event,'${p.id}')">
      <input name="text" required placeholder="Write something kind…" />
      <button class="btn btn-primary">Send</button>
    </form>
    <p style="margin-top:10px;"><button class="report" onclick="report('${p.id}'); go('chats')">Report / hide ${p.name}</button></p>
  `;
}

window.sendMsg = (e, id) => {
  e.preventDefault();
  const text = new FormData(e.target).get("text");
  state.chats[id] = state.chats[id] || [];
  state.chats[id].push({ from: "me", text, t: Date.now() });
  persist();
  e.target.reset();
  render();
};

function safetyView() {
  return `
    <h2 style="font-family:Fraunces,serif;margin-bottom:8px;">Stay safe, Kenya</h2>
    <div class="card" style="margin-bottom:10px;">
      <h3>Meet in public first</h3>
      <p>The Junction, Two Rivers, City Mall Nyali, Mega City Kisumu — daylight, own transport, tell a friend.</p>
    </div>
    <div class="card" style="margin-bottom:10px;">
      <h3>Report & hide</h3>
      <p>On any profile tap the flag. Hidden people stay off this device. In production this alerts moderators.</p>
    </div>
    <div class="card">
      <h3>Hidden on this device</h3>
      <p>${state.reports.length ? state.reports.join(", ") : "None yet."}</p>
    </div>
  `;
}

function profileView() {
  const u = state.user || {};
  return `
    <h2 style="font-family:Fraunces,serif;margin-bottom:12px;">Your profile</h2>
    <form onsubmit="saveProfile(event)">
      <div class="row-2">
        <div class="field"><label>Name</label><input name="name" value="${u.name||""}" required /></div>
        <div class="field"><label>Age</label><input name="age" type="number" min="18" value="${u.age||25}" /></div>
      </div>
      <div class="row-2">
        <div class="field"><label>County</label><select name="county">${options(COUNTIES, u.county)}</select></div>
        <div class="field"><label>Town / estate</label><input name="town" value="${u.town||""}" placeholder="Kilimani" /></div>
      </div>
      <div class="row-2">
        <div class="field"><label>Tribe (optional)</label><select name="tribe">${options(TRIBES, u.tribe)}</select></div>
        <div class="field"><label>Religion (optional)</label><select name="religion">${options(RELIGIONS, u.religion)}</select></div>
      </div>
      <div class="field"><label>Mode</label><select name="mode">${options(MODES, u.mode)}</select></div>
      <div class="field"><label>Bio</label><textarea name="bio" rows="3">${u.bio||""}</textarea></div>
      <div class="field"><label>Photo URL</label><input name="photo" value="${u.photo||""}" placeholder="https://…" /></div>
      <div class="field"><label>Or upload a photo</label><input type="file" accept="image/*" onchange="uploadPhoto(event)" /></div>
      ${u.photo ? `<img src="${u.photo}" alt="" style="width:120px;height:120px;object-fit:cover;border-radius:16px;margin-bottom:12px;" />` : ""}
      <button class="btn btn-primary">Save profile</button>
    </form>
    <p style="margin-top:16px;"><button class="btn" onclick="logout()">Log out</button></p>
  `;
}

window.uploadPhoto = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.user.photo = reader.result;
    persist();
    toast("Photo attached on this device");
    render();
  };
  reader.readAsDataURL(file);
};

window.saveProfile = (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  state.user = { ...state.user, ...Object.fromEntries(fd.entries()), age: Number(fd.get("age")) };
  persist();
  toast("Profile saved");
};

window.logout = () => {
  state.user = null;
  persist();
  go("home");
};

function premiumView() {
  return `
    <h2 style="font-family:Fraunces,serif;">Karibu Plus</h2>
    <p class="lede" style="margin:8px 0 16px;">See further, rewind a pass, and stand out. Payments in Kenya can plug into M-Pesa STK later.</p>
    <div class="card">
      <h3>KSh 499 / month</h3>
      <p>80 km radius · extra likes · badge on profile</p>
      <button class="btn btn-primary" style="margin-top:12px;" onclick="activatePlus()">Activate demo Plus</button>
    </div>
  `;
}

window.activatePlus = () => {
  state.premium = true;
  persist();
  toast("Plus is on for this browser");
  go("discover");
};

function render() {
  const r = state.route;
  if (r === "home") app.innerHTML = landing();
  else if (r === "login") app.innerHTML = authForm("login");
  else if (r === "signup") app.innerHTML = authForm("signup");
  else if (r === "discover") app.innerHTML = shell(discoverView());
  else if (r === "matches") app.innerHTML = shell(matchesView());
  else if (r === "chats") app.innerHTML = shell(chatsView());
  else if (r === "thread") app.innerHTML = shell(threadView());
  else if (r === "safety") app.innerHTML = shell(safetyView());
  else if (r === "profile") app.innerHTML = shell(profileView());
  else if (r === "premium") app.innerHTML = shell(premiumView());
  else app.innerHTML = landing();
}

render();
