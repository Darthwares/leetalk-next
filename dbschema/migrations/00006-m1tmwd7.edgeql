CREATE MIGRATION m1tmwd7j7yj5ey5cd7wjy46pi5oci7fgq7df7unsxckeqyoglfvy4q
    ONTO m1fyzdod5oox5au44mb65e6lcxi763hhw3yowc525ow7mwqqimusba
{
  ALTER TYPE default::Messages {
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
  };
  ALTER TYPE default::Messages {
      DROP PROPERTY timestamps;
  };
  ALTER TYPE default::Users {
      ALTER PROPERTY registered_at {
          SET default := (std::datetime_current());
          RESET OPTIONALITY;
          SET TYPE std::datetime USING (<std::datetime>.registered_at);
      };
  };
};
