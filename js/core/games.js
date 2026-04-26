// Games Module
// All interactive game modes and reference data

let gameState = {
  mode:null, subMode:null,
  quizQ:[], quizIdx:0, quizScore:0, quizStreak:0, quizBest:0, quizAnswered:false, quizShuffled:null, quizFilter:'all',
  flashDeck:[], flashIdx:0, flashFlipped:false, flashKnown:0, flashLearning:0, flashFilter:'all',
  matchPairs:[], matchSel:null, matchMatched:0, matchWrong:0, matchStart:0,
  scenarioIdx:0, scenarioSlot:0, scenarioAnswers:[], waDeck:[], waIdx:0, waAnswered:false, waScore:0,
  supportQuiz:[], supportIdx:0, supportScore:0, supportAnswered:false,
  speedDeck:[], speedIdx:0, speedScore:0, speedMisses:0, speedTimer:null, speedSecs:0,
};

// ═══════════════════════════════════════════════════
// REFERENCE DATA
// ═══════════════════════════════════════════════════

const DB_TYPES = [
  {
    name:'Amazon RDS',icon:'🗄️',type:'Relational (SQL)',engine:'MySQL, PostgreSQL, MariaDB, Oracle, SQL Server',
    useWhen:'Structured data with complex joins, ACID transactions, existing SQL workloads, ERP/CRM systems.',
    notWhen:'Massive scale > millions of req/sec, unstructured/variable schema, extreme low latency (<1ms).',
    features:['Automated backups & point-in-time recovery','Multi-AZ for high availability','Read Replicas for read scaling','Managed OS patching'],
    scaling:'Vertical (instance size) + Read Replicas horizontally',
    consistency:'Strong (ACID)',tag:'OLTP',color:'#2196f3'
  },
  {
    name:'Amazon Aurora',icon:'✨',type:'Relational (SQL) — Cloud-native',engine:'MySQL-compatible & PostgreSQL-compatible',
    useWhen:'High-performance relational workloads needing 5x MySQL speed. SaaS apps, e-commerce, gaming.',
    notWhen:'Workloads that need Oracle or SQL Server compatibility, or tight cost constraints.',
    features:['6 copies across 3 AZs automatically','Up to 15 read replicas','Auto-scaling storage to 128TB','Aurora Serverless for variable workloads'],
    scaling:'Up to 15 read replicas + Aurora Serverless auto-scale',
    consistency:'Strong (ACID)',tag:'OLTP',color:'#9c27b0'
  },
  {
    name:'Amazon DynamoDB',icon:'⚡',type:'NoSQL — Key-Value & Document',engine:'Proprietary (AWS)',
    useWhen:'Single-digit ms latency at any scale. Session stores, shopping carts, leaderboards, IoT, gaming.',
    notWhen:'Complex multi-table joins, ad-hoc queries, aggregations, relational data models.',
    features:['Single-digit ms latency','Serverless — no capacity planning (on-demand mode)','DynamoDB Streams for change events','Global Tables for multi-region active-active'],
    scaling:'Automatic (on-demand) or Provisioned with Auto Scaling',
    consistency:'Eventual (default) or Strong reads',tag:'NoSQL',color:'#ff9900'
  },
  {
    name:'Amazon ElastiCache',icon:'💨',type:'In-Memory Cache',engine:'Redis & Memcached',
    useWhen:'Sub-millisecond latency for frequently read data. Session caching, real-time leaderboards, pub/sub.',
    notWhen:'Primary data store, data that must be durable/persisted without a backing DB.',
    features:['Microsecond to sub-millisecond latency','Redis: sorted sets, pub/sub, persistence, Lua','Memcached: pure caching, multi-thread','Cluster mode for sharding'],
    scaling:'Horizontal sharding (cluster mode)',
    consistency:'Eventual (cache can be stale)',tag:'Cache',color:'#00bcd4'
  },
  {
    name:'Amazon Redshift',icon:'📦',type:'Data Warehouse (SQL)',engine:'PostgreSQL-based (columnar)',
    useWhen:'Petabyte-scale analytics, BI dashboards, complex aggregations over historical data (OLAP).',
    notWhen:'OLTP transactional workloads, frequent small writes, low-latency lookups.',
    features:['Columnar storage for fast analytics','Redshift Spectrum queries S3 directly','Massively parallel processing (MPP)','Concurrency Scaling handles query spikes'],
    scaling:'Node-based cluster scaling',
    consistency:'Strong',tag:'OLAP',color:'#e91e63'
  },
  {
    name:'Amazon Neptune',icon:'🌊',type:'Graph Database',engine:'Apache TinkerPop, SPARQL, openCypher',
    useWhen:'Highly connected data: social networks, fraud detection, knowledge graphs, recommendation engines.',
    notWhen:'Tabular/relational data, simple key-value lookups, analytics workloads.',
    features:['Billions of relationships with ms latency','Supports multiple query languages','Multi-AZ HA with auto-failover','Serverless option available'],
    scaling:'Up to 15 read replicas',
    consistency:'Strong',tag:'Graph',color:'#4caf50'
  },
  {
    name:'Amazon DocumentDB',icon:'📄',type:'Document Database',engine:'MongoDB-compatible',
    useWhen:'JSON/BSON documents, content management, catalogs, user profiles, semi-structured data.',
    notWhen:'Relational queries with joins, graph traversals, key-value with extreme speed needs.',
    features:['MongoDB-compatible API (4.0/5.0)','Managed OS, patching, backups','Multi-AZ HA','Up to 15 read replicas'],
    scaling:'Up to 15 read replicas',
    consistency:'Strong or eventual reads',tag:'Document',color:'#795548'
  },
  {
    name:'Amazon Keyspaces',icon:'🔑',type:'Wide-Column NoSQL',engine:'Apache Cassandra-compatible',
    useWhen:'Time-series data, IoT telemetry, high-write throughput at scale, Cassandra migrations.',
    notWhen:'Complex queries, joins, graph data, relational workloads.',
    features:['Cassandra-compatible CQL','Serverless — auto-scales capacity','Point-in-time recovery','Encryption at rest and in transit'],
    scaling:'Automatic serverless scaling',
    consistency:'Eventual or Local Quorum',tag:'Wide-Column',color:'#607d8b'
  },
  {
    name:'Amazon QLDB',icon:'📒',type:'Ledger Database',engine:'Proprietary',
    useWhen:'Cryptographically verifiable audit trail: financial transactions, supply chain, regulated data.',
    notWhen:'General purpose data storage, relational workloads, real-time analytics.',
    features:['Immutable, append-only journal','Cryptographic hash verification','SQL-like PartiQL interface','Serverless'],
    scaling:'Serverless — auto-scales',
    consistency:'Strong (serializable)',tag:'Ledger',color:'#ff5722'
  },
  {
    name:'Amazon Timestream',icon:'⏱️',type:'Time Series Database',engine:'Proprietary',
    useWhen:'IoT sensor data, operational metrics, application monitoring, DevOps time-series.',
    notWhen:'Relational/document data, random access patterns, non-time-ordered data.',
    features:['Automatically scales ingestion and storage','Built-in time series analytics functions','Tiered storage (memory + magnetic)','1000x faster than relational for time-series'],
    scaling:'Serverless auto-scaling',
    consistency:'Strong',tag:'Time-Series',color:'#009688'
  },
];

const STORAGE_TYPES = [
  {
    name:'Amazon S3',icon:'🪣',type:'Object Storage',
    useWhen:'Storing any amount of unstructured data: images, videos, backups, logs, static websites, data lakes.',
    notWhen:'Low-latency block storage for OS/databases, shared file systems, frequently modified files.',
    features:['11 nines durability (99.999999999%)','Virtually unlimited storage','Versioning, lifecycle rules, replication','Event notifications to Lambda/SQS/SNS'],
    classes:['S3 Standard — frequent access','S3 Standard-IA — infrequent, rapid retrieval','S3 Glacier Instant — archive, ms retrieval','S3 Glacier Flexible — archive, mins-hours','S3 Glacier Deep Archive — lowest cost, 12hr retrieval','S3 Intelligent-Tiering — auto-moves between tiers'],
    icon2:'🪣',color:'#ff9900'
  },
  {
    name:'Amazon EBS',icon:'💾',type:'Block Storage',
    useWhen:'OS boot volumes, relational databases, high-performance apps needing low-latency block I/O.',
    notWhen:'Sharing storage between multiple instances simultaneously, object/file storage, massive scale.',
    features:['Attached to one EC2 instance at a time','Persists independently of EC2 lifecycle','Snapshots stored in S3','Multi-Attach (io1/io2) for limited sharing'],
    classes:['gp3/gp2 — General Purpose SSD (most workloads)','io2/io1 — Provisioned IOPS SSD (databases)','st1 — Throughput Optimized HDD (big data, logs)','sc1 — Cold HDD (lowest cost, infrequent access)'],
    icon2:'💾',color:'#2196f3'
  },
  {
    name:'Amazon EFS',icon:'📁',type:'Shared File Storage (NFS)',
    useWhen:'Shared access needed by multiple EC2 instances simultaneously. CMS, dev environments, ML training data.',
    notWhen:'Windows workloads (use FSx), single-instance high-IOPS (use EBS), object storage (use S3).',
    features:['Mount from multiple EC2 instances concurrently','Elastic — grows/shrinks automatically','Cross-AZ access','POSIX-compliant NFS'],
    classes:['Standard — frequently accessed','Standard-IA — infrequent access','One Zone — single AZ, lower cost'],
    icon2:'📁',color:'#4caf50'
  },
  {
    name:'Amazon FSx for Windows',icon:'🪟',type:'Managed Windows File Server',
    useWhen:'Windows workloads needing SMB protocol, Active Directory integration, NTFS file systems.',
    notWhen:'Linux workloads, object storage, high-performance compute (use FSx for Lustre).',
    features:['Native Windows SMB protocol','Active Directory integration','DFS namespaces support','Automatic daily backups'],
    classes:['SSD — high IOPS applications','HDD — broad set of workloads'],
    icon2:'🪟',color:'#0078d4'
  },
  {
    name:'Amazon FSx for Lustre',icon:'⚙️',type:'High-Performance File System',
    useWhen:'HPC, ML training, video rendering, financial simulations needing 100+ GB/s throughput.',
    notWhen:'General file sharing, Windows workloads, backup/archive, infrequent access.',
    features:['Integrates with S3 — reads/writes directly','Hundreds of GB/s throughput','Sub-millisecond latency','POSIX-compliant'],
    classes:['Scratch — temporary, highest performance','Persistent — longer-term, replication within AZ'],
    icon2:'⚙️',color:'#ff5722'
  },
  {
    name:'AWS Storage Gateway',icon:'🔌',type:'Hybrid Cloud Storage',
    useWhen:'Connecting on-premises to AWS storage. Extend data centre with cloud, backup to S3, file shares.',
    notWhen:'Pure cloud-native workloads, serverless apps, object-only storage without on-prem.',
    features:['File Gateway — NFS/SMB files backed by S3','Volume Gateway — iSCSI block storage with S3 backup','Tape Gateway — virtual tape library to S3/Glacier','Low latency local cache'],
    classes:['File Gateway','Volume Gateway (Stored/Cached)','Tape Gateway'],
    icon2:'🔌',color:'#607d8b'
  },
  {
    name:'AWS Snow Family',icon:'❄️',type:'Physical Data Transfer',
    useWhen:'Migrating large datasets (TBs-PBs) where network transfer is too slow or costly. Edge computing.',
    notWhen:'Small datasets easily transferred via internet, pure cloud workloads, ongoing sync.',
    features:['Snowcone — 8TB, smallest, portable','Snowball Edge — 80TB, storage & compute','Snowmobile — 100PB, truck-based migration','OpsHub management software'],
    classes:['Snowcone (8-14TB)','Snowball Edge Storage Optimized (80TB)','Snowball Edge Compute Optimized','Snowmobile (100PB)'],
    icon2:'❄️',color:'#00bcd4'
  },
  {
    name:'Amazon S3 Glacier',icon:'🧊',type:'Archive Storage',
    useWhen:'Long-term archival of rarely accessed data for compliance: backups, media archives, regulatory data.',
    notWhen:'Frequent access, low-latency retrieval needs, active data processing.',
    features:['Instant Retrieval — ms access, 68% cheaper than S3 Standard','Flexible Retrieval — mins to hours retrieval','Deep Archive — 12hr retrieval, cheapest','Vault Lock for WORM compliance'],
    classes:['Glacier Instant Retrieval','Glacier Flexible Retrieval','Glacier Deep Archive'],
    icon2:'🧊',color:'#455a64'
  },
];

const IAM_CONCEPTS = [
  {name:'IAM User',icon:'👤',desc:'An identity representing a person or application with permanent long-term credentials (username + password or access keys).',bestPractice:'Use IAM Users only when necessary. Prefer roles for applications. Enable MFA for all users. Never share credentials.',exam:'Do NOT use root account for daily tasks. Create individual IAM users.'},
  {name:'IAM Group',icon:'👥',desc:'A collection of IAM users. Policies attached to a group apply to all members. Users can belong to multiple groups.',bestPractice:'Organise users into groups (Developers, Admins, ReadOnly). Attach policies to groups, not individual users.',exam:'Groups cannot contain other groups. Groups are not identities and cannot be assumed like roles.'},
  {name:'IAM Role',icon:'🎭',desc:'An identity with temporary credentials that can be assumed by AWS services, users, or external identities. No permanent credentials stored.',bestPractice:'Use roles for EC2/Lambda instead of access keys. Use cross-account roles for account access. Use service-linked roles for AWS services.',exam:'Roles provide STS temporary credentials. EC2 instance profiles attach a role to an EC2 instance.'},
  {name:'IAM Policy',icon:'📜',desc:'A JSON document defining permissions. Can Allow or Deny actions on resources. Evaluation: explicit Deny > explicit Allow > implicit Deny.',bestPractice:'Use AWS managed policies as a starting point. Create customer managed policies for fine-grained control. Apply principle of least privilege.',exam:'Policy types: Identity-based, Resource-based, SCP, Permission boundary, Session policy. Explicit deny always wins.'},
  {name:'Permission Boundary',icon:'🚧',desc:'An IAM managed policy that sets the maximum permissions an IAM entity (user or role) can have, regardless of other policies attached.',bestPractice:'Use to delegate permissions safely. A boundary caps what an admin can grant to new roles/users they create.',exam:'Permission boundaries do NOT grant permissions — they only limit them. Must be set explicitly.'},
  {name:'STS (Security Token Service)',icon:'🎟️',desc:'Generates temporary security credentials (access key, secret, session token) for roles and federated users. Default token duration: 1 hour.',bestPractice:'Use AssumeRole for cross-account access. Use AssumeRoleWithWebIdentity for web/mobile apps. Always use shortest duration needed.',exam:'AssumeRole, AssumeRoleWithSAML, AssumeRoleWithWebIdentity, GetSessionToken, GetFederationToken are key STS APIs.'},
  {name:'IAM Identity Center',icon:'🔐',desc:'Centrally manage SSO access to multiple AWS accounts and business applications. Replaces older AWS SSO. Integrates with Active Directory.',bestPractice:'Use for multi-account SSO. Assign permission sets to users/groups from your identity source (AD, Okta, etc.).',exam:'Preferred way to manage human access to AWS accounts in an Organization. Works with SAML 2.0 identity providers.'},
  {name:'AWS Organizations SCP',icon:'🏢',desc:'Service Control Policies — guardrails applied at the OU or account level that restrict maximum permissions available to all principals in that scope.',bestPractice:'Use SCPs to enforce compliance: prevent disabling CloudTrail, restrict regions, require encryption tags.',exam:'SCPs do NOT grant permissions — they only restrict. Even the root user of an account is subject to SCPs.'},
];

const SHARED_RESPONSIBILITY = {
  aws: {
    label:'AWS — Security OF the cloud',
    color:'#2196f3',
    items:[
      {cat:'Physical',desc:'Data centres, buildings, servers, network hardware, power, cooling, physical security'},
      {cat:'Network Infrastructure',desc:'Global backbone, edge locations, physical network equipment and fibre'},
      {cat:'Hypervisor / Virtualisation',desc:'Host OS, virtualisation layer separating customer instances from each other'},
      {cat:'Managed Service Infrastructure',desc:'For managed services (RDS, S3, Lambda, DynamoDB), AWS manages the underlying OS, runtime, patching, and availability'},
      {cat:'Availability Zones & Regions',desc:'Geographic infrastructure design, AZ isolation, and regional fault tolerance'},
      {cat:'Compliance Certifications',desc:'SOC 1/2/3, ISO 27001, PCI DSS, HIPAA, FedRAMP — AWS maintains and publishes these'},
    ]
  },
  customer: {
    label:'Customer — Security IN the cloud',
    color:'#ff9900',
    items:[
      {cat:'Data',desc:'Classification, encryption at rest and in transit, backup and recovery strategy — entirely customer responsibility'},
      {cat:'Identity & Access',desc:'IAM users, roles, policies, MFA enforcement, credential rotation, federation configuration'},
      {cat:'Application Security',desc:'Application code vulnerabilities, library patches, OWASP risks, API security'},
      {cat:'OS & Runtime',desc:'For IaaS (EC2): guest OS patching, runtime configuration, firewall rules (Security Groups, NACLs)'},
      {cat:'Network Configuration',desc:'VPC design, subnets, route tables, Security Groups, NACLs, VPN/Direct Connect configuration'},
      {cat:'Platform & Middleware',desc:'Database configuration, web server setup, application frameworks — for IaaS/PaaS services'},
    ]
  },
  shared: {
    label:'Shared Responsibility',
    color:'#4caf50',
    items:[
      {cat:'Patch Management',desc:'AWS patches managed service infrastructure. Customer patches EC2 OS and applications.'},
      {cat:'Configuration Management',desc:'AWS configures its infrastructure. Customer configures their OS, databases, and applications.'},
      {cat:'Awareness & Training',desc:'AWS trains its employees. Customer trains their employees and enforces security policies.'},
      {cat:'Encryption',desc:'AWS provides encryption tools (KMS, TLS). Customer decides what to encrypt and manages key policies.'},
    ]
  }
};

// ── Game answer history tracking ──
const gameHistory = [];
function recordGameAnswer(mode, question, userAns, correctAns, wasCorrect) {
  gameHistory.push({ mode, question, userAns, correctAns, wasCorrect, ts: Date.now() });
  if(gameHistory.length > 200) gameHistory.shift();
}
function showGameHistory() {
  const area = document.getElementById('game-area');
  
  // Filter history based on current exam
  let filteredHistory = gameHistory;
  let backFunction = 'renderGameMenu()';
  if (currentExam === 'tf-games') {
    filteredHistory = gameHistory.filter(r => r.mode.startsWith('TF '));
    backFunction = 'renderTerraformMenu()';
  } else if (currentExam === 'k8s-games') {
    filteredHistory = gameHistory.filter(r => r.mode.startsWith('K8s '));
    backFunction = 'renderK8sMenu()';
  } else if (currentExam === 'ref') {
    // For ref, show AWS games but not TF or K8s
    filteredHistory = gameHistory.filter(r => !r.mode.startsWith('TF ') && !r.mode.startsWith('K8s '));
    backFunction = 'renderRefMenu()';
  } else {
    // For 'game' and others, show AWS games
    filteredHistory = gameHistory.filter(r => !r.mode.startsWith('TF ') && !r.mode.startsWith('K8s '));
    backFunction = 'renderGameMenu()';
  }
  
  const recent = [...filteredHistory].reverse().slice(0, 50);
  if(!recent.length){
    area.innerHTML=`<button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="${backFunction}">← Menu</button><div class="empty"><div class="empty-icon">📋</div>No game answers recorded yet.<br>Play any game to start building your history.</div>`;
    return;
  }
  const wrong = recent.filter(r=>!r.wasCorrect);
  area.innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="${backFunction}">← Menu</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div style="font-size:15px;font-weight:600">Answer History</div>
      <div style="display:flex;gap:6px">
        <span class="game-score-pill" style="background:var(--pass-dim);color:var(--pass)">✓ ${recent.filter(r=>r.wasCorrect).length}</span>
        <span class="game-score-pill" style="background:var(--fail-dim);color:var(--fail)">✗ ${wrong.length}</span>
      </div>
    </div>
    ${wrong.length?`<div class="card" style="padding:10px;margin-bottom:10px;background:var(--fail-dim);border-color:var(--fail)"><div style="font-size:11px;font-weight:600;color:var(--fail);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Review your mistakes (${wrong.length})</div>${wrong.slice(0,5).map(r=>`<div style="font-size:12px;padding:5px 0;border-bottom:1px solid var(--border);color:var(--text2)"><span style="color:var(--fail)">✗</span> ${r.question.length>70?r.question.slice(0,70)+'…':r.question}<br><span style="color:var(--pass);font-size:11px">✓ ${r.correctAns}</span></div>`).join('')}</div>`:''}
    <div class="card" style="padding:0;overflow:hidden">
      ${recent.map(r=>`<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-bottom:1px solid var(--border)">
        <span style="font-size:16px;flex-shrink:0;margin-top:1px">${r.wasCorrect?'✅':'❌'}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.question}</div>
          <div style="font-size:11px;color:var(--text2);margin-top:2px">${r.wasCorrect?'<span style="color:var(--pass)">✓ '+r.correctAns+'</span>':'<span style="color:var(--fail)">✗ '+r.userAns+'</span> → <span style="color:var(--pass)">'+r.correctAns+'</span>'}</div>
          <div style="font-size:10px;color:var(--text3);margin-top:2px;font-family:\'IBM Plex Mono\',monospace">${r.mode} · ${new Date(r.ts).toLocaleTimeString()}</div>
        </div>
      </div>`).join('')}
    </div>`;
}

function getFilteredGameHistory() {
  if (currentExam === 'tf-games') {
    return gameHistory.filter(r => r.mode.startsWith('TF '));
  } else if (currentExam === 'k8s-games') {
    return gameHistory.filter(r => r.mode.startsWith('K8s '));
  } else {
    // For 'game', 'ref', and others, show AWS games
    return gameHistory.filter(r => !r.mode.startsWith('TF ') && !r.mode.startsWith('K8s '));
  }
}

function renderGameMenu(){
  try{gameState.quizBest=parseInt(localStorage.getItem('awsgame_best'))||0;}catch(e){}
  const filteredHistory = getFilteredGameHistory();
  const histCount = filteredHistory.length;
  const histWrong = filteredHistory.filter(r=>!r.wasCorrect).length;
  document.getElementById('game-area').innerHTML=`
    <div class="card" style="text-align:center;padding:12px 16px 10px">
      <div style="font-size:28px;margin-bottom:3px">🎮</div>
      <div style="font-size:17px;font-weight:600;margin-bottom:2px">AWS Games</div>
      <div style="font-size:12px;color:var(--text2)">CCP · SAA · DVA · Support Plans · Architecture</div>
      <div style="display:flex;gap:6px;justify-content:center;margin-top:6px;flex-wrap:wrap">
        ${gameState.quizBest>0?`<span class="badge b-game">🏆 Best streak: ${gameState.quizBest}</span>`:''}
        ${histCount>0?`<span class="badge b-neutral" style="cursor:pointer" onclick="showGameHistory()">📋 ${histCount} answers · ${histWrong} wrong</span>`:''}
      </div>
    </div>

    <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
      <button class="btn btn-ref" style="font-size:12px;padding:6px 14px" onclick="switchExam('ref')">📚 References →</button>
    </div>

    <div class="section-title" style="padding:0 2px;margin-top:12px">Story &amp; scenario</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="startGame('scenario')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">🏗️</div><div class="gm-name">Build the Architecture</div><div class="gm-desc">Pick the right service for each layer of a scenario.</div></div>
      <div class="game-mode-btn" onclick="startGame('wa')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">SAA</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">🏛️</div><div class="gm-name">Well-Architected</div><div class="gm-desc">Match services and principles to the 6 pillars.</div></div>
      <div class="game-mode-btn" onclick="startGame('elimination')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">🔀</div><div class="gm-name">Elimination Round</div><div class="gm-desc">Tap to eliminate wrong services one by one. Process of elimination — just like the exam.</div></div>
      <div class="game-mode-btn" onclick="startGame('wahard')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">SAA</span><span style="background:#fff3e0;color:#e65100">Hard</span></div><div class="gm-icon">🏛️</div><div class="gm-name">Well-Architected: Hard</div><div class="gm-desc">Scenario-based pillar reasoning — which principle is violated and why?</div></div>
      <div class="game-mode-btn" onclick="startGame('chain')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA</span><span style="background:#fff3e0;color:#e65100">Hard</span></div><div class="gm-icon">📋</div><div class="gm-name">Scenario Chain</div><div class="gm-desc">A company evolves across 5 connected questions — startup to enterprise. Architecture decisions compound.</div></div>
    </div>

    <div class="section-title" style="padding:0 2px">Service knowledge</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="startGame('quiz')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA · DVA</span><span style="background:#f3e5f5;color:#6a1b9a">Easy</span></div><div class="gm-icon">⚡</div><div class="gm-name">Service Quiz</div><div class="gm-desc">Identify services from descriptions. Build your streak!</div></div>
      <div class="game-mode-btn" onclick="startGame('flash')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA · DVA</span><span style="background:#f3e5f5;color:#6a1b9a">Easy</span></div><div class="gm-icon">🃏</div><div class="gm-name">Flashcards</div><div class="gm-desc">Flip cards for CCP, SAA, DVA or Support tiers.</div></div>
      <div class="game-mode-btn" onclick="startGame('match')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA</span><span style="background:#f3e5f5;color:#6a1b9a">Easy</span></div><div class="gm-icon">🔗</div><div class="gm-name">Match-Up</div><div class="gm-desc">Pair service names to descriptions. Beat the clock.</div></div>
      <div class="game-mode-btn" onclick="startGame('truthy')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">✅</div><div class="gm-name">True or False</div><div class="gm-desc">65 statements — CCP, SAA and Support plans.</div></div>
      <div class="game-mode-btn" onclick="startGame('speed')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">🏎️</div><div class="gm-name">Speed Round</div><div class="gm-desc">3 lives, 8 seconds per question. How far can you go?</div></div>
    </div>

    <div class="section-title" style="padding:0 2px">Topic deep dives</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="startGame('srmquiz')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP</span><span style="background:#f3e5f5;color:#6a1b9a">Easy</span></div><div class="gm-icon">🤝</div><div class="gm-name">Shared Responsibility</div><div class="gm-desc">AWS or customer? Test who owns each security task.</div></div>
      <div class="game-mode-btn" onclick="startGame('globalinfra')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP</span><span style="background:#f3e5f5;color:#6a1b9a">Easy</span></div><div class="gm-icon">🌍</div><div class="gm-name">Global Infrastructure</div><div class="gm-desc">Regions, AZs, Edge Locations, Local Zones — global vs regional services.</div></div>
      <div class="game-mode-btn" onclick="startGame('economics')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP</span><span style="background:#f3e5f5;color:#6a1b9a">Easy</span></div><div class="gm-icon">🧩</div><div class="gm-name">Cloud Economics</div><div class="gm-desc">CapEx or OpEx? Economies of scale? Classify each statement — 5 seconds per round!</div></div>
      <div class="game-mode-btn" onclick="startGame('storagequiz')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">💾</div><div class="gm-name">Storage Chooser</div><div class="gm-desc">S3, EBS, EFS, Glacier — when to use which?</div></div>
      <div class="game-mode-btn" onclick="startGame('dbquiz')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA · DVA</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">🗄️</div><div class="gm-name">Database Chooser</div><div class="gm-desc">Which DB fits the scenario? RDS, DynamoDB, Neptune...</div></div>
      <div class="game-mode-btn" onclick="startGame('iamquiz')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA · DVA</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">🔑</div><div class="gm-name">IAM Challenge</div><div class="gm-desc">Users, roles, policies, SCPs — test your IAM knowledge.</div></div>
      <div class="game-mode-btn" onclick="startGame('monitoring')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA · DVA</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">📊</div><div class="gm-name">Monitoring Matchup</div><div class="gm-desc">CloudWatch vs CloudTrail vs X-Ray vs GuardDuty — pick the right observability tool.</div></div>
      <div class="game-mode-btn" onclick="startGame('containers')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">SAA · DVA</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">🔁</div><div class="gm-name">Container Showdown</div><div class="gm-desc">ECS vs EKS vs Fargate vs Lambda vs Beanstalk — pick the right compute for each workload.</div></div>
      <div class="game-mode-btn" onclick="startGame('integration')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">SAA · DVA</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">⚡</div><div class="gm-name">Integration Patterns</div><div class="gm-desc">SQS vs SNS vs EventBridge vs Step Functions — two-step: pick service then pick pattern.</div></div>
    </div>

    <div class="section-title" style="padding:0 2px">Exam pressure 🔥</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="startGame('support')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div><div class="gm-icon">🎧</div><div class="gm-name">Support Plans Quiz</div><div class="gm-desc">Response times, TAMs, features across all 5 tiers.</div></div>
      <div class="game-mode-btn" onclick="startGame('pricing')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA</span><span style="background:#fff3e0;color:#e65100">Hard</span></div><div class="gm-icon">💰</div><div class="gm-name">Pricing Showdown</div><div class="gm-desc">On-Demand vs RI vs Spot vs Savings Plans — pick the cheapest option for each scenario.</div></div>
      <div class="game-mode-btn" onclick="startGame('migration')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA</span><span style="background:#fff3e0;color:#e65100">Hard</span></div><div class="gm-icon">🚚</div><div class="gm-name">Migration 6 Rs</div><div class="gm-desc">Classify each migration as Rehost, Replatform, Repurchase, Re-architect, Retire, or Retain.</div></div>
      <div class="game-mode-btn" onclick="startGame('dr')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">SAA</span><span style="background:#fff3e0;color:#e65100">Hard</span></div><div class="gm-icon">🛡️</div><div class="gm-name">DR Strategies</div><div class="gm-desc">Backup & Restore, Pilot Light, Warm Standby, or Active/Active — match RTO/RPO to strategy.</div></div>
      <div class="game-mode-btn" onclick="startGame('security')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP · SAA · DVA</span><span style="background:#fff3e0;color:#e65100">Hard</span></div><div class="gm-icon">🔐</div><div class="gm-name">Security Gauntlet</div><div class="gm-desc">IAM evaluation, GuardDuty vs Macie, SCPs, Object Lock — tricky security scenarios.</div></div>
      <div class="game-mode-btn" onclick="startGame('network')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">SAA · DVA</span><span style="background:#fff3e0;color:#e65100">Hard</span></div><div class="gm-icon">🌐</div><div class="gm-name">Network & VPC</div><div class="gm-desc">IGW vs NAT, SGs vs NACLs, VPC Endpoints, peering, Transit Gateway, Direct Connect.</div></div>
      <div class="game-mode-btn" onclick="startGame('beatclock')"><div class="gm-tag"><span style="background:var(--game-dim,#e3f2fd);color:var(--game)">CCP</span><span style="background:#fff3e0;color:#e65100">Hard</span></div><div class="gm-icon">🏁</div><div class="gm-name">Beat the Clock</div><div class="gm-desc">10s per question, 3 lives. Hard CCP questions only — exam pressure simulator.</div></div>
    </div>

    ${histCount>0?`<div class="section-title" style="padding:0 2px">Recent performance</div>
    <div class="card" style="padding:10px;margin-bottom:12px;cursor:pointer" onclick="showGameHistory()">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:13px;font-weight:500">📋 Answer History</div>
        <div style="display:flex;gap:6px"><span class="game-score-pill" style="background:var(--pass-dim);color:var(--pass)">✓ ${histCount-histWrong}</span><span class="game-score-pill" style="background:var(--fail-dim);color:var(--fail)">✗ ${histWrong}</span></div>
      </div>
      <div style="font-size:12px;color:var(--text2);margin-top:4px">Tap to review your recent answers and mistakes</div>
    </div>`:''}
`;
}


function renderRefMenu(){
  const filteredHistory = getFilteredGameHistory();
  const histCount = filteredHistory.length;
  const histWrong = filteredHistory.filter(r=>!r.wasCorrect).length;
  document.getElementById('game-area').innerHTML=`
    <div class="card" style="text-align:center;padding:12px 16px 10px">
      <div style="font-size:28px;margin-bottom:3px">📚</div>
      <div style="font-size:17px;font-weight:600;margin-bottom:2px">AWS References</div>
      <div style="font-size:12px;color:var(--text2)">Reference guides &amp; Support plans</div>
    </div>

    <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
      <button class="btn btn-game" style="font-size:12px;padding:6px 14px" onclick="switchExam('game')">🎮 Games →</button>
    </div>

    <div class="section-title" style="padding:0 2px">Reference guides</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="showDbReference()"><div class="gm-icon">🗄️</div><div class="gm-name">Databases</div><div class="gm-desc">10 DB types — when to use each one.</div></div>
      <div class="game-mode-btn" onclick="showStorageReference()"><div class="gm-icon">💾</div><div class="gm-name">Storage</div><div class="gm-desc">S3, EBS, EFS, Glacier, Snow Family and more.</div></div>
      <div class="game-mode-btn" onclick="showIAMReference()"><div class="gm-icon">🔑</div><div class="gm-name">IAM Deep Dive</div><div class="gm-desc">Users, groups, roles, policies, SCPs explained.</div></div>
      <div class="game-mode-btn" onclick="showSRMReference()"><div class="gm-icon">🤝</div><div class="gm-name">Shared Responsibility</div><div class="gm-desc">AWS vs customer — who owns what?</div></div>
    </div>

    <div class="section-title" style="padding:0 2px">Hard topic references 🔥</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="showNetworkReference()" style="border-color:var(--fail)"><div class="gm-icon">🌐</div><div class="gm-name">VPC & Networking</div><div class="gm-desc">IGW, NAT, SGs, NACLs, endpoints, peering, Transit Gateway, Direct Connect.</div></div>
      <div class="game-mode-btn" onclick="showPricingReference()" style="border-color:var(--fail)"><div class="gm-icon">💰</div><div class="gm-name">Pricing Models</div><div class="gm-desc">On-Demand, RI, Spot, Savings Plans, Dedicated — when to use each.</div></div>
      <div class="game-mode-btn" onclick="showMigrationReference()" style="border-color:var(--fail)"><div class="gm-icon">🚚</div><div class="gm-name">Migration 6 Rs</div><div class="gm-desc">Rehost, Replatform, Repurchase, Re-architect, Retire, Retain — with examples.</div></div>
      <div class="game-mode-btn" onclick="showDRReference()" style="border-color:var(--fail)"><div class="gm-icon">🛡️</div><div class="gm-name">DR Strategies</div><div class="gm-desc">Backup & Restore → Pilot Light → Warm Standby → Active/Active. Cost vs RTO/RPO.</div></div>
      <div class="game-mode-btn" onclick="showMonitoringReference()"><div class="gm-icon">📊</div><div class="gm-name">Monitoring & Observability</div><div class="gm-desc">CloudWatch, CloudTrail, X-Ray, Config, GuardDuty, Inspector — when to use which.</div></div>
      <div class="game-mode-btn" onclick="showGlobalInfraReference()"><div class="gm-icon">🌍</div><div class="gm-name">Global Infrastructure</div><div class="gm-desc">Regions, AZs, Edge Locations, Local Zones, Wavelength — global vs regional services.</div></div>
      <div class="game-mode-btn" onclick="showContainersReference()"><div class="gm-icon">🔁</div><div class="gm-name">Containers & Compute</div><div class="gm-desc">ECS, EKS, Fargate, Lambda, Beanstalk — side-by-side comparison.</div></div>
    </div>

    <div class="section-title" style="padding:0 2px">Support plans reference</div>
    <div class="card" style="padding:0;overflow:hidden">
      ${SUPPORT_PLANS.map(p=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--border);cursor:pointer" onclick="showSupportDetail('${p.name}')">
        <div style="font-size:22px">${p.icon}</div>
        <div style="flex:1"><div style="font-weight:600;font-size:13px">${p.name}</div><div style="font-size:11px;color:var(--text2)">${p.price}</div></div>
        <div style="font-size:11px;color:var(--text3);font-family:'IBM Plex Mono',monospace">${p.response.biz_critical!=='N/A'?p.response.biz_critical+' critical':'No tech support'}</div>
        <div style="color:var(--text3)">›</div>
      </div>`).join('')}
    </div>

    ${histCount>0?`<div class="section-title" style="padding:0 2px;margin-top:12px">Recent performance</div>
    <div class="card" style="padding:10px;margin-bottom:12px;cursor:pointer" onclick="showGameHistory()">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:13px;font-weight:500">📋 Answer History</div>
        <div style="display:flex;gap:6px"><span class="game-score-pill" style="background:var(--pass-dim);color:var(--pass)">✓ ${histCount-histWrong}</span><span class="game-score-pill" style="background:var(--fail-dim);color:var(--fail)">✗ ${histWrong}</span></div>
      </div>
      <div style="font-size:12px;color:var(--text2);margin-top:4px">Tap to review your recent answers and mistakes</div>
    </div>`:''}
  `;
}

function showSupportDetail(name){
  const p=SUPPORT_PLANS.find(x=>x.name===name); if(!p)return;
  const rows=[['General guidance',p.response.general],['System impaired',p.response.sys_impaired],['Production impaired',p.response.prod_impaired],['Production down',p.response.prod_down],['Business critical',p.response.biz_critical]];
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div class="game-card" style="text-align:left;padding:16px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="font-size:32px">${p.icon}</div><div><div style="font-size:18px;font-weight:600">${p.name} Support</div><div style="font-size:12px;color:var(--text2)">${p.price}</div></div></div>
      <div class="section-title">Response time SLAs</div>
      ${rows.map(([label,val])=>`<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--text2)">${label}</span><span style="font-weight:500;font-family:'IBM Plex Mono',monospace;color:${val==='N/A'?'var(--text3)':'var(--text)'}">${val}</span></div>`).join('')}
      <div class="section-title" style="margin-top:12px">Key features</div>
      ${p.features.map(f=>`<div style="font-size:13px;padding:3px 0;display:flex;gap:6px"><span style="color:var(--pass)">✓</span>${f}</div>`).join('')}
      <div class="section-title" style="margin-top:10px">Access</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <span class="badge ${p.tam?'b-pass':'b-neutral'}">${p.tam?'✓':'✗'} Dedicated TAM</span>
        <span class="badge ${p.concierge?'b-pass':'b-neutral'}">${p.concierge?'✓':'✗'} Concierge Team</span>
      </div>
    </div>
    <button class="btn btn-ref" style="width:100%;margin-top:10px" onclick="startGame('support')">Quiz me on Support Plans →</button>`;
}

function startGame(mode){
  gameState.mode=mode;
  if(mode==='quiz') showQuizFilter();
  else if(mode==='flash') showFlashFilter();
  else if(mode==='match') startMatchGame();
  else if(mode==='truthy') startTruthyGame();
  else if(mode==='scenario') startScenarioGame();
  else if(mode==='support') startSupportGame();
  else if(mode==='wa') startWAGame();
  else if(mode==='speed') startSpeedGame();
  else if(mode==='dbquiz') startDbQuiz();
  else if(mode==='storagequiz') startStorageQuiz();
  else if(mode==='iamquiz') startIAMQuiz();
  else if(mode==='srmquiz') startSRMQuiz();
  else if(mode==='pricing') startPricingGame();
  else if(mode==='migration') renderMigrationExplainer();
  else if(mode==='security') startSecurityGame();
  else if(mode==='dr') renderDRExplainer();
  else if(mode==='network') startNetworkGame();
  else if(mode==='wahard') startWAHardGame();
  else if(mode==='beatclock') startBeatClockGame();
  else if(mode==='monitoring') startMonitoringGame();
  else if(mode==='globalinfra') startGlobalInfraGame();
  else if(mode==='containers') startContainersGame();
  else if(mode==='economics') startEconomicsGame();
  else if(mode==='elimination') startEliminationGame();
  else if(mode==='integration') startIntegrationGame();
  else if(mode==='chain') startChainGame();
}

function showQuizFilter(){
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderGameMenu()">← Menu</button>
    <div class="card" style="text-align:center;padding:16px">
      <div style="font-size:24px;margin-bottom:6px">⚡</div>
      <div style="font-size:15px;font-weight:600;margin-bottom:12px">Service Quiz — Choose Level</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-ghost" style="padding:12px;text-align:left" onclick="launchQuiz('ccp')">☁️ <strong>CCP</strong> — Cloud Practitioner services only</button>
        <button class="btn btn-ghost" style="padding:12px;text-align:left" onclick="launchQuiz('saa')">🏗️ <strong>SAA</strong> — Solutions Architect services only</button>
        <button class="btn btn-ghost" style="padding:12px;text-align:left" onclick="launchQuiz('dva')">⚙️ <strong>DVA</strong> — Developer Associate services only</button>
        <button class="btn btn-ghost" style="padding:12px;text-align:left" onclick="launchQuiz('all')">🔀 <strong>All</strong> — CCP + SAA + DVA combined</button>
      </div>
    </div>`;
}

function showFlashFilter(){
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderGameMenu()">← Menu</button>
    <div class="card" style="text-align:center;padding:16px">
      <div style="font-size:24px;margin-bottom:6px">🃏</div>
      <div style="font-size:15px;font-weight:600;margin-bottom:12px">Flashcards — Choose Deck</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-ghost" style="padding:12px;text-align:left" onclick="launchFlash('ccp')">☁️ <strong>CCP</strong> services (49 cards)</button>
        <button class="btn btn-ghost" style="padding:12px;text-align:left" onclick="launchFlash('saa')">🏗️ <strong>SAA</strong> services (21 cards)</button>
        <button class="btn btn-ghost" style="padding:12px;text-align:left" onclick="launchFlash('dva')">⚙️ <strong>DVA</strong> services (8 cards)</button>
        <button class="btn btn-ghost" style="padding:12px;text-align:left" onclick="launchFlash('support')">🎧 <strong>Support Plans</strong> (5 cards)</button>
        <button class="btn btn-ghost" style="padding:12px;text-align:left" onclick="launchFlash('all')">🔀 <strong>Everything</strong> combined (83 cards)</button>
      </div>
    </div>`;
}

function launchQuiz(filter){
  const pool=filter==='all'?AWS_SERVICES:AWS_SERVICES.filter(s=>s.level===filter);
  gameState.quizQ=[...pool].sort(()=>Math.random()-.5); gameState.quizFilter=filter;
  gameState.quizIdx=0;gameState.quizScore=0;gameState.quizStreak=0;gameState.quizAnswered=false;
  renderQuizQ();
}

function renderQuizQ(){
  const g=gameState;
  if(g.quizIdx>=g.quizQ.length){renderQuizEnd();return;}
  const svc=g.quizQ[g.quizIdx];
  const pool=g.quizFilter==='all'?AWS_SERVICES:AWS_SERVICES.filter(s=>s.level===g.quizFilter);
  const others=pool.filter(s=>s.name!==svc.name).sort(()=>Math.random()-.5).slice(0,3);
  const allOpts=[svc,...others].sort(()=>Math.random()-.5);
  g.quizShuffled=allOpts;
  const correctPos=allOpts.findIndex(s=>s.name===svc.name);
  g._quizCorrect=correctPos;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:5px">
        <span class="game-score-pill" style="background:var(--game-dim);color:var(--game)">🔥 ${g.quizStreak}</span>
        <span class="game-score-pill" style="background:var(--surface2);color:var(--text2)">${g.quizIdx+1}/${g.quizQ.length}</span>
      </div>
    </div>
    <div class="game-card">
      <div class="game-icon">${svc.icon}</div>
      <div style="font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:6px;font-family:'IBM Plex Mono',monospace">${svc.category} · ${svc.level.toUpperCase()}</div>
      <div style="font-size:16px;font-weight:500;color:var(--text);line-height:1.45">"${svc.desc}"</div>
      <div style="font-size:12px;color:var(--text2);margin-top:8px">Which AWS service is this?</div>
    </div>
    <div id="quiz-opts">${allOpts.map((s,i)=>`<button class="game-opt" data-idx="${i}">${s.name}</button>`).join('')}</div>`;
  document.getElementById('quiz-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]'); if(!btn)return;
    chooseQuiz(parseInt(btn.dataset.idx));
  });
}

