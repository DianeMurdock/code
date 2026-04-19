// Terraform & Kubernetes Games Module

// ═══════════════════════════════════════════════════
// TERRAFORM GAME DATA
// ═══════════════════════════════════════════════════

const TF_CONCEPT_ICONS = ['🔧', '⚙️', '🏗️', '📁', '🔄', '💾', '🔑', '📊', '🌐', '🛠️', '📋', '🔍', '⚡', '📝', '🎯'];
const TF_TRUTHY_ICONS = ['🔧', '✅', '❓', '💡', '🎯', '📚', '⚙️', '🏗️', '🔄', '💾', '🔑', '📊', '🌐', '🛠️', '📋', '🔍', '⚡', '📝', '🎪', '🏆', '⭐', '💪', '🚀', '🔮', '🧠', '💭', '🎨', '🎪', '🎭', '🎪'];
const TF_SCENARIO_ICONS = ['🏗️', '📋', '🔄', '💾', '🌐', '🛠️', '📊', '⚙️', '🔑'];
const TF_MATCH_ICONS = ['🔗', '🎯', '🧩', '🔍', '📋'];

const TF_CONCEPTS = [
  {q:'What does `terraform init` do?',opts:['Downloads providers and initialises the working directory','Plans infrastructure changes','Applies changes to real resources','Destroys all managed resources'],correct:0,exp:'`terraform init` downloads provider plugins, sets up the backend, and prepares the working directory. Always run this first.'},
  {q:'Which file extension do Terraform configuration files use?',opts:['.tf','.yaml','.json only','.hcl only'],correct:0,exp:'Terraform uses `.tf` files (HCL syntax). JSON `.tf.json` is also valid but `.tf` is the standard.'},
  {q:'What does a Terraform `state` file store?',opts:['The real-world resource IDs and metadata','Only your .tf configuration','The terraform plan output','Provider download cache'],correct:0,exp:'The state file (`terraform.tfstate`) maps your config to real infrastructure — it stores resource IDs, attributes, and dependencies.'},
  {q:'What is the purpose of `terraform plan`?',opts:['Preview changes without touching real infra','Create all resources immediately','Initialise providers','Delete resources flagged for removal'],correct:0,exp:'`terraform plan` shows a diff of what will be created, modified, or destroyed — without making any actual changes.'},
  {q:'What does `terraform apply` do?',opts:['Executes the planned changes against real infrastructure','Just previews changes','Destroys everything','Updates provider versions'],correct:0,exp:'`terraform apply` executes the changes shown in the plan, creating, modifying, or destroying real resources.'},
  {q:'How do you declare a variable in Terraform?',opts:['`variable "name" {}`','`var name = value`','`let name = value`','`param name {}`'],correct:0,exp:'Variables are declared with `variable "name" {}` blocks. They can have type, default, and description attributes.'},
  {q:'Which command destroys all Terraform-managed resources?',opts:['terraform destroy','terraform remove','terraform delete','terraform clean'],correct:0,exp:'`terraform destroy` tears down all resources defined in the configuration. Use with caution in production.'},
  {q:'What is a Terraform `provider`?',opts:['A plugin that lets Terraform manage a specific platform (e.g. AWS)','A variable that holds credentials','A type of resource block','The backend configuration'],correct:0,exp:'Providers are plugins that implement resource types for a platform. `hashicorp/aws` lets Terraform manage AWS resources.'},
  {q:'What does `terraform.tfvars` contain?',opts:['Variable values to pass into the configuration','The provider configuration','The state file','The output definitions'],correct:0,exp:'`.tfvars` files supply values for declared variables, keeping secrets and environment-specific values out of main `.tf` files.'},
  {q:'What is the Terraform `remote` backend used for?',opts:['Storing state remotely for team collaboration','Running plans on remote VMs','Downloading providers faster','Encrypting .tf files'],correct:0,exp:'Remote backends (S3, Terraform Cloud) store state remotely so teams share a single source of truth and avoid state conflicts.'},
  {q:'What does `count = 0` on a resource do?',opts:['Effectively removes the resource from the plan','Creates 0 and ignores errors','Keeps the resource but marks it inactive','Is a syntax error'],correct:0,exp:'Setting `count = 0` tells Terraform to manage zero instances of the resource — equivalent to removing it without deleting the block.'},
  {q:'What is a Terraform `output` value?',opts:['A value exported from a module or root config for use elsewhere','A log file from terraform apply','The plan diff summary','A variable default'],correct:0,exp:'`output` blocks expose values (like resource IDs or IPs) after apply, useful for passing data between modules or displaying results.'},
  {q:'What does `terraform fmt` do?',opts:['Rewrites .tf files in canonical style','Validates config syntax','Upgrades provider versions','Formats the state file'],correct:0,exp:'`terraform fmt` reformats .tf files to follow HashiCorp\'s canonical style — useful before committing code.'},
  {q:'What is the `depends_on` meta-argument used for?',opts:['Declare explicit dependencies between resources','Set the creation order of modules','Pin provider versions','Define variable precedence'],correct:0,exp:'`depends_on` forces Terraform to create or destroy a resource only after another, for cases where implicit dependency detection isn\'t enough.'},
  {q:'Which of these is a valid Terraform data source use case?',opts:['Look up an existing AMI ID without managing it','Create a new EC2 instance','Declare a variable default','Format a string output'],correct:0,exp:'Data sources read existing infrastructure without managing it. `data "aws_ami"` fetches the latest AMI ID to reference in resources.'},
];

