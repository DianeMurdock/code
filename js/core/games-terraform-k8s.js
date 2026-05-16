// Terraform & Kubernetes Games Module

// ═══════════════════════════════════════════════════
// TERRAFORM GAME DATA
// ═══════════════════════════════════════════════════

const TF_CONCEPT_ICONS = ['🔧', '⚙️', '🏗️', '📁', '🔄', '💾', '🔑', '📊', '🌐', '🛠️', '📋', '🔍', '⚡', '📝', '🎯', '🔧', '⚙️', '🏗️', '📁', '🔄', '💾', '🔑', '📊', '🌐', '🛠️'];
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
  {q:'What does `terraform validate` check?',opts:['HCL syntax and internal consistency without calling APIs','Whether the planned infra is cost-effective','Provider version compatibility online','That state matches real infrastructure'],correct:0,exp:'`terraform validate` checks that your configuration is syntactically valid and internally consistent — no API calls, no credentials needed.'},
  {q:'What is the `.terraform.lock.hcl` file for?',opts:['Locks provider versions so the same version is used by everyone','Prevents `terraform destroy` from running','Stores encrypted secrets','Locks the state file during apply'],correct:0,exp:'The lock file records the exact provider versions selected during `init`, ensuring everyone on the team uses identical providers.'},
  {q:'Which meta-argument iterates over a map or set to create multiple resources?',opts:['for_each','count','replicate','loop'],correct:0,exp:'`for_each` iterates over a map or set of strings, creating one instance per element. Each instance gets a stable key, unlike numeric `count`.'},
  {q:'What is a Terraform `workspace`?',opts:['A named isolated state file within the same configuration','A separate AWS account per environment','A Git branch for Terraform code','A Terraform Cloud organisation'],correct:0,exp:'Workspaces allow one configuration to manage multiple state files (e.g., dev, staging, prod) without duplicating code.'},
  {q:'How do you force Terraform to destroy and recreate a specific resource on next apply? (TA-004)',opts:['`terraform apply -replace=<resource_address>`','`terraform taint <resource_address>`','`terraform destroy -target=<resource_address>` then apply','`terraform state rm` then apply'],correct:0,exp:'`terraform taint` was deprecated in Terraform 0.15 and removed. TA-004 expects `terraform apply -replace=<address>` — it plans and applies the replacement in one step.'},
  {q:'How do you reference a local value in Terraform?',opts:['`local.<name>`','`locals.<name>`','`var.<name>`','`self.<name>`'],correct:0,exp:'Local values are defined in a `locals {}` block and referenced as `local.<name>`. They are computed expressions reused within a module.'},
  {q:'What does the `lifecycle { create_before_destroy = true }` setting do?',opts:['Creates the replacement resource before destroying the old one','Destroys the resource before creating the replacement','Prevents the resource from being destroyed','Makes the resource immutable'],correct:0,exp:'`create_before_destroy` ensures zero-downtime replacements by provisioning the new resource first, then destroying the old one.'},
  {q:'Which Terraform Cloud feature runs plans and applies on remote infrastructure?',opts:['Remote Execution (runs)','State Locking','Private Module Registry','Sentinel Policies'],correct:0,exp:'Terraform Cloud runs execute `plan` and `apply` on Terraform Cloud\'s own infrastructure — keeping credentials off developer machines.'},
  {q:'What is the purpose of `terraform state mv`?',opts:['Rename or relocate a resource in state without destroying it','Move a state file to a different backend','Apply changes to a specific resource only','Import a resource into state'],correct:0,exp:'`terraform state mv` renames or reorganises resources in state — useful when refactoring code (e.g., moving a resource into a module) without re-creating infrastructure.'},
  {q:'What does `sensitive = true` on an output block do?',opts:['Hides the value from CLI output and logs','Encrypts the value in the state file','Prevents the value being passed to child modules','Deletes the value after apply'],correct:0,exp:'`sensitive = true` redacts the output value from `terraform plan`/`apply` terminal output. The value is still stored in state (unencrypted).'},
  {q:'What is a Terraform `check` block used for? (TA-004)',opts:['Standalone assertions that validate infrastructure state at the end of plan/apply','Validate a variable value at plan time','Check provider version compatibility','Verify state file integrity'],correct:0,exp:'`check` blocks (TA-004) run assertions at the end of every plan and apply. They are NOT resource-specific — they report warnings without blocking apply, making them ideal for postcondition monitoring.'},
  {q:'What is the difference between a `precondition` and a `postcondition` in Terraform? (TA-004)',opts:['Precondition validates BEFORE resource creation; postcondition validates AFTER','Precondition validates variables only; postcondition validates outputs','Precondition blocks apply; postcondition blocks plan','They are the same — both run during plan'],correct:0,exp:'`precondition` blocks validate assumptions before Terraform creates/updates a resource (e.g., "the AMI must exist"). `postcondition` blocks validate guarantees after creation (e.g., "the bucket must have versioning enabled").'},
  {q:'What are ephemeral values in Terraform 1.12? (TA-004)',opts:['Sensitive values that are NOT stored in state or shown in plan output','Values that expire after 24 hours','Temporary local variables only valid during a single run','Outputs that are deleted after destroy'],correct:0,exp:'Ephemeral values are transient — they pass through Terraform during plan/apply but are never written to state. Used for secrets like passwords that should not persist in state files.'},
  {q:'What is a `lifecycle { ignore_changes = [...] }` block used for?',opts:['Tell Terraform to ignore specific attribute changes made outside Terraform','Prevent a resource from being destroyed','Create a resource before destroying the old one','Skip validation for certain attributes'],correct:0,exp:'`ignore_changes` tells Terraform not to update a resource when specific attributes drift from config — useful for attributes managed externally (e.g., auto-scaling group desired count).'},
  {q:'What is a Terraform variable `validation` block? (TA-004)',opts:['A custom rule that rejects invalid variable values at plan time','A check that runs after apply','A way to mark variables as required','A schema for complex variable types'],correct:0,exp:'`validation` blocks inside `variable` declarations enforce custom rules. If the `condition` expression returns false, Terraform errors with your `error_message` — before touching any infrastructure.'},
  {q:'What are HCP Terraform Projects? (TA-004)',opts:['An organisational layer above workspaces for grouping related workspaces','A Git repository linked to HCP Terraform','A collection of variable sets','A Sentinel policy group'],correct:0,exp:'Projects in HCP Terraform sit above workspaces in the hierarchy — they group related workspaces (e.g., by team or application) and allow access control at the project level.'},
  {q:'What does `terraform apply -refresh-only` do? (TA-004)',opts:['Updates state to match real infrastructure without making any resource changes','Applies changes and refreshes provider plugins','Refreshes the provider cache','Destroys and recreates all resources'],correct:0,exp:'`-refresh-only` detects drift between state and real infrastructure. It proposes state updates only — no resource changes. This replaces the deprecated `terraform refresh` command.'},
  // ── Functions & Expressions ──
  {q:'What does the `toset()` function do in Terraform?',opts:['Converts a list to a set — removes duplicates and enables `for_each`','Converts a string to a set of characters','Creates a new variable of type set','Sorts a list alphabetically'],correct:0,exp:'`for_each` requires a map or set — not a list. `toset([...])` converts a list to a set (removing duplicates) so it can be used with `for_each`. Each element becomes an instance key.'},
  {q:'What is the result of `format("app-%s-%d", "prod", 3)` in Terraform?',opts:['"app-prod-3"','"app-%s-%d"','A syntax error','`format` requires a list argument'],correct:0,exp:'`format()` works like printf — `%s` for strings, `%d` for integers, `%f` for floats. `format("app-%s-%d","prod",3)` produces `"app-prod-3"`.'},
  {q:'Which function safely retrieves a map value with a fallback if the key is missing?',opts:['`lookup(map, key, default)`','`get(map, key, default)`','`find(map, key, default)`','`try(map[key], default)`'],correct:0,exp:'`lookup(map, key, default)` returns the value for `key`, or `default` if the key does not exist. `try()` also works for safe access but has different semantics.'},
  {q:'What does a `for` expression like `[for s in var.servers : s.name]` produce?',opts:['A new list containing the `name` attribute of each server','A map of server names','A set of unique server names','A filtered list of servers'],correct:0,exp:'`for` expressions transform collections. `[for item in collection : expression]` builds a new list. Use `{for ... : key => value}` for maps, and add `if condition` to filter.'},
  {q:'What is the Terraform ternary expression syntax?',opts:['`condition ? true_val : false_val`','`if condition then true_val else false_val`','`condition ?? true_val : false_val`','`switch(condition, true_val, false_val)`'],correct:0,exp:'Terraform uses `condition ? true_val : false_val` for inline conditionals. Example: `var.env == "prod" ? "t3.large" : "t3.micro"` selects an instance type based on environment.'},
  {q:'What is a `dynamic` block used for?',opts:['Generating repeated nested blocks programmatically from a collection','Dynamically selecting a provider at runtime','Switching between resource types','Enabling dynamic typing on variables'],correct:0,exp:'`dynamic` blocks generate multiple nested blocks (like `ingress`) from a collection without copy-pasting. The `for_each` meta-argument iterates the collection; `content {}` defines the block template.'},
  {q:'Which function reads a local file and returns its contents as a string?',opts:['`file("path/to/file")`','`read("path/to/file")`','`load("path/to/file")`','`fileread("path/to/file")`'],correct:0,exp:'`file()` reads a local file at the given path and returns its contents as a string. Common use: loading IAM policy JSON, user-data scripts, or SSH public keys into resource arguments.'},
  // ── IaC Fundamentals ──
  {q:'Terraform is described as "declarative". What does this mean?',opts:['You describe the desired end state — Terraform figures out how to achieve it','You write step-by-step instructions that Terraform executes in order','You write scripts in Python or Go to manage infrastructure','Terraform only creates resources, never modifies them'],correct:0,exp:'Declarative means you declare WHAT you want ("3 EC2 instances in us-east-1"), not HOW to get there. Terraform calculates the required API calls. This contrasts with imperative tools like Ansible scripts.'},
  {q:'Which tool would you choose for AWS-only infrastructure if you want deep native integration and no cost?',opts:['AWS CloudFormation','Terraform','Pulumi','Ansible'],correct:0,exp:'CloudFormation is AWS-native, free, and deeply integrated with AWS services (StackSets, Service Catalog, CloudFormation Guard). Use Terraform when you need multi-cloud or prefer HCL.'},
  // ── Provider version constraints ──
  {q:'What does the version constraint `"~> 5.0"` mean for a Terraform provider?',opts:['Any version >= 5.0.0 and < 6.0.0','Exactly version 5.0.0','Any version >= 5.0.0','Any 5.x.x or 6.x.x version'],correct:0,exp:'`~>` is the "pessimistic constraint" — it allows patch and minor upgrades within the same major version. `"~> 5.0"` means `>= 5.0.0, < 6.0.0`. `"~> 5.1.2"` would mean `>= 5.1.2, < 5.2.0`.'},
  {q:'Why should you commit `.terraform.lock.hcl` to version control?',opts:['It locks provider versions so all team members and CI use identical providers','It stores encrypted credentials for providers','It prevents `terraform destroy` from running','It records the Terraform version used'],correct:0,exp:'The lock file records exact provider versions and checksums. Committing it ensures every developer and CI/CD run uses identical providers — preventing "works on my machine" provider version drift.'},
  // ── Provider aliases / multi-region ──
  {q:'How do you configure Terraform to manage resources in two different AWS regions?',opts:['Use two `provider "aws"` blocks with different `alias` and `region` values','Use two separate Terraform projects','Set `region` in each resource block','Use `count` with different regions'],correct:0,exp:'Provider aliases let you configure the same provider multiple times. Give each a unique `alias`, set a different `region`, then reference the alias in resources with `provider = aws.<alias>`.'},
  // ── HCP RBAC ──
  {q:'In HCP Terraform, which permission level allows a team to trigger plans but NOT apply them?',opts:['Plan','Read','Write','Admin'],correct:0,exp:'HCP Terraform has four levels: Read (view only) → Plan (trigger plans) → Write (plan + apply + manage variables) → Admin (full control). "Plan" lets teams review infra changes without being able to apply them.'},
  {q:'What is the HCP Terraform VCS-driven workflow?',opts:['A workspace connected to a Git repo — plans trigger on PRs, applies trigger on merge','Running `terraform apply` from your terminal with remote state','Calling the HCP Terraform API from a CI/CD pipeline','Storing .tf files in HCP Terraform directly'],correct:0,exp:'VCS-driven workspaces connect to GitHub, GitLab, Bitbucket, etc. Opening a PR triggers a speculative plan. Merging to the target branch triggers an apply. No local CLI needed for day-to-day ops.'},
  {q:'What are Sentinel policies in HCP Terraform?',opts:['Policy-as-code rules that run between plan and apply — can block or warn','Access control policies for workspace permissions','Git branch protection rules for Terraform repos','Policies for naming conventions in state files'],correct:0,exp:'Sentinel is a policy-as-code framework. Policies run between plan and apply. Three enforcement levels: Advisory (warn only), Soft Mandatory (warn; admins can override), Hard Mandatory (always blocks).'},
  // ── Troubleshooting ──
  {q:'Which environment variable enables Terraform debug logging?',opts:['`TF_LOG`','`TERRAFORM_DEBUG`','`TF_DEBUG`','`TF_VERBOSE`'],correct:0,exp:'Set `TF_LOG=DEBUG` (or TRACE, INFO, WARN, ERROR) to enable logging. `TF_LOG_PATH=./tf.log` writes logs to a file. TRACE is the most verbose and shows every provider API call.'},
  {q:'What does `terraform console` do?',opts:['Opens an interactive REPL to evaluate HCL expressions against current state','Connects to the HCP Terraform web console','Opens a shell inside the provider VM','Shows the plan diff in a formatted view'],correct:0,exp:'`terraform console` is a REPL for testing expressions: functions, variable references, for/if logic — against your current state and variables. Great for debugging before committing to config.'},
  // ── Lifecycle deep-dive ──
  {q:'What does `lifecycle { replace_triggered_by = [aws_security_group.app.id] }` do? (TA-004)',opts:['Forces the resource to be replaced whenever the referenced security group is replaced','Adds a dependency between the resources','Prevents the resource from being destroyed if the security group changes','Makes the resource wait for the security group to be created first'],correct:0,exp:'`replace_triggered_by` forces resource replacement when referenced resources or attributes change — even if the resource\'s own config is unchanged. Introduced in TA-004 to cascade replacements between sibling resources.'},
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
  {svc:'Terraform',stmt:'`terraform taint` was deprecated in Terraform 0.15 — use `terraform apply -replace` instead.',ans:true},
  {svc:'Terraform',stmt:'You can use `for_each` on a list directly without converting it to a set or map.',ans:false},
  {svc:'Terraform',stmt:'The `local` backend stores state in memory only, lost after the process exits.',ans:false},
  {svc:'Terraform',stmt:'`terraform output` prints the values of all defined output blocks.',ans:true},
  {svc:'Terraform',stmt:'Terraform Cloud provides remote state management and run execution.',ans:true},
  {svc:'Terraform',stmt:'`terraform apply -refresh-only` is the TA-004 replacement for the deprecated `terraform refresh` command.',ans:true},
  {svc:'Terraform',stmt:'`terraform taint` is the recommended TA-004 way to force resource replacement.',ans:false},
  {svc:'Terraform',stmt:'`check` blocks in Terraform fail the apply if their assertion is false.',ans:false},
  {svc:'Terraform',stmt:'`precondition` blocks validate assumptions before a resource is created or updated.',ans:true},
  {svc:'Terraform',stmt:'`postcondition` blocks run after resource creation to validate guarantees.',ans:true},
  {svc:'Terraform',stmt:'Ephemeral values in Terraform 1.12 are stored in the state file for reuse.',ans:false},
  {svc:'Terraform',stmt:'`lifecycle { ignore_changes = [tags] }` prevents Terraform from updating the `tags` attribute if it drifts.',ans:true},
  {svc:'Terraform',stmt:'HCP Terraform Projects group workspaces and allow project-level access control.',ans:true},
  {svc:'Terraform',stmt:'Variable `validation` blocks run after `terraform apply` completes.',ans:false},
  {svc:'Terraform',stmt:'`terraform apply -replace=<address>` is the TA-004 successor to the deprecated `terraform taint`.',ans:true},
  // ── Functions & Expressions ──
  {svc:'Terraform',stmt:'`for_each` can iterate directly over a list without any conversion.',ans:false},
  {svc:'Terraform',stmt:'`toset()` removes duplicate values from a list.',ans:true},
  {svc:'Terraform',stmt:'The `file()` function reads a local file at plan time and embeds its contents as a string.',ans:true},
  {svc:'Terraform',stmt:'`dynamic` blocks allow you to generate multiple nested blocks from a collection without repetition.',ans:true},
  {svc:'Terraform',stmt:'The ternary expression `var.create ? 1 : 0` is valid Terraform HCL for conditional resource creation.',ans:true},
  {svc:'Terraform',stmt:'`lookup(map, key)` throws an error if the key does not exist and no default is provided.',ans:true},
  {svc:'Terraform',stmt:'`terraform console` makes live changes to your infrastructure when you run expressions.',ans:false},
  // ── IaC & Provider Fundamentals ──
  {svc:'Terraform',stmt:'Terraform is an imperative tool — you write step-by-step instructions to build infrastructure.',ans:false},
  {svc:'Terraform',stmt:'Running `terraform apply` twice with unchanged config will not create duplicate resources.',ans:true},
  {svc:'Terraform',stmt:'The `.terraform.lock.hcl` file should be committed to version control.',ans:true},
  {svc:'Terraform',stmt:'The `.terraform/` directory should be committed to version control.',ans:false},
  {svc:'Terraform',stmt:'Provider aliases allow you to manage resources in multiple AWS regions from one Terraform config.',ans:true},
  {svc:'Terraform',stmt:'`"~> 5.0"` as a provider version constraint allows version 6.0.0 to be installed.',ans:false},
  // ── HCP Terraform & Workflows ──
  {svc:'Terraform',stmt:'In HCP Terraform, a team with "Plan" permission can trigger applies without approval.',ans:false},
  {svc:'Terraform',stmt:'Sentinel Hard Mandatory policies cannot be overridden even by organisation owners.',ans:true},
  {svc:'Terraform',stmt:'In a VCS-driven HCP Terraform workspace, opening a pull request triggers a speculative plan.',ans:true},
  {svc:'Terraform',stmt:'Dynamic credentials in HCP Terraform use OIDC to generate short-lived cloud credentials.',ans:true},
  {svc:'Terraform',stmt:'Variable Sets in HCP Terraform must be applied to every workspace individually.',ans:false},
  // ── Troubleshooting ──
  {svc:'Terraform',stmt:'Setting `TF_LOG=TRACE` provides the most verbose Terraform debug output.',ans:true},
  {svc:'Terraform',stmt:'`TF_LOG_PATH` writes Terraform debug logs to a specified file instead of stderr.',ans:true},
  // ── Lifecycle ──
  {svc:'Terraform',stmt:'`replace_triggered_by` forces a resource to be replaced when a referenced resource or attribute changes.',ans:true},
  {svc:'Terraform',stmt:'`lifecycle { prevent_destroy = true }` prevents a resource from being deleted even if you run `terraform destroy`.',ans:true},
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
  {
    title:'Multi-Environment Deployment',
    desc:'A team needs to deploy the same infrastructure to dev, staging, and prod without duplicating code.',
    components:[
      {label:'Isolate environments',correct:'Terraform workspaces',options:['Terraform workspaces','Separate .tf files per env','One backend per region','Multiple state files manually']},
      {label:'Select the right environment',correct:'terraform workspace select',options:['terraform workspace select','terraform env switch','terraform apply -env','terraform plan -workspace']},
      {label:'Reference environment name in config',correct:'terraform.workspace',options:['terraform.workspace','var.environment','local.env','data.workspace.name']},
      {label:'Keep secrets out of code',correct:'terraform.tfvars or TF_VAR_ env vars',options:['terraform.tfvars or TF_VAR_ env vars','Hardcode in main.tf','Store in state file','Use .env file']},
    ],
    explanation:'Workspaces give each environment its own state file without duplicating code. `terraform.workspace` exposes the current workspace name. Sensitive values stay out of code via `.tfvars` files or `TF_VAR_` environment variables.'
  },
  {
    title:'Securing Remote State',
    desc:'A team stores Terraform state in S3 and needs to prevent simultaneous apply conflicts and unauthorised reads.',
    components:[
      {label:'Remote state storage',correct:'S3 bucket (versioned)',options:['S3 bucket (versioned)','Local tfstate file','Git repository','DynamoDB only']},
      {label:'Prevent concurrent applies',correct:'DynamoDB table for state locking',options:['DynamoDB table for state locking','S3 object lock','IAM policy only','terraform lock command']},
      {label:'Encrypt state at rest',correct:'S3 server-side encryption (SSE)',options:['S3 server-side encryption (SSE)','terraform encrypt command','HCL encrypt block','Sensitive variable flag']},
      {label:'Restrict who can read state',correct:'S3 bucket policy + IAM roles',options:['S3 bucket policy + IAM roles','terraform.tfvars permissions','Backend password','State file chmod']},
    ],
    explanation:'S3 with versioning stores state durably. DynamoDB provides locking to prevent two applies running at once. SSE-S3 or SSE-KMS encrypts at rest. IAM and bucket policies restrict who can read/write the state file.'
  },
  {
    title:'CI/CD Pipeline Integration',
    desc:'A team wants Terraform to run automatically in a CI/CD pipeline on every pull request and merge to main.',
    components:[
      {label:'PR validation step',correct:'terraform plan (no apply)',options:['terraform plan (no apply)','terraform apply -auto-approve','terraform validate only','terraform fmt only']},
      {label:'Format check',correct:'terraform fmt -check',options:['terraform fmt -check','terraform lint','terraform style','terraform validate -fmt']},
      {label:'Syntax validation',correct:'terraform validate',options:['terraform validate','terraform check','terraform test','terraform scan']},
      {label:'Apply on merge to main',correct:'terraform apply -auto-approve',options:['terraform apply -auto-approve','terraform apply (manual)','terraform deploy','terraform push']},
      {label:'Store credentials safely',correct:'Environment variables or CI secrets store',options:['Environment variables or CI secrets store','terraform.tfvars committed to repo','Hardcode in provider block','Local ~/.aws/credentials']},
    ],
    explanation:'A good Terraform CI pipeline: `fmt -check` + `validate` + `plan` on PRs (no changes). On merge to main: `apply -auto-approve`. Credentials come from CI secret stores (never committed). Remote state ensures the CI runner shares state with the team.'
  },
  {
    title:'Custom Conditions & Validation (TA-004)',
    desc:'A team wants to validate that an S3 bucket name follows naming rules before creation, and confirm versioning is enabled after creation.',
    components:[
      {label:'Reject invalid variable at plan time',correct:'variable validation block',options:['variable validation block','check block','precondition block','postcondition block']},
      {label:'Validate assumption BEFORE resource creates',correct:'lifecycle precondition',options:['lifecycle precondition','lifecycle postcondition','check block','variable validation']},
      {label:'Validate guarantee AFTER resource creates',correct:'lifecycle postcondition',options:['lifecycle postcondition','lifecycle precondition','check block','output validation']},
      {label:'Ongoing infrastructure assertion (non-blocking)',correct:'check block',options:['check block','lifecycle precondition','lifecycle postcondition','terraform validate']},
    ],
    explanation:'TA-004 introduces four validation layers: variable `validation` rejects bad inputs at plan; `precondition` validates assumptions before resource changes; `postcondition` validates guarantees after; standalone `check` blocks assert infrastructure health at the end of every plan/apply without blocking it.'
  },
  {
    title:'Multi-Region with Provider Aliases',
    desc:'A team needs to deploy an S3 bucket in us-east-1 and a replica bucket in eu-west-1 using the same AWS provider.',
    components:[
      {label:'Primary provider (no alias)',correct:'provider "aws" { region = "us-east-1" }',options:['provider "aws" { region = "us-east-1" }','provider "aws" { alias = "primary"; region = "us-east-1" }','aws_provider { region = "us-east-1" }','resource "provider" "aws" { region = "us-east-1" }']},
      {label:'Secondary provider (aliased)',correct:'provider "aws" { alias = "eu"; region = "eu-west-1" }',options:['provider "aws" { alias = "eu"; region = "eu-west-1" }','provider "aws-eu" { region = "eu-west-1" }','provider "aws" { region = "eu-west-1" }','provider { alias = "eu"; region = "eu-west-1" }']},
      {label:'Reference aliased provider in resource',correct:'provider = aws.eu',options:['provider = aws.eu','provider = "aws.eu"','provider_alias = "eu"','use_provider = aws["eu"]']},
      {label:'Pass aliased provider into a module',correct:'providers = { aws = aws.eu }',options:['providers = { aws = aws.eu }','provider = aws.eu','alias_provider = "eu"','module_provider = aws.eu']},
    ],
    explanation:'Provider aliases allow multiple configurations of the same provider. Declare with `alias` in the provider block, reference with `aws.<alias>` in resources (`provider = aws.eu`), and pass into modules with the `providers` map argument.'
  },
  {
    title:'HCP Terraform VCS-Driven Workflow',
    desc:'A team connects their GitHub repo to HCP Terraform so that every PR triggers a speculative plan and every merge to main triggers an apply.',
    components:[
      {label:'What triggers on a pull request?',correct:'Speculative plan (read-only, not applied)',options:['Speculative plan (read-only, not applied)','Full apply with approval gate','terraform validate only','A destroy plan']},
      {label:'What triggers on merge to main?',correct:'A new run: plan + apply (pending approval or auto-apply)',options:['A new run: plan + apply (pending approval or auto-apply)','Only a plan — apply must be triggered separately via CLI','Nothing — VCS only triggers plans','A speculative plan']},
      {label:'Where are sensitive variables stored?',correct:'HCP Terraform workspace or Variable Set (not in repo)',options:['HCP Terraform workspace or Variable Set (not in repo)','In `.tfvars` committed to the repo','In a `.env` file in the repo root','In GitHub Actions secrets only']},
      {label:'What file must exist in the repo for HCP to know the working directory?',correct:'Configure working directory in workspace settings (no special file required)',options:['Configure working directory in workspace settings (no special file required)','.hcp-terraform.yml','WORKSPACE_DIR file','terraform.remote.hcl']},
    ],
    explanation:'VCS-driven workflow: connect repo → HCP creates a webhook. PRs generate speculative plans visible in the PR. Merges to main trigger real runs. Sensitive variables live in HCP workspaces or Variable Sets — never in the repo. Working directory is set in workspace settings.'
  },
  {
    title:'Sentinel Policy Enforcement',
    desc:'A platform team uses Sentinel to enforce cloud governance. They need different enforcement levels for different rules.',
    components:[
      {label:'Block apply unless an admin explicitly overrides',correct:'Soft Mandatory',options:['Soft Mandatory','Hard Mandatory','Advisory','Check block']},
      {label:'Always block apply — no override possible',correct:'Hard Mandatory',options:['Hard Mandatory','Soft Mandatory','Advisory','Terraform validate']},
      {label:'Warn the team but allow apply to proceed',correct:'Advisory',options:['Advisory','Soft Mandatory','Hard Mandatory','Check block warning']},
      {label:'Which level would you use for a tagging requirement with an escape hatch?',correct:'Soft Mandatory',options:['Soft Mandatory','Hard Mandatory','Advisory','Variable validation']},
    ],
    explanation:'Sentinel has three enforcement levels: Advisory (logs warning, apply proceeds), Soft Mandatory (blocks apply — organization admin can override), Hard Mandatory (always blocks — no override). Use Hard Mandatory for compliance rules with zero tolerance; Soft Mandatory for important rules that occasionally need exceptions.'
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
  {name:'check block',desc:'Standalone assertion that warns (not blocks) when infra state is unexpected'},
  {name:'precondition',desc:'Validates assumptions before a resource is created or updated'},
  {name:'postcondition',desc:'Validates guarantees after a resource is created or updated'},
  {name:'ephemeral value',desc:'Sensitive transient value — not stored in state or shown in plans'},
  {name:'ignore_changes',desc:'Lifecycle setting telling Terraform to skip updates to specific attributes'},
  {name:'-replace flag',desc:'Forces destroy and recreate of a specific resource — replaces terraform taint'},
  {name:'-refresh-only',desc:'Syncs state to match real infra without making resource changes'},
  {name:'HCP Terraform Project',desc:'Organisational layer above workspaces for grouping and access control'},
  {name:'variable validation',desc:'Custom rule that rejects an invalid variable value at plan time'},
  {name:'toset()',desc:'Converts a list to a set — required for using for_each with a list'},
  {name:'lookup()',desc:'Safely retrieves a map value with an optional fallback default'},
  {name:'file()',desc:'Reads a local file at plan time and returns its contents as a string'},
  {name:'dynamic block',desc:'Generates repeated nested blocks programmatically from a collection'},
  {name:'for expression',desc:'Transforms a collection into a new list or map using a loop expression'},
  {name:'replace_triggered_by',desc:'Forces resource replacement when a referenced resource or attribute changes'},
  {name:'provider alias',desc:'Allows multiple configurations of the same provider (e.g., different regions)'},
  {name:'~> constraint',desc:'Pessimistic version constraint — allows patch/minor upgrades within same major'},
  {name:'TF_LOG',desc:'Environment variable that enables Terraform debug logging (DEBUG, TRACE, etc.)'},
  {name:'terraform console',desc:'Interactive REPL for evaluating HCL expressions against current state'},
  {name:'Sentinel Advisory',desc:'HCP Terraform policy level — warns but always allows the apply to proceed'},
  {name:'Sentinel Hard Mandatory',desc:'HCP Terraform policy level — always blocks apply, cannot be overridden'},
  {name:'VCS-driven workflow',desc:'Workspace connected to a Git repo — plans on PRs, applies on merge'},
  {name:'Dynamic Credentials',desc:'OIDC-based short-lived cloud credentials — no static keys stored in HCP Terraform'},
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
// TERRAFORM STUDY GUIDE DATA
// ═══════════════════════════════════════════════════

const TF_CLI_COMMANDS = [
  {cmd:'terraform init',icon:'🚀',desc:'Initialise working directory — downloads providers, sets up backend.',tip:'Run after any change to provider requirements or backend config.'},
  {cmd:'terraform plan',icon:'🔍',desc:'Preview changes. Shows create/modify/destroy diff without touching real infra.',tip:'Always review the plan before applying. Save it with `-out=plan.tfplan`.'},
  {cmd:'terraform apply',icon:'⚡',desc:'Execute the planned changes against real infrastructure.',tip:'Use `-auto-approve` in CI pipelines. Always use a saved plan file for reproducibility.'},
  {cmd:'terraform destroy',icon:'🗑️',desc:'Destroy all resources managed by the current configuration.',tip:'Target specific resources with `-target=resource_type.name`.'},
  {cmd:'terraform fmt',icon:'✨',desc:'Reformat .tf files to canonical HCL style.',tip:'Run `terraform fmt -check` in CI to fail the build if code is not formatted.'},
  {cmd:'terraform validate',icon:'✅',desc:'Check HCL syntax and internal consistency — no API calls required.',tip:'Fast and safe to run locally or in CI before planning.'},
  {cmd:'terraform import',icon:'📥',desc:'Bring an existing real-world resource under Terraform management.',tip:'Write the matching resource block first, then import. Run plan to verify no diff.'},
  {cmd:'terraform state list',icon:'📋',desc:'Show all resources currently tracked in state.',tip:'Use `terraform state show <resource>` for detailed attributes of a single resource.'},
  {cmd:'terraform state mv',icon:'🔀',desc:'Rename or move a resource in state without destroying it.',tip:'Essential when refactoring — e.g., moving a resource into a module.'},
  {cmd:'terraform output',icon:'📤',desc:'Print values of all defined output blocks after apply.',tip:'Use `-json` for machine-readable output in scripts.'},
  {cmd:'terraform workspace',icon:'🗂️',desc:'Manage named state workspaces (new, select, list, delete).',tip:'Reference current workspace in config via `terraform.workspace`.'},
  {cmd:'terraform apply -refresh-only',icon:'🔄',desc:'Sync state to match real-world infra without making changes. Replaces deprecated `terraform refresh`.',tip:'TA-004: `terraform refresh` is deprecated. Always use `apply -refresh-only` to detect and accept drift.'},
  {cmd:'terraform apply -replace=<addr>',icon:'♻️',desc:'Force destroy and recreate a specific resource. Replaces deprecated `terraform taint`.',tip:'TA-004: `terraform taint` is deprecated. Use `-replace` — it plans and applies in one step with full visibility.'},
  {cmd:'terraform test',icon:'🧪',desc:'Run automated tests for Terraform modules using `.tftest.hcl` test files.',tip:'TA-004: Know that `terraform test` validates module behaviour with real or mocked providers.'},
  {cmd:'terraform apply -replace',icon:'⚠️',desc:'DEPRECATED REPLACEMENT: `terraform taint` → use this instead for forced resource replacement.',tip:'If you see `terraform taint` on the exam — wrong answer. TA-004 uses `apply -replace`.'},
];

const TF_CORE_CONCEPTS = [
  {name:'HCL',icon:'📝',desc:'HashiCorp Configuration Language — the declarative syntax Terraform uses. Human-readable alternative to JSON.',detail:'Files use `.tf` extension. JSON (`.tf.json`) is also valid but uncommon.'},
  {name:'State File',icon:'💾',desc:'`terraform.tfstate` — maps your config to real resource IDs and attributes.',detail:'Never commit to Git. Use remote backends for teams. Contains sensitive data — encrypt at rest.'},
  {name:'Provider',icon:'🔌',desc:'A plugin that lets Terraform manage a specific platform (AWS, Azure, GCP, Kubernetes…).',detail:'Declared in `required_providers`. Downloaded by `terraform init`. Locked by `.terraform.lock.hcl`.'},
  {name:'Resource',icon:'🏗️',desc:'The primary building block — declares a piece of infrastructure to create and manage.',detail:'Syntax: `resource "<type>" "<name>" {}`. Referenced as `<type>.<name>.<attribute>`.'},
  {name:'Data Source',icon:'🔎',desc:'Reads existing infrastructure without managing it — like a read-only lookup.',detail:'Syntax: `data "<type>" "<name>" {}`. Referenced as `data.<type>.<name>.<attribute>`.'},
  {name:'Variable',icon:'📥',desc:'Parameterise configs — declared with `variable "name" {}`, referenced as `var.name`.',detail:'Supply values via `-var`, `.tfvars` files, or `TF_VAR_` environment variables.'},
  {name:'Output',icon:'📤',desc:'Export values after apply for display or use by other modules.',detail:'Declared with `output "name" { value = ... }`. Reference child module outputs as `module.<name>.<output>`.'},
  {name:'Module',icon:'📦',desc:'A reusable package of Terraform config. Modules accept inputs (variables) and return outputs.',detail:'Source can be local path, Terraform Registry, Git, or S3. Called with a `module` block.'},
  {name:'Local Value',icon:'🏷️',desc:'A named expression defined in `locals {}`, referenced as `local.name`. Avoids repetition.',detail:'Like a constant or computed helper value within a module.'},
  {name:'Backend',icon:'☁️',desc:'Defines where state is stored and how operations run (local, S3, Terraform Cloud).',detail:'Remote backends enable state locking, team collaboration, and remote execution.'},
  {name:'check block (TA-004)',icon:'🔔',desc:'Standalone assertion that runs at the end of every plan/apply. Warns on failure — does NOT block apply.',detail:'Not attached to a specific resource. Ideal for ongoing infrastructure health checks (e.g., "is this endpoint returning 200?").'},
  {name:'precondition (TA-004)',icon:'✅',desc:'Validates an assumption BEFORE Terraform creates or updates a resource. Blocks apply if false.',detail:'Defined inside `lifecycle {}`. Use `self` to reference the resource being validated.'},
  {name:'postcondition (TA-004)',icon:'✔️',desc:'Validates a guarantee AFTER Terraform creates or updates a resource. Blocks apply if false.',detail:'Confirms the resource was created with the expected properties (e.g., versioning is enabled).'},
  {name:'ephemeral value (TA-004)',icon:'💨',desc:'Transient value that flows through plan/apply but is NEVER written to state or shown in plan output.',detail:'Used for secrets that must not persist. Write-only arguments accept ephemeral inputs without exposing them.'},
  {name:'ignore_changes (TA-004)',icon:'🙈',desc:'Lifecycle setting listing attributes Terraform should not track. Drift in those attributes is ignored.',detail:'Example: `ignore_changes = [desired_count]` for an ECS service managed by auto-scaling.'},
];

const TF_STATE_CONCEPTS = [
  {title:'Why State Matters',icon:'💡',body:'State is Terraform\'s source of truth. It maps your `.tf` resource blocks to real infrastructure IDs (e.g., an `aws_instance` to `i-0abc123`). Without state, Terraform cannot know what already exists.'},
  {title:'Remote Backends',icon:'☁️',body:'Store state in S3, Terraform Cloud, Azure Blob, or GCS instead of locally. Enables team collaboration — everyone reads/writes the same state. Always use remote state in production.'},
  {title:'State Locking',icon:'🔒',body:'Prevents two people running `terraform apply` at the same time, which would corrupt state. S3 backend uses a DynamoDB table for locking. Terraform Cloud has built-in locking.'},
  {title:'Sensitive Data in State',icon:'⚠️',body:'State may contain secrets (DB passwords, API keys). Encrypt your backend at rest (S3 SSE or KMS). Restrict access with IAM policies. Never commit `terraform.tfstate` to Git.'},
  {title:'State Commands',icon:'🛠️',body:'`terraform state list` — see all resources. `terraform state show` — inspect one resource. `terraform state mv` — rename/move without recreating. `terraform state rm` — remove from state (leaves real resource intact).'},
  {title:'Drift Detection (TA-004)',icon:'🔍',body:'Drift = real infra has changed outside Terraform. Run `terraform apply -refresh-only` (replaces deprecated `terraform refresh`) to sync state without applying resource changes. HCP Terraform can auto-detect drift between scheduled runs.'},
  {title:'Deprecated in TA-004',icon:'⚠️',body:'`terraform taint` → use `terraform apply -replace=<address>`. `terraform refresh` → use `terraform apply -refresh-only`. These commands still work in some versions but are removed from TA-004 exam objectives.'},
];

const TF_MODULES_CONCEPTS = [
  {title:'What is a Module?',icon:'📦',body:'Any directory with `.tf` files is a module. The root module is your working directory. Child modules are called with a `module` block, passing variables as arguments.'},
  {title:'Module Sources',icon:'🔗',body:'Local: `source = "./modules/vpc"`. Registry: `source = "hashicorp/consul/aws"`. Git: `source = "git::https://..."`. Always pin a version with `version = "~> 2.0"` for reproducibility.'},
  {title:'Input Variables',icon:'📥',body:'Modules accept inputs via `variable` blocks. The caller passes values in the `module` block. Use `type`, `default`, and `description` for self-documenting, validated APIs.'},
  {title:'Output Values',icon:'📤',body:'Modules expose data back to callers via `output` blocks. Reference them as `module.<name>.<output>`. Plan before you publish — changing outputs is a breaking change.'},
  {title:'Terraform Registry',icon:'🌐',body:'registry.terraform.io hosts thousands of verified public modules (VPC, EKS, RDS…). Filter by provider, browse source, and pin to a version. Avoid forking — prefer upstream where possible.'},
  {title:'HCP Terraform Projects (TA-004)',icon:'🗂️',body:'Projects sit above workspaces in HCP Terraform — they group related workspaces (e.g., by app or team). Access control (teams, permissions) can be set at the project level, cascading to all workspaces within.'},
  {title:'Run Triggers & Variable Sets (TA-004)',icon:'⚡',body:'Run Triggers automate workspace pipelines — a successful apply in workspace A triggers a plan in workspace B. Variable Sets centrally manage variables shared across multiple workspaces, eliminating duplication.'},
];

// ── HCL Fixer Game Data ──
const TF_HCL_BUGS = [
  {
    code:`resource "aws_instance" "web" {\n  ami           = "ami-0abcdef"\n  instance_type = "t3.micro"\n  count         = "2"\n}`,
    bug:'`count` must be a number, not a string',
    opts:['`count = "2"` should be `count = 2` (no quotes)','`ami` value needs double quotes','`instance_type` is not a valid argument','`resource` should be `Resource`'],
    correct:0,
    exp:'Meta-arguments like `count` and `for_each` take expressions, not strings. `count = 2` is correct — quotes make it a string, which Terraform will reject.'
  },
  {
    code:`variable "env" {\n  type    = string\n  default = production\n}`,
    bug:'String default values must be quoted',
    opts:['`default = production` — string values need quotes: `default = "production"`','`type = string` should be `type = "string"`','`variable` block requires a `description`','Variable names cannot contain underscores'],
    correct:0,
    exp:'Bare identifiers like `production` are not valid HCL string values. String literals must be wrapped in double quotes: `default = "production"`.'
  },
  {
    code:`output "instance_ip" {\n  value = aws_instance.web.public_ip\n  sensitive = "true"\n}`,
    bug:'`sensitive` must be a boolean, not a string',
    opts:['`sensitive = "true"` should be `sensitive = true` (no quotes)','`value` should reference `self.public_ip`','Output blocks cannot have `sensitive`','`output` name cannot contain underscores'],
    correct:0,
    exp:'`sensitive` is a boolean attribute. `"true"` is a string — Terraform will error. Use the bare boolean `true` without quotes.'
  },
  {
    code:`terraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = 4.0\n    }\n  }\n}`,
    bug:'Provider version must be a string',
    opts:['`version = 4.0` must be a string: `version = "~> 4.0"`','`source` format is wrong','`required_providers` block must be inside `provider`','`terraform` block cannot contain `required_providers`'],
    correct:0,
    exp:'Version constraints are strings, not numbers. `version = "~> 4.0"` pins to 4.x. A bare `4.0` is not valid HCL here.'
  },
  {
    code:`resource "aws_s3_bucket" "data" {\n  bucket = var.bucket_name\n}\n\nresource "aws_s3_bucket_policy" "policy" {\n  bucket = aws_s3_bucket.data.id\n  policy = data.policy_doc.doc.json\n}`,
    bug:'Data source reference syntax is wrong',
    opts:['`data.policy_doc.doc.json` should be `data.aws_iam_policy_document.doc.json` — missing the resource type','`bucket` should reference `.name` not `.id`','`resource` block needs `depends_on`','`aws_s3_bucket_policy` is not a valid resource type'],
    correct:0,
    exp:'Data source references must be `data.<TYPE>.<NAME>.<ATTRIBUTE>`. `data.policy_doc.doc.json` is missing the type — it should be something like `data.aws_iam_policy_document.doc.json`.'
  },
  {
    code:`resource "aws_vpc" "main" {\n  cidr_block = "10.0.0.0/16"\n}\n\nresource "aws_subnet" "pub" {\n  vpc_id     = main.id\n  cidr_block = "10.0.1.0/24"\n}`,
    bug:'Resource reference is missing the type prefix',
    opts:['`main.id` should be `aws_vpc.main.id` — resource references need `<type>.<name>`','`cidr_block` format is invalid','Subnets cannot be in the same file as the VPC','`vpc_id` should be `vpc` not `vpc_id`'],
    correct:0,
    exp:'Resource references must include the resource type: `aws_vpc.main.id`. Just `main.id` is not valid HCL — Terraform does not know which resource `main` refers to.'
  },
  {
    code:`locals {\n  env  = "prod"\n  name = local.env + "-api"\n}`,
    bug:'String concatenation uses `+` instead of interpolation',
    opts:['Use string interpolation: `"${local.env}-api"` — HCL does not support `+` for strings','`locals` block cannot self-reference','`local.env` reference is invalid inside `locals`','Local names cannot contain underscores'],
    correct:0,
    exp:'HCL does not support `+` for string concatenation. Use template interpolation: `"${local.env}-api"`. The `+` operator works only for numeric addition.'
  },
  {
    code:`resource "aws_instance" "app" {\n  ami           = "ami-0abc"\n  instance_type = "t3.medium"\n\n  tags = [\n    "Name", "app-server"\n  ]\n}`,
    bug:'`tags` expects a map, not a list',
    opts:['`tags` must be a map: `tags = { Name = "app-server" }` — not a list `[]`','Tags require an ARN value','`instance_type` value is invalid','`ami` must start with `ami-0`'],
    correct:0,
    exp:'`tags` is a `map(string)` attribute. Use curly braces with key = value pairs: `tags = { Name = "app-server" }`. Square brackets create a list, which is the wrong type.'
  },
  {
    code:`variable "instance_type" {\n  type    = string\n  default = "t3.micro"\n\n  validation {\n    condition     = contains(["t3.micro","t3.small"], var.instance_type)\n    error_message = "Must be t3.micro or t3.small"\n  }\n}`,
    bug:'This is actually valid TA-004 HCL — no bug',
    opts:['No bug — this is correct TA-004 variable validation syntax','`validation` block must be outside the `variable` block','`error_message` is not a valid attribute','`contains()` is not a valid Terraform function'],
    correct:0,
    exp:'This is valid Terraform 1.x HCL. The `validation` block inside a `variable` block, with a `condition` expression and `error_message`, is the correct TA-004 syntax for custom variable validation.'
  },
  {
    code:`resource "aws_s3_bucket" "logs" {\n  bucket = var.bucket_name\n\n  lifecycle {\n    postcondition {\n      condition     = self.versioning[0].enabled\n      error_message = "Versioning must be enabled"\n    }\n  }\n}`,
    bug:'`postcondition` must use the resource\'s exported attribute correctly',
    opts:['`self.versioning[0].enabled` is the wrong attribute path — use `self.versioning_enabled` or check the provider docs for the correct attribute','`postcondition` is not valid inside `lifecycle`','`error_message` must end with a period','`lifecycle` cannot be used with S3 buckets'],
    correct:0,
    exp:'`postcondition` IS valid inside `lifecycle` (TA-004), and `self` refers to the resource. The bug is the attribute path — real S3 bucket versioning is a separate resource (`aws_s3_bucket_versioning`). The `self.versioning` path depends on your provider version — always check the provider docs.'
  },
  {
    code:`check "bucket_accessible" {\n  assert {\n    condition     = aws_s3_bucket.data.bucket_domain_name != ""\n    error_message = "Bucket domain name must not be empty"\n  }\n}`,
    bug:'This is valid TA-004 `check` block syntax',
    opts:['No bug — this is correct TA-004 check block syntax','`check` blocks must be inside a resource block','`assert` is not a valid nested block in `check`','`check` blocks require a `data` source reference'],
    correct:0,
    exp:'This is valid TA-004 syntax. A standalone `check` block with a nested `assert` block runs at the end of plan/apply, reports a warning (not an error) if the condition fails, and is NOT attached to any specific resource lifecycle.'
  },
  {
    code:`locals {\n  env_buckets = { for env in var.environments : env => "\${env}-data-bucket" }\n}`,
    bug:'String interpolation inside a `for` expression uses wrong syntax',
    opts:['The value expression should use `"${env}-data-bucket"` but in HCL `for` this needs to be outside quotes: `"${env}-data-bucket"` is actually valid','No bug — this is correct `for` expression syntax for a map','`for` expressions cannot be used inside `locals`','The colon `:` should be `=>`'],
    correct:1,
    exp:'This is actually valid HCL. A `for` expression that produces a map uses `{ for key in collection : key => value }`. The colon separates the key expression; `=>` separates key from value. String interpolation works normally inside the value expression.'
  },
  {
    code:`resource "aws_security_group" "web" {\n  name = "web-sg"\n\n  dynamic "ingress" {\n    for_each = var.ports\n    content {\n      from_port   = ingress.port\n      to_port     = ingress.port\n      protocol    = "tcp"\n      cidr_blocks = ["0.0.0.0/0"]\n    }\n  }\n}`,
    bug:'Inside a `dynamic` block, the iterator reference uses the wrong name',
    opts:['Inside `dynamic "ingress"`, use `ingress.value.port` (or `ingress.value` for the whole object) — not `ingress.port`','`dynamic` blocks cannot be used with security groups','`for_each` inside a `dynamic` block must be a map, not a list','`content` block should be named `body`'],
    correct:0,
    exp:'Inside a `dynamic` block named `"ingress"`, the iterator is accessed via `ingress.value` (for the whole item) or `ingress.value.<attr>` if the collection is a list of objects. If `var.ports` is a list of numbers, use `ingress.value` directly (not `ingress.port`).'
  },
  {
    code:`resource "aws_instance" "web" {\n  ami           = var.ami_id\n  instance_type = var.instance_type\n\n  lifecycle {\n    replace_triggered_by = [aws_security_group.web]\n    prevent_destroy      = true\n  }\n}`,
    bug:'`replace_triggered_by` and `prevent_destroy` conflict in this configuration',
    opts:['`replace_triggered_by` forces replacement, but `prevent_destroy = true` blocks destruction — this will always error when the security group changes','`replace_triggered_by` is not a valid lifecycle argument','`prevent_destroy` must be set to `false` when using `replace_triggered_by`','No bug — these two arguments coexist fine'],
    correct:0,
    exp:'`replace_triggered_by` tells Terraform to replace (destroy + recreate) this resource when the referenced resource changes. `prevent_destroy = true` blocks any destruction. Together they create a contradiction: Terraform will error trying to replace an instance it cannot destroy.'
  },
  {
    code:`provider "aws" {\n  region = "us-east-1"\n}\n\nprovider "aws" {\n  alias  = "west"\n  region = "us-west-2"\n}\n\nresource "aws_s3_bucket" "west_bucket" {\n  bucket   = "my-west-bucket"\n  provider = "aws.west"\n}`,
    bug:'The `provider` argument value uses incorrect syntax',
    opts:['`provider = "aws.west"` should be `provider = aws.west` (no quotes — it\'s a reference, not a string)','Provider aliases are not allowed for S3 resources','The second `provider "aws"` block needs a different block label','`alias` must match the provider name exactly'],
    correct:0,
    exp:'The `provider` meta-argument in a resource block takes a provider reference (`aws.west`), NOT a string (`"aws.west"`). Quoting it makes it a string literal, which Terraform cannot resolve as a provider configuration reference.'
  },
];

// ── Variables & Outputs Quiz Data ──
const TF_VARS_QS = [
  {q:'What is the correct way to declare a variable with a type constraint?',opts:['`variable "size" { type = number }`','`var size : number`','`variable size = number`','`input "size" { type = number }`'],correct:0,exp:'Variable blocks use `type = <type>` to constrain the value. Valid types include `string`, `number`, `bool`, `list(...)`, `map(...)`, `object(...)`.'},
  {q:'Which file does Terraform automatically load for variable values?',opts:['`terraform.tfvars`','`variables.tf`','`defaults.tf`','`env.tf`'],correct:0,exp:'`terraform.tfvars` (and `*.auto.tfvars`) are automatically loaded. Any other `.tfvars` file must be passed with `-var-file`.'},
  {q:'How do you pass a variable from the environment without a `.tfvars` file?',opts:['Set `TF_VAR_<name>` environment variable','Set `TERRAFORM_<name>` environment variable','Use `-env name=value` flag','Variables cannot come from the environment'],correct:0,exp:'Terraform reads `TF_VAR_<name>` from the shell environment. For example, `export TF_VAR_region=us-east-1` sets `var.region`.'},
  {q:'What does `sensitive = true` in a variable block do?',opts:['Redacts the value from plan/apply output and logs','Encrypts it in the state file','Prevents the value being used in resource blocks','Makes the variable required'],correct:0,exp:'`sensitive = true` prevents the value appearing in CLI output. The value is still stored in plain text in state — use a proper secret store for true security.'},
  {q:'Which variable type would you use for a list of allowed strings?',opts:['`type = list(string)`','`type = string[]`','`type = array(string)`','`type = set`'],correct:0,exp:'HCL uses `list(string)` for ordered lists of strings. `set(string)` is similar but unordered with no duplicates. `string[]` is not valid HCL.'},
  {q:'What does the `validation` block inside a variable do?',opts:['Enforces a custom rule on the variable value at plan time','Validates syntax of the .tf file','Checks the value against a remote API','Prevents the variable from being overridden'],correct:0,exp:'`validation` blocks run conditions at plan time, rejecting invalid input before any real infrastructure is touched. Use `condition` and `error_message`.'},
  {q:'How do you reference an output from a child module called "vpc"?',opts:['`module.vpc.vpc_id`','`output.vpc.vpc_id`','`vpc.outputs.vpc_id`','`modules["vpc"].vpc_id`'],correct:0,exp:'Child module outputs are referenced as `module.<MODULE_NAME>.<OUTPUT_NAME>`. The module must declare an `output` block exposing that value.'},
  {q:'What happens if a required variable has no default and is not provided?',opts:['Terraform prompts interactively (or errors in non-interactive mode)','Terraform uses an empty string','The plan is skipped','A warning is shown and a null value is used'],correct:0,exp:'Terraform will prompt for the value interactively in a terminal. In CI/CD with no TTY, it errors. Always provide values via `-var`, `.tfvars`, or `TF_VAR_`.'},
  {q:'Which output attribute prevents the value appearing in `terraform output` plain text?',opts:['`sensitive = true`','`secret = true`','`hidden = true`','`redact = true`'],correct:0,exp:'`sensitive = true` on an output block suppresses the value in `terraform output`. Use `terraform output -json` to see sensitive values in a script context.'},
  {q:'What is the correct way to use `for_each` with a set of strings?',opts:['`for_each = toset(["a","b","c"])`','`for_each = ["a","b","c"]`','`for_each = count(3)`','`for_each = var.list`'],correct:0,exp:'`for_each` requires a map or set, not a list. Use `toset()` to convert a list to a set. Then reference the current key via `each.key`.'},
  {q:'What TA-004 block validates that a variable value meets a custom rule before plan proceeds?',opts:['A `validation` block inside the `variable` block','A `check` block at the root level','A `precondition` block inside `lifecycle`','A `constraint` block in the provider'],correct:0,exp:'`validation` blocks inside `variable {}` run at plan time and reject the value with your `error_message` if the `condition` is false — before Terraform contacts any provider.'},
  {q:'In TA-004, what happens when a `check` block assertion fails?',opts:['Terraform issues a warning but does NOT fail the apply','Terraform errors and stops the apply','The resource is tainted for replacement','The state file is rolled back'],correct:0,exp:'`check` block failures produce warnings, not errors — apply succeeds but you are notified. This makes them ideal for ongoing infrastructure health assertions that should not block deployments.'},
  {q:'What is an ephemeral value\'s key characteristic in TA-004?',opts:['It is never written to the state file or shown in plan output','It expires after a configurable TTL','It is only valid during `terraform plan`','It is stored encrypted in state'],correct:0,exp:'Ephemeral values are transient — they flow through plan/apply but are never persisted in state. This makes them safe for highly sensitive secrets like database passwords or API tokens.'},
  {q:'Which HCL expression transforms a list into a map keyed by a field?',opts:['`{ for item in var.list : item.id => item }`','`map(var.list, "id")`','`tomap(var.list)`','`lookup(var.list, "id")`'],correct:0,exp:'A `for` expression with the map form `{ for <var> in <collection> : <key_expr> => <value_expr> }` transforms a list into a map. This is the idiomatic way to rekey a list of objects by an attribute.'},
  {q:'What does a ternary expression look like in HCL?',opts:['`condition ? true_val : false_val`','`if condition then true_val else false_val`','`condition ?? true_val : false_val`','`(condition) -> true_val | false_val`'],correct:0,exp:'HCL ternary uses the same syntax as C/JS: `condition ? value_if_true : value_if_false`. Example: `var.env == "prod" ? "t3.large" : "t3.micro"`.'},
  {q:'How does `lookup(map, key, default)` behave when the key is missing?',opts:['Returns the default value','Throws an error','Returns null','Returns an empty string'],correct:0,exp:'`lookup(map, key, default)` safely reads a map key and returns the default if the key does not exist. Without the default argument, a missing key causes an error — so always provide a default when the key may be absent.'},
  {q:'What does `try(expr1, expr2)` do in HCL?',opts:['Evaluates expr1; if it errors, returns expr2 instead','Tries expr1 and expr2 in parallel, returning whichever succeeds first','Is a loop construct that retries on failure','Checks if expr1 is truthy; if not, uses expr2'],correct:0,exp:'`try()` evaluates the first expression and, if it produces an error, returns the next expression instead. Useful for safely accessing attributes that may not exist (e.g., `try(resource.attr, "default")`).'},
  {q:'Which `for` expression filter syntax keeps only items matching a condition?',opts:['`[for item in var.list : item if item.enabled]`','`[for item in var.list where item.enabled]`','`filter(var.list, item => item.enabled)`','`[for item in var.list : item when item.enabled]`'],correct:0,exp:'The `if` clause at the end of a `for` expression filters items: `[for item in list : item if condition]`. Only items where the condition is true are included in the result.'},
];

// ── State Detective Game Data ──
const TF_STATE_DETECTIVE = [
  {
    scenario:'A developer runs `terraform apply` and gets: "Error acquiring the state lock. Error: ConditionalCheckFailedException".',
    question:'What is most likely wrong?',
    opts:['The DynamoDB lock table exists but another apply is running (or a previous apply crashed holding the lock)','The S3 bucket for state does not exist','The AWS credentials are invalid','The `terraform init` was not run'],
    correct:0,
    exp:'DynamoDB state locking throws `ConditionalCheckFailedException` when the lock is already held. Either another apply is running, or a previous apply crashed leaving a stale lock. Use `terraform force-unlock <LOCK_ID>` after confirming no apply is running.'
  },
  {
    scenario:'After renaming a resource block from `aws_instance.old` to `aws_instance.new`, `terraform plan` shows a destroy + create instead of no changes.',
    question:'What should you do to avoid destroying the instance?',
    opts:['Run `terraform state mv aws_instance.old aws_instance.new` before applying','Add `lifecycle { create_before_destroy = true }`','Run `terraform import` on the new name','Add `depends_on` between the old and new blocks'],
    correct:0,
    exp:'Terraform tracks resources by their address in state. Renaming the block looks like delete + create. `terraform state mv` updates the state key without touching real infrastructure, so the next plan shows no changes.'
  },
  {
    scenario:'A team member manually deleted an EC2 instance in the AWS console. Now `terraform plan` shows no changes.',
    question:'Why does plan show no changes, and how do you fix it?',
    opts:['State is stale — the deleted resource still exists in state. Run `terraform apply -refresh-only` to accept the drift, or `terraform plan` which auto-refreshes','The instance was imported automatically','`terraform plan` only reads .tf files, not real infra','Terraform deleted the state entry when the instance was removed'],
    correct:0,
    exp:'Terraform\'s state file still thinks the instance exists. `terraform plan` auto-refreshes state (v0.15+) and should show the resource needs to be created. To only sync state without applying, use `terraform apply -refresh-only` (replaces the deprecated `terraform refresh`).'
  },
  {
    scenario:'You split a monolithic `main.tf` into modules. Now plan wants to destroy and recreate every resource that moved into a module.',
    question:'How do you prevent the destroy/recreate?',
    opts:['Use `terraform state mv` to move each resource address to its new module path before applying','Add `prevent_destroy = true` to every resource','Run `terraform import` for each resource','Add `depends_on` between root and module'],
    correct:0,
    exp:'Moving resources into a module changes their state address (e.g., `aws_instance.web` → `module.app.aws_instance.web`). `terraform state mv` updates the address in state without recreating anything.'
  },
  {
    scenario:'`terraform apply` succeeds but a new team member gets "No such file or directory: terraform.tfstate" when they clone the repo.',
    question:'What architectural mistake was made?',
    opts:['State is stored locally and not committed. The team should use a remote backend (S3, Terraform Cloud) so state is shared','The team member forgot to run `terraform init`','The `.tfstate` file should be in `.gitignore`','`terraform plan` needs to be run before cloning'],
    correct:0,
    exp:'Local state only exists on the machine where `apply` ran. Teams must use a remote backend (S3+DynamoDB, Terraform Cloud) so everyone shares the same state. Local state in Git is a bad practice — it risks conflicts and leaks secrets.'
  },
  {
    scenario:'(TA-004) A `check` block is failing after every `terraform apply` with a warning, but no one can find the bug. A junior engineer suggests adding `-auto-approve` to skip it.',
    question:'What should the team actually do?',
    opts:['Investigate why the assertion condition is false — the check is detecting real infrastructure drift that needs fixing','Add `-auto-approve` to bypass check block warnings','Remove the `check` block — it is optional','Set `sensitive = true` on the check to suppress warnings'],
    correct:0,
    exp:'`check` blocks warn, not block. But warnings indicate real problems — the infrastructure assertion is failing because something is genuinely wrong. `-auto-approve` does not bypass check blocks, and suppressing them defeats their purpose. Fix the root cause.'
  },
  {
    scenario:'(TA-004) A `precondition` in a resource lifecycle block is failing with: "Error: Resource precondition failed." No resource was created.',
    question:'What does this tell you and what should you do?',
    opts:['The `condition` expression evaluated to false — fix the input data or assumption before apply will succeed','The resource already exists — run `terraform import`','The provider version is incompatible — upgrade it','Run `terraform apply -refresh-only` to reset the precondition'],
    correct:0,
    exp:'`precondition` blocks prevent resource creation when an assumption is violated. Terraform stops before touching real infrastructure. Fix the upstream data or variable value that caused the condition to be false, then re-run plan and apply.'
  },
  {
    scenario:'You run `terraform destroy` and it errors: "Resource aws_s3_bucket.data cannot be destroyed: bucket is not empty."',
    question:'What is the correct way to handle this?',
    opts:['Add `force_destroy = true` to the bucket resource, then apply, then destroy','Run `terraform state rm` first, then destroy','Set `prevent_destroy = false` in the lifecycle block','Add `depends_on = []` to remove dependencies'],
    correct:0,
    exp:'S3 buckets with objects cannot be destroyed by Terraform unless `force_destroy = true` is set on the resource. Adding this setting, applying it, then running `terraform destroy` will empty and delete the bucket.'
  },
  {
    scenario:'After running `terraform import aws_instance.web i-0abc123`, the subsequent `terraform plan` shows many differences.',
    question:'What does this mean and what should you do?',
    opts:['The resource block in your .tf file does not match the real resource\'s configuration. Update the .tf file to match reality until plan shows no changes','Re-run `terraform import` with `-force` flag','Run `terraform apply` — the differences will self-correct','Delete the state entry and re-import'],
    correct:0,
    exp:'`terraform import` only adds the resource to state — it does NOT write the .tf config. You must manually write the resource block to match the real resource. Keep adjusting until `plan` shows no diff.'
  },
  {
    scenario:'`terraform plan` fails with: "Error: configuring Terraform AWS Provider: no valid credential sources found." The IAM role ARN is correct in the provider block.',
    question:'What is the most likely cause?',
    opts:['The execution environment has no AWS credentials — the provider needs access to credentials via environment variables, shared credentials file, or an instance/role profile','The `region` argument is missing from the provider block','The AWS provider version is incompatible with Terraform version','The provider block needs an explicit `access_key` and `secret_key`'],
    correct:0,
    exp:'Terraform\'s AWS provider follows the standard AWS credential chain: environment variables (`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`), shared credentials file (`~/.aws/credentials`), or an IAM instance/role profile. A missing region or wrong ARN are secondary concerns — no credential source found means the chain is empty.'
  },
  {
    scenario:'`terraform plan` fails with: "Error: Cycle: aws_security_group.web, aws_instance.web"',
    question:'What does this error mean and how do you fix it?',
    opts:['Two resources reference each other creating a circular dependency. Break the cycle by removing one reference, or use `depends_on` carefully to establish a one-way dependency','Run `terraform init -upgrade` to update providers','The security group and instance must be in separate modules','Add `lifecycle { create_before_destroy = true }` to both resources'],
    correct:0,
    exp:'A cycle error means two (or more) resources each depend on the other, making it impossible to determine creation order. Fix: identify which reference is unnecessary and remove it. Often one resource can reference the other\'s ID without needing a reverse reference.'
  },
  {
    scenario:'A run is failing but the error message is too vague. You need detailed debug output to understand exactly what API calls Terraform is making.',
    question:'What is the correct way to enable maximum Terraform debug logging?',
    opts:['Set `TF_LOG=TRACE` and optionally `TF_LOG_PATH=/tmp/tf.log` before running the command','Pass `--debug` flag to terraform plan','Add `debug = true` to the provider block','Run `terraform diagnose` for detailed output'],
    correct:0,
    exp:'`TF_LOG=TRACE` is the most verbose level — it shows every API request and response. `TF_LOG_PATH` writes the output to a file instead of stderr (helpful for long runs). Levels in increasing verbosity: ERROR, WARN, INFO, DEBUG, TRACE.'
  },
  {
    scenario:'A team uses HCP Terraform VCS-driven workflow. A developer pushed code directly to main without opening a PR. The workspace did not trigger a run.',
    question:'Why did the run not trigger and how should they proceed?',
    opts:['HCP Terraform VCS integration watches for pushes to the configured branch — a direct push to main SHOULD trigger a run. Check the workspace VCS settings and webhook configuration. Trigger manually if needed','HCP Terraform only triggers on PR events, never on direct pushes','Direct pushes are blocked by HCP Terraform','The developer must run `terraform apply` locally — VCS workflows never auto-apply'],
    correct:0,
    exp:'VCS-driven workspaces DO trigger on pushes to the configured branch (e.g., main). If it did not trigger: check that the webhook is registered in the VCS provider (GitHub/GitLab), the workspace VCS settings point to the right branch, and the push included changes in the monitored working directory. You can also trigger a run manually from the HCP Terraform UI.'
  },
];

// ── Terraform Speed Round (reuses TF_CONCEPTS + TF_VARS_QS pool) ──
let tfSpeedState = { deck:[], idx:0, score:0, lives:3, timer:null, secs:0, answered:false };

function startTfSpeed(){
  const pool=[...TF_CONCEPTS,...TF_VARS_QS].sort(()=>Math.random()-.5);
  tfSpeedState.deck=pool;
  tfSpeedState.idx=0;tfSpeedState.score=0;tfSpeedState.lives=3;tfSpeedState.answered=false;
  renderTfSpeedQ();
}
function renderTfSpeedQ(){
  const g=tfSpeedState;
  if(g.lives<=0||g.idx>=g.deck.length){renderTfSpeedEnd();return;}
  clearInterval(g.timer);g.secs=8;g.answered=false;
  const q=g.deck[g.idx];
  const opts=[...q.opts.map((text,orig)=>({text,orig}))].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(o=>o.orig===q.correct);
  g._sOpts=opts;g._sCorrect=correct;
  const lives='❤️'.repeat(g.lives)+'🖤'.repeat(3-g.lives);
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="clearInterval(tfSpeedState.timer);renderTerraformMenu()">← Menu</button>
      <div style="display:flex;gap:6px;align-items:center">
        <span style="font-size:13px">${lives}</span>
        <span class="game-score-pill" style="background:var(--terraform-dim);color:var(--terraform);font-family:'IBM Plex Mono',monospace" id="tf-speed-timer">8s</span>
      </div>
    </div>
    <div style="background:var(--surface2);border-radius:8px;height:5px;margin-bottom:12px;overflow:hidden"><div id="tf-speed-bar" style="height:100%;background:var(--terraform);width:100%;transition:width 1s linear"></div></div>
    <div class="game-card" style="margin-bottom:10px">
      <div style="font-size:13px;font-weight:600;color:var(--terraform);margin-bottom:6px;font-family:'IBM Plex Mono',monospace">Q${g.idx+1} · ${g.score} correct</div>
      <div style="font-size:15px;font-weight:500;line-height:1.5">${q.q}</div>
    </div>
    <div id="tf-speed-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}" style="font-size:12px">${o.text}</button>`).join('')}</div>`;
  document.getElementById('tf-speed-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]');if(!btn)return;
    chooseTfSpeed(parseInt(btn.dataset.idx));
  });
  g.timer=setInterval(()=>{
    g.secs--;
    const timerEl=document.getElementById('tf-speed-timer');
    const barEl=document.getElementById('tf-speed-bar');
    if(timerEl)timerEl.textContent=g.secs+'s';
    if(barEl)barEl.style.width=(g.secs/8*100)+'%';
    if(g.secs<=0){clearInterval(g.timer);if(!g.answered)timeoutTfSpeed();}
  },1000);
}
function chooseTfSpeed(chosen){
  const g=tfSpeedState;if(g.answered)return;g.answered=true;
  clearInterval(g.timer);
  const correct=g._sCorrect,right=chosen===correct;
  if(right)g.score++;else g.lives--;
  document.querySelectorAll('#tf-speed-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen&&!right)b.classList.add('g-wrong');});
  setTimeout(()=>{g.idx++;renderTfSpeedQ();},right?700:1200);
}
function timeoutTfSpeed(){
  const g=tfSpeedState;if(g.answered)return;g.answered=true;
  g.lives--;
  document.querySelectorAll('#tf-speed-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===g._sCorrect)b.classList.add('g-correct');});
  setTimeout(()=>{g.idx++;renderTfSpeedQ();},1000);
}
function renderTfSpeedEnd(){
  clearInterval(tfSpeedState.timer);
  const g=tfSpeedState;
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:40px;margin-bottom:8px">${g.score>=20?'🏆':g.score>=10?'⭐':'💪'}</div>
    <div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--terraform)">${g.score}</div>
    <div style="font-size:14px;color:var(--text2);margin-top:4px">questions answered correctly</div>
    <div style="margin-top:8px"><span class="badge b-neutral">${g.lives<=0?'Out of lives':'Deck complete'}</span></div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-terraform" onclick="startTfSpeed()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showTerraformHCPReference()">Study HCP</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
}

// ── HCL Fixer Game ──
let tfHclState={deck:[],idx:0,score:0,answered:false};
function startTfHclFixer(){
  tfHclState.deck=[...TF_HCL_BUGS].sort(()=>Math.random()-.5);
  tfHclState.idx=0;tfHclState.score=0;tfHclState.answered=false;
  renderTfHclQ();
}
function renderTfHclQ(){
  const g=tfHclState;if(g.idx>=g.deck.length){renderTfHclEnd();return;}
  const bug=g.deck[g.idx];
  const opts=[...bug.opts.map((text,orig)=>({text,orig}))].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(o=>o.orig===bug.correct);
  g._hOpts=opts;g._hCorrect=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderTerraformMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge" style="background:var(--terraform-dim);color:var(--terraform)">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} correct</span></div>
    </div>
    <div class="card" style="padding:10px;margin-bottom:10px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:6px">🐛 Find the bug</div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--text2);line-height:1.9;white-space:pre;overflow-x:auto;background:var(--surface2);padding:10px;border-radius:6px;border-left:3px solid var(--terraform)">${bug.code}</div>
    </div>
    <div style="font-size:14px;font-weight:500;margin-bottom:8px;color:var(--text)">What is the bug in this HCL?</div>
    <div id="tf-hcl-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}" style="font-size:12px;font-family:'IBM Plex Mono',monospace">${o.text}</button>`).join('')}</div>
    <div id="tf-hcl-exp"></div>`;
  document.getElementById('tf-hcl-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]');if(!btn)return;
    chooseTfHcl(parseInt(btn.dataset.idx));
  });
}
function chooseTfHcl(chosen){
  const g=tfHclState;if(g.answered)return;g.answered=true;
  const correct=g._hCorrect,right=chosen===correct;
  const chosenText=g._hOpts[chosen]?.text||'';
  const correctText=g._hOpts[correct]?.text||'';
  recordGameAnswer('TF HCL Fixer',g.deck[g.idx].bug,chosenText,correctText,right);
  if(right)g.score++;
  document.querySelectorAll('#tf-hcl-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('tf-hcl-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${g.deck[g.idx].exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderTfHclQ();},right?1400:2200);
}
function renderTfHclEnd(){
  const g=tfHclState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--terraform)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} bugs found</div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-terraform" onclick="startTfHclFixer()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showTerraformConceptsReference()">Study Concepts</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
}