function chooseQuiz(chosen){
  if(gameState.quizAnswered)return; gameState.quizAnswered=true;
  const correct=gameState._quizCorrect;
  const isRight=chosen===correct;
  const svc=gameState.quizQ[gameState.quizIdx];
  const chosenName=gameState.quizShuffled[chosen]?.name||'';
  recordGameAnswer('Service Quiz',svc.desc,chosenName,svc.name,isRight);
  if(isRight){gameState.quizScore++;gameState.quizStreak++;if(gameState.quizStreak>gameState.quizBest){gameState.quizBest=gameState.quizStreak;try{localStorage.setItem('awsgame_best',gameState.quizBest);}catch(e){}}}else{gameState.quizStreak=0;}
  document.querySelectorAll('#quiz-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  setTimeout(()=>{gameState.quizIdx++;gameState.quizAnswered=false;renderQuizQ();},isRight?900:1600);
}

function renderQuizEnd(){
  const g=gameState,pct=Math.round(g.quizScore/g.quizQ.length*100);
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:48px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.quizScore} of ${g.quizQ.length} correct</div><div style="margin-top:8px"><span class="game-score-pill" style="background:var(--game-dim);color:var(--game)">🏆 Best: ${g.quizBest}</span></div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="showQuizFilter()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

function launchFlash(filter){
  let deck;
  if(filter==='support'){deck=SUPPORT_PLANS.map(p=>({name:p.name,icon:p.icon,desc:`${p.price} | Prod down: ${p.response.prod_down} | Business critical: ${p.response.biz_critical} | TAM: ${p.tam?'Dedicated':p.concierge?'Pool':'None'}`,category:'Support'}));}
  else{const pool=filter==='all'?AWS_SERVICES:AWS_SERVICES.filter(s=>s.level===filter);deck=[...pool];}
  deck=deck.sort(()=>Math.random()-.5);
  gameState.flashDeck=deck;gameState.flashIdx=0;gameState.flashFlipped=false;gameState.flashKnown=0;gameState.flashLearning=0;
  renderFlashCard();
}

function renderFlashCard(){
  const g=gameState;
  if(g.flashIdx>=g.flashDeck.length){renderFlashEnd();return;}
  const svc=g.flashDeck[g.flashIdx],rem=g.flashDeck.length-g.flashIdx;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="game-score-pill" style="background:var(--pass-dim);color:var(--pass)">✓ ${g.flashKnown}</span><span class="game-score-pill" style="background:var(--fail-dim);color:var(--fail)">↩ ${g.flashLearning}</span><span class="game-score-pill" style="background:var(--surface2);color:var(--text2)">${rem} left</span></div>
    </div>
    <div style="font-size:11px;color:var(--text3);text-align:center;margin-bottom:8px">Tap card to reveal</div>
    <div class="flip-card ${g.flashFlipped?'flipped':''}" id="flip-card" onclick="flipCard()">
      <div class="flip-inner">
        <div class="flip-front"><div style="font-size:36px;margin-bottom:10px">${svc.icon}</div><div style="font-size:18px;font-weight:600">${svc.name}</div><div class="flip-hint">tap to see description</div></div>
        <div class="flip-back"><div style="font-size:10px;color:var(--text3);margin-bottom:5px;text-transform:uppercase;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace">${svc.category||'AWS'}</div><div style="font-size:14px;font-weight:500;line-height:1.5;text-align:center">${svc.desc}</div><div class="flip-hint">tap to flip back</div></div>
      </div>
    </div>
    ${g.flashFlipped?`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px"><button class="btn" style="padding:12px;border-color:var(--fail);color:var(--fail);font-size:13px" onclick="flashAnswer(false)">↩ Still learning</button><button class="btn" style="padding:12px;border-color:var(--pass);color:var(--pass);font-size:13px" onclick="flashAnswer(true)">✓ Got it!</button></div>`:`<div style="height:54px"></div>`}`;
}

function flipCard(){gameState.flashFlipped=!gameState.flashFlipped;renderFlashCard();}
function flashAnswer(known){if(known){gameState.flashKnown++;gameState.flashIdx++;}else{gameState.flashLearning++;const s=gameState.flashDeck.splice(gameState.flashIdx,1)[0];gameState.flashDeck.push(s);}gameState.flashFlipped=false;if(gameState.flashIdx>=gameState.flashDeck.length)renderFlashEnd();else renderFlashCard();}
function renderFlashEnd(){const g=gameState;document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:40px;margin-bottom:8px">🃏</div><div style="font-size:20px;font-weight:600;margin-bottom:6px">Deck Complete!</div><div style="display:flex;gap:10px;justify-content:center;margin-top:10px;flex-wrap:wrap"><span class="game-score-pill" style="background:var(--pass-dim);color:var(--pass)">✓ Known: ${g.flashKnown}</span><span class="game-score-pill" style="background:var(--fail-dim);color:var(--fail)">↩ Learning: ${g.flashLearning}</span></div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="showFlashFilter()" style="flex:1">New Deck</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;}

function startMatchGame(){
  const pick=[...AWS_SERVICES].sort(()=>Math.random()-.5).slice(0,6);
  const all=[...pick.map(s=>({id:s.name,text:s.name,type:'name',pair:s.name})),...pick.map(s=>({id:'d-'+s.name,text:s.desc,type:'desc',pair:s.name}))].sort(()=>Math.random()-.5);
  gameState.matchPairs=all;gameState.matchSel=null;gameState.matchMatched=0;gameState.matchWrong=0;gameState.matchStart=Date.now();
  renderMatchGame();
}

function renderMatchGame(){
  const g=gameState;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="game-score-pill" style="background:var(--pass-dim);color:var(--pass)">${(g.matchMatched/2)|0}/6</span><span class="game-score-pill" style="background:var(--fail-dim);color:var(--fail)">✗ ${g.matchWrong}</span></div>
    </div>
    <div style="font-size:11px;color:var(--text3);text-align:center;margin-bottom:10px">Match each service to its description</div>
    <div class="match-grid" id="match-grid">
      ${g.matchPairs.map((t,i)=>`<div class="match-tile ${t._matched?'matched':''} ${g.matchSel&&g.matchSel.idx===i?'mt-sel':''}" id="mt-${i}" onclick="selectTile(${i})">${t.text}</div>`).join('')}
    </div>`;
  if(g.matchMatched===12)setTimeout(renderMatchEnd,400);
}

function selectTile(i){const g=gameState,tile=g.matchPairs[i];if(tile._matched)return;if(g.matchSel&&g.matchSel.idx===i){g.matchSel=null;renderMatchGame();return;}if(!g.matchSel){g.matchSel={idx:i,tile};renderMatchGame();return;}const prev=g.matchSel;g.matchSel=null;if(prev.tile.pair===tile.pair&&prev.tile.type!==tile.type){g.matchPairs[i]._matched=true;g.matchPairs[prev.idx]._matched=true;g.matchMatched+=2;renderMatchGame();}else{g.matchWrong++;renderMatchGame();const el1=document.getElementById('mt-'+i),el2=document.getElementById('mt-'+prev.idx);if(el1)el1.classList.add('mt-wrong');if(el2)el2.classList.add('mt-wrong');setTimeout(()=>renderMatchGame(),700);}}

function renderMatchEnd(){const g=gameState,secs=Math.round((Date.now()-g.matchStart)/1000),stars=g.matchWrong===0?'⭐⭐⭐':g.matchWrong<=3?'⭐⭐':'⭐';document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${stars}</div><div style="font-size:20px;font-weight:600;margin-bottom:4px">All Matched!</div><div style="font-size:13px;color:var(--text2)">${secs}s · ${g.matchWrong} mistakes</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('match')" style="flex:1">New Round</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;}

let truthyState={deck:[],idx:0,score:0,streak:0,answered:false};
function startTruthyGame(){truthyState.deck=[...TRUTHY_FACTS].sort(()=>Math.random()-.5);truthyState.idx=0;truthyState.score=0;truthyState.streak=0;truthyState.answered=false;renderTruthyQ();}

function renderTruthyQ(){
  const g=truthyState;if(g.idx>=g.deck.length){renderTruthyEnd();return;}
  const fact=g.deck[g.idx],svcInfo=AWS_SERVICES.find(s=>s.name===fact.svc)||{icon:'☁️',category:'AWS'};
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="game-score-pill" style="background:var(--game-dim);color:var(--game)">🔥 ${g.streak}</span><span class="game-score-pill" style="background:var(--surface2);color:var(--text2)">${g.idx+1}/${g.deck.length}</span></div>
    </div>
    <div class="game-card" style="min-height:160px">
      <div style="font-size:28px;margin-bottom:5px">${svcInfo.icon||'☁️'}</div>
      <div style="font-size:11px;font-weight:600;color:var(--game);margin-bottom:10px;font-family:'IBM Plex Mono',monospace">${fact.svc}</div>
      <div style="font-size:15px;font-weight:500;line-height:1.5;color:var(--text)">"${fact.stmt}"</div>
    </div>
    <div id="truthy-feedback" style="min-height:40px"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px" id="truthy-btns">
      <button class="btn" style="padding:14px;border-color:var(--pass);color:var(--pass);font-size:15px" onclick="answerTruthy(true)">✓ True</button>
      <button class="btn" style="padding:14px;border-color:var(--fail);color:var(--fail);font-size:15px" onclick="answerTruthy(false)">✗ False</button>
    </div>`;
}

function answerTruthy(ans){if(truthyState.answered)return;truthyState.answered=true;const g=truthyState,fact=g.deck[g.idx],right=ans===fact.ans;recordGameAnswer('True/False',fact.stmt,ans?'True':'False',fact.ans?'True':'False',right);if(right){g.score++;g.streak++;}else{g.streak=0;}document.getElementById('truthy-btns').innerHTML=`<button class="btn" style="padding:14px;border-color:var(--pass);color:var(--pass);font-size:15px;opacity:${fact.ans?1:.3}" disabled>✓ True</button><button class="btn" style="padding:14px;border-color:var(--fail);color:var(--fail);font-size:15px;opacity:${!fact.ans?1:.3}" disabled>✗ False</button>`;document.getElementById('truthy-feedback').innerHTML=`<div style="text-align:center;padding:8px;font-size:13px;font-weight:600;color:var(--${right?'pass':'fail'})">${right?'✓ Correct!':'✗ Wrong — it\'s '+(fact.ans?'True':'False')}</div>`;setTimeout(()=>{truthyState.idx++;truthyState.answered=false;renderTruthyQ();},right?900:1600);}
function renderTruthyEnd(){const g=truthyState,pct=Math.round(g.score/g.deck.length*100);document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:40px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('truthy')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;}

function startScenarioGame(){
  gameState.scenarioIdx=Math.floor(Math.random()*ARCH_SCENARIOS.length);
  gameState.scenarioSlot=0;gameState.scenarioAnswers=[];
  renderScenario();
}

function renderScenario(){
  const g=gameState,scen=ARCH_SCENARIOS[g.scenarioIdx],slot=scen.components[g.scenarioSlot];
  const allOpts=[slot.correct,...slot.options.filter(o=>o!==slot.correct).sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
  const correctPos=allOpts.indexOf(slot.correct);
  g._scenarioOpts=allOpts; g._scenarioCorrect=correctPos;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <span class="game-score-pill" style="background:var(--surface2);color:var(--text2)">${g.scenarioSlot+1}/${scen.components.length}</span>
    </div>
    <div class="card" style="padding:12px;margin-bottom:10px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:3px;font-family:'IBM Plex Mono',monospace">Scenario</div>
      <div style="font-size:14px;font-weight:600;margin-bottom:4px">${scen.title}</div>
      <div style="font-size:12px;color:var(--text2);line-height:1.5">${scen.desc}</div>
    </div>
    <div class="game-card" style="margin-bottom:10px">
      <div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Layer ${g.scenarioSlot+1}: ${slot.label}</div>
      <div style="font-size:15px;font-weight:600">What serves the <em>${slot.label}</em> layer?</div>
    </div>
    <div id="scenario-opts">${allOpts.map((opt,i)=>`<button class="game-opt" data-idx="${i}">${opt}</button>`).join('')}</div>`;
  document.getElementById('scenario-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]'); if(!btn)return;
    chooseScenario(parseInt(btn.dataset.idx));
  });
}

function chooseScenario(chosen){
  const g=gameState, correct=g._scenarioCorrect, right=chosen===correct;
  g.scenarioAnswers.push(right);
  document.querySelectorAll('#scenario-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  setTimeout(()=>{g.scenarioSlot++;if(g.scenarioSlot>=ARCH_SCENARIOS[g.scenarioIdx].components.length)renderScenarioEnd();else renderScenario();},right?900:1600);
}

function renderScenarioEnd(){
  const g=gameState,scen=ARCH_SCENARIOS[g.scenarioIdx],correct=g.scenarioAnswers.filter(Boolean).length,total=scen.components.length;
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${correct===total?'🏆':correct>=total*.6?'⭐':'💪'}</div><div style="font-size:18px;font-weight:600;margin-bottom:4px">${scen.title}</div><div style="font-size:28px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${correct}/${total}</div></div>
    <div class="card" style="padding:12px;margin-bottom:10px">
      <div class="section-title">Architecture explained</div>
      <div style="font-size:13px;color:var(--text2);line-height:1.6">${scen.explanation}</div>
      <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:5px">${scen.components.map((c,i)=>`<span class="badge ${g.scenarioAnswers[i]?'b-pass':'b-fail'}">${g.scenarioAnswers[i]?'✓':'✗'} ${c.correct}</span>`).join('')}</div>
    </div>
    <div class="btn-row"><button class="btn btn-game" onclick="startGame('scenario')" style="flex:1">Next Scenario</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

function startSupportGame(){
  gameState.supportQuiz=[...SUPPORT_QS].sort(()=>Math.random()-.5);
  gameState.supportIdx=0;gameState.supportScore=0;gameState.supportAnswered=false;
  renderSupportQ();
}

function renderSupportQ(){
  const g=gameState;if(g.supportIdx>=g.supportQuiz.length){renderSupportEnd();return;}
  const q=g.supportQuiz[g.supportIdx];
  // shuffle support opts too
  const opts=[...q.opts.map((text,orig)=>({text,orig}))].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(o=>o.orig===q.correct);
  g._supportOpts=opts; g._supportCorrect=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <span class="game-score-pill" style="background:var(--surface2);color:var(--text2)">${g.supportIdx+1}/${g.supportQuiz.length}</span>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:24px;margin-bottom:8px">🎧</div><div style="font-size:15px;font-weight:500;line-height:1.5">${q.q}</div></div>
    <div id="support-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}">${o.text}</button>`).join('')}</div>
    <div id="support-exp" style="margin-top:8px"></div>`;
  document.getElementById('support-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]'); if(!btn)return;
    chooseSupportQ(parseInt(btn.dataset.idx));
  });
}