const TF_TRUTHY = [
  {svc:'Terraform',stmt:'`terraform init` must be run before `terraform plan` or `apply`.',ans:true},
  {svc:'Terraform',stmt:'Terraform state is stored locally by default in `terraform.tfstate`.',ans:true},
  {svc:'Terraform',stmt:'You should commit `terraform.tfstate` directly to version control for team sharing.',ans:false},
  {svc:'Terraform',stmt:'`terraform plan` makes no changes to real infrastructure.',ans:true},
  {svc:'Terraform',stmt:'`terraform apply` always requires manual approval unless `-auto-approve` is passed.',ans:true},
  {svc:'Terraform',stmt:'Terraform providers are automatically updated every time you run `terraform apply`.',ans:false},
  {svc:'Terraform',stmt:'HCL stands for HashiCorp Configuration Language.',ans:true},
  {svc:'Terraform',stmt:'Terraform can only manage AWS resources.',ans:false},
  {svc:'Terraform',stmt:'A `terraform.tfvars` file is automatically loaded if it exists in the working directory.',ans:true},
  {svc:'Terraform',stmt:'`count` and `for_each` are both valid ways to create multiple resource instances.',ans:true},
  {svc:'Terraform',stmt:'Modules in Terraform must always be published to the Terraform Registry.',ans:false},
  {svc:'Terraform',stmt:'`terraform validate` checks configuration syntax without accessing any remote services.',ans:true},
  {svc:'Terraform',stmt:'`terraform destroy` requires `-auto-approve` to run without prompting.',ans:false},
  {svc:'Terraform',stmt:'Output values can be used to pass data between modules.',ans:true},
  {svc:'Terraform',stmt:'`terraform import` brings an existing resource under Terraform management.',ans:true},
  {svc:'Terraform',stmt:'Remote backends allow multiple team members to share the same state file safely.',ans:true},
  {svc:'Terraform',stmt:'Terraform automatically creates a `.terraform.lock.hcl` file to lock provider versions.',ans:true},
  {svc:'Terraform',stmt:'A `data` source block creates and manages a new resource.',ans:false},
  {svc:'Terraform',stmt:'`depends_on` is used to declare explicit resource ordering.',ans:true},
  {svc:'Terraform',stmt:'`terraform fmt` validates configuration correctness.',ans:false},
  {svc:'Terraform',stmt:'Terraform workspaces allow multiple state files within a single configuration.',ans:true},
  {svc:'Terraform',stmt:'Variables declared in a module are automatically available in all child modules.',ans:false},
  {svc:'Terraform',stmt:'`lifecycle { prevent_destroy = true }` prevents a resource from being accidentally deleted.',ans:true},
  {svc:'Terraform',stmt:'Sensitive values marked with `sensitive = true` are hidden from plan output.',ans:true},
  {svc:'Terraform',stmt:'`terraform taint` forces a resource to be destroyed and re-created on next apply.',ans:true},
  {svc:'Terraform',stmt:'You can use `for_each` on a list directly without converting it to a set or map.',ans:false},
  {svc:'Terraform',stmt:'The `local` backend stores state in memory only, lost after the process exits.',ans:false},
  {svc:'Terraform',stmt:'`terraform output` prints the values of all defined output blocks.',ans:true},
  {svc:'Terraform',stmt:'Terraform Cloud provides remote state management and run execution.',ans:true},
  {svc:'Terraform',stmt:'`terraform refresh` updates the state file to match real-world infrastructure.',ans:true},
];

const TF_SCENARIOS = [
  {
    title:'Production AWS Infrastructure',
    desc:'A team needs to provision and manage a VPC, EC2 instances, and an RDS database on AWS together as a unit.',
    components:[
      {label:'Configuration language',correct:'HCL (.tf files)',options:['HCL (.tf files)','YAML only','Python scripts','Bash scripts']},
      {label:'Initialise workspace',correct:'terraform init',options:['terraform init','terraform plan','terraform apply','terraform validate']},
      {label:'Preview changes safely',correct:'terraform plan',options:['terraform plan','terraform apply','terraform fmt','terraform output']},
      {label:'Apply to real infra',correct:'terraform apply',options:['terraform apply','terraform plan','terraform init','terraform taint']},
      {label:'Store shared state',correct:'S3 remote backend',options:['S3 remote backend','Local tfstate only','Git repository','DynamoDB directly']},
    ],
    explanation:'HCL files describe the desired state. `init` downloads the AWS provider. `plan` previews changes. `apply` creates real resources. An S3 remote backend shares state safely across the team with DynamoDB for locking.'
  },
  {
    title:'Reusable Infrastructure Module',
    desc:'A platform team wants to package a standard VPC setup so app teams can reuse it with different variable values.',
    components:[
      {label:'Package the config',correct:'Terraform module',options:['Terraform module','Terraform workspace','Terraform provider','Terraform backend']},
      {label:'Accept config inputs',correct:'variable blocks',options:['variable blocks','output blocks','data sources','lifecycle rules']},
      {label:'Export resource IDs',correct:'output blocks',options:['output blocks','variable blocks','count meta-arg','depends_on']},
      {label:'Call the module',correct:'module block with source',options:['module block with source','resource block','provider block','terraform.tfvars']},
    ],
    explanation:'Modules package reusable configurations. Variables accept inputs from the caller. Outputs expose values like VPC ID back to the root module. The caller uses a `module` block pointing to the module source.'
  },
  {
    title:'Importing Existing Infrastructure',
    desc:'A legacy EC2 instance was created manually. The team wants Terraform to manage it going forward.',
    components:[
      {label:'Write resource block',correct:'resource "aws_instance" block',options:['resource "aws_instance" block','data "aws_instance" block','variable "instance" block','output "instance" block']},
      {label:'Bring under management',correct:'terraform import',options:['terraform import','terraform plan','terraform apply','terraform refresh']},
      {label:'Verify state matches',correct:'terraform plan (expect no changes)',options:['terraform plan (expect no changes)','terraform destroy','terraform taint','terraform init']},
    ],
    explanation:'You write the matching resource block, then `terraform import` maps the real resource to your state. Running `plan` afterwards should show no diff if the config matches reality.'
  },
];

const TF_MATCH_PAIRS = [
  {name:'terraform init',desc:'Downloads providers and sets up working directory'},
  {name:'terraform plan',desc:'Shows changes without touching real infrastructure'},
  {name:'terraform apply',desc:'Executes changes against real infrastructure'},
  {name:'terraform destroy',desc:'Tears down all managed resources'},
  {name:'terraform fmt',desc:'Rewrites .tf files in canonical HCL style'},
  {name:'terraform import',desc:'Brings existing resources under Terraform management'},
  {name:'variable block',desc:'Declares a configurable input for a module or config'},
  {name:'output block',desc:'Exports a value after apply for use elsewhere'},
  {name:'data source',desc:'Reads existing infrastructure without managing it'},
  {name:'remote backend',desc:'Stores state remotely for team collaboration'},
  {name:'terraform validate',desc:'Checks HCL syntax without calling any APIs'},
  {name:'terraform.tfvars',desc:'File supplying values for declared variables'},
];

// ═══════════════════════════════════════════════════
// KUBERNETES GAME DATA
// ═══════════════════════════════════════════════════

const K8S_KUBECTL_ICONS = ['☸️', '⌨️', '📋', '🔍', '📊', '⚙️', '🔄', '💾', '🌐', '🛠️', '📝', '🎯', '🔑', '📁', '🗂️'];
const K8S_TRUTHY_ICONS = ['☸️', '✅', '❓', '💡', '🎯', '📚', '⚙️', '🏗️', '🔄', '💾', '🔑', '📊', '🌐', '🛠️', '📋', '🔍', '⚡', '📝', '🎪', '🏆', '⭐', '💪', '🚀', '🔮', '🧠', '💭', '🎨', '🎪', '🎭', '🎪'];
const K8S_OBJECT_ICONS = ['🗂️', '📦', '🔗', '🌐', '💾', '🔑', '📊', '⚙️', '🏗️', '🔄', '🛠️', '📋', '🎯'];
const K8S_MATCH_ICONS = ['🔗', '🎯', '🧩', '🔍', '📋'];

