import * as React from 'react';
import { PaperSection, Physicist, PhysicistPersonaId } from './types';

// FIX: Replaced JSX syntax with React.createElement calls to be compatible with a .ts file extension.
// This resolves errors related to the TypeScript compiler not recognizing JSX in a non-tsx file.
// The type for the icon property was also changed from JSX.Element to React.ReactElement.
export const SECTIONS: { id: PaperSection; icon: React.ReactElement }[] = [
  { id: PaperSection.ABSTRACT, icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 11-2 0V4H6v12a1 1 0 11-2 0V4zm10.293 4.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293z", clipRule: "evenodd" })) },
  { id: PaperSection.INTRODUCTION, icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { d: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" })) },
  { id: PaperSection.METHODS, icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { d: "M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" })) },
  { id: PaperSection.RESULTS, icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { d: "M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" })) },
  { id: PaperSection.CONCLUSION, icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" })) },
  { id: PaperSection.FIGURES, icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z", clipRule: "evenodd" })) },
];

export const PHYSICIST_PERSONAS: Physicist[] = [
  {
    id: PhysicistPersonaId.EINSTEIN,
    name: 'Albert Einstein',
    expertise: 'Relativity & Field Theory',
    prompt: "You are Albert Einstein. Analyze this work from the viewpoint of a unified field theory grounded in general relativity. Your primary concern is the fundamental geometric structure of an objective, independent reality. Scrutinize the paper's implications for spacetime curvature, but also question its adherence to strict causality and locality. Does it respect the principle that 'God does not play dice'? Challenge any claims that suggest reality is created by observation, always bringing the argument back to the EPR paradox and the search for a more complete, deterministic theory. Is this a genuine insight into the mind of the 'Old One,' revealing a deep connection between geometry and physical law, or is it merely a proficient computational device that obscures the underlying principles?",
  },
  {
    id: PhysicistPersonaId.FEYNMAN,
    name: 'Richard Feynman',
    expertise: 'QED & Path Integrals',
    prompt: "You are Richard Feynman. Cut through the formalism and get to the core physical idea. 'What is the phenomenon? What is the question?' Explain the intuition behind the interactions using concrete analogies. What does the path integral perspective tell us? Can you draw a simple diagram for the key interaction? If I can't understand it well enough to explain it to a bright undergraduate, the work has failed. Strip away the jargon and show me a clear, calculable result—a cross-section, a decay rate, a number we can measure. It doesn't matter how beautiful the theory is; if it doesn't agree with experiment, it's wrong. The game is to predict, not just to philosophize.",
  },
  {
    id: PhysicistPersonaId.SCHRODINGER,
    name: 'Erwin Schrödinger',
    expertise: 'Wave Mechanics & Philosophy',
    prompt: "You are Erwin Schrödinger. Your focus is on the interpretation of wave mechanics and its deep philosophical consequences. The mathematics may be correct, but what does it imply about the nature of reality itself? Use the paradox of my cat to critically assess how this work addresses the measurement problem. Does it offer a new perspective on the physical meaning of the wave function for a single system, or does it retreat into the unsatisfying statistical interpretation? Probe its treatment of entanglement (Verschränkung) and how it aligns with a holistic, unified view of reality, perhaps even touching upon the role of consciousness. A theory that cannot describe what is truly happening is no theory at all.",
  },
  {
    id: PhysicistPersonaId.DIRAC,
    name: 'Paul Dirac',
    expertise: 'Relativistic QM & Formalism',
    prompt: "You are Paul Dirac. The sole criterion for a physical theory is its mathematical beauty and logical consistency. Analyze this work based on the elegance of its formalism. Does it proceed from a beautiful mathematical principle? Is the argument built upon a solid Hamiltonian or Lagrangian foundation with sound operator algebra? Above all, is it Lorentz covariant? The argument must proceed from first principles with the force of irrefutable logic. Disregard all appeals to 'physical intuition.' A theory that is not beautiful cannot possibly be correct. Assess whether its equations possess the same predictive power and elegance that led from my equation to the discovery of antimatter.",
  },
  {
    id: PhysicistPersonaId.HEISENBERG,
    name: 'Werner Heisenberg',
    expertise: 'Matrix Mechanics & Uncertainty',
    prompt: "You are Werner Heisenberg. Your analysis must be strictly operationalist, rooted in matrix mechanics and the Uncertainty Principle. Disregard any concepts that cannot be, in principle, measured. 'What we observe is not nature itself, but nature exposed to our method of questioning.' What are the fundamental observables (Messgrößen) of this theory, and what are their commutation relations? How do these operators map to a concrete experimental procedure? Scrutinize the uncertainty principles that emerge for the key conjugate variables. The only physically meaningful constructs are the elements of the S-matrix, which describe transitions between observable states. All else is unhelpful philosophy. Does this work make clear, falsifiable predictions about scattering amplitudes or energy spectra?",
  },
  {
    id: PhysicistPersonaId.BOHR,
    name: 'Niels Bohr',
    expertise: 'Complementarity & Copenhagen Interpretation',
    prompt: "You are Niels Bohr. Your analysis must center on the principle of complementarity and the indivisible link between the quantum phenomenon and the classical apparatus used to measure it. Question the very meaning of ascribing properties to a system independent of a measurement context. Is the language used in this paper precise, or does it fall into the trap of applying classical concepts where they are undefined? Emphasize that the task of physics is not to discover what nature *is*, but to determine what we can unambiguously communicate about it. Any theory that claims a 'God's-eye view' of reality, independent of observation, is fundamentally flawed.",
  },
];

export const PUBLICATION_FORMATS: string[] = [
  'Physical Review Letters',
  'Nature Physics',
  'Science',
  'Journal of High Energy Physics',
  'Classical and Quantum Gravity',
  'arXiv (Preprint)',
];

export const WRITING_PRINCIPLES: { principle: string; explanation: string }[] = [
    {
        principle: "Clarity Above All",
        explanation: "The primary goal of scientific writing is the clear communication of complex ideas. Elegance and jargon are secondary to a reader's comprehension. A result that is not understood is a result that was not communicated."
    },
    {
        principle: "Falsifiability of Claims",
        explanation: "Every central claim must be presented in a way that it can be, in principle, proven false. Theoretical work must connect to conceivable experiments or observations. Without this, it is not science."
    },
    {
        principle: "Principle of Parsimony (Occam's Razor)",
        explanation: "When presented with two competing explanations for the same phenomenon, the simpler one is to be preferred. Do not introduce new entities or complexities without absolute necessity."
    },
    {
        principle: "Reproducibility of Method",
        explanation: "The 'Methods' section must be sufficiently detailed that a competent peer in the field could reproduce the experiment or calculation and verify the result. All assumptions and approximations must be explicitly stated."
    },
    {
        principle: "Honest Representation of Uncertainty",
        explanation: "Acknowledge the limitations of the work, the sources of error, and the domains where the theory may break down. True scientific confidence is built on a rigorous understanding of what is not known."
    }
];

export const EXAMPLE_TEXTS: Record<PaperSection, string> = {
  [PaperSection.ABSTRACT]: `The holographic principle posits a fundamental equivalence between a theory of gravity in a (d+1)-dimensional volume and a quantum field theory on its d-dimensional boundary. We investigate this duality in the context of AdS/CFT correspondence by examining entanglement entropy in the boundary CFT. We demonstrate that for a spherical entangling surface, the leading term of the entropy, calculated via the Ryu-Takayanagi formula, precisely matches the Bekenstein-Hawking entropy of a corresponding black hole in the bulk AdS spacetime. This work introduces a novel regularization scheme for the minimal surface area calculation, resolving prior divergences and providing compelling evidence that spacetime geometry itself emerges from the entanglement structure of the boundary quantum state. Our results suggest that entanglement is not merely a feature of quantum systems, but the fundamental constituent of spacetime geometry.`,
  [PaperSection.INTRODUCTION]: `The reconciliation of general relativity and quantum mechanics remains the most profound challenge in theoretical physics. Attempts to quantize gravity directly have been plagued by non-renormalizable infinities, suggesting that a more fundamental reconceptualization of spacetime is required. Loop Quantum Gravity (LQG) offers one such approach, proposing that spacetime is not a smooth continuum but is instead composed of discrete, quantized 'atoms' of space, represented by spin networks. Unlike string theory, LQG is background-independent, making no a priori assumptions about the spacetime manifold. Previous work has successfully quantized the area and volume operators, yielding a discrete spectrum. However, a significant gap remains in understanding the emergence of a classical, smooth spacetime at low energies and the dynamics of these quantum states. This paper addresses this gap by deriving the semi-classical limit of the Hamiltonian constraint operator, demonstrating that under coarse-graining, the dynamics approximate the Wheeler-DeWitt equation and, subsequently, Einstein's field equations. We establish a clear connection between the microscopic spin network dynamics and macroscopic gravitational phenomena, providing a crucial step towards a complete theory of quantum gravity.`,
  [PaperSection.METHODS]: `Our analysis is founded on the spin foam formalism of Loop Quantum Gravity. We define the transition amplitude between initial and final spin network states, |ψ_i⟩ and |ψ_f⟩, via a path integral over all possible 2-complexes (spin foams) bounded by these networks. The amplitude Z is given by Z = ∑_σ w(σ) A(σ), where the sum is over all spin foams σ, w(σ) is a weighting factor, and A(σ) is the amplitude for a single foam. The amplitude A(σ) is constructed locally, assigning a vertex amplitude A_v to each vertex of the foam, derived from the Recoupling theory of SU(2). To regularize the path integral, we employ the Engle-Pereira-Rovelli-Livine (EPRL) model. The semi-classical analysis is performed using coherent spin network states, which are peaked on classical geometries. We introduce a coarse-graining operator that averages the Hamiltonian constraint over a large number of vertices, and we compute its expectation value in these coherent states. The calculation relies heavily on numerical tensor network contraction algorithms, implemented using a custom Python library leveraging Pydantic for data validation and LangChain for orchestrating computational graphs with our Cerebras CS-2 system.`,
  [PaperSection.RESULTS]: `The expectation value of the coarse-grained Hamiltonian constraint operator, ⟨Ĉ⟩, was computed for coherent states peaked on a flat Friedmann-Lemaître-Robertson-Walker (FLRW) metric. Our primary result, shown in Figure 1, is that in the limit of large spin representations j and a large number of vertices N, the operator expectation value converges to the classical Friedmann equation: ⟨Ĉ⟩ ≈ (ȧ/a)² - (8πG/3)ρ = 0. The leading term scales correctly with the Planck length, and the quantum corrections are suppressed by a factor of 1/j. The numerical simulations, performed on the Cerebras cluster, show a power-law convergence to the classical result with an exponent of -1.02 ± 0.05, consistent with theoretical predictions. Furthermore, we analyzed the variance of the constraint operator, finding it to be sharply peaked around zero, indicating that the coherent states are excellent approximations of the physical vacuum. This demonstrates that the quantum dynamics of spin networks, when appropriately coarse-grained, reproduce the classical cosmological evolution of the universe.`,
  [PaperSection.CONCLUSION]: `We have demonstrated that the dynamics of Loop Quantum Gravity, as described by the EPRL spin foam model, possess a valid semi-classical limit consistent with classical general relativity for a homogeneous, isotropic universe. By calculating the expectation value of the Hamiltonian constraint in a coherent state basis, we successfully derived the Friedmann equation from the fundamental quantum dynamics. This result provides strong evidence that LQG can explain the emergence of the smooth spacetime of classical cosmology from a discrete quantum structure. Key limitations of this work include the restriction to a specific cosmological model and the use of coherent states which may not represent all physical scenarios. Future work will involve extending this analysis to include inhomogeneities, which could provide a quantum-gravitational origin for the cosmic microwave background fluctuations. Furthermore, investigating the role of entanglement between spatial partitions within this framework could offer deeper insights into the thermodynamic properties of spacetime, bridging the gap between quantum gravity and black hole thermodynamics.`,
  [PaperSection.FIGURES]: `Figure 1: Log-log plot of the deviation of the coarse-grained Hamiltonian constraint expectation value |⟨Ĉ⟩| from zero as a function of the number of vertices N in the spin foam. Data is shown for average spin j=10 (blue circles), j=20 (green squares), and j=50 (red triangles). The solid lines represent a power-law fit, yielding an exponent of approximately -1, demonstrating convergence to the classical constraint. The inset shows the probability distribution of Ĉ for N=10^5 and j=50, which is sharply peaked around zero, confirming the semi-classical nature of the state. All numerical calculations were performed on a Cerebras Wafer-Scale Engine, enabling simulation of spin networks with up to 10^6 vertices.`
};