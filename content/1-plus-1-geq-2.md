---
title: When 1 + 1 > 2
date: 2025-12-31
---



Through running [Greptile](https://greptile.com), I have observed a team that produced a superlinear amount of output far exceeding what I think I could have done by cloning myself. Unfortunately, I have also observed the contrary, where some teams produce a sublinear amount of output compared to the scaled productivity of any single member in the team. The reason why such phenomena occur is a central problem in organizational management. After trying to read more on why this happens, I couldn't help but be disappointed by the lack of systematic explanations to something that is seemingly very much systemic in nature. So based on what I have observed and read about different organizations, I propose a simple model of team output in terms of member affinity, productivity, attention allocation, and multi-agent penalties.

## Member Affinity

The affinity score is simple: it attributes a skill level (affinity metric) with respect to some domain of expertise to an individual. To help understand this in somewhat concrete terms, we say some vector $\mathbf S$ contains the skill levels for the set of all possible skills $S$[^1]. So, for example, my vector may look like:

$$
\mathbf S^{soohoon} = \begin{bmatrix} s_{programming} \\ s_{internet \text{ } culture} \\ \vdots \\ s_{juggling} \\ \vdots \end{bmatrix} = \begin{bmatrix} 0.82 \\ 0.97 \\ \vdots \\ 0.01  \\ \vdots \end{bmatrix}
$$

where each entry in $\mathbf S^{person}_i \in [0, 1]$ for each skill $i \in S$.

Affinity is probably a product of talent and experience; however, for this model it isn't too important to define how exactly one achieves such a level of affinity. I am claiming that there is some qualitative (albeit vague) value of skill that we can attribute to someone. I don't think this would be too controversial.

## Tasks

I will try to define what task and productivity are to help us understand what we mean by output. Let $P_{current}$ be the current state of the world and $P_{goal}$ be the goal state we want to achieve, then we define task $\mathbf{T}$ to be the displacement required to go from the current state to the goal state.

Building off our analogy, a task is a vector (in the skill space) where each component represents how much of some skill is required:

$$
\mathbf{T} = \begin{bmatrix} t_{programming} \\ t_{design} \\ \vdots \\ t_{juggling} \\ \vdots \end{bmatrix} = \begin{bmatrix} 0.8 \\ 0.3 \\ \vdots \\ 0.0 \\ \vdots \end{bmatrix}
$$

Some nice benefits of this are that magnitude $\|\mathbf{T}\|$ captures the total difficulty of the task, while the direction encodes the particular mix of skills required to complete it. We can also treat a task as the sum of multiple subtasks; it isn't hard to see that a task can decompose in such a way.

## Productivity

When thinking about productivity, I want to capture the following things: that it is finite and that there is variance. We can think of productivity as allocating our time and attention toward completing some task. Define the productivity of an individual $M$ on task $\mathbf{T}$ as:

$$
\pi^M(\tau) = (\mathbf{S}^M \cdot \hat{\mathbf{T}}) \cdot e(\tau)
$$

where $\hat{\mathbf{T}}$ is the unit vector in the task direction and $e(\tau) \in [0, 1]$ is an efficiency parameter capturing things like flow states and interruptions at some unit of time [^2][^3]. Productivity is essentially how much of your skill vector projects onto what the task demands. 

## Output

We then define output as the integral of productivity over time:

$$
Output^M= \int \pi^M(\tau) d\tau
$$

This maps quite nicely to the definition of work in mechanics; output is the integral over the product of productivity (power) and time. A task is "complete" when cumulative output equals $\|\mathbf{T}\|$. This model captures the intuition that those who are more "skilled" and more efficient generate more output.

## Organizational Dynamics

Until now we were treating output for some task with regard to one individual. Now we try to model what happens when those individuals start working together. The primary intent of modelling team output in the first place is because in the real world we observe that a team either gets more, the same, or less amount of work done compared to just scaling the amount of productivity of one individual by the number of members on the team. This suggests that there is some hidden relationship between different members' productivity and the final team output.

We can naively introduce an efficiency parameter that can act as a positive or negative multiple to the combination of each member relationship, however this isn't very intuitive and it doesn't really capture *why* this parameter exists or why it behaves to produce such different results. I believe the most important variables in team dynamics are how one allocates attention + how one navigates the decentralization penalty.

## Attention Allocation

The key insight is how attention reallocation changes individual productivity. When working alone on a task, you must divide attention across all required skills, *even those where your affinity is low*. Your effective productivity is a blended rate, dragged down by any gaps in skills that are required for the end task.

We can rewrite the productivity model of the individual as the weighted average of the person's skills:

$$
\pi^M(\tau) = \sum_{i} \frac {t_i} {\| \mathbf T \|} \cdot s_i^M \cdot e (\tau)
$$

where each skill contributes proportionally to how much the task demands it. If a task is 50% programming and 50% sales, and you're great at programming but terrible at sales, that 50% drags you down.

In a complementary team, attention gets reallocated. Each member focuses on skills where their affinity is high, and tasks requiring their weak skills get handled by those for whom it is a strength. With perfect specialization, team productivity approaches:

$$
\pi^{team}(\tau) = \sum_{i} \frac{t_i}{\|\mathbf{T}\|} \cdot \max_{m}(s^m_i) \cdot e (\tau)
$$

where each sub-task is handled by whoever is best at it. This is strictly greater than or equal to the solo case for any non-trivial team.

This is where the super-linearity in team productivity comes from. Two people working alone each produce at their blended rate. Two people working together with complementary skills can each produce at their peak rate. 1 + 1 > 2 because "1" is not doing what they are best at.

This relationship is quite easy to observe in founding teams of startups. The inventor + entrepreneur combination is the [established archetype that VCs look for](https://www.youtube.com/shorts/W0u0J99wTgw) precisely for this reason. When you have a task that requires skills that are rarely found in one person,[^4] you want to have two people who are world class in each to complement each other in getting something started. 

This sounds great and naturally upon hearing this, the sensible thing to do is to identify the skills that are needed for some task and get as many people as possible to maximize each $s_i^m$ together to accomplish said task. However, anyone with any operating experience knows that this is not true at all. You can have a large group of extremely smart people and still fail to produce the output of a much smaller team [^5]. The nature of this phenomenon, I suspect, is tied to the nature of working with other people.

## Multi-agent Penalty

Working with others is hard. The need for coordination, communication, and aligned incentives can all deteriorate productivity and ultimately output.

### Coordination

Without clear coordination, attention allocation breaks down. You get gaps where no one owns a task, or duplicate work where multiple people unknowingly cover the same ground. Our $\max_m(s_i^m)$ assumes perfect information and allocation of attention. We can model coordination quality with an allocation matrix $\mathbf A$ where $A_{mi}$​ represents how much of member $m$ 's attention is allocated to skill-task $i$. With this, the coordination problem reduces to the question of allocating attention. The theoretical optimum is:

$$
\pi^{team} = \sum_i \frac{t_i}{\|\mathbf{T}\|} \cdot \max_m(s_i^m) \cdot e(\tau)
$$

But what the allocation matrix $\mathbf{A}$ actually gives us is:

$$
\pi^{team} = \sum_i \frac{t_i}{\|\mathbf{T}\|} \cdot \sum_m A_{mi} \cdot s_i^m \cdot e(\tau)
$$

The gap between these is the coordination loss. We can define the optimal allocation as:

$$
A^*_{mi} = 1 \text{ if } m = \arg\max_m(s_i^m), \text{ else } 0
$$

This is the "perfect coordination" case where the best person for each skill handles it entirely. Coordination quality is then measured by how far actual allocation $\mathbf{A}$ deviates from optimal $\mathbf{A}^*$. Clones of yourself would achieve this trivially since each clone has identical $\mathbf{S}^m$, making the $\arg\max$ irrelevant. But working with others is different, you need to first discover who has $\max_m(s_i^m)$ for each skill, and then actually implement that allocation [^6].

Coordination failures manifest as:
- _Suboptimal assignment:_ Attention going to $m \neq \arg\max_m(s_i^m)$. If Alice ($s_{programming} = 0.9$) and Bob ($s_{programming} = 0.5$) are both programming, potential is wasted.
- _Gaps:_ $\sum_m A_{mi} = 0$ for some needed skill $i$. A component is unowned and becomes a bottleneck.
- _Information asymmetry:_ Not knowing who has $\max_m(s_i^m)$ in the first place, making optimal allocation impossible to compute. 

### Communication

Communication is required for coordination, and communication in and of itself is a skill that requires attention. This means that it can detract from attention spent on the optimal use of skill on a task. We can isolate the communication overhead on productivity as follows:

$$
\pi^m (\tau) = \sum_i A_{mi} \cdot s_i^m \cdot e (\tau) \cdot (1 - a_{comm}^m)
$$

where $a_{comm}^m \in [0, 1]$ is the fraction of member $m$ 's attention consumed by communication overhead [^7]. The problem is that $a_{comm}^m$ scales with the number of channels each member must maintain. The general model I often see presented assumes a $O(n^2)$ members to channels relationship from pairwise connections. I'd argue that we must take subgroups of people into consideration as well, since they too take on identities and preferences themselves. Now with $n$ people there are $2^n$ possible subgroups, giving up to $O(4^n)$ channels between them. This penalty is _much_ larger than people give it credit for.

### Incentive Alignment

Members within an organization can have (and often do have) misaligned incentives. Someone optimizing for their own promotion or their faction's influence, is not fully contributing to the team's objective. We capture this with an alignment factor $\alpha^m$:

$$
\pi^m (\tau) = \sum_i A_{mi} \cdot s_i^m \cdot e (\tau) \cdot (1 - a_{comm}^m) \cdot \alpha^m
$$

When $\alpha^m = 1$, member $m$ is fully aligned with the team goal. When $\alpha^m < 1$, some fraction of their effort is directed elsewhere.

Misaligned incentives do not just reduce individual productivity, they corrupt the coordination matrix $\mathbf{A}$ itself. This happens in several ways:
- _Empire building:_ A manager claims ownership of tasks ($A_{mi} = 1$) to grow their team's scope, even when their team isn't the best fit. Allocation becomes $\arg\max_m(\text{political power})$ rather than $\arg\max_m(s_i^m)$.
- _Credit seeking:_ Members grab high-visibility tasks regardless of skill fit, leaving less glamorous (but necessary) tasks unowned. You get gaps where $\sum_m A_{mi} < 1$.
- _Blame avoidance:_ People avoid owning risky tasks, or insist on shared ownership to diffuse responsibility. You get gaps for risky work, and duplication with no clear accountability.
- _Turf protection:_ Teams refuse to let others work on "their" area even when those others are more skilled. The allocation matrix becomes sticky and suboptimal.

In pathological cases, $\alpha^m$ can be negative, the person is actively working *against* the team goal:
- _Sabotage:_ Deliberate undermining of team efforts.
- *Toxic dynamics:* Someone whose presence harms others' productivity more than they contribute, effectively reducing teammates' $e$ or $\alpha$.
- *Adversarial decisions:* A misaligned leader who pushes the organization toward goals that harm it, in the limit, this corrupts not just $\mathbf A$ but $\mathbf T$ itself (optimizing for the wrong goal entirely)[^8].

Misaligned incentives throw a wrench in what is otherwise supposed to be an optimally operating organization. It makes modeling near impossible and is inherently chaotic.

### Levers

I won't dive into much detail on how to address these issues,[^9] but as far as I can tell the levers to control these penalties seem to be understanding of team and task, the structuring of teams and tasks, and organizational culture.

Understanding the team and the task is the first step of properly allocating attention. Computing $\mathbf{A}^*$ requires knowing everyone's skill vectors $\mathbf{S}^m$ and knowing what skills are required for the task $\mathbf{T}$ in the first place.

Good structure simplifies the coordination problem. With proper partitioning of tasks and structuring of teams, it becomes clearer who with the right skills should be allocated to a task and the number of required communication channels reduces to collaborators and the manager you report to. This is essentially sparsifying the communication graph.

Finally, shared culture reduces the need for communication and coordination. If people are on the same page on more things, the overhead per channel drops ($a_{comm}^m$ decreases for fixed channel count) and incentives align naturally ($\alpha^m \to 1$). Shared context means less time spent explaining. Trust means less time spent verifying. Common goals mean less energy lost to politics. Culture also makes the manager's information problem easier, people are more transparent about their actual capabilities when they trust the system.

## Organizational Output

Putting it all together, team productivity is:

$$
\pi^{team}(\tau) = \sum_i \frac{t_i}{\|\mathbf{T}\|} \cdot \sum_m A_{mi} \cdot s_i^m \cdot e(\tau) \cdot (1 - a_{comm}^m) \cdot \alpha^m
$$

Team output is the integral of productivity over time, bounded by the task[^10]:

$$
Output^{team} = \int \pi^{team} (\tau) d\tau
$$

A task is complete when cumulative output equals $\|\mathbf{T}\|$. Time to completion is:

$$
\tau_{complete} = \text{time when } \int_0^{\tau} \pi^{team} (\tau) d\tau' = \|\mathbf{T}\|
$$

Time and attention can be wasted here by consuming everyone's finite attention-time but not reducing $\tau_{complete}$ proportionally.

The job is to maximize $Output^{team}$ and minimize $\tau_{complete}$. 

---

[^1]: This set of all skills $S$ is arbitrary for now but any task that an individual can exert effort to produce an outcome should be a valid entry.

[^2]: Another note on skills, they are not static. Working on a task builds relevant skills over time, so $\mathbf{S}^M$ is really $\mathbf{S}^M(\tau)$. This makes modeling incredibly difficult (which I definitely lack the skill for, at the time of writing this at least heh), but for now we will treat skills as approximately fixed over the duration of a single task.

[^3]: This $e(\tau)$ parameter is doing a lot of work (adds the temporal dimension to productivity). I lumped it in with the efficiency for simplicity but they really should be different things.

[^4]: Of course exceptions do exist.

[^5]: Why startups stand a chance against big companies

[^6]: There also is the case where one person is the best at multiple skills, in which case they should be the ones attending to all of them. But since attention is finite for a person at some unit of time, the optimal thing to do would be to assign the next available person with the next best skills for the other tasks and so on.

[^7]: One could argue that communication should be considered a necessary skill for getting a task done. However in an ideal organism where no communication is needed no such overhead would exist and productivity can be spent elsewhere (yes I watched Pluribus). We isolate communication out to illustrate a point.

[^8]: This is distinct from low skill ($s_i^m$ small) or high communication overhead ($a_{comm}^m$ large). A person can be highly skilled, low-maintenance, and still net-negative through misalignment.

[^9]: I'm not qualified yet, nor do I want to be preachy.

[^10]: I get it, it's not clean :(