const K8S_QS = [
  {q:'What does `kubectl apply -f deployment.yaml` do?',opts:['Creates or updates resources defined in the file','Only creates new resources, never updates','Deletes resources in the file','Validates the YAML without applying'],correct:0,exp:'`kubectl apply` is declarative — it creates the resource if it doesn\'t exist, or patches it to match the desired state if it does.'},
  {q:'Which Kubernetes object ensures a specified number of Pod replicas are always running?',opts:['ReplicaSet','ConfigMap','Service','Namespace'],correct:0,exp:'A ReplicaSet watches Pods and ensures the desired replica count is always running, restarting Pods that fail or are deleted.'},
  {q:'What is the purpose of a Kubernetes `Service`?',opts:['Provide a stable network endpoint to reach a set of Pods','Store configuration as key-value pairs','Run a one-off task to completion','Manage persistent storage volumes'],correct:0,exp:'Services give Pods a stable DNS name and IP, load-balancing traffic across matching Pods even as they are created and destroyed.'},
  {q:'What does a `Deployment` add on top of a `ReplicaSet`?',opts:['Rolling updates and rollback history','Persistent storage','External load balancing','Node scheduling constraints'],correct:0,exp:'A Deployment manages a ReplicaSet and adds declarative rolling updates, rollback to previous versions, and update history.'},
  {q:'Which object stores non-sensitive configuration data as key-value pairs?',opts:['ConfigMap','Secret','PersistentVolume','ServiceAccount'],correct:0,exp:'ConfigMaps store non-sensitive config (env vars, config files). Secrets store the same but base64-encoded for sensitive values.'},
  {q:'What is a Kubernetes `Namespace` used for?',opts:['Logically isolate resources within a cluster','Connect Pods to external networks','Schedule Pods on specific nodes','Define CPU and memory limits'],correct:0,exp:'Namespaces partition a cluster into virtual sub-clusters, isolating resources, applying RBAC, and setting resource quotas per team/app.'},
  {q:'Which kubectl command shows the logs of a running Pod?',opts:['kubectl logs <pod>','kubectl describe <pod>','kubectl exec <pod>','kubectl get events'],correct:0,exp:'`kubectl logs <pod>` streams stdout/stderr from the container. Add `-f` to tail live, `--previous` to see logs from a crashed container.'},
  {q:'What does `kubectl describe pod <name>` show?',opts:['Detailed state, events, and conditions of the Pod','Real-time CPU and memory usage','The container image layers','The YAML spec only'],correct:0,exp:'`describe` shows the full object spec plus live events — great for debugging scheduling failures, image pull errors, and crashes.'},
  {q:'Which Service type exposes a Pod on every node\'s IP at a static port?',opts:['NodePort','ClusterIP','LoadBalancer','ExternalName'],correct:0,exp:'NodePort opens the same port on every cluster node, routing traffic to the backing Pods. Useful for testing; not recommended for production.'},
  {q:'What is a `PersistentVolumeClaim` (PVC)?',opts:['A request by a Pod for persistent storage','A physical disk attached to a node','A volume snapshot definition','A storage class policy'],correct:0,exp:'A PVC is a request for storage — it specifies size and access mode. Kubernetes binds it to a matching PersistentVolume (PV).'},
  {q:'What does a `DaemonSet` ensure?',opts:['One Pod runs on every (or selected) node','A fixed number of replicas cluster-wide','Pods restart on a schedule','Jobs complete successfully once'],correct:0,exp:'DaemonSets ensure exactly one Pod per node — perfect for node-level agents like log collectors, monitoring daemons, or CNI plugins.'},
  {q:'Which object runs a Pod to completion for a batch task?',opts:['Job','CronJob','DaemonSet','StatefulSet'],correct:0,exp:'A Job creates one or more Pods and ensures they complete successfully. For scheduled batch work, use a CronJob wrapping a Job.'},
  {q:'What does `kubectl rollout undo deployment/<name>` do?',opts:['Rolls back to the previous revision','Pauses the ongoing rollout','Restarts all Pods immediately','Scales the deployment to zero'],correct:0,exp:'`rollout undo` reverts the Deployment to its previous ReplicaSet revision. Use `--to-revision=N` to go back to a specific version.'},
  {q:'Which resource limits and guarantees CPU/memory per Pod?',opts:['ResourceQuota / LimitRange','ConfigMap','Taint','NetworkPolicy'],correct:0,exp:'`LimitRange` sets per-Pod defaults and ceilings; `ResourceQuota` caps total resource usage per Namespace across all Pods.'},
  {q:'What is the role of `kube-scheduler`?',opts:['Assign Pods to nodes based on resource requirements','Store cluster state in etcd','Expose the API server','Manage container runtimes on nodes'],correct:0,exp:'The scheduler watches for new Pods with no node assigned and selects the best node based on resource requests, taints, and affinity rules.'},
];

const K8S_TRUTHY = [
  {svc:'Kubernetes',stmt:'A Pod is the smallest deployable unit in Kubernetes.',ans:true},
  {svc:'Kubernetes',stmt:'A Pod can contain multiple containers that share the same network namespace.',ans:true},
  {svc:'Kubernetes',stmt:'Kubernetes Pods have stable IP addresses that never change.',ans:false},
  {svc:'Kubernetes',stmt:'A Deployment manages ReplicaSets to provide rolling updates and rollbacks.',ans:true},
  {svc:'Kubernetes',stmt:'A Service with type `ClusterIP` is accessible from outside the cluster by default.',ans:false},
  {svc:'Kubernetes',stmt:'ConfigMaps are suitable for storing sensitive data like passwords.',ans:false},
  {svc:'Kubernetes',stmt:'Secrets in Kubernetes are base64-encoded by default, not encrypted.',ans:true},
  {svc:'Kubernetes',stmt:'A DaemonSet ensures exactly one Pod runs on every node.',ans:true},
  {svc:'Kubernetes',stmt:'A Job will restart Pods indefinitely even after they complete successfully.',ans:false},
  {svc:'Kubernetes',stmt:'Namespaces provide complete security isolation between workloads.',ans:false},
  {svc:'Kubernetes',stmt:'`kubectl apply` is idempotent — running it twice with the same file is safe.',ans:true},
  {svc:'Kubernetes',stmt:'A LoadBalancer Service always provisions a cloud load balancer automatically in any environment.',ans:false},
  {svc:'Kubernetes',stmt:'`kubectl get pods -n kube-system` lists control plane component Pods.',ans:true},
  {svc:'Kubernetes',stmt:'etcd stores the entire cluster state and configuration.',ans:true},
  {svc:'Kubernetes',stmt:'The kubelet runs on control-plane nodes only, not worker nodes.',ans:false},
  {svc:'Kubernetes',stmt:'A PersistentVolumeClaim is a request for storage that binds to a PersistentVolume.',ans:true},
  {svc:'Kubernetes',stmt:'A StatefulSet provides stable, unique network identities and ordered deployments.',ans:true},
  {svc:'Kubernetes',stmt:'`kubectl delete pod <name>` in a Deployment will permanently remove that Pod.',ans:false},
  {svc:'Kubernetes',stmt:'Liveness probes tell Kubernetes when to restart a container.',ans:true},
  {svc:'Kubernetes',stmt:'Readiness probes remove a Pod from Service endpoints when it\'s not ready.',ans:true},
  {svc:'Kubernetes',stmt:'NodePort services are recommended as the primary way to expose production services.',ans:false},
  {svc:'Kubernetes',stmt:'An Ingress resource can route HTTP/HTTPS traffic to multiple Services by path or hostname.',ans:true},
  {svc:'Kubernetes',stmt:'Resource `requests` define the minimum CPU/memory reserved on the node.',ans:true},
  {svc:'Kubernetes',stmt:'Resource `limits` define the maximum CPU/memory a container can use.',ans:true},
  {svc:'Kubernetes',stmt:'Taints and tolerations are used to attract Pods to specific nodes.',ans:false},
  {svc:'Kubernetes',stmt:'Node affinity allows you to constrain Pods to run on nodes with specific labels.',ans:true},
  {svc:'Kubernetes',stmt:'`kubectl rollout undo` reverts a Deployment to its previous version.',ans:true},
  {svc:'Kubernetes',stmt:'A CronJob creates Jobs on a time-based schedule.',ans:true},
  {svc:'Kubernetes',stmt:'RBAC in Kubernetes controls who can perform which actions on which resources.',ans:true},
  {svc:'Kubernetes',stmt:'A ServiceAccount provides an identity for Pods to authenticate against the API server.',ans:true},
];

