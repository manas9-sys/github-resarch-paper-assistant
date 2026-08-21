export const DEFAULT_PAPER = {
  id: 'current-paper',
  title: 'Adaptive Graph Neural Operators for Real-Time Anomaly Detection in Distributed Microservices',
  topic: 'Scalable Graph Neural Networks for Anomaly Detection in High-Throughput Distributed Networks',
  domain: 'Computer Science & Distributed Systems',
  targetVenue: 'IEEE Transactions on Network and Service Management',
  authors: 'Alex R. Vance, Priya S. Nair, Marcus Chen',
  affiliations: 'Department of Computer Science & Engineering, Institute of Advanced Technology',
  abstract: 'Modern high-throughput microservice ecosystems generate colossal volumes of telemetry, rendering centralized anomaly classification computationally prohibitive. In this manuscript, we present a decentralized Graph Neural Operator that decouples spatial-temporal message passing from global synchronization constraints. Empirical benchmarks demonstrate a 98.4% F1-score with a 4.2x latency reduction compared to existing baselines.',
  keywords: ['Graph Neural Networks', 'Anomaly Detection', 'Distributed Systems', 'Edge Computing', 'Microservices'],
  activeSectionId: 'introduction',
  sections: [
    {
      id: 'introduction',
      title: 'I. Introduction',
      content: `The rapid evolution of cloud-native computing and microservice architectures has revolutionized enterprise-scale software deployment [1]. However, complex dependencies between hundreds of asynchronous microservices introduce unpredictable failure modes, performance regressions, and cascading outages [2].

Traditional telemetry analysis engines ingest runtime metrics into a centralized cluster. While effective in small-scale environments, this paradigm imposes insurmountable ingress bandwidth penalties and introduces multi-second decision latencies that preclude automated real-time mitigation [3].

To address these limitations, this paper proposes an **Adaptive Edge-Decoupled Message Passing (AED-MP)** framework. Our key technical contributions include:
- A decentralized formulation for spatial-temporal graph anomaly inference under non-deterministic link jitter.
- A Bayesian self-calibrating thresholding function that minimizes false alarms during benign traffic surges.
- Comprehensive empirical evaluation on multi-node Kubernetes clusters demonstrating state-of-the-art accuracy ($98.4\\%$ F1) and sub-3ms inference latency.`
    },
    {
      id: 'related_work',
      title: 'II. Related Work & Literature Review',
      content: `### A. Telemetry-Based Anomaly Detection
Classical network anomaly detection predominantly relied on principal component analysis and rule-based threshold heuristics [4]. While computationally efficient, these models fail to capture non-linear relational dynamics in high-dimensional telemetry spaces.

### B. Graph Neural Networks in Systems
Graph Convolutional Networks (GCN) [5] and Graph Attention Networks (GAT) [6] map service topology into structural embeddings. However, conventional GNN implementations assume globally synchronous message passing across all vertices. In distributed deployments, such synchronization creates severe communication bottlenecks.

### C. The Research Gap
A fundamental tension exists between preserving multi-hop relational context and maintaining decentralized asynchronous execution. Our proposed framework directly reconciles this trade-off.`
    },
    {
      id: 'methodology',
      title: 'III. Proposed Methodology & Mathematical Formulation',
      content: `### A. Dynamic Attributed Graph Representation
Let the network at time $t$ be modeled as an attributed graph $\\mathcal{G}_t = (\\mathcal{V}_t, \\mathcal{E}_t, \\mathbf{X}_t)$, where $\\mathcal{V}_t$ represents active computing nodes ($|\\mathcal{V}_t| = N$) and $\\mathbf{X}_t \\in \\mathbb{R}^{N \\times d}$ denotes node feature telemetry.

We define the localized anomaly probability vector $\\mathbf{\\hat{y}}_t \\in [0, 1]^N$ as:

$$\\mathbf{\\hat{y}}_t = \\sigma \\left( \\Phi_{\\Theta} (\\mathcal{G}_t, \\mathbf{H}_{t-1}) \\right)$$

where $\\Phi_{\\Theta}$ is the parameterized graph neural operator and $\\sigma(\\cdot)$ is the logistic sigmoid function.

### B. Dual-Attention Operator
The localized aggregation for node $v_i$ with respect to neighbor $v_j \\in \\mathcal{N}_i$ is defined as:

$$\\alpha_{ij} = \\frac{\\exp(\\text{LeakyReLU}(\\mathbf{a}^T [\\mathbf{W}\\mathbf{h}_i \\Vert \\mathbf{W}\\mathbf{h}_j]))}{\\sum_{k \\in \\mathcal{N}_i} \\exp(\\text{LeakyReLU}(\\mathbf{a}^T [\\mathbf{W}\\mathbf{h}_i \\Vert \\mathbf{W}\\mathbf{h}_k]))}$$`
    },
    {
      id: 'results',
      title: 'IV. Experimental Results & Discussion',
      content: `### A. Experimental Setup
Experiments were executed on a 64-node distributed testbed with synthetic and production telemetry traces. We evaluated precision, recall, F1-score, and inference latency.

**Table I: Performance Comparison Across Standard Baselines**

| Architecture | Precision (%) | Recall (%) | F1-Score (%) | Latency (ms) |
| :--- | :---: | :---: | :---: | :---: |
| iForest [4] | 83.2 | 79.4 | 81.2 | **0.42** |
| LSTM-AE [3] | 91.5 | 88.7 | 90.1 | 8.65 |
| Standard GAT [6] | 95.2 | 94.6 | 94.9 | 15.80 |
| **Proposed AED-MP** | **98.6** | **98.2** | **98.4** | **2.14** |

The proposed framework achieves a **+3.5% F1 improvement** over standard GAT while delivering a **$7.38\\times$ reduction in inference latency**.`
    },
    {
      id: 'conclusion',
      title: 'V. Conclusion & Future Work',
      content: `We introduced a decentralized graph neural operator for real-time anomaly detection in distributed systems. By decoupling localized edge aggregations from global synchronization, our method achieves superior detection performance with deterministic low latency. Future work will investigate autonomous remediation policies via distributed reinforcement learning.`
    },
    {
      id: 'references',
      title: 'References',
      content: `[1] M. Satyanarayanan, "The emergence of edge computing," *Computer*, vol. 50, no. 1, pp. 30–39, 2017.

[2] V. Chandola, A. Banerjee, and V. Kumar, "Anomaly detection: A survey," *ACM Comput. Surv.*, vol. 41, no. 3, pp. 1–58, 2009.

[3] P. Malhotra et al., "LSTM-based system telemetry analysis," in *Proc. ESANN*, 2015.

[4] F. T. Liu, K. M. Ting, and Z. H. Zhou, "Isolation Forest," in *Proc. ICDM*, 2008.

[5] T. N. Kipf and M. Welling, "Semi-Supervised Classification with Graph Convolutional Networks," in *Proc. ICLR*, 2017.

[6] P. Velickovic et al., "Graph Attention Networks," in *Proc. ICLR*, 2018.`
    }
  ]
};

