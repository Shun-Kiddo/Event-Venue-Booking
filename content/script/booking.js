    // Simple front-end booking demo. Replace with real API calls to your backend.
    const packagesEl = document.getElementById('packages');
    let selectedPackage = 'basic';
    packagesEl.addEventListener('click', (e) => {
      const p = e.target.closest('.package');
      if(!p) return;
      document.querySelectorAll('.package').forEach(x=>x.classList.remove('active'));
      p.classList.add('active');
      selectedPackage = p.dataset.value;
    });

    const bookingsKey = 'sunrise_bookings_demo_v1';
    const form = document.getElementById('bookingForm');
    const list = document.getElementById('bookingsList');
    const clear = document.getElementById('clearStorage');

    function loadBookings(){
      const raw = localStorage.getItem(bookingsKey);
      const items = raw ? JSON.parse(raw) : [];
      renderBookings(items);
      return items;
    }

    function saveBooking(b){
      const items = loadBookings();
      items.push(b);
      localStorage.setItem(bookingsKey, JSON.stringify(items));
      renderBookings(items);
    }

    function renderBookings(items){
      if(items.length===0){ list.innerHTML='<div class="muted" style="padding:.75rem">No booking requests yet</div>'; return; }
      list.innerHTML='';
      items.slice().reverse().forEach(it=>{
        const d = document.createElement('div'); d.className='booking-item';
        d.innerHTML = `<strong>${escapeHtml(it.name)}</strong> — ${escapeHtml(it.date)} ${escapeHtml(it.time)}<div class="muted">${it.guests} • ${it.pkg} • ${escapeHtml(it.email)}</div>`;
        list.appendChild(d);
      })
    }

    form.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const data = {
        name: form.querySelector('#name').value.trim(),
        email: form.querySelector('#email').value.trim(),
        date: form.querySelector('#date').value,
        time: form.querySelector('#time').value,
        guests: form.querySelector('#guests').value,
        pkg: selectedPackage,
        notes: form.querySelector('#notes').value.trim(),
        createdAt: new Date().toISOString()
      };

      // Basic validation
      if(!data.name || !data.email || !data.date || !data.time){
        alert('Please fill name, email, date and time.');
        return;
      }

      // Simulate availability check: do not allow weekends
      const day = new Date(data.date).getDay();
      if(day===0 || day===6){
        if(!confirm('You picked a weekend. Weekends are in high demand — continue?')){
          return;
        }
      }

      // Save locally. In production, POST to your server instead (see notes below).
      saveBooking(data);

      // Friendly UI feedback
      alert('Booking request submitted — we will contact you within 24 hours.');
      form.reset();
      selectedPackage='basic';
      document.querySelectorAll('.package').forEach(x=>x.classList.remove('active'));
      document.querySelector('.package[data-value="basic"]').classList.add('active');
    });

    clear.addEventListener('click', ()=>{ if(confirm('Clear demo bookings?')){ localStorage.removeItem(bookingsKey); renderBookings([]); }});

    function escapeHtml(s){ return String(s).replace(/[&<>"]+/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]||c)); }

    // Initial render
    loadBookings();