function chooseSupportQ(chosen){if(gameState.supportAnswered)return;gameState.supportAnswered=true;const g=gameState,q=g.supportQuiz[g.supportIdx],correct=g._supportCorrect,right=chosen===correct;const chosenText=g._supportOpts[chosen]?.text||'';const correctText=g._supportOpts[correct]?.text||'';recordGameAnswer('Support Quiz',q.q,chosenText,correctText,right);if(right)g.supportScore++;document.querySelectorAll('#support-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});document.getElementById('support-exp').innerHTML=`<div class="explanation" style="margin-top:0">${q.exp}</div>`;setTimeout(()=>{g.supportIdx++;g.supportAnswered=false;renderSupportQ();},right?1400:2200);}
function renderSupportEnd(){const g=gameState,pct=Math.round(g.supportScore/g.supportQuiz.length*100);document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.supportScore} of ${g.supportQuiz.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('support')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;}

function startWAGame(){
  gameState.waDeck=[...WA_QS].sort(()=>Math.random()-.5);
  gameState.waIdx=0;gameState.waAnswered=false;gameState.waScore=0;
  renderWAQ();
}

function renderWAQ(){
  const g=gameState;if(!g.waDeck||g.waIdx>=g.waDeck.length){renderWAEnd();return;}
  const q=g.waDeck[g.waIdx];
  const allPillars=WA_PILLARS.map(p=>p.name);
  const opts=[q.ans,...allPillars.filter(p=>p!==q.ans).sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
  const correct=opts.indexOf(q.ans);
  g._waOpts=opts; g._waCorrect=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <span class="game-score-pill" style="background:var(--surface2);color:var(--text2)">${g.waIdx+1}/${g.waDeck.length}</span>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:24px;margin-bottom:8px">🏛️</div><div style="font-size:15px;font-weight:500;line-height:1.5">${q.q}</div></div>
    <div id="wa-opts">${opts.map((o,i)=>{const p=WA_PILLARS.find(x=>x.name===o);return`<button class="game-opt" data-idx="${i}" style="display:flex;gap:8px;align-items:center"><span style="font-size:18px;min-width:24px">${p?p.icon:'🏛️'}</span><span>${o}</span></button>`;}).join('')}</div>
    <div id="wa-exp"></div>`;
  document.getElementById('wa-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]'); if(!btn)return;
    chooseWA(parseInt(btn.dataset.idx));
  });
}

function chooseWA(chosen){if(gameState.waAnswered)return;gameState.waAnswered=true;const g=gameState,q=g.waDeck[g.waIdx],correct=g._waCorrect,right=chosen===correct;const chosenName=g._waOpts[chosen]||'?';recordGameAnswer('Well-Architected',q.q,chosenName,q.ans,right);if(right)g.waScore++;document.querySelectorAll('#wa-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});document.getElementById('wa-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${q.exp}</div>`;setTimeout(()=>{g.waIdx++;g.waAnswered=false;renderWAQ();},right?1400:2200);}
function renderWAEnd(){const g=gameState,pct=Math.round(g.waScore/g.waDeck.length*100);document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.waScore} of ${g.waDeck.length} correct</div></div><div class="card" style="padding:12px;margin-top:10px"><div class="section-title">The 6 pillars</div>${WA_PILLARS.map(p=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:13px"><span>${p.icon}</span><span style="font-weight:500">${p.name}</span></div>`).join('')}</div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('wa')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;}

function startSpeedGame(){
  clearInterval(gameState.speedTimer);
  gameState.speedDeck=[...AWS_SERVICES].sort(()=>Math.random()-.5);
  gameState.speedIdx=0;gameState.speedScore=0;gameState.speedMisses=0;gameState.speedSecs=8;
  renderSpeedQ();
  gameState.speedTimer=setInterval(speedTick,1000);
}

function speedTick(){
  gameState.speedSecs--;
  const el=document.getElementById('speed-timer');
  if(el){el.textContent=gameState.speedSecs+'s';el.style.color=gameState.speedSecs<=3?'var(--fail)':'var(--text2)';}
  if(gameState.speedSecs<=0)speedTimeout();
}

function speedTimeout(){
  clearInterval(gameState.speedTimer);gameState.speedMisses++;
  if(gameState.speedMisses>=3){renderSpeedEnd();return;}
  gameState.speedIdx++;
  if(gameState.speedIdx>=gameState.speedDeck.length){renderSpeedEnd();return;}
  gameState.speedSecs=8;renderSpeedQ();gameState.speedTimer=setInterval(speedTick,1000);
}

function renderSpeedQ(){
  const g=gameState,svc=g.speedDeck[g.speedIdx];
  const distr=AWS_SERVICES.filter(s=>s.name!==svc.name).sort(()=>Math.random()-.5).slice(0,3);
  const opts=[svc,...distr].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(s=>s.name===svc.name);
  gameState._speedCorrect=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="clearInterval(gameState.speedTimer);renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:6px;align-items:center">
        <span class="game-score-pill" style="background:var(--pass-dim);color:var(--pass)">✓ ${g.speedScore}</span>
        <span style="font-size:14px">${'❤️'.repeat(3-g.speedMisses)}${'🖤'.repeat(g.speedMisses)}</span>
        <span id="speed-timer" style="font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:18px;color:var(--text2);min-width:28px">${g.speedSecs}s</span>
      </div>
    </div>
    <div class="game-card"><div style="font-size:36px;margin-bottom:6px">${svc.icon}</div><div style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text3);margin-bottom:6px;font-family:'IBM Plex Mono',monospace">${svc.category}</div><div style="font-size:15px;font-weight:500;line-height:1.45">"${svc.desc}"</div></div>
    <div id="speed-opts">${opts.map((s,i)=>`<button class="game-opt" data-idx="${i}">${s.name}</button>`).join('')}</div>`;
  const soEl=document.getElementById('speed-opts');
  if(soEl) soEl.addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]'); if(!btn)return;
    chooseSpeed(parseInt(btn.dataset.idx));
  });
}

function chooseSpeed(chosen){
  clearInterval(gameState.speedTimer);const correct=gameState._speedCorrect;const right=chosen===correct;
  if(right)gameState.speedScore++;else gameState.speedMisses++;
  document.querySelectorAll('#speed-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  if(gameState.speedMisses>=3){setTimeout(renderSpeedEnd,1200);return;}
  gameState.speedIdx++;
  if(gameState.speedIdx>=gameState.speedDeck.length){setTimeout(renderSpeedEnd,1200);return;}
  setTimeout(()=>{gameState.speedSecs=8;renderSpeedQ();gameState.speedTimer=setInterval(speedTick,1000);},right?700:1400);
}

function renderSpeedEnd(){
  clearInterval(gameState.speedTimer);const g=gameState;
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:40px;margin-bottom:8px">${g.speedScore>=20?'🏆':g.speedScore>=10?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${g.speedScore}</div><div style="font-size:14px;color:var(--text2);margin-top:4px">Services identified</div><div style="margin-top:8px"><span class="badge b-neutral">${g.speedMisses>=3?'Out of lives':'Deck complete'}</span></div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('speed')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

// ═══════════════════════════════════════════════════
// REFERENCE SCREENS
// ═══════════════════════════════════════════════════

function showDbReference() {
  const area = document.getElementById('game-area');
  area.innerHTML = `
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div style="font-size:15px;font-weight:600">AWS Databases</div>
      <button class="btn btn-ref" style="font-size:12px;padding:6px 12px" onclick="startGame('dbquiz')">Quiz me ⚡</button>
    </div>
    ${DB_TYPES.map(db=>`
      <div class="card" style="padding:14px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="font-size:28px">${db.icon}</div>
          <div>
            <div style="font-size:15px;font-weight:600">${db.name}</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:3px">
              <span class="badge" style="background:${db.color}22;color:${db.color};border:1px solid ${db.color}55">${db.type}</span>
              <span class="badge b-neutral">${db.tag}</span>
            </div>
          </div>
        </div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px">${db.engine}</div>
        <div style="font-size:12px;margin-bottom:4px"><span style="color:var(--pass);font-weight:600">✓ Use when:</span> <span style="color:var(--text2)">${db.useWhen}</span></div>
        <div style="font-size:12px;margin-bottom:8px"><span style="color:var(--fail);font-weight:600">✗ Avoid when:</span> <span style="color:var(--text2)">${db.notWhen}</span></div>
        <div class="section-title" style="margin-bottom:5px">Key features</div>
        ${db.features.map(f=>`<div style="font-size:12px;padding:2px 0;display:flex;gap:5px;color:var(--text2)"><span style="color:var(--text3)">•</span>${f}</div>`).join('')}
        <div style="font-size:11px;color:var(--text3);margin-top:6px;font-family:'IBM Plex Mono',monospace">Scaling: ${db.scaling} · Consistency: ${db.consistency}</div>
      </div>`).join('')}`;
}

function showStorageReference() {
  const area = document.getElementById('game-area');
  area.innerHTML = `
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div style="font-size:15px;font-weight:600">AWS Storage</div>
      <button class="btn btn-ref" style="font-size:12px;padding:6px 12px" onclick="startGame('storagequiz')">Quiz me ⚡</button>
    </div>
    ${STORAGE_TYPES.map(st=>`
      <div class="card" style="padding:14px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="font-size:28px">${st.icon}</div>
          <div>
            <div style="font-size:15px;font-weight:600">${st.name}</div>
            <span class="badge" style="background:${st.color}22;color:${st.color};border:1px solid ${st.color}55;margin-top:3px">${st.type}</span>
          </div>
        </div>
        <div style="font-size:12px;margin-bottom:4px"><span style="color:var(--pass);font-weight:600">✓ Use when:</span> <span style="color:var(--text2)">${st.useWhen}</span></div>
        <div style="font-size:12px;margin-bottom:8px"><span style="color:var(--fail);font-weight:600">✗ Avoid when:</span> <span style="color:var(--text2)">${st.notWhen}</span></div>
        <div class="section-title" style="margin-bottom:5px">Features</div>
        ${st.features.map(f=>`<div style="font-size:12px;padding:2px 0;display:flex;gap:5px;color:var(--text2)"><span style="color:var(--text3)">•</span>${f}</div>`).join('')}
        <div class="section-title" style="margin-top:8px;margin-bottom:5px">Tiers / Types</div>
        ${st.classes.map(c=>`<div style="font-size:11px;padding:2px 0;display:flex;gap:5px;color:var(--text3);font-family:'IBM Plex Mono',monospace"><span>·</span>${c}</div>`).join('')}
      </div>`).join('')}`;
}

function showIAMReference() {
  const area = document.getElementById('game-area');
  area.innerHTML = `
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div style="font-size:15px;font-weight:600">AWS IAM Deep Dive</div>
      <button class="btn btn-ref" style="font-size:12px;padding:6px 12px" onclick="startGame('iamquiz')">Quiz me ⚡</button>
    </div>
    <div class="card" style="padding:12px;margin-bottom:10px;background:var(--surface2)">
      <div style="font-size:12px;color:var(--text2);line-height:1.6">IAM (Identity and Access Management) controls <strong>who</strong> can access AWS (authentication) and <strong>what</strong> they can do (authorization). The golden rule: <strong>explicit Deny &gt; explicit Allow &gt; implicit Deny</strong>.</div>
    </div>
    ${IAM_CONCEPTS.map(c=>`
      <div class="card" style="padding:14px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="font-size:26px">${c.icon}</div>
          <div style="font-size:15px;font-weight:600">${c.name}</div>
        </div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:8px;line-height:1.5">${c.desc}</div>
        <div style="font-size:12px;padding:8px;background:var(--pass-dim);border-radius:6px;margin-bottom:6px">
          <div style="font-weight:600;color:var(--pass);margin-bottom:2px">Best practice</div>
          <div style="color:var(--text2)">${c.bestPractice}</div>
        </div>
        <div style="font-size:12px;padding:8px;background:var(--ccp-dim,#fff3e0);border-radius:6px;border-left:2px solid var(--ccp)">
          <div style="font-weight:600;color:var(--ccp);margin-bottom:2px">Exam tip</div>
          <div style="color:var(--text2)">${c.exam}</div>
        </div>
      </div>`).join('')}`;
}

function showSRMReference() {
  const area = document.getElementById('game-area');
  const srm = SHARED_RESPONSIBILITY;
  area.innerHTML = `
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div style="font-size:15px;font-weight:600">Shared Responsibility Model</div>
      <button class="btn btn-ref" style="font-size:12px;padding:6px 12px" onclick="startGame('srmquiz')">Quiz me ⚡</button>
    </div>
    <div class="card" style="padding:12px;margin-bottom:10px;background:var(--surface2)">
      <div style="font-size:12px;color:var(--text2);line-height:1.6">AWS and customers share security responsibilities. The boundary shifts depending on the service model: <strong>IaaS (EC2)</strong> — more customer responsibility; <strong>Managed services (RDS, Lambda, S3)</strong> — AWS takes on more.</div>
    </div>
    ${[srm.aws, srm.customer, srm.shared].map(section=>`
      <div class="card" style="padding:14px;margin-bottom:10px;border-left:3px solid ${section.color}">
        <div style="font-size:14px;font-weight:600;color:${section.color};margin-bottom:10px">${section.label}</div>
        ${section.items.map(item=>`
          <div style="padding:7px 0;border-bottom:1px solid var(--border)">
            <div style="font-size:13px;font-weight:500;margin-bottom:2px">${item.cat}</div>
            <div style="font-size:12px;color:var(--text2);line-height:1.5">${item.desc}</div>
          </div>`).join('')}
      </div>`).join('')}
    <div class="card" style="padding:12px;background:var(--surface2)">
      <div class="section-title" style="margin-bottom:6px">Service model quick guide</div>
      ${[
        {model:'EC2 (IaaS)',customer:'Guest OS, runtime, middleware, data, apps, firewall config',aws:'Hypervisor, hardware, physical network'},
        {model:'RDS (PaaS)',customer:'Data, network access controls, DB user management',aws:'OS patching, DB engine updates, backups, HA'},
        {model:'Lambda (Serverless)',customer:'Function code, IAM permissions, data',aws:'Runtime, OS, scaling, underlying infrastructure'},
        {model:'S3 (Object Store)',customer:'Data classification, bucket policies, encryption choices, versioning',aws:'Storage hardware, durability, availability'},
      ].map(r=>`<div style="padding:7px 0;border-bottom:1px solid var(--border)">
        <div style="font-size:12px;font-weight:600;margin-bottom:3px">${r.model}</div>
        <div style="font-size:11px;color:var(--pass);margin-bottom:1px">Customer: ${r.customer}</div>
        <div style="font-size:11px;color:var(--saa)">AWS: ${r.aws}</div>
      </div>`).join('')}
    </div>`;
}

// ═══════════════════════════════════════════════════
// NEW REFERENCE-BASED QUIZ MODES
// ═══════════════════════════════════════════════════

// ── Database Chooser Quiz ──
const DB_QUIZ_QS = [
  {q:'A social network needs to store relationships between millions of users with complex traversals.',ans:'Amazon Neptune',opts:['Amazon Neptune','Amazon RDS','Amazon DynamoDB','Amazon Redshift'],exp:'Neptune is a graph database — built for highly connected data like social networks, fraud detection, and knowledge graphs.'},
  {q:'An e-commerce site needs transactional inventory management with complex SQL joins.',ans:'Amazon RDS',opts:['Amazon RDS','Amazon DynamoDB','Amazon Timestream','Amazon Keyspaces'],exp:'RDS supports ACID transactions, complex joins, and SQL — ideal for structured relational data like inventory and orders.'},
  {q:'A mobile gaming app needs single-digit millisecond latency for player session data at global scale.',ans:'Amazon DynamoDB',opts:['Amazon DynamoDB','Amazon RDS','Amazon Redshift','Amazon QLDB'],exp:'DynamoDB provides single-digit ms latency at any scale — perfect for session stores, leaderboards, and gaming data.'},
  {q:'A financial institution needs a cryptographically verifiable, tamper-proof audit log of all transactions.',ans:'Amazon QLDB',opts:['Amazon QLDB','Amazon RDS','Amazon DynamoDB','Amazon Neptune'],exp:'QLDB is a ledger database with an immutable, cryptographically verifiable journal — designed for regulated financial audit trails.'},
  {q:'IoT sensors send temperature readings every second from 10,000 devices. Data is queried by time ranges.',ans:'Amazon Timestream',opts:['Amazon Timestream','Amazon RDS','Amazon DynamoDB','Amazon Redshift'],exp:'Timestream is purpose-built for time-series data with built-in time analytics and automatic tiered storage.'},
  {q:'A data warehouse needs to run complex analytical queries across petabytes of historical sales data.',ans:'Amazon Redshift',opts:['Amazon Redshift','Amazon RDS','Amazon DynamoDB','Amazon ElastiCache'],exp:'Redshift is a columnar data warehouse optimised for OLAP analytics on large datasets, not transactional workloads.'},
  {q:'A web app stores user profiles as flexible JSON documents with varied attributes per user type.',ans:'Amazon DocumentDB',opts:['Amazon DocumentDB','Amazon RDS','Amazon Redshift','Amazon Timestream'],exp:'DocumentDB is a MongoDB-compatible document database ideal for JSON/BSON documents with flexible, semi-structured schemas.'},
  {q:'A real-time leaderboard needs microsecond read latency backed by DynamoDB.',ans:'Amazon DAX',opts:['Amazon DAX','Amazon ElastiCache','Amazon RDS','Amazon Redshift'],exp:'DAX (DynamoDB Accelerator) is an in-memory cache specifically for DynamoDB that delivers microsecond latency for read-heavy workloads.'},
  {q:'A legacy Cassandra application needs to migrate to AWS with minimal code changes.',ans:'Amazon Keyspaces',opts:['Amazon Keyspaces','Amazon DynamoDB','Amazon RDS','Amazon DocumentDB'],exp:'Amazon Keyspaces is Cassandra-compatible, letting you run Cassandra workloads with the Cassandra Query Language (CQL) on a managed service.'},
  {q:'An application reads the same database query results repeatedly. How to reduce DB load and latency?',ans:'Amazon ElastiCache',opts:['Amazon ElastiCache','Amazon RDS Read Replica','Amazon Redshift','Amazon DAX'],exp:'ElastiCache (Redis/Memcached) caches query results in memory, reducing repeated database calls and improving response times dramatically.'},
  {q:'A MySQL database on EC2 needs to be replaced with a managed, high-availability solution.',ans:'Amazon RDS',opts:['Amazon RDS','Amazon DynamoDB','Amazon Redshift','Amazon QLDB'],exp:'RDS is the managed relational DB service supporting MySQL — it handles patching, backups, and Multi-AZ failover automatically.'},
  {q:'A company needs MySQL-compatible database with 5x the performance and automatic Multi-AZ failover.',ans:'Amazon Aurora',opts:['Amazon Aurora','Amazon RDS MySQL','Amazon DynamoDB','Amazon Redshift'],exp:'Aurora is MySQL/PostgreSQL-compatible but delivers up to 5x MySQL performance with automatic storage scaling and Multi-AZ replication.'},
];

let dbQuizState = {deck:[],idx:0,score:0,answered:false};
function startDbQuiz(){
  dbQuizState.deck=[...DB_QUIZ_QS].sort(()=>Math.random()-.5);
  dbQuizState.idx=0;dbQuizState.score=0;dbQuizState.answered=false;
  renderDbQ();
}
function renderDbQ(){
  const g=dbQuizState;
  if(g.idx>=g.deck.length){renderDbEnd();return;}
  const q=g.deck[g.idx];
  const opts=[...q.opts].sort(()=>Math.random()-.5);
  const correct=opts.indexOf(q.ans);
  g._currentOpts=opts; g._currentCorrect=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderRefMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge b-game">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} correct</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:24px;margin-bottom:8px">🗄️</div><div style="font-size:15px;font-weight:500;line-height:1.5">${q.q}</div></div>
    <div id="db-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}">${o}</button>`).join('')}</div>
    <div id="db-exp"></div>`;
  document.getElementById('db-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]'); if(!btn)return;
    chooseDbQ(parseInt(btn.dataset.idx));
  });
}
function chooseDbQ(chosen){
  const g=dbQuizState; if(g.answered)return; g.answered=true;
  const q=g.deck[g.idx], correct=g._currentCorrect, right=chosen===correct;
  const chosenText=g._currentOpts[chosen]||'';
  recordGameAnswer('Database Quiz',q.q,chosenText,q.ans,right);
  if(right)g.score++;
  document.querySelectorAll('#db-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('db-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${q.exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderDbQ();},right?1400:2200);
}
function renderDbEnd(){
  const g=dbQuizState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-ref" onclick="startGame('dbquiz')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showDbReference()">Study Databases</button><button class="btn btn-ghost" onclick="renderRefMenu()">Menu</button></div>`;
}

// ── Storage Chooser Quiz ──
const STORAGE_QUIZ_QS = [
  {q:'Multiple EC2 instances running a content management system need to share uploaded files simultaneously.',ans:'Amazon EFS',opts:['Amazon EFS','Amazon EBS','Amazon S3','AWS Storage Gateway'],exp:'EFS provides shared NFS file storage mountable by multiple EC2 instances at the same time across AZs.'},
  {q:'A relational database on EC2 needs fast, consistent block storage for its data files.',ans:'Amazon EBS',opts:['Amazon EBS','Amazon EFS','Amazon S3','Amazon EFS One Zone'],exp:'EBS provides persistent block storage attached to EC2 instances — the right choice for database storage needing low-latency I/O.'},
  {q:'A company needs to store 10 years of compliance archives at the lowest possible cost, accessed rarely.',ans:'S3 Glacier Deep Archive',opts:['S3 Glacier Deep Archive','Amazon EBS','Amazon S3 Standard','Amazon EFS'],exp:'S3 Glacier Deep Archive is the lowest-cost storage class, designed for data retained 7-10+ years with 12-hour retrieval time.'},
  {q:'An application serves millions of images and videos to global users who access them frequently.',ans:'Amazon S3 + CloudFront',opts:['Amazon S3 + CloudFront','Amazon EBS','Amazon EFS','AWS Storage Gateway'],exp:'S3 stores objects with 11 nines durability; CloudFront CDN caches them at edge locations globally for low-latency delivery.'},
  {q:'A Windows enterprise application needs SMB file shares integrated with Active Directory.',ans:'Amazon FSx for Windows',opts:['Amazon FSx for Windows','Amazon EFS','Amazon S3','Amazon EBS'],exp:'FSx for Windows File Server provides native SMB protocol, NTFS, and Active Directory integration for Windows workloads.'},
  {q:'A machine learning training job needs 200 GB/s throughput for processing a dataset stored in S3.',ans:'Amazon FSx for Lustre',opts:['Amazon FSx for Lustre','Amazon EFS','Amazon EBS io2','Amazon S3'],exp:'FSx for Lustre provides high-performance file system throughput (hundreds of GB/s) and integrates directly with S3 for ML/HPC workloads.'},
  {q:'A company wants to automatically move S3 objects between tiers based on access patterns without rules.',ans:'S3 Intelligent-Tiering',opts:['S3 Intelligent-Tiering','S3 Lifecycle Policies','Amazon EFS','S3 Standard-IA'],exp:'S3 Intelligent-Tiering automatically moves objects between frequent and infrequent access tiers based on access patterns — no retrieval fees.'},
  {q:'A data centre needs to back up 500TB of on-premises backup tapes to AWS cost-effectively.',ans:'AWS Storage Gateway (Tape)',opts:['AWS Storage Gateway (Tape)','AWS Snowball','Amazon S3','Amazon EFS'],exp:'Tape Gateway creates a virtual tape library backed by S3/Glacier, enabling tape-compatible backup software to write to AWS.'},
  {q:'A startup is migrating 2 petabytes of video archives to S3. Internet transfer would take months.',ans:'AWS Snowball Edge',opts:['AWS Snowball Edge','AWS DataSync','Amazon S3 Transfer Acceleration','AWS Direct Connect'],exp:'Snowball Edge (80TB per device) is used for large-scale physical data migrations. Multiple devices can be used for petabyte-scale moves.'},
  {q:'A website hosts static HTML, CSS, and JS files that need to be served to global users reliably.',ans:'Amazon S3',opts:['Amazon S3','Amazon EBS','Amazon EFS','Amazon FSx for Lustre'],exp:'S3 can host static websites with global reliability. Combined with CloudFront, it provides low-latency delivery worldwide.'},
  {q:'Which S3 storage class provides instant retrieval but at lower cost than Standard for infrequent access?',ans:'S3 Standard-IA',opts:['S3 Standard-IA','S3 Glacier Instant Retrieval','S3 One Zone-IA','S3 Intelligent-Tiering'],exp:'S3 Standard-IA (Infrequent Access) offers lower storage cost than Standard but charges a retrieval fee — good for data accessed monthly.'},
];

let storageQuizState={deck:[],idx:0,score:0,answered:false};
function startStorageQuiz(){
  storageQuizState.deck=[...STORAGE_QUIZ_QS].sort(()=>Math.random()-.5);
  storageQuizState.idx=0;storageQuizState.score=0;storageQuizState.answered=false;
  renderStorageQ();
}
function renderStorageQ(){
  const g=storageQuizState;if(g.idx>=g.deck.length){renderStorageEnd();return;}
  const q=g.deck[g.idx];const opts=[...q.opts].sort(()=>Math.random()-.5);const correct=opts.indexOf(q.ans);
  g._currentOpts=opts; g._currentCorrect=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderRefMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge b-game">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} correct</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:24px;margin-bottom:8px">💾</div><div style="font-size:15px;font-weight:500;line-height:1.5">${q.q}</div></div>
    <div id="st-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}">${o}</button>`).join('')}</div>
    <div id="st-exp"></div>`;
  document.getElementById('st-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]'); if(!btn)return;
    chooseStorageQ(parseInt(btn.dataset.idx));
  });
}
function chooseStorageQ(chosen){
  const g=storageQuizState; if(g.answered)return; g.answered=true;
  const q=g.deck[g.idx], correct=g._currentCorrect, right=chosen===correct;
  const chosenText=g._currentOpts[chosen]||'';
  recordGameAnswer('Storage Quiz',q.q,chosenText,q.ans,right);
  if(right)g.score++;
  document.querySelectorAll('#st-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('st-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${q.exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderStorageQ();},right?1400:2200);
}
function renderStorageEnd(){
  const g=storageQuizState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-ref" onclick="startGame('storagequiz')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showStorageReference()">Study Storage</button><button class="btn btn-ghost" onclick="renderRefMenu()">Menu</button></div>`;
}

// ── IAM Quiz ──
const IAM_QUIZ_QS = [
  {q:'An EC2 instance needs to read from S3 without storing credentials on the instance. What should you use?',ans:'IAM Role attached as instance profile',opts:['IAM Role attached as instance profile','IAM User access keys in env variables','Root account credentials','S3 bucket ACL only'],exp:'IAM Roles provide temporary credentials via the instance metadata service. Applications running on EC2 automatically retrieve them — no credentials stored on disk.'},
  {q:'A company wants to ensure that even if an admin grants S3 full access, accounts in the Prod OU can never delete S3 buckets. What achieves this?',ans:'Service Control Policy (SCP)',opts:['Service Control Policy (SCP)','IAM Permission Boundary','S3 Bucket Policy','AWS Config Rule'],exp:'SCPs set maximum permissions at the OU level. An explicit Deny in an SCP overrides all IAM policies in accounts within that OU.'},
  {q:'What happens when an IAM policy has both an Allow for s3:DeleteObject and an explicit Deny for s3:DeleteObject?',ans:'The Deny wins — access is denied',opts:['The Deny wins — access is denied','The Allow wins','The most recently attached policy wins','The result depends on the resource'],exp:'Explicit Deny always overrides Allow in IAM. The evaluation order is: explicit Deny > explicit Allow > implicit Deny (default).'},
  {q:'A developer needs temporary elevated permissions for a one-time database migration task. What is the best approach?',ans:'Assume an IAM Role with the required permissions',opts:['Assume an IAM Role with the required permissions','Create a new IAM User with admin access','Use root account credentials','Add permissions permanently to their user'],exp:'STS AssumeRole provides temporary credentials limited in time and scope. This is safer than permanently elevating a user or using root.'},
  {q:'Which IAM entity allows you to set the maximum permissions that an IAM user or role can have?',ans:'Permission Boundary',opts:['Permission Boundary','SCP','IAM Group policy','Resource-based policy'],exp:'Permission Boundaries define a ceiling on the permissions an IAM entity can have. Policies can only grant up to what the boundary allows.'},
  {q:'A Lambda function needs to write to DynamoDB. Where should the permissions be granted?',ans:"The Lambda function's execution role",opts:["The Lambda function's execution role","A resource-based policy on DynamoDB","The developer's IAM user","The Lambda function's resource policy"],exp:"Lambda's execution role is the IAM role assumed when the function runs. It must include dynamodb:PutItem (or equivalent) permissions."},
  {q:'What is the difference between an IAM Role and an IAM User?',ans:'Roles have temporary credentials; users have permanent credentials',opts:['Roles have temporary credentials; users have permanent credentials','Roles are for humans; users are for services','Users can be assumed; roles cannot','They are identical'],exp:'IAM Users have long-term credentials (passwords, access keys). IAM Roles provide temporary STS credentials that expire — safer for programmatic access.'},
  {q:'A third-party application needs access to your AWS account. What should you create?',ans:'Cross-account IAM Role with trust policy',opts:['Cross-account IAM Role with trust policy','IAM User with access keys emailed to the vendor','Root account with MFA','VPN access only'],exp:'Create an IAM Role with a trust policy allowing the external account/identity to assume it. This avoids sharing long-term credentials.'},
  {q:'An IAM policy is attached to a group. A conflicting policy on a user allows the same action but the group policy denies it. Result?',ans:'Access denied — group Deny wins',opts:['Access denied — group Deny wins','Access allowed — user policy wins','Access allowed — most permissive wins','It depends on policy order'],exp:'An explicit Deny anywhere in the evaluation chain — regardless of which policy it is in — always overrides an Allow.'},
  {q:'Which AWS service provides centralised SSO access across multiple AWS accounts using existing identity providers like Okta or Active Directory?',ans:'AWS IAM Identity Center',opts:['AWS IAM Identity Center','AWS Cognito User Pools','AWS Directory Service only','IAM Federation with SAML'],exp:'IAM Identity Center (formerly AWS SSO) provides centralised multi-account SSO, integrating with SAML 2.0 identity providers and AWS Organizations.'},
];

let iamQuizState={deck:[],idx:0,score:0,answered:false};
function startIAMQuiz(){
  iamQuizState.deck=[...IAM_QUIZ_QS].sort(()=>Math.random()-.5);
  iamQuizState.idx=0;iamQuizState.score=0;iamQuizState.answered=false;
  renderIAMQ();
}
function renderIAMQ(){
  const g=iamQuizState;if(g.idx>=g.deck.length){renderIAMEnd();return;}
  const q=g.deck[g.idx];const opts=[...q.opts].sort(()=>Math.random()-.5);const correct=opts.indexOf(q.ans);
  g._currentOpts=opts; g._currentCorrect=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderRefMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge b-game">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} correct</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:24px;margin-bottom:8px">🔑</div><div style="font-size:15px;font-weight:500;line-height:1.5">${q.q}</div></div>
    <div id="iam-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}">${o}</button>`).join('')}</div>
    <div id="iam-exp"></div>`;
  document.getElementById('iam-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]'); if(!btn)return;
    chooseIAMQ(parseInt(btn.dataset.idx));
  });
}
function chooseIAMQ(chosen){
  const g=iamQuizState; if(g.answered)return; g.answered=true;
  const q=g.deck[g.idx], correct=g._currentCorrect, right=chosen===correct;
  const chosenText=g._currentOpts[chosen]||'';
  recordGameAnswer('IAM Quiz',q.q,chosenText,q.ans,right);
  if(right)g.score++;
  document.querySelectorAll('#iam-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('iam-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${q.exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderIAMQ();},right?1400:2200);
}
function renderIAMEnd(){
  const g=iamQuizState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-ref" onclick="startGame('iamquiz')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showIAMReference()">Study IAM</button><button class="btn btn-ghost" onclick="renderRefMenu()">Menu</button></div>`;
}

// ── Shared Responsibility Quiz ──
const SRM_QUIZ_QS = [
  {q:'Who is responsible for patching the guest OS on an EC2 instance?',ans:'Customer',opts:['Customer','AWS','Shared — both patch it','Neither'],exp:'For EC2 (IaaS), the customer fully owns the guest OS including patching, security hardening, and runtime configuration.'},
  {q:'Who is responsible for patching the underlying OS for Amazon RDS?',ans:'AWS',opts:['AWS','Customer','Shared equally','The DBA team'],exp:'RDS is a managed service. AWS handles OS patching, database engine updates, and hardware maintenance — the customer manages data and access.'},
  {q:'Who is responsible for encrypting data stored in Amazon S3?',ans:'Customer',opts:['Customer','AWS','Shared','Neither — S3 encrypts automatically'],exp:'The customer decides whether to encrypt data, which keys to use, and which bucket policies to apply. AWS provides the encryption tools (SSE-S3, SSE-KMS).'},
  {q:'Who maintains the physical security of AWS data centres?',ans:'AWS',opts:['AWS','Customer','Shared','Third-party auditor'],exp:'AWS is entirely responsible for physical security: buildings, guards, access controls, power, cooling, and hardware in its data centres.'},
  {q:'Who is responsible for configuring Security Groups for an EC2 instance?',ans:'Customer',opts:['Customer','AWS','Shared','Depends on the region'],exp:'Security Groups are customer-configured virtual firewalls. AWS provides the mechanism; customers define inbound and outbound rules.'},
  {q:'Who is responsible for the hypervisor that separates EC2 instances from each other?',ans:'AWS',opts:['AWS','Customer','Shared','EC2 has no hypervisor'],exp:'AWS manages the hypervisor (virtualisation layer). Customers never have access to the host OS or hypervisor — this is core AWS infrastructure.'},
  {q:'A Lambda function has a bug that causes data corruption. Whose responsibility is this?',ans:'Customer',opts:['Customer','AWS','Shared','AWS Lambda team'],exp:'Application code running in Lambda is entirely the customer\'s responsibility. AWS manages the runtime, OS, and scaling — not the application logic.'},
  {q:'Who is responsible for enabling MFA on IAM user accounts?',ans:'Customer',opts:['Customer','AWS','Shared','AWS Security team'],exp:'IAM user management, including enforcing MFA policies, is the customer\'s responsibility. AWS provides MFA as a feature but cannot enforce it on customers.'},
  {q:'Who manages network equipment and fibre in AWS data centres?',ans:'AWS',opts:['AWS','Customer','Both','Third-party ISPs'],exp:'AWS is responsible for all physical network infrastructure: switches, routers, fibre, and the global backbone network connecting regions.'},
  {q:'A DynamoDB table has no encryption at rest configured. Whose decision was that?',ans:'Customer',opts:['Customer','AWS','DynamoDB encrypts by default — this cannot happen','Shared'],exp:'DynamoDB does encrypt at rest by default with AWS-owned keys. But key management choices (KMS CMK vs AWS-owned) are the customer\'s responsibility.'},
  {q:'Who is responsible for compliance certifications like SOC 2 and ISO 27001 for AWS infrastructure?',ans:'AWS',opts:['AWS','Customer','Both need separate certifications','Neither'],exp:'AWS maintains compliance certifications for its infrastructure. Customers inherit these through the shared model. Customers are responsible for their own application compliance.'},
  {q:'A web application running on EC2 is vulnerable to SQL injection. Who is responsible for fixing it?',ans:'Customer',opts:['Customer','AWS','AWS WAF handles it automatically','Shared'],exp:'Application-level vulnerabilities (SQL injection, XSS) are entirely the customer\'s responsibility to prevent and fix. AWS WAF can help but requires customer configuration.'},
];

