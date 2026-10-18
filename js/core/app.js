// Multi-Certification Study Hub - App Configuration & Init
// Loaded LAST - after all data and functions are defined

// ═══════════════════════════════════════════
// EXAM REGISTRY (add new certifications here)
// ═══════════════════════════════════════════

const EXAMS = {
  ccp: { name:'Cloud Practitioner', code:'CLF-C02', color:'--ccp', btnClass:'btn-ccp', fillClass:'fill-ccp', questions: CCP_QUESTIONS },
  saa: { name:'Solutions Architect', code:'SAA-C03', color:'--saa', btnClass:'btn-saa', fillClass:'fill-saa', questions: SAA_QUESTIONS },
  dva: { name:'Developer Associate', code:'DVA-C02', color:'--dva', btnClass:'btn-dva', fillClass:'fill-dva', questions: DVA_QUESTIONS },
  ai: { name:'AI Practitioner', code:'AIF-C01', color:'--ai', btnClass:'btn-ai', fillClass:'fill-ai', questions: AI_PRACTITIONER_QUESTIONS },
  finops: { name:'FinOps Certified Practitioner', code:'FCP', color:'--finops', btnClass:'btn-finops', fillClass:'fill-finops', questions: FINOPS_QUESTIONS },
  terraform: { name:'Terraform Associate', code:'TA-003', color:'--terraform', btnClass:'btn-terraform', fillClass:'fill-terraform', questions: typeof TERRAFORM_QUESTIONS !== 'undefined' ? TERRAFORM_QUESTIONS : [] },
  ckad: { name:'Kubernetes CKAD', code:'CKAD', color:'--ckad', btnClass:'btn-ckad', fillClass:'fill-ckad', questions: typeof CKAD_QUESTIONS !== 'undefined' ? CKAD_QUESTIONS : [] },
  all: { name:'Combined Practice', code:'ALL', color:'--all', btnClass:'btn-all', fillClass:'fill-all', questions: [] },
  game: { name:'AWS Games', code:'GAME', color:'--game', btnClass:'btn-game', fillClass:'fill-game', questions: [] },
  ref:  { name:'AWS References', code:'REF', color:'--ref', btnClass:'btn-ref', fillClass:'fill-ref', questions: [] },
  'finops-hub': { name:'FinOps Games & Resources', code:'FINOPS', color:'--finops', btnClass:'btn-finops', fillClass:'fill-finops', questions: [] }
};
EXAMS.all.questions = [...CCP_QUESTIONS, ...SAA_QUESTIONS, ...DVA_QUESTIONS, ...AI_PRACTITIONER_QUESTIONS].filter((q,i,arr) => arr.findIndex(x=>x.id===q.id)===i);
EXAMS.game.questions = EXAMS.all.questions;
EXAMS.ref.questions  = EXAMS.all.questions;

// ═══════════════════════════════════════════
// CERTIFICATION DROPDOWN
// ═══════════════════════════════════════════

const CERT_LABELS = {
  game:{icon:'🎮',name:'AWS Games'},
  ref:{icon:'📚',name:'AWS References'},
  'tf-games':{icon:'⚡',name:'Terraform Games'},
  'k8s-games':{icon:'🎪',name:'Kubernetes Games'},
  'finops-hub':{icon:'📊',name:'FinOps Games & Resources'},
  ccp:{icon:'☁️',name:'AWS Cloud Practitioner'},
  saa:{icon:'🏗️',name:'AWS Solutions Architect'},
  dva:{icon:'⚙️',name:'AWS Developer Associate'},
  ai:{icon:'🤖',name:'AWS AI Practitioner'},
  finops:{icon:'💸',name:'FinOps Certified Practitioner'},
  all:{icon:'🔀',name:'AWS Combined Practice'},
  terraform:{icon:'🔧',name:'Terraform Associate'},
  ckad:{icon:'☸️',name:'Kubernetes CKAD'}
};

function updateSelectedCert(cert) {
  const selected=CERT_LABELS[cert];
  if(!selected) return;
  document.getElementById('selected-cert-icon').textContent=selected.icon;
  document.getElementById('selected-cert-name').textContent=selected.name;
  document.querySelectorAll('.cert-option').forEach(option=>option.classList.toggle('selected',option.dataset.cert===cert));
}

function toggleCertDropdown() {
  const dd = document.getElementById('cert-dropdown');
  const opts = document.getElementById('cert-options');
  dd.classList.toggle('open');
  opts.classList.toggle('open');
}

function selectCert(cert) {
  updateSelectedCert(cert);
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
const startupParams = new URLSearchParams(window.location.search);
const startupExam = startupParams.get('exam');
const validStartupExam = startupExam && Object.prototype.hasOwnProperty.call(CERT_LABELS, startupExam) ? startupExam : 'game';
switchExam(validStartupExam);
const startupScreen = startupParams.get('screen');
if(startupExam===validStartupExam && ['home','bank','exam-config','failed','history'].includes(startupScreen)) showScreen(startupScreen);

console.log('✅ Multi-Cert Study Hub loaded');
console.log('📚 Questions:', {
  CCP:  EXAMS.ccp.questions.length,
  SAA:  EXAMS.saa.questions.length,
  DVA:  EXAMS.dva.questions.length,
  FCP:  EXAMS.finops.questions.length,
  TF:   EXAMS.terraform.questions.length,
  CKAD: EXAMS.ckad.questions.length,
  AI:   EXAMS.ai.questions.length,
  All:  EXAMS.all.questions.length
});
