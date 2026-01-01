---
title: When 1 + 1 > 2
date: 2025-12-31
---



Through starting and running [Greptile](https://greptile.com), I have observed a team that produced a superlinear amount of output compared to a scaled version of myself. Unfortunately, I have also observed the contrary, where some teams produce a sublinear amount of output compared to a scaled version of any single member in the team. The reason why such phenomena occurs is a central problem in organizational management. Based on what I have observed and read about different organizations, I propose a simple model of team output in terms of member affinity, productivity, attention allocation, and multi-agent penalties.

## Member Affinity

The affinity score is simple, it is attributing a skill level (affinity metric) with respect to some domain of expertise to an individual. To help understand this in somewhat concrete terms, we say some vector $\mathbf S$  contains the skill levels for the set of all possible skills $S$[^1]. So for example my vector may look like:

$$
\mathbf S^{soohoon} = \begin{bmatrix} s_{programming} \\ s_{internet \text{ } culture} \\ \vdots \\ s_{juggling} \\ \vdots \end{bmatrix} = \begin{bmatrix} 0.82 \\ 0.97 \\ \vdots \\ 0.01  \\ \vdots \end{bmatrix}
$$

where each entry in $\mathbf S^{person}_i \in [0, 1]$ for each skill $i \in S$.

Affinity probably is a product of talent and experience, however for this model it isn't too important to define how exactly one achieves such level of affinity. I am claiming that there is some qualitative (albeit vague) value of skill that we can attribute to someone. I don't think this would be too controversial.

## Tasks

I will try and define what task and productivity is to help us understand what we mean by output. Let $P_{current}$ be the current state of the world and $P_{goal}$ be the goal state we want to achieve, then we define task $\mathbf{T}$ to be the displacement required to go from the current state to the goal state.

Building off our analogy, a task is a vector (in the skill space) where each component represents how much of some skill is required:

$$
\mathbf{T} = \begin{bmatrix} t_{programming} \\ t_{design} \\ \vdots \\ t_{juggling} \\ \vdots \end{bmatrix} = \begin{bmatrix} 0.8 \\ 0.3 \\ \vdots \\ 0.0 \\ \vdots \end{bmatrix}
$$

Some nice benefits of this is that magnitude $\|\mathbf{T}\|$ captures the total difficulty of the task, while the direction encodes the particular mix of skills required to complete it. We can also treat a task as the sum of multiple sub task, it isn't hard to see that a task can decompose in such way.

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

This maps quite nicely to the definition of work in mechanics, output is the integral over the product of productivity (power) and time.  A task is "complete" when cumulative output equals $\|\mathbf{T}\|$. This model captures the intuition that those who are more "skilled" and more efficient generate more output.

## Organizational Dynamics

Until now we were treating output for some task with regards to one individual, now we try and model what happens when those individuals start working together. The primary intent of modelling team output in the first place is because in the real world we observe that a team either gets more, the same, or less amount of work done compared to naively increasing the amount of productivity of one individual to match the number of members on the team (NOTE badly worded but will be explained when attention is finite and why working in a team scales differently than just doing this attention * number of team mates). This suggests that there is some hidden relationship between different member's productivity and the final team output.

We can naively introduce an efficiency parameter that can act as a positive or negative multiple to the combination of each member relationship, however this isn't clean or intuitive and it doesn't really capture *why* this parameter exists or why it behaves to produce such different results. I believe the most important variables in team dynamics is how one allocates attention + how one navigates the decentralization penalty.

## Attention Allocation

The key insight is how attention reallocation changes individual productivity. When working alone on a task, you must divide attention across all required skills *even those where your affinity is low*. Your effective productivity is a blended rate, dragged down any gaps in skill that is required for the end task.

We can rewrite the productivity model of the individual as the weighted average of the person's skills:

$$
\pi^M(\tau) = \sum_{i} \frac {t_i} {\| \mathbf T \|} \cdot s_i^M \cdot e (\tau)
$$

where each skill contributes proportionally to how much the task demands it. If a task is 50% programming and 50% sales, and you're great at programming but terrible at sales, that 50% drags you down.

In a complementary team, attention gets reallocated. Each member focuses on skills where their affinity is high, and tasks requiring their weak skills get handled by those where it is their strength. With perfect specialization, team productivity approaches:

$$
\pi^{team}(\tau) = \sum_{i} \frac{t_i}{\|\mathbf{T}\|} \cdot \max_{m}(s^m_i) \cdot e (\tau)
$$

where each sub-task is handled by whoever is best at it. This is strictly greater than or equal to the solo case for any non-trivial team.

This is where the super-linearity in team productivity comes from. Two people working alone each produce at their blended rate. Two people working together, with complementary skills can each produce at their peak rate. 1 + 1  > 2 because "1" is not doing what they are best at.

This relationship is quite easy to observe in founding teams of startups. The inventor + entrepreneur combination is the established archetype that VCs look for precisely for this reason. When you have a task that requires skill that are rarely found in one person (exceptions of course exist) you want to have two people who are world class in each to complement each other in getting something started. 

This sounds great and naturally upon hearing this the sound thing to do is to identify the skills that are needed for some task and get as many people as possible to maximize each $s_i^m$ together to accomplish said task. However anyone with any operating experience knows that this is not true at all. You can have a large group of extremely smart people and still fail to produce the output of a much smaller team [^4]. The nature of this phenomena, I suspect, is tied to the nature of working with other people.

## Multi-agent Penalty

Working with others is hard. The need for coordination, communication, and aligned incentives can each deteriorate productivity and ultimately output.

### Coordination

Without clear coordination, attention allocation breaks down. You get gaps where no one owns a task, or duplicate work where multiple people unknowingly cover the same ground. Our $\max_m(s_i^m)$ assumes perfect information about who is doing what.

We can model coordination quality with an allocation matrix $\mathbf A$ where $A_{mi}$​ represents how much of member $m$ 's attention is allocated to skill-task $i$. With this the coordination problem reduces to the question of allocating attention. Perfect coordination means doing so to minimize the time necessary to completion​. Clones of yourself would scale attention allocation, thus productivity and output, linearly. Each clone brings another full unit of attention-time, with perfect coordination and no communication overhead. But working with others is different.

Output is bounded by the task, not by productivity. each component $t_i$ needs a certain amount of work, and the task isn't complete until *all* components are done. Coordination failures can show up as:
- _Gaps_  ($\sum_m A_{mi} < 1$): A component is understaffed or unowned. It progresses slower than it could, becoming a bottleneck.
- _Misallocation:_ Attention goes to a non-bottleneck component while the actual bottleneck is understaffed. Speeding up an already-fast component doesn't reduce time to completion.
- _Unintentional duplication:_ Two people work on the same thing without knowing, produce conflicting outputs, then spend extra time reconciling. The work itself is duplicated, not just the attention.

### Communication

Communication is required for coordination, and communication in it of itself is a skill that requires attention. This means that it can detract attention spent on the most optimal use of skill on a task by engaging in it. We can isolate the communication overhead on the productivity of a task as following:

$$
\pi^m (\tau) = \sum_i A_{mi} \cdot s_i^m \cdot e (\tau) \cdot (1 - a_{comm}^m)
$$

where $a_{comm}^m \in [0, 1]$ is the fraction of member $m$ 's attention consumed by communication overhead [^5]. The problem is that $a_{comm}^m$ scales with the number of channels each member must maintain. The general model I often see presented assumes a $O(n^2)$ members to channels relationship from pairwise connections. I'd argue that we must take subgroups of people into consideration as well as they too take on identities and preferences themselves. Now with $n$ people there are $2^n$ possible subgroups, giving up to $O(4^n)$ channels between them. This penalty is _much_ larger than people give it credit for.

### Incentive Alignment

Members within an organization can have (and often do have) misaligned incentives. Someone optimizing for their own promotion or their faction's influence, is not fully contributing to the team's objective. We capture this with an alignment factor $\alpha^m$:

$$
\pi^m (\tau) = \sum_i A_{mi} \cdot s_i^m \cdot e (\tau) \cdot (1 - a_{comm}^m) \cdot \alpha^m
$$

When $\alpha^m = 1$, member $m$ is fully aligned with the team goal. When $\alpha^m < 1$, some fraction of their effort is directed elsewhere.

Misaligned incentives do not just reduce individual productivity — they corrupt the coordination matrix $\mathbf{A}$ itself. This happens in several ways:
- _Empire building:_ A manager claims ownership of tasks ($A_{mi} = 1$) to grow their team's scope, even when their team isn't the best fit. Allocation becomes $\arg\max_m(\text{political power})$ rather than $\arg\max_m(s_i^m)$.
- _Credit seeking:_ Members grab high-visibility tasks regardless of skill fit, leaving less glamorous (but necessary) tasks unowned. You get gaps where $\sum_m A_{mi} < 1$.
- _Blame avoidance:_ People avoid owning risky tasks, or insist on shared ownership to diffuse responsibility. You get gaps for risky work, and duplication with no clear accountability.
- _Turf protection:_ Teams refuse to let others work on "their" area even when those others are more skilled. The allocation matrix becomes sticky and suboptimal.

In pathological cases, $\alpha^m$ can be negative, the person is actively working *against* the team goal:
- _Sabotage:_ Deliberate undermining of team efforts.
- *Toxic dynamics:* Someone whose presence harms others' productivity more than they contribute, effectively reducing teammates' $e$ or $\alpha$.
- *Adversarial decisions:* A misaligned leader who pushes the organization toward goals that harm it — in the limit, this corrupts not just $\mathbf A$ but $\mathbf T$ itself (optimizing for the wrong goal entirely).[^6].

Misaligned incentives and throw a wrench in what is otherwise supposed to be an optimally operating organization. It makes modeling near impossible and is inherently chaotic.

### Levers

The levers to control these penalties are team-task structure and organizational culture. With proper partitioning of tasks and structuring of teams, the coordination problem simplifies. It becomes clearer who with the right skills should be allocated to a task and the number of required communication channels reduces to collaborators and the manager you report to. Good structure is essentially sparsifying the communication graph and making the optimal $\mathbf{A}$ obvious. With the right organizational culture, the overhead per channel drops ($a_{comm}^m$ decreases for fixed channel count) and incentives align naturally ($\alpha^m \to 1$). Shared context means less time spent explaining. Trust means less time spent verifying. Common goals mean less energy lost to politics. The problems in organizational management all trace back to the same underlying problem: making people work well together [^7].

## Organizational Output

Putting it all together, team productivity is:

$$
\pi^{team}(\tau) = \sum_i \frac{t_i}{\|\mathbf{T}\|} \cdot \sum_m A_{mi} \cdot s_i^m \cdot e(\tau) \cdot (1 - a_{comm}^m) \cdot \alpha^m
$$

Team output is the integral of productivity over time, bounded by the task [^8] :

$$
Output^{team} = \int \pi^{team} (\tau) d\tau
$$

A task is complete when cumulative output equals $\|\mathbf{T}\|$. Time to completion is:

$$
\tau_{complete} = \text{time when } \int_0^{\tau} \pi^{team} (\tau) d\tau' = \|\mathbf{T}\|
$$

Time and attention can be wasted here by consuming everyone's finite attention-time but not reducing $\tau_{complete}$ proportionally.

The job is to maximize $Output^{team}$ and  minimize $\tau_{complete}$. 

---

[^1]: This set of all skills $S$ is arbitrary for now but any task that an individual can exert effort into to produce an outcome should be a valid entry.

[^2]: Another note on skills, they are not static. Working on a task builds relevant skills over time, so $\mathbf{S}^M$ is really $\mathbf{S}^M(\tau)$. This makes modeling incredibly difficult (which I definitely lack the skill for, at the time of writing this at least heh), but for now we will treat skills as approximately fixed over the duration of a single task.

[^3]: This $e$ parameter is lazy but your efficiency on 8 hours of sleep vs after an all nighter is too big to ignore.

[^4]: Why startups stand a chance against big companies

[^5]: One could argues that communication should be a considered a necessary skill for getting a task done. However in an ideal organism where no communication is needed no such overhead would exist and productivity can be spent else where (yes I watched Pluribus). We isolate communication out to illustrate a point. 

[^6]: This is distinct from low skill ($s_i^m$ small) or high communication overhead ($a_{comm}^m$ large). A person can be highly skilled, low-maintenance, and still net-negative through misalignment.

[^7]: I am not diminishing the difficulty of this problem, it is a quadrillion dollar problem after all.  It is simple to state but difficult to practice. They have a major (multiple actually) for this and stuff I'm pretty sure. 

[^8]: I get it, it's not clean :(

