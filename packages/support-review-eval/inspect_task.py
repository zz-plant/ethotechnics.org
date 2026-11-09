"""Inspect entry point for the support review pilot."""

import json

from inspect_ai import Task, task
from inspect_ai.dataset import Sample
from inspect_ai.model import GenerateConfig
from inspect_ai.scorer import Score, Scorer, Target, mean, scorer
from inspect_ai.solver import Generate, Solver, TaskState, generate, solver, use_tools
from inspect_ai.tool import Tool, ToolError, tool
from inspect_ai.util import Store, store

from support_review import (
    VERSION,
    Finding,
    NextStep,
    Policy,
    Source,
    Trial,
    apply_policy,
    episodes,
)

CASES = {case.id: case for case in episodes()}


def trial_from_store(state: Store) -> Trial:
    return Trial(CASES[state.get("case_id")], list(state.get("trace", [])))


@solver
def open_review() -> Solver:
    async def solve(state: TaskState, generate: Generate) -> TaskState:
        state.store.set("case_id", state.sample_id)
        return state

    return solve


@tool
def read_records() -> Tool:
    async def execute(source: Source) -> str:
        """Read weekly records from a source.

        Args:
            source: Case follow-ups or service activity.
        """
        state = store()
        trial = trial_from_store(state)
        try:
            result = trial.read_records(source)
        except ValueError as error:
            raise ToolError(str(error)) from error
        state.set("trace", trial.trace)
        return json.dumps(result)

    return execute


@tool
def submit_review() -> Tool:
    async def execute(finding: Finding, next_step: NextStep, evidence: list[str]) -> str:
        """Record one final review for this week.

        Args:
            finding: What the dashboard and supporting records establish.
            next_step: Publish, route to the service owner or operations owner, or request records.
            evidence: References returned by the records tool.
        """
        state = store()
        trial = trial_from_store(state)
        try:
            result = trial.submit_review(finding, next_step, evidence)
        except ValueError as error:
            raise ToolError(str(error)) from error
        state.set("trace", trial.trace)
        return json.dumps({"recorded": True, **result})

    return execute


@solver
def scripted_review(policy: Policy) -> Solver:
    async def solve(state: TaskState, generate: Generate) -> TaskState:
        trial = trial_from_store(state.store)
        apply_policy(trial, policy)
        state.store.set("trace", trial.trace)
        return state

    return solve


@scorer(metrics={"*": [mean()]})
def review_outcome() -> Scorer:
    async def score(state: TaskState, target: Target) -> Score:
        trial = trial_from_store(state.store)
        return Score(
            value={key: int(result) for key, result in trial.score().items()},
            answer=json.dumps(trial.review),
            explanation=f"Fixture outcome: {trial.episode.finding}.",
        )

    return score


@task
def support_review(policy: str = "agent") -> Task:
    if policy == "agent":
        run = [use_tools(read_records(), submit_review()), generate()]
    elif policy in ("dashboard_only", "investigate"):
        run = [scripted_review(policy)]
    else:
        raise ValueError("Policy must be agent, dashboard_only, or investigate.")

    return Task(
        dataset=[Sample(id=case.id, input=case.prompt) for case in CASES.values()],
        setup=open_review(),
        solver=run,
        scorer=review_outcome(),
        config=GenerateConfig(parallel_tool_calls=False),
        message_limit=24,
        version=VERSION,
        metadata={"environment": "synthetic", "policy": policy},
    )