// ── Variables & Outputs Quiz ──
let tfVarsState={deck:[],idx:0,score:0,answered:false};
function startTfVarsQuiz(){
  tfVarsState.deck=[...TF_VARS_QS].sort(()=>Math.random()-.5);
  tfVarsState.idx=0;tfVarsState.score=0;tfVarsState.answered=false;
  renderTfVarsQ();
}
function renderTfVarsQ(){
  const g=tfVarsState;if(g.idx>=g.deck.length){renderTfVarsEnd();return;}
  const q=g.deck[g.idx];
  const opts=[...q.opts.map((text,orig)=>({text,orig}))].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(o=>o.orig===q.correct);
  g._vOpts=opts;g._vCorrect=correct;
  const icon=TF_CONCEPT_ICONS[g.idx%TF_CONCEPT_ICONS.length];
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderTerraformMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge" style="background:var(--terraform-dim);color:var(--terraform)">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} correct</span></div>
    </div>
    <div class="game-card" style="margin-bottom:10px">
      <div style="font-size:24px;margin-bottom:8px">${icon}</div>
      <div style="font-size:11px;font-weight:600;color:var(--terraform);margin-bottom:6px;font-family:'IBM Plex Mono',monospace">Variables & Outputs</div>
      <div style="font-size:15px;font-weight:500;line-height:1.5">${q.q}</div>
    </div>
    <div id="tf-vars-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}" style="font-family:'IBM Plex Mono',monospace;font-size:12px">${o.text}</button>`).join('')}</div>
    <div id="tf-vars-exp"></div>`;
  document.getElementById('tf-vars-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]');if(!btn)return;
    chooseTfVars(parseInt(btn.dataset.idx));
  });
}
function chooseTfVars(chosen){
  const g=tfVarsState;if(g.answered)return;g.answered=true;
  const correct=g._vCorrect,right=chosen===correct;
  const chosenText=g._vOpts[chosen]?.text||'';
  const correctText=g._vOpts[correct]?.text||'';
  recordGameAnswer('TF Vars & Outputs',g.deck[g.idx].q,chosenText,correctText,right);
  if(right)g.score++;
  document.querySelectorAll('#tf-vars-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('tf-vars-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${g.deck[g.idx].exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderTfVarsQ();},right?1400:2200);
}
function renderTfVarsEnd(){
  const g=tfVarsState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--terraform)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-terraform" onclick="startTfVarsQuiz()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showTerraformVarsReference()">Study Vars</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
}