const K8S_OBJECT_QS = [
  {q:'Your web app needs 5 replicas running at all times, with zero-downtime updates and easy rollback.',ans:'Deployment',opts:['Deployment','ReplicaSet','StatefulSet','DaemonSet'],exp:'Deployments manage ReplicaSets and add rolling update strategy and revision history — perfect for stateless apps.'},
  {q:'A log-collection agent must run on every node in the cluster, including new nodes as they join.',ans:'DaemonSet',opts:['DaemonSet','Deployment','ReplicaSet','Job'],exp:'DaemonSets ensure one Pod per node automatically, even when new nodes are added — ideal for node-level agents.'},
  {q:'A database cluster needs stable hostnames (db-0, db-1, db-2) and persistent volumes per Pod.',ans:'StatefulSet',opts:['StatefulSet','Deployment','ReplicaSet','DaemonSet'],exp:'StatefulSets give Pods stable network identities and ordered, unique persistent storage — required for clustered databases.'},
  {q:'A nightly data import job needs to process a file once and exit successfully.',ans:'Job',opts:['Job','CronJob','DaemonSet','Deployment'],exp:'Jobs run Pods to completion. They retry on failure and track completion status — designed for finite batch tasks.'},
  {q:'The same data import job should run automatically every night at 02:00.',ans:'CronJob',opts:['CronJob','Job','DaemonSet','Deployment'],exp:'CronJobs schedule Jobs using a cron expression (e.g. `0 2 * * *`), creating a new Job at each scheduled time.'},
  {q:'Pods need to reach a backend service using a stable DNS name, not individual Pod IPs.',ans:'Service (ClusterIP)',opts:['Service (ClusterIP)','Ingress','ConfigMap','PersistentVolumeClaim'],exp:'ClusterIP Services give a stable virtual IP and DNS name, load-balancing requests across all matching Pods.'},
  {q:'External users need HTTPS access to multiple web apps on the same IP, routed by hostname.',ans:'Ingress',opts:['Ingress','NodePort Service','LoadBalancer Service','DaemonSet'],exp:'Ingress routes HTTP/HTTPS traffic by hostname or path to different Services — consolidating external access to one entry point.'},
  {q:'An app needs its database connection string injected as an environment variable without hardcoding.',ans:'ConfigMap',opts:['ConfigMap','Secret','PersistentVolume','Namespace'],exp:'ConfigMaps store non-sensitive config as key-value pairs and can be injected as env vars or mounted as files.'},
  {q:'An app needs a database password injected securely — it must not appear in plain text in the spec.',ans:'Secret',opts:['Secret','ConfigMap','PersistentVolume','ServiceAccount'],exp:'Secrets store sensitive data (base64-encoded). Use RBAC to limit access and enable encryption at rest for real security.'},
  {q:'A Pod needs to read and write files that persist across Pod restarts and node failures.',ans:'PersistentVolumeClaim',opts:['PersistentVolumeClaim','ConfigMap','EmptyDir','HostPath'],exp:'PVCs request durable storage that outlives the Pod lifecycle. They bind to PersistentVolumes backed by network storage.'},
  {q:'A team needs their own isolated slice of the cluster with separate resource quotas.',ans:'Namespace',opts:['Namespace','ServiceAccount','NetworkPolicy','LimitRange'],exp:'Namespaces partition the cluster, allowing separate RBAC, resource quotas, and isolation per team or environment.'},
  {q:'You need to prevent Pods from a namespace communicating with Pods in another namespace.',ans:'NetworkPolicy',opts:['NetworkPolicy','Namespace','ServiceAccount','Taint'],exp:'NetworkPolicies define allow/deny rules for Pod-to-Pod traffic at the IP layer — like a firewall within the cluster.'},
];

const K8S_MATCH_PAIRS = [
  {name:'Pod',desc:'Smallest deployable unit — one or more containers sharing network and storage'},
  {name:'Deployment',desc:'Manages ReplicaSets for rolling updates and rollbacks'},
  {name:'Service',desc:'Stable network endpoint and load balancer for a set of Pods'},
  {name:'ConfigMap',desc:'Stores non-sensitive config as key-value pairs'},
  {name:'Secret',desc:'Stores sensitive data base64-encoded'},
  {name:'Namespace',desc:'Logical partition of cluster resources for isolation'},
  {name:'DaemonSet',desc:'Runs one Pod on every node in the cluster'},
  {name:'StatefulSet',desc:'Manages stateful apps with stable identities and ordered storage'},
  {name:'Job',desc:'Runs a Pod to completion for a batch task'},
  {name:'CronJob',desc:'Schedules Jobs on a time-based cron expression'},
  {name:'Ingress',desc:'Routes HTTP/HTTPS traffic to Services by hostname or path'},
  {name:'PersistentVolumeClaim',desc:'Request for durable storage that outlives a Pod'},
];

// ═══════════════════════════════════════════════════
// TERRAFORM GAME STATE
// ═══════════════════════════════════════════════════

let tfState = {
  conceptIdx:0, conceptScore:0, conceptAnswered:false, conceptDeck:[],
  truthyIdx:0, truthyScore:0, truthyStreak:0, truthyAnswered:false, truthyDeck:[],
  scenarioIdx:0, scenarioSlot:0, scenarioAnswers:[],
  matchPairs:[], matchSel:null, matchMatched:0, matchWrong:0, matchStart:0,
};