let srmQuizState={deck:[],idx:0,score:0,answered:false};
function startSRMQuiz(){
  srmQuizState.deck=[...SRM_QUIZ_QS].sort(()=>Math.random()-.5);
  srmQuizState.idx=0;srmQuizState.score=0;srmQuizState.answered=false;
  renderSRMQ();
}
function renderSRMQ(){
  const g=srmQuizState;if(g.idx>=g.deck.length){renderSRMEnd();return;}
  const q=g.deck[g.idx];const opts=[...q.opts].sort(()=>Math.random()-.5);const correct=opts.indexOf(q.ans);
  g._currentOpts=opts; g._currentCorrect=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderRefMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge b-game">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} correct</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:24px;margin-bottom:8px">🤝</div><div style="font-size:15px;font-weight:500;line-height:1.5">${q.q}</div></div>
    <div id="srm-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}">${o}</button>`).join('')}</div>
    <div id="srm-exp"></div>`;
  document.getElementById('srm-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]'); if(!btn)return;
    chooseSRMQ(parseInt(btn.dataset.idx));
  });
}
function chooseSRMQ(chosen){
  const g=srmQuizState; if(g.answered)return; g.answered=true;
  const q=g.deck[g.idx], correct=g._currentCorrect, right=chosen===correct;
  const chosenText=g._currentOpts[chosen]||'';
  recordGameAnswer('Shared Responsibility',q.q,chosenText,q.ans,right);
  if(right)g.score++;
  document.querySelectorAll('#srm-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('srm-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${q.exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderSRMQ();},right?1400:2200);
}
function renderSRMEnd(){
  const g=srmQuizState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-ref" onclick="startGame('srmquiz')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showSRMReference()">Study SRM</button><button class="btn btn-ghost" onclick="renderRefMenu()">Menu</button></div>`;
}

// ═══════════════════════════════════════════════════
// HARDER CCP GAMES
// ═══════════════════════════════════════════════════

// ── 1. PRICING SHOWDOWN ──
const PRICING_QS = [
  {q:'A web server runs 24/7 for a predictable e-commerce site. The team commits to 1 year. Which option is cheapest?',opts:['On-Demand','1-Year Standard Reserved Instance','Spot Instance','Dedicated Host'],ans:1,exp:'Reserved Instances offer up to 72% savings over On-Demand for steady, predictable 24/7 workloads committed to 1 or 3 years. Spot is cheaper but can be interrupted — unsuitable for a live website.'},
  {q:'A batch ML training job runs 6 hours overnight and can restart if interrupted. Lowest cost option?',opts:['On-Demand','Reserved Instance','Spot Instance with checkpointing','Dedicated Host'],ans:2,exp:'Spot Instances save up to 90% for fault-tolerant, interruptible workloads. Checkpointing lets the job resume after a Spot reclaim — perfect for overnight batch jobs.'},
  {q:'A startup\'s new app has completely unknown traffic. They want to avoid cost surprises. Best starting strategy?',opts:['3-Year Reserved Instances for maximum savings','On-Demand + Auto Scaling, review after 1-2 months','Spot Instances for everything','Dedicated Hosts for compliance'],ans:1,exp:'On-Demand with Auto Scaling has no commitment and scales with actual demand. After gathering real usage data, Cost Explorer will surface RI/Savings Plan recommendations based on observed patterns.'},
  {q:'A company uses EC2, Lambda, and Fargate across 4 instance families and multiple regions. Most flexible savings commitment?',opts:['Standard Reserved Instances (1 family per region)','Convertible Reserved Instances','Compute Savings Plans','EC2 Instance Savings Plans'],ans:2,exp:'Compute Savings Plans apply automatically across EC2 (any family, size, region, OS), Lambda, and Fargate — the broadest coverage. They offer up to 66% savings with maximum flexibility.'},
  {q:'Dev EC2 instances are only used 9am–6pm Mon–Fri (45 hrs/week vs 168 hrs). Best cost reduction?',opts:['Convert to Reserved Instances','Schedule automatic stop/start outside working hours','Move to Spot Instances','Increase to larger instance to finish faster'],ans:1,exp:'Stop/start scheduling eliminates ~73% of runtime hours at no extra cost. Dev instances don\'t need the uptime guarantees that Reserved Instances are designed for.'},
  {q:'A company needs to run 10,000 simulations over the next week, each taking 30 min, tolerating interruption. Cheapest option?',opts:['On-Demand','3-Year Reserved Instances','Spot Instances with SQS queue for retry','Savings Plans'],ans:2,exp:'Spot Instances with an SQS queue means interrupted jobs requeue automatically. For large, fault-tolerant batch workloads, Spot (up to 90% off) with retry logic is the standard cost-optimisation pattern.'},
  {q:'CloudFront serves images from S3 to global users. Monthly S3 data transfer out = $4,200. After adding CloudFront, cache hit rate is 85%. What happens to the bill?',opts:['Bill increases — CloudFront adds cost','Bill decreases — 85% of requests skip the S3 origin, CloudFront per-GB rate is also lower','No change — you still pay for all transfers','S3 transfer is free with CloudFront'],ans:1,exp:'CloudFront caches content at edge locations. An 85% cache hit rate means 85% of requests never reach S3, eliminating that origin transfer cost. CloudFront\'s per-GB pricing to end users is also lower than direct S3 egress rates.'},
  {q:'A company runs RDS Multi-AZ. Their DBA says the standby instance is "wasted cost" since it doesn\'t serve reads. How can they add value to the standby?',opts:['Delete Multi-AZ to save cost','Promote the standby to serve read traffic','Add RDS Read Replicas for read workloads while keeping Multi-AZ standby for HA','Move to DynamoDB'],ans:2,exp:'Multi-AZ standby is for HA/failover only — it cannot serve reads. Read Replicas are separate instances that handle read traffic. Using both gives you HA (Multi-AZ) and read scaling (Read Replicas).'},
  {q:'A company\'s NAT Gateway costs $1,800/month mainly from EC2 instances downloading S3 objects. Free fix?',opts:['Upgrade to a larger NAT Gateway','Add a VPC Gateway Endpoint for S3 — traffic routes privately, bypassing NAT Gateway entirely','Use CloudFront instead of S3','Switch to Direct Connect'],ans:1,exp:'VPC Gateway Endpoints for S3 (and DynamoDB) are free and route traffic through the AWS private network, bypassing the NAT Gateway entirely. This eliminates NAT Gateway data processing charges for all S3 traffic from private subnets.'},
  {q:'Which EC2 pricing model lets you save up to 90% but requires you to handle 2-minute interruption notices?',opts:['Reserved Instances','Savings Plans','Spot Instances','Dedicated Hosts'],ans:2,exp:'Spot Instances use AWS spare capacity at up to 90% discount. AWS can reclaim them with a 2-minute warning. Best for fault-tolerant, stateless, or batch workloads that can handle interruption gracefully.'},
  {q:'An app with unpredictable spikes uses Reserved Instances for baseline and needs to handle peaks cost-effectively without interruption risk. What covers the spikes?',opts:['More Reserved Instances at peak tier','Spot Instances for spikes','On-Demand for spikes above the reserved baseline','Dedicated Hosts for spikes'],ans:2,exp:'The RI/On-Demand/Spot combination is a standard architecture: RIs cover predictable baseline (cheapest for steady load), On-Demand covers unpredictable spikes (no interruption risk), Spot for background batch that can tolerate reclaim.'},
  {q:'AWS Trusted Advisor shows 12 EC2 instances with < 5% CPU utilisation over 14 days. What action saves the most money?',opts:['Terminate all 12 immediately','Right-size or downsize instances to match actual CPU/memory needs','Add CloudWatch alarms','Purchase Reserved Instances for the current oversized instances'],ans:1,exp:'Right-sizing means selecting the smallest instance type that still meets performance requirements. Purchasing RIs for oversized instances locks in the wrong size. Trusted Advisor\'s Cost Optimization checks are a primary source of right-sizing recommendations.'},
];