// ── State Detective Game ──
let tfDetectiveState={deck:[],idx:0,score:0,answered:false};
function startTfStateDetective(){
  tfDetectiveState.deck=[...TF_STATE_DETECTIVE].sort(()=>Math.random()-.5);
  tfDetectiveState.idx=0;tfDetectiveState.score=0;tfDetectiveState.answered=false;
  renderTfDetectiveQ();
}
function renderTfDetectiveQ(){
  const g=tfDetectiveState;if(g.idx>=g.deck.length){renderTfDetectiveEnd();return;}
  const q=g.deck[g.idx];
  const opts=[...q.opts.map((text,orig)=>({text,orig}))].sort(()=>Math.random()-.5);
  const correct=opts.findIndex(o=>o.orig===q.correct);
  g._dOpts=opts;g._dCorrect=correct;
  document.getElementById('game-area').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderTerraformMenu()">← Menu</button>
      <div style="display:flex;gap:5px"><span class="badge" style="background:var(--terraform-dim);color:var(--terraform)">${g.idx+1}/${g.deck.length}</span><span class="badge b-pass">${g.score} correct</span></div>
    </div>
    <div class="card" style="padding:12px;margin-bottom:10px;border-color:var(--terraform)">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--terraform);margin-bottom:6px">🔎 Incident Report</div>
      <div style="font-size:13px;color:var(--text);line-height:1.6">${q.scenario}</div>
    </div>
    <div class="game-card" style="margin-bottom:10px;padding:12px 14px">
      <div style="font-size:14px;font-weight:600;line-height:1.5">${q.question}</div>
    </div>
    <div id="tf-det-opts">${opts.map((o,i)=>`<button class="game-opt" data-idx="${i}" style="font-size:12px;text-align:left">${o.text}</button>`).join('')}</div>
    <div id="tf-det-exp"></div>`;
  document.getElementById('tf-det-opts').addEventListener('click',function(e){
    const btn=e.target.closest('[data-idx]');if(!btn)return;
    chooseTfDetective(parseInt(btn.dataset.idx));
  });
}
function chooseTfDetective(chosen){
  const g=tfDetectiveState;if(g.answered)return;g.answered=true;
  const correct=g._dCorrect,right=chosen===correct;
  const chosenText=g._dOpts[chosen]?.text||'';
  const correctText=g._dOpts[correct]?.text||'';
  recordGameAnswer('TF State Detective',g.deck[g.idx].scenario,chosenText,correctText,right);
  if(right)g.score++;
  document.querySelectorAll('#tf-det-opts .game-opt').forEach((b,i)=>{b.classList.add('gd');if(i===correct)b.classList.add('g-correct');else if(i===chosen)b.classList.add('g-wrong');});
  document.getElementById('tf-det-exp').innerHTML=`<div class="explanation" style="margin-top:8px">${g.deck[g.idx].exp}</div>`;
  setTimeout(()=>{g.idx++;g.answered=false;renderTfDetectiveQ();},right?1600:2600);
}
function renderTfDetectiveEnd(){
  const g=tfDetectiveState,pct=Math.round(g.score/g.deck.length*100);
  document.getElementById('game-area').innerHTML=`
    <div class="game-card"><div style="font-size:36px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--terraform)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} cases solved</div></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-terraform" onclick="startTfStateDetective()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showTerraformConditionsReference()">Study Conditions</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
}