// ── Terraform Menu ──
function renderTerraformMenu(){
  document.getElementById('game-area').innerHTML=`
    <div class="card" style="text-align:center;padding:12px 16px 10px">
      <div style="font-size:28px;margin-bottom:3px">⚡</div>
      <div style="font-size:17px;font-weight:600;margin-bottom:2px">Terraform Games</div>
      <div style="font-size:12px;color:var(--text2)">HCL · State · Modules · CLI workflow</div>
    </div>

    <div class="section-title" style="padding:0 2px;margin-top:12px">Choose a game</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="startTfGame('concepts')">
        <div class="gm-icon">🛠️</div>
        <div class="gm-name">Concept Quiz</div>
        <div class="gm-desc">HCL syntax, CLI commands, and core concepts.</div>
      </div>
      <div class="game-mode-btn" onclick="startTfGame('truthy')">
        <div class="gm-icon">✅</div>
        <div class="gm-name">True or False</div>
        <div class="gm-desc">30 statements — sort fact from fiction.</div>
      </div>
      <div class="game-mode-btn" onclick="startTfGame('scenario')">
        <div class="gm-icon">🏗️</div>
        <div class="gm-name">Workflow Builder</div>
        <div class="gm-desc">Pick the right command for each step of a real workflow.</div>
      </div>
      <div class="game-mode-btn" onclick="startTfGame('match')">
        <div class="gm-icon">🔗</div>
        <div class="gm-name">Command Match-Up</div>
        <div class="gm-desc">Match Terraform commands to what they do.</div>
      </div>
    </div>
  `;
}

function startTfGame(mode){
  if(mode==='concepts') startTfConceptQuiz();
  else if(mode==='truthy') startTfTruthy();
  else if(mode==='scenario') startTfScenario();
  else if(mode==='match') startTfMatch();
}

