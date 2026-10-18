// AWS Certified AI Practitioner (AIF-C01) study questions
const AI_PRACTITIONER_QUESTIONS = [
  {
    id:'ai001', exams:['ai'], domain:'Fundamentals of AI and ML', difficulty:'easy',
    text:'Which statement best describes machine learning?',
    options:['A system that follows only explicitly hard-coded rules','A method that learns patterns from data to make predictions or decisions','A database that stores training examples','A network protocol for connecting AI services'],
    correct:1, explanation:'Machine learning uses data to train models that identify patterns and produce predictions or decisions without requiring every rule to be explicitly programmed.'
  },
  {
    id:'ai002', exams:['ai'], domain:'Fundamentals of AI and ML', difficulty:'easy',
    text:'A model predicts a numeric house price from property features. Which type of ML task is this?',
    options:['Classification','Regression','Clustering','Dimensionality reduction'],
    correct:1, explanation:'Regression predicts a continuous numeric value, such as a price. Classification predicts a category or label.'
  },
  {
    id:'ai003', exams:['ai'], domain:'Fundamentals of AI and ML', difficulty:'easy',
    text:'A labeled dataset contains product reviews marked positive or negative. Which approach learns from these examples?',
    options:['Supervised learning','Unsupervised learning','Reinforcement learning','Retrieval-augmented generation'],
    correct:0, explanation:'Supervised learning trains on labeled examples, learning to map inputs such as review text to known outputs such as sentiment.'
  },
  {
    id:'ai004', exams:['ai'], domain:'Fundamentals of AI and ML', difficulty:'hard',
    text:'An organization wants to group customers by purchasing behavior but has no predefined customer categories. Which method fits?',
    options:['Regression','Classification','Clustering','Speech recognition'],
    correct:2, explanation:'Clustering is an unsupervised learning technique that groups similar examples without requiring predefined labels.'
  },
  {
    id:'ai005', exams:['ai'], domain:'Fundamentals of AI and ML', difficulty:'hard',
    text:'What is a common purpose of splitting data into training and test sets?',
    options:['To increase the size of the training examples by duplicating them','To evaluate how well a trained model generalizes to unseen data','To guarantee that the model has no bias','To encrypt sensitive values before training'],
    correct:1, explanation:'The training set fits model parameters; a separate test set estimates performance on data the model did not train on.'
  },
  {
    id:'ai006', exams:['ai'], domain:'Fundamentals of AI and ML', difficulty:'hard',
    text:'A model performs very well on training data but poorly on new examples. What is the most likely issue?',
    options:['Underfitting','Overfitting','Data encryption','Tokenization'],
    correct:1, explanation:'Overfitting occurs when a model learns training-specific details and fails to generalize to unseen data.'
  },
  {
    id:'ai007', exams:['ai'], domain:'Fundamentals of Generative AI', difficulty:'easy',
    text:'What is the primary distinction between generative AI and traditional predictive ML?',
    options:['Generative AI creates new content, while predictive ML commonly estimates labels or values','Generative AI requires no data, while predictive ML always requires labeled data','Generative AI is only used for images','Predictive ML can only run on local computers'],
    correct:0, explanation:'Generative AI produces new content such as text, images, or code; predictive ML commonly classifies inputs or estimates values.'
  },
  {
    id:'ai008', exams:['ai'], domain:'Fundamentals of Generative AI', difficulty:'easy',
    text:'What does a token represent when a large language model processes text?',
    options:['A unit of text, such as a word, part of a word, or punctuation','A uniquely assigned AWS account number','A complete training dataset','A guarantee that an answer is factually correct'],
    correct:0, explanation:'Models process text as tokens, which can represent whole words, word fragments, punctuation, or other units.'
  },
  {
    id:'ai009', exams:['ai'], domain:'Fundamentals of Generative AI', difficulty:'hard',
    text:'What is a foundation model?',
    options:['A model trained for one fixed prediction using only a single labeled example','A broadly trained model that can be adapted to a range of downstream tasks','A physical server used to train neural networks','A policy that controls access to model endpoints'],
    correct:1, explanation:'A foundation model is trained on broad data and can be adapted or prompted for many downstream tasks.'
  },
  {
    id:'ai010', exams:['ai'], domain:'Fundamentals of Generative AI', difficulty:'hard',
    text:'Which statement best describes an embedding?',
    options:['A numerical representation of data that captures semantic relationships','A list of IAM permissions attached to a model','A compressed copy of a foundation model','A prompt that prevents all inaccurate responses'],
    correct:0, explanation:'Embeddings represent items such as text as vectors, allowing semantically similar items to be compared and retrieved.'
  },
  {
    id:'ai011', exams:['ai'], domain:'Fundamentals of Generative AI', difficulty:'hard',
    text:'What is a common limitation of large language models that can lead to plausible but incorrect responses?',
    options:['Hallucination','Autoscaling','Data normalization','Encryption at rest'],
    correct:0, explanation:'Hallucinations are generated outputs that sound plausible but are inaccurate, unsupported, or fabricated.'
  },
  {
    id:'ai012', exams:['ai'], domain:'Fundamentals of Generative AI', difficulty:'hard',
    text:'What is the main role of a prompt in a generative AI interaction?',
    options:['It provides instructions and context that guide the model output','It permanently changes the foundation model weights','It guarantees that retrieved data is current','It grants the model administrative access to AWS'],
    correct:0, explanation:'A prompt supplies the task, instructions, and context that steer a model response; it does not by itself retrain the model.'
  },
  {
    id:'ai013', exams:['ai'], domain:'Applications of Foundation Models', difficulty:'easy',
    text:'A team wants to build a generative AI application using foundation models through a managed AWS service. Which service is designed for this?',
    options:['Amazon Bedrock','AWS Artifact','Amazon Route 53','AWS Trusted Advisor'],
    correct:0, explanation:'Amazon Bedrock provides managed access to foundation models and tools for building generative AI applications.'
  },
  {
    id:'ai014', exams:['ai'], domain:'Applications of Foundation Models', difficulty:'hard',
    text:'A company wants a model response grounded in its frequently updated internal product documentation without retraining the model. What is the best fit?',
    options:['Retrieval-augmented generation (RAG)','Increasing the model temperature','Replacing the documentation with synthetic labels','Using image classification'],
    correct:0, explanation:'RAG retrieves relevant external knowledge at inference time and includes it as context, grounding responses in current information.'
  },
  {
    id:'ai015', exams:['ai'], domain:'Applications of Foundation Models', difficulty:'hard',
    text:'Which approach is generally most suitable when an application needs consistent output structure for downstream software?',
    options:['Request a defined schema or structured output and validate the response','Increase randomness so responses vary','Remove all instructions from the prompt','Assume every model response is valid JSON'],
    correct:0, explanation:'Explicit output instructions or a supported structured-output mode can improve consistency, but applications should still validate responses.'
  },
  {
    id:'ai016', exams:['ai'], domain:'Applications of Foundation Models', difficulty:'hard',
    text:'A developer wants a model to follow examples of the desired response included in a prompt, without updating model weights. What is this called?',
    options:['Few-shot prompting','Model distillation','Retraining','Data labeling'],
    correct:0, explanation:'Few-shot prompting includes a small number of input-output examples in the prompt to demonstrate the desired behavior.'
  },
  {
    id:'ai017', exams:['ai'], domain:'Applications of Foundation Models', difficulty:'hard',
    text:'Which factor should be considered when selecting a foundation model for an application?',
    options:['Task quality, latency, cost, supported modalities, and deployment requirements','Only the model name and release date','Whether the model eliminates the need to evaluate outputs','Whether the model has the largest possible parameter count'],
    correct:0, explanation:'Model selection balances task performance and requirements such as latency, cost, modality support, and deployment constraints.'
  },
  {
    id:'ai018', exams:['ai'], domain:'Applications of Foundation Models', difficulty:'hard',
    text:'A generative AI system must refuse certain unsafe requests and filter harmful inputs and outputs. Which capability is most relevant?',
    options:['Guardrails and content moderation','A larger context window alone','A higher temperature setting','A read replica'],
    correct:0, explanation:'Guardrails and moderation controls can help detect and filter unsafe inputs or outputs; they should be tested as part of a broader safety design.'
  },
  {
    id:'ai019', exams:['ai'], domain:'Applications of Foundation Models', difficulty:'hard',
    text:'What is a practical reason to fine-tune a foundation model?',
    options:['To adapt model behavior to a specialized task or domain using curated examples','To make a model automatically current with all live web pages','To guarantee zero inference cost','To replace identity and access management'],
    correct:0, explanation:'Fine-tuning updates a model using task- or domain-specific examples to adapt its behavior; it does not guarantee current knowledge or eliminate other controls.'
  },
  {
    id:'ai020', exams:['ai'], domain:'Applications of Foundation Models', difficulty:'easy',
    text:'An application needs to convert spoken customer requests into text before processing them. Which AI capability is required?',
    options:['Speech-to-text transcription','Image segmentation','Tabular regression','Vector indexing'],
    correct:0, explanation:'Speech-to-text transcription converts spoken audio into text that downstream systems can process.'
  },
  {
    id:'ai021', exams:['ai'], domain:'Guidelines for Responsible AI', difficulty:'easy',
    text:'What does bias in an AI system refer to?',
    options:['A systematic tendency for outcomes to disadvantage or favor particular groups','The time required to generate an inference','The size of a model vocabulary','The process of encrypting training data'],
    correct:0, explanation:'AI bias can cause systematic differences in outcomes across individuals or groups, often reflecting data or design issues.'
  },
  {
    id:'ai022', exams:['ai'], domain:'Guidelines for Responsible AI', difficulty:'hard',
    text:'Which practice can help identify unfair performance differences across demographic groups?',
    options:['Evaluate model outcomes across relevant groups using representative data','Measure only overall accuracy on training data','Remove all human review from the workflow','Increase the number of model parameters'],
    correct:0, explanation:'Disaggregated evaluation on representative data can surface unequal outcomes that an overall metric may hide.'
  },
  {
    id:'ai023', exams:['ai'], domain:'Guidelines for Responsible AI', difficulty:'hard',
    text:'Why should a human remain involved when AI generates recommendations for a consequential decision?',
    options:['To provide oversight, review context, and challenge inappropriate or incorrect outputs','To ensure the model never needs monitoring','To prevent the model from receiving any input data','To make every recommendation automatically binding'],
    correct:0, explanation:'Human oversight can provide context, review high-impact decisions, and intervene when outputs are inappropriate or incorrect.'
  },
  {
    id:'ai024', exams:['ai'], domain:'Guidelines for Responsible AI', difficulty:'easy',
    text:'Which action best supports explainability for an AI-assisted decision?',
    options:['Provide appropriate information about the factors or evidence behind the output','Hide model limitations from affected users','Use a more complex model regardless of the use case','Store only the final output and discard evaluation records'],
    correct:0, explanation:'Explainability helps stakeholders understand relevant factors and evidence behind an output, at a level appropriate to the use case.'
  },
  {
    id:'ai025', exams:['ai'], domain:'Guidelines for Responsible AI', difficulty:'hard',
    text:'An AI feature could create harmful outcomes if it is inaccurate. What should a team do before release?',
    options:['Assess risks, test representative cases, and establish monitoring and human escalation','Release immediately and rely only on user complaints','Optimize only for response speed','Assume a pretrained model is safe for every context'],
    correct:0, explanation:'Responsible deployment includes risk assessment, testing, safeguards, monitoring, and an escalation path suited to potential impact.'
  },
  {
    id:'ai026', exams:['ai'], domain:'Guidelines for Responsible AI', difficulty:'hard',
    text:'Why is data provenance important when building or evaluating AI systems?',
    options:['It helps establish where data came from and whether its use is appropriate','It guarantees that a model will be unbiased','It increases inference throughput','It removes the need for access controls'],
    correct:0, explanation:'Knowing data sources and permitted uses supports quality assessment, accountability, and privacy or licensing reviews.'
  },
  {
    id:'ai027', exams:['ai'], domain:'Security, Compliance, and Governance for AI Solutions', difficulty:'easy',
    text:'What is the principle of least privilege for an AI application role?',
    options:['Grant only the permissions required for the application to perform its task','Give every model endpoint administrator permissions','Share root credentials with the development team','Allow public access to simplify testing'],
    correct:0, explanation:'Least privilege limits each identity to the minimum permissions necessary, reducing the impact of mistakes or compromised credentials.'
  },
  {
    id:'ai028', exams:['ai'], domain:'Security, Compliance, and Governance for AI Solutions', difficulty:'hard',
    text:'A team must protect sensitive data used by an AI application while stored in AWS. Which control is directly relevant?',
    options:['Encryption at rest using an appropriate key-management approach','Increasing the model temperature','Adding more prompt examples','Reducing the model context window'],
    correct:0, explanation:'Encryption at rest protects stored data; teams should also consider access control, key management, and data minimization.'
  },
  {
    id:'ai029', exams:['ai'], domain:'Security, Compliance, and Governance for AI Solutions', difficulty:'hard',
    text:'Which action helps reduce the risk of sensitive information being exposed in prompts?',
    options:['Minimize and redact sensitive data before sending it to a model','Include full production records for better context','Log all prompts in a publicly accessible location','Disable input validation'],
    correct:0, explanation:'Data minimization and redaction reduce exposure; prompt handling, logging, retention, and access controls also require careful design.'
  },
  {
    id:'ai030', exams:['ai'], domain:'Security, Compliance, and Governance for AI Solutions', difficulty:'hard',
    text:'What is a useful purpose of logging and monitoring AI application activity?',
    options:['Support auditing, detect anomalous behavior, and investigate operational or security events','Guarantee that model outputs are always correct','Replace all application security testing','Make model training data publicly available'],
    correct:0, explanation:'Appropriately protected logs and monitoring can support auditability and incident investigation; avoid retaining sensitive content unnecessarily.'
  }
];
