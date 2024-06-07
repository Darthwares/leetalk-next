CREATE MIGRATION m12cdllphjqcwlmegkqaezqvjiagdwp6ko452ss2bkjbj3pptseafq
    ONTO m1blw4y6zrqfdiodwuiux2yiofcggkgymswzpfivpwrhrc7vwkekvq
{
  ALTER TYPE default::Conversations {
      ALTER PROPERTY viewCount {
          SET default := 0;
      };
  };
};