// ── Terraform Concept Quiz ──
function startTfConceptQuiz(){
  tfState.conceptDeck=[...TF_CONCEPTS].sort(()=>Math.random()-.5);
  tfState.conceptIdx=0;tfState.conceptScore=0;tfState.conceptAnswered=false;
  renderTfConceptQ();
}
function renderTfConceptQ(){
  const g=tfState;
  if(g.conceptIdx>=g.conceptDeck.length){renderTfConceptEnd();return;}
  const q=g.conceptDeck[g.conceptIdx];
  const opts=[...q.opts.map((text,orig)=>({text,orig}))].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(o=>o.orig===q.correct);
  g._cOpts=opts;g._cCorrect=correct;
  const icon = TF_CONCEPT_ICONS[g.conceptIdx % TF_CONCEPT_ICONS.length];
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderTerraformMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge" style="background:var(--terraform-dim);color:var(--terraform)">${g.conceptIdx+1}/${g.conceptDeck.length}</span><span class="badge b-pass">${g.conceptScore} correct</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px">
      <div style="font-size:24px;margin-bottom:8px">${icon}</div>
      <div style="font-size:15px;font-weight:500;line-height:1.5">${q.q}</div>
    </div>
    <div id="tf-concept-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}" style="font-family:'IBM Plex Mono',monospace;font-size:12px">${o.text}</button>`).join('')}</div>
    <div id="tf-concept-exp"></div>`;
  document.getElementById('tf-concept-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]');if(!btn)return;
    chooseTfConcept(parseInt(btn.dataset.idx));
  });
}
function chooseTfConcept(chosen){
  const g=tfState;if(g.conceptAnswered)return;g.conceptAnswered=true;
  const correct=g._cCorrect,right=chosen===correct;
  const chosenText=g._cOpts[chosen]?.text||'';
  const correctText=g._cOpts[correct]?.text||'';
  recordGameAnswer('TF Concept Quiz',g.conceptDeck[g.conceptIdx].q,chosenText,correctText,right);
  if(right)g.conceptScore++;
  document.querySelectorAll('#tf-concept-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('tf-concept-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${g.conceptDeck[g.conceptIdx].exp}</div>`;
  setTimeout(()=>{g.conceptIdx++;g.conceptAnswered=false;renderTfConceptQ();},right?1400:2200);
}
function renderTfConceptEnd(){
  const g=tfState,pct=Math.round(g.conceptScore/g.conceptDeck.length*100);
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--terraform)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.conceptScore} of ${g.conceptDeck.length} correct</div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-terraform" onclick="startTfConceptQuiz()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
}

// ── Terraform True or False ──
let tfTruthyState={deck:[],idx:0,score:0,streak:0,answered:false};
function startTfTruthy(){
  tfTruthyState.deck=[...TF_TRUTHY].sort(()=>Math.random()-.5);
  tfTruthyState.idx=0;tfTruthyState.score=0;tfTruthyState.streak=0;tfTruthyState.answered=false;
  renderTfTruthyQ();
}
function renderTfTruthyQ(){
  const g=tfTruthyState;if(g.idx>=g.deck.length){renderTfTruthyEnd();return;}
  const fact=g.deck[g.idx];
  const icon = TF_TRUTHY_ICONS[g.idx % TF_TRUTHY_ICONS.length];
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderTerraformMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="game-score-pill" style="background:var(--terraform-dim);color:var(--terraform)">🔥 ${g.streak}</span><span class="game-score-pill" style="background:var(--surface2);color:var(--text2)">${g.idx+1}/${g.deck.length}</span></div>
    </div>
    <div class="game-card" style="min-height:160px">
      <div style="font-size:28px;margin-bottom:5px">${icon}</div>
      <div style="font-size:11px;font-weight:600;color:var(--terraform);margin-bottom:10px;font-family:'IBM Plex Mono',monospace">Terraform</div>
      <div style="font-size:15px;font-weight:500;line-height:1.5;color:var(--text)">"${fact.stmt}"</div>
    </div>
    <div id="tf-truthy-feedback" style="min-height:40px"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px" id="tf-truthy-btns">
      <button class="btn" style="padding:14px;border-color:var(--pass);color:var(--pass);font-size:15px" onclick="answerTfTruthy(true)">✓ True</button>
      <button class="btn" style="padding:14px;border-color:var(--fail);color:var(--fail);font-size:15px" onclick="answerTfTruthy(false)">✗ False</button>
    </div>`;
}
function answerTfTruthy(ans){
  if(tfTruthyState.answered)return;tfTruthyState.answered=true;
  const g=tfTruthyState,fact=g.deck[g.idx],right=ans===fact.ans;
  recordGameAnswer('TF True/False',fact.stmt,ans?'True':'False',fact.ans?'True':'False',right);
  if(right){g.score++;g.streak++;}else{g.streak=0;}
  document.getElementById('tf-truthy-btns').innerHTML=`<button class="btn" style="padding:14px;border-color:var(--pass);color:var(--pass);font-size:15px;opacity:${fact.ans?1:.3}" disabled>✓ True</button><button class="btn" style="padding:14px;border-color:var(--fail);color:var(--fail);font-size:15px;opacity:${!fact.ans?1:.3}" disabled>✗ False</button>`;
  document.getElementById('tf-truthy-feedback').innerHTML=`<div style="text-align:center;padding:8px;font-size:13px;font-weight:600;color:var(--${right?'pass':'fail'})">${right?'✓ Correct!':'✗ Wrong — it\'s '+(fact.ans?'True':'False')}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderTfTruthyQ();},right?900:1600);
}
function renderTfTruthyEnd(){
  const g=tfTruthyState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:40px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--terraform)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-terraform" onclick="startTfTruthy()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
}

// ── Terraform Workflow Builder (Scenario) ──
function startTfScenario(){
  tfState.scenarioIdx=Math.floor(Math.random()*TF_SCENARIOS.length);
  tfState.scenarioSlot=0;tfState.scenarioAnswers=[];
  renderTfScenario();
}
function renderTfScenario(){
  const g=tfState,scen=TF_SCENARIOS[g.scenarioIdx],slot=scen.components[g.scenarioSlot];
  const allOpts=[slot.correct,...slot.options.filter(o=>o!==slot.correct).sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
  const correctPos=allOpts.indexOf(slot.correct);
  g._tfScenOpts=allOpts;g._tfScenCorrect=correctPos;
  const icon = TF_SCENARIO_ICONS[g.scenarioSlot % TF_SCENARIO_ICONS.length];
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderTerraformMenu()">← Menu</button>
      <span class="game-score-pill" style="background:var(--surface2);color:var(--text2)">${g.scenarioSlot+1}/${scen.components.length}</span>
    </div>
    <div class="card" style="padding:12px;margin-bottom:10px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:3px;font-family:'IBM Plex Mono',monospace">Scenario</div>
      <div style="font-size:14px;font-weight:600;margin-bottom:4px">${scen.title}</div>
      <div style="font-size:12px;color:var(--text2);line-height:1.5">${scen.desc}</div>
    </div>
    <div class="game-card" style="margin-bottom:10px">
      <div style="font-size:24px;margin-bottom:8px">${icon}</div>
      <div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Step ${g.scenarioSlot+1}: ${slot.label}</div>
      <div style="font-size:15px;font-weight:600">What handles the <em>${slot.label}</em> step?</div>
    </div>
    <div id="tf-scen-opts">${allOpts.map((opt,i)=>`<button class="game-opt" data-idx="${i}" style="font-family:'IBM Plex Mono',monospace;font-size:12px">${opt}</button>`).join('')}</div>`;
  document.getElementById('tf-scen-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]');if(!btn)return;
    chooseTfScenario(parseInt(btn.dataset.idx));
  });
}
function chooseTfScenario(chosen){
  const g=tfState,correct=g._tfScenCorrect,right=chosen===correct;
  g.scenarioAnswers.push(right);
  document.querySelectorAll('#tf-scen-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  setTimeout(()=>{g.scenarioSlot++;if(g.scenarioSlot>=TF_SCENARIOS[g.scenarioIdx].components.length)renderTfScenarioEnd();else renderTfScenario();},right?900:1600);
}
function renderTfScenarioEnd(){
  const g=tfState,scen=TF_SCENARIOS[g.scenarioIdx],correct=g.scenarioAnswers.filter(Boolean).length,total=scen.components.length;
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${correct===total?'🏆':correct>=total*.6?'⭐':'💪'}</div><div style="font-size:18px;font-weight:600;margin-bottom:4px">${scen.title}</div><div style="font-size:28px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--terraform)">${correct}/${total}</div></div>
    <div class="card" style="padding:12px;margin-bottom:10px">
      <div class="section-title">Workflow explained</div>
      <div style="font-size:13px;color:var(--text2);line-height:1.6">${scen.explanation}</div>
      <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:5px">${scen.components.map((c,i)=>`<span class="badge ${g.scenarioAnswers[i]?'b-pass':'b-fail'}">${g.scenarioAnswers[i]?'✓':'✗'} ${c.correct}</span>`).join('')}</div>
    </div>
    <div class="btn-row"><button class="btn btn-terraform" onclick="startTfScenario()" style="flex:1">Next Scenario</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
}

// ── Terraform Command Match-Up ──
function startTfMatch(){
  const pick=[...TF_MATCH_PAIRS].sort(()=>Math.random()-.5).slice(0,6);
  const all=[
    ...pick.map(p=>({id:p.name,text:p.name,type:'name',pair:p.name})),
    ...pick.map(p=>({id:'d-'+p.name,text:p.desc,type:'desc',pair:p.name}))
  ].sort(()=>Math.random()-.5);
  tfState.matchPairs=all;tfState.matchSel=null;tfState.matchMatched=0;tfState.matchWrong=0;tfState.matchStart=Date.now();
  renderTfMatch();
}
function renderTfMatch(){
  const g=tfState;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderTerraformMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="game-score-pill" style="background:var(--pass-dim);color:var(--pass)">${(g.matchMatched/2)|0}/6</span><span class="game-score-pill" style="background:var(--fail-dim);color:var(--fail)">✗ ${g.matchWrong}</span></div>
    </div>
    <div style="font-size:11px;color:var(--text3);text-align:center;margin-bottom:10px">Match each command or concept to its description</div>
    <div class="match-grid" id="tf-match-grid">
      ${g.matchPairs.map((t,i)=>`<div class="match-tile ${t._matched?'matched':''} ${g.matchSel&&g.matchSel.idx===i?'mt-sel':''}" id="tfmt-${i}" onclick="selectTfTile(${i})" style="font-family:${t.type==='name'?'\'IBM Plex Mono\',monospace':'inherit'};font-size:${t.type==='name'?'11px':'11px'}">${t.text}</div>`).join('')}
    </div>`;
  if(g.matchMatched===12)setTimeout(renderTfMatchEnd,400);
}
function selectTfTile(i){
  const g=tfState,tile=g.matchPairs[i];if(tile._matched)return;
  if(g.matchSel&&g.matchSel.idx===i){g.matchSel=null;renderTfMatch();return;}
  if(!g.matchSel){g.matchSel={idx:i,tile};renderTfMatch();return;}
  const prev=g.matchSel;g.matchSel=null;
  if(prev.tile.pair===tile.pair&&prev.tile.type!==tile.type){
    g.matchPairs[i]._matched=true;g.matchPairs[prev.idx]._matched=true;g.matchMatched+=2;renderTfMatch();
  }else{
    g.matchWrong++;renderTfMatch();
    const el1=document.getElementById('tfmt-'+i),el2=document.getElementById('tfmt-'+prev.idx);
    if(el1)el1.classList.add('mt-wrong');if(el2)el2.classList.add('mt-wrong');
    setTimeout(()=>renderTfMatch(),700);
  }
}
function renderTfMatchEnd(){
  const g=tfState,secs=Math.round((Date.now()-g.matchStart)/1000),stars=g.matchWrong===0?'⭐⭐⭐':g.matchWrong<=3?'⭐⭐':'⭐';
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${stars}</div><div style="font-size:20px;font-weight:600;margin-bottom:4px">All Matched!</div><div style="font-size:13px;color:var(--text2)">${secs}s · ${g.matchWrong} mistakes</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-terraform" onclick="startTfMatch()" style="flex:1">New Round</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
}

// ═══════════════════════════════════════════════════
// KUBERNETES GAME STATE
// ═══════════════════════════════════════════════════

let k8sState = {
  kubectlIdx:0, kubectlScore:0, kubectlAnswered:false, kubectlDeck:[],
  objectIdx:0, objectScore:0, objectAnswered:false, objectDeck:[],
  truthyIdx:0, truthyScore:0, truthyStreak:0, truthyAnswered:false, truthyDeck:[],
  matchPairs:[], matchSel:null, matchMatched:0, matchWrong:0, matchStart:0,
};

// ── Kubernetes Menu ──
function renderK8sMenu(){
  document.getElementById('game-area').innerHTML=`
    <div class="card" style="text-align:center;padding:12px 16px 10px">
      <div style="font-size:28px;margin-bottom:3px">🎪</div>
      <div style="font-size:17px;font-weight:600;margin-bottom:2px">Kubernetes Games</div>
      <div style="font-size:12px;color:var(--text2)">Pods · Deployments · Services · kubectl</div>
    </div>

    <div class="section-title" style="padding:0 2px;margin-top:12px">Choose a game</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="startK8sGame('kubectl')">
        <div class="gm-icon">⌨️</div>
        <div class="gm-name">kubectl Quiz</div>
        <div class="gm-desc">Identify what each command or concept does.</div>
      </div>
      <div class="game-mode-btn" onclick="startK8sGame('truthy')">
        <div class="gm-icon">✅</div>
        <div class="gm-name">True or False</div>
        <div class="gm-desc">30 Kubernetes statements — fact or fiction?</div>
      </div>
      <div class="game-mode-btn" onclick="startK8sGame('object')">
        <div class="gm-icon">🗂️</div>
        <div class="gm-name">Object Chooser</div>
        <div class="gm-desc">Pick the right K8s object for the scenario.</div>
      </div>
      <div class="game-mode-btn" onclick="startK8sGame('match')">
        <div class="gm-icon">🔗</div>
        <div class="gm-name">Resource Match-Up</div>
        <div class="gm-desc">Match resource names to their descriptions.</div>
      </div>
    </div>
  `;
}

function startK8sGame(mode){
  if(mode==='kubectl') startK8sKubectl();
  else if(mode==='truthy') startK8sTruthy();
  else if(mode==='object') startK8sObject();
  else if(mode==='match') startK8sMatch();
}

// ── kubectl Quiz ──
function startK8sKubectl(){
  k8sState.kubectlDeck=[...K8S_QS].sort(()=>Math.random()-.5);
  k8sState.kubectlIdx=0;k8sState.kubectlScore=0;k8sState.kubectlAnswered=false;
  renderK8sKubectlQ();
}
function renderK8sKubectlQ(){
  const g=k8sState;
  if(g.kubectlIdx>=g.kubectlDeck.length){renderK8sKubectlEnd();return;}
  const q=g.kubectlDeck[g.kubectlIdx];
  const opts=[...q.opts.map((text,orig)=>({text,orig}))].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(o=>o.orig===q.correct);
  g._kOpts=opts;g._kCorrect=correct;
  const icon = K8S_KUBECTL_ICONS[g.kubectlIdx % K8S_KUBECTL_ICONS.length];
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderK8sMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge" style="background:var(--ckad-dim);color:var(--ckad)">${g.kubectlIdx+1}/${g.kubectlDeck.length}</span><span class="badge b-pass">${g.kubectlScore} correct</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px">
      <div style="font-size:24px;margin-bottom:8px">${icon}</div>
      <div style="font-size:15px;font-weight:500;line-height:1.5">${q.q}</div>
    </div>
    <div id="k8s-kubectl-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}">${o.text}</button>`).join('')}</div>
    <div id="k8s-kubectl-exp"></div>`;
  document.getElementById('k8s-kubectl-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]');if(!btn)return;
    chooseK8sKubectl(parseInt(btn.dataset.idx));
  });
}
function chooseK8sKubectl(chosen){
  const g=k8sState;if(g.kubectlAnswered)return;g.kubectlAnswered=true;
  const correct=g._kCorrect,right=chosen===correct;
  const chosenText=g._kOpts[chosen]?.text||'';
  const correctText=g._kOpts[correct]?.text||'';
  recordGameAnswer('K8s kubectl Quiz',g.kubectlDeck[g.kubectlIdx].q,chosenText,correctText,right);
  if(right)g.kubectlScore++;
  document.querySelectorAll('#k8s-kubectl-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('k8s-kubectl-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${g.kubectlDeck[g.kubectlIdx].exp}</div>`;
  setTimeout(()=>{g.kubectlIdx++;g.kubectlAnswered=false;renderK8sKubectlQ();},right?1400:2200);
}
function renderK8sKubectlEnd(){
  const g=k8sState,pct=Math.round(g.kubectlScore/g.kubectlDeck.length*100);
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--ckad)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.kubectlScore} of ${g.kubectlDeck.length} correct</div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-ckad" onclick="startK8sKubectl()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderK8sMenu()">Menu</button></div>`;
}

