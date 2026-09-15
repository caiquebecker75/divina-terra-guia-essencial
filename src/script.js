(function(){
  var stage = document.getElementById('stage');
  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var N = slides.length, i = 0, lock = false;
  var SVGNS = 'http://www.w3.org/2000/svg';
  function sv(tag, attrs){ var e = document.createElementNS(SVGNS, tag); for(var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function pad(n){ return String(n).padStart(2, '0'); }
  function $(id){ return document.getElementById(id); }
  function restart(el){ el.style.animation = 'none'; el.offsetHeight; el.style.animation = ''; }

  /* ---------- palco 1600×900 escalado ---------- */
  function fit(){ stage.style.transform = 'scale(' + Math.min(innerWidth / 1600, innerHeight / 900) + ')'; }
  addEventListener('resize', fit); fit();

  /* ================= DADOS ================= */
  var ORBIT = [['i-tree','Estruturar'],['i-shelf','Organizar'],['i-sign','Sinalizar'],['i-seal','Testar'],['i-cap','Ensinar'],['i-copy','Replicar']];
  var EQ = [
    ['i-tree','Categorias','Define o que existe e como está organizado.'],
    ['i-shelf','Exposição','Define a lógica usada dentro da gôndola.'],
    ['i-grid','Planograma','Traduz a lógica em orientação prática de execução.'],
    ['i-sign','Comunicação','Ajuda o shopper a entender a loja e os benefícios.'],
    ['i-cycle','Operação','Define como manter o padrão no dia a dia.'],
    ['i-cap','Treinamento','Garante que as pessoas saibam executar.'],
    ['i-copy','Replicação','Leva a metodologia a diferentes formatos e unidades.']
  ];
  var MOD = {
    1:{p:[.62,.38,0],  t:'<b>1 módulo:</b> só as subcategorias e os SKUs essenciais.'},
    2:{p:[.5,.3,.2],   t:'<b>2 módulos:</b> os grupos principais ganham profundidade.'},
    3:{p:[.44,.32,.24],t:'<b>3 módulos:</b> mais variedade, mantendo a hierarquia.'},
    4:{p:[.4,.32,.28], t:'<b>4 ou mais:</b> mais profundidade, sem perder a leitura.'}
  };
  var PH = [
    {t:'Imersão e diagnóstico', s:'Levantamento, loja piloto e inventário', et:'Etapa 1',
     en:['Diagnóstico estratégico','Registro fotográfico comentado','Mapa AS IS','Inventário de categorias e mobiliário','Oportunidades priorizadas']},
    {t:'Estratégia', s:'Categorias, naming e Divina Logic', et:'Etapas 2, 3 e 4',
     en:['Árvore mestre de categorias','Glossário e regras de novos SKUs','Matriz de nomenclatura','Documento Divina Logic','Matriz Obrigatório · Adaptável · Recomendado']},
    {t:'Desenvolvimento', s:'Planogramas e sistema visual', et:'Etapas 5 e 6',
     en:['Biblioteca de planogramas-base','Modelos modulares','Ficha de leitura de planograma','Conceito visual de navegação','Templates das peças de gôndola']},
    {t:'Piloto', s:'Preparação, implantação e acompanhamento', et:'Etapa 7',
     en:['Plano de implantação','Checklist de execução','Implantação assistida','Registro de antes e depois','Relatório de aprendizados']},
    {t:'Validação', s:'Testes, correções e consolidação', et:'Etapa 8',
     en:['Roteiro de teste','Registro das dúvidas','Matriz de correções','Versão validada da metodologia']},
    {t:'Manualização', s:'Manual, guia rápido e treinamento', et:'Etapa 9 e guia rápido',
     en:['Manual Digital · 15 capítulos','Guia Rápido Divina Terra','Trilha de treinamento · 8 módulos','Exercícios, quiz e FAQ']},
    {t:'Escala', s:'Clusters, rollout, governança e suporte', et:'Etapa 10',
     en:['Matriz de clusters','Plano de rollout em ondas','Checklist de auditoria','Janela de suporte','Governança e versionamento']}
  ];
  var STEPC = ['#5C4331','#6B4E37','#7D5B3A','#94683A','#AD7736','#C98A34','#DE9835'];
  var ONDAS = [
    ['Onda 1 · Loja piloto','Laboratório do sistema: implantação assistida, registro de antes e depois e relatório de aprendizados.'],
    ['Onda 2 · Unidades representativas','Lojas que representam os principais clusters confirmam se as regras continuam funcionando.'],
    ['Onda 3 · Expansão','Manual, treinamento e kits liberados para a rede, com as dúvidas centralizadas no FAQ.']
  ];
  var AUD = [['Produtos na categoria correta',0],['Ordem de exposição respeitada',1],['Testeiras atualizadas',0],['Comunicação de lançamento',2]];
  var AUDS = [['ok','OK'],['aj','Ajustar'],['na','Não se aplica']];
  var ITEMS = {
    p0:{i:'i-tree', n:'Árvore de Categorias', l:['Árvore mestre de categorias','Hierarquia oficial de categorias e subcategorias','Critérios de classificação e glossário','Regras de entrada de novos SKUs']},
    p1:{i:'i-rule', n:'Documento Divina Logic', l:['Princípios oficiais de exposição','Matriz Obrigatório · Adaptável · Recomendado','Regras por número de módulos','Protocolo de ruptura, novidades e mudança de mix']},
    p2:{i:'i-grid', n:'Biblioteca de Planogramas', l:['Planogramas-base das categorias priorizadas','Modelos modulares de adaptação','Ficha de leitura de planograma','Padrão de nomenclatura e versionamento']},
    p3:{i:'i-sign', n:'Kit Visual de Navegação', l:['Conceito visual de navegação','Sistema de categoria e subcategoria','Comunicação de benefícios','Templates das peças de gôndola e regras de uso']},
    p4:{i:'i-book', n:'Manual Digital Divina Navegação', l:['15 capítulos, da organização da loja à conformidade','Biblioteca de regras e exemplos','Versão master para atualizações, no formato acordado']},
    p5:{i:'i-list', n:'Guia Rápido Operacional', l:['Checklists de abertura e manutenção','Cinco regras essenciais de exposição','O que fazer em ruptura e com produto novo','Quem acionar em caso de dúvida']},
    p6:{i:'i-cap',  n:'Kit de Treinamento', l:['Trilha em 8 módulos','Apresentação de capacitação','Exercícios práticos e quiz','FAQ inicial e checklist de conferência']},
    p7:{i:'i-store',n:'Matriz de Clusters', l:['Definição dos clusters por formato','Regras de adaptação por tamanho de loja','Exemplos de aplicação','Prioridade de categorias por formato']},
    p8:{i:'i-seal', n:'Checklist de Auditoria', l:['10 a 15 critérios de conferência','Resposta simples: OK · Ajustar · Não se aplica','Orientação de uso','Modelo de evidência fotográfica']},
    s0:{i:'i-search',n:'Imersão e diagnóstico', l:['Imersão na loja piloto','Diagnóstico fotográfico comentado','Mapa AS IS da organização atual','Inventário de categorias e mobiliário']},
    s1:{i:'i-store', n:'Implantação assistida', l:['Plano de implantação da loja piloto','Checklist de execução','Acompanhamento conforme o escopo','Antes e depois e relatório de ajustes']},
    s2:{i:'i-target',n:'Teste e validação', l:['Roteiro de teste de usabilidade','Registro das dúvidas encontradas','Matriz de correções','Versão validada da metodologia']},
    s3:{i:'i-team',  n:'Treinamento centralizado', l:['Sessão de capacitação definida no escopo','Formato para a equipe central replicar o treinamento']},
    s4:{i:'i-grow',  n:'Rollout e governança', l:['Plano de implantação em ondas','Papéis da franqueadora e do franqueado','Fluxo de novos SKUs e versionamento']},
    s5:{i:'i-cycle', n:'Janela de suporte', l:['Período e canal definidos','Dúvidas de leitura de planograma e de categoria','Apoio na aplicação das regras e dos materiais']}
  };
  var ACTS = [['Começo',0,1],['Meio',2,7],['Fim',8,9]];

  /* ================= 01 · ÓRBITA ================= */
  (function(){
    var o = $('orbit'), svg = o.querySelector('svg.ring'), C = 330, R = 270;
    [[R,'rgba(222,152,53,.45)','6 9',2],[200,'rgba(222,152,53,.16)','',1.5],[140,'rgba(222,152,53,.1)','',1.5]].forEach(function(c){
      svg.appendChild(sv('circle',{cx:C,cy:C,r:c[0],fill:'none',stroke:c[1],'stroke-width':c[3],'stroke-dasharray':c[2]}));
    });
    ORBIT.forEach(function(d,k){
      var a = (-90 + k * 60) * Math.PI / 180, n = document.createElement('div');
      n.className = 'onode ci'; n.style.left = (C + R * Math.cos(a)) + 'px'; n.style.top = (C + R * Math.sin(a)) + 'px';
      n.innerHTML = '<span class="dot"><svg><use href="#' + d[0] + '"/></svg><span class="n">' + (k + 1) + '</span></span><b>' + d[1] + '</b>';
      o.appendChild(n);
      if(k < 5){
        var am = -90 + k * 60 + 30, ar = am * Math.PI / 180;
        var g = sv('g',{transform:'translate(' + (C + R * Math.cos(ar)) + ' ' + (C + R * Math.sin(ar)) + ') rotate(' + (am + 90) + ')'});
        g.appendChild(sv('path',{d:'M-6 -8 L3 0 L-6 8',fill:'none',stroke:'#DE9835','stroke-width':2.4,'stroke-linecap':'round','stroke-linejoin':'round'}));
        svg.appendChild(g);
      }
    });
  })();

  /* ================= 02 · PRATELEIRAS ANTES × DEPOIS ================= */
  (function(){
    var BRAND = ['#CDB99A','#B98B63','#93A088','#D9A866'], TYPE = ['i-jar','i-target','i-drop'];
    var ROWS = [172,256,340], PW = 42, PH = 58, STEP = 47, X0 = 120;
    function pkg(svg, x, y, fill, type){
      svg.appendChild(sv('rect',{x:x,y:y,width:PW,height:PH,rx:6,fill:fill}));
      var u = sv('use',{href:'#' + TYPE[type],x:x + 9,y:y + 17,width:24,height:24}); u.setAttribute('style','color:#3A2A1E'); svg.appendChild(u);
    }
    function planks(svg, color){ ROWS.forEach(function(y){ svg.appendChild(sv('rect',{x:X0 - 20,y:y + PH + 2,width:1440 - X0,height:7,rx:3,fill:color})); }); }
    function label(svg, x, y, cls, txt, anchor){ var t = sv('text',{x:x,y:y,'text-anchor':anchor || 'middle','class':cls}); t.textContent = txt; svg.appendChild(t); }
    function pill(svg, x, w, fill, txt){ svg.appendChild(sv('rect',{x:x,y:138,width:w,height:22,rx:11,fill:fill})); label(svg, x + w / 2, 153, 'brd', txt); }

    // HOJE: blocos por marca, tipos misturados, preço sem ordem
    var b = $('shB'), mix = [0,1,0,2,1,0];
    planks(b, '#BCAB8E');
    for(var br = 0; br < 4; br++){
      var gx = X0 + br * (6 * STEP + 24);
      pill(b, gx, 6 * STEP - 5, BRAND[br], 'MARCA ' + (br + 1));
      ROWS.forEach(function(y, r){ for(var q = 0; q < 6; q++) pkg(b, gx + q * STEP, y, BRAND[br], mix[(q + br + r) % 6]); });
    }

    // PROPOSTO: necessidade (categoria + motivo) > marca (blocos verticais) > preço (caros em cima, baratos embaixo)
    var a = $('shA');
    planks(a, '#7A6250');
    a.appendChild(sv('path',{d:'M34 ' + (ROWS[2] + PH) + ' V' + (ROWS[0] + 4),stroke:'#DE9835','stroke-width':2,fill:'none'}));
    a.appendChild(sv('path',{d:'M27 ' + (ROWS[0] + 13) + ' L34 ' + (ROWS[0] + 3) + ' L41 ' + (ROWS[0] + 13),stroke:'#DE9835','stroke-width':2,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'}));
    label(a, 20, 152, 'prcs', 'MAIS CARO', 'start');
    label(a, 20, ROWS[2] + PH + 24, 'prcs', 'MAIS BARATO', 'start');
    ['$$$','$$','$'].forEach(function(p, r){ label(a, 50, ROWS[r] + PH / 2 + 6, 'prc', p, 'start'); });
    var CATS = [['PROTEÍNAS','Ganho de massa muscular',0],['CREATINAS','Recuperação do grupo muscular',1],['ÔMEGAS','Saúde cardiovascular',2]];
    var BW = 2 * STEP - 5, CW = 8 * STEP + 3 * 8 - 5, x = X0;
    CATS.forEach(function(c){
      a.appendChild(sv('rect',{x:x,y:74,width:CW,height:28,rx:8,fill:'#DE9835'}));
      label(a, x + CW / 2, 93, 'tst', c[0]);
      label(a, x + CW / 2, 125, 'ben', c[1]);
      for(var br = 0; br < 4; br++){
        var bx = x + br * (2 * STEP + 8);
        pill(a, bx, BW, BRAND[br], 'MARCA ' + (br + 1));
        ROWS.forEach(function(y){ for(var q = 0; q < 2; q++) pkg(a, bx + q * STEP, y, BRAND[br], c[2]); });
      }
      x += CW + 40;
    });
  })();
  var cmp = $('cmp'), dragging = false;
  function setX(p, anim){
    p = Math.max(0, Math.min(100, p));
    cmp.classList.toggle('anim', !!anim);
    cmp.style.setProperty('--x', p + '%');
    document.querySelectorAll('#cmpSeg button').forEach(function(bt){ bt.classList.toggle('on', Math.abs(+bt.getAttribute('data-cmp') - p) < 1); });
  }
  function moveX(e){ var r = cmp.getBoundingClientRect(); setX((e.clientX - r.left) / r.width * 100, false); }
  cmp.addEventListener('pointerdown', function(e){ dragging = true; cmp.setPointerCapture(e.pointerId); moveX(e); });
  cmp.addEventListener('pointermove', function(e){ if(dragging) moveX(e); });
  cmp.addEventListener('pointerup', function(){ dragging = false; });
  cmp.addEventListener('pointercancel', function(){ dragging = false; });

  /* ================= 03 · RODA ================= */
  (function(){
    var svg = $('wheel'), C = 260, R1 = 250, R0 = 132, st = 360 / 7;
    function pt(r, a){ var t = (a - 90) * Math.PI / 180; return [C + r * Math.cos(t), C + r * Math.sin(t)]; }
    EQ.forEach(function(d, k){
      var a0 = k * st + 1, a1 = (k + 1) * st - 1, A = pt(R1,a0), B = pt(R1,a1), Cc = pt(R0,a1), D = pt(R0,a0);
      var g = sv('g',{'class':'wseg ci','data-wseg':k});
      g.appendChild(sv('path',{d:'M' + A + ' A' + R1 + ' ' + R1 + ' 0 0 1 ' + B + ' L' + Cc + ' A' + R0 + ' ' + R0 + ' 0 0 0 ' + D + ' Z'}));
      var m = (a0 + a1) / 2, ic = pt((R0 + R1) / 2, m);
      g.appendChild(sv('use',{href:'#' + d[0],x:ic[0] - 20,y:ic[1] - 20,width:40,height:40}));
      var lp = pt(R1 + 22, m), anc = lp[0] < C - 20 ? 'end' : (lp[0] > C + 20 ? 'start' : 'middle');
      var tx = sv('text',{x:lp[0],y:lp[1],'text-anchor':anc,'dominant-baseline':'middle','class':'wlbl'}); tx.textContent = d[1].toUpperCase();
      g.appendChild(tx); svg.appendChild(g);
    });
  })();
  function setWheel(k){
    document.querySelectorAll('.wseg').forEach(function(g){ g.classList.toggle('on', +g.getAttribute('data-wseg') === k); });
    var hub = $('hub');
    hub.innerHTML = k < 0
      ? '<span class="anim"><span class="hn">7</span><h4>componentes</h4><p>Juntos, formam o Padrão Divina Terra</p></span>'
      : '<span class="anim"><span class="hn">' + pad(k + 1) + '</span><h4>' + EQ[k][1] + '</h4><p>' + EQ[k][2] + '</p></span>';
  }

  /* ================= 04 · SIMULADOR DE GÔNDOLA ================= */
  function drawGond(n){
    var MW = 214, GAP = 14, H = 236, TOP = 40, filled = Math.min(n, 4), m = MOD[n], ranges = [], acc = 0, html = '';
    var W = filled * MW + (filled - 1) * GAP, CATS = ['a','b','c'], NAMES = ['Subcategoria A','Subcategoria B','Subcategoria C'];
    m.p.forEach(function(w){ ranges.push([acc, acc + w]); acc += w; });
    for(var s = 0; s < 4; s++){
      html += '<div class="gslot' + (s < filled ? ' fill' : '') + '" style="left:' + (s * (MW + GAP)) + 'px;top:' + TOP + 'px;width:' + MW + 'px;height:' + H + 'px">' + (s < filled ? '' : '<span>+</span>') + '</div>';
    }
    function fx(f){ if(f >= 1) return W; var t = f * filled, mi = Math.floor(t); return mi * (MW + GAP) + (t - mi) * MW; }
    CATS.forEach(function(c, j){
      if(m.p[j] <= 0) return;
      var x0 = fx(ranges[j][0]), x1 = fx(ranges[j][1]), w = x1 - x0 - 6;
      html += '<div class="gtest ' + c + '" style="left:' + (x0 + 3) + 'px;width:' + w + 'px">' + (w > 150 ? NAMES[j] : 'ABC'[j]) + '</div>';
    });
    for(var mo = 0; mo < filled; mo++){
      var l0 = mo / filled, l1 = (mo + 1) / filled, mx = mo * (MW + GAP);
      for(var r = 0; r < 4; r++){
        var y = TOP + 10 + r * 57;
        CATS.forEach(function(c, j){
          var o0 = Math.max(l0, ranges[j][0]), o1 = Math.min(l1, ranges[j][1]);
          if(o1 - o0 <= 1e-4) return;
          var sx = mx + 8 + (o0 - l0) * filled * (MW - 16), ex = mx + 8 + (o1 - l0) * filled * (MW - 16), k = Math.floor((ex - sx + 3) / 19);
          for(var q = 0; q < k; q++){
            html += '<i class="gp ' + c + (q % 3 === 1 ? ' t2' : (q % 3 === 2 ? ' t3' : '')) + '" style="left:' + (sx + q * 19) + 'px;top:' + y + 'px;animation-delay:' + (mo * 60 + q * 8) + 'ms"></i>';
          }
        });
        html += '<i class="gplank" style="left:' + mx + 'px;top:' + (y + 46) + 'px;width:' + MW + 'px"></i>';
      }
    }
    $('gond').innerHTML = html;
    $('gcap').innerHTML = m.t;
    document.querySelectorAll('#modSeg button').forEach(function(bt){ bt.classList.toggle('on', +bt.getAttribute('data-mod') === n); });
  }
  drawGond(1);

  /* ================= 05 · ESCADA ================= */
  (function(){
    var html = '';
    PH.forEach(function(d, k){
      html += '<button class="stp ci rv' + (k >= 5 ? ' lt' : '') + (k === 0 ? ' on first' : '') + '" data-step="' + k + '" style="--d:' + (k + 2) + ';left:' + (80 + k * 206) + 'px;height:' + (150 + k * 70) + 'px;background:' + STEPC[k] + '">'
        + '<span class="flag"><svg><use href="#i-ok"/></svg></span><span class="sn">' + (k + 1) + '</span><h4>' + d.t + '</h4><p>' + d.s + '</p></button>';
    });
    $('stairs').innerHTML = html;
  })();
  function setStep(k){
    document.querySelectorAll('.stp').forEach(function(b){ b.classList.toggle('on', +b.getAttribute('data-step') === k); });
    var d = PH[k];
    $('pcard').innerHTML = '<div class="anim"><div class="ph"><span class="num">' + pad(k + 1) + '</span><div><h4>' + d.t + '</h4><span class="et">' + d.et + '</span></div>'
      + '<span class="gate"><i><svg><use href="#i-ok"/></svg></i>Aprovação<br>ao fim da fase</span></div><div class="chips">'
      + d.en.map(function(e){ return '<span class="chip"><svg><use href="#i-ok"/></svg>' + e + '</span>'; }).join('') + '</div></div>';
  }
  setStep(0);

  /* ================= 06 · ONDAS E AUDITORIA ================= */
  function setOnda(k){
    document.querySelectorAll('.rc').forEach(function(b){ b.classList.toggle('on', +b.getAttribute('data-onda') === k); });
    $('onda').innerHTML = '<div class="anim"><span class="caps">' + ONDAS[k][0] + '</span><p>' + ONDAS[k][1] + '</p></div>';
  }
  setOnda(0);
  function drawAudit(){
    $('audit').innerHTML = AUD.map(function(a, k){
      var s = AUDS[a[1]];
      return '<button class="aud ci" data-audit="' + k + '"><span>' + a[0] + '</span><span class="pill ' + s[0] + '">' + s[1] + '</span></button>';
    }).join('');
  }
  drawAudit();

  /* ================= 08 · CATÁLOGO ================= */
  (function(){
    var html = '', ACC = ['#DE9835','#6B4F3C','#D1CBB8'];
    for(var r = 0; r < 3; r++){
      html += '<div class="gshelf">';
      for(var c = 0; c < 3; c++){
        var id = 'p' + (r * 3 + c), d = ITEMS[id];
        html += '<button class="pkg ci" data-item="' + id + '" style="--c:' + ACC[(r + c) % 3] + '"><span class="pt">Produto</span><span class="pi"><svg><use href="#' + d.i + '"/></svg></span><h4>' + d.n + '</h4></button>';
      }
      html += '</div>';
    }
    $('gondola').innerHTML = html;
    var th = '';
    for(var s = 0; s < 6; s++){ var sd = ITEMS['s' + s]; th += '<button class="tkt ci" data-item="s' + s + '"><svg><use href="#' + sd.i + '"/></svg><span>' + sd.n + '</span></button>'; }
    $('tkg').innerHTML = th;
  })();
  function setItem(id){
    document.querySelectorAll('[data-item]').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-item') === id); });
    var d = ITEMS[id], sv2 = id.charAt(0) === 's';
    $('label8').innerHTML = '<span class="hole"></span><div class="anim"><span class="kind' + (sv2 ? ' sv' : '') + '">' + (sv2 ? 'Serviço' : 'Produto') + '</span><h4>' + d.n + '</h4>'
      + '<div class="inc">O que inclui</div><ul>' + d.l.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
  }
  setItem('p4');

  /* ================= 09 · CUPOM ================= */
  (function(){ var d = 'M0 0'; for(var x = 0; x < 580; x += 20) d += ' L' + (x + 10) + ' 16 L' + (x + 20) + ' 0'; $('zig').setAttribute('d', d + ' Z'); })();
  var counted = false;
  function countUp(){
    if(counted) return; counted = true;
    var el = $('cUp'), end = 29900, t0 = null;
    function step(ts){ if(!t0) t0 = ts; var p = Math.min((ts - t0) / 1300, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR'); if(p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  /* ================= 10 · CAMINHO ================= */
  var checks = [false,false,false,false];
  function paintChecks(){
    var n = checks.filter(Boolean).length;
    document.querySelectorAll('.pst').forEach(function(b){ b.classList.toggle('done', checks[+b.getAttribute('data-check')]); });
    $('ready').innerHTML = n === 4 ? '<b>Tudo pronto.</b> Podemos começar a imersão na loja piloto.' : '<b>' + n + ' de 4</b> · marque o que já está resolvido';
  }
  paintChecks();

  /* ================= HUD, ÍNDICE E NAVEGAÇÃO ================= */
  (function(){
    var h = '';
    ACTS.forEach(function(a, j){
      h += '<div class="act-g" data-actg="' + j + '"><span>' + a[0] + '</span><div class="ticks">';
      for(var k = a[1]; k <= a[2]; k++) h += '<button class="tk ci" data-go="' + k + '" title="' + slides[k].getAttribute('data-t') + '"><i></i></button>';
      h += '</div></div>';
    });
    $('acts').innerHTML = h;
    var c = '';
    ACTS.forEach(function(a){
      c += '<div><h5>' + a[0] + '</h5>';
      for(var k = a[1]; k <= a[2]; k++) c += '<button class="ixi ci" data-go="' + k + '"><span>' + pad(k + 1) + '</span><p>' + slides[k].getAttribute('data-t') + '</p></button>';
      c += '</div>';
    });
    $('ixcols').innerHTML = c;
  })();
  var ix = $('ix');
  function openIx(){ ix.classList.add('on'); } function closeIx(){ ix.classList.remove('on'); }

  function paint(){
    var t = slides[i].className.match(/t-(\w+)/);
    stage.setAttribute('data-theme', t ? t[1] : 'creme');
    stage.setAttribute('data-slide', i);
    $('cnt').textContent = pad(i + 1) + ' / ' + pad(N);
    $('prog').style.width = ((i + 1) / N * 100) + '%';
    document.querySelectorAll('.tk').forEach(function(b){ b.classList.toggle('on', +b.getAttribute('data-go') === i); });
    document.querySelectorAll('.act-g').forEach(function(g, j){ g.classList.toggle('on', i >= ACTS[j][1] && i <= ACTS[j][2]); });
  }
  function go(n){
    n = Math.max(0, Math.min(N - 1, n));
    if(n === i || lock) return;
    lock = true;
    var old = slides[i];
    old.classList.add('prev'); old.classList.remove('act');
    i = n;
    slides[i].classList.add('act');
    slides[i].querySelectorAll('.rv').forEach(restart);
    setTimeout(function(){ old.classList.remove('prev'); lock = false; }, 640);
    paint();
    if(i === 8) countUp();
  }
  function next(){ go(i + 1); } function prev(){ go(i - 1); }
  slides[0].classList.add('act'); paint();

  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-go],[data-next],[data-prev],[data-ix],#ixClose,#pdf,[data-cmp],[data-wseg],#hub,[data-mod],[data-step],[data-onda],[data-audit],[data-p7],[data-item],[data-check]');
    if(!t) return;
    if(t.hasAttribute('data-go')){ closeIx(); if(t.hasAttribute('data-pick')) setItem(t.getAttribute('data-pick')); return go(+t.getAttribute('data-go')); }
    if(t.hasAttribute('data-next')) return next();
    if(t.hasAttribute('data-prev')) return prev();
    if(t.hasAttribute('data-ix')) return openIx();
    if(t.id === 'ixClose') return closeIx();
    if(t.id === 'pdf') return window.print();
    if(t.hasAttribute('data-cmp')) return setX(+t.getAttribute('data-cmp'), true);
    if(t.hasAttribute('data-wseg')) return setWheel(+t.getAttribute('data-wseg'));
    if(t.id === 'hub') return setWheel(-1);
    if(t.hasAttribute('data-mod')) return drawGond(+t.getAttribute('data-mod'));
    if(t.hasAttribute('data-step')) return setStep(+t.getAttribute('data-step'));
    if(t.hasAttribute('data-onda')) return setOnda(+t.getAttribute('data-onda'));
    if(t.hasAttribute('data-audit')){ var a = AUD[+t.getAttribute('data-audit')]; a[1] = (a[1] + 1) % 3; return drawAudit(); }
    if(t.hasAttribute('data-p7')){
      var k = t.getAttribute('data-p7');
      document.querySelectorAll('[data-p7]').forEach(function(b){ b.classList.toggle('on', b === t); });
      document.querySelectorAll('.p7').forEach(function(p){ p.classList.toggle('on', p.getAttribute('data-pane7') === k); });
      return;
    }
    if(t.hasAttribute('data-item')) return setItem(t.getAttribute('data-item'));
    if(t.hasAttribute('data-check')){ var c = +t.getAttribute('data-check'); checks[c] = !checks[c]; return paintChecks(); }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' '){ e.preventDefault(); next(); }
    else if(e.key === 'ArrowLeft' || e.key === 'PageUp'){ e.preventDefault(); prev(); }
    else if(e.key === 'Home') go(0);
    else if(e.key === 'End') go(N - 1);
    else if(e.key === 'm' || e.key === 'M'){ ix.classList.contains('on') ? closeIx() : openIx(); }
    else if(e.key === 'Escape') closeIx();
    hideHint();
  });

  var x0 = null, y0 = null;
  document.addEventListener('touchstart', function(e){
    if(e.target.closest('#cmp')){ x0 = null; return; }
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, {passive:true});
  document.addEventListener('touchend', function(e){
    if(x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if(Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
    x0 = null; hideHint();
  }, {passive:true});

  var wt = 0;
  document.addEventListener('wheel', function(e){
    var now = Date.now(); if(now - wt < 700 || Math.abs(e.deltaY) < 24) return;
    wt = now; (e.deltaY > 0 ? next : prev)(); hideHint();
  }, {passive:true});

  /* ---------- cursor de dois tons ---------- */
  var cur = $('cur'), dot = $('curDot'), mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener('mousemove', function(e){
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    cur.classList.toggle('on', !!e.target.closest('button,.ci'));
  });
  addEventListener('mousedown', function(){ cur.classList.add('down'); });
  addEventListener('mouseup', function(){ cur.classList.remove('down'); });
  (function loop(){ cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18; cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();

  var hint = $('hint'), ht = setTimeout(hideHint, 6000);
  function hideHint(){ hint.classList.add('hide'); clearTimeout(ht); }
})();