// ── Custom Conditions Study Data (TA-004) ──
const TF_CONDITIONS_CONCEPTS = [
  {
    name:'Variable Validation',icon:'📥',
    when:'You want to reject bad variable values before Terraform contacts any provider.',
    syntax:`variable "env" {\n  type    = string\n  default = "prod"\n\n  validation {\n    condition     = contains(["dev","staging","prod"], var.env)\n    error_message = "env must be dev, staging, or prod."\n  }\n}`,
    notes:'Runs at plan time. Use `var.<name>` in the condition expression. The `error_message` must end with punctuation.',
    scope:'Inside a `variable` block'
  },
  {
    name:'Precondition',icon:'✅',
    when:'You want to validate an assumption BEFORE Terraform creates or updates a resource. Blocks apply if false.',
    syntax:`resource "aws_instance" "web" {\n  ami           = data.aws_ami.ubuntu.id\n  instance_type = var.instance_type\n\n  lifecycle {\n    precondition {\n      condition     = data.aws_ami.ubuntu.architecture == "x86_64"\n      error_message = "AMI must be x86_64."\n    }\n  }\n}`,
    notes:'Use `self` to reference the resource\'s own planned values. Runs before the resource create/update API call.',
    scope:'Inside `lifecycle {}` on a resource or data source'
  },
  {
    name:'Postcondition',icon:'✔️',
    when:'You want to validate a guarantee AFTER Terraform creates or updates a resource. Blocks apply if false.',
    syntax:`resource "aws_s3_bucket" "logs" {\n  bucket = var.bucket_name\n\n  lifecycle {\n    postcondition {\n      condition     = self.bucket_domain_name != ""\n      error_message = "Bucket domain name must not be empty."\n    }\n  }\n}`,
    notes:'Use `self` to reference the resource\'s actual post-creation attributes. Catches misconfigurations immediately after resource creation.',
    scope:'Inside `lifecycle {}` on a resource or data source'
  },
  {
    name:'Check Block',icon:'🔔',
    when:'You want ongoing infrastructure health assertions that WARN but never block apply.',
    syntax:`check "bucket_accessible" {\n  data "http" "probe" {\n    url = "https://\${aws_s3_bucket.site.bucket_domain_name}"\n  }\n\n  assert {\n    condition     = data.http.probe.status_code == 200\n    error_message = "Bucket website endpoint must return 200."\n  }\n}`,
    notes:'NOT tied to any resource\'s lifecycle. Can include a scoped `data` block. Reports a WARNING — apply still succeeds.',
    scope:'Standalone root-level block'
  },
];