let pricingState={deck:[],idx:0,score:0,answered:false};
function startPricingGame(){
  pricingState.deck=[...PRICING_QS].sort(()=>Math.random()-.5);
  pricingState.idx=0;pricingState.score=0;pricingState.answered=false;
  renderPricingQ();
}
function renderPricingQ(){
  const g=pricingState;if(g.idx>=g.deck.length){renderPricingEnd();return;}
  const q=g.deck[g.idx];const opts=[...q.opts.map((t,i)=>({t,i}))].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(o=>o.i===q.ans);
  g._opts=opts;g._correct=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge b-hard" style="font-size:11px">Hard</span><span class="badge b-game">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} ✓</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:26px;margin-bottom:6px">💰</div><div style="font-size:15px;font-weight:500;line-height:1.6">${q.q}</div></div>
    <div id="pricing-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}">${o.t}</button>`).join('')}</div>
    <div id="pricing-exp"></div>`;
  document.getElementById('pricing-opts').addEventListener('click',e=>{const b=e.target.closest('[data-idx]');if(b)choosePricingQ(parseInt(b.dataset.idx));});
}
function choosePricingQ(chosen){
  const g=pricingState;if(g.answered)return;g.answered=true;
  const q=g.deck[g.idx],correct=g._correct,right=chosen===correct;
  recordGameAnswer('Pricing Showdown',q.q,g._opts[chosen]?.t||'',q.opts[q.ans],right);
  if(right)g.score++;
  document.querySelectorAll('#pricing-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('pricing-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${q.exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderPricingQ();},right?1400:2200);
}
function renderPricingEnd(){
  const g=pricingState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('pricing')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

// ── 2. MIGRATION STRATEGIES — 6 Rs ──
const SIX_RS = [
  {name:'Rehost',icon:'🏠',desc:'Lift & shift — move to cloud with no changes. Fastest migration, least cloud benefit.',hint:'Move as-is'},
  {name:'Replatform',icon:'🔧',desc:'Lift, tinker & shift — make targeted optimizations (e.g. EC2→RDS) without changing core architecture.',hint:'Optimize slightly'},
  {name:'Repurchase',icon:'🛒',desc:'Drop & shop — replace with a SaaS product (e.g. on-prem CRM → Salesforce).',hint:'Buy SaaS instead'},
  {name:'Re-architect',icon:'🏗️',desc:'Redesign the application natively for cloud (microservices, serverless, containers). Highest effort, most benefit.',hint:'Rebuild cloud-native'},
  {name:'Retire',icon:'🗑️',desc:'Decommission — the application is no longer needed. Switch it off.',hint:'Shut it down'},
  {name:'Retain',icon:'🔒',desc:'Keep on-premises — not ready to migrate due to compliance, latency, or complexity. Revisit later.',hint:'Leave it for now'},
];

const MIGRATION_QS = [
  {q:'A company moves their on-premises VMs to EC2 with no code changes whatsoever.',ans:'Rehost',exp:'Rehost (lift & shift) means migrating workloads to the cloud without any modification — the fastest path to the cloud.'},
  {q:'A company replaces a self-managed MySQL on EC2 with Amazon RDS without changing the application.',ans:'Replatform',exp:'Replatform makes targeted improvements (managed DB removes ops overhead) without re-architecting the application — sometimes called "lift, tinker, and shift".'},
  {q:'A company stops maintaining their on-premises CRM and moves to Salesforce.',ans:'Repurchase',exp:'Repurchase (drop & shop) swaps a custom or on-prem solution for a commercial SaaS product.'},
  {q:'A monolithic app is decomposed into Lambda functions and DynamoDB, redesigned from scratch.',ans:'Re-architect',exp:'Re-architect (also called Refactor) redesigns the application to use cloud-native services — highest effort but best long-term cloud benefits.'},
  {q:'After an audit, a company discovers 20 internal apps with no users for 2 years.',ans:'Retire',exp:'Retire means identifying and decommissioning applications that are no longer needed — often 10-20% of a portfolio.'},
  {q:'A healthcare app cannot migrate due to data sovereignty regulations requiring on-premises storage.',ans:'Retain',exp:'Retain means keeping the application on-premises (at least for now) — due to compliance, latency, or complexity constraints.'},
  {q:'Moving from self-managed Tomcat on VMs to AWS Elastic Beanstalk without changing application code.',ans:'Replatform',exp:'Using Elastic Beanstalk removes server management overhead. The application code is unchanged — a classic Replatform.'},
  {q:'A company rebuilds their e-commerce platform as microservices on EKS with API Gateway.',ans:'Re-architect',exp:'Re-architecting to microservices on Kubernetes is the most transformation-heavy migration strategy.'},
  {q:'A business unit is being sold. Their AWS workloads should be transferred to the buyer.',ans:'Retire',exp:'Transferring or closing workloads associated with a divested business unit is effectively Retiring them from your portfolio.'},
  {q:'An ERP system is too tightly coupled with mainframe hardware to migrate in the next 2 years.',ans:'Retain',exp:'Retain is chosen when migration is not yet feasible — the decision is to revisit migration later.'},
  {q:'A company moves their file servers to EC2 instances with identical configuration, preserving all file paths.',ans:'Rehost',exp:'Rehosting preserves the same environment — identical configuration, just running on EC2 instead of physical servers.'},
  {q:'A company subscribes to AWS WorkMail instead of running their own Exchange server.',ans:'Repurchase',exp:'Moving from a self-managed email server to a managed SaaS email service (WorkMail, Google Workspace) is Repurchase.'},
];

let migrationState={deck:[],idx:0,score:0,answered:false,showExplainer:false};
function startMigrationGame(){
  migrationState.deck=[...MIGRATION_QS].sort(()=>Math.random()-.5);
  migrationState.idx=0;migrationState.score=0;migrationState.answered=false;migrationState.showExplainer=false;
  renderMigrationQ();
}
function renderMigrationExplainer(){
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%" onclick="renderGameMenu()">← Menu</button>
    <div class="game-card" style="text-align:left;margin-bottom:10px"><div style="font-size:24px;margin-bottom:6px">🚚</div><div style="font-size:15px;font-weight:600;margin-bottom:8px">The 6 Rs of Migration</div>${SIX_RS.map(r=>`<div style="padding:8px 0;border-bottom:1px solid var(--border)"><div style="display:flex;gap:8px;align-items:center;margin-bottom:2px"><span style="font-size:18px">${r.icon}</span><span style="font-weight:600">${r.name}</span><span class="badge b-neutral" style="font-size:10px">${r.hint}</span></div><div style="font-size:12px;color:var(--text2);line-height:1.5">${r.desc}</div></div>`).join('')}</div>
    <button class="btn btn-game" style="width:100%" onclick="startMigrationGame()">Start Quiz →</button>`;
}
function renderMigrationQ(){
  const g=migrationState;if(g.idx>=g.deck.length){renderMigrationEnd();return;}
  const q=g.deck[g.idx];
  const opts=[...SIX_RS].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(r=>r.name===q.ans);
  g._opts=opts;g._correct=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge b-hard" style="font-size:11px">Hard</span><span class="badge b-game">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} ✓</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:26px;margin-bottom:6px">🚚</div><div style="font-size:15px;font-weight:500;line-height:1.6">${q.q}</div></div>
    <div id="mig-opts" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${opts.map((r,i)=>`<button class="game-opt" data-idx="${i}" style="text-align:center;padding:10px 6px"><span style="font-size:18px;display:block;margin-bottom:2px">${r.icon}</span><span style="font-size:13px;font-weight:600">${r.name}</span><span style="font-size:10px;color:var(--text3);display:block">${r.hint}</span></button>`).join('')}</div>
    <div id="mig-exp"></div>`;
  document.getElementById('mig-opts').addEventListener('click',e=>{const b=e.target.closest('[data-idx]');if(b)chooseMigrationQ(parseInt(b.dataset.idx));});
}
function chooseMigrationQ(chosen){
  const g=migrationState;if(g.answered)return;g.answered=true;
  const q=g.deck[g.idx],correct=g._correct,right=chosen===correct;
  recordGameAnswer('Migration 6Rs',q.q,g._opts[chosen]?.name||'',q.ans,right);
  if(right)g.score++;
  document.querySelectorAll('#mig-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('mig-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${q.exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderMigrationQ();},right?1400:2200);
}
function renderMigrationEnd(){
  const g=migrationState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('migration')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderMigrationExplainer()">Study 6 Rs</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

// ── 3. SECURITY GAUNTLET ──
const SECURITY_QS = [
  {q:'An IAM policy has Deny s3:DeleteObject and another has Allow s3:DeleteObject. What is the result?',opts:['Allow — most permissive wins','Deny — explicit Deny always overrides Allow','Allow — the more specific policy wins','Depends on policy attachment order'],ans:1,exp:'IAM evaluation logic: explicit Deny > explicit Allow > implicit Deny. An explicit Deny anywhere in the policy chain overrides all Allows, regardless of order or specificity.'},
  {q:'Which service CONTINUOUSLY monitors your AWS accounts for malicious activity using ML on CloudTrail, VPC Flow Logs, and DNS logs — without requiring agents?',opts:['Amazon Inspector','Amazon Macie','Amazon GuardDuty','AWS Security Hub'],ans:2,exp:'GuardDuty is agentless threat detection that analyzes CloudTrail, VPC Flow Logs, and Route 53 DNS query logs using ML to detect threats like compromised credentials, unusual API calls, and crypto-mining.'},
  {q:'A developer accidentally pushed AWS access keys to a public GitHub repository 10 minutes ago. What is the FIRST action?',opts:['Make the GitHub repo private','Rotate the keys','Immediately deactivate or delete the exposed IAM access keys','Enable MFA on the IAM user'],ans:2,exp:'Exposed keys must be deactivated immediately — assume they have already been compromised. After deactivation: rotate if needed, investigate CloudTrail for any unauthorized usage, then review how to prevent recurrence.'},
  {q:'You need EC2 instances in private subnets to download OS patches from the internet but block all inbound connections. What component is required?',opts:['Internet Gateway on private subnet','VPN Gateway','NAT Gateway in a public subnet','VPC Endpoint'],ans:2,exp:'A NAT Gateway in a public subnet allows private instances to initiate outbound connections (for patches) while blocking unsolicited inbound traffic. Private subnets route 0.0.0.0/0 to the NAT Gateway, not the IGW.'},
  {q:'Which S3 feature prevents ANYONE (including root) from deleting or overwriting objects for a fixed retention period — required for WORM compliance?',opts:['S3 Versioning','S3 MFA Delete','S3 Object Lock in Compliance mode','S3 Block Public Access'],ans:2,exp:'S3 Object Lock Compliance mode cannot be overridden by any user, including root. It provides WORM (Write Once Read Many) protection required by regulations like SEC 17a-4 and FINRA.'},
  {q:'Your organization needs to ensure developers can NEVER create resources outside eu-west-1 and eu-central-1, even with AdministratorAccess. What achieves this?',opts:['IAM Permission Boundaries on all users','An SCP in AWS Organizations denying all actions outside approved regions','VPC routing restrictions','AWS Config rules in each account'],ans:1,exp:'SCPs set the maximum permissions for all principals in an account, including root. A Deny SCP on regions outside the approved list cannot be overridden by any IAM policy in any member account.'},
  {q:'A security audit requires proof that S3 bucket objects have not been modified since storage. Which feature provides cryptographic proof of immutability?',opts:['S3 Versioning showing version history','S3 Object Lock in Compliance mode with retention policy','S3 Replication verification','CloudTrail logging of all S3 API calls'],ans:1,exp:'Object Lock Compliance mode with a retention policy prevents all modification or deletion. Combined with S3 Object Lock legal hold, this provides auditable, cryptographically-enforced WORM storage for compliance.'},
  {q:'Which service can automatically detect when an S3 bucket is exposed publicly AND classify sensitive data (PII, credentials) stored within it?',opts:['Amazon GuardDuty','Amazon Macie','AWS Config + s3-bucket-public-read-prohibited rule','AWS Trusted Advisor'],ans:1,exp:'Amazon Macie uses ML to discover, classify, and protect sensitive data in S3, and alerts when buckets have public access or contain PII. GuardDuty detects threats but doesn\'t classify S3 data content.'},
  {q:'A company wants EC2 instances to access DynamoDB without storing credentials anywhere on the instance. What is the correct approach?',opts:['Store access keys in /etc/environment','Use an IAM Role attached as an instance profile','Hardcode credentials in the application config','Use AWS Secrets Manager on every request'],ans:1,exp:'IAM instance profiles attach a role to EC2. The application retrieves temporary credentials automatically from the instance metadata service (IMDS) — no credentials are stored, and they rotate automatically.'},
  {q:'What is the difference between Security Groups and Network ACLs?',opts:['They are identical — both are stateless subnet firewalls','Security Groups are stateful (instance-level); NACLs are stateless (subnet-level)','NACLs are stateful; Security Groups are stateless','Security Groups operate at the VPC level; NACLs at the instance level'],ans:1,exp:'Security Groups are stateful (return traffic is automatically allowed) and operate at the instance/ENI level. NACLs are stateless (you must explicitly allow inbound AND outbound) and operate at the subnet level — a second layer of network defense.'},
  {q:'A company needs secrets (DB passwords, API keys) to rotate automatically every 30 days with full audit logging of every access. Which service?',opts:['AWS KMS','SSM Parameter Store (Standard Tier)','AWS Secrets Manager','S3 with server-side encryption'],ans:2,exp:'Secrets Manager provides built-in automatic rotation for supported services (RDS, Redshift, DocumentDB), fine-grained IAM access control, and integrates with CloudTrail for full audit logs. Parameter Store Standard doesn\'t support automatic rotation.'},
  {q:'Which AWS service provides a centralized, aggregated view of security findings from GuardDuty, Macie, Inspector, and IAM Access Analyzer across all accounts?',opts:['AWS CloudTrail','Amazon CloudWatch','AWS Security Hub','AWS Control Tower'],ans:2,exp:'AWS Security Hub aggregates, normalizes, and prioritizes security findings from multiple AWS security services and third-party tools across a multi-account environment into a single dashboard with compliance scoring.'},
];

let securityState={deck:[],idx:0,score:0,answered:false};
function startSecurityGame(){
  securityState.deck=[...SECURITY_QS].sort(()=>Math.random()-.5);
  securityState.idx=0;securityState.score=0;securityState.answered=false;
  renderSecurityQ();
}
function renderSecurityQ(){
  const g=securityState;if(g.idx>=g.deck.length){renderSecurityEnd();return;}
  const q=g.deck[g.idx];const opts=[...q.opts.map((t,i)=>({t,i}))].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(o=>o.i===q.ans);
  g._opts=opts;g._correct=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge b-hard" style="font-size:11px">Hard</span><span class="badge b-game">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} ✓</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:26px;margin-bottom:6px">🔐</div><div style="font-size:15px;font-weight:500;line-height:1.6">${q.q}</div></div>
    <div id="sec-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}">${o.t}</button>`).join('')}</div>
    <div id="sec-exp"></div>`;
  document.getElementById('sec-opts').addEventListener('click',e=>{const b=e.target.closest('[data-idx]');if(b)chooseSecurityQ(parseInt(b.dataset.idx));});
}
function chooseSecurityQ(chosen){
  const g=securityState;if(g.answered)return;g.answered=true;
  const q=g.deck[g.idx],correct=g._correct,right=chosen===correct;
  recordGameAnswer('Security Gauntlet',q.q,g._opts[chosen]?.t||'',q.opts[q.ans],right);
  if(right)g.score++;
  document.querySelectorAll('#sec-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('sec-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${q.exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderSecurityQ();},right?1400:2200);
}
function renderSecurityEnd(){
  const g=securityState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('security')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

// ── 4. DISASTER RECOVERY SPEED DRILL ──
const DR_STRATEGIES = [
  {name:'Backup & Restore',icon:'💾',rto:'Hours',rpo:'Hours',cost:'$',desc:'Cheapest. Back up data to S3/Glacier. Restore from scratch during an outage. Highest RTO/RPO.'},
  {name:'Pilot Light',icon:'🕯️',rto:'Minutes–Hours',rpo:'Minutes',cost:'$$',desc:'Core components (e.g. DB replication) run minimally. Scale up remaining resources during failover.'},
  {name:'Warm Standby',icon:'🔥',rto:'Minutes',rpo:'Seconds',cost:'$$$',desc:'A fully functional but scaled-down copy runs continuously. Scale up to full capacity on failover.'},
  {name:'Multi-Site Active/Active',icon:'🌐',rto:'Near-zero',rpo:'Near-zero',cost:'$$$$',desc:'Full production capacity in multiple regions simultaneously. Zero downtime, highest cost.'},
];

const DR_QS = [
  {q:'Cheapest DR option: back up data periodically to S3, restore from scratch if disaster strikes. Accepts hours of downtime.',ans:'Backup & Restore',exp:'Backup & Restore is lowest cost but highest RTO/RPO — suitable when hours of downtime are acceptable. No infrastructure runs in the DR site until needed.'},
  {q:'A bank requires near-zero downtime and near-zero data loss, running full capacity in two AWS regions simultaneously.',ans:'Multi-Site Active/Active',exp:'Multi-Site Active/Active runs full production workloads in multiple regions at all times. Both RTO and RPO are near-zero — but it\'s the most expensive DR strategy.'},
  {q:'Only the database replication layer runs in the DR region. Other resources must be provisioned and scaled up during a failover event.',ans:'Pilot Light',exp:'Pilot Light keeps only the critical "flame" (usually data replication) running. During failover, additional infrastructure is provisioned from AMIs, which takes time — hence higher RTO than Warm Standby.'},
  {q:'A scaled-down but fully functional version of the application runs continuously in a second region. During failover, it is simply scaled up.',ans:'Warm Standby',exp:'Warm Standby runs a complete but smaller version of the workload. Failover only requires scaling up, giving a lower RTO than Pilot Light. Costs more than Pilot Light but less than Active/Active.'},
  {q:'RPO: hours, RTO: hours. No infrastructure running in DR region until an outage occurs.',ans:'Backup & Restore',exp:'Backup & Restore has the weakest RPO and RTO because you must restore everything from backups. However, it is the cheapest DR option.'},
  {q:'A company needs RTO < 5 minutes but RPO < 30 seconds. A reduced-capacity version runs in DR at all times.',ans:'Warm Standby',exp:'Warm Standby achieves low RTO (scale up the running environment) and very low RPO (continuous replication). It\'s the right balance between cost and recovery speed for most enterprises.'},
  {q:'Which DR strategy has the LOWEST cost?',ans:'Backup & Restore',exp:'Backup & Restore stores backups in S3/Glacier at minimal cost. No compute runs in the DR region until a disaster — making it by far the cheapest but slowest recovery option.'},
  {q:'Which DR strategy has the HIGHEST cost?',ans:'Multi-Site Active/Active',exp:'Multi-Site Active/Active runs full production infrastructure in multiple regions simultaneously — every component duplicated, at full capacity, all the time. Maximum cost, minimum RTO/RPO.'},
];

let drState={deck:[],idx:0,score:0,answered:false};
function startDRGame(){
  drState.deck=[...DR_QS].sort(()=>Math.random()-.5);
  drState.idx=0;drState.score=0;drState.answered=false;
  renderDRQ();
}
function renderDRExplainer(){
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%" onclick="renderGameMenu()">← Menu</button>
    <div class="game-card" style="text-align:left;margin-bottom:10px"><div style="font-size:24px;margin-bottom:6px">🛡️</div><div style="font-size:15px;font-weight:600;margin-bottom:8px">DR Strategies — Cost vs RTO/RPO</div>${DR_STRATEGIES.map(r=>`<div style="padding:8px 0;border-bottom:1px solid var(--border)"><div style="display:flex;gap:8px;align-items:center;margin-bottom:2px"><span style="font-size:18px">${r.icon}</span><span style="font-weight:600">${r.name}</span><span class="badge b-neutral" style="font-size:10px">${r.cost}</span></div><div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-family:\'IBM Plex Mono\',monospace">RTO: ${r.rto} · RPO: ${r.rpo}</div><div style="font-size:12px;color:var(--text2);line-height:1.5">${r.desc}</div></div>`).join('')}</div>
    <button class="btn btn-game" style="width:100%" onclick="startDRGame()">Start Quiz →</button>`;
}
function renderDRQ(){
  const g=drState;if(g.idx>=g.deck.length){renderDREnd();return;}
  const q=g.deck[g.idx];
  const opts=[...DR_STRATEGIES].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(r=>r.name===q.ans);
  g._opts=opts;g._correct=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge b-hard" style="font-size:11px">Hard</span><span class="badge b-game">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} ✓</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:26px;margin-bottom:6px">🛡️</div><div style="font-size:15px;font-weight:500;line-height:1.6">${q.q}</div></div>
    <div id="dr-opts" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${opts.map((r,i)=>`<button class="game-opt" data-idx="${i}" style="text-align:center;padding:10px 6px"><span style="font-size:18px;display:block;margin-bottom:2px">${r.icon}</span><span style="font-size:12px;font-weight:600;display:block">${r.name}</span><span style="font-size:10px;color:var(--text3);display:block">${r.cost}</span></button>`).join('')}</div>
    <div id="dr-exp"></div>`;
  document.getElementById('dr-opts').addEventListener('click',e=>{const b=e.target.closest('[data-idx]');if(b)chooseDRQ(parseInt(b.dataset.idx));});
}
function chooseDRQ(chosen){
  const g=drState;if(g.answered)return;g.answered=true;
  const q=g.deck[g.idx],correct=g._correct,right=chosen===correct;
  recordGameAnswer('DR Strategies',q.q,g._opts[chosen]?.name||'',q.ans,right);
  if(right)g.score++;
  document.querySelectorAll('#dr-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('dr-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${q.exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderDRQ();},right?1400:2200);
}
function renderDREnd(){
  const g=drState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('dr')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderDRExplainer()">Study DR Strategies</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

// ── 5. NETWORK & VPC GAUNTLET ──
const NETWORK_CONCEPTS = [
  {name:'Internet Gateway (IGW)',icon:'🌐',desc:'Enables communication between a VPC and the internet. Attached to a VPC, referenced in public subnet route tables (0.0.0.0/0 → IGW). Horizontally scaled, redundant, highly available.',rules:['Public subnets route 0.0.0.0/0 → IGW','Resources need a public or Elastic IP to communicate outbound','Stateful — no inbound filtering (Security Groups handle that)'],tip:'No IGW = no internet access, even with a public IP.'},
  {name:'NAT Gateway',icon:'🔁',desc:'Allows instances in PRIVATE subnets to initiate outbound internet connections (e.g. OS patches) while blocking all unsolicited inbound traffic. Deployed in a PUBLIC subnet.',rules:['Lives in a public subnet','Private subnet route table: 0.0.0.0/0 → NAT Gateway','Managed, highly available within an AZ — deploy one per AZ for full HA','Charged per hour + per GB processed'],tip:'NAT Gateway = outbound only for private subnets. Traffic to S3/DynamoDB should use a Gateway Endpoint to avoid NAT charges.'},
  {name:'Security Group',icon:'🛡️',desc:'Virtual stateful firewall at the instance (ENI) level. Controls inbound and outbound traffic. Default: deny all inbound, allow all outbound.',rules:['Stateful — return traffic automatically allowed','Rules are ALLOW only — no explicit deny','Applied to: EC2, RDS, Lambda (in VPC), ELB, etc.','Multiple SGs can be attached to one instance'],tip:'Security Groups cannot explicitly deny — use NACLs for explicit deny rules.'},
  {name:'Network ACL (NACL)',icon:'🧱',desc:'Stateless firewall at the SUBNET level. Evaluates rules by number (lowest first). Default NACL allows all traffic; custom NACLs deny all by default.',rules:['Stateless — must explicitly allow inbound AND outbound (including ephemeral ports)','Rules evaluated lowest number first; first match wins','Applies to all resources in the subnet','Can explicitly DENY specific IPs — Security Groups cannot'],tip:'NACLs are the only way to explicitly block a specific IP address in a VPC.'},
  {name:'VPC Peering',icon:'🔗',desc:'Private connectivity between two VPCs (same or different accounts/regions). Traffic stays on AWS backbone. NOT transitive — peering A↔B and B↔C does NOT give A access to C.',rules:['Non-transitive — each pair needs its own peering connection','Cannot peer VPCs with overlapping CIDR ranges','Requires route table entries in both VPCs','Works across accounts and regions'],tip:'For transitive routing across many VPCs, use Transit Gateway instead.'},
  {name:'VPC Endpoint',icon:'🔌',desc:'Private connection from your VPC to AWS services without internet, NAT, or VPN. Two types: Gateway (S3, DynamoDB — free) and Interface (most other services — hourly + data charge).',rules:['Gateway Endpoint: S3 and DynamoDB only — free, route table entry','Interface Endpoint (PrivateLink): ENI with private IP in your subnet','Eliminates NAT Gateway charges for S3/DynamoDB traffic','Required for private instances accessing AWS services without internet'],tip:'Add a Gateway Endpoint for S3 to eliminate NAT Gateway data charges for S3 traffic.'},
  {name:'AWS Direct Connect',icon:'⚡',desc:'Dedicated private physical network connection from on-premises to AWS, bypassing the public internet. Provides consistent latency and high throughput.',rules:['Physical connection — takes weeks to provision','1 Gbps or 10 Gbps port speeds','Does NOT encrypt by default — add VPN over Direct Connect for encryption','Use Direct Connect + VPN for encrypted, redundant connectivity'],tip:'Direct Connect alone is not encrypted. For encrypted private connectivity, run a VPN tunnel over Direct Connect.'},
  {name:'AWS Site-to-Site VPN',icon:'🔒',desc:'Encrypted IPsec tunnel between on-premises network and AWS VPC over the public internet. Quick to provision (minutes vs weeks for Direct Connect).',rules:['Two tunnels per VPN connection for redundancy','Bandwidth limited by internet connection (~1.25 Gbps max)','Connects to a Virtual Private Gateway or Transit Gateway','Encrypted by default (IPsec)'],tip:'VPN is fast to set up and encrypted; Direct Connect is private and consistent but takes weeks and is unencrypted by default.'},
  {name:'AWS Transit Gateway',icon:'🔀',desc:'Regional hub that connects VPCs and on-premises networks through a single gateway. Supports transitive routing — one attachment, full mesh connectivity.',rules:['Transitive routing — A↔TGW↔B↔TGW↔C all communicate','Supports VPCs, VPN, Direct Connect, and inter-region peering','Route tables on the TGW control which attachments can talk','Replaces complex VPC peering meshes at scale'],tip:'Transit Gateway replaces VPC peering for 3+ VPCs. Peering becomes exponentially complex; TGW scales linearly.'},
];

const NETWORK_QS = [
  {q:'A private EC2 instance needs to download OS updates from the internet but must block all inbound connections. What is required?',opts:['Internet Gateway on the private subnet','Elastic IP address on the private instance','NAT Gateway in a public subnet, with a route from the private subnet route table','VPN Gateway'],ans:2,exp:'A NAT Gateway in a public subnet lets private instances initiate outbound connections while blocking all unsolicited inbound traffic. Private subnet route tables point 0.0.0.0/0 → NAT Gateway.'},
  {q:'EC2 instances in private subnets need to access S3. You want to eliminate NAT Gateway data processing charges for this traffic. What should you add?',opts:['Internet Gateway','S3 Transfer Acceleration','VPC Gateway Endpoint for S3','Direct Connect'],ans:2,exp:'A VPC Gateway Endpoint for S3 is free and routes traffic directly from your VPC to S3 over the AWS private network — bypassing the NAT Gateway and eliminating its per-GB data processing charge.'},
  {q:'A security team needs to explicitly BLOCK a specific IP address (203.0.113.5) from reaching any instance in a subnet. Security Groups cannot do this. What can?',opts:['An additional Security Group with a Deny rule','A Network ACL with a Deny rule for that IP','Route table with a blackhole route','AWS WAF IP set rule on the subnet'],ans:1,exp:'NACLs support explicit Deny rules. Adding a NACL rule with a low rule number that Denies 203.0.113.5 blocks it at the subnet level before it reaches any instance. Security Groups only support Allow rules — there is no explicit Deny.'},
  {q:'Three VPCs (A, B, C) are connected: A↔B peered, B↔C peered. Can A communicate with C through B?',opts:['Yes — traffic transits through B automatically','No — VPC Peering is non-transitive; A↔C requires a direct peering connection or Transit Gateway','Yes — as long as route tables in B allow it','Only if all three are in the same account'],ans:1,exp:'VPC Peering is non-transitive. A↔B and B↔C does not give A access to C. Each communicating pair needs its own peering connection. For transitive routing at scale, use AWS Transit Gateway.'},
  {q:'A company needs to connect 15 VPCs and 3 on-premises offices so all can communicate with each other. What is the most scalable architecture?',opts:['Create a full mesh of VPC peering connections (105 peerings needed)','Use AWS Transit Gateway as a central hub for all VPCs and VPN connections','Use Direct Connect to each VPC individually','Merge all VPCs into one large VPC'],ans:1,exp:'Transit Gateway acts as a cloud router — all VPCs and VPN/Direct Connect connections attach to it. One attachment per VPC vs n(n-1)/2 peering connections. For 15 VPCs, TGW requires 15 attachments; full mesh peering would need 105 connections.'},
  {q:'A company has Direct Connect to AWS but their security policy requires all data in transit to be encrypted. What additional component is needed?',opts:['Nothing — Direct Connect encrypts by default','Enable encryption in the Direct Connect console','Establish a Site-to-Site VPN tunnel over the Direct Connect connection','Use HTTPS at the application layer only'],ans:2,exp:'Direct Connect is a private connection but is NOT encrypted by default. The standard pattern for encrypted private connectivity is to run a Site-to-Site VPN tunnel over the Direct Connect link, combining private routing with IPsec encryption.'},
  {q:'Which component connects a public subnet to the internet, and which connects a private subnet to the internet for outbound traffic?',opts:['IGW for both public and private subnets','IGW for public subnets (inbound + outbound); NAT Gateway in a public subnet for private subnets (outbound only)','NAT Gateway for public; IGW for private','VPN Gateway for both'],ans:1,exp:'An Internet Gateway enables two-way internet communication for resources with public IPs in public subnets. A NAT Gateway (sitting in a public subnet) provides outbound-only internet access for private subnet instances — hiding their private IPs behind the NAT.'},
  {q:'A financial services app on EC2 calls the AWS KMS API millions of times per day. The team wants this traffic to stay entirely within the AWS network. What should they create?',opts:['VPC Gateway Endpoint for KMS','VPC Interface Endpoint for KMS','NAT Gateway pointing to KMS','Direct Connect for KMS traffic only'],ans:1,exp:'KMS is not covered by the free Gateway Endpoint (only S3 and DynamoDB are). For KMS and most other AWS services, use a VPC Interface Endpoint (powered by AWS PrivateLink). It creates an ENI in your subnet with a private IP, keeping all KMS traffic within the AWS network.'},
  {q:'A NACL has Rule 100: Allow all traffic, Rule 200: Deny HTTP (port 80). What is the result for HTTP traffic?',opts:['Denied — Deny rules always override Allow rules in NACLs','Allowed — Rule 100 matches first; NACLs evaluate lowest-numbered rule first and stop','Allowed — Allow rules take priority','Denied — both rules apply'],ans:1,exp:'NACLs evaluate rules in ascending numerical order and stop at the first match. Rule 100 (Allow all) is evaluated before Rule 200 (Deny HTTP), so HTTP traffic is allowed. To block HTTP, the Deny rule must have a lower number than the Allow rule.'},
  {q:'An on-premises office needs encrypted, private connectivity to a VPC that must be operational within hours. Which option meets these requirements?',opts:['Direct Connect — private and fast','Site-to-Site VPN — can be provisioned in minutes, encrypted by default','Direct Connect + VPN — most secure but takes weeks','VPC Peering — for on-premises connections'],ans:1,exp:'Site-to-Site VPN (IPsec) can be configured and operational within minutes to hours. Direct Connect requires physical provisioning that takes weeks. The VPN provides encrypted connectivity over the internet — suitable when speed of setup is the priority.'},
  {q:'Which VPC Endpoint type is FREE and works by adding an entry to your route table?',opts:['Interface Endpoint (PrivateLink) — free with no per-hour charge','Gateway Endpoint — free, supports S3 and DynamoDB only','Both types are free','Neither — all endpoints have hourly charges'],ans:1,exp:'Gateway Endpoints are free and work by modifying route tables to direct traffic to S3 or DynamoDB through the AWS private network. Interface Endpoints (PrivateLink) have an hourly charge plus data processing fees, but support most other AWS services.'},
  {q:'A Security Group allows all outbound traffic. An instance makes a request to an external server. The response comes back. Does the Security Group need an inbound rule to allow the response?',opts:['Yes — you must add an inbound rule for every expected response','No — Security Groups are stateful; return traffic for allowed outbound connections is automatically permitted','Yes — only if the response is on a different port','Depends on the NACL'],ans:1,exp:'Security Groups are stateful. When you allow an outbound connection, the return traffic is automatically tracked and allowed without needing an explicit inbound rule. This is the key difference from NACLs, which are stateless and require explicit rules in both directions.'},
];

const PRICING_MODELS = [
  {name:'On-Demand',icon:'⏱️',color:'#2196f3',summary:'Pay per second/hour, no commitment. Most expensive per unit but zero upfront cost.',use:'Unknown workloads, short-term projects, testing, unpredictable spikes.',avoid:'Steady-state 24/7 workloads — Reserved Instances are far cheaper.',keyFact:'Default EC2 pricing. No SLA for capacity — in rare cases, insufficient capacity errors can occur.'},
  {name:'Reserved Instances',icon:'📋',color:'#9c27b0',summary:'Up to 72% off On-Demand. 1 or 3-year commitment to a specific instance configuration.',use:'Steady, predictable 24/7 workloads. Baseline capacity you are confident will run long-term.',avoid:'Variable workloads, new applications with unknown usage patterns.',keyFact:'Standard RIs: locked to instance family/region. Convertible RIs: can exchange for different type. Unused Standard RIs can be sold on the RI Marketplace.'},
  {name:'Spot Instances',icon:'⚡',color:'#ff9900',summary:'Up to 90% off On-Demand using spare AWS capacity. AWS can reclaim with 2-minute warning.',use:'Fault-tolerant, stateless, or checkpointable workloads: batch processing, ML training, video transcoding, CI/CD.',avoid:'Databases, web servers, any workload that cannot tolerate interruption.',keyFact:'Spot Instance interruption = 2-minute warning via instance metadata and EventBridge. Spot Fleet and EC2 Auto Scaling manage pools of Spot capacity.'},
  {name:'Savings Plans',icon:'💳',color:'#4caf50',summary:'Flexible commitment ($/hr spend) for 1 or 3 years. Automatically applies to matching usage.',use:'Mixed EC2 workloads, Lambda, Fargate — anywhere you want RI-level savings without instance-type lock-in.',avoid:'Workloads that will change dramatically, or where you want zero commitment.',keyFact:'Compute Savings Plans: broadest (EC2 any family/region + Lambda + Fargate). EC2 Instance Savings Plans: one family per region, slightly higher discount.'},
  {name:'Dedicated Hosts',icon:'🏠',color:'#e91e63',summary:'Physical server fully dedicated to you. Supports Bring Your Own License (BYOL) for host-bound software.',use:'Regulatory compliance requiring dedicated hardware. BYOL for per-socket/per-core licenses (Windows Server, SQL Server).',avoid:'General-purpose workloads — far more expensive than shared tenancy with no performance benefit.',keyFact:'Most expensive option. Billing is per host per hour. Different from Dedicated Instances (same hardware isolation but no BYOL support).'},
  {name:'Dedicated Instances',icon:'🏢',color:'#607d8b',summary:'Instances run on hardware dedicated to a single customer, but you don\'t control host placement.',use:'Compliance requirements for hardware isolation, without needing BYOL support.',avoid:'Cost-sensitive workloads. Pricier than shared, but offers isolation without full host dedication.',keyFact:'Key exam distinction: Dedicated Hosts give you control of host placement and enable BYOL. Dedicated Instances give isolation but not placement control or BYOL.'},
];

let networkState={deck:[],idx:0,score:0,answered:false};
function startNetworkGame(){
  networkState.deck=[...NETWORK_QS].sort(()=>Math.random()-.5);
  networkState.idx=0;networkState.score=0;networkState.answered=false;
  renderNetworkQ();
}
function showNetworkReference(){
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div style="font-size:15px;font-weight:600">VPC & Networking</div>
      <button class="btn btn-ref" style="font-size:12px;padding:6px 12px" onclick="startGame('network')">Quiz me ⚡</button>
    </div>
    ${NETWORK_CONCEPTS.map(c=>`
      <div class="card" style="padding:14px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="font-size:26px">${c.icon}</div>
          <div style="font-size:15px;font-weight:600">${c.name}</div>
        </div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:8px;line-height:1.5">${c.desc}</div>
        <div class="section-title" style="margin-bottom:5px">Key rules</div>
        ${c.rules.map(r=>`<div style="font-size:12px;padding:2px 0;display:flex;gap:5px;color:var(--text2)"><span style="color:var(--text3)">•</span>${r}</div>`).join('')}
        <div style="font-size:12px;padding:8px;background:var(--ccp-dim,#fff3e0);border-radius:6px;border-left:2px solid var(--ccp);margin-top:8px">
          <span style="font-weight:600;color:var(--ccp)">Exam tip: </span><span style="color:var(--text2)">${c.tip}</span>
        </div>
      </div>`).join('')}`;
}
function renderNetworkQ(){
  const g=networkState;if(g.idx>=g.deck.length){renderNetworkEnd();return;}
  const q=g.deck[g.idx];const opts=[...q.opts.map((t,i)=>({t,i}))].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(o=>o.i===q.ans);
  g._opts=opts;g._correct=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge b-hard" style="font-size:11px">Hard</span><span class="badge b-game">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} ✓</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:26px;margin-bottom:6px">🌐</div><div style="font-size:15px;font-weight:500;line-height:1.6">${q.q}</div></div>
    <div id="net-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}">${o.t}</button>`).join('')}</div>
    <div id="net-exp"></div>`;
  document.getElementById('net-opts').addEventListener('click',e=>{const b=e.target.closest('[data-idx]');if(b)chooseNetworkQ(parseInt(b.dataset.idx));});
}
function chooseNetworkQ(chosen){
  const g=networkState;if(g.answered)return;g.answered=true;
  const q=g.deck[g.idx],correct=g._correct,right=chosen===correct;
  recordGameAnswer('Network & VPC',q.q,g._opts[chosen]?.t||'',q.opts[q.ans],right);
  if(right)g.score++;
  document.querySelectorAll('#net-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('net-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${q.exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderNetworkQ();},right?1400:2200);
}
function renderNetworkEnd(){
  const g=networkState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('network')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showNetworkReference()">Study Networking</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

// ── 6. WELL-ARCHITECTED DEEP DIVE ──
const WA_HARD_QS = [
  {q:'A company deploys all EC2 instances in a single AZ behind an ALB. The ALB spans two AZs but has no instances in the second AZ. Which pillar is violated and what is the fix?',opts:['Cost Optimization — use Spot Instances','Reliability — deploy EC2 Auto Scaling across both AZs so the ALB can route to healthy instances in either AZ','Performance Efficiency — increase instance size','Operational Excellence — add CloudWatch alarms'],ans:1,exp:'Reliability requires eliminating single points of failure. An ALB spanning multiple AZs does nothing if all compute is in one AZ — an AZ failure takes down everything. Auto Scaling across AZs with health checks ensures traffic routes to surviving instances.'},
  {q:'An application stores user session data in EC2 instance memory. When an instance is terminated during scale-in, users are logged out. Which pillar and fix applies?',opts:['Operational Excellence — add CloudWatch alarms for session errors','Reliability — store sessions in ElastiCache (external, shared state) so any instance can serve any user','Cost Optimization — keep one instance always running','Security — encrypt session data at rest'],ans:1,exp:'Reliability\'s "design to recover from failure" means instances must be stateless and disposable. Moving session state to ElastiCache (or DynamoDB) externalises it — any instance can serve any request and instances can be terminated without impacting users.'},
  {q:'A team manually SSHs into production EC2 instances to apply config changes and patches. Which pillar and practice should replace this?',opts:['Security — disable all SSH access','Operational Excellence — "perform operations as code"; use AWS Systems Manager for patching and configuration, with changes defined in runbooks and applied automatically','Reliability — use Multi-AZ','Cost Optimization — use Spot Instances'],ans:1,exp:'Operational Excellence\'s core principle "perform operations as code" means replacing manual, error-prone human actions with automated runbooks. AWS Systems Manager Patch Manager, Run Command, and State Manager automate patching and configuration without SSH access.'},
  {q:'A startup deploys an application by guessing they need 20 EC2 instances at launch. After 3 months, average CPU is 8%. Which pillar addresses this, and what is the solution?',opts:['Reliability — add more instances for safety','Performance Efficiency — "stop guessing capacity"; use Auto Scaling based on actual demand metrics to provision the right amount at the right time','Cost Optimization — purchase Reserved Instances for the 20 instances','Operational Excellence — add monitoring'],ans:1,exp:'Performance Efficiency\'s principle "stop guessing capacity" means using Auto Scaling to provision based on actual demand rather than over-provisioning for peak. At 8% CPU, the instances are massively over-provisioned — Auto Scaling would have reduced the fleet and lowered costs.'},
  {q:'An organization\'s cloud workloads use large EC2 instances that idle at 5% utilisation most of the time. Which Well-Architected pillar\'s principle most directly addresses the environmental impact of this waste?',opts:['Cost Optimization — right-size to save money','Sustainability — maximise utilisation and use efficient, right-sized resources to reduce energy consumption per unit of work','Reliability — ensure resources are available when needed','Operational Excellence — automate provisioning'],ans:1,exp:'The Sustainability pillar focuses on minimising environmental impact. Idle, over-provisioned resources consume energy without productive output. Right-sizing, using serverless (Lambda, Fargate), and adopting Graviton processors all reduce energy per unit of work — core Sustainability practices.'},
  {q:'A team deploys updates by replacing the entire application server fleet at once, causing 15 minutes of downtime each release. Which pillar and strategy fixes this?',opts:['Cost Optimization — deploy less frequently','Operational Excellence — "make frequent, small, reversible changes"; use blue/green or rolling deployments for zero-downtime releases','Reliability — add more instances','Security — use CodePipeline with approvals'],ans:1,exp:'Operational Excellence advocates for small, reversible, frequent changes over large infrequent deployments. Blue/green deployment routes traffic to a new fleet while the old one stays live — switch traffic in seconds, roll back by reverting the route. Zero downtime, instant rollback.'},
  {q:'A Lambda function accesses DynamoDB using hardcoded access keys stored in environment variables. Which TWO pillars are violated? (Pick the answer covering both.)',opts:['Cost Optimization and Performance Efficiency','Security (hardcoded credentials) and Operational Excellence (manual key rotation)','Security — use IAM Role/execution role instead; Reliability — hardcoded keys fail silently when rotated','Performance Efficiency and Reliability'],ans:2,exp:'Security violation: credentials should never be hardcoded — use a Lambda execution role instead. Operational Excellence violation: hardcoded credentials require manual rotation, are error-prone, and create toil. An IAM execution role provides automatic, temporary credential rotation with zero code changes.'},
  {q:'An application fetches the same product catalog from a database on every page load. Under high traffic, the database becomes a bottleneck. Which pillar and solution applies?',opts:['Reliability — add a Multi-AZ database','Performance Efficiency — use caching (ElastiCache) to serve frequently read, rarely changed data from memory rather than querying the database every time','Cost Optimization — use a smaller database','Operational Excellence — add read replicas and monitor query counts'],ans:1,exp:'Performance Efficiency focuses on using resources efficiently. Caching static or slow-changing data (product catalog) in ElastiCache eliminates redundant database queries. Cache hit rates of 90%+ dramatically reduce DB load, reduce latency, and allow the same database to serve far more traffic.'},
  {q:'A company\'s production database has no backups and no read replicas. An accidental DELETE query removes critical data. Which pillar\'s practice would have prevented the data loss?',opts:['Operational Excellence — audit all queries','Reliability — "test recovery procedures" and "back up data automatically"; automated backups and point-in-time recovery allow restoration after data corruption','Security — restrict DELETE permissions','Cost Optimization — use a cheaper database'],ans:1,exp:'Reliability includes automated data backup and tested recovery procedures. RDS automated backups with point-in-time recovery (PITR) allow restoration to any second within the retention window. Without backups, data loss is permanent. "Test recovery procedures" means regularly verifying you can actually restore.'},
  {q:'A company uses AWS but has never reviewed which services they actually use vs what they provisioned. 30% of EC2 instances are idle. Which pillar and tool addresses this directly?',opts:['Reliability — use Multi-AZ for everything','Cost Optimization — use AWS Cost Explorer and Compute Optimizer to identify idle/underutilised resources and right-size or terminate them','Performance Efficiency — use larger instances','Sustainability — switch to Graviton'],ans:1,exp:'Cost Optimization\'s "identify and reduce waste" principle. Compute Optimizer uses ML to analyse CloudWatch metrics and recommend right-sizing. Cost Explorer identifies idle resources. Terminating unused instances and right-sizing over-provisioned ones are the highest-ROI cost optimisation actions.'},
  {q:'A team is designing a new service and wants to choose an instance type now for the next 3 years. Which Performance Efficiency principle should guide them?',opts:['Commit to the largest available instance to avoid future resizing','Use commodity hardware — always choose the cheapest','Democratize advanced technologies — use managed services; "use the latest tech" — benchmark different instance types (including Graviton) and choose based on measured performance, not assumptions','Choose the same instance type your competitor uses'],ans:2,exp:'Performance Efficiency\'s "use the latest technologies" principle means adopting new instance families (Graviton3 offers better price/performance than x86 equivalents), benchmarking rather than guessing, and re-evaluating as AWS launches newer generations. Lock-in to a specific type for 3 years ignores this.'},
  {q:'A serverless application using Lambda and DynamoDB has zero infrastructure to manage, scales automatically, and costs nothing when idle. Which TWO pillars does this architecture most directly optimise?',opts:['Security and Reliability only','Performance Efficiency (scale automatically, use managed services) and Cost Optimization (pay only for actual use, no idle capacity cost)','Operational Excellence and Sustainability only','Reliability and Sustainability only'],ans:1,exp:'Serverless optimises Performance Efficiency (auto-scaling, managed infrastructure, no capacity guessing) and Cost Optimization (pay-per-invocation, zero cost when idle, no over-provisioning). Operational Excellence also benefits (no servers to manage) but the MOST direct optimisation is on cost and performance efficiency.'},
];

let waHardState={deck:[],idx:0,score:0,answered:false};
function startWAHardGame(){
  waHardState.deck=[...WA_HARD_QS].sort(()=>Math.random()-.5);
  waHardState.idx=0;waHardState.score=0;waHardState.answered=false;
  renderWAHardQ();
}
function renderWAHardQ(){
  const g=waHardState;if(g.idx>=g.deck.length){renderWAHardEnd();return;}
  const q=g.deck[g.idx];const opts=[...q.opts.map((t,i)=>({t,i}))].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(o=>o.i===q.ans);
  g._opts=opts;g._correct=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge b-hard" style="font-size:11px">Hard</span><span class="badge b-game">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} ✓</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px"><div style="font-size:26px;margin-bottom:6px">🏛️</div><div style="font-size:15px;font-weight:500;line-height:1.6">${q.q}</div></div>
    <div id="wah-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}" style="font-size:13px;text-align:left">${o.t}</button>`).join('')}</div>
    <div id="wah-exp"></div>`;
  document.getElementById('wah-opts').addEventListener('click',e=>{const b=e.target.closest('[data-idx]');if(b)chooseWAHardQ(parseInt(b.dataset.idx));});
}
function chooseWAHardQ(chosen){
  const g=waHardState;if(g.answered)return;g.answered=true;
  const q=g.deck[g.idx],correct=g._correct,right=chosen===correct;
  recordGameAnswer('WA Deep Dive',q.q,g._opts[chosen]?.t||'',q.opts[q.ans],right);
  if(right)g.score++;
  document.querySelectorAll('#wah-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('wah-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${q.exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderWAHardQ();},right?1400:2400);
}
function renderWAHardEnd(){
  const g=waHardState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('wahard')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

// ═══════════════════════════════════════════════════
// HARD-TOPIC REFERENCE VIEWS
// ═══════════════════════════════════════════════════

function showPricingReference(){
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div style="font-size:15px;font-weight:600">EC2 Pricing Models</div>
      <button class="btn btn-ref" style="font-size:12px;padding:6px 12px" onclick="startGame('pricing')">Quiz me ⚡</button>
    </div>
    <div class="card" style="padding:12px;margin-bottom:10px;background:var(--surface2)">
      <div style="font-size:12px;color:var(--text2);line-height:1.6">The right pricing model can cut your EC2 bill by up to 90%. The key question is always: <strong>how predictable and fault-tolerant is the workload?</strong></div>
    </div>
    ${PRICING_MODELS.map(m=>`
      <div class="card" style="padding:14px;margin-bottom:10px;border-left:3px solid ${m.color}">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="font-size:26px">${m.icon}</div>
          <div style="font-size:15px;font-weight:600">${m.name}</div>
        </div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:8px;line-height:1.5">${m.summary}</div>
        <div style="font-size:12px;margin-bottom:4px"><span style="color:var(--pass);font-weight:600">✓ Use when:</span> <span style="color:var(--text2)">${m.use}</span></div>
        <div style="font-size:12px;margin-bottom:8px"><span style="color:var(--fail);font-weight:600">✗ Avoid when:</span> <span style="color:var(--text2)">${m.avoid}</span></div>
        <div style="font-size:12px;padding:8px;background:var(--ccp-dim,#fff3e0);border-radius:6px;border-left:2px solid var(--ccp)">
          <span style="font-weight:600;color:var(--ccp)">Key fact: </span><span style="color:var(--text2)">${m.keyFact}</span>
        </div>
      </div>`).join('')}`;
}

