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
  const recent = [...gameHistory].reverse().slice(0, 50);
  if(!recent.length){
    area.innerHTML=`<button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderGameMenu()">← Menu</button><div class="empty"><div class="empty-icon">📋</div>No game answers recorded yet.<br>Play any game to start building your history.</div>`;
    return;
  }
  const wrong = recent.filter(r=>!r.wasCorrect);
  area.innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderGameMenu()">← Menu</button>
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

function renderGameMenu(){
  try{gameState.quizBest=parseInt(localStorage.getItem('awsgame_best'))||0;}catch(e){}
  const histCount = gameHistory.length;
  const histWrong = gameHistory.filter(r=>!r.wasCorrect).length;
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

    <div class="section-title" style="padding:0 2px;margin-top:12px">Service knowledge games</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="startGame('quiz')"><div class="gm-icon">⚡</div><div class="gm-name">Service Quiz</div><div class="gm-desc">Identify services from descriptions. Build your streak!</div></div>
      <div class="game-mode-btn" onclick="startGame('flash')"><div class="gm-icon">🃏</div><div class="gm-name">Flashcards</div><div class="gm-desc">Flip cards for CCP, SAA, DVA or Support tiers.</div></div>
      <div class="game-mode-btn" onclick="startGame('match')"><div class="gm-icon">🔗</div><div class="gm-name">Match-Up</div><div class="gm-desc">Pair service names to descriptions. Beat the clock.</div></div>
      <div class="game-mode-btn" onclick="startGame('speed')"><div class="gm-icon">🏎️</div><div class="gm-name">Speed Round</div><div class="gm-desc">3 lives, 8 seconds per question. How far can you go?</div></div>
    </div>

    <div class="section-title" style="padding:0 2px">Architecture games</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="startGame('scenario')"><div class="gm-icon">🏗️</div><div class="gm-name">Build the Architecture</div><div class="gm-desc">Pick the right service for each layer of a scenario.</div></div>
      <div class="game-mode-btn" onclick="startGame('wa')"><div class="gm-icon">🏛️</div><div class="gm-name">Well-Architected</div><div class="gm-desc">Match services and principles to the 6 pillars.</div></div>
      <div class="game-mode-btn" onclick="startGame('truthy')"><div class="gm-icon">✅</div><div class="gm-name">True or False</div><div class="gm-desc">65 statements — CCP, SAA and Support plans.</div></div>
      <div class="game-mode-btn" onclick="startGame('support')"><div class="gm-icon">🎧</div><div class="gm-name">Support Plans Quiz</div><div class="gm-desc">Response times, TAMs, features across all 5 tiers.</div></div>
    </div>

    <div class="section-title" style="padding:0 2px">Bonus quizzes</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="startGame('dbquiz')"><div class="gm-icon">🗄️</div><div class="gm-name">Database Chooser</div><div class="gm-desc">Which DB fits the scenario? RDS, DynamoDB, Neptune...</div></div>
      <div class="game-mode-btn" onclick="startGame('storagequiz')"><div class="gm-icon">💾</div><div class="gm-name">Storage Chooser</div><div class="gm-desc">S3, EBS, EFS, Glacier — when to use which?</div></div>
      <div class="game-mode-btn" onclick="startGame('iamquiz')"><div class="gm-icon">🔑</div><div class="gm-name">IAM Challenge</div><div class="gm-desc">Users, roles, policies, SCPs — test your IAM knowledge.</div></div>
      <div class="game-mode-btn" onclick="startGame('srmquiz')"><div class="gm-icon">🤝</div><div class="gm-name">Shared Responsibility</div><div class="gm-desc">AWS or customer? Test who owns each security task.</div></div>
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
  const histCount = gameHistory.length;
  const histWrong = gameHistory.filter(r=>!r.wasCorrect).length;
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