const TF_CONDITIONS_COMPARISON = [
  {col:'Where',validation:'Inside `variable` block',precondition:'Inside `lifecycle {}` on resource/data',postcondition:'Inside `lifecycle {}` on resource/data',check:'Standalone root block'},
  {col:'When it runs',validation:'Plan time — before provider calls',precondition:'Before resource create/update',postcondition:'After resource create/update',check:'End of every plan and apply'},
  {col:'Blocks apply?',validation:'Yes — hard error',precondition:'Yes — hard error',postcondition:'Yes — hard error',check:'No — issues a warning only'},
  {col:'Reference target',validation:'`var.<name>`',precondition:'`self` (planned values)',postcondition:'`self` (actual values)',check:'Any data source or resource'},
  {col:'Best for',validation:'Invalid inputs (wrong type, bad string)',precondition:'Upstream assumptions (AMI arch, IAM role)',postcondition:'Post-creation guarantees (encryption, tags)',check:'Ongoing health checks (endpoints, SLAs)'},
];

// ── Variables & Outputs Deep Dive Data ──
const TF_VARS_CONCEPTS = [
  {title:'Variable Types',icon:'🔠',body:'HCL supports: `string`, `number`, `bool`, `list(<type>)`, `set(<type>)`, `map(<type>)`, `object({...})`, `tuple([...])`, and `any`. Constrain with `type =` in the variable block. `any` disables type checking.',code:`variable "tags" {\n  type = map(string)\n  default = {}\n}`},
  {title:'Value Precedence (low → high)',icon:'📊',body:'1. Variable default · 2. `terraform.tfvars` / `*.auto.tfvars` · 3. `-var-file` flag · 4. `-var` flag · 5. `TF_VAR_<name>` env var · 6. Interactive prompt. Higher takes precedence — useful for overriding per-environment.',code:`# Shell override beats .tfvars\nexport TF_VAR_region=eu-west-1`},
  {title:'Sensitive Variables',icon:'🔒',body:'`sensitive = true` suppresses the value in plan/apply output. The value is still stored in state — use a remote backend with encryption. Reference in outputs also marks those outputs as sensitive automatically.',code:`variable "db_password" {\n  type      = string\n  sensitive = true\n}`},
  {title:'Variable Validation (TA-004)',icon:'✅',body:'Add a `validation` block inside any `variable` to enforce custom rules at plan time. The `condition` must evaluate to `true` or Terraform errors with your `error_message`.',code:`validation {\n  condition     = length(var.name) >= 3\n  error_message = "Name must be 3+ chars."\n}`},
  {title:'Outputs',icon:'📤',body:'`output` blocks expose values after apply. Reference child module outputs as `module.<name>.<output>`. Mark as `sensitive = true` to suppress from CLI. Use `description` for self-documenting infrastructure.',code:`output "endpoint" {\n  value       = aws_lb.main.dns_name\n  description = "Load balancer DNS"\n}`},
  {title:'Local Values',icon:'🏷️',body:'`locals {}` defines named computed expressions reusable within a module. Referenced as `local.<name>`. Great for DRY: compute a value once and reuse it across many resources.',code:`locals {\n  prefix = "\${var.env}-\${var.app}"\n  tags   = { Env = var.env }\n}`},
  {title:'for_each vs count',icon:'🔁',body:'`count` is simple numeric repetition — instances get numeric indexes (`[0]`, `[1]`). `for_each` iterates a map or set — instances get stable string keys (`["a"]`, `["b"]`). Prefer `for_each` when items may be added/removed.',code:`resource "aws_iam_user" "devs" {\n  for_each = toset(var.usernames)\n  name     = each.key\n}`},
  {title:'Ephemeral Values (TA-004)',icon:'💨',body:'Values that flow through plan/apply but are never written to state. Used for secrets that must not persist. Write-only arguments accept ephemeral inputs without storing them. New in Terraform 1.12.',code:`# ephemeral value — never in state\nvariable "api_token" {\n  type      = string\n  ephemeral = true\n}`},
];

