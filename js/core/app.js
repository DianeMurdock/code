// Multi-Certification Study Hub - App Configuration & Init
// Loaded LAST - after all data and functions are defined

// ═══════════════════════════════════════════
// EXAM REGISTRY (add new certifications here)
// ═══════════════════════════════════════════

const EXAMS = {
  ccp: { name:'Cloud Practitioner', code:'CLF-C02', color:'--ccp', btnClass:'btn-ccp', fillClass:'fill-ccp', questions: CCP_QUESTIONS },
  saa: { name:'Solutions Architect', code:'SAA-C03', color:'--saa', btnClass:'btn-saa', fillClass:'fill-saa', questions: SAA_QUESTIONS },
  dva: { name:'Developer Associate', code:'DVA-C02', color:'--dva', btnClass:'btn-dva', fillClass:'fill-dva', questions: DVA_QUESTIONS },
  terraform: { name:'Terraform Associate', code:'TA-003', color:'--terraform', btnClass:'btn-terraform', fillClass:'fill-terraform', questions: typeof TERRAFORM_QUESTIONS !== 'undefined' ? TERRAFORM_QUESTIONS : [] },
  ckad: { name:'Kubernetes CKAD', code:'CKAD', color:'--ckad', btnClass:'btn-ckad', fillClass:'fill-ckad', questions: typeof CKAD_QUESTIONS !== 'undefined' ? CKAD_QUESTIONS : [] },
  all: { name:'Combined Practice', code:'ALL', color:'--all', btnClass:'btn-all', fillClass:'fill-all', questions: [] },
  game: { name:'AWS Games', code:'GAME', color:'--game', btnClass:'btn-game', fillClass:'fill-game', questions: [] }
};
EXAMS.all.questions = [...CCP_QUESTIONS, ...SAA_QUESTIONS, ...DVA_QUESTIONS].filter((q,i,arr) => arr.findIndex(x=>x.id===q.id)===i);
EXAMS.game.questions = EXAMS.all.questions;

// ═══════════════════════════════════════════
// CERTIFICATION DROPDOWN
// ═══════════════════════════════════════════

function toggleCertDropdown() {
  const dd = document.getElementById('cert-dropdown');
  const opts = document.getElementById('cert-options');
  dd.classList.toggle('open');
  opts.classList.toggle('open');
}

function selectCert(cert) {
  const map = {
    game:{icon:'🎮',name:'AWS Games'},
    ccp:{icon:'☁️',name:'AWS Cloud Practitioner'},
    saa:{icon:'🏗️',name:'AWS Solutions Architect'},
    dva:{icon:'⚙️',name:'AWS Developer Associate'},
    terraform:{icon:'🔧',name:'Terraform Associate'},
    ckad:{icon:'☸️',name:'Kubernetes CKAD'},
    all:{icon:'🔀',name:'AWS Combined Practice'}
  };
  const d = map[cert];
  document.getElementById('selected-cert-icon').textContent = d.icon;
  document.getElementById('selected-cert-name').textContent = d.name;
  document.querySelectorAll('.cert-option').forEach(o => o.classList.toggle('selected', o.dataset.cert === cert));
  toggleCertDropdown();
  switchExam(cert);
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.cert-selector')) {
    var dd = document.getElementById('cert-dropdown');
    var opts = document.getElementById('cert-options');
    if (dd) dd.classList.remove('open');
    if (opts) opts.classList.remove('open');
  }
});

// ═══════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════

load();                       // restore saved progress
initTheme();                  // apply saved theme
populateDomainSelects();      // fill domain dropdowns
switchExam('game');           // start on games screen

console.log('✅ Multi-Cert Study Hub loaded');
console.log('📚 Questions:', {
  CCP:  EXAMS.ccp.questions.length,
  SAA:  EXAMS.saa.questions.length,
  DVA:  EXAMS.dva.questions.length,
  TF:   EXAMS.terraform.questions.length,
  CKAD: EXAMS.ckad.questions.length,
  All:  EXAMS.all.questions.length
});
