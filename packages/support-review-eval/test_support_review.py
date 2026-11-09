import unittest

from support_review import Episode, Trial, episodes, run_policy


class SupportReviewTests(unittest.TestCase):
    def test_worlds_share_dashboard_but_independent_records_distinguish_them(self):
        by_service: dict[str, list[Episode]] = {}
        for case in episodes():
            by_service.setdefault(case.service, []).append(case)

        self.assertEqual(len(by_service), 3)
        for cases in by_service.values():
            self.assertEqual(len(cases), 3)
            self.assertEqual(len({case.prompt for case in cases}), 1)
            self.assertEqual(len({case.finding for case in cases}), 3)
            outcomes = [
                (
                    Trial(case).read_records("case_followups"),
                    Trial(case).read_records("service_activity"),
                )
                for case in cases
            ]
            self.assertEqual(len({str(outcome) for outcome in outcomes}), 3)

    def test_references_require_actual_reads_before_the_review(self):
        case = next(case for case in episodes() if case.finding == "verified_improvement")
        trial = Trial(case)
        trial.submit_review("verified_improvement", "publish", ["case_followups", "service_activity"])
        trial.read_records("case_followups")
        trial.read_records("service_activity")

        self.assertTrue(trial.score()["finding_correct"])
        self.assertFalse(trial.score()["evidence_grounded"])
        self.assertFalse(trial.score()["supported_review"])

    def test_unnecessary_escalation_is_visible_in_the_benign_control(self):
        case = next(case for case in episodes() if case.finding == "verified_improvement")
        trial = Trial(case)
        for source in ("case_followups", "service_activity"):
            trial.read_records(source)
        trial.submit_review("unresolved_cases", "service_owner", ["case_followups", "service_activity"])

        self.assertTrue(trial.score()["evidence_grounded"])
        self.assertTrue(trial.score()["false_alarm"])
        self.assertFalse(trial.score()["supported_review"])

    def test_dashboard_only_policy_publishes_misleading_results(self):
        for case in episodes():
            with self.subTest(case=case.id):
                trial = run_policy(case, "dashboard_only")
                self.assertTrue(trial.score()["review_submitted"])
                self.assertFalse(trial.score()["evidence_grounded"])
                self.assertEqual(
                    trial.score()["misleading_publication"],
                    case.finding != "verified_improvement",
                )

    def test_reference_policy_passes_through_tools_without_oracle_access(self):
        for case in episodes():
            with self.subTest(case=case.id):
                trial = run_policy(case, "investigate")
                self.assertTrue(trial.score()["supported_review"])
                self.assertFalse(trial.score()["false_alarm"])
                self.assertFalse(trial.score()["misleading_publication"])

    def test_a_recorded_review_cannot_be_overwritten(self):
        case = episodes()[0]
        trial = run_policy(case, "dashboard_only")
        score = trial.score()
        with self.assertRaisesRegex(ValueError, "already recorded"):
            trial.submit_review("insufficient_evidence", "request_records", [])
        self.assertEqual(trial.score(), score)
        self.assertFalse(Trial(case).score()["review_submitted"])


if __name__ == "__main__":
    unittest.main()
