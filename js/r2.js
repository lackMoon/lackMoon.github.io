const stylesheet = new URL('../css/r2.css', import.meta.url).href;
const targets = new Set(['about', 'experience', 'projects', 'skills', 'contact']);
class R2Guide extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    this.history = []; this.busy = false; this.version = 0; this.tour = 0;
    const root = this.attachShadow({ mode: 'open' });
    // All markup here is static. Visitor/model strings always use textContent.
    root.innerHTML = `
      <link rel="stylesheet" href="${stylesheet}">
      <button class="launcher" aria-label="Open R2 Guide" aria-expanded="false" aria-controls="panel"><span class="r2" aria-hidden="true"><i></i><i></i></span><span>Ask the r2 <small>Your helpful assistant</small></span><b aria-hidden="true">✦</b></button>
      <section id="panel" role="dialog" aria-labelledby="title" hidden>
        <header><span class="r2 small" aria-hidden="true"><i></i><i></i></span><div><h2 id="title">R2 Guide</h2><p>Explore lackMoon’s universe</p></div><button class="close" aria-label="Close R2 Guide">×</button></header>
        <div class="intro"><span class="eyebrow">A LITTLE CURIOUS?</span><h3>Meet the mind<br>behind the code.</h3><p>Ask about projects, skills, or how things work.</p><button class="tour">Take a tour</button></div>
        <div class="messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text"></div>
        <p class="status" role="status"></p>
        <form><label for="message">Your message</label><div class="compose"><textarea id="message" rows="2" maxlength="1000" placeholder="Ask me something…" required></textarea><button class="send" aria-label="Send message" type="submit">↑</button></div></form>
        <footer><span>AI can be wrong.<br>Don’t share sensitive information.</span><button class="clear">Clear conversation</button></footer>
      </section>`;
    this.$ = selector => root.querySelector(selector);
    this.launcher = this.$('.launcher'); this.panel = this.$('#panel'); this.input = this.$('textarea');
    this.launcher.onclick = () => this.toggle(this.panel.hidden);
    this.$('.close').onclick = () => this.toggle(false);
    root.addEventListener('keydown', event => { if(event.key === 'Escape') this.toggle(false); });
    this.$('form').onsubmit = event => {event.preventDefault(); this.send(this.input.value);};
    this.input.addEventListener('keydown', event => {
      if(event.key==='Enter' && !event.shiftKey && !event.isComposing) {event.preventDefault(); this.send(this.input.value);}
    });
    this.$('.tour').onclick = () => {
      const stops = ['about', 'projects', 'skills', 'contact'];
      const target=stops[this.tour++ % stops.length]; this.navigate(target);
      this.status(`Tour stop ${((this.tour-1)%4)+1}/4: ${target}. Click again for the next stop.`);
    };
    this.$('.clear').onclick = () => {
      this.version++; this.controller?.abort(); this.history=[];
      this.$('.messages').replaceChildren(); this.input.value=''; this.setBusy(false); this.status(''); this.welcome(); this.input.focus();
    };
    this.welcome();
  }
  disconnectedCallback() { this.version++; this.controller?.abort(); }
  welcome() { this.bubble('assistant', 'Hi, I’m R2. How can i help you?'); }
  toggle(open) {
    this.panel.hidden=!open; this.launcher.setAttribute('aria-expanded',String(open));
    if(open) this.input.focus(); else this.launcher.focus();
  }
  status(text) { this.$('.status').textContent=text; }
  setBusy(value) {
    this.busy=value; this.$('.send').disabled=value;
    this.$('.messages').setAttribute('aria-busy',String(value));
    this.setAttribute('data-state',value?'thinking':'idle');
  }
  bubble(role,text) {
    const node=document.createElement('p'); node.className=role; node.textContent=text;
    this.$('.messages').append(node); node.scrollIntoView({block:'nearest'}); return node;
  }
  navigate(target) {
    if(!targets.has(target)) return;
    const section=document.getElementById(target);
    if(!section) { this.status('This section is not available on this page yet.'); return; }
    section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    section.setAttribute('data-r2-highlight','true');
    section.animate([{outline:'3px solid #a78bfa',outlineOffset:'8px'},{outline:'3px solid transparent',outlineOffset:'16px'}],
      {duration:matchMedia('(prefers-reduced-motion: reduce)').matches?1:1600});
    setTimeout(()=>section.removeAttribute('data-r2-highlight'),2000);
    // Nonmodal panel: navigation never hijacks focus from the visitor.
  }
  cards(actions) {
    if(!Array.isArray(actions)) return;
    const row=document.createElement('div'); row.className='actions';
    actions.slice(0,3).forEach(action=>{
      if(!action || !targets.has(action.target) || typeof action.label!=='string') return;
      const button=document.createElement('button'); button.textContent=action.label.slice(0,80)+' ↗';
      button.setAttribute('aria-label',action.label.slice(0,80)); button.onclick=()=>this.navigate(action.target); row.append(button);
    });
    this.$('.messages').append(row);
  }
  async send(raw) {
    const message=raw.trim(); if(this.busy || !message || message.length>1000) return;
    const endpoint="https://r2-2hlg.onrender.com/api/chat"
    try {
      const url=new URL(endpoint);
      if(url.protocol!=='https:' && !(url.protocol==='http:' && ['localhost','127.0.0.1'].includes(url.hostname))) throw Error();
    } catch { this.status('Set the guide’s API URL before chatting.'); return; }
    const version=++this.version; this.controller=new AbortController();
    const controller=this.controller; this.setBusy(true); this.input.value='';
    const userBubble=this.bubble('user',message); this.status('R2 is thinking…');
    const wake=setTimeout(()=>{if(version===this.version) this.status('Still connecting. The server may be waking up…');},5000);
    const timeout=setTimeout(()=>controller.abort(),75000);
    try {
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},
        credentials:'omit',signal:controller.signal,body:JSON.stringify({message,history:this.history.slice(-8)})});
      if(!response.ok) throw new Error(response.status===429?'limited':'unavailable');
      const data=await response.json();
      if(typeof data.reply!=='string' || !data.reply.trim() || data.reply.length>4000) throw Error('invalid response');
      if(version!==this.version) return;
      this.bubble('assistant',data.reply); this.cards(data.actions);
      this.history.push({role:'user',content:message},{role:'assistant',content:data.reply});
      this.history=this.history.slice(-8); this.status('');
    } catch(error) {
      if(version!==this.version) return;
      userBubble.remove(); if(!this.input.value) this.input.value=message;
      this.status(error.message==='limited'?'R2 has reached its hourly limit. Please try later or take a tour.':'I could not connect. Your message is ready to retry; you can also take a tour.');
    } finally {
      clearTimeout(wake); clearTimeout(timeout);
      if(version===this.version) this.setBusy(false);
    }
  }
}
if(!customElements.get('r2')) customElements.define('r2',MoonGuide);