function showMigrationReference(){
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div style="font-size:15px;font-weight:600">Migration Strategies — The 6 Rs</div>
      <button class="btn btn-ref" style="font-size:12px;padding:6px 12px" onclick="startGame('migration')">Quiz me ⚡</button>
    </div>
    <div class="card" style="padding:12px;margin-bottom:10px;background:var(--surface2)">
      <div style="font-size:12px;color:var(--text2);line-height:1.6">The 6 Rs describe how to migrate each application from on-premises to cloud. In practice, 30–40% of apps are Rehosted, 10–20% are Retired, and the rest are spread across the other strategies.</div>
    </div>
    ${SIX_RS.map(r=>`
      <div class="card" style="padding:14px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
          <div style="font-size:26px">${r.icon}</div>
          <div><div style="font-size:15px;font-weight:600">${r.name}</div><span class="badge b-neutral" style="font-size:11px;margin-top:3px">${r.hint}</span></div>
        </div>
        <div style="font-size:13px;color:var(--text2);line-height:1.5">${r.desc}</div>
      </div>`).join('')}`;
}

function showDRReference(){
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div style="font-size:15px;font-weight:600">Disaster Recovery Strategies</div>
      <button class="btn btn-ref" style="font-size:12px;padding:6px 12px" onclick="startGame('dr')">Quiz me ⚡</button>
    </div>
    <div class="card" style="padding:12px;margin-bottom:10px;background:var(--surface2)">
      <div style="font-size:12px;color:var(--text2);line-height:1.6">DR strategies trade cost against RTO (Recovery Time Objective — how long to recover) and RPO (Recovery Point Objective — how much data loss is acceptable). Lower RTO/RPO = higher cost.</div>
    </div>
    ${DR_STRATEGIES.map((r,i)=>`
      <div class="card" style="padding:14px;margin-bottom:10px;border-left:3px solid ${['#4caf50','#ff9900','#e91e63','#9c27b0'][i]}">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="font-size:26px">${r.icon}</div>
          <div><div style="font-size:15px;font-weight:600">${r.name}</div>
          <span class="badge b-neutral" style="font-size:11px;margin-top:3px">${r.cost} cost</span></div>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:8px;flex-wrap:wrap">
          <span style="font-size:12px;font-family:'IBM Plex Mono',monospace;color:var(--text2)">RTO: <strong>${r.rto}</strong></span>
          <span style="font-size:12px;font-family:'IBM Plex Mono',monospace;color:var(--text2)">RPO: <strong>${r.rpo}</strong></span>
        </div>
        <div style="font-size:13px;color:var(--text2);line-height:1.5">${r.desc}</div>
      </div>`).join('')}
    <div class="card" style="padding:12px;background:var(--surface2)">
      <div class="section-title" style="margin-bottom:6px">Cost vs RTO/RPO at a glance</div>
      <div style="font-size:12px;color:var(--text2);font-family:'IBM Plex Mono',monospace;line-height:2">
        Backup &amp; Restore → Pilot Light → Warm Standby → Active/Active<br>
        Cost: $ → $$ → $$$ → $$$$<br>
        RTO: Hours → Minutes-Hours → Minutes → Near-zero<br>
        RPO: Hours → Minutes → Seconds → Near-zero
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════
// BEAT THE CLOCK — Hard CCP Sprint
// ═══════════════════════════════════════════════════

let beatClockState = {deck:[],idx:0,score:0,misses:0,timer:null,secs:10};

function startBeatClockGame(){
  clearInterval(beatClockState.timer);
  const hard = (typeof CCP_QUESTIONS!=='undefined' ? CCP_QUESTIONS : []).filter(q=>q.difficulty==='hard');
  beatClockState.deck=[...hard].sort(()=>Math.random()-.5);
  beatClockState.idx=0;beatClockState.score=0;beatClockState.misses=0;beatClockState.secs=10;
  renderBeatClockQ();
  beatClockState.timer=setInterval(beatClockTick,1000);
}
function beatClockTick(){
  beatClockState.secs--;
  const el=document.getElementById('beatclock-timer');
  if(el){el.textContent=beatClockState.secs+'s';el.style.color=beatClockState.secs<=3?'var(--fail)':'var(--text2)';}
  if(beatClockState.secs<=0) beatClockTimeout();
}
function beatClockTimeout(){
  clearInterval(beatClockState.timer);
  beatClockState.misses++;
  if(beatClockState.misses>=3){renderBeatClockEnd();return;}
  beatClockState.idx++;
  if(beatClockState.idx>=beatClockState.deck.length){renderBeatClockEnd();return;}
  beatClockState.secs=10;renderBeatClockQ();beatClockState.timer=setInterval(beatClockTick,1000);
}
function renderBeatClockQ(){
  const g=beatClockState,q=g.deck[g.idx];
  const opts=q.options.map((o,i)=>`<button class="btn" style="width:100%;text-align:left;margin-bottom:6px;font-size:13px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border)" onclick="chooseBeatClock(${i})">${o}</button>`).join('');
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="clearInterval(beatClockState.timer);renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:10px;align-items:center">
        <span style="font-size:14px">${'❤️'.repeat(3-g.misses)}${'🖤'.repeat(g.misses)}</span>
        <span id="beatclock-timer" style="font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:18px;color:var(--text2);min-width:28px">${g.secs}s</span>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span class="badge b-hard">Hard</span>
      <span style="font-size:12px;color:var(--text2);font-family:'IBM Plex Mono',monospace">${g.idx+1}/${g.deck.length} · Score: ${g.score}</span>
    </div>
    <div class="game-card" style="margin-bottom:10px;font-size:14px;line-height:1.6">${q.text}</div>
    ${opts}`;
}
function chooseBeatClock(chosen){
  clearInterval(beatClockState.timer);
  const g=beatClockState,q=g.deck[g.idx];
  const right=chosen===q.correct;
  if(right) g.score++; else g.misses++;
  recordGameAnswer('Beat the Clock',q.text,q.options[chosen],q.options[q.correct],right);
  const btns=document.querySelectorAll('#game-area .btn:not(.btn-ghost)');
  btns.forEach((b,i)=>{
    if(i===q.correct) b.style.background='var(--pass-dim)',b.style.borderColor='var(--pass)';
    else if(i===chosen&&!right) b.style.background='var(--fail-dim)',b.style.borderColor='var(--fail)';
    b.onclick=null;
  });
  const expDiv=document.createElement('div');
  expDiv.style.cssText='font-size:12px;color:var(--text2);margin-top:8px;padding:10px;background:var(--surface2);border-radius:8px;line-height:1.6';
  expDiv.textContent=q.explanation;
  document.getElementById('game-area').appendChild(expDiv);
  if(g.misses>=3){setTimeout(renderBeatClockEnd,1800);return;}
  g.idx++;
  if(g.idx>=g.deck.length){setTimeout(renderBeatClockEnd,1800);return;}
  setTimeout(()=>{g.secs=10;renderBeatClockQ();beatClockState.timer=setInterval(beatClockTick,1000);},right?900:1800);
}
function renderBeatClockEnd(){
  clearInterval(beatClockState.timer);const g=beatClockState;
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:40px;margin-bottom:8px">${g.score>=20?'🏆':g.score>=10?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${g.score}</div><div style="font-size:14px;color:var(--text2);margin-top:4px">Hard questions answered</div><div style="margin-top:8px"><span class="badge b-hard">${g.misses>=3?'Out of lives':'Deck complete'}</span></div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('beatclock')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

// ═══════════════════════════════════════════════════
// MONITORING MATCHUP
// ═══════════════════════════════════════════════════

const MONITORING_QS = [
  {q:'An application team wants to see CPU utilization, memory, and request count graphs for their EC2 instances over the last 7 days.',ans:'Amazon CloudWatch Metrics',opts:['Amazon CloudWatch Metrics','AWS CloudTrail','AWS X-Ray','Amazon Inspector'],exp:'CloudWatch Metrics collects and displays performance metrics (CPU, memory, network) over time with customizable dashboards and time ranges.'},
  {q:'A security auditor needs to know which IAM user deleted an S3 bucket at 3 AM last Tuesday.',ans:'AWS CloudTrail',opts:['AWS CloudTrail','Amazon CloudWatch Logs','Amazon GuardDuty','AWS Config'],exp:'CloudTrail records every API call — who made it, from what IP, at what time. It\'s the authoritative audit log for AWS account activity.'},
  {q:'A microservices application has intermittent latency spikes. The team needs to trace a single request as it flows through 8 downstream services to find which call is slow.',ans:'AWS X-Ray',opts:['AWS X-Ray','Amazon CloudWatch Metrics','AWS CloudTrail','Amazon Detective'],exp:'X-Ray provides distributed tracing — it instruments requests as they traverse multiple services, producing a service map and waterfall timeline showing exactly where time is spent.'},
  {q:'A compliance team needs continuous evidence that no S3 bucket has had public access enabled since last quarter.',ans:'AWS Config',opts:['AWS Config','AWS CloudTrail','Amazon Macie','Amazon CloudWatch'],exp:'AWS Config continuously records resource configuration state. Its compliance timeline shows whether a resource was compliant at any point in time — perfect for auditors.'},
  {q:'An EC2 instance is sending unusually large amounts of data to an external IP at 2 AM. The team wants real-time alerting on this behavior.',ans:'Amazon GuardDuty',opts:['Amazon GuardDuty','Amazon CloudWatch Alarms','Amazon Inspector','AWS CloudTrail'],exp:'GuardDuty uses ML to analyze VPC Flow Logs and DNS logs in real time, detecting threats like data exfiltration, compromised instances, and unusual network patterns.'},
  {q:'A developer wants to automatically restart an EC2 instance if its CPU goes above 95% for 5 consecutive minutes.',ans:'Amazon CloudWatch Alarms',opts:['Amazon CloudWatch Alarms','Amazon GuardDuty','AWS Systems Manager','AWS Config'],exp:'CloudWatch Alarms monitor a metric and trigger actions (SNS notification, Auto Scaling policy, EC2 action) when a threshold is breached for a specified period.'},
  {q:'A security team wants to know if any EC2 instances have critical CVEs or missing patches.',ans:'Amazon Inspector',opts:['Amazon Inspector','Amazon GuardDuty','AWS Config','AWS Security Hub'],exp:'Amazon Inspector is a vulnerability management service that automatically scans EC2 instances and container images for software vulnerabilities (CVEs) and network exposure.'},
  {q:'A Lambda function is throwing exceptions and the team needs to search the error messages logged by the function.',ans:'Amazon CloudWatch Logs',opts:['Amazon CloudWatch Logs','AWS CloudTrail','AWS X-Ray','Amazon Kinesis'],exp:'Lambda automatically publishes logs to CloudWatch Logs. You can query, filter, and search log groups using CloudWatch Logs Insights for fast log analysis.'},
  {q:'A team wants a single dashboard showing security findings from GuardDuty, Inspector, and Macie across 15 accounts.',ans:'AWS Security Hub',opts:['AWS Security Hub','AWS Control Tower','Amazon CloudWatch','AWS Trusted Advisor'],exp:'Security Hub aggregates findings from multiple AWS security services into a single normalized view across accounts, with compliance standards mapping.'},
  {q:'Developers need to understand why a distributed API call took 2.3 seconds — broken down by service, database query, and external call.',ans:'AWS X-Ray',opts:['AWS X-Ray','Amazon CloudWatch Metrics','AWS CloudTrail','Amazon Detective'],exp:'X-Ray\'s service map and trace viewer shows every segment and subsegment of a request, with timing for each downstream call including DynamoDB queries and HTTP requests.'},
  {q:'A company suspects an EC2 instance was compromised last week. They need to reconstruct exactly which API calls it made using its IAM role.',ans:'AWS CloudTrail',opts:['AWS CloudTrail','Amazon GuardDuty','VPC Flow Logs','Amazon Detective'],exp:'CloudTrail logs include the caller identity (the IAM role on the EC2 instance), the API action, and timestamp. You can filter by principal to reconstruct what an instance did.'},
  {q:'An S3 bucket may contain customer PII that was accidentally uploaded. The team needs to automatically classify and flag it.',ans:'Amazon Macie',opts:['Amazon Macie','Amazon Inspector','AWS Config','Amazon GuardDuty'],exp:'Macie uses ML to automatically discover and classify sensitive data (PII, financial data, credentials) in S3 buckets, flagging findings for review.'},
];

let monitoringState = {deck:[],idx:0,score:0,answered:false};

function startMonitoringGame(){
  monitoringState.deck=[...MONITORING_QS].sort(()=>Math.random()-.5);
  monitoringState.idx=0;monitoringState.score=0;
  renderMonitoringQ();
}
function renderMonitoringQ(){
  const g=monitoringState,q=g.deck[g.idx];
  const opts=q.opts.map((o,i)=>`<button class="btn" style="width:100%;text-align:left;margin-bottom:6px;font-size:13px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border)" onclick="chooseMonitoringQ(${i})">${o}</button>`).join('');
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <span style="font-size:12px;color:var(--text2);font-family:'IBM Plex Mono',monospace">${g.idx+1}/${g.deck.length} · Score: ${g.score}</span>
    </div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:8px">Which AWS observability service fits this scenario?</div>
    <div class="game-card" style="margin-bottom:10px;font-size:14px;line-height:1.6">${q.q}</div>
    ${opts}`;
}
function chooseMonitoringQ(chosen){
  const g=monitoringState,q=g.deck[g.idx];
  const right=q.opts[chosen]===q.ans;
  if(right) g.score++;
  recordGameAnswer('Monitoring Matchup',q.q,q.opts[chosen],q.ans,right);
  const btns=document.querySelectorAll('#game-area .btn:not(.btn-ghost)');
  btns.forEach((b,i)=>{
    if(q.opts[i]===q.ans) b.style.background='var(--pass-dim)',b.style.borderColor='var(--pass)';
    else if(i===chosen&&!right) b.style.background='var(--fail-dim)',b.style.borderColor='var(--fail)';
    b.onclick=null;
  });
  const expDiv=document.createElement('div');
  expDiv.style.cssText='font-size:12px;color:var(--text2);margin-top:8px;padding:10px;background:var(--surface2);border-radius:8px;line-height:1.6';
  expDiv.textContent=q.exp;
  const nextBtn=document.createElement('button');
  nextBtn.className='btn btn-game';nextBtn.style.cssText='width:100%;margin-top:10px';
  nextBtn.textContent=g.idx+1<g.deck.length?'Next →':'See Results';
  nextBtn.onclick=()=>{g.idx++;g.idx<g.deck.length?renderMonitoringQ():renderMonitoringEnd();};
  document.getElementById('game-area').appendChild(expDiv);
  document.getElementById('game-area').appendChild(nextBtn);
}
function renderMonitoringEnd(){
  const g=monitoringState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('monitoring')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showMonitoringReference()">Study Monitoring</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

const MONITORING_SERVICES = [
  {name:'CloudWatch Metrics',icon:'📈',color:'#ff9900',use:'Performance monitoring — CPU, memory, network, custom metrics. Dashboards, alarms, auto-scaling triggers.',not:'API audit logs, request tracing, vulnerability scanning.',tip:'Default metrics are free; detailed (1-min) metrics cost extra. Custom metrics use PutMetricData API.'},
  {name:'CloudWatch Logs',icon:'📋',color:'#ff9900',use:'Log storage and search — application logs, Lambda output, VPC Flow Logs, CloudTrail events.',not:'Performance dashboards, security threat detection, compliance snapshots.',tip:'Use CloudWatch Logs Insights for SQL-like queries across log groups.'},
  {name:'CloudWatch Alarms',icon:'🔔',color:'#ff9900',use:'Threshold-based alerting — trigger SNS, Auto Scaling, or EC2 actions when a metric crosses a value.',not:'Log search, tracing, audit logs — alarms react to metrics only.',tip:'Composite Alarms combine multiple alarms with AND/OR logic to reduce alert noise.'},
  {name:'AWS CloudTrail',icon:'🔍',color:'#2196f3',use:'API audit log — who called what AWS API, from where, when. Governance, compliance, forensics.',not:'Application performance metrics, log search, request tracing.',tip:'CloudTrail logs are delivered to S3 within 15 min. Enable log file validation to detect tampering.'},
  {name:'AWS X-Ray',icon:'🔦',color:'#9c27b0',use:'Distributed tracing — follow a request across Lambda, ECS, API Gateway, DynamoDB. Latency breakdown.',not:'Infrastructure metrics, audit logging, security threat detection.',tip:'Instrument your code with the X-Ray SDK. Use sampling rules to control cost on high-traffic apps.'},
  {name:'AWS Config',icon:'🗂️',color:'#4caf50',use:'Configuration compliance — records resource config history, evaluates against rules, shows compliance timeline.',not:'Real-time threat detection, performance monitoring, application logs.',tip:'Config Rules can be AWS-managed (e.g., restricted-ssh) or custom Lambda-based. Conformance Packs bundle rules.'},
  {name:'Amazon GuardDuty',icon:'🛡️',color:'#e91e63',use:'Threat detection — analyzes CloudTrail, VPC Flow Logs, DNS logs with ML to find malicious activity.',not:'Vulnerability scanning, compliance snapshots, application performance.',tip:'Enable in all regions. Findings are severity-rated. Integrate with Security Hub for central visibility.'},
  {name:'Amazon Inspector',icon:'🔬',color:'#00bcd4',use:'Vulnerability management — scans EC2 and container images for CVEs, network exposure, unpatched packages.',not:'Threat detection, audit logging, performance monitoring.',tip:'Inspector v2 is agentless for container images and continuously rescans as new CVEs are published.'},
  {name:'Amazon Macie',icon:'🔒',color:'#795548',use:'Sensitive data discovery — finds PII, credentials, financial data in S3 using ML classification.',not:'Network threat detection, performance monitoring, API audit.',tip:'Macie findings include the S3 path and sample data. Integrate with Security Hub to centralize findings.'},
];

function showMonitoringReference(){
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div style="font-size:15px;font-weight:600">Monitoring & Observability</div>
      <button class="btn btn-ref" style="font-size:12px;padding:6px 12px" onclick="startGame('monitoring')">Quiz me ⚡</button>
    </div>
    ${MONITORING_SERVICES.map(s=>`
      <div class="card" style="padding:14px;margin-bottom:10px;border-left:3px solid ${s.color}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:22px">${s.icon}</span>
          <span style="font-size:15px;font-weight:600">${s.name}</span>
        </div>
        <div style="font-size:12px;margin-bottom:4px"><span style="color:var(--pass);font-weight:600">Use when: </span><span style="color:var(--text2)">${s.use}</span></div>
        <div style="font-size:12px;margin-bottom:6px"><span style="color:var(--fail);font-weight:600">Not for: </span><span style="color:var(--text2)">${s.not}</span></div>
        <div style="font-size:11px;color:var(--text3);font-style:italic">💡 ${s.tip}</div>
      </div>`).join('')}`;
}

// ═══════════════════════════════════════════════════
// GLOBAL INFRASTRUCTURE QUIZ
// ═══════════════════════════════════════════════════

const GLOBAL_INFRA_QS = [
  {q:'A company wants to deploy their application so that users in Europe experience low latency without setting up a separate full environment. Which AWS infrastructure component brings compute closest to European users?',ans:'AWS Region (eu-west-1)',opts:['AWS Region (eu-west-1)','Edge Location (CloudFront PoP)','AWS Local Zone','AWS Availability Zone'],exp:'A Region is the right answer for running compute — it\'s a full set of AZs with all AWS services. Edge Locations only cache content (CloudFront/Route 53 DNS), not run EC2 or RDS.'},
  {q:'A financial services company must store and process all data within a single country for data sovereignty regulations. Which AWS concept directly enables this?',ans:'AWS Region',opts:['AWS Region','Availability Zone','Edge Location','AWS Global Accelerator'],exp:'AWS Regions are geographic areas (e.g., eu-central-1 in Frankfurt). Data never leaves a Region unless you explicitly enable cross-region features. Regions are the unit of data residency.'},
  {q:'An application uses Amazon CloudFront to cache images globally. What are the locations where CloudFront actually caches and serves content to end users?',ans:'Edge Locations',opts:['Edge Locations','AWS Regions','Availability Zones','Local Zones'],exp:'CloudFront has 400+ Edge Locations worldwide. When a user requests cached content, CloudFront serves it from the nearest Edge Location — no origin fetch needed after the first request.'},
  {q:'A team is designing for high availability within a single AWS Region. Which infrastructure component should they spread their EC2 instances across?',ans:'Availability Zones',opts:['Availability Zones','Edge Locations','Local Zones','Wavelength Zones'],exp:'Availability Zones are isolated data center clusters within a Region. Each AZ has independent power, cooling, and networking. Spreading across AZs means a failure in one AZ doesn\'t affect the others.'},
  {q:'A media company needs to run latency-sensitive real-time video rendering workloads for a studio in Los Angeles, but the nearest full AWS Region is too far. Which option brings AWS compute to within single-digit milliseconds?',ans:'AWS Local Zone',opts:['AWS Local Zone','AWS Region','Edge Location','Wavelength Zone'],exp:'Local Zones are extensions of a Region placed in major metro areas (e.g., LA, Chicago). They run a subset of AWS services (EC2, EBS, ELB) at very low latency from that city — ideal for latency-sensitive workloads.'},
  {q:'A telecom company building a 5G mobile game needs sub-10ms latency from their application to mobile devices on the carrier network. Which AWS infrastructure serves this need?',ans:'AWS Wavelength Zones',opts:['AWS Wavelength Zones','AWS Local Zone','Edge Location','AWS Region'],exp:'Wavelength Zones embed AWS compute and storage within 5G carrier networks. Applications run at the network edge, giving mobile devices single-digit millisecond access without traffic leaving the carrier network.'},
  {q:'Which of the following AWS services is GLOBAL in scope — meaning a single configuration applies across all Regions automatically?',ans:'AWS IAM',opts:['AWS IAM','Amazon EC2','Amazon S3','Amazon VPC'],exp:'IAM is global — users, roles, and policies apply across all regions in your account. EC2, S3 buckets, and VPCs are all regional resources that exist in a specific region.'},
  {q:'A user creates an EC2 instance in us-east-1a. Another user creates one in us-east-1b. What is the relationship between these two instances\' Availability Zones?',ans:'They are in separate, isolated AZs that may span different physical data centers, providing fault isolation',opts:['They are in separate, isolated AZs that may span different physical data centers, providing fault isolation','They are in the same data center but on different racks for hardware diversity','They are in the same AZ but identified differently for routing purposes','us-east-1a is always closer to the internet edge than us-east-1b'],exp:'AZ identifiers (1a, 1b, 1c) are mapped differently per AWS account to distribute traffic. Two accounts\'s "us-east-1a" may point to different physical facilities. AZs are genuinely isolated data center clusters.'},
  {q:'Amazon Route 53 is described as a global service. What does this mean in practice for DNS record management?',ans:'Route 53 hosted zones and records are managed globally from a single control plane — changes propagate to all edge locations automatically',opts:['Route 53 hosted zones and records are managed globally from a single control plane — changes propagate to all edge locations automatically','You must create a separate hosted zone in each Region where your application runs','Route 53 only works within a single AWS Region and requires CloudFront for global reach','Route 53 records are Region-specific and must be replicated manually to other regions'],exp:'Route 53 is a global service — you manage all DNS records in one place and AWS propagates them to its global DNS infrastructure (Edge Locations) automatically within 60 seconds.'},
  {q:'A company wants to serve static website content from S3 with low latency globally. Which combination correctly describes the scope of the services involved?',ans:'S3 bucket is regional; CloudFront distribution is global with edge caching at 400+ locations',opts:['S3 bucket is regional; CloudFront distribution is global with edge caching at 400+ locations','S3 bucket is global; CloudFront is regional and must be deployed per-region','Both S3 and CloudFront are global services with no region selection required','S3 is zonal; CloudFront is regional — one distribution per AWS Region needed'],exp:'S3 buckets are created in a specific region (though object names are globally unique). CloudFront is a global service — one distribution distributes content from whichever edge location is closest to each user.'},
];

let globalInfraState = {deck:[],idx:0,score:0};

function startGlobalInfraGame(){
  globalInfraState.deck=[...GLOBAL_INFRA_QS].sort(()=>Math.random()-.5);
  globalInfraState.idx=0;globalInfraState.score=0;
  renderGlobalInfraQ();
}
function renderGlobalInfraQ(){
  const g=globalInfraState,q=g.deck[g.idx];
  const opts=q.opts.map((o,i)=>`<button class="btn" style="width:100%;text-align:left;margin-bottom:6px;font-size:13px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border)" onclick="chooseGlobalInfra(${i})">${o}</button>`).join('');
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <span style="font-size:12px;color:var(--text2);font-family:'IBM Plex Mono',monospace">${g.idx+1}/${g.deck.length} · Score: ${g.score}</span>
    </div>
    <div class="game-card" style="margin-bottom:10px;font-size:14px;line-height:1.6">${q.q}</div>
    ${opts}`;
}
function chooseGlobalInfra(chosen){
  const g=globalInfraState,q=g.deck[g.idx];
  const right=q.opts[chosen]===q.ans;
  if(right) g.score++;
  recordGameAnswer('Global Infrastructure',q.q,q.opts[chosen],q.ans,right);
  const btns=document.querySelectorAll('#game-area .btn:not(.btn-ghost)');
  btns.forEach((b,i)=>{
    if(q.opts[i]===q.ans) b.style.background='var(--pass-dim)',b.style.borderColor='var(--pass)';
    else if(i===chosen&&!right) b.style.background='var(--fail-dim)',b.style.borderColor='var(--fail)';
    b.onclick=null;
  });
  const expDiv=document.createElement('div');
  expDiv.style.cssText='font-size:12px;color:var(--text2);margin-top:8px;padding:10px;background:var(--surface2);border-radius:8px;line-height:1.6';
  expDiv.textContent=q.exp;
  const nextBtn=document.createElement('button');
  nextBtn.className='btn btn-game';nextBtn.style.cssText='width:100%;margin-top:10px';
  nextBtn.textContent=g.idx+1<g.deck.length?'Next →':'See Results';
  nextBtn.onclick=()=>{g.idx++;g.idx<g.deck.length?renderGlobalInfraQ():renderGlobalInfraEnd();};
  document.getElementById('game-area').appendChild(expDiv);
  document.getElementById('game-area').appendChild(nextBtn);
}
function renderGlobalInfraEnd(){
  const g=globalInfraState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('globalinfra')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showGlobalInfraReference()">Study Global Infra</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

const GLOBAL_INFRA_CONCEPTS = [
  {name:'AWS Region',icon:'🌐',scope:'Geographic',detail:'A physical location containing 3+ AZs. All data stays in-Region unless you explicitly enable cross-region features. Choose based on latency, compliance, and service availability.',examples:'us-east-1 (N. Virginia), eu-west-1 (Ireland), ap-southeast-1 (Singapore)'},
  {name:'Availability Zone (AZ)',icon:'🏢',scope:'Within Region',detail:'One or more discrete data centers with redundant power, cooling, and networking. AZs in a Region are connected by low-latency links but are physically isolated from each other.',examples:'us-east-1a, us-east-1b, us-east-1c — actual physical locations differ per account'},
  {name:'Edge Location',icon:'📡',scope:'Global (400+)',detail:'Points of presence for CloudFront CDN and Route 53 DNS. Caches content close to users. NOT for running EC2 or databases — only for content delivery and DNS.',examples:'Cities: Tokyo, London, São Paulo, Lagos, 400+ locations worldwide'},
  {name:'Regional Edge Cache',icon:'🗄️',scope:'Global (13)',detail:'Larger CloudFront caches that sit between Edge Locations and your origin. Objects too infrequently accessed for Edge Locations are cached here before fetching from origin.',examples:'Fewer locations than Edge Locations but larger cache capacity'},
  {name:'AWS Local Zone',icon:'📍',scope:'Metro cities',detail:'Extension of a Region into a major city. Runs EC2, EBS, ELB, and a subset of AWS services with single-digit ms latency to that city. Ideal for latency-sensitive workloads.',examples:'Los Angeles, Dallas, Chicago, Boston, Miami, and more'},
  {name:'AWS Wavelength Zone',icon:'📶',scope:'5G networks',detail:'AWS compute embedded inside telecom 5G networks. Applications run at the network edge — mobile devices connect without leaving the carrier network. Sub-10ms latency.',examples:'Verizon (US), SK Telecom (Korea), Vodafone (UK/Germany), KDDI (Japan)'},
  {name:'Global Services',icon:'🌍',scope:'All Regions',detail:'IAM, Route 53, CloudFront, AWS Organizations, and AWS WAF (when attached to CloudFront) are global — one configuration applies everywhere.',examples:'IAM users/roles apply in all regions. Route 53 zones propagate globally automatically.'},
];

function showGlobalInfraReference(){
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div style="font-size:15px;font-weight:600">AWS Global Infrastructure</div>
      <button class="btn btn-ref" style="font-size:12px;padding:6px 12px" onclick="startGame('globalinfra')">Quiz me ⚡</button>
    </div>
    ${GLOBAL_INFRA_CONCEPTS.map(c=>`
      <div class="card" style="padding:14px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="font-size:22px">${c.icon}</span>
          <div><div style="font-size:15px;font-weight:600">${c.name}</div>
          <span class="badge b-neutral" style="font-size:10px">${c.scope}</span></div>
        </div>
        <div style="font-size:13px;color:var(--text2);line-height:1.5;margin-bottom:6px">${c.detail}</div>
        <div style="font-size:11px;color:var(--text3)">e.g. ${c.examples}</div>
      </div>`).join('')}`;
}

// ═══════════════════════════════════════════════════
// CONTAINER SHOWDOWN
// ═══════════════════════════════════════════════════

const CONTAINER_QS = [
  {q:'A team already uses Kubernetes in production on-premises and wants to migrate to AWS with minimal tool changes. Their ops team knows kubectl and Helm.',ans:'Amazon EKS',opts:['Amazon EKS','Amazon ECS','AWS Fargate','AWS Lambda'],exp:'EKS is a managed Kubernetes service — the team\'s existing kubectl commands, Helm charts, and Kubernetes manifests work as-is. ECS uses a different (simpler) orchestration model that would require relearning.'},
  {q:'A startup wants to run microservices in containers but their small team has no desire to manage EC2 clusters, patch nodes, or think about capacity. They want AWS to handle all the infrastructure.',ans:'AWS Fargate',opts:['AWS Fargate','Amazon ECS on EC2','Amazon EKS on EC2','Amazon EC2 Auto Scaling'],exp:'Fargate is serverless for containers — you define tasks (CPU/memory), and AWS runs them with no underlying EC2 nodes to manage. The team writes container definitions, not server configs.'},
  {q:'An event-driven function processes incoming webhook notifications. Each execution takes under 30 seconds and is triggered by an HTTP request. The workload is highly variable — 0 to 10,000 per day.',ans:'AWS Lambda',opts:['AWS Lambda','AWS Fargate','Amazon ECS','Amazon EKS'],exp:'Lambda is ideal: event-driven, sub-15-minute execution, scales from 0 to thousands instantly, pay per 100ms. Containers would over-engineer this. Lambda@Edge or function URLs handle the HTTP trigger.'},
  {q:'A company runs a containerized web application using Docker Compose today. They want to move to AWS with the simplest possible migration — just deploy their Docker containers without any Kubernetes knowledge.',ans:'Amazon ECS',opts:['Amazon ECS','Amazon EKS','AWS Lambda','AWS Batch'],exp:'ECS is simpler than Kubernetes for teams new to container orchestration. It uses task definitions (similar to Docker Compose) and integrates natively with ALB, IAM, CloudWatch, and ECR. No k8s concepts needed.'},
  {q:'A team wants to run a web application on AWS with the least operational overhead — they don\'t want to manage containers, servers, or scaling. They just want to deploy their application code.',ans:'AWS Elastic Beanstalk',opts:['AWS Elastic Beanstalk','Amazon ECS','Amazon EKS','AWS Fargate'],exp:'Elastic Beanstalk is a PaaS — you upload code and AWS handles provisioning EC2, load balancers, auto-scaling, and health monitoring. No container knowledge needed. Best for teams who want to focus on code, not infrastructure.'},
  {q:'A data science team needs to run hundreds of short-lived container jobs in parallel for nightly ML batch processing. Each job is independent and runs for 20 minutes.',ans:'AWS Fargate',opts:['AWS Fargate','AWS Lambda','Amazon ECS on EC2','Amazon EKS on EC2'],exp:'Fargate is ideal for batch jobs — runs containers without managing EC2, scales to hundreds of parallel tasks, and charges only for the duration tasks run. Lambda has a 15-minute timeout making it unsuitable for 20-minute jobs.'},
  {q:'A gaming company has a backend service that must maintain a persistent TCP connection per player (no HTTP). The service is stateful and must run continuously in a container.',ans:'Amazon ECS',opts:['Amazon ECS','AWS Lambda','AWS Fargate on ECS','Amazon EKS'],exp:'Both ECS and Fargate on ECS work here — the key is that Fargate on ECS handles serverless persistent TCP containers. Lambda is HTTP-only (invocation model) and stateless. ECS (either launch type) supports long-running stateful services.'},
  {q:'A company is building a new container-based application from scratch with no existing container tooling. They have a small team and want native AWS integration with IAM, CloudWatch, and ALB.',ans:'Amazon ECS',opts:['Amazon ECS','Amazon EKS','AWS Lambda','AWS Batch'],exp:'ECS has the deepest native AWS integration — IAM task roles, CloudWatch Container Insights, and ALB target group registration all work out of the box. EKS requires additional configuration for AWS-native integrations.'},
  {q:'A financial services company has strict security requirements and needs to run each customer\'s workload on completely dedicated physical hardware — no sharing with other customers.',ans:'Amazon EC2 Dedicated Host with ECS',opts:['Amazon EC2 Dedicated Host with ECS','AWS Fargate','Amazon EKS with shared nodes','Amazon ECS with shared EC2'],exp:'Dedicated Hosts provide a physical EC2 server dedicated to one account. Running ECS on Dedicated Hosts gives container workloads dedicated physical isolation. Fargate runs on shared AWS infrastructure (though isolated per task).'},
  {q:'A team\'s Lambda functions are experiencing cold start latency of 800ms on the first invocation. Which compute option would eliminate cold starts while keeping the serverless deployment model?',ans:'AWS Lambda with Provisioned Concurrency',opts:['AWS Lambda with Provisioned Concurrency','Switch to AWS Fargate','Switch to Amazon ECS on EC2','Add more Lambda memory'],exp:'Lambda Provisioned Concurrency pre-initializes execution environments so they respond immediately with no cold start. Switching to Fargate or ECS trades one complexity (cold starts) for another (container management). More memory speeds up execution but doesn\'t eliminate initialization time.'},
];

const CONTAINER_TYPES = [
  {name:'Amazon ECS',icon:'📦',color:'#ff9900',when:'Native AWS container orchestration. Simple, deep AWS integration. Best for teams not using Kubernetes.',not:'Teams already on Kubernetes who want to keep k8s APIs.',tip:'Task definitions = Docker Compose equivalent. Runs on EC2 or Fargate.'},
  {name:'Amazon EKS',icon:'☸️',color:'#326ce5',when:'Kubernetes workloads. Teams who know kubectl/Helm. Multi-cloud portability needs.',not:'Teams new to containers who will spend more time on k8s than on their app.',tip:'Managed control plane — AWS runs the k8s master nodes. You manage (or Fargate manages) worker nodes.'},
  {name:'AWS Fargate',icon:'🚀',color:'#9c27b0',when:'Serverless containers — no EC2 to manage. Works with both ECS and EKS. Scales to zero.',not:'GPU workloads, workloads needing host-level networking, or where per-task overhead matters.',tip:'Pay per vCPU/memory second. No idle instance costs. Cold start is seconds, not ms.'},
  {name:'AWS Lambda',icon:'λ',color:'#ff9900',when:'Event-driven functions under 15 min. HTTP triggers, S3 events, DynamoDB Streams, SQS, etc.',not:'Long-running processes, persistent connections, heavy container images (>250MB unzipped).',tip:'1ms billing granularity. Scales to 1,000 concurrent executions by default. Provisioned Concurrency eliminates cold starts.'},
  {name:'Elastic Beanstalk',icon:'🌱',color:'#4caf50',when:'PaaS for developers who want to deploy code without managing infrastructure. Supports Docker.',not:'Teams needing fine-grained infrastructure control or using Kubernetes.',tip:'Manages EC2, ALB, auto-scaling, CloudWatch automatically. You still own the EC2 instances under the hood.'},
];

let containersState = {deck:[],idx:0,score:0};

function startContainersGame(){
  containersState.deck=[...CONTAINER_QS].sort(()=>Math.random()-.5);
  containersState.idx=0;containersState.score=0;
  renderContainersQ();
}
function renderContainersQ(){
  const g=containersState,q=g.deck[g.idx];
  const opts=q.opts.map((o,i)=>`<button class="btn" style="width:100%;text-align:left;margin-bottom:6px;font-size:13px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border)" onclick="chooseContainersQ(${i})">${o}</button>`).join('');
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <span style="font-size:12px;color:var(--text2);font-family:'IBM Plex Mono',monospace">${g.idx+1}/${g.deck.length} · Score: ${g.score}</span>
    </div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:8px">Pick the right compute/container service for this workload.</div>
    <div class="game-card" style="margin-bottom:10px;font-size:14px;line-height:1.6">${q.q}</div>
    ${opts}`;
}
function chooseContainersQ(chosen){
  const g=containersState,q=g.deck[g.idx];
  const right=q.opts[chosen]===q.ans;
  if(right) g.score++;
  recordGameAnswer('Container Showdown',q.q,q.opts[chosen],q.ans,right);
  const btns=document.querySelectorAll('#game-area .btn:not(.btn-ghost)');
  btns.forEach((b,i)=>{
    if(q.opts[i]===q.ans) b.style.background='var(--pass-dim)',b.style.borderColor='var(--pass)';
    else if(i===chosen&&!right) b.style.background='var(--fail-dim)',b.style.borderColor='var(--fail)';
    b.onclick=null;
  });
  const expDiv=document.createElement('div');
  expDiv.style.cssText='font-size:12px;color:var(--text2);margin-top:8px;padding:10px;background:var(--surface2);border-radius:8px;line-height:1.6';
  expDiv.textContent=q.exp;
  const nextBtn=document.createElement('button');
  nextBtn.className='btn btn-game';nextBtn.style.cssText='width:100%;margin-top:10px';
  nextBtn.textContent=g.idx+1<g.deck.length?'Next →':'See Results';
  nextBtn.onclick=()=>{g.idx++;g.idx<g.deck.length?renderContainersQ():renderContainersEnd();};
  document.getElementById('game-area').appendChild(expDiv);
  document.getElementById('game-area').appendChild(nextBtn);
}
function renderContainersEnd(){
  const g=containersState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('containers')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showContainersReference()">Study Containers</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

function showContainersReference(){
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderRefMenu()">← Back to References</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div style="font-size:15px;font-weight:600">Containers & Compute</div>
      <button class="btn btn-ref" style="font-size:12px;padding:6px 12px" onclick="startGame('containers')">Quiz me ⚡</button>
    </div>
    ${CONTAINER_TYPES.map(c=>`
      <div class="card" style="padding:14px;margin-bottom:10px;border-left:3px solid ${c.color}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:22px">${c.icon}</span>
          <span style="font-size:15px;font-weight:600">${c.name}</span>
        </div>
        <div style="font-size:12px;margin-bottom:4px"><span style="color:var(--pass);font-weight:600">Use when: </span><span style="color:var(--text2)">${c.when}</span></div>
        <div style="font-size:12px;margin-bottom:6px"><span style="color:var(--fail);font-weight:600">Not when: </span><span style="color:var(--text2)">${c.not}</span></div>
        <div style="font-size:11px;color:var(--text3);font-style:italic">💡 ${c.tip}</div>
      </div>`).join('')}`;
}

// ═══════════════════════════════════════════════════
// CLOUD ECONOMICS SORTER
// ═══════════════════════════════════════════════════

const ECONOMICS_STATEMENTS = [
  {stmt:'Purchasing 300 physical servers upfront to build a new data center',cat:'CapEx',exp:'Buying hardware outright is a capital expenditure — large upfront cost, depreciated over time.'},
  {stmt:'Paying AWS for EC2 hours consumed this month',cat:'OpEx',exp:'Cloud compute is an operational expense — you pay as you consume, no asset ownership.'},
  {stmt:'AWS buys hardware in bulk across millions of customers, passing savings to you',cat:'Economies of Scale',exp:'AWS\'s scale of purchasing and operations reduces costs per unit — a core cloud benefit.'},
  {stmt:'Spinning up a new server in 3 minutes to test a hypothesis',cat:'Agility',exp:'Cloud agility: the ability to provision resources almost instantly to experiment or respond.'},
  {stmt:'Paying for a 3-year Reserved Instance commitment',cat:'CapEx',exp:'A Reserved Instance is a 1 or 3-year commitment — it behaves like CapEx: pay upfront (or monthly) for guaranteed capacity.'},
  {stmt:'Your AWS bill varies each month based on actual traffic and usage',cat:'OpEx',exp:'Variable pay-per-use billing is the defining characteristic of cloud OpEx: costs flex with demand.'},
  {stmt:'Deploying identical infrastructure in Tokyo in 10 minutes',cat:'Agility',exp:'"Go global in minutes" is a key cloud agility advantage — impossible with on-premises hardware.'},
  {stmt:'AWS operates millions of servers, so each unit of compute costs less than a single company could achieve',cat:'Economies of Scale',exp:'Economies of scale mean AWS\'s per-unit cost drops as volume grows — customers benefit directly.'},
  {stmt:'Annual software license fee paid to a vendor',cat:'CapEx',exp:'Traditional software licenses are CapEx: one-time or annual fixed costs, often paid regardless of usage.'},
  {stmt:'Paying per-GB for data transferred out of AWS each month',cat:'OpEx',exp:'Per-unit consumption pricing — pay only for what you transfer — is pure operational expenditure.'},
  {stmt:'Replacing a $2M data center investment with a monthly cloud bill',cat:'OpEx',exp:'Moving from CapEx (owned hardware) to OpEx (cloud subscription) is the fundamental financial shift of cloud adoption.'},
  {stmt:'AWS manages cooling, power, and physical security — you just pay usage fees',cat:'Economies of Scale',exp:'AWS amortizes physical infrastructure costs across all customers — you benefit without owning facilities.'},
  {stmt:'Automatically adding 10 more servers during a flash sale, then removing them after',cat:'Agility',exp:'Elastic scaling based on demand — cloud agility at its core. Impossible without cloud elasticity.'},
  {stmt:'Hiring 5 extra IT staff to manage on-premises server hardware',cat:'CapEx',exp:'Staff costs for infrastructure management are CapEx-adjacent hidden costs that TCO analysis must include.'},
  {stmt:'AWS passing lower storage costs to customers as S3 usage grows across billions of objects globally',cat:'Economies of Scale',exp:'S3 tiered pricing decreases per-GB as AWS\'s total stored data grows — economies of scale in action.'},
];

const ECONOMICS_CATEGORIES = ['CapEx','OpEx','Economies of Scale','Agility'];
const ECONOMICS_COLORS = {CapEx:'#e91e63',OpEx:'#2196f3','Economies of Scale':'#4caf50',Agility:'#ff9900'};

let economicsState = {deck:[],idx:0,score:0,secs:5,timer:null};

function startEconomicsGame(){
  clearInterval(economicsState.timer);
  economicsState.deck=[...ECONOMICS_STATEMENTS].sort(()=>Math.random()-.5);
  economicsState.idx=0;economicsState.score=0;
  renderEconomicsQ();
}
function renderEconomicsQ(){
  const g=economicsState;
  if(g.idx>=g.deck.length){renderEconomicsEnd();return;}
  const stmt=g.deck[g.idx];
  g.secs=5;
  clearInterval(g.timer);
  g.timer=setInterval(()=>{
    g.secs--;
    const el=document.getElementById('econ-timer');
    if(el){el.textContent=g.secs+'s';el.style.color=g.secs<=2?'var(--fail)':'var(--text2)';}
    if(g.secs<=0){clearInterval(g.timer);econTimeout();}
  },1000);
  const cats=ECONOMICS_CATEGORIES.map(c=>`<button class="btn" style="flex:1;min-width:calc(50% - 4px);padding:12px 8px;font-size:13px;font-weight:600;background:${ECONOMICS_COLORS[c]}20;border:2px solid ${ECONOMICS_COLORS[c]};color:${ECONOMICS_COLORS[c]}" onclick="chooseEconomics('${c}')">${c}</button>`).join('');
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="clearInterval(economicsState.timer);renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:10px;align-items:center">
        <span id="econ-timer" style="font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:18px;color:var(--text2)">${g.secs}s</span>
        <span style="font-size:12px;color:var(--text2);font-family:'IBM Plex Mono',monospace">${g.idx+1}/${g.deck.length} · ${g.score} ✓</span>
      </div>
    </div>
    <div class="game-card" style="margin-bottom:14px;font-size:15px;line-height:1.6;min-height:60px">"${stmt.stmt}"</div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:10px;text-align:center">Classify this statement:</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">${cats}</div>`;
}
function econTimeout(){
  const g=economicsState,stmt=g.deck[g.idx];
  showEconResult(null,stmt.cat,stmt.exp);
}
function chooseEconomics(cat){
  clearInterval(economicsState.timer);
  const g=economicsState,stmt=g.deck[g.idx];
  const right=cat===stmt.cat;
  if(right) g.score++;
  recordGameAnswer('Cloud Economics',stmt.stmt,cat,stmt.cat,right);
  showEconResult(cat,stmt.cat,stmt.exp);
}
function showEconResult(chosen,correct,exp){
  const g=economicsState;
  const cats=ECONOMICS_CATEGORIES.map(c=>{
    let style=`flex:1;min-width:calc(50% - 4px);padding:12px 8px;font-size:13px;font-weight:600;`;
    if(c===correct) style+=`background:var(--pass-dim);border:2px solid var(--pass);color:var(--pass)`;
    else if(c===chosen&&c!==correct) style+=`background:var(--fail-dim);border:2px solid var(--fail);color:var(--fail)`;
    else style+=`background:${ECONOMICS_COLORS[c]}10;border:2px solid var(--border);color:var(--text3)`;
    return `<button class="btn" style="${style}" disabled>${c}${c===correct?' ✓':''}</button>`;
  }).join('');
  document.querySelector('#game-area .game-card').insertAdjacentHTML('afterend',`<div style="font-size:12px;color:var(--text2);padding:10px;background:var(--surface2);border-radius:8px;margin-bottom:10px;line-height:1.6">${!chosen?'⏱ Time\'s up! ':''} ${exp}</div>`);
  const catDiv=document.querySelector('#game-area div[style*="flex-wrap:wrap"]');
  if(catDiv) catDiv.innerHTML=cats;
  const nextBtn=document.createElement('button');
  nextBtn.className='btn btn-game';nextBtn.style.cssText='width:100%;margin-top:10px';
  nextBtn.textContent=g.idx+1<g.deck.length?'Next →':'See Results';
  nextBtn.onclick=()=>{g.idx++;renderEconomicsQ();};
  document.getElementById('game-area').appendChild(nextBtn);
}
function renderEconomicsEnd(){
  clearInterval(economicsState.timer);const g=economicsState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('economics')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

// ═══════════════════════════════════════════════════
// ELIMINATION ROUND
// ═══════════════════════════════════════════════════

const ELIMINATION_SCENARIOS = [
  {
    scenario:'A company needs to store highly connected data — billions of relationships between users, products, and purchases — and query traversal paths across many hops efficiently.',
    correct:'Amazon Neptune',
    services:['Amazon Neptune','Amazon DynamoDB','Amazon RDS','Amazon Redshift'],
    explanations:{
      'Amazon RDS':'Relational databases use JOINs for relationships. With billions of hops, nested JOINs become exponentially slow — not designed for graph traversal.',
      'Amazon Redshift':'A columnar data warehouse for analytical queries on structured tabular data. Relationship traversal is not a Redshift use case.',
      'Amazon DynamoDB':'NoSQL key-value store — can model relationships with adjacency lists but multi-hop traversal requires multiple serial reads, not efficient at scale.',
      'Amazon Neptune':'Purpose-built graph database using Gremlin or SPARQL. Traverses billions of relationships natively at millisecond latency.',
    }
  },
  {
    scenario:'An application must send one message and have 5 different downstream services each receive their own copy simultaneously, without the sender knowing about each subscriber.',
    correct:'Amazon SNS',
    services:['Amazon SNS','Amazon SQS','AWS Step Functions','Amazon Kinesis'],
    explanations:{
      'Amazon SQS':'A queue where each message is consumed by exactly one consumer — point-to-point, not fan-out. Multiple consumers compete for messages.',
      'AWS Step Functions':'A workflow orchestrator for coordinating sequences of Lambda functions — not a messaging fan-out service.',
      'Amazon Kinesis':'A real-time stream designed for high-volume data ingestion and processing — not a pub/sub fan-out for application messaging.',
      'Amazon SNS':'Pub/sub messaging service. One published message fans out to all topic subscribers simultaneously — exactly the pattern described.',
    }
  },
  {
    scenario:'A company needs to store financial transaction logs that must be cryptographically verifiable — no one, including the root user, should be able to alter past records.',
    correct:'Amazon QLDB',
    services:['Amazon QLDB','Amazon RDS','Amazon S3 with versioning','AWS CloudTrail'],
    explanations:{
      'Amazon RDS':'A managed relational database — data can be updated or deleted by any privileged user. No cryptographic chaining of records.',
      'Amazon S3 with versioning':'Versioning preserves previous object versions but the root user can still delete them. No cryptographic proof of integrity.',
      'AWS CloudTrail':'Records API calls with log file validation — but covers AWS API activity, not application transaction logs.',
      'Amazon QLDB':'Purpose-built ledger database. Every change is SHA-256 chained — any alteration to historical records is mathematically detectable.',
    }
  },
  {
    scenario:'A startup needs sub-millisecond latency for user session data that is read thousands of times per second, but the data does not need to survive a server restart.',
    correct:'Amazon ElastiCache',
    services:['Amazon ElastiCache','Amazon DynamoDB','Amazon RDS','Amazon S3'],
    explanations:{
      'Amazon S3':'Object storage — milliseconds to seconds latency per request. Not suitable for sub-millisecond session reads.',
      'Amazon RDS':'Relational database — milliseconds latency per query. Fast, but not sub-millisecond for high-frequency reads.',
      'Amazon DynamoDB':'Single-digit millisecond latency — fast but not sub-millisecond. Durable and persistent, which adds overhead.',
      'Amazon ElastiCache':'In-memory cache (Redis/Memcached) with microsecond latency. Not durable (acceptable if session can be rebuilt), but blazing fast.',
    }
  },
  {
    scenario:'A team wants to gradually shift traffic from their old application version to the new one — starting with 5%, watching metrics, then increasing over hours.',
    correct:'Canary Deployment',
    services:['Canary Deployment','Blue/Green Deployment','In-Place Deployment','Disaster Recovery Failover'],
    explanations:{
      'In-Place Deployment':'Updates all instances simultaneously — no gradual traffic shift, high risk of full-fleet failures if the release has bugs.',
      'Disaster Recovery Failover':'A DR pattern for recovering from outages — not a deployment strategy for releasing new software versions.',
      'Blue/Green Deployment':'Switches 100% of traffic to a new environment at once — fast rollback is possible but no gradual percentage traffic shift.',
      'Canary Deployment':'Routes a small initial percentage (e.g., 5%) to the new version. Monitors metrics and incrementally increases traffic — exactly the pattern described.',
    }
  },
  {
    scenario:'A company needs dedicated physical EC2 servers with no shared hardware, primarily to use their existing Windows Server per-socket licenses.',
    correct:'EC2 Dedicated Host',
    services:['EC2 Dedicated Host','EC2 Dedicated Instance','EC2 Reserved Instance','EC2 Spot Instance'],
    explanations:{
      'EC2 Spot Instance':'Uses spare capacity at discount — runs on shared hardware, can be interrupted, and does not allow BYOL host-bound licenses.',
      'EC2 Reserved Instance':'A pricing commitment — the instance still runs on shared multi-tenant hardware by default. Does not provide host-level isolation.',
      'EC2 Dedicated Instance':'Runs on hardware dedicated to your account but the physical host may change on restart — host-bound per-socket licenses require a consistent host.',
      'EC2 Dedicated Host':'A specific physical server fully dedicated to you. Host identity is stable across reboots — required for per-socket/per-core BYOL licenses.',
    }
  },
  {
    scenario:'A company wants to monitor for unusual network behavior and potential account compromises across their entire AWS environment using machine learning — automatically.',
    correct:'Amazon GuardDuty',
    services:['Amazon GuardDuty','Amazon Inspector','AWS Config','Amazon Macie'],
    explanations:{
      'Amazon Macie':'Discovers and classifies sensitive data in S3 buckets — focused on data security, not network behavior or account compromise detection.',
      'AWS Config':'Records resource configuration changes and evaluates compliance rules — not a threat detection service using behavioral ML.',
      'Amazon Inspector':'Scans EC2 and container images for software vulnerabilities and CVEs — not focused on network behavior or account-level threat detection.',
      'Amazon GuardDuty':'Uses ML to analyze CloudTrail, VPC Flow Logs, and DNS logs for threats like credential abuse, unusual network patterns, and data exfiltration.',
    }
  },
  {
    scenario:'A backend needs to process incoming orders in sequence. Each order must be processed exactly once, and no two workers should process the same order simultaneously.',
    correct:'Amazon SQS (FIFO Queue)',
    services:['Amazon SQS (FIFO Queue)','Amazon SNS','Amazon Kinesis Data Streams','Amazon EventBridge'],
    explanations:{
      'Amazon SNS':'A pub/sub fan-out service — all subscribers receive each message, so multiple workers would process every order. No deduplication guarantee.',
      'Amazon Kinesis Data Streams':'Designed for real-time streaming analytics — multiple consumers can read the same shard data. Not designed for exactly-once FIFO processing.',
      'Amazon EventBridge':'An event bus for routing events to multiple targets — not designed for exactly-once sequential order processing.',
      'Amazon SQS (FIFO Queue)':'FIFO queues guarantee ordering and exactly-once processing. Message group IDs let you process related orders sequentially while different groups run in parallel.',
    }
  },
];

let eliminationState = {deck:[],idx:0,score:0,eliminated:[],phase:'eliminate'};

function startEliminationGame(){
  eliminationState.deck=[...ELIMINATION_SCENARIOS].sort(()=>Math.random()-.5);
  eliminationState.idx=0;eliminationState.score=0;
  renderEliminationRound();
}
function renderEliminationRound(){
  const g=eliminationState;
  if(g.idx>=g.deck.length){renderEliminationEnd();return;}
  const round=g.deck[g.idx];
  g.eliminated=[];
  const shuffled=[...round.services].sort(()=>Math.random()-.5);
  g._shuffled=shuffled;
  renderEliminationBoard(round,shuffled);
}
function renderEliminationBoard(round,shuffled){
  const g=eliminationState;
  const remaining=shuffled.filter(s=>!g.eliminated.includes(s));
  const total=shuffled.length;
  const elimLeft=total-1-g.eliminated.length;
  const btns=shuffled.map(s=>{
    const isElim=g.eliminated.includes(s);
    const isCorrect=s===round.correct;
    if(isElim) return `<div style="padding:12px;border-radius:8px;background:var(--fail-dim);border:2px solid var(--fail);color:var(--fail);font-size:13px;text-decoration:line-through;opacity:0.6">${s}</div>`;
    if(remaining.length===1) return `<div style="padding:12px;border-radius:8px;background:var(--pass-dim);border:2px solid var(--pass);color:var(--pass);font-size:13px;font-weight:600">✓ ${s}</div>`;
    return `<button class="btn" style="width:100%;text-align:left;padding:12px;font-size:13px;background:var(--surface2);border:1px solid var(--border)" onclick="eliminateService('${s.replace(/'/g,"\\'")}')">✗ Eliminate: ${s}</button>`;
  }).join('');
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <span style="font-size:12px;color:var(--text2);font-family:'IBM Plex Mono',monospace">Round ${g.idx+1}/${g.deck.length} · Score: ${g.score}</span>
    </div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:8px">${remaining.length>1?`Tap to eliminate wrong answers — ${elimLeft} to eliminate`:'Last one standing!'}</div>
    <div class="game-card" style="margin-bottom:10px;font-size:14px;line-height:1.6">${round.scenario}</div>
    <div style="display:flex;flex-direction:column;gap:8px">${btns}</div>`;
  if(remaining.length===1){
    const won=remaining[0]===round.correct;
    if(won) g.score++;
    recordGameAnswer('Elimination Round',round.scenario,remaining[0],round.correct,won);
    const expDiv=document.createElement('div');
    expDiv.style.cssText='font-size:12px;color:var(--text2);margin-top:10px;padding:10px;background:var(--surface2);border-radius:8px;line-height:1.6';
    expDiv.innerHTML=`<strong>${won?'✓ Correct!':'✗ Wrong answer survived!'}</strong><br>${round.explanations[round.correct]}`;
    const nextBtn=document.createElement('button');
    nextBtn.className='btn btn-game';nextBtn.style.cssText='width:100%;margin-top:10px';
    nextBtn.textContent=g.idx+1<g.deck.length?'Next Round →':'See Results';
    nextBtn.onclick=()=>{g.idx++;renderEliminationRound();};
    document.getElementById('game-area').appendChild(expDiv);
    document.getElementById('game-area').appendChild(nextBtn);
  }
}
function eliminateService(svc){
  const g=eliminationState,round=g.deck[g.idx];
  const isWrong=svc!==round.correct;
  if(!isWrong){
    // Eliminated the correct answer — show feedback
    const expDiv=document.createElement('div');
    expDiv.style.cssText='font-size:12px;color:var(--fail);margin-top:8px;padding:8px;background:var(--fail-dim);border-radius:8px;line-height:1.6;border:1px solid var(--fail)';
    expDiv.textContent=`⚠ That's actually the correct answer! ${round.explanations[svc]}`;
    document.getElementById('game-area').appendChild(expDiv);
    // Force-eliminate everything else to show the result
    g.eliminated=[...g._shuffled.filter(s=>s!==svc)];
    setTimeout(()=>renderEliminationBoard(round,g._shuffled),1500);
    return;
  }
  g.eliminated.push(svc);
  renderEliminationBoard(round,g._shuffled);
}
function renderEliminationEnd(){
  const g=eliminationState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} rounds — correct answer survived</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('elimination')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