// ── HCP Terraform Study Data ──
const TF_HCP_CONCEPTS = [
  {title:'HCP Terraform Overview',icon:'☁️',body:'HCP Terraform (formerly Terraform Cloud) is HashiCorp\'s managed service for teams. It provides remote state, remote execution, a private module registry, policy enforcement, and a web UI. The free tier covers small teams.'},
  {title:'Workspaces',icon:'🗂️',body:'Each workspace has its own state, variables, and run history. Workspaces are the unit of work — one workspace typically maps to one environment (dev, staging, prod) or one deployable component.',code:'workspace = isolated state + variables + run history'},
  {title:'Projects (TA-004)',icon:'📁',body:'Projects sit above workspaces in the hierarchy. They group related workspaces (e.g., by app or team). Access control set at project level cascades to all workspaces within. Helps manage large organisations with many workspaces.',code:'Organisation → Projects → Workspaces'},
  {title:'Variable Sets (TA-004)',icon:'📋',body:'Variable sets let you define variables once and apply them to multiple workspaces. Use for shared config like AWS credentials, region, common tags. Scoped to: all workspaces, a project, or specific workspaces.',code:'One variable set → many workspaces\n(no duplication)'},
  {title:'Run Triggers (TA-004)',icon:'⚡',body:'Run triggers automate pipelines between workspaces. When workspace A successfully applies, it automatically triggers a plan (and optionally apply) in workspace B. Use for dependency chains: networking → compute → app.',code:'Workspace A apply\n  → triggers Workspace B plan'},
  {title:'Remote Execution',icon:'🖥️',body:'Plans and applies run on HCP Terraform\'s infrastructure — not your laptop. Credentials never leave HCP Terraform. Useful for teams, auditability, and consistent environments. Alternative: local execution mode (state stored remotely, runs locally).',code:'plan/apply → HCP Terraform runners\n(not your machine)'},
  {title:'Sentinel Policies',icon:'🛡️',body:'Sentinel is a policy-as-code framework that enforces rules before apply. Example: "all S3 buckets must have encryption enabled." Policies can be advisory (warn), soft-mandatory (overridable by admins), or mandatory (always enforced).',code:'Policy check → Advisory / Soft / Hard'},
  {title:'Private Module Registry',icon:'📦',body:'Publish internal modules to HCP Terraform\'s private registry. Teams consume them like public registry modules but with access control. Supports versioning, READMEs, and auto-generated documentation.',code:`source = "app.terraform.io/myorg/vpc/aws"\nversion = "~> 2.0"`},
  {title:'Drift Detection',icon:'🔍',body:'HCP Terraform can automatically detect drift between your state and real infrastructure on a schedule. When drift is detected, it appears in the workspace UI and can optionally trigger a run to remediate.',code:'Scheduled health check → drift alert\n→ optional remediation run'},
];

// ── Providers & Workspaces Study Data ──
const TF_PROVIDERS_CONCEPTS = [
  {title:'What is a Provider?',icon:'🔌',body:'Providers are plugins that implement resource types for a specific platform (AWS, Azure, GCP, Kubernetes, GitHub…). Declared in `required_providers`, downloaded by `terraform init`, and locked by `.terraform.lock.hcl`.',code:`terraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}`},
  {title:'Version Constraints',icon:'📌',body:'Pin providers with version constraint strings: `"~> 5.0"` (>= 5.0, < 6.0), `">= 4.0, < 6.0"` (range), `"= 5.1.2"` (exact). Always pin in shared code. The lock file records exact versions for reproducibility.',code:`# ~> 5.0 means >=5.0.0, <6.0.0\nversion = "~> 5.0"`},
  {title:'Lock File (.terraform.lock.hcl)',icon:'🔒',body:'Created by `terraform init`, records exact provider versions and hashes. Commit this file to version control — it ensures the same provider version is used by every team member and CI run.',code:'commit .terraform.lock.hcl\n# NEVER commit .terraform/ directory'},
  {title:'Provider Aliases',icon:'🏷️',body:'Use `alias` to configure the same provider multiple times (e.g., multi-region). Reference the alias in resources with `provider = aws.<alias>`.',code:`provider "aws" {\n  alias  = "us_east"\n  region = "us-east-1"\n}\nprovider "aws" {\n  alias  = "eu_west"\n  region = "eu-west-1"\n}`},
  {title:'CLI Workspaces',icon:'🗂️',body:'`terraform workspace new <name>` creates a new state file under the same config. `terraform workspace select <name>` switches. Reference in config via `terraform.workspace`. Useful for dev/staging/prod without duplicating code.',code:`terraform workspace new staging\nterraform workspace select prod\n# In .tf files:\nname = "\${terraform.workspace}-api"`},
  {title:'Workspace vs Directory',icon:'⚖️',body:'CLI workspaces share the same config — good for minor environment differences. Separate directories give full isolation — better for significantly different configs. Terraform Cloud workspaces are more powerful than CLI workspaces.',code:'CLI workspace → shared config, different state\nDirectory → fully separate configs'},
  {title:'Multiple Provider Configs',icon:'🌐',body:'You can have multiple configurations of the same provider to manage resources in different accounts or regions. Each resource specifies which provider config to use.',code:`resource "aws_instance" "west" {\n  provider = aws.eu_west\n  ami      = "ami-0abc"\n  # ...\n}`},
];

// ── Providers & Workspaces IaC Fundamentals ──
const TF_IAC_CONCEPTS = [
  {title:'What is IaC?',icon:'📝',body:'Infrastructure as Code means managing infrastructure through declarative config files rather than manual processes. Benefits: version control, repeatability, code review, automation, and disaster recovery (rebuild from code).',},
  {title:'Declarative vs Imperative',icon:'⚖️',body:'Terraform is declarative — you describe the desired end state ("I want 3 EC2 instances") and Terraform figures out how to get there. Imperative tools (scripts, Ansible) describe the steps. Declarative is idempotent by design.',},
  {title:'Idempotency',icon:'🔄',body:'Running `terraform apply` twice with the same config produces the same result — no duplicate resources are created. Terraform compares desired state (config) to current state (state file) and only makes necessary changes.',},
  {title:'Plan Before Apply',icon:'🔍',body:'`terraform plan` shows exactly what will change before anything happens. This is Terraform\'s safety net — always review the plan. In CI, save the plan with `-out=plan.tfplan` and apply that exact plan file.',},
  {title:'Terraform vs Alternatives',icon:'🔧',body:'CloudFormation: AWS-only, JSON/YAML. Pulumi: uses real programming languages (Python, Go). Ansible: imperative, agentless, better for config management. Terraform: declarative HCL, multi-cloud, largest ecosystem.',},
  {title:'Immutable Infrastructure',icon:'🧊',body:'Terraform encourages treating infrastructure as disposable — instead of patching a server, replace it. `lifecycle { create_before_destroy = true }` enables zero-downtime replacement by creating new before destroying old.',},
];

// ── Troubleshooting & Debug Study Data (Obj 7) ──
const TF_TROUBLESHOOT_CONCEPTS = [
  {title:'TF_LOG — Debug Logging',icon:'🪵',body:'Set the `TF_LOG` environment variable to enable detailed logging. Levels (low → high detail): `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`. `TRACE` is most verbose and shows every API call.',code:`export TF_LOG=DEBUG\nexport TF_LOG_PATH=./terraform.log\nterraform apply`},
  {title:'Common Error: "No such file or directory" on init',icon:'❌',body:'Terraform cannot find a required file or module source. Check: the working directory is correct, module `source` paths exist, and you have run `terraform init` after adding new providers or modules.',code:`# Fix: ensure you are in the right directory\ncd infra/\nterraform init`},
  {title:'Common Error: State Lock Timeout',icon:'🔒',body:'`Error acquiring the state lock` — another apply is running, or a previous one crashed leaving a stale lock. Verify no other process is running, then force-unlock using the Lock ID shown in the error.',code:`terraform force-unlock <LOCK_ID>\n# Only run after confirming no apply is active`},
  {title:'Common Error: Provider Auth Failure',icon:'🔑',body:'`Error: No valid credential sources found` — Terraform cannot authenticate to the provider. Check environment variables (`AWS_ACCESS_KEY_ID`, `GOOGLE_CREDENTIALS`), credential files, or IAM role attachments.',code:`# AWS example\nexport AWS_ACCESS_KEY_ID=...\nexport AWS_SECRET_ACCESS_KEY=...\nexport AWS_DEFAULT_REGION=us-east-1`},
  {title:'Common Error: Resource Already Exists',icon:'♻️',body:'`Error: ... already exists` — the resource exists in the real world but not in state. The fix is `terraform import` to bring it under management, NOT deleting and recreating it.',code:`terraform import aws_s3_bucket.my_bucket my-bucket-name\n# Then run plan — should show no diff`},
  {title:'Common Error: Cycle / Dependency Error',icon:'🔄',body:'`Error: Cycle: ...` — two resources depend on each other creating a circular dependency. Restructure so one resource does not reference the other, or use `depends_on` carefully to break the cycle.',code:`# Avoid circular references:\n# A → B → A (not allowed)\n# Fix: restructure so A → B only`},
  {title:'terraform validate',icon:'✅',body:'Run `terraform validate` first for any config error. It checks HCL syntax and internal consistency without calling any APIs or requiring credentials. Fast, safe, and should always pass before running plan.',code:`terraform validate\n# Success: Configuration is valid\n# Or: Error with file and line number`},
  {title:'terraform plan output',icon:'🔍',body:'Read the plan carefully: `+` create, `~` update in-place, `-/+` destroy and recreate, `-` destroy. Pay attention to `-/+` — it means downtime or data loss risk. Use `-out` to save and apply the exact plan.',code:`terraform plan -out=plan.tfplan\nterraform apply plan.tfplan`},
  {title:'terraform state show',icon:'📋',body:'Inspect the raw state of a specific resource. Useful when the plan shows unexpected changes — compare state attributes to your config to find the mismatch.',code:`terraform state list\nterraform state show aws_instance.web`},
  {title:'terraform console',icon:'💻',body:'An interactive REPL for evaluating HCL expressions against your current state and variables. Great for debugging `for`, `if`, string interpolations, and function calls before committing to config.',code:`terraform console\n> var.env\n"prod"\n> length(var.tags)\n3`},
];

// ── Functions & Expressions Study Data (Obj 4) ──
const TF_FUNCTIONS_CONCEPTS = [
  {title:'String Functions',icon:'🔤',body:'Common string functions: `format()` builds formatted strings, `lower()` / `upper()` change case, `replace()` substitutes substrings, `trimspace()` strips whitespace, `split()` / `join()` convert between strings and lists.',code:`format("hello-%s", var.env)   # "hello-prod"\nlower("PROD")                  # "prod"\nsplit(",", "a,b,c")            # ["a","b","c"]\njoin("-", ["a","b"])           # "a-b"`},
  {title:'Collection Functions',icon:'📦',body:'`length()` counts elements. `contains()` checks membership. `merge()` combines maps. `flatten()` collapses nested lists. `distinct()` removes duplicates. `compact()` removes nulls and empty strings.',code:`length(["a","b","c"])          # 3\ncontains(["dev","prod"], "dev") # true\nmerge({a=1},{b=2})             # {a=1, b=2}`},
  {title:'Type Conversion',icon:'🔀',body:'`tostring()`, `tonumber()`, `tobool()`, `tolist()`, `toset()`, `tomap()` convert values between types. `toset()` is especially important — `for_each` requires a set or map, not a list.',code:`toset(["a","b","a"])  # {"a","b"} (deduped)\ntostring(42)          # "42"\ntonumber("3.14")      # 3.14`},
  {title:'Numeric Functions',icon:'🔢',body:'`max()` / `min()` find extreme values in a list. `ceil()` / `floor()` round numbers. `abs()` returns absolute value. `pow()` raises to a power.',code:`max(3, 1, 4, 1, 5)   # 5\nceil(1.2)             # 2\nfloor(1.9)            # 1`},
  {title:'Filesystem Functions',icon:'📁',body:'`file()` reads a local file as a string (useful for loading scripts or JSON). `filebase64()` reads and base64-encodes. `templatefile()` renders a template file with variable substitution.',code:`user_data = file("\${path.module}/init.sh")\npolicy    = file("policy.json")\nrendered  = templatefile("tmpl.tpl", {env=var.env})`},
  {title:'for Expressions',icon:'🔁',body:'`for` expressions transform collections. `for k, v in map : ...` iterates maps. `[for item in list : item.name]` builds a new list. Add `if` to filter: `[for x in list : x if x != ""]`.',code:`# List of names from objects\n[for s in var.servers : s.name]\n\n# Map: name → id\n{for s in var.servers : s.name => s.id}\n\n# Filter\n[for x in var.items : x if x.env == "prod"]`},
  {title:'Conditional Expressions',icon:'❓',body:'Ternary syntax: `condition ? true_val : false_val`. Use for dynamic values based on variables. Common pattern: `var.env == "prod" ? "t3.large" : "t3.micro"` to size resources by environment.',code:`instance_type = var.env == "prod" ? "t3.large" : "t3.micro"\ncount         = var.create_bucket ? 1 : 0`},
  {title:'Dynamic Blocks',icon:'⚙️',body:'Generate repeated nested blocks programmatically using `dynamic`. The `content {}` block defines the template; `for_each` iterates the collection. Avoids copy-pasting identical nested blocks.',code:`dynamic "ingress" {\n  for_each = var.ingress_rules\n  content {\n    from_port = ingress.value.port\n    protocol  = ingress.value.proto\n    cidr_blocks = ingress.value.cidrs\n  }\n}`},
  {title:'String Interpolation & Heredoc',icon:'📝',body:'Template interpolation: `"\${var.name}-api"`. Heredoc for multi-line strings: `<<EOT ... EOT`. `<<-EOT` strips leading whitespace from each line (useful inside indented blocks).',code:`name = "\${var.env}-\${var.app}"\n\npolicy = <<-EOT\n  {\n    "Version": "2012-10-17"\n  }\nEOT`},
  {title:'lookup & try Functions',icon:'🔎',body:'`lookup(map, key, default)` safely gets a map value with a fallback. `try(expr, fallback)` catches errors and returns a fallback — useful when an attribute may not exist.',code:`# Safe map lookup\nlookup(var.ami_map, var.region, "ami-default")\n\n# Graceful fallback\ntry(aws_instance.web.public_ip, "")`},
];

