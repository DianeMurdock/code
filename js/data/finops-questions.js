// FinOps Certified Practitioner (FCP) independent practice questions
const FINOPS_QUESTIONS = [
  {
    id:'fcp001', exams:['finops'], domain:'Understand Cloud Usage & Cost', difficulty:'easy',
    text:'What is the primary goal of the FinOps practice?',
    options:['Reduce cloud spend to the lowest possible amount in every situation','Create business value from cloud through timely, data-driven collaboration and accountability','Move all cloud purchasing decisions to the finance department','Replace engineering decisions with fixed annual budgets'],
    correct:1, explanation:'FinOps is an operational framework and cultural practice that helps teams maximize business value from cloud through collaboration, shared ownership, and timely data.'
  },
  {
    id:'fcp002', exams:['finops'], domain:'Understand Cloud Usage & Cost', difficulty:'easy',
    text:'Which FinOps principle emphasizes that engineering, finance, and business teams work together?',
    options:['Teams need to collaborate','Everyone takes ownership for their cloud usage','Decisions are driven by business value','FinOps reports should only be reviewed annually'],
    correct:0, explanation:'Cross-functional collaboration brings together the people who understand usage, cost, and business outcomes so they can make informed trade-offs.'
  },
  {
    id:'fcp003', exams:['finops'], domain:'Understand Cloud Usage & Cost', difficulty:'easy',
    text:'A team wants to understand cloud costs by application and owning team. What should it establish?',
    options:['A resource and account strategy with consistent cost-allocation metadata','A single organization-wide unallocated cost bucket','A policy that hides shared costs from engineering','A monthly manual estimate based only on invoices'],
    correct:0, explanation:'A clear account/resource strategy and consistent allocation metadata, such as tags or labels, help attribute spend to the teams and products responsible for it.'
  },
  {
    id:'fcp004', exams:['finops'], domain:'Understand Cloud Usage & Cost', difficulty:'medium',
    text:'Why might an amortized cost view be useful when reviewing cloud spend?',
    options:['It spreads eligible upfront or commitment costs over the period they benefit','It removes all usage-based charges from a bill','It guarantees that every resource is correctly allocated','It reports only list prices before discounts'],
    correct:0, explanation:'Amortization distributes eligible upfront and recurring commitment costs over their benefit period, making costs easier to align with the usage they support.'
  },
  {
    id:'fcp005', exams:['finops'], domain:'Understand Cloud Usage & Cost', difficulty:'medium',
    text:'A dashboard shows a large unallocated shared-platform cost. What is a sound next step?',
    options:['Ignore it because shared costs cannot be managed','Work with stakeholders to define a transparent allocation or shared-cost treatment','Assign the full amount to the smallest engineering team','Remove the platform from cost reporting'],
    correct:1, explanation:'Shared costs need a transparent, agreed treatment. Depending on the service, teams may use a fair allocation proxy or report the cost centrally while keeping it visible.'
  },
  {
    id:'fcp006', exams:['finops'], domain:'Understand Cloud Usage & Cost', difficulty:'hard',
    text:'A stakeholder compares this month’s net bill with last month’s amortized cost. What is the main concern?',
    options:['The comparison mixes different cost views and may misrepresent the trend','Amortized cost always exceeds net cost','Net cost cannot be used for any analysis','Cloud bills are not suitable for comparisons'],
    correct:0, explanation:'Comparisons should use consistent metrics and scopes. Net, amortized, and list cost answer different questions and can show different trends.'
  },
  {
    id:'fcp007', exams:['finops'], domain:'Quantify Business Value', difficulty:'easy',
    text:'What does a unit-economics metric help a team understand?',
    options:['Cloud cost in relation to a meaningful business output, such as cost per transaction','The provider’s total number of regions','Only the monthly invoice amount','How many employees have access to the billing console'],
    correct:0, explanation:'Unit economics connects technology cost to a business unit of value, such as cost per customer, transaction, or workload.'
  },
  {
    id:'fcp008', exams:['finops'], domain:'Quantify Business Value', difficulty:'easy',
    text:'Which example is the clearest cloud unit-cost metric for an online retail service?',
    options:['Total cloud spend for the entire company','Cost per completed order','Number of cloud accounts','Number of monthly cost reports'],
    correct:1, explanation:'Cost per completed order relates cloud spend to a product/business outcome and can be trended as demand and architecture change.'
  },
  {
    id:'fcp009', exams:['finops'], domain:'Quantify Business Value', difficulty:'medium',
    text:'A product’s cloud bill increased by 20%, while its active customers doubled. What should the team investigate?',
    options:['Whether cost per customer improved and whether service outcomes remained acceptable','How to return the bill to the previous total regardless of growth','Whether to stop allocating costs to the product','Whether customer growth should be removed from the dashboard'],
    correct:0, explanation:'Absolute spend alone does not show efficiency. Relating cost to customer growth and service performance helps determine whether business value improved.'
  },
  {
    id:'fcp010', exams:['finops'], domain:'Quantify Business Value', difficulty:'medium',
    text:'What is the purpose of showback?',
    options:['Make teams aware of the costs associated with their usage without directly charging their budgets','Transfer cloud ownership to procurement','Hide costs until the end of the fiscal year','Automatically purchase commitment discounts'],
    correct:0, explanation:'Showback provides visibility into costs by team or product. Chargeback goes further by assigning those costs to budgets or financial accounts.'
  },
  {
    id:'fcp011', exams:['finops'], domain:'Quantify Business Value', difficulty:'hard',
    text:'A team proposes a cost optimization that may increase latency for customers. Which decision approach best reflects FinOps?',
    options:['Choose the lowest-cost option automatically','Evaluate cost alongside customer experience, reliability, and business value','Reject all changes that alter service performance','Make the decision using invoice totals alone'],
    correct:1, explanation:'FinOps optimizes for business value, not cost in isolation. Teams should evaluate the trade-off among spend, performance, reliability, and customer outcomes.'
  },
  {
    id:'fcp012', exams:['finops'], domain:'Quantify Business Value', difficulty:'medium',
    text:'What is a useful role for a forecast in a FinOps practice?',
    options:['Provide an expected spend trajectory that teams can compare with actuals and business plans','Guarantee that usage and prices will not change','Replace cost allocation and ownership','Prove that all spend is waste'],
    correct:0, explanation:'Forecasts support planning and timely action. Comparing forecast with actuals helps teams understand variance and update assumptions as usage changes.'
  },
  {
    id:'fcp013', exams:['finops'], domain:'Optimize Cloud Usage & Cost', difficulty:'easy',
    text:'A development environment runs continuously but is used only during business hours. Which optimization is most directly applicable?',
    options:['Schedule the environment to stop outside working hours, after validating operational needs','Purchase a longer-term commitment immediately','Increase instance size to finish work earlier','Remove cost reporting for the environment'],
    correct:0, explanation:'Scheduling non-production resources to match actual working patterns can reduce unused runtime without affecting production availability.'
  },
  {
    id:'fcp014', exams:['finops'], domain:'Optimize Cloud Usage & Cost', difficulty:'easy',
    text:'In the FinOps Framework, what does the Optimize phase focus on?',
    options:['Finding and implementing ways to improve cloud efficiency and value','Producing the initial cloud invoice','Defining the organization chart','Ending cost visibility after a budget is approved'],
    correct:0, explanation:'The Optimize phase focuses on identifying and applying improvements to usage, rates, architecture, and other cost/value drivers.'
  },
  {
    id:'fcp015', exams:['finops'], domain:'Optimize Cloud Usage & Cost', difficulty:'medium',
    text:'What is an important consideration before committing to discounted cloud capacity?',
    options:['The stability and expected duration of the underlying usage, plus flexibility and commitment risk','Whether the commitment has the largest available term','Whether all workloads can be moved to one instance family','Whether the commitment hides usage from teams'],
    correct:0, explanation:'Commitment-based discounts can reduce rates for predictable usage but introduce financial risk if demand changes or workloads no longer match the commitment.'
  },
  {
    id:'fcp016', exams:['finops'], domain:'Optimize Cloud Usage & Cost', difficulty:'medium',
    text:'A service has low CPU utilization but strict latency and availability targets. What should be done before right-sizing?',
    options:['Review performance and reliability requirements, usage patterns, and test changes safely','Immediately select the smallest instance','Disable monitoring to reduce overhead','Assume low average CPU proves the service is oversized'],
    correct:0, explanation:'Right-sizing should use representative utilization and workload behavior while preserving performance, reliability, and safety objectives.'
  },
  {
    id:'fcp017', exams:['finops'], domain:'Optimize Cloud Usage & Cost', difficulty:'medium',
    text:'Which pair best represents the two broad levers for cloud cost optimization?',
    options:['Reduce the rate paid and improve resource usage/efficiency','Increase the number of accounts and dashboards','Move all workloads to the newest instance type','Reduce reporting frequency and increase budgets'],
    correct:0, explanation:'FinOps optimization commonly examines rate optimization (what is paid per unit) and usage optimization (how much and what resources are consumed).'
  },
  {
    id:'fcp018', exams:['finops'], domain:'Optimize Cloud Usage & Cost', difficulty:'hard',
    text:'An engineering team finds idle resources owned by another team. What is the best first response?',
    options:['Delete them immediately','Contact the owners, verify dependency and lifecycle, then agree on a safe action','Reassign the costs without notifying anyone','Disable the account that contains them'],
    correct:1, explanation:'Resource ownership and operational context matter. Verify that resources are unused and coordinate a safe change before removal.'
  },
  {
    id:'fcp019', exams:['finops'], domain:'Manage the FinOps Practice', difficulty:'easy',
    text:'What are the three iterative phases commonly used in the FinOps Framework?',
    options:['Inform, Optimize, Operate','Plan, Purchase, Depreciate','Design, Build, Archive','Allocate, Invoice, Audit'],
    correct:0, explanation:'Inform creates visibility and shared understanding; Optimize identifies improvements; Operate embeds ongoing execution and measurement. The phases are iterative.'
  },
  {
    id:'fcp020', exams:['finops'], domain:'Manage the FinOps Practice', difficulty:'easy',
    text:'Who should take ownership of cloud usage and cost in a mature FinOps practice?',
    options:['Only the central finance team','The teams that design, build, and use cloud services, supported by finance and other partners','Only the cloud provider','Only procurement after an invoice arrives'],
    correct:1, explanation:'FinOps is cross-functional. Engineering and product teams influence usage, while finance, procurement, leadership, and platform teams contribute context and enablement.'
  },
  {
    id:'fcp021', exams:['finops'], domain:'Manage the FinOps Practice', difficulty:'medium',
    text:'What is a useful responsibility of a central FinOps team?',
    options:['Enable shared practices, data, and collaboration while helping teams make informed decisions','Make every workload architecture decision centrally','Own all cloud resources on behalf of product teams','Optimize solely for the lowest monthly bill'],
    correct:0, explanation:'A central FinOps function often enables common data, policies, education, and coordination while leaving workload decisions with accountable teams.'
  },
  {
    id:'fcp022', exams:['finops'], domain:'Manage the FinOps Practice', difficulty:'medium',
    text:'Why should FinOps metrics be reviewed regularly with engineering and business stakeholders?',
    options:['To connect changes in usage and cost to operational choices and business outcomes','To ensure no one can change cloud architecture','To replace service-level objectives','To delay decisions until annual budgeting'],
    correct:0, explanation:'Regular reviews create a feedback loop: teams can explain variances, evaluate outcomes, and prioritize actions using current information.'
  },
  {
    id:'fcp023', exams:['finops'], domain:'Manage the FinOps Practice', difficulty:'hard',
    text:'A cloud cost anomaly is detected. Which response best supports a learning-oriented FinOps culture?',
    options:['Identify the responsible person and impose a penalty before investigating','Investigate the driver with the owning team, assess impact, and improve prevention or response','Hide the anomaly from the product team','Wait for the next annual budget review'],
    correct:1, explanation:'Anomaly response should focus on timely investigation, business impact, ownership, and improving controls or forecasts rather than blame.'
  },
  {
    id:'fcp024', exams:['finops'], domain:'Manage the FinOps Practice', difficulty:'medium',
    text:'What does the Operate phase contribute to an ongoing FinOps practice?',
    options:['Integrate FinOps activities into regular workflows, governance, measurement, and continuous improvement','Make optimization a one-time project','Stop sharing cost information after deployment','Replace business goals with fixed utilization targets'],
    correct:0, explanation:'Operate embeds continuous FinOps activities in day-to-day workflows, including governance, measurement, and feedback across teams.'
  }
];