// ═══════════════════════════════════════════════════
// INTEGRATION PATTERNS — Two-Phase Quiz
// ═══════════════════════════════════════════════════

const INTEGRATION_QS = [
  {
    scenario:'An order service must notify 5 downstream services (inventory, email, fraud, analytics, shipping) simultaneously when an order is placed. The sender should not know about individual subscribers.',
    service:'Amazon SNS',
    pattern:'Fan-out (pub/sub)',
    serviceOpts:['Amazon SNS','Amazon SQS','AWS Step Functions','Amazon EventBridge'],
    patternOpts:['Fan-out (pub/sub)','Point-to-point queue','Workflow orchestration','Event bus routing'],
    serviceExp:'SNS topics deliver one message to all subscribers simultaneously — decoupling the sender from N receivers.',
    patternExp:'Fan-out: one message, many consumers. SNS delivers to all subscribed endpoints (SQS queues, Lambda, email, HTTP) in parallel.',
  },
  {
    scenario:'A video processing pipeline: upload triggers transcoding, then thumbnail generation, then database update, then CDN invalidation — each step must complete before the next begins.',
    service:'AWS Step Functions',
    pattern:'Workflow orchestration',
    serviceOpts:['AWS Step Functions','Amazon SQS','Amazon SNS','Amazon EventBridge'],
    patternOpts:['Workflow orchestration','Fan-out (pub/sub)','Point-to-point queue','Event bus routing'],
    serviceExp:'Step Functions coordinates sequential (and parallel) steps with state management, retries, and error handling built in.',
    patternExp:'Workflow orchestration: a state machine manages the sequence, handles failures, and ensures each step completes before the next starts.',
  },
  {
    scenario:'A checkout service sends orders to a fulfillment service that processes them. The fulfillment service is sometimes slow and the checkout service must not block or lose orders during spikes.',
    service:'Amazon SQS',
    pattern:'Point-to-point queue',
    serviceOpts:['Amazon SQS','Amazon SNS','AWS Step Functions','Amazon EventBridge'],
    patternOpts:['Point-to-point queue','Fan-out (pub/sub)','Workflow orchestration','Stream processing'],
    serviceExp:'SQS decouples producers from consumers. Orders queue up and the fulfillment service polls at its own pace — no messages are lost.',
    patternExp:'Point-to-point: one producer, one consumer (logical). Messages persist in the queue until successfully processed and deleted.',
  },
  {
    scenario:'AWS services like EC2 Auto Scaling, ECS, and CodePipeline each emit events when something happens. A company wants to route these events to the correct Lambda functions based on rules.',
    service:'Amazon EventBridge',
    pattern:'Event bus routing',
    serviceOpts:['Amazon EventBridge','Amazon SNS','Amazon SQS','AWS Step Functions'],
    patternOpts:['Event bus routing','Fan-out (pub/sub)','Point-to-point queue','Workflow orchestration'],
    serviceExp:'EventBridge is the AWS event bus — it ingests events from 100+ AWS services and SaaS apps and routes them by content-based rules.',
    patternExp:'Event bus routing: events are matched against rules (e.g., event source = ec2, detail-type = Instance State Change) and routed to targets.',
  },
  {
    scenario:'A stock trading platform ingests 500,000 price tick events per second and multiple analytics teams need to independently replay and process the full stream at different rates.',
    service:'Amazon Kinesis Data Streams',
    pattern:'Stream processing',
    serviceOpts:['Amazon Kinesis Data Streams','Amazon SQS','Amazon SNS','Amazon EventBridge'],
    patternOpts:['Stream processing','Point-to-point queue','Fan-out (pub/sub)','Event bus routing'],
    serviceExp:'Kinesis Data Streams retains records for up to 365 days and supports multiple consumers reading the same data independently.',
    patternExp:'Stream processing: high-throughput ordered events with multiple independent readers replaying the same stream at their own position.',
  },
  {
    scenario:'A microservice needs to call a payment API, and if it fails, retry up to 3 times with exponential backoff, then notify an operator via email if all retries fail.',
    service:'AWS Step Functions',
    pattern:'Workflow orchestration',
    serviceOpts:['AWS Step Functions','Amazon SQS','Amazon SNS','Amazon EventBridge'],
    patternOpts:['Workflow orchestration','Fan-out (pub/sub)','Point-to-point queue','Event bus routing'],
    serviceExp:'Step Functions has built-in retry logic (with configurable backoff) and catch states for error handling — no code needed for retry/failure paths.',
    patternExp:'Workflow orchestration manages complex conditional logic, retries, and error paths as a visual state machine.',
  },
  {
    scenario:'A company uses SaaS tools (Datadog, PagerDuty, Zendesk). When certain events happen in Datadog, they want to automatically create a Zendesk ticket without writing glue code.',
    service:'Amazon EventBridge',
    pattern:'Event bus routing',
    serviceOpts:['Amazon EventBridge','Amazon SQS','Amazon SNS','AWS Step Functions'],
    patternOpts:['Event bus routing','Point-to-point queue','Fan-out (pub/sub)','Workflow orchestration'],
    serviceExp:'EventBridge has a SaaS partner event bus that natively ingests events from 50+ SaaS providers and routes them to AWS targets.',
    patternExp:'Event bus routing: SaaS events flow in → EventBridge rule matches → target (Lambda, API destination) creates the Zendesk ticket automatically.',
  },
  {
    scenario:'Multiple upload workers add images to a queue. A single resizing worker picks them up one at a time and must not process the same image twice, even if two resizers are running.',
    service:'Amazon SQS',
    pattern:'Point-to-point queue',
    serviceOpts:['Amazon SQS','Amazon SNS','Amazon Kinesis Data Streams','AWS Step Functions'],
    patternOpts:['Point-to-point queue','Fan-out (pub/sub)','Stream processing','Workflow orchestration'],
    serviceExp:'SQS visibility timeout ensures that once a worker picks up a message, it\'s hidden from other workers until processed or the timeout expires.',
    patternExp:'Point-to-point queue with competing consumers: only one worker processes each message — exactly-once (with FIFO) or at-least-once (standard) delivery.',
  },
  {
    scenario:'When a new user signs up, the system must send a welcome email AND update the analytics database AND post to Slack — all three in parallel without any of them knowing about the others.',
    service:'Amazon SNS',
    pattern:'Fan-out (pub/sub)',
    serviceOpts:['Amazon SNS','Amazon SQS','AWS Step Functions','Amazon EventBridge'],
    patternOpts:['Fan-out (pub/sub)','Point-to-point queue','Workflow orchestration','Stream processing'],
    serviceExp:'SNS publishes to 3 subscriptions simultaneously — email Lambda, analytics Lambda, Slack Lambda — all fire in parallel.',
    patternExp:'Fan-out: one event triggers multiple independent parallel actions. No coordination needed between downstream systems.',
  },
  {
    scenario:'A customer wants to reprocess the last 7 days of order events to fix a bug in their reporting pipeline without re-ingesting data from the source systems.',
    service:'Amazon Kinesis Data Streams',
    pattern:'Stream processing',
    serviceOpts:['Amazon Kinesis Data Streams','Amazon SQS','Amazon SNS','Amazon EventBridge'],
    patternOpts:['Stream processing','Point-to-point queue','Fan-out (pub/sub)','Event bus routing'],
    serviceExp:'Kinesis retains data for 24 hours (default) or up to 365 days (extended). Consumers can reset their iterator to replay historical data.',
    patternExp:'Stream processing with replay: unlike SQS (where processed messages are deleted), Kinesis lets you replay the full stream from any point.',
  },
];