// ── Resource Lifecycle Study Data (Obj 3/4) ──
const TF_LIFECYCLE_CONCEPTS = [
  {title:'create_before_destroy',icon:'♻️',body:'By default Terraform destroys old before creating new during replacement. `create_before_destroy = true` reverses this — the new resource is provisioned first, then the old is destroyed. Essential for zero-downtime updates.',code:`resource "aws_instance" "web" {\n  ami           = var.ami_id\n  instance_type = "t3.micro"\n\n  lifecycle {\n    create_before_destroy = true\n  }\n}`},
  {title:'prevent_destroy',icon:'🛡️',body:'`prevent_destroy = true` causes Terraform to error if it ever tries to destroy the resource — even if you remove the block from config. A safety net for critical resources like databases and state buckets.',code:`resource "aws_db_instance" "prod" {\n  # ...\n  lifecycle {\n    prevent_destroy = true\n  }\n}\n# terraform destroy → Error: Instance cannot be destroyed`},
  {title:'ignore_changes',icon:'🙈',body:'List attributes Terraform should not track. When those attributes drift from config (e.g., changed by an autoscaler or external tool), Terraform ignores the difference and does not plan an update.',code:`resource "aws_autoscaling_group" "app" {\n  # ...\n  lifecycle {\n    ignore_changes = [desired_capacity, tag]\n  }\n}`},
  {title:'replace_triggered_by (TA-004)',icon:'🔁',body:'Forces resource replacement when referenced resources or attributes change — even if the resource\'s own config is unchanged. Useful when a sibling resource\'s change should cause recreation.',code:`resource "aws_instance" "app" {\n  # ...\n  lifecycle {\n    replace_triggered_by = [\n      aws_security_group.app.id\n    ]\n  }\n}`},
  {title:'precondition (TA-004)',icon:'✅',body:'Validates an assumption BEFORE the resource is created or updated. If the condition is false, apply fails immediately with your error message — no infrastructure is touched.',code:`lifecycle {\n  precondition {\n    condition     = var.instance_type != "t2.micro"\n    error_message = "t2.micro is not allowed in prod."\n  }\n}`},
  {title:'postcondition (TA-004)',icon:'✔️',body:'Validates a guarantee AFTER the resource is created. Uses `self` to reference the actual created resource\'s attributes. If false, apply fails — catching provider bugs or unexpected configurations.',code:`lifecycle {\n  postcondition {\n    condition     = self.arn != ""\n    error_message = "Resource ARN must not be empty."\n  }\n}`},
  {title:'Ordering — depends_on',icon:'🔗',body:'Terraform builds a dependency graph automatically from references. `depends_on` adds explicit edges for cases where Terraform cannot detect the relationship — such as a resource that depends on a side-effect of another.',code:`resource "aws_iam_role_policy_attachment" "attach" {\n  # ...\n  depends_on = [aws_iam_role.lambda]\n}`},
  {title:'Meta-Arguments Overview',icon:'📋',body:'All resources accept these meta-arguments: `count` (numeric repetition), `for_each` (map/set iteration), `provider` (select provider alias), `depends_on` (explicit ordering), `lifecycle` (creation/destruction behaviour).',code:`# All meta-arguments\nresource "..." "..." {\n  count       = 3\n  for_each    = toset(var.names)\n  provider    = aws.eu_west\n  depends_on  = [other_resource.x]\n  lifecycle   { ... }\n}`},
];

// ── HCP Workflows & Permissions Study Data (Obj 8) ──
const TF_HCP_WORKFLOWS_CONCEPTS = [
  {title:'CLI-Driven Workflow',icon:'⌨️',body:'Runs originate from your local terminal. `terraform login` authenticates to HCP Terraform. State is stored remotely, but you trigger plans and applies from your machine. Backend is configured as `cloud {}` or `remote`.',code:`terraform {\n  cloud {\n    organization = "my-org"\n    workspaces {\n      name = "prod-vpc"\n    }\n  }\n}`},
  {title:'VCS-Driven Workflow',icon:'🔀',body:'Connect a workspace to a VCS repository (GitHub, GitLab, Bitbucket, Azure DevOps). HCP Terraform auto-triggers a plan on every PR and an apply on merge to the target branch. No local CLI needed for day-to-day operations.',code:`# In HCP Terraform UI:\n# Workspace → Settings → Version Control\n# → Connect to GitHub → Select repo → Set trigger branch`},
  {title:'API-Driven Workflow',icon:'🔌',body:'Use the HCP Terraform API to trigger runs programmatically from any CI/CD system. Create run payloads, upload configuration versions, poll run status. Used for advanced custom pipelines.',code:`# POST to /api/v2/runs\n# Body: { "data": { "type": "runs", ... } }\n# Auth: Bearer <HCP_TF_TOKEN>`},
  {title:'Team Permissions & RBAC',icon:'👥',body:'HCP Terraform RBAC has four built-in levels: **Read** (view workspace), **Plan** (trigger plans only), **Write** (plan + apply + variables), **Admin** (full control including settings). Assigned at workspace or project level.',code:`# Permission levels (low → high)\nRead → Plan → Write → Admin\n\n# Set at: Project level (cascades)\n# or: Individual workspace level`},
  {title:'Teams & Organisations',icon:'🏢',body:'Organisations contain all workspaces and members. Teams are groups of users within an org. Assign teams to workspaces with a permission level. Owner team always has full admin access.',code:`Organisation\n├── Team: Developers (Write)\n├── Team: Ops (Admin)\n└── Team: Security (Read)`},
  {title:'Dynamic Credentials (TA-004)',icon:'🔑',body:'Instead of storing long-lived cloud credentials as variables, HCP Terraform can generate short-lived credentials on demand using OIDC. Works with AWS, Azure, GCP. No static secrets stored in workspaces.',code:`# HCP Terraform → Workspace → Settings\n# → Dynamic Provider Credentials\n# → Configure OIDC trust with AWS IAM\n# → No AWS keys stored in workspace`},
  {title:'Health Assessments & Drift',icon:'🏥',body:'HCP Terraform can run scheduled health checks that detect configuration drift between your state and real infrastructure. When drift is detected, you\'re notified in the UI and can trigger a remediation run.',code:`# Workspace → Health → Enable assessments\n# Scheduled: every 24h by default\n# Shows: drifted resources + recommended actions`},
  {title:'Policy Enforcement (Sentinel)',icon:'🛡️',body:'Sentinel policies run between plan and apply. Three enforcement levels: **Advisory** (warns, apply proceeds), **Soft Mandatory** (warns, admins can override), **Hard Mandatory** (always blocks apply if violated).',code:`# Enforcement levels\nAdvisory     → warn only\nSoft Mandatory → warn; admin override\nHard Mandatory → always block`},
  {title:'Change Requests & Explorer',icon:'🔭',body:'The HCP Terraform Explorer provides a searchable view of all resources across all workspaces in an organisation. Change Requests are a collaboration workflow for reviewing and approving infrastructure changes.',},
];

// ── Terraform Study Guide Render Functions ──

function showTerraformCLIReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">⌨️</div>
      <div style="font-size:16px;font-weight:600">CLI Command Reference</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">Every command you need to know for the exam</div>
    </div>
    ${TF_CLI_COMMANDS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="font-size:22px;flex-shrink:0">${c.icon}</div>
        <div style="flex:1">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:600;color:var(--terraform);margin-bottom:3px">${c.cmd}</div>
          <div style="font-size:13px;color:var(--text);line-height:1.5;margin-bottom:5px">${c.desc}</div>
          <div style="font-size:11px;color:var(--text2);background:var(--surface2);padding:5px 8px;border-radius:6px;border-left:3px solid var(--terraform)">💡 ${c.tip}</div>
        </div>
      </div>
    </div>`).join('')}
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('concepts')" style="flex:1">Quiz Me</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformConceptsReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">🧠</div>
      <div style="font-size:16px;font-weight:600">Core Concepts</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">HCL building blocks — resources, providers, variables, outputs</div>
    </div>
    ${TF_CORE_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="font-size:22px;flex-shrink:0">${c.icon}</div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:600;color:var(--terraform);margin-bottom:3px">${c.name}</div>
          <div style="font-size:13px;color:var(--text);line-height:1.5;margin-bottom:4px">${c.desc}</div>
          <div style="font-size:11px;color:var(--text2)">${c.detail}</div>
        </div>
      </div>
    </div>`).join('')}
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('concepts')" style="flex:1">Quiz Me</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformStateReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">💾</div>
      <div style="font-size:16px;font-weight:600">State & Backends</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">State management, remote backends, locking, security</div>
    </div>
    ${TF_STATE_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="font-size:22px;flex-shrink:0">${c.icon}</div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:600;color:var(--terraform);margin-bottom:4px">${c.title}</div>
          <div style="font-size:13px;color:var(--text);line-height:1.6">${c.body}</div>
        </div>
      </div>
    </div>`).join('')}
    <div class="card" style="padding:12px;margin-bottom:8px;border-color:var(--terraform)">
      <div style="font-size:12px;font-weight:600;color:var(--terraform);margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em">S3 Backend Configuration</div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--text2);line-height:1.8;background:var(--surface2);padding:10px;border-radius:6px">
        terraform {<br>
        &nbsp;&nbsp;backend "s3" {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;bucket&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = "my-tf-state"<br>
        &nbsp;&nbsp;&nbsp;&nbsp;key&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = "prod/terraform.tfstate"<br>
        &nbsp;&nbsp;&nbsp;&nbsp;region&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = "us-east-1"<br>
        &nbsp;&nbsp;&nbsp;&nbsp;encrypt&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = true<br>
        &nbsp;&nbsp;&nbsp;&nbsp;dynamodb_table = "tf-lock"<br>
        &nbsp;&nbsp;}<br>
        }
      </div>
    </div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('truthy')" style="flex:1">True/False Quiz</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformModulesReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">📦</div>
      <div style="font-size:16px;font-weight:600">Modules & Registry</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">Reusable configs — writing, calling, and sourcing modules</div>
    </div>
    ${TF_MODULES_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="font-size:22px;flex-shrink:0">${c.icon}</div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:600;color:var(--terraform);margin-bottom:4px">${c.title}</div>
          <div style="font-size:13px;color:var(--text);line-height:1.6">${c.body}</div>
        </div>
      </div>
    </div>`).join('')}
    <div class="card" style="padding:12px;margin-bottom:8px;border-color:var(--terraform)">
      <div style="font-size:12px;font-weight:600;color:var(--terraform);margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em">Calling a Module</div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--text2);line-height:1.8;background:var(--surface2);padding:10px;border-radius:6px">
        module "vpc" {<br>
        &nbsp;&nbsp;source&nbsp;&nbsp;= "terraform-aws-modules/vpc/aws"<br>
        &nbsp;&nbsp;version = "~> 5.0"<br>
        <br>
        &nbsp;&nbsp;name = "my-vpc"<br>
        &nbsp;&nbsp;cidr = "10.0.0.0/16"<br>
        }<br>
        <br>
        output "vpc_id" {<br>
        &nbsp;&nbsp;value = module.vpc.vpc_id<br>
        }
      </div>
    </div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('scenario')" style="flex:1">Workflow Builder</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformConditionsReference() {
  const compRows = TF_CONDITIONS_COMPARISON.map(r=>`
    <tr>
      <td style="font-weight:600;font-size:11px;color:var(--text);padding:7px 8px;border-bottom:1px solid var(--border);white-space:nowrap">${r.col}</td>
      <td style="font-size:11px;color:var(--text2);padding:7px 8px;border-bottom:1px solid var(--border)">${r.validation}</td>
      <td style="font-size:11px;color:var(--text2);padding:7px 8px;border-bottom:1px solid var(--border)">${r.precondition}</td>
      <td style="font-size:11px;color:var(--text2);padding:7px 8px;border-bottom:1px solid var(--border)">${r.postcondition}</td>
      <td style="font-size:11px;color:var(--text2);padding:7px 8px;border-bottom:1px solid var(--border)">${r.check}</td>
    </tr>`).join('');
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">✅</div>
      <div style="font-size:16px;font-weight:600">Custom Conditions <span style="font-size:11px;background:var(--terraform-dim);color:var(--terraform);padding:2px 6px;border-radius:4px;margin-left:4px">TA-004</span></div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">validation · precondition · postcondition · check blocks</div>
    </div>
    ${TF_CONDITIONS_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="font-size:20px">${c.icon}</div>
        <div style="font-size:14px;font-weight:600;color:var(--terraform)">${c.name}</div>
        <div style="font-size:10px;color:var(--text3);margin-left:auto;text-align:right">${c.scope}</div>
      </div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:8px;line-height:1.5">📌 <em>${c.when}</em></div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text2);line-height:1.9;white-space:pre;background:var(--surface2);padding:10px;border-radius:6px;overflow-x:auto;border-left:3px solid var(--terraform)">${c.syntax}</div>
      <div style="font-size:11px;color:var(--text3);margin-top:6px">💡 ${c.notes}</div>
    </div>`).join('')}
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="font-size:12px;font-weight:600;color:var(--terraform);margin-bottom:8px">Quick Comparison</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:11px">
          <thead><tr>
            <th style="text-align:left;padding:6px 8px;font-size:10px;color:var(--text3);border-bottom:2px solid var(--border)"></th>
            <th style="text-align:left;padding:6px 8px;font-size:10px;color:var(--terraform);border-bottom:2px solid var(--border)">validation</th>
            <th style="text-align:left;padding:6px 8px;font-size:10px;color:var(--terraform);border-bottom:2px solid var(--border)">precondition</th>
            <th style="text-align:left;padding:6px 8px;font-size:10px;color:var(--terraform);border-bottom:2px solid var(--border)">postcondition</th>
            <th style="text-align:left;padding:6px 8px;font-size:10px;color:var(--terraform);border-bottom:2px solid var(--border)">check</th>
          </tr></thead>
          <tbody>${compRows}</tbody>
        </table>
      </div>
    </div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('statedetective')" style="flex:1">State Detective</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformVarsReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">📥</div>
      <div style="font-size:16px;font-weight:600">Variables & Outputs</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">Types · precedence · sensitive · for_each · ephemeral</div>
    </div>
    ${TF_VARS_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="font-size:20px">${c.icon}</div>
        <div style="font-size:14px;font-weight:600;color:var(--terraform)">${c.title}</div>
      </div>
      <div style="font-size:13px;color:var(--text);line-height:1.6;margin-bottom:${c.code?'8px':'0'}">${c.body}</div>
      ${c.code?`<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text2);line-height:1.8;white-space:pre;background:var(--surface2);padding:10px;border-radius:6px;overflow-x:auto;border-left:3px solid var(--terraform)">${c.code}</div>`:''}
    </div>`).join('')}
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('varsquiz')" style="flex:1">Variables Quiz</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformHCPReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">🏢</div>
      <div style="font-size:16px;font-weight:600">HCP Terraform <span style="font-size:11px;background:var(--terraform-dim);color:var(--terraform);padding:2px 6px;border-radius:4px;margin-left:4px">TA-004</span></div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">Projects · workspaces · variable sets · run triggers · Sentinel</div>
    </div>
    <div class="card" style="padding:10px;margin-bottom:10px;border-color:var(--terraform)">
      <div style="font-size:11px;font-weight:600;color:var(--terraform);margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Hierarchy</div>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:12px;font-family:'IBM Plex Mono',monospace;color:var(--text2)">
        <span style="background:var(--terraform-dim);color:var(--terraform);padding:4px 8px;border-radius:6px">Organisation</span>
        <span>→</span>
        <span style="background:var(--terraform-dim);color:var(--terraform);padding:4px 8px;border-radius:6px">Projects</span>
        <span>→</span>
        <span style="background:var(--terraform-dim);color:var(--terraform);padding:4px 8px;border-radius:6px">Workspaces</span>
        <span>→</span>
        <span style="background:var(--terraform-dim);color:var(--terraform);padding:4px 8px;border-radius:6px">Runs</span>
      </div>
    </div>
    ${TF_HCP_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="font-size:20px">${c.icon}</div>
        <div style="font-size:14px;font-weight:600;color:var(--terraform)">${c.title}</div>
      </div>
      <div style="font-size:13px;color:var(--text);line-height:1.6;margin-bottom:${c.code?'8px':'0'}">${c.body}</div>
      ${c.code?`<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text2);line-height:1.8;white-space:pre;background:var(--surface2);padding:10px;border-radius:6px;border-left:3px solid var(--terraform)">${c.code}</div>`:''}
    </div>`).join('')}
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('concepts')" style="flex:1">Quiz Me</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformProvidersReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">🔌</div>
      <div style="font-size:16px;font-weight:600">Providers & Workspaces</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">Versioning · lock file · aliases · CLI workspaces</div>
    </div>
    ${TF_PROVIDERS_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="font-size:20px">${c.icon}</div>
        <div style="font-size:14px;font-weight:600;color:var(--terraform)">${c.title}</div>
      </div>
      <div style="font-size:13px;color:var(--text);line-height:1.6;margin-bottom:${c.code?'8px':'0'}">${c.body}</div>
      ${c.code?`<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text2);line-height:1.8;white-space:pre;background:var(--surface2);padding:10px;border-radius:6px;overflow-x:auto;border-left:3px solid var(--terraform)">${c.code}</div>`:''}
    </div>`).join('')}
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('match')" style="flex:1">Command Match-Up</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformIaCReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">🏗️</div>
      <div style="font-size:16px;font-weight:600">IaC Fundamentals</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">What IaC is, why it matters, and how Terraform fits</div>
    </div>
    ${TF_IAC_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="font-size:20px">${c.icon}</div>
        <div style="font-size:14px;font-weight:600;color:var(--terraform)">${c.title}</div>
      </div>
      <div style="font-size:13px;color:var(--text);line-height:1.6">${c.body}</div>
    </div>`).join('')}
    <div class="card" style="padding:12px;margin-bottom:8px;border-color:var(--terraform)">
      <div style="font-size:12px;font-weight:600;color:var(--terraform);margin-bottom:8px">Terraform vs Alternatives</div>
      ${[
        {tool:'Terraform',lang:'HCL',scope:'Multi-cloud',style:'Declarative',note:'Largest multi-cloud IaC ecosystem'},
        {tool:'CloudFormation',lang:'JSON / YAML',scope:'AWS only',style:'Declarative',note:'Deep AWS integration, no cost'},
        {tool:'Pulumi',lang:'Python / Go / TS',scope:'Multi-cloud',style:'Declarative (code)',note:'Real programming languages'},
        {tool:'Ansible',lang:'YAML',scope:'Multi-cloud',style:'Imperative',note:'Better for config management'},
      ].map(t=>`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--text)">${t.tool}</div>
          <div style="font-size:11px;color:var(--text3)">${t.note}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:11px;font-family:'IBM Plex Mono',monospace;color:var(--text2)">${t.lang}</div>
          <div style="font-size:11px;color:var(--text3)">${t.style} · ${t.scope}</div>
        </div>
      </div>`).join('')}
    </div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('truthy')" style="flex:1">True or False</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformTroubleshootReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">🐛</div>
      <div style="font-size:16px;font-weight:600">Troubleshooting & Debug</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">TF_LOG · common errors · plan output · state inspection</div>
    </div>
    <div class="card" style="padding:10px;margin-bottom:10px;border-color:var(--terraform)">
      <div style="font-size:11px;font-weight:600;color:var(--terraform);margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Diagnostic Workflow</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:11px;font-family:'IBM Plex Mono',monospace">
        ${['terraform validate','terraform plan','terraform state show','TF_LOG=DEBUG','terraform console'].map((s,i)=>`
        <span style="display:flex;align-items:center;gap:4px">
          <span style="background:var(--terraform-dim);color:var(--terraform);width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0">${i+1}</span>
          <span style="background:var(--surface2);padding:3px 7px;border-radius:4px;color:var(--text2)">${s}</span>
        </span>`).join('<span style="color:var(--text3)">→</span>')}
      </div>
    </div>
    ${TF_TROUBLESHOOT_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="font-size:20px">${c.icon}</div>
        <div style="font-size:14px;font-weight:600;color:var(--terraform)">${c.title}</div>
      </div>
      <div style="font-size:13px;color:var(--text);line-height:1.6;margin-bottom:${c.code?'8px':'0'}">${c.body}</div>
      ${c.code?`<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text2);line-height:1.8;white-space:pre;background:var(--surface2);padding:10px;border-radius:6px;overflow-x:auto;border-left:3px solid var(--terraform)">${c.code}</div>`:''}
    </div>`).join('')}
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('statedetective')" style="flex:1">State Detective</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformFunctionsReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">⚙️</div>
      <div style="font-size:16px;font-weight:600">Functions & Expressions</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">Built-in functions · for · if · dynamic blocks · interpolation</div>
    </div>
    ${TF_FUNCTIONS_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="font-size:20px">${c.icon}</div>
        <div style="font-size:14px;font-weight:600;color:var(--terraform)">${c.title}</div>
      </div>
      <div style="font-size:13px;color:var(--text);line-height:1.6;margin-bottom:${c.code?'8px':'0'}">${c.body}</div>
      ${c.code?`<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text2);line-height:1.8;white-space:pre;background:var(--surface2);padding:10px;border-radius:6px;overflow-x:auto;border-left:3px solid var(--terraform)">${c.code}</div>`:''}
    </div>`).join('')}
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('concepts')" style="flex:1">Quiz Me</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformLifecycleReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">🔄</div>
      <div style="font-size:16px;font-weight:600">Resource Lifecycle</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">create_before_destroy · prevent_destroy · ignore_changes · replace_triggered_by</div>
    </div>
    <div class="card" style="padding:10px;margin-bottom:10px;border-color:var(--terraform)">
      <div style="font-size:11px;font-weight:600;color:var(--terraform);margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em">Lifecycle Arguments at a Glance</div>
      ${[
        {arg:'create_before_destroy',effect:'New resource created BEFORE old is destroyed',use:'Zero-downtime updates'},
        {arg:'prevent_destroy',effect:'Error if Terraform tries to destroy this resource',use:'Critical databases, state buckets'},
        {arg:'ignore_changes',effect:'Skip updates for listed attributes when they drift',use:'Autoscaler-managed counts, external tags'},
        {arg:'replace_triggered_by',effect:'Force replace when referenced resource/attr changes',use:'Cascade replacement on sibling change'},
        {arg:'precondition',effect:'Validate BEFORE create/update — blocks on failure',use:'Input assumptions (AMI arch, role exists)'},
        {arg:'postcondition',effect:'Validate AFTER create — blocks on failure',use:'Output guarantees (ARN not empty, encryption on)'},
      ].map(r=>`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--border)">
        <div style="flex:1">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;color:var(--terraform)">${r.arg}</div>
          <div style="font-size:11px;color:var(--text2);margin-top:1px">${r.effect}</div>
        </div>
        <div style="font-size:10px;color:var(--text3);text-align:right;margin-left:8px;max-width:120px">${r.use}</div>
      </div>`).join('')}
    </div>
    ${TF_LIFECYCLE_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="font-size:20px">${c.icon}</div>
        <div style="font-size:14px;font-weight:600;color:var(--terraform)">${c.title}</div>
      </div>
      <div style="font-size:13px;color:var(--text);line-height:1.6;margin-bottom:${c.code?'8px':'0'}">${c.body}</div>
      ${c.code?`<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text2);line-height:1.8;white-space:pre;background:var(--surface2);padding:10px;border-radius:6px;overflow-x:auto;border-left:3px solid var(--terraform)">${c.code}</div>`:''}
    </div>`).join('')}
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('truthy')" style="flex:1">True or False</button>
      <button class="btn btn-ghost" onclick="showTerraformConditionsReference()">Custom Conditions</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

function showTerraformHCPWorkflowsReference() {
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%;font-size:13px" onclick="renderTerraformMenu()">← Back to Terraform</button>
    <div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-size:26px;margin-bottom:4px">🔀</div>
      <div style="font-size:16px;font-weight:600">HCP Terraform: Workflows & Permissions <span style="font-size:11px;background:var(--terraform-dim);color:var(--terraform);padding:2px 6px;border-radius:4px;margin-left:4px">TA-004</span></div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">VCS · CLI · API · RBAC · dynamic credentials · Sentinel</div>
    </div>
    <div class="card" style="padding:10px;margin-bottom:10px;border-color:var(--terraform)">
      <div style="font-size:11px;font-weight:600;color:var(--terraform);margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Three Run Workflows</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${[
          {name:'VCS-driven',desc:'Push to repo → auto plan/apply. Best for teams.',tag:'Recommended'},
          {name:'CLI-driven',desc:'`terraform apply` on your machine, state remote.',tag:'Developer'},
          {name:'API-driven',desc:'POST to API from any CI/CD system.',tag:'Advanced'},
        ].map(w=>`
        <div style="display:flex;justify-content:space-between;align-items:center;background:var(--surface2);padding:8px 10px;border-radius:6px">
          <div>
            <div style="font-size:12px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--text)">${w.name}</div>
            <div style="font-size:11px;color:var(--text2)">${w.desc}</div>
          </div>
          <span style="font-size:10px;background:var(--terraform-dim);color:var(--terraform);padding:2px 6px;border-radius:3px;white-space:nowrap">${w.tag}</span>
        </div>`).join('')}
      </div>
    </div>
    ${TF_HCP_WORKFLOWS_CONCEPTS.map(c=>`
    <div class="card" style="padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="font-size:20px">${c.icon}</div>
        <div style="font-size:14px;font-weight:600;color:var(--terraform)">${c.title}</div>
      </div>
      <div style="font-size:13px;color:var(--text);line-height:1.6;margin-bottom:${c.code?'8px':'0'}">${c.body}</div>
      ${c.code?`<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text2);line-height:1.8;white-space:pre;background:var(--surface2);padding:10px;border-radius:6px;overflow-x:auto;border-left:3px solid var(--terraform)">${c.code}</div>`:''}
    </div>`).join('')}
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-terraform" onclick="startTfGame('scenario')" style="flex:1">Workflow Builder</button>
      <button class="btn btn-ghost" onclick="showTerraformHCPReference()">HCP Overview</button>
      <button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button>
    </div>`;
}

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
  const filteredHistory = getFilteredGameHistory();
  const histCount = filteredHistory.length;
  const histWrong = filteredHistory.filter(r=>!r.wasCorrect).length;
  document.getElementById('game-area').innerHTML=`
    <div class="card" style="text-align:center;padding:12px 16px 10px">
      <div style="font-size:28px;margin-bottom:3px">⚡</div>
      <div style="font-size:17px;font-weight:600;margin-bottom:2px">Terraform Games</div>
      <div style="font-size:12px;color:var(--text2)">HCL · State · Modules · CLI workflow</div>
    </div>

    <div class="section-title" style="padding:0 2px;margin-top:12px">Choose a game</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="startTfGame('concepts')">
        <div class="gm-tag"><span style="background:var(--terraform-dim);color:var(--terraform)">TA-004</span><span style="background:#f3e5f5;color:#6a1b9a">Easy</span></div>
        <div class="gm-icon">🛠️</div>
        <div class="gm-name">Concept Quiz</div>
        <div class="gm-desc">HCL syntax, CLI commands, and core concepts.</div>
      </div>
      <div class="game-mode-btn" onclick="startTfGame('truthy')">
        <div class="gm-tag"><span style="background:var(--terraform-dim);color:var(--terraform)">TA-004</span><span style="background:#f3e5f5;color:#6a1b9a">Easy</span></div>
        <div class="gm-icon">✅</div>
        <div class="gm-name">True or False</div>
        <div class="gm-desc">30 statements — sort fact from fiction.</div>
      </div>
      <div class="game-mode-btn" onclick="startTfGame('hclfixer')">
        <div class="gm-tag"><span style="background:var(--terraform-dim);color:var(--terraform)">TA-004</span><span style="background:#f3e5f5;color:#6a1b9a">Easy</span></div>
        <div class="gm-icon">🐛</div>
        <div class="gm-name">HCL Fixer</div>
        <div class="gm-desc">Spot the bug in each Terraform snippet.</div>
      </div>
      <div class="game-mode-btn" onclick="startTfGame('match')">
        <div class="gm-tag"><span style="background:var(--terraform-dim);color:var(--terraform)">TA-004</span><span style="background:#f3e5f5;color:#6a1b9a">Easy</span></div>
        <div class="gm-icon">🔗</div>
        <div class="gm-name">Command Match-Up</div>
        <div class="gm-desc">Match Terraform commands to what they do.</div>
      </div>
      <div class="game-mode-btn" onclick="startTfGame('scenario')">
        <div class="gm-tag"><span style="background:var(--terraform-dim);color:var(--terraform)">TA-004</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div>
        <div class="gm-icon">🏗️</div>
        <div class="gm-name">Workflow Builder</div>
        <div class="gm-desc">Pick the right command for each step of a real workflow.</div>
      </div>
      <div class="game-mode-btn" onclick="startTfGame('varsquiz')">
        <div class="gm-tag"><span style="background:var(--terraform-dim);color:var(--terraform)">TA-004</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div>
        <div class="gm-icon">📥</div>
        <div class="gm-name">Variables & Outputs</div>
        <div class="gm-desc">Types, validation, sensitive values, and output usage.</div>
      </div>
      <div class="game-mode-btn" onclick="startTfGame('speed')">
        <div class="gm-tag"><span style="background:var(--terraform-dim);color:var(--terraform)">TA-004</span><span style="background:#e8f5e9;color:#2e7d32">Medium</span></div>
        <div class="gm-icon">🏎️</div>
        <div class="gm-name">Speed Round</div>
        <div class="gm-desc">3 lives, 8 seconds per question. How far can you go?</div>
      </div>
      <div class="game-mode-btn" onclick="startTfGame('statedetective')">
        <div class="gm-tag"><span style="background:var(--terraform-dim);color:var(--terraform)">TA-004</span><span style="background:#fff3e0;color:#e65100">Hard</span></div>
        <div class="gm-icon">🔎</div>
        <div class="gm-name">State Detective</div>
        <div class="gm-desc">Diagnose broken state setups — what went wrong and why?</div>
      </div>
    </div>

    <div class="section-title" style="padding:0 2px">Study guides</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="showTerraformIaCReference()">
        <div class="gm-icon">🏗️</div>
        <div class="gm-name">IaC Fundamentals</div>
        <div class="gm-desc">What IaC is, declarative vs imperative, Terraform vs alternatives.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformCLIReference()">
        <div class="gm-icon">⌨️</div>
        <div class="gm-name">CLI Reference</div>
        <div class="gm-desc">Every command with tips, deprecated replacements, exam notes.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformConceptsReference()">
        <div class="gm-icon">🧠</div>
        <div class="gm-name">Core Concepts</div>
        <div class="gm-desc">Resources, providers, variables, outputs, locals, backends.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformVarsReference()">
        <div class="gm-icon">📥</div>
        <div class="gm-name">Variables & Outputs</div>
        <div class="gm-desc">Types, precedence, sensitive, for_each, ephemeral values.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformStateReference()">
        <div class="gm-icon">💾</div>
        <div class="gm-name">State & Backends</div>
        <div class="gm-desc">Remote state, locking, drift detection, S3 config, deprecated commands.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformModulesReference()">
        <div class="gm-icon">📦</div>
        <div class="gm-name">Modules & Registry</div>
        <div class="gm-desc">Writing, calling, sourcing modules, HCP projects, run triggers.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformConditionsReference()">
        <div class="gm-icon">✅</div>
        <div class="gm-name">Custom Conditions</div>
        <div class="gm-desc">validation · precondition · postcondition · check blocks.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformProvidersReference()">
        <div class="gm-icon">🔌</div>
        <div class="gm-name">Providers & Workspaces</div>
        <div class="gm-desc">Versioning, lock file, aliases, CLI workspaces.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformHCPReference()">
        <div class="gm-icon">🏢</div>
        <div class="gm-name">HCP Terraform</div>
        <div class="gm-desc">Projects, variable sets, run triggers, Sentinel, drift detection.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformHCPWorkflowsReference()">
        <div class="gm-icon">🔀</div>
        <div class="gm-name">HCP Workflows & RBAC</div>
        <div class="gm-desc">VCS, CLI, API workflows, teams, dynamic credentials.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformLifecycleReference()">
        <div class="gm-icon">🔄</div>
        <div class="gm-name">Resource Lifecycle</div>
        <div class="gm-desc">create_before_destroy · prevent_destroy · ignore_changes · replace_triggered_by.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformFunctionsReference()">
        <div class="gm-icon">⚙️</div>
        <div class="gm-name">Functions & Expressions</div>
        <div class="gm-desc">Built-in functions, for/if, dynamic blocks, string interpolation.</div>
      </div>
      <div class="game-mode-btn" onclick="showTerraformTroubleshootReference()">
        <div class="gm-icon">🐛</div>
        <div class="gm-name">Troubleshooting & Debug</div>
        <div class="gm-desc">TF_LOG, common errors, diagnostic workflow, state inspection.</div>
      </div>
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

function startTfGame(mode){
  if(mode==='concepts') startTfConceptQuiz();
  else if(mode==='truthy') startTfTruthy();
  else if(mode==='scenario') startTfScenario();
  else if(mode==='match') startTfMatch();
  else if(mode==='hclfixer') startTfHclFixer();
  else if(mode==='varsquiz') startTfVarsQuiz();
  else if(mode==='speed') startTfSpeed();
  else if(mode==='statedetective') startTfStateDetective();
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
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-terraform" onclick="startTfConceptQuiz()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showTerraformConceptsReference()">Study Concepts</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
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
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:40px;margin-bottom:8px">${pct>=80?'🏆':pct>=60?'⭐':'💪'}</div><div style="font-size:32px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--terraform)">${pct}%</div><div style="font-size:14px;color:var(--text2);margin-top:6px">${g.score} of ${g.deck.length} correct</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-terraform" onclick="startTfTruthy()" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="showTerraformStateReference()">Study State</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
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
    <div class="btn-row"><button class="btn btn-terraform" onclick="startTfScenario()" style="flex:1">Next Scenario</button><button class="btn btn-ghost" onclick="showTerraformModulesReference()">Study Modules</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
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
  document.getElementById('game-area').innerHTML=`<div class="game-card"><div style="font-size:36px;margin-bottom:8px">${stars}</div><div style="font-size:20px;font-weight:600;margin-bottom:4px">All Matched!</div><div style="font-size:13px;color:var(--text2)">${secs}s · ${g.matchWrong} mistakes</div></div><div class="btn-row" style="margin-top:10px"><button class="btn btn-terraform" onclick="startTfMatch()" style="flex:1">New Round</button><button class="btn btn-ghost" onclick="showTerraformProvidersReference()">Study Providers</button><button class="btn btn-ghost" onclick="renderTerraformMenu()">Menu</button></div>`;
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
  const filteredHistory = getFilteredGameHistory();
  const histCount = filteredHistory.length;
  const histWrong = filteredHistory.filter(r=>!r.wasCorrect).length;
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
