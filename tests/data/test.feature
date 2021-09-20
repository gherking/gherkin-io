Feature: Test
    Feature description

    @test
    Rule: Test
        Background: Test
            Given test
            When test
            Then test

        Scenario: Test
            Given test
            When test
            Then test

        Scenario Outline: Test <n>
            Given test <a>
            When test <b>
            Then test <c>

            Examples:
                | a | b | c | n |
                | a | b | c | 1 |