let integrationState = {deck:[],idx:0,score:0,phase:'service',serviceChoice:null};

function startIntegrationGame(){
  integrationState.deck=[...INTEGRATION_QS].sort(()=>Math.random()-.5);
  integrationState.idx=0;integrationState.score=0;
  renderIntegrationQ();
}
function renderIntegrationQ(){
  const g=integrationState;
  if(g.idx>=g.deck.length){renderIntegrationEnd();return;}
  const q=g.deck[g.idx];
  g.phase='service';g.serviceChoice=null;
  const opts=q.serviceOpts.map((o,i)=>`<button class="btn" style="width:100%;text-align:left;margin-bottom:6px;font-size:13px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border)" onclick="chooseIntegrationService(${i})">${o}</button>`).join('');
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <span style="font-size:12px;color:var(--text2);font-family:'IBM Plex Mono',monospace">${g.idx+1}/${g.deck.length} · Score: ${g.score}</span>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:8px">
      <span class="badge" style="background:var(--game-dim,#e3f2fd);color:var(--game)">Step 1: Pick the service</span>
      <span class="badge b-neutral" style="opacity:0.4">Step 2: Pick the pattern</span>
    </div>
    <div class="game-card" style="margin-bottom:10px;font-size:14px;line-height:1.6">${q.scenario}</div>
    ${opts}`;
}
function chooseIntegrationService(chosen){
  const g=integrationState,q=g.deck[g.idx];
  const right=q.serviceOpts[chosen]===q.service;
  g.serviceChoice={chosen:q.serviceOpts[chosen],correct:q.service,right};
  const btns=document.querySelectorAll('#game-area .btn:not(.btn-ghost)');
  btns.forEach((b,i)=>{
    if(q.serviceOpts[i]===q.service) b.style.background='var(--pass-dim)',b.style.borderColor='var(--pass)';
    else if(i===chosen&&!right) b.style.background='var(--fail-dim)',b.style.borderColor='var(--fail)';
    b.onclick=null;
  });
  const expDiv=document.createElement('div');
  expDiv.style.cssText='font-size:12px;color:var(--text2);margin-top:8px;padding:10px;background:var(--surface2);border-radius:8px;line-height:1.6;margin-bottom:10px';
  expDiv.textContent=q.serviceExp;
  document.getElementById('game-area').appendChild(expDiv);
  // Now render step 2
  const step2Header=document.createElement('div');
  step2Header.style.cssText='display:flex;gap:8px;margin-bottom:8px;margin-top:4px';
  step2Header.innerHTML=`<span class="badge b-neutral" style="opacity:0.4">Step 1: Done</span><span class="badge" style="background:var(--game-dim,#e3f2fd);color:var(--game)">Step 2: Pick the pattern</span>`;
  document.getElementById('game-area').appendChild(step2Header);
  q.patternOpts.forEach((p,i)=>{
    const btn=document.createElement('button');
    btn.className='btn';
    btn.style.cssText='width:100%;text-align:left;margin-bottom:6px;font-size:13px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border)';
    btn.textContent=p;
    btn.onclick=()=>chooseIntegrationPattern(i);
    document.getElementById('game-area').appendChild(btn);
  });
}
function chooseIntegrationPattern(chosen){
  const g=integrationState,q=g.deck[g.idx];
  const patRight=q.patternOpts[chosen]===q.pattern;
  const bothRight=g.serviceChoice.right&&patRight;
  if(bothRight) g.score++;
  recordGameAnswer('Integration Patterns',q.scenario,`${g.serviceChoice.chosen} / ${q.patternOpts[chosen]}`,`${q.service} / ${q.pattern}`,bothRight);
  // Highlight pattern buttons (they come after the step2Header div)
  const allBtns=document.querySelectorAll('#game-area .btn:not(.btn-ghost)');
  // Pattern buttons are the last 4 buttons
  const patBtns=Array.from(allBtns).slice(-q.patternOpts.length);
  patBtns.forEach((b,i)=>{
    if(q.patternOpts[i]===q.pattern) b.style.background='var(--pass-dim)',b.style.borderColor='var(--pass)';
    else if(i===chosen&&!patRight) b.style.background='var(--fail-dim)',b.style.borderColor='var(--fail)';
    b.onclick=null;
  });
  const expDiv=document.createElement('div');
  expDiv.style.cssText='font-size:12px;color:var(--text2);margin-top:8px;padding:10px;background:var(--surface2);border-radius:8px;line-height:1.6';
  expDiv.textContent=q.patternExp;
  const nextBtn=document.createElement('button');
  nextBtn.className='btn btn-game';nextBtn.style.cssText='width:100%;margin-top:10px';
  nextBtn.textContent=g.idx+1<g.deck.length?'Next →':'See Results';
  nextBtn.onclick=()=>{g.idx++;renderIntegrationQ();};
  document.getElementById('game-area').appendChild(expDiv);
  document.getElementById('game-area').appendChild(nextBtn);
}
function renderIntegrationEnd(){
  const g=integrationState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} — both steps correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-game" onclick="startGame('integration')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}

// ════════════════════════════════════════════════════════
// SCENARIO CHAIN — 5-question story arc per company
// ════════════════════════════════════════════════════════

const SCENARIO_CHAINS = [
  {
    title: 'The Startup Journey',
    icon: '🚀',
    company: 'NovaBite — a food-delivery startup',
    chapters: [
      {
        narrative: 'NovaBite launches with a tiny team. They need to host a web app and REST API without managing servers — and their budget is essentially zero.',
        q: 'Which AWS compute option lets NovaBite run their backend without provisioning or managing any servers, paying only when code runs?',
        opts: ['EC2 On-Demand with Auto Scaling', 'AWS Lambda with API Gateway', 'Amazon ECS on EC2 launch type', 'AWS Elastic Beanstalk on dedicated hosts'],
        correct: 1,
        exp: 'Lambda + API Gateway is fully serverless — no servers to provision, and you pay per invocation. EC2 and ECS still require managing instances. Elastic Beanstalk on dedicated hosts is the most expensive option.'
      },
      {
        narrative: 'NovaBite is growing fast. Their Lambda functions are reading/writing user orders to a database dozens of times per second. They need a fully managed, highly available relational database — minimal ops overhead.',
        q: 'Which AWS database service is the best fit for NovaBite\'s high-throughput relational workload with minimal operational overhead?',
        opts: ['Amazon RDS with Multi-AZ deployment', 'Amazon DynamoDB with on-demand capacity', 'Amazon Redshift provisioned cluster', 'Amazon Aurora Serverless v2'],
        correct: 3,
        exp: 'Aurora Serverless v2 is fully managed, scales instantly with demand (ideal for spiky traffic), and is relational (MySQL/PostgreSQL compatible). RDS Multi-AZ is managed but not serverless. Redshift is for analytics/warehousing, not transactional workloads. DynamoDB is NoSQL.'
      },
      {
        narrative: 'NovaBite now has 100k users. Their app is global — users in Europe complain about slow load times for images and menus. They need to serve static assets faster worldwide.',
        q: 'What is the most cost-effective way to reduce latency for NovaBite\'s static content for users across the globe?',
        opts: ['Deploy EC2 instances in every AWS Region', 'Use Amazon CloudFront as a CDN in front of S3', 'Enable S3 Transfer Acceleration on the origin bucket', 'Replicate S3 buckets to every Region with Cross-Region Replication'],
        correct: 1,
        exp: 'CloudFront caches content at 400+ edge locations globally, dramatically reducing latency at low cost. Running EC2 in every region is expensive and unnecessary. S3 Transfer Acceleration speeds up uploads, not downloads. Cross-Region Replication increases availability but doesn\'t improve read latency the way a CDN does.'
      },
      {
        narrative: 'A security audit finds that NovaBite\'s delivery drivers\' mobile app is making API calls with hardcoded AWS credentials in the app binary. This is a critical vulnerability.',
        q: 'What is the correct AWS-native way to authenticate mobile app users and give them scoped AWS access without embedding long-term credentials?',
        opts: ['Create an IAM user per driver and distribute access keys via email', 'Use Amazon Cognito Identity Pools to issue temporary credentials via STS', 'Store credentials in AWS Secrets Manager and fetch them at app launch', 'Enable MFA on the shared IAM account all drivers use'],
        correct: 1,
        exp: 'Cognito Identity Pools federate identities (via social login or user pools) and exchange them for temporary STS credentials — no long-term keys in the app. IAM users per driver is unmanageable at scale and still distributes keys. Secrets Manager is for server-side secrets, not mobile auth. A shared IAM account with MFA violates least privilege and is still a static credential.'
      },
      {
        narrative: 'NovaBite is acquired by a restaurant chain. The acquiring company\'s finance team requires full cost visibility and chargeback reporting across NovaBite\'s 4 AWS accounts (dev, staging, prod, analytics).',
        q: 'Which AWS feature gives NovaBite\'s finance team a single consolidated bill and per-account cost breakdown across all 4 AWS accounts?',
        opts: ['AWS Cost Explorer with account-level filtering', 'AWS Organizations with Consolidated Billing', 'AWS Budgets alerts sent to each account owner', 'AWS Trusted Advisor cost optimisation checks'],
        correct: 1,
        exp: 'AWS Organizations with Consolidated Billing combines all accounts under a single payer, enables volume discounts across accounts, and provides per-account cost breakdowns. Cost Explorer is a visualisation tool (useful, but not the consolidation mechanism). Budgets send alerts but don\'t consolidate billing. Trusted Advisor gives recommendations, not billing consolidation.'
      }
    ]
  },
  {
    title: 'The Security Incident',
    icon: '🔐',
    company: 'VaultPay — a fintech payment processor',
    chapters: [
      {
        narrative: 'VaultPay stores payment records in an S3 bucket. An engineer accidentally made the bucket public. They need to detect and prevent this class of misconfiguration going forward.',
        q: 'Which AWS service continuously monitors and automatically remediates S3 bucket policy misconfigurations like accidental public access?',
        opts: ['Amazon Inspector scanning S3 objects for vulnerabilities', 'AWS Config rules with auto-remediation via Lambda', 'Amazon Macie scanning for PII in S3 buckets', 'AWS CloudTrail logging all S3 API calls'],
        correct: 1,
        exp: 'AWS Config evaluates resource configurations against rules continuously and can trigger Lambda-based auto-remediation (e.g. re-apply a block-public-access setting). Inspector scans workloads for software vulnerabilities, not config drift. Macie detects sensitive data in S3 content. CloudTrail logs API calls for audit but does not auto-remediate.'
      },
      {
        narrative: 'After the incident, VaultPay\'s security team wants real-time alerts if anyone ever calls s3:PutBucketAcl or s3:DeleteBucketPolicy on any bucket again — and wants a ticket opened automatically.',
        q: 'Which combination of services should VaultPay use to detect the specific API call and trigger an automated response?',
        opts: ['Amazon GuardDuty → SNS → Lambda to open ticket', 'AWS CloudTrail → CloudWatch Events (EventBridge) → Lambda to open ticket', 'AWS Config → SNS → SQS to open ticket', 'Amazon Inspector → SNS → Lambda to open ticket'],
        correct: 1,
        exp: 'CloudTrail captures every API call. EventBridge (formerly CloudWatch Events) can pattern-match specific API calls from CloudTrail and invoke Lambda automatically. GuardDuty detects threats using ML but doesn\'t let you target specific API calls. Config detects configuration drift but is slower than real-time event routing. Inspector is for vulnerability assessment.'
      },
      {
        narrative: 'VaultPay must store encryption keys for payment card data. Compliance requires keys are generated and stored in hardware that VaultPay exclusively controls — no AWS personnel can ever access them.',
        q: 'Which AWS key management option meets VaultPay\'s requirement for exclusive hardware control with no shared tenancy?',
        opts: ['AWS KMS with customer managed keys (CMKs)', 'AWS CloudHSM with a dedicated hardware security module', 'AWS Secrets Manager with automatic rotation', 'SSM Parameter Store with SecureString type'],
        correct: 1,
        exp: 'AWS CloudHSM provides dedicated, single-tenant HSM hardware that only the customer controls — AWS has no access to the keys. KMS is multi-tenant (AWS manages the underlying hardware) and is not suitable where exclusive hardware control is required. Secrets Manager and SSM Parameter Store use KMS for encryption and do not provide dedicated hardware.'
      },
      {
        narrative: 'VaultPay\'s application receives payment webhook requests from external partners. They need to ensure only traffic from known partner IP ranges reaches the payment API, and all other traffic is blocked.',
        q: 'Which AWS mechanism should VaultPay use to restrict API Gateway access to known partner IP address ranges?',
        opts: ['Security Groups on the API Gateway endpoint', 'A WAF Web ACL with an IP set allow-list attached to API Gateway', 'VPC Network ACLs blocking all non-partner CIDRs', 'An IAM policy requiring callers to be from specific IPs'],
        correct: 1,
        exp: 'AWS WAF supports IP set conditions and can be attached directly to API Gateway, restricting access to specific IP ranges. API Gateway is not inside a VPC by default so Security Groups and NACLs don\'t apply to public REST APIs. IAM condition keys can restrict by IP but require all callers to be IAM-authenticated, which is impractical for external partners.'
      },
      {
        narrative: 'Six months later, VaultPay needs to prove to auditors that no data ever left their AWS environment in plain text — and that all encryption keys used are traceable to HSM-generated material.',
        q: 'Which AWS service provides cryptographically verifiable, immutable audit logs that VaultPay can present to auditors as proof of API activity?',
        opts: ['Amazon CloudWatch Logs with log metric filters', 'AWS CloudTrail with CloudTrail Lake for immutable query', 'AWS Config with a conformance pack report', 'Amazon S3 server access logging with object lock'],
        correct: 1,
        exp: 'CloudTrail with CloudTrail Lake provides immutable, queryable audit logs of every API call, with log file integrity validation (SHA-256 hashes) that proves logs haven\'t been tampered with — exactly what auditors require. CloudWatch Logs are mutable and not cryptographically verifiable. Config tracks resource state, not API-call provenance. S3 access logs are best-effort and not integrity-verified.'
      }
    ]
  },
  {
    title: 'The Migration',
    icon: '🚚',
    company: 'RetailCo — a retail chain moving from on-premises to AWS',
    chapters: [
      {
        narrative: 'RetailCo has 200 physical servers in their own data center. Their CTO wants to move to AWS but leadership is cautious — they want to identify which servers are good candidates for migration before touching anything.',
        q: 'Which AWS service should RetailCo use to discover and assess their on-premises servers before planning the migration?',
        opts: ['AWS Migration Hub to track migration projects', 'AWS Application Discovery Service to inventory and profile servers', 'AWS DataSync to replicate server data to S3', 'AWS Server Migration Service to begin migrating VMs'],
        correct: 1,
        exp: 'AWS Application Discovery Service collects configuration, usage, and performance data from on-premises servers — giving RetailCo the inventory and dependency maps needed to plan a migration. Migration Hub tracks progress but relies on discovery data from other tools. DataSync is for data transfer, not discovery. SMS migrates VMs but shouldn\'t be used before assessment.'
      },
      {
        narrative: 'RetailCo\'s legacy ERP system cannot be modified. It must be moved to AWS as-is — no refactoring, no re-architecting. They need to lift-and-shift 40 VMware VMs to EC2.',
        q: 'Which migration strategy and tool is the correct fit for lifting VMware VMs to EC2 with no application changes?',
        opts: ['Repurchase: replace ERP with an AWS Marketplace SaaS solution', 'Rehost: use AWS Application Migration Service (MGN) to replicate VMs to EC2', 'Replatform: deploy ERP on Elastic Beanstalk with managed runtimes', 'Re-architect: rebuild ERP as microservices on EKS'],
        correct: 1,
        exp: 'Rehosting ("lift and shift") moves the application as-is. AWS Application Migration Service (MGN) continuously replicates on-prem VMs to EC2 with minimal downtime. Repurchase replaces the app entirely. Replatform makes minor changes to use managed services. Re-architecting rebuilds the application — none of which are appropriate when the requirement is "no changes".'
      },
      {
        narrative: 'RetailCo has 500 TB of archive data (7-year records required by law) currently on tape. They need to move this to AWS storage that is extremely cheap, durable, and allows retrieval within hours when auditors request records.',
        q: 'Which S3 storage class is optimised for rarely-accessed archive data that must be retrievable within a few hours at the lowest cost?',
        opts: ['S3 Standard — frequent access tier', 'S3 Glacier Flexible Retrieval with bulk retrieval (3–5 hours)', 'S3 Intelligent-Tiering with archive access tier enabled', 'S3 One Zone-IA for infrequent access in a single AZ'],
        correct: 1,
        exp: 'S3 Glacier Flexible Retrieval offers the lowest storage cost for archives with retrieval times of minutes to hours (bulk: 5-12 hours, standard: 3-5 hours). S3 Standard is designed for frequent access and priced accordingly. Intelligent-Tiering has per-object monitoring fees that are costly at 500 TB scale for predictably cold data. One Zone-IA lacks the multi-AZ durability required for legal compliance records.'
      },
      {
        narrative: 'During migration, RetailCo needs to keep their on-premises Oracle database in sync with the new AWS Aurora PostgreSQL database until they\'re ready to cut over. Zero downtime is required.',
        q: 'Which AWS service is designed to migrate and continuously replicate data between a source database and a target database with minimal downtime?',
        opts: ['AWS DataSync to sync database files between environments', 'AWS Database Migration Service (DMS) with ongoing replication task', 'AWS Backup to snapshot the Oracle DB and restore to Aurora', 'AWS Glue ETL job to extract, transform, and load daily', 'Amazon Kinesis Data Streams to capture DB change events'],
        correct: 1,
        exp: 'AWS DMS supports heterogeneous migrations (Oracle → Aurora PostgreSQL) and can run as an ongoing replication task using Change Data Capture (CDC), keeping both databases in sync until cutover. DataSync is for file/object storage transfers. AWS Backup creates point-in-time snapshots but doesn\'t provide continuous sync. Glue is batch ETL. Kinesis requires custom integration and isn\'t purpose-built for DB migration.'
      },
      {
        narrative: 'RetailCo\'s migration is complete. Now the CTO wants to reduce costs. Analysis shows 60% of EC2 instances run at predictable, steady-state workloads 24/7 for the next 3 years.',
        q: 'Which EC2 purchasing option gives RetailCo the maximum discount for committed, steady-state workloads over a 3-year term?',
        opts: ['On-Demand Instances with Auto Scaling to right-size dynamically', 'Reserved Instances (3-year, all upfront payment, standard class)', 'Spot Instances with a Spot Fleet and diversified pools', 'Savings Plans (Compute) with 1-year no-upfront term'],
        correct: 1,
        exp: 'Standard Reserved Instances with a 3-year all-upfront commitment provide the deepest discount (up to 72%) for steady-state, predictable workloads. On-Demand has no discount. Spot Instances can be interrupted — not suitable for 24/7 steady workloads. Compute Savings Plans offer flexibility across instance families but the maximum discount on a 3-year term comes from Standard RIs when instance type is known and fixed.'
      }
    ]
  },
  {
    title: 'The Cost Crisis',
    icon: '💸',
    company: 'StreamLens — a video analytics SaaS startup',
    chapters: [
      {
        narrative: 'StreamLens receives an AWS bill 4× higher than expected. The finance team asks engineering to identify the biggest cost drivers immediately.',
        q: 'Which AWS tool lets StreamLens explore, filter, and visualise their AWS costs and usage broken down by service, region, and time period?',
        opts: ['AWS Trusted Advisor cost checks', 'AWS Cost Explorer with group-by filters', 'AWS Budgets with threshold alerts', 'AWS Pricing Calculator for estimates'],
        correct: 1,
        exp: 'AWS Cost Explorer lets you interactively visualise and analyse historical costs and usage with filters by service, linked account, region, and time. Trusted Advisor gives recommendations but doesn\'t provide interactive cost analysis. Budgets set forward-looking spend alerts. Pricing Calculator estimates future costs for planned architectures.'
      },
      {
        narrative: 'Cost Explorer reveals that EC2 is the top cost driver. Most instances are running at less than 10% CPU — they\'re massively over-provisioned. The team needs guidance on right-sizing.',
        q: 'Which AWS service analyses historical EC2 utilisation and provides right-sizing recommendations to reduce over-provisioned instance costs?',
        opts: ['AWS Cost Explorer Right Sizing Recommendations', 'AWS Compute Optimizer using ML-based resource analysis', 'Amazon CloudWatch custom dashboards showing CPU graphs', 'AWS Trusted Advisor Underutilised EC2 Instance check'],
        correct: 1,
        exp: 'AWS Compute Optimizer uses machine learning to analyse 14 days of CloudWatch metrics and recommends optimal EC2 instance types, sizes, and even identifies candidates for Savings Plans. Cost Explorer right-sizing is useful but less sophisticated. CloudWatch shows metrics but doesn\'t make recommendations. Trusted Advisor\'s check identifies instances below 10% CPU but doesn\'t recommend specific right-sizes.'
      },
      {
        narrative: 'After right-sizing, StreamLens discovers their video processing pipeline runs large batch jobs that start and stop frequently — but they\'re using On-Demand EC2. The jobs can tolerate interruptions if checkpointed.',
        q: 'Which EC2 purchasing option should StreamLens use to reduce batch processing costs significantly, given jobs can be interrupted?',
        opts: ['Reserved Instances (1-year, partial upfront) for the batch fleet', 'EC2 Spot Instances with checkpointing for fault tolerance', 'On-Demand Instances with a Savings Plan covering 50% commitment', 'Dedicated Hosts for isolated compute at a fixed hourly rate'],
        correct: 1,
        exp: 'EC2 Spot Instances offer up to 90% discount over On-Demand for spare capacity — ideal for interruptible batch jobs. With checkpointing, jobs resume after Spot interruptions with no data loss. Reserved Instances don\'t discount irregular burst usage well. Savings Plans require a steady-state commitment. Dedicated Hosts are the most expensive option and provide no cost benefit for batch workloads.'
      },
      {
        narrative: 'StreamLens stores video thumbnails in S3 Standard. After reviewing access patterns, they realise 90% of thumbnails are never accessed after 30 days, and 99% are never accessed after 90 days.',
        q: 'What is the most automated and cost-effective way to move S3 objects through cheaper storage tiers as they age?',
        opts: ['Manually move objects to Glacier using the S3 console each month', 'Configure an S3 Lifecycle policy to transition objects to cheaper tiers automatically', 'Enable S3 Intelligent-Tiering on the bucket to auto-optimise per object', 'Write a Lambda function to check object age daily and move them via the API'],
        correct: 1,
        exp: 'S3 Lifecycle policies automatically transition objects to cheaper storage classes (e.g. Standard → Standard-IA after 30 days → Glacier after 90 days) with zero operational overhead and no cost beyond the destination storage rates. Manual console operations are error-prone at scale. Intelligent-Tiering is better when access patterns are truly unpredictable — here patterns are predictable, so Lifecycle is more cost-efficient. A Lambda solution works but replicates what Lifecycle does natively.'
      },
      {
        narrative: 'StreamLens has resolved the crisis. Their CTO now wants proactive guardrails: they want automatic alerts before spending exceeds $5,000/month and the ability to stop resource creation if a cost anomaly is detected.',
        q: 'Which combination of AWS tools provides proactive spend alerting AND the ability to enforce cost controls as guardrails?',
        opts: ['AWS Cost Explorer + CloudWatch billing alarms', 'AWS Budgets with budget actions + AWS Cost Anomaly Detection', 'AWS Pricing Calculator + SNS notifications', 'AWS Organizations SCPs + CloudTrail billing events'],
        correct: 1,
        exp: 'AWS Budgets can send alerts when spend approaches or exceeds a threshold AND trigger budget actions (e.g. applying an SCP or stopping EC2 instances) automatically. Cost Anomaly Detection uses ML to identify unusual spend patterns and alerts proactively — even before a budget threshold is crossed. Cost Explorer + CloudWatch alarms can alert but don\'t support automated enforcement actions. Pricing Calculator is for planning. SCPs restrict permissions but don\'t respond to spend patterns.'
      }
    ]
  }
];

let chainState={chainIdx:0,qIdx:0,score:0,answers:[]};

function startChainGame(){
  chainState={
    chainIdx:Math.floor(Math.random()*SCENARIO_CHAINS.length),
    qIdx:0,score:0,answers:[]
  };
  renderChainIntro();
}

function renderChainIntro(){
  const g=chainState,chain=SCENARIO_CHAINS[g.chainIdx];
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderGameMenu()">← Menu</button>
    <div class="game-card" style="text-align:center;padding:20px">
      <div style="font-size:48px;margin-bottom:8px">${chain.icon}</div>
      <div style="font-size:18px;font-weight:600;margin-bottom:6px">${chain.title}</div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:16px">Featuring: <strong>${chain.company}</strong></div>
      <div style="font-size:12px;color:var(--text3);line-height:1.6;margin-bottom:16px">Follow this company through 5 challenges. Each question builds on the last — architecture decisions compound.</div>
      <div style="display:flex;justify-content:center;gap:6px;margin-bottom:16px">
        ${chain.chapters.map((_,i)=>`<div style="width:28px;height:28px;border-radius:50%;background:var(--surface2);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--text3)">${i+1}</div>`).join('')}
      </div>
      <button class="btn btn-game" style="width:100%" onclick="renderChainQ()">Begin →</button>
    </div>`;
}

function renderChainQ(){
  const g=chainState,chain=SCENARIO_CHAINS[g.chainIdx],ch=chain.chapters[g.qIdx];
  const area=document.getElementById('game-area');
  // Build progress dots
  const dots=chain.chapters.map((_,i)=>{
    if(i<g.qIdx){const a=g.answers[i];return `<div style="width:24px;height:24px;border-radius:50%;background:${a?'var(--pass-dim)':'var(--fail-dim)'};border:2px solid ${a?'var(--pass)':'var(--fail)'};display:flex;align-items:center;justify-content:center;font-size:11px">${a?'✓':'✗'}</div>`;}
    if(i===g.qIdx) return `<div style="width:24px;height:24px;border-radius:50%;background:var(--game-dim,#e3f2fd);border:2px solid var(--game);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--game)">${i+1}</div>`;
    return `<div style="width:24px;height:24px;border-radius:50%;background:var(--surface2);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--text3)">${i+1}</div>`;
  }).join('');
  area.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderGameMenu()">← Menu</button>
      <div style="display:flex;gap:4px;align-items:center">${dots}</div>
    </div>
    <div style="font-size:11px;color:var(--text3);font-weight:500;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">${chain.icon} ${chain.company} — Chapter ${g.qIdx+1} of ${chain.chapters.length}</div>
    <div style="font-size:13px;color:var(--text2);line-height:1.6;padding:12px;background:var(--surface2);border-left:3px solid var(--game);border-radius:0 8px 8px 0;margin-bottom:10px">${ch.narrative}</div>
    <div class="game-card" style="margin-bottom:10px;padding:14px"><div style="font-size:15px;font-weight:500;line-height:1.6">${ch.q}</div></div>
    ${ch.opts.map((o,i)=>`<button class="btn" id="chain-opt-${i}" style="width:100%;text-align:left;margin-bottom:6px;font-size:13px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px" onclick="chooseChainAnswer(${i})">${o}</button>`).join('')}`;
}

function chooseChainAnswer(chosen){
  const g=chainState,chain=SCENARIO_CHAINS[g.chainIdx],ch=chain.chapters[g.qIdx];
  const right=chosen===ch.correct;
  if(right) g.score++;
  g.answers.push(right);
  recordGameAnswer('Scenario Chain',ch.q,ch.opts[chosen],ch.opts[ch.correct],right);
  // Highlight buttons
  ch.opts.forEach((_,i)=>{
    const btn=document.getElementById(`chain-opt-${i}`);
    if(!btn)return;
    if(i===ch.correct){btn.style.background='var(--pass-dim)';btn.style.borderColor='var(--pass)';}
    else if(i===chosen&&!right){btn.style.background='var(--fail-dim)';btn.style.borderColor='var(--fail)';}
    btn.onclick=null;
  });
  // Show explanation and next button
  const expDiv=document.createElement('div');
  expDiv.style.cssText='font-size:12px;color:var(--text2);margin-top:8px;padding:10px;background:var(--surface2);border-radius:8px;line-height:1.6;border-left:3px solid '+(right?'var(--pass)':'var(--fail)');
  expDiv.innerHTML=`<strong>${right?'✓ Correct':'✗ Incorrect'}:</strong> ${ch.exp}`;
  const nextBtn=document.createElement('button');
  nextBtn.className='btn btn-game';
  nextBtn.style.cssText='width:100%;margin-top:10px';
  const last=g.qIdx+1>=chain.chapters.length;
  nextBtn.textContent=last?'See Final Results →':'Next Chapter →';
  nextBtn.onclick=()=>{
    g.qIdx++;
    if(last) renderChainEnd();
    else renderChainQ();
  };
  document.getElementById('game-area').appendChild(expDiv);
  document.getElementById('game-area').appendChild(nextBtn);
}

function renderChainEnd(){
  const g=chainState,chain=SCENARIO_CHAINS[g.chainIdx];
  const pct=Math.round(g.score/chain.chapters.length*100);
  const dots=g.answers.map((a,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)"><div style="width:20px;height:20px;border-radius:50%;background:${a?'var(--pass-dim)':'var(--fail-dim)'};border:2px solid ${a?'var(--pass)':'var(--fail)'};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px">${a?'✓':'✗'}</div><div style="font-size:12px;color:var(--text2);line-height:1.4">${chain.chapters[i].q.slice(0,80)}…</div></div>`).join('');
  document.getElementById('game-area').innerHTML=`
    <div class="game-card" style="text-align:center;margin-bottom:10px">
      <div style="font-size:48px;margin-bottom:8px">${pct===100?'🏆':pct>=60?'⭐':'💪'}</div>
      <div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--game)">${pct}%</div>
      <div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${chain.chapters.length} correct — ${chain.company}</div>
    </div>
    <div style="font-size:13px;font-weight:500;margin-bottom:8px">Chapter recap</div>
    <div style="margin-bottom:12px">${dots}</div>
    <div class="btn-row"><button class="btn btn-game" onclick="renderChainIntro()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="startChainGame()">New Story</button><button class="btn btn-ghost" onclick="renderGameMenu()">Menu</button></div>`;
}
