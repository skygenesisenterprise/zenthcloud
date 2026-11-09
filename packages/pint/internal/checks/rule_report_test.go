package checks_test

import (
	"testing"

	"github.com/zenthcloud/pint/internal/checks"
	"github.com/zenthcloud/pint/internal/promapi"
)

func TestReportCheck(t *testing.T) {
	testCases := []checkTest{
		{
			description: "report passed problem / warning",
			content:     "- alert: foo\n  expr: sum(foo)\n  annotations:\n    alert: foo\n",
			checker: func(_ *promapi.FailoverGroup) checks.RuleChecker {
				return checks.NewReportCheck("problem reported", checks.Warning)
			},
			prometheus: noProm,
			problems:   true,
		},
		{
			description: "report passed problem / info",
			content:     "- record: foo\n  expr: sum(foo)\n",
			checker: func(_ *promapi.FailoverGroup) checks.RuleChecker {
				return checks.NewReportCheck("problem reported", checks.Information)
			},
			prometheus: noProm,
			problems:   true,
		},
	}
	runTests(t, testCases)
}
