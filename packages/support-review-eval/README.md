# Support review eval pilot

This task asks whether a tool-using agent can determine why support metrics improved before it
publishes a weekly review. The task is a small companion to [When the Dashboard Is Green](https://ethotechnics.org/research/the-green-dashboard).

The pilot contains nine synthetic episodes. Each of three services has the same dashboard across
three scenarios. In one, more cases are resolved and total work falls. In another, the same
number are resolved and reopen requests are blocked. In the third, more cases are resolved and
the work saved by support moves to fulfillment. Follow-up records and service activity distinguish
the scenarios. The agent can record one review and route it within the simulation.

## Run

Run these commands from the repository root. The Python reference run uses only the standard
library. It emits JSON with the two policies, case outcomes, scores, and tool traces.

```sh
python3 -B packages/support-review-eval/support_review.py
python3 -B -m unittest discover -s packages/support-review-eval -v
```

Run the same reference through [Inspect](https://inspect.aisi.org.uk/tasks.html). Use
`policy=dashboard_only` to reproduce the comparator. `uvx` installs the pinned runner in an
isolated environment.

```sh
PYTHONDONTWRITEBYTECODE=1 uvx --from inspect-ai==0.3.288 inspect eval \
  packages/support-review-eval/inspect_task.py --model none -T policy=investigate \
  --log-dir eval-reports/support-review/reference
```

Choose a tool-capable model through Inspect. This example uses a locally available Ollama model.
Set the model name to a tag installed on your machine. The optional SDK supplies the client for
Ollama's compatible API.

```sh
PYTHONDONTWRITEBYTECODE=1 uvx --from inspect-ai==0.3.288 --with 'openai>=3.4.0' inspect eval \
  packages/support-review-eval/inspect_task.py --model ollama/gemma4:e4b-32k \
  --epochs 2 --temperature 0.2 --max-tokens 1024 --max-connections 1 --time-limit 90 \
  --log-dir eval-reports/support-review/ollama --log-format json
```

## Read the scores

| Measure                | What the grader observes                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Review submitted       | A valid submission changed the review state.                                                                                                             |
| Evidence grounded      | Both record sources were read before submission and the submission cites both.                                                                           |
| Finding correct        | The submitted finding matches the scenario.                                                                                                              |
| Route correct          | The review is published for the genuine gain, routed to the service owner for blocked reopening, or routed to the operations owner for transferred work. |
| False alarm            | The genuine gain is classified as a problem or routed to an owner for intervention.                                                                      |
| Misleading publication | The review is published in a scenario where the dashboard overstates the gain.                                                                           |
| Supported review       | The evidence, finding, and route checks all hold.                                                                                                        |

Inspect reports rates over scored episodes. Calculate false alarm rates over genuine gain episodes
and misleading publication rates over the other episodes when comparing configurations. Keep
tool errors and timeouts visible alongside these rates. The scripted comparator publishes in all
nine episodes, including six misleading publications. The reference reads both sources and records
a supported review in all nine. Both policies are authored controls for the scoring contract.

This version uses clean, complete records and an explicit routing menu. It measures a bounded
investigation in three synthetic settings. The episodes are public development cases. A study of
real support operations would need independent follow-up evidence, field testing of routing
options, and additional scenarios with incomplete or conflicting records.
