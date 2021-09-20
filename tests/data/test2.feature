@tag
Feature: Test
    Feature description

    Background: Test
        Given test
        When test
        Then test

    @tag
    Scenario: Test
        Given test
        When test
        Then test

    @tag
    Scenario Outline: Test <n>
        Given test <a>
        When test <b>
        Then test <c>

        @tag
        Examples:
            | a | b | c | n |
            | a | b |  | 1 |