export const TEMPLATES = [
  {
    id: 'ieee-conf',
    name: 'IEEE Conference Paper',
    description: 'Standard 2-column format with Roman numeral sections, structured Abstract, Index Terms, and numerical citations.',
    venue: 'IEEE Conference Proceedings',
    sections: ['I. Introduction', 'II. Related Work', 'III. Proposed Methodology', 'IV. Experimental Results', 'V. Conclusion', 'References']
  },
  {
    id: 'ieee-trans',
    name: 'IEEE Transactions Journal',
    description: 'Exhaustive theoretical formulation, formal proofs, extended literature review, extensive ablation study, and discussion.',
    venue: 'IEEE Transactions',
    sections: ['I. Introduction', 'II. Background & Literature Review', 'III. Mathematical System Model', 'IV. Proposed Framework', 'V. Empirical Validation', 'VI. Discussion & Limitations', 'VII. Conclusion', 'References']
  },
  {
    id: 'acm-sig',
    name: 'ACM SIG Conference',
    description: 'ACM format with CCS concepts, ACM reference format, methodology, reproducibility artifacts, and ethics statement.',
    venue: 'ACM SIGCOMM / SIGKDD',
    sections: ['1 Introduction', '2 Problem Formulation', '3 System Design', '4 Implementation & Evaluation', '5 Related Work', '6 Ethics & Limitations', '7 Conclusion', 'References']
  },
  {
    id: 'arxiv-preprint',
    name: 'arXiv Preprint',
    description: 'Modern single or dual-column format optimized for fast preprint dissemination with extensive appendices.',
    venue: 'arXiv.org cs.LG / cs.DC',
    sections: ['1 Introduction', '2 Related Work', '3 Methodology', '4 Experiments', '5 Theoretical Analysis', '6 Broader Impacts & Conclusion', 'References', 'Appendix']
  }
];
