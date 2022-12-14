Feature: Boost Creation
  As a customer
  I want to be able to interact boosts

  Scenario: should allow the user to make a valid cash newsfeed boost
    Given I am logged in
    And I am on the newsfeed
    And I create a post with text storage key "cash_newsfeed_boost"
    When I open the boost modal for the activity with storage key "cash_newsfeed_boost"
    And I select boost audience "safe"
    And I click the next button
    And I set a daily budget of "10"
    And I set a duration of "5" days
    And I click the next button
    And I see the review panel audience is "safe"
    And I see the review panel budget and duration is "$10 per day for 5 days"
    And I see a card is selected
    And I see my total is "$50.00"
    And I click to submit boost
    Then I should see an "success" toaster saying "Success! Your boost request is being processed."
    # And I can revoke a newsfeed boost

  Scenario: should allow the user to make a valid controversial tokens newsfeed boost
    Given I am logged in
    And I am on the newsfeed
    And I create a post with text storage key "token_newsfeed_boost"
    When I open the boost modal for the activity with storage key "token_newsfeed_boost"
    And I select boost audience "controversial"
    And I click the next button
    And I navigate to the "tokens" tab
    And I set a daily budget of "10"
    And I set a duration of "5" days
    And I click the next button
    And I see the review panel audience is "controversial"
    And I see the review panel budget and duration is "10 tokens per day for 5 days"
    And I see offchain tokens are selected
    And I see my total is "50 tokens"
    And I click to submit boost
    Then I should see an "success" toaster saying "Success! Your boost request is being processed."
    # And I can revoke a newsfeed boost

  Scenario: should allow the user to revoke a valid tokens channel boost
    Given I am logged in
    When I am on my channel page
    And I open my channel boost modal
    And I select boost audience "safe"
    And I click the next button
    And I set a daily budget of "10"
    And I set a duration of "5" days
    And I click the next button
    And I see the review panel audience is "safe"
    And I see the review panel budget and duration is "$10 per day for 5 days"
    And I see a card is selected
    And I see my total is "$50.00"
    And I click to submit boost
    Then I should see an "success" toaster saying "Success! Your boost request is being processed."

  Scenario: should allow the user to make a valid tokens channel boost
    Given I am logged in
    When I am on my channel page
    And I open my channel boost modal
    And I select boost audience "safe"
    And I click the next button
    And I navigate to the "tokens" tab
    And I set a daily budget of "10"
    And I set a duration of "5" days
    And I click the next button
    And I see the review panel audience is "safe"
    And I see the review panel budget and duration is "10 tokens per day for 5 days"
    And I see offchain tokens are selected
    And I see my total is "50 tokens"
    And I click to submit boost
    Then I should see an "success" toaster saying "Success! Your boost request is being processed."
    # And I can revoke a newsfeed boost
