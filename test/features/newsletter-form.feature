Feature: Newsletter Form

Scenario: Render a list of posts

  Given network stubs are enabled
  # If the XHR request is triggered immediately after the page
  # was loaded, the mock must be specified before triggering
  # the page load.
  And the endpoint "/posts" returns a `list of posts`
  When I open the `home page`
  Then I expect a `list of posts` to be visible
  And I expect the `first post` `title` to contain the text "First Post"

Scenario: Greet new user

  Given network stubs are enabled
  And time traveling is enabled
  When I open the `home page`
  # If a request is made on user interaction, it is possible to
  # define the XHR mock after the page was already loaded but
  # before the request is triggered.
  Given the endpoint "/users" returns a `new user` when sending data
  When I click the `create user button`
  Then I expect a `user greeting` to be visible
  And I expect the `user greeting` to contain the text "Hello Markus!"
  Given "5" seconds have passed
  Then I expect the `user greeting` to not be present
