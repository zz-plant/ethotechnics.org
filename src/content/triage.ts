/**
 * The triage grid's labels and the first move for each failure. The index
 * promised "Answer the person" and "Find who can halt it" on its badges, and
 * every failure page then opened with the same "Assign the accountable owner
 * now." Both read from here, so the page starts with the move its badge names.
 */
export const failureChoiceLabels: Record<string, string> = {
  "decision-appealed": "Decision appealed",
  "model-wrong": "Model made a harmful error",
  "queue-stuck": "Appeals or reviews are stuck",
  "user-harmed": "A user was harmed",
  "no-owner": "No owner is assigned",
  "cant-explain": "Decision cannot be clearly explained",
  "cant-stop": "System cannot be stopped or rolled back",
};

export const failurePriorityBadges: Record<string, string> = {
  "decision-appealed": "High · Name an owner",
  "model-wrong": "Critical · Contain the error",
  "queue-stuck": "High · Set a deadline",
  "user-harmed": "Critical · Answer the person",
  "no-owner": "High · Assign owner",
  "cant-explain": "Medium · Record the reasons",
  "cant-stop": "Critical · Find who can halt it",
};

export const failureFirstMoves: Record<string, string> = {
  "decision-appealed":
    "Name the person who must answer this appeal, and the date they must answer by.",
  "model-wrong":
    "Contain the error: narrow or pause the decisions it affects, and record who decided.",
  "queue-stuck":
    "Set a date by which each waiting case will be answered, and name who owns the queue.",
  "user-harmed":
    "Answer the person: what happened, what they are owed, and by when.",
  "no-owner":
    "Name one person who can reverse the failure, compensate for it, or close it out.",
  "cant-explain":
    "Record the reasons the decision rested on, as they stand today.",
  "cant-stop":
    "Find who can halt the system, and record what halting it would take.",
};