// ── K8s True or False ──
let k8sTruthyState={deck:[],idx:0,score:0,streak:0,answered:false};
function startK8sTruthy(){
  k8sTruthyState.deck=[...K8S_TRUTHY].sort(()=>Math.random()-.5);
  k8sTruthyState.idx=0;k8sTruthyState.score=0;k8sTruthyState.streak=0;k8sTruthyState.answered=false;
  renderK8sTruthyQ();
}
function renderK8sTruthyQ(){
  const g=k8sTruthyState;if(g.idx>=g.deck.length){renderK8sTruthyEnd();return;}
  const fact=g.deck[g.idx];
  const icon = K8S_TRUTHY_ICONS[g.idx % K8S_TRUTHY_ICONS.length];
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderK8sMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="game-score-pill" style="background:var(--ckad-dim);color:var(--ckad)">🔥 ${g.streak}</span><span class="game-score-pill" style="background:var(--surface2);color:var(--text2)">${g.idx+1}/${g.deck.length}</span></div>
    </div>
    <div class="game-card" style="min-height:160px">
      <div style="font-size:28px;margin-bottom:5px">${icon}</div>
      <div style="font-size:11px;font-weight:600;color:var(--ckad);margin-bottom:10px;font-family:'IBM Plex Mono',monospace">Kubernetes</div>
      <div style="font-size:15px;font-weight:500;line-height:1.5;color:var(--text)">"${fact.stmt}"</div>
    </div>
    <div id="k8s-truthy-feedback" style="min-height:40px"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px" id="k8s-truthy-btns">
      <button class="btn" style="padding:14px;border-color:var(--pass);color:var(--pass);font-size:15px" onclick="answerK8sTruthy(true)">✓ True</button>
      <button class="btn" style="padding:14px;border-color:var(--fail);color:var(--fail);font-size:15px" onclick="answerK8sTruthy(false)">✗ False</button>
    </div>`;
}
function answerK8sTruthy(ans){
  if(k8sTruthyState.answered)return;k8sTruthyState.answered=true;
  const g=k8sTruthyState,fact=g.deck[g.idx],right=ans===fact.ans;
  recordGameAnswer('K8s True/False',fact.stmt,ans?'True':'False',fact.ans?'True':'False',right);
  if(right){g.score++;g.streak++;}else{g.streak=0;}
  document.getElementById('k8s-truthy-btns').innerHTML=`<button class="btn" style="padding:14px;border-color:var(--pass);color:var(--pass);font-size:15px;opacity:${fact.ans?1:.3}" disabled>✓ True</button><button class="btn" style="padding:14px;border-color:var(--fail);color:var(--fail);font-size:15px;opacity:${!fact.ans?1:.3}" disabled>✗ False</button>`;
  document.getElementById('k8s-truthy-feedback').innerHTML=`<div style="text-align:center;padding:8px;font-size:13px;font-weight:600;color:var(--${right?'pass':'fail'})">${right?'✓ Correct!':'✗ Wrong — it\'s '+(fact.ans?'True':'False')}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderK8sTruthyQ();},right?900:1600);
}
function renderK8sTruthyEnd(){
  const g=k8sTruthyState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:40px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--ckad)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-ckad" onclick="startK8sTruthy()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderK8sMenu()">Menu</button></div>`;
}

