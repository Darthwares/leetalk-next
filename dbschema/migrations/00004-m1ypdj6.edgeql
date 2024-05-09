CREATE MIGRATION m1ypdj65ig33uk7khynzevvj6wiyuezovv3esj7yxogye7czbzkqcq
    ONTO m1bob2xn2yaspym2niswg7wecwehchuoblv4bsvbni5rgmlfedycuq
{
  ALTER TYPE default::Conversations {
      ALTER PROPERTY created_at {
          SET default := (std::datetime_current());
          SET TYPE std::datetime USING (<std::datetime>.created_at);
      };
  };
};