// ── K8s Object Chooser ──
let k8sObjectState={deck:[],idx:0,score:0,answered:false};
function startK8sObject(){
  k8sObjectState.deck=[...K8S_OBJECT_QS].sort(()=>Math.random()-.5);
  k8sObjectState.idx=0;k8sObjectState.score=0;k8sObjectState.answered=false;
  renderK8sObjectQ();
}
function renderK8sObjectQ(){
  const g=k8sObjectState;if(g.idx>=g.deck.length){renderK8sObjectEnd();return;}
  const q=g.deck[g.idx];
  const opts=[...q.opts].sort(()=>Math.random()-.5);
  const correct=opts.indexOf(q.ans);
  g._oOpts=opts;g._oCorrect=correct;
  const icon = K8S_OBJECT_ICONS[g.idx % K8S_OBJECT_ICONS.length];
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderK8sMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge" style="background:var(--ckad-dim);color:var(--ckad)">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} correct</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px">
      <div style="font-size:24px;margin-bottom:8px">${icon}</div>
      <div style="font-size:15px;font-weight:500;line-height:1.5">${q.q}</div>
    </div>
    <div id="k8s-obj-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}">${o}</button>`).join('')}</div>
    <div id="k8s-obj-exp"></div>`;
  document.getElementById('k8s-obj-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]');if(!btn)return;
    chooseK8sObject(parseInt(btn.dataset.idx));
  });
}
function chooseK8sObject(chosen){
  const g=k8sObjectState;if(g.answered)return;g.answered=true;
  const correct=g._oCorrect,right=chosen===correct;
  const chosenText=g._oOpts[chosen]||'';
  recordGameAnswer('K8s Object Chooser',g.deck[g.idx].q,chosenText,g.deck[g.idx].ans,right);
  if(right)g.score++;
  document.querySelectorAll('#k8s-obj-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('k8s-obj-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${g.deck[g.idx].exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderK8sObjectQ();},right?1400:2200);
}
function renderK8sObjectEnd(){
  const g=k8sObjectState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--ckad)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-ckad" onclick="startK8sObject()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderK8sMenu()">Menu</button></div>`;
}

// ── K8s Resource Match-Up ──
function startK8sMatch(){
  const pick=[...K8S_MATCH_PAIRS].sort(()=>Math.random()-.5).slice(0,6);
  const all=[
    ...pick.map(p=>({id:p.name,text:p.name,type:'name',pair:p.name})),
    ...pick.map(p=>({id:'d-'+p.name,text:p.desc,type:'desc',pair:p.name}))
  ].sort(()=>Math.random()-.5);
  k8sState.matchPairs=all;k8sState.matchSel=null;k8sState.matchMatched=0;k8sState.matchWrong=0;k8sState.matchStart=Date.now();
  renderK8sMatch();
}
function renderK8sMatch(){
  const g=k8sState;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderK8sMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="game-score-pill" style="background:var(--pass-dim);color:var(--pass)">${(g.matchMatched/2)|0}/6</span><span class="game-score-pill" style="background:var(--fail-dim);color:var(--fail)">✗ ${g.matchWrong}</span></div>
    </div>
    <div style="font-size:11px;color:var(--text3);text-align:center;margin-bottom:10px">Match each Kubernetes resource to its description</div>
    <div class="match-grid" id="k8s-match-grid">
      ${g.matchPairs.map((t,i)=>`<div class="match-tile ${t._matched?'matched':''} ${g.matchSel&&g.matchSel.idx===i?'mt-sel':''}" id="k8smt-${i}" onclick="selectK8sTile(${i})">${t.text}</div>`).join('')}
    </div>`;
  if(g.matchMatched===12)setTimeout(renderK8sMatchEnd,400);
}
function selectK8sTile(i){
  const g=k8sState,tile=g.matchPairs[i];if(tile._matched)return;
  if(g.matchSel&&g.matchSel.idx===i){g.matchSel=null;renderK8sMatch();return;}
  if(!g.matchSel){g.matchSel={idx:i,tile};renderK8sMatch();return;}
  const prev=g.matchSel;g.matchSel=null;
  if(prev.tile.pair===tile.pair&&prev.tile.type!==tile.type){
    g.matchPairs[i]._matched=true;g.matchPairs[prev.idx]._matched=true;g.matchMatched+=2;renderK8sMatch();
  }else{
    g.matchWrong++;renderK8sMatch();
    const el1=document.getElementById('k8smt-'+i),el2=document.getElementById('k8smt-'+prev.idx);
    if(el1)el1.classList.add('mt-wrong');if(el2)el2.classList.add('mt-wrong');
    setTimeout(()=>renderK8sMatch(),700);
  }
}
function renderK8sMatchEnd(){
  const g=k8sState,secs=Math.round((Date.now()-g.matchStart)/1000),stars=g.matchWrong===0?'⭐⭐⭐':g.matchWrong<=3?'⭐⭐':'⭐';
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${stars}</div><div style="font-size:20px;font-weight:600;margin-bottom:4px">All Matched!</div><div style="font-size:13px;color:var(--text2)">${secs}s · ${g.matchWrong} mistakes</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-ckad" onclick="startK8sMatch()" style="flex:1">New Round</button><button class="btn btn-ghost" onclick="renderK8sMenu()">Menu</button></div>`;